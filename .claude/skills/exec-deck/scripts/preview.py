"""preview — render house-style slides to PNG with Pillow, to eyeball layout.

Why this exists: LibreOffice `--convert-to pdf/png` is broken in the sandbox
(it errors "source file could not be loaded" on every file, even .txt), so
you cannot rasterise the real .pptx. Instead, MIRROR your build coordinates
here and render a near-identical preview. Liberation Sans ~ Calibri but a
touch WIDER, so if text fits in the preview it will fit in the deck
(conservative overflow check).

Usage pattern:
  - build the deck with deck_kit (inches, points, same palette)
  - copy the same x/y/w/h/size values into draw calls here
  - run this, then Read the PNGs and check for overflow / overlap
  - only then deliver the .pptx

Helpers below mirror deck_kit's primitives (rect, text, header, footer).
This file intentionally re-declares the palette as RGB tuples so it has no
dependency on python-pptx.
"""
from PIL import Image, ImageDraw, ImageFont

DPI = 96
def _px(inch): return int(round(inch * DPI))
def _ptpx(pt): return int(round(pt * DPI / 72.0))

_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
_BLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
_fc = {}
def font(pt, bold):
    k = (pt, bold)
    if k not in _fc:
        _fc[k] = ImageFont.truetype(_BLD if bold else _REG, _ptpx(pt))
    return _fc[k]

# palette as RGB tuples (mirror deck_kit)
TOYOTA_RED=(0xEB,0x0A,0x1E); DARK=(0x1A,0x1A,0x1A); SLATE=(0x33,0x3A,0x45)
GREY=(0x6B,0x72,0x80); LIGHT_GREY=(0xF2,0xF3,0xF5); WHITE=(255,255,255)
EV_GREEN=(0x0F,0x8A,0x4F); DIESEL_BLUE=(0x1F,0x4E,0x79); ACCENT_BG=(0xFB,0xE9,0xEB)
SLATE_BG=(0x33,0x3A,0x45); CARD_DARK=(0x2E,0x34,0x3D); BLUF_BG=(0x25,0x2A,0x32)
GREEN_BG=(0xEC,0xF6,0xF0); SUBTLE_LIGHT=(0xCF,0xD4,0xDB); TILE_LABEL=(0xC2,0xC8,0xD0)
RED_TINT=(0xFF,0xB3,0xBA)

SW, SH = _px(13.333), _px(7.5)

def new():
    img = Image.new("RGB", (SW, SH), WHITE)
    return img, ImageDraw.Draw(img)

def rect(d, x, y, w, h, fill):
    d.rectangle([_px(x), _px(y), _px(x)+_px(w), _px(y)+_px(h)], fill=fill)

def text(d, x, y, w, runs, align="l", anchor="t", h=None, ls=1.0, sa=4):
    """Mirror of deck_kit.add_text. runs: paragraphs of (txt,size,rgb,bold)."""
    maxw = _px(w)
    para_lines = []
    for para in runs:
        tokens = []
        for (txt, size, color, bold) in para:
            fnt = font(size, bold)
            for p in txt.split(" "):
                tokens.append((p, fnt, color))
        lines, cur, curw = [], [], 0
        for (p, fnt, color) in tokens:
            wlen = d.textlength(p, font=fnt)
            sp = d.textlength(" ", font=fnt) if cur else 0
            if cur and curw + sp + wlen > maxw:
                lines.append(cur); cur = [(p, fnt, color)]; curw = wlen
            else:
                cur.append((p, fnt, color)); curw += sp + wlen
        if cur: lines.append(cur)
        if not lines: lines = [[("", font(para[0][1], False), GREY)]]
        para_lines.append((lines, para))
    total = 0; rendered = []
    for (lines, para) in para_lines:
        maxsize = max(r[1] for r in para)
        lh = int(_ptpx(maxsize) * 1.18 * ls)
        for ln in lines:
            rendered.append((ln, lh))
        total += lh * len(lines) + _ptpx(sa)
    total -= _ptpx(sa)
    if anchor == "m" and h: yy = _px(y) + (_px(h) - total) // 2
    elif anchor == "b" and h: yy = _px(y) + (_px(h) - total)
    else: yy = _px(y)
    for (ln, lh) in rendered:
        lw = sum(d.textlength(p, font=fnt) + (d.textlength(" ", font=fnt) if i > 0 else 0)
                 for i, (p, fnt, c) in enumerate(ln))
        if align == "c": xx = _px(x) + (maxw - lw) // 2
        elif align == "r": xx = _px(x) + (maxw - lw)
        else: xx = _px(x)
        for i, (p, fnt, c) in enumerate(ln):
            if i > 0: xx += d.textlength(" ", font=fnt)
            d.text((xx, yy), p, font=fnt, fill=c)
            xx += d.textlength(p, font=fnt)
        yy += lh

def header(d, kicker, title):
    rect(d, 0, 0, 13.333, 1.15, WHITE)
    rect(d, 0, 0, 0.18, 1.15, TOYOTA_RED)
    text(d, 0.5, 0.18, 12.3, [[(kicker, 11, TOYOTA_RED, True)]])
    text(d, 0.5, 0.46, 12.3, [[(title, 26, DARK, True)]])
    rect(d, 0.5, 1.08, 12.33, 0.02, LIGHT_GREY)

def footer(d, page, total=3, source="Source: MarkLines Automotive Sales Data"):
    rect(d, 0, 7.5 - 0.32, 13.333, 0.32, DARK)
    text(d, 0.5, 7.5 - 0.31, 9, [[(source, 8, WHITE, False)]], anchor="m", h=0.3)
    text(d, 13.333 - 1.5, 7.5 - 0.31, 1.0, [[(f"{page} / {total}", 8, WHITE, True)]],
         align="r", anchor="m", h=0.3)
