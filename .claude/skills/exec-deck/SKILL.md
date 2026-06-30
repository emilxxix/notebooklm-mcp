---
name: exec-deck
description: >-
  Build a short, professional executive-brief slide deck (PPTX) in a consistent
  house style — Toyota-red accent on a clean light/dark palette, BLUF-first,
  with comparison cards, KPI strips and a takeaway band. Use whenever the user
  asks for a PPT / PowerPoint / slide report, an executive or one-pager
  "few-page" summary for a manager/boss, a data brief, or asks for a report
  that matches the established look, tone, and colors of earlier decks.
---

# Executive-Brief Deck (house style)

A reusable style + toolkit for tight (2–4 slide) executive decks. The goal is
**one consistent look and voice across every report**: same palette, same
layout components, same simple-but-professional English. Reuse this — do not
reinvent the design each time.

The canonical, working reference is `examples/hilux_brief.py` (the Toyota Hilux
"Travo" MarkLines brief). Start from it and swap the content.

## Workflow

1. **Build** with `scripts/deck_kit.py`. Everything is positioned in **inches**;
   font sizes in **points**; colors are the named constants. Pattern:
   ```python
   import sys; sys.path.insert(0, ".../scripts")
   from deck_kit import *
   prs, blank = new_deck()
   s = prs.slides.add_slide(blank)
   add_rect(s, 0, 0, SW_IN, SH_IN, WHITE)
   header(s, "KICKER", "Slide Title")
   add_text(s, 0.7, 2.0, 6.0, [[("Body ", 14, SLATE, False), ("bold", 14, DARK, True)]])
   footer(s, page=1, total=3)
   prs.save("Report.pptx")
   ```
2. **Verify visually — do NOT skip.** LibreOffice `--convert-to` is broken in
   this sandbox (it fails on every file, even `.txt`), so you cannot rasterise
   the real `.pptx`. Instead mirror the same coordinates into
   `scripts/preview.py`, render PNGs, `Read` them, and check for text overflow
   or overlap. Liberation Sans ≈ Calibri but slightly wider, so "fits in the
   preview" ⇒ "fits in the deck."
3. **Deliver** with `SendUserFile`: the `.pptx` as `display:"attach"`, plus the
   preview PNGs as `display:"render"` so the user can glance at it. Note that
   previews use Liberation Sans and the real deck uses Calibri.
4. **Persist** only if asked or if a stop-hook requires a clean tree: commit the
   `.pptx` (and any new example) to the working branch.

## House palette

Pick semantic colors by **meaning**, not decoration.

| Role | Const | Hex |
|------|-------|-----|
| Primary accent (kickers, stripes, key numbers, emphasis) | `TOYOTA_RED` | `#EB0A1E` |
| Title-slide / footer / dark panels | `DARK` | `#1A1A1A` |
| Title upper band; body text on light | `SLATE` | `#333A45` |
| Secondary / muted labels | `GREY` | `#6B7280` |
| Card fills, zebra rows, dividers | `LIGHT_GREY` | `#F2F3F5` |
| Slide bg, text on dark | `WHITE` | `#FFFFFF` |
| Electric / positive / "go" | `EV_GREEN` | `#0F8A4F` |
| Diesel / neutral / baseline | `DIESEL_BLUE` | `#1F4E79` |
| Light red tint (emphasis row/pillar) | `ACCENT_BG` | `#FBE9EB` |
| Light green tint (EV card body) | `GREEN_BG` | `#ECF6F0` |
| Fact tiles / BLUF box on dark | `CARD_DARK` `#2E343D` / `BLUF_BG` `#252A32` |
| Soft text on dark | `SUBTLE_LIGHT` `#CFD4DB`, `TILE_LABEL` `#C2C8D0`, `RED_TINT` `#FFB3BA` |

Rule of thumb: one bold accent (red) + neutrals, plus at most two semantic
colors per deck. Avoid gradients, shadows, clip-art, and more than ~2 accent
hues on a slide. Flat shapes only (`add_rect` already disables shadows).

## Typography (Calibri throughout)

- Title slide headline **40pt bold**; content-slide title **26pt bold** (`header`).
- Kicker / section label **11–12pt bold, UPPERCASE, red**.
- Body **10.5–14pt**; table cells **9.5–10.5pt**; footer **8pt**.
- Big KPI / tile numbers **22–34pt bold**.
- Generous line spacing (1.0–1.1) for paragraphs; tighten to ~0.95 in tables.

## Layout (16:9, `SW_IN`×`SH_IN` = 13.333×7.5 in)

Reusable components (all in `examples/hilux_brief.py`):

- **Title slide** — dark bg, slate upper band, thin red seam, **BLUF callout**
  (dark box + red left bar) stating the single key takeaway first, then a row of
  three **fact tiles** (big number + caption, colored top stripe).
- **Content header** — `header(slide, kicker, title)`: white bar, red left
  stripe, red kicker, dark title, light divider.
- **Comparison cards** — two 6.0-in columns, a 0.7-in colored card header,
  then **zebra rows** with a muted label column + value column.
- **Pillars** — stacked rows with a colored left bar (highlight the focus row
  with `ACCENT_BG` + red bar).
- **KPI strip** — colored left number block (1.9 in) + description.
- **Takeaway band** — dark strip with a red `TAKEAWAY` label and one sentence.
- **Footer** — `footer(slide, page, total, source)`: dark bar, source note left,
  page number right. Keep a source attribution on every data slide.

## Tone & wording

- **English, simple and professional.** Short, concrete words; active voice.
  Avoid jargon and long sentences — a busy manager skims this.
- **BLUF**: lead with the conclusion, then support it.
- Keep it to **2–4 slides**. One idea per slide; short labels, not paragraphs.
- Numbers carry the message — surface the few that matter as KPIs.
- Be honest about gaps (e.g. "not yet broken out in the dataset") rather than
  implying precision that isn't there. Cite the source.

## Files

- `scripts/deck_kit.py` — palette + helpers (`new_deck`, `add_rect`, `add_text`,
  `header`, `footer`, `section_label`).
- `scripts/preview.py` — Pillow renderer that mirrors `deck_kit` for visual
  verification (no python-pptx dependency).
- `examples/hilux_brief.py` — full working 3-slide reference deck.
