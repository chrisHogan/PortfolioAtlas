import { Resend } from 'resend';

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

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    'unknown';

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  const { message: rawMessage, name: rawName, email: rawEmail } = req.body || {};

  const message = stripHtml(rawMessage || '');
  const name = stripHtml(rawName || '');
  const email = stripHtml(rawEmail || '');

  if (!message || message.length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message too long (max 2000 characters)' });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  console.log('[feedback] RESEND_API_KEY present:', !!apiKey, '| length:', apiKey?.length || 0);
  if (!apiKey) {
    console.error('[feedback] RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const resend = new Resend(apiKey);

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
    const result = await resend.emails.send({
      from: 'PortfolioAtlas Feedback <feedback@portfolioatlas.org>',
      to: 'chris@portfolioatlas.org',
      subject,
      html: htmlBody,
      replyTo: email || undefined,
    });

    console.log('[feedback] Resend response:', JSON.stringify(result, null, 2));

    if (result.error) {
      console.error('[feedback] Resend API error:', JSON.stringify(result.error));
      return res.status(500).json({ error: 'Failed to send email' });
    }

    console.log('[feedback] Email sent, id:', result.data?.id);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[feedback] Exception:', err.message || err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
