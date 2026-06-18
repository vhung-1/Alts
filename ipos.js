/* ============================================================================
   ALTS TRACKER — IPOs & LISTINGS DATA
   ----------------------------------------------------------------------------
   window.ALTS_IPOS[TICKER] = array of { c, d, s, t } objects:
     c = company name
     d = date (YYYY-MM-DD or YYYY-QN)
     s = proceeds/valuation $M (null if undisclosed)
     t = type ("IPO" | "Secondary - Open Market" | "Secondary (block trade)")
   ============================================================================ */

;(function () {
  var I = (window.ALTS_IPOS = window.ALTS_IPOS || {});

  // BX
  I.BX = [
    { c:"Medline Industries", d:"2025-09-15", s:5300, t:"IPO" },
    { c:"Medline Industries", d:"2025-11-12", s:1200, t:"Secondary - Open Market" },
  ];

  // KKR
  I.KKR = [
    { c:"OneStream", d:"2024-07-11", s:490, t:"IPO" },
  ];

  // APO
  I.APO = [
    { c:"FWD Group", d:"2025-07-07", s:442, t:"IPO" },
  ];

  // ARES
  I.ARES = [
    { c:"Mavis Tires & Brakes", d:"2026-02-20", s:null, t:"IPO" },
    { c:"X-energy", d:"2026-04-24", s:null, t:"IPO" },
  ];

  // BAM — no IPOs in recent quarters
  I.BAM = [];

  // CG
  I.CG = [
    { c:"StandardAero", d:"2024-10-03", s:1445, t:"IPO" },
    { c:"StandardAero", d:"2026-01-29", s:1550, t:"Secondary - Open Market" },
    { c:"Hexaware Technologies", d:"2025-02-19", s:1008, t:"IPO" },
  ];

  // TPG
  I.TPG = [
    { c:"BETA Technologies", d:"2025-11-04", s:1015, t:"IPO" },
    { c:"ServiceTitan", d:"2024-12-12", s:625, t:"IPO" },
    { c:"Avalyn Pharma", d:"2026-04-30", s:300, t:"IPO" },
  ];

  // OWL
  I.OWL = [
    { c:"MapLight Therapeutics", d:"2025-10-27", s:251, t:"IPO" },
  ];

  // PGHN
  I.PGHN = [
    { c:"Klarna Group", d:"2025-09-10", s:1372, t:"IPO" },
    { c:"KinderCare", d:"2024-10-09", s:576, t:"IPO" },
  ];

  // EQT — no IPOs (Galderma was a block trade / secondary)
  I.EQT = [
    { c:"Galderma", d:"2026-03-13", s:6325, t:"Secondary (block trade)" },
  ];

  // CVC — no recent IPOs
  I.CVC = [];

  // ICG — no recent IPOs
  I.ICG = [];

  // BPT — no recent IPOs
  I.BPT = [];

})();
