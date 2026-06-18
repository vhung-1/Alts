/* ============================================================================
   ALTS TRACKER — PITCHBOOK EXIT DATA
   ----------------------------------------------------------------------------
   window.ALTS_EXITS[TICKER] = array of { c, d, s, t, h, f } objects:
     c = company name
     d = date (YYYY-MM-DD or YYYY-QN)
     s = exit size / transaction value $M (null if undisclosed)
     t = type (e.g. "M&A", "Buyout", "Secondary", "IPO", "Bankruptcy")
     h = holding type ("Maj" = majority, "Min" = minority, blank = unknown)
     f = flag / note (optional string)
   ============================================================================ */

;(function () {
  var E = (window.ALTS_EXITS = window.ALTS_EXITS || {});

  // ── BX ──
  E.BX = [
    { c:"Wiz",                    d:"2026-03-11", s:32000, t:"M&A",       h:"Min", f:"minority" },
    { c:"Resolution Life",        d:"2025-10-31", s:8200,  t:"M&A",       h:"Min", f:"minority" },
    { c:"Hotwire Communications", d:"2025-09-03", s:6200,  t:"Buyout",    h:"Maj", f:"" },
    { c:"Sitio Royalties",        d:"2025-08-19", s:4100,  t:"M&A",       h:"Min", f:"minority" },
    { c:"ARKA Group",             d:"2026-03-09", s:2600,  t:"M&A",       h:"Min", f:"minority" },
    { c:"HealthEdge",             d:"2025-06-01", s:2600,  t:"Buyout",    h:"Maj", f:"" },
    { c:"Rover Pipeline",         d:"2026-04-29", s:1625,  t:"Secondary", h:"Min", f:"minority; Q2'26" },
    { c:"Fidere Patrimonio",      d:"2026-03-30", s:1400,  t:"Buyout",    h:"Maj", f:"" },
    { c:"IDRx",                   d:"2025-02-21", s:1103,  t:"M&A",       h:"Min", f:"minority" },
    { c:"Ample",                  d:"2025-12-16", s:null,  t:"Bankruptcy",h:"",    f:"bankruptcy" },
  ];

  // ── KKR ──
  E.KKR = [
    { c:"WME Group",              d:"2025-03-24", s:13000, t:"Buyout",    h:"Min", f:"minority — not PE seller" },
    { c:"Colonial Pipeline",      d:"2025-07-31", s:9000,  t:"Buyout",    h:"Min", f:"~15% minority" },
    { c:"Resolution Life",        d:"2025-10-31", s:8200,  t:"M&A",       h:"Min", f:"minority" },
    { c:"OneStream",              d:"2026-04-01", s:6415,  t:"Buyout",    h:"Min", f:"minority; Q2'26 · 4.5x" },
    { c:"Darktrace",              d:"2024-10-01", s:5470,  t:"Buyout",    h:"Min", f:"minority; KCM advisor" },
    { c:"Kito Crosby",            d:"2026-02-03", s:2700,  t:"M&A",       h:"Maj", f:"" },
    { c:"Seiyu",                  d:"2025-07-01", s:2646,  t:"M&A",       h:"Maj", f:"" },
    { c:"Novaria Group",          d:"2026-01-13", s:2200,  t:"Buyout",    h:"Maj", f:"" },
    { c:"Ecorbit",                d:"2024-12-13", s:1468,  t:"Buyout",    h:"Maj", f:"" },
    { c:"Goodpack",               d:"2026-01-27", s:1400,  t:"M&A",       h:"Maj", f:"" },
  ];

  // ── APO ──
  E.APO = [
    { c:"Aspen Insurance Holdings",       d:"2026-02-24", s:3500, t:"M&A",                    h:"Min", f:"minority" },
    { c:"NSI Industries",                 d:"2026-06-09", s:3000, t:"M&A",                    h:"Min", f:"minority; Q2'26" },
    { c:"Invited Clubs",                  d:"2026-05-05", s:3000, t:"Buyout",                 h:"Maj", f:"Q2'26" },
    { c:"AB InBev metal-container plants",d:"2026-01-30", s:2900, t:"Secondary",              h:"Min", f:"minority" },
    { c:"Sun Country Airlines",           d:"2026-05-13", s:1386, t:"M&A",                    h:"Min", f:"minority; Q2'26" },
    { c:"Covis Pharma",                   d:"2025-03-14", s:1211, t:"Buyout",                 h:"Maj", f:"" },
    { c:"ADT",                            d:"2025-11-20", s:1172, t:"Buyout",                 h:"Maj", f:"" },
    { c:"QXO",                            d:"2026-01-20", s:753,  t:"Public 2nd offering",    h:"Min", f:"minority" },
    { c:"FWD Group",                      d:"2025-07-07", s:442,  t:"IPO",                    h:"Min", f:"minority" },
    { c:"Fisker",                         d:"2024-10-12", s:null, t:"Bankruptcy",             h:"",    f:"bankruptcy" },
  ];

  // ── ARES ──
  E.ARES = [
    { c:"Clario",                   d:"2026-03-24", s:8875, t:"M&A",    h:"Maj", f:"" },
    { c:"Global Healthcare Exchange",d:"2026-02-05", s:5000, t:"Buyout", h:"Maj", f:"" },
    { c:"Dotmatics",                d:"2025-07-01", s:4841, t:"M&A",    h:"Maj", f:"" },
    { c:"Team Services Group",      d:"2026-03-31", s:3000, t:"Buyout", h:"Maj", f:"" },
    { c:"Anaqua",                   d:"2025-02-25", s:2500, t:"Buyout", h:"Maj", f:"" },
    { c:"ENTRUST Solutions",        d:"2026-03-27", s:2400, t:"M&A",    h:"Maj", f:"" },
    { c:"Mavis Tires & Brakes",     d:"2026-02-20", s:2000, t:"IPO",    h:"Maj", f:"" },
    { c:"Club Atlético de Madrid",  d:"2026-03-12", s:1616, t:"Buyout", h:"Min", f:"" },
    { c:"McLaren Racing",           d:"2025-09-02", s:1500, t:"Buyout", h:"Min", f:"" },
    { c:"X-energy",                 d:"2026-04-24", s:1018, t:"IPO",    h:"Min", f:"minority" },
  ];

  // ── BAM ──
  E.BAM = [
    { c:"Aveo Group",                       d:"2025-07-21", s:2515, t:"Buyout",    h:"Maj", f:"parent entity" },
    { c:"Fundamental Income Properties",    d:"2025-07-23", s:2200, t:"Buyout",    h:"Maj", f:"parent entity" },
    { c:"Livensa Living",                   d:"2025-03-01", s:1249, t:"Buyout",    h:"Maj", f:"" },
    { c:"India Solar/Wind (1.6GW)",         d:"2025-04-07", s:900,  t:"Asset sale",h:"",    f:"" },
    { c:"Office tower, Sydney",             d:"2025-01-09", s:288,  t:"Asset sale",h:"",    f:"" },
    { c:"IOS Portfolio (13 props)",         d:"2024-12-27", s:278,  t:"Asset sale",h:"",    f:"" },
  ];

  // ── CG ──
  E.CG = [
    { c:"Neogov",                d:"2025-09-26", s:3000, t:"Buyout",   h:"Maj", f:"" },
    { c:"Golden Goose",          d:"2026-02-17", s:2958, t:"Buyout",   h:"Maj", f:"" },
    { c:"The Very Group",        d:"2026-01-09", s:2686, t:"Buyout",   h:"Maj", f:"" },
    { c:"Forgital Group",        d:"2024-12-17", s:2105, t:"Buyout",   h:"Maj", f:"" },
    { c:"StandardAero",          d:"2026-01-29", s:1550, t:"Secondary",h:"Min", f:"" },
    { c:"Hexaware Technologies", d:"2025-02-19", s:1008, t:"IPO",      h:"Min", f:"" },
    { c:"HSO Group",             d:"2025-08-13", s:1000, t:"Buyout",   h:"Maj", f:"" },
    { c:"Calastone",             d:"2025-10-14", s:898,  t:"M&A",      h:"Maj", f:"" },
    { c:"Tescan Group",          d:"2025-12-25", s:678,  t:"M&A",      h:"Maj", f:"" },
    { c:"1E",                    d:"2025-01-31", s:647,  t:"M&A",      h:"Maj", f:"" },
  ];

  // ── TPG ──
  E.TPG = [
    { c:"Intersect Power (digital power)", d:"2026-Q1",   s:5000, t:"Asset sale (to Google)",   h:"",    f:"Rise Climate" },
    { c:"Curium Pharma",                   d:"2026-Q1",   s:3800, t:"Continuation vehicle",      h:"Maj", f:"largest EU single-asset CV" },
    { c:"Ouro Medicines",                  d:"2026-03-22",s:1675, t:"M&A",                       h:"Maj", f:"" },
    { c:"Viking River Cruises",            d:"2025-05-27",s:1350, t:"Secondary",                 h:"Min", f:"" },
    { c:"PropertyGuru",                    d:"2024-12-13",s:1100, t:"Buyout",                    h:"Maj", f:"" },
    { c:"BETA Technologies",              d:"2025-11-04",s:1015, t:"IPO",                       h:"Min", f:"Rise Fund" },
    { c:"Elektrofi",                       d:"2025-11-18",s:810,  t:"M&A",                       h:"Maj", f:"" },
    { c:"ServiceTitan",                    d:"2024-12-12",s:625,  t:"IPO",                       h:"Min", f:"" },
    { c:"OneOncology",                     d:"2026-Q1",   s:null, t:"M&A (to Cencora)",          h:"",    f:"size n/d in PB" },
    { c:"Avalyn Pharma",                   d:"2026-04-30",s:300,  t:"IPO",                       h:"Min", f:"" },
  ];

  // ── OWL ──
  E.OWL = [
    { c:"SpaceX",                d:"2026-06-12", s:75000, t:"IPO (valuation)", h:"Min", f:"Q2'26; ~10x; sold ~half" },
    { c:"HPS Investment Partners",d:"2025-07-01", s:12221, t:"M&A",            h:"Min", f:"GP stake; to BlackRock" },
    { c:"Brex",                  d:"2026-04-07", s:5150,  t:"M&A",            h:"Min", f:"Q2'26" },
    { c:"Securiti",              d:"2025-12-08", s:1725,  t:"Buyout",         h:"Maj", f:"" },
    { c:"MapLight Therapeutics", d:"2025-10-27", s:251,   t:"IPO",            h:"Min", f:"" },
    { c:"EnGene",                d:"2025-11-14", s:107,   t:"Public 2nd offering", h:"Min", f:"" },
    { c:"Stonepeak (GP stake)",  d:"2026-01-28", s:null,  t:"Buyout",         h:"Min", f:"GP stake" },
  ];

  // ── PGHN ──
  E.PGHN = [
    { c:"atNorth",            d:"2026-02-26", s:4000, t:"M&A",       h:"Maj", f:"data centers/AI" },
    { c:"AmSurg",             d:"2025-06-17", s:3900, t:"M&A",       h:"Maj", f:"" },
    { c:"With Intelligence", d:"2025-11-25", s:1800, t:"M&A",       h:"Maj", f:"" },
    { c:"Vermaat Groep",      d:"2025-12-16", s:1743, t:"M&A",       h:"Maj", f:"" },
    { c:"VSB Holding",        d:"2025-04-01", s:1570, t:"M&A",       h:"Maj", f:"" },
    { c:"Klarna Group",       d:"2025-09-10", s:1372, t:"IPO",       h:"Min", f:"minority" },
    { c:"Form Technologies",  d:"2025-01-21", s:1074, t:"M&A",       h:"Maj", f:"" },
    { c:"Greenlink Interconnector",d:"2025-03-17",s:1000,t:"M&A",   h:"Maj", f:"" },
    { c:"Apex Logistics",     d:"2025-10-23", s:996,  t:"Secondary", h:"Min", f:"" },
    { c:"KinderCare",         d:"2024-10-09", s:576,  t:"IPO",       h:"Min", f:"" },
  ];

  // ── EQT ──
  E.EQT = [
    { c:"Galderma",           d:"2026-03-13", s:6325, t:"Secondary (block trade)", h:"Min", f:"~$20B gain; largest sponsor block trade ever" },
    { c:"O2 Power",           d:"2025-01-10", s:1500, t:"M&A",       h:"Maj", f:"India renewables" },
    { c:"WASH Multifamily Laundry",d:"2025-09-10",s:1075,t:"Buyout", h:"Maj", f:"" },
    { c:"Dellner Couplers",   d:"2026-02-10", s:960,  t:"M&A",       h:"Maj", f:"" },
    { c:"Kodiak Gas Services",d:"2025-12-02", s:338,  t:"Secondary", h:"Min", f:"minority" },
    { c:"Azelis Group",       d:"2026-02-26", s:225,  t:"Secondary", h:"Min", f:"" },
    { c:"Nexon Asia Pacific", d:"2025-12-17", s:null, t:"Buyout",    h:"Maj", f:"" },
    { c:"Melita",             d:"2025-07-08", s:null, t:"Buyout",    h:"Maj", f:"" },
  ];

  // ── CVC ──
  E.CVC = [
    { c:"Naturgy Energy Group",       d:"2026-05-26", s:3587, t:"Secondary (private)", h:"Min", f:"minority" },
    { c:"Alvogen Group",              d:"2025-12-03", s:2000, t:"M&A",                h:"Maj", f:"" },
    { c:"Ethniki Hellenic Insurance", d:"2025-11-27", s:694,  t:"M&A",                h:"Min", f:"" },
    { c:"OANDA",                      d:"2025-01-30", s:250,  t:"M&A",                h:"Maj", f:"" },
    { c:"Vitech Systems",             d:"2026-01-08", s:null, t:"Buyout",             h:"Maj", f:"" },
    { c:"Skybox Security",            d:"2025-02-24", s:null, t:"Buyout",             h:"Min", f:"minority" },
    { c:"Curalie",                    d:"2025-05-29", s:null, t:"Out of business",    h:"",    f:"write-off" },
  ];

  // ── ICG ──
  E.ICG = [
    { c:"With Intelligence",  d:"2025-11-25", s:1800, t:"M&A",       h:"Min", f:"minority" },
    { c:"Akuo Energy",        d:"2025-07-04", s:731,  t:"Buyout",    h:"Min", f:"minority" },
    { c:"PSB Academy",        d:"2026-01-12", s:544,  t:"Buyout",    h:"Maj", f:"" },
    { c:"Time Education",     d:"2025-09-03", s:65,   t:"Buyout",    h:"Maj", f:"" },
    { c:"Picard Surgelés",    d:"2024-12-18", s:null, t:"Buyout",    h:"Min", f:"minority" },
    { c:"Marston Holdings",   d:"2025-04-01", s:null, t:"Secondary", h:"Min", f:"minority" },
    { c:"Lunch Garden",       d:"2025-01-20", s:null, t:"Bankruptcy",h:"",    f:"loss" },
  ];

  // ── BPT ──
  E.BPT = [
    { c:"Dorna Sports (MotoGP)", d:"2025-07-03", s:3659, t:"M&A",    h:"Min", f:"minority" },
    { c:"Kereis",                d:"2025-10-27", s:2332, t:"Buyout",  h:"Maj", f:"" },
    { c:"Vermaat Groep",         d:"2025-12-16", s:1743, t:"M&A",    h:"Maj", f:"'standout return'" },
    { c:"Sun World International",d:"2026-03-13", s:1425, t:"Buyout", h:"Maj", f:"" },
    { c:"Cyrus Herez",           d:"2025-10-25", s:1400, t:"Buyout",  h:"Min", f:"minority" },
    { c:"The Flexitallic Group", d:"2026-04-01", s:475,  t:"M&A",    h:"Maj", f:"Q2'26" },
    { c:"Cruise.co.uk",          d:"2025-07-29", s:341,  t:"M&A",    h:"Maj", f:"" },
    { c:"Care UK",               d:"2024-10-01", s:null, t:"Buyout",  h:"Maj", f:"" },
  ];

})();
