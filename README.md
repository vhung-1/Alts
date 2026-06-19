# Alts Tracker

An interactive, single-page dashboard tracking the listed alternative-asset managers across five lenses:

1. **Fundraising** — the funds each manager flagged as *in market* on its latest earnings call, augmented with PitchBook fund data (target / hard cap, prior-fund size, amount raised, expected first & final close).
2. **Guidance** — forward earnings guidance pulled from each company's latest transcript (S&P Global) plus structured company-issued guidance, one table per firm.
3. **Consensus** — multi-period Visible Alpha consensus for the carry managers, in three views: **By company** (per-firm metric build — FRE, PRE/carry, DE, DE/sh, FRE/sh — across 2Q26E→FY28E with y/y growth and net-flow %), **Compare** (any metric or growth rate side-by-side across all managers, full-year basis), and **Valuation** (forward P / DE-per-share). Forward estimates only; loaded from `consensus.js`.
4. **Carry** — three views: **Exit activity** (PitchBook portfolio exits by quarter, 12 firms — Blue Owl excluded as it earns fees not carry), **IPOs & listings** (IPO and post-IPO open-market secondary deals — captures listings the exit feed misses when the GP keeps a stake), and **Net accrued carry** (fund-level, bottom-up from 10-Q disclosure for the 5 US firms that report it). The exit and IPO tables are laid out **transposed** — quarters run across the top, metrics down the side, click a quarter column to expand its detail — and each firm's exit table carries a **transcript check** reconciling its last two earnings calls' monetization commentary against what PitchBook recorded (verdict: Match / Partial / Diverge).
5. **Deployment** — new investments each manager made, by quarter, from PitchBook's investor-investment feed (all 13 firms, Blue Owl included). Same transposed, click-to-expand layout as the exit table. PitchBook's investor feed exposes entry dates but **not** entry deal sizes, so this tab tracks deployment *cadence* (number of new investments per quarter) rather than dollars.

There is also an **Overview** tab with a per-firm snapshot and the cross-firm accrued-carry chart.

## Coverage

13 managers: **BX, KKR, APO, ARES, BAM, CG, TPG, OWL** (US, Q1 2026) and **PGHN, EQT, CVC, ICG, BPT** (Europe, FY2025 / FYE-Mar-2026 — semi-annual / annual cadence).

| Source | Used for |
|---|---|
| **S&P Global** (MCP) | latest earnings transcripts, company guidance, reported actuals, transcript-vs-exit check |
| **PitchBook Premium** (MCP) | investor funds (fundraising), portfolio exits, and new investments (deployment), by investor PBID |
| **Visible Alpha** | consensus (Section 3) — multi-period estimates in `consensus.js` |
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
ipos.js                  IPO & public-listing events (window.ALTS_IPOS) for Carry > IPOs & listings. One object per
                         event: {c,d,s,t} = company, deal date, gross proceeds $M, type (IPO or post-IPO open-market
                         secondary). From PitchBook company-deal records — captures listings where the GP keeps a stake
                         (which the exit feed omits). 9 PE firms with captured events.
consensus.js             Multi-period Visible Alpha consensus (window.ALTS_CONSENSUS) for the Consensus tab. Per firm:
                         {cur, periods[], basis[], price, m:{FRE,PRE,DE,DE_ps,FRE_ps:{v[],pp[]}}, flow:{net[],bop[]}}.
                         v = period values, pp = prior-period values (y/y computed in-UI). 9 carry managers (US quarterly
                         2Q26E→FY28E, European half-year 1H26E→FY28E). Generated from VA pre-earnings tearsheets.
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
  consensus: { … },                         // legacy/unused — the Consensus tab now reads consensus.js
  exits: {
    quarterly: { "2026 Q1": { count, totalTV }, … },   // totalTV in $M; null → "n/d"
    notable:   [ { company, exitDate, exitSize, type, investorSince, flag } ],
    summary:   "…"
  }
}
```

Use `"N/A"` (string) for unknown fundraising fields and `null` for unknown numeric exit TV.

### Visible Alpha consensus (Section 3) — `window.ALTS_CONSENSUS` (`consensus.js`)

The Consensus tab reads `consensus.js` (multi-period), not `data.js`. Each firm carries forward consensus across its periods, with a prior-period array so the dashboard can compute y/y growth in the UI:

```js
window.ALTS_CONSENSUS = {
  asOf: "2026-06-18", fx: { EURSEK: 11.0 }, order: ["BX","KKR", …],
  firms: {
    BX: {
      cur: "USD",
      periods: ["2Q26E","3Q26E","4Q26E","2026E","2027E","2028E"],  // EU firms: half-year (1H26E,2H26E,…)
      basis:   [4,4,4,1,1,1],                                       // flow-% annualization multiplier per period
      price:   123.79,                                              // in DE/sh currency (EQT: SEK→EUR @ fx.EURSEK)
      m: {
        FRE:    { v:[…6 values…], pp:[…prior-period values for y/y…] },   // $M (€M for EU)
        PRE:    { v:[…], pp:[…] },   // net realized performance / carry, $M
        DE:     { v:[…], pp:[…] },   // distributable earnings, $M (EU: net profit, operating)
        DE_ps:  { v:[…], pp:[…] },   // DE per share, $ (EU: diluted EPS, operating)
        FRE_ps: { v:[…], pp:[…] },   // FRE per share, $
      },
      flow: { net:[…], bop:[…] }     // optional — net flows & BoP AUM for the flow-% row (where disclosed)
    }, …
  }
};
```

`v[i]` is the value for `periods[i]`; `pp[i]` is the prior-period value used for y/y (`v[i]/pp[i] − 1`). **Net flow %** = `net ÷ bop × basis` (annualized) and renders only where the AUM roll-forward is disclosed (BX, KKR, APO, EQT). **P/DE** = `price ÷ DE_ps` and is currency-neutral. Generated from the VA pre-earnings tearsheets (one `.xlsx` per firm); re-export and regenerate to refresh.

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

### IPOs & listings — `window.ALTS_IPOS` (`ipos.js`)

IPO and post-IPO open-market secondary events by quarter, with **gross proceeds ($M)**. This deliberately captures the gap in the exit feed: PitchBook only marks a holding "Former" (→ Exit activity) when the GP **fully** exits, so a sponsor that lists a company but keeps a stake never appears as an exit. These events instead come from PitchBook **company-deal** records (`get_company_deals`), which expose the IPO itself plus subsequent open-market sell-downs (the real realization events). Built from three sources: the IPO-type rows already in `exits.js` (full exits at listing), a set of **marquee/named listings** enriched precisely per company (e.g. Medline $7.2B Dec-2025 + sell-downs, StandardAero, Hexaware, Rigaku, X-energy, Klarna), and a **sequential per-company active-portfolio crawl** of the European managers' mature holdings (entered ≤2023). The crawl walks each firm's own `get_investor_investments` list — so firm attribution can't be cross-contaminated — and checks each company's `get_company_deals` for retained-stake listings. It surfaced events the exit feed misses entirely, e.g. **EQT**: Waystar Health (Nasdaq IPO $968M Jun-2024 + three open-market sell-downs), Klook, Indira IVF, WeWork India, Reworld Waste, First Student, Metlifecare, WS Audiology; and **ICG**: Visma (Mar-2026).

> **Coverage is effectively complete for the current dataset window.** EQT's mature active holdings (~105 companies) were fully crawled; CVC's first ~84 were scanned (no clean retained-stake IPOs — CVC's book is buyout/private-secondary heavy); for ICG (62 uncrawled holdings) and Bridgepoint (53 holdings), a targeted review of the most plausible IPO candidates by name (Workhuman, AmeriLife, IRIS Software Group, Cherry Stockholm, Brevo, Kyriba) confirmed all remain private or exited via private secondary — zero additional public listings in-window. The remaining holdings are small/mid-market European buyouts with negligible IPO probability. Recent active holdings (entered ≥2024) are intentionally skipped — they proved near-empty for in-window IPOs (e.g. KKR's 50 most-recent yielded zero). Exclusion rules: failed/withdrawn IPOs, pre-2024 listings, "Secondary Transaction - Private" (private stake sales), and primary follow-ons where the company raises capital / the GP buys in (e.g. CVC's PPC cornerstone participation) are all excluded — only IPOs and genuine GP open-market sell-downs count.

## Important caveats

- **Exit TV ≠ realized carry.** PitchBook "exit size" is the *total transaction / enterprise value* of the deal, not the manager's equity proceeds (stakes range ~15–100%). Per the KKR exit-pull study, PitchBook exit TV is a weak predictor of reported realized performance income (r < 0.35): fund-level crystallizations, open-market sales, advisory fees and clawbacks are invisible, while bankruptcies appear as "exits" with zero carry. Many exits carry no disclosed size, so quarterly TV is a partial minimum. Use as a directional activity proxy only.
- **Deployment is a count, not a dollar figure.** PitchBook's investor-investment feed exposes entry dates but not entry deal sizes, so the Deployment tab tracks the *number* of new investments per quarter. PitchBook also surfaces only a subset of each investor's activity in-window, so counts are a directional cadence proxy.
- **Transcript check is judgemental.** Verdicts (Match / Partial / Diverge) summarise whether management's last-two-quarters monetization commentary lines up with PitchBook; a "Partial" usually reflects PitchBook under-coverage rather than a management overstatement.
- **KKR net accrued carry is estimated** at 25% of gross (75% comp guidance); actual net varies by fund.
- **European names report semi-annually / annually** and in local currency (CHF/EUR/GBP); reported figures use each firm's own vocabulary (management fees / FRE-equivalent, EBITDA margin) rather than US FRE/DE-per-share, and some metrics are marked N/A.
- Reported actuals are as stated on each firm's latest earnings call. **Not investment advice.**

---

*Built with S&P Global and PitchBook Premium MCP connectors. Carry-accrual methodology adapted from the Alts Accrued Carry Dashboard.*
