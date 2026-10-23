/* ============================================================
   app4.js — THEME PICKER (8 modes) + GUI EDIT BUTTON.
   IS FILE KO EDIT KARNE KI ZAROORAT NAHI.
   ============================================================ */
(function () {
  "use strict";

  /* ================= THEMES ================= */
  const THEMES = [
    { id: "light",    name: "Light",         dot: "#f7f7fc" },
    { id: "dark",     name: "Night Dark",    dot: "#101019" },
    { id: "sepia",    name: "Sepia",        dot: "#f4ecd8" },
    { id: "forest",   name: "Forest",       dot: "#eff5ee" },
    { id: "ocean",    name: "Ocean",        dot: "#e9f2f7" },
    { id: "sunset",   name: "Sunset",       dot: "#fdf0ec" },
    { id: "midnight", name: "Midnight",     dot: "#0a1024" },
    { id: "contrast", name: "High Contrast", dot: "#ffffff" },
  ];

  const html = document.documentElement;

  /* ---------- theme button ko picker panel me convert karo ---------- */
  const themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    const panel = document.createElement("div");
    panel.className = "theme-panel";
    panel.id = "themePanel";
    panel.innerHTML = `
      <h4>🎨 Choose a theme</h4>
      <div class="theme-grid">
        ${THEMES.map(t => `
          <button class="theme-opt" data-theme="${t.id}" title="${t.name}">
            <span class="swatch" style="background:${t.dot}"></span>${t.name}
          </button>`).join("")}
      </div>`;
    themeBtn.appendChild(panel);
    themeBtn.classList.add("theme-btn");

    themeBtn.addEventListener("click", (e) => {
      if (e.target.closest(".theme-opt")) return;
      panel.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".theme-btn")) panel.classList.remove("open");
    });
    const applyTheme = (id) => {
      html.setAttribute("data-theme", id);
      try { localStorage.setItem("sm-theme", id); } catch (err) {}
      themeBtn.textContent = id === "dark" || id === "midnight" ? "☀" : "🌙";
      themeBtn.appendChild(panel);
      document.querySelectorAll(".theme-opt").forEach(b =>
        b.classList.toggle("active", b.dataset.theme === id));
    };
    document.querySelectorAll(".theme-opt").forEach(b =>
      b.addEventListener("click", () => { applyTheme(b.dataset.theme); panel.classList.remove("open"); }));
    document.querySelectorAll(".theme-opt").forEach(b =>
      b.classList.toggle("active", b.dataset.theme === html.getAttribute("data-theme")));
  }

  /* ================= GUI EDIT FAB ================= */
  const REPO = "https://github.com/sahilmaurya007/sahil-maurya-website/edit/main/";
  const MENU = [
    { ic: "🖼️", label: "Photos / Gallery",     sub: "data3.js — GALLERY_CATEGORIES", url: REPO + "data3.js" },
    { ic: "📰", label: "News / Conference",    sub: "data3.js — NEWS list",           url: REPO + "data3.js" },
    { ic: "🧭", label: "Journey / Timeline",    sub: "data3.js — JOURNEY list",        url: REPO + "data3.js" },
    { ic: "📝", label: "Biography / About",     sub: "data.js — ABOUT aur PROFILE",     url: REPO + "data.js" },
    { ic: "📄", label: "Papers / Publications", sub: "data.js — PUBLICATIONS",         url: REPO + "data.js" },
    { ic: "🎓", label: "Education / Awards",    sub: "data.js + data2.js",             url: REPO + "data.js" },
    { ic: "🛠️", label: "Skills / Coursework",  sub: "data2.js — SKILLS etc.",         url: REPO + "data2.js" },
    { ic: "⬆️", label: "Photo upload karo",    sub: "image/ folder me naya photo",    url: "https://github.com/sahilmaurya007/sahil-maurya-website/upload/main/image" },
  ];

  const fab = document.createElement("button");
  fab.className = "edit-fab";
  fab.innerHTML = `<span class="ic">✏️</span> Edit website`;
  document.body.appendChild(fab);

  const menu = document.createElement("div");
  menu.className = "edit-fab-menu";
  menu.innerHTML = MENU.map(m =>
    `<a href="${m.url}" target="_blank" rel="noopener">
       <span class="ic">${m.ic}</span>
       <span><strong>${m.label}</strong><br><span class="sub">${m.sub}</span></span>
     </a>`).join("");
  document.body.appendChild(menu);

  fab.addEventListener("click", () => menu.classList.toggle("open"));
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".edit-fab") && !e.target.closest(".edit-fab-menu"))
      menu.classList.remove("open");
  });
})();
