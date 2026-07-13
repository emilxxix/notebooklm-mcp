---
name: th-topten
description: >-
  Fill the "Thailand" sheet of the monthly Top-10 Automotive Strategic Models
  tracker from MarkLines sales data plus the user's forecast file. Returns
  copy-paste TSV (never a new file) for both tables, plus the list of supplier
  cells to shade cyan (= a current customer we supply a part to, for that exact
  model). Use whenever the user sends MarkLines Thailand Top-10 info / asks for
  the monthly fill-in text for the Thailand sheet.
---

# Thailand Top-10 — monthly fill-in method

Deliverable is **always text to copy-paste into the user's existing Excel — never
create a new file.** Two TSV blocks + a "cells to shade cyan" list.

## The sheet has two tables

### Table 1 — Top 10 best-selling models, ALL powertrains → paste at `B5`
Columns **B–L** (tab-separated, 6 supplier columns):

| B Rank | C Maker/Brand | D Powertrain | E Model | F Sales | G STEERING | H BEV/HEV INVERTER | I ENGINE | J AIR COMPRESSOR | K TURBO CHARGER | L TRANSMISSION |

### Table 2 — Top 10 electrified models → paste at `B18`
Columns **B–J** (no ENGINE, no TURBO — EVs don't have them):

| B Rank | C Maker/Brand | D Powertrain | E Model | F Sales | G STEERING | H BEV/HEV INVERTER | I AIR COMPRESSOR | J TRANSMISSION |

## Fill rules
- Rank by **F (sales for the period), descending — top 10** in each table.
- **Table 2 scope = all electrified: HEV + PHEV + BEV** (confirmed with user). A
  strong HEV can legitimately rank #1 above pure EVs.
- Powertrain labels mirror the source: Table 1 tends to use `ICE`, `HEV`,
  `ICE & HEV`, `EV`, `PHEV`; Table 2 uses `HV`, `EV`, `PHEV`.
- Empty / not-applicable component → `-`.
- Multiple suppliers in one cell → join with ` / `.
- The **F column header updates monthly** (e.g. `Jan-May'26` → `Jan-Jun'26`);
  keep the same text pattern.

### No fabrication — hard rule
Observed failure mode (from a ChatGPT trial the user ran on the USA sheet): when
asked "how do you know the engine supplier?", it admitted to inferring suppliers
from brand reputation (e.g. "Toyota probably builds its own engine") instead of
reading them from the source file. **Never do this.**
- Fill a supplier cell **only** from what the user's pasted MarkLines/forecast
  data explicitly states for that model.
- No data for that cell → `-`. Never infer from brand identity, "in-house"
  assumptions, or prior-generation models, even if it seems like a safe guess.
- If the user explicitly asks for a best-guess/inferred fill, it's allowed —
  but call it out inline (e.g. "inferred, not in source") so it's never
  silently mixed with confirmed data.

## Customer highlight — cyan `00B0F0`, MODEL + COMPONENT specific
Workbook legend: *"Current customer that we supply parts to them."*

- Shade a supplier cell cyan **only if the forecast file shows we supply that
  customer for that exact model.**
- **Not highlighted = we have no part for that specific model's component**, even
  if the same company is our customer on other models. (A supplier can be our
  customer in general yet stay white on a model we don't have a part for.)
- **Never auto-highlight by company-name match alone** — verify each
  (customer, model) pair against the forecast. Company names combined with a
  partner in one cell (e.g. "X / Aisin") are highlighted only if the forecast
  pairs that specific customer with that model.

### Forecast file = source of truth for highlighting
- Column **B** = customer name.
- Columns around **HA:HB** = the car model(s) we supply.
- Build the set of (customer, model) pairs, then for each Top-10 row (model M)
  shade the component cell whose supplier S has a matching (S, M) pair.

## Inputs needed from the user each month
1. MarkLines Thailand Top-10 (overall + electrified) with suppliers per component.
2. The current forecast file (or its customer↔model columns) to compute highlights.

## Output format each month
1. TSV block, Table 1 (10 rows, cols B–L) — label "paste at B5".
2. TSV block, Table 2 (10 rows, cols B–J) — label "paste at B18".
3. "Cells to shade cyan" list, e.g. `Table1: G6,I6,K6,L6 · K7,L7 …  /  Table2: G18 …`.

## Privacy
Per the user's instruction, do **not** store the customer roster or the company
identity in this repo. Keep those only in the working session / the user's own
files. This method file stays generic.
