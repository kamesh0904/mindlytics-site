/* Copies static assets from src/ into dist/. Run via: npm run assets */
const fs = require('fs');
const path = require('path');

/* src/favicon.svg is deliberately not copied. The tab icon is now generated
   from the real logo into src/img/ (see README), and Chrome and Firefox prefer
   an SVG icon whenever one is offered — shipping the old placeholder mark
   would quietly override the real one. */
const pairs = [
  ['src/site.js', 'dist/assets/js/site.js']
];

pairs.forEach(([from, to]) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log('  copied ' + to);
});

// Anything you drop in src/img/ (photos, og image) is copied to dist/assets/img/
if (fs.existsSync('src/img')) {
  fs.mkdirSync('dist/assets/img', { recursive: true });
  for (const f of fs.readdirSync('src/img')) {
    fs.copyFileSync(path.join('src/img', f), path.join('dist/assets/img', f));
    console.log('  copied dist/assets/img/' + f);
  }
}
