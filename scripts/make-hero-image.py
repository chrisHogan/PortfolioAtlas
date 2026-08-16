#!/usr/bin/env python3
"""
make-hero-image.py

Renders the PortfolioAtlas blog hero/title image from a spec JSON.
Template-driven: the spec carries the text, this script carries the brand.
All numbers in the spec must come from data.json tokens (injected upstream);
this script never computes or formats a number.

Usage:
  python3 scripts/make-hero-image.py --spec blog-pipeline/<slug>/hero-spec-final.json \
      --out blog-pipeline/<slug>/hero.png \
      [--logo path/to/logo.png] [--font-serif path/to/Font.ttf]

Spec JSON fields:
  headline   - small serif line above the figure  (e.g. "Best Places to Retire on")
  figure     - the oversized centerpiece           (e.g. "$500K")
  subtitle   - qualifying stat line                (e.g. "52 cities qualify on Q3 2026 data")
  footer_left  - optional, default "PortfolioAtlas"
  footer_right - optional, default "portfolioatlas.org"

Output: 1200x630 PNG (og:image standard; works for Substack cover and site social
cards), rendered at 2x and downscaled for crisp text.
"""

import argparse
import json
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

NAVY = (18, 41, 71)        # #122947
NAVY_LIGHT = (26, 55, 92)  # subtle gradient top
BLUE = (49, 114, 191)      # #3172BF
BLUE_SOFT = (120, 160, 210)
WHITE = (240, 244, 250)

# Render at 2x, ship at 1200x630
W, H = 2400, 1260
OUT_W, OUT_H = 1200, 630

SERIF_CANDIDATES = [
    # Brand font first if passed via --font-serif; these are fallbacks.
    "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",   # macOS
    "/System/Library/Fonts/Supplemental/Georgia.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", # linux
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
]
SANS_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]


def load_font(candidates, size, explicit=None):
    paths = ([explicit] if explicit else []) + candidates
    for p in paths:
        if p and Path(p).exists():
            try:
                return ImageFont.truetype(p, size)
            except OSError:
                continue
    print("FAIL: no usable font found; pass --font-serif", file=sys.stderr)
    sys.exit(1)


def forbidden_chars(spec):
    text = " ".join(str(spec.get(k, "")) for k in ("headline", "figure", "subtitle"))
    bad = [c for c in ("\u2014", "!") if c in text]  # em dash, exclamation
    return bad


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--spec", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--logo", default=None, help="optional logo PNG for wordmark + watermark")
    ap.add_argument("--font-serif", default=None)
    ap.add_argument("--font-sans", default=None)
    args = ap.parse_args()

    spec = json.loads(Path(args.spec).read_text())
    for key in ("headline", "figure", "subtitle"):
        if not str(spec.get(key, "")).strip():
            print(f"FAIL: spec missing required field: {key}", file=sys.stderr)
            sys.exit(1)
    if "{{" in json.dumps(spec):
        print("FAIL: spec contains uninjected {{tokens}}", file=sys.stderr)
        sys.exit(1)
    bad = forbidden_chars(spec)
    if bad:
        print(f"FAIL: forbidden characters in spec text (house style): {bad}", file=sys.stderr)
        sys.exit(1)

    img = Image.new("RGB", (W, H), NAVY)
    draw = ImageDraw.Draw(img)

    # Subtle vertical gradient
    for y in range(H):
        t = y / H
        r = int(NAVY_LIGHT[0] + (NAVY[0] - NAVY_LIGHT[0]) * t)
        g = int(NAVY_LIGHT[1] + (NAVY[1] - NAVY_LIGHT[1]) * t)
        b = int(NAVY_LIGHT[2] + (NAVY[2] - NAVY_LIGHT[2]) * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # Watermark (top right), if logo provided
    if args.logo and Path(args.logo).exists():
        logo = Image.open(args.logo).convert("RGBA")
        wm = logo.resize((420, int(420 * logo.height / logo.width)))
        alpha = wm.getchannel("A").point(lambda a: int(a * 0.12))
        wm.putalpha(alpha)
        img.paste(wm, (W - wm.width - 90, 80), wm)
        draw = ImageDraw.Draw(img)

    left = 150

    # Headline
    f_head = load_font(SERIF_CANDIDATES, 92, args.font_serif)
    draw.text((left, 190), spec["headline"], font=f_head, fill=WHITE)

    # Oversized figure
    f_fig = load_font(SERIF_CANDIDATES, 330, args.font_serif)
    draw.text((left - 8, 300), spec["figure"], font=f_fig, fill=WHITE)
    fig_box = draw.textbbox((left - 8, 300), spec["figure"], font=f_fig)

    # Subtitle
    f_sub = load_font(SERIF_CANDIDATES, 70, args.font_serif)
    draw.text((left, fig_box[3] + 40), spec["subtitle"], font=f_sub, fill=BLUE_SOFT)

    # Dotted chart motif with glow points
    base_y, amp = H - 260, 90
    pts = []
    for i in range(60):
        x = 140 + i * ((W - 280) / 59)
        y = base_y - amp * math.sin(0.6 + i / 59 * 2.4) * (0.55 + 0.45 * i / 59)
        pts.append((x, y))
    for i, (x, y) in enumerate(pts):
        if i % 2 == 0:
            draw.ellipse([x - 4, y - 4, x + 4, y + 4], fill=(*BLUE_SOFT, ))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for idx in (14, 30, 44, 56):
        x, y = pts[idx]
        gd.ellipse([x - 26, y - 26, x + 26, y + 26], fill=(*BLUE, 90))
        gd.ellipse([x - 12, y - 12, x + 12, y + 12], fill=(210, 230, 250, 255))
    glow = glow.filter(ImageFilter.GaussianBlur(3))
    img.paste(glow, (0, 0), glow)
    draw = ImageDraw.Draw(img)

    # Footer
    f_foot = load_font(SANS_CANDIDATES, 54, args.font_sans)
    footer_y = H - 130
    footer_left = spec.get("footer_left", "PortfolioAtlas")
    if args.logo and Path(args.logo).exists():
        mark = Image.open(args.logo).convert("RGBA").resize((72, 72))
        img.paste(mark, (left, footer_y - 12), mark)
        draw = ImageDraw.Draw(img)
        draw.text((left + 96, footer_y), footer_left, font=f_foot, fill=WHITE)
    else:
        draw.ellipse([left, footer_y + 2, left + 52, footer_y + 54], fill=BLUE)
        draw.text((left + 76, footer_y), footer_left, font=f_foot, fill=WHITE)

    footer_right = spec.get("footer_right", "portfolioatlas.org")
    fr_box = draw.textbbox((0, 0), footer_right, font=f_foot)
    draw.text((W - (fr_box[2] - fr_box[0]) - 150, footer_y), footer_right,
              font=f_foot, fill=BLUE_SOFT)

    img = img.resize((OUT_W, OUT_H), Image.LANCZOS)
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    img.save(args.out, "PNG")
    print(f"OK: wrote {args.out} ({OUT_W}x{OUT_H})")


if __name__ == "__main__":
    main()
