// Headless smoke test of the built dashboard: opens it in Chromium, clicks every tab and sub-view in SUBS, and fails on
// any page error or missing expected text. Usage: node tools/check.js [built html] [expected text ...]
// Expected-text checks are "Tab>Sub-view=text" (sub-view optional), e.g. "Carry=Q3'26 reported".
// Needs Playwright (falls back to the global install in the cloud container) and the build from build_artifact.js.
const path = require("path");
let chromium;
try { ({ chromium } = require("playwright")); }
catch { ({ chromium } = require(path.join(process.execPath, "..", "..", "lib", "node_modules", "playwright"))); }

const FILE = path.resolve(process.argv[2] || path.join(__dirname, "..", "dist", "alts-tracker-artifact.html"));
const EXPECT = process.argv.slice(3);
const TABS = ["Overview", "Fundraising", "Guidance", "Consensus", "Carry", "Deployment"];
const SUBS = {   // sub-view buttons per tab (keep in step with subTabs / VIEWS / the Carry toggle in index.html)
  Fundraising: ["In-Market Funds", "AUM Flows"],
  Consensus: ["By company", "Revisions", "Prints vs cons.", "Compare", "Valuation (P/DE)"],
  Carry: ["Realizations", "Net accrued carry"],
};
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

(async () => {
  const exe = process.env.CHROMIUM_PATH;
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error" && !/fonts\.(googleapis|gstatic)/.test(m.text() + " " + (m.location().url || ""))) errors.push("console: " + m.text() + " " + (m.location().url || "")); });
  await page.route(/^https?:\/\//, r => r.abort());          // the build must not need the network
  await page.goto("file://" + FILE);
  await page.waitForSelector("#root button", { timeout: 15000 });

  const click = async name => {
    const b = page.getByRole("button", { name: new RegExp("^" + esc(name) + "$", "i") }).first();
    if (!(await b.count())) throw new Error(`button "${name}" not found`);
    await b.click(); await page.waitForTimeout(150);
  };
  let views = 0;
  for (const t of TABS) {
    await click(t); views++;
    for (const s of SUBS[t] || []) { await click(s); views++; }
  }

  let fail = 0;
  for (const spec of EXPECT) {
    const [where, text] = spec.split("=");
    const [tab, sub] = where.split(">");
    await click(tab);
    if (sub) await click(sub);
    const body = await page.innerText("#root");
    const ok = body.includes(text);
    if (!ok) fail++;
    console.log(`${ok ? "ok  " : "FAIL"} ${where}: "${text}"`);
  }
  await browser.close();
  if (errors.length) { console.log(errors.join("\n")); fail += errors.length; }
  console.log(fail ? `${fail} problem(s)` : `clean: ${views} views rendered, no page errors`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
