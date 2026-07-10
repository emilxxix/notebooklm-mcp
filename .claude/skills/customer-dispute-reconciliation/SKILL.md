---
name: customer-dispute-reconciliation
description: Use when a customer disputes a compensation, dead-stock, forecast, or delivery-volume claim, or when internal numbers (production plan vs actual, survey vs confirmed order, email vs attached file) need to be reconciled before replying. Triggers on words like "compensation", "dead stock", "EOP", "survey", "confirm order", "PO", "actual ship", "customer disputes", "not accept", "reconcile numbers". Works for any customer/part, not tied to one case.
---

# Customer Dispute Reconciliation

A repeatable process for responding to a customer who disputes a compensation,
stock, or volume claim — used when the same numbers get quoted differently
across emails, tracking sheets, and forms, and a wrong or inconsistent reply
would weaken the company's position.

## 1. Reconstruct the timeline first, don't reply from memory

Before drafting anything, pull every source document (emails, tracking sheets,
survey files, sign-off forms) and lay them out in date order. Note who sent
what, and whether each figure was a **request**, a **revision**, or a
**confirmation**. Most disputes hinge on which of these three a number
actually was — not on the number itself.

## 2. Triangulate, don't trust a single row

The same "stock" or "volume" figure is often derivable from more than one
angle:
- Forecast vs Actual Order
- Production Plan vs Actual Production
- Actual Production vs Actual Ship (stock = prior stock + actual production − actual ship)
- The counterparty's own total vs the sum of their own line items

When two derivations disagree, recompute by hand from the most granular,
independently-verifiable inputs (actual ship/production dates, not
plans/forecasts) — that recomputation is the number to trust, even if it
overwrites a number already sent.

## 3. Verify the customer's specific claims — don't just restate them

If a customer says "X pcs was confirmed/delivered", check it against your own
actual shipment or production record for that exact period. Silently
accepting an unverified claim narrows your own position (e.g. accepting
"1,400 pcs delivered" when actual shipment for the whole month was only 400
pcs would concede a fact that isn't true).

## 4. Mine the counterparty's own documents for evidence, not just yours

An unsigned confirmation field, a blank "Supplier Confirm" column, or a
missing PO/deadline in a form **the customer themselves created and sent** is
stronger evidence than any assertion your own side makes, because it can't be
dismissed as self-serving. Always check for these before writing "we never
confirmed this."

## 5. Separate "asked/surveyed" from "confirmed/ordered"

The single most common root of these disputes: a customer's request,
inquiry, or "survey" is not an order. Look for the artifact that would prove
a real commitment (signed PO, dated confirm field, deadline-confirm date). No
artifact → no obligation, regardless of how urgent or detailed the request
looked. Restate this distinction plainly in the reply rather than assuming
it's understood.

## 6. Self-check before sending, every time

Before any reply goes out:
- Does every number in the email body match the attached file exactly?
- Does this reply contradict a position taken in an earlier email in the
  same thread? (e.g. claiming "we produced for it" in one email and "we
  never produced" in another — pick one, and make sure the data supports it)
- Does the stated *reason* actually explain the stated *number* (a low
  output explanation can't justify high leftover stock — check the direction
  of the logic, not just the words)
- Is the calculation in the email reproducible by hand from the raw data?

## 7. Draft short, evidence-first, polite replies

- Lead with the one or two facts that matter (a total, a date-by-date
  breakdown, a blank confirm field) — not a narrative.
- Keep it to a few short sentences; a long justification reads as less
  confident than a short one backed by a specific number.
- Close with a plain, polite ask ("we kindly ask you to reconsider...")
  rather than a demand — especially in supplier-to-customer correspondence
  where tone matters as much as the facts.
- Simple vocabulary over formal business English unless the recipient's own
  style is formal.

## Checklist before hitting send

- [ ] Every figure traced to its source (plan / actual production / actual
      ship / customer file) and internally reconciled
- [ ] Every customer claim fact-checked against your own actual data
- [ ] Counterparty's own documents checked for confirm/PO/deadline fields
- [ ] No contradiction with anything said earlier in the thread
- [ ] Numbers in the email body match the attached file
- [ ] Reply is short, leads with evidence, ends with a polite ask
