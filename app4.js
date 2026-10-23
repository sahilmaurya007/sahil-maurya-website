/* ============================================================
   app4.js — 7 THEME MODES + LOGIN-GATED PENCIL EDITOR.
   EDIT MAT KARO. Password badalna ho to PASS_HASH badalna
   hota hai (naya hash ke liye mujhe bol dena).
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1) THEMES (7 eye-friendly modes) ---------- */
  const THEMES = [
    { id: "daylight", label: "Daylight", icon: "☀", swatch: "linear-gradient(135deg,#6366f1,#a855f7 60%,#199baf)" },
    { id: "night", label: "Night", icon: "🌙", swatch: "linear-gradient(135deg,#2b2b45,#4c4c77 60%,#65d8e6)" },
    { id: "sepia", label: "Sepia", icon: "📜", swatch: "linear-gradient(135deg,#f4eddf,#9b6339 65%)" },
    { id: "sage", label: "Sage Green", icon: "🌿", swatch: "linear-gradient(135deg,#eef3ed,#397653 65%)" },
    { id: "ocean", label: "Ocean Blue", icon: "🌊", swatch: "linear-gradient(135deg,#edf5f8,#177da0 65%)" },
    { id: "lavender", label: "Lavender", icon: "💜", swatch: "linear-gradient(135deg,#f3eff8,#8157a8 65%)" },
    { id: "contrast", label: "High Contrast", icon: "⬛", swatch: "linear-gradient(135deg,#fff,#123ec4 65%)" },
  ];
  const KEY = "sm-theme-preset";
  const doc = document.documentElement;
  const applyTheme = (id) => { doc.setAttribute("data-theme", id); try { localStorage.setItem(KEY, id); } catch (e) {} };
  let saved = "daylight";
  try { saved = localStorage.getItem(KEY) || "daylight"; } catch (e) {}
  applyTheme(saved);
  const btn = document.getElementById("themeBtn");
  const nav = document.querySelector(".nav");
  if (btn && nav) {
    btn.setAttribute("aria-label", "Choose theme");
    btn.title = "Choose theme";
    btn.textContent = (THEMES.find(t => t.id === saved) || {}).icon || "🎨";
    const picker = document.createElement("div");
    picker.className = "theme-picker";
    picker.innerHTML = `<p class="theme-picker-title">Themes — background &amp; colors</p><div class="theme-options"></div><p class="theme-picker-hint">Choice saved for next visit.</p>`;
    nav.appendChild(picker);
    const box = picker.querySelector(".theme-options");
    const renderOptions = () => {
      const cur = doc.getAttribute("data-theme");
      box.innerHTML = THEMES.map(t => `<button class="theme-option" data-id="${t.id}" aria-pressed="${t.id === cur}"><span class="theme-swatch" style="background:${t.swatch}"></span>${t.icon} ${t.label}</button>`).join("");
      box.querySelectorAll(".theme-option").forEach(b => b.addEventListener("click", () => {
        applyTheme(b.dataset.id);
        const t = THEMES.find(x => x.id === b.dataset.id);
        if (t) btn.textContent = t.icon;
        renderOptions();
      }));
    };
    renderOptions();
    btn.addEventListener("click", (e) => { e.stopPropagation(); picker.classList.toggle("open"); });
    document.addEventListener("click", (e) => { if (!picker.contains(e.target) && e.target !== btn) picker.classList.remove("open"); });
  }

  /* ---------- 2) PENCIL EDITOR (sirf owner — login ke baad) ----------
     Edit hamesha 'draft' branch par jaata hai. Tab tak live nahi
     hota jab tak aap GitHub par PR dekh kar approve (merge) na karo. */
  const USER_ID = "sahil.maurya21@iiitg.ac.in";
  const PASS_HASH = 46190; /* password ka hash — plain password code me nahi hai */
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
  menu.className = "edit-menu";
  menu.innerHTML = LINKS.map(m => `<a href="${m.url}" target="_blank" rel="noopener"><span>${m.ic}</span><span><strong>${m.label}</strong><br><span class="sub">${m.sub}</span></span></a>`).join("");
  document.body.appendChild(menu);

  const mask = document.createElement("div");
  mask.className = "login-mask";
  mask.innerHTML = `
    <div class="login-card">
      <h3>✏️ Owner login</h3>
      <p>Sirf website owner ke liye. Login ke baad edit menu khulega.</p>
      <form id="loginForm">
        <label for="lid">ID (email)</label>
        <input id="lid" type="text" autocomplete="off" required>
        <label for="lpass">Password</label>
        <input id="lpass" type="password" autocomplete="off" required>
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
  document.addEventListener("click", (e) => { if (!menu.contains(e.target) && e.target !== fab) menu.classList.remove("open"); });
  mask.addEventListener("click", (e) => { if (e.target === mask) mask.classList.remove("open"); });
  mask.querySelector("#loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("lid").value.trim().toLowerCase();
    const pw = document.getElementById("lpass").value;
    if (id === USER_ID && hp(pw) === PASS_HASH) {
      try { sessionStorage.setItem("sm-edit-ok", "1"); } catch (err) {}
      mask.classList.remove("open");
      menu.classList.add("open");
    } else {
      document.getElementById("loginErr").textContent = "Galat ID ya password — sirf owner edit kar sakta hai.";
    }
  });
})();
