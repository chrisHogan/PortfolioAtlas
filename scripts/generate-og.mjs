// Generates public/og-default.png (1200x630) — the social share card.
// Keeps the brand consistent with the site logo (globe + growth line) and the
// brand-blue palette. Run with: node scripts/generate-og.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/og-default.png');

// The logo mark (globe + growth line), white strokes, 24x24 source viewBox.
// Scaled 3x and centered inside the rounded brand square.
const mark = `
  <g transform="translate(558.7,108.7) scale(3.44)">
    <circle cx="12" cy="12" r="8.5" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.55"/>
    <path d="M3.5 12h17" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.55"/>
    <path d="M12 3.5c2.6 2.3 4 5.4 4 8.5s-1.4 6.2-4 8.5c-2.6-2.3-4-5.4-4-8.5s1.4-6.2 4-8.5z" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="0.55"/>
    <path d="M5.8 15.6l3.7-3.7 2.6 2.3L18 8" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="18" cy="8" r="1.8" fill="#ffffff"/>
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b426e"/>
      <stop offset="1" stop-color="#06213a"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- logo: brand square + white globe/growth mark -->
  <rect x="545" y="95" width="110" height="110" rx="24" fill="#0074c5"/>
  ${mark}

  <!-- wordmark -->
  <text x="600" y="308" text-anchor="middle" font-family="Baskerville, Georgia, 'Times New Roman', serif" font-size="82" font-weight="700">
    <tspan fill="#eaf4ff">Portfolio</tspan><tspan fill="#7cc8fb">Atlas</tspan>
  </text>

  <!-- tagline -->
  <text x="600" y="384" text-anchor="middle" font-family="Baskerville, Georgia, 'Times New Roman', serif" font-size="40" fill="#bae0fd">What Can Your Portfolio Buy You</text>
  <text x="600" y="432" text-anchor="middle" font-family="Baskerville, Georgia, 'Times New Roman', serif" font-size="40" fill="#bae0fd">Around the World?</text>

  <!-- supporting line -->
  <text x="600" y="503" text-anchor="middle" font-family="Baskerville, Georgia, 'Times New Roman', serif" font-size="26" fill="#7cc8fb">Real costs. Real lifestyles. 110+ cities worldwide.</text>

  <!-- divider -->
  <line x1="480" y1="538" x2="720" y2="538" stroke="#0c93e7" stroke-width="2"/>

  <!-- url -->
  <text x="600" y="590" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-size="24" letter-spacing="1.5" fill="#7cc8fb">portfolioatlas.org</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log('Wrote', OUT);
