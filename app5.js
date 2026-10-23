/* app5.js — 🎨 colour modes + 🖼️ STYLE SKINS. Panels apne icon ke theek neeche khulte hain. DO NOT EDIT. */
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
    { id: "retro", label: "Retro 80s", dot: "linear-gradient(135deg,#ff6ec7,#ffd8a8 50%,#31d0ff)" },
    { id: "aurora", label: "Aurora", dot: "linear-gradient(135deg,#a8edea,#fed6e3 50%,#c3aed6)" },
    { id: "luxe", label: "Luxe Gold", dot: "linear-gradient(135deg,#0f0f0f,#d4af37 60%,#f5e7a3)" },
    { id: "sakura", label: "Sakura", dot: "linear-gradient(135deg,#ffd7e8,#ffb7d5 50%,#ffe9f3)" },
    { id: "carbon", label: "Carbon Pro", dot: "linear-gradient(135deg,#16181d,#2d3138 50%,#454b54)" },
    { id: "arctic", label: "Arctic", dot: "linear-gradient(135deg,#f0f7ff,#dbeafe 50%,#e0f2fe)" },
    { id: "candy", label: "Candy Pop", dot: "linear-gradient(135deg,#ff9a9e,#a18cd1 50%,#fbc2eb)" }
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
  if (modeBtn) {
    var wrap = document.createElement("span");
    wrap.className = "btn-wrap";
    modeBtn.parentNode.insertBefore(wrap, modeBtn);
    wrap.appendChild(modeBtn);
    modeBtn.title = "Colour modes";
    modeBtn.setAttribute("aria-label", "Colour modes");
    modeBtn.textContent = "🎨";
    var panel = document.createElement("div");
    panel.className = "mode-bar";
    panel.innerHTML = "<div class='mode-bar-title'>🎨 Colour Modes</div><div class='mode-chips'>" +
      MODES.map(function (t) {
        return "<button class='mode-chip' data-theme='" + t.id + "'><span class='swatch' style='background:" + t.dot + "'></span>" + t.icon + " " + t.label + "</button>";
      }).join("") + "</div>";
    wrap.appendChild(panel);

    var skinBtn = document.createElement("button");
    skinBtn.className = "icon-btn";
    skinBtn.id = "bgBtn";
    skinBtn.title = "Website style";
    skinBtn.setAttribute("aria-label", "Website style");
    skinBtn.textContent = "🖼️";
    var swrap = document.createElement("span");
    swrap.className = "btn-wrap";
    wrap.parentNode.insertBefore(swrap, wrap.nextSibling);
    swrap.appendChild(skinBtn);

    var skinBar = document.createElement("div");
    skinBar.className = "mode-bar skin-bar";
    skinBar.innerHTML = "<div class='mode-bar-title'>🖼️ Website Style</div><div class='mode-chips'>" +
      SKINS.map(function (s) {
        return "<button class='mode-chip' data-skin='" + s.id + "'><span class='swatch' style='background:" + s.dot + "'></span>" + s.label + "</button>";
      }).join("") + "</div>";
    swrap.appendChild(skinBar);

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
      if (!wrap.contains(e.target)) panel.classList.remove("open");
      if (!swrap.contains(e.target)) skinBar.classList.remove("open");
    });
  }
})();
