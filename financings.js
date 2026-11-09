// financings.js — marquee, SIZED, fee-driving deals (window.ALTS_FINANCINGS).
// The Deployment tab's activity proxy is a deal COUNT, but transaction / capital-markets fees are
// driven by deal SIZE and financing intensity. This is the missing size signal: the large sponsor-led
// buyouts / take-privates / carve-outs / platforms each firm led in 2026 H1, sized from PitchBook deal
// records (deal size + new debt raised). Top fee-driving deals per quarter — not exhaustive.
//   deals[tk] = [ { company, date, q, size:$M|null, debt:$M|null, type, note } ]
// Source: PitchBook Premium (get_investor_investments -> get_company_deals; each deal confirmed on its
// deal profile). ARES excluded: no transaction-fee line — its deployment is credit origination, not
// deal-fee-driving. Note 'size' is the whole-deal value (consortium deals include partners' capital),
// so read it as fee-driving DEAL SCALE, not the manager's own check.
// Refreshed 2026-09-26: 2026 Q3 (quarter-to-date) fee-driving deals added with the same selection bar; H1 entries re-checked on PitchBook.
;(window.ALTS_FEEDS=window.ALTS_FEEDS||{}).financings={lab:"Fee-driver deals",asOf:"2026-09-26",src:"PitchBook deal records (size + new debt), lead/co-lead confirmed"};
;(function(){
  window.ALTS_FINANCINGS = {
   "asOf": "2026-09-26",
   "deals": {
    "BX": [
     {
      "company": "Williams Power Innovation JV",
      "date": "2026-07-13",
      "q": "2026 Q3",
      "size": 5340,
      "debt": null,
      "type": "JV",
      "note": "announced: BXCI-led $5.34B for 49% of 5 Williams power projects"
     },
     {
      "company": "Aeroplan (Air Canada)",
      "date": "2026-08-11",
      "q": "2026 Q3",
      "size": 1779.4,
      "debt": null,
      "type": "Secondary (stake)",
      "note": "announced: co-led w/ La Caisse; 25% of Aeroplan at C$10B val"
     },
     {
      "company": "MarineMax",
      "date": "2026-08-10",
      "q": "2026 Q3",
      "size": 1500,
      "debt": null,
      "type": "Take-private LBO",
      "note": "announced: $53/sh take-private via BX's Safe Harbor Marinas"
     },
     {
      "company": "Quantum Systems",
      "date": "2026-07-02",
      "q": "2026 Q3",
      "size": 1200,
      "debt": null,
      "type": "Late-stage VC",
      "note": "Co-led $1.2B Series D (Airbus, Advent); defense drones, $8B val"
     },
     {
      "company": "Futronic",
      "date": "2026-07-19",
      "q": "2026 Q3",
      "size": 720,
      "debt": null,
      "type": "Buyout LBO",
      "note": "announced: $720M LBO of Busan-based industrial parts maker"
     },
     {
      "company": "HSBC Australia home-loan book",
      "date": "2026-07-31",
      "q": "2026 Q3",
      "size": null,
      "debt": null,
      "type": "Carve-out (loan book)",
      "note": "announced: A$36B (US$25B) HSBC AU home-loan book; BXCI/TacOpps"
     },
     {
      "company": "Dresser Utility Solutions",
      "date": "2026-07-06",
      "q": "2026 Q3",
      "size": null,
      "debt": 650,
      "type": "Secondary buyout",
      "note": "announced: BXETP SBO, gas-utility products; $650M TLB/DDTL/RCF"
     },
     {
      "company": "Hologic",
      "date": "2026-04-07",
      "q": "2026 Q2",
      "size": 20503,
      "debt": 12050,
      "type": "Take-private LBO",
      "note": "BX/TPG/ADIA/GIC $79/sh take-private"
     },
     {
      "company": "CPP Investments LP Portfolio",
      "date": "2026-05-20",
      "q": "2026 Q2",
      "size": 2925,
      "debt": null,
      "type": "Secondaries",
      "note": "BX/Ardian buy 33-fund LP portfolio"
     },
     {
      "company": "Banamex",
      "date": "2026-05-01",
      "q": "2026 Q2",
      "size": 2500,
      "debt": null,
      "type": "Secondary (stake)",
      "note": "7-investor group buys 22.6% Citi stake"
     },
     {
      "company": "Optum UK (EMIS)",
      "date": "2026-03-13",
      "q": "2026 Q1",
      "size": 400,
      "debt": 404.95,
      "type": "Carve-out LBO",
      "note": "BX/TPG carve-out of Optum UK"
     },
     {
      "company": "Cyera",
      "date": "2026-01-08",
      "q": "2026 Q1",
      "size": 382,
      "debt": null,
      "type": "Late-stage VC",
      "note": "BX-led Series F, AI data security"
     },
     {
      "company": "AI Cloud Co (Alphabet/BX)",
      "date": "2026-05-18",
      "q": "2026 Q2",
      "size": null,
      "debt": 22000,
      "type": "JV",
      "note": "BX/Alphabet JV, ~$5B equity, AI data centers"
     },
     {
      "company": "Rowan Digital Infra",
      "date": "2026-03-31",
      "q": "2026 Q1",
      "size": null,
      "debt": 464,
      "type": "Growth recap",
      "note": "300MW hyperscale data-center campus"
     }
    ],
    "KKR": [
     {
      "company": "DCC Energy",
      "date": "2026-07-26",
      "q": "2026 Q3",
      "size": 7697.2,
      "debt": null,
      "type": "Take-private LBO",
      "note": "announced: co-led w/ ECP, 6,525p/sh; GBP5.75B (≈$7.7B); PB's $5,750M is the GBP figure"
     },
     {
      "company": "Integer Holdings",
      "date": "2026-08-03",
      "q": "2026 Q3",
      "size": 5700,
      "debt": 2450,
      "type": "Take-private LBO",
      "note": "announced: $127/sh take-private of medtech maker; $2.1B TLB+$350M RCF"
     },
     {
      "company": "Steadfast Group",
      "date": "2026-08-21",
      "q": "2026 Q3",
      "size": 5419.7,
      "debt": null,
      "type": "Take-private LBO",
      "note": "announced: A$7.7B scheme w/ Dragoneer, Amwins; AU insurance broker"
     },
     {
      "company": "A1 Garage Door Service",
      "date": "2026-09-02",
      "q": "2026 Q3",
      "size": 2000,
      "debt": null,
      "type": "Secondary buyout",
      "note": "announced: $2B SBO from Cortec; residential garage-door services"
     },
     {
      "company": "Medicover India",
      "date": "2026-08-06",
      "q": "2026 Q3",
      "size": 1387,
      "debt": null,
      "type": "Carve-out LBO",
      "note": "announced: EUR1.2B buy of Medicover's India hospitals (24 sites)"
     },
     {
      "company": "Thomson Reuters Global Print",
      "date": "2026-07-14",
      "q": "2026 Q3",
      "size": 500,
      "debt": null,
      "type": "Carve-out LBO",
      "note": "announced: 51% of TR global print business, ~$980M valuation"
     },
     {
      "company": "Enbridge Westcoast JV",
      "date": "2026-08-27",
      "q": "2026 Q3",
      "size": null,
      "debt": null,
      "type": "JV",
      "note": "announced: KKR-led w/ APO; C$2.7B for 29% of Westcoast gas pipeline"
     },
     {
      "company": "Helix Digital Infra",
      "date": "2026-06-10",
      "q": "2026 Q2",
      "size": 10000,
      "debt": null,
      "type": "Platform creation",
      "note": "$10B AI datacenter platform (Vistra, Nvidia, Kuwait)"
     },
     {
      "company": "Crowe",
      "date": "2026-06-10",
      "q": "2026 Q2",
      "size": 3000,
      "debt": null,
      "type": "Buyout LBO",
      "note": "$3B LBO of top-10 US accounting firm; closed 7 Aug"
     },
     {
      "company": "Exolum",
      "date": "2026-03-31",
      "q": "2026 Q1",
      "size": 2774.9,
      "debt": 1618.7,
      "type": "Secondary (stake)",
      "note": "19.87% of Spanish fuel-logistics from Macquarie"
     },
     {
      "company": "Vertical Bridge",
      "date": "2026-04-23",
      "q": "2026 Q2",
      "size": 1500,
      "debt": null,
      "type": "Growth",
      "note": "$1.5B US telecom towers; co-invest DigitalBridge"
     },
     {
      "company": "XCL Education",
      "date": "2026-02-22",
      "q": "2026 Q1",
      "size": 1300,
      "debt": null,
      "type": "Buyout LBO",
      "note": "$1.3B LBO of SE Asian K-12 operator"
     },
     {
      "company": "Techone",
      "date": "2026-01-16",
      "q": "2026 Q1",
      "size": null,
      "debt": 351.5,
      "type": "Secondary buyout",
      "note": "Dutch co; EUR300M unitranche term loan"
     },
     {
      "company": "Allfleet India",
      "date": "2026-05-06",
      "q": "2026 Q2",
      "size": 310,
      "debt": null,
      "type": "Buyout LBO",
      "note": "$310M LBO Indian fleet/EV mobility"
     },
     {
      "company": "Lionbridge",
      "date": "2026-02-02",
      "q": "2026 Q1",
      "size": null,
      "debt": 118.3,
      "type": "Secondary buyout",
      "note": "localization/translation services leader"
     }
    ],
    "APO": [
     {
      "company": "easyJet",
      "date": "2026-08-06",
      "q": "2026 Q3",
      "size": 7630.3,
      "debt": null,
      "type": "Take-private LBO",
      "note": "announced: Eagle Bidco (APO) GBP5.7B bid; PB dated 6/22 approach"
     },
     {
      "company": "Truist Auto Loan Portfolio",
      "date": "2026-09-15",
      "q": "2026 Q3",
      "size": 5200,
      "debt": null,
      "type": "Carve-out (loan book)",
      "note": "announced: $5.2B buy of Truist auto loans (headline said $5.5B)"
     },
     {
      "company": "Bayer LARC Business",
      "date": "2026-09-16",
      "q": "2026 Q3",
      "size": 3486.1,
      "debt": null,
      "type": "Carve-out",
      "note": "EUR3B carve-out from Bayer; APO-led, KKR minority co-investor"
     },
     {
      "company": "Emerald Holding",
      "date": "2026-07-14",
      "q": "2026 Q3",
      "size": 1503.5,
      "debt": 1240,
      "type": "Take-private LBO",
      "note": "$1.5B take-private of B2B events co from Onex; $1.24B TLB/RCF"
     },
     {
      "company": "Joint Venture (Apollo / Starwood REIT)",
      "date": "2026-08-03",
      "q": "2026 Q3",
      "size": 1020,
      "debt": null,
      "type": "JV",
      "note": "APO/Starwood Capital JV; $1.02B formation size per PitchBook"
     },
     {
      "company": "Cumberland Farms",
      "date": "2026-09-04",
      "q": "2026 Q3",
      "size": 500,
      "debt": null,
      "type": "Growth",
      "note": "announced: $500M convertible-preferred in EG Group's US retailer"
     },
     {
      "company": "Atlantic Aviation FBO",
      "date": "2026-08-27",
      "q": "2026 Q3",
      "size": null,
      "debt": null,
      "type": "Secondary buyout",
      "note": "co-control buy from KKR; $10B EV, deal size undisclosed in PB"
     },
     {
      "company": "Sumisho Air Lease",
      "date": "2026-04-08",
      "q": "2026 Q2",
      "size": 26980,
      "debt": null,
      "type": "Take-private",
      "note": "6-member consortium take-private of Japanese aircraft lessor"
     },
     {
      "company": "Orsted Hornsea 3",
      "date": "2026-02-12",
      "q": "2026 Q1",
      "size": 6156,
      "debt": null,
      "type": "Carve-out",
      "note": "Bought 50% of Orsted's UK offshore wind project"
     },
     {
      "company": "Kelvion",
      "date": "2026-01-12",
      "q": "2026 Q1",
      "size": 2345,
      "debt": 1020,
      "type": "Secondary buyout",
      "note": "EUR2B SBO of heat-exchanger maker from Triton"
     },
     {
      "company": "Atletico Madrid",
      "date": "2026-03-12",
      "q": "2026 Q1",
      "size": 1616,
      "debt": null,
      "type": "Buyout",
      "note": "EUR1.38B LBO for 55% of football club"
     },
     {
      "company": "Eagle Creek Renewables",
      "date": "2026-01-09",
      "q": "2026 Q1",
      "size": 1480,
      "debt": null,
      "type": "Buyout",
      "note": "$1.48B buyout of US hydro platform"
     },
     {
      "company": "McKesson Med-Surgical",
      "date": "2026-06-01",
      "q": "2026 Q2",
      "size": 1250,
      "debt": 5250,
      "type": "Carve-out",
      "note": "13% conv-pref in ~$9.6B carve-out; $5.25B acq debt"
     },
     {
      "company": "KME (Cunova)",
      "date": "2026-04-02",
      "q": "2026 Q2",
      "size": 347,
      "debt": 173,
      "type": "Buyout",
      "note": "EUR300M LBO, copper products"
     },
     {
      "company": "Grand Frais",
      "date": "2026-05-07",
      "q": "2026 Q2",
      "size": null,
      "debt": 399,
      "type": "Buyout",
      "note": "100% buyout of French fresh-grocery chain"
     }
    ],
    "CG": [
     {
      "company": "Camino Natural Resources (Oklahoma Assets)",
      "date": "2026-07-02",
      "q": "2026 Q3",
      "size": 1175,
      "debt": null,
      "type": "Carve-out LBO",
      "note": "$1.18B buy of OK oil/gas properties w/ Diversified Energy"
     },
     {
      "company": "Chungho Naice",
      "date": "2026-08-26",
      "q": "2026 Q3",
      "size": 725.3,
      "debt": null,
      "type": "Buyout LBO",
      "note": "~$725M buyout of Korean water-purifier maker; sole sponsor"
     },
     {
      "company": "Surventis (BASF Coatings)",
      "date": "2026-06-30",
      "q": "2026 Q2",
      "size": 5317,
      "debt": null,
      "type": "Carve-out LBO",
      "note": "BASF Coatings carve-out w/ QIA, EUR7.7B EV"
     },
     {
      "company": "Hogy Medical",
      "date": "2026-03-01",
      "q": "2026 Q1",
      "size": 903,
      "debt": null,
      "type": "Take-private",
      "note": "Tokyo-listed medical products take-private"
     },
     {
      "company": "Knack RCM + EqualizeRCM",
      "date": "2026-06-05",
      "q": "2026 Q2",
      "size": 600,
      "debt": null,
      "type": "Platform LBO",
      "note": "Healthcare revenue-cycle-mgmt roll-up"
     },
     {
      "company": "Q-Living JV",
      "date": "2026-02-25",
      "q": "2026 Q1",
      "size": 355,
      "debt": 213,
      "type": "JV",
      "note": "Spain residential RE JV; Carlyle 75%"
     },
     {
      "company": "Nido Home Finance",
      "date": "2026-02-10",
      "q": "2026 Q1",
      "size": 230,
      "debt": null,
      "type": "Secondary buyout",
      "note": "India housing-finance SBO from Edelweiss"
     },
     {
      "company": "KFC Korea",
      "date": "2026-04-17",
      "q": "2026 Q2",
      "size": 133,
      "debt": null,
      "type": "Secondary buyout",
      "note": "Korea KFC SBO; A Twosome Place bolt-on"
     }
    ],
    "TPG": [
     {
      "company": "Aseem Infrastructure Finance",
      "date": "2026-08-07",
      "q": "2026 Q3",
      "size": 521.1,
      "debt": null,
      "type": "Secondary buyout",
      "note": "SBO w/ ICICI, GIC; INR 5,000 Cr ($521M) India infra lender"
     },
     {
      "company": "Zembl",
      "date": "2026-07-15",
      "q": "2026 Q3",
      "size": 250,
      "debt": null,
      "type": "Buyout LBO",
      "note": "$250M (est.) buyout of Australian co; sole TPG sponsor"
     },
     {
      "company": "WellMed Optum Florida",
      "date": "2026-09-09",
      "q": "2026 Q3",
      "size": null,
      "debt": null,
      "type": "Carve-out LBO",
      "note": "carve-out of Optum's FL Medicare-Advantage physician group"
     },
     {
      "company": "Hologic",
      "date": "2026-04-07",
      "q": "2026 Q2",
      "size": 20503,
      "debt": 12050,
      "type": "Take-private LBO",
      "note": "Co-led w/ Blackstone, ADIA, GIC; medtech"
     },
     {
      "company": "OpenAI Deployment Co",
      "date": "2026-05-20",
      "q": "2026 Q2",
      "size": 4000,
      "debt": null,
      "type": "JV",
      "note": "$4B OpenAI enterprise JV; 15-investor club; closed 18 Aug"
     },
     {
      "company": "Sabre Industries",
      "date": "2026-04-30",
      "q": "2026 Q2",
      "size": 3475,
      "debt": 530,
      "type": "Secondary buyout",
      "note": "Bought from Blackstone; grid/utility equipment"
     },
     {
      "company": "Conservice",
      "date": "2026-02-25",
      "q": "2026 Q1",
      "size": 3450,
      "debt": 1460,
      "type": "Buyout LBO",
      "note": "Utility-mgmt/ESG data from Advent, TA"
     },
     {
      "company": "Learfield",
      "date": "2026-06-23",
      "q": "2026 Q2",
      "size": 2000,
      "debt": 1150,
      "type": "Secondary buyout",
      "note": "College sports media; $1.15B unitranche"
     },
     {
      "company": "ECHO Realty",
      "date": "2026-06-05",
      "q": "2026 Q2",
      "size": 2000,
      "debt": null,
      "type": "Buyout LBO",
      "note": "Grocery-anchored retail REIT; w/ PSP, Norges"
     },
     {
      "company": "Proficy",
      "date": "2026-03-02",
      "q": "2026 Q1",
      "size": 600,
      "debt": 730,
      "type": "Carve-out LBO",
      "note": "GE Vernova industrial software carve-out"
     },
     {
      "company": "ThingWorx",
      "date": "2026-03-16",
      "q": "2026 Q1",
      "size": 523,
      "debt": null,
      "type": "Carve-out LBO",
      "note": "PTC factory-software carve-out"
     }
    ]
   }
  };
})();
