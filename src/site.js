/* ============================================================
   Mindlytics — site runtime
   ------------------------------------------------------------
   - curtain intro on first load
   - curtain page transitions (fetch + swap, real URLs kept)
   - reversible scroll motion (in on the way down, out on the way up)
   - per-letter link hover
   - mobile menu
   - contact form: validation, ?service= prefill, endpoint POST
   ============================================================ */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduce  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var curtain = document.getElementById('curtain');
  var word    = document.getElementById('curtainWord');
  var busy    = false;

  /* ---------------- per-letter hover ---------------- */
  function letters(root) {
    root.querySelectorAll('[data-lh]').forEach(function (el) {
      if (el.dataset.lhDone) return;
      el.dataset.lhDone = '1';
      var text = el.textContent;
      el.textContent = '';

      // Each column below holds the character twice for the roll-up, and one
      // character per span reads out letter by letter. Keep one plain copy for
      // assistive tech and hide the animated columns from it.
      var sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = text;
      el.appendChild(sr);

      for (var i = 0; i < text.length; i++) {
        // The container is inline-flex, so whitespace text nodes between
        // items are discarded. Spaces must be a real character in a column.
        var ch = text[i] === ' ' ? ' ' : text[i];
        var col = document.createElement('span');
        col.className = 'lhc';
        col.setAttribute('aria-hidden', 'true');
        col.style.transitionDelay = (i * 22) + 'ms';
        col.innerHTML = '<span class="t"></span><span class="t"></span>';
        col.children[0].textContent = ch;
        col.children[1].textContent = ch;
        el.appendChild(col);
      }
    });
  }

  /* ---------------- headline line masks ----------------
     Split a heading into one element per *visual* line so each can rise out
     from behind its own edge. Visual lines can only be found by measuring, so
     the words are laid out once, grouped by vertical position, then rebuilt. */
  var lineSrc = new WeakMap();

  // Flatten to words, remembering which inline wrapper each word came from so
  // markup like <span class="text-plum-400"> survives the rebuild.
  function words(el) {
    var out = [];
    (function walk(node, cls) {
      for (var i = 0; i < node.childNodes.length; i++) {
        var c = node.childNodes[i];
        if (c.nodeType === 3) {
          c.textContent.split(/(\s+)/).forEach(function (w) {
            if (w !== '' && !/^\s+$/.test(w)) out.push({ word: w, cls: cls });
          });
        } else if (c.nodeType === 1) {
          if (c.tagName === 'BR') out.push({ br: true });
          else walk(c, c.getAttribute('class') || cls);
        }
      }
    })(el, '');
    return out;
  }

  function buildLines(el) {
    var src = lineSrc.get(el);
    if (src == null) return;

    el.innerHTML = src;
    var toks = words(el);

    // Pass 1: lay the words out and let the browser tell us where they wrap.
    el.textContent = '';
    var probes = [];
    toks.forEach(function (t) {
      if (t.br) { el.appendChild(document.createElement('br')); probes.push(t); return; }
      var s = document.createElement('span');
      if (t.cls) s.setAttribute('class', t.cls);
      s.textContent = t.word;
      el.appendChild(s);
      el.appendChild(document.createTextNode(' '));
      probes.push({ el: s, cls: t.cls, word: t.word });
    });

    // Pass 2: group by vertical position; an explicit <br> always breaks.
    var groups = [], cur = null, lastTop = null;
    probes.forEach(function (p) {
      if (p.br) { cur = null; lastTop = null; return; }
      var top = p.el.offsetTop;
      if (cur === null || top !== lastTop) { cur = []; groups.push(cur); lastTop = top; }
      cur.push(p);
    });

    // Pass 3: rebuild as one mask per line. The delay rides on --enter-base so
    // a hero heading waits for the curtain and a scrolled-to heading does not.
    el.textContent = '';
    groups.forEach(function (g, i) {
      var mask = document.createElement('span');
      mask.className = 'lnMask';
      var inner = document.createElement('span');
      inner.className = 'lnIn';
      inner.style.transitionDelay = 'calc(var(--enter-base, 0ms) + ' + (i * 80) + 'ms)';

      g.forEach(function (p, j) {
        if (j) inner.appendChild(document.createTextNode(' '));
        if (p.cls) {
          var w = document.createElement('span');
          w.setAttribute('class', p.cls);
          w.textContent = p.word;
          inner.appendChild(w);
        } else {
          inner.appendChild(document.createTextNode(p.word));
        }
      });

      mask.appendChild(inner);
      el.appendChild(mask);
    });
  }

  function lines(root) {
    root.querySelectorAll('[data-lines]').forEach(function (el) {
      if (el.dataset.linesDone) return;
      el.dataset.linesDone = '1';
      lineSrc.set(el, el.innerHTML);
      buildLines(el);
    });
  }

  // Where the lines fall depends on the width, so re-measure after a resize.
  var reflow;
  window.addEventListener('resize', function () {
    clearTimeout(reflow);
    reflow = setTimeout(function () {
      document.querySelectorAll('[data-lines][data-lines-done]').forEach(buildLines);
    }, 200);
  });

  /* ---------------- reversible scroll motion ---------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var el = e.target;
      // Promote only while the move is actually running: a will-change left
      // set permanently keeps a compositor layer alive for nothing.
      el.style.willChange = 'opacity, transform';
      clearTimeout(el._wc);
      el._wc = setTimeout(function () { el.style.willChange = ''; }, 1200);
      el.classList.toggle('in', e.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  function motion(root) {
    root.querySelectorAll('[data-dir],[data-reveal]').forEach(function (el) {
      // A transition-delay set inline in the markup wins. Sections that stagger
      // by hand would otherwise have it overwritten by the sibling calculation
      // below, which flattens the stagger to a single step.
      if (!el.style.transitionDelay) {
        // Stagger by position among revealing siblings, so each grid or list
        // sweeps once. The old index % 4 reset every fourth element, which made
        // any run longer than four stutter back to the start.
        var sibs = [].filter.call(el.parentNode.children, function (n) {
          return n.hasAttribute('data-dir') || n.hasAttribute('data-reveal');
        });
        var step = el.getAttribute('data-reveal') === 'card' ? 60 : 40;
        el.style.transitionDelay = 'calc(var(--enter-base, 0ms) + ' +
          (Math.min(sibs.indexOf(el), 6) * step) + 'ms)';
      }
      io.observe(el);
    });

    root.querySelectorAll('[data-lines]').forEach(function (el) {
      // A hero heading is on screen the moment the curtain lifts, so reveal it
      // outright instead of waiting for the observer's first delivery. Its
      // transition-delay still holds it until the curtain is out of the way.
      if (el.closest('.pageIn')) el.classList.add('in');
      io.observe(el);
    });
  }

  /* ---------------- cursor spotlight on cards ----------------
     One delegated listener for every card on the page. Writes two custom
     properties and nothing else, so the only work is repainting one gradient. */
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var card = e.target.closest && e.target.closest('.spot');
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---------------- mobile menu ---------------- */
  var menuBtn = document.getElementById('menuBtn');
  var menu    = document.getElementById('mobileMenu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      menu.hidden = !menu.hidden;
      menuBtn.setAttribute('aria-expanded', String(!menu.hidden));
      menuBtn.setAttribute('aria-label', menu.hidden ? 'Open menu' : 'Close menu');
    });
  }

  /* ---------------- contact form ---------------- */

  // Used when no endpoint is configured: turns the filled form into a
  // prefilled message addressed to the company inbox.
  function mailtoFor(form) {
    function get(n) {
      var el = form.elements[n];
      return el && el.value ? el.value.trim() : '';
    }

    var who     = (get('firstName') + ' ' + get('lastName')).trim();
    var service = get('service');
    var subject = service
      ? 'Enquiry: ' + service + (who ? ' — ' + who : '')
      : 'Website enquiry' + (who ? ' from ' + who : '');

    var lines = [];
    if (who)             lines.push('Name: ' + who);
    if (get('email'))    lines.push('Email: ' + get('email'));
    if (get('company'))  lines.push('Company: ' + get('company'));
    if (service)         lines.push('Service: ' + service);
    lines.push('', get('message'));

    return 'mailto:' + form.dataset.mailto +
           '?subject=' + encodeURIComponent(subject) +
           '&body=' + encodeURIComponent(lines.join('\r\n'));
  }

  function initForm(root) {
    var form = root.querySelector('#contactForm');
    if (!form || form.dataset.bound) return;
    form.dataset.bound = '1';

    var note = form.querySelector('#formNote');
    var sel  = form.querySelector('#service');

    // Pre-select the service when arriving from a service page
    var want = new URLSearchParams(location.search).get('service');
    if (want && sel) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].text.trim() === want.trim()) { sel.selectedIndex = i; break; }
      }
      sel.classList.add('border-plum-500');
    }

    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) { e.preventDefault(); form.reportValidity(); return; }

      // No endpoint configured: hand the message to the visitor's mail app
      // rather than dropping it. Set site.formEndpoint to POST instead.
      if (!form.getAttribute('action')) {
        e.preventDefault();
        location.href = mailtoFor(form);
        note.textContent = form.dataset.mailtoNote;
        note.className = 'mt-4 text-[13px] text-plum-300';
        return;
      }

      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.classList.add('opacity-60');
      note.textContent = 'Sending...';
      note.className = 'mt-4 text-[13px] text-neutral-400';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (r) {
        if (!r.ok) throw new Error('bad status');
        form.reset();
        note.textContent = form.dataset.success;
        note.className = 'mt-4 text-[13px] text-plum-300';
      }).catch(function () {
        note.textContent = form.dataset.error;
        note.className = 'mt-4 text-[13px] text-red-400';
      }).finally(function () {
        btn.disabled = false;
        btn.classList.remove('opacity-60');
      });
    });
  }

  /* ---------------- AWS badge carousel ----------------
     Only the home page carries this markup, so every other page must fall
     straight through. Bound from activate() so it comes back after a page
     swap, and guarded so re-running activate() cannot bind the arrows twice. */
  function badgeCarousel(root) {
    var box = root.querySelector('#awsBadges');
    if (!box || box.dataset.carousel) return;

    var slides = box.querySelectorAll('.awsBadge');
    var prev = root.querySelector('[data-badge-prev]');
    var next = root.querySelector('[data-badge-next]');

    // One badge or none renders no arrows, so there is nothing to wire up.
    if (slides.length < 2 || !prev || !next) return;

    box.dataset.carousel = '1';
    var at = 0;

    function show(i) {
      at = (i + slides.length) % slides.length;
      for (var s = 0; s < slides.length; s++) {
        slides[s].classList.toggle('is-on', s === at);
      }
    }

    prev.addEventListener('click', function () { show(at - 1); });
    next.addEventListener('click', function () { show(at + 1); });
  }

  /* ---------------- page transitions ---------------- */
  var main = document.getElementById('main');

  // Set when a transition has to give up and hand off to a real page load, so
  // the destination knows to skip its intro rather than show a second curtain.
  var HANDOFF = 'ml-curtain-handoff';

  /* Timing marks for the transition, so it shows up under Timings in the
     DevTools performance panel instead of having to be eyeballed. Guarded
     because performance.measure throws if a mark is missing. */
  function mark(phase) {
    if (!window.performance || !performance.mark) return;
    try {
      performance.mark('mindlytics:' + phase);
      if (phase === 'fetched') {
        performance.measure('page fetch', 'mindlytics:start', 'mindlytics:fetched');
      } else if (phase === 'end') {
        performance.measure('page transition', 'mindlytics:start', 'mindlytics:end');
      }
    } catch (e) {}
  }

  function cssMs(name, fallback) {
    var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  }

  // Read from the same tokens the CSS animates on, so the two cannot drift.
  // A column takes --dur-curtain to travel and the last of five starts four
  // --col-step delays late, so full coverage is the sum of the two.
  function cover() { return cssMs('--dur-curtain', 600) + cssMs('--col-step', 45) * 4; }
  function hold()  { return cssMs('--hold', 600); }          // fully black

  function activate(root) {
    lines(root);      // before motion: the masks must exist to be observed
    letters(root);
    motion(root);
    initForm(root);
    badgeCarousel(root);
  }

  function replayEntrance(root) {
    root.querySelectorAll('.pageIn').forEach(function (el) {
      el.classList.remove('pageIn');
      void el.offsetWidth;
      // .replay zeroes --enter-base: the curtain is already open by now, so
      // the incoming hero should not sit through the first-load wait again.
      el.classList.add('pageIn', 'replay');
    });
  }

  function labelFor(a) {
    // letters() rewrites the label into two spans per character, so reading
    // textContent off the link gives back "AboutAAbboouutt". The sr-only copy
    // it leaves behind is the real text.
    var clean = a.querySelector('[data-lh] .sr-only');
    var t = ((clean ? clean.textContent : a.textContent) || '').trim();
    return t.length > 2 && t.length < 26 ? t : 'Mindlytics';
  }

  function navigate(url, label, push) {
    if (busy) return;
    busy = true;
    curtain.classList.add('busy');
    if (word) word.textContent = label;
    curtain.classList.add('shut');

    // The swap happens once the panels have covered the screen and the page has
    // arrived; the curtain then stays down for the rest of --hold. Swapping at
    // the start of the hold rather than the end means the new page lays out
    // behind the cover, so it is already settled when the curtain lifts.
    mark('start');
    var shutAt = performance.now();
    var covered = new Promise(function (ok) { setTimeout(ok, cover() + 40); });

    var fetched = Promise.race([
      fetch(url, { credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function (t) { mark('fetched'); return t; }),
      new Promise(function (_, fail) {
        setTimeout(function () { fail(new Error('timeout')); }, 4000);
      })
    ]);

    Promise.all([covered, fetched])
      .then(function (both) {
        var doc = new DOMParser().parseFromString(both[1], 'text/html');
        var next = doc.getElementById('main');
        if (!next) throw new Error('no main');
        swapIn(doc, next, url, push);

        // Hold for the remainder of cover + hold, measured from the click. A
        // slow fetch eats into the hold instead of stacking on top of it, so
        // the transition never runs longer than it has to.
        var left = Math.max(0, cover() + hold() - (performance.now() - shutAt));

        setTimeout(function () {
          // The columns carry on downward rather than retreating upward, so
          // .shut gives way to .out instead of simply being removed.
          curtain.classList.remove('shut');
          curtain.classList.add('out');
        }, left);

        setTimeout(function () {
          // Park the columns back above the fold with transitions off, or they
          // slide back up across the page that was just revealed.
          curtain.classList.add('reset');
          curtain.classList.remove('out');
          void curtain.offsetWidth;
          curtain.classList.remove('reset', 'busy');
          busy = false;
          mark('end');
        }, left + cover() + 60);
      })
      .catch(function () {
        // Cannot swap in place, so hand off to a real page load. Leave a note
        // for the next page: its curtain is already down, and replaying the
        // intro there is what made this look like two loading screens.
        try { sessionStorage.setItem(HANDOFF, '1'); } catch (e) {}
        location.href = url;
      });
  }

  function swapIn(doc, next, url, push) {
      main.innerHTML = next.innerHTML;
      document.title = doc.title;

      var d = doc.querySelector('meta[name=description]');
      var cur = document.querySelector('meta[name=description]');
      if (d && cur) cur.setAttribute('content', d.getAttribute('content'));

      // Refresh nav highlighting from the fetched document
      var newNav = doc.querySelector('header');
      var oldNav = document.querySelector('header');
      if (newNav && oldNav) {
        oldNav.querySelectorAll('.navlink').forEach(function (a, i) {
          var ref = newNav.querySelectorAll('.navlink')[i];
          if (!ref) return;
          a.classList.toggle('text-white', ref.classList.contains('text-white'));
          a.classList.toggle('text-neutral-400', ref.classList.contains('text-neutral-400'));
        });
      }

      if (push !== false) history.pushState({ url: url }, '', url);
      window.scrollTo(0, 0);
      activate(main);
      replayEntrance(main);

      // The curtain is lifted by navigate(), once the hold has run its course.
  }

  document.addEventListener('click', function (e) {
    if (reduce) return;                                  // no transition, plain navigation
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    var a = e.target.closest('a');
    if (!a) return;

    var href = a.getAttribute('href');
    if (!href || a.target === '_blank' || a.hasAttribute('download')) return;
    if (/^(mailto:|tel:|#)/.test(href)) return;

    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;

    e.preventDefault();
    if (menu && !menu.hidden) {
      menu.hidden = true;
      menuBtn.setAttribute('aria-expanded', 'false');
    }
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    navigate(url.pathname + url.search, labelFor(a), true);
  });

  window.addEventListener('popstate', function () {
    if (reduce) { location.reload(); return; }
    navigate(location.pathname + location.search, 'Mindlytics', false);
  });

  /* ---------------- boot ---------------- */
  activate(document);

  if (reduce) {
    if (curtain) curtain.remove();
  } else if (curtain) {
    var handedOff = false;
    try {
      handedOff = sessionStorage.getItem(HANDOFF) === '1';
      sessionStorage.removeItem(HANDOFF);
    } catch (e) {}

    // Dropping .boot hands the columns back to their resting position, which is
    // above the fold — the opposite side from where the wipe left them. Without
    // transitions off for that frame they sweep back up over the new page.
    var park = function () {
      curtain.classList.add('reset');
      curtain.classList.remove('boot');
      void curtain.offsetWidth;
      curtain.classList.remove('reset');
    };

    if (handedOff) {
      // We arrived mid-transition: the previous page already showed the
      // curtain, so uncover straight away and let the entrance run now.
      park();
      document.querySelectorAll('.pageIn').forEach(function (el) {
        el.classList.add('replay');
      });
    } else {
      // The CSS animation is what actually wipes the columns away; this only
      // tidies up once it has finished, hence --boot plus the wipe itself.
      setTimeout(park, cssMs('--boot', 1200) + cover() + 60);
    }
  }
})();
