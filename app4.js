/* ============================================================
   app4.js — LIGHT/NIGHT + BACKGROUND picker, PENCIL EDITOR
   (owner login + draft-branch approval flow).
   EDIT MAT KARO. Password badalna ho to PASS_HASH badalna
   hota hai (naya hash ke liye mujhe bol dena).
   ============================================================ */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);

  /* ============ 1) THEME: Light / Night / Background ============ */
  const THEMES = [
    { id: "light", label: "☀ Light", dot: "linear-gradient(135deg,#ffffff,#6366f1)" },
    { id: "dark", label: "🌙 Night", dot: "linear-gradient(135deg,#101019,#4c4c77)" },
    { id: "sepia", label: "📜 Background (Sepia)", dot: "linear-gradient(135deg,#f4ecd8,#a05a1e)" },
  ];
  const KEY = "sm-theme";
  const doc = document.documentElement;
  const applyTheme = (id) => {
    doc.setAttribute("data-theme", id);
    try { localStorage.setItem(KEY, id); } catch (e) {}
  };
  let saved = "light";
  try {
    saved = localStorage.getItem(KEY);
    const valid = THEMES.some(t => t.id === saved);
    if (!saved || !valid) saved = "light";
  } catch (e) { saved = "light"; }
  applyTheme(saved);

  const themeBtn = $("themeBtn");
  const nav = document.querySelector(".nav");
  if (themeBtn && nav) {
    themeBtn.title = "Theme & background";
    themeBtn.setAttribute("aria-label", "Theme & background");
    themeBtn.textContent = saved === "dark" ? "☀" : "🌙";
    const panel = document.createElement("div");
    panel.className = "theme-panel";
    panel.innerHTML = `<h4>🎨 Theme &amp; Background</h4>
      <div class="theme-grid">
        ${THEMES.map(t => `<button class="theme-opt" data-theme="${t.id}"><span class="swatch" style="background:${t.dot}"></span>${t.label}</button>`).join("")}
      </div>`;
    nav.appendChild(panel);
    const refreshActive = () => document.querySelectorAll(".theme-opt").forEach(b =>
      b.classList.toggle("active", b.dataset.theme === doc.getAttribute("data-theme")));
    refreshActive();
    themeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.target.closest && e.target.closest(".theme-opt")) return;
      panel.classList.toggle("open");
    });
    document.querySelectorAll(".theme-opt").forEach(b =>
      b.addEventListener("click", () => {
        applyTheme(b.dataset.theme);
        themeBtn.textContent = b.dataset.theme === "dark" ? "☀" : "🌙";
        refreshActive();
        panel.classList.remove("open");
      }));
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".theme-panel") && e.target !== themeBtn) panel.classList.remove("open");
    });
  }

  /* ============ 2) PENCIL EDITOR (owner-only, draft-approval) ============ */
  const USER_ID = "sahil.maurya21@iiitg.ac.in";
  const PASS_HASH = 46190; /* '200707@' ka hash — plain password code me nahi */
  const hp = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };
  const REPO = "https://github.com/sahilmaurya007/sahil-maurya-website";
  const BR = "draft";
  const LINKS = [
    { ic: "📰", label: "News / Conference", sub: "data3.js — NEWS list", url: REPO + "/edit/" + BR + "/data3.js" },
    { ic: "🖼️", label: "Photos / Gallery", sub: "data3.js — GALLERY_CATEGORIES", url: REPO + "/edit/" + BR + "/data3.js" },
    { ic: "🧭", label: "Journey / Timeline", sub: "data3.js — JOURNEY list", url: REPO + "/edit/" + BR + "/data3.js" },
    { ic: "📝", label: "Biography / About", sub: "data.js — ABOUT/PROFILE", url: REPO + "/edit/" + BR + "/data.js" },
    { ic: "📄", label: "Papers / Publications", sub: "data.js — PUBLICATIONS", url: REPO + "/edit/" + BR + "/data.js" },
    { ic: "🎓", label: "Education / Awards", sub: "data.js + data2.js", url: REPO + "/edit/" + BR + "/data.js" },
    { ic: "🛠️", label: "Skills / Coursework", sub: "data2.js — SKILLS", url: REPO + "/edit/" + BR + "/data2.js" },
    { ic: "⬆️", label: "Photo upload", sub: "image/ folder", url: REPO + "/upload/" + BR + "/image" },
    { ic: "🔔", label: "Review &amp; approve", sub: "PR banao → merge = live", url: REPO + "/compare/main..." + BR },
  ];

  const fab = document.createElement("button");
  fab.className = "edit-fab";
  fab.title = "Edit website (owner only)";
  fab.textContent = "✏️";
  document.body.appendChild(fab);

  const menu = document.createElement("div");
  menu.className = "edit-fab-menu";
  menu.innerHTML = LINKS.map(m =>
    `<a href="${m.url}" target="_blank" rel="noopener">
       <span class="ic">${m.ic}</span>
       <span><strong>${m.label}</strong><br><span class="sub">${m.sub}</span></span>
     </a>`).join("");
  document.body.appendChild(menu);

  const mask = document.createElement("div");
  mask.className = "login-mask";
  mask.innerHTML = `
    <div class="login-card">
      <h3>✏️ Owner login</h3>
      <p>Sirf website owner ke liye. Login ke baad edit menu khulega.</p>
      <form id="ownerLoginForm">
        <label for="loginId">ID (email)</label>
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
      document.getElementById("loginErr").textContent = "Galat ID ya password — sirf owner edit kar sakta hai.";
    }
  });
})();
