# Alts Tracker

An interactive, single-page dashboard tracking the listed alternative-asset managers across five lenses:

1. **Fundraising** — the funds each manager flagged as *in market* on its latest earnings call, augmented with PitchBook fund data (target / hard cap, prior-fund size, amount raised, expected first & final close).
2. **Guidance** — forward earnings guidance pulled from each company's latest transcript (S&P Global) plus structured company-issued guidance, one table per firm.
3. **Consensus** — a Visible Alpha tearsheet scaffold for the 7 KPIs (FRE, perf fees/PRE, FRE/sh, SRE/sh, DE/sh, net flows to fee-paying AUM total & credit). Reported actuals are pre-filled from the transcripts; **paste the VA consensus into `data.js`** and the dashboard computes the surprise.
4. **Carry** — two views: **Exit activity** (PitchBook portfolio exits by quarter, 12 firms — Blue Owl excluded as it earns fees not carry) and **Net accrued carry** (fund-level, bottom-up from 10-Q disclosure for the 5 US firms that report it). The exit table is laid out **transposed** — quarters run across the top, `# Exits` / `Disclosed TV` down the side, click a quarter column to expand its individual exits — and each firm carries a **transcript check** that reconciles its last two earnings calls' monetization commentary against what PitchBook recorded (verdict: Match / Partial / Diverge).
5. **Deployment** — new investments each manager made, by quarter, from PitchBook's investor-investment feed (all 13 firms, Blue Owl included). Same transposed, click-to-expand layout as the exit table. PitchBook's investor feed exposes entry dates but **not** entry deal sizes, so this tab tracks deployment *cadence* (number of new investments per quarter) rather than dollars.

There is also an **Overview** tab with a per-firm snapshot and the cross-firm accrued-carry chart.

## Coverage

13 managers: **BX, KKR, APO, ARES, BAM, CG, TPG, OWL** (US, Q1 2026) and **PGHN, EQT, CVC, ICG, BPT** (Europe, FY2025 / FYE-Mar-2026 — semi-annual / annual cadence).

| Source | Used for |
|---|---|
| **S&P Global** (MCP) | latest earnings transcripts, company guidance, reported actuals, transcript-vs-exit check |
| **PitchBook Premium** (MCP) | investor funds (fundraising), portfolio exits, and new investments (deployment), by investor PBID |
| **Visible Alpha** | consensus (Section 3) — pasted into `data.js` by the user |
| **Company 10-Q / 10-K** | fund-level net accrued carry (KKR, BX, ARES, CG, APO) |

Data as of **2026-06-17** (`window.ALTS.meta.asOf`).

## Running it

It's a static site — no build step.

```
# from the repo root
python3 -m http.server 8000      # then open http://localhost:8000
```

Or just open `index.html` directly in a browser. **First paint needs network access** for the CDN libraries (React 18, Babel standalone, Google Fonts); it degrades gracefully with a message if those are blocked. To publish, point **GitHub Pages** at the repo root.

> `data.js` is loaded as a plain `<script>` (not `fetch`), so opening `index.html` from the local filesystem works without a server.

## File structure

```
index.html               Presentation only — design system, components, 5 tabs. No edits needed to refresh data.
data.js                  Main data layer (window.ALTS): firms, fundraising, guidance, consensus, accrued carry, momentum.
exits.js                 Full per-exit detail (window.ALTS_EXITS) powering the Carry > Exit activity quarterly tables
                         (click a quarter to expand). One object per exit: {c,d,s,t,h,f} = company, date, size $M,
                         type, holding (Maj/Min), fund (n/d — PitchBook's exit feed doesn't attribute the selling fund).
deploy.js                Full per-investment detail (window.ALTS_DEPLOY) powering the Deployment tab. One object per
                         new investment: {c,d,s,t} = company, entry date (investor_since), size $M (always null — the
                         investor feed doesn't expose entry size), type. All 13 firms incl. Blue Owl.
VISIBLE_ALPHA_TEMPLATE.md  Prompt + JSON template to compile Visible Alpha consensus from a tearsheet (Section 3).
.github/workflows/       GitHub Pages deploy workflow (auto-deploys main → vhung-1.github.io/Alts on every push).
README.md                This file.
```

## Updating each quarter

All data lives in `data.js` under `window.ALTS`.

### Per-firm schema — `window.ALTS.firms[TICKER]`

```js
{
  ticker, name, longName, exchange, country, color, cadence,
  period, periodEnd, reportDate,            // e.g. "Q1 2026", "2026-03-31", "2026-04-23"
  reported: { FRE, FRE_ps, fpAUM, DE_ps, ... },   // display strings for the snapshot cards
  fundraising: [ { name, strategy, status, target, hardCap, prevFund,
                   raisedToDate, firstClose, finalClose, pb, comment } ],
  fundraisingSummary: "…",
  guidance: [ { metric, period, value, source:"transcript"|"guidance tool", comment } ],
  guidanceSummary: "…",
  consensus: { <metricKey>: { cons, n, act } },
  exits: {
    quarterly: { "2026 Q1": { count, totalTV }, … },   // totalTV in $M; null → "n/d"
    notable:   [ { company, exitDate, exitSize, type, investorSince, flag } ],
    summary:   "…"
  }
}
```

Use `"N/A"` (string) for unknown fundraising fields and `null` for unknown numeric exit TV.

### Pasting Visible Alpha consensus (Section 3)

For each firm, set the `consensus` object keyed by the 7 metric keys. `cons` = VA mean, `n` = number of estimates, `act` = reported actual. The dashboard computes the surprise (Act − Cons, absolute and %) automatically and leaves a `·` where VA data is absent.

```js
window.ALTS.firms.BX.consensus = {
  FRE:            { cons: 1480, n: 12, act: 1501 },   // $M
  PFRE:           { cons: 470,  n: 9,  act: 448  },   // $M
  FRE_ps:         { cons: 1.24, n: 12, act: 1.26 },   // $
  SRE_ps:         { cons: null, n: 0,  act: null },   // $ (Apollo-type only)
  DE_ps:          { cons: 1.33, n: 13, act: 1.36 },   // $
  netFlowsTotal:  { cons: 70,   n: 8,  act: null },   // $B
  netFlowsCredit: { cons: 40,   n: 6,  act: null },   // $B
};
```

Metric keys (and units): `FRE` ($M), `PFRE` ($M), `FRE_ps` ($), `SRE_ps` ($), `DE_ps` ($), `netFlowsTotal` ($B), `netFlowsCredit` ($B). Reported actuals are already pre-filled from each firm's latest transcript where stated.

### Net accrued carry — `window.ALTS.accrued`

Fund-level net accrued carried interest for the 5 disclosing US firms (KKR, BX, ARES, CG, APO), ported from SEC 10-Q data and computed **bottom-up** from each fund. Net is derived where only one side is disclosed: KKR `net = gross × 0.25` (75% comp), Blackstone `gross = net / 0.56`, Carlyle `gross = net / 0.38`; Ares and Apollo carry both. Residual `Other / Adj.` lines reconcile to disclosed segment totals. Editing any fund figure propagates through the segment, firm and 5-firm totals automatically.

### Transcript-vs-exit check — `window.ALTS.exitRecon`

Powers the **Transcript check** strip under each firm's exit table. For the 12 carry firms, each entry reconciles management's monetization commentary from its **last two earnings calls** (S&P Global) against PitchBook's recorded exits in the same window:

```js
window.ALTS.exitRecon.BX = {
  verdict: "Partial",                                  // Match | Partial | Diverge
  transcripts: ["Q4 2025 — Jan 29, 2026", "Q1 2026 — Apr 23, 2026"],
  pbExits: "18 exits, ~$46.4B disclosed TV (Wiz $32B dominates Q1)",
  note: "1–2 sentence synthesis of commentary vs PitchBook.",
  points: ["MATCH: …", "GAP: …", "TONE: …"]            // bullet detail, shown when expanded
};
```

The common pattern across the names: management's realization narrative is **directionally** consistent with PitchBook, but PitchBook's investor-entity exit feed systematically **understates** volume — large IPOs, secondary sales, dividend recaps and credit/loan repayments often sit under fund or subsidiary entities (acute for BAM and the European names) and don't surface against the listed parent.

### Deployment — `window.ALTS_DEPLOY` (`deploy.js`)

New investments by quarter for all 13 firms, bucketed by PitchBook entry date (`investor_since`). The investor-investment feed gives the company and entry date but **not** the entry deal size, so the Deployment tab shows the *number* of new investments (deployment cadence), not dollars. Counts reflect what PitchBook surfaces per investor entity in-window and can understate very active managers (BAM is sparse — most Brookfield deals sit under the parent, not the asset-manager entity).

## Important caveats

- **Exit TV ≠ realized carry.** PitchBook "exit size" is the *total transaction / enterprise value* of the deal, not the manager's equity proceeds (stakes range ~15–100%). Per the KKR exit-pull study, PitchBook exit TV is a weak predictor of reported realized performance income (r < 0.35): fund-level crystallizations, open-market sales, advisory fees and clawbacks are invisible, while bankruptcies appear as "exits" with zero carry. Many exits carry no disclosed size, so quarterly TV is a partial minimum. Use as a directional activity proxy only.
- **Deployment is a count, not a dollar figure.** PitchBook's investor-investment feed exposes entry dates but not entry deal sizes, so the Deployment tab tracks the *number* of new investments per quarter. PitchBook also surfaces only a subset of each investor's activity in-window, so counts are a directional cadence proxy.
- **Transcript check is judgemental.** Verdicts (Match / Partial / Diverge) summarise whether management's last-two-quarters monetization commentary lines up with PitchBook; a "Partial" usually reflects PitchBook under-coverage rather than a management overstatement.
- **KKR net accrued carry is estimated** at 25% of gross (75% comp guidance); actual net varies by fund.
- **European names report semi-annually / annually** and in local currency (CHF/EUR/GBP); reported figures use each firm's own vocabulary (management fees / FRE-equivalent, EBITDA margin) rather than US FRE/DE-per-share, and some metrics are marked N/A.
- Reported actuals are as stated on each firm's latest earnings call. **Not investment advice.**

---

*Built with S&P Global and PitchBook Premium MCP connectors. Carry-accrual methodology adapted from the Alts Accrued Carry Dashboard.*
