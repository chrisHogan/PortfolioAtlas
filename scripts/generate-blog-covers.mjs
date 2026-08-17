// Generates public/blog/covers/<slug>.png (1200x630 @2x) — one cover per blog
// post, in the site's brand system (navy gradient, Baskerville serif, the
// globe/growth-line mark, brand-blue palette). These render in the /blog grid
// (BlogCard), atop each post, and as the post's og:image.
//
// EVERY blog post ships with a cover. To add one for a new post:
//   1. Add a spec to COVERS below (kicker, title, optional subline, motif).
//   2. Run: node scripts/generate-blog-covers.mjs
//   3. Set the post's frontmatter: coverImage: "/blog/covers/<slug>.png"
// Keep motifs flat and abstract in the palette below. House style applies to
// image text: no em dashes, no exclamation points, figures over adjectives.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../public/blog/covers');
mkdirSync(OUT_DIR, { recursive: true });

const W = 1200, H = 630;
const INK = '#eaf4ff', MIST = '#bae0fd', SKY = '#7cc8fb', ACCENT = '#36adf6', DEEP = '#0c93e7', BOX = '#0074c5';
const SERIF = "Baskerville, Georgia, 'Times New Roman', serif";

// The logo mark (globe + growth line), 24x24 source viewBox.
const mark = (x, y, s, o1, o2) => `
  <g transform="translate(${x},${y}) scale(${s})">
    <circle cx="12" cy="12" r="8.5" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="${o1}"/>
    <path d="M3.5 12h17" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="${o1}"/>
    <path d="M12 3.5c2.6 2.3 4 5.4 4 8.5s-1.4 6.2-4 8.5c-2.6-2.3-4-5.4-4-8.5s1.4-6.2 4-8.5z" fill="none" stroke="#ffffff" stroke-width="1.6" opacity="${o1}"/>
    <path d="M5.8 15.6l3.7-3.7 2.6 2.3L18 8" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="${o2}"/>
    <circle cx="18" cy="8" r="1.8" fill="#ffffff" opacity="${o2}"/>
  </g>`;

const frame = (motif, text) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b426e"/>
      <stop offset="1" stop-color="#06213a"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${mark(940, -60, 13, 0.06, 0.09)}
  ${motif}
  ${text}
  <rect x="70" y="546" width="34" height="34" rx="8" fill="${BOX}"/>
  ${mark(74, 550, 1.08, 0.55, 1)}
  <text x="118" y="571" font-family="${SERIF}" font-size="25" font-weight="700"><tspan fill="${INK}">Portfolio</tspan><tspan fill="${SKY}">Atlas</tspan></text>
</svg>`;

const textBlock = ({ kicker, title, subline, titleSize = 150, titleY = 330 }) => `
  <text x="72" y="150" font-family="${SERIF}" font-size="34" fill="${MIST}">${kicker}</text>
  <text x="66" y="${titleY}" font-family="${SERIF}" font-size="${titleSize}" font-weight="700" fill="${INK}">${title}</text>
  ${subline ? `<text x="72" y="${titleY + 62}" font-family="${SERIF}" font-size="30" fill="${SKY}">${subline}</text>` : ''}`;

// ─── Motifs (flat, abstract, lower band unless noted) ───
const routeArc = () => {
  const pts = [[150, 520], [340, 486], [540, 466], [740, 460], [930, 468], [1090, 486]];
  const lit = new Set([1, 3, 4]);
  return `<path d="M150 520 C 340 470, 640 448, 930 468 S 1080 480, 1090 486" fill="none" stroke="${DEEP}" stroke-width="2.5" stroke-dasharray="2 10" stroke-linecap="round" opacity="0.8"/>` +
    pts.map(([x, y], i) => lit.has(i)
      ? `<circle cx="${x}" cy="${y}" r="8" fill="${ACCENT}"/><circle cx="${x}" cy="${y}" r="14" fill="none" stroke="${ACCENT}" stroke-width="2" opacity="0.45"/>`
      : `<circle cx="${x}" cy="${y}" r="5" fill="${SKY}" opacity="0.55"/>`).join('');
};

const risingSteps = () => [0, 1, 2, 3, 4].map((i) =>
  `<rect x="${700 + i * 92}" y="${520 - i * 46}" width="60" height="${60 + i * 46}" rx="10" fill="${ACCENT}" opacity="${0.25 + i * 0.14}"/>`).join('') +
  `<path d="M712 486 L 1080 318" stroke="${SKY}" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 12" opacity="0.9"/>` +
  `<circle cx="1080" cy="318" r="8" fill="${INK}"/>`;

const skylineColumns = () => {
  const bars = [[700, 130], [762, 200], [824, 160], [886, 250], [948, 210], [1010, 290], [1072, 240]];
  return bars.map(([x, h]) => `<rect x="${x}" y="${540 - h}" width="44" height="${h}" rx="8" fill="${DEEP}" opacity="0.5"/>`).join('') +
    bars.filter((_, i) => i % 2 === 1).map(([x, h]) => `<circle cx="${x + 22}" cy="${528 - h}" r="5" fill="${ACCENT}"/>`).join('');
};

const sunAndWaves = () => `
  <circle cx="950" cy="380" r="86" fill="${ACCENT}" opacity="0.9"/>
  <path d="M640 500 Q 730 470, 820 500 T 1000 500 T 1180 500" fill="none" stroke="${SKY}" stroke-width="6" stroke-linecap="round" opacity="0.85"/>
  <path d="M680 545 Q 770 515, 860 545 T 1040 545 T 1220 545" fill="none" stroke="${DEEP}" stroke-width="6" stroke-linecap="round" opacity="0.7"/>
  <path d="M620 455 Q 690 435, 760 455 T 900 455" fill="none" stroke="${MIST}" stroke-width="4" stroke-linecap="round" opacity="0.5"/>`;

const chainBridge = () => `
  <line x1="620" y1="520" x2="1180" y2="520" stroke="${SKY}" stroke-width="5" stroke-linecap="round" opacity="0.9"/>
  <rect x="770" y="400" width="22" height="120" rx="4" fill="${DEEP}" opacity="0.85"/>
  <rect x="1010" y="400" width="22" height="120" rx="4" fill="${DEEP}" opacity="0.85"/>
  <path d="M620 470 Q 700 520, 781 440 Q 900 545, 1021 440 Q 1100 520, 1180 470" fill="none" stroke="${ACCENT}" stroke-width="4" stroke-linecap="round"/>
  <path d="M640 560 q 30 10 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0" fill="none" stroke="${DEEP}" stroke-width="3" opacity="0.45"/>`;

const seoulTower = () => `
  <path d="M600 540 L 760 440 L 900 540 Z" fill="${DEEP}" opacity="0.45"/>
  <path d="M820 540 L 990 400 L 1160 540 Z" fill="${DEEP}" opacity="0.6"/>
  <rect x="982" y="290" width="16" height="115" rx="6" fill="${ACCENT}"/>
  <ellipse cx="990" cy="300" rx="34" ry="16" fill="${ACCENT}"/>
  <line x1="990" y1="240" x2="990" y2="286" stroke="${SKY}" stroke-width="5" stroke-linecap="round"/>
  <circle cx="792" cy="330" r="44" fill="${SKY}" opacity="0.35"/>`;

const costaSol = () => `
  <circle cx="920" cy="400" r="110" fill="${ACCENT}" opacity="0.9"/>
  <rect x="600" y="497" width="600" height="6" rx="3" fill="${SKY}" opacity="0.8"/>
  <path d="M760 480 L 800 410 L 812 480 Z" fill="${INK}" opacity="0.95"/>
  <path d="M818 480 L 846 434 L 852 480 Z" fill="${MIST}" opacity="0.8"/>
  <rect x="756" y="484" width="104" height="8" rx="4" fill="${DEEP}"/>`;

const lakeMotif = () => `
  <path d="M620 470 L 730 380 L 830 470 Z" fill="${DEEP}" opacity="0.5"/>
  <path d="M780 470 L 920 350 L 1060 470 Z" fill="${DEEP}" opacity="0.65"/>
  <ellipse cx="880" cy="512" rx="290" ry="34" fill="${ACCENT}" opacity="0.35"/>
  <line x1="700" y1="512" x2="800" y2="512" stroke="${SKY}" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
  <line x1="860" y1="526" x2="1000" y2="526" stroke="${SKY}" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
  <line x1="920" y1="500" x2="1030" y2="500" stroke="${MIST}" stroke-width="4" stroke-linecap="round" opacity="0.5"/>`;

const watSpire = () => `
  <rect x="880" y="470" width="120" height="70" rx="6" fill="${DEEP}" opacity="0.6"/>
  <rect x="900" y="420" width="80" height="50" rx="5" fill="${DEEP}" opacity="0.75"/>
  <rect x="918" y="372" width="44" height="48" rx="4" fill="${ACCENT}" opacity="0.9"/>
  <path d="M940 260 L 962 372 L 918 372 Z" fill="${ACCENT}"/>
  <circle cx="940" cy="250" r="6" fill="${INK}"/>
  <rect x="700" y="490" width="60" height="50" rx="5" fill="${DEEP}" opacity="0.4"/>
  <rect x="1040" y="480" width="70" height="60" rx="5" fill="${DEEP}" opacity="0.4"/>`;

const divergingPaths = () => `
  <line x1="740" y1="530" x2="1190" y2="530" stroke="${SKY}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
  <path d="M780 408 L 842 426 L 890 414 L 948 466 L 1000 530" fill="none" stroke="${DEEP}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
  <path d="M780 408 L 844 378 L 900 412 L 972 354 L 1048 378 L 1150 276" fill="none" stroke="${ACCENT}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="780" cy="408" r="7" fill="${INK}"/>
  <circle cx="1150" cy="276" r="9" fill="${INK}"/>
  <line x1="986" y1="516" x2="1014" y2="544" stroke="${MIST}" stroke-width="5" stroke-linecap="round"/>
  <line x1="986" y1="544" x2="1014" y2="516" stroke="${MIST}" stroke-width="5" stroke-linecap="round"/>`;

const refreshBars = () => `
  <rect x="700" y="470" width="52" height="70" rx="8" fill="${DEEP}" opacity="0.5"/>
  <rect x="772" y="430" width="52" height="110" rx="8" fill="${DEEP}" opacity="0.65"/>
  <rect x="844" y="390" width="52" height="150" rx="8" fill="${ACCENT}" opacity="0.8"/>
  <rect x="916" y="340" width="52" height="200" rx="8" fill="${ACCENT}"/>
  <path d="M1060 400 a 64 64 0 1 1 -22 -110" fill="none" stroke="${SKY}" stroke-width="7" stroke-linecap="round"/>
  <path d="M1018 276 L 1048 292 L 1022 316 Z" fill="${SKY}"/>`;

// ─── One spec per post. slug -> { kicker, title, subline, motif } ───
const COVERS = {
  'best-cities-to-retire-on-500k': {
    kicker: 'Best Places to Retire on', title: '$500K', subline: '52 cities qualify on Q3 2026 data', motif: routeArc(),
  },
  'best-cities-to-retire-on-1-million': {
    kicker: 'Best Cities to Retire on', title: '$1M', subline: 'Where $40,000 a year lands you', motif: risingSteps(),
  },
  'best-cities-to-retire-on-2-million': {
    kicker: 'Best Cities to Retire on', title: '$2M', subline: '$80,000 a year, city by city', motif: skylineColumns(),
  },
  'retiring-in-da-nang-vietnam': {
    kicker: 'City Spotlight', title: 'Da Nang', subline: "Vietnam's central coast", motif: sunAndWaves(),
  },
  'retiring-in-hungary-budapest': {
    kicker: 'City Spotlight', title: 'Budapest', subline: 'Hungary on a FIRE budget', motif: chainBridge(),
  },
  'retiring-in-south-korea': {
    kicker: 'Country Guide', title: 'South Korea', subline: 'Seoul and beyond', motif: seoulTower(), titleSize: 116, titleY: 310,
  },
  'retiring-in-malaga-spain': {
    kicker: 'City Spotlight', title: 'Málaga', subline: 'Costa del Sol, Spain', motif: costaSol(),
  },
  'retiring-in-lake-chapala-mexico': {
    kicker: 'City Spotlight', title: 'Lake Chapala', subline: "Mexico's largest lake", motif: lakeMotif(), titleSize: 108, titleY: 305,
  },
  'why-bangkok-is-a-top-fire-destination': {
    kicker: 'FIRE Destination', title: 'Bangkok', subline: 'Thailand at the FIRE tier', motif: watSpire(),
  },
  'q3-2026-update': {
    kicker: 'Product Update', title: 'Q3 2026', subline: '121 cities, every figure re-researched', motif: refreshBars(),
  },
  'same-portfolio-different-decade': {
    kicker: 'Sequence of Returns Risk', title: '1966', subline: '$1M broke in 82 of 127 cities, vs 65 in 1929', motif: divergingPaths(),
  },
};

for (const [slug, spec] of Object.entries(COVERS)) {
  const svg = frame(spec.motif, textBlock(spec));
  const out = resolve(OUT_DIR, `${slug}.png`);
  await sharp(Buffer.from(svg), { density: 144 }).png().toFile(out);
  console.log('wrote', out);
}
