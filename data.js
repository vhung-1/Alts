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
  meta: {"asOf":"2026-09-26","refreshed":"2026-09-26","note":"US managers at 2Q26 (30 Jun 2026); European names at H1 2026 (ICG at FY Mar-26 plus its Q1 FY27 trading update). PitchBook activity feeds re-pulled end to end and street consensus pulled on 2026-09-26."},

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
    {"tk":"BX","tier":"Very High","driver":"$68.3B raised in Q2 ($262.5B LTM); BCP Asia III closed at its $13.1B cap, BETP V $5.7B heading to an $8.5B cap (September), SP X $14B+ of ≥$22B; BGREEN IV (≥$8B) launching."},
    {"tk":"KKR","tier":"Very High","driver":"$34B raised in Q2 ($133B LTM, a record); GII V closed at $19.2B, Keystone I at $6.2B, Asia Infra III first close $6.6B, Asian V first close; Helix $10B+; record 2026 expected."},
    {"tk":"ARES","tier":"Very High","driver":"Record $36.4B in Q2 (~$66B 1H); Pathfinder III closed at its $8.5B cap, JDP V at its ¥612B (~$4B) cap; SDL IV first close this fall, data-center fund closings from late 3Q; Q3 wealth ~$4B."},
    {"tk":"APO","tier":"Very High","driver":"Record $60B organic inflows in Q2 ($38B AM, $22B Athene); Fund XI $12B first close (Aug) toward a $25B+ target; AMAPS ~$25B; AOP III pulled forward; Athene on track for $85B."},
    {"tk":"BAM","tier":"Very High","driver":"Record $77B Q2 ($98B YTD, $163B LTM); BIF VI $9.3B and BCP VII $6.7B raised; AI infra $5B first close; Investor Day: $175B of flagship fundraising over 5 yrs."},
    {"tk":"EQT","tier":"High","driver":"€17.8B H1 gross inflows; EQT XI first close at 50% of €23B (activation end-Q3), Infra VII launched at €21B; AI Infra $9.4B FAUM; Coller closed 31 Aug; cycle target >€140B."},
    {"tk":"CG","tier":"High","driver":"$16.8B Q2 ($55.8B LTM, +10%); CP IX launched on a $5B anchor; AAF II ($1.7B hard cap) and CICF II ($2.3B) final closes in Q3; super-cycle flagships next."},
    {"tk":"CVC","tier":"High","driver":"SOF VI closed at $10B (target $7B) and Catalyst III at ~€3.0B (~2x target); Fund X initial target €26B set 11 Sep (formal raise Jan'27); €11B H1 inflows; evergreens ~€7B."},
    {"tk":"TPG","tier":"High","driver":"$16.1B Q2 (+42% YoY), $60.7B LTM record; >$50B 2026 target reaffirmed 3x; TPG X/THP III finals by YE; TREP V first close near."},
    {"tk":"BPT","tier":"High","driver":"2024-26 target lifted to €28B with €26B raised; ECP VI closed at $8.1B (vs $5B target) and BDL IV at €5.1B; BE VIII at €7.0B heading for €8-8.5B in Q1'27."},
    {"tk":"ICG","tier":"Moderate","driver":"Europe IX closed at a record €12B (9 Sep, hard cap kept); $4.1B raised in Q1 FY27; SDP VI and SRE III launched; FY27 guided below FY26's $16.6B."},
    {"tk":"PGHN","tier":"Moderate","driver":"Record $16B H1 (+31%); Direct Infra IV closed >$15B, Secondary VIII >$9B, Direct Equity VI raising; FY $26-32B reconfirmed, but mature-evergreen redemptions ($3.8B in H1) cap net flows."},
    {"tk":"OWL","tier":"Steady","driver":"$7.8B Q2 ($50.5B LTM, from $57B); Net Lease VII ~$8B heading to ~$8.5B; GP Stakes VI $10.6B; BODI IV first close 2H; wealth inflows off the May trough."}
  ],

  firms: {

    // ───────────────────────── BX (pending agent) ─────────────────────────
    BX: {
      ticker:"BX", name:"Blackstone", longName:"Blackstone Inc.", exchange:"NYSE", country:"US",
      color:"#6D28D9", cadence:"quarterly", period:"Q2 2026", periodEnd:"2026-06-30", reportDate:"2026-07-23",
      reported:{ FRE:"$1,783M", FRE_ps:"$1.43", fpAUM:"$962B", DE_ps:"$1.52", comment:"FRE $1.78B (+22% YoY, $1.43/sh); DE $2.0B (+26%); $68.3B inflows in Q2 / $262.5B LTM lifted AUM 11% to a record $1.35T; net realizations $414M (+27%)." },
      fundraising:[ { "name": "Strategic Partners X", "strategy": "PE Secondaries", "status": "In market", "target": ">$22B", "hardCap": "N/A", "prevFund": "$22B (SP IX)", "raisedToDate": "$14B+", "firstClose": "2026-01", "finalClose": "N/A", "pb": "N/A", "comment": "Q2 secondaries inflows $5.7B, mostly SP X; 'over $14B' raised vs 'at least $22B' target (2Q call, 23 Jul). Fee activation is a building block for double-digit base-fee growth in 2027." }, { "name": "Energy Transition Partners V (BETP V)", "strategy": "Energy Transition PE", "status": "In market (final close exp. Sep'26)", "target": "~$8.7B (mgmt)", "hardCap": "$8.5B (LP docs)", "prevFund": "$5.6B (BETP IV)", "raisedToDate": "$5.7B", "firstClose": "2026-04", "finalClose": "Sep 2026 (exp.)", "pb": "29541-43F", "comment": "$5.7B of Q2 inflows ($5.67B committed at 30 Jun), already the size of BETP IV. Mgmt expects it 'to hit its hard cap soon' (~$8.7B); Louisiana TRS papers cite an $8.5B hard cap with final close in September. No close announced as of 23 Sep." }, { "name": "BCP Asia III", "strategy": "Asia PE", "status": "Final close (Jun'26)", "target": "$10B", "hardCap": "$13.1B", "prevFund": "$6B (Asia II)", "raisedToDate": "$13.1B", "firstClose": "N/A", "finalClose": "2026-06", "pb": "26168-32F", "comment": "Closed 2 Jun at its hard cap, above the $10B target and more than 2x the prior vintage; $1.8B raised in Q2. Prior fund 27% net annual return." }, { "name": "Green Private Credit IV (BGREEN IV)", "strategy": "Energy-transition / digital-infra credit", "status": "Launched (Sep'26)", "target": "≥$8B", "hardCap": "N/A", "prevFund": "$6.5B (BGREEN III)", "raisedToDate": "N/A", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "Bloomberg (15 Sep): seeking at least $8B for loans to power/utilities, energy security, data centers and chip financing. BGREEN III returned +4.5% gross in Q2." }, { "name": "BXPE (private wealth PE)", "strategy": "Perpetual PE (wealth)", "status": "Perpetual / ongoing", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "$27B NAV", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "$2.4B raised in Q2 (June was the best month since launch at $1.2B); NAV over $25B at 30 Jun and $27B by 15 Sep (Barclays). 20% net annualized since inception." }, { "name": "BXDC (Digital Infrastructure Trust)", "strategy": "Listed data-center REIT", "status": "IPO (Q2'26)", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "$2.0B", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "$2.0B IPO in Q2, the largest blind-pool REIT IPO in history. Buys stabilized, newly built data centers; mgmt sees a potential $1T market." }, { "name": "BXHF (perpetual multi-strategy HF)", "strategy": "Hedge fund solutions (wealth)", "status": "First close (Aug'26)", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": ">$200M", "firstClose": "2026-08", "finalClose": "N/A", "pb": "N/A", "comment": "New BXMA wealth product; first close over $200M in August (Chae, Barclays 15 Sep). BXMA's 1 Jul subscriptions of $4.8B were its best fundraising month ever." } ],
      fundraisingSummary:"Q2 inflows were $68.3B ($262.5B LTM, +24% and the best 12 months in nearly four years), led by credit & insurance ($31.0B) and PE ($24.5B). BCP Asia III closed at its $13.1B hard cap (2 Jun), BETP V reached $5.7B, and SP X passed $14B of its ≥$22B target. The H2 pipeline is BETP V's final close (September, $8.5B cap), SP X, a new ≥$8B BGREEN IV credit fund, BXHF (first close >$200M in August) and the Wellington/Vanguard products; wealth perpetual sales rose sequentially in 3Q.",
      guidance:[ { "metric": "Net realizations", "period": "Q3 2026", "value": "Down sequentially (reiterated)", "source": "conference transcript", "comment": "Chae at Barclays (15 Sep), a week before the 22 Sep 8-K prelim (>$350M gross). Compares with $414M of net realizations in 2Q; 4Q BXMA crystallizations are scheduled." }, { "metric": "Private wealth perpetual sales", "period": "Q3 2026", "value": "Up sequentially", "source": "conference transcript", "comment": "Chae at Barclays (15 Sep). Total wealth sales were $8.6B in 2Q; BXPE NAV reached $27B. Wellington/Vanguard multi-asset funds have launched." }, { "metric": "BIP infrastructure crystallization", "period": "Q4 2027", "value": "Large scheduled crystallization; NAPR >$900M at 2Q", "source": "conference transcript", "comment": "Chae at Barclays (15 Sep): about halfway through the three-year period, driven by data centers and power. Energy PE NAPR also doubled YoY to over $1B." }, { "metric": "IPO pipeline", "period": "Current", "value": "6 IPOs on file; 9 completed in LTM (5 since May)", "source": "conference transcript", "comment": "The 23 Jul call cited 3 IPOs since May and 8 on file; by 15 Sep it was 5 since May and 6 on file (Jersey Mike's priced 29 Jul, $1.0B). About a third of corporate PE NAPR is publicly traded." }, { "metric": "Private credit defaults", "period": "Near term", "value": "Rising from historic lows but manageable", "source": "conference transcript", "comment": "Chae at Barclays (15 Sep): BCRED borrower EBITDA +10% LTM, interest coverage ~2.3x, direct-lending spreads 25-50bps wider YTD; software borrowers still growing EBITDA at double digits." }, { "metric": "Intra-quarter realization update", "period": "3Q26 (1 Jul-22 Sep)", "value": ">$350M realized perf rev + principal inv. income", "source": "8-K", "comment": "Filed 22 Sep. ~90% is realized performance revenue (~$315M+) vs $731M in 2Q26 and $745M in 3Q25 - roughly half on a like-for-like gross basis. Pre-compensation, so not the net-realizations line; at BX's historical net/gross ratio it implies net of roughly $180-200M, below the 12-quarter low." }, { "metric": "Base management fees", "period": "Q3 2026", "value": "Similar YoY growth to Q2", "source": "transcript", "comment": "Base fees grew mid-single-digit in Q2; same YoY pace expected in 3Q." }, { "metric": "Base management fees", "period": "FY2027", "value": "Return to double-digit growth", "source": "transcript", "comment": "PE drawdown activations, perpetual/infra scaling, $84B credit dry powder, RE base-fee stabilization." }, { "metric": "Net realizations", "period": "H2 2026", "value": "3Q down seq., 4Q robust", "source": "transcript", "comment": "Net accrued perf revenue $7.5B ($6.00/sh), a 4-year high." }, { "metric": "Transaction & advisory fees", "period": "H2 2026", "value": "Considerable pipeline", "source": "transcript", "comment": "Record $321M in 2Q; variable but rising baseline." }, { "metric": "BCRED redemptions", "period": "Q3 2026", "value": "Sharp QoQ decline in new requests", "source": "conference transcript", "comment": "Q3 repurchase requests were posted 'a few weeks' before 15 Sep. Q2 and Q3 requesters will have received ~75% of their capital; $3.5B of repayments and inflows cover repurchases ~160% (Chae, Barclays 15 Sep). 2Q net outflows were $1.2B." }, { "metric": "Data center platform", "period": "Next few years", "value": "Could double from $185B", "source": "transcript", "comment": "Expects to lease 3x more capacity in 2026 than any prior year; 15GW of powered sites." } ],
      guidanceSummary:"2026 is still a bridge year on base fees (mid-single-digit YoY growth in 3Q, double digits again in 2027), with transaction fees and FRPR carrying fee growth. 3Q realizations are weak: the 22 Sep 8-K put 1 Jul-22 Sep realized performance revenue plus principal investment income at >$350M (~90% performance revenue), against $731M of gross performance revenue in 2Q, and Chae reiterated a sequential decline at Barclays. The step-up is pushed to 4Q (BXMA crystallizations) and 2027 (6 IPOs on file, $7.5B NAPR, BIP crystallization in 4Q27).",
      consensus:{ FRE:{cons:1564,n:15}, PFRE:{cons:484,n:15}, FRE_ps:{cons:1.27,n:15}, DE_ps:{cons:1.39,n:15}, netFlowsTotal:{cons:30.7,n:15}, netFlowsCredit:{cons:12.9,n:15} },  // 2Q26E VA cons (10-Jun-26); PFRE=net realizations
      exits:{ quarterly:{
        "2023 Q2":{count:15,totalTV:3922}, "2023 Q3":{count:21,totalTV:8867}, "2023 Q4":{count:5,totalTV:210}, "2024 Q1":{count:17,totalTV:3749},
        "2024 Q2":{count:15,totalTV:5120}, "2024 Q3":{count:13,totalTV:4001}, "2024 Q4":{count:17,totalTV:2067}, "2025 Q1":{count:21,totalTV:4972},
        "2025 Q2":{count:17,totalTV:4428}, "2025 Q3":{count:15,totalTV:9657}, "2025 Q4":{count:22,totalTV:15127}, "2026 Q1":{count:12,totalTV:35032},
        "2026 Q2":{count:16,totalTV:24910} },
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
      color:"#B45309", cadence:"quarterly", period:"Q2 2026", periodEnd:"2026-06-30", reportDate:"2026-07-30",
      reported:{ FRE:"$1,214M", FRE_ps:"$1.32", fpAUM:"$638B", DE_ps:"$1.63", comment:"ANI/sh $1.63 (+40%, KKR's headline); record FRE (+37%), TOE and ANI; largest monetization quarter in KKR history; AUM $796B (+16%); $34B raised." },
      fundraising:[ { "name": "Global Infrastructure Investors V", "strategy": "Global Infrastructure (Core+)", "status": "Final close (Aug'26)", "target": "N/A", "hardCap": "N/A", "prevFund": "~$17B (GII IV)", "raisedToDate": "$19.2B", "firstClose": "N/A", "finalClose": "2026-08", "pb": "23764-06F", "comment": "Closed 3 Aug, KKR's largest infra fund ($18.6B committed at 30 Jun); >$9B already committed. Part of ~$45B raised across KKR's latest infra vintages." }, { "name": "Asian Fund V", "strategy": "Asia PE", "status": "In market (first close Jun'26)", "target": "$15B", "hardCap": "N/A", "prevFund": "$15B (Asian IV)", "raisedToDate": "$5.2B (Form D)", "firstClose": "2026-06", "finalClose": "N/A", "pb": "28486-09F", "comment": "Main driver of the $10B Q2 PE raise. Form D (filed 14 Aug) shows $5.2B from 112 investors, first sale 12 Jun; market sources expect it to top EQT's $15.6B record for Asia." }, { "name": "Asia Pacific Infrastructure Investors III", "strategy": "Asia Infrastructure", "status": "In market (first close $6.6B)", "target": "N/A", "hardCap": "N/A", "prevFund": "$6.4B (APII II)", "raisedToDate": "$6.6B", "firstClose": "Sep 2026 (reported)", "finalClose": "N/A", "pb": "N/A", "comment": "$6.6B first close, a record for APAC infrastructure (Infrastructure Investor, 10 Sep); $5.9B committed at 30 Jun. Final size expected to be substantially higher." }, { "name": "Helix Digital Infrastructure", "strategy": "AI infrastructure (perpetual company)", "status": "Launched (Jun'26)", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "$10B+ initial", "firstClose": "2026-06", "finalClose": "N/A", "pb": "N/A", "comment": "Perpetual AI-infrastructure company (data centers, power, connectivity) led by ex-AWS CEO Adam Selipsky. Nvidia and Vistra are strategic partners, KIA a founding investor. No size target; mgmt sees 'tens of billions'. KKR earns management and performance fees." }, { "name": "Arctos Keystone Partners Fund I", "strategy": "GP Solutions", "status": "Final close (Jul'26)", "target": "$4B", "hardCap": "N/A", "prevFund": "N/A (first-time fund)", "raisedToDate": "$6.2B", "firstClose": "N/A", "finalClose": "2026-07", "pb": "N/A", "comment": "Closed 7 Jul at $6.2B vs a $4B target, the largest first-time GP-solutions fund and the first Arctos close since KKR's May acquisition. Counted in Q2 PE inflows." }, { "name": "K-Series (wealth suite)", "strategy": "Multi-strategy wealth", "status": "Perpetual / ongoing", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "$42B AUM (+~70% YoY)", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "$3B raised in Q2 after April lows; AUM +20% YTD, ~85% PE and infra. From 2Q, K-Series PE performance fees are booked in FRPR (15-20% comp rate vs 70-80%)." } ],
      fundraisingSummary:"KKR raised $34B in Q2 ($133B LTM, a record), taking capital raised since January 2024 to $305B, past its $300B three-year target. GII V closed at a record $19.2B (3 Aug) and Arctos Keystone I at $6.2B (7 Jul, vs a $4B target); Asian Fund V held its first close (Form D: $5.2B), Asia Infra III reached a record $6.6B first close (September) and Helix launched with $10B+. Management expects a record fundraising year, including record third-party credit, with 30+ products in market over the next 12-18 months.",
      guidance:[ { "metric": "USI sale to Aon", "period": "Q4 2026 (expected close)", "value": "~$2.0B ANI (>$2.00/sh); ~$3.3B after-tax proceeds", "source": "8-K / press release", "comment": "Announced 31 Aug: $17B all-cash sale, ~6x the 2017 equity and 3.4x all KKR balance-sheet capital invested, ~33% above the unaffected 30 Jun mark. A Strategic Holdings realization, excluded from the Q3 prelim." }, { "metric": "DOJ HSR settlement", "period": "Q3 2026", "value": "$250M civil penalty; no financial impact", "source": "8-K", "comment": "8-K of 26 Aug: settles the January 2025 HSR complaint and ends all related DOJ investigations. KKR says outside law firms will reimburse the penalty in full. Needs court approval." }, { "metric": "Private IG origination", "period": "YTD 2026", "value": ">$80B originated or placed (+104% vs all of 2025)", "source": "conference transcript", "comment": "Chris Sheldon at Barclays (15 Sep). IG-related capital-markets fees should reach 'hundreds of millions' a year; reiterated a record third-party credit fundraising year. Credit AUM ~$300B, ABF $91B." }, { "metric": "Intra-quarter monetization update", "period": "3Q26 (1 Jul-25 Sep)", "value": ">$750M (~80% RPI / ~20% RII)", "source": "press release", "comment": "Business Wire release, 25 Sep. Above the ~$700M visibility given on 30 Jul; driven by public secondary sales, strategic transactions, dividends and interest. Gross of compensation; excludes USI and fee income. 2Q was a record ($848M RPI + $220M RII)." }, { "metric": "Strategic Holdings op. earnings", "period": "FY2026", "value": "$350M+, back-end weighted", "source": "transcript", "comment": "$37M in 2Q, $85M YTD; path to $1.1B+ by 2030 reaffirmed." }, { "metric": "Insurance op. earnings", "period": "Per quarter", "value": "~$250M +/-", "source": "transcript", "comment": "2Q $288M incl. ~$40M alts realizations, not a run-rate." }, { "metric": "Fundraising", "period": "FY2026", "value": "Record year expected", "source": "transcript", "comment": "$305B raised vs $300B 3-yr target in 2.5 yrs." }, { "metric": "FRE margin", "period": "Ongoing", "value": "70%, not a ceiling", "source": "transcript", "comment": "Above 65% for 10 straight quarters." }, { "metric": "ANI per share target", "period": "2026", "value": "$7 guide withdrawn", "source": "transcript", "comment": "Removed as a distraction; could land modestly above or below." } ],
      guidanceSummary:"Q3 monetization is running above the July guide: the 25 Sep release put 1 Jul-25 Sep monetization income at >$750M (~80% realized performance income), against ~$700M of visibility on the call and excluding USI. The $17B USI sale to Aon (close expected 4Q26) should add ~$2.0B of ANI (>$2.00/sh) through Strategic Holdings. Other targets are unchanged: $350M+ of 2026 Strategic Holdings operating earnings (back-end weighted), ~$250M a quarter of insurance operating earnings, a record fundraising year including record third-party credit, and $72B of committed capital not yet earning fees at ~90bps.",
      consensus:{ FRE:{cons:1070,n:12}, PFRE:{cons:184,n:12}, FRE_ps:{cons:1.17,n:12}, DE_ps:{cons:1.39,n:12} },  // 2Q26E VA cons (10-Jun-26); DE_ps=ANI/adj sh; net flows n/a in export
      exits:{ quarterly:{
        "2023 Q2":{count:14,totalTV:9396}, "2023 Q3":{count:18,totalTV:4054}, "2023 Q4":{count:7,totalTV:2731}, "2024 Q1":{count:9,totalTV:3138},
        "2024 Q2":{count:7,totalTV:339}, "2024 Q3":{count:4,totalTV:0}, "2024 Q4":{count:11,totalTV:8384}, "2025 Q1":{count:8,totalTV:16328},
        "2025 Q2":{count:11,totalTV:2639}, "2025 Q3":{count:12,totalTV:12798}, "2025 Q4":{count:9,totalTV:9882}, "2026 Q1":{count:8,totalTV:8523},
        "2026 Q2":{count:9,totalTV:9433} },
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
      color:"#DB2777", cadence:"quarterly", period:"Q2 2026", periodEnd:"2026-06-30", reportDate:"2026-08-04",
      reported:{ FRE:"$785M", FRE_ps:"$1.26", fpAUM:"$858B", DE_ps:"$2.11", comment:"ANI/sh $2.11 (Apollo's headline; no DE reported). Record FRE $785M (+25%) and record SRE $877M; $60B inflows; $74B origination; FGAUM +34%; FRE margin 58.5%." },
      fundraising:[ { "name": "Apollo Investment Fund XI", "strategy": "Corporate PE", "status": "First close (Aug'26)", "target": "$25B+ (PB)", "hardCap": "N/A", "prevFund": "$20B (Fund X)", "raisedToDate": "$12B+", "firstClose": "2026-08", "finalClose": "1H 2027 (exp.)", "pb": "27053-11F", "comment": "'Surpassed $12B' through July (2Q call). Kleinman (Barclays, 14 Sep): first close in August, path to target through 1H27. PB lists a >$25B target; PEI reported $22-25B. Fees assumed to activate late 1H27, when Fund X is fully invested. Fund X 21% net IRR." }, { "name": "Apollo Origination Partnership III (large-cap direct lending)", "strategy": "Direct Lending", "status": "In market (pulled forward)", "target": ">$5B (larger than AOP II)", "hardCap": "N/A", "prevFund": "$4.8B (AOP II)", "raisedToDate": "N/A", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "Zelter (2Q call): fundraising for the third vintage was pulled forward on institutional demand and is expected to exceed its '$5 billion predecessor' (AOP II closed Oct 2024 at ~$4.8B investable)." }, { "name": "AMAPS (Apollo Multi-Asset Prime Securities)", "strategy": "Multi-asset securitization (insurance/credit)", "status": "Program / ongoing", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "~$25B (5 issuances)", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "Two issuances in Q2 took the program to $25B in under 12 months. About half is held on Apollo/Athene balance sheets and half by third parties; ~50% IG collateral. Overview deck furnished by 8-K on 24 Aug; the structure is being open-sourced." }, { "name": "Apollo Aligned Alternatives (AAA)", "strategy": "Insurance-linked alts (perpetual)", "status": "Perpetual / ongoing", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "$28B NAV ($12B third-party)", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "Positive in 45 of the last 46 quarters; Athene CFO put 2Q at ~11%, 'bang on' the benchmark (13 Aug). Rowan: returns closer to 10% than 11% recently, 'another quarter or 2' to get back." }, { "name": "Apollo Debt Solutions (ADS)", "strategy": "Non-traded BDC (wealth)", "status": "Perpetual / ongoing", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "$31B AUM", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "Q3 redemption requests running at about half the Q2 rate early in the window (Zelter, 4 Aug); Kleinman (14 Sep) expects them to clear over the next couple of quarters. 8% annualized ITD return vs 4% for high yield. Global Wealth raised $3B in Q2." } ],
      fundraisingSummary:"Record organic inflows of $60B in Q2 ($38B asset management incl. $3B global wealth; $22B Athene), $298B LTM including $99B from the Bridge and PIC deals. Fund XI passed $12B through July and held its first close in August (PitchBook target >$25B, path through 1H27); AMAPS reached ~$25B over five issuances; the third large-cap direct lending vintage was pulled forward. In H2, Athene is on pace for $85B with retail strength continuing in 3Q, Athora signed a $6B UK pension deal in July, and institutional is heading for a record year.",
      guidance:[ { "metric": "FY2026 targets", "period": "FY2026", "value": "Reaffirmed (20%+ FRE; 10% SRE at 11% alts; $85B Athene)", "source": "conference transcript", "comment": "Kleinman at Barclays (14 Sep): 'everything we've described from a guidance standpoint... still remains'. Athene FI call (13 Aug) reiterated 10% SRE growth at an 11% alts return and $85B of volumes, with retail strength continuing in 3Q." }, { "metric": "Alternative investment returns (Athene)", "period": "2H 2026", "value": "11% long-term assumption kept; 2Q alts 9% ($76M short)", "source": "transcript", "comment": "2Q alts returned 9% annualized, $76M below the 11% expectation (net spread 114bps reported, ~124bps adjusted). Rowan (4 Aug): AAA 'should be returning more into 10%, not 11%', 'another quarter or 2' to get there. Athene CFO (13 Aug) put AAA at ~11% in 2Q and kept 11% as the normalized assumption." }, { "metric": "Athene net spread trajectory", "period": "Next few quarters", "value": "Compression at an 'inflection point'", "source": "conference transcript", "comment": "Kleinman at Barclays (14 Sep): after spread compression 'it does feel like things are starting to improve', helped by AMAPS and new credits, but the balance sheet 'moves deliberately'." }, { "metric": "ADS redemptions", "period": "Q3-Q4 2026", "value": "Q3 requests ~half of Q2; clearing over next couple of quarters", "source": "conference transcript", "comment": "Zelter (4 Aug): early in the Q3 window requests ran at half the Q2 rate. Kleinman (14 Sep): the 5% cap 'is working' and flows should turn after the backlog clears." }, { "metric": "FRE growth", "period": "FY2026", "value": "20%+", "source": "transcript", "comment": "Pipelines, committed capital not yet fee-paying and signed originations underpin the outlook." }, { "metric": "SRE growth", "period": "FY2026", "value": "10% (at 11% alts return)", "source": "transcript", "comment": "Full-year target maintained." }, { "metric": "Athene net spread", "period": "FY2026", "value": "120-125 bps", "source": "transcript", "comment": "2Q 114bps reported, ~124bps adjusted to an 11% alts return." }, { "metric": "Athene inflows", "period": "FY2026", "value": "$85B, on track", "source": "transcript", "comment": "$42B in 1H; also the through-cycle anchor for 2027." }, { "metric": "FRE margin expansion", "period": "FY2026", "value": "~100 bps", "source": "transcript", "comment": "2Q margin 58.5%; YTD expansion ~90bps." }, { "metric": "Broadcom ACS fees", "period": "Q4 2026 - Q3 2027", "value": "Recognized as $35B draws", "source": "transcript", "comment": "Fees booked as the facility funds, weighted to 4Q26 and first three quarters of 2027." } ],
      guidanceSummary:"Reaffirmed every headline 2026 target: 20%+ FRE growth, ~10% SRE growth on an 11% alts return, ~100bps FRE margin expansion, $85B Athene inflows and a 120-125bps net spread. Forward indicators are the build story - $82B dry powder ($62B carrying ~$400M of future annual management fees), Fund XI past $12B with fee activation late in 1H27, and Broadcom's $35B facility recognizing fees from 4Q26 through 3Q27.",
      consensus:{ FRE:{cons:768,n:13}, PFRE:{cons:62,n:13}, FRE_ps:{cons:1.23,n:13}, SRE_ps:{cons:1.43,n:13}, DE_ps:{cons:2.21,n:13}, netFlowsTotal:{cons:19.2,n:13}, netFlowsCredit:{cons:15.5,n:13} },  // 2Q26E VA cons (10-Jun-26); SRE per sh (RS, operating)
      exits:{ quarterly:{
        "2023 Q2":{count:5,totalTV:414}, "2023 Q3":{count:3,totalTV:0}, "2023 Q4":{count:2,totalTV:108}, "2024 Q1":{count:2,totalTV:0},
        "2024 Q2":{count:6,totalTV:63665}, "2024 Q3":{count:2,totalTV:2047}, "2024 Q4":{count:4,totalTV:0}, "2025 Q1":{count:7,totalTV:4540},
        "2025 Q2":{count:2,totalTV:0}, "2025 Q3":{count:8,totalTV:1247}, "2025 Q4":{count:8,totalTV:6485}, "2026 Q1":{count:11,totalTV:23450},
        "2026 Q2":{count:10,totalTV:12419} },
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
      color:"#2563EB", cadence:"quarterly", period:"Q2 2026", periodEnd:"2026-06-30", reportDate:"2026-07-31",
      reported:{ FRE:"$491M", FRE_ps:null, fpAUM:"$410B", DE_ps:"$1.29", comment:"FRE $491M +20% YoY; record $36.4B gross fundraising and $35.9B deployment; FPAUM $410B +17%; record $170B dry powder." },
      fundraising:[ { "name": "Senior Direct Lending Fund IV (SDL IV)", "strategy": "US Senior Direct Lending", "status": "In market (first close exp. fall'26)", "target": "$10B+", "hardCap": "N/A", "prevFund": "$15.3B (SDL III, lev+unlev)", "raisedToDate": "N/A", "firstClose": "Fall 2026 (exp.)", "finalClose": "N/A", "pb": "N/A", "comment": "No SDL or ACE flagship equity was raised in Q2. Engagement is 'very strong' for both the commingled fund and the new evergreen core product; first closes for both this fall, more in 2027. European DL VII launches early 2027." }, { "name": "Pathfinder III (Ares Alternative Credit)", "strategy": "Asset-Backed Finance", "status": "Final close (Jun'26)", "target": "$6.5B", "hardCap": "$8.5B", "prevFund": "$6.6B (Pathfinder II)", "raisedToDate": "$8.5B", "firstClose": "N/A", "finalClose": "2026-06", "pb": "N/A", "comment": "First and final close on 10 Jun at the increased hard cap, under six months after the January launch; the largest global ABF fund. The Pathfinder strategy raised ~$12.7B incl. ~$4.0B of Pathfinder II extensions." }, { "name": "Japan Logistics Development Partners V (JDP V)", "strategy": "Japan Logistics RE Development", "status": "Final close (Aug'26)", "target": "N/A", "hardCap": "¥612B (~$4B)", "prevFund": "¥412B (JDP IV)", "raisedToDate": "¥612B (~$4B)", "firstClose": "N/A", "finalClose": "2026-08", "pb": "N/A", "comment": "Closed 31 Aug at its hard cap (incl. GP commitment), ~50% larger than JDP IV and Ares Real Estate's largest closed-end raise. CPPIB made a ¥150B cornerstone commitment; ~¥1.7T (~$11B) of investment capacity." }, { "name": "Ares Global Data Center Fund (Ada Infrastructure)", "strategy": "Digital Infra PE", "status": "In market (closings from late Q3)", "target": "N/A", "hardCap": "N/A", "prevFund": "~$2.5B Japan seed (2024)", "raisedToDate": "N/A", "firstClose": "Late Q3 2026 (exp.)", "finalClose": "2027 (exp.)", "pb": "N/A", "comment": "Mgmt expects 'a series of meaningful closings' in late Q3 and Q4 and completion in 2027. Ada is building 7 campuses (22 data centers, ~1GW); the seed pipeline is 700MW. $50-100M of FRE from 2027 reaffirmed. No close announced as of 26 Sep." }, { "name": "Infrastructure Debt Fund VI", "strategy": "Infrastructure Debt", "status": "In market (final close 2H'26)", "target": ">$5B", "hardCap": "N/A", "prevFund": "$5B (prior vintage, incl. leverage)", "raisedToDate": "$3.7B", "firstClose": "N/A", "finalClose": "2026 (exp.)", "pb": "N/A", "comment": "+~$0.5B in Q2. Final close expected later in 2026 above the ~$5B prior vintage (incl. leverage and related vehicles), on power and digital-infra demand." }, { "name": "Ares Core Infrastructure (ACI, evergreen)", "strategy": "Core infrastructure (wealth, perpetual)", "status": "Perpetual / ongoing", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": ">$5.7B AUM (2Q)", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "About $2.7B of Ares' ~$4B of Q3 wealth equity (Arougheti, Barclays 16 Sep); #2 in TTM infrastructure evergreen fundraising (~20% share). The institutional open-ended core infra fund took ~$1.9B in Q2." } ],
      fundraisingSummary:"Record $36.4B of gross capital was raised in Q2 (~$66B in 1H; another record year expected), with ~70% of the YTD raise outside the four largest credit fund families. Pathfinder III closed at its $8.5B hard cap (10 Jun) and JDP V at its ¥612B (~$4B) hard cap (31 Aug), while wealth added $3.9B in Q2 with ~$4B expected in Q3 (~$2.7B into ACI). The H2 pipeline is the first closes for SDL IV and the evergreen core SDL product this fall, data-center fund closings from late Q3, the infra debt VI final close (>$5B), and European DL VII in early 2027.",
      guidance:[ { "metric": "Wealth gross equity fundraising", "period": "Q3 2026", "value": "~$4B (third-best quarter on record)", "source": "conference transcript", "comment": "Arougheti at Barclays (16 Sep): ~$2.7B of it is Ares Core Infrastructure, offsetting softer US direct-lending demand. On track with the '2H similar to 1H (~$8B)' guide; $1.5B came in July." }, { "metric": "ASIF (non-traded BDC) redemptions", "period": "Q3 2026", "value": "Core requests seen down ~35% QoQ again; non-US queue ~$0.6B and falling", "source": "conference transcript", "comment": "Arougheti at Barclays (16 Sep): the non-US family-office/small-institution queue went from $1.2B to $0.6B, with core individual requests normalizing toward ~2% of NAV. Expects ASIF to be larger at YE26 than YE25; 'a couple of quarters' to absorb." }, { "metric": "Deployment pipeline", "period": "Q3 2026", "value": "~20% above the prior record", "source": "conference transcript", "comment": "Arougheti at Barclays (16 Sep): ABF, European DL and infra/infra debt 'very busy'. DL spreads are 25-50bps wider YoY, OID 50-100bps higher, leverage 0.5-1.0x lower." }, { "metric": "Inorganic growth / PE M&A", "period": "Near term", "value": "Bar 'higher and higher'; organic growth more likely", "source": "conference transcript", "comment": "Arougheti's reply at Barclays (16 Sep) to press reports of interest in a PE acquisition: 'for the foreseeable future, organic opportunities are probably more accretive.' He also said on 31 Jul that the price has to be right." }, { "metric": "FRE margin", "period": "FY2026", "value": "Upper end of 0-150bps expansion", "source": "transcript", "comment": "YTD margin 42.3%, ~100bps above prior year; ~$9M biennial AGM cost does not recur in 3Q/4Q." }, { "metric": "Fee-related perf revenue", "period": "Q3 2026", "value": "~$62M", "source": "transcript", "comment": "From open-ended core alt credit fund; ~$32M REIT FRPR accrued for potential 4Q recognition." }, { "metric": "Realized net perf income", "period": "Q3 2026", "value": "~$10M", "source": "transcript", "comment": "Limited in 3Q, but full-year expectations unchanged." }, { "metric": "FRE / RI growth", "period": "FY2026", "value": "16-20% FRE, 20%+ RI", "source": "transcript", "comment": "On track; consistent with 2024 Investor Day CAGR targets." }, { "metric": "Wealth gross fundraising", "period": "2H 2026", "value": "Similar to 1H's ~$8B", "source": "transcript", "comment": "~$3.9B in 2Q (+15% YoY) and ~$1.5B already in July; wealth AUM over $76B." }, { "metric": "Digital infra FRE", "period": "2027+", "value": "$50-100M", "source": "transcript", "comment": "Reaffirmed on fundraising traction and seed portfolio." } ],
      guidanceSummary:"Reaffirmed FY26 objectives of 16-20% FRE and 20%+ RI growth, with FRE margin tracking to the upper end of the 0-150bps expansion guide as the biennial AGM cost rolls off. Earnings are back-half weighted: only ~$10M of realized net performance income in 3Q, with FRPR concentrated in 3Q (~$62M) and 4Q (~$32M REIT accrual). Record $170B dry powder and ~$828M of embedded incremental annual management fees underpin the path.",
      consensus:{ FRE:{cons:485,n:10}, PFRE:{cons:67,n:10}, FRE_ps:{cons:1.40,n:10}, DE_ps:{cons:1.38,n:10} },  // 2Q26E VA cons (10-Jun-26); DE_ps=after-tax realized inc/sh; net flows n/a in export
      exits:{ quarterly:{
        "2023 Q2":{count:7,totalTV:1663}, "2023 Q3":{count:4,totalTV:232}, "2023 Q4":{count:8,totalTV:3402}, "2024 Q1":{count:6,totalTV:51},
        "2024 Q2":{count:3,totalTV:411}, "2024 Q3":{count:2,totalTV:25}, "2024 Q4":{count:4,totalTV:5}, "2025 Q1":{count:6,totalTV:2814},
        "2025 Q2":{count:7,totalTV:1100}, "2025 Q3":{count:7,totalTV:7441}, "2025 Q4":{count:8,totalTV:949}, "2026 Q1":{count:13,totalTV:21119},
        "2026 Q2":{count:5,totalTV:4899} },
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
      color:"#0891B2", cadence:"quarterly", period:"Q2 2026", periodEnd:"2026-06-30", reportDate:"2026-08-05",
      reported:{ FRE:"$808M", FRE_ps:"$0.50", fpAUM:"$672B", DE_ps:"$0.44", comment:"Record quarter: FRE +20% to $808M, DE +15% to $707M; fee-bearing capital $672B (+19% LTM) on an all-time-high $77B of fundraising incl. the $40B Just Group mandate." },
      fundraising:[ { "name": "Brookfield Infrastructure Fund VI (BIF VI)", "strategy": "Infrastructure (flagship)", "status": "In market — 'sizable' first close targeted 2026", "target": "~$30B (Infrastructure Investor)", "hardCap": "N/A", "prevFund": "$30B (BIF V incl. ~$2B co-invest)", "raisedToDate": "$9.3B raised in Q2'26 ($7.9B infra + $1.4B energy segment)", "firstClose": "2026 (exp.; ~$20B targeted per Infrastructure Investor)", "finalClose": "2027 (exp.)", "pb": "N/A", "comment": "Launched Q1'26 and on track to be the largest vintage. Mgmt (5 Aug): 'sizable first close in the coming months'; Investor Day (17 Sep): 'one of the largest infrastructure funds ever'. No first close announced by 26 Sep." }, { "name": "Brookfield Capital Partners VII (BCP VII)", "strategy": "Private Equity (flagship)", "status": "In market — first close held", "target": "$12.5B (Buyouts)", "hardCap": "N/A", "prevFund": "$12B (BCP VI)", "raisedToDate": "$6.7B raised in Q2'26 (initial close of $6.0B held in April)", "firstClose": "Apr 2026 (initial $6.0B)", "finalClose": "2027 (exp.)", "pb": "N/A", "comment": "Expected to be the largest PE vintage ('definitely... the biggest flagship we've ever had', Investor Day). The US$2.8B-EV Reliance Worldwide take-private (15 Sep) is funded via the BCP strategy and BBUC." }, { "name": "Brookfield Artificial Intelligence Infrastructure Fund (BAIF)", "strategy": "Infra / AI", "status": "First close held (end-Q2'26)", "target": "$10B", "hardCap": "N/A", "prevFund": "inaugural", "raisedToDate": "$5B total commitments (Q2'26)", "firstClose": "Q2 2026 (end-June)", "finalClose": "N/A", "pb": "28857-61F", "comment": "NVIDIA is the $2B anchor LP and founding partner (KIA is also an LP per PB). Anchors a ~$100B program; Bloom framework expanded to $25B. Brookfield also plans to fund up to $9B of NAVER's Korea AI-factory build (27 Jul; vehicle not specified)." }, { "name": "Brookfield Infrastructure Debt Fund IV", "strategy": "Infrastructure Debt", "status": "Approaching final close", "target": "N/A", "hardCap": "N/A", "prevFund": "$6B (BID III)", "raisedToDate": "~$600M raised in Q2'26", "firstClose": "N/A", "finalClose": "N/A (approaching per 2Q call)", "pb": "N/A", "comment": "Demand 'accelerated' in Q2; 60% of BID investors are also flagship LPs (Investor Day)." }, { "name": "Brookfield Super-Core Infrastructure Partners (BSIP)", "strategy": "Core infrastructure (evergreen)", "status": "Open / perpetual", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "$26B platform; $900M raised Q2'26", "firstClose": "N/A", "finalClose": "perpetual", "pb": "N/A", "comment": "Raising almost $4B a year on a run-rate basis (Investor Day)." }, { "name": "Brookfield Infrastructure Income Fund (BII)", "strategy": "Infrastructure (private wealth)", "status": "Open / perpetual", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": ">$8.0B capital (1Q26); $900M raised Q2'26", "firstClose": "N/A", "finalClose": "perpetual", "pb": "23795-11F", "comment": "Raising >$1B a quarter; BII and BSIP have had no quarter of net redemptions in 8 years (Investor Day). Offsets non-traded BDC softness (redemptions <5%, met in full)." } ],
      fundraisingSummary:"BAM raised a record $77B in Q2'26 ($98B YTD; $163B LTM), including the $40B Just Group mandate. Even excluding the mandate, Q2 was a record for organic fundraising, led by $9.3B for BIF VI, $6.7B for BCP VII (after a $6.0B April initial close) and a $5B first close for the AI infrastructure fund. Q3-to-date news has been mandates rather than fund closes, such as the $1B initial Nuclear Liabilities Fund multi-asset mandate (8 Sep), and BIF VI's 'sizable' first close (~$20B targeted) is still pending. H2 inflows are guided to split roughly evenly across flagships, complementary equity, debt and insurance; at the 17 Sep Investor Day BAM said 2026 will be a record even organically and set a $175B five-year flagship target.",
      guidance:[ { "metric": "Fee-bearing capital", "period": "2031", "value": "Roughly double (from ~$670B)", "source": "Investor Day (17 Sep 2026)", "comment": "CFO: 'We are going to double $1.3 trillion of fee-bearing capital by 2031'. Read as doubling to ~$1.3T; some press summaries read it as $2.6T. ~75% of the growth is from flagships, mature complementary strategies and insurance ('low execution risk'); $220B to be returned to clients over the plan." }, { "metric": "Fundraising (5-yr plan)", "period": "2026-2031", "value": "Flagships $175B (vs $129B prior 5 yrs, +35%); complementary strategies 'almost double' $195B", "source": "Investor Day (17 Sep 2026)", "comment": "About 65% of complementary-strategy capital comes from mature strategies with 3-4 vintages. Oaktree's opportunistic and the RE flagships launch in 2027, energy in 2028." }, { "metric": "Insurance (BWS IMA) assets", "period": "2031", "value": "$360B (from $150B); private-fund allocation 6% to 18% (~$60B)", "source": "Investor Day (17 Sep 2026)", "comment": "BAM earns 25bp on the IMA plus fund fees on the private-fund sleeve." }, { "metric": "FRE per share", "period": "2031", "value": "$4.08 (vs $1.97 LTM); revenue ~$11B", "source": "Investor Day (17 Sep 2026)", "comment": "Costs to grow slower than revenue, so margins expand. Rolls forward the Sep-2025 plan ($3.59 FRE/sh in 2030)." }, { "metric": "DE per share", "period": "2031", "value": "$3.99 (vs $1.75 LTM); ~18% CAGR incl. ~$1.4B realized carry", "source": "Investor Day (17 Sep 2026)", "comment": "Realized carry is expected to grow at a ~32% CAGR to 2031; FRE remains the foundation." }, { "metric": "Dividend / earnings growth", "period": "Long term (to 2031)", "value": "Dividend +15% p.a.; paths to 20%+ annual earnings growth", "source": "Investor Day (17 Sep 2026)", "comment": "Upside levers beyond the base plan: the DC/401(k) market, new complementary strategies, stake step-ups in 5 partner managers (up to $350M of FRE by 2031) and M&A." }, { "metric": "Capital markets revenue", "period": "2027 / 2031", "value": "$50-100M in 2027; ~$250M by 2031", "source": "Investor Day (17 Sep 2026)", "comment": "Leverages ~$150B a year of portfolio-company debt issuance and large co-invest deals." }, { "metric": "Private wealth fee-bearing capital", "period": "Next 5 yrs", "value": "5x", "source": "Investor Day (17 Sep 2026)", "comment": "Six evergreen strategies and ~200 wealth staff; high-net-worth channel growing 'well north of 30%, 35% CAGRs'; more 401(k) partnerships (after AllianceBernstein) expected." }, { "metric": "Fundraising / monetizations", "period": "FY2026", "value": "Record year even organically; record monetizations", "source": "Investor Day (17 Sep 2026)", "comment": "No numeric 2026 fundraising guide. $163B raised LTM; energy expects its 'best year ever' for asset sales. The Investor Day LTM figures ($90B monetized, $160B deployed) are on a broader basis than BAM's quarterly disclosures." }, { "metric": "Fundraising", "period": "FY2026", "value": "Record; far above prior high", "source": "transcript", "comment": "$98B raised YTD; H2 inflows spread evenly across flagships, complementary equity, debt and insurance." }, { "metric": "FRE trajectory", "period": "2H26-2027", "value": "'Rock solid'", "source": "transcript", "comment": "Q4 laps a strong prior-year quarter, which may temper YoY growth that quarter." }, { "metric": "FRE margin", "period": "Q3 2026", "value": "Below the 57% Q2 level", "source": "transcript", "comment": "Oaktree consolidation lowers consolidated margin on mix; new partner-manager presentation starts Q3." }, { "metric": "Fundraising", "period": "FY2027", "value": "Very strong but below 2026", "source": "transcript", "comment": "Final closes of infra/PE flagships plus pulled-forward RE and Oaktree credit launches; energy 2028." }, { "metric": "Carried interest", "period": "2026-2031", "value": "~$9B cumulative carry over 5 yrs; ~$1.4B realized in 2031; carry 'this year'", "source": "Investor Day (17 Sep 2026)", "comment": "Carry is split 1/3 to BN (royalty), 1/3 to employees and 1/3 to BAM shareholders; ~$35B in the following five years. Quantifies the 2Q-call statement that larger carry realizations are being pulled forward from late decade." }, { "metric": "Private wealth capital", "period": "FY2026-2027", "value": "~30% in 2026, then 30-50%", "source": "transcript", "comment": "Non-traded BDC softness (redemptions <5%, met in full) offset by infra wealth inflows." } ],
      guidanceSummary:"At its 17 Sep Investor Day BAM rolled its plan to 2031. The targets are roughly doubling fee-bearing capital, $175B of flagship fundraising over five years (vs $129B) and near-doubled complementary-strategy raising. Those take FRE/sh to $4.08 (from $1.97 LTM) and DE/sh to $3.99 (from $1.75), including ~$1.4B of realized carry by 2031, and support 15% annual dividend growth with paths to 20%+. Near term, 2026 is guided to record fundraising (even organically) and record monetizations, with H2 inflows balanced across four channels. Reported FRE margin steps down from Q3 on Oaktree consolidation. NOTE: $672B is fee-BEARING capital; total AUM is ~$1.3T.",
      consensus:{ FRE:{cons:819,n:11}, PFRE:{cons:129,n:11}, FRE_ps:{cons:0.50,n:11}, DE_ps:{cons:0.44,n:11} },  // 2Q26E VA cons (20-May-26); PFRE=perf fees+incentive distributions; net flows n/a
      exits:{ quarterly:{
        "2023 Q2":{count:0,totalTV:0}, "2023 Q3":{count:1,totalTV:0}, "2023 Q4":{count:1,totalTV:117}, "2024 Q1":{count:0,totalTV:0},
        "2024 Q2":{count:0,totalTV:0}, "2024 Q3":{count:0,totalTV:0}, "2024 Q4":{count:2,totalTV:404}, "2025 Q1":{count:3,totalTV:1537},
        "2025 Q2":{count:2,totalTV:1075}, "2025 Q3":{count:0,totalTV:0}, "2025 Q4":{count:2,totalTV:680}, "2026 Q1":{count:2,totalTV:257},
        "2026 Q2":{count:0,totalTV:0} },
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
      color:"#16A34A", cadence:"quarterly", period:"Q2 2026", periodEnd:"2026-06-30", reportDate:"2026-08-05",
      reported:{ FRE:"$358M", FRE_ps:null, fpAUM:"$334B", DE_ps:"$1.07", comment:"Record FRE $358M +11% at 47% margin; DE $472M / $1.07, best in ~4 years; FEAUM $334B +3%; $16.8B inflows, $14.3B deployed, ~$7B returned to LPs." },
      fundraising:[ { "name": "Carlyle Partners IX (CP IX)", "strategy": "US Buyout (GPE)", "status": "In market — marketing launched Q2'26; $5B anchor toward first close", "target": "~$15B (Bloomberg, Jun'26)", "hardCap": "N/A", "prevFund": "$14.8B (CP VIII)", "raisedToDate": "$5B commitments earmarked (Q2'26 inflows)", "firstClose": "By YE2026 (targeted, per Bloomberg)", "finalClose": "N/A", "pb": "27832-69F", "comment": "Anchor seeded via a ~$8.5B structured financing, of which ~$5B was earmarked for the new fund (Bloomberg); 15bp fee discount for commitments before first close. Replaces the mislabelled 'CP X' row: the next US buyout vintage is CP IX." }, { "name": "Carlyle Europe Partners VI", "strategy": "Europe Buyout (GPE)", "status": "Open", "target": ">$8.7B", "hardCap": "N/A", "prevFund": "€6.4B (CEP V)", "raisedToDate": "$1.06B (PB, 26 Sep)", "firstClose": "N/A", "finalClose": "N/A", "pb": "20707-66F", "comment": "No fund-level update in the 2Q26 materials; predecessor CEP V (€6.4B) is at 1.0x MOIC / negative net IRR, a headwind for the raise." }, { "name": "AlpInvest Atom Fund II (AAF II)", "strategy": "Secondaries — single-asset CVs (AlpInvest)", "status": "Final close (Jul'26)", "target": "$1.0B", "hardCap": "$1.7B", "prevFund": "AAF I (2023); AAF II +393% vs predecessor", "raisedToDate": "$1.7B (final, at hard cap)", "firstClose": "N/A", "finalClose": "2026-07-15", "pb": "N/A", "comment": "Takes AlpInvest SACV capacity to $7B incl. evergreen vehicles, ASF VIII and sidecars; CFO: '4x larger than its predecessor'. Counted in Q2 AlpInvest inflows ($4.5B)." }, { "name": "Carlyle Infrastructure Credit Fund II (CICF II)", "strategy": "Infrastructure Credit (Global Credit)", "status": "Final close (Sep'26)", "target": "$2.0B", "hardCap": "N/A", "prevFund": "$643M (CICF I)", "raisedToDate": "~$2.3B (final)", "firstClose": "N/A", "finalClose": "2026-09-14", "pb": "N/A", "comment": ">3x predecessor; 6 investments / ~$500M committed at close; Carlyle Infrastructure Credit platform ~$8.7B." }, { "name": "Carlyle Asset-Backed Income Fund (CABI)", "strategy": "Credit / ABF", "status": "Open — first close held (Q1'26)", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "$1.5B (first close); ABF platform >$12B", "firstClose": "Q1 2026", "finalClose": "N/A", "pb": "N/A", "comment": "Q2 credit inflows cite ABF activity; one ABF fund flipped from carry to a performance-fee structure (now in FRPR run-rate)." }, { "name": "Carlyle Credit Opportunities (next vintage)", "strategy": "Opportunistic Credit", "status": "Pre-launch — in super-cycle line-up", "target": "N/A", "hardCap": "N/A", "prevFund": "$5.7B committed (CCOF III platform; $7.1B investable)", "raisedToDate": "N/A", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "CFO (2Q call): credit opportunities, secondaries, portfolio finance, US buyout and defense flagships are all in market over the next ~24 months. The ctx pb 23182-03F ('Bravo Opportunistic Credit') could not be matched to this vintage, so it was dropped." } ],
      fundraisingSummary:"Carlyle took in $16.8B of inflows in Q2'26 ($29.8B in 1H, a firm record for organic inflows; $55.8B LTM, +10%), led by $5B earmarked for the next US buyout fund (CP IX, marketing launched, ~$15B target per Bloomberg), $4.5B at AlpInvest and $5.8B in Global Credit (three new US CLOs plus insurance). Since quarter-end AlpInvest closed AAF II at its $1.7B hard cap (15 Jul) and Global Credit closed CICF II at ~$2.3B vs a $2B target (14 Sep). H2 pipeline: the CP IX first close (targeted by year-end), the Unum block (>$5B credit AUM on closing) and the start of the 2026-28 super cycle, with nearly every flagship in market over the next ~24 months.",
      guidance:[ { "metric": "GPE realized principal investment income / DE", "period": "2H 2026 (disposition 'later in 2026')", "value": "~$222M realized loss expected; GPE 2H DE 'may be lower than 1H'", "source": "10-Q (filed 2026-08-10)", "comment": "New DE-specific language in the 2Q 10-Q: the cumulative unrealized loss on an investment in a consolidated infrastructure fund was $222M at 6/30 (1Q 10-Q: ~$175M, 'in 2026') and is realized on disposition. $222M / 356.4M dividend-eligible shares = ~$0.62/sh pre-tax. Explains the ~40% cut to Street 4Q26E DE (CapIQ mean $0.68, median $0.60)." }, { "metric": "FRE margin / comp ratio", "period": "FY2026", "value": "~47%", "source": "transcript", "comment": "Reinvesting in people, AI/technology and wealth; margin uplift pushed to 2027-28." }, { "metric": "Transaction / capital markets fees", "period": "Q3-Q4 2026", "value": "Below Q2's record $111M", "source": "transcript", "comment": "Management does not expect the Q2 record to repeat; quarterly volatility is normal." }, { "metric": "Global Credit AUM", "period": "2H 2026", "value": "+$5B on Unum close", "source": "transcript", "comment": "Second block reinsurance deal alongside Fortitude Re expected to close later this year." }, { "metric": "Net realized perf revenue", "period": "2H 2026", "value": "Continued momentum", "source": "transcript", "comment": "Several deals closed in July; 3Q seasonally lighter but realization pace market-leading." }, { "metric": "Fee-related perf revenue", "period": "2027", "value": "Steps up", "source": "transcript", "comment": "Wealth/AlpInvest growth; an ABF fund converted to a performance-fee structure is now in the run rate." }, { "metric": "Fundraising super cycle", "period": "2026-2028", "value": "Target reaffirmed", "source": "transcript", "comment": "Nearly all flagships in market over the next ~24 months; 1H26 organic inflows of $30B a firm record." } ],
      guidanceSummary:"Carlyle framed 2026 as an investment year (FRE margin ~47%, operating leverage deferred to 2027-28) and said Q2's record transaction fees and FRPR won't repeat in 3Q/4Q. After the call, the 2Q 10-Q (10 Aug) warned that GPE DE in 2H26 may be lower than in 1H because a ~$222M loss on a consolidated infrastructure-fund investment will be realized on disposition later in 2026. That is the main reason Street 4Q26E DE was cut by ~40%. Realization momentum, the Unum block (>$5B credit AUM) and the $200B 2026-28 super-cycle target are unchanged.",
      consensus:{ FRE:{cons:320,n:10}, PFRE:{cons:74,n:10}, FRE_ps:{cons:0.89,n:10}, DE_ps:{cons:0.91,n:10}, netFlowsTotal:{cons:2.2,n:10}, netFlowsCredit:{cons:1.2,n:10} },  // 2Q26E VA cons (10-Jun-26); netFlowsCredit=Global Credit seg
      exits:{ quarterly:{
        "2023 Q2":{count:11,totalTV:2661}, "2023 Q3":{count:11,totalTV:6195}, "2023 Q4":{count:5,totalTV:1768}, "2024 Q1":{count:9,totalTV:4172},
        "2024 Q2":{count:7,totalTV:2316}, "2024 Q3":{count:6,totalTV:3061}, "2024 Q4":{count:11,totalTV:3336}, "2025 Q1":{count:7,totalTV:1749},
        "2025 Q2":{count:9,totalTV:426}, "2025 Q3":{count:9,totalTV:4183}, "2025 Q4":{count:9,totalTV:8765}, "2026 Q1":{count:6,totalTV:4821},
        "2026 Q2":{count:12,totalTV:5579} },
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
      color:"#EA580C", cadence:"quarterly", period:"Q2 2026", periodEnd:"2026-06-30", reportDate:"2026-08-04",
      reported:{ FRE:"$315M", FRE_ps:"$0.82", fpAUM:"$181B", DE_ps:"$0.69", comment:"FRE $315M +43% at 50% margin, helped by pulled-forward capital markets fees; FAUM $181B +24%; $16.1B raised, ~$14B deployed, $5B realized." },
      fundraising:[ { "name": "TPG Partners X", "strategy": "PE / Buyout", "status": "Open — final close targeted by YE2026", "target": "$13B ($17B combined with THP III, Buyouts)", "hardCap": "$15B", "prevFund": "$12.0B (TPG IX)", "raisedToDate": "$12.27B committed (6/30/26); >$14B with THP III incl. signed-not-closed", "firstClose": "Q3 2025", "finalClose": "YE 2026 (exp.)", "pb": "27844-84F", "comment": "$1.3B raised for TPG X/THP III in Q2; under 30% of TPG X capital from US institutions so far (Barclays, 15 Sep)." }, { "name": "TPG Healthcare Partners III", "strategy": "Healthcare Buyout", "status": "Open — final close targeted by YE2026", "target": "~$4B (implied by $17B combined target)", "hardCap": "N/A", "prevFund": "$3.6B (THP II)", "raisedToDate": "$1.80B committed (6/30/26)", "firstClose": "2025-06", "finalClose": "YE 2026 (exp.)", "pb": "28079-74F", "comment": "Raised alongside TPG X; $1.7B of THP III fee-earning capital activated over the LTM." }, { "name": "TPG Rise Climate II + Global South", "strategy": "Impact / Climate PE", "status": "Final closes guided for 3Q26 — none announced by 26 Sep", "target": "$8B, $10B cap (TRC II); $1B+ (GS)", "hardCap": "$10B (TRC II)", "prevFund": "$7.3B (Rise Climate I)", "raisedToDate": "$7.40B (TRC II) + $0.81B (GS) committed (6/30/26)", "firstClose": "Oct 2024 (TRC II)", "finalClose": "2H 2026 (exp.)", "pb": "24821-29F", "comment": "2Q call guided final closes in 3Q; at Barclays (15 Sep) the CFO said both will 'conclude' without giving a quarter. Rise Climate TI ($1.67B) and Rise IV ($0.97B) are also in market." }, { "name": "TPG Real Estate Partners V (TREP V)", "strategy": "RE Opportunistic", "status": "In market — first close 'relatively soon'", "target": "> TREP IV ($6.8B) (mgmt 'confident')", "hardCap": "N/A", "prevFund": "$6.8B (TREP IV)", "raisedToDate": "N/A", "firstClose": "2H 2026 (exp.)", "finalClose": "N/A", "pb": "N/A", "comment": "TREP IV is ~80% invested; first close to be reported on the 3Q or 4Q call. All four US/Asia RE equity funds target first closes toward YE, with fees mostly activating in 2027." }, { "name": "TPG Peppertree Capital Fund XI", "strategy": "Infra / Telecom towers", "status": "First close (Q2'26)", "target": "+25% vs Peppertree X (mgmt)", "hardCap": "N/A", "prevFund": "$2.04B (Peppertree X)", "raisedToDate": "$1.03B committed (6/30/26)", "firstClose": "Q2 2026", "finalClose": "N/A", "pb": "N/A", "comment": "About 1/3 of first-close commitments came from legacy TPG relationships, the first flagship raise since the Jul'25 acquisition." }, { "name": "TPG Twin Brook Direct Lending Fund VI (MMDL VI)", "strategy": "Lower-middle-market direct lending", "status": "Open — final close expected 2H26", "target": "N/A", "hardCap": "N/A", "prevFund": "$3.9B (MMDL V)", "raisedToDate": "$2.60B committed (6/30/26)", "firstClose": "2025 (vintage)", "finalClose": "2H 2026 (exp.)", "pb": "N/A", "comment": "2H credit finals also include ABC Fund II ($1.59B committed); $2.5B of new Jackson commitments in Q2 ($4.5B since Feb)." }, { "name": "TPG Sports (inaugural)", "strategy": "Sports PE", "status": "Open", "target": "N/A", "hardCap": "N/A", "prevFund": "inaugural", "raisedToDate": "$1.08B committed (6/30/26)", "firstClose": "N/A", "finalClose": "N/A", "pb": "29745-19F", "comment": "CFO (Barclays) listed the sports fund and transition infrastructure among strategies TPG expects to 'conclude' over the rest of 2026 into 2027." } ],
      fundraisingSummary:"TPG raised $16.1B in Q2'26 ($26.5B YTD; record $60.7B LTM). PE contributed $8B, including $1.3B for TPG X/THP III (now >$14B incl. signed-not-closed) and a $1B first close for Peppertree XI; credit added $5.6B, including $2.5B of new Jackson commitments ($4.5B total). Since quarter-end TECA closed at ~US$1.3B (AFR), but the TRC II/Global South final closes guided for 3Q were not announced by 26 Sep. H2 depends on the TPG X/THP III final close by YE, the Twin Brook VI and ABC II finals, and first closes for all four US/Asia RE equity funds including TREP V; the >$50B FY target was reaffirmed a third time at Barclays (15 Sep).",
      guidance:[ { "metric": "Capital raised", "period": "FY2026", "value": ">$50B (reaffirmed a 3rd time)", "source": "Barclays Global Financial Services Conference (15 Sep 2026)", "comment": "CFO Axel André: $26B raised in 1H. The firm has moved to an 'always-on' model with 35 products in market vs 25 in 2025; TRC II/Global South, the sports fund and transition infra are set to 'conclude' over the rest of 2026 into 2027." }, { "metric": "FRE margin (long term)", "period": "Beyond 2026", "value": "'Expand into the 50s over time'", "source": "Barclays Global Financial Services Conference (15 Sep 2026)", "comment": "The 2026 FRE-margin guide (47% per the 2Q call) is 'a milestone, not a stopping point'. Drivers: fund-over-fund growth, fee activation as credit dry powder deploys, capital markets 'in the middle innings', and AI-driven operating leverage." }, { "metric": "Realizations / PRE", "period": "4Q26-2027", "value": "Improving; activity picked up in Aug-Sep", "source": "Barclays Global Financial Services Conference (15 Sep 2026)", "comment": "CFO cited 'pickup in activity and dialogue... through August and September' as bid-offer spreads narrow, based on live portfolio-company discussions. No quantified 3Q figure. TCAP redemption requests ~1% in 3Q (2% in 2Q)." }, { "metric": "Real estate fundraising (TREP V)", "period": "3Q/4Q 2026", "value": "First close 'relatively soon'; fund to exceed TREP IV's $6.8B", "source": "Barclays Global Financial Services Conference (15 Sep 2026)", "comment": "Jack Weingart: first close to be reported on the 3Q or 4Q call; TREP IV ~80% invested. RE is expected to be a significant contributor for the rest of 2026 and into 2027." }, { "metric": "Capital raised", "period": "FY2026", "value": ">$50B", "source": "transcript", "comment": "$26.5B YTD; confident on TPG X/THP III completion, Rise Climate and real estate first closes." }, { "metric": "FRE margin", "period": "FY2026", "value": "47%", "source": "transcript", "comment": "Guide left unchanged despite 50% in Q2; an upgrade needs better visibility on 2H capital markets fees." }, { "metric": "Transaction & monitoring fees", "period": "Q3 2026", "value": "Step down", "source": "transcript", "comment": "Q2 benefited from pulled-forward closes; no large chunky deals budgeted for 3Q or 4Q." }, { "metric": "Management fees", "period": "2H 2026 - 2027", "value": "Robust growth", "source": "transcript", "comment": "TPG X/THP III, accelerating credit deployment, and a 2027 real estate raise." }, { "metric": "Realized perf allocations", "period": "Late 2026 - 2027", "value": "Step up", "source": "transcript", "comment": "Net accrued carry $1.4B, +15% q/q; broad monetization pipeline." }, { "metric": "Effective tax rate", "period": "Q3 2026", "value": "High single digits", "source": "transcript", "comment": "8% in Q2 on January RSU-vesting deductions; steps up in 4Q." } ],
      guidanceSummary:"TPG kept its FY26 guide of more than $50B of capital raised (reaffirmed a third time at Barclays on 15 Sep) and a 47% FRE margin despite printing 50% in Q2, attributing the gap to capital markets fees pulled into 2Q with no 4Q rebound budgeted. New since the print: the CFO said FRE margin should 'expand into the 50s over time', realization dialogue picked up in August-September, and TREP V's first close is 'relatively soon'. Management fee growth is guided robust through 2027 and PRE to step up late 2026 into 2027 off a $1.4B net accrued carry balance. No 2027 numeric guide has been given.",
      consensus:{ FRE:{cons:254,n:8}, PFRE:{cons:49,n:8}, FRE_ps:{cons:0.66,n:8}, DE_ps:{cons:0.60,n:8} },  // 2Q26E VA cons (10-Jun-26); operating basis; net flows n/a in export
      exits:{ quarterly:{
        "2023 Q2":{count:8,totalTV:2172}, "2023 Q3":{count:3,totalTV:7274}, "2023 Q4":{count:8,totalTV:1837}, "2024 Q1":{count:4,totalTV:141},
        "2024 Q2":{count:4,totalTV:292}, "2024 Q3":{count:8,totalTV:2522}, "2024 Q4":{count:9,totalTV:2633}, "2025 Q1":{count:4,totalTV:191},
        "2025 Q2":{count:10,totalTV:2204}, "2025 Q3":{count:5,totalTV:1145}, "2025 Q4":{count:9,totalTV:9601}, "2026 Q1":{count:3,totalTV:1612},
        "2026 Q2":{count:5,totalTV:2764} },
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
      color:"#CA8A04", cadence:"quarterly", period:"Q2 2026", periodEnd:"2026-06-30", reportDate:"2026-07-30",
      reported:{ FRE:"$392M", FRE_ps:"$0.25", fpAUM:"$191B", DE_ps:"$0.22", comment:"FRE +9% to $392M and DE +9% to $351M, FRE margin 58.5%; AUM $319B, FPAUM $191B; $7.8B raised as BDC redemptions eased and evergreen inflows troughed." },
      fundraising:[ { "name": "Blue Owl Real Estate Fund VII (Net Lease VII)", "strategy": "Net Lease RE", "status": "In market — above original $7.5B hard cap; closing out in 2026", "target": "$7.5B (launch size / original cap)", "hardCap": "$7.5B original; LP approval to go above $8B", "prevFund": "$5.16B (Fund VI)", "raisedToDate": "$7.7B at Q2 ($8.7B incl. co-invest); ~$8B by mid-Sep", "firstClose": "~Jul 2025", "finalClose": "YE 2026 (exp.; 'around $8.5B' per Ostrover)", "pb": "27595-36F", "comment": "1.5x Fund VI; ~60% of commitments from first-time investors in the strategy; ~10% called and ~40% committed, with fees on deployment. Replaces the mislabelled 'Fund VI' row (PB 22564-90F is Fund VI, closed at $5.16B)." }, { "name": "Blue Owl GP Stakes VI", "strategy": "GP Minority Stakes", "status": "Final stretch — wrap-up in 2026", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "$9.7B vintage / $10.6B incl. co-invest (Q2); PB $9.1B", "firstClose": "N/A", "finalClose": "2026 (exp.)", "pb": "24122-26F", "comment": "~$15B raised this cycle incl. ~$4.5B of strip sales; GP Strategic Capital raised ~$1.3B in Q2. A mid-market GP stakes fund is also in market (Barclays)." }, { "name": "Blue Owl Digital Infrastructure Fund IV (BODI IV)", "strategy": "Digital Infra / Data Centers", "status": "Launching — first close targeted 2H26", "target": "$10B (goal)", "hardCap": "N/A", "prevFund": "$7.0B (BODI III, May'25)", "raisedToDate": "N/A", "firstClose": "2H 2026 (exp.)", "finalClose": "2027-early 2028 (exp.)", "pb": "N/A", "comment": "Fees on committed capital, so FRE lifts at first close. Oracle's 24 Sep force-majeure notice on Stack's Project Jupiter campus is the key headline risk for the franchise; Blue Owl said financial commitments are unchanged. The ctx pb 28410-67F is ODIT, the wealth trust (PB $2.12B)." }, { "name": "Blue Owl Credit Income Corp. (OCIC)", "strategy": "Non-traded BDC", "status": "Open / perpetual", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "~$20B (Ostrover, 14 Sep); PB $18.6B", "firstClose": "N/A", "finalClose": "perpetual", "pb": "25304-86F", "comment": "Redemption requests peaked in Q1 and fell in Q2; the 3Q tender is underway and requests are expected lower again. >90% of holders asked for nothing, and wealth net flows were positive in Q2 even after paying the full 5%." }, { "name": "Blue Owl Real Estate Net Lease Trust (ORENT)", "strategy": "Non-traded REIT", "status": "Open / perpetual", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "$16B AUM; $9.2B equity sold (Form D/A, 27 Aug 2026)", "firstClose": "N/A", "finalClose": "perpetual", "pb": "26505-37F", "comment": "Second-largest private REIT. Redemptions ~1.5%, the lowest in 8 quarters; dividend raised; ~9% annualized return since the Sep-2022 launch. The ctx pb 16477-39F is the separate $390M Net Lease Property Fund." }, { "name": "Blue Owl Real Estate European Net Lease Master Fund", "strategy": "European Net Lease (first-time)", "status": "Final close (by Jul'26) — $1.5B vs $1B goal", "target": "$1B", "hardCap": "N/A", "prevFund": "first-time", "raisedToDate": "$1.5B (mgmt); PB $1.6B", "firstClose": "N/A", "finalClose": "By Jul 2026 (2Q call: '$1.5 billion closed')", "pb": "25973-38F", "comment": "Q2 call: '$1.5 billion closed for Net Lease Europe'; PB lists the fund as closed (2026 vintage)." }, { "name": "Blue Owl Data Center Credit + Real Estate Credit (first vintages)", "strategy": "Real-asset credit", "status": "In market", "target": "$1.5B (aggregate goal)", "hardCap": "N/A", "prevFund": "inaugural", "raisedToDate": ">$1B aggregate (Q2 call)", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "Ostrover (Barclays): each vertical 'will be well in excess of $1 billion'. A credit secondaries product is in development." } ],
      fundraisingSummary:"Blue Owl raised $7.8B in Q2'26 ($50.5B LTM, down from $57B at 1Q; >$16.5B of equity in 1H), with ~60% of equity from real assets and ~3/4 from institutional and insurance clients. Evergreen wealth inflows troughed at the 1 May close and were up >50% by 1 Jul. Net Lease Fund VII passed its original $7.5B cap ($7.7B; $8.7B with co-invest) and was ~$8B by mid-September, heading to ~$8.5B; GP Stakes VI is at $10.6B incl. co-invest and Net Lease Europe closed at $1.5B vs a $1B goal. H2 brings final closes for Net Lease VII and GP Stakes VI and a BODI IV first close ($10B goal), and management expects 'really attractive' Q3 fundraising including institutional credit mandates.",
      guidance:[ { "metric": "FRE / DE per share vs consensus", "period": "FY2026", "value": "Beat the $1.02 / $0.89 VA bars (reiterated)", "source": "Barclays Global Financial Services Conference (14 Sep 2026)", "comment": "Ostrover: 'Alan reiterated that we think we will beat consensus'. He added that growth has been 'slower than we'd like this year' and the question is whether it can 're-accelerate' in 2027." }, { "metric": "2027 outlook", "period": "FY2027", "value": "Guidance to come late 2026 or early 1Q27", "source": "Barclays Global Financial Services Conference (14 Sep 2026)", "comment": "'We haven't come out with 2027 guidance. Alan will address that later in the year or early in the first quarter.' The FRE margin is ~58.5% and management is 'trying to take that up slowly every year'." }, { "metric": "Non-traded BDC redemptions (OCIC)", "period": "3Q 2026 tender", "value": "Expected to decline again", "source": "Barclays Global Financial Services Conference (14 Sep 2026)", "comment": "Requests peaked in 1Q and fell in 2Q; the 3Q tender was in progress with no increase in the number of tendering holders. The credit wealth products are ~11% of fee-paying AUM; the peak of just over $4B of redemptions was ~2%." }, { "metric": "Net Lease Fund VII final size", "period": "2026", "value": "~$8.5B (vs $7.5B launch size)", "source": "Barclays Global Financial Services Conference (14 Sep 2026)", "comment": "'We're right around $8 billion. We got permission to go above 8... let's call it around $8.5 billion.' Management fees follow deployment." }, { "metric": "Digital infrastructure: Project Jupiter (Oracle, NM)", "period": "2026-2028", "value": "No change to financial commitments (company statement)", "source": "Press: Bloomberg/Reuters/CNBC (24 Sep 2026); no 8-K", "comment": "Oracle sent Blue Owl's Stack Infrastructure a force-majeure notice so it can defer payments if the Stargate campus misses its 2028 online date; Oracle says the project is on schedule. Blue Owl spokesman: 'This notice does not change the financial commitments to this multiyear project.' With Bloomberg's 23 Sep report that Loparex's restructuring wipes out a Blue Owl-held junior loan, this drove OWL -7.7% over 22-24 Sep ($10.02 to $9.25; 38.9M shares on 24 Sep). No guidance change." }, { "metric": "FRE per share", "period": "FY2026", "value": "Above $1.02", "source": "transcript", "comment": "Reaffirms it can beat the Visible Alpha consensus bar cited on the Q1 call." }, { "metric": "DE per share", "period": "FY2026", "value": "Above $0.89", "source": "transcript", "comment": "Same VA baseline; management says the beat is a top-line story, not margin." }, { "metric": "FRE margin", "period": "FY2026+", "value": "~58.5%, modestly rising", "source": "transcript", "comment": "Q2 already at the full-year guide." }, { "metric": "Management fees", "period": "3Q/4Q26 and 2027", "value": "Sequential growth; faster in 2027", "source": "transcript", "comment": "$31B AUM not yet paying fees carries ~$380M annualized fees, ~15% embedded growth." }, { "metric": "Fundraising", "period": "2H 2026", "value": "Better than 1H 2026", "source": "transcript", "comment": "Wealth inflows troughed at the May 1 close and rose >50% by July 1." }, { "metric": "Equity-based comp", "period": "FY2026", "value": "~$365M", "source": "transcript", "comment": "Business Combination Grants drop to zero starting Q4 2026." } ],
      guidanceSummary:"Blue Owl reaffirmed, on the 2Q call and again at Barclays on 14 Sep, that it expects to beat the $1.02 FRE/share and $0.89 DE/share Visible Alpha bars for 2026. The upside is from revenue rather than margin (58.5% FRE margin, rising slowly). Management fees are guided to build sequentially in 3Q/4Q and grow faster in 2027, helped by $31B of AUM not yet paying fees (~$380M); 2027 guidance is due late 2026 or early 1Q27. New since Barclays: Oracle's force-majeure notice on Stack's Project Jupiter campus (24 Sep) and the Loparex junior-loan wipe-out (23 Sep) hit the stock. Blue Owl says the notice does not change the project's financial commitments, and there is no guidance change. Note: OWL issues no formal numeric guidance; the 'guide' is framed against VA consensus levels.",
      consensus:{ FRE_ps:{act:0.25}, DE_ps:{act:0.19} },
      exits:{ quarterly:{
        "2024 Q4":{count:1,totalTV:null}, "2025 Q2":{count:1,totalTV:30}, "2025 Q3":{count:2,totalTV:12221},
        "2025 Q4":{count:4,totalTV:2083}, "2026 Q1":{count:3,totalTV:30}, "2026 Q2":{count:4,totalTV:91440} },
        notable:[
          { company:"SpaceX", exitDate:"2026-06-12", exitSize:"$75,000M", type:"IPO (valuation)", investorSince:"2024", flag:"Q2'26; ~10x; sold ~half" },
          { company:"HPS Investment Partners", exitDate:"2025-07-01", exitSize:"$12,221M", type:"M&A", investorSince:"2018", flag:"GP stake; to BlackRock" },
          { company:"Brex", exitDate:"2026-04-07", exitSize:"$5,150M", type:"M&A", investorSince:"2024", flag:"Q2'26" },
          { company:"Securiti", exitDate:"2025-12-08", exitSize:"$1,725M", type:"Buyout", investorSince:"2024", flag:"" },
          { company:"MapLight Therapeutics", exitDate:"2025-10-27", exitSize:"$251M", type:"IPO", investorSince:"2025", flag:"" },
          { company:"EnGene", exitDate:"2025-11-14", exitSize:"$107M", type:"Public 2nd offering", investorSince:"2024", flag:"" },
          { company:"Stonepeak (GP stake)", exitDate:"2026-01-28", exitSize:"N/A", type:"Buyout", investorSince:"2023", flag:"GP stake" },
        ],
        summary:"PitchBook returned 31 of 343 records; ~12 unique exits. The Q2'26 total is 94% one line — the SpaceX listing, recorded at an $86.25B deal value — and HPS ($12.2B) dominates Q3'25. Exit sizes here are whole-deal valuations, NOT Blue Owl's minority proceeds, so OWL's TV is not comparable to the buyout managers' (and is excluded from the Overview exit-TV roll-up, since Blue Owl earns fees rather than carry). No clean 2025 Q1 data in the pull." },
    },

    // ───────────────────────── PGHN ─────────────────────────
    PGHN: {
      ticker:"PGHN", name:"Partners Group", longName:"Partners Group Holding AG", exchange:"SWX", country:"Switzerland",
      color:"#DC2626", cadence:"annual", period:"H1 2026", periodEnd:"2026-06-30", reportDate:"2026-09-01", currency:"CHF",
      reported:{ FRE:"CHF 572M", FRE_ps:null, fpAUM:"USD 186B", DE_ps:"CHF 19.49", comment:"CHF P&L / USD AUM. Management Income EBITDA CHF572M (closest FRE analogue) on management income CHF905M, +12% in constant currency; group EBITDA CHF706M at a 63.0% margin; EPS CHF19.49. Record H1 fundraising of USD16B, but performance income fell 39% to CHF216M as exits were pulled into H2'25 and investment income swung to CHF-20M; a stronger CHF turned flat constant-currency profit into a 13% reported decline." },
      fundraising:[ { "name": "Direct Infrastructure IV", "strategy": "Infrastructure (flagship)", "status": "Final close (Jul'26)", "target": "N/A", "hardCap": "N/A", "prevFund": "Direct Infra 2020", "raisedToDate": ">$15B (program)", "firstClose": "N/A", "finalClose": "2026-07-20", "pb": "24207-85F", "comment": "PG's largest infra raise, >50% above the prior vintage: a closed-end fund plus bespoke solutions alongside, >40% committed across 11 seed assets. Close held in H1 per management (late fees in H1), announced 20 Jul. PB ID switched to the main fund; 29642-41F is the DI IV co-invest vehicle." }, { "name": "Direct Equity VI", "strategy": "PE Buyout (flagship)", "status": "In market (raising)", "target": "Similar to DE V (>$15B)", "hardCap": "N/A", "prevFund": ">$15B (DE V, 2024)", "raisedToDate": "N/A", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "Sixth direct PE program, raising 'with a similar target' (20 Jul release). Layton (1 Sep): PE is 'ramping up its next flagship fundraise', which should shift the fee mix back towards PE. PitchBook sizes DE V at $15.4B (22567-33F)." }, { "name": "Secondary VIII (PE secondaries)", "strategy": "PE Secondaries", "status": "Final close (Apr'26)", "target": "N/A", "hardCap": "N/A", "prevFund": "Secondary 2020", "raisedToDate": ">$9B (program)", "firstClose": "N/A", "finalClose": "2026-04-17", "pb": "24369-67F", "comment": "Eighth PE secondaries program: a closed-end fund plus bespoke mandates and vehicles, 60% committed at close. With DI IV it drove H1's late management fees. PitchBook shows the fund alone at $6B." }, { "name": "Bespoke mandates (incl. insurance)", "strategy": "Multi-asset mandates", "status": "Open / ongoing", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "26% of H1'26 raise", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "Bespoke solutions (mandates plus evergreens) were 52% of the $16B H1 raise. More than 5 Asian mandates closed over the last two periods and several US rated-fund vehicles for insurers closed. New aim: quadruple insurance AUM to $100B by 2033." }, { "name": "Evergreens (Next Gen Infra & broader platform)", "strategy": "Evergreen (infra, royalties, credit)", "status": "Open", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "$4.2B H1'26 demand", "firstClose": "N/A", "finalClose": "evergreen", "pb": "25454-35F", "comment": "80% of H1 evergreen inflows came from ~30 newer offerings (incl. Next Gen Infra and royalty evergreens). Redemptions were $3.8B, 79% from three mature strategies under redemption limits, with >$1B of H2 requests at 15 Jul; guided 1-2% AuM drag in H2'26 and FY27. JV flows ~$0.8B in H1." }, { "name": "Royalties (evergreens incl. LTAF)", "strategy": "Royalties", "status": "Open", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "~$1.2B (royalty evergreens)", "firstClose": "N/A", "finalClose": "N/A", "pb": "29756-44F", "comment": "PG reports ~$1.2B raised across its institutional and private-wealth royalty evergreens (fund factsheet, end-May 2026); royalty evergreens were cited among newer offerings with 'very strong traction' (15 Jul). Meister (1 Sep): building royalties into a financing tool across PE, infra and real assets. PB ID is the Royalties LTAF." } ],
      fundraisingSummary:"Record H1'26 fundraising of $16B (+31% YoY; bespoke solutions 52%, traditional programs 48% or $7.5B) took AuM to $186B; the FY26 guide of $26-32B gross demand was reconfirmed on 1 Sep, which management framed as $10-16B for H2. Key closes were the eighth PE secondaries program at >$9B (Apr) and the fourth direct infrastructure program at >$15B (Jul, >50% above its predecessor), with the sixth direct PE program now raising at a similar target. Evergreen demand of $4.2B was largely offset by $3.8B of redemptions, 79% from three mature strategies.",
      guidance:[ { "metric": "Insurance AUM", "period": "By 2033", "value": "USD 100B (4x; +USD 75B)", "source": "transcript", "comment": "New ambition on the 1 Sep call, a building block toward the USD 450B 2033 AuM target; mix weighted to credit and infra but blended across asset classes to protect margin." }, { "metric": "EBITDA margin", "period": "Ongoing", "value": "Above-60% range", "source": "transcript", "comment": "CFO 'very comfortable' with the >60% range (above 60% in each of the last 5 years; H1'26 63.0%); the current range is also the short-term expectation." }, { "metric": "Management income growth", "period": "Mid- to long-term", "value": "Double-digit at constant currency", "source": "transcript", "comment": "H1'26 +12% cc (+6% in CHF); management income margin bandwidth 1.18-1.33% since IPO (H1 1.24%), mix-driven." }, { "metric": "Investment income (in performance income)", "period": "H2 2026", "value": "Positive contribution (base case)", "source": "transcript", "comment": "H1 was CHF -20M after idiosyncratic Q2 marks; for net financial income 'a slight improvement is possible' despite FX-hedging costs." }, { "metric": "Partnership / JV fundraising", "period": "FY2026", "value": "Growth below the 'up to 100%' flagged in March", "source": "transcript", "comment": "~USD 1B contribution in 2025 and ~USD 0.8B in H1'26 (15 Jul call); Layton: reaching 2x 'doesn't look likely' as mature-evergreen building blocks slow some JV products." }, { "metric": "Delayed exits / performance income", "period": "H1 2027", "value": "Exits slipping from 2026 to close in H1'27", "source": "transcript", "comment": "CFO: any timing shift would be realized 'in the course of half year 1 2027'; the biggest swing is one exit close to agreement." }, { "metric": "Capital return", "period": "2026-27", "value": "Stable-or-growing dividend; no buyback", "source": "transcript", "comment": "Buybacks only for carry above average levels, 'not a discussion for this year, probably not next year'; payout may exceed 100% in some years." }, { "metric": "Gross new client demand", "period": "FY2026", "value": "USD 26-32B", "source": "report", "comment": "Reconfirmed 1 Sep; USD16B booked in H1, management declined to narrow the range." }, { "metric": "Tail-down from mature programs", "period": "FY2026", "value": "USD -10 to -13B", "source": "report", "comment": "Formula-based run-off pre-agreed with clients; USD-6.6B already incurred in H1." }, { "metric": "Performance income % of revenues", "period": "FY2026", "value": "~20-25%", "source": "report", "comment": "CUT at the 1-Sep print from the 15-Jul guide of 'around the lower end of 25-40%' — timing of select direct exits, with one large exit that may slip into 2027." }, { "metric": "Performance income % of revenues", "period": "Mid-term to 2028", "value": "25-40%", "source": "report", "comment": "Confirmed, against an exit pipeline of roughly USD75B being actively worked; H1'26 slippage feeds 2027." }, { "metric": "Realization volume", "period": "2026 / 2027 / 2028", "value": "~USD 20B / 25B / 30B", "source": "report", "comment": "Explicit forward exit-volume schedule vs actuals of USD12B (2023), 18B (2024), 26B (2025)." }, { "metric": "Evergreen redemption drag", "period": "H2 2026 - FY2027", "value": "1-2% of AUM", "source": "report", "comment": "Concentrated in three mature evergreen strategies; H1'26 redemptions USD3.8B. No change to the July guide." } ],
      guidanceSummary:"Fundraising guidance of USD26-32B was reconfirmed, but the FY26 performance-income guide was cut from 'around the lower end of 25-40%' to ~20-25% of revenues on exit timing, with one large exit possibly slipping into H1 2027. The mid-term 25-40% band stands against a ~USD75B pipeline and a ~USD20B/25B/30B realization schedule for 2026/27/28. New on the 1 Sep call: quadrupling insurance AUM to USD100B by 2033, an EBITDA margin kept above 60%, a positive H2 investment-income base case, and partnership/JV growth below the up-to-2x flagged in March. Note IFRS 18: performance income now bundles investment income (CHF216M income vs CHF233M fees).",
      consensus:{},
      exits:{ quarterly:{
        "2023 Q2":{count:1,totalTV:0}, "2023 Q3":{count:7,totalTV:0}, "2023 Q4":{count:2,totalTV:0}, "2024 Q1":{count:3,totalTV:967},
        "2024 Q2":{count:3,totalTV:2625}, "2024 Q3":{count:4,totalTV:0}, "2024 Q4":{count:4,totalTV:1732}, "2025 Q1":{count:5,totalTV:2224},
        "2025 Q2":{count:5,totalTV:1726}, "2025 Q3":{count:8,totalTV:1532}, "2025 Q4":{count:8,totalTV:5085}, "2026 Q1":{count:3,totalTV:900},
        "2026 Q2":{count:1,totalTV:3900} },
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
      color:"#059669", cadence:"semi-annual", period:"H1 2026", periodEnd:"2026-06-30", reportDate:"2026-07-17", currency:"EUR",
      reported:{ FRE:"EUR 571M", FRE_ps:null, fpAUM:"EUR 155B", DE_ps:null, comment:"EUR, not USD. FRE = fee-related EBITDA EUR 571M (50% margin); adj. EBITDA EUR 837M (60%); fee-related revenue -1% on lower retroactive fees; FAUM EUR 155B (+10%). Half-year reporter." },
      fundraising:[ { "name": "EQT XI", "strategy": "PE Buyout (flagship)", "status": "First close (H1'26) at 50% of target; activation end-Q3'26", "target": "€23B", "hardCap": "N/A", "prevFund": "€22B (EQT X)", "raisedToDate": "50% of target (first close)", "firstClose": "H1 2026", "finalClose": "N/A", "pb": "28044-37F", "comment": "Not in FAUM until activation, guided towards end-Q3'26; H2 pipeline tilted to Q4. First close slightly ahead of Infra VI's in % terms. EQT X 85-90% invested after McGill and Partners (4 Sep)." }, { "name": "EQT Infrastructure VII", "strategy": "Infrastructure (flagship)", "status": "Launched (target set 31 May'26); activation ~YE'26", "target": "€21B (~$24.5B)", "hardCap": "N/A", "prevFund": "€21.5B (Infra VI, hard cap)", "raisedToDate": "N/A", "firstClose": "H1 2027 (exp.)", "finalClose": "N/A", "pb": "29268-91F", "comment": "First deal Copia Power via a pre-fund bridge (0-5% invested at activation). An early close is expected by YE'26 but the first close only in H1'27, so 2026 raise smaller than EQT XI's at activation. Infra VI 75-80% invested (17 Jul)." }, { "name": "BPEA Fund IX", "strategy": "Asia Buyout", "status": "Final close (Apr'26)", "target": "$12.5–15.6B", "hardCap": "$15.6B", "prevFund": "~$11.2B (BPEA VIII)", "raisedToDate": "$15.6B (€13.1B FAUM)", "firstClose": "N/A", "finalClose": "2026-04-20", "pb": "26087-32F", "comment": "Largest Asia-Pacific PE fund raised to date, near 40% above VIII; 10-15% invested at 17 Jul. The new EQT Nexus Asia evergreen (9 Sep) allocates across the Asia PE strategies." }, { "name": "Scaleup Europe Fund", "strategy": "Growth / late-stage tech (EC mandate)", "status": "Investing since Aug'26; activation Q3'26", "target": "€5B", "hardCap": "N/A", "prevFund": "N/A (new)", "raisedToDate": "Anchors = majority of €5B", "firstClose": "Q3 2026 (exp.)", "finalClose": "Into 2027", "pb": "N/A", "comment": "Founded by the European Commission with Novo Holdings, Allianz, APG, EIFO, CriteriaCaixa, Santander and others; fees on committed capital at ~EQT's blended rate; demand above €5B, hard cap not set. First deal ICEYE (5 Aug); third, a co-lead of Mistral AI's Series D (Sep). Replaces a second EQT Growth fund." }, { "name": "EQT AI Infrastructure", "strategy": "AI / data-centre infra (open-ended)", "status": "Open-ended; launched Q2'26", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A (new)", "raisedToDate": "$9.4B FAUM (30 Jun)", "firstClose": "N/A", "finalClose": "open-ended", "pb": "N/A", "comment": "Seeded with an EdgeConneX minority bought from Infra IV/V; NAV rose from $2.4B to $9.4B in under 3 months on primary and secondary capital plus uplift. Fees 50-75bp on NAV (nearer 50bp); management warned inflow velocity will slow." }, { "name": "Coller International Partners X (Coller EQT)", "strategy": "PE Secondaries (flagship)", "status": "Launch planned later in 2026", "target": "N/A", "hardCap": "N/A", "prevFund": "$12.5B (CIP IX, hard cap)", "raisedToDate": "N/A", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "Coller combination closed 31 Aug (Coller FAUM ~€31B). CIP X activation expected H1'27 with fees on commitments; CIP IX final close Dec'25 ($17B across the PE secondaries platform). CCO III credit secondaries fund launched Q2 (fees on invested capital)." }, { "name": "Evergreens (EQT Nexus / Exeter REIT / Nexus Asia)", "strategy": "Evergreen private wealth", "status": "Open; Nexus Asia launched 9 Sep'26", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "€5.6B NAV; ~€10B incl. Coller", "firstClose": "N/A", "finalClose": "evergreen", "pb": "26467-21F", "comment": "H1'26 net inflows €1.8B (~€2.5B incl. Coller; ~€0.8B in Q2 ex-Coller after a weak April); redemptions ~0.5% of NAV per quarter. Management: the H1 pace is a good proxy for coming halves, with Q4 stronger than Q3. PB ID is the EQT Exeter Real Estate Income Trust." } ],
      fundraisingSummary:"H1'26 gross inflows were €17.8B (Key funds €4.8B; other strategies €11.6B, led by the new AI Infrastructure fund at $9.4B FAUM), lifting FAUM to €155B; ~€40B of the €100B cycle target is closed and EQT now expects >€140B including AI Infra, Scaleup Europe and Coller. BPEA IX closed at its $15.6B hard cap, EQT XI held a first close at 50% of its €23B target (activation end-Q3) and Infra VII launched at €21B (first close H1'27). Coller closed on 31 Aug (pro forma AUM €341B / FAUM €186B) with CIP X to launch later in 2026, and the €5B Scaleup Europe Fund began investing in August.",
      guidance:[ { "metric": "Coller FAUM", "period": "Within 4 years of close (31 Aug 2026)", "value": "Double (from ~€31B)", "source": "report", "comment": "Reiterated in the 31 Aug completion release ('remains committed to doubling Coller's FAUM within four years'); Coller EQT becomes a new Secondaries segment. Pro forma 30-Jun AUM €341B / FAUM €186B incl. >€10B evergreen NAV." }, { "metric": "Exits / distributions", "period": "FY2026", "value": "~EUR 20B, in line with 2025", "source": "transcript", "comment": "EUR 17B in H1; H2 pipeline includes IPOs and minority stake sales." }, { "metric": "Fee-related EBITDA margin", "period": "2027", "value": "55% ambition", "source": "transcript", "comment": "Likely reached in the latter part of 2027; H1 2026 ran at 50%." }, { "metric": "Coller fee-related EBITDA", "period": "FY2026", "value": "EUR 175-200M", "source": "transcript", "comment": "Full calendar-year basis (reiterated 17 Jul); the deal completed on 31 Aug 2026." }, { "metric": "Fundraising cycle target", "period": "Current cycle", "value": ">EUR 140B (up from 100B)", "source": "transcript", "comment": "~EUR 40B closed; AI Infra, Scaleup Europe and Coller add over EUR 40B." }, { "metric": "Management fee step-up", "period": "2027", "value": "Full-year EQT XI + Infra VII", "source": "transcript", "comment": "EQT XI activates Q3 2026; Infra VII around year-end, first close only H1 2027." }, { "metric": "Carry + investment income", "period": "2H 2026", "value": "H1 level a good proxy", "source": "transcript", "comment": "H1 was EUR 266M; Infra IV on path to initial carry late 2027." } ],
      guidanceSummary:"EQT guided to a 2027-weighted inflection: full-year effects of EQT XI and Infra VII step up management fees, the 55% fee-related EBITDA margin ambition is reachable late in 2027, and the cycle fundraising target was lifted above EUR 140B. Near term, H2 2026 carry should roughly match H1 and the ~EUR 20B exit ambition is intact. Coller completed on 31 Aug (pro forma AUM EUR 341B / FAUM EUR 186B), and EQT reiterated doubling Coller's FAUM within four years alongside the EUR 175-200M 2026 Coller FRE guide. All figures EUR.",
      consensus:{ FRE:{cons:585,n:10}, PFRE:{cons:136,n:10}, FRE_ps:{cons:0.49,n:10}, netFlowsTotal:{cons:3.8,n:10} },  // 1H26E VA cons (19-Jun-26), €M/€/€B; PFRE=carried interest (operating); no credit seg
      exits:{ quarterly:{
        "2023 Q2":{count:6,totalTV:1568}, "2023 Q3":{count:3,totalTV:480}, "2023 Q4":{count:2,totalTV:1503}, "2024 Q1":{count:2,totalTV:2062},
        "2024 Q2":{count:2,totalTV:4001}, "2024 Q3":{count:5,totalTV:3496}, "2024 Q4":{count:6,totalTV:696}, "2025 Q1":{count:3,totalTV:1631},
        "2025 Q2":{count:3,totalTV:0}, "2025 Q3":{count:6,totalTV:5808}, "2025 Q4":{count:5,totalTV:1060}, "2026 Q1":{count:5,totalTV:7942},
        "2026 Q2":{count:3,totalTV:521} },
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
      color:"#7C2D12", cadence:"semi-annual", period:"H1 2026", periodEnd:"2026-06-30", reportDate:"2026-07-30", currency:"EUR",
      reported:{ FRE:"EUR 442M", FRE_ps:null, fpAUM:"EUR 153B", DE_ps:"EUR 0.40", comment:"EUR, adjusted basis. FRE EUR442M +11% at a 57% margin; FPAUM EUR153.2B +9% led by Credit/Secondaries/Infra (now >55% of FPAUM); EUR22M of catch-up fees from the Catalyst III and SOF VI closes; PRE EUR110M +15% took adj. EBITDA to EUR554M +12%. Adj. EPS EUR0.40 (statutory EUR0.34). Marathon closed 1 Jul 2026 so is NOT in H1 P&L or FPAUM." },
      fundraising:[ { "name": "Europe/Americas Fund X", "strategy": "Large-cap Buyout (flagship)", "status": "Target set 11 Sep'26; formal launch Jan'27", "target": "€26B fee-paying (initial)", "hardCap": "N/A", "prevFund": "€27.3B incl. GP (Fund IX)", "raisedToDate": "N/A (pre-marketing)", "firstClose": "N/A", "finalClose": "N/A", "pb": "30835-72F", "comment": "Initial target 'in line with previous indications' after ~18 months of pre-marketing; Funds VII, VIII and IX closed 31%, 27% and 9% above their initial targets. Activation follows the end of Fund IX's commitment period at 90-95% invested (60-65% at Jun-26), guided H1'28. PB ID moved to the Fund X profile (29333-62F is 'Investment Europe IX')." }, { "name": "Secondary Opportunities Fund VI (SOF VI)", "strategy": "PE Secondaries", "status": "Final close (Sep'26)", "target": "$7B", "hardCap": "N/A", "prevFund": "$5.8B (SOF V, 2023)", "raisedToDate": "$10B", "firstClose": "N/A", "finalClose": "2026-09-03", "pb": "25871-05F", "comment": "$9.3B at 30 Jun, then final close 3 Sep: >200 LPs, ~50% of capital new to the SOF series (incl. parallel vehicles and CVC house/employee commitments). Credit secondaries launch described as imminent; CVC Secondary Partners ~€20B AUM." }, { "name": "CVC Catalyst III", "strategy": "Europe mid-market buyout", "status": "Final close (Jul'26)", "target": "€1.75B ($2B)", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "~€3.0B ($3.4B)", "firstClose": "N/A", "finalClose": "2026-07-06", "pb": "25958-26F", "comment": "Almost double target; equity cheques below €250M; two deals so far (WithSecure, WillowWood). Close held in H1 per CVC (catch-up fees booked in H1), announced 6 Jul; one of the largest commitments came from the Middle East. PB: $3.44B, closed." }, { "name": "CVC DIF Infrastructure VIII + Value-Add IV", "strategy": "Infrastructure (core-plus / value-add)", "status": "Raising; >75% of combined target", "target": "€8B combined", "hardCap": "N/A", "prevFund": "DIF VII / CIF III (2024)", "raisedToDate": "€5.2B at Jun-26", "firstClose": "N/A", "finalClose": "N/A", "pb": "27248-59F", "comment": "Including July closings and further IC approvals, >75% of the combined €8B target as of 30 Jul. Credit, secondaries and infra FPAUM together rose 19% YoY. PB ID is DIF Infrastructure VIII (PB size $1.19B is stale)." }, { "name": "European Direct Lending V (EUDL V)", "strategy": "European Direct Lending", "status": "Launched Q2'26", "target": "€5B (unlevered equity)", "hardCap": "N/A", "prevFund": ">€10B (EUDL IV, incl. leverage/SMAs)", "raisedToDate": "N/A", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "Target first disclosed on 30 Jul; excludes the 1:1 leverage on part of the fund and large SMAs alongside. Management hopes to finish above EUDL IV (PB $12.2B, 23908-96F) and reported 'strong initial investor support'." }, { "name": "Private Wealth evergreens (CVC-CRED/PE/PEF/PSEC)", "strategy": "Evergreen Credit/PE/Secondaries/Infra", "status": "Open / scaling", "target": "N/A", "hardCap": "N/A", "prevFund": "CVC-CRED (Q2'24)", "raisedToDate": "~€7B aggregate (Jun-26)", "firstClose": "N/A", "finalClose": "evergreen", "pb": "N/A", "comment": "4x YoY and +90% vs FY25. H1 subscriptions >€2.6B vs ~€80M redemptions (net ~€2.5B), with net inflows in every product in Q1 and Q2. CVC-CRED €3.5B, CVC-PE €1.7B; US-dedicated CVC-PEF launched; evergreens now span PE, credit, secondaries and infra." } ],
      fundraisingSummary:"H1'26 gross inflows were €11B (FPAUM €153B, +9%; credit, secondaries and infra +19%), and private-wealth evergreens reached ~€7B after ~€2.5B of H1 net inflows. Catalyst III closed at ~€3.0B ($3.4B, almost double target), SOF VI at $10B on 3 Sep (vs a $7B target) and CLO Equity IV at $1B; DIF VIII/Value-Add IV passed 75% of a combined €8B target and EUDL V launched targeting €5B. On 11 Sep CVC set Fund X's initial target at €26B fee-paying (formal raise from Jan'27), which it says fits its double-digit FPAUM CAGR to 2028; Marathon (closed 1 Jul) adds credit FPAUM from H2.",
      guidance:[ { "metric": "Europe/Americas Fund X size", "period": "Fundraise from Jan 2027", "value": "EUR 26B fee-paying (initial target)", "source": "report", "comment": "Set 11 Sep 2026 at the annual investor meeting, 'in line with previous indications'; hard cap to be set later. Funds VII/VIII/IX closed 31%/27%/9% above initial targets; activation at 90-95% Fund IX investment (60-65% at Jun-26)." }, { "metric": "Standard Life PRT JV commitment", "period": "Drawn over ~5 years from completion (exp. H1 2027)", "value": "GBP 400M CVC capital commitment", "source": "report", "comment": "20 Aug: CVC and Prudential lead a consortium (with Goldman Sachs, MS&AD) that, with GBP 500M from Standard Life, commits up to GBP 2B to a UK pension risk-transfer venture; CVC also originates assets for it. Subject to regulatory approval." }, { "metric": "Performance Related Earnings", "period": "FY2026-27", "value": "~EUR600-700M aggregate", "source": "report", "comment": "Reaffirmed; 2026 around the 2025 level of EUR254M, first step-up in 2027 on initial Asia V carry. H2-26 second-half weighted, pending regulatory approvals." }, { "metric": "Performance Related Earnings", "period": "FY2028-29", "value": "EUR1.2-1.5B aggregate", "source": "report", "comment": "Fund VIII recognises initial IFRS carry at a 30% contribution to the IPO perimeter (Fund VI 0%, Fund VII 15%)." }, { "metric": "Embedded future carry", "period": "At 30-Jun-26", "value": "~EUR5B net", "source": "report", "comment": "Unchanged vs FY25; midpoint of an implied EUR3.3-7.2B range, excl. EUR0.8B already recognised." }, { "metric": "Fee-paying AUM CAGR", "period": "To 2028", "value": "Double-digit %", "source": "report", "comment": "Reaffirmed 11 Sep: the EUR26B fee-paying Fund X initial target is 'fully consistent' with the CAGR. Fund IX 60-65% invested at Jun-26; activation still expected H1 2028 at the 90-95% trigger." }, { "metric": "Total operating cost growth", "period": "FY2026, then FY2027+", "value": "High single digit, then mid-to-high single digit", "source": "report", "comment": "H1-26 ran at +7%; higher in H2 on hiring phasing and AI/private-wealth/insurance investment." }, { "metric": "Total realisations", "period": "FY2026", "value": "Broadly similar to FY25 (~EUR21.9B)", "source": "transcript", "comment": "H1-26 realisations EUR11.5B +19% YoY and LTM a record EUR23.8B, so the guide implies a materially softer H2 than H2-25's EUR12.3B." } ],
      guidanceSummary:"CVC reaffirmed every medium-term marker: EUR600-700M of PRE across 2026-27 (2026 flat on 2025, first step-up in 2027), EUR1.2-1.5B across 2028-29 as Fund VIII starts recognising carry, ~EUR5B of embedded future carry and a double-digit FPAUM CAGR to 2028. The CAGR is now anchored by a EUR26B fee-paying initial target for Fund X, set 11 Sep with the formal raise from January 2027. Near term, the realisations guide of ~EUR21.9B implies a materially softer H2 after a record LTM, and a GBP400M commitment to the Standard Life PRT venture (completion expected H1 2027) extends the insurance push. Watch the statutory numbers: statutory EBITDA fell EUR733M to EUR585M purely on the non-cash CVC DIF forward-liability revaluation, not on trading.",
      consensus:{ FRE:{cons:520,n:6}, PFRE:{cons:97,n:6} },  // 1H26E VA cons (18-Jun-26), €M; FRE=mgmt EBITDA (operating, FRE-equiv); PFRE incl. investment income
      exits:{ quarterly:{
        "2023 Q2":{count:2,totalTV:0}, "2023 Q3":{count:0,totalTV:0}, "2023 Q4":{count:0,totalTV:0}, "2024 Q1":{count:1,totalTV:2300},
        "2024 Q2":{count:0,totalTV:0}, "2024 Q3":{count:0,totalTV:0}, "2024 Q4":{count:1,totalTV:0}, "2025 Q1":{count:4,totalTV:250},
        "2025 Q2":{count:1,totalTV:0}, "2025 Q3":{count:0,totalTV:0}, "2025 Q4":{count:2,totalTV:2694}, "2026 Q1":{count:1,totalTV:0},
        "2026 Q2":{count:1,totalTV:3587} },
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
      fundraising:[ { "name": "ICG Europe Fund IX", "strategy": "Structured Capital (flagship)", "status": "Final close (Sep'26)", "target": ">€10B", "hardCap": "€12B (not raised)", "prevFund": "Europe VIII (2021)", "raisedToDate": "€12B", "firstClose": "N/A", "finalClose": "2026-09-09", "pb": "27058-60F", "comment": "Largest dedicated structured-capital fund raised globally, 50% above Europe VIII. 77% re-up rate by commitment plus ~90 new LPs; oversubscribed but ICG kept the hard cap. €11B at 30 Jun, with ~€1B of fee-eligible commitments closed since; 22% deployed across six investments." }, { "name": "Strategic Equity VI", "strategy": "GP-led Secondaries (flagship)", "status": "Launch expected towards end-FY27", "target": "N/A", "hardCap": "N/A", "prevFund": "$11B (SE V, 2025)", "raisedToDate": "N/A", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "Management said in May that SE was running 'a bit ahead' of plan and aims to keep its global lead in GP-led secondaries. SE V closed Mar'25 at $11B vs a $6B target (PB 23785-93F)." }, { "name": "Senior Debt Partners VI (SDP VI)", "strategy": "European Direct Lending (flagship)", "status": "Launched (Q1 FY27)", "target": "N/A", "hardCap": "N/A", "prevFund": "SDP V", "raisedToDate": "N/A", "firstClose": "Before end-FY27 (exp.)", "finalClose": "N/A", "pb": "N/A", "comment": "Launched ahead of the 'towards the end of FY27' timing given in May; first close expected before 31 Mar 2027 (15 Jul update). Q1 FY27 Debt fundraising was $0.6B." }, { "name": "LP Secondaries Fund II", "strategy": "LP-led Secondaries", "status": "In market (launched Dec'25)", "target": "N/A", "hardCap": "N/A", "prevFund": "$1B (LPS I, hard cap)", "raisedToDate": "N/A", "firstClose": "N/A", "finalClose": "N/A", "pb": "29069-02F", "comment": "In market for all of FY27 with a 'strong fundraising pipeline'. LPS I was $1.6B including co-invest SPVs and SMAs. A companion LP Secondaries evergreen for Amundi's wealth channel launches in the coming weeks (17 Sep)." }, { "name": "SRE III (European Real Estate equity)", "strategy": "Real Estate equity", "status": "Launched (Q1 FY27)", "target": "N/A", "hardCap": "N/A", "prevFund": "€0.7B (SRE II)", "raisedToDate": "N/A", "firstClose": "Before end-FY27 (exp.)", "finalClose": "N/A", "pb": "N/A", "comment": "Launched per the 15 Jul update. Metropolitan II and Infrastructure II closed above target in FY26, and Q1 FY27 Real Assets fundraising was $1.3B." }, { "name": "Infrastructure Asia I", "strategy": "Infrastructure equity (Asia)", "status": "In market (debut)", "target": "N/A", "hardCap": "N/A", "prevFund": "debut", "raisedToDate": "N/A", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "Listed as actively fundraising at 31 Mar 2026; an adjacency built on Infra II's close at €3.15B (Sep'25, >2x Infra I)." }, { "name": "LP Secondaries evergreen (Amundi wealth)", "strategy": "Evergreen PE secondaries (wealth)", "status": "Launching (weeks after 17 Sep'26)", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "N/A", "firstClose": "N/A", "finalClose": "evergreen", "pb": "N/A", "comment": "First joint product under the 10-year exclusive wealth-distribution agreement; Amundi completed its 9.9% economic stake (~€620M) on 17 Sep 2026." } ],
      fundraisingSummary:"Q1 FY27 (Apr-Jun) fundraising was $4.1B (LTM $17.3B; SC&S $2.2B, Real Assets $1.3B, Debt $0.6B) after $16.6B in FY26, adding to the $40B raised in FY24-26 against the $55B four-year target; management guided FY27 fundraising below FY26 given the cycle. Europe IX held its final close at €12B on 9 Sep, 50% above Europe VIII and the largest structured-capital fund globally. SDP VI and SRE III launched with first closes due before end-FY27 and LP Secondaries II stays in market; Amundi completed its 9.9% stake on 17 Sep, with an LP Secondaries evergreen for its wealth channel launching within weeks.",
      guidance:[ { "metric": "Europe IX final size", "period": "Q2 FY27 (closed 9 Sep 2026)", "value": "EUR 12B (vs >EUR 10B target)", "source": "report", "comment": "Guided 15 Jul (€11B at 30 Jun, 'on track' for €12B in Q2 FY27) and delivered 9 Sep; hard cap not raised; ~€1B of fee-eligible commitments closed after 30 Jun." }, { "metric": "SDP VI and SRE III first closes", "period": "Before end-FY27 (31 Mar 2027)", "value": "First closes expected", "source": "report", "comment": "Both launched in Q1 FY27 (15 Jul update); SRE II total fund size was €0.7B; timings depend on market conditions." }, { "metric": "Amundi wealth distribution", "period": "10 years from Sep 2026", "value": "Exclusive global wealth distributor; first product within weeks", "source": "report", "comment": "Amundi completed its 9.9% economic stake (~€620M) on 17 Sep 2026. First joint product is an evergreen LP Secondaries fund; more wealth products are to be co-developed." }, { "metric": "Four-year fundraising", "period": "FY2024–27", "value": "$55B target", "source": "transcript", "comment": "$40B through FY2026; possibly a year early." }, { "metric": "Fee-earning AUM growth", "period": "Medium-term", "value": "sustained double-digit", "source": "transcript", "comment": "FEAUM $88B at 30 Jun 2026 (+10% YoY, +3% QoQ; $2.4B net additions); $18B of $36B dry powder not yet earning fees (Mar-26: $87B FEAUM, $19B not yet earning, ~£120M latent fees)." }, { "metric": "FRE margin", "period": "Medium-term", "value": "expanding from 47% (ex catch-up)", "source": "transcript", "comment": "+14pp over 5 years." }, { "metric": "Group cost growth", "period": "FY2027+", "value": "5–10%/yr", "source": "transcript", "comment": "FY26 was an unusually low 3%." }, { "metric": "Performance fee income", "period": "Medium-term", "value": "10–20% of fee income", "source": "transcript", "comment": "FY26 incl £72m one-time gain; normalized £96m." }, { "metric": "Net debt / FRE", "period": "Mar 2026", "value": "0.3x (£113M)", "source": "transcript", "comment": "Down from 0.6x; approaching zero net debt." }, { "metric": "Ordinary dividend", "period": "FY2026", "value": "87p", "source": "transcript", "comment": "16th consecutive year of growth." } ],
      guidanceSummary:"ICG repositioned medium-term disclosure around FRE, performance fees and balance sheet (peer-aligned): FRE margin expanding from 47% (ex catch-up), sustained double-digit FEAUM growth and approaching zero net debt, which opens capital-allocation optionality. Since the FY print, the Q1 FY27 update showed FEAUM at $88B (+10% YoY) with $18B not yet earning fees, Europe IX closed at €12B (9 Sep), and SDP VI and SRE III launched with first closes targeted before end-FY27. Amundi completed its 9.9% stake on 17 Sep and becomes exclusive wealth distributor, starting with an LP Secondaries evergreen. (S&P guidance tool: no data.)",
      consensus:{},
      exits:{ quarterly:{
        "2023 Q2":{count:1,totalTV:0}, "2023 Q3":{count:2,totalTV:0}, "2023 Q4":{count:1,totalTV:0}, "2024 Q1":{count:0,totalTV:0},
        "2024 Q2":{count:2,totalTV:398}, "2024 Q3":{count:3,totalTV:1107}, "2024 Q4":{count:2,totalTV:0}, "2025 Q1":{count:1,totalTV:0},
        "2025 Q2":{count:1,totalTV:0}, "2025 Q3":{count:2,totalTV:796}, "2025 Q4":{count:1,totalTV:1800}, "2026 Q1":{count:1,totalTV:544},
        "2026 Q2":{count:0,totalTV:0} },
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
      color:"#9333EA", cadence:"annual", period:"H1 2026", periodEnd:"2026-06-30", reportDate:"2026-07-17", currency:"GBP",
      reported:{ FRE:"GBP 108M", FRE_ps:null, fpAUM:"USD 58B", DE_ps:"16.3p", comment:"GBP P&L / USD AUM / EUR deal volumes. FRE GBP108M +42% incl. GBP21.7M of catch-up fees (GBP86.3M / +23% excl.); underlying EBITDA GBP227M at a 60.6% margin; underlying EPS 16.3p. FPAUM USD58.4B +33%. Driven by BE VIII starting to pay fees early (9 Jun) and ECP VI's 30-Jun close pulling catch-ups into H1, plus first-time ECP V carry on the Calpine, Symmetry and Cornerstone exits taking PRE to GBP120.7M — about two-thirds of expected FY26 PRE." },
      fundraising:[ { "name": "Bridgepoint Europe VIII (BE VIII)", "strategy": "European Mid-market Buyout (flagship)", "status": "Raising; fee-paying since 9 Jun'26", "target": "€7.5B cover (€8.0-8.5B exp.)", "hardCap": "N/A", "prevFund": "~€6.5B (BE VII, 100% deployed)", "raisedToDate": "€7.0B", "firstClose": "Jun 2026", "finalClose": "Q1 2027 (exp.)", "pb": "28314-82F", "comment": "Now above BE VII, with €0.3B added after the 29 Jun KARE announcement (€6.7B at first close); final close guided at €8.0-8.5B. BE VII has made its final investment and BE VIII its first." }, { "name": "ECP VI (Energy Capital Partners)", "strategy": "US Energy Transition Infra (flagship)", "status": "Final close (Aug'26)", "target": "$5B", "hardCap": "$7.8B external (from $7.5B)", "prevFund": "$4.4B (ECP V, May'24)", "raisedToDate": "$8.1B", "firstClose": "pre-Dec 2025", "finalClose": "2026-08-06", "pb": "27050-50F", "comment": ">50% above target and >80% above ECP V; $8.1B of total commitments includes the GP commitment on top of the lifted external hard cap. Fee-paying since May 2025; ECP VII pushed to 2029 to deploy the larger fund. Deals include DCC, EnergySolutions and Grain LNG." }, { "name": "Bridgepoint Direct Lending IV (BDL IV)", "strategy": "European Direct Lending", "status": "Final close (Jul'26)", "target": "€4B cover", "hardCap": "N/A", "prevFund": "BDL III (fully deployed)", "raisedToDate": "€5.1B investable", "firstClose": "N/A", "finalClose": "2026-07", "pb": "25237-27F", "comment": "Closed in early July (announced Aug), >40% invested across 20+ European mid-market companies. A separate Pantheon-led €1.2B continuation vehicle for 2017-vintage BDL II loans closed on 8 Sep." }, { "name": "Bridgepoint Credit Opportunities V (BCO V)", "strategy": "Credit Special Situations", "status": "Initial close (Apr'26); raising into 2027", "target": "N/A", "hardCap": "N/A", "prevFund": "BCO IV (2023)", "raisedToDate": "N/A", "firstClose": "Apr 2026", "finalClose": "2027 (exp.)", "pb": "26225-47F", "comment": "Management sees a 'compelling opportunity set' from geopolitical volatility and software/AI-adjacent credit dislocations. CLO X and XI priced in H1; CLO XII is warehousing." }, { "name": "Newbury Bridgepoint VI", "strategy": "PE Secondaries", "status": "Launch later in 2026", "target": "N/A", "hardCap": "N/A", "prevFund": "Newbury V (pre-acquisition)", "raisedToDate": "N/A", "firstClose": "N/A", "finalClose": "N/A", "pb": "N/A", "comment": "Newbury deal closed 6 Feb 2026 (+$3.9B AUM / +$3.5B FPAUM) and is expected to break even within two years; the aim is a secondaries and solutions vertical of equal scale to the others over time." }, { "name": "ECP Evergreen Yield", "strategy": "Infrastructure evergreen (institutional)", "status": "Open; $500M anchor to deploy H2'26", "target": "N/A", "hardCap": "N/A", "prevFund": "N/A", "raisedToDate": "$500M anchor", "firstClose": "N/A", "finalClose": "evergreen", "pb": "N/A", "comment": "Expected to deploy $500M from an anchor investor in H2 2026 while raising from other institutions. Bridgepoint also set up an institutional (not semi-liquid) Bridgepoint Direct Lending Evergreen in Luxembourg (reported 7 Sep)." }, { "name": "Bridgepoint Generations", "strategy": "Wealth / Evergreen", "status": "Open / early", "target": "N/A", "hardCap": "N/A", "prevFund": "debut (Oct'25)", "raisedToDate": "N/A", "firstClose": "N/A", "finalClose": "evergreen", "pb": "N/A", "comment": "Private wealth offering, with 'continued progress' per the H1 report; 5 distribution agreements (UK/FR/ES/DE/ME); HNW clients co-invest pro rata alongside the institutional funds, which still raise the great majority of capital." } ],
      fundraisingSummary:"H1'26 fund commitments were €11.6B, taking the 2024-26 cycle to €26B against a target lifted to €28B on 29 Jun (from €24B), with ~€2B to come in H2. BDL IV closed at €5.1B of investable capital in July (cover €4B) and ECP VI at $8.1B on 6 Aug (target $5B, hard cap lifted); BE VIII has €7.0B (above BE VII, fee-paying since 9 Jun) and guides to a €8.0-8.5B final close in Q1'27. BCO V (initial close Apr) and the next Newbury secondaries fund (launching later in 2026) extend the pipeline; the pending KARE acquisition (close expected at year-end) sits outside these figures.",
      guidance:[ { "metric": "Fundraising, 2024-26 cycle", "period": "By end-2026", "value": "EUR 28B (raised from EUR 24B)", "source": "report", "comment": "EUR26B raised at 17 Jul, c.EUR2B left for H2. ECP VI then closed at USD8.1B on 6 Aug (USD7.8B external hard cap plus GP) and BDL IV at EUR5.1B; BE VIII final close still expected Q1'27 at EUR8-8.5B." }, { "metric": "Management fee growth", "period": "Rolling 3-year", "value": "13-16%", "source": "report", "comment": "H1'26 ran +16% excl. catch-up fees; group fee rate broadly flat at 1.17%." }, { "metric": "Underlying EBITDA margin", "period": "FY2026-27", "value": "55-60%", "source": "transcript", "comment": "H1 came in at 60.6%, slightly above the top end; CFO expects FY26 a little lower as PRE was front-loaded." }, { "metric": "PRE % of total income", "period": "FY2026-27 / long term", "value": "20-25% long term, top end in 2026-27", "source": "report", "comment": "H1'26 PRE was 32.2% of income and c.two-thirds of full-year PRE, materially de-risking the FY guide." }, { "metric": "AUM staging post", "period": "2029/2030", "value": "USD 200B", "source": "report", "comment": "CMD target reaffirmed; pro forma AUM already USD120B including pending KARE." }, { "metric": "Near-term deployment", "period": "H2 2026", "value": "~EUR 2B further", "source": "transcript", "comment": "BE VII has made its final investment; BE VIII announced its first at c.EUR600M." } ],
      guidanceSummary:"Bridgepoint raised its 2024-26 fundraising target to EUR28B (from EUR24B) with EUR26B already in, and ECP VI's USD8.1B final close on 6 Aug further de-risks it; BE VIII's EUR8-8.5B final close is due in Q1'27. PRE is guided to the top end of its 20-25% band for 2026-27 after H1 delivered about two-thirds of expected full-year PRE on first-time ECP V carry. Margin guidance of 55-60% stands, with FY26 likely below H1's 60.6%. The pending KARE acquisition is excluded from all figures and carries its own medium-term guidance; it is only expected to close at end-2026, subject to approvals.",
      consensus:{ PFRE:{act:151.6} },
      exits:{ quarterly:{
        "2023 Q2":{count:2,totalTV:2664}, "2023 Q3":{count:1,totalTV:0}, "2023 Q4":{count:1,totalTV:0}, "2024 Q1":{count:1,totalTV:0},
        "2024 Q2":{count:1,totalTV:0}, "2024 Q3":{count:2,totalTV:0}, "2024 Q4":{count:3,totalTV:0}, "2025 Q1":{count:0,totalTV:0},
        "2025 Q2":{count:1,totalTV:0}, "2025 Q3":{count:2,totalTV:4000}, "2025 Q4":{count:4,totalTV:5475}, "2026 Q1":{count:2,totalTV:1425},
        "2026 Q2":{count:1,totalTV:475} },
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
 "asOf": "2Q26 (Jun 30, 2026)",
 "note": "Blackstone net +$468M to $7.47B (Multi-Asset +$187M, Infrastructure +$164M); Carlyle −$173M as CP VII fell $153M."
},

  // Section 4b — the 1-2 funds that drive each disclosing firm's accrued carry (watch list).
  accruedFocus: {
 "KKR": "Co-Investment Vehicles ($1.68B gross) and North America Fund XIII ($1.27B) now lead PE as Americas Fund XII harvests (↓ to $1.12B on OneStream/Flow Control exits); Global Infrastructure IV ($1.08B) leads Real Assets and European Fund VI ($196M) began accruing.",
 "BX": "BCP Global ($1.76B net) is still the largest pool but dipped on Corporate PE realizations; Secondaries ($1.15B) and Energy/Transition ($1.05B) follow, while Infrastructure (↑ to $936M) and Multi-Asset (↑ to $243M) drove the build to $7.5B.",
 "ARES": "Credit still carries Ares: PCS II ($114M net) and ASOF II ($105M) now lead after ACE V's $47M post-investment-period distribution cut it to $86M, ACE VI ($94M, ↑) is the builder, and ACOF VI's $626M gross still nets to ~$17M (~97% comp).",
 "CG": "CP VII dropped to $256M net (↓$153M on lower public marks and the preferred return) and is now barely ahead of CP VIII ($228M); CJP IV ($71M) realized carry for the first time, and AlpInvest secondaries (ASF VII $161M, ASF VIII ↑ to $76M) remain the growth pool.",
 "APO": "Fund IX (~$424M net) is still the core PE carry but slipped again on MTT/consumer markdowns; Fund X (~$250M, ↑) is building, Fund VIII jumped to ~$61M (still in escrow) and Redding Ridge (~$107M) leads credit."
},

  accrued: {
 "KKR": {
  "name": "KKR",
  "color": "#B45309",
  "period": "2Q26",
  "periodEnd": "Jun 30, 2026",
  "disclosure": "Gross carry per fund (10-Q)",
  "compType": "estimated",
  "compNote": "75% comp rate → net est. 25% of gross. Total gross $9,756M; net est. $2,439M.",
  "segments": [
   {
    "label": "Private Equity",
    "funds": [
     {
      "name": "Co-Investment Vehicles",
      "vintage": "Various",
      "gross": 1676,
      "note": "↓ from $1,844M 1Q26"
     },
     {
      "name": "North America Fund XIII",
      "vintage": "2021",
      "gross": 1270,
      "note": "↑ from $1,062M 1Q26"
     },
     {
      "name": "Americas Fund XII",
      "vintage": "2017",
      "gross": 1117,
      "note": "↓ from $1,442M 1Q26 — OneStream/Flow Control realizations"
     },
     {
      "name": "Asian Fund IV",
      "vintage": "2020",
      "gross": 872,
      "note": "↓ from $954M 1Q26"
     },
     {
      "name": "Asian Fund III",
      "vintage": "2017",
      "gross": 808,
      "note": "↓ from $884M 1Q26 — Kokusai final sale"
     },
     {
      "name": "Global Impact Fund II",
      "vintage": "2022",
      "gross": 370
     },
     {
      "name": "European Fund V",
      "vintage": "2019",
      "gross": 356
     },
     {
      "name": "North America Fund XI",
      "vintage": "2012",
      "gross": 224,
      "note": "↑ from $190M 1Q26"
     },
     {
      "name": "European Fund VI",
      "vintage": "2022",
      "gross": 196,
      "note": "↑ from $0 1Q26 — first accrual"
     },
     {
      "name": "Health Care Strategic Growth II",
      "vintage": "2021",
      "gross": 189
     },
     {
      "name": "Next Gen Tech Growth Fund II",
      "vintage": "2019",
      "gross": 143
     },
     {
      "name": "Health Care Strategic Growth I",
      "vintage": "2016",
      "gross": 135
     },
     {
      "name": "Global Impact Fund",
      "vintage": "2019",
      "gross": 98
     },
     {
      "name": "European Fund IV",
      "vintage": "2015",
      "gross": 97
     },
     {
      "name": "Arctos Sports Partners I & Affiliates",
      "vintage": "Various",
      "gross": 75,
      "note": "New to table (Arctos)"
     },
     {
      "name": "Ascendant Fund",
      "vintage": "2022",
      "gross": 37
     },
     {
      "name": "Next Gen Tech Growth Fund",
      "vintage": "2016",
      "gross": 35,
      "note": "↓ from $66M 1Q26 — OneStream realization"
     },
     {
      "name": "Arctos Sports Partners II & Affiliates",
      "vintage": "Various",
      "gross": 32,
      "note": "New to table (Arctos)"
     },
     {
      "name": "Other Core Vehicles",
      "vintage": "Various",
      "gross": 27
     },
     {
      "name": "North America Fund XIV",
      "vintage": "2025",
      "gross": 4,
      "note": "In investment period"
     },
     {
      "name": "Core Investors II",
      "vintage": "2022",
      "gross": -10,
      "note": "Negative carry"
     },
     {
      "name": "Core Investors I",
      "vintage": "2018",
      "gross": -43,
      "note": "Negative carry"
     },
     {
      "name": "Next Gen Tech Growth Fund III",
      "vintage": "2022",
      "gross": 0,
      "note": "Not yet accruing"
     },
     {
      "name": "Arctos Keystone I & Affiliates",
      "vintage": "Various",
      "gross": 0,
      "note": "New to table (Arctos); not yet accruing"
     }
    ]
   },
   {
    "label": "Real Assets",
    "funds": [
     {
      "name": "Global Infrastructure IV",
      "vintage": "2021",
      "gross": 1075
     },
     {
      "name": "Asia Pacific Infrastructure II",
      "vintage": "2022",
      "gross": 281
     },
     {
      "name": "Global Infrastructure III",
      "vintage": "2018",
      "gross": 202
     },
     {
      "name": "Asia Pacific Infrastructure I",
      "vintage": "2020",
      "gross": 193
     },
     {
      "name": "Co-Investments (Real Assets)",
      "vintage": "Various",
      "gross": 112
     },
     {
      "name": "Energy Related Vehicles",
      "vintage": "Various",
      "gross": 64
     },
     {
      "name": "Global Infrastructure II",
      "vintage": "2014",
      "gross": 55
     },
     {
      "name": "RE Credit Opp. Partners II",
      "vintage": "2019",
      "gross": 30
     },
     {
      "name": "Global Infrastructure V",
      "vintage": "2024",
      "gross": 15,
      "note": "New fund; in investment period"
     },
     {
      "name": "RE Partners Americas IV",
      "vintage": "2024",
      "gross": 8,
      "note": "First accrual; in investment period"
     },
     {
      "name": "Asia RE Partners II",
      "vintage": "2023",
      "gross": 7,
      "note": "New to table"
     },
     {
      "name": "Opp. RE Credit Fund II",
      "vintage": "2023",
      "gross": 7,
      "note": "New to table"
     },
     {
      "name": "RE Partners Europe III",
      "vintage": "2024",
      "gross": 2,
      "note": "New to table"
     },
     {
      "name": "RE Partners Americas II",
      "vintage": "2017",
      "gross": 1
     },
     {
      "name": "RE Partners Americas",
      "vintage": "2013",
      "gross": -4,
      "note": "Negative carry"
     },
     {
      "name": "RE Credit Opp. Partners I",
      "vintage": "2017",
      "gross": 0
     },
     {
      "name": "RE Partners Europe",
      "vintage": "2015",
      "gross": 0,
      "note": "↑ from $(18)M 1Q26 — negative carry cleared"
     },
     {
      "name": "RE Partners Americas III",
      "vintage": "2021",
      "gross": 0
     },
     {
      "name": "RE Partners Europe II",
      "vintage": "2020",
      "gross": 0
     },
     {
      "name": "Asia Pacific Infra III",
      "vintage": "2025",
      "gross": 0,
      "note": "Launched Dec 2025"
     },
     {
      "name": "Opp. RE Credit Fund III",
      "vintage": "2026",
      "gross": 0,
      "note": "New fund (Jun 2026)"
     }
    ]
   }
  ]
 },
 "BX": {
  "name": "Blackstone",
  "color": "#6D28D9",
  "period": "2Q26",
  "periodEnd": "Jun 30, 2026",
  "disclosure": "Net carry per fund (10-Q, directly disclosed)",
  "compType": "disclosed",
  "compNote": "Net directly disclosed. GAAP gross $13.9B; comp $6.0B; ~45% implied comp rate.",
  "segments": [
   {
    "label": "Private Equity",
    "funds": [
     {
      "name": "BCP Global",
      "vintage": "Various",
      "net": 1764,
      "note": "↓ from $1,860M 1Q26 — Corporate PE realizations"
     },
     {
      "name": "Secondaries",
      "vintage": "Various",
      "net": 1148
     },
     {
      "name": "Energy / Energy Transition",
      "vintage": "Various",
      "net": 1052
     },
     {
      "name": "Infrastructure",
      "vintage": "Various",
      "net": 936,
      "note": "↑ from $772M 1Q26"
     },
     {
      "name": "BCP Asia",
      "vintage": "Various",
      "net": 262,
      "note": "↑ from $216M 1Q26"
     },
     {
      "name": "BTAS / BXPE",
      "vintage": "Various",
      "net": 262
     },
     {
      "name": "Core Private Equity",
      "vintage": "Various",
      "net": 256
     },
     {
      "name": "Life Sciences",
      "vintage": "Various",
      "net": 253,
      "note": "↑ from $228M 1Q26"
     },
     {
      "name": "Tactical Opportunities",
      "vintage": "Various",
      "net": 150
     },
     {
      "name": "Rounding Adj.",
      "vintage": "—",
      "net": -2,
      "note": "Totals may not add due to rounding"
     }
    ]
   },
   {
    "label": "Real Estate",
    "funds": [
     {
      "name": "BREP Global",
      "vintage": "Various",
      "net": 553
     },
     {
      "name": "BREP Asia",
      "vintage": "Various",
      "net": 114
     },
     {
      "name": "BPP",
      "vintage": "Various",
      "net": 114,
      "note": "↑ from $86M 1Q26"
     },
     {
      "name": "BREP Europe",
      "vintage": "Various",
      "net": 81
     },
     {
      "name": "BREDS",
      "vintage": "Various",
      "net": 30
     },
     {
      "name": "Rounding Adj.",
      "vintage": "—",
      "net": -1,
      "note": "Totals may not add due to rounding"
     }
    ]
   },
   {
    "label": "Credit & Insurance",
    "funds": [
     {
      "name": "Credit & Insurance Strategies",
      "vintage": "Various",
      "net": 252
     },
     {
      "name": "Rounding Adj.",
      "vintage": "—",
      "net": 1,
      "note": "Totals may not add due to rounding"
     }
    ]
   },
   {
    "label": "Multi-Asset Investing",
    "funds": [
     {
      "name": "Multi-Asset Strategies",
      "vintage": "Various",
      "net": 243,
      "note": "↑ from $56M 1Q26 — strong 2Q hedge fund returns"
     }
    ]
   }
  ]
 },
 "ARES": {
  "name": "Ares",
  "color": "#2563EB",
  "period": "2Q26",
  "periodEnd": "Jun 30, 2026",
  "disclosure": "Gross & net carry per fund (10-Q segment tables)",
  "compType": "disclosed",
  "compNote": "Gross and net directly disclosed. Mostly European-style waterfall (PE funds American). Q2 realized: $51M net.",
  "segments": [
   {
    "label": "Credit",
    "funds": [
     {
      "name": "PCS II",
      "vintage": "2020",
      "gross": 278.1,
      "net": 113.7
     },
     {
      "name": "ASOF II",
      "vintage": "2021",
      "gross": 349.3,
      "net": 104.6
     },
     {
      "name": "ACE VI",
      "vintage": "2022",
      "gross": 254.3,
      "net": 94.1,
      "note": "↑ from $81.8M 1Q26"
     },
     {
      "name": "ACE V",
      "vintage": "2020",
      "gross": 230.8,
      "net": 85.9,
      "note": "↓ from $130.9M 1Q26 — $47M net distribution after investment period"
     },
     {
      "name": "ASOF I",
      "vintage": "2019",
      "gross": 277.1,
      "net": 72
     },
     {
      "name": "ACE IV",
      "vintage": "2018",
      "gross": 177.3,
      "net": 62
     },
     {
      "name": "PCS I",
      "vintage": "2017",
      "gross": 141.7,
      "net": 58
     },
     {
      "name": "Pathfinder II",
      "vintage": "2023",
      "gross": 221.6,
      "net": 48.2,
      "note": "↑ from $40.6M 1Q26 (gross +$45M)"
     },
     {
      "name": "Pathfinder I",
      "vintage": "2020",
      "gross": 228.5,
      "net": 34.2
     },
     {
      "name": "Other Credit Funds",
      "vintage": "Various",
      "gross": 318.5,
      "net": 121.2
     }
    ]
   },
   {
    "label": "Real Assets",
    "funds": [
     {
      "name": "IDF V",
      "vintage": "2020",
      "gross": 194.5,
      "net": 74
     },
     {
      "name": "ACIP I",
      "vintage": "2021",
      "gross": 101.6,
      "net": 31.5
     },
     {
      "name": "US IX",
      "vintage": "2017",
      "gross": 78.7,
      "net": 29.9
     },
     {
      "name": "EIF V",
      "vintage": "2015",
      "gross": 102.9,
      "net": 26
     },
     {
      "name": "JDC I",
      "vintage": null,
      "gross": 84,
      "net": 12.6,
      "note": "New to table (Japan DC Partners I); vintage not disclosed in 2Q26 10-Q/presentation"
     },
     {
      "name": "Other Real Assets",
      "vintage": "Various",
      "gross": 168.6,
      "net": 59.2,
      "note": "Excl. JDC I (shown separately from 2Q26)"
     }
    ]
   },
   {
    "label": "Private Equity",
    "funds": [
     {
      "name": "ACOF VI",
      "vintage": "2020",
      "gross": 625.6,
      "net": 16.5,
      "note": "~97% comp"
     },
     {
      "name": "ACOF IV",
      "vintage": "2012",
      "gross": 91.4,
      "net": 18.2
     },
     {
      "name": "ACOF VII",
      "vintage": "2023",
      "gross": 14.2,
      "net": 2.8,
      "note": "New to table"
     },
     {
      "name": "Other PE Funds",
      "vintage": "Various",
      "gross": 7.7,
      "net": 1.7,
      "note": "Excl. ACOF VII (shown separately from 2Q26)"
     }
    ]
   },
   {
    "label": "Secondaries",
    "funds": [
     {
      "name": "Other Secondaries",
      "vintage": "Various",
      "gross": 68.8,
      "net": 22.2,
      "note": "Excl. LEP XVII / LREF IX (shown separately from 2Q26)"
     },
     {
      "name": "LREF IX",
      "vintage": null,
      "gross": 34.7,
      "net": 7.3,
      "note": "New to table (10-Q label 'LREP IX'); vintage not disclosed in 2Q26 10-Q/presentation"
     },
     {
      "name": "LEP XVII",
      "vintage": null,
      "gross": 41.7,
      "net": 7,
      "note": "New to table; vintage not disclosed in 2Q26 10-Q/presentation"
     },
     {
      "name": "LREF VIII",
      "vintage": "2016",
      "gross": 38.2,
      "net": 5.8,
      "note": "↓ from $10.5M 1Q26 — multifamily markdowns"
     }
    ]
   },
   {
    "label": "Other Businesses",
    "funds": [
     {
      "name": "Other Businesses / Adj.",
      "vintage": "Various",
      "gross": 139.3,
      "net": 37.9,
      "note": "Residual to presentation total $1,146.5M net / $4,269.1M gross (unconsolidated)"
     }
    ]
   }
  ]
 },
 "CG": {
  "name": "Carlyle",
  "color": "#16A34A",
  "period": "2Q26",
  "periodEnd": "Jun 30, 2026",
  "disclosure": "Net carry per fund (10-Q fund metrics table)",
  "compType": "disclosed",
  "compNote": "Net disclosed per fund. ~63% implied comp (net $2,415M / gross $6,608M). Clawback $(92)M.",
  "segments": [
   {
    "label": "Corporate Private Equity",
    "funds": [
     {
      "name": "CP VII",
      "vintage": "2018",
      "net": 256,
      "note": "↓ from $409M 1Q26 — lower public marks, pref. return (stepdown Oct 2021)"
     },
     {
      "name": "CP VIII",
      "vintage": "2021",
      "net": 228
     },
     {
      "name": "CJP IV",
      "vintage": "2020",
      "net": 71,
      "note": "↓ from $121M 1Q26 — first carry realizations"
     },
     {
      "name": "CP VI",
      "vintage": "2013",
      "net": 71
     },
     {
      "name": "CGFSP III",
      "vintage": "2017",
      "net": 70
     },
     {
      "name": "CEOF II",
      "vintage": "2015",
      "net": 67
     },
     {
      "name": "CGP II",
      "vintage": "2020",
      "net": 52
     },
     {
      "name": "CEP IV",
      "vintage": "2014",
      "net": 40
     },
     {
      "name": "CETP IV",
      "vintage": "2019",
      "net": 38
     },
     {
      "name": "CGFSP II",
      "vintage": "2013",
      "net": 30
     },
     {
      "name": "CAP IV",
      "vintage": "2013",
      "net": 19
     },
     {
      "name": "CETP III",
      "vintage": "2014",
      "net": 15
     },
     {
      "name": "CP Growth",
      "vintage": "2021",
      "net": 14
     },
     {
      "name": "CP V",
      "vintage": "2007",
      "net": 12
     },
     {
      "name": "CJP III",
      "vintage": "2013",
      "net": 4
     },
     {
      "name": "CGP",
      "vintage": "2015",
      "net": 2
     },
     {
      "name": "All Other Active",
      "vintage": "Various",
      "net": 30
     },
     {
      "name": "Other / Rounding Adj.",
      "vintage": "Various",
      "net": -2,
      "note": "Residual to disclosed $1,017M"
     }
    ]
   },
   {
    "label": "Real Estate",
    "funds": [
     {
      "name": "CRP VIII",
      "vintage": "2017",
      "net": 59
     },
     {
      "name": "CRP VII",
      "vintage": "2014",
      "net": -34,
      "note": "Giveback (from $(28)M 1Q26)"
     },
     {
      "name": "CRP VI",
      "vintage": "2011",
      "net": 4
     },
     {
      "name": "All Other Active",
      "vintage": "Various",
      "net": 6
     }
    ]
   },
   {
    "label": "Infrastructure & Natural Resources",
    "funds": [
     {
      "name": "CGIOF",
      "vintage": "2018",
      "net": 90
     },
     {
      "name": "CIEP I",
      "vintage": "2013",
      "net": 80
     },
     {
      "name": "CIEP II",
      "vintage": "2019",
      "net": 69,
      "note": "↑ from $59M 1Q26"
     },
     {
      "name": "NGP XI",
      "vintage": "2014",
      "net": 58
     },
     {
      "name": "NGP XII",
      "vintage": "2017",
      "net": 40
     },
     {
      "name": "CRSEF II",
      "vintage": "2022",
      "net": 27,
      "note": "New fund"
     },
     {
      "name": "NGP XIII",
      "vintage": "2023",
      "net": 12,
      "note": "New fund"
     },
     {
      "name": "All Other Active",
      "vintage": "Various",
      "net": 49
     },
     {
      "name": "Other / Rounding Adj.",
      "vintage": "Various",
      "net": 0,
      "note": "Residual to disclosed $425M"
     }
    ]
   },
   {
    "label": "Global Credit (Carry Funds)",
    "funds": [
     {
      "name": "CCOF II",
      "vintage": "2020",
      "net": 99
     },
     {
      "name": "All Other Active",
      "vintage": "Various",
      "net": 112
     },
     {
      "name": "CCOF III-Levered",
      "vintage": "2023",
      "net": 36,
      "note": "New fund"
     },
     {
      "name": "CCOF I",
      "vintage": "2017",
      "net": 30
     },
     {
      "name": "SASOF III",
      "vintage": "2014",
      "net": 6
     }
    ]
   },
   {
    "label": "Carlyle AlpInvest",
    "funds": [
     {
      "name": "ASF VII (incl. SMAs)",
      "vintage": "2020",
      "net": 161,
      "note": "Secondaries"
     },
     {
      "name": "ASF VI (incl. SMAs)",
      "vintage": "2017",
      "net": 106,
      "note": "Secondaries"
     },
     {
      "name": "ASF VIII",
      "vintage": "2024",
      "net": 76,
      "note": "Secondaries; ↑ from $59M 1Q26"
     },
     {
      "name": "ASPF II",
      "vintage": "2023",
      "net": 15,
      "note": "Secondaries"
     },
     {
      "name": "ASF V (incl. SMAs)",
      "vintage": "2012",
      "net": 11,
      "note": "Secondaries"
     },
     {
      "name": "AAF II",
      "vintage": "2025",
      "net": 6,
      "note": "Secondaries; new to table"
     },
     {
      "name": "Other Secondaries",
      "vintage": "Various",
      "net": 41,
      "note": "Secondaries"
     },
     {
      "name": "ACF VII (incl. SMAs)",
      "vintage": "2017",
      "net": 93,
      "note": "Co-Investments"
     },
     {
      "name": "Strategic SMAs",
      "vintage": "Various",
      "net": 80,
      "note": "Co-Investments"
     },
     {
      "name": "ACF VIII (incl. SMAs)",
      "vintage": "2021",
      "net": 27,
      "note": "Co-Investments; ↓ from $50M 1Q26 — preferred return"
     },
     {
      "name": "ACF IX (incl. SMAs)",
      "vintage": "2023",
      "net": 12,
      "note": "Co-Investments"
     },
     {
      "name": "Other Co-Invests",
      "vintage": "Various",
      "net": 4,
      "note": "Co-Investments"
     },
     {
      "name": "Primary SMAs (all)",
      "vintage": "2009–26",
      "net": 25,
      "note": "Primary Investments"
     },
     {
      "name": "Other / Rounding Adj.",
      "vintage": "Various",
      "net": -2,
      "note": "Residual to disclosed $655M"
     }
    ]
   }
  ]
 },
 "APO": {
  "name": "Apollo",
  "color": "#DB2777",
  "period": "2Q26",
  "periodEnd": "Jun 30, 2026",
  "disclosure": "Perf. fees receivable per fund (unconsolidated, 10-Q)",
  "compType": "disclosed",
  "compNote": "Gross = unconsolidated perf. fees receivable. Net of ~54% profit sharing (fund nets pro-rata to disclosed total $1,511M). GP obligations $163M.",
  "segments": [
   {
    "label": "Private Equity",
    "funds": [
     {
      "name": "Fund IX",
      "vintage": "2017",
      "gross": 918,
      "net": 424,
      "note": "↓ from $1,009M 1Q26 — MTT/consumer markdowns"
     },
     {
      "name": "Fund X",
      "vintage": "2023",
      "gross": 542,
      "net": 250,
      "note": "↑ from $449M 1Q26"
     },
     {
      "name": "Fund VIII",
      "vintage": "2013",
      "gross": 132,
      "net": 61,
      "note": "↑ from $2M 1Q26 — Q2 mark-up; still in escrow"
     },
     {
      "name": "Fund VI",
      "vintage": "2006",
      "gross": 43,
      "net": 20
     },
     {
      "name": "Fund VII",
      "vintage": "2008",
      "gross": 0,
      "net": 0,
      "note": "No receivable"
     }
    ]
   },
   {
    "label": "Hybrid / Real Assets",
    "funds": [
     {
      "name": "HVF II",
      "vintage": "2021",
      "gross": 220,
      "net": 102
     },
     {
      "name": "Bridge Funds",
      "vintage": "Various",
      "gross": 95,
      "net": 44,
      "note": "↓ from $123M 1Q26"
     },
     {
      "name": "HVF I",
      "vintage": "2017",
      "gross": 70,
      "net": 32
     },
     {
      "name": "EPF Funds",
      "vintage": "Various",
      "gross": 52,
      "net": 24
     },
     {
      "name": "ANRP I, II & III",
      "vintage": "Various",
      "gross": 47,
      "net": 22,
      "note": "↓ from $62M 1Q26 — realizations; GP obligation $28M"
     },
     {
      "name": "HVF III",
      "vintage": "2024",
      "gross": 36,
      "net": 17,
      "note": "New fund; ↑ from $7M 1Q26"
     },
     {
      "name": "AIOF I, II & III",
      "vintage": "Various",
      "gross": 22,
      "net": 10
     },
     {
      "name": "Freedom Parent Hdg.",
      "vintage": "Various",
      "gross": 15,
      "net": 7
     }
    ]
   },
   {
    "label": "Credit / Insurance",
    "funds": [
     {
      "name": "Redding Ridge Hldgs",
      "vintage": "Various",
      "gross": 231,
      "net": 107
     },
     {
      "name": "FCI Funds",
      "vintage": "Various",
      "gross": 89,
      "net": 41
     },
     {
      "name": "Accord & Accord+",
      "vintage": "Various",
      "gross": 76,
      "net": 35
     },
     {
      "name": "Credit Strategies",
      "vintage": "Various",
      "gross": 56,
      "net": 26
     },
     {
      "name": "MidCap FinCo",
      "vintage": "Various",
      "gross": 38,
      "net": 17
     },
     {
      "name": "Athora",
      "vintage": "Various",
      "gross": 0,
      "net": 0,
      "note": "↓ from $5M 1Q26"
     }
    ]
   },
   {
    "label": "Other / S3 / Co-invest",
    "funds": [
     {
      "name": "Other Strategies / SIAs",
      "vintage": "Various",
      "gross": 574,
      "net": 265,
      "note": "Incl. S3, misc credit, SIAs"
     },
     {
      "name": "Champ L.P.",
      "vintage": "Various",
      "gross": 16,
      "net": 7,
      "note": "Co-investment vehicle"
     }
    ]
   }
  ],
  "netAllocated": true
 }
},
};

// ── Transcript-vs-PitchBook exit reconciliation (Carry tab). For each firm, the last 2 earnings calls
//    (S&P Global) vs PitchBook exits in the same window. verdict: Match | Partial | Diverge.
window.ALTS.exitRecon = {
  "BX": {
    "verdict": "Partial",
    "transcripts": [
      "Q4 2025 — Jan 29, 2026",
      "Q1 2026 — Apr 23, 2026",
      "Q2 2026 — Jul 23, 2026"
    ],
    "pbExits": "From 1 Apr: 13 exits, ~$9.2B disclosed TV (2Q: 5 / $2.5B, Rover $1.6B largest; 3Q QTD: 8 / $6.8B, Cirsa $3.2B, Jersey Mike's IPO $1.0B, NIBC $1.0B). Prior window (4Q25-1Q26): 18 / ~$46.4B incl. Wiz.",
    "note": "On the Q2 call management described realizations by type, not by name. Only Rover Pipeline (natural-gas pipeline) and the US IPO launched that week (Jersey Mike's) can be matched in exits.js. The rest of the named Q2 activity is absent: the multibillion-dollar data-center stake sale, Sabre Industries (transmission structures, majority sold to TPG), a Europe-based environmental services firm and the stock sale in an energy-solutions company. The $7B-EV Aypa Power sale to Brookfield was signed 22 Jul and is still pending. PB also shows $6.8B of 3Q exits while the 22 Sep 8-K put gross QTD realization revenue at only >$350M, so PB exit value is not a guide to carry.",
    "points": [
      "MATCH (likely): Rover Pipeline ($1.6B secondary, 29 Apr) = the 'natural gas pipeline' realization named on the Q2 call",
      "MATCH: Jersey Mike's IPO ($1.0B, 31 Jul) = the 'significant IPO in the U.S.' launched the week of the call",
      "MISS: Data-center stake sale at a 'multibillion-dollar gain' (first realization cited by Chae), not in exits.js",
      "MISS: Sabre Industries (TPG majority stake, ~$3.5B, closing by 2Q), the stock sale in an energy-solutions company and the Europe-based environmental services exit, none in exits.js; the Liftoff IPO (Jun) was primary-only",
      "TIMING: Aypa Power ($7B EV / $3B equity to Brookfield) signed 22 Jul, pending regulatory approval, so not yet a PB exit",
      "DIVERGE: 3Q QTD PB exits $6.8B disclosed (8 deals, 7 sized) vs the 8-K prelim of >$350M gross realized perf rev + PII (1 Jul-22 Sep); mgmt guided 3Q down sequentially (Jul call and Barclays)"
    ]
  },
  "KKR": {
    "verdict": "Partial",
    "transcripts": [
      "Q4 2025 — Feb 5, 2026",
      "Q1 2026 — May 5, 2026",
      "Q2 2026 — Jul 30, 2026"
    ],
    "pbExits": "From 1 Apr: 16 exits, ~$30.5B disclosed TV (2Q: 5 / $8.1B, OneStream $6.4B; 3Q QTD: 11 / $22.4B, USI $17.0B signing on 31 Aug, CoolIT $4.75B). Prior window (4Q25-1Q26): 8 / ~$14.6B.",
    "note": "The Q2 release (p.21) and call named 8 closed and 4 announced deals. exits.js confirms OneStream and Kokusai (closed), CoolIT (announced; PB 2 Jul, so it lands in Q3) and USI (PB dates the 31 Aug signing; close is 4Q). Most of the named Q2 realizations are missing: Hyundai Marine Solutions (7.5x), BrightSpring (6.2x partial), OHB (IPO + secondary), MasOrange, the GMR IPO (in exits.js only under ARES), Viridor and CIRCOR aerospace. PB also carries deals KKR did not name, plus three Q3 bankruptcies. The >$750M QTD prelim ('public secondary sales and strategic transactions') is consistent with CoolIT plus the Q3 secondaries PB shows (Livspace, Nordic Bioscience, First Gen).",
    "points": [
      "MATCH: OneStream (PB 1 Apr, $6.4B) = 2Q sale at 4.5x cost; Kokusai Electric (PB 20 May secondary, $958M) = 'final sale, 20.0x'",
      "MATCH: CoolIT (announced, ~15x; PB 2 Jul, $4.75B) and USI (PB 31 Aug, $17B; ~6x 2017 equity, 4Q close), both Q3/Q4 realizations",
      "MISS: Hyundai Marine Solutions final sale, BrightSpring partial sale, OHB IPO, MasOrange sale and an unnamed 2021 PE sale, none in exits.js KKR records",
      "MISS: Announced-not-closed Viridor (~2x), CIRCOR aerospace ($2.55B) and an unnamed 2021 infra asset absent; GMR IPO appears only under ARES in exits.js",
      "PB-ONLY: Axius Water ($700M), Hipoges, Corel, J.B. Chemicals, Livspace, LEAP India IPO, Ocean Yield, First Gen, Nordic Bioscience; bankruptcies Accell, Gamma Biosciences, Joulon",
      "TONE: 'Largest monetization quarter in our history' (2Q); Q3 guided ~$700M, and the 25 Sep release shows >$750M QTD ex-USI"
    ]
  },
  "APO": {
    "verdict": "Partial",
    "transcripts": [
      "Q4 2025 — Feb 9, 2026",
      "Q1 2026 — May 6, 2026",
      "Q2 2026 — Aug 4, 2026"
    ],
    "pbExits": "From 1 Apr: 6 exits, ~$14.8B disclosed TV (2Q: 4 / $7.4B, Invited Clubs $3.0B, NSI Industries $3.0B, Sun Country $1.4B; 3Q QTD: 2 / $7.4B, Concord Music $7.0B, Great Bay Renewables $0.4B). Prior window (4Q25-1Q26): 10 / ~$8.3B.",
    "note": "The Q2 call named no PE exits. Asked about 'slow' monetizations, Zelter called PII the most volatile line and said to judge it over 12-16 months; the only realization cited was the Intel repayment at Athene (~$700M GAAP gain), a credit event rather than a PB exit. PII fell to $16M in 2Q from $75M in 1Q even though PB logs $7.4B of 2Q exits (two of the four flagged minority). The 3Q PB exits (Concord Music $7.0B, minority; Great Bay Renewables) have not been referenced by management. No Q3 monetization prelim has been published.",
    "points": [
      "DIVERGE: 2Q PII $16M (1Q $75M) vs PB 4 exits / $7.4B (Invited Clubs, NSI Industries, Sun Country, Sapphire Gas); Zelter: PII is the 'most volatile' line, judge over 12-16 months",
      "UNNAMED: No exits named on the Q2 call; Intel repayment (~$700M realized gain in Athene GAAP) is not a PB exit event",
      "GAP: 3Q PB exits Concord Music ($7.0B M&A, 1 Sep, minority) and Great Bay Renewables ($390M, 10 Jul) not referenced by mgmt",
      "TONE: Kleinman (Barclays 14 Sep): 2017-22 vintages are being monetized 'in real time', supporting the Fund XI raise",
      "STRUCTURE: Earnings rest on FRE/SRE; PE carry runs through volatile PII, so PB exit value maps weakly to reported earnings"
    ]
  },
  "ARES": {
    "verdict": "Partial",
    "transcripts": [
      "Q4 2025 — Feb 5, 2026",
      "Q1 2026 — May 1, 2026",
      "Q2 2026 — Jul 31, 2026"
    ],
    "pbExits": "From 1 Apr: 8 exits, ~$0.7B disclosed TV, 6 of 8 undisclosed (2Q: 2 / $0.48B, GMR IPO; 3Q QTD: 6 / $0.24B, Savers Value Village secondary). Prior window (4Q25-1Q26): 19 / ~$22.75B.",
    "note": "The Q2 call named no realizations. Management reported ~$51M of 2Q realized net performance income (the 10 Jul 8-K prelim said >$50M) and guided only ~$10M for 3Q while keeping full-year expectations, so the European-style carry is back-end loaded into 4Q. exits.js shows small, mostly undisclosed exits that management has not referenced. X-energy, highlighted on the Q1 call, is still absent, and the GMR IPO sits under ARES although it is also a KKR holding (KKR lists it among 2Q IPOs). PB exit flow says little about Ares' credit-driven realizations.",
    "points": [
      "UNNAMED: No realizations named on the Q2 call; 2Q realized net performance income ~$51M, 3Q guided ~$10M, FY expectations unchanged",
      "MISS: X-energy IPO (celebrated on the Q1 call, priced late April) still not in exits.js",
      "PB-ONLY: GMR IPO ($479M, 13 May; PB flags Ares as minority, also a KKR holding), Teasdale Foods, Repairify, Novotel London Greenwich, PFL, Genomatica, Savers Value Village secondary ($236M, 13 Aug, majority), Vivantadental, none referenced by mgmt",
      "STRUCTURE: Realized performance income is mostly European-style credit carry, paid on full capital return, so PB exit events map weakly to Ares RI",
      "TONE: Arougheti (Barclays 16 Sep): pipeline ~20% above the prior record and deal activity 'picking up'; no change to realization guidance"
    ]
  },
  "BAM": {
    "verdict": "Partial",
    "transcripts": [
      "Q2 2026 (Aug 5, 2026)",
      "Q1 2026 (May 8, 2026)",
      "Q4 2025 (Feb 4, 2026)"
    ],
    "pbExits": "1 exit since 1 Apr 2026: Q2 0; Q3 QTD 1 (World Square offices 50% stake sold to Centuria Capital, 7 Jul 2026, $313.8M)",
    "note": "Management reported $11B of Q2 monetizations and named a July partial IPO sell-down of a data-center platform (>$1B), a signed sale of a specialized engineering firm and a post-quarter sale of a stake in an Australian alternative asset manager. PitchBook's BAM entity shows none of these, only the Brookfield fund's A$454M sale of half of Sydney's World Square offices to Centuria. The structural gap remains (exits sit under funds and listed affiliates), so direction matches but coverage does not. Verdict stays Partial.",
    "points": [
      "Q2 2026: deployed $21B and monetized $11B, 'particularly evident in real estate'; >$10B of transactions announced or under contract; volumes to keep building in 2H.",
      "Q2 release: July partial monetization of a data-center infrastructure platform via IPO (>$1B proceeds); agreed sale of a specialized engineering firm (PE); post-quarter sale of a stake in an Australian alternative asset manager.",
      "PitchBook Apr-Sep 2026: a single record, World Square offices (680 George St / 50 Goulburn St) 50% stake to Centuria Capital, 7 Jul 2026, $313.8M (A$454M), which matches press reports of the Brookfield-fund sale.",
      "Investor Day (17 Sep): monetizations have tripled in five years to '$90 billion for the last 12 months' (broader Brookfield basis) and 2026 will be a record; energy expects its best year ever for asset sales.",
      "Coverage gap: PitchBook's BAM entity does not capture fund/affiliate-level sales (e.g. the data-center IPO), so it can neither confirm nor contradict management's monetization totals."
    ]
  },
  "CG": {
    "verdict": "Partial",
    "transcripts": [
      "Q2 2026 (Aug 5, 2026)",
      "Q1 2026 (May 7, 2026)",
      "Q4 2025 (Feb 6, 2026)"
    ],
    "pbExits": "10 exits since 1 Apr 2026: Q2 2 (~$54M disclosed TV: Liderman $53.5M, Atmas Health n/d); Q3 QTD 8 (~$5.26B disclosed TV, led by Copia Power $2.6B)",
    "note": "Q2 realized proceeds were $6.7B from carry funds ($3.9B in GPE). Management named Vantage Group (CP VII/CGFSP III), Rigaku and Iwasaki Electric (CJP IV), and none of the three is in PitchBook's Q2 window, which holds only 2 small exits. Q3-to-date lines up better: PitchBook has the announced Copia Power sale to EQT ($2.6B), the iC Consult sale to Bridgepoint ($491M) and a Rigaku sell-down ($702M), consistent with 'several announced transactions already closed in July'. Verdict stays Partial because PitchBook lags and under-captures Japan, financial-services and block-sale realizations.",
    "points": [
      "Q2 2026: carry-fund realized proceeds $6.7B ($36.8B LTM); named exits Vantage Group Holdings (CP VII/CGFSP III), Rigaku and Iwasaki Electric (CJP IV); realized net performance revenues $115M (CJP IV's first carry, CP VI, CCOF II).",
      "Q2 call: 'several announced transactions already closed in July or expected to close over the next few quarters'; 3Q seasonally lighter; US buyout returned 23% of fair value over the LTM.",
      "PitchBook Q2 (Apr-Jun): only Liderman ($53.5M) and Atmas Health (n/d), so it misses all three exits management cited.",
      "PitchBook Q3 QTD (to 26 Sep): Copia Power $2.6B (EQT deal announced 9 Jul), Hurst Point $786M, Rigaku secondary $702M, Tescan $678M, iC Consult $491M (Bridgepoint deal announced 27 Apr), plus KAP, Quest Global IPO and AmbioPharm (n/d).",
      "Q1 2026 context: >$12B realizations (Medline, StandardAero, CommScope in CP VII) but only $21M net realized performance revenue, because the exits were in funds not yet paying carry; CP VII net accrued carry fell to $256M in Q2 (net IRR 8%)."
    ]
  },
  "TPG": {
    "verdict": "Match",
    "transcripts": [
      "Q2 2026 (Aug 4, 2026)",
      "Q1 2026 (May 1, 2026)",
      "Q4 2025 (Feb 5, 2026)"
    ],
    "pbExits": "7 exits since 1 Apr 2026: Q2 2 (~$300M disclosed TV: Avalyn Pharma IPO $300M, Infinidat n/d); Q3 QTD 5 (~$1.25B disclosed TV: Manipal Health IPO $967M, Dr Agarwal's Eye Hospital secondary $209M, Blackline Midstream $77M, Genomatica and Livspace n/d)",
    "note": "Management called Q2 a slower exit quarter: $5.1B of realizations and $35M of realized PRE, with the macro backdrop 'temporarily' delaying exits. It expects exits to accelerate toward year-end, and by mid-September said August-September activity had picked up. PitchBook matches that pattern: 2 minor Q2 exits, then a Q3 cluster in India/Asia. That includes the India IPO management said it had 'just priced' (Manipal Health, $967M) and an Asia secondary (Dr Agarwal's). The named signed deals (Made Group to Danone; a large Tokyo hotel) have not yet closed, so their absence from PitchBook is expected.",
    "points": [
      "Q2 2026: $5.1B realized ($13.8B YTD, +28% vs 1H25); realized PRE $35M from TDM (digital media CV), TPG VII, Net Lease Realty III and MMDL V; PRE to 'step up toward the end of the year and into 2027'.",
      "Q2 call named exits: Made Group (TPG Capital Asia) sale to Danone; agreed sale of a large Central Tokyo luxury hotel (Asia RE, its largest deal); an India IPO 'just priced' (17 India IPOs in 5 years); climate monetizations flagged for the next 3-6 months.",
      "PitchBook Q2 (Apr-Jun): Avalyn Pharma IPO ($300M) and Infinidat (M&A, n/d), neither named by management, consistent with a light Q2.",
      "PitchBook Q3 QTD (to 26 Sep): Manipal Health IPO ($967M, 5 Aug) matches the India IPO; Dr Agarwal's secondary ($209M), Blackline Midstream ($77M), Genomatica and Livspace (n/d). Made Group and the Tokyo hotel are not yet recorded.",
      "Barclays (15 Sep): CFO cited 'pickup in activity and dialogue... through August and September'. Separately, press (11 Sep) reported TPG exploring a ~$5B sale of Lyric."
    ]
  },
  "PGHN": {
    "verdict": "Partial",
    "transcripts": [
      "H1 2026 (2026-09-01)",
      "FY2025 (2026-03-10)"
    ],
    "pbExits": "5 exits since Jan-2026, ~$13.5B disclosed TV; Q3 holds $12.6B (Żabka $8.6B, atNorth $4.0B)",
    "note": "H1'26 realizations were $9.4B (fund-level) against only 3 PB exits and $0.9B of disclosed TV. PB misses the listed sell-downs management named (Vishal Mega Mart, Galderma), which fits its 'timing-driven lower directs exit activity' message. The flagged H2 pickup shows in PB: atNorth completed in Sep and the Żabka tender irrevocables were signed 31 Jul (completion by Dec). The FY2025 call's 2025 exits had matched PB.",
    "points": [
      "atNorth: agreed sale named 15 Jul (2.5x, >30% IRR) → PB $4,000M 2026-09-01; sale to CPP Investments/Equinix completed Sep (MATCH)",
      "Żabka: PG (invested 2019) and CVC signed irrevocables into Couche-Tard's PLN 32.62B (~$8.6B) tender on 31 Jul → PB $8,609M 2026-07-31 (MATCH on signing; completion expected by Dec 2026)",
      "GAP: the Vishal Mega Mart and Galderma public sell-downs (named 15 Jul) are absent from PB's PGHN feed",
      "PB-only: Sirion $900M (2026-02-18), Nozomi Networks (2026-01-29, n/d) and Ararat Wind Farm (2026-03-06, n/d) were not named on either call",
      "TONE: H1 performance income 19% of revenues; FY guide cut to ~20-25% with one large exit that may slip to H1'27; Meister expects 'a number of really nice exits' in the next 6-12 months",
      "FY2025 call (Mar'26): the named 2025 exits (AmSurg, Klarna IPO, Vermaat, Apex Logistics) matched PB 2025 records"
    ]
  },
  "EQT": {
    "verdict": "Partial",
    "transcripts": [
      "Q1 2026 (2026-04-22)",
      "H1 2026 (2026-07-17)"
    ],
    "pbExits": "6 exits in Jan-Jun 2026, ~$8.0B disclosed TV (Galderma $6.3B); no PB records dated Q3 2026",
    "note": "H1'26 fund exits were €7B (plus €9B realized for co-investors, per the H1 report) against PB's 6 exits and $8.0B of TV. TV is deal-level and includes co-investors, so it is not like-for-like. PB captures all four listed sell-downs management named but none of the infra minority sales, Tubulis or the Ventures I continuation vehicle. Q3 signed exits (Quantios, Ontinue) are not yet in PB.",
    "points": [
      "Galderma: final sell-down 13 Mar (CHF 4.9B placement, EQT VIII c.CHF 1.3B) → PB $6,325M 2026-03-13 (MATCH)",
      "Azelis (EQT VIII) → PB $225M 2026-02-26; Enity (EQT VII) → PB $83M 2026-05-11; Beijer Ref (EQT IX) → PB $437M 2026-06-16 (all MATCH)",
      "Dellner Couplers: named on the Q1'26 call → PB $960M 2026-02-10 (MATCH); Fotocasa: PB 2026-03-02, size n/d, not named on either call",
      "GAP: Nordic Ferry Infrastructure minority (Infra V), EdgeConneX minority (Infra IV/V to the AI Infra fund), Tubulis (LSP 7) and the Ventures I multi-asset CV were named in H1 but are absent from PB",
      "TONE: ~€20B FY exit ambition kept despite a slower H1; H2 pipeline includes a couple of IPOs and minority stake sales, more infra-weighted than 2025",
      "Q3 QTD: no PB EQT exits; announced Quantios sale to Vista (29 Jul) and Ontinue sale to Quorum Cyber (16 Sep) are signed, not closed; EQT Real Estate IVF V completed Midwest (17 Aug) and Southeast (27 Aug) logistics portfolio sales"
    ]
  },
  "CVC": {
    "verdict": "Partial",
    "transcripts": [
      "H1 2026 (2026-07-30)",
      "FY2025 (2026-03-11)"
    ],
    "pbExits": "5 exits since Jan-2026, ~$12.2B disclosed TV (Żabka $8.6B in Q3, Naturgy $3.6B in Q2)",
    "note": "H1'26 signed realisations of €11.5B (LTM €23.8B) against 2 PB exits and $3.6B of disclosed TV (Naturgy). Of the four H1 exits CVC named, only Naturgy is in PB. Q3 PB already carries Żabka ($8.6B on the 31 Jul tender signing) plus Icario and Fast Logistics (sizes n/d); the D-Marin sale to InfraVia (6 Jul) is not yet in PB.",
    "points": [
      "Naturgy (Fund VII, named H1) → PB $3,587M 2026-05-26 (MATCH)",
      "GAP: Syntegon (Fund VII), Rayner (Fund VIII) and WWEX Group (Fund VIII/Growth II), named as notable H1 exits, are absent from PB",
      "Żabka: CVC irrevocable to tender into Couche-Tard's PLN 32.62B (~$8.6B) offer, 31 Jul (completion by Dec) → PB $8,609M 2026-07-31 (MATCH on signing; Q3)",
      "D-Marin: sale to InfraVia agreed 6 Jul → not in PB (signed, not closed)",
      "PB-only: Vitech Systems (2026-01-08), Fast Logistics (2026-08-26) and Icario (2026-09-03), all size n/d, not named on the calls",
      "TONE: H1 realisations +19% YoY; FY guided 'broadly similar' to 2025 (~€21.9B), implying a softer H2; some signed Fund VII exits await regulatory approval, so PRE is H2-weighted"
    ]
  },
  "ICG": {
    "verdict": "Partial",
    "transcripts": [
      "FY2026 (year ended Mar 31, 2026) (2026-05-21)",
      "H1 2026 (6m ended Sep 30, 2025) (2025-11-18)"
    ],
    "pbExits": "1 exit since Jan-2026 (PSB Academy $544M, Jan); none dated Feb-Sep 2026",
    "note": "FY2026 is still the latest results call; the 15 Jul Q1 FY27 trading update had no call, and H1 FY27 results are due 11 Nov. PB carries a single 2026 ICG exit, PSB Academy, which management named. Q1 FY27 realisations of $1.1B (Debt $0.7B, Real Assets $0.3B, SC&S $0.1B) left no trace in PB, consistent with ICG's credit-heavy mix, whose repayments are not equity exit events.",
    "points": [
      "PSB Academy: named on the FY2026 call → PB $544M 2026-01-12 (MATCH)",
      "With Intelligence: named FY2026 → PB $1,800M 2025-11-25 (MATCH, pre-2026)",
      "Q1 FY27 (Apr-Jun 2026): realisations $1.1B (LTM $6.7B) and FEAUM gross realisations $2.0B, with no names given → no PB records in the quarter",
      "GAP: debt repayments (Q1 FY27 Debt realisations $0.7B) are structurally absent from PB's equity exit feed",
      "Q3 QTD (Jul-Sep): no PB ICG exits and no company disclosure yet"
    ]
  },
  "BPT": {
    "verdict": "Partial",
    "transcripts": [
      "H1 2026 (2026-07-17)",
      "FY2025 (2026-03-12)"
    ],
    "pbExits": "5 exits since Jan-2026, ~$1.9B disclosed TV (Sun World $1.4B, Flexitallic $0.5B); 2 in Q3 (Helio, BDL II loan CV), sizes n/d",
    "note": "H1'26 returned a record €16.6B to LPs, of which Calpine was the bulk (around €4B ex-Calpine). PB's BPT feed has none of the ECP exits management named (Calpine, Cornerstone, Symmetry). It shows 3 PE exits with $1.9B of TV (Sun World, Flexitallic, Bartec) that the H1 materials did not name. In Q3, the €1.2B BDL II continuation vehicle (8 Sep) matches PB's 'Bridgepoint Credit (1.2B loan portfolio)' record. The 2025 PE-side exits had matched PB.",
    "points": [
      "GAP: Calpine (sale to Constellation closed Jan'26; ~$14B of H1 AUM divestments, part taken in Constellation shares) is absent from PB's BPT feed",
      "GAP: Cornerstone Generation (ECP V) and Symmetry Energy Solutions (4.4-6.4x alongside Calpine), plus Liberty Tire Recycling (cited 6 Aug), are not in PB, so ECP exits sit outside the BPT entity",
      "PB-only (PE): Sun World $1,425M (2026-03-13), Flexitallic $475M (2026-04-01) and Bartec (2026-03-31, Min, n/d), not named in the H1 materials",
      "BDL II: €1.2B of commitments moved to a Pantheon-led CV on 8 Sep → PB 'Bridgepoint Credit (1.2B loan portfolio)' 2026-09-08, size n/d (MATCH)",
      "Helio Intelligence: PB 2026-07-09 (Min, n/d), not named by management",
      "TONE: H2 exit pipeline 'strong'; 35% of the 50% Constellation tranche unlocked in 2026 was already sold by 17 Jul, with the remaining 15% and the 2027 lock-up tranche held"
    ]
  }
};
;(window.ALTS_FEEDS=window.ALTS_FEEDS||{}).fundraising={lab:"Fundraising",verb:"updated",asOf:"2026-09-26",through:"2Q26 / H1 2026 + announcements to date",src:"Company releases, calls and supplements; PitchBook fund profiles"};
;(window.ALTS_FEEDS=window.ALTS_FEEDS||{}).guidance={lab:"Guidance",verb:"updated",asOf:"2026-09-26",through:"2Q26 calls + September remarks / filings",src:"Company transcripts (S&P Global), filings and releases"};
;(window.ALTS_FEEDS=window.ALTS_FEEDS||{}).accrued={lab:"Accrued carry",verb:"from",asOf:"2026-06-30",extra:"2Q26 10-Qs",src:"Fund-level accrued carry tables in each firm's 2Q26 Form 10-Q"};
