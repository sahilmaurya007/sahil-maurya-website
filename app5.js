/* app5.js — 🎨 colour modes (Day/Night + 7 colours) + 🖼️ background picker. DO NOT EDIT. */
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
  var BACKGROUNDS = [
    { id: "plain", label: "Plain", dot: "linear-gradient(135deg,#f7f7fc,#e6e4f3)" },
    { id: "aurora", label: "Aurora Glow", dot: "linear-gradient(135deg,#6366f1,#a855f7 60%,#199baf)" },
    { id: "grid", label: "Circuit Grid", dot: "linear-gradient(135deg,#199baf,#0d3a45)" },
    { id: "mesh", label: "Soft Mesh", dot: "linear-gradient(135deg,#f4ecd8,#a855f7)" },
    { id: "dots", label: "Ink Dots", dot: "linear-gradient(135deg,#f1f0fb,#6366f1)" },
    { id: "wave", label: "Silicon Waves", dot: "linear-gradient(135deg,#e0f2f1,#177da0)" }
  ];
  var doc = document.documentElement;
  var get = function (k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } };
  var set = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var curMode = get("sm-theme", "light"), curBg = get("sm-bg", "plain");
  if (!MODES.some(function (m) { return m.id === curMode; })) curMode = "light";
  doc.setAttribute("data-theme", curMode);
  doc.setAttribute("data-bg", curBg);

  var modeBtn = document.getElementById("themeBtn");
  var nav = document.querySelector(".nav");
  if (modeBtn && nav) {
    modeBtn.title = "Colour modes";
    modeBtn.setAttribute("aria-label", "Colour modes");
    modeBtn.textContent = "🎨";
    var panel = document.createElement("div");
    panel.className = "theme-panel";
    var html = "<h4>🎨 Colour Modes</h4><div class='theme-grid'>";
    MODES.forEach(function (t) {
      html += "<button class='theme-opt' data-theme='" + t.id + "'><span class='swatch' style='background:" + t.dot + "'></span>" + t.icon + " " + t.label + "</button>";
    });
    html += "</div>";
    panel.innerHTML = html;
    nav.appendChild(panel);

    var bgBtn = document.createElement("button");
    bgBtn.className = "icon-btn";
    bgBtn.id = "bgBtn";
    bgBtn.title = "Website background";
    bgBtn.setAttribute("aria-label", "Website background");
    bgBtn.textContent = "🖼️";
    modeBtn.after(bgBtn);

    var bgPanel = document.createElement("div");
    bgPanel.className = "theme-panel bg-panel";
    bgPanel.style.right = "46px";
    var bh = "<h4>🖼️ Website Background</h4><div class='theme-grid'>";
    BACKGROUNDS.forEach(function (b) {
      bh += "<button class='theme-opt' data-bg='" + b.id + "'><span class='swatch' style='background:" + b.dot + "'></span>" + b.label + "</button>";
    });
    bh += "</div>";
    bgPanel.innerHTML = bh;
    nav.appendChild(bgPanel);

    var sync = function () {
      panel.querySelectorAll("[data-theme]").forEach(function (b) { b.classList.toggle("active", b.dataset.theme === curMode); });
      bgPanel.querySelectorAll("[data-bg]").forEach(function (b) { b.classList.toggle("active", b.dataset.bg === curBg); });
    };
    sync();
    panel.querySelectorAll("[data-theme]").forEach(function (b) {
      b.addEventListener("click", function () { curMode = b.dataset.theme; doc.setAttribute("data-theme", curMode); set("sm-theme", curMode); sync(); });
    });
    bgPanel.querySelectorAll("[data-bg]").forEach(function (b) {
      b.addEventListener("click", function () { curBg = b.dataset.bg; doc.setAttribute("data-bg", curBg); set("sm-bg", curBg); sync(); });
    });
    modeBtn.addEventListener("click", function (e) { e.stopPropagation(); bgPanel.classList.remove("open"); panel.classList.toggle("open"); });
    bgBtn.addEventListener("click", function (e) { e.stopPropagation(); panel.classList.remove("open"); bgPanel.classList.toggle("open"); });
    document.addEventListener("click", function (e) {
      if (!panel.contains(e.target) && e.target !== modeBtn) panel.classList.remove("open");
      if (!bgPanel.contains(e.target) && e.target !== bgBtn) bgPanel.classList.remove("open");
    });
  }
})();
