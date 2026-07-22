/* =====================================================================
   ROYAL BAKE — site.js
   Shared layout + behaviour for EVERY page. Injects the header, footer,
   cart drawer and checkout modal once (single source of truth), then
   wires navigation, the cart (persisted in localStorage across pages),
   checkout and the contact form. Every block guards on its own DOM, so
   page-specific pieces simply no-op where they don't apply.
   ===================================================================== */

const CONFIG = {
  restaurant: "Royal Bake",
  phone: "(403) 680 4050",
  phoneHref: "4036804050",
  orderEmail: "royalbake2025@gmail.com",
  currency: "$",
  address: "3334 32 St NE, Calgary, AB T1Y 6B9",
  hours: "Open daily · 9 AM – 8 PM",
  maps: "https://maps.google.com/?q=3334+32+St+NE,+Calgary,+AB+T1Y+6B9",
  instagram: "https://www.instagram.com/royalbakeyyc/",
  facebook: "https://www.facebook.com/profile.php?id=61572416531773",
  whatsapp: "https://wa.me/14036804050",
};

/* ---------- tiny helpers (shared globally) ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const money = (n) => CONFIG.currency + Number(n).toFixed(2);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const PAGE = document.body.dataset.page || "home";

/* =====================================================================
   SHARED MARKUP — header, footer, cart drawer, checkout modal
   ===================================================================== */
const NAV = [
  { page: "home",    label: "Home",    href: "index.html" },
  { page: "about",   label: "About",   href: "about.html" },
  { page: "menu",    label: "Menu",    href: "menu.html" },
  { page: "contact", label: "Contact", href: "contact.html" },
];

const IC_PHONE = `<svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><path d="M6.6 10.8a15.9 15.9 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11.4 11.4 0 003.6.58 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.58 3.6 1 1 0 01-.24 1z"/></svg>`;
const IC_BAG = `<svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><path d="M6 7h12l-1 12.2a1.8 1.8 0 01-1.8 1.6H8.8A1.8 1.8 0 017 19.2L6 7z"/><path d="M9 9V6.5a3 3 0 016 0V9"/></svg>`;
const IC_X = `<svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
const SOCIALS = `
  <a href="${CONFIG.instagram}" class="social" target="_blank" rel="noopener" aria-label="Royal Bake on Instagram"><svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a>
  <a href="${CONFIG.facebook}" class="social" target="_blank" rel="noopener" aria-label="Royal Bake on Facebook"><svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.4-1.3 1.4-1.3H17V2.6h-2.4C11.9 2.6 11 4.2 11 6.4v2.1H8.6V12H11v9h3v-9h2.2l.4-3.5z"/></svg></a>
  <a href="${CONFIG.whatsapp}" class="social" target="_blank" rel="noopener" aria-label="Message Royal Bake on WhatsApp"><svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><path d="M12 3a9 9 0 00-7.7 13.6L3 21l4.5-1.2A9 9 0 1012 3z"/><path d="M8.6 8.5c.2-.4.4-.4.6-.4h.4c.2 0 .4 0 .5.4l.6 1.4c.1.2 0 .3 0 .4l-.4.5c-.1.2-.2.3 0 .5a5.5 5.5 0 002.5 2.2c.3.1.4.1.5-.1l.5-.6c.2-.2.3-.1.5 0l1.3.7c.2.1.3.2.3.4"/></svg></a>`;

function headerHTML() {
  const links = NAV.map((n) =>
    `<a href="${n.href}" class="nav-link${n.page === PAGE ? " is-current" : ""}"${n.page === PAGE ? ' aria-current="page"' : ""} data-page="${n.page}">${n.label}</a>`
  ).join("");
  return `<header class="site-header" id="siteHeader">
    <div class="wrap header-inner">
      <a href="index.html" class="brand" aria-label="Royal Bake home"><img src="images/logo.png" alt="Royal Bake" class="brand-logo" /></a>
      <nav class="nav" id="primaryNav" aria-label="Primary">${links}</nav>
      <div class="header-actions">
        <a href="tel:${CONFIG.phoneHref}" class="header-phone" aria-label="Call Royal Bake">${IC_PHONE}<span>(403)&nbsp;680&nbsp;4050</span></a>
        <button class="cart-btn" id="cartBtn" aria-label="Open your order" aria-haspopup="dialog">${IC_BAG}<span class="cart-count" id="cartCount" data-empty="true">0</span></button>
        <button class="hamburger" id="hamburger" aria-label="Menu" aria-expanded="false" aria-controls="primaryNav"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>`;
}

function footerHTML() {
  const links = NAV.map((n) => `<a href="${n.href}">${n.label}</a>`).join("");
  return `<footer class="site-footer">
    <div class="wrap footer-grid">
      <div class="footer-brand">
        <img src="images/logo.png" alt="Royal Bake" class="footer-logo" />
        <p>Authentic Mediterranean baking, made fresh daily in Calgary. Come hungry, leave happy.</p>
        <div class="footer-socials">${SOCIALS}</div>
      </div>
      <nav class="footer-nav" aria-label="Footer"><h4>Explore</h4>${links}</nav>
      <div class="footer-visit">
        <h4>Visit</h4>
        <p>3334 32 St NE<br>Calgary, AB T1Y 6B9</p>
        <p>${CONFIG.hours}</p>
        <a href="tel:${CONFIG.phoneHref}">(403) 680 4050</a>
      </div>
    </div>
    <div class="wrap footer-bottom"><p>© <span id="year"></span> Royal Bake · Mediterranean Cuisine. All rights reserved.</p></div>
  </footer>`;
}

const cartHTML = `
  <div class="overlay" id="overlay" hidden></div>
  <aside class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-label="Your order" aria-hidden="true">
    <div class="cart-head"><h3>Your Order</h3><button class="icon-btn" id="cartClose" aria-label="Close order">${IC_X}</button></div>
    <div class="cart-body" id="cartBody"></div>
    <div class="cart-foot" id="cartFoot">
      <div class="cart-total"><span>Subtotal</span><strong id="cartSubtotal">$0.00</strong></div>
      <p class="cart-fine">Taxes calculated at pickup. This starts your order — we'll confirm by phone.</p>
      <button class="btn btn-primary btn-block" id="checkoutBtn" disabled>Checkout</button>
    </div>
  </aside>`;

const modalHTML = `
  <div class="modal" id="checkoutModal" role="dialog" aria-modal="true" aria-label="Checkout" aria-hidden="true">
    <div class="modal-card">
      <button class="icon-btn modal-close" id="checkoutClose" aria-label="Close checkout">${IC_X}</button>
      <div class="checkout-step" id="checkoutForm">
        <h3>Almost There</h3>
        <p class="modal-sub">Choose how you'd like your order and add your details.</p>
        <div class="seg" role="radiogroup" aria-label="Order type">
          <button type="button" class="seg-btn is-active" data-type="Pickup" aria-pressed="true">Pickup</button>
          <button type="button" class="seg-btn" data-type="In-Store" aria-pressed="false">In-Store</button>
        </div>
        <div class="field"><label for="oName">Full name</label><input id="oName" type="text" autocomplete="name" required /></div>
        <div class="field"><label for="oPhone">Phone</label><input id="oPhone" type="tel" autocomplete="tel" required /></div>
        <div class="field" id="timeField"><label for="oTime">Preferred time</label><input id="oTime" type="text" placeholder="e.g. Today, 2:30 PM" /></div>
        <div class="field"><label for="oNotes">Notes (optional)</label><textarea id="oNotes" rows="2" placeholder="Allergies, special requests…"></textarea></div>
        <div class="checkout-summary" id="checkoutSummary"></div>
        <button class="btn btn-primary btn-block" id="placeOrder">Place Order</button>
        <p class="form-status" id="orderStatus" role="status"></p>
      </div>
      <div class="checkout-step" id="checkoutDone" hidden>
        <div class="done-mark" aria-hidden="true"><svg viewBox="0 0 52 52" class="ic"><circle cx="26" cy="26" r="24"/><path d="M15 27l8 8 15-16"/></svg></div>
        <h3>Order Received!</h3>
        <p class="modal-sub" id="doneMsg"></p>
        <div class="done-actions">
          <a href="tel:${CONFIG.phoneHref}" class="btn btn-primary btn-block">Call to Confirm · (403) 680 4050</a>
          <a href="#" class="btn btn-ghost btn-block" id="emailOrder">Email My Order</a>
        </div>
        <button class="link-btn" id="orderAgain">Start a new order</button>
      </div>
    </div>
  </div>`;

// Inject the shared chrome around the page's own <main>.
document.body.insertAdjacentHTML("afterbegin", headerHTML());
document.body.insertAdjacentHTML("beforeend", footerHTML() + cartHTML + modalHTML);

/* =====================================================================
   NAV — hamburger, sliding indicator, header shadow on scroll
   ===================================================================== */
const header = $("#siteHeader");
const nav = $("#primaryNav");
const hamburger = $("#hamburger");

hamburger.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", open ? "true" : "false");
});
$$(".nav-link", nav).forEach((a) => a.addEventListener("click", () => {
  nav.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
}));

// Sliding underline that sits beneath the active page's link.
(function navIndicator() {
  const ind = document.createElement("span");
  ind.className = "nav-ind";
  nav.appendChild(ind);
  const current = $(".nav-link.is-current", nav);
  const place = () => {
    if (!current || window.innerWidth <= 900) { ind.style.opacity = "0"; return; }
    ind.style.opacity = "1";
    ind.style.width = current.offsetWidth + "px";
    ind.style.transform = `translateX(${current.offsetLeft}px)`;
  };
  place();
  window.addEventListener("resize", place, { passive: true });
  window.addEventListener("load", place);
})();

const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* =====================================================================
   CART — persisted across pages via localStorage
   ===================================================================== */
const CART_KEY = "rb_cart_v1";
let cart = loadCart();          // [{ name, size, price, qty }]

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
}

const cartCountEl = $("#cartCount");
const cartBodyEl = $("#cartBody");
const cartSubtotalEl = $("#cartSubtotal");
const checkoutBtn = $("#checkoutBtn");

const cartKey = (name, size) => name + "||" + size;
const cartSubtotal = () => cart.reduce((s, l) => s + l.price * l.qty, 0);
const cartQty = () => cart.reduce((s, l) => s + l.qty, 0);

function addToCart(name, size, price) {
  const key = cartKey(name, size);
  const found = cart.find((l) => cartKey(l.name, l.size) === key);
  if (found) found.qty++;
  else cart.push({ name, size, price, qty: 1 });
  saveCart(); renderCart(); bumpCart();
  toast(`Added ${name}${size ? " · " + size : ""}`);
}
function changeQty(key, delta) {
  const line = cart.find((l) => cartKey(l.name, l.size) === key);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) cart = cart.filter((l) => cartKey(l.name, l.size) !== key);
  saveCart(); renderCart();
}
function removeLine(key) { cart = cart.filter((l) => cartKey(l.name, l.size) !== key); saveCart(); renderCart(); }

function renderCart() {
  const qty = cartQty();
  cartCountEl.textContent = qty;
  cartCountEl.dataset.empty = qty === 0 ? "true" : "false";

  if (!cart.length) {
    cartBodyEl.innerHTML = `<div class="cart-empty">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l-1 12.2a1.8 1.8 0 01-1.8 1.6H8.8A1.8 1.8 0 017 19.2L6 7z"/><path d="M9 9V6.5a3 3 0 016 0V9"/></svg>
      <p>Your order is empty.<br>Add something delicious from the menu.</p>
    </div>`;
    checkoutBtn.disabled = true;
  } else {
    cartBodyEl.innerHTML = cart.map((l) => {
      const key = cartKey(l.name, l.size);
      return `<div class="cart-item">
        <div class="cart-item-main">
          <div class="cart-item-name">${esc(l.name)}</div>
          ${l.size ? `<div class="cart-item-sz">${esc(l.size)}</div>` : ""}
          <div class="cart-item-price">${money(l.price * l.qty)}</div>
          <div class="qty">
            <button data-key="${esc(key)}" data-act="dec" aria-label="Decrease quantity">–</button>
            <span>${l.qty}</span>
            <button data-key="${esc(key)}" data-act="inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-key="${esc(key)}" data-act="rm">Remove</button>
      </div>`;
    }).join("");
    checkoutBtn.disabled = false;
  }
  cartSubtotalEl.textContent = money(cartSubtotal());
}

cartBodyEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const { key, act } = btn.dataset;
  if (act === "inc") changeQty(key, 1);
  else if (act === "dec") changeQty(key, -1);
  else if (act === "rm") removeLine(key);
});

function bumpCart() {
  $("#cartBtn").animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }],
    { duration: 320, easing: "cubic-bezier(.22,.61,.36,1)" }
  );
}

/* toast — brief "added to order" confirmation */
let toastTimer;
function toast(message) {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

/* =====================================================================
   DRAWER + OVERLAY
   ===================================================================== */
const overlay = $("#overlay");
const drawer = $("#cartDrawer");
const modal = $("#checkoutModal");

function showOverlay() { overlay.hidden = false; requestAnimationFrame(() => overlay.classList.add("show")); }
function maybeHideOverlay() {
  if (drawer.classList.contains("open") || modal.classList.contains("open")) return;
  overlay.classList.remove("show");
  setTimeout(() => { if (!overlay.classList.contains("show")) overlay.hidden = true; }, 300);
}
function openDrawer() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); showOverlay(); }
function closeDrawer() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); maybeHideOverlay(); }

$("#cartBtn").addEventListener("click", openDrawer);
$("#cartClose").addEventListener("click", closeDrawer);
overlay.addEventListener("click", () => { closeDrawer(); closeModal(); });

/* =====================================================================
   CHECKOUT MODAL
   ===================================================================== */
const formStep = $("#checkoutForm");
const doneStep = $("#checkoutDone");
let orderType = "Pickup";

function renderCheckoutSummary() {
  const rows = cart.map((l) =>
    `<div class="row"><span>${l.qty}× ${esc(l.name)}${l.size ? " (" + esc(l.size) + ")" : ""}</span><span>${money(l.price * l.qty)}</span></div>`
  ).join("");
  $("#checkoutSummary").innerHTML = rows + `<div class="row total"><span>Subtotal</span><span>${money(cartSubtotal())}</span></div>`;
}
function openModal() {
  if (!cart.length) return;
  renderCheckoutSummary();
  formStep.hidden = false; doneStep.hidden = true;
  $("#orderStatus").textContent = "";
  modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
  showOverlay();
  setTimeout(() => $("#oName").focus(), 350);
}
function closeModal() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); maybeHideOverlay(); }

$("#checkoutBtn").addEventListener("click", () => { closeDrawer(); openModal(); });
$("#checkoutClose").addEventListener("click", closeModal);

$$(".seg-btn").forEach((b) =>
  b.addEventListener("click", () => {
    $$(".seg-btn").forEach((x) => { x.classList.remove("is-active"); x.setAttribute("aria-pressed", "false"); });
    b.classList.add("is-active"); b.setAttribute("aria-pressed", "true");
    orderType = b.dataset.type;
  })
);

function buildOrderText() {
  const name = $("#oName").value.trim();
  const phone = $("#oPhone").value.trim();
  const time = $("#oTime").value.trim();
  const notes = $("#oNotes").value.trim();
  const L = [];
  L.push(`New ${orderType} order — ${CONFIG.restaurant}`, "");
  L.push(`Name: ${name}`, `Phone: ${phone}`);
  if (time) L.push(`Preferred time: ${time}`);
  L.push("", "Order:");
  cart.forEach((l) => L.push(`• ${l.qty}x ${l.name}${l.size ? " (" + l.size + ")" : ""} — ${money(l.price * l.qty)}`));
  L.push("", `Subtotal: ${money(cartSubtotal())} (taxes calculated in store)`);
  if (notes) L.push("", `Notes: ${notes}`);
  return L.join("\n");
}

$("#placeOrder").addEventListener("click", () => {
  const nameInp = $("#oName"), phoneInp = $("#oPhone");
  let ok = true;
  [nameInp, phoneInp].forEach((inp) => {
    const field = inp.closest(".field");
    if (!inp.value.trim()) { field.classList.add("invalid"); ok = false; }
    else field.classList.remove("invalid");
  });
  const status = $("#orderStatus");
  if (!ok) { status.textContent = "Please add your name and phone number."; status.classList.add("err"); return; }
  status.textContent = ""; status.classList.remove("err");

  const subject = `${orderType} order — ${CONFIG.restaurant}`;
  const mailto = `mailto:${CONFIG.orderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildOrderText())}`;
  $("#emailOrder").setAttribute("href", mailto);

  $("#doneMsg").innerHTML = `Thanks, <strong>${esc(nameInp.value.trim())}</strong>! We've noted your <strong>${orderType}</strong> order.<br>Online ordering isn't fully live yet — please call to confirm, or email your order below and we'll have it ready.`;
  formStep.hidden = true; doneStep.hidden = false;
});

$("#orderAgain").addEventListener("click", () => { cart = []; saveCart(); renderCart(); closeModal(); });

document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeDrawer(); closeModal(); } });

/* =====================================================================
   CONTACT FORM (contact page only — mailto, no backend)
   ===================================================================== */
const contactForm = $("#contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#cName"), email = $("#cEmail"), msg = $("#cMsg");
    let ok = true;
    [name, email, msg].forEach((inp) => {
      const field = inp.closest(".field");
      const bad = !inp.value.trim() || (inp.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value.trim()));
      field.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    const status = $("#contactStatus");
    if (!ok) { status.textContent = "Please fill in every field with a valid email."; status.classList.add("err"); return; }
    const body = `From: ${name.value.trim()} <${email.value.trim()}>\n\n${msg.value.trim()}`;
    const mailto = `mailto:${CONFIG.orderEmail}?subject=${encodeURIComponent("Website message from " + name.value.trim())}&body=${encodeURIComponent(body)}`;
    status.classList.remove("err");
    status.textContent = "Opening your email app to send…";
    window.location.href = mailto;
    e.target.reset();
  });
}

/* =====================================================================
   SAME-PAGE SMOOTH SCROLL (for in-page #anchors, e.g. menu.html#order)
   ===================================================================== */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id.length < 2) { if (id === "#") e.preventDefault(); return; }
    const target = document.querySelector(id);
    if (!target || prefersReducedMotion) return;
    e.preventDefault();
    // simple eased scroll
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 72;
    const startY = window.scrollY;
    const destY = Math.max(0, target.getBoundingClientRect().top + startY - headerH);
    const distance = destY - startY;
    const duration = Math.min(1100, Math.max(450, Math.abs(distance) * 0.6));
    let start = null;
    requestAnimationFrame(function step(now) {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / duration);
      window.scrollTo(0, startY + distance * easeInOutCubic(t));
      if (t < 1) requestAnimationFrame(step);
    });
    history.pushState(null, "", id);
  });
});

/* =====================================================================
   SCROLL REVEAL (baseline)
   A dependable observer that adds .in to every .reveal element. animations.js
   layers richer directional variants on top; this guarantees content is
   never left hidden even if the animation layer fails to load.
   ===================================================================== */
(function reveals() {
  if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((el) => el.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  const scan = () => $$(".reveal:not(.in)").forEach((el) => io.observe(el));
  scan();
  const grid = $("#menuGrid");           // menu cards render dynamically
  if (grid) new MutationObserver(scan).observe(grid, { childList: true });
})();

/* =====================================================================
   INIT
   ===================================================================== */
renderCart();
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
