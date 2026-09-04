/* ============================================================
   Cache busting
   ------------------------------------------------------------
   Stamps the CSS and JS links with a hash of the file contents:

     assets/js/site.js  ->  assets/js/site.js?v=1a2b3c4d

   Without this a browser that has already fetched site.js keeps
   using its cached copy after a deploy, so returning visitors sit
   on old code indefinitely. The hash only changes when the file
   does, so unchanged assets still come from cache.

   Runs last, after the HTML, the copied JS and the compiled CSS
   all exist. Run with:  npm run stamp
   ============================================================ */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DIST = path.join(__dirname, 'dist');

const hashOf = rel => crypto
  .createHash('sha1')
  .update(fs.readFileSync(path.join(DIST, rel)))
  .digest('hex')
  .slice(0, 8);

const css = hashOf('assets/css/site.css');
const js = hashOf('assets/js/site.js');

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((all, e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return all.concat(htmlFiles(p));
    return e.name.endsWith('.html') ? all.concat(p) : all;
  }, []);
}

let stamped = 0;
htmlFiles(DIST).forEach(file => {
  const before = fs.readFileSync(file, 'utf8');
  // The optional ?v=... swallows any previous stamp, so re-running is a no-op.
  const after = before
    .replace(/(assets\/css\/site\.css)(\?v=[a-f0-9]+)?/g, `$1?v=${css}`)
    .replace(/(assets\/js\/site\.js)(\?v=[a-f0-9]+)?/g, `$1?v=${js}`);
  if (after !== before) {
    fs.writeFileSync(file, after);
    stamped++;
  }
});

console.log(`  stamped ${stamped} pages  css=${css}  js=${js}`);
