/* ============================================================================
   ALTS TRACKER — DATA LAYER
   ----------------------------------------------------------------------------
   Everything the dashboard renders lives in this one file. Update it each
   quarter; index.html is pure presentation and never needs editing.

   Sources: S&P Global (transcripts + guidance) · PitchBook Premium (investor
   funds & portfolio exits) · company 10-Q/10-K (accrued carry) ·
   Visible Alpha (consensus — see CONSENSUS note below).

   ── Per-firm schema (window.ALTS.firms[TICKER]) ──────────────────────────────
     ticker, name, longName, exchange, country, color, cadence,
     period, periodEnd (YYYY-MM-DD), reportDate (YYYY-MM-DD),
     reported: { FRE, FRE_ps, fpAUM, ... }   // display strings for snapshot cards
     fundraising: [ { name, strategy, status, target, hardCap, prevFund,
                      raisedToDate, firstClose, finalClose, pb, comment } ],
     fundraisingSummary: "…",
     guidance:    [ { metric, period, value, source:"transcript"|"guidance tool", comment } ],
     guidanceSummary: "…",
     consensus:   { <metricKey>: { cons:<VA mean>, n:<#est>, act:<reported> } },
     exits: { quarterly: { "2026 Q1": {count, totalTV($M)}, … }, notable:[…], summary }

   ── CONSENSUS (Section 3 — Visible Alpha) ────────────────────────────────────
   The 7 metric keys are: FRE, PFRE, FRE_ps, SRE_ps, DE_ps, netFlowsTotal,
   netFlowsCredit (units: $M, $M, $, $, $, $B, $B). `act` (reported actual) is
   pre-filled from each firm's latest transcript where stated; paste the Visible
   Alpha `cons` (mean) and `n` (# estimates) per metric and the dashboard computes
   the surprise automatically. Leave a metric out if VA doesn't cover it.
   ============================================================================ */

window.ALTS = {
  meta: {
    asOf: "2026-06-17",
    note: "US large-caps at Q1 2026 (Mar 31); European names on semi-annual/annual cadence (FY2025 or FYE Mar-26).",
  },

  // Display order (left→right). All 13 mandate names.
  order: ["BX","KKR","APO","ARES","BAM","CG","TPG","OWL","PGHN","EQT","CVC","ICG","BPT"],

  consensusMetrics: [
    { key:"FRE",            label:"Fee-Related Earnings",        unit:"$M" },
    { key:"PFRE",           label:"Perf. fees / PRE",            unit:"$M" },
    { key:"FRE_ps",         label:"FRE per share",               unit:"$"  },
    { key:"SRE_ps",         label:"SRE per share",               unit:"$", note:"Apollo etc." },
    { key:"DE_ps",          label:"DE per share",                unit:"$"  },
    { key:"netFlowsTotal",  label:"Net flows → fee-paying AUM", unit:"$B" },
    { key:"netFlowsCredit", label:"Net flows → FPAUM (credit)", unit:"$B" },
  ],

  // Near-term fundraising momentum (editorial ranking from the latest-call + PitchBook reads). Tier: Very High | High | Moderate | Steady.
  fundraisingMomentum: [
    { tk:"BX",  tier:"Very High", driver:"$69B raised in Q1 (~$250B LTM); BXLS VI & COF V hit hard caps, BCP Asia III at its $13B cap; Strategic Partners X (>$22B) + Energy Transition V now launching." },
    { tk:"KKR", tier:"Very High", driver:"North America XIV closed at a record $23B; Asia V first close ~mid-26; Europe VI, Global Infra V & RE Americas IV in market; K-Series +80% YoY." },
    { tk:"ARES",tier:"Very High", driver:"Record $30B Q1 (+46%); ASOF III closed ~$10B; ACF III at hard cap (Q2), SDL IV launching (Q3/Q4), data-center fund first close (summer). $125B 2028 target." },
    { tk:"APO", tier:"Very High", driver:"$115B inflows incl. Athora/PIC ($50B organic); HVF III closed $6.5B, Accord VII $1.9B; Fund XI in market; origination $71B (+25%)." },
    { tk:"EQT", tier:"High",      driver:"BPEA IX closed at its $15.6B hard cap (largest-ever Asia PE fund); EQT XI and Infrastructure VII both launching ~mid-26; record €1B Q1 evergreen net inflows." },
    { tk:"CG",  tier:"High",      driver:"Fundraising 'super cycle': AlpInvest record $6.8B in Q1; CP X anchored by a $5B cornerstone (launch H2-26); new ABF strategy first close." },
    { tk:"CVC", tier:"High",      driver:"Record €23B FY25; Secondaries VI (>$8.5B) nearing final close, Catalyst III oversubscribed ($2B); flagship Fund X in pre-marketing (launch early 2027)." },
    { tk:"TPG", tier:"Moderate",  driver:"$50B+ 2026 target ($10B in Q1); Capital X & Healthcare III final closes H2; Rise Climate II final close Q3." },
    { tk:"BAM", tier:"Moderate",  driver:"Expects largest-ever year; flagship PE $6B first close + flagship infra first close in 2026; AI infra fund; $40B Just Group mandate." },
    { tk:"ICG", tier:"Moderate",  driver:"$17B in FY26 (beat plan); Europe IX (>€10B) nearing final close; LP Secondaries II (launched Dec-25) anchors FY27. $55B 4-yr target ~a year early." },
    { tk:"BPT", tier:"Moderate",  driver:"€24B-by-2026 target on track (€14B raised); BE VIII first close Q2; ECP VI final close brought forward to H2." },
    { tk:"PGHN",tier:"Steady",    driver:"$26B organic in FY25 (+22%); evergreen-led (33 vehicles); Direct Infra IV closes H1-26. Momentum is broad/recurring rather than flagship-spiky." },
    { tk:"OWL", tier:"Steady",    driver:"$11B Q1 ($57B LTM); Net Lease VI tracking to its $7.5B hard cap by year-end; BODI IV initial close H2; perpetual/wealth vehicles drive steady flows." },
  ],

  firms: {

    // ───────────────────────── BX (pending agent) ─────────────────────────
    BX: {
      ticker:"BX", name:"Blackstone", longName:"Blackstone Inc.", exchange:"NYSE", country:"US",
      color:"#6D28D9", cadence:"quarterly", period:"Q1 2026", periodEnd:"2026-03-31", reportDate:"2026-04-23",
      reported:{ FRE:"$1,501M", FRE_ps:"$1.26", fpAUM:"$938B", DE_ps:"$1.36", comment:"FRE $1.5B (+23% YoY, top-3 quarter ever); DE $1.8B; net realizations $448M (+26%); total AUM $1.34T; $69B inflows in Q1 (~$250B LTM)." },
      fundraising:[
        { name:"BCP Asia III", strategy:"Asia PE", status:"Final close (Jun'26)", target:"$13B", hardCap:"$13B", prevFund:"$6B (Asia II)", raisedToDate:"$13.1B", firstClose:"N/A", finalClose:"2026-06", pb:"26168-32F", comment:"~2x prior vintage; ~$12B raised incl. April closings, at hard cap." },
        { name:"Strategic Partners X", strategy:"PE Secondaries", status:"In market", target:">$22B", hardCap:"N/A", prevFund:"$22B (SP IX)", raisedToDate:"$11B", firstClose:"Q1 2026", finalClose:"N/A", pb:"N/A", comment:"+$6B in Q1 to $11B (~halfway); fee holiday until later 2026." },
        { name:"Energy Transition Partners V (BETP V)", strategy:"Energy Transition PE", status:"In market", target:">$5.6B", hardCap:"N/A", prevFund:"$5.6B (BETP IV)", raisedToDate:"$1.7B", firstClose:"2026-04", finalClose:"N/A", pb:"21794-41F", comment:"Initial close post-quarter; expected materially larger on AI/energy demand." },
        { name:"Life Sciences VI (BXLS VI)", strategy:"Life Sciences", status:"Final close (Q1'26)", target:"$6.3B", hardCap:"$6.3B", prevFund:"$4.5B (BXLS V)", raisedToDate:"$6.3B", firstClose:"N/A", finalClose:"Q1 2026", pb:"26056-81F", comment:"Industry-record life-sciences fund, ~40% larger; 50% non-US capital." },
        { name:"Credit Opportunities Fund V (COF V)", strategy:"Opportunistic Credit", status:"Final close (Q1'26)", target:"N/A", hardCap:">$10B", prevFund:"N/A", raisedToDate:">$10B investable", firstClose:"N/A", finalClose:"Q1 2026", pb:"26628-94F", comment:"Among the largest institutional credit raises in firm history; oversubscribed." },
        { name:"Capital Partners IX (BCP IX)", strategy:"Corporate PE", status:"In market", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"19747-36F", comment:"New corporate-PE flagship cycle; fee holiday initially." },
      ],
      fundraisingSummary:"Strong Q1'26 cycle: two flagships reached final close (BXLS VI at its $6.3B hard cap, COF V at >$10B), BCP Asia III hit its $13B hard cap by June. SP X is at $11B of a >$22B target and BETP V launched at $1.7B. Total inflows $69B in Q1 (~$250B LTM); management guided base-fee acceleration into H2'26 as drawdown funds come off fee holidays.",
      guidance:[
        { metric:"FRE growth", period:"FY2026", value:"Continued momentum", source:"transcript", comment:"Q1 FRE +23% YoY; sequential acceleration expected in H2 as drawdown funds activate." },
        { metric:"Management fees", period:"FY2026", value:"Bottom mid-year, accelerate to Q4", source:"transcript", comment:"+15% YoY combined ex-real-estate; RE segment declining modestly." },
        { metric:"Realizations", period:"H2 2026", value:"Robust if Middle East resolves", source:"transcript", comment:"IPO pipeline intact; recent volatility pushes exits out near-term." },
        { metric:"BCRED net flows", period:"Near-term", value:"Negative (−$1.4B Q1)", source:"transcript", comment:"Repurchases elevated; institutional/insurance (75% of credit) strong." },
        { metric:"Stock-based comp", period:"FY2026", value:"Materially lower than Q1 rate", source:"transcript", comment:"Seasonal pattern." },
        { metric:"Inflows / AUM", period:"FY2026", value:"Continued growth (AUM $1.34T)", source:"transcript", comment:"'Greater firepower than ever.'" },
      ],
      guidanceSummary:"No quantitative FRE guidance via the S&P tool (none returned). From the call: H2'26 management-fee acceleration as new drawdown funds (SP X, BETP V, BCP Asia III, BCP IX) come off fee holidays, partly offset by near-term BDC/wealth softness and RE headwinds. Realization pipeline strong but contingent on a Middle East resolution.",
      consensus:{ FRE:{cons:1564,n:15}, PFRE:{cons:484,n:15}, FRE_ps:{cons:1.27,n:15}, DE_ps:{cons:1.39,n:15}, netFlowsTotal:{cons:30.7,n:15}, netFlowsCredit:{cons:12.9,n:15} },  // 2Q26E VA cons (10-Jun-26); PFRE=net realizations
      exits:{ quarterly:{
        "2023 Q2":{count:13,totalTV:822}, "2023 Q3":{count:12,totalTV:1183}, "2023 Q4":{count:2,totalTV:0}, "2024 Q1":{count:9,totalTV:1305},
        "2024 Q2":{count:9,totalTV:1133}, "2024 Q3":{count:9,totalTV:3925}, "2024 Q4":{count:8,totalTV:1135}, "2025 Q1":{count:8,totalTV:1946},
        "2025 Q2":{count:10,totalTV:3469}, "2025 Q3":{count:7,totalTV:11101}, "2025 Q4":{count:10,totalTV:10178}, "2026 Q1":{count:9,totalTV:34579} },
        notable:[
          { company:"Wiz", exitDate:"2026-03-11", exitSize:"$32,000M", type:"M&A", investorSince:"2021", flag:"minority" },
          { company:"Resolution Life", exitDate:"2025-10-31", exitSize:"$8,200M", type:"M&A", investorSince:"2023", flag:"minority" },
          { company:"Hotwire Communications", exitDate:"2025-09-03", exitSize:"$6,200M", type:"Buyout", investorSince:"2021", flag:"" },
          { company:"Sitio Royalties", exitDate:"2025-08-19", exitSize:"$4,100M", type:"M&A", investorSince:"2022", flag:"minority" },
          { company:"ARKA Group", exitDate:"2026-03-09", exitSize:"$2,600M", type:"M&A", investorSince:"2019", flag:"minority" },
          { company:"HealthEdge", exitDate:"2025-06-01", exitSize:"$2,600M", type:"Buyout", investorSince:"2020", flag:"" },
          { company:"Rover Pipeline", exitDate:"2026-04-29", exitSize:"$1,625M", type:"Secondary", investorSince:"2017", flag:"minority; Q2'26" },
          { company:"Fidere Patrimonio", exitDate:"2026-03-30", exitSize:"$1,400M", type:"Buyout", investorSince:"2013", flag:"" },
          { company:"IDRx", exitDate:"2025-02-21", exitSize:"$1,103M", type:"M&A", investorSince:"2024", flag:"minority" },
          { company:"Ample", exitDate:"2025-12-16", exitSize:"N/A", type:"Bankruptcy", investorSince:"2021", flag:"bankruptcy" },
        ],
        summary:"PitchBook returned 56 of 3,875 records. Q1'26 TV is dominated by the Wiz $32B M&A; many real-estate asset-level sales carry no disclosed TV, understating volume. Marquee exits Wiz/Resolution Life/Sitio/ARKA are minority positions — exit TV ≠ BX proceeds." },
    },

    // ───────────────────────── KKR (pending agent) ─────────────────────────
    KKR: {
      ticker:"KKR", name:"KKR", longName:"KKR & Co. Inc.", exchange:"NYSE", country:"US",
      color:"#B45309", cadence:"quarterly", period:"Q1 2026", periodEnd:"2026-03-31", reportDate:"2026-05-05",
      reported:{ FRE:"$981M", FRE_ps:"$1.13", fpAUM:"—", DE_ps:"$1.39", comment:"FRE/sh $1.13 (+23%); realized carry $720M (+120%); ANI $1.39/sh; TOE $1.47/sh; mgmt-fee base +30% YoY; insurance op earnings $260M." },
      fundraising:[
        { name:"North America Fund XIV", strategy:"Americas PE", status:"Final close (Q1'26)", target:"$22B", hardCap:"N/A", prevFund:"$19B (NA XIII)", raisedToDate:"$23B", firstClose:"N/A", finalClose:"Q1 2026", pb:"25953-04F", comment:"Record PE close; combined PE vintage (Americas+Europe+Asia) ~$46B to invest." },
        { name:"Asia Pacific Fund V", strategy:"Asia PE", status:"In market", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"N/A", firstClose:"~mid-2026", finalClose:"N/A", pb:"N/A", comment:"CFO: 'on track for a strong first close around midyear'." },
        { name:"European Fund VI", strategy:"Europe PE", status:"In market", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"N/A", comment:"Active in the next 12–18-month PE slate." },
        { name:"Global Infrastructure Investors V", strategy:"Global Infrastructure", status:"In market", target:"N/A", hardCap:"N/A", prevFund:"~$17B (GII IV)", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"23764-06F", comment:"Real-assets slate; core/Asia infra + climate also active." },
        { name:"Real Estate Partners Americas IV", strategy:"Opportunistic RE", status:"In market", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"24344-92F", comment:"Opportunistic RE equity + RE credit in market." },
        { name:"K-Series (wealth suite)", strategy:"Multi-strategy wealth", status:"Perpetual / ongoing", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"$38B AUM (+80% YoY)", firstClose:"N/A", finalClose:"N/A", pb:"N/A", comment:"$4B raised in Q1; ~$250M redemptions; long runway from a low base." },
      ],
      fundraisingSummary:"KKR raised $28B in Q1'26, led by credit ($15B; ABF AUM >$90B). North America XIV closed at a record $23B; the Americas+Europe+Asia PE vintage is ~$46B to invest. K-Series wealth AUM hit $38B (+80% YoY). LTM raises ~$127B. Broad pipeline across PE (Asia/Europe/tech & healthcare growth), real assets (global/core/Asia infra, climate) and credit (ABF, direct lending, CLOs).",
      guidance:[
        { metric:"FRE per share", period:"FY2026", value:"Exceed target", source:"transcript", comment:"'Very confident' in exceeding FRE/sh targets; Q1 FRE/sh $1.13." },
        { metric:"Adjusted Net Income / sh", period:"FY2026", value:"Below $7.00", source:"transcript", comment:"Entered year targeting $7+ (45% growth); now likely below on delayed exits; carry shifts to 2027+." },
        { metric:"Forward monetization", period:"Q2–Q4 2026", value:">$1.2B gross", source:"transcript", comment:"Largest forward-monetization figure in KKR history (signed/expected to close)." },
        { metric:"Strategic Holdings op. earnings", period:"FY2026", value:">$350M", source:"transcript", comment:"$48M in Q1; back-end weighted." },
        { metric:"Insurance (GA) op. earnings", period:"FY2026", value:"~$300M+/qtr run-rate", source:"transcript", comment:"$260M in Q1; ~low-double-digit ROE target." },
        { metric:"Fundraising", period:"FY2026", value:"Exceed target", source:"transcript", comment:"Broad pipeline across strategies/geographies." },
        { metric:"Total Operating Earnings", period:"FY2026", value:"Exceed target", source:"transcript", comment:"TOE $1.47/sh in Q1 (+18%); ~85% recurring." },
      ],
      guidanceSummary:"Held FRE and fundraising guidance but cut ANI below the initial $7/share target on delayed exits (volatility), with carry shifting to 2027+. Flagged a record >$1.2B forward-monetization pipeline (OneStream, CoolIT, Hyundai Marine, infra/PE). Strategic Holdings (>$350M) and insurance (~$300M+/qtr) maintained. (S&P guidance tool not used; transcript-sourced.)",
      consensus:{ FRE:{cons:1070,n:12}, PFRE:{cons:184,n:12}, FRE_ps:{cons:1.17,n:12}, DE_ps:{cons:1.39,n:12} },  // 2Q26E VA cons (10-Jun-26); DE_ps=ANI/adj sh; net flows n/a in export
      exits:{ quarterly:{
        "2023 Q2":{count:12,totalTV:8719}, "2023 Q3":{count:16,totalTV:3711}, "2023 Q4":{count:7,totalTV:2731}, "2024 Q1":{count:9,totalTV:3138},
        "2024 Q2":{count:7,totalTV:339}, "2024 Q3":{count:4,totalTV:0}, "2024 Q4":{count:6,totalTV:8038}, "2025 Q1":{count:7,totalTV:15368},
        "2025 Q2":{count:7,totalTV:642}, "2025 Q3":{count:6,totalTV:11646}, "2025 Q4":{count:6,totalTV:9743}, "2026 Q1":{count:4,totalTV:6300} },
        notable:[
          { company:"WME Group", exitDate:"2025-03-24", exitSize:"$13,000M", type:"Buyout", investorSince:"2021", flag:"minority — not PE seller" },
          { company:"Colonial Pipeline", exitDate:"2025-07-31", exitSize:"$9,000M", type:"Buyout", investorSince:"2010", flag:"~15% minority" },
          { company:"Resolution Life", exitDate:"2025-10-31", exitSize:"$8,200M", type:"M&A", investorSince:"2019", flag:"minority" },
          { company:"OneStream", exitDate:"2026-04-01", exitSize:"$6,415M", type:"Buyout", investorSince:"2019", flag:"minority; Q2'26 · 4.5x" },
          { company:"OZ Minerals", exitDate:"2023-05-02", exitSize:"$5,900M", type:"M&A", investorSince:"2014", flag:"minority" },
          { company:"Darktrace", exitDate:"2024-10-01", exitSize:"$5,470M", type:"Buyout", investorSince:"2016", flag:"minority; KCM advisor" },
          { company:"Kito Crosby", exitDate:"2026-02-03", exitSize:"$2,700M", type:"M&A", investorSince:"2013", flag:"" },
          { company:"Seiyu", exitDate:"2025-07-01", exitSize:"$2,646M", type:"M&A", investorSince:"2021", flag:"" },
          { company:"Novaria Group", exitDate:"2026-01-13", exitSize:"$2,200M", type:"Buyout", investorSince:"2020", flag:"" },
          { company:"Ecorbit", exitDate:"2024-12-13", exitSize:"$1,468M", type:"Buyout", investorSince:"2020", flag:"" },
          { company:"Goodpack", exitDate:"2026-01-27", exitSize:"$1,400M", type:"M&A", investorSince:"2014", flag:"" },
        ],
        summary:"Clean pull (PBID 10066-15), 41 of 3,857 records. The big-ticket exits — WME ($13B), Colonial Pipeline ($9B), Resolution Life ($8.2B), OneStream ($6.4B), Darktrace ($5.5B) — are MINORITY stakes; exit TV vastly overstates KKR proceeds (per the KKR exit-pull study). Q1'26 realized carry $720M (+120%); embedded gains $18.3B (+11%)." },
    },

    // ───────────────────────── APO (pending agent) ─────────────────────────
    APO: {
      ticker:"APO", name:"Apollo", longName:"Apollo Global Management, Inc.", exchange:"NYSE", country:"US",
      color:"#DB2777", cadence:"quarterly", period:"Q1 2026", periodEnd:"2026-03-31", reportDate:"2026-05-06",
      reported:{ FRE:"$728M", FRE_ps:"$1.17", fpAUM:"—", DE_ps:"$1.94", SRE_ps:"$1.15", comment:"Record FRE $728M (+30%); SRE $719M ($1.15/sh); ANI $1.94/sh; AUM ~$1T; fee-gen AUM +40% YoY; $115B inflows incl. PIC." },
      fundraising:[
        { name:"Apollo Investment Fund XI", strategy:"Corporate PE", status:"In market", target:"N/A", hardCap:"N/A", prevFund:"$25B (Fund X)", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"27053-11F", comment:"Flagship corp PE; Fund X 20% net IRR, 0.4 DPI; equity took ~25% of $30B AM inflows." },
        { name:"Hybrid Value Fund III", strategy:"Hybrid Equity", status:"Final close (Q1'26)", target:"$6.5B", hardCap:"N/A", prevFund:"N/A", raisedToDate:"$6.5B", firstClose:"N/A", finalClose:"Q1 2026", pb:"18055-81F", comment:"Closed above target; +$1.5B in Q1; ~1/3 from new investors." },
        { name:"Accord VII", strategy:"Opportunistic Credit", status:"Final close (Q1'26)", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"$1.9B", firstClose:"N/A", finalClose:"Q1 2026", pb:"28354-51F", comment:"Drawdown opportunistic credit." },
        { name:"Infrastructure Opportunities Fund III", strategy:"Infra Equity", status:"In market", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"22588-93F", comment:"Infra a key theme; Apollo providing $8B+ AI data-center financings." },
        { name:"Apollo Aligned Alternatives (AAA)", strategy:"Insurance-linked alts (perpetual)", status:"Perpetual / ongoing", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:">$27.5B", firstClose:"N/A", finalClose:"N/A", pb:"N/A", comment:"Largest fund at Apollo; 12% net since inception; ~80% of Athene alts." },
        { name:"Apollo Diversified Credit (ADS)", strategy:"Non-traded BDC (wealth)", status:"Perpetual / ongoing", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"N/A", comment:"Net-flat flows in Q1 despite elevated redemptions (94% did not redeem)." },
      ],
      fundraisingSummary:"Apollo generated $115B inflows in Q1'26 ($65B from the Athora/PIC close, $50B organic — AM $30B [~75% credit] + Athene $20B). HVF III closed at $6.5B (above target); Accord VII at $1.9B. The new AMAPS product added $5B. Origination $71B in Q1 (+25% YoY), with Q2 guided potentially near the $97B record; LTM origination ~$325B.",
      guidance:[
        { metric:"FRE growth", period:"FY2026", value:"20%+", source:"transcript", comment:"Reaffirmed; Q1 FRE +30% YoY (~$2.9B annualized run-rate)." },
        { metric:"SRE growth", period:"FY2026", value:"10% (at 11% alts return)", source:"transcript", comment:"Net spread guided 120–125bps; Q1 97bps depressed by Atlas impairment + Athora raise (non-recurring)." },
        { metric:"Origination", period:"Q2 2026", value:"Stronger than $71B (toward $97B record)", source:"transcript", comment:"Rowan: 'expect origination in Q2 to be even stronger'." },
        { metric:"Athora/PIC mgmt fee", period:"FY2026 (from Q2)", value:"~20bps on PIC AUM", source:"transcript", comment:"Minimal incremental expense; PIC ~$125B AUM." },
        { metric:"New Markets volume", period:"FY2026", value:">$5B (vs <$1B in 2025)", source:"transcript", comment:"Stable value, structured settlements; ultimately ~half of Athene new business." },
        { metric:"Total AUM", period:"FY2026", value:"~$1T+ (credit ~$800B; ~$600B IG)", source:"transcript", comment:"AM AUM +31% YoY; fee-gen AUM +40%." },
        { metric:"2029 plan", period:"FY2029", value:"Unchanged; no M&A required", source:"transcript", comment:"$40B Athene cash/treasury dry powder for opportunistic deployment." },
      ],
      guidanceSummary:"The clearest quantitative guide of the group: 20%+ FRE growth and 10% SRE growth (at 11% alts return) both reaffirmed; net spread 120–125bps. Q2 origination expected even stronger than Q1's $71B (toward the $97B record); PIC contributes from Q2 at ~20bps on ~$125B AUM. 2029 targets unchanged and achievable without acquisitions.",
      consensus:{ FRE:{cons:768,n:13}, PFRE:{cons:62,n:13}, FRE_ps:{cons:1.23,n:13}, SRE_ps:{cons:1.43,n:13}, DE_ps:{cons:2.21,n:13}, netFlowsTotal:{cons:19.2,n:13}, netFlowsCredit:{cons:15.5,n:13} },  // 2Q26E VA cons (10-Jun-26); SRE per sh (RS, operating)
      exits:{ quarterly:{
        "2023 Q2":{count:5,totalTV:414}, "2023 Q3":{count:2,totalTV:0}, "2023 Q4":{count:2,totalTV:108}, "2024 Q1":{count:2,totalTV:0},
        "2024 Q2":{count:5,totalTV:63665}, "2024 Q3":{count:2,totalTV:2047}, "2024 Q4":{count:4,totalTV:0}, "2025 Q1":{count:3,totalTV:4011},
        "2025 Q2":{count:2,totalTV:0}, "2025 Q3":{count:5,totalTV:833}, "2025 Q4":{count:7,totalTV:6262}, "2026 Q1":{count:7,totalTV:7153} },
        notable:[
          { company:"Pioneer Natural Resources", exitDate:"2024-05-03", exitSize:"$63,000M", type:"M&A", investorSince:"N/A", flag:"minority — whole Exxon deal TV" },
          { company:"MEG Energy", exitDate:"2025-11-13", exitSize:"$5,090M", type:"M&A", investorSince:"2006", flag:"minority" },
          { company:"Aspen Insurance Holdings", exitDate:"2026-02-24", exitSize:"$3,500M", type:"M&A", investorSince:"2019", flag:"minority" },
          { company:"NSI Industries", exitDate:"2026-06-09", exitSize:"$3,000M", type:"M&A", investorSince:"2020", flag:"minority; Q2'26" },
          { company:"Invited Clubs", exitDate:"2026-05-05", exitSize:"$3,000M", type:"Buyout", investorSince:"2017", flag:"Q2'26" },
          { company:"AB InBev metal-container plants", exitDate:"2026-01-30", exitSize:"$2,900M", type:"Secondary", investorSince:"2020", flag:"minority" },
          { company:"Sun Country Airlines", exitDate:"2026-05-13", exitSize:"$1,386M", type:"M&A", investorSince:"2018", flag:"minority; Q2'26" },
          { company:"Covis Pharma", exitDate:"2025-03-14", exitSize:"$1,211M", type:"Buyout", investorSince:"2020", flag:"" },
          { company:"ADT", exitDate:"2025-11-20", exitSize:"$1,172M", type:"Buyout", investorSince:"2016", flag:"" },
          { company:"QXO", exitDate:"2026-01-20", exitSize:"$753M", type:"Public 2nd offering", investorSince:"N/A", flag:"minority" },
          { company:"FWD Group", exitDate:"2025-07-07", exitSize:"$442M", type:"IPO", investorSince:"2021", flag:"minority" },
          { company:"Fisker", exitDate:"2024-10-12", exitSize:"N/A", type:"Bankruptcy", investorSince:"2020", flag:"bankruptcy" },
        ],
        summary:"Clean pull (PBID 10020-16), 26 records. ~half of exits carry no disclosed TV (incl. 3 distressed: Fisker, Solarplicity, Apollo Education). Apollo's realized model is credit-repayment heavy (ACS) + Athene repositioning; PE DPI still early." },
    },

    // ───────────────────────── ARES ─────────────────────────
    ARES: {
      ticker:"ARES", name:"Ares", longName:"Ares Management Corporation", exchange:"NYSE", country:"US",
      color:"#2563EB", cadence:"quarterly", period:"Q1 2026", periodEnd:"2026-03-31", reportDate:"2026-05-01",
      reported:{ FRE:"$464M", fpAUM:"$400B", DE_ps:"$1.24", comment:"Mgmt fees >$1B first time (+22% YoY); realized income $503M; total AUM $644B." },
      fundraising:[
        { name:"ASOF III", strategy:"Opportunistic Credit", status:"Final close (Q1'26)", target:"$6–7B", hardCap:"N/A", prevFund:"$7.1B (ASOF II)", raisedToDate:"$8.3B eq / ~$10B incl co-invest", firstClose:"N/A", finalClose:"Q1 2026", pb:"N/A", comment:"Closed well above target; timing called compelling given large pipeline." },
        { name:"Ares Alternative Credit Fund III (ACF III)", strategy:"Asset-Backed Finance", status:"In market — oversubscribed", target:"$6.5B", hardCap:"$6.5B", prevFund:"$6.6B (ACF II)", raisedToDate:"N/A", firstClose:"Jan 2026 (launch)", finalClose:"Q2 2026 (exp.)", pb:"N/A", comment:"Third ABF vintage; already meaningfully oversubscribed; closes at hard cap in Q2." },
        { name:"Senior Direct Lending Fund IV (SDL IV)", strategy:"US Senior Direct Lending", status:"Launch accelerating", target:"$10B+", hardCap:"N/A", prevFund:"$15.3B (SDL III, lev+unlev)", raisedToDate:"N/A", firstClose:"late Q3 / early Q4 2026", finalClose:"N/A", pb:"N/A", comment:"Companion unlevered evergreen core SDL product to launch simultaneously." },
        { name:"Ares Global Data Center Equity Fund", strategy:"Digital Infra PE", status:"In market", target:"N/A", hardCap:"N/A", prevFund:"~$2.5B Japan seed (2024)", raisedToDate:"N/A", firstClose:"Summer 2026 (exp.)", finalClose:"N/A", pb:"N/A", comment:"Ada Infrastructure platform; hyperscaler relationships; turns FRE-accretive on first close." },
        { name:"AEPEP IV", strategy:"European RE Value-Add", status:"Open / early", target:"$2.0B+", hardCap:"N/A", prevFund:"~$1.0B (AEPEP III)", raisedToDate:"$659M (PB)", firstClose:"N/A", finalClose:"N/A", pb:"24856-84F", comment:"Early in raise vs $2B+ target." },
        { name:"Ares Japan Logistics Dev Fund V", strategy:"Japan Logistics RE", status:"In market", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"N/A", firstClose:"Spring 2026 (exp.)", finalClose:"2026 hard cap (exp.)", pb:"N/A", comment:"Strong demand following prior-vintage performance." },
      ],
      fundraisingSummary:"On pace for another record year after $30B gross raised in Q1'26 (highest-ever Q1, +46% YoY), with three large institutional credit funds in market over the next 12 months. ASOF III closed ~$10B; ACF III oversubscribed and closing Q2; SDL IV launch accelerated. 2028 fundraising guidance of $125B reiterated.",
      guidance:[
        { metric:"FRE growth (CAGR)", period:"Multi-year", value:"16–20%", source:"transcript", comment:"Reiterated at Investor Day; +26% YoY in Q1'26." },
        { metric:"Realized income (CAGR)", period:"Multi-year", value:"20–25%", source:"transcript", comment:"+24% YoY in Q1'26." },
        { metric:"Dividend growth", period:"Annual", value:"~20%/yr", source:"transcript", comment:"Q1'26 dividend $1.35, +20%+ YoY." },
        { metric:"FRE margin expansion", period:"FY2026", value:"0–150 bps (upper end)", source:"transcript", comment:"Q1 margin 42.4% (+90bps); GCP synergies + data-center fund turning FRE-positive." },
        { metric:"Fundraising target", period:"Through 2028", value:"$125B", source:"transcript", comment:"Reaffirmed on Q&A." },
        { metric:"DPS", period:"Q2 2026", value:"$1.35", source:"guidance tool", comment:"Consistent with Q1." },
        { metric:"Tax rate", period:"FY2026", value:"11–15%", source:"transcript", comment:"Q1 was 13.5%." },
      ],
      guidanceSummary:"Reaffirmed all long-term targets: 16–20% FRE CAGR, 20–25% realized-income CAGR, ~20% annual dividend growth. For 2026 expects FRE margin expansion toward the top of the 0–150bps range; $125B cumulative fundraising target through 2028 explicitly reaffirmed.",
      consensus:{ FRE:{cons:485,n:10}, PFRE:{cons:67,n:10}, FRE_ps:{cons:1.40,n:10}, DE_ps:{cons:1.38,n:10} },  // 2Q26E VA cons (10-Jun-26); DE_ps=after-tax realized inc/sh; net flows n/a in export
      exits:{ quarterly:{
        "2023 Q2":{count:6,totalTV:1663}, "2023 Q3":{count:3,totalTV:232}, "2023 Q4":{count:7,totalTV:3302}, "2024 Q1":{count:3,totalTV:8},
        "2024 Q2":{count:3,totalTV:411}, "2024 Q3":{count:2,totalTV:25}, "2024 Q4":{count:2,totalTV:0}, "2025 Q1":{count:5,totalTV:2814},
        "2025 Q2":{count:5,totalTV:1100}, "2025 Q3":{count:6,totalTV:7441}, "2025 Q4":{count:6,totalTV:705}, "2026 Q1":{count:12,totalTV:19046} },
        notable:[
          { company:"Clario", exitDate:"2026-03-24", exitSize:"$8,875M", type:"M&A", investorSince:"2019", flag:"" },
          { company:"Global Healthcare Exchange", exitDate:"2026-02-05", exitSize:"$5,000M", type:"Buyout", investorSince:"2014", flag:"" },
          { company:"Dotmatics", exitDate:"2025-07-01", exitSize:"$4,841M", type:"M&A", investorSince:"2017", flag:"" },
          { company:"Team Services Group", exitDate:"2026-03-31", exitSize:"$3,000M", type:"Buyout", investorSince:"2021", flag:"" },
          { company:"Anaqua", exitDate:"2025-02-25", exitSize:"$2,500M", type:"Buyout", investorSince:"2019", flag:"" },
          { company:"ENTRUST Solutions", exitDate:"2026-03-27", exitSize:"$2,400M", type:"M&A", investorSince:"2019", flag:"" },
          { company:"Mavis Tires & Brakes", exitDate:"2026-02-20", exitSize:"$2,000M", type:"IPO", investorSince:"2021", flag:"" },
          { company:"Club Atlético de Madrid", exitDate:"2026-03-12", exitSize:"$1,616M", type:"Buyout", investorSince:"2021", flag:"" },
          { company:"McLaren Racing", exitDate:"2025-09-02", exitSize:"$1,500M", type:"Buyout", investorSince:"2020", flag:"" },
          { company:"X-energy", exitDate:"2026-04-24", exitSize:"$1,018M", type:"IPO", investorSince:"2022", flag:"minority" },
        ],
        summary:"PitchBook returned 104 of 2,261 investment records (capped), so pre-Q4'24 exits and many sizes are missing — quarterly TV is a partial minimum. Q1'26 dominated by Clario ($8.9B) and GHX ($5.0B)." },
    },

    // ───────────────────────── BAM ─────────────────────────
    BAM: {
      ticker:"BAM", name:"Brookfield AM", longName:"Brookfield Asset Management Ltd.", exchange:"TSX", country:"Canada",
      color:"#0891B2", cadence:"quarterly", period:"Q1 2026", periodEnd:"2026-03-31", reportDate:"2026-05-08",
      reported:{ FRE:"$772M", FRE_ps:"$0.48", fpAUM:"$614B", DE_ps:"$0.43", comment:"Fee-bearing capital $614B (+12% YoY); FRE LTM $3.1B (+18%); DE $702M." },
      fundraising:[
        { name:"Flagship Infrastructure Fund (BIF V)", strategy:"Infrastructure", status:"In market", target:"N/A", hardCap:"N/A", prevFund:"~$30B (BIF IV)", raisedToDate:"N/A", firstClose:"2026 (exp.)", finalClose:"N/A", pb:"N/A", comment:"'Meaningful first close also in 2026'; supercore infra >$20B, +$800M in Q1." },
        { name:"Flagship Private Equity Fund (BCP VI)", strategy:"Private Equity", status:"In market — first close held", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"$6.0B (initial close)", firstClose:"Q1 2026", finalClose:"N/A", pb:"N/A", comment:"CEO: '$6B already closed, full first close coming'; expected largest-ever PE vintage." },
        { name:"AI Infrastructure Fund", strategy:"Infra / AI", status:"Open (since Nov'25)", target:"$10B+", hardCap:"N/A", prevFund:"inaugural", raisedToDate:"$5.0B (PB)", firstClose:"N/A", finalClose:"N/A", pb:"28857-61F", comment:"Bloom Energy partnership flagged as first deal; expansion talks underway." },
        { name:"Global Transition Fund II (BGTF II)", strategy:"Energy Transition", status:"Closed (Oct'25)", target:"$17B+", hardCap:"N/A", prevFund:"~$15B (BGTF I)", raisedToDate:"$20.0B (final)", firstClose:"2023-07", finalClose:"2025-10-07", pb:"23440-87F", comment:"Final close $20B vs $17B target; now deploying." },
        { name:"Catalytic Transition Fund", strategy:"Climate (concessional)", status:"Open", target:"$5.0B", hardCap:"N/A", prevFund:"N/A", raisedToDate:"$2.6B", firstClose:"2024-06", finalClose:"N/A", pb:"25873-48F", comment:"Emerging-markets climate transition." },
        { name:"17Capital Credit Fund 2", strategy:"NAV Lending", status:"Closed", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"$7.5B", firstClose:"N/A", finalClose:"2026", pb:"N/A", comment:"Largest NAV lending fund ever raised." },
      ],
      fundraisingSummary:"BAM expects 2026 to be its largest fundraising year ever — flagship infra (first close 2026), flagship PE ($6B raised, full first close coming), the $40B Just Group insurance mandate, AI infra, and the imminent full Oaktree consolidation. Q1'26 capital raised $21B; YTD through early-May $67B vs 2025's record $112B. BGTF II closed at $20B in Oct'25.",
      guidance:[
        { metric:"DPS", period:"Q1 2026", value:"$0.5025", source:"guidance tool", comment:"Up from $0.4375 prior quarters." },
        { metric:"FRE growth", period:"FY2026", value:"Exceed long-term targets", source:"transcript", comment:"CEO: 'record year, expect to exceed long-term growth targets'; FRE LTM $3.1B (+18%)." },
        { metric:"Fee-bearing capital", period:"LTM", value:"+12% to $614B", source:"transcript", comment:"" },
        { metric:"Fundraising", period:"FY2026", value:"Record, > $112B (2025)", source:"transcript", comment:"$67B raised YTD through early-May." },
        { metric:"FRE margin", period:"FY2026", value:"~57–58% (pre-Oaktree)", source:"transcript", comment:"Compresses on Oaktree consolidation then rebuilds." },
        { metric:"Buybacks", period:"YTD 2026", value:"~$800M", source:"transcript", comment:"$375M Q1 + $200M Q2; shares seen undervalued." },
        { metric:"DE growth", period:"Q1'26 YoY", value:"+7% (DE $702M)", source:"transcript", comment:"Tracking FRE." },
      ],
      guidanceSummary:"Formal S&P guidance limited to DPS ($0.5025). Management reaffirmed exceeding Investor-Day FRE targets for 2026 with outperformance 'largely secured'; step-changes from flagship PE fees turning on, flagship infra first close, the $40B Just Group mandate, and full Oaktree consolidation (Q2'26).",
      consensus:{ FRE:{cons:819,n:11}, PFRE:{cons:129,n:11}, FRE_ps:{cons:0.50,n:11}, DE_ps:{cons:0.44,n:11} },  // 2Q26E VA cons (20-May-26); PFRE=perf fees+incentive distributions; net flows n/a
      exits:{ quarterly:{
        "2023 Q2":{count:0,totalTV:0}, "2023 Q3":{count:0,totalTV:0}, "2023 Q4":{count:0,totalTV:0}, "2024 Q1":{count:0,totalTV:0},
        "2024 Q2":{count:1,totalTV:0}, "2024 Q3":{count:0,totalTV:0}, "2024 Q4":{count:0,totalTV:0}, "2025 Q1":{count:1,totalTV:1249},
        "2025 Q2":{count:0,totalTV:0}, "2025 Q3":{count:0,totalTV:0}, "2025 Q4":{count:0,totalTV:0}, "2026 Q1":{count:0,totalTV:0} },
        notable:[
          { company:"Aveo Group", exitDate:"2025-07-21", exitSize:"$2,515M", type:"Buyout", investorSince:"2019", flag:"parent entity" },
          { company:"Fundamental Income Properties", exitDate:"2025-07-23", exitSize:"$2,200M", type:"Buyout", investorSince:"2020", flag:"parent entity" },
          { company:"Livensa Living", exitDate:"2025-03-01", exitSize:"$1,249M", type:"Buyout", investorSince:"2019", flag:"" },
          { company:"India Solar/Wind (1.6GW)", exitDate:"2025-04-07", exitSize:"$900M", type:"Asset sale", investorSince:"N/A", flag:"" },
          { company:"Office tower, Sydney", exitDate:"2025-01-09", exitSize:"$288M", type:"Asset sale", investorSince:"N/A", flag:"" },
          { company:"IOS Portfolio (13 props)", exitDate:"2024-12-27", exitSize:"$278M", type:"Asset sale", investorSince:"N/A", flag:"" },
        ],
        summary:"PitchBook's BAM investor entity is sparse — most Brookfield exits sit under the parent (Brookfield Corp) or fund entities. Management cited ~$8B of equity monetisation proceeds in Q1'26 alone, far above what PB captures, so quarterly TV here is a severe undercount." },
    },

    // ───────────────────────── CG ─────────────────────────
    CG: {
      ticker:"CG", name:"Carlyle", longName:"The Carlyle Group Inc.", exchange:"NasdaqGS", country:"US",
      color:"#16A34A", cadence:"quarterly", period:"Q1 2026", periodEnd:"2026-03-31", reportDate:"2026-05-07",
      reported:{ FRE:"$300M", fpAUM:"—", DE_ps:"$0.89", comment:"Fund mgmt fees $545M (+4%); FRE margin 47%; DE $327M; dry powder record $96B (+13%)." },
      fundraising:[
        { name:"Carlyle Partners X (CP X)", strategy:"US Buyout (GPE)", status:"Pre-launch — cornerstone secured", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"$5B cornerstone (AlpInvest structure)", firstClose:"2026 (exp.)", finalClose:"N/A", pb:"N/A", comment:"$5B AlpInvest-anchored cornerstone secured pre-launch; formal raise later in 2026." },
        { name:"Carlyle Europe Partners VI", strategy:"Europe Buyout (GPE)", status:"Open", target:">$8.7B", hardCap:"N/A", prevFund:"N/A", raisedToDate:"$1.16B (PB)", firstClose:"N/A", finalClose:"N/A", pb:"20707-66F", comment:"2024 vintage; early in raise." },
        { name:"Carlyle AlpInvest Private Markets II", strategy:"Secondaries / AlpInvest", status:"Open", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"N/A", firstClose:"2024-07", finalClose:"N/A", pb:"26207-56F", comment:"AlpInvest raised a record $6.8B in Q1'26 across secondaries/co-invest/portfolio finance." },
        { name:"Carlyle Bravo Opportunistic Credit", strategy:"Opportunistic Credit", status:"Open", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"23182-03F", comment:"CFO flagged upcoming opportunistic-credit raise as a higher-fee product." },
        { name:"Carlyle Asset-Backed Finance", strategy:"Credit / ABF", status:"First close (Q1'26)", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"$1.5B (first close); ABF platform >$12B (+30%)", firstClose:"Q1 2026", finalClose:"N/A", pb:"N/A", comment:"New closed-end ABF strategy." },
      ],
      fundraisingSummary:"Carlyle is entering a fundraising 'super cycle' across GPE, Credit and AlpInvest. Next US Buyout (CP X) formally launches later in 2026 after a landmark $5B AlpInvest-anchored cornerstone. AlpInvest raised a record $6.8B in Q1'26; Global Credit raised $3.9B led by a $1.5B ABF first close. Most target sizes/hard caps undisclosed.",
      guidance:[
        { metric:"FRE growth", period:"FY2026", value:"mid- to high-single-digit %", source:"transcript", comment:"Confidence expressed on Q&A." },
        { metric:"Management fee growth", period:"FY2026+", value:"accelerating from 7% LTM", source:"transcript", comment:"As fundraising super cycle begins." },
        { metric:"FRE", period:"FY2028", value:"$1.9B", source:"transcript", comment:"Feb shareholder-update target; 'expect to achieve or exceed'." },
        { metric:"DE per share", period:"FY2028", value:"≥ $6.00", source:"transcript", comment:"Long-term target reiterated." },
        { metric:"Total inflows", period:"FY2028", value:"$200B", source:"transcript", comment:"Cumulative fundraising target." },
        { metric:"DPS", period:"FY2026", value:"$0.35/qtr", source:"guidance tool", comment:"Maintained." },
        { metric:"Buyback", period:"Ongoing", value:"$1.9B left of $2B", source:"transcript", comment:"$205M repurchased/withheld in Q1." },
      ],
      guidanceSummary:"Reiterated Feb-2026 targets: $1.9B FRE, $6+ DE/share and $200B inflows by end-2028, with full confidence in achieving/exceeding each. For 2026: mid-to-high-single-digit FRE growth and accelerating management-fee growth as GPE/AlpInvest/Credit ramp. $0.35/qtr dividend maintained.",
      consensus:{ FRE:{cons:320,n:10}, PFRE:{cons:74,n:10}, FRE_ps:{cons:0.89,n:10}, DE_ps:{cons:0.91,n:10}, netFlowsTotal:{cons:2.2,n:10}, netFlowsCredit:{cons:1.2,n:10} },  // 2Q26E VA cons (10-Jun-26); netFlowsCredit=Global Credit seg
      exits:{ quarterly:{
        "2023 Q2":{count:3,totalTV:0}, "2023 Q3":{count:6,totalTV:49}, "2023 Q4":{count:5,totalTV:1768}, "2024 Q1":{count:5,totalTV:1804},
        "2024 Q2":{count:2,totalTV:50}, "2024 Q3":{count:6,totalTV:3061}, "2024 Q4":{count:4,totalTV:2105}, "2025 Q1":{count:5,totalTV:647},
        "2025 Q2":{count:7,totalTV:426}, "2025 Q3":{count:4,totalTV:1183}, "2025 Q4":{count:6,totalTV:1969}, "2026 Q1":{count:2,totalTV:126} },
        notable:[
          { company:"Cogentrix Energy", exitDate:"2024-08-05", exitSize:"$3,000M", type:"Buyout", investorSince:"2012", flag:"" },
          { company:"Forgital Group", exitDate:"2024-12-17", exitSize:"$2,105M", type:"Buyout", investorSince:"2019", flag:"" },
          { company:"McDonald's China", exitDate:"2024-01-30", exitSize:"$1,804M", type:"Secondary", investorSince:"2017", flag:"minority" },
          { company:"Saverglass", exitDate:"2023-12-04", exitSize:"$1,434M", type:"M&A", investorSince:"2016", flag:"" },
          { company:"HSO Group", exitDate:"2025-08-13", exitSize:"$1,000M", type:"Buyout", investorSince:"2019", flag:"" },
          { company:"Calastone", exitDate:"2025-10-14", exitSize:"$897M", type:"M&A", investorSince:"2020", flag:"" },
          { company:"1E", exitDate:"2025-01-31", exitSize:"$647M", type:"M&A", investorSince:"2021", flag:"" },
          { company:"Prima Assicurazioni", exitDate:"2025-11-28", exitSize:"$542M", type:"M&A", investorSince:"2018", flag:"minority" },
        ],
        summary:"Clean 3-yr pull (PBID 10048-15): 58 unique exits from 93 raw rows. Biggest realizations Cogentrix $3.0B, Forgital $2.1B, McDonald's China $1.8B, Saverglass $1.4B. Transcript cited ~$12B Q1'26 realized proceeds (mostly CP VII) — far above PitchBook deal TV, which only captures announced transactions." },
    },

    // ───────────────────────── TPG ─────────────────────────
    TPG: {
      ticker:"TPG", name:"TPG", longName:"TPG Inc.", exchange:"NasdaqGS", country:"US",
      color:"#EA580C", cadence:"quarterly", period:"Q1 2026", periodEnd:"2026-03-31", reportDate:"2026-05-01",
      reported:{ FRE:"$247M", fpAUM:"$175B", DE_ps:"$0.70", comment:"LTM FRE >$1B first time (31% CAGR since IPO); FRE margin 44.3% (47% FY target); total AUM $306B (+22%)." },
      fundraising:[
        { name:"TPG Partners X", strategy:"PE / Buyout", status:"Open — in market", target:"$13–15B", hardCap:"$15B", prevFund:"~$13.5B (Partners IX)", raisedToDate:"~$13.5B (PB); $12B+ raised 2025 w/ Healthcare III", firstClose:"2025", finalClose:"H2 2026 (exp.)", pb:"27844-84F", comment:"First close 'unusually successful'; final close back-half 2026." },
        { name:"TPG Healthcare Partners III", strategy:"Healthcare Buyout", status:"Open — in market", target:"$4.0B+", hardCap:"N/A", prevFund:"~$3.3B (HP II)", raisedToDate:"~$13B combined w/ Capital X", firstClose:"2025-06", finalClose:"H2 2026 (exp.)", pb:"28079-74F", comment:"Part of combined campaign with TPG Capital X." },
        { name:"TPG Rise Climate II + Global South", strategy:"Impact / Climate PE", status:"Approaching final close", target:"$8–10B (TRC2) + $1B+ (GS)", hardCap:"N/A", prevFund:"~$7.3B (Rise Climate I)", raisedToDate:"$9B+ across both (end-Apr'26)", firstClose:"Dec 2023 (TRC2)", finalClose:"Q3 2026 (exp.)", pb:"24821-29F", comment:"'>$11B fund cycle vs $7B last time'; heading to final closes." },
        { name:"TPG AG Net Lease Realty V", strategy:"RE / Net Lease", status:"Near final close", target:"N/A", hardCap:"N/A", prevFund:"Net Lease IV", raisedToDate:"$1B+ through Apr'26", firstClose:"N/A", finalClose:"Q2 2026 (exp.)", pb:"26912-44F", comment:"Several new strategic partnerships." },
        { name:"TPG Real Estate Partners V", strategy:"RE Opportunistic", status:"Recently launched", target:"N/A", hardCap:"N/A", prevFund:"~$3.3B (TREP IV)", raisedToDate:"N/A", firstClose:"H2 2026 (exp.)", finalClose:"N/A", pb:"N/A", comment:"Plus second Japan Value fund and a sixth Asia RE fund launching June." },
        { name:"TPG Sports (inaugural)", strategy:"Sports PE", status:"Open", target:"N/A", hardCap:"N/A", prevFund:"inaugural", raisedToDate:"$1.1B through Apr'26", firstClose:"N/A", finalClose:"N/A", pb:"29745-19F", comment:"First investment: Learfield (college athletics)." },
      ],
      fundraisingSummary:"Maintained $50B+ 2026 fundraising target with $10B raised in Q1 (+75% YoY), back-half weighted (Capital X & Healthcare III final closes H2; Rise Climate Q3; RE cycle starting). Credit drove $4.4B in Q1 anchored by a $2B Jackson Financial ABF partnership. Private wealth +130% YoY; TPG Sports at $1.1B; T-POP perpetual PE at $2.1B AUM.",
      guidance:[
        { metric:"FRE margin", period:"FY2026", value:"47%", source:"transcript", comment:"Q1 44.3% (RSU-tax seasonal); FY2025 45%." },
        { metric:"Fundraising", period:"FY2026", value:">$50B", source:"transcript", comment:"$10B raised in Q1; back-half weighted." },
        { metric:"LTM FRE", period:"Q1'26", value:">$1B (+36% YoY)", source:"transcript", comment:"First time; 31% CAGR since IPO." },
        { metric:"Realized perf. allocations", period:"Q1 2026", value:"$68M (>$50M guide)", source:"transcript", comment:"OneOncology + Intersect Power." },
        { metric:"Fee-earning AUM", period:"Q1'26", value:"$175B (+23% YoY)", source:"transcript", comment:"$45B AUM not yet earning fees (~$140M latent revenue)." },
        { metric:"DE per share", period:"Q1 2026", value:"$0.70 (+46% YoY)", source:"transcript", comment:"GAAP net loss $123M." },
        { metric:"DPS", period:"Q1 2026", value:"$0.59 declared", source:"transcript", comment:"S&P tool shows $0.24 mid (classification); use transcript." },
      ],
      guidanceSummary:"Key 2026 targets: 47% FRE margin (vs 44.3% in Q1), $50B+ raised, continued double-digit FRE growth (LTM FRE >$1B). $140M of latent management fees embedded in $33B undeployed credit dry powder. No change to fundraising guidance despite macro volatility.",
      consensus:{ FRE:{cons:254,n:8}, PFRE:{cons:49,n:8}, FRE_ps:{cons:0.66,n:8}, DE_ps:{cons:0.60,n:8} },  // 2Q26E VA cons (10-Jun-26); operating basis; net flows n/a in export
      exits:{ quarterly:{
        "2023 Q2":{count:7,totalTV:2172}, "2023 Q3":{count:3,totalTV:7274}, "2023 Q4":{count:8,totalTV:1837}, "2024 Q1":{count:4,totalTV:141},
        "2024 Q2":{count:3,totalTV:292}, "2024 Q3":{count:8,totalTV:2522}, "2024 Q4":{count:6,totalTV:2483}, "2025 Q1":{count:3,totalTV:191},
        "2025 Q2":{count:8,totalTV:1449}, "2025 Q3":{count:3,totalTV:843}, "2025 Q4":{count:5,totalTV:1976}, "2026 Q1":{count:1,totalTV:1675} },
        notable:[
          { company:"Creative Artists Agency", exitDate:"2023-09-27", exitSize:"$7,000M", type:"Buyout", investorSince:"2010", flag:"" },
          { company:"Intersect Power (digital power)", exitDate:"2026-Q1", exitSize:"$5,000M", type:"Asset sale (to Google)", investorSince:"N/A", flag:"Rise Climate" },
          { company:"Curium Pharma", exitDate:"2026-Q1", exitSize:"$3,800M", type:"Continuation vehicle", investorSince:"N/A", flag:"largest EU single-asset CV" },
          { company:"Ouro Medicines", exitDate:"2026-03-22", exitSize:"$1,675M", type:"M&A", investorSince:"2025", flag:"" },
          { company:"Viking River Cruises", exitDate:"2025-05-27", exitSize:"$1,350M", type:"Secondary", investorSince:"2016", flag:"" },
          { company:"PropertyGuru", exitDate:"2024-12-13", exitSize:"$1,100M", type:"Buyout", investorSince:"2015", flag:"" },
          { company:"BETA Technologies", exitDate:"2025-11-04", exitSize:"$1,015M", type:"IPO", investorSince:"2022", flag:"Rise Fund" },
          { company:"Elektrofi", exitDate:"2025-11-18", exitSize:"$810M", type:"M&A", investorSince:"2024", flag:"" },
          { company:"ServiceTitan", exitDate:"2024-12-12", exitSize:"$625M", type:"IPO", investorSince:"2022", flag:"" },
          { company:"OneOncology", exitDate:"2026-Q1", exitSize:"N/A", type:"M&A (to Cencora)", investorSince:"N/A", flag:"size n/d in PB" },
          { company:"Avalyn Pharma", exitDate:"2026-04-30", exitSize:"$300M", type:"IPO", investorSince:"2017", flag:"" },
        ],
        summary:"TPG reported ~$9B of realizations in Q1'26 (doubled YoY), led by Intersect Power/Google ($5B) and OneOncology/Cencora — but PitchBook lacks sizes for the two largest, so PB materially understates Q1 TV." },
    },

    // ───────────────────────── OWL ─────────────────────────
    OWL: {
      ticker:"OWL", name:"Blue Owl", longName:"Blue Owl Capital Inc.", exchange:"NYSE", country:"US",
      color:"#CA8A04", cadence:"quarterly", period:"Q1 2026", periodEnd:"2026-03-31", reportDate:"2026-04-30",
      reported:{ FRE:"—", FRE_ps:"$0.25", fpAUM:"~$188B", DE_ps:"$0.19", comment:"FRE/sh $0.25; DE/sh $0.19; mgmt fees +13% YoY; total platform equity raised Q1 $11B; does not disclose $ totals or SRE." },
      fundraising:[
        { name:"Real Estate Fund VI (Net Lease VI)", strategy:"Net Lease RE", status:"In market — approaching hard cap", target:"$4–5B", hardCap:"$7.5B", prevFund:"$5.16B", raisedToDate:"$5.8B", firstClose:"N/A", finalClose:"YE 2026 (target)", pb:"22564-90F", comment:"Pipeline ~$50B LoI/contract; hard cap $7.5B expected by end-2026." },
        { name:"GP Stakes VI", strategy:"GP Minority Stakes", status:"In market — wrapping up", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"~$9B fund / ~$10B incl co-invest", firstClose:"N/A", finalClose:"2026", pb:"N/A", comment:"~40% committed; ~6 investments in pipeline." },
        { name:"Digital Infrastructure Fund IV (BODI IV)", strategy:"Digital Infra / Data Centers", status:"Launching", target:"N/A", hardCap:"N/A", prevFund:"Fund III (closed Apr'25)", raisedToDate:"N/A", firstClose:"H2 2026 (exp.)", finalClose:"N/A", pb:"28410-67F", comment:"$100B+ infra pipeline; institutional + wealth (OTIC)." },
        { name:"Blue Owl Credit Income (OCIC)", strategy:"Non-traded BDC", status:"Open / perpetual", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"$19.1B AUM", firstClose:"N/A", finalClose:"perpetual", pb:"25304-86F", comment:"~$1B raised Q1; ~$170M net outflow (OCIC+OTIC); redemptions headline-driven." },
        { name:"RE Net Lease Property Fund (ORENT)", strategy:"Non-traded REIT", status:"Open / perpetual", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"$5.0B AUM", firstClose:"N/A", finalClose:"perpetual", pb:"16477-39F", comment:"$1.1B raised Q1; ~$1B net inflow; lowest repurchase % in 7 quarters." },
        { name:"European Net Lease Master Fund", strategy:"European Net Lease (first-time)", status:"In market", target:"$1.5B+", hardCap:"N/A", prevFund:"first-time", raisedToDate:"$1.1B", firstClose:"N/A", finalClose:"N/A", pb:"25973-38F", comment:"Original $1–1.5B goal already met." },
      ],
      fundraisingSummary:"Raised $11B in Q1'26 ($57B LTM, 2nd-highest ever), across credit ($4B), real assets ($4B incl ~$3B net lease) and GP Strategic Capital ($0.9B). Net Lease VI tracking to its $7.5B hard cap by year-end; BODI IV initial close H2'26; GP Stakes VI closing out at ~$10B incl co-invest. Perpetual OCIC/ORENT drive wealth flows; OCIC sees modest industry-wide BDC redemption pressure.",
      guidance:[
        { metric:"FRE margin", period:"FY2026", value:"58.5%", source:"transcript", comment:"Q1 already 58.4%." },
        { metric:"Dividend / share", period:"FY2026", value:"$0.92 ($0.23/qtr)", source:"guidance tool", comment:"Payout ratio declining toward ~85% target." },
        { metric:"FRE growth", period:"FY2026", value:"'Beat Visible Alpha consensus'", source:"transcript", comment:"Softened from low-double-digit given BDC retail headwinds." },
        { metric:"Management fee growth", period:"Q1'26 YoY", value:"+13%", source:"transcript", comment:"From $57B LTM fundraising." },
        { metric:"Embedded fee growth", period:"18–24 mo", value:"~$350M (~14% of fee base)", source:"transcript", comment:"$30B AUM not yet earning fees." },
        { metric:"Real Assets AUM", period:"LTM", value:"+27% ($85B); net lease +38%", source:"transcript", comment:"Deployment +100% YoY." },
      ],
      guidanceSummary:"Reaffirmed 58.5% FRE margin and $0.92 dividend for 2026 while softening FRE-growth language to 'beat Visible Alpha consensus' given retail-BDC headwinds. $30B of AUM not yet earning fees (~$350M latent management fees, ~14% growth runway) deploys over 18–24 months.",
      consensus:{ FRE_ps:{act:0.25}, DE_ps:{act:0.19} },
      exits:{ quarterly:{
        "2024 Q4":{count:1,totalTV:null}, "2025 Q2":{count:1,totalTV:30}, "2025 Q3":{count:2,totalTV:12221},
        "2025 Q4":{count:4,totalTV:2083}, "2026 Q1":{count:3,totalTV:30} },
        notable:[
          { company:"SpaceX", exitDate:"2026-06-12", exitSize:"$75,000M", type:"IPO (valuation)", investorSince:"2024", flag:"Q2'26; ~10x; sold ~half" },
          { company:"HPS Investment Partners", exitDate:"2025-07-01", exitSize:"$12,221M", type:"M&A", investorSince:"2018", flag:"GP stake; to BlackRock" },
          { company:"Brex", exitDate:"2026-04-07", exitSize:"$5,150M", type:"M&A", investorSince:"2024", flag:"Q2'26" },
          { company:"Securiti", exitDate:"2025-12-08", exitSize:"$1,725M", type:"Buyout", investorSince:"2024", flag:"" },
          { company:"MapLight Therapeutics", exitDate:"2025-10-27", exitSize:"$251M", type:"IPO", investorSince:"2025", flag:"" },
          { company:"EnGene", exitDate:"2025-11-14", exitSize:"$107M", type:"Public 2nd offering", investorSince:"2024", flag:"" },
          { company:"Stonepeak (GP stake)", exitDate:"2026-01-28", exitSize:"N/A", type:"Buyout", investorSince:"2023", flag:"GP stake" },
        ],
        summary:"PitchBook returned 31 of 343 records; ~12 unique exits. SpaceX ($75B valuation, Q2'26) and HPS ($12.2B) dominate — but exit sizes are deal valuations, not Blue Owl's minority proceeds. No clean 2025 Q1 data in the pull." },
    },

    // ───────────────────────── PGHN ─────────────────────────
    PGHN: {
      ticker:"PGHN", name:"Partners Group", longName:"Partners Group Holding AG", exchange:"SWX", country:"Switzerland",
      color:"#DC2626", cadence:"annual", period:"FY2025", periodEnd:"2025-12-31", reportDate:"2026-03-10", currency:"CHF",
      reported:{ FRE:"CHF1.7B*", fpAUM:"~$185B AUM", DE_ps:"—", comment:"*Mgmt fees CHF1.7B (+12% cc); EBITDA margin 62.8%; perf fees CHF819M (+60%); EPS CHF48.63. FPAUM not separately disclosed." },
      fundraising:[
        { name:"Direct Infrastructure IV", strategy:"Infrastructure", status:"Open / raising", target:"N/A", hardCap:"N/A", prevFund:"Direct Infra 2020", raisedToDate:"N/A", firstClose:"N/A", finalClose:"H1 2026 (exp.)", pb:"29642-41F", comment:"Close timing affects mgmt-fee margin." },
        { name:"Private Equity II", strategy:"PE Buyout", status:"Open", target:"N/A", hardCap:"N/A", prevFund:"Direct Equity IV (2019)", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"16847-56F", comment:"Open flagship PE vehicle." },
        { name:"Private Credit CV", strategy:"Private Credit (evergreen)", status:"Open", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"N/A", firstClose:"N/A", finalClose:"evergreen", pb:"28229-41F", comment:"Credit evergreens at ~5x inflows vs outflows." },
        { name:"Partners Group Life II", strategy:"PE (semi-liquid)", status:"Open", target:"N/A", hardCap:"N/A", prevFund:"Life I (2020)", raisedToDate:"N/A", firstClose:"N/A", finalClose:"evergreen", pb:"24369-76F", comment:"Growing bespoke/evergreen platform." },
        { name:"Next Generation Infrastructure", strategy:"Infra Value-Add (evergreen)", status:"Open", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"N/A", firstClose:"N/A", finalClose:"evergreen", pb:"25454-35F", comment:"" },
        { name:"Royalties LTAF", strategy:"Royalties / Real Assets", status:"Open", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"29756-44F", comment:"New UK LTAF-structure royalties strategy." },
      ],
      fundraisingSummary:"Raised $26B organically in FY2025 (+22% YoY, above the 2021 peak), with bespoke mandate solutions 72% of new assets and now $69B AUM (67% of total). ~350 live vehicles incl. 33 evergreens (3 in private credit). Infra IV and several evergreens are in market. PitchBook does not report hard caps / current raise sizes for any open vehicle.",
      guidance:[
        { metric:"Perf. fees % of revenue", period:"Medium-term", value:"25–40% (FY26 ~25%)", source:"transcript", comment:"Range widened from 20–30%; 2025 pull-forward keeps FY26 at low end." },
        { metric:"Management-fee margin", period:"FY2026", value:"~1.24% (stable)", source:"transcript", comment:"Within 1.18–1.33% band." },
        { metric:"EBITDA margin", period:"FY2026", value:"~63% reported", source:"transcript", comment:"IFRS 18 lifts reported margin ~+110bps; underwriting still ~60%." },
        { metric:"Effective tax rate", period:"FY2026", value:"18–19%", source:"transcript", comment:"" },
        { metric:"Dividend / share", period:"FY2025", value:"CHF 46 (+10%)", source:"transcript", comment:"16% CAGR since IPO; 5.7% yield." },
        { metric:"AUM growth", period:"FY2025", value:"+21% USD / +8% avg CHF", source:"transcript", comment:"No explicit FY26 AUM target." },
      ],
      guidanceSummary:"Primary guidance is qualitative: performance fees/income 25–40% of revenue medium-term (FY26 at ~25% on 2025 pull-forward), stable ~1.24% mgmt-fee margin and ~63% EBITDA margin. IFRS 18 from FY26 reclassifies investment income to revenue, modestly boosting reported margin only. No numeric AUM/EPS guidance. (S&P guidance tool: no data for PGHN.)",
      consensus:{},
      exits:{ quarterly:{
        "2023 Q2":{count:1,totalTV:0}, "2023 Q3":{count:5,totalTV:0}, "2023 Q4":{count:2,totalTV:0}, "2024 Q1":{count:3,totalTV:967},
        "2024 Q2":{count:3,totalTV:2625}, "2024 Q3":{count:3,totalTV:0}, "2024 Q4":{count:2,totalTV:786}, "2025 Q1":{count:4,totalTV:2074},
        "2025 Q2":{count:4,totalTV:5626}, "2025 Q3":{count:3,totalTV:1532}, "2025 Q4":{count:6,totalTV:4539}, "2026 Q1":{count:3,totalTV:4000} },
        notable:[
          { company:"atNorth", exitDate:"2026-02-26", exitSize:"$4,000M", type:"M&A", investorSince:"2021", flag:"data centers/AI" },
          { company:"AmSurg", exitDate:"2025-06-17", exitSize:"$3,900M", type:"M&A", investorSince:"2023", flag:"" },
          { company:"With Intelligence", exitDate:"2025-11-25", exitSize:"$1,800M", type:"M&A", investorSince:"2023", flag:"" },
          { company:"Vermaat Groep", exitDate:"2025-12-16", exitSize:"$1,743M", type:"M&A", investorSince:"2015", flag:"" },
          { company:"VSB Holding", exitDate:"2025-04-01", exitSize:"$1,570M", type:"M&A", investorSince:"2020", flag:"" },
          { company:"Klarna Group", exitDate:"2025-09-10", exitSize:"$1,372M", type:"IPO", investorSince:"2011", flag:"minority" },
          { company:"Form Technologies", exitDate:"2025-01-21", exitSize:"$1,074M", type:"M&A", investorSince:"2014", flag:"" },
          { company:"Greenlink Interconnector", exitDate:"2025-03-17", exitSize:"$1,000M", type:"M&A", investorSince:"2019", flag:"" },
          { company:"Apex Logistics", exitDate:"2025-10-23", exitSize:"$996M", type:"Secondary", investorSince:"2021", flag:"" },
          { company:"KinderCare", exitDate:"2024-10-09", exitSize:"$576M", type:"IPO", investorSince:"2015", flag:"" },
        ],
        summary:"PitchBook returned 25 of 180 exits, so quarterly counts/TV are floors. CEO-highlighted Techem and PCI exits not in the window. Annual reporting cadence (FY in March, H1 interim in August)." },
    },

    // ───────────────────────── EQT (pending agent) ─────────────────────────
    EQT: {
      ticker:"EQT", name:"EQT AB", longName:"EQT AB (publ)", exchange:"STO", country:"Sweden",
      color:"#059669", cadence:"semi-annual", period:"FY2025", periodEnd:"2025-12-31", reportDate:"2026-04-22", currency:"EUR",
      reported:{ FRE:"€1.27B*", fpAUM:"€269B AUM", DE_ps:"—", comment:"*FY2025 fee-related revenue +9%; FRE EBITDA margin 52%; carry+investment income €448M; AUM €269B (Mar'26), ~€312B post-Coller. Semi-annual reporting; Q1'26 was a trading update." },
      fundraising:[
        { name:"EQT XI", strategy:"PE Buyout (flagship)", status:"In market — first close ~mid'26", target:"€22–23B", hardCap:"N/A", prevFund:"€22B (EQT X)", raisedToDate:"N/A", firstClose:"~mid-2026", finalClose:"N/A", pb:"28044-37F", comment:"EQT X 60–65% invested; XI enters FAUM only on activation at first investment." },
        { name:"EQT Infrastructure VII", strategy:"Infrastructure (flagship)", status:"Launching ~mid'26", target:">€21B", hardCap:"N/A", prevFund:"€21.5B (Infra VI)", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"29268-91F", comment:"Infra VI closed Mar'25 at €21.5B, 75–80% invested; VII activation ~year-end'26; paired evergreen infra vehicle in Q2'26." },
        { name:"BPEA Fund IX", strategy:"Asia Buyout", status:"Final close (Apr'26)", target:"$12.5–15.6B", hardCap:"$15.6B", prevFund:"~$11.2B (BPEA VIII)", raisedToDate:"$15.6B ($14.9B fee-gen)", firstClose:"N/A", finalClose:"2026-04-20", pb:"26087-32F", comment:"Largest Asia-focused PE fund ever; ~40% larger than VIII; 45 investors crossed over from other EQT strategies." },
        { name:"EQT Healthcare Growth", strategy:"Healthcare / Life Sciences", status:"Closing ~H1'26", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"~€3B (w/ Transition Infra)", firstClose:"N/A", finalClose:"~H1 2026", pb:"23980-24F", comment:"Closing 'momentarily' per Jan'26 call." },
        { name:"EQT Active Core Infrastructure", strategy:"Core Infra (open-ended)", status:"Fund I closed; next gen open", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"€2.9B (Fund I, final)", firstClose:"2022-03", finalClose:"2024-09", pb:"21572-83F", comment:"Fully called; AI Infrastructure open-ended strategy (seeded by EdgeConneX) also open." },
        { name:"EQT Nexus / Exeter (evergreen)", strategy:"Evergreen private wealth", status:"Open", target:"N/A", hardCap:"N/A", prevFund:"N/A", raisedToDate:"~€3.5B NAV (YE'25); €1B net Q1'26", firstClose:"N/A", finalClose:"evergreen", pb:"26467-21F", comment:"Record Q1'26 evergreen net inflows €1B; >€4B annual target." },
      ],
      fundraisingSummary:"One of EQT's most active fundraising years: EQT XI (PE, first close ~mid'26), Infrastructure VII (launch ~mid'26) and BPEA IX (closed at its $15.6B hard cap in April — the largest Asia PE fund ever). 10+ other closed-ended strategies are in market (Healthcare Growth, Transition Infra, Ventures, Life Sciences, Asia Mid-Market, Real Estate, Future, AI Infra), most extending into 2027. Evergreen NAV ~€3.5B at YE'25 with record €1B net inflows in Q1'26; the pending Coller combination (Q3'26 close) lifts combined AUM to ~€312B.",
      guidance:[
        { metric:"FRE (EBITDA) margin", period:"Medium-term", value:"≥55%", source:"transcript", comment:"FY2025 was 52%; AI/efficiency + flat headcount to close the gap." },
        { metric:"OpEx growth", period:"FY2026", value:"Mid-single-digit %", source:"transcript", comment:"Headcount broadly flat; H2'25 efficiency measures annualize." },
        { metric:"Evergreen net inflows", period:"FY2026", value:">€4B run-rate", source:"transcript", comment:"Q1'26 already €1B; more vehicles launch Q2–Q3." },
        { metric:"Exit volumes", period:"FY2026", value:"~in line with FY2025 (~€19B+, ~30 events)", source:"transcript", comment:"Maintained despite volatility; subject to markets." },
        { metric:"Carried interest", period:"FY2026", value:"~€600M remaining (4 carry-mode funds)", source:"transcript", comment:"EQT VIII in cash carry; ~€500M weighted to H1'26; Infra IV & EQT IX not in carry in 2026." },
        { metric:"Dividend / share", period:"FY2025", value:"SEK 5.00 (+16%)", source:"transcript", comment:"~€460M dividends + ~€300M buybacks LTM." },
        { metric:"Coller combination", period:"Q3 2026 close", value:"Combined AUM ~€312B", source:"transcript", comment:"Adds ~€28B FAUM secondaries; Coller FRE ~$350–375M, ~50% margin." },
      ],
      guidanceSummary:"Three pillars for 2026: (1) FRE margin toward the ≥55% medium-term target (52% in FY2025) on flat headcount + AI efficiency; (2) exit volumes ~in line with the record FY2025 (~€19B+/~30 events) with carry from four carry-mode funds (notably EQT VIII), but explicitly excluding Infra IV and EQT IX; (3) evergreen net inflows well above the €4B run-rate, plus the Coller combination (Q3'26) taking combined AUM to ~€312B. (S&P guidance tool: no data.)",
      consensus:{ FRE:{cons:585,n:10}, PFRE:{cons:136,n:10}, FRE_ps:{cons:0.49,n:10}, netFlowsTotal:{cons:3.8,n:10} },  // 1H26E VA cons (19-Jun-26), €M/€/€B; PFRE=carried interest (operating); no credit seg
      exits:{ quarterly:{
        "2023 Q2":{count:4,totalTV:1568}, "2023 Q3":{count:2,totalTV:480}, "2023 Q4":{count:2,totalTV:1503}, "2024 Q1":{count:2,totalTV:2062},
        "2024 Q2":{count:1,totalTV:2101}, "2024 Q3":{count:3,totalTV:322}, "2024 Q4":{count:5,totalTV:0}, "2025 Q1":{count:2,totalTV:1500},
        "2025 Q2":{count:2,totalTV:0}, "2025 Q3":{count:3,totalTV:1075}, "2025 Q4":{count:2,totalTV:338}, "2026 Q1":{count:4,totalTV:7510} },
        notable:[
          { company:"Galderma", exitDate:"2026-03-13", exitSize:"$6,325M", type:"Secondary (block trade)", investorSince:"2019", flag:"~$20B gain; largest sponsor block trade ever" },
          { company:"O2 Power", exitDate:"2025-01-10", exitSize:"$1,500M", type:"M&A", investorSince:"2019", flag:"India renewables" },
          { company:"WASH Multifamily Laundry", exitDate:"2025-09-10", exitSize:"$1,075M", type:"Buyout", investorSince:"2015", flag:"" },
          { company:"Dellner Couplers", exitDate:"2026-02-10", exitSize:"$960M", type:"M&A", investorSince:"2019", flag:"" },
          { company:"Kodiak Gas Services", exitDate:"2025-12-02", exitSize:"$338M", type:"Secondary", investorSince:"2019", flag:"minority" },
          { company:"Azelis Group", exitDate:"2026-02-26", exitSize:"$225M", type:"Secondary", investorSince:"2018", flag:"" },
          { company:"Nexon Asia Pacific", exitDate:"2025-12-17", exitSize:"N/A", type:"Buyout", investorSince:"2019", flag:"" },
          { company:"Melita", exitDate:"2025-07-08", exitSize:"N/A", type:"Buyout", investorSince:"2019", flag:"" },
        ],
        summary:"PitchBook returned 21 exits. Q1'26 dominated by the historic Galderma final sell-down (~$6.3B block trade, ~$20B total gain — largest single-fund gain in PE history). Many exits show no disclosed TV; the 'Former' filter under-counts partial sell-downs. Semi-annual reporting." },
    },

    // ───────────────────────── CVC ─────────────────────────
    CVC: {
      ticker:"CVC", name:"CVC", longName:"CVC Capital Partners plc", exchange:"ENXTAM", country:"Luxembourg",
      color:"#7C2D12", cadence:"semi-annual", period:"FY2025", periodEnd:"2025-12-31", reportDate:"2026-03-11", currency:"EUR",
      reported:{ FRE:"€1.45B*", fpAUM:"€148B", DE_ps:"—", comment:"*Mgmt fees €1.45B; MFE margin 58%; PRE €254M (+39%); EBITDA €1.1B (+13%); PAT €873M. FPAUM €148B." },
      fundraising:[
        { name:"Europe/Americas Fund X", strategy:"Large-cap Buyout", status:"Pre-marketing", target:"≥ Fund IX (€26B)", hardCap:"N/A", prevFund:"€26B (Fund IX)", raisedToDate:"N/A", firstClose:"N/A", finalClose:"launch early 2027", pb:"29333-62F", comment:"Strong LP pre-marketing; same-or-larger vs the €26B Fund IX (world's largest PE fund)." },
        { name:"Secondaries Fund VI (Glendower)", strategy:"PE Secondaries", status:"Approaching final close", target:">$8.5B", hardCap:"N/A", prevFund:"Secondaries V", raisedToDate:">$8.5B aggregated", firstClose:"N/A", finalClose:"end summer 2026", pb:"N/A", comment:"'North of $8.5B now aggregated'; strong pipeline to final close." },
        { name:"CVC Catalyst III", strategy:"EU Mid-market Growth", status:"Oversubscribed", target:"$2B", hardCap:"N/A", prevFund:"N/A", raisedToDate:"~$613M (PB — stale)", firstClose:"N/A", finalClose:"summer 2026 (exp.)", pb:"25958-26F", comment:"Transcript: 'significantly oversubscribed' vs $2B target; PB likely stale." },
        { name:"CVC Credit — European Direct Lending", strategy:"Direct Lending", status:"Open / recent", target:"N/A", hardCap:"N/A", prevFund:"EUDL III (2023)", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"23908-96F", comment:"~25% of commitments from insurance." },
        { name:"Asia Pacific VII", strategy:"Asia-Pacific Buyout", status:"Future / planned", target:"N/A", hardCap:"N/A", prevFund:"Asia VI (2024)", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"21232-54F", comment:"CEO: 'Asia VII delivers step-change in PE FPAUM' over next 36 months." },
        { name:"Private Wealth evergreens (CVC-CRED/PAT/PSEC)", strategy:"Evergreen Credit/PE/Secondaries", status:"Open / scaling", target:"N/A", hardCap:"N/A", prevFund:"CVC-CRED (Q2'24)", raisedToDate:"€4.2B aggregate (Feb'26)", firstClose:"N/A", finalClose:"evergreen", pb:"N/A", comment:"AIG $1.5B seed for CVC-PSEC; CVC-PAT (US PE) launched Q1'26." },
      ],
      fundraisingSummary:"2025 gross inflows a record €23B for an off-cycle year (Credit/Secondaries/Infra ~80%). Key 2026–27 catalysts: Secondaries VI (>$8.5B, near final close) and Catalyst III (oversubscribed, $2B). Flagship Fund X enters pre-marketing, launching early 2027 at same-or-larger than the €26B Fund IX. The $3.5B AIG partnership and Marathon acquisition (~$20B credit FPAUM, closes Q3'26) are additive.",
      guidance:[
        { metric:"Fee-paying AUM", period:"2025–28", value:"€200B by end-2028 (10%+ CAGR)", source:"transcript", comment:"+€50B split ~1/3 PE, ~1/3 Credit, ~1/3 Secondaries+Infra." },
        { metric:"Management fee growth", period:"FY2026", value:"stable double-digit", source:"transcript", comment:"+9% in FY2025; MFE margin 58%." },
        { metric:"Core cost growth", period:"FY2026", value:"mid-to-high single-digit", source:"transcript", comment:"Total cost growth below 10%; a year earlier than indicated." },
        { metric:"PRE", period:"FY2026", value:"~€254M (flat)", source:"transcript", comment:"Asia V carry now expected 2027." },
        { metric:"PRE", period:"FY2027", value:"~€400M", source:"transcript", comment:"Asia V initial carry ~€100M." },
        { metric:"PRE", period:"2028–29", value:"€1.2–1.5B combined", source:"transcript", comment:"Fund VIII harvest." },
        { metric:"Dividend + buyback", period:"FY2025", value:"€500M div + €350M buyback", source:"transcript", comment:"Progressive dividend." },
      ],
      guidanceSummary:"Central target: €200B FPAUM by end-2028 at 10%+ CAGR. Near-term PRE flat in 2026 (carry recognition slips on macro/exit timing), stepping to ~€400M in 2027 (Asia V) and €1.2–1.5B combined in 2028–29 (Fund VIII). Cost discipline mid-to-high single digit; €850M dividend+buyback for 2025. (S&P guidance tool: no data.)",
      consensus:{ FRE:{cons:520,n:6}, PFRE:{cons:97,n:6} },  // 1H26E VA cons (18-Jun-26), €M; FRE=mgmt EBITDA (operating, FRE-equiv); PFRE incl. investment income
      exits:{ quarterly:{
        "2023 Q2":{count:3,totalTV:428}, "2023 Q3":{count:0,totalTV:0}, "2023 Q4":{count:0,totalTV:0}, "2024 Q1":{count:2,totalTV:2786},
        "2024 Q2":{count:1,totalTV:220}, "2024 Q3":{count:2,totalTV:2000}, "2024 Q4":{count:1,totalTV:0}, "2025 Q1":{count:5,totalTV:250},
        "2025 Q2":{count:1,totalTV:0}, "2025 Q3":{count:1,totalTV:0}, "2025 Q4":{count:3,totalTV:3514}, "2026 Q1":{count:2,totalTV:7623} },
        notable:[
          { company:"Pension Insurance Corporation", exitDate:"2026-03-27", exitSize:"$7,623M", type:"Buyout", investorSince:"2017", flag:"minority" },
          { company:"Worldwide Express", exitDate:"2026-06-01", exitSize:"$5,000M", type:"Buyout", investorSince:"2021", flag:"minority; Q2'26" },
          { company:"Naturgy Energy Group", exitDate:"2026-05-26", exitSize:"$3,587M", type:"Secondary (private)", investorSince:"2018", flag:"minority" },
          { company:"Alvogen Group", exitDate:"2025-12-03", exitSize:"$2,000M", type:"M&A", investorSince:"2015", flag:"" },
          { company:"Ethniki Hellenic Insurance", exitDate:"2025-11-27", exitSize:"$694M", type:"M&A", investorSince:"2022", flag:"" },
          { company:"OANDA", exitDate:"2025-01-30", exitSize:"$250M", type:"M&A", investorSince:"2018", flag:"" },
          { company:"Vitech Systems", exitDate:"2026-01-08", exitSize:"N/A", type:"Buyout", investorSince:"2019", flag:"" },
          { company:"Skybox Security", exitDate:"2025-02-24", exitSize:"N/A", type:"Buyout", investorSince:"2017", flag:"minority" },
          { company:"Curalie", exitDate:"2025-05-29", exitSize:"N/A", type:"Out of business", investorSince:"2023", flag:"write-off" },
        ],
        summary:"PitchBook returned just 14 of 1,828 matching deals — a severe undercount vs the transcript's record €21.9B FY2025 realizations (PE exits +77%). Most CVC exit sizes are blank in PB. Semi-annual reporting (H1/FY)." },
    },

    // ───────────────────────── ICG ─────────────────────────
    ICG: {
      ticker:"ICG", name:"ICG", longName:"ICG plc (Intermediate Capital Group)", exchange:"LSE", country:"UK",
      color:"#65A30D", cadence:"annual", period:"FY2026", periodEnd:"2026-03-31", reportDate:"2026-05-21", currency:"GBP",
      reported:{ FRE:"£350M", fpAUM:"$87B", DE_ps:"—", comment:"FRE £350M (+23%); FRE/sh 120p; mgmt fees £685M (+13%); FRE margin 47% ex catch-up; perf fees £127M; total AUM $126B." },
      fundraising:[
        { name:"Europe Fund IX", strategy:"Structured Capital / Mezzanine", status:"Oversubscribed — near final close", target:">€10B", hardCap:"N/A", prevFund:"Europe VIII (2021)", raisedToDate:">€10B ($8.37B PB)", firstClose:"N/A", finalClose:"summer 2026 (exp.)", pb:"27058-60F", comment:"ICG's first commingled fund >€10B; largest structured-capital fund globally." },
        { name:"Excelsior Strategic Equity IV (SE IV)", strategy:"GP-led Secondaries", status:"Open — ahead of schedule", target:"N/A", hardCap:"N/A", prevFund:"SE III", raisedToDate:"N/A", firstClose:"N/A", finalClose:"FY2027 (likely)", pb:"27517-87F", comment:"Global leader in GP-led secondaries." },
        { name:"Infrastructure Equity II", strategy:"Infrastructure Equity", status:"Final close (FY2026)", target:"N/A", hardCap:"N/A", prevFund:"Infra I (2020)", raisedToDate:"N/A", firstClose:"N/A", finalClose:"FY2026", pb:"N/A", comment:"Big upsize; high re-up rates." },
        { name:"Metropolitan I (real estate)", strategy:"RE Opportunistic", status:"Final close (FY2026)", target:"N/A", hardCap:"N/A", prevFund:"debut", raisedToDate:"N/A", firstClose:"N/A", finalClose:"FY2026", pb:"29535-76F", comment:"Critical second-vintage milestone; big upsize." },
        { name:"LP Secondaries Fund II", strategy:"LP-led Secondaries", status:"Open (launched Dec'25)", target:"N/A", hardCap:"N/A", prevFund:"LP Sec I (2024)", raisedToDate:"N/A", firstClose:"N/A", finalClose:"FY2027 (exp.)", pb:"29069-02F", comment:"Primary FY2027 fundraising vehicle." },
        { name:"Senior Debt Partners 5 / 6", strategy:"European Direct Lending", status:"SDP 5 closed; SDP 6 FY2027", target:"N/A", hardCap:"N/A", prevFund:"SDP 4 (2020)", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"21689-11F", comment:"100% senior secured cash-pay; Amundi wealth partnership targets SDP." },
      ],
      fundraisingSummary:"$17bn raised in FY2026, beating expectations (record $5.5B real assets). Europe IX (structured capital) surpassed €10B and nears a summer-2026 final close as ICG's first commingled fund of that scale. Infra II and Metropolitan I final-closed during the year at upsized targets. LP Secondaries II (launched Dec'25) anchors FY2027. The 4-year $55B target (FY24–FY27) is $40B achieved with two years left — on pace a year early.",
      guidance:[
        { metric:"Four-year fundraising", period:"FY2024–27", value:"$55B target", source:"transcript", comment:"$40B through FY2026; possibly a year early." },
        { metric:"Fee-earning AUM growth", period:"Medium-term", value:"sustained double-digit", source:"transcript", comment:"FEAUM $87B; $19B not-yet-earning (~£120M latent fees)." },
        { metric:"FRE margin", period:"Medium-term", value:"expanding from 47% (ex catch-up)", source:"transcript", comment:"+14pp over 5 years." },
        { metric:"Group cost growth", period:"FY2027+", value:"5–10%/yr", source:"transcript", comment:"FY26 was an unusually low 3%." },
        { metric:"Performance fee income", period:"Medium-term", value:"10–20% of fee income", source:"transcript", comment:"FY26 incl £72m one-time gain; normalized £96m." },
        { metric:"Net debt / FRE", period:"Mar 2026", value:"0.3x (£113M)", source:"transcript", comment:"Down from 0.6x; approaching zero net debt." },
        { metric:"Ordinary dividend", period:"FY2026", value:"87p", source:"transcript", comment:"16th consecutive year of growth." },
      ],
      guidanceSummary:"ICG repositioned medium-term disclosure around FRE, performance fees and balance sheet (peer-aligned). FRE margin expands from 47% (ex catch-up); approaching zero net debt, opening capital-allocation optionality (dividends, buybacks, M&A given discount-to-peers, co-investment). Amundi partnership adds wealth distribution. (S&P guidance tool: no data.)",
      consensus:{},
      exits:{ quarterly:{
        "2023 Q2":{count:1,totalTV:0}, "2023 Q3":{count:2,totalTV:0}, "2023 Q4":{count:1,totalTV:0}, "2024 Q1":{count:0,totalTV:0},
        "2024 Q2":{count:2,totalTV:398}, "2024 Q3":{count:3,totalTV:1107}, "2024 Q4":{count:2,totalTV:0}, "2025 Q1":{count:1,totalTV:0},
        "2025 Q2":{count:1,totalTV:0}, "2025 Q3":{count:2,totalTV:796}, "2025 Q4":{count:1,totalTV:1800}, "2026 Q1":{count:1,totalTV:544} },
        notable:[
          { company:"With Intelligence", exitDate:"2025-11-25", exitSize:"$1,800M", type:"M&A", investorSince:"2020", flag:"minority" },
          { company:"Akuo Energy", exitDate:"2025-07-04", exitSize:"$731M", type:"Buyout", investorSince:"N/A", flag:"minority" },
          { company:"PSB Academy", exitDate:"2026-01-12", exitSize:"$544M", type:"Buyout", investorSince:"2018", flag:"" },
          { company:"Time Education", exitDate:"2025-09-03", exitSize:"$65M", type:"Buyout", investorSince:"2015", flag:"" },
          { company:"Picard Surgelés", exitDate:"2024-12-18", exitSize:"N/A", type:"Buyout", investorSince:"2010", flag:"minority" },
          { company:"Marston Holdings", exitDate:"2025-04-01", exitSize:"N/A", type:"Secondary", investorSince:"2016", flag:"minority" },
          { company:"Lunch Garden", exitDate:"2025-01-20", exitSize:"N/A", type:"Bankruptcy", investorSince:"2021", flag:"loss" },
        ],
        summary:"PitchBook returned 11 exits, modestly under transcript's ~$7B FY2026 realizations. With Intelligence ($1.8B) the standout. Many secondaries/minority exits carry no size. Annual (Mar) reporting cadence." },
    },

    // ───────────────────────── BPT ─────────────────────────
    BPT: {
      ticker:"BPT", name:"Bridgepoint", longName:"Bridgepoint Group plc", exchange:"LSE", country:"UK",
      color:"#9333EA", cadence:"annual", period:"FY2025", periodEnd:"2025-12-31", reportDate:"2026-03-12", currency:"GBP",
      reported:{ FRE:"£305M*", fpAUM:"$45.5B", DE_ps:"—", comment:"*EBITDA £305M (margin 53%); PRE £151.6M; mgmt fees +13% ex catch-up; total AUM $94.1B (+25%). Calpine closed Jan'26 (not in FY25)." },
      fundraising:[
        { name:"Bridgepoint Europe VIII (BE VIII)", strategy:"European Mid-market Buyout", status:"Raising — first close Q2'26", target:">€7.5B", hardCap:"not yet set", prevFund:"~€6.5B (BE VII, 87% deployed)", raisedToDate:"€5.4B (closed/IC-approved)", firstClose:"Q2 2026 (exp.)", finalClose:"fee-paying mid-2026", pb:"28314-82F", comment:"20%+ increase from returning LPs; 30%+ from new-to-vertical investors." },
        { name:"ECP VI (Energy Capital Partners)", strategy:"US Energy Transition Infra", status:"Raising — final close H2'26", target:"$5B", hardCap:"$7.5B", prevFund:"~$3.5B (ECP V)", raisedToDate:"$3.7B (first close)", firstClose:"pre-Dec 2025", finalClose:"H2 2026 (brought fwd)", pb:"N/A", comment:"KKR data-center co-invest partnership; Calpine was likely most profitable PE deal ever." },
        { name:"Bridgepoint Direct Lending IV (BDL IV)", strategy:"European Direct Lending", status:"Open — exceeded cover", target:">€5B", hardCap:"N/A", prevFund:"BDL III (fully deployed)", raisedToDate:"€4.2B (Dec'25)", firstClose:"N/A", finalClose:"N/A", pb:"25237-27F", comment:"Targeting 20–25% upsize to the €4B+ cover." },
        { name:"Newbury Bridgepoint VI", strategy:"PE Secondaries", status:"Pre-marketing / launching", target:"N/A", hardCap:"N/A", prevFund:"Newbury V (pre-acquisition)", raisedToDate:"N/A", firstClose:"N/A", finalClose:"N/A", pb:"N/A", comment:"14-person Newbury team joined Feb'26; raised with BPT global sales force; size deliberately not guided." },
        { name:"Bridgepoint Credit Opportunities V (BCO V)", strategy:"Credit Special Situations", status:"Open — first close mid'26", target:"N/A", hardCap:"N/A", prevFund:"BCO IV (2023)", raisedToDate:"N/A", firstClose:"mid-2026 (exp.)", finalClose:"N/A", pb:"26225-47F", comment:"Started fundraising." },
        { name:"Bridgepoint Generations", strategy:"Wealth / Evergreen", status:"Open / early", target:"N/A", hardCap:"N/A", prevFund:"debut (Oct'25)", raisedToDate:"N/A", firstClose:"N/A", finalClose:"evergreen", pb:"N/A", comment:"5 distribution agreements (UK/FR/ES/DE/ME); HNW co-invests pro-rata alongside institutional funds." },
      ],
      fundraisingSummary:"Cumulative €24B-by-end-2026 target tracking well (€14B raised through FY2025). BE VIII (€5.4B closed/IC-approved, first close Q2'26) and ECP VI ($3.7B, targeting $5–7.5B) are the primary 2026 drivers; BDL IV exceeded its €4B cover. Newbury secondaries and BCO V are additional 2026 calls. Generations wealth product launched Oct'25 across five markets.",
      guidance:[
        { metric:"Cumulative fundraising", period:"by end-2026", value:"€24B", source:"transcript", comment:"€14B raised through FY2025." },
        { metric:"Revenue growth", period:"Through cycle", value:"13–16%/yr", source:"transcript", comment:"Flagships 10–12pp; balance from SMAs/co-invest/new strategies." },
        { metric:"EBITDA margin", period:"FY2026–27", value:"55–60%", source:"transcript", comment:"Upgraded from FY2025's 53% as BE VIII / ECP VI become fee-paying." },
        { metric:"PRE % of income", period:"FY2026–27", value:"20–25% (top end)", source:"transcript", comment:"Anchored by Calpine/Constellation share sales (50M shares)." },
        { metric:"Management fee growth", period:"FY2026", value:"13%+ ex catch-up", source:"transcript", comment:"" },
        { metric:"Opex growth", period:"FY2026+", value:"high single-digit", source:"transcript", comment:"Newbury breakeven first 2 years." },
        { metric:"Embedded balance-sheet cash", period:"5 years", value:"~£2B + ~£1.1B next vintage", source:"transcript", comment:"'Pregnant with cash'; M&A (real estate) over buybacks." },
      ],
      guidanceSummary:"Guides 13–16% revenue growth through the cycle with EBITDA margin stepping to 55–60% as BE VIII and ECP VI become fully fee-paying. PRE guided 20–25% of income (top end) for FY26–27, anchored by the Calpine/Constellation position. ~£2B of embedded balance-sheet cash over 5 years; prioritises M&A over buybacks. (S&P guidance tool: no data.)",
      consensus:{ PFRE:{act:151.6} },
      exits:{ quarterly:{
        "2023 Q2":{count:2,totalTV:2664}, "2023 Q3":{count:1,totalTV:0}, "2023 Q4":{count:1,totalTV:0}, "2024 Q1":{count:1,totalTV:0},
        "2024 Q2":{count:1,totalTV:0}, "2024 Q3":{count:2,totalTV:0}, "2024 Q4":{count:3,totalTV:0}, "2025 Q1":{count:0,totalTV:0},
        "2025 Q2":{count:1,totalTV:0}, "2025 Q3":{count:2,totalTV:4000}, "2025 Q4":{count:4,totalTV:5475}, "2026 Q1":{count:2,totalTV:1425} },
        notable:[
          { company:"Dorna Sports (MotoGP)", exitDate:"2025-07-03", exitSize:"$3,659M", type:"M&A", investorSince:"2006", flag:"minority" },
          { company:"Kereis", exitDate:"2025-10-27", exitSize:"$2,332M", type:"Buyout", investorSince:"2020", flag:"" },
          { company:"Vermaat Groep", exitDate:"2025-12-16", exitSize:"$1,743M", type:"M&A", investorSince:"2019", flag:"'standout return'" },
          { company:"Sun World International", exitDate:"2026-03-13", exitSize:"$1,425M", type:"Buyout", investorSince:"2021", flag:"" },
          { company:"Cyrus Herez", exitDate:"2025-10-25", exitSize:"$1,400M", type:"Buyout", investorSince:"2020", flag:"minority" },
          { company:"The Flexitallic Group", exitDate:"2026-04-01", exitSize:"$475M", type:"M&A", investorSince:"2013", flag:"Q2'26" },
          { company:"Cruise.co.uk", exitDate:"2025-07-29", exitSize:"$341M", type:"M&A", investorSince:"2016", flag:"" },
          { company:"Care UK", exitDate:"2024-10-01", exitSize:"N/A", type:"Buyout", investorSince:"2010", flag:"" },
        ],
        summary:"Relatively complete PB data (13 exits). Q4'25 strongest (~$5.5B: Kereis, Cyrus Herez, Vermaat). NOTE: Calpine — likely the largest exit in Bridgepoint/ECP history ($4.1B returned, closed Jan'26) — sits under Energy Capital Partners separately and is NOT in the Bridgepoint PB entity." },
    },

  },

  /* ==========================================================================
     ACCRUED CARRY (Section 4b) — fund-level NET accrued carried interest.
     Ported from the source carry dashboard; all five firms at 1Q26 (Mar 31).
     Derivation in index.html: KKR net = 25% of gross (75% comp); Blackstone
     gross = net/0.56; Carlyle gross = net/0.38; Ares/Apollo carry both.
     ========================================================================== */
  accruedMeta: {
    note: "Apollo net down ~$350M vs FY2025 (Fund IX + ANRP realizations).",
    asOf: "1Q26 (Mar 31, 2026)",
  },

  // Section 4b — the 1-2 funds that drive each disclosing firm's accrued carry (watch list).
  accruedFocus: {
    KKR: "Co-Investment Vehicles ($1.84B gross) and Americas Fund XII ($1.44B) are the PE engines (~⅓ of PE carry); Global Infrastructure IV ($1.03B) leads Real Assets. Asian Fund III/IV are next into harvest.",
    BX:  "BCP Global ($1.86B net) is the single biggest carry pool; Secondaries ($1.09B) and Energy/Transition ($1.01B) come next — these three drive most realizable PE carry.",
    ARES:"Credit leads: ACE V ($131M net) and PCS II ($115M) are the funds to watch; ASOF II ($100M) is realizing down. Note ACOF VI's large gross ($617M) converts to little net (~98% comp).",
    CG:  "CP VII ($409M net) is the key fund — stepped down and actively realizing (drove Q1 proceeds); CP VIII ($227M) is next. AlpInvest secondaries (ASF VII, $153M) is the new growth pool.",
    APO: "Fund IX ($484M net) is the core PE carry (down on AOL/Aspen exits); Fund X ($215M) is building. Redding Ridge ($113M) leads the credit carry.",
  },

  accrued: {
    KKR: {
      name:"KKR", color:"#B45309", period:"1Q26", periodEnd:"Mar 31, 2026",
      disclosure:"Gross carry per fund (10-Q)", compType:"estimated",
      compNote:"75% comp rate → net est. 25% of gross. Total gross $9,772M; net est. $2,443M.",
      segments:[
        { label:"Private Equity", funds:[
          { name:"Co-Investment Vehicles", vintage:"Various", gross:1844 },
          { name:"Americas Fund XII", vintage:"2017", gross:1442 },
          { name:"North America Fund XIII", vintage:"2021", gross:1062 },
          { name:"Asian Fund IV", vintage:"2020", gross:954 },
          { name:"Asian Fund III", vintage:"2017", gross:884 },
          { name:"Global Impact Fund II", vintage:"2022", gross:340, note:"↑ from $102M FY2025" },
          { name:"European Fund V", vintage:"2019", gross:390 },
          { name:"Health Care Strategic Growth II", vintage:"2021", gross:177 },
          { name:"North America Fund XI", vintage:"2012", gross:190 },
          { name:"Health Care Strategic Growth I", vintage:"2016", gross:130 },
          { name:"Next Gen Tech Growth Fund II", vintage:"2019", gross:137 },
          { name:"European Fund IV", vintage:"2015", gross:96 },
          { name:"Global Impact Fund", vintage:"2019", gross:92 },
          { name:"Next Gen Tech Growth Fund", vintage:"2016", gross:66 },
          { name:"Other Core Vehicles", vintage:"Various", gross:11 },
          { name:"Ascendant Fund", vintage:"2022", gross:32 },
          { name:"Core Investors II", vintage:"2022", gross:-22, note:"Negative carry" },
          { name:"Core Investors I", vintage:"2018", gross:-21, note:"Negative carry" },
          { name:"North America Fund XIV", vintage:"2025", gross:0, note:"In investment period" },
          { name:"European Fund VI", vintage:"2022", gross:0, note:"In investment period" },
          { name:"Next Gen Tech Growth Fund III", vintage:"2022", gross:0, note:"In investment period" },
          { name:"Asia Pacific Infra III", vintage:"2025", gross:0, note:"Launched Dec 2025" },
        ]},
        { label:"Real Assets", funds:[
          { name:"Global Infrastructure IV", vintage:"2021", gross:1030 },
          { name:"Asia Pacific Infrastructure II", vintage:"2022", gross:262 },
          { name:"Asia Pacific Infrastructure I", vintage:"2020", gross:197 },
          { name:"Global Infrastructure III", vintage:"2018", gross:215 },
          { name:"Co-Investments (Real Assets)", vintage:"Various", gross:131 },
          { name:"Global Infrastructure II", vintage:"2014", gross:48 },
          { name:"Energy Related Vehicles", vintage:"Various", gross:58 },
          { name:"RE Credit Opp. Partners II", vintage:"2019", gross:29 },
          { name:"RE Credit Opp. Partners I", vintage:"2017", gross:5 },
          { name:"Global Infrastructure V", vintage:"2024", gross:14, note:"New fund; in investment period" },
          { name:"RE Partners Americas II", vintage:"2021", gross:1 },
          { name:"RE Partners Americas", vintage:"2017", gross:-4, note:"Negative carry" },
          { name:"RE Partners Europe", vintage:"2015", gross:-18, note:"Negative carry" },
          { name:"RE Partners Americas III", vintage:"2021", gross:0 },
          { name:"RE Partners Europe II", vintage:"2020", gross:0 },
        ]},
      ],
    },
    BX: {
      name:"Blackstone", color:"#6D28D9", period:"1Q26", periodEnd:"Mar 31, 2026",
      disclosure:"Net carry per fund (10-Q, directly disclosed)", compType:"disclosed",
      compNote:"Net directly disclosed. GAAP gross $13.0B; comp $5.6B; ~44% implied comp rate.",
      segments:[
        { label:"Private Equity", funds:[
          { name:"BCP Global", vintage:"Various", net:1860 },
          { name:"Energy / Energy Transition", vintage:"Various", net:1007 },
          { name:"Secondaries", vintage:"Various", net:1088 },
          { name:"Infrastructure", vintage:"Various", net:772 },
          { name:"BCP Asia", vintage:"Various", net:216 },
          { name:"BTAS / BXPE", vintage:"Various", net:257 },
          { name:"Core Private Equity", vintage:"Various", net:276 },
          { name:"Life Sciences", vintage:"Various", net:228 },
          { name:"Tactical Opportunities", vintage:"Various", net:152 },
          { name:"Rounding Adj.", vintage:"—", net:-1, note:"Totals may not add due to rounding" },
        ]},
        { label:"Real Estate", funds:[
          { name:"BREP Global", vintage:"Various", net:549 },
          { name:"BREP Asia", vintage:"Various", net:101 },
          { name:"BPP", vintage:"Various", net:86 },
          { name:"BREP Europe", vintage:"Various", net:70 },
          { name:"BREDS", vintage:"Various", net:27 },
        ]},
        { label:"Credit & Insurance", funds:[
          { name:"Credit & Insurance Strategies", vintage:"Various", net:255 },
          { name:"Rounding Adj.", vintage:"—", net:1, note:"Totals may not add due to rounding" },
        ]},
        { label:"Multi-Asset Investing", funds:[
          { name:"Multi-Asset Strategies", vintage:"Various", net:56 },
        ]},
      ],
    },
    ARES: {
      name:"Ares", color:"#2563EB", period:"1Q26", periodEnd:"Mar 31, 2026",
      disclosure:"Gross & net carry per fund (10-Q segment tables)", compType:"disclosed",
      compNote:"Gross and net directly disclosed. All European-style waterfall. Q1 realized: $75M net.",
      segments:[
        { label:"Credit", funds:[
          { name:"ACE V", vintage:"2021", gross:355.0, net:130.9 },
          { name:"PCS II", vintage:"2021", gross:281.9, net:115.0 },
          { name:"ASOF II", vintage:"2019", gross:332.5, net:99.6 },
          { name:"ACE VI", vintage:"2023", gross:221.8, net:81.8 },
          { name:"ASOF I", vintage:"2016", gross:256.3, net:66.6, note:"↓ tax distributions" },
          { name:"ACE IV", vintage:"2018", gross:175.2, net:60.8 },
          { name:"PCS I", vintage:"2019", gross:140.5, net:57.4 },
          { name:"Pathfinder II", vintage:"2020", gross:176.9, net:40.6 },
          { name:"Pathfinder I", vintage:"2017", gross:220.1, net:33.2 },
          { name:"Other Credit Funds", vintage:"Various", gross:286.2, net:110.3 },
        ]},
        { label:"Real Assets", funds:[
          { name:"IDF V", vintage:"2022", gross:184.1, net:70.0 },
          { name:"EIF V", vintage:"2020", gross:98.5, net:24.8 },
          { name:"ACIP I", vintage:"2021", gross:93.9, net:29.2 },
          { name:"US IX", vintage:"2019", gross:83.2, net:31.6 },
          { name:"Other Real Assets", vintage:"Various", gross:159.3, net:48.8 },
        ]},
        { label:"Private Equity", funds:[
          { name:"ACOF VI", vintage:"2021", gross:616.7, net:15.8, note:"~98% comp" },
          { name:"ACOF IV", vintage:"2017", gross:94.9, net:18.9, note:"$35.7M realized in quarter" },
          { name:"Other PE Funds", vintage:"Various", gross:11.5, net:2.3 },
        ]},
        { label:"Secondaries", funds:[
          { name:"Other Secondaries", vintage:"Various", gross:122.9, net:28.8 },
          { name:"LREF VIII", vintage:"2019", gross:68.6, net:10.5, note:"↓ reversal of unrealized" },
        ]},
        { label:"Other Businesses", funds:[
          { name:"Other Businesses / Adj.", vintage:"Various", gross:250, net:49, note:"Residual to presentation total $1,126M" },
        ]},
      ],
    },
    CG: {
      name:"Carlyle", color:"#16A34A", period:"1Q26", periodEnd:"Mar 31, 2026",
      disclosure:"Net carry per fund (10-Q fund metrics table)", compType:"disclosed",
      compNote:"Net disclosed per fund. ~62% implied comp (net $2,588M / gross $6,865M). Clawback $(102)M.",
      segments:[
        { label:"Corporate Private Equity", funds:[
          { name:"CP VII", vintage:"2018", net:409, note:"Stepdown Oct 2021" },
          { name:"CP VIII", vintage:"2021", net:227 },
          { name:"CJP IV", vintage:"2020", net:121 },
          { name:"CP VI", vintage:"2013", net:74 },
          { name:"CGFSP III", vintage:"2017", net:72 },
          { name:"CEOF II", vintage:"2015", net:70 },
          { name:"CGP II", vintage:"2020", net:52 },
          { name:"CEP IV", vintage:"2014", net:48 },
          { name:"CETP IV", vintage:"2019", net:38 },
          { name:"CGFSP II", vintage:"2013", net:39 },
          { name:"CETP III", vintage:"2014", net:7 },
          { name:"CP Growth", vintage:"2021", net:6 },
          { name:"CP V", vintage:"2007", net:16 },
          { name:"CAP IV", vintage:"2013", net:19 },
          { name:"CJP III", vintage:"2013", net:4 },
          { name:"CGP", vintage:"2015", net:4 },
          { name:"All Other Active", vintage:"Various", net:29 },
          { name:"Other / Rounding Adj.", vintage:"Various", net:-3, note:"Residual to disclosed $1,232M" },
        ]},
        { label:"Real Estate", funds:[
          { name:"CRP VIII", vintage:"2017", net:69 },
          { name:"CRP VII", vintage:"2014", net:-28, note:"Giveback" },
          { name:"CRP VI", vintage:"2011", net:4 },
          { name:"All Other Active", vintage:"Various", net:5 },
        ]},
        { label:"Infrastructure & Natural Resources", funds:[
          { name:"CIEP I", vintage:"2013", net:73 },
          { name:"CGIOF", vintage:"2018", net:88 },
          { name:"CIEP II", vintage:"2019", net:59 },
          { name:"NGP XI", vintage:"2014", net:57 },
          { name:"NGP XII", vintage:"2017", net:36 },
          { name:"All Other Active", vintage:"Various", net:45 },
          { name:"CRSEF II", vintage:"2022", net:25, note:"New fund" },
          { name:"NGP XIII", vintage:"2023", net:9, note:"New fund" },
          { name:"Other / Rounding Adj.", vintage:"Various", net:-1, note:"Residual to disclosed $391M" },
        ]},
        { label:"Global Credit (Carry Funds)", funds:[
          { name:"CCOF II", vintage:"2020", net:111 },
          { name:"All Other Active", vintage:"Various", net:99 },
          { name:"CCOF III-Levered", vintage:"2023", net:28, note:"New fund" },
          { name:"CCOF I", vintage:"2017", net:28 },
          { name:"SASOF III", vintage:"2014", net:6 },
        ]},
        { label:"Carlyle AlpInvest", funds:[
          { name:"ASF VII (incl. SMAs)", vintage:"2020", net:153, note:"Secondaries" },
          { name:"ASF VIII", vintage:"2024", net:59, note:"Secondaries" },
          { name:"ASF VI (incl. SMAs)", vintage:"2017", net:106, note:"Secondaries" },
          { name:"ASF V (incl. SMAs)", vintage:"2012", net:11, note:"Secondaries" },
          { name:"ASPF II", vintage:"2023", net:14, note:"Secondaries" },
          { name:"Other Secondaries", vintage:"Various", net:36, note:"Secondaries" },
          { name:"ACF VII (incl. SMAs)", vintage:"2017", net:96, note:"Co-Investments" },
          { name:"Strategic SMAs", vintage:"Various", net:80, note:"Co-Investments" },
          { name:"ACF VIII (incl. SMAs)", vintage:"2021", net:50, note:"Co-Investments" },
          { name:"ACF IX (incl. SMAs)", vintage:"2023", net:10, note:"Co-Investments" },
          { name:"Other Co-Invests", vintage:"Various", net:4, note:"Co-Investments" },
          { name:"Primary SMAs (all)", vintage:"2009–26", net:24, note:"Primary Investments" },
        ]},
      ],
    },
    APO: {
      name:"Apollo", color:"#DB2777", period:"1Q26", periodEnd:"Mar 31, 2026",
      disclosure:"Perf. fees receivable per fund (unconsolidated, 10-Q)", compType:"disclosed",
      compNote:"Gross = unconsolidated perf. fees receivable. Net of ~52% profit sharing. GP obligations $334M.",
      segments:[
        { label:"Private Equity", funds:[
          { name:"Fund IX", vintage:"2017", gross:1009, net:484, note:"↓ $125M — AOL + Aspen exits" },
          { name:"Fund X", vintage:"2023", gross:449, net:215 },
          { name:"Fund VI", vintage:"2006", gross:41, net:20 },
          { name:"Fund VIII", vintage:"2013", gross:2, net:1, note:"In escrow" },
          { name:"Fund VII", vintage:"2008", gross:0, net:0, note:"Below hurdle" },
        ]},
        { label:"Hybrid / Real Assets", funds:[
          { name:"HVF II", vintage:"2021", gross:223, net:107 },
          { name:"Bridge Funds", vintage:"Various", gross:123, net:59, note:"↓ $25M" },
          { name:"ANRP I, II & III", vintage:"Various", gross:62, net:30, note:"↓ $91M — major realizations; GP obligation $334M" },
          { name:"EPF Funds", vintage:"Various", gross:43, net:21 },
          { name:"HVF I", vintage:"2017", gross:73, net:35 },
          { name:"Freedom Parent Hdg.", vintage:"Various", gross:11, net:5 },
          { name:"AIOF I, II & III", vintage:"Various", gross:24, net:12 },
          { name:"HVF III", vintage:"2024", gross:7, net:3, note:"New fund" },
        ]},
        { label:"Credit / Insurance", funds:[
          { name:"Redding Ridge Hldgs", vintage:"Various", gross:235, net:113, note:"↑ from $214M" },
          { name:"Accord & Accord+", vintage:"Various", gross:67, net:32 },
          { name:"FCI Funds", vintage:"Various", gross:88, net:42 },
          { name:"Credit Strategies", vintage:"Various", gross:49, net:24 },
          { name:"MidCap FinCo", vintage:"Various", gross:39, net:19 },
          { name:"Athora", vintage:"Various", gross:5, net:2 },
        ]},
        { label:"Other / S3 / Co-invest", funds:[
          { name:"Other Strategies / SIAs", vintage:"Various", gross:559, net:268, note:"Incl. S3, misc credit, SIAs" },
          { name:"Champ L.P.", vintage:"Various", gross:16, net:8, note:"New co-investment vehicle" },
        ]},
      ],
    },
  },
};

// ── Transcript-vs-PitchBook exit reconciliation (Carry tab). For each firm, the last 2 earnings calls
//    (S&P Global) vs PitchBook exits in the same window. verdict: Match | Partial | Diverge.
window.ALTS.exitRecon = {
  "BX": {
    "verdict": "Partial",
    "transcripts": [
      "Q4 2025 — Jan 29, 2026",
      "Q1 2026 — Apr 23, 2026"
    ],
    "pbExits": "18 exits, ~$46.4B disclosed TV (Wiz $32B dominates Q1; ex-Wiz ~$14.4B)",
    "note": "Directional match on exit momentum but significant PitchBook gaps. Management named Resolution Life (PB: $8.2B Oct 31 2025, confirmed) and ARKA Group / 'aerospace & defense company' (PB: $2.6B Mar 9 2026, confirmed). Wiz ($32B Q1 2026) is the single largest PB exit and was NOT referenced in the April 23 transcript. Medline IPO ($7.2B, described as 'largest PE-backed IPO since 2021') was heavily discussed but does NOT appear in PB for Q4 2025 or Q1 2026 — likely captured in a prior period or Medline is a minority stake. Net realizations reported: Q4 +59% YoY ($957M) and Q1 +26% YoY ($448M). Management cited near-term slowdown (Iran-Israel war) on the Q1 call.",
    "points": [
      "MATCH: Resolution Life Group exit ($8.2B, Oct 31, 2025) — confirmed in both Q4 2025 transcript and PitchBook",
      "MATCH: ARKA Group / 'aerospace & defense company' exit ($2.6B, Mar 9, 2026) — confirmed in Q1 2026 transcript and PitchBook",
      "GAP: Wiz exit ($32B, Q1 2026) in PitchBook but not referenced by management in the Q1 transcript",
      "GAP: Medline IPO ($7.2B) discussed extensively in transcripts but absent from PitchBook for Q4 2025 and Q1 2026",
      "TONE: Management described realizations as 'accelerating' (Q4) with Q1 pace 'moderating' near-term due to geopolitical uncertainty"
    ]
  },
  "KKR": {
    "verdict": "Partial",
    "transcripts": [
      "Q4 2025 — Feb 5, 2026",
      "Q1 2026 — May 5, 2026"
    ],
    "pbExits": "8 exits, ~$14.64B disclosed TV (Resolution Life $8.2B dominates Q4)",
    "note": "Transcript monetization figures materially exceed PitchBook exit count — KKR's $880M Q1 monetization includes public secondary sales and dividend recaps not captured as PitchBook exit events. Named exits: OneStream Software (4.5x cost, cited in Q1 transcript) appears in PitchBook as Apr 1 2026 — on the Q1/Q2 border. CoolIT Systems (~15x cost, cited in Q1) not in PitchBook. Hyundai Marine Solutions secondary (7x+ cost, cited) in PitchBook as May 2025 — a prior period. Management acknowledged the $7 ANI/unit 2026 target is 'challenging' due to delayed exit activity; Q1 realized carry $720M (+120% YoY) was the bright spot. Forward pipeline described as 'largest ever' at $1.2B+.",
    "points": [
      "MATCH: Kito Crosby ($2.7B, Q1 2026) and Novaria Group ($2.2B, Q1 2026) both confirmed in PitchBook",
      "MATCH: Resolution Life ($8.2B, Q4 2025) confirmed in PitchBook",
      "BORDER: OneStream Software — transcript cites Q1 exit (4.5x cost) but PitchBook date is Apr 1, 2026 (technically Q2)",
      "GAP: CoolIT Systems (~15x return, cited in Q1 transcript) absent from PitchBook entirely",
      "GAP: Hyundai Marine Solutions secondary (cited as Q1 event) in PitchBook as May 2025 — prior period timing mismatch",
      "TONE: Management noted $7 ANI target likely unachievable in 2026; $1.2B forward pipeline described as 'largest ever'"
    ]
  },
  "APO": {
    "verdict": "Partial",
    "transcripts": [
      "Q4 2025 — Feb 9, 2026",
      "Q1 2026 — May 6, 2026"
    ],
    "pbExits": "10 exits, ~$8.32B disclosed TV (Aspen $3.5B and AB InBev $2.9B dominate Q1)",
    "note": "Apollo's transcripts center on credit origination and insurance (Athene AUM), not traditional PE exit activity. Realized performance fees in Q4 came from Fund X catch-up carry (first time above escrow hurdle), Accord+ portfolio monetization, and credit hedge fund fee crystallization — structures not visible as PitchBook exit events. QXO ($753M, Jan 20 2026), Aspen Insurance ($3.5B, Feb 24 2026), and AB InBev metal containers ($2.9B, Jan 30 2026) are all plausible portfolio exits and appear in PitchBook for Q1 2026 — but management did not name them on the calls. Jim Zelter stated explicitly: 'our performance in 2026 is not going to be market-dependent on the equity market.' Apollo's $71B origination target and insurance balance sheet growth dominated Q1 commentary.",
    "points": [
      "PLAUSIBLE: QXO ($753M, Jan 2026), Aspen Insurance ($3.5B, Feb 2026), AB InBev containers ($2.9B, Jan 2026) in PitchBook and within transcript period — but management did not name these assets",
      "STRUCTURE: Q4 realized carry largely from Fund X escrow release and Accord+ credit portfolio — not PE exits captured in PitchBook",
      "DIVERGE: Transcripts make no reference to traditional PE exit pipeline; PitchBook shows 10 exits across the 2 quarters",
      "TONE: 'Performance in 2026 is not going to be market-dependent on the equity market' (Jim Zelter, Q1 2026) — credit/insurance orientation confirmed",
      "TONE: $71B origination target and Athene AUM growth dominated both calls; PE realizations treated as incidental"
    ]
  },
  "ARES": {
    "verdict": "Partial",
    "transcripts": [
      "Q4 2025 — Feb 5, 2026",
      "Q1 2026 — May 1, 2026"
    ],
    "pbExits": "19 exits, ~$22.75B disclosed TV (Clario $8.875B and GHX $5B dominate Q1)",
    "note": "Ares transcripts focus almost entirely on credit metrics (portfolio EBITDA growth ~10%, LTV in 40s%, 2.2x interest coverage), fundraising records, and European-style carry accrual — not named PE exits. The two largest Q1 PitchBook exits (Clario $8.875B and Global Healthcare Exchange $5B) were NOT mentioned in the May 1 transcript. X-energy IPO was highlighted on the Q1 call (cost ~$100M, fair value ~$700M), but the IPO closed late April 2026 — technically Q2. Jarrod Phillips guided to ~$350M European-style realized performance income in 2026 (double 2025 level). Q4 call described 2026 as 'most significant year for realization of European-style performance fees ever.'",
    "points": [
      "GAP: Clario ($8.875B, Q1 2026) and Global Healthcare Exchange ($5B, Q1 2026) are the two largest PitchBook exits but absent from Q1 transcript",
      "TIMING: X-energy IPO celebrated in Q1 transcript but IPO completed late April 2026 — technically Q2; not in PitchBook for Q1",
      "STRUCTURE: European-style carry means Ares does not realize performance fees until full capital return — so large Q1 PB exits may not yet generate realized carry in financial statements",
      "TONE: Q4 2025 call: '2026 most significant year for realization of European-style performance fees ever'; Q1 2026 confirms $350M guidance",
      "TONE: Credit portfolio health dominates both calls — EBITDA growth ~10%, LTV in low-40s%, 2.2x interest coverage cited as evidence of portfolio resilience"
    ]
  },
  "BAM": {
    "verdict": "Partial",
    "transcripts": [
      "Q1 2026 (May 8, 2026)",
      "Q4 2025 (Feb 4, 2026)"
    ],
    "pbExits": "0 exits, $0 disclosed TV across the 2 quarters (Oct 2025–Mar 2026)",
    "note": "BAM's PitchBook entity is essentially empty — only 2 all-time exits (Livensa Living Mar 2025, Energy Infrastructure Trust May 2024), both outside the window. Management cited $8B of equity proceeds from monetization in Q1 2026 and $50B for full-year 2025 (at the broader Brookfield ecosystem level), but these realizations sit under Brookfield Corporation's operating subsidiaries and funds, not under the BAM asset-management entity that PitchBook tracks. The 'Partial' verdict reflects genuine directional alignment (management is clearly active in monetizations) but a structural data gap that makes direct comparison impossible.",
    "points": [
      "Q1 2026: management said the platform 'invested or committed $34 billion and generated approximately $8 billion of equity proceeds from monetization' in the quarter, with expectations that 'activity will further build as the year progresses.'",
      "Q4 2025 full-year summary: 'we monetized $50 billion of equity from investments at very good returns, demonstrating that stabilized high-quality assets and essential service businesses continue to attract strong demand.'",
      "Forward commentary is constructive: 'M&A has picked up, particularly in larger strategic transactions where buyers are moving with greater conviction'; 'sponsors are seeking to return capital, which is contributing to increased deal supply.'",
      "No individual portfolio company exits were named in either transcript — consistent with BAM's role as a fee-earning asset manager; monetization disclosures occur at the Brookfield Corporation and fund level.",
      "PitchBook BAM entity captures virtually no exits (0 in the study window, 2 all-time), so the data source cannot validate or contradict management's commentary; the sparse PitchBook record is expected given how Brookfield is structured."
    ]
  },
  "CG": {
    "verdict": "Partial",
    "transcripts": [
      "Q1 2026 (May 7, 2026)",
      "Q4 2025 (Feb 6, 2026)"
    ],
    "pbExits": "4 exits, ~$208M disclosed TV across the 2 quarters (Oct 2025–Mar 2026)",
    "note": "Management's realization narrative is emphatically bullish — record $12B+ quarterly realization volumes, record U.S. buyout DPI, and high-profile IPOs (Medline, StandardAero, Hexaware, Rigaku) cited prominently. PitchBook captures only 4 small exits (The Atlas Group, Netceed, Schön Klinik secondary, Arctic Glacier) totaling ~$208M, nowhere near the multi-billion dollar volumes described. The directional signal — an active exit environment — aligns, but PitchBook's CG entity misses the major transactions (especially IPOs and large M&A) that drove Carlyle's reported realizations, likely because those sit under specific fund entities or are tracked under the issuing subsidiary rather than 'The Carlyle Group Inc.' as buyer.",
    "points": [
      "Q4 2025: Harvey Schwartz cited 'the largest sponsor-backed IPO of all time' in Medline (equity value $49B, IPO raised >$7B), plus StandardAero, Hexaware and Rigaku IPOs — 'we have been the #1 private equity sponsor globally by IPO proceeds, generating roughly $10 billion of IPO issuance over the past 2 years.'",
      "Q4 2025: 'realized proceeds totaled $34 billion, almost 20% higher year-over-year and our second best year on record'; '$12 billion of proceeds in Q4 alone.'",
      "Q1 2026: 'Realizations were more than $12 billion, reflecting the high quality of our portfolio'; 'record amount of capital to U.S. buyout fund investors this quarter, a rate which is more than 40% higher than our prior record set in 2021.'",
      "Q1 2026: CP VII returned nearly $5B in proceeds in Q1 alone (DPI now >70%); net realized performance revenue of only $21M because 'most exits were in funds not yet realizing carry, notably CP VII and CP VIII' — management telegraphed upcoming carry from Japan IV, Financial Services Fund III, and European Tech Fund IV.",
      "PitchBook captures 4 modest exits in the window (The Atlas Group, Netceed at $82M, Schön Klinik secondary, Arctic Glacier at $126M) — materially understates Carlyle's actual realization activity; the gap likely reflects that large IPOs and M&A exits are recorded under fund or company entities, not The Carlyle Group Inc. as seller."
    ]
  },
  "TPG": {
    "verdict": "Match",
    "transcripts": [
      "Q1 2026 (May 1, 2026)",
      "Q4 2025 (Feb 5, 2026)"
    ],
    "pbExits": "6 exits, ~$3,650M disclosed TV across the 2 quarters (Oct 2025–Mar 2026)",
    "note": "TPG's management commentary and PitchBook data are directionally consistent and the named exit types overlap well. Management cited ~$9B of Q1 2026 realizations (doubled YoY) with named exits in OneOncology (to Cencora) and Intersect Power digital business (to Google), plus the Curium Pharma CV. PitchBook records Ouro Medicines ($1,675M M&A, Mar 2026) in Q1 and a cluster of health/biotech exits in Q4 2025 (Elektrofi $810M, BETA Technologies $1,015M IPO, Saluda Medical $150M IPO, Fandom, ChemEOR), consistent with the active realization pace described. The ~$3.65B disclosed TV is plausible for a subset of the $9B+ management cited; PitchBook likely misses some exits (e.g. the OneOncology/Cencora deal, the Intersect/Google transaction) because they may be tracked differently.",
    "points": [
      "Q1 2026: Jon Winkelried said 'we are off to a strong start for monetizations in 2026 with nearly $9 billion realized in the first quarter, which doubled year-over-year'; named strategic exits were OneOncology (sold to Cencora, TPG Capital) and Intersect Power's digital power business (sold to Google, Rise Climate), both achieved within 4 years of initial investment.",
      "Q1 2026: '$68 million in realized performance allocations in the quarter, exceeding the $50 million we had previously guided to' — anchored by the OneOncology and Intersect Power sales.",
      "Q4 2025: TPG generated '$23 billion of realizations in 2025' with 'double-digit value creation across nearly all platforms'; Q4 alone included the Wireless Logic EUR 2B GP-led CV (largest single-asset CV in Europe in 2025) and $48M of realized performance allocations primarily from the credit platform.",
      "Forward commentary: management maintains 'an active pipeline of liquidity prospects across each of our strategies' and expects 'strong and consistent pace to continue or even accelerate' assuming favorable market conditions; focus areas include Japan real estate, digital infrastructure, and GP-led secondaries.",
      "PitchBook records 6 exits in the window totaling ~$3.65B disclosed TV, including BETA Technologies ($1,015M IPO Nov 2025), Elektrofi ($810M M&A Nov 2025), Ouro Medicines ($1,675M M&A Mar 2026), Saluda Medical ($150M IPO Dec 2025) and Fandom/ChemEOR — directionally consistent with management's active-exit narrative, though PitchBook likely captures only a subset of the total $9B+ Q1 volume."
    ]
  },
  "PGHN": {
    "verdict": "Match",
    "transcripts": [
      "FY2025 (2026-03-10)",
      "H1 2025 (2025-09-02)"
    ],
    "pbExits": "8 exits, ~$13.5B disclosed TV across the 2 reports",
    "note": "Transcript claims +47% exit activity increase. PB shows ~8 sized exits totaling ~$13.5B in 2025. Directional consistency: management narrative of high-activity realization year is supported by volume and size of PB entries. Performance fee of CHF 819M consistent with scale of realizations.",
    "points": [
      "Apex Logistics: transcript named (H1 2025) → PB $996M Oct 2025 (MATCH)",
      "Klarna IPO: transcript described public-market exit → PB $1372M Sep 2025 (MATCH)",
      "AmSurg: transcript named → PB $3900M Jun 2025 (MATCH)",
      "Vermaat: transcript named → PB $1743M Dec 2025 (MATCH)",
      "VSB Holding: not named in transcript excerpt but PB records $1570M Apr 2025",
      "Form Technologies: not named in transcript excerpt, PB $1074M Jan 2025",
      "Techem: management referenced agreed sale in H1 2025; not found in exits.js — likely European data gap or not yet closed"
    ]
  },
  "EQT": {
    "verdict": "Partial",
    "transcripts": [
      "FY2025 (2026-01-30)",
      "Q1 2026 (2026-04-25)"
    ],
    "pbExits": "7 exits, ~$10.9B disclosed TV across the 2 reports",
    "note": "EUR 19B fund exits in FY2025 vs PB ~$2.9B disclosed for 2025 = massive undercount (~85% gap). Even including Q1 2026 items, PB captures only ~$10.9B vs transcript's implied EUR 19B+ for funds alone plus $6.3B Galderma final. EQT's exit route is predominantly ECM block trades in listed vehicles (Galderma, Azelis, Kodiak, Beijer Ref) which appear only partially or with delay in PB. IFS completely absent.",
    "points": [
      "Galderma: transcript confirms multiple tranches + ~$20B capital gains total; PB shows $6.3B final block Mar 2026 (PARTIAL — PB only captures final tranche, mid-2025 tranches absent)",
      "Azelis: transcript Q1'26 mentions partial sale; PB $225M Feb 2026 (MATCH)",
      "Dellner Couplers: transcript Q1'26 named; PB $960M Feb 2026 (MATCH)",
      "IFS minority at 7x MOIC (~EUR 3B): major exit NOT in PB exits.js",
      "Galderma 2025 tranches ($20B cumulative): only final $6.3B block in PB",
      "Thyssenkrupp elevator stake: absent from PB",
      "Perficient: absent from PB"
    ]
  },
  "CVC": {
    "verdict": "Partial",
    "transcripts": [
      "FY2025 (2026-03-11)",
      "H1 2025 (2025-09-04)"
    ],
    "pbExits": "5 exits, ~$6.5B disclosed TV across the 2 reports",
    "note": "EUR 21.9B claimed vs ~$6.5B PB disclosed (all periods combined including post-period Naturgy) = ~70% undercount. CVC was a recent IPO (Apr 2024) and its PB coverage is very thin on historical exits. Named deals where both sources agree are consistent, but volume gap is enormous.",
    "points": [
      "OANDA: transcript H1'25 named; PB $250M Jan 2025 (MATCH)",
      "Ethniki: transcript FY'25 named; PB $694M Nov 2025 (MATCH)",
      "Alvogen: transcript FY'25 named; PB $2000M Dec 2025 (MATCH)",
      "Naturgy: transcript FY'25 referenced (close 2026); PB $3587M May 2026 (MATCH — post period)",
      "EUR 21.9B total FY2025 realizations vs PB ~$2.9B for 2025 alone: >85% of volume absent",
      "Transcript cites 'most PE exits in Europe of any firm in 2025' — implies 20+ named deals; PB shows only 3 in 2025",
      "Many European-domiciled PE exits (unnamed in transcript) not captured by PB investor-entity feed"
    ]
  },
  "ICG": {
    "verdict": "Partial",
    "transcripts": [
      "FY2026 (year ended Mar 31, 2026) (2026-05-21)",
      "H1 2026 (6m ended Sep 30, 2025) (2025-11-18)"
    ],
    "pbExits": "6 exits, ~$4.6B disclosed TV across the 2 reports",
    "note": "$7B claimed FY2026 vs PB ~$4.6B disclosed across broader period including FY2025 items = gap explained largely by ICG's credit-heavy strategy. Equity-facing exits (PSB Academy, With Intelligence, Ventura) are reasonably well-captured. The gap is structural (credit vs equity) not a PB data quality issue per se.",
    "points": [
      "With Intelligence: transcript FY2026 named; PB $1800M Nov 2025 (MATCH — also in PGHN feed as joint deal)",
      "PSB Academy: transcript FY2026 named; PB $544M Jan 2026 (MATCH)",
      "Amolyt Pharma: transcript referenced as prior-period exit; PB $1107M Jul 2024 (MATCH — in prior FY2025)",
      "Bulk of ~$7B FY2026 realizations: PB shows only ~$2.7B for FY2026 period (Apr 2025-Mar 2026)",
      "Credit/structured debt repayments: not recorded as equity exit events in PB — structurally absent",
      "Multiple direct lending maturities referenced in H1 transcript: not in PB",
      "Coverage: ICG's PB coverage gap is primarily structural: ICG is ~50% credit strategies (direct lending, CLOs, structured), whose exits/repayments do not appear in equity exit feeds. For ICG's equity PE book, PB coverage is estimated at 50-60%. For total AUM-level exits, PB captures ~30-40%."
    ]
  },
  "BPT": {
    "verdict": "Match",
    "transcripts": [
      "FY2025 (2026-03-12)",
      "H1 2025 (2025-07-18)"
    ],
    "pbExits": "6 exits, ~$10.9B disclosed TV across the 2 reports",
    "note": "EUR 8.1B LP returns (~$8.7B at ~1.08 EUR/USD) vs PB ~$10.9B disclosed. Close alignment, with PB slightly higher due to inclusion of Sun World ($1.4B, Mar 2026) and the infra exits being under separate PB entities not captured in BPT entity total. PE-side exits strongly corroborated; infra exits partially explained by separate entity structure.",
    "points": [
      "Dorna Sports: transcript named; PB $3659M Jul 2025 (MATCH)",
      "Cruise.co.uk: transcript referenced H1; PB $341M Jul 2025 (MATCH)",
      "Cyrus Herez: transcript named; PB $1400M Oct 2025 (MATCH)",
      "Kereis: transcript named at 2.2x MOIC; PB $2332M Oct 2025 (MATCH)",
      "Vermaat: transcript named (joint with PGHN); PB $1743M Dec 2025 (MATCH)",
      "Sun World: PB $1425M Mar 2026 (in-period; not specifically named in transcript excerpt)",
      "Brevo (SaaS exit): transcript named with strong MOIC; NOT in PB exits.js — European data gap"
    ]
  }
};
