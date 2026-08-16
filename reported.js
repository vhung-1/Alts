// reported.js — REPORTED quarterly figures (window.ALTS_REPORTED) that the deal-activity
// proxies in the Carry (Realizations) and Deployment tabs are meant to ANTICIPATE.
//
// Thesis: PitchBook realization / deployment activity is observable INTRA-quarter (deal by deal,
// in near-real-time); the fees those activities generate only print weeks later on the earnings
// call. So realization activity is a leading proxy for reported net realized performance fees, and
// deployment cadence is a leading proxy for reported transaction / capital-markets fees. The
// REPORTED rows are the ground truth.
//
//   carry[tk][q]  = { perf: <net realized performance fees, $M>, real: <reported realizations $M | null> }
//   deploy[tk][q] = { fees: <transaction / capital-markets fees, $M>, deployed: <capital deployed $M | null> }
//
// Scope: core US quarterly reporters (BX, KKR, APO, ARES, CG, TPG); trailing 6 quarters
// 2025 Q1 -> 2026 Q2. Values in $M. Sources: S&P Global earnings-call transcripts (primary) +
// SEC 8-K earnings supplements (Ex-99.1/99.2). Metrics are non-GAAP and DIFFER BY FIRM: the
// exact line item used per firm is in `defs` (perf is comp-NET for every firm except where noted;
// realizations/fees are null where a firm doesn't disclose that line). Read each firm's rows as
// its OWN time series vs its OWN activity — not as a cross-firm dollar comparison.
;(function () {
  window.ALTS_REPORTED = {
    asOf: "2026-08-16",
    quarters: ["2025 Q1","2025 Q2","2025 Q3","2025 Q4","2026 Q1","2026 Q2"],
    defs: {"BX":{"perf":"Net Realizations (realized perf rev + realized principal-investment income − realized perf comp)","real":"Realizations (capital monetized, all strategies — far broader than the PitchBook equity-exit feed)","fees":"Transaction, advisory & other fees, net","deployed":"Capital deployed"},
            "KKR":{"perf":"Net Realized Performance Income (realized perf income − realized perf comp). Headline GROSS realized carried interest was 327/406/883/‒46/720/837; 4Q'25 hit by a ~10-yr carry clawback (−$207M).","real":"not disclosed as a dollar volume (KKR cites monetization revenue, not proceeds)","fees":"Capital Markets — transaction fees","deployed":"Capital invested (Asset Management segment)"},
            "APO":{"perf":"Principal Investing Income (Apollo's net realized PI-segment income; no standalone net-perf-fee line). GROSS realized perf fees were 190/219/201/588/357/130.","real":"not disclosed as a carry-monetization volume (AUM 'realization activity' is Athene/credit run-off)","fees":"Capital solutions fees & other, net (Apollo Capital Solutions)","deployed":"Gross capital deployment (incl. Athene/credit — much larger than the PitchBook equity-deal count)"},
            "ARES":{"perf":"Realized net performance income","real":"not disclosed as a dollar volume","fees":"no transaction/deal-fee line (Ares 'other fees' are property-mgmt, not deal-driven)","deployed":"Gross capital deployed (firm-wide)"},
            "CG":{"perf":"Realized net performance revenues (Total Segments)","real":"Realized proceeds (carry funds)","fees":"Transaction & portfolio advisory fees, net and other (incl. Global Capital Markets)","deployed":"Deployment (carry-fund invested capital + CLO + originations)"},
            "TPG":{"perf":"Realized performance allocations, net","real":"Realizations","fees":"Transaction, monitoring & other fees, net (as originally reported)","deployed":"Capital invested"}},
    carry: {
      "BX": {"2025 Q1":{"perf":357,"real":25486},"2025 Q2":{"perf":325.9,"real":23352},"2025 Q3":{"perf":504.8,"real":30598},"2025 Q4":{"perf":956.9,"real":46115},"2026 Q1":{"perf":448.4,"real":35908},"2026 Q2":{"perf":414.3,"real":31843}},
      "KKR": {"2025 Q1":{"perf":88,"real":null},"2025 Q2":{"perf":109,"real":null},"2025 Q3":{"perf":233,"real":null},"2025 Q4":{"perf":62,"real":null},"2026 Q1":{"perf":197,"real":null},"2026 Q2":{"perf":212,"real":null}},
      "APO": {"2025 Q1":{"perf":14,"real":null},"2025 Q2":{"perf":47,"real":null},"2025 Q3":{"perf":50,"real":null},"2025 Q4":{"perf":227,"real":null},"2026 Q1":{"perf":75,"real":null},"2026 Q2":{"perf":16,"real":null}},
      "ARES": {"2025 Q1":{"perf":41,"real":null},"2025 Q2":{"perf":16.5,"real":null},"2025 Q3":{"perf":9.3,"real":null},"2025 Q4":{"perf":102.2,"real":null},"2026 Q1":{"perf":75.3,"real":null},"2026 Q2":{"perf":50.9,"real":null}},
      "CG": {"2025 Q1":{"perf":127.4,"real":8600},"2025 Q2":{"perf":87.7,"real":7600},"2025 Q3":{"perf":19.1,"real":6100},"2025 Q4":{"perf":123.1,"real":11800},"2026 Q1":{"perf":20.5,"real":12200},"2026 Q2":{"perf":114.6,"real":6700}},
      "TPG": {"2025 Q1":{"perf":39.6,"real":4302},"2025 Q2":{"perf":87,"real":6500},"2025 Q3":{"perf":30.4,"real":7800},"2025 Q4":{"perf":47.6,"real":4800},"2026 Q1":{"perf":67.7,"real":8745},"2026 Q2":{"perf":35.4,"real":5100}}
    },
    deploy: {
      "BX": {"2025 Q1":{"fees":111.3,"deployed":36411},"2025 Q2":{"fees":165.7,"deployed":33080},"2025 Q3":{"fees":156.2,"deployed":26551},"2025 Q4":{"fees":149.6,"deployed":42170},"2026 Q1":{"fees":211.7,"deployed":35561},"2026 Q2":{"fees":321.2,"deployed":34175}},
      "KKR": {"2025 Q1":{"fees":229,"deployed":18974},"2025 Q2":{"fees":200,"deployed":17701},"2025 Q3":{"fees":276,"deployed":26100},"2025 Q4":{"fees":225,"deployed":31835},"2026 Q1":{"fees":224,"deployed":21772},"2026 Q2":{"fees":178,"deployed":24159}},
      "APO": {"2025 Q1":{"fees":154,"deployed":84000},"2025 Q2":{"fees":216,"deployed":90000},"2025 Q3":{"fees":212,"deployed":99000},"2025 Q4":{"fees":226,"deployed":113000},"2026 Q1":{"fees":246,"deployed":103000},"2026 Q2":{"fees":277,"deployed":111000}},
      "ARES": {"2025 Q1":{"fees":null,"deployed":31000},"2025 Q2":{"fees":null,"deployed":27000},"2025 Q3":{"fees":null,"deployed":41000},"2025 Q4":{"fees":null,"deployed":46000},"2026 Q1":{"fees":null,"deployed":32000},"2026 Q2":{"fees":null,"deployed":35900}},
      "CG": {"2025 Q1":{"fees":77.9,"deployed":11100},"2025 Q2":{"fees":47.9,"deployed":14600},"2025 Q3":{"fees":32.3,"deployed":11800},"2025 Q4":{"fees":67,"deployed":16900},"2026 Q1":{"fees":54.1,"deployed":10000},"2026 Q2":{"fees":110.5,"deployed":14300}},
      "TPG": {"2025 Q1":{"fees":54,"deployed":7346},"2025 Q2":{"fees":34.8,"deployed":10400},"2025 Q3":{"fees":38.1,"deployed":14900},"2025 Q4":{"fees":122.4,"deployed":19300},"2026 Q1":{"fees":73.9,"deployed":14373},"2026 Q2":{"fees":102.4,"deployed":13800}}
    },
  };
})();
