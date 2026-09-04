/* =============================================================================
   Curtain page transition — vanilla JavaScript, no dependencies.
   -----------------------------------------------------------------------------
   Real multi-page static site. Every page is real HTML at a real URL, so with
   scripting off the links simply navigate. This file is an enhancement layer
   over that, never a replacement for it.

   Load it deferred, after the markup:
       <script src="curtain.js" defer></script>

   Flow on a click:
       intercept -> .shut (panels close) -> fetch in parallel
       -> once covered, swap <main>, title, meta, history, scroll
       -> re-bind everything -> remove .shut (panels open)
   ========================================================================== */

(function () {
  'use strict';

  var curtain = document.getElementById('curtain');
  var main    = document.getElementById('main');
  var label   = document.getElementById('curtain-label');

  /* Marks the document as scripted. The reveal styles are gated on .js so that
     with scripting off nothing is left hidden waiting for an observer that will
     never run. Set here rather than in the HTML so it is true by construction. */
  document.documentElement.classList.add('js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Re-entry guard. Without it a double click starts two transitions, and the
     second swap lands while the first is still animating. */
  var busy = false;

  /* Extra beat granted to a fetch that has not landed by the time the panels
     have met, before giving up and letting the browser navigate. */
  var GRACE = 450;

  /* ---------------------------------------------------------------------------
     Timings are read back from the stylesheet rather than duplicated here.
     Two copies of "800" drift apart the first time someone retunes the CSS,
     and the symptom is a swap that happens while the page is still visible.
     ------------------------------------------------------------------------ */
  function cssMs(name, fallback) {
    var v = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(name)
    );
    return isNaN(v) ? fallback : v;
  }
  function DUR()  { return cssMs('--curtain-dur',   800); }
  function HOLD() { return cssMs('--curtain-hold',  260); }
  function BOOT() { return cssMs('--curtain-boot', 1000); }

  /* ===========================================================================
     activate(root)

     THE IMPORTANT PART. Setting main.innerHTML throws away every element inside
     it, and with them every listener bound to those elements and every entry in
     every IntersectionObserver. Anything attached to content inside <main> must
     live in here, and here only, so it can be re-applied after each swap.

     Two kinds of work, with different idempotency rules:

       - observer.observe(el) is naturally idempotent. Observing an element that
         is already observed by the same observer does nothing.

       - addEventListener and any DOM rewriting are NOT. Running them twice
         double-binds, and a click then fires two handlers. Those need the
         data-attribute guard shown below.

     Bindings on chrome that survives the swap — a header, a footer, the curtain
     itself — belong outside this function. They are bound once and stay bound.
     ======================================================================== */

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle('in', entry.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  function activate(root) {
    /* Scroll reveals. Safe to re-run: observe() on an already-observed element
       is a no-op, and elements from the old page were discarded with it. */
    root.querySelectorAll('[data-reveal]').forEach(function (el) {
      io.observe(el);
    });

    /* Anything that adds a listener or rewrites the DOM needs the guard.
       This example is a form, but the pattern is what matters. */
    root.querySelectorAll('form[data-enhance]').forEach(function (form) {
      if (form.dataset.bound) return;      // already wired on this element
      form.dataset.bound = '1';

      form.addEventListener('submit', function (e) {
        if (!form.checkValidity()) {
          e.preventDefault();
          form.reportValidity();
        }
      });
    });
  }

  /* Replays a CSS entrance animation.

     Removing and re-adding a class in the same task does nothing: the browser
     only compares computed style at the end of the task, sees no net change,
     and never restarts the animation. Reading a layout property in between
     forces a synchronous reflow, which commits the removal first. */
  function replayEntrance(root) {
    root.querySelectorAll('.enter').forEach(function (el) {
      el.classList.remove('enter');
      void el.offsetWidth;                 // do not delete: this is the reflow
      el.classList.add('enter', 'replay'); // .replay drops the first-load delay
    });
  }

  /* ---------------------------------------------------------------------------
     What to print on the curtain
     ------------------------------------------------------------------------ */
  function labelFor(a) {
    /* An explicit data-title wins. Fall back to a visually hidden copy if there
       is one, because hover effects that split a label into per-character spans
       make textContent come back as "AAbboouutt". Raw text is the last resort. */
    var src = a.getAttribute('data-title') ||
              (a.querySelector('.sr-only') || a).textContent || '';
    var text = src.trim().replace(/\s+/g, ' ');
    return (text.length > 1 && text.length < 26) ? text : 'Loading';
  }

  /* ---------------------------------------------------------------------------
     The swap itself. Only ever called while the panels are fully closed.
     ------------------------------------------------------------------------ */
  function swap(html, url, push) {
    var doc  = new DOMParser().parseFromString(html, 'text/html');
    var next = doc.getElementById('main');

    /* The response parsed but has no <main>. A login redirect or an error page,
       most likely. Not something to splice in, so hand over to the browser. */
    if (!next) {
      location.href = url;
      return;
    }

    main.innerHTML = next.innerHTML;

    /* The title is what a bookmark and the history entry record, so it has to
       track the URL. Same for the description, which is what a share preview
       scrapes if anyone copies the address mid-session. */
    document.title = doc.title;

    var fromMeta = doc.querySelector('meta[name="description"]');
    var toMeta   = document.querySelector('meta[name="description"]');
    if (fromMeta && toMeta) {
      toMeta.setAttribute('content', fromMeta.getAttribute('content') || '');
    }

    /* push === false on popstate: the browser already moved through history,
       and pushing again would add a duplicate entry and trap the Back button. */
    if (push !== false) {
      history.pushState({ url: url }, '', url);
    }
    window.scrollTo(0, 0);

    activate(main);          // rebuild everything innerHTML just destroyed
    replayEntrance(main);

    /* A beat for the new content to lay out and paint before it is uncovered,
       then the panels part. Clearing busy waits for them to finish leaving. */
    setTimeout(function () { curtain.classList.remove('shut'); }, HOLD());
    setTimeout(function () {
      curtain.classList.remove('busy');
      busy = false;
    }, HOLD() + DUR() + 60);
  }

  /* ---------------------------------------------------------------------------
     Close, fetch, swap, open
     ------------------------------------------------------------------------ */
  function navigate(url, title, push) {
    if (busy) return;
    busy = true;

    curtain.classList.add('busy');
    if (label) label.textContent = title;
    curtain.classList.add('shut');

    var settled = false;   // guards against the retry and the timeout racing
    var html    = null;

    /* Started immediately, so the network runs during the closing animation
       rather than after it. On a warm cache the page is usually already here
       by the time the panels meet. */
    fetch(url, { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (text) { html = text; })
      .catch(function () { html = null; });

    /* Fires when the panels have met, so the swap is never visible. */
    setTimeout(function attempt() {
      if (settled) return;

      if (!html) {
        /* Nothing back yet, or the fetch failed. One short grace period, then
           give up and let the browser do it the ordinary way.

           This branch is the difference between a slow network and a site that
           appears to have frozen. Nobody may ever be left behind a curtain that
           does not open. */
        setTimeout(function () {
          if (settled) return;
          settled = true;

          if (html) {
            swap(html, url, push);
          } else {
            location.href = url;   // full page load; the curtain goes with it
          }
        }, GRACE);
        return;
      }

      settled = true;
      swap(html, url, push);
    }, DUR());
  }

  /* ---------------------------------------------------------------------------
     Click interception

     Delegated from the document, so links inside swapped content are covered
     without rebinding. Everything below is a case that must keep behaving like
     an ordinary link — each one is a real thing a visitor does.
     ------------------------------------------------------------------------ */
  document.addEventListener('click', function (e) {
    if (reduce) return;              // no curtain at all; plain navigation
    if (!curtain || !main) return;   // markup missing; do not intercept

    /* Someone else already handled it. */
    if (e.defaultPrevented) return;

    /* Middle click opens a tab, right click opens the menu. Only button 0. */
    if (e.button !== 0) return;

    /* Modifiers open in a new tab or window, or download. Hijacking these is
       the single most irritating thing a transition script can do. */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;

    var href = a.getAttribute('href');
    if (!href) return;                                   // anchor with no href

    /* target="_blank" and named windows go elsewhere entirely. */
    if (a.target && a.target !== '_self') return;

    if (a.hasAttribute('download')) return;              // saves a file
    if (a.hasAttribute('data-no-transition')) return;    // explicit opt-out

    /* Other schemes hand off to the OS, and a bare hash is an in-page jump. */
    if (/^(mailto:|tel:|sms:|#)/i.test(href)) return;

    var url;
    try {
      url = new URL(a.href, location.href);
    } catch (err) {
      return;                                            // unparseable href
    }

    if (url.origin !== location.origin) return;          // another site

    /* Already here. Covers "/about" from /about, and "/about#team" too, which
       must stay an in-page jump rather than a full transition to the same page. */
    if (url.pathname === location.pathname && url.search === location.search) {
      return;
    }

    e.preventDefault();

    /* The link is about to be replaced. Left focused, the ring persists on a
       detached node and the next Tab press starts from the top of the document. */
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }

    navigate(url.pathname + url.search, labelFor(a), true);
  });

  /* ---------------------------------------------------------------------------
     Back and forward
     ------------------------------------------------------------------------ */
  window.addEventListener('popstate', function () {
    /* Never intercepted, so these are real browser navigations. */
    if (reduce || !curtain || !main) return;

    /* A transition is already running and the address bar has now moved out
       from under it. Rather than let the URL and the DOM disagree, take the
       reliable exit. */
    if (busy) {
      location.reload();
      return;
    }

    /* location already reflects the entry being restored. push=false, or every
       Back press would add a new entry and the button would stop working. */
    navigate(location.pathname + location.search, 'Loading', false);
  });

  /* ---------------------------------------------------------------------------
     First load
     ------------------------------------------------------------------------ */

  activate(document);

  if (reduce) {
    /* The stylesheet already hides it; removing it means .boot cannot cover
       anything even if the media query is somehow not applied. */
    if (curtain) curtain.remove();

  } else if (curtain && curtain.classList.contains('boot')) {
    /* The CSS animation is what opens it — see the FIRST LOAD note in the
       stylesheet. All that is left is to drop the class once the panels have
       gone, handing them back to the transition rules. The animation ends
       exactly where those rules park them, so nothing moves at the handover. */
    setTimeout(function () {
      curtain.classList.remove('boot');
    }, BOOT() + DUR() + 60);
  }
})();
