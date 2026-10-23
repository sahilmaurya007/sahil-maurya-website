/* ============================================================
   app4.js — 2 SYMBOLS: 🎨 modes picker (Day/Night + colours),
   🖼 background picker, PENCIL editor (owner login,
   draft-approval flow), photo lightbox, Elsewhere rename.
   EDIT MAT KARO.
   ============================================================ */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);

  /* ============ 1) MODES PICKER: Day / Night + 7 colours ============ */
  const MODES = [
    { id: "light", label: "Day", dot: "linear-gradient(135deg,#ffffff,#6366f1)" },
    { id: "dark", label: "Night", dot: "linear-gradient(135deg,#101019,#4c4c77)" },
    { id: "sepia", label: "Sepia", dot: "linear-gradient(135deg,#f4ecd8,#a05a1e)" },
    { id: "sage", label: "Sage Green", dot: "linear-gradient(135deg,#eef3ed,#397653)" },
    { id: "ocean", label: "Ocean Blue", dot: "linear-gradient(135deg,#edf5f8,#177da0)" },
    { id: "lavender", label: "Lavender", dot: "linear-gradient(135deg,#f3eff8,#8157a8)" },
    { id: "sunset", label: "Sunset", dot: "linear-gradient(135deg,#fdf0ec,#d35400)" },
    { id: "midnight", label: "Midnight", dot: "linear-gradient(135deg,#0a1024,#7aa2f7)" },
    { id: "contrast", label: "High Contrast", dot: "linear-gradient(135deg,#ffffff,#000000)" },
  ];
  const KEY = "sm-theme";
  const doc = document.documentElement;
  const applyMode = (id) => { doc.setAttribute("data-theme", id); try { localStorage.setItem(KEY, id); } catch (e) {} };
  let saved = "light";
  try {
    saved = localStorage.getItem(KEY);
    if (!saved || !MODES.some(m => m.id === saved)) saved = "light";
  } catch (e) { saved = "light"; }
  applyMode(saved);

  const modeBtn = $("themeBtn");
  const nav = document.querySelector(".nav");
  if (modeBtn && nav) {
    modeBtn.title = "Colour modes";
    modeBtn.setAttribute("aria-label", "Colour modes");
    modeBtn.textContent = "🎨";
    const panel = document.createElement("div");
    panel.className = "theme-panel";
    panel.innerHTML = `<h4>🎨 Colour Modes</h4>
      <div class="theme-grid">
        ${MODES.map(m => `<button class="theme-opt" data-theme="${m.id}"><span class="swatch" style="background:${m.dot}"></span>${m.label}</button>`).join("")}
      </div>`;
    nav.appendChild(panel);
    const refresh = () => document.querySelectorAll("[data-theme]").forEach(b =>
      b.classList.toggle("active", b.dataset.theme === doc.getAttribute("data-theme")));
    refresh();
    modeBtn.addEventListener("click", (e) => { e.stopPropagation(); panel.classList.toggle("open"); });
    document.querySelectorAll("[data-theme]").forEach(b =>
      b.addEventListener("click", () => { applyMode(b.dataset.theme); refresh(); panel.classList.remove("open"); }));
    document.addEventListener("click", (e) => { if (!panel.contains(e.target) && e.target !== modeBtn) panel.classList.remove("open"); });

    /* ============ 2) BACKGROUND PICKER — dusra symbol 🖼 ============ */
    const BG = [
      { id: "plain", label: "Plain", dot: "linear-gradient(135deg,#f7f7fc,#e6e4f3)" },
      { id: "aurora", label: "Aurora Glow", dot: "linear-gradient(135deg,#6366f1,#a855f7 60%,#199baf)" },
      { id: "grid", label: "Circuit Grid", dot: "linear-gradient(135deg,#199baf,#0d3a45)" },
      { id: "mesh", label: "Soft Mesh", dot: "linear-gradient(135deg,#f4ecd8,#a855f7)" },
      { id: "dots", label: "Ink Dots", dot: "linear-gradient(135deg,#f1f0fb,#6366f1)" },
      { id: "wave", label: "Silicon Waves", dot: "linear-gradient(135deg,#e0f2f1,#177da0)" },
    ];
    const BG_KEY = "sm-bg";
    const applyBg = (id) => { doc.setAttribute("data-bg", id); try { localStorage.setItem(BG_KEY, id); } catch (e) {} };
    let bgSaved = "plain";
    try { bgSaved = localStorage.getItem(BG_KEY) || "plain"; } catch (e) {}
    applyBg(bgSaved);
    const bgBtn = document.createElement("button");
    bgBtn.className = "icon-btn";
    bgBtn.id = "bgBtn";
    bgBtn.title = "Website background";
    bgBtn.setAttribute("aria-label", "Website background");
    bgBtn.textContent = "🖼️";
    modeBtn.after(bgBtn);
    const bgPanel = document.createElement("div");
    bgPanel.className = "theme-panel bg-panel";
    bgPanel.innerHTML = `<h4>🖼️ Website Background</h4>
      <div class="theme-grid">
        ${BG.map(b => `<button class="theme-opt" data-bg="${b.id}"><span class="swatch" style="background:${b.dot}"></span>${b.label}</button>`).join("")}
      </div>`;
    nav.appendChild(bgPanel);
    const refreshBg = () => document.querySelectorAll("[data-bg]").forEach(b =>
      b.classList.toggle("active", b.dataset.bg === doc.getAttribute("data-bg")));
    refreshBg();
    bgBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.classList.remove("open");
      bgPanel.classList.toggle("open");
    });
    document.querySelectorAll("[data-bg]").forEach(b =>
      b.addEventListener("click", () => { applyBg(b.dataset.bg); refreshBg(); bgPanel.classList.remove("open"); }));
    document.addEventListener("click", (e) => { if (!bgPanel.contains(e.target) && e.target !== bgBtn) bgPanel.classList.remove("open"); });
  }

  /* ============ 3) PHOTO LIGHTBOX — click karke full open ============ */
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <button class="lb-close" aria-label="Close">✕</button>
    <button class="lb-prev" aria-label="Previous">‹</button>
    <img src="" alt="">
    <button class="lb-next" aria-label="Next">›</button>
    <div class="lb-cap"></div>`;
  document.body.appendChild(lightbox);
  const lbImg = lightbox.querySelector("img");
  const lbCap = lightbox.querySelector(".lb-cap");
  let lbList = [], lbIdx = 0;
  const showLb = (i) => {
    lbIdx = (i + lbList.length) % lbList.length;
    const it = lbList[lbIdx];
    lbImg.src = it.src; lbImg.alt = it.cap; lbCap.textContent = it.cap;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const closeLb = () => { lightbox.classList.remove("open"); document.body.style.overflow = ""; };
  lightbox.querySelector(".lb-close").addEventListener("click", closeLb);
  lightbox.querySelector(".lb-prev").addEventListener("click", (e) => { e.stopPropagation(); showLb(lbIdx - 1); });
  lightbox.querySelector(".lb-next").addEventListener("click", (e) => { e.stopPropagation(); showLb(lbIdx + 1); });
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showLb(lbIdx - 1);
    if (e.key === "ArrowRight") showLb(lbIdx + 1);
  });
  /* gallery + news photos par click → lightbox */
  const wireLightbox = () => {
    document.querySelectorAll("#catGal .gal-item img, #photoGal .gal-item img, .tl-photo img").forEach(img => {
      if (img.dataset.lbwired) return;
      img.dataset.lbwired = "1";
      img.style.cursor = "zoom-in";
      img.addEventListener("click", (e) => {
        e.stopPropagation();
        lbList = Array.from(document.querySelectorAll("#catGal .gal-item img, .tl-photo img"))
          .filter(i => i.src).map(i => ({ src: i.src, cap: i.alt || i.title || "" }));
        if (!lbList.length) lbList = [{ src: img.src, cap: img.alt }];
        showLb(lbList.findIndex(x => x.src === img.src));
      });
    });
  };
  wireLightbox();
  const lbObs = new MutationObserver(() => wireLightbox());
  lbObs.observe(document.body, { childList: true, subtree: true });

  /* ============ 4) PENCIL EDITOR (owner-only, draft-approval) ============ */
  const USER_ID = "sahil.maurya21@iiitg.ac.in";
  const PASS_HASH = 46190; /* '200707@' ka hash */
  const hp = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };
  const REPO = "https://github.com/sahilmaurya007/sahil-maurya-website";
  const BR = "draft";
  const LINKS = [
    { ic: "🖼️", label: "Profile photo update", sub: "image/SAHIL.jpg upload", url: REPO + "/upload/" + BR + "/image" },
    { ic: "📰", label: "News / Conference", sub: "data3.js — NEWS list", url: REPO + "/edit/" + BR + "/data3.js" },
    { ic: "🖼", label: "Gallery photo + description", sub: "data3.js — GALLERY_CATEGORIES", url: REPO + "/edit/" + BR + "/data3.js" },
    { ic: "🧭", label: "Journey / Timeline", sub: "data3.js — JOURNEY list", url: REPO + "/edit/" + BR + "/data3.js" },
    { ic: "📝", label: "Biography / About", sub: "data.js — ABOUT/PROFILE", url: REPO + "/edit/" + BR + "/data.js" },
    { ic: "📄", label: "Papers / Publications", sub: "data.js — PUBLICATIONS", url: REPO + "/edit/" + BR + "/data.js" },
    { ic: "🎓", label: "Education / Awards", sub: "data.js + data2.js", url: REPO + "/edit/" + BR + "/data.js" },
    { ic: "🛠️", label: "Skills / Coursework", sub: "data2.js", url: REPO + "/edit/" + BR + "/data2.js" },
    { ic: "⬆️", label: "Photo upload", sub: "image/ folder", url: REPO + "/upload/" + BR + "/image" },
    { ic: "🔔", label: "Review & approve", sub: "PR merge = live", url: REPO + "/compare/main..." + BR },
  ];

  const fab = document.createElement("button");
  fab.className = "edit-fab";
  fab.title = "Edit (owner only)";
  fab.textContent = "✏️";
  document.body.appendChild(fab);

  const menu = document.createElement("div");
  menu.className = "edit-fab-menu";
  menu.innerHTML = LINKS.map(m =>
    `<a href="${m.url}" target="_blank" rel="noopener"><span class="ic">${m.ic}</span><span><strong>${m.label}</strong><br><span class="sub">${m.sub}</span></span></a>`).join("");
  document.body.appendChild(menu);

  const mask = document.createElement("div");
  mask.className = "login-mask";
  mask.innerHTML = `
    <div class="login-card">
      <h3>✏️ Owner login</h3>
      <p>Sirf website owner ke liye.</p>
      <form id="ownerLoginForm">
        <label for="loginId">ID</label>
        <input id="loginId" type="text" autocomplete="off" required>
        <label for="loginPass">Password</label>
        <input id="loginPass" type="password" autocomplete="off" required>
        <div class="login-err" id="loginErr"></div>
        <button type="submit">Login</button>
      </form>
    </div>`;
  document.body.appendChild(mask);

  const isAuthed = () => { try { return sessionStorage.getItem("sm-edit-ok") === "1"; } catch (e) { return false; } };
  fab.addEventListener("click", () => {
    if (isAuthed()) menu.classList.toggle("open");
    else mask.classList.add("open");
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".edit-fab") && !e.target.closest(".edit-fab-menu")) menu.classList.remove("open");
  });
  mask.addEventListener("click", (e) => { if (e.target === mask) mask.classList.remove("open"); });
  mask.querySelector("#ownerLoginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("loginId").value.trim().toLowerCase();
    const pw = document.getElementById("loginPass").value;
    if (id === USER_ID && hp(pw) === PASS_HASH) {
      try { sessionStorage.setItem("sm-edit-ok", "1"); } catch (err) {}
      mask.classList.remove("open");
      menu.classList.add("open");
    } else {
      document.getElementById("loginErr").textContent = "Galat ID ya password.";
    }
  });

  /* ============ 5) ELSEWHERE → "CONNECT" rename ============ */
  document.querySelectorAll(".foot h4, .lab-k, .contact-item .lab").forEach(el => {
    if (el.textContent.trim() === "Elsewhere") el.textContent = "Connect";
  });
})();
