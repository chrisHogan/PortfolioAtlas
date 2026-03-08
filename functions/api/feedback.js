const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const ipSubmissions = new Map();

function stripHtml(str) {
  return str.replace(/<[^>]*>/g, '').trim();
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = ipSubmissions.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  ipSubmissions.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  ipSubmissions.set(ip, recent);
  return false;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  if (isRateLimited(ip)) {
    return jsonResponse({ error: 'rate_limited' }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  const message = stripHtml(body.message || '');
  const name = stripHtml(body.name || '');
  const email = stripHtml(body.email || '');

  if (!message || message.length === 0) {
    return jsonResponse({ error: 'Message is required' }, 400);
  }

  if (message.length > 2000) {
    return jsonResponse({ error: 'Message too long (max 2000 characters)' }, 400);
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ error: 'Invalid email format' }, 400);
  }

  const apiKey = env.RESEND_API_KEY;
  console.log('[feedback] RESEND_API_KEY present:', !!apiKey, '| length:', apiKey?.length || 0);
  if (!apiKey) {
    console.error('[feedback] RESEND_API_KEY is not set in environment');
    return jsonResponse({ error: 'Server configuration error' }, 500);
  }

  const subject = name ? `Feedback from ${name}` : 'New feedback on PortfolioAtlas';

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px;">
      <h2 style="color: #1a1a2e; margin-bottom: 16px;">New Feedback</h2>
      <div style="background: #f8f7f4; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
        <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
      </div>
      <table style="font-size: 14px; color: #666;">
        ${name ? `<tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Name</td><td>${escapeHtml(name)}</td></tr>` : ''}
        ${email ? `<tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>` : ''}
        <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">IP</td><td>${ip}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Time</td><td>${new Date().toISOString()}</td></tr>
      </table>
    </div>
  `;

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PortfolioAtlas Feedback <feedback@portfolioatlas.org>',
        to: 'chris@portfolioatlas.org',
        subject,
        html: htmlBody,
        reply_to: email || undefined,
      }),
    });

    const result = await resendRes.json();
    console.log('[feedback] Resend status:', resendRes.status, '| response:', JSON.stringify(result));

    if (!resendRes.ok) {
      console.error('[feedback] Resend API error:', resendRes.status, JSON.stringify(result));
      return jsonResponse({ error: 'Failed to send email' }, 500);
    }

    console.log('[feedback] Email sent, id:', result.id);
    return jsonResponse({ success: true });
  } catch (err) {
    console.error('[feedback] Exception:', err.message || err);
    return jsonResponse({ error: 'Failed to send email' }, 500);
  }
}
