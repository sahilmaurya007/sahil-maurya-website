/* app5.js — 🎨 colour modes + 🖼️ STYLE SKINS (poora UI change). DO NOT EDIT. */
(function () {
  "use strict";
  var MODES = [
    { id: "light", label: "Day", icon: "☀", dot: "#ffffff" },
    { id: "dark", label: "Night", icon: "🌙", dot: "#101019" },
    { id: "sepia", label: "Sepia", icon: "📜", dot: "#f4ecd8" },
    { id: "forest", label: "Sage Green", icon: "🌿", dot: "#eff5ee" },
    { id: "ocean", label: "Ocean Blue", icon: "🌊", dot: "#e9f2f7" },
    { id: "lavender", label: "Lavender", icon: "💜", dot: "#f3eff8" },
    { id: "sunset", label: "Sunset", icon: "🌅", dot: "#fdf0ec" },
    { id: "midnight", label: "Midnight", icon: "💙", dot: "#0a1024" },
    { id: "contrast", label: "High Contrast", icon: "⬛", dot: "#ffffff" }
  ];
  var SKINS = [
    { id: "classic", label: "Classic", dot: "linear-gradient(135deg,#6366f1,#a855f7 60%,#199baf)" },
    { id: "glass", label: "Glass", dot: "linear-gradient(135deg,rgba(255,255,255,.5),rgba(99,102,241,.4))" },
    { id: "neon", label: "Neon Dark", dot: "linear-gradient(135deg,#0d0221,#ff2a6d 60%,#05d9e8)" },
    { id: "paper", label: "Paper", dot: "linear-gradient(135deg,#faf4e6,#8a7968)" },
    { id: "mono", label: "Minimal Mono", dot: "linear-gradient(135deg,#ffffff,#1a1a1a)" },
    { id: "retro", label: "Retro 80s", dot: "linear-gradient(135deg,#ff6ec7,#ffd8a8 50%,#31d0ff)" }
  ];
  var doc = document.documentElement;
  var get = function (k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } };
  var set = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var curMode = get("sm-theme", "light"), curSkin = get("sm-skin", "classic");
  if (!MODES.some(function (m) { return m.id === curMode; })) curMode = "light";
  if (!SKINS.some(function (s) { return s.id === curSkin; })) curSkin = "classic";
  doc.setAttribute("data-theme", curMode);
  doc.setAttribute("data-skin", curSkin);

  var modeBtn = document.getElementById("themeBtn");
  var nav = document.querySelector(".nav");
  if (modeBtn && nav) {
    modeBtn.title = "Colour modes";
    modeBtn.setAttribute("aria-label", "Colour modes");
    modeBtn.textContent = "🎨";
    var panel = document.createElement("div");
    panel.className = "mode-bar";
    var html = "<div class='mode-bar-title'>🎨 Colour Modes</div><div class='mode-chips'>";
    MODES.forEach(function (t) {
      html += "<button class='mode-chip' data-theme='" + t.id + "'><span class='swatch' style='background:" + t.dot + "'></span>" + t.icon + " " + t.label + "</button>";
    });
    html += "</div>";
    panel.innerHTML = html;
    nav.appendChild(panel);

    var skinBtn = document.createElement("button");
    skinBtn.className = "icon-btn";
    skinBtn.id = "bgBtn";
    skinBtn.title = "Website style";
    skinBtn.setAttribute("aria-label", "Website style");
    skinBtn.textContent = "🖼️";
    modeBtn.after(skinBtn);

    var skinBar = document.createElement("div");
    skinBar.className = "mode-bar skin-bar";
    var sh = "<div class='mode-bar-title'>🖼️ Website Style</div><div class='mode-chips'>";
    SKINS.forEach(function (s) {
      sh += "<button class='mode-chip' data-skin='" + s.id + "'><span class='swatch' style='background:" + s.dot + "'></span>" + s.label + "</button>";
    });
    sh += "</div>";
    skinBar.innerHTML = sh;
    nav.appendChild(skinBar);

    var sync = function () {
      panel.querySelectorAll("[data-theme]").forEach(function (b) { b.classList.toggle("active", b.dataset.theme === curMode); });
      skinBar.querySelectorAll("[data-skin]").forEach(function (b) { b.classList.toggle("active", b.dataset.skin === curSkin); });
    };
    sync();
    panel.querySelectorAll("[data-theme]").forEach(function (b) {
      b.addEventListener("click", function () { curMode = b.dataset.theme; doc.setAttribute("data-theme", curMode); set("sm-theme", curMode); sync(); });
    });
    skinBar.querySelectorAll("[data-skin]").forEach(function (b) {
      b.addEventListener("click", function () { curSkin = b.dataset.skin; doc.setAttribute("data-skin", curSkin); set("sm-skin", curSkin); sync(); });
    });
    modeBtn.addEventListener("click", function (e) { e.stopPropagation(); skinBar.classList.remove("open"); panel.classList.toggle("open"); });
    skinBtn.addEventListener("click", function (e) { e.stopPropagation(); panel.classList.remove("open"); skinBar.classList.toggle("open"); });
    document.addEventListener("click", function (e) {
      if (!panel.contains(e.target) && e.target !== modeBtn) panel.classList.remove("open");
      if (!skinBar.contains(e.target) && e.target !== skinBtn) skinBar.classList.remove("open");
    });
  }
})();
