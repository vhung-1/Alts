# Visible Alpha → Alts Tracker consensus template

Hand this whole file to Claude along with a **Visible Alpha tearsheet** (screenshot, PDF, or Excel) for **one firm**. Claude returns a JSON object you paste straight into `data.js` to light up that firm's **Consensus** tab (consensus vs. reported, with the surprise computed automatically).

---

## Prompt to give Claude

> You are extracting sell-side **consensus** figures from a Visible Alpha tearsheet for a single alternative-asset manager, to populate a dashboard.
>
> **Input:** the attached Visible Alpha tearsheet for **<TICKER>** (one of: BX, KKR, APO, ARES, BAM, CG, TPG, OWL, PGHN, EQT, CVC, ICG, BPT) for fiscal period **<PERIOD, e.g. Q1 2026 / FY2025>**.
>
> **Extract the consensus MEAN and the # of contributing estimates** for each of the 7 metrics below, for that period. Then give me a JSON object exactly in the shape under "Output format".
>
> **Metrics (key → meaning → unit):**
> 1. `FRE` — Fee-Related Earnings, total — **$M**
> 2. `PFRE` — Performance fees / performance-related earnings (use realized performance revenues, or "performance fee related earnings" if VA breaks it out) — **$M**
> 3. `FRE_ps` — FRE per share — **$**
> 4. `SRE_ps` — Spread-Related Earnings per share (Apollo-type insurers only) — **$**
> 5. `DE_ps` — Distributable Earnings per share — **$**
> 6. `netFlowsTotal` — net flows into fee-paying AUM, total, for the period — **$B**
> 7. `netFlowsCredit` — net flows into fee-paying AUM, credit only, for the period — **$B**
>
> **Rules:**
> - Report numbers in the units above (convert if the tearsheet differs: $bn→$M ×1000; keep per-share in $; net flows in $B).
> - For each metric give `cons` (consensus mean) and `n` (number of estimates). If the tearsheet shows the reported/actual too, also fill `act`; otherwise omit `act` (the dashboard already pre-fills reported actuals from transcripts).
> - **Only include metrics the tearsheet actually covers.** Omit any metric that isn't shown or isn't applicable (e.g. `SRE_ps` for non-insurers; `PFRE`/carry for Blue Owl). Do not guess or interpolate.
> - Note the consensus vintage/date and contributor count if shown.
> - Output **only** the JSON object, then a one-line note of anything ambiguous.

---

## Output format (what Claude returns — paste into `data.js`)

In `data.js`, set `window.ALTS.firms.<TICKER>.consensus = { ... }` to:

```json
{
  "FRE":            { "cons": 0,    "n": 0 },
  "PFRE":           { "cons": 0,    "n": 0 },
  "FRE_ps":         { "cons": 0.00, "n": 0 },
  "SRE_ps":         { "cons": 0.00, "n": 0 },
  "DE_ps":          { "cons": 0.00, "n": 0 },
  "netFlowsTotal":  { "cons": 0.0,  "n": 0 },
  "netFlowsCredit": { "cons": 0.0,  "n": 0 }
}
```

- `cons` = Visible Alpha consensus **mean**; `n` = number of contributing estimates.
- Add `"act": <number>` to any metric if you want to override the dashboard's pre-filled reported actual.
- **Drop any line the tearsheet doesn't cover** — e.g. for OWL omit `PFRE` (no carry); for non-Apollo names omit `SRE_ps`; for European names that don't report FRE/DE-per-share, include only what VA provides.

### Worked example — `BX`, Q1 2026

```js
window.ALTS.firms.BX.consensus = {
  FRE:            { cons: 1480, n: 12, act: 1501 },   // $M
  PFRE:           { cons: 470,  n: 9,  act: 448  },   // $M (realized perf. revenues)
  FRE_ps:         { cons: 1.24, n: 12, act: 1.26 },   // $
  DE_ps:          { cons: 1.33, n: 13, act: 1.36 },   // $
  netFlowsTotal:  { cons: 70,   n: 8 },               // $B
  netFlowsCredit: { cons: 40,   n: 6 },               // $B
};
```

(SRE_ps omitted — not applicable to Blackstone. `act` values already match the transcript-sourced reported figures the dashboard ships with; you can leave them off and the dashboard uses its own.)

---

## How the dashboard uses it

For each metric the Consensus tab shows **VA consensus · #est · Reported · Surprise**. `Surprise = act − cons` (absolute and %), green if reported beat consensus, red if it missed. Cells with no `cons` show `·` (awaiting VA). Reported actuals are pre-filled from each firm's latest transcript, so you only need to paste the `cons`/`n` values.

## Per-firm applicability cheat-sheet

| Firm | FRE | PFRE | FRE/sh | SRE/sh | DE/sh | Net flows (tot/credit) |
|---|---|---|---|---|---|---|
| BX, KKR, CG, ARES, TPG, BAM | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| APO | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| OWL | ✓ | — (no carry) | ✓ | — | ✓ | ✓ |
| PGHN, EQT, CVC, ICG, BPT | use VA's mgmt-fee/FRE-equiv & EPS lines; per-share FRE/DE often N/A | ✓ (carry/PRE) | if shown | — | if shown | if shown |
