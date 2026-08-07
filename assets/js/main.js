/* =========================================================
   L'ANTRO — main.js
   Header · menu · ricerca · lightbox gallery · progress di lettura
   Lo stesso file serve index.html e lantro.html: ogni blocco
   controlla di avere gli elementi che gli servono prima di attivarsi.
   ========================================================= */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------------------------------------------------
     1. Header allo scroll, back-to-top, barra di lettura
     --------------------------------------------------------- */
  const header   = $("#header");
  const toTop     = $("#toTop");
  const progress  = $("#readProgress");
  const progressBar = progress ? $("span", progress) : null;

  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-stuck", y > 40);
    if (toTop) toTop.hidden = y < 600;

    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? Math.min(y / max, 1) * 100 : 0) + "%";
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------------------------------------------------------
     2. Menu mobile + voce attiva
     --------------------------------------------------------- */
  const burger = $("#burger");
  const nav    = $("#nav");

  function setMenu(open) {
    if (!nav || !burger) return;
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
  }
  if (burger && nav) {
    burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest(".nav__link")) setMenu(false); });
  }

  /* Evidenzia la voce di menu della sezione a schermo (solo home) */
  const links = $$(".nav__link").filter((a) => a.getAttribute("href").startsWith("#"));
  const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id)
        );
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------------------------------------------------------
     3. Ricerca (live sulla home, GET verso la home altrove)
     --------------------------------------------------------- */
  const searchToggle = $("#searchToggle");
  const searchPanel  = $("#searchPanel");
  const searchInput  = $("#searchInput");
  const searchClose  = $("#searchClose");
  const searchForm   = $("#searchForm");
  const searchStatus = $("#searchStatus");
  const noResults    = $("#noResults");
  const noDirs       = $("#noDirs");
  const noCrew       = $("#noCrew");
  const noShots      = $("#noShots");

  const searchables = $$("[data-tags]").map((el) => ({
    el,
    haystack: (el.dataset.tags + " " + el.textContent).toLowerCase().replace(/\s+/g, " ")
  }));

  function openSearch(open) {
    if (!searchPanel || !searchToggle) return;
    searchPanel.hidden = !open;
    searchToggle.setAttribute("aria-expanded", String(open));
    searchToggle.setAttribute("aria-label", open ? "Chiudi la ricerca" : "Apri la ricerca");
    if (open) { searchInput.focus(); }
    else { searchInput.value = ""; applySearch(""); searchToggle.focus(); }
  }

  function applySearch(raw) {
    if (!searchables.length) return;
    const q = raw.trim().toLowerCase();
    let reviews = 0, dirs = 0, crew = 0, shots = 0;
    searchables.forEach(({ el, haystack }) => {
      const hit = !q || haystack.includes(q);
      el.classList.toggle("is-filtered", !hit);
      if (!hit) return;
      if (el.classList.contains("card") ||
          el.classList.contains("revrow")) reviews++;   // .revrow: righe dell'archivio
      if (el.classList.contains("dir"))  dirs++;
      if (el.classList.contains("crew")) crew++;
      if (el.classList.contains("shot")) shots++;
    });

    if (noResults) noResults.hidden = !q || reviews > 0;
    if (noDirs)    noDirs.hidden    = !q || dirs > 0;
    if (noCrew)    noCrew.hidden    = !q || crew > 0;
    if (noShots)   noShots.hidden   = !q || shots > 0;

    if (!searchStatus) return;
    if (!q) { searchStatus.textContent = ""; return; }
    if (!(reviews + dirs + crew + shots)) {
      searchStatus.textContent = `Nessun risultato per “${raw.trim()}”.`;
      return;
    }
    const parts = [
      `${reviews} recension${reviews === 1 ? "e" : "i"}`,
      `${dirs} regist${dirs === 1 ? "a" : "i"}`,
      `${crew} recensor${crew === 1 ? "e" : "i"}`,
      `${shots} immagin${shots === 1 ? "e" : "i"}`
    ];
    searchStatus.textContent = `${parts.join(", ")} per “${raw.trim()}”.`;
  }

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener("click", () => openSearch(searchPanel.hidden));
    searchClose.addEventListener("click", () => openSearch(false));

    let debounce;
    searchInput.addEventListener("input", (e) => {
      if (!searchables.length) return;          // pagina articolo: nessun filtro live
      clearTimeout(debounce);
      const value = e.target.value;
      debounce = setTimeout(() => applySearch(value), 120);
    });

    /* Sulla home il submit filtra senza ricaricare; altrove parte la GET normale */
    if (searchables.length) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        applySearch(searchInput.value);
        const target = $("#recensioni");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    /* Ricerca precompilata da URL: index.html?q=thriller */
    const initialQuery = new URLSearchParams(location.search).get("q");
    if (initialQuery && searchables.length) {
      openSearch(true);
      searchInput.value = initialQuery;
      applySearch(initialQuery);
    }
  }

  /* ---------------------------------------------------------
     4. Lightbox della gallery
     --------------------------------------------------------- */
  const lightbox   = $("#lightbox");
  const lbFigure   = $("#lightboxFigure");
  const lbTitle    = $("#lightboxTitle");
  let lastFocused = null;
  let currentShot = -1;

  const visibleShots = () =>
    $$(".js-zoom").filter((btn) => !btn.closest(".shot").classList.contains("is-filtered"));

  function showShot(index) {
    const shots = visibleShots();
    if (!shots.length) return;
    currentShot = (index + shots.length) % shots.length;
    const btn = shots[currentShot];
    const caption = btn.dataset.caption || "";

    const img = document.createElement("img");
    img.src = btn.dataset.full;
    img.alt = caption;
    img.decoding = "async";

    const cap = document.createElement("figcaption");
    cap.textContent = shots.length > 1
      ? `${caption} — ${currentShot + 1} di ${shots.length} (usa ← →)`
      : caption;

    lbTitle.textContent = caption || "Immagine";
    lbFigure.replaceChildren(img, cap);
  }

  function openLightbox(btn) {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    showShot(visibleShots().indexOf(btn));
    lightbox.hidden = false;
    document.body.classList.add("is-locked");
    $("#lightboxClose").focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    lbFigure.replaceChildren();
    document.body.classList.remove("is-locked");
    if (lastFocused) lastFocused.focus();
  }

  document.addEventListener("click", (e) => {
    const zoom = e.target.closest(".js-zoom");
    if (zoom) { e.preventDefault(); openLightbox(zoom); return; }
    if (e.target.closest("[data-close]")) closeLightbox();
  });

  /* ---------------------------------------------------------
     5. Tastiera: Esc, frecce, focus trap nella lightbox
     --------------------------------------------------------- */
  document.addEventListener("keydown", (e) => {
    const lbOpen = lightbox && !lightbox.hidden;

    if (e.key === "Escape") {
      if (lbOpen) return closeLightbox();
      if (searchPanel && !searchPanel.hidden) return openSearch(false);
      if (nav && nav.classList.contains("is-open")) return setMenu(false);
    }
    if (!lbOpen) return;

    if (e.key === "ArrowRight") { e.preventDefault(); showShot(currentShot + 1); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); showShot(currentShot - 1); }

    if (e.key === "Tab") {
      const focusables = $$('button, [href], input, [tabindex]:not([tabindex="-1"])', lightbox)
        .filter((el) => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------------------------------------------------
     6. Fallback immagini: poster generato se la rete non risponde
     --------------------------------------------------------- */
  const PALETTES = [
    ["#2b0a0c", "#E50914"], ["#0d1b2a", "#3d5a80"], ["#1b1005", "#c47f1a"],
    ["#0f1f14", "#2f8f5b"], ["#1a0f24", "#7b3fa0"], ["#241206", "#d0562a"]
  ];
  function placeholder(seedText, w, h) {
    let seed = 0;
    for (let i = 0; i < seedText.length; i++) seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
    const [a, b] = PALETTES[seed % PALETTES.length];
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
      `<rect width="${w}" height="${h}" fill="url(#g)"/>` +
      `<rect x="${w * .5 - 26}" y="${h * .5 - 20}" width="52" height="40" rx="4" fill="#000" opacity=".4"/>` +
      `<path d="M${w * .5 + 26} ${h * .5 - 10}l16-10v40l-16-10z" fill="#000" opacity=".4"/></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  document.addEventListener("error", (e) => {
    const img = e.target;
    if (img.tagName !== "IMG" || img.dataset.fallback) return;
    img.dataset.fallback = "1";                 // evita loop infiniti
    img.src = placeholder(img.alt || img.src, +(img.getAttribute("width") || 800),
                                              +(img.getAttribute("height") || 450));
  }, true);                                     // capture: l'evento error non fa bubbling

  /* ---------------------------------------------------------
     7. Anno corrente nel footer
     --------------------------------------------------------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
