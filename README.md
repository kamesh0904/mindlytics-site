# Mindlytics website

Static site, 9 pages plus a 404. No framework, no server needed. Every page is real HTML,
so search engines and link previews see the full content immediately.

---

## The short version

**To change any wording on the site, edit `src/content.js` and run `npm run build`.**
You never need to open an HTML file.

```bash
npm install      # once
npm run build    # regenerates everything into dist/
npm run serve    # preview at http://localhost:5173
```

Deploy the `dist/` folder. That's the whole site.

---

## Folder layout

```
build.js              Generates the HTML pages. Layout and markup live here.
copy-assets.js        Copies JS, favicon and images into dist/
stamp-assets.js       Adds ?v=<hash> to the CSS and JS links (cache busting)
tailwind.config.js    Colours, fonts, spacing
package.json          Scripts

src/
  content.js          ALL TEXT ON THE SITE. This is the file to edit.
  input.css           Tailwind source + custom animation CSS
  site.js             Page transitions, scroll motion, menu, contact form
  favicon.svg         Unused placeholder mark, kept for reference only
  img/                Generated tab icons, plus any photos you drop in

dist/                 GENERATED — never edit by hand, it gets overwritten
  index.html
  services.html
  about.html
  careers.html
  contact.html
  services/data-engineering.html
  services/cloud-platforms.html
  services/bi-dashboards.html
  services/advanced-analytics.html
  404.html
  robots.txt
  sitemap.xml
  assets/css/site.css
  assets/js/site.js
  assets/img/favicon.ico        tab icon (16/32/48 in one file)
  assets/img/favicon-16.png
  assets/img/favicon-32.png
  assets/img/favicon-180.png    home-screen icon on iOS
  assets/img/favicon-512.png    spare, for a web app manifest
```

---

## Common edits

**Change a heading, paragraph or button label**
Open `src/content.js`, find the text, change it, run `npm run build`.

**Change the phone number, email or address**
`src/content.js` → `site` block at the top. It updates the footer, the contact
page and the structured data everywhere at once.

**Add a service subpage**
In `src/content.js`, set `page: true` on one of the six services, then add a
matching entry under `servicePages` (copy an existing one as a template).
It appears in the nav dropdown, the footer and the services grid automatically.

**Add team photos**
Put the image in `src/img/`, then in `src/content.js` add a `photo` line:

```js
{ initials:'VVR', name:'Vishnu Vardhan Reddy', role:'Founder &amp; CEO',
  photo:'assets/img/vishnu.jpg' }
```

The initials placeholder is replaced automatically, and the "placeholder
portraits" note under the team disappears once every member has a photo.

**Change the tab icon**
The icons in `src/img/` were generated from `mainlogo.jpeg` in the project root:
the logo is not square, so it is cropped to a square centred on the mark, sized
so the mark fills about 74% of the frame, then resized. To redo it after a logo
change, re-run that crop and drop the results in `src/img/`.

Do not add a `favicon.svg` link back to the page. Chrome and Firefox prefer an
SVG icon whenever one is offered, so it would silently override the real logo.

---

## Making the contact form actually send

**Right now the form falls back to the visitor's email app.** Submitting opens
a new message to `info@mindlytics.co.in` with every field prefilled. That works
without any backend, but it depends on the visitor having a mail client set up,
and you never see the ones who give up. Set an endpoint to collect them properly
— the form switches to a real background POST the moment you do.

1. Sign up at [Formspree](https://formspree.io) or
   [Web3Forms](https://web3forms.com). Both have a free tier.
2. Copy the endpoint URL they give you.
3. Paste it into `src/content.js`:

```js
site: {
  formEndpoint: 'https://formspree.io/f/xxxxxxxx',
}
```

4. `npm run build`

Test it once after deploying and confirm the email arrives.

---

## Before launch

- [ ] **Confirm every job listing in `careers.roles`.** They were drafted from
      the services list, not from a real hiring plan. Delete the ones you are
      not hiring for &mdash; an empty `roles: []` is handled and the page falls
      back to an open-application message. Point `site.careersEmail` at a real
      inbox while you are there.
- [ ] Set `formEndpoint` and send a test message
- [ ] Add Google Analytics or Plausible, and verify the domain in Google Search
      Console. The old site had no analytics at all, so there is currently no
      baseline to measure against.
- [ ] Submit `sitemap.xml` in Search Console
- [ ] Add a share image at `src/img/og.png` (1200×630). Without it, links posted
      to LinkedIn or WhatsApp show no preview card.
- [ ] Replace the team initials with real headshots
- [ ] Confirm the engagement timelines on the four service pages are accurate.
      They are realistic but were written as estimates, and a prospect will
      hold you to them.

---

## Deploying

The `dist/` folder is plain static files. Any of these work, all free:

**Netlify** — drag the `dist` folder onto app.netlify.com/drop.

**Vercel** — `npx vercel --prod` from inside `dist/`.

**Cloudflare Pages** — connect the repo, build command `npm run build`,
output directory `dist`.

**Any shared host** — upload the contents of `dist/` to `public_html`.

After deploying, point `mindlytics.co.in` at the host and update `site.url`
in `src/content.js` if the domain ever changes, since it feeds the canonical
tags and the sitemap.

---

## What the site does

**Page transitions.** Clicking a link drops a black cover carrying the
destination's name and a progress bar, fetches the next page, swaps it in behind
the cover, holds, then wipes the cover away to reveal it. Real URLs are kept and
browser back and forward work.

The cover is five columns that only ever travel downward: they fall in from
above, hold, then carry on down and off the bottom. The exit is deliberately not
the entrance played backwards — the new page is wiped into view rather than
uncovered by a rewind. Each column starts `--col-step` after the one to its left,
so the wipe sweeps across as well as down.

Timing is four tokens in `src/input.css`, and `site.js` reads the same ones so
the two can never disagree:

```
--dur-curtain: 600ms   one column's travel
--col-step:     45ms   delay between columns (5 columns, so 4 steps)
--hold:        600ms   fully black, so the label and bar are readable
--boot:       1200ms   the intro cover on first load
```

That is ~2.2s per navigation. Lower `--hold` for a snappier site, raise it for
more of a loading screen. The page is swapped in at the *start* of the hold, so
it lays out behind the cover and is settled before the wipe, and a slow fetch
eats into the hold rather than stacking on top of it.

The transition also emits `performance.mark`/`measure` pairs, so **page fetch**
and **page transition** show up under Timings in the DevTools performance panel
rather than having to be eyeballed.

If the fetch fails or takes more than four seconds, it falls back to a normal
page load. That fallback leaves a `sessionStorage` note for the destination so it
skips its intro curtain on arrival — otherwise the visitor sees the transition
curtain and then the intro curtain, which reads as the page loading twice.

**Headlines reveal line by line.** Any heading marked `data-lines` is measured
at runtime, split into one element per *visual* line, and each line rises out
from behind its own edge. Because it measures, it re-splits on resize, and it
keeps the text intact for screen readers and copy-paste.

**Reversible scroll motion, in three weights.** `data-reveal` picks how loud a
reveal is and `data-dir` picks the direction it comes from:

| `data-reveal` | Used for | Duration | Travel |
|---|---|---|---|
| *(omitted)* or `text` | eyebrows, ledes, list items | 400ms | 14px |
| `card` | cards, grid tiles, role listings | 500ms | 26px + a slight scale |
| `hero` | one or two elements per page | 700ms | 44px + a blur |

Items inside the same container stagger in sequence. Everything reverses when
you scroll back up.

**Cursor spotlight on cards.** A soft plum glow tracks the pointer across
service cards, values and role listings, and the tool chips restyle in sequence.

**Rotating mandala** in the home hero, three layers turning at different speeds
in opposite directions.

**Per-letter link hover** on the nav and buttons.

### Changing the timing

Every duration and easing in the site comes from tokens at the top of
`src/input.css`. Change `--dur-card` once and every card on the site changes.
`--boot` sets how long the intro curtain holds the screen, and `site.js` reads
that same token, so the two can never drift apart.

### Accessibility

With reduced motion turned on, the page still fades but nothing travels, scales,
blurs or loops, and the intro curtain is skipped entirely. Reduced motion means
*less* motion here, not a page that snaps into place. The site also works fully
without JavaScript: headings render as ordinary text and every reveal is visible
from the start.

---

## Notes

**Cache busting.** `npm run build` ends by stamping the CSS and JS links with a
hash of their contents, so a page ends up asking for
`assets/js/site.js?v=c9d1eee9`. Without it a returning visitor keeps running the
copy their browser cached and never sees a deploy. The hash only moves when the
file actually changes, so unchanged assets still come from cache. If you ever
edit `dist/` by hand, re-run `npm run stamp`.

Built with Tailwind CSS compiled ahead of time, so the browser downloads about
28 KB of CSS and 16 KB of JavaScript. Do not switch to the Tailwind CDN script,
it is roughly 100 KB of JavaScript compiling styles in the browser and it would
undo the performance.
