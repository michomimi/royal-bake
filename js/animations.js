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
    const items = $$(".hero-media .arch, .about-media .arch").map((el) => {
      el.setAttribute("data-parallax", "");
      return el;
    });
    if (!items.length) return;

    let ticking = false;
    function update() {
      const vh = window.innerHeight;
      items.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        // -1 (below) .. 1 (above), 0 when centred
        const progress = (vh / 2 - (r.top + r.height / 2)) / (vh / 2);
        el.style.setProperty("--parallax", (progress * 26).toFixed(1) + "px");
      });
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; raf(update); }
    }, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
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
