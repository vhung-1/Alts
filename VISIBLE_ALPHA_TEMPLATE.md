# Visible Alpha Consensus — Paste Template

Use this prompt to extract Visible Alpha consensus data for a single firm and
paste the result into `data.js` under `firms[TICKER].consensus`.

---

## Extraction Prompt

> For **[FIRM NAME]** (ticker: **[TICKER]**), pull the Visible Alpha consensus
> estimates for the most recently reported quarter (**[PERIOD]**) and the next
> two forward quarters. I need the following 7 metrics (where covered):
>
> | Key | Metric | Unit |
> |-----|--------|------|
> | `FRE` | Fee-Related Earnings | $M |
> | `PFRE` | Performance fees / PRE / realized carry | $M |
> | `FRE_ps` | FRE per share | $ |
> | `SRE_ps` | Spread-Related Earnings per share (Apollo etc.) | $ |
> | `DE_ps` | Distributable Earnings per share | $ |
> | `netFlowsTotal` | Net flows → total fee-paying AUM | $B |
> | `netFlowsCredit` | Net flows → fee-paying AUM (credit only) | $B |
>
> For each metric covered, return:
> - `cons`: VA consensus mean (most recently reported period actual if available)
> - `n`: number of analyst estimates
> - `act`: reported actual for the quarter (if already reported)
>
> Format the output as a JSON object I can paste directly.

---

## Output Format

```js
// Paste into data.js → firms.TICKER.consensus = { … }
{
  FRE:            { cons: 464, n: 11, act: 464 },
  PFRE:           { cons:  75, n:  8, act:  75 },
  FRE_ps:         { cons: 1.20, n: 12, act: 1.22 },
  SRE_ps:         { cons: 1.15, n:  9, act: 1.15 },   // Apollo only
  DE_ps:          { cons: 1.20, n: 12, act: 1.24 },
  netFlowsTotal:  { cons: 30.0, n:  7, act: 30.2 },
  netFlowsCredit: { cons: 18.0, n:  5, act: 18.5 },
}
```

Leave out any metric that VA does not cover for this firm.

---

## Worked Example — BX Q1 2026

```js
// firms.BX.consensus (Q1 2026 — as reported 2026-04-23)
{
  FRE:   { act: 1501 },          // $1,501M — from transcript
  PFRE:  { act: 448  },          // net realizations $448M
  FRE_ps:{ act: 1.26 },          // $1.26/sh
  DE_ps: { act: 1.36 },          // distributable earnings/sh
  // VA cons not yet populated — paste from Visible Alpha tearsheet
}
```

---

## Per-Firm Applicability

| Ticker | FRE | PFRE | FRE\_ps | SRE\_ps | DE\_ps | netFlowsTotal | netFlowsCredit |
|--------|-----|------|---------|---------|--------|--------------|----------------|
| BX     | ✓   | ✓    | ✓       | —       | ✓      | partial       | —              |
| KKR    | ✓   | ✓    | ✓       | —       | ✓      | —             | —              |
| APO    | ✓   | —    | ✓       | ✓       | ✓      | partial       | partial        |
| ARES   | ✓   | ✓    | —       | —       | ✓      | ✓             | ✓              |
| BAM    | ✓   | —    | ✓       | —       | ✓      | —             | —              |
| CG     | ✓   | ✓    | —       | —       | ✓      | —             | —              |
| TPG    | ✓   | ✓    | —       | —       | ✓      | —             | —              |
| OWL    | —   | —    | ✓       | —       | ✓      | —             | —              |
| PGHN   | —   | —    | —       | —       | —      | —             | —              |
| EQT    | —   | —    | —       | —       | —      | —             | —              |
| CVC    | —   | —    | —       | —       | —      | —             | —              |
| ICG    | —   | —    | —       | —       | —      | —             | —              |
| BPT    | —   | ✓    | —       | —       | —      | —             | —              |

**Notes:**
- PGHN, EQT, CVC, ICG, BPT are not covered by Visible Alpha (European names on semi-annual/annual cadence; limited sell-side coverage on VA).
- OWL does not separately report total FRE ($); only FRE per share.
- Apollo SRE\_ps is unique to Apollo's reporting framework.
- `cons` = Visible Alpha mean estimate; `n` = number of estimates; `act` = reported actual.
- Units: $M for FRE/PFRE; $ for per-share metrics; $B for net flows.
