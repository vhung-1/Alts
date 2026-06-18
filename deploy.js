/* ============================================================================
   ALTS TRACKER — DEPLOYMENT / NEW INVESTMENTS DATA
   ----------------------------------------------------------------------------
   window.ALTS_DEPLOY[TICKER] = array of { c, d, s, t } objects:
     c = company / asset name
     d = entry / announcement date (YYYY-MM-DD or YYYY-QN)
     s = deal size $M (null — rarely disclosed for new investments)
     t = type / strategy (e.g. "PE Buyout", "Credit", "Infrastructure", "Real Estate")

   Sources: PitchBook Premium (new investments / lead rounds), earnings call
   commentary, press releases. Entry sizes almost never disclosed; use as
   a directional pipeline activity indicator only.
   ============================================================================ */

;(function () {
  var D = (window.ALTS_DEPLOY = window.ALTS_DEPLOY || {});

  // ── BX ──
  D.BX = [
    { c:"Copeland",                         d:"2023-04-01", s:null, t:"PE Buyout" },
    { c:"Jersey Mike's Subs",               d:"2024-12-01", s:null, t:"PE Buyout" },
    { c:"Civitas Resources (acq.)",         d:"2024-06-01", s:null, t:"PE / Energy" },
    { c:"Emerson Electric climate segment", d:"2023-05-01", s:null, t:"PE Buyout" },
    { c:"Hipgnosis Songs",                  d:"2024-09-01", s:null, t:"PE Buyout" },
    { c:"Tropical Smoothie Cafe",           d:"2024-09-01", s:null, t:"PE Buyout" },
    { c:"BCRED direct lending deployment",  d:"2026-Q1",   s:null, t:"Credit / BDC" },
    { c:"BCP Asia III deployment",          d:"2026-Q1",   s:null, t:"Asia PE" },
    { c:"Strategic Partners X deployment",  d:"2026-Q1",   s:null, t:"PE Secondaries" },
    { c:"BETP V deployment",                d:"2026-Q2",   s:null, t:"Energy Transition PE" },
  ];

  // ── KKR ──
  D.KKR = [
    { c:"Healtheon (SoftLayer medical)",     d:"2025-Q4",   s:null, t:"PE Buyout / Healthcare" },
    { c:"Kokusai Electric",                  d:"2023-10-01", s:null, t:"PE Buyout" },
    { c:"CoolIT Systems",                    d:"2025-Q1",   s:null, t:"PE / Technology" },
    { c:"Hyundai Marine & Fire Insurance",   d:"2024-09-01", s:null, t:"Financial Services" },
    { c:"Hyperion Materials & Technologies", d:"2024-Q1",   s:null, t:"PE Buyout" },
    { c:"North America Fund XIV deployment", d:"2026-Q1",   s:null, t:"Americas PE" },
    { c:"Global Infrastructure V deployment",d:"2026-Q1",   s:null, t:"Infrastructure" },
    { c:"K-Series deployment",               d:"2026-Q1",   s:null, t:"Wealth / Multi-strategy" },
    { c:"ABF direct lending deployment",     d:"2026-Q1",   s:null, t:"Credit / ABF" },
    { c:"Asia Pacific Fund V deployment",    d:"2026-Q2",   s:null, t:"Asia PE" },
  ];

  // ── APO ──
  D.APO = [
    { c:"Macy's (credit)",                  d:"2024-06-01", s:null, t:"Credit" },
    { c:"Intel Fab partnership",            d:"2024-08-01", s:null, t:"Infrastructure / Credit" },
    { c:"Brightspire Capital origination",  d:"2026-Q1",   s:null, t:"Real Estate Credit" },
    { c:"Athora reinsurance",               d:"2026-Q1",   s:null, t:"Insurance / Credit" },
    { c:"Atlas SP Partners deployment",     d:"2026-Q1",   s:null, t:"ABF / Structured Credit" },
    { c:"Hybrid Value Fund III deployment", d:"2026-Q1",   s:null, t:"Hybrid Equity" },
    { c:"Apollo Infrastructure Opp. III",   d:"2026-Q2",   s:null, t:"Infrastructure" },
    { c:"New Markets (stable value, structured settlements)", d:"2026-Q1", s:null, t:"Insurance / Annuities" },
    { c:"Fund XI pipeline",                 d:"2026-Q2",   s:null, t:"Corporate PE" },
    { c:"AI data-center financings",        d:"2026-Q1",   s:null, t:"Infrastructure / Credit" },
  ];

  // ── ARES ──
  D.ARES = [
    { c:"ASOF III deployment",              d:"2026-Q1",   s:null, t:"Opportunistic Credit" },
    { c:"ACF III (ABF) deployment",         d:"2026-Q2",   s:null, t:"Asset-Backed Finance" },
    { c:"SDL III direct lending deployment",d:"2026-Q1",   s:null, t:"Senior Direct Lending" },
    { c:"Ada Infra data-center investments",d:"2026-Q1",   s:null, t:"Digital Infrastructure" },
    { c:"European RE value-add (AEPEP IV)", d:"2025-Q4",   s:null, t:"Real Estate" },
    { c:"Japan Logistics Dev Fund V",       d:"2026-Q1",   s:null, t:"Real Estate" },
    { c:"ACE VI credit deployment",         d:"2026-Q1",   s:null, t:"Credit" },
    { c:"Ares Capital (ARCC) deployment",   d:"2026-Q1",   s:null, t:"Credit / BDC" },
    { c:"Anthos Capital (co-invest)",       d:"2026-Q1",   s:null, t:"PE Co-investment" },
    { c:"ACOF VI portfolio deployment",     d:"2026-Q1",   s:null, t:"Private Equity" },
  ];

  // ── BAM ──
  D.BAM = [
    { c:"Bloom Energy (AI Infra fund)",     d:"2026-Q1",   s:null, t:"AI Infrastructure" },
    { c:"Just Group insurance mandate",     d:"2026-Q1",   s:null, t:"Insurance / Real Assets" },
    { c:"BCP VI (flagship PE) deployment",  d:"2026-Q1",   s:null, t:"Private Equity" },
    { c:"BIF V (flagship Infra) pipeline",  d:"2026-Q1",   s:null, t:"Infrastructure" },
    { c:"Supercore infrastructure",         d:"2026-Q1",   s:null, t:"Infrastructure" },
    { c:"BGTF II energy transition",        d:"2026-Q1",   s:null, t:"Energy Transition" },
    { c:"17Capital NAV lending deployment", d:"2026-Q1",   s:null, t:"Credit / NAV Lending" },
    { c:"Oaktree credit deployment",        d:"2026-Q2",   s:null, t:"Credit" },
    { c:"Catalytic Transition Fund",        d:"2026-Q1",   s:null, t:"Climate / Concessional" },
    { c:"Data center / AI platform",        d:"2026-Q1",   s:null, t:"Digital Infrastructure" },
  ];

  // ── CG ──
  D.CG = [
    { c:"CP X pipeline (pre-launch)",       d:"2026-Q2",   s:null, t:"US Buyout" },
    { c:"Carlyle Europe Partners VI",       d:"2025-Q4",   s:null, t:"Europe Buyout" },
    { c:"AlpInvest secondaries deployment", d:"2026-Q1",   s:null, t:"PE Secondaries" },
    { c:"Carlyle ABF first close",          d:"2026-Q1",   s:null, t:"Asset-Backed Finance" },
    { c:"Carlyle Bravo credit deployment",  d:"2026-Q2",   s:null, t:"Opportunistic Credit" },
    { c:"Global Credit deployment",         d:"2026-Q1",   s:null, t:"Credit" },
    { c:"CGEP IV infrastructure",           d:"2026-Q1",   s:null, t:"Infrastructure" },
    { c:"NGP XIII energy",                  d:"2026-Q1",   s:null, t:"Natural Resources" },
    { c:"Corporate PE co-invests",          d:"2026-Q1",   s:null, t:"PE Co-investment" },
    { c:"AlpInvest co-investment deployment",d:"2026-Q1",  s:null, t:"PE Co-investment" },
  ];

  // ── TPG ──
  D.TPG = [
    { c:"Learfield (TPG Sports, first)",     d:"2026-Q1",   s:null, t:"Sports PE" },
    { c:"Jackson Financial ABF partnership", d:"2026-Q1",   s:null, t:"Credit / ABF" },
    { c:"TPG Capital X deployment",          d:"2026-Q1",   s:null, t:"PE Buyout" },
    { c:"TPG Rise Climate II deployment",    d:"2026-Q1",   s:null, t:"Climate / Impact" },
    { c:"TPG Healthcare Partners III",       d:"2026-Q1",   s:null, t:"Healthcare Buyout" },
    { c:"T-POP perpetual PE deployment",     d:"2026-Q1",   s:null, t:"PE / Perpetual" },
    { c:"TPG AG Net Lease Realty V",         d:"2026-Q1",   s:null, t:"Real Estate" },
    { c:"TPG RE Partners V pipeline",        d:"2026-Q2",   s:null, t:"Real Estate Opportunistic" },
    { c:"Credit ($33B dry powder deploy)",   d:"2026-Q1",   s:null, t:"Credit" },
    { c:"Asia RE Fund VI pipeline",          d:"2026-Q2",   s:null, t:"Asia Real Estate" },
  ];

  // ── OWL ──
  D.OWL = [
    { c:"Net Lease VI acquisitions",          d:"2026-Q1",   s:null, t:"Net Lease Real Estate" },
    { c:"OCIC (BDC) direct lending",          d:"2026-Q1",   s:null, t:"Credit / Direct Lending" },
    { c:"ORENT REIT acquisitions",            d:"2026-Q1",   s:null, t:"Net Lease Real Estate" },
    { c:"GP Stakes VI investments",           d:"2026-Q1",   s:null, t:"GP Minority Stakes" },
    { c:"BODI IV (data center) pipeline",     d:"2026-Q2",   s:null, t:"Digital Infrastructure" },
    { c:"European Net Lease Fund",            d:"2026-Q1",   s:null, t:"European Net Lease RE" },
    { c:"Digital infra ($100B+ pipeline)",    d:"2026-Q1",   s:null, t:"Digital Infrastructure" },
    { c:"Insurance (Oak Street) deployment",  d:"2026-Q1",   s:null, t:"Net Lease / Insurance" },
    { c:"OTIC wealth platform deployment",    d:"2026-Q1",   s:null, t:"Credit / Wealth" },
    { c:"GP co-investments",                  d:"2026-Q1",   s:null, t:"GP Strategic Capital" },
  ];

  // ── PGHN ──
  D.PGHN = [
    { c:"Infra IV deployment",               d:"2026-Q1",   s:null, t:"Infrastructure" },
    { c:"Private Equity II deployment",      d:"2026-Q1",   s:null, t:"Private Equity" },
    { c:"Private Credit evergreen",          d:"2026-Q1",   s:null, t:"Private Credit" },
    { c:"Next Gen Infrastructure",           d:"2026-Q1",   s:null, t:"Infrastructure Value-Add" },
    { c:"Partners Group Life II",            d:"2026-Q1",   s:null, t:"PE Semi-liquid" },
    { c:"Royalties LTAF",                    d:"2026-Q1",   s:null, t:"Royalties / Real Assets" },
    { c:"Bespoke mandate solutions",         d:"2026-Q1",   s:null, t:"Multi-strategy" },
    { c:"Direct Infra IV (final close H1'26)",d:"2026-H1",  s:null, t:"Infrastructure" },
    { c:"Co-investments / SMAs",             d:"2026-Q1",   s:null, t:"Co-investment" },
    { c:"Evergreen net inflows",             d:"2026-Q1",   s:null, t:"Multi-strategy Evergreen" },
  ];

  // ── EQT ──
  D.EQT = [
    { c:"BPEA IX (Asia) deployment",         d:"2026-Q2",   s:null, t:"Asia Buyout" },
    { c:"EQT X (PE) deployment",             d:"2026-Q1",   s:null, t:"PE Buyout" },
    { c:"Infra VI deployment",               d:"2026-Q1",   s:null, t:"Infrastructure" },
    { c:"EQT Nexus evergreen deployment",    d:"2026-Q1",   s:null, t:"Evergreen / Private Wealth" },
    { c:"AI Infrastructure (EdgeConneX seed)",d:"2026-Q1",  s:null, t:"Digital Infrastructure" },
    { c:"Healthcare Growth fund",            d:"2026-Q1",   s:null, t:"Healthcare" },
    { c:"EQT Ventures deployment",           d:"2026-Q1",   s:null, t:"Venture Capital" },
    { c:"Real Estate fund deployment",       d:"2026-Q1",   s:null, t:"Real Estate" },
    { c:"Transition Infrastructure",         d:"2026-Q1",   s:null, t:"Energy Transition" },
    { c:"Coller combination (secondaries)",  d:"2026-Q3",   s:null, t:"PE Secondaries" },
  ];

  // ── CVC ──
  D.CVC = [
    { c:"Fund IX (Europe/Americas) deployment",d:"2026-Q1",  s:null, t:"Large-cap Buyout" },
    { c:"Secondaries VI deployment",           d:"2026-Q1",  s:null, t:"PE Secondaries" },
    { c:"CVC Catalyst III deployment",         d:"2026-Q1",  s:null, t:"EU Mid-market Growth" },
    { c:"European Direct Lending deployment",  d:"2026-Q1",  s:null, t:"Direct Lending" },
    { c:"Asia Pacific VI deployment",          d:"2026-Q1",  s:null, t:"Asia-Pacific Buyout" },
    { c:"AIG partnership ($3.5B)",             d:"2026-Q1",  s:null, t:"Insurance / Credit" },
    { c:"Marathon Credit (acq. Q3'26)",        d:"2026-Q3",  s:null, t:"Credit (~$20B FPAUM)" },
    { c:"CVC-CRED evergreen deployment",       d:"2026-Q1",  s:null, t:"Evergreen Credit" },
    { c:"CVC-PAT (US PE, launched Q1'26)",     d:"2026-Q1",  s:null, t:"Evergreen PE" },
    { c:"Infrastructure deployment",           d:"2026-Q1",  s:null, t:"Infrastructure" },
  ];

  // ── ICG ──
  D.ICG = [
    { c:"Europe IX (structured capital)",   d:"2026-Q1",   s:null, t:"Structured Capital / Mezz" },
    { c:"Senior Debt Partners 5",           d:"2026-Q1",   s:null, t:"European Direct Lending" },
    { c:"Infrastructure Equity II",         d:"2026-Q1",   s:null, t:"Infrastructure" },
    { c:"Metropolitan I (real estate)",     d:"2026-Q1",   s:null, t:"Real Estate Opportunistic" },
    { c:"LP Secondaries Fund II",           d:"2026-Q1",   s:null, t:"LP-led Secondaries" },
    { c:"Excelsior SE IV (GP-led sec.)",    d:"2026-Q1",   s:null, t:"GP-led Secondaries" },
    { c:"Amundi wealth partnership",        d:"2026-Q1",   s:null, t:"Private Wealth / Credit" },
    { c:"Co-investments (ICG balance sheet)",d:"2026-Q1",  s:null, t:"Co-investment" },
    { c:"SMAs / separately managed accts",  d:"2026-Q1",   s:null, t:"Multi-strategy" },
    { c:"FEAUM not-yet-earning ($19B)",     d:"2026-Q1",   s:null, t:"Various (latent)" },
  ];

  // ── BPT ──
  D.BPT = [
    { c:"BE VIII (EU mid-market PE)",        d:"2026-Q2",   s:null, t:"European Mid-market Buyout" },
    { c:"ECP VI (energy transition infra)",  d:"2026-Q1",   s:null, t:"US Energy Transition Infra" },
    { c:"BDL IV (direct lending) deployment",d:"2026-Q1",  s:null, t:"European Direct Lending" },
    { c:"BCO V (credit special sits.)",      d:"2026-Q2",   s:null, t:"Credit Special Situations" },
    { c:"Newbury VI (secondaries) pipeline", d:"2026-Q3",   s:null, t:"PE Secondaries" },
    { c:"Bridgepoint Generations deployment",d:"2026-Q1",   s:null, t:"Wealth / Evergreen PE" },
    { c:"KKR data-center co-invest (ECP)",   d:"2026-Q1",   s:null, t:"Digital Infrastructure" },
    { c:"Calpine (Constellation, remaining)",d:"2026-Q1",   s:null, t:"Energy / Power" },
    { c:"BE VIII co-investments",            d:"2026-Q2",   s:null, t:"PE Co-investment" },
    { c:"European HNW co-invest program",    d:"2026-Q1",   s:null, t:"PE Co-investment / Wealth" },
  ];

})();
