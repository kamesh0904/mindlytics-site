/* ============================================================
   Mindlytics static site builder
   ------------------------------------------------------------
   Reads src/content.js and writes plain HTML files into dist/.
   Run with:  npm run build
   ============================================================ */

const fs = require('fs');
const path = require('path');
const C = require('./src/content.js');

const DIST = path.join(__dirname, 'dist');
const S = C.site;

/* ---------- helpers ---------- */
// depth -1 means root-absolute: for 404.html, which the host serves in place of
// any missing URL, so relative hrefs would resolve against that missing path.
const link = (p, d) => (d === -1 ? '/' : d === 0 ? '' : '../') + p;
/* Plain text for meta/og attributes: decode the entities we use, drop tags,
   then re-escape so the attribute value is valid HTML. */
const strip = s => String(s)
  .replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&')
  .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
  .replace(/&ldquo;|&rdquo;/g, '"').replace(/&rsquo;/g, '’')
  .replace(/&[a-z]+;/g, ' ')
  .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
  .replace(/\s+/g, ' ').trim();

const ARROW = '<svg class="w-4 h-4 shrink-0" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h9M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="square"/></svg>';
const ARROW_SM = ARROW.replace('w-4 h-4', 'w-3.5 h-3.5');

const withPages = C.services.filter(s => s.page);

/* ---------- shared chrome ---------- */

function nav(d, active) {
  const item = (href, label, key) =>
    `<a href="${link(href, d)}" class="navlink text-[15px] font-medium ${active === key ? 'text-white' : 'text-neutral-400'} hover:text-plum-400 transition-colors duration-200"><span data-lh>${label}</span></a>`;

  const dropItems = withPages.map(s =>
    `<a href="${link('services/' + s.slug + '.html', d)}" class="block px-5 py-3 hover:bg-white/[0.05] transition-colors"><span class="block text-[14.5px] font-semibold text-white">${s.nav}</span><span class="block text-[12.5px] text-neutral-500 mt-0.5">${s.navDesc}</span></a>`
  ).join('\n              ');

  const servicesActive = active === 'services' || active === 'service';

  return `<header class="sticky top-0 z-50 bg-ink-950/85 backdrop-blur-md border-b border-white/10">
    <div class="max-w-shell mx-auto px-6 lg:px-10">
      <div class="flex items-center h-20 gap-8">
        <a href="${link('index.html', d)}" class="text-white text-2xl font-bold tracking-tight shrink-0">${S.name}</a>

        <nav class="hidden lg:flex items-center gap-10 mx-auto" aria-label="Main">
          <div class="relative group">
            <a href="${link('services.html', d)}" class="navlink flex items-center gap-1.5 text-[15px] font-medium ${servicesActive ? 'text-white' : 'text-neutral-400'} hover:text-plum-400 transition-colors duration-200">
              <span data-lh>Services</span>
              <svg class="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
            <div class="absolute left-1/2 -translate-x-1/2 top-full pt-5 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-200">
              <div class="w-[290px] bg-ink-800 border border-white/[0.12] shadow-2xl shadow-black/60 py-2">
              ${dropItems}
                <div class="border-t border-white/[0.08] mt-2 pt-2"><a href="${link('services.html', d)}" class="block px-5 py-2.5 text-[13px] font-semibold text-plum-400 hover:text-plum-300 transition-colors">All six services &rarr;</a></div>
              </div>
            </div>
          </div>
          ${item('about.html', 'About', 'about')}
          ${item('careers.html', 'Careers', 'careers')}
          ${item('contact.html', 'Contact', 'contact')}
        </nav>

        <a href="${link('contact.html', d)}" class="hidden sm:inline-flex ml-auto lg:ml-0 items-center gap-2 bg-plum-600 hover:bg-plum-500 text-white text-[15px] font-semibold px-6 py-3 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum-400"><span data-lh>Get in Touch</span>${ARROW_SM}</a>

        <button id="menuBtn" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu" class="lg:hidden ml-auto p-2 text-white">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>
        </button>
      </div>

      <div id="mobileMenu" hidden class="lg:hidden pb-6">
        <nav class="flex flex-col gap-1 border-t border-white/10 pt-4" aria-label="Mobile">
          <a href="${link('services.html', d)}" class="py-3 text-base font-medium text-neutral-300 hover:text-plum-400 transition-colors">Services</a>
          ${withPages.map(s => `<a href="${link('services/' + s.slug + '.html', d)}" class="py-2.5 pl-4 text-[15px] text-neutral-400 hover:text-plum-400 transition-colors">${s.nav}</a>`).join('\n          ')}
          <a href="${link('about.html', d)}" class="py-3 text-base font-medium text-neutral-300 hover:text-plum-400 transition-colors">About</a>
          <a href="${link('careers.html', d)}" class="py-3 text-base font-medium text-neutral-300 hover:text-plum-400 transition-colors">Careers</a>
          <a href="${link('contact.html', d)}" class="py-3 text-base font-medium text-neutral-300 hover:text-plum-400 transition-colors">Contact</a>
          <a href="${link('contact.html', d)}" class="mt-3 inline-flex justify-center bg-plum-600 hover:bg-plum-500 text-white font-semibold px-6 py-3 transition-colors">Get in Touch</a>
        </nav>
      </div>
    </div>
  </header>`;
}

function ctaBand(d) {
  return `<section class="bg-ink-950 py-20 lg:py-24">
    <div class="max-w-shell mx-auto px-6 lg:px-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
      <h2 data-lines class="text-white font-bold tracking-tight leading-[1.12] text-3xl lg:text-4xl max-w-lg">Let's talk about your data</h2>
      <div data-dir="r" class="flex flex-wrap gap-4">
        <a href="${link('contact.html', d)}" class="inline-flex items-center gap-2.5 bg-plum-600 hover:bg-plum-500 text-white text-base font-semibold px-8 py-4 transition-colors duration-200"><span data-lh>Book a Discovery Call</span>${ARROW}</a>
        <a href="${link('services.html', d)}" class="inline-flex items-center border border-white/25 hover:border-plum-400 hover:text-plum-300 text-white text-base font-semibold px-8 py-4 transition-all duration-200"><span data-lh>Explore Services</span></a>
      </div>
    </div>
  </section>`;
}

function footer(d) {
  return `<footer class="bg-ink-900 text-neutral-400 pt-20 pb-10 border-t border-white/[0.07]">
    <div class="max-w-shell mx-auto px-6 lg:px-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
        <div class="lg:pr-8">
          <div class="text-white text-2xl font-bold tracking-tight">${S.name}</div>
          <p class="mt-4 text-white text-lg font-medium leading-snug max-w-[16ch]">${S.tagline}</p>
        </div>
        <div>
          <h2 class="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-600 mb-5">Company</h2>
          <ul class="space-y-3 text-[15px]">
            <li><a href="${link('index.html', d)}" class="hover:text-plum-400 transition-colors">Home</a></li>
            <li><a href="${link('about.html', d)}" class="hover:text-plum-400 transition-colors">About</a></li>
            <li><a href="${link('careers.html', d)}" class="hover:text-plum-400 transition-colors">Careers</a></li>
            <li><a href="${link('services.html', d)}" class="hover:text-plum-400 transition-colors">Services</a></li>
            <li><a href="${link('contact.html', d)}" class="hover:text-plum-400 transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h2 class="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-600 mb-5">Services</h2>
          <ul class="space-y-3 text-[15px]">
            ${withPages.map(s => `<li><a href="${link('services/' + s.slug + '.html', d)}" class="hover:text-plum-400 transition-colors">${s.nav}</a></li>`).join('\n            ')}
            <li><a href="${link('services.html', d)}" class="hover:text-plum-400 transition-colors">All services</a></li>
          </ul>
        </div>
        <div>
          <h2 class="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-600 mb-5">Contact</h2>
          <ul class="space-y-3 text-[15px]">
            <li><a href="mailto:${S.email}" class="hover:text-plum-400 transition-colors">${S.email}</a></li>
            <li><a href="tel:${S.phoneHref}" class="hover:text-plum-400 transition-colors">${S.phone}</a></li>
            <li class="text-neutral-500">${S.location}</li>
            <li><a href="${S.linkedin}" rel="noopener" class="hover:text-plum-400 transition-colors">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div class="mt-16 pt-7 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-[13px] text-neutral-600">
        <span>&copy; ${S.year} ${S.name}. All rights reserved.</span>
        <span>${S.footerLine}</span>
      </div>
    </div>
  </footer>`;
}

/* ---------- page shell ---------- */

function layout({ title, description, canonical, depth, active, body, noindex }) {
  const a = p => link(p, depth);
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: S.name,
    url: S.url,
    slogan: strip(S.tagline),
    email: S.email,
    telephone: S.phone,
    address: { '@type': 'PostalAddress', addressLocality: 'Hyderabad', addressCountry: 'IN' },
    sameAs: [S.linkedin]
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${strip(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${S.name}">
<meta property="og:title" content="${strip(title)}">
<meta property="og:description" content="${strip(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${S.url}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${strip(title)}">
<meta name="twitter:description" content="${strip(description)}">
<meta name="theme-color" content="#000000">
<link rel="icon" href="${a('assets/img/favicon.ico')}" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="${a('assets/img/favicon-32.png')}">
<link rel="icon" type="image/png" sizes="16x16" href="${a('assets/img/favicon-16.png')}">
<link rel="apple-touch-icon" href="${a('assets/img/favicon-180.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="${a('assets/css/site.css')}">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body class="bg-black text-white antialiased">

<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-4 focus:left-4 focus:bg-white focus:text-black focus:px-5 focus:py-3 focus:font-semibold">Skip to content</a>

<div id="curtain" class="boot" aria-hidden="true">
  <div class="cols">${'<span class="col"></span>'.repeat(5)}</div>
  <div class="mark">
    <div class="word" id="curtainWord">${S.name}</div>
    <div class="track"><span class="bar"></span></div>
  </div>
</div>

${nav(depth, active)}

<main id="main">
${body}
</main>

${ctaBand(depth)}
${footer(depth)}

<script src="${a('assets/js/site.js')}" defer></script>
</body>
</html>
`;
}

/* ---------- reusable blocks ---------- */

function heroShell(inner, extra = '') {
  return `<section class="relative bg-ink-950 overflow-hidden">
    <div class="absolute inset-0 opacity-[0.05]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:64px 64px" aria-hidden="true"></div>
    <div class="absolute -top-1/3 right-0 w-[760px] h-[760px] rounded-full" style="background:radial-gradient(circle,rgba(139,92,246,.26),transparent 65%)" aria-hidden="true"></div>
    ${extra}
    <div class="relative z-10 max-w-shell mx-auto px-6 lg:px-10 py-24 lg:py-32">
      <div class="pageIn max-w-4xl">
${inner}
      </div>
    </div>
  </section>`;
}

/* The heading carries data-lines and animates line by line; the eyebrow and
   lede reveal separately at the lightest weight, so the h2 leads instead of
   the whole block sliding in as one slab. */
function sectionHead(eyebrow, h2, lede, dir = 'l', size = 'text-4xl lg:text-5xl') {
  return `<div class="max-w-3xl">
        <span data-dir="${dir}" data-reveal="text" class="inline-block text-plum-400 text-[11px] font-semibold tracking-[0.18em] uppercase">${eyebrow}</span>
        <h2 data-lines class="mt-5 text-white font-bold tracking-tight leading-[1.1] ${size}">${h2}</h2>
        ${lede ? `<p data-dir="${dir}" data-reveal="text" class="mt-6 text-lg text-neutral-400 leading-relaxed">${lede}</p>` : ''}
      </div>`;
}

const DIRS = ['l', 'u', 'r'];
const chip = t => `<span class="chip text-[11px] text-neutral-400 border border-white/10 px-2.5 py-1">${t}</span>`;

function serviceCard(s, d) {
  const dark = s.highlight;
  const box = dark
    ? 'bg-plum-600 border border-plum-600'
    : 'bg-ink-800 border border-white/[0.08] hover:border-plum-500';
  const num = dark ? 'text-white/70' : 'text-plum-400';
  const body = dark ? 'text-white/80' : 'text-neutral-400';
  const chipCls = dark
    ? 'chip text-[11px] text-white/90 border border-white/25 px-2.5 py-1'
    : 'chip text-[11px] text-neutral-400 border border-white/10 px-2.5 py-1';

  return `<article class="group spot ${dark ? 'spot-light ' : ''}${box} p-8 flex flex-col transition-all duration-300 hover:-translate-y-1.5">
          <span class="cardNum ${num} block text-sm font-bold tracking-[0.1em]">${s.num}</span>
          <h3 class="mt-4 text-white text-xl font-bold tracking-tight leading-snug">${s.title}</h3>
          <p class="mt-3 text-[15px] ${body} leading-relaxed">${s.blurb}</p>
          <div class="flex-1 min-h-[16px]"></div>
          <div class="mt-7 flex flex-wrap gap-1.5">${s.tools.map(t => `<span class="${chipCls}">${t}</span>`).join('')}</div>
          ${s.page ? `<a href="${link('services/' + s.slug + '.html', d)}" class="mt-7 inline-flex items-center gap-2 text-[13.5px] font-semibold text-plum-400 hover:text-plum-300 transition-colors">View service${ARROW_SM}</a>` : ''}
        </article>`;
}

const VIZ = {
  lines: `<svg class="absolute inset-0 w-full h-full" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g stroke="#8B5CF6" stroke-opacity=".45" stroke-width="1.3" fill="none"><path d="M20 160 L80 120 L140 140 L200 90 L260 110 L320 60"/><path d="M20 180 L80 145 L140 165 L200 118 L260 138 L320 90"/></g><g fill="#C4B5FD"><circle cx="80" cy="120" r="3.5"/><circle cx="200" cy="90" r="3.5"/><circle cx="320" cy="60" r="3.5"/></g></svg>`,
  bars:  `<svg class="absolute inset-0 w-full h-full" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="#fff" fill-opacity=".35"><rect x="30" y="120" width="34" height="60"/><rect x="80" y="90" width="34" height="90"/><rect x="130" y="105" width="34" height="75"/><rect x="180" y="60" width="34" height="120"/></g><rect x="230" y="35" width="34" height="145" fill="#fff" fill-opacity=".92"/></svg>`,
  rings: `<svg class="absolute inset-0 w-full h-full" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g stroke="#8B5CF6" stroke-opacity=".45" stroke-width="1.3" fill="none"><circle cx="90" cy="100" r="42"/><circle cx="215" cy="100" r="42"/><path d="M132 100h41"/></g><g stroke="#C4B5FD" stroke-width="1.5" fill="none"><circle cx="90" cy="100" r="18"/><circle cx="215" cy="100" r="18"/></g></svg>`
};

/* ---------- AWS competencies (home only) ----------
   Every glyph below is drawn here as a plain line SVG. Nothing in this section
   carries a third-party logo, partner tier or certification mark: those may
   only be used if the issuer awarded them to this company directly. */

const EYEBROW_ARROW = '<svg class="w-7 h-3 shrink-0 text-plum-400" viewBox="0 0 28 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M0 6h24m-4.5-4.5L24 6l-4.5 4.5"/></svg>';

const CHEV = d => `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

/* One per stat line, drawn on a 22-unit grid so stroke-width 1.5 renders as
   exactly 1.5 CSS px at the 22px display size rather than being scaled down. */
const AWS_ICONS = [
  // certificate: seal and ribbon
  '<circle cx="11" cy="8" r="4.6"/><path d="M7.9 11.9 6.6 19.6 11 17.3l4.4 2.3-1.3-7.7"/>',
  // layered stack
  '<path d="M11 2.6 2.6 6.8 11 11l8.4-4.2Z"/><path d="M2.6 11.3 11 15.5l8.4-4.2"/><path d="M2.6 15.6 11 19.8l8.4-4.2"/>',
  // cloud
  '<path d="M6.6 17h8.8a3.5 3.5 0 0 0 .4-7 5.3 5.3 0 0 0-10.1-1.3A3.4 3.4 0 0 0 6.6 17Z"/>',
  // code brackets
  '<path d="m7.8 7.4-4.1 3.6 4.1 3.6"/><path d="m14.2 7.4 4.1 3.6-4.1 3.6"/><path d="M12.4 5 9.6 17"/>',
  // document with lines
  '<path d="M12.4 2.7H6.4a1.8 1.8 0 0 0-1.8 1.8v13a1.8 1.8 0 0 0 1.8 1.8h9.2a1.8 1.8 0 0 0 1.8-1.8V7.7Z"/><path d="M12.4 2.7v5h5"/><path d="M7.8 12.4h6.4M7.8 15.6h4.1"/>'
];

const awsIcon = i =>
  `<svg class="w-[22px] h-[22px] text-white/80" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${AWS_ICONS[i % AWS_ICONS.length]}</svg>`;

function awsCompetencies() {
  const p = C.home.aws;
  const badges = p.badges || [];
  const hasCard = badges.length > 0;
  const showArrows = badges.length > 1;

  // With no badge to show, the card is omitted rather than left as an empty
  // box, and the section falls back to two columns.
  const cols = hasCard ? 'lg:grid-cols-[1fr_1.1fr_0.9fr]' : 'lg:grid-cols-[1fr_1.1fr]';

  // A placeholder token that reaches the page reads as a bug to a visitor, so
  // drop the line entirely rather than printing it.
  const stats = (p.stats || []).filter(s => !/\{[^}]*\}/.test(s));

  // The inline delay is what staggers these; motion() leaves it alone.
  // The icon sits in a box exactly one line tall, so it centres against the
  // first line and stays there when the text wraps to two, at either size.
  const rows = stats.map((s, i) =>
    `<li data-dir="u" style="transition-delay:${i * 90}ms" class="flex items-start gap-4 text-lg lg:text-xl font-medium text-white leading-snug">
          <span class="flex items-center shrink-0 h-[1.375em]">${awsIcon(i)}</span>
          <span>${s}</span>
        </li>`).join('\n        ');

  const slides = badges.map((b, i) =>
    `<img src="${link(b.src, 0)}" alt="${strip(b.alt)}" width="${b.w}" height="${b.h}" loading="lazy" class="awsBadge${i === 0 ? ' is-on' : ''} max-w-[200px] w-full h-auto">`
  ).join('\n            ');

  // The badge is dark type on a solid white background, which is how AWS
  // supplies it. Rather than float that white block inside a dark card, the
  // whole card is light: the panel then reads as deliberate instead of as a
  // hole. Recolouring or knocking the background out of an issued partner
  // badge is not permitted by the brand terms it comes with.
  // h-fit stops the grid stretching it to match the taller middle column.
  const card = !hasCard ? '' : `<div data-dir="r" class="bg-white p-10 h-fit">
        <div id="awsBadges" class="grid place-items-center">
            ${slides}
        </div>${showArrows ? `
        <div class="mt-8 pt-6 border-t border-black/10 flex items-center justify-between">
          <button type="button" data-badge-prev aria-label="Previous badge" class="text-plum-600 hover:text-plum-500 transition-colors p-1">${CHEV('M14.5 5 7.5 12l7 7')}</button>
          <button type="button" data-badge-next aria-label="Next badge" class="text-plum-600 hover:text-plum-500 transition-colors p-1">${CHEV('m9.5 5 7 7-7 7')}</button>
        </div>` : ''}
      </div>`;

  return `<section class="bg-ink-950 py-24 lg:py-32">
    <div class="max-w-shell mx-auto px-6 lg:px-10 grid grid-cols-1 ${cols} gap-16 items-start">

      <div data-dir="l">
        <div class="flex items-center gap-3">
          ${EYEBROW_ARROW}
          <span class="text-[11px] font-semibold tracking-[0.18em] uppercase text-plum-300">${p.eyebrow}</span>
        </div>
        <!-- text-4xl below sm: [data-lh] is inline-flex, so these words cannot
             wrap. At 48px "Competencies" is 326px and overflows a 312px column
             on a 360px phone, where overflow-x:hidden silently clips it. -->
        <h2 class="mt-6 text-white font-bold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl">
          <span class="block"><span data-lh>${p.headingA}</span></span>
          <span class="block"><span data-lh>${p.headingB}</span></span>
        </h2>
      </div>

      <ul data-dir="u" class="list-none flex flex-col gap-7">
        ${rows}
      </ul>

      ${card}
    </div>
  </section>`;
}

/* ---------- pages ---------- */

function pageHome() {
  const h = C.home;
  const ring = (n, tpl) => Array.from({ length: n }, (_, i) => tpl(i * (360 / n))).join('');

  const mandala = `<div class="mandala" aria-hidden="true">
      <svg class="w-full h-full" viewBox="-200 -200 400 400" fill="none">
        <defs>
          <path id="ml-petal" d="M0,-48 C28,-90 28,-120 0,-154 C-28,-120 -28,-90 0,-48 Z"/>
          <path id="ml-inner" d="M0,-28 C16,-54 16,-74 0,-96 C-16,-74 -16,-54 0,-28 Z"/>
          <circle id="ml-dot" cx="0" cy="-176" r="3.2"/>
          <line id="ml-tick" x1="0" y1="-160" x2="0" y2="-168"/>
        </defs>

        <g class="spin-a" stroke="#A78BFA" stroke-opacity=".22" stroke-width="1">
          <circle r="194"/>
          <circle r="186"/>
          <g stroke-opacity=".3">${ring(24, a => `<use href="#ml-tick" transform="rotate(${a})"/>`)}</g>
          <g fill="#C4B5FD" fill-opacity=".45" stroke="none">${ring(12, a => `<use href="#ml-dot" transform="rotate(${a})"/>`)}</g>
        </g>

        <g class="spin-b" stroke="#A78BFA" stroke-opacity=".34" stroke-width="1.1">
          ${ring(12, a => `<use href="#ml-petal" transform="rotate(${a})"/>`)}
          <circle r="48" stroke-opacity=".18"/>
        </g>

        <g class="spin-c" stroke="#fff" stroke-opacity=".15" stroke-width="1">
          ${ring(12, a => `<use href="#ml-inner" transform="rotate(${a + 15})"/>`)}
          <circle r="102" stroke="#A78BFA" stroke-opacity=".2"/>
          <circle r="26" stroke="#C4B5FD" stroke-opacity=".4"/>
        </g>
      </svg>
    </div>`;

  const hero = `<section class="relative bg-ink-950 overflow-hidden">
    <div class="absolute inset-0 opacity-[0.05]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:64px 64px" aria-hidden="true"></div>
    <div class="absolute -top-1/4 -right-[10%] w-[860px] h-[860px] rounded-full" style="background:radial-gradient(circle,rgba(139,92,246,.30),transparent 65%)" aria-hidden="true"></div>
    ${mandala}
    <div class="relative z-10 max-w-shell mx-auto px-6 lg:px-10 py-28 lg:py-40">
      <div class="pageIn max-w-4xl">
        <div class="flex items-center gap-3 mb-8"><span class="w-10 h-1 bg-plum-500 block"></span><span class="text-plum-300 text-[11px] font-semibold tracking-[0.18em] uppercase">${h.eyebrow}</span></div>
        <h1 data-lines class="text-white font-extrabold tracking-tight leading-[1.03] text-5xl sm:text-6xl lg:text-7xl xl:text-[86px]">${h.h1a}<br><span class="text-plum-400">${h.h1b}</span></h1>
        <p class="mt-8 text-lg lg:text-xl text-neutral-400 leading-relaxed max-w-2xl">${h.lede}</p>
        <div class="mt-12 flex flex-wrap gap-4">
          <a href="services.html" class="inline-flex items-center gap-2.5 bg-white hover:bg-neutral-200 text-ink-950 text-base font-semibold px-8 py-4 transition-colors duration-200"><span data-lh>${h.ctaPrimary}</span>${ARROW}</a>
          <a href="contact.html" class="inline-flex items-center gap-2.5 border border-white/30 hover:border-plum-400 hover:text-plum-300 text-white text-base font-semibold px-8 py-4 transition-all duration-200"><span data-lh>${h.ctaSecondary}</span></a>
        </div>
      </div>
    </div>
  </section>`;

  const cards = `<section class="bg-ink-900 py-24 lg:py-32 border-y border-white/[0.07]">
    <div class="max-w-shell mx-auto px-6 lg:px-10">
      ${sectionHead(h.servicesEyebrow, h.servicesH2, h.servicesLede)}
      <div class="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        ${withPages.map((s, i) => `<div data-dir="${i % 2 ? 'r' : 'l'}" data-reveal="card">${serviceCard(s, 0)}</div>`).join('\n        ')}
      </div>
    </div>
  </section>`;

  const quote = `<section class="relative bg-ink-950 py-28 lg:py-40 overflow-hidden">
    <div class="absolute inset-0 opacity-[0.05]" style="background-image:linear-gradient(90deg,#fff 1px,transparent 1px);background-size:64px 100%" aria-hidden="true"></div>
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full" style="background:radial-gradient(ellipse,rgba(139,92,246,.20),transparent 68%)" aria-hidden="true"></div>
    <div class="relative max-w-shell mx-auto px-6 lg:px-10">
      <div class="max-w-5xl mx-auto text-center">
        <span data-dir="u" class="w-12 h-1 bg-plum-500 block mx-auto mb-12"></span>
        <blockquote data-dir="l" data-reveal="hero" class="text-white font-semibold tracking-tight leading-[1.22] text-3xl sm:text-4xl lg:text-5xl">&ldquo;${h.quote}&rdquo;</blockquote>
        <p data-dir="r" class="mt-10 text-plum-300 text-[13px] font-semibold tracking-[0.16em] uppercase">${h.quoteAttrib}</p>
      </div>
    </div>
  </section>`;

  const engage = `<section class="bg-ink-900 py-24 lg:py-32 border-y border-white/[0.07]">
    <div class="max-w-shell mx-auto px-6 lg:px-10">
      ${sectionHead(h.engageEyebrow, h.engageH2, h.engageLede, 'r')}
      <div class="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
        ${h.engagements.map((e, i) => `<article data-dir="${DIRS[i]}" data-reveal="card" class="group">
          <div class="aspect-[16/10] ${e.viz === 'bars' ? 'bg-plum-700' : 'bg-ink-800 border border-white/[0.07]'} relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.015]">${VIZ[e.viz]}</div>
          <span class="mt-7 block text-[11px] font-semibold tracking-[0.16em] uppercase text-neutral-500">${e.n}</span>
          <h3 class="mt-3 text-white text-2xl font-bold tracking-tight leading-snug">${e.title}</h3>
          <p class="mt-4 text-[15px] text-neutral-400 leading-relaxed">${e.body}</p>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>`;

  const careers = `<section class="relative bg-ink-950 py-24 lg:py-32 overflow-hidden border-b border-white/[0.07]">
    <div class="absolute inset-0 opacity-[0.05]" style="background-image:linear-gradient(90deg,#fff 1px,transparent 1px);background-size:64px 100%" aria-hidden="true"></div>
    <div class="absolute -bottom-1/3 -left-[8%] w-[720px] h-[720px] rounded-full" style="background:radial-gradient(circle,rgba(139,92,246,.18),transparent 65%)" aria-hidden="true"></div>
    <div class="relative max-w-shell mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
      <div>
        ${sectionHead(h.careersEyebrow, h.careersH2, h.careersLede)}
        <div data-dir="u" class="mt-11 flex flex-wrap gap-4">
          <a href="careers.html" class="inline-flex items-center gap-2.5 bg-plum-600 hover:bg-plum-500 text-white text-base font-semibold px-8 py-4 transition-colors duration-200"><span data-lh>${h.careersCta}</span>${ARROW}</a>
          <a href="about.html" class="inline-flex items-center border border-white/25 hover:border-plum-400 hover:text-plum-300 text-white text-base font-semibold px-8 py-4 transition-all duration-200"><span data-lh>${h.careersCtaSecondary}</span></a>
        </div>
      </div>
      <ol class="grid grid-cols-1 gap-px bg-white/[0.08] border border-white/[0.08]">
        ${h.careersPoints.map((c, i) => `<li data-dir="${DIRS[i % 3]}" data-reveal="card" class="bg-ink-950 p-7 lg:p-8">
          <span class="text-plum-400 text-sm font-bold tracking-[0.1em]">${c.n}</span>
          <h3 class="mt-3 text-white text-lg font-bold tracking-tight">${c.title}</h3>
          <p class="mt-2 text-[14.5px] text-neutral-400 leading-relaxed">${c.body}</p>
        </li>`).join('\n        ')}
      </ol>
    </div>
  </section>`;

  return layout({
    title: h.title, description: h.description, canonical: S.url + '/',
    depth: 0, active: 'home',
    body: hero + cards + awsCompetencies() + quote + engage + careers
  });
}

function pageServices() {
  const p = C.servicesPage;
  const hero = heroShell(
    `        <div class="flex items-center gap-3 mb-8"><span class="w-10 h-1 bg-plum-500 block"></span><span class="text-plum-300 text-[11px] font-semibold tracking-[0.18em] uppercase">${p.eyebrow}</span></div>
        <h1 data-lines class="text-white font-extrabold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">${p.h1}</h1>
        <p class="mt-8 text-lg lg:text-xl text-neutral-400 leading-relaxed max-w-2xl">${p.lede}</p>`);

  const grid = `<section class="bg-ink-900 py-24 lg:py-32 border-y border-white/[0.07]">
    <div class="max-w-shell mx-auto px-6 lg:px-10">
      ${sectionHead(p.deliverEyebrow, p.deliverH2, p.deliverLede)}
      <div class="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        ${C.services.map((s, i) => `<div data-dir="${DIRS[i % 3]}" data-reveal="card">${serviceCard(s, 0)}</div>`).join('\n        ')}
      </div>
    </div>
  </section>`;

  const proc = `<section class="bg-ink-950 py-24 lg:py-32">
    <div class="max-w-shell mx-auto px-6 lg:px-10">
      ${sectionHead(p.processEyebrow, p.processH2, p.processLede)}
      <ol class="mt-16 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-px bg-white/[0.08] border border-white/[0.08]">
        ${p.process.map(s => `<li data-dir="u" class="bg-ink-950 p-7"><span class="text-plum-400 text-sm font-bold">${s.n}</span><h3 class="mt-4 text-white text-lg font-bold tracking-tight">${s.title}</h3><p class="mt-2 text-[14.5px] text-neutral-400 leading-relaxed">${s.body}</p></li>`).join('\n        ')}
      </ol>
    </div>
  </section>`;

  return layout({
    title: p.title, description: p.description, canonical: S.url + '/services.html',
    depth: 0, active: 'services', body: hero + grid + proc
  });
}

function pageAbout() {
  const p = C.about;
  const hero = heroShell(
    `        <div class="flex items-center gap-3 mb-8"><span class="w-10 h-1 bg-plum-500 block"></span><span class="text-plum-300 text-[11px] font-semibold tracking-[0.18em] uppercase">${p.eyebrow}</span></div>
        <h1 data-lines class="text-white font-extrabold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">${p.h1}</h1>
        <p class="mt-8 text-lg lg:text-xl text-neutral-400 leading-relaxed max-w-2xl">${p.lede}</p>`);

  const mission = `<section class="bg-ink-900 py-24 lg:py-32 border-y border-white/[0.07]">
    <div class="max-w-shell mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <h2 data-lines class="text-white font-bold tracking-tight leading-[1.14] text-3xl lg:text-4xl">${p.missionH2}</h2>
      <div data-dir="r" class="space-y-6 text-[16.5px] text-neutral-400 leading-relaxed">
        ${p.missionBody.map(t => `<p>${t}</p>`).join('\n        ')}
        <p class="text-white">${p.missionEmphasis}</p>
      </div>
    </div>
  </section>`;

  const values = `<section class="bg-ink-950 py-24 lg:py-32">
    <div class="max-w-shell mx-auto px-6 lg:px-10">
      <div data-dir="l"><span class="text-plum-400 text-[11px] font-semibold tracking-[0.18em] uppercase">${p.valuesEyebrow}</span></div>
      <div class="mt-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08]">
        ${p.values.map((v, i) => `<div data-dir="${i === 0 ? 'l' : i === 3 ? 'r' : 'u'}" data-reveal="card" class="spot bg-ink-950 p-8"><h3 class="text-white text-xl font-bold tracking-tight">${v.title}</h3><p class="mt-3 text-[15px] text-neutral-400 leading-relaxed">${v.body}</p></div>`).join('\n        ')}
      </div>
    </div>
  </section>`;

  const team = `<section class="bg-ink-900 py-24 lg:py-32 border-t border-white/[0.07]">
    <div class="max-w-shell mx-auto px-6 lg:px-10">
      ${sectionHead(p.teamEyebrow, p.teamH2, p.teamLede)}
      <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        ${p.team.map((m, i) => `<article data-dir="${DIRS[i % 3]}" data-reveal="card">
          <div class="aspect-[4/5] bg-ink-800 border border-white/[0.07] relative overflow-hidden">
            ${m.photo
              ? `<img src="${m.photo}" alt="${strip(m.name)}, ${strip(m.role)} at ${S.name}" class="absolute inset-0 w-full h-full object-cover" loading="lazy" width="640" height="800">`
              : `<div class="absolute inset-0 opacity-40" style="background:radial-gradient(circle at ${40 + i * 15}% 20%,rgba(139,92,246,.35),transparent 60%)"></div><span class="absolute bottom-7 left-7 text-7xl font-extrabold tracking-tight text-white/10">${m.initials}</span>`}
          </div>
          <h3 class="mt-6 text-white text-xl font-bold tracking-tight">${m.name}</h3>
          <p class="mt-1 text-[14px] text-plum-400 font-semibold tracking-[0.06em] uppercase">${m.role}</p>
        </article>`).join('\n        ')}
      </div>
      ${p.team.some(m => m.photo) ? '' : `<p data-dir="u" class="mt-10 text-[13px] text-neutral-600">${p.teamNote}</p>`}
    </div>
  </section>`;

  return layout({
    title: p.title, description: p.description, canonical: S.url + '/about.html',
    depth: 0, active: 'about', body: hero + mission + values + team
  });
}

function pageCareers() {
  const p = C.careers;

  /* Applications go by email, same reasoning as the contact form: no backend,
     and a prefilled skeleton beats an empty compose window. */
  const applyHref = (subject, lines) =>
    'mailto:' + S.careersEmail +
    '?subject=' + encodeURIComponent(subject) +
    '&amp;body=' + encodeURIComponent(lines.join('\r\n'));

  const roleHref = r => applyHref(
    'Application: ' + strip(r.title) + ' — ' + S.name,
    ['Role: ' + strip(r.title), '', 'Name:', 'Phone:', 'Years of experience:',
     'Link to something you built (repo, dashboard, write-up):', '',
     'A few lines on what you built and why it mattered:', '']);

  const openHref = applyHref(
    'Open application — ' + S.name,
    ['Role: open application', '', 'Name:', 'Phone:', 'Years of experience:',
     'Link to something you built (repo, dashboard, write-up):', '',
     'What you want to work on next:', '']);

  const hero = heroShell(
    `        <div class="flex items-center gap-3 mb-8"><span class="w-10 h-1 bg-plum-500 block"></span><span class="text-plum-300 text-[11px] font-semibold tracking-[0.18em] uppercase">${p.eyebrow}</span></div>
        <h1 data-lines class="text-white font-extrabold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">${p.h1}</h1>
        <p class="mt-8 text-lg lg:text-xl text-neutral-400 leading-relaxed max-w-2xl">${p.lede}</p>
        <div class="mt-12 flex flex-wrap gap-4">
          <a href="#roles" class="inline-flex items-center gap-2.5 bg-plum-600 hover:bg-plum-500 text-white text-base font-semibold px-8 py-4 transition-colors duration-200"><span data-lh>${p.ctaPrimary}</span>${ARROW}</a>
          <a href="${openHref}" class="inline-flex items-center border border-white/25 hover:border-plum-400 hover:text-plum-300 text-white text-base font-semibold px-8 py-4 transition-all duration-200"><span data-lh>${p.ctaSecondary}</span></a>
        </div>`);

  const why = `<section class="bg-ink-900 py-24 lg:py-32 border-y border-white/[0.07]">
    <div class="max-w-shell mx-auto px-6 lg:px-10">
      ${sectionHead(p.whyEyebrow, p.whyH2, p.whyLede)}
      <div class="mt-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08]">
        ${p.why.map((v, i) => `<div data-dir="${i === 0 ? 'l' : i === 3 ? 'r' : 'u'}" data-reveal="card" class="spot bg-ink-900 p-8"><h3 class="text-white text-xl font-bold tracking-tight">${v.title}</h3><p class="mt-3 text-[15px] text-neutral-400 leading-relaxed">${v.body}</p></div>`).join('\n        ')}
      </div>
    </div>
  </section>`;

  const life = `<section class="bg-ink-950 py-24 lg:py-32">
    <div class="max-w-shell mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <h2 data-lines class="text-white font-bold tracking-tight leading-[1.14] text-3xl lg:text-4xl">${p.lifeH2}</h2>
      <div data-dir="r" class="space-y-6 text-[16.5px] text-neutral-400 leading-relaxed">
        ${p.lifeBody.map(t => `<p>${t}</p>`).join('\n        ')}
        <p class="text-white">${p.lifeEmphasis}</p>
      </div>
    </div>
  </section>`;

  const meta = (label, value) =>
    `<div class="flex gap-3"><dt class="text-neutral-600 w-[92px] shrink-0">${label}</dt><dd class="m-0 text-neutral-300">${value}</dd></div>`;

  const roleList = p.roles.length
    ? p.roles.map((r, i) => `<article data-dir="${DIRS[i % 3]}" data-reveal="card" class="group spot bg-ink-950 border border-white/[0.08] hover:border-plum-500 p-8 lg:p-9 transition-all duration-300 hover:-translate-y-1">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10">
            <div class="lg:col-span-4">
              <h3 class="text-white text-xl font-bold tracking-tight leading-snug">${r.title}</h3>
              <p class="mt-2 text-[12px] font-semibold tracking-[0.14em] uppercase text-plum-400">${r.team}</p>
              <dl class="mt-6 space-y-2.5 text-[13.5px]">
                ${meta('Type', r.type)}
                ${meta('Location', r.location)}
                ${meta('Experience', r.experience)}
              </dl>
            </div>
            <div class="lg:col-span-8">
              <p class="text-[15px] text-neutral-400 leading-relaxed">${r.blurb}</p>
              <div class="mt-6 flex flex-wrap gap-1.5">${r.skills.map(chip).join('')}</div>
              <a href="${roleHref(r)}" class="mt-8 inline-flex items-center gap-2 text-[13.5px] font-semibold text-plum-400 hover:text-plum-300 transition-colors"><span data-lh>${p.applyCta}</span>${ARROW_SM}</a>
            </div>
          </div>
        </article>`).join('\n        ')
    : `<p data-dir="u" class="bg-ink-950 border border-white/[0.08] p-9 text-[16px] text-neutral-400 leading-relaxed">${p.rolesEmpty}</p>`;

  const roles = `<section id="roles" class="bg-ink-900 py-24 lg:py-32 border-y border-white/[0.07] scroll-mt-24">
    <div class="max-w-shell mx-auto px-6 lg:px-10">
      ${sectionHead(p.rolesEyebrow, p.rolesH2, p.rolesLede)}
      <div class="mt-16 grid grid-cols-1 gap-6">
        ${roleList}
      </div>
      <p data-dir="u" class="mt-10 text-[13px] text-neutral-600">${p.rolesNote}</p>
    </div>
  </section>`;

  const proc = `<section class="bg-ink-950 py-24 lg:py-32">
    <div class="max-w-shell mx-auto px-6 lg:px-10">
      ${sectionHead(p.processEyebrow, p.processH2, p.processLede)}
      <ol class="mt-16 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08]">
        ${p.process.map(s => `<li data-dir="u" class="bg-ink-950 p-7"><span class="text-plum-400 text-sm font-bold">${s.n}</span><h3 class="mt-4 text-white text-lg font-bold tracking-tight">${s.title}</h3><p class="mt-2 text-[14.5px] text-neutral-400 leading-relaxed">${s.body}</p></li>`).join('\n        ')}
      </ol>
    </div>
  </section>`;

  const open = `<section class="bg-ink-900 py-20 lg:py-24 border-t border-white/[0.07]">
    <div class="max-w-shell mx-auto px-6 lg:px-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
      <div data-dir="l" class="max-w-xl">
        <h2 class="text-white font-bold tracking-tight leading-[1.12] text-3xl lg:text-4xl">${p.openH2}</h2>
        <p class="mt-5 text-[16px] text-neutral-400 leading-relaxed">${p.openBody}</p>
      </div>
      <a data-dir="r" href="${openHref}" class="inline-flex items-center gap-2.5 shrink-0 bg-plum-600 hover:bg-plum-500 text-white text-base font-semibold px-8 py-4 transition-colors duration-200"><span data-lh>${p.openCta}</span>${ARROW}</a>
    </div>
  </section>`;

  return layout({
    title: p.title, description: p.description, canonical: S.url + '/careers.html',
    depth: 0, active: 'careers', body: hero + why + life + roles + proc + open
  });
}

function pageContact() {
  const p = C.contact;
  const field = (id, label, type, req, extra = '') => `<div class="${extra}">
            <label for="${id}" class="block text-[11px] font-semibold tracking-[0.14em] uppercase text-neutral-500 mb-2">${label}${req ? ' <span class="text-plum-400">*</span>' : ''}</label>
            <input id="${id}" name="${id}" type="${type}"${req ? ' required' : ''} class="w-full bg-ink-900 border border-white/[0.12] focus:border-plum-500 focus:outline-none text-white px-4 py-3 text-[15px] transition-colors">
          </div>`;

  const hero = heroShell(
    `        <div class="flex items-center gap-3 mb-8"><span class="w-10 h-1 bg-plum-500 block"></span><span class="text-plum-300 text-[11px] font-semibold tracking-[0.18em] uppercase">${p.eyebrow}</span></div>
        <h1 data-lines class="text-white font-extrabold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">${p.h1}</h1>
        <p class="mt-8 text-lg lg:text-xl text-neutral-400 leading-relaxed max-w-2xl">${p.lede}</p>`);

  const detail = (dt, dd) => `<div class="py-6 border-b border-white/[0.08] grid grid-cols-[110px_1fr] gap-4 items-baseline">
            <dt class="text-[11px] font-semibold tracking-[0.16em] uppercase text-neutral-500">${dt}</dt><dd class="m-0 text-[17px]">${dd}</dd></div>`;

  const main = `<section class="bg-ink-900 py-24 lg:py-32 border-y border-white/[0.07]">
    <div class="max-w-shell mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div data-dir="l">
        <h2 class="text-white font-bold tracking-tight leading-[1.14] text-3xl lg:text-4xl">${p.introH2}</h2>
        <p class="mt-6 text-[16.5px] text-neutral-400 leading-relaxed max-w-xl">${p.introBody}</p>
        <dl class="mt-12 border-t border-white/[0.08]">
          ${detail('Email', `<a href="mailto:${S.email}" class="text-white hover:text-plum-400 transition-colors">${S.email}</a>`)}
          ${detail('Phone', `<a href="tel:${S.phoneHref}" class="text-white hover:text-plum-400 transition-colors">${S.phone}</a>`)}
          ${detail('Location', `<span class="text-white">${S.location}</span>`)}
          ${detail('LinkedIn', `<a href="${S.linkedin}" rel="noopener" class="text-white hover:text-plum-400 transition-colors">${S.linkedinLabel}</a>`)}
        </dl>
      </div>

      <div data-dir="r" class="bg-ink-800 border border-white/[0.08] p-8 lg:p-10">
        <h2 class="text-white text-2xl font-bold tracking-tight">${p.formH3}</h2>
        <p class="mt-2 text-[15px] text-neutral-400">${p.formLede}</p>
        <form id="contactForm" class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5"${S.formEndpoint ? ` action="${S.formEndpoint}" method="POST"` : ''} data-mailto="${S.email}" data-success="${strip(p.formSuccess)}" data-error="${strip(p.formError)}" data-mailto-note="${strip(p.formMailtoNote)}">
          ${field('firstName', 'First Name', 'text', true)}
          ${field('lastName', 'Last Name', 'text', true)}
          ${field('email', 'Work Email', 'email', true, 'sm:col-span-2')}
          ${field('company', 'Company', 'text', false, 'sm:col-span-2')}
          <div class="sm:col-span-2">
            <label for="service" class="block text-[11px] font-semibold tracking-[0.14em] uppercase text-neutral-500 mb-2">What can we help you with?</label>
            <select id="service" name="service" class="w-full bg-ink-900 border border-white/[0.12] focus:border-plum-500 focus:outline-none text-white px-4 py-3 text-[15px] transition-colors">
              <option value="">Select a service...</option>
              ${p.serviceOptions.map(o => `<option>${o}</option>`).join('\n              ')}
            </select>
          </div>
          <div class="sm:col-span-2">
            <label for="message" class="block text-[11px] font-semibold tracking-[0.14em] uppercase text-neutral-500 mb-2">Message <span class="text-plum-400">*</span></label>
            <textarea id="message" name="message" rows="4" required class="w-full bg-ink-900 border border-white/[0.12] focus:border-plum-500 focus:outline-none text-white px-4 py-3 text-[15px] transition-colors resize-y"></textarea>
          </div>
          <div class="sm:col-span-2">
            <button type="submit" class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-plum-600 hover:bg-plum-500 text-white text-base font-semibold px-8 py-4 transition-colors duration-200">Send Message${ARROW}</button>
            <p id="formNote" role="status" class="mt-4 text-[13px] text-neutral-500">${p.formNote}</p>
          </div>
        </form>
      </div>
    </div>
  </section>`;

  return layout({
    title: p.title, description: p.description, canonical: S.url + '/contact.html',
    depth: 0, active: 'contact', body: hero + main
  });
}

function pageService(slug) {
  const p = C.servicePages[slug];
  const hero = `<section class="relative bg-ink-950 overflow-hidden">
    <div class="absolute inset-0 opacity-[0.05]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:64px 64px" aria-hidden="true"></div>
    <div class="absolute -top-1/3 right-0 w-[720px] h-[720px] rounded-full" style="background:radial-gradient(circle,rgba(139,92,246,.26),transparent 65%)" aria-hidden="true"></div>
    <div class="relative z-10 max-w-shell mx-auto px-6 lg:px-10 py-24 lg:py-32">
      <div class="pageIn max-w-4xl">
        <nav class="flex items-center gap-2 mb-8 text-[11px] font-semibold tracking-[0.18em] uppercase" aria-label="Breadcrumb">
          <a href="../services.html" class="text-neutral-500 hover:text-plum-400 transition-colors">Services</a>
          <span class="text-neutral-700">/</span><span class="text-plum-300">${p.crumb}</span>
        </nav>
        <h1 data-lines class="text-white font-extrabold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl">${p.h1}</h1>
        <p class="mt-8 text-lg lg:text-xl text-neutral-400 leading-relaxed max-w-2xl">${p.lede}</p>
        <div class="mt-10"><a href="../contact.html?service=${encodeURIComponent(strip(p.formService))}" class="inline-flex items-center gap-2.5 bg-plum-600 hover:bg-plum-500 text-white text-base font-semibold px-8 py-4 transition-colors"><span data-lh>Discuss this service</span>${ARROW}</a></div>
      </div>
    </div>
  </section>`;

  const signs = `<section class="bg-ink-900 py-24 lg:py-32 border-y border-white/[0.07]">
    <div class="max-w-shell mx-auto px-6 lg:px-10">
      ${sectionHead('Signs You Need This', 'Any of these sound familiar?', '', 'l', 'text-3xl lg:text-4xl')}
      <div class="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.08] border border-white/[0.08]">
        ${p.signs.map((s, i) => `<div data-dir="${i % 2 ? 'r' : 'l'}" class="bg-ink-900 p-8"><h3 class="text-white text-lg font-bold tracking-tight">${s.q}</h3><p class="mt-3 text-[15px] text-neutral-400 leading-relaxed">${s.a}</p></div>`).join('\n        ')}
      </div>
    </div>
  </section>`;

  const build = `<section class="bg-ink-950 py-24 lg:py-32">
    <div class="max-w-shell mx-auto px-6 lg:px-10">
      ${sectionHead('What We Build', p.buildH2, '', 'l', 'text-3xl lg:text-4xl')}
      <div class="mt-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        ${p.build.map((b, i) => `<div data-dir="${DIRS[i % 3]}" class="bg-ink-800 border border-white/[0.08] p-7"><span class="text-plum-400 text-sm font-bold">0${i + 1}</span><h3 class="mt-4 text-white text-lg font-bold tracking-tight">${b.title}</h3><p class="mt-3 text-[15px] text-neutral-400 leading-relaxed">${b.body}</p></div>`).join('\n        ')}
      </div>
    </div>
  </section>`;

  const tail = `<section class="bg-ink-900 py-24 lg:py-32 border-y border-white/[0.07]">
    <div class="max-w-shell mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div data-dir="l">
        <span class="text-plum-400 text-[11px] font-semibold tracking-[0.18em] uppercase">The Stack</span>
        <h2 class="mt-5 text-white font-bold tracking-tight leading-[1.14] text-3xl">Tools we reach for</h2>
        <p class="mt-5 text-[16px] text-neutral-400 leading-relaxed">${p.stackLede}</p>
        <div class="mt-8 flex flex-wrap gap-2">${p.stack.map(t => `<span class="text-[13px] text-neutral-300 border border-white/[0.14] px-3.5 py-1.5">${t}</span>`).join('')}</div>
      </div>
      <div data-dir="r">
        <span class="text-plum-400 text-[11px] font-semibold tracking-[0.18em] uppercase">How It Runs</span>
        <h2 class="mt-5 text-white font-bold tracking-tight leading-[1.14] text-3xl">A typical engagement</h2>
        <ol class="mt-8 border-t border-white/[0.08]">
          ${p.timeline.map(t => `<li class="py-6 border-b border-white/[0.08] grid grid-cols-[120px_1fr] gap-5"><span class="text-[13px] font-semibold text-plum-400 tracking-[0.06em]">${t.when}</span><div><h3 class="text-white font-bold">${t.title}</h3><p class="mt-2 text-[15px] text-neutral-400 leading-relaxed">${t.body}</p></div></li>`).join('\n          ')}
        </ol>
      </div>
    </div>
  </section>`;

  return layout({
    title: p.title, description: p.description,
    canonical: S.url + '/services/' + slug + '.html',
    depth: 1, active: 'service', body: hero + signs + build + tail
  });
}

function page404() {
  const p = C.notFound;
  const hero = heroShell(
    `        <div class="flex items-center gap-3 mb-8"><span class="w-10 h-1 bg-plum-500 block"></span><span class="text-plum-300 text-[11px] font-semibold tracking-[0.18em] uppercase">${p.eyebrow}</span></div>
        <h1 data-lines class="text-white font-extrabold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl">${p.h1}</h1>
        <p class="mt-8 text-lg text-neutral-400 leading-relaxed max-w-2xl">${p.lede}</p>
        <div class="mt-12 flex flex-col sm:flex-row gap-4">
          <a href="/index.html" class="inline-flex items-center gap-2.5 bg-plum-600 hover:bg-plum-500 text-white text-base font-semibold px-8 py-4 transition-colors duration-200"><span data-lh>${p.ctaPrimary}</span>${ARROW}</a>
          <a href="/services.html" class="inline-flex items-center border border-white/25 hover:border-plum-400 hover:text-plum-300 text-white text-base font-semibold px-8 py-4 transition-all duration-200"><span data-lh>${p.ctaSecondary}</span></a>
        </div>`);

  return layout({
    title: p.title, description: p.description,
    depth: -1, active: 'none', noindex: true, body: hero
  });
}

/* ---------- write everything ---------- */

const ROUTES = [
  ['index.html', pageHome()],
  ['services.html', pageServices()],
  ['about.html', pageAbout()],
  ['careers.html', pageCareers()],
  ['contact.html', pageContact()]
].concat(withPages.map(s => ['services/' + s.slug + '.html', pageService(s.slug)]));

fs.mkdirSync(path.join(DIST, 'services'), { recursive: true });
ROUTES.forEach(([file, html]) => {
  fs.writeFileSync(path.join(DIST, file), html);
  console.log('  built  dist/' + file);
});

/* 404 — written outside ROUTES so it stays out of the sitemap */
fs.writeFileSync(path.join(DIST, '404.html'), page404());
console.log('  built  dist/404.html');

/* robots.txt + sitemap.xml — both missing from the old site */
fs.writeFileSync(path.join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${S.url}/sitemap.xml\n`);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  ROUTES.map(([f]) => {
    const loc = f === 'index.html' ? S.url + '/' : S.url + '/' + f;
    const pri = f === 'index.html' ? '1.0' : f.includes('/') ? '0.7' : '0.8';
    return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>${pri}</priority></url>`;
  }).join('\n') +
  `\n</urlset>\n`);

console.log('  built  dist/robots.txt');
console.log('  built  dist/sitemap.xml');
console.log('\n' + ROUTES.length + ' pages built.\n');
