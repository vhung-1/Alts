// reported.js — REPORTED quarterly figures (window.ALTS_REPORTED) that the deal-activity
// proxies in the Carry (Realizations) and Deployment tabs are meant to ANTICIPATE.
//
// The tool's thesis: PitchBook realization / deployment activity is observable INTRA-quarter
// (deal by deal, in near-real-time), whereas the fees those activities generate are only
// disclosed weeks later on the earnings call. So realization activity is a leading proxy for
// reported net realized performance fees, and deployment cadence is a leading proxy for
// reported transaction / capital-markets fees. These are the reported "ground-truth" rows.
//
//   carry[tk][q]  = { perf: <net realized performance fees, $M>, real: <reported realizations $M | null> }
//   deploy[tk][q] = { fees: <transaction / capital-markets fees, $M>, deployed: <capital deployed $M | null> }
//
// Scope: core US quarterly reporters (BX, KKR, APO, ARES, CG, TPG); trailing 6 quarters
// 2025 Q1 → 2026 Q2. Europeans / semi-annual names stay activity-only (no reported rows).
// Values in $M. Sources: S&P Global earnings-call transcripts + SEC 8-K earnings supplements.
// Per-firm line-item definitions live in `defs` (metrics are non-GAAP and differ by firm).
;(function () {
  window.ALTS_REPORTED = {
    asOf: "2026-08-16",
    quarters: ["2025 Q1", "2025 Q2", "2025 Q3", "2025 Q4", "2026 Q1", "2026 Q2"],
    // per-firm definitions (filled alongside the data below)
    defs: {},
    // net realized performance fees (perf) + reported realizations volume (real), $M
    carry: { BX: {}, KKR: {}, APO: {}, ARES: {}, CG: {}, TPG: {} },
    // transaction / capital-markets fees (fees) + capital deployed (deployed), $M
    deploy: { BX: {}, KKR: {}, APO: {}, ARES: {}, CG: {}, TPG: {} },
  };
})();
