/* ═══════════════════════════════════════════════════════════════
   UNIVERS AUTO — script.js
   Moteur immersif du site vitrine 6 étoiles
   (préloader, slogan, recherche intelligente, galerie, lightbox,
    hologrammes, cartes 3D/Abidjan, formulaire, réseaux, FAБ…)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ── Utilitaires ─────────────────────────────────────────── */
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE    = window.matchMedia("(pointer: fine)").matches;
  const clamp   = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp    = (a, b, t) => a + (b - a) * t;
  const norm    = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const C = window.UNIVERS_AUTO || null;

  /* ═══════════════════════════════════════════════════════════
     1. PRÉLOADER
  ═══════════════════════════════════════════════════════════ */
  const preloader = $("#preloader");
  const preFill   = $("#preloader-fill");
  let preDone = false;

  function finishPreloader() {
    if (preDone) return;
    preDone = true;
    if (preFill) preFill.style.width = "100%";
    setTimeout(() => {
      if (preloader) preloader.classList.add("done");
      document.body.classList.add("loaded");
      startSlogan();
    }, 250);
  }
  if (preloader) {
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + 8 + Math.random() * 16);
      if (preFill) preFill.style.width = p + "%";
      if (p >= 100) { clearInterval(tick); setTimeout(finishPreloader, 200); }
    }, 90);
    window.addEventListener("load", () => setTimeout(finishPreloader, 500));
    setTimeout(finishPreloader, 4200); // filet de sécurité
  } else {
    startSlogan();
  }

  /* ═══════════════════════════════════════════════════════════
     2. SLOGAN ANIMÉ — décodage cybernétique
  ═══════════════════════════════════════════════════════════ */
  const GLYPHS = "▓▒░<>/\\|#$&@%0123456789ABCDEF";

  function scrambleWord(el, delay) {
    const finalText = el.dataset.final || el.textContent;
    const len = finalText.length;
    if (REDUCED) { el.textContent = finalText; return; }
    const dur = 620 + len * 90;
    const t0 = performance.now() + delay;
    function frame(now) {
      if (now < t0) { requestAnimationFrame(frame); return; }
      const t = (now - t0) / dur;
      const solved = Math.floor(clamp(t, 0, 1) * len);
      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = finalText[i];
        if (ch === " ") { out += " "; continue; }
        out += i < solved ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = finalText;
    }
    requestAnimationFrame(frame);
  }

  function startSlogan() {
    $$(".hero-slogan .w").forEach((el, i) => scrambleWord(el, i * 240));
  }

  /* ═══════════════════════════════════════════════════════════
     3. BARRE DE PROGRESSION + HEADER + SCROLLSPY
  ═══════════════════════════════════════════════════════════ */
  const progressBar = $("#scroll-progress");
  const header = $("#site-header");
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBar) progressBar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      if (header) header.classList.toggle("scrolled", y > 40);
      heroParallax(y);
      galleryScrollParallax();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  const spySections = ["hero", "vehicules", "services", "showroom", "apropos", "contact"]
    .map(id => document.getElementById(id)).filter(Boolean);
  if ("IntersectionObserver" in window && spySections.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id === "hero" ? "top" : e.target.id;
        $$(".nav-link").forEach(l => l.classList.toggle("active", l.dataset.section === id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    spySections.forEach(s => spy.observe(s));
  }

  /* ═══════════════════════════════════════════════════════════
     4. MENU MOBILE
  ═══════════════════════════════════════════════════════════ */
  const burger = $("#burger");
  const mobileMenu = $("#mobile-menu");
  function setMenu(open) {
    if (!burger || !mobileMenu) return;
    burger.classList.toggle("open", open);
    mobileMenu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (burger) burger.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("open")));
  $$(".mobile-link").forEach(l => l.addEventListener("click", () => setMenu(false)));

  /* ═══════════════════════════════════════════════════════════
     5. PARTICULES DU HERO (or / chrome / saphir)
  ═══════════════════════════════════════════════════════════ */
  const canvas = $("#particles");
  const heroEl = $("#hero");
  let particles = [], rafP = null, heroVisible = true, dpr = 1;

  function sizeCanvas() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
  }
  function makeParticles() {
    if (!canvas) return;
    const n = FINE ? 70 : 36;
    const colors = ["255,215,0", "192,192,192", "77,141,255"];
    particles = Array.from({ length: n }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: (0.6 + Math.random() * 1.9) * dpr,
      vy: -(0.08 + Math.random() * 0.35) * dpr,
      vx: (Math.random() - 0.5) * 0.18 * dpr,
      a: 0.15 + Math.random() * 0.55,
      tw: Math.random() * Math.PI * 2,
      c: colors[(Math.random() * colors.length) | 0]
    }));
  }
  function drawParticles() {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.y += p.vy; p.x += p.vx; p.tw += 0.03;
      if (p.y < -8) { p.y = canvas.height + 8; p.x = Math.random() * canvas.width; }
      if (p.x < -8) p.x = canvas.width + 8;
      if (p.x > canvas.width + 8) p.x = -8;
      const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + p.c + "," + alpha.toFixed(3) + ")";
      ctx.fill();
    }
    rafP = requestAnimationFrame(drawParticles);
  }
  function startParticles() {
    if (REDUCED || !canvas) return;
    sizeCanvas(); makeParticles();
    if (rafP) cancelAnimationFrame(rafP);
    rafP = requestAnimationFrame(drawParticles);
  }
  if (canvas && "IntersectionObserver" in window) {
    new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible && !document.hidden) startParticles();
      else if (rafP) { cancelAnimationFrame(rafP); rafP = null; }
    }, { threshold: 0.05 }).observe(heroEl || canvas);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { if (rafP) { cancelAnimationFrame(rafP); rafP = null; } }
    else if (heroVisible) startParticles();
  });
  window.addEventListener("resize", () => { sizeCanvas(); makeParticles(); });
  startParticles();

  /* ── Parallax HERO (léger) ───────────────────────────────── */
  const heroContent = $(".hero-content");
  function heroParallax(y) {
    if (REDUCED || !heroContent) return;
    if (y < window.innerHeight * 1.2) {
      heroContent.style.transform = "translateY(" + (y * 0.18) + "px)";
    }
  }

  /* ═══════════════════════════════════════════════════════════
     6. REVEAL ON SCROLL
  ═══════════════════════════════════════════════════════════ */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    $$(".reveal").forEach(el => io.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("visible"));
  }

  /* ═══════════════════════════════════════════════════════════
     7. TILT 3D (cartes services)
  ═══════════════════════════════════════════════════════════ */
  if (FINE && !REDUCED) {
    $$(".tilt").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", (px * 100) + "%");
        card.style.setProperty("--my", (py * 100) + "%");
        card.style.transform = "perspective(900px) rotateX(" + ((0.5 - py) * 6).toFixed(2) +
          "deg) rotateY(" + ((px - 0.5) * 8).toFixed(2) + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     8. GALERIE VÉHICULES + FILTRES + PARALLAX
  ═══════════════════════════════════════════════════════════ */
  const grid      = $("#gallery-grid");
  const filtersEl = $("#gallery-filters");
  let filteredItems = [];

  function buildGallery() {
    if (!grid) return;
    if (!C || !Array.isArray(C.gallery) || !C.gallery.length) {
      grid.innerHTML = '<p class="gallery-noscript">Aucun véhicule trouvé. Ajoutez des entrées dans <code>content/content.js</code>.</p>';
      return;
    }
    if (filtersEl) {
      (C.categories || ["tous"]).forEach(cat => {
        const b = document.createElement("button");
        b.className = "g-filter" + (cat === "tous" ? " active" : "");
        b.type = "button";
        b.dataset.cat = cat;
        b.textContent = (C.labels && C.labels[cat]) || cat;
        b.addEventListener("click", () => {
          $$(".g-filter", filtersEl).forEach(x => x.classList.remove("active"));
          b.classList.add("active");
          renderGrid(cat);
        });
        filtersEl.appendChild(b);
      });
    }
    renderGrid("tous");
  }

  function renderGrid(cat) {
    if (!grid) return;
    grid.innerHTML = "";
    filteredItems = C.gallery.filter(g => cat === "tous" || g.cat === cat);
    filteredItems.forEach((g, i) => {
      const fig = document.createElement("figure");
      fig.className = "g-item";
      fig.tabIndex = 0;
      fig.dataset.idx = i;
      fig.dataset.speed = (0.04 + (i % 4) * 0.025).toFixed(3);
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", "Agrandir : " + g.title);
      fig.innerHTML =
        '<div class="g-media">' +
          '<img src="' + g.src + '" alt="' + g.title.replace(/"/g, "&quot;") +
          '" loading="lazy" decoding="async">' +
          '<span class="g-zoom" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M21 21l-5.8-5.8M10.5 8v5M8 10.5h5"/></svg>' +
          "</span>" +
        "</div>" +
        '<figcaption class="g-caption">' +
          '<span class="g-cat">' + (((C.labels || {})[g.cat]) || g.cat) + "</span>" +
          '<span class="g-title">' + g.title + "</span>" +
          '<span class="g-desc">' + g.desc + "</span>" +
        "</figcaption>";
      // Image manquante (générations en attente) → masque proprement
      const img = fig.querySelector("img");
      img.addEventListener("error", () => { fig.remove(); filteredItems.splice(i, 1); }, { once: true });
      fig.addEventListener("click", () => openLightbox(i));
      fig.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(i); } });
      grid.appendChild(fig);
    });
    const items = $$(".g-item", grid);
    if (REDUCED || !("IntersectionObserver" in window)) {
      items.forEach(el => el.classList.add("in"));
    } else {
      const gio = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const el = e.target;
            setTimeout(() => el.classList.add("in"), (parseInt(el.dataset.idx, 10) % 4) * 70);
            gio.unobserve(el);
          }
        });
      }, { threshold: 0.08 });
      items.forEach(el => gio.observe(el));
    }
    galleryScrollParallax();
  }

  /* Parallax au scroll (translateY sur l'image) */
  let pTick = false;
  function galleryScrollParallax() {
    if (REDUCED || !grid || !grid.children.length) return;
    if (pTick) return;
    pTick = true;
    requestAnimationFrame(() => {
      const vh = window.innerHeight;
      for (const el of grid.children) {
        const img = el.querySelector("img");
        if (!img) continue;
        const r = el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) continue;
        const center = r.top + r.height / 2 - vh / 2;
        const shift = clamp(center * -parseFloat(el.dataset.speed || 0.05), -22, 22);
        img.style.transform = "translateY(" + shift.toFixed(1) + "px) scale(1.05)";
      }
      pTick = false;
    });
  }
  buildGallery();

  /* ═══════════════════════════════════════════════════════════
     9. LIGHTBOX
  ═══════════════════════════════════════════════════════════ */
  const lb       = $("#lightbox");
  const lbImg    = $("#lb-img");
  const lbTitle  = $("#lb-title");
  const lbDesc   = $("#lb-desc");
  const lbCount  = $("#lb-counter");
  let lbIndex = 0, lbOpen = false, lastFocus = null;

  function lbRender() {
    const g = filteredItems[lbIndex];
    if (!g) return;
    lbImg.src = g.src;
    lbImg.alt = g.title;
    lbTitle.textContent = g.title;
    lbDesc.textContent = g.desc;
    lbCount.textContent = (lbIndex + 1) + " / " + filteredItems.length;
  }
  function openLightbox(i) {
    if (!lb || !filteredItems.length) return;
    lbIndex = i;
    lastFocus = document.activeElement;
    lbRender();
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("open"));
    lbOpen = true;
    document.body.style.overflow = "hidden";
    const closeBtn = $("#lb-close");
    if (closeBtn) closeBtn.focus();
  }
  function closeLightbox() {
    if (!lb || !lbOpen) return;
    lb.classList.remove("open");
    setTimeout(() => { lb.hidden = true; }, 320);
    lbOpen = false;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function lbStep(d) {
    if (!filteredItems.length) return;
    lbIndex = (lbIndex + d + filteredItems.length) % filteredItems.length;
    lbRender();
  }
  if (lb) {
    $("#lb-close").addEventListener("click", closeLightbox);
    $("#lb-prev").addEventListener("click", () => lbStep(-1));
    $("#lb-next").addEventListener("click", () => lbStep(1));
    lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", e => {
      if (!lbOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lbStep(-1);
      if (e.key === "ArrowRight") lbStep(1);
    });
    let tx = null;
    lb.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", e => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 48) lbStep(dx > 0 ? -1 : 1);
      tx = null;
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════
     10. COMPTEURS
  ═══════════════════════════════════════════════════════════ */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || "";
    if (REDUCED) { el.textContent = target + suffix; return; }
    const t0 = performance.now(), dur = 1600;
    (function f(now) {
      const t = clamp((now - t0) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(f);
    })(t0);
  }
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    $$(".counter").forEach(el => cio.observe(el));
  } else {
    $$(".counter").forEach(el => { el.textContent = (el.dataset.target || "0") + (el.dataset.suffix || ""); });
  }

  /* ═══════════════════════════════════════════════════════════
     11. FORMULAIRE DE CONTACT
  ═══════════════════════════════════════════════════════════ */
  const form = $("#contact-form");
  if (form) {
    const fields = {
      nom:     { el: $("#cf-nom"),     test: v => v.trim().length >= 2,            msg: "Votre nom est requis (2 caractères min.)." },
      email:   { el: $("#cf-email"),   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: "Adresse email invalide." },
      message: { el: $("#cf-message"), test: v => v.trim().length >= 10,            msg: "Détaillez un peu votre demande (10 caractères min.)." }
    };
    Object.values(fields).forEach(f => {
      f.el.addEventListener("input", () => {
        const wrap = f.el.closest(".field");
        if (f.test(f.el.value)) { wrap.classList.remove("invalid"); wrap.querySelector(".field-error").textContent = ""; }
      });
    });
    form.addEventListener("submit", e => {
      e.preventDefault();
      let ok = true, firstBad = null;
      Object.values(fields).forEach(f => {
        const wrap = f.el.closest(".field");
        const valid = f.test(f.el.value);
        wrap.classList.toggle("invalid", !valid);
        wrap.querySelector(".field-error").textContent = valid ? "" : f.msg;
        if (!valid && !firstBad) firstBad = f.el;
        ok = ok && valid;
      });
      if (!ok) { if (firstBad) firstBad.focus(); return; }
      // Mode démo : confirmation + relais WhatsApp pré-rempli
      const wa = C && C.brand ? C.brand.waNumber : "2250702800200";
      const txt = "Bonjour Univers Auto ! Je suis " + fields.nom.el.value.trim() +
        " (" + fields.email.el.value.trim() + "). " + fields.message.el.value.trim();
      const waLink = $("#form-wa-link");
      if (waLink) waLink.href = "https://wa.me/" + wa + "?text=" + encodeURIComponent(txt);
      const success = $("#form-success");
      form.querySelectorAll(".field, .btn-submit, .form-note").forEach(n => { n.style.display = "none"; });
      if (success) { success.hidden = false; success.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" }); }
      form.reset();
    });
  }

  /* ═══════════════════════════════════════════════════════════
     12. CARTE INTERACTIVE ABIDJAN (11 communes)
  ═══════════════════════════════════════════════════════════ */
  const map = $("#abidjan-map");
  if (map) {
    const viewport = $("#map-viewport");
    const wrap = $("#map-wrap");
    const tooltip = $("#map-tooltip");
    const panel = $("#map-panel");
    const panelTitle = $("#map-panel-title");
    const panelDesc  = $("#map-panel-desc");

    const DISTRICTS = [
      { name: "Yopougon",     x: 118, y: 300, desc: "Pôle commercial de l'ouest — concessionnaires et flottes." },
      { name: "Adjamé",       x: 228, y: 396, desc: "Cœur historique de la ville, fort trafic d'affaires." },
      { name: "Attécubé",     x: 330, y: 452, desc: "Zone portuaire ouest et activités logistiques." },
      { name: "Abobo",        x: 398, y: 300, desc: "Grand bassin de clients — livraisons et essais à domicile." },
      { name: "Plateau",      x: 470, y: 420, desc: "Le cœur financier d'Abidjan : nos clients y travaillent." },
      { name: "Treichville",  x: 452, y: 476, desc: "Le quartier qui ne dort jamais — assistance 24h/24." },
      { name: "Marcory",      x: 556, y: 452, desc: "Artères commerçantes et résidences premium." },
      { name: "Port-Bouët",   x: 626, y: 494, desc: "Zone portuaire et industrielle de l'est." },
      { name: "Cocody",       x: 556, y: 322, desc: "Villa, Angré, Riviera : le terrain de jeu d'Univers Auto." },
      { name: "Riviera",      x: 648, y: 358, desc: "Bord de lagune, villas et affaires." },
      { name: "Bingerville",  x: 762, y: 330, desc: "L'extrême est de la métropole — couvert, comme partout." }
    ];

    const g = $("#map-districts");
    const NS = "http://www.w3.org/2000/svg";
    DISTRICTS.forEach(d => {
      const grp = document.createElementNS(NS, "g");
      grp.setAttribute("class", "map-district");
      grp.dataset.name = d.name;
      const halo = document.createElementNS(NS, "circle");
      halo.setAttribute("class", "d-halo"); halo.setAttribute("cx", d.x); halo.setAttribute("cy", d.y); halo.setAttribute("r", 15);
      const dot = document.createElementNS(NS, "circle");
      dot.setAttribute("class", "d-dot"); dot.setAttribute("cx", d.x); dot.setAttribute("cy", d.y); dot.setAttribute("r", 5);
      const txt = document.createElementNS(NS, "text");
      txt.setAttribute("x", d.x); txt.setAttribute("y", d.y - 14);
      txt.textContent = d.name.toUpperCase();
      grp.appendChild(halo); grp.appendChild(dot); grp.appendChild(txt);
      grp.addEventListener("mouseenter", e => showTip(e, d));
      grp.addEventListener("mousemove", e => moveTip(e));
      grp.addEventListener("mouseleave", hideTip);
      grp.addEventListener("click", e => {
        e.stopPropagation();
        $$(".map-district", g).forEach(x => x.classList.remove("active"));
        grp.classList.add("active");
        if (panel) {
          panelTitle.textContent = d.name;
          panelDesc.textContent = d.desc;
          panel.hidden = false;
        }
      });
      g.appendChild(grp);
    });
    $("#map-panel-close").addEventListener("click", () => { panel.hidden = true; $$(".map-district", g).forEach(x => x.classList.remove("active")); });

    function showTip(e, d) {
      if (!tooltip) return;
      tooltip.textContent = d.name + " — Couverture Univers Auto ✓";
      tooltip.hidden = false;
      moveTip(e);
    }
    function moveTip(e) {
      if (!tooltip || tooltip.hidden || !wrap) return;
      const r = wrap.getBoundingClientRect();
      tooltip.style.left = clamp(e.clientX - r.left, 90, r.width - 90) + "px";
      tooltip.style.top = (e.clientY - r.top) + "px";
    }
    function hideTip() { if (tooltip) tooltip.hidden = true; }

    // Zoom & pan
    let scale = 1, tx = 0, ty = 0, dragging = false, sx = 0, sy = 0, stx = 0, sty = 0;
    const MIN = 1, MAX = 3;
    function apply() {
      if (scale <= 1.001) { scale = 1; tx = 0; ty = 0; }
      tx = clamp(tx, 900 * (1 - scale), 0);
      ty = clamp(ty, 620 * (1 - scale), 0);
      viewport.setAttribute("transform", "translate(" + tx.toFixed(1) + " " + ty.toFixed(1) + ") scale(" + scale.toFixed(3) + ")");
    }
    function svgPoint(e) {
      const pt = map.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      return pt.matrixTransform(map.getScreenCTM().inverse());
    }
    function zoomAt(px, py, factor) {
      const ns = clamp(scale * factor, MIN, MAX);
      tx = px - (px - tx) * (ns / scale);
      ty = py - (py - ty) * (ns / scale);
      scale = ns;
      apply();
    }
    $("#map-in").addEventListener("click", () => zoomAt(450, 310, 1.35));
    $("#map-out").addEventListener("click", () => zoomAt(450, 310, 1 / 1.35));
    $("#map-reset").addEventListener("click", () => { scale = 1; tx = 0; ty = 0; apply(); });
    map.addEventListener("wheel", e => {
      e.preventDefault();
      const p = svgPoint(e);
      zoomAt(p.x, p.y, e.deltaY < 0 ? 1.12 : 1 / 1.12);
    }, { passive: false });
    map.addEventListener("pointerdown", e => {
      dragging = true; sx = e.clientX; sy = e.clientY; stx = tx; sty = ty;
      map.classList.add("grabbing");
      map.setPointerCapture(e.pointerId);
    });
    map.addEventListener("pointermove", e => {
      if (!dragging) return;
      const ctm = map.getScreenCTM();
      tx = stx + (e.clientX - sx) / ctm.a;
      ty = sty + (e.clientY - sy) / ctm.d;
      apply();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(ev =>
      map.addEventListener(ev, () => { dragging = false; map.classList.remove("grabbing"); })
    );
    apply();
  }

  /* ═══════════════════════════════════════════════════════════
     13. CARTE 3D ANGRÉ CHÂTEAU (tilt + tooltip)
  ═══════════════════════════════════════════════════════════ */
  const map3d = $("#map3d-wrap");
  if (map3d && FINE && !REDUCED) {
    const stage = $(".map3d-stage", map3d);
    map3d.addEventListener("mousemove", e => {
      const r = map3d.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      stage.style.transform = "rotateX(" + (16 - py * 10).toFixed(2) + "deg) rotateY(" + (px * 10).toFixed(2) + "deg)";
    });
    map3d.addEventListener("mouseleave", () => { stage.style.transform = ""; });
    // Tooltips des POI
    const tip = $("#map3d-tip");
    $$(".m3-poi", map3d).forEach(poi => {
      poi.addEventListener("mouseenter", e => {
        if (!tip) return;
        tip.innerHTML = "<strong>" + poi.dataset.name + "</strong><small>" + poi.dataset.desc + "</small>";
        tip.hidden = false;
        moveTip3d(e);
      });
      poi.addEventListener("mousemove", moveTip3d);
      poi.addEventListener("mouseleave", () => { if (tip) tip.hidden = true; });
      function moveTip3d(e) {
        const r = map3d.getBoundingClientRect();
        tip.style.left = clamp(e.clientX - r.left, 90, r.width - 90) + "px";
        tip.style.top = (e.clientY - r.top) + "px";
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════
     14. RÉSEAUX SOCIAUX (générés depuis content.js)
  ═══════════════════════════════════════════════════════════ */
  const SOCIAL_ICONS = {
    tiktok: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.44-5.71 0-3.51 2.79-6.4 6.27-6.49.2 0 .4.01.6.03v4.06c-.2-.03-.4-.04-.6-.05-1.6.13-2.8 1.44-2.76 3.05.04 1.6 1.33 2.88 2.93 2.92 1.64.05 2.96-1.26 2.99-2.89.03-2.93.01-5.86.02-8.79 0-.01 0-.02 0-.03V3.9c0-.2 0-.4.01-.6.01-1.1.01-2.2 0-3.28z"/>',
    facebook: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
    instagram: '<path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>',
    youtube: '<path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z"/>',
    whatsapp: '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>'
  };
  const SOCIAL_DESC = {
    tiktok:    "Règles du jour, essais filmés, coulisses du showroom : le flux auto le plus vif d'Abidjan.",
    facebook:  "Portraits de nos véhicules, annonces et communauté : suivez l'actualité de la concession.",
    instagram: "La collection en lumière, avant/après et esthétique premium. Le fil le plus brillant d'Abidjan.",
    youtube:   "Essais détaillés, comparatifs et visites du showroom en vidéo : la machine, filmée.",
    whatsapp:  "Notre canal préféré : devis, essai, financement — réponse en quelques minutes, 7j/7."
  };
  const SOCIAL_CTA = {
    tiktok: "Suivre sur TikTok", facebook: "Suivre sur Facebook",
    instagram: "Suivre sur Instagram", youtube: "S'abonner",
    whatsapp: "Discuter maintenant"
  };

  function buildSocials() {
    const gridEl = $("#socials-grid");
    const footEl = $("#footer-socials");
    if (!C || !Array.isArray(C.socials)) return;
    C.socials.forEach((s, i) => {
      if (gridEl) {
        const a = document.createElement("a");
        a.className = "social-card sc-" + s.id + " reveal" + (i < 4 ? " data-delay=\"" + i + "\"" : "");
        a.href = s.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.dataset.hover = "";
        a.setAttribute("aria-label", s.name + " — " + s.handle);
        a.innerHTML =
          '<div class="sc-top">' +
            '<span class="sc-icon' + (s.id === "whatsapp" ? " sc-icon-pulse" : "") + '">' +
              '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">' + (SOCIAL_ICONS[s.id] || "") + "</svg>" +
            "</span>" +
            '<span class="sc-handle">' + s.handle + "</span>" +
          "</div>" +
          '<h3 class="sc-name">' + s.name + "</h3>" +
          '<p class="sc-desc">' + (SOCIAL_DESC[s.id] || "") + "</p>" +
          '<span class="sc-cta">' + (SOCIAL_CTA[s.id] || "Ouvrir") +
            ' <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
          "</span>";
        gridEl.appendChild(a);
        if ("IntersectionObserver" in window) {
          const io = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
          }, { threshold: 0.12 });
          io.observe(a);
        } else a.classList.add("visible");
      }
      if (footEl) {
        const a = document.createElement("a");
        a.href = s.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.setAttribute("aria-label", s.name);
        a.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">' + (SOCIAL_ICONS[s.id] || "") + "</svg>";
        footEl.appendChild(a);
      }
    });
  }
  buildSocials();

  /* ═══════════════════════════════════════════════════════════
     15. RECHERCHE INTELLIGENTE
  ═══════════════════════════════════════════════════════════ */
  let searchIndex = [];
  function buildSearchIndex() {
    if (!C) return;
    const idx = [];
    [
      ["Véhicules — collection complète", "#vehicules", "Section du site"],
      ["Services — financement, assurance, SAV, recharge", "#services", "Section du site"],
      ["Showroom — Angré Château, Abidjan", "#showroom", "Section du site"],
      ["À propos — histoire & valeurs", "#apropos", "Section du site"],
      ["Contact — formulaire, téléphone, email", "#contact", "Section du site"]
    ].forEach(s => idx.push({ label: s[0], sub: s[2], type: "section", target: s[1] }));
    $$(".service-card[data-search]").forEach(card => {
      const h3 = $(".service-body h3", card);
      idx.push({ label: (h3 ? h3.textContent : "") + " — Service", sub: card.dataset.search, type: "service", target: "#services" });
    });
    if (Array.isArray(C.gallery)) {
      C.gallery.forEach(g => {
        idx.push({ label: g.title, sub: ((C.labels || {})[g.cat] || g.cat) + " — Véhicule", type: "vehicule", src: g.src });
      });
    }
    searchIndex = idx;
  }
  buildSearchIndex();

  const ICONS = {
    vehicule: '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13l1.8-4.6A2.4 2.4 0 0 1 7.1 6.7h9.8a2.4 2.4 0 0 1 2.3 1.7L21 13v5h-2.2M3 13v5h2.2M3 13h18M7.8 18a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4zm8.4 0a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4z"/></svg>',
    service:  '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6V21h3.4l5.7-5.7a4.5 4.5 0 0 0 5.6-6L14.6 12l-2.6-2.6 2.7-3.1z"/></svg>',
    section:  '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  function goVehicle(src) {
    // Reprend la galerie "tous" puis ouvre la lightbox sur le véhicule
    const all = $(".g-filter[data-cat='tous']");
    if (all) all.click();
    const target = C.gallery.find(g => g.src === src);
    if (!target) return;
    const idx = filteredItems.findIndex(g => g.src === src);
    if (idx >= 0) {
      const sec = $("#vehicules");
      if (sec) sec.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
      setTimeout(() => openLightbox(idx), REDUCED ? 0 : 450);
    }
  }

  function selectResult(item) {
    if (item.type === "vehicule") {
      goVehicle(item.src);
    } else if (item.target) {
      const el = $(item.target);
      if (el) el.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
    }
    setMenu(false);
  }

  const searchInputs = $$("[data-search-input]");
  searchInputs.forEach(input => {
    const box = input.closest(".nav-search, .mobile-search");
    const results = box ? box.querySelector(".search-results") : null;
    if (!results) return;
    let activeIdx = -1;

    function close() { results.hidden = true; results.innerHTML = ""; activeIdx = -1; }

    function render(q) {
      const query = norm(q.trim());
      if (query.length < 2) { close(); return; }
      const hits = searchIndex.filter(it =>
        norm(it.label).includes(query) || norm(it.sub).includes(query)
      ).slice(0, 8);
      results.innerHTML = "";
      if (!hits.length) {
        results.innerHTML = '<p class="search-empty">Aucun résultat pour « ' + q.trim() + ' »</p>';
        results.hidden = false;
        return;
      }
      hits.forEach((h, i) => {
        const el = document.createElement("div");
        el.className = "search-item";
        el.setAttribute("role", "option");
        el.dataset.type = h.type;
        el.tabIndex = 0;
        el.innerHTML =
          '<span class="search-item-ico">' + (ICONS[h.type] || ICONS.section) + "</span>" +
          "<div><strong>" + h.label + "</strong><small>" + h.sub + "</small></div>";
        el.addEventListener("click", () => { selectResult(h); close(); input.blur(); });
        el.addEventListener("keydown", e => { if (e.key === "Enter") { selectResult(h); close(); } });
        results.appendChild(el);
      });
      results.hidden = false;
    }

    input.addEventListener("input", () => render(input.value));
    input.addEventListener("focus", () => { if (input.value.trim().length >= 2) render(input.value); });
    input.addEventListener("keydown", e => {
      const items = $$(".search-item", results);
      if (e.key === "Escape") { close(); input.blur(); return; }
      if (!results.hidden && items.length) {
        if (e.key === "ArrowDown") { e.preventDefault(); activeIdx = Math.min(items.length - 1, activeIdx + 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = Math.max(0, activeIdx - 1); }
        else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); items[activeIdx].click(); return; }
        items.forEach((it, i) => it.classList.toggle("active", i === activeIdx));
      } else if (e.key === "Enter" && !results.hidden) {
        if (items.length) { e.preventDefault(); items[0].click(); }
      }
    });
    document.addEventListener("click", e => {
      if (!box.contains(e.target)) close();
    });
  });

  /* ═══════════════════════════════════════════════════════════
     16. CURSEUR PERSONNALISÉ
  ═══════════════════════════════════════════════════════════ */
  if (FINE && !REDUCED) {
    const dot = $("#cursor-dot"), ring = $("#cursor-ring");
    if (dot && ring) {
      let mx = -100, my = -100, rx = -100, ry = -100, rafC = null;
      document.addEventListener("mousemove", e => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = "translate(" + (mx - 3.5) + "px," + (my - 3.5) + "px)";
        if (!rafC) rafC = requestAnimationFrame(function loop() {
          rx = lerp(rx, mx, 0.16); ry = lerp(ry, my, 0.16);
          ring.style.transform = "translate(" + (rx - ring.offsetWidth / 2) + "px," + (ry - ring.offsetHeight / 2) + "px)";
          rafC = requestAnimationFrame(loop);
        });
      }, { passive: true });
      document.addEventListener("mouseover", e => {
        const hot = e.target.closest("a,button,[data-hover],input,textarea,.g-item,.m3-poi");
        ring.classList.toggle("is-hover", !!hot);
      });
    }
  }

  /* ── Balayage initial ────────────────────────────────────── */
  onScroll();
})();
