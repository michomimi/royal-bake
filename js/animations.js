/* =====================================================================
   ROYAL BAKE — animations.js
   Advanced motion layer. Progressive enhancement only — the site works
   fully without this file. Everything here bails out cleanly when the
   user prefers reduced motion.
   ===================================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Signal to CSS that JS-driven effects are live. Do this even under
  // reduced-motion so the reduced-motion CSS rules can neutralise them.
  root.classList.add("js-anim");

  const raf = window.requestAnimationFrame.bind(window);
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* =================================================================
     0. HERO PHOTO SLIDESHOW
     Full-bleed food photography behind the hero copy with a warm dark
     scrim. Clean GPU-composited cross-fades only (no continuous zoom) so
     the frosted header has nothing moving to re-blur — that's what keeps
     scrolling smooth. Swap SLIDES for your own images/menu/*.jpg anytime.
     ================================================================= */
  (function heroSlideshow() {
    const hero = $(".hero");
    if (!hero) return;

    // Curated, verified Mediterranean / bakery photography (Pexels, free
    // to use). ?w= keeps them sharp but reasonably sized. To use your own
    // photos, just replace these strings with e.g. "images/menu/bg-1.jpg".
    const SLIDES = [
      "https://images.pexels.com/photos/27359350/pexels-photo-27359350.jpeg", // hand pulling manoushe
      "https://images.pexels.com/photos/28104857/pexels-photo-28104857.jpeg", // flatbread w/ herbs & lemon
      "https://images.pexels.com/photos/5191851/pexels-photo-5191851.jpeg",  // breakfast mezze spread
      "https://images.pexels.com/photos/8029196/pexels-photo-8029196.jpeg",  // charcoal grill / BBQ
      "https://images.pexels.com/photos/34349100/pexels-photo-34349100.jpeg", // za'atar baked buns
      "https://images.pexels.com/photos/6419394/pexels-photo-6419394.jpeg",  // mezze dips with pita
    ].map((u) => (u.startsWith("http") ? u + "?auto=compress&cs=tinysrgb&w=1600" : u));

    // Build slideshow + scrim, insert behind the existing hero content.
    const show = document.createElement("div");
    show.className = "hero-slideshow";
    show.setAttribute("aria-hidden", "true");
    const slides = SLIDES.map((src) => {
      const s = document.createElement("div");
      s.className = "hero-slide";
      s.style.backgroundImage = `url("${src}")`;
      show.appendChild(s);
      return s;
    });

    const scrim = document.createElement("div");
    scrim.className = "hero-scrim";
    scrim.setAttribute("aria-hidden", "true");

    hero.insertBefore(scrim, hero.firstChild);
    hero.insertBefore(show, hero.firstChild);
    hero.classList.add("has-slideshow");

    // Dots — placed in the copy flow so they line up with the text.
    const dotsWrap = document.createElement("div");
    dotsWrap.className = "hero-dots";
    dotsWrap.setAttribute("role", "tablist");
    dotsWrap.setAttribute("aria-label", "Hero images");
    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Show hero image " + (i + 1));
      b.addEventListener("click", () => go(i, true));
      dotsWrap.appendChild(b);
      return b;
    });
    const copy = $(".hero-copy") || hero;
    copy.appendChild(dotsWrap);

    let idx = 0;
    let timer = null;
    const INTERVAL = 5200;

    function paint() {
      slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    }
    function go(n, userDriven) {
      idx = (n + slides.length) % slides.length;
      paint();
      if (userDriven) restart();
    }
    function next() { go(idx + 1); }
    function restart() {
      if (timer) clearInterval(timer);
      if (!reduce) timer = setInterval(next, INTERVAL);
    }

    paint();       // show first slide immediately
    restart();     // begin auto-advance (skipped under reduced-motion)

    // Decode the remaining photos one at a time, off the critical path, so
    // the first paint isn't held up decoding six large JPEGs at once.
    let p = 1;
    const preloadNext = () => {
      if (p >= SLIDES.length) return;
      const im = new Image();
      im.onload = im.onerror = () => { p++; schedulePreload(); };
      im.src = SLIDES[p];
    };
    const schedulePreload = () => {
      if ("requestIdleCallback" in window) requestIdleCallback(preloadNext, { timeout: 1200 });
      else setTimeout(preloadNext, 400);
    };
    schedulePreload();

    // Pause while the tab is hidden — saves cycles, resyncs cleanly.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { if (timer) clearInterval(timer); }
      else restart();
    });
  })();

  /* =================================================================
     0.5 SECTION DECOR — brand line-art motifs that parallax on scroll
     Injects a .deco layer (faint texture + corner motifs) behind the
     content of every section below the hero, then drifts each motif at
     its own rate as you scroll. Motifs are always placed (static, tasteful
     decor); the drift only runs when motion is allowed. Layout-free scroll
     engine, so it doesn't reintroduce jank.
     ================================================================= */
  (function sectionDecor() {
    // Compact SVG motifs drawn in the brand's line-art style. Colour +
    // stroke come from CSS (currentColor), so markup stays tiny.
    const SVG = {
      ring:  `<svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="95"/><circle cx="100" cy="100" r="66"/><circle cx="100" cy="100" r="4"/></svg>`,
      arch:  `<svg viewBox="0 0 140 180"><path d="M14 180 V70 C14 33 41 8 70 8 C99 8 126 33 126 70 V180"/><path d="M32 180 V73 C32 44 49 24 70 24 C91 24 108 44 108 73 V180"/></svg>`,
      sprig: `<svg viewBox="0 0 80 200"><path d="M40 198 L40 8"/><path d="M40 58 C24 50 16 38 14 24"/><path d="M40 58 C56 50 64 38 66 24"/><path d="M40 104 C26 96 18 86 16 72"/><path d="M40 104 C54 96 62 86 64 72"/><path d="M40 150 C28 142 22 132 20 120"/><path d="M40 150 C52 142 58 132 60 120"/><ellipse cx="12" cy="20" rx="7" ry="12"/><ellipse cx="68" cy="20" rx="7" ry="12"/></svg>`,
      seeds: `<svg viewBox="0 0 160 160"><ellipse cx="30" cy="40" rx="6" ry="3" transform="rotate(-20 30 40)"/><ellipse cx="72" cy="24" rx="6" ry="3" transform="rotate(12 72 24)"/><ellipse cx="122" cy="46" rx="6" ry="3" transform="rotate(-8 122 46)"/><ellipse cx="50" cy="82" rx="6" ry="3" transform="rotate(24 50 82)"/><ellipse cx="100" cy="92" rx="6" ry="3" transform="rotate(-16 100 92)"/><ellipse cx="26" cy="120" rx="6" ry="3" transform="rotate(10 26 120)"/><ellipse cx="78" cy="132" rx="6" ry="3" transform="rotate(-22 78 132)"/><ellipse cx="132" cy="120" rx="6" ry="3" transform="rotate(16 132 120)"/><ellipse cx="146" cy="84" rx="6" ry="3" transform="rotate(-6 146 84)"/></svg>`,
      star:  `<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.8 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z"/></svg>`,
    };
    const ASPECT = { ring: 1, arch: 140 / 180, sprig: 80 / 200, seeds: 1, star: 1 };

    // 2 motifs per section, varied in shape / colour / corner / drift speed.
    const DECOR = [
      { sel: ".about", items: [
        { m: "sprig", pos: "tr", size: 156, speed:  64, c: "c-olive" },
        { m: "ring",  pos: "bl", size: 240, speed: -54, rot: 22, c: "c-gold" },
      ]},
      { sel: ".menu-section", items: [
        { m: "arch",  pos: "tl", size: 210, speed:  58, c: "c-gold" },
        { m: "seeds", pos: "br", size: 190, speed: -46, c: "c-wine" },
      ]},
      { sel: ".order-section", items: [
        { m: "ring",  pos: "tr", size: 220, speed: -62, rot: -20, c: "c-olive" },
        { m: "star",  pos: "bl", size: 96,  speed:  52, rot: 40, c: "c-gold" },
      ]},
      { sel: ".chefs", items: [
        { m: "arch",  pos: "tr", size: 220, speed:  60, c: "c-gold" },
        { m: "sprig", pos: "bl", size: 156, speed: -52, c: "c-olive" },
      ]},
      { sel: ".contact", items: [
        { m: "ring",  pos: "tl", size: 210, speed:  56, rot: 18, c: "c-wine" },
        { m: "seeds", pos: "br", size: 180, speed: -46, c: "c-gold" },
      ]},
    ];

    const motifs = [];
    DECOR.forEach(({ sel, items }) => {
      const section = $(sel);
      if (!section) return;
      section.classList.add("has-deco");
      const deco = document.createElement("div");
      deco.className = "deco";
      deco.setAttribute("aria-hidden", "true");
      items.forEach((it) => {
        const el = document.createElement("div");
        el.className = `motif motif--${it.m} ${it.pos} ${it.c}`;
        const h = it.size, w = Math.round(it.size * (ASPECT[it.m] || 1));
        el.style.width = w + "px";
        el.style.height = h + "px";
        el.dataset.speed = it.speed;
        if (it.rot) el.dataset.rot = it.rot;
        el.innerHTML = SVG[it.m] || "";
        deco.appendChild(el);
        motifs.push(el);
      });
      section.insertBefore(deco, section.firstChild);
    });

    if (reduce || !motifs.length) return; // motifs placed; skip the drift

    // Layout-free parallax: measure document-relative centres once, then read
    // only window.scrollY while scrolling (no per-frame reflow).
    let boxes = [];
    function measure() {
      const sc = window.scrollY;
      boxes = motifs.map((el) => {
        const r = el.getBoundingClientRect();
        return { el, mid: r.top + sc + r.height / 2,
                 speed: +el.dataset.speed || 0, rot: +el.dataset.rot || 0 };
      });
    }
    let ticking = false;
    function update() {
      const vh = window.innerHeight, sc = window.scrollY;
      for (const b of boxes) {
        const progress = (vh / 2 - (b.mid - sc)) / vh;   // ~ -0.5 .. +0.5
        const y = (progress * b.speed).toFixed(1);
        b.el.style.transform = b.rot
          ? `translate3d(0, ${y}px, 0) rotate(${(progress * b.rot).toFixed(1)}deg)`
          : `translate3d(0, ${y}px, 0)`;
      }
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; raf(update); } }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { measure(); update(); }, { passive: true });
    window.addEventListener("load", () => { measure(); update(); });
    measure(); update();
  })();

  /* =================================================================
     1. SCROLL PROGRESS BAR
     ================================================================= */
  (function scrollProgress() {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    let ticking = false;
    function update() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      bar.style.transform = `scaleX(${p})`;
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; raf(update); }
    }, { passive: true });
    update();
  })();

  /* =================================================================
     2. RICH SCROLL REVEALS
     Upgrade every .reveal to a directional variant, and add stagger
     to grid children. Uses one IntersectionObserver.
     ================================================================= */
  (function reveals() {
    // Map existing .reveal elements onto richer variants where it reads well.
    $$(".reveal").forEach((el) => {
      if (el.hasAttribute("data-reveal")) return;
      el.setAttribute("data-reveal", el.dataset.revealHint || "up");
    });

    // Directional hints for a few signature blocks.
    const setDir = (sel, dir) => $$(sel).forEach((el) => el.setAttribute("data-reveal", dir));
    setDir(".about-media .reveal, .hero-media.reveal, .contact-side.reveal", "right");
    setDir(".about-copy .reveal, .contact-copy .reveal", "left");
    $$(".arch img").forEach((img) => {
      const card = img.closest("[data-reveal]");
      if (card) card.setAttribute("data-reveal", "mask");
    });

    // Stagger children inside grids.
    const stagger = (parentSel, step = 90) => {
      $$(parentSel).forEach((grid) => {
        $$(":scope > [data-reveal]", grid).forEach((el, i) => {
          el.style.setProperty("--reveal-delay", (i % 6) * step + "ms");
        });
      });
    };
    stagger(".signature-grid");
    stagger(".delivery-grid");
    stagger(".chef-grid", 120);
    stagger(".contact-list");

    if (!("IntersectionObserver" in window)) {
      $$("[data-reveal]").forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

    $$("[data-reveal]").forEach((el) => io.observe(el));

    // Menu grid re-renders dynamically — observe new dishes as they appear.
    const grid = $("#menuGrid");
    if (grid) {
      const mo = new MutationObserver(() => {
        $$("[data-reveal]:not(.in)", grid).forEach((el) => io.observe(el));
        // also give freshly rendered .reveal items the attribute
        $$(".reveal:not([data-reveal])", grid).forEach((el, i) => {
          el.setAttribute("data-reveal", "up");
          el.style.setProperty("--reveal-delay", (i % 4) * 70 + "ms");
          io.observe(el);
        });
      });
      mo.observe(grid, { childList: true });
    }
  })();

  /* =================================================================
     3. HERO INTRO — split headline into animated lines
     ================================================================= */
  (function heroIntro() {
    const hero = $(".hero");
    const title = $(".hero-title");
    if (!hero || !title) return;

    if (!reduce) {
      // Split the title into visual lines. Simplest robust approach:
      // wrap the whole content as one masked line per <br>-free segment.
      // The title has an <em>; keep it. We wrap top-level nodes into lines
      // split on <br>, falling back to the whole thing as one line.
      const html = title.innerHTML;
      const segments = html.split(/<br\s*\/?>/i);
      title.innerHTML = segments
        .map((seg, i) =>
          `<span class="line"><span style="--line-delay:${120 + i * 120}ms">${seg}</span></span>`)
        .join("");
    }

    // Timed rise for sub / cta / trust.
    const rises = [".hero-sub", ".hero-cta", ".hero-trust"];
    rises.forEach((sel, i) => {
      const el = $(sel);
      if (el) { el.setAttribute("data-rise", ""); el.style.setProperty("--rise-delay", 500 + i * 130 + "ms"); }
    });

    // Light it up on next frame so transitions run.
    raf(() => raf(() => hero.classList.add("is-lit")));
  })();

  /* =================================================================
     4. COUNT-UP STAT ("10,000+")
     ================================================================= */
  (function countUp() {
    const el = $(".hero-trust strong");
    if (!el) return;
    const raw = el.textContent;
    const m = raw.match(/([\d,]+)/);
    if (!m) return;
    const target = parseInt(m[1].replace(/,/g, ""), 10);
    const suffix = raw.slice(m.index + m[1].length); // e.g. "+"
    const prefix = raw.slice(0, m.index);
    el.setAttribute("data-count", "");
    if (reduce) return;

    let done = false;
    const fmt = (n) => prefix + n.toLocaleString("en-US") + suffix;
    el.textContent = fmt(0);

    const run = () => {
      const dur = 1600, start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      function tick(now) {
        const t = clamp((now - start) / dur, 0, 1);
        el.textContent = fmt(Math.round(target * ease(t)));
        if (t < 1) raf(tick);
      }
      raf(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !done) { done = true; run(); io.disconnect(); }
      });
    }, { threshold: 0.6 });
    io.observe(el);
  })();

  /* =================================================================
     5. SCROLL-SPY NAV — sliding indicator + active link
     ================================================================= */
  (function scrollSpy() {
    const nav = $("#primaryNav");
    if (!nav) return;
    const links = $$(".nav-link", nav);
    const ind = document.createElement("span");
    ind.className = "nav-ind";
    nav.appendChild(ind);

    const sections = links
      .map((l) => {
        const id = l.getAttribute("href");
        return id && id.startsWith("#") ? { link: l, sec: $(id) } : null;
      })
      .filter((x) => x && x.sec);

    let current = null;
    function moveTo(link) {
      if (!link) { ind.style.opacity = "0"; return; }
      ind.style.opacity = "1";
      ind.style.width = link.offsetWidth + "px";
      ind.style.transform = `translateX(${link.offsetLeft}px)`;
    }
    function setCurrent(link) {
      if (link === current) return;
      current = link;
      links.forEach((l) => l.classList.toggle("is-current", l === link));
      if (window.innerWidth > 900) moveTo(link);
    }

    const io = new IntersectionObserver((entries) => {
      // Choose the section most in view.
      entries.forEach((e) => { e.target.__ratio = e.isIntersecting ? e.intersectionRatio : 0; });
      let best = null, bestR = 0;
      sections.forEach(({ sec, link }) => {
        const r = sec.__ratio || 0;
        if (r > bestR) { bestR = r; best = link; }
      });
      if (best) setCurrent(best);
    }, { threshold: [0.15, 0.4, 0.7], rootMargin: `-${root.style.getPropertyValue("--header-h") || "76px"} 0px -40% 0px` });

    sections.forEach(({ sec }) => io.observe(sec));
    window.addEventListener("resize", () => { if (window.innerWidth > 900) moveTo(current); }, { passive: true });
  })();

  if (reduce) return; // everything below is pure motion flourish

  /* =================================================================
     6. PARALLAX on arched media
     ================================================================= */
  (function parallax() {
    const els = $$(".hero-media .arch, .about-media .arch");
    els.forEach((el) => el.setAttribute("data-parallax", ""));
    // Only parallax elements that are actually laid out (the hero arch is
    // hidden under the slideshow).
    const targets = els.filter((el) => el.offsetParent !== null);
    if (!targets.length) return;

    // Measure document-relative positions ONCE (and on resize/load). During
    // scroll we read only window.scrollY — never the layout — so there's no
    // per-frame reflow, which is what makes scrolling smooth.
    let boxes = [];
    function measure() {
      const sc = window.scrollY;
      boxes = targets.map((el) => {
        const r = el.getBoundingClientRect();
        return { el, top: r.top + sc, h: r.height };
      });
    }
    let ticking = false;
    function update() {
      const vh = window.innerHeight, sc = window.scrollY;
      for (const b of boxes) {
        const center = b.top + b.h / 2 - sc;      // distance from viewport top
        if (center < -b.h || center > vh + b.h) continue;
        const progress = (vh / 2 - center) / (vh / 2);
        b.el.style.setProperty("--parallax", (progress * 22).toFixed(1) + "px");
      }
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; raf(update); } }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { measure(); update(); }, { passive: true });
    window.addEventListener("load", () => { measure(); update(); });
    measure(); update();
  })();

  /* =================================================================
     7. 3D TILT + GLARE on cards (pointer-capable devices only)
     ================================================================= */
  (function tilt() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cards = $$(".sig-card, .dish, .delivery-card:not([data-soon]), .chef-card");
    const MAX = 7; // degrees

    function bind(card) {
      card.classList.add("tilt");
      let rect = null, frame = 0, tx = 0, ty = 0, gx = 50, gy = 50, active = false;

      function render() {
        card.style.setProperty("--ry", tx.toFixed(2) + "deg");
        card.style.setProperty("--rx", ty.toFixed(2) + "deg");
        card.style.setProperty("--mx", gx.toFixed(1) + "%");
        card.style.setProperty("--my", gy.toFixed(1) + "%");
        frame = 0;
      }
      function schedule() { if (!frame) frame = raf(render); }

      card.addEventListener("pointerenter", () => {
        rect = card.getBoundingClientRect();
        active = true;
        card.classList.add("is-tilting");
        card.style.setProperty("--tilt-lift", "-6px");
      });
      card.addEventListener("pointermove", (e) => {
        if (!active || !rect) return;
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        tx = lerp(-MAX, MAX, clamp(px, 0, 1));      // rotateY from X
        ty = lerp(MAX, -MAX, clamp(py, 0, 1));      // rotateX from Y
        gx = clamp(px * 100, 0, 100);
        gy = clamp(py * 100, 0, 100);
        schedule();
      });
      const reset = () => {
        active = false;
        tx = ty = 0; gx = gy = 50;
        card.classList.remove("is-tilting");
        card.style.setProperty("--tilt-lift", "0px");
        schedule();
      };
      card.addEventListener("pointerleave", reset);
      card.addEventListener("pointercancel", reset);
    }

    cards.forEach(bind);

    // New menu cards appear on tab switch — tilt-bind them too.
    const grid = $("#menuGrid");
    if (grid) {
      const mo = new MutationObserver(() => {
        $$(".dish:not(.tilt)", grid).forEach(bind);
      });
      mo.observe(grid, { childList: true });
    }
  })();

  /* =================================================================
     8. MAGNETIC BUTTONS
     ================================================================= */
  (function magnetic() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const btns = $$(".btn-primary, .btn-ghost, .cart-btn, .social");
    const STRENGTH = 0.32, RADIUS = 26;

    btns.forEach((btn) => {
      btn.classList.add("magnetic");
      let rect = null, frame = 0, x = 0, y = 0;
      const apply = () => {
        btn.style.setProperty("--mag-x", x.toFixed(1) + "px");
        btn.style.setProperty("--mag-y", y.toFixed(1) + "px");
        frame = 0;
      };
      btn.addEventListener("pointerenter", () => { rect = btn.getBoundingClientRect(); });
      btn.addEventListener("pointermove", (e) => {
        if (!rect) rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        x = clamp(dx * STRENGTH, -RADIUS, RADIUS);
        y = clamp(dy * STRENGTH, -RADIUS, RADIUS);
        if (!frame) frame = raf(apply);
      });
      btn.addEventListener("pointerleave", () => {
        x = y = 0;
        if (!frame) frame = raf(apply);
      });
    });
  })();

})();
