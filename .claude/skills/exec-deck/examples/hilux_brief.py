#!/usr/bin/env python3
"""Canonical example: the 3-slide Toyota Hilux "Travo" MarkLines brief.

Demonstrates every house-style component on top of deck_kit:
  - dark title slide with BLUF callout + 3 fact tiles
  - two-column comparison cards with zebra rows
  - segmentation pillars, a stat box, KPI strips, and a takeaway band

Run:  python3 examples/hilux_brief.py [out.pptx]
"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))
from deck_kit import *   # noqa: F401,F403

prs, blank = new_deck()

# ----------------------------------------------------------- SLIDE 1: title + BLUF
s = prs.slides.add_slide(blank)
add_rect(s, 0, 0, SW_IN, SH_IN, DARK)
add_rect(s, 0, 0, SW_IN, 2.55, SLATE_BG)
add_rect(s, 0, 2.5, SW_IN, 0.08, TOYOTA_RED)
add_text(s, 0.7, 0.55, 12, [[("MARKLINES DATA BRIEF  ·  JUNE 2026", 13, TOYOTA_RED, True)]])
add_text(s, 0.7, 0.95, 12, [[("Toyota Hilux ", 40, WHITE, True), ("“Travo”", 40, TOYOTA_RED, True),
                              (" Family", 40, WHITE, True)]])
add_text(s, 0.7, 1.78, 12, [[("9th-Generation Hilux  ·  Diesel (Travo) & Battery-Electric (Travo-e)",
                              16, SUBTLE_LIGHT, False)]])
add_rect(s, 0.7, 2.95, 11.93, 1.55, BLUF_BG)
add_rect(s, 0.7, 2.95, 0.12, 1.55, TOYOTA_RED)
add_text(s, 1.0, 3.12, 11.4, [[("BOTTOM LINE UP FRONT", 12, TOYOTA_RED, True)]])
add_text(s, 1.0, 3.45, 11.4,
         [[("Toyota launched ", 14, WHITE, False), ("two models", 14, WHITE, True),
           (" under the Travo badge — the ", 14, WHITE, False), ("Travo diesel (ICE)", 14, WHITE, True),
           (" and the all-electric ", 14, WHITE, False), ("Travo-e (BEV)", 14, WHITE, True),
           (". In MarkLines sales statistics both are ", 14, WHITE, False),
           ("aggregated under “Hilux” and cannot be split at model level", 14, RED_TINT, True),
           ("; they are distinguished here by powertrain, body style and launch timeline.", 14, WHITE, False)]],
         line_spacing=1.1)
tiles = [("2", "models under the Travo badge", TOYOTA_RED),
         ("Dec 2025", "Travo diesel launched in Thailand", DIESEL_BLUE),
         ("Mar 2026", "Travo-e BEV launched; Europe from Apr 2026", EV_GREEN)]
tw = 3.84
for i, (big, small, col) in enumerate(tiles):
    x = 0.7 + i * (tw + 0.205)
    add_rect(s, x, 4.85, tw, 1.65, CARD_DARK)
    add_rect(s, x, 4.85, tw, 0.10, col)
    add_text(s, x, 5.10, tw, [[(big, 34, WHITE, True)]], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, h=0.75)
    add_text(s, x, 5.85, tw, [[(small, 12, TILE_LABEL, False)]], align=PP_ALIGN.CENTER, h=0.6)
footer(s, 1)

# ----------------------------------------------------------- SLIDE 2: comparison cards
s = prs.slides.add_slide(blank)
add_rect(s, 0, 0, SW_IN, SH_IN, WHITE)
header(s, "THE TWO MODELS", "Travo (Diesel) vs. Travo-e (BEV) — Specifications")
card_y, card_h, cw, ex = 1.45, 5.45, 6.0, 6.83
add_rect(s, 0.5, card_y, cw, card_h, LIGHT_GREY)
add_rect(s, 0.5, card_y, cw, 0.7, DIESEL_BLUE)
add_text(s, 0.7, card_y + 0.08, cw, [[("Hilux Travo", 18, WHITE, True)],
         [("Diesel  ·  Internal Combustion", 11, RGBColor(0xCF, 0xDD, 0xEC), False)]], space_after=0)
add_rect(s, ex, card_y, cw, card_h, GREEN_BG)
add_rect(s, ex, card_y, cw, 0.7, EV_GREEN)
add_text(s, ex + 0.2, card_y + 0.08, cw, [[("Hilux Travo-e", 18, WHITE, True)],
         [("Battery-Electric  ·  First body-on-frame EV Hilux", 11, RGBColor(0xD6, 0xF0, 0xE2), False)]], space_after=0)
rows = [("Powertrain", "2.8L GD Super Power turbo-diesel (+7.5% fuel efficiency)", "Dual-motor electric AWD (eAxle)"),
        ("Output", "High-torque 4-cylinder", "196 hp / 144 kW combined"),
        ("Energy storage", "Diesel fuel tank", "59.2 kWh Li-ion, 296V"),
        ("Range", "— (ICE)", "315 km NEDC (TH) / 257 km WLTP (EU)"),
        ("Charging", "—", "10 kW AC / 125 kW DC fast charge"),
        ("Cabin options", "Standard / Smart / Double Cab", "Double Cab only"),
        ("Drivetrain", "2WD Prerunner / 4WD 4TREX / Overland", "4WD 4TREX only"),
        ("Thai launch", "December 2025", "March 2026 (EU from Apr 2026)"),
        ("Target buyer", "Long-distance & traditional off-roaders", "Eco-conscious urban & EU fleets")]
ry, row_h = card_y + 0.85, 0.49
for i, (label, dd, ee) in enumerate(rows):
    y = ry + i * row_h
    if i % 2 == 1:
        add_rect(s, 0.5, y, cw, row_h, WHITE)
        add_rect(s, ex, y, cw, row_h, WHITE)
    add_text(s, 0.7, y, 1.7, [[(label, 9.5, GREY, True)]], anchor=MSO_ANCHOR.MIDDLE, h=row_h, space_after=0, line_spacing=0.95)
    add_text(s, 2.35, y, 4.0, [[(dd, 10.5, SLATE, False)]], anchor=MSO_ANCHOR.MIDDLE, h=row_h, space_after=0, line_spacing=0.95)
    add_text(s, ex + 0.2, y, 1.7, [[(label, 9.5, GREY, True)]], anchor=MSO_ANCHOR.MIDDLE, h=row_h, space_after=0, line_spacing=0.95)
    add_text(s, ex + 1.85, y, 4.0, [[(ee, 10.5, DARK, False)]], anchor=MSO_ANCHOR.MIDDLE, h=row_h, space_after=0, line_spacing=0.95)
footer(s, 2)

# ----------------------------------------------------------- SLIDE 3: positioning + KPIs
s = prs.slides.add_slide(blank)
add_rect(s, 0, 0, SW_IN, SH_IN, WHITE)
header(s, "POSITIONING & SALES SIGNAL", "Strategy, Production Footprint & Market Read")
lx, lw = 0.5, 6.0
section_label(s, lx, 1.35, lw, "LINEUP SEGMENTATION (no cannibalisation)")
pillars = [("Hilux REVO", "Commercial / B2B fleet", GREY),
           ("Hilux CHAMP", "Low-cost, customisable conversions", GREY),
           ("Hilux TRAVO / TRAVO-e", "Premium lifestyle, off-road & urban — high-margin retail", TOYOTA_RED)]
for i, (name, desc, col) in enumerate(pillars):
    y = 1.72 + i * 0.74
    add_rect(s, lx, y, lw, 0.64, LIGHT_GREY if col == GREY else ACCENT_BG)
    add_rect(s, lx, y, 0.09, 0.64, col)
    add_text(s, lx + 0.25, y + 0.05, lw - 0.4, [[(name, 12.5, DARK, True)], [(desc, 10, SLATE, False)]],
             anchor=MSO_ANCHOR.MIDDLE, h=0.55, space_after=1, line_spacing=0.95)
section_label(s, lx, 4.15, lw, "PRODUCTION FOOTPRINT")
add_rect(s, lx, 4.5, lw, 2.25, LIGHT_GREY)
add_text(s, lx + 0.25, 4.68, lw - 0.5,
         [[("Ban Pho Plant", 13, DARK, True), ("  – Chachoengsao, Thailand", 11, GREY, False)],
          [("▪  Builds both Travo & Travo-e on the New IMV platform", 11, SLATE, False)],
          [("▪  Annual capacity: ", 11, SLATE, False), ("220,000 units", 11, DARK, True), (" (of TMT's 760,000)", 11, SLATE, False)],
          [("▪  Local content: ", 11, SLATE, False), ("95%", 11, DARK, True), (" — resilient supply chain", 11, SLATE, False)],
          [("▪  Travo-e base price: ", 11, SLATE, False), ("THB 1,491,000", 11, DARK, True)]],
         space_after=6)
rx, rw = 6.83, 6.0
section_label(s, rx, 1.35, rw, "MARKET READ — HILUX (TRAVO REPORTED INSIDE)")
kpis = [("7,147", "Hilux units, Thailand – Mar 2026 (12-mo high)", EV_GREEN),
        ("82,000", "Toyota 1-ton pickup target, Thailand 2026 (+17%)", DIESEL_BLUE),
        ("11,615", "Hilux units in Europe, Q1 2026 (+7% YoY)", DARK),
        ("+79%", "Toyota Europe BEV sales, Q1 2026 YoY", TOYOTA_RED)]
kh = 0.86
for i, (big, small, col) in enumerate(kpis):
    y = 1.72 + i * (kh + 0.05)
    add_rect(s, rx, y, rw, kh, LIGHT_GREY)
    add_rect(s, rx, y, 1.9, kh, col)
    add_text(s, rx, y, 1.9, [[(big, 22, WHITE, True)]], align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, h=kh)
    add_text(s, rx + 2.1, y, 3.7, [[(small, 11.5, SLATE, False)]], anchor=MSO_ANCHOR.MIDDLE, h=kh, line_spacing=0.95)
add_rect(s, rx, 5.55, rw, 1.2, DARK)
add_text(s, rx + 0.25, 5.7, rw - 0.5,
         [[("TAKEAWAY", 10, TOYOTA_RED, True)],
          [("Travo-specific volumes are not yet broken out in MarkLines, but rising Hilux demand in Thailand "
            "and Europe plus an aggressive Ban Pho ramp position Toyota to defend pickup share through the "
            "diesel-plus-BEV split.", 11, WHITE, False)]], space_after=3, line_spacing=1.02)
footer(s, 3)

out = sys.argv[1] if len(sys.argv) > 1 else "Hilux_Travo_MarkLines_Brief.pptx"
prs.save(out)
print("Saved:", out)
