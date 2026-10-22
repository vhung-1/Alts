// Builds the single-file dashboard (dist/alts-tracker-artifact.html) from index.html and the data files:
// JSX is precompiled with Babel, React/ReactDOM are inlined from node_modules (same versions as the CDN tags in
// index.html), and every data file is inlined, so the page runs with no network access except for web fonts.
// Usage: (cd tools && npm install) && node tools/build_artifact.js [output path]
const fs = require("fs");
const path = require("path");
const Babel = require("@babel/standalone");

const ROOT = path.join(__dirname, "..");
const OUT = process.argv[2] || path.join(ROOT, "dist", "alts-tracker-artifact.html");
const DATA = ["data", "exits", "deploy", "ipos", "consensus", "flows", "reported", "financings"];

let h = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const need = (re, what) => { if (!re.test(h)) throw new Error(`index.html: ${what} not found`); };

const m = h.match(/<script type="text\/plain" id="appsrc">([\s\S]*?)<\/script>/);
if (!m) throw new Error("index.html: app source block not found");
const compiled = Babel.transform(m[1], { presets: [["react", { runtime: "classic" }]] }).code;

// the runtime Babel boot script is not needed once the JSX is precompiled (React's render replaces the loading message)
const BOOT = /\s*<script>\s*\/\/ Transpile the JSX above[\s\S]*?<\/script>/;
need(BOOT, "Babel boot script");
h = h.replace(BOOT, "");

const umd = (pkg, file) => fs.readFileSync(path.join(path.dirname(require.resolve(`${pkg}/package.json`)), "umd", file), "utf8");
need(/<script crossorigin src="https:\/\/cdn\.jsdelivr\.net\/npm\/react@[^"]+"><\/script>/, "React CDN tag");
h = h.replace(/<script crossorigin src="https:\/\/cdn\.jsdelivr\.net\/npm\/react@[^"]+"><\/script>/, () => "<script>" + umd("react", "react.production.min.js") + "</script>");
h = h.replace(/<script crossorigin src="https:\/\/cdn\.jsdelivr\.net\/npm\/react-dom@[^"]+"><\/script>/, () => "<script>" + umd("react-dom", "react-dom.production.min.js") + "</script>");
h = h.replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@babel\/standalone@[^"]+"><\/script>\n?/, "");
for (const n of DATA) {
  const re = new RegExp('<script src="' + n + '\\.js"><\\/script>');
  if (!re.test(h)) throw new Error(`index.html: <script src="${n}.js"> not found`);
  h = h.replace(re, () => "<script>" + fs.readFileSync(path.join(ROOT, n + ".js"), "utf8") + "\n</script>");
}
h = h.replace(/<script type="text\/plain" id="appsrc">[\s\S]*?<\/script>/, () => '<script id="appjs">' + compiled + "\n</script>");
// the artifact host supplies the document skeleton: strip it and keep a short title
h = h.replace(/^[\s\S]*?<head>/i, "").replace(/<\/head>\s*<body>/i, "").replace(/<\/body>\s*<\/html>\s*$/i, "");
h = h.replace(/<meta[^>]*>\s*/gi, "").replace(/<title>[\s\S]*?<\/title>\s*/i, "");
h = h.replace(/<!--\s*React \+ Babel via CDN[\s\S]*?-->\s*/i, "");
h = h.replace(/Loading Alts Tracker… \(needs network access for React\/fonts on first paint\)/, "Loading Alts Tracker…");
h = "<title>Alts Tracker</title>\n" + h.replace(/^\s*/, "");

const ext = (h.match(/<script[^>]+src=/g) || []).length;
if (ext) throw new Error(`${ext} external script tag(s) left in the build`);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, h);
console.log(`built ${OUT} (${(h.length / 1048576).toFixed(2)} MB, no external scripts)`);
