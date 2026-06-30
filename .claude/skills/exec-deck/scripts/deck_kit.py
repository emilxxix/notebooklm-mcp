"""deck_kit — house-style helpers for executive-brief PPTX decks.

Import this and build slides with a consistent look:

    from deck_kit import *
    prs, blank = new_deck()
    s = prs.slides.add_slide(blank)
    add_rect(s, 0, 0, SW_IN, SH_IN, DARK)
    header(s, "KICKER", "Slide Title")          # white content-slide header
    add_text(s, 0.7, 2.0, 6.0, [[("Hello", 14, WHITE, True)]])
    footer(s, page=1, total=3)
    prs.save("out.pptx")

All x/y/w/h are in INCHES (floats). Font sizes are in points.
Colors are RGBColor constants defined below. Font face is Calibri.

NOTE: verify the result with scripts/preview.py (Pillow) — LibreOffice
pptx->pdf conversion is unreliable in the sandbox, so do not rely on it.
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# ------------------------------------------------------------------ palette
# Accent / brand
TOYOTA_RED  = RGBColor(0xEB, 0x0A, 0x1E)   # primary accent: kickers, stripes, key numbers
# Neutrals
DARK        = RGBColor(0x1A, 0x1A, 0x1A)   # title-slide & footer bg, dark KPI/takeaway panels
SLATE       = RGBColor(0x33, 0x3A, 0x45)   # title-slide upper band; body text on light bg
GREY        = RGBColor(0x6B, 0x72, 0x80)   # secondary labels / muted text
LIGHT_GREY  = RGBColor(0xF2, 0xF3, 0xF5)   # card fills, zebra rows, thin dividers
WHITE       = RGBColor(0xFF, 0xFF, 0xFF)   # slide bg, text on dark
# Dark-panel variants (title slide)
SLATE_BG    = RGBColor(0x33, 0x3A, 0x45)
CARD_DARK   = RGBColor(0x2E, 0x34, 0x3D)   # fact tiles on dark
BLUF_BG     = RGBColor(0x25, 0x2A, 0x32)   # BLUF / callout box on dark
# Semantic (pick by meaning, not decoration)
EV_GREEN    = RGBColor(0x0F, 0x8A, 0x4F)   # electric / positive / "go"
DIESEL_BLUE = RGBColor(0x1F, 0x4E, 0x79)   # diesel / neutral / baseline
# Light tints to pair with the semantic colors
ACCENT_BG   = RGBColor(0xFB, 0xE9, 0xEB)   # light red — emphasis row/pillar
GREEN_BG    = RGBColor(0xEC, 0xF6, 0xF0)   # light green — EV card body

# Soft text tones used on dark backgrounds
SUBTLE_LIGHT = RGBColor(0xCF, 0xD4, 0xDB)
TILE_LABEL   = RGBColor(0xC2, 0xC8, 0xD0)
RED_TINT     = RGBColor(0xFF, 0xB3, 0xBA)  # highlighted phrase inside BLUF

FONT = "Calibri"

# ------------------------------------------------------------------ canvas (16:9)
SW_IN, SH_IN = 13.333, 7.5     # slide size in inches


def new_deck():
    """Return (Presentation, blank_layout) sized 16:9."""
    prs = Presentation()
    prs.slide_width = Inches(SW_IN)
    prs.slide_height = Inches(SH_IN)
    return prs, prs.slide_layouts[6]


# ------------------------------------------------------------------ primitives
def add_rect(slide, x, y, w, h, fill, line=None, shape=MSO_SHAPE.RECTANGLE):
    """Flat, shadow-free rectangle. Coords in inches."""
    s = slide.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    s.fill.solid()
    s.fill.fore_color.rgb = fill
    if line is None:
        s.line.fill.background()
    else:
        s.line.color.rgb = line
        s.line.width = Pt(0.75)
    s.shadow.inherit = False
    return s


def add_text(slide, x, y, w, runs, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
             h=1.0, space_after=4, line_spacing=1.0):
    """Multi-run textbox. Coords in inches.

    runs : list of paragraphs; each paragraph is a list of
           (text, point_size, RGBColor, bold) tuples rendered inline.
    """
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    for i, para in enumerate(runs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_after = Pt(space_after)
        p.space_before = Pt(0)
        p.line_spacing = line_spacing
        for (text, size, color, bold) in para:
            r = p.add_run()
            r.text = text
            r.font.size = Pt(size)
            r.font.color.rgb = color
            r.font.bold = bold
            r.font.name = FONT
    return tb


# ------------------------------------------------------------------ chrome
def header(slide, kicker, title):
    """White content-slide header: red left stripe + red kicker + dark title + divider."""
    add_rect(slide, 0, 0, SW_IN, 1.15, WHITE)
    add_rect(slide, 0, 0, 0.18, 1.15, TOYOTA_RED)
    add_text(slide, 0.5, 0.18, 12.3, [[(kicker, 11, TOYOTA_RED, True)]], h=0.3)
    add_text(slide, 0.5, 0.46, 12.3, [[(title, 26, DARK, True)]], h=0.6)
    add_rect(slide, 0.5, 1.08, 12.33, 1.5 / 72.0, LIGHT_GREY)


def footer(slide, page, total=3, source="Source: MarkLines Automotive Sales Data"):
    """Dark footer bar: source note left, page number right."""
    add_rect(slide, 0, SH_IN - 0.32, SW_IN, 0.32, DARK)
    add_text(slide, 0.5, SH_IN - 0.31, 9, [[(source, 8, WHITE, False)]],
             anchor=MSO_ANCHOR.MIDDLE, h=0.3)
    add_text(slide, SW_IN - 1.5, SH_IN - 0.31, 1.0,
             [[(f"{page} / {total}", 8, WHITE, True)]],
             align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE, h=0.3)


def section_label(slide, x, y, w, text):
    """Small uppercase red section label used above a block."""
    add_text(slide, x, y, w, [[(text, 12, TOYOTA_RED, True)]], h=0.3)
