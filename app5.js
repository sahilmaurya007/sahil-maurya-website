/* app5.js — themes (Light/Night) + background options. DO NOT EDIT. */
(function () {
  "use strict";
  var THEMES = [
    { id: "light", label: "Light", icon: "☀", dot: "#ffffff" },
    { id: "dark", label: "Night", icon: "🌙", dot: "#101019" }
  ];
  var BACKGROUNDS = [
    { id: "plain", label: "Plain", dot: "linear-gradient(135deg,#f7f7fc,#e6e4f3)" },
    { id: "aurora", label: "Aurora Glow", dot: "linear-gradient(135deg,#6366f1,#a855f7 60%,#199baf)" },
    { id: "grid", label: "Circuit Grid", dot: "linear-gradient(135deg,#199baf,#0d3a45)" },
    { id: "mesh", label: "Soft Mesh", dot: "linear-gradient(135deg,#f4ecd8,#a855f7)" }
  ];
  var doc = document.documentElement;
  var get = function (k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } };
  var set = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var curTheme = get("sm-theme", "light"), curBg = get("sm-bg", "plain");
  doc.setAttribute("data-theme", curTheme);
  doc.setAttribute("data-bg", curBg);
  var btn = document.getElementById("themeBtn");
  var nav = document.querySelector(".nav");
  if (btn && nav) {
    btn.setAttribute("aria-label", "Theme and background");
    btn.title = "Theme and background";
    btn.textContent = "🎨";
    var panel = document.createElement("div");
    panel.className = "theme-panel";
    var html = "<h4>Themes</h4><div class='theme-grid'>";
    THEMES.forEach(function (t) {
      html += "<button class='theme-opt' data-theme='" + t.id + "'><span class='swatch' style='background:" + t.dot + "'></span>" + t.icon + " " + t.label + "</button>";
    });
    html += "</div><h4 class='bg-h'>Background</h4><div class='theme-grid'>";
    BACKGROUNDS.forEach(function (b) {
      html += "<button class='theme-opt' data-bg='" + b.id + "'><span class='swatch' style='background:" + b.dot + "'></span>" + b.label + "</button>";
    });
    html += "</div>";
    panel.innerHTML = html;
    nav.appendChild(panel);
    var sync = function () {
      panel.querySelectorAll("[data-theme]").forEach(function (b) { b.classList.toggle("active", b.dataset.theme === curTheme); });
      panel.querySelectorAll("[data-bg]").forEach(function (b) { b.classList.toggle("active", b.dataset.bg === curBg); });
    };
    sync();
    panel.querySelectorAll("[data-theme]").forEach(function (b) {
      b.addEventListener("click", function () { curTheme = b.dataset.theme; doc.setAttribute("data-theme", curTheme); set("sm-theme", curTheme); sync(); });
    });
    panel.querySelectorAll("[data-bg]").forEach(function (b) {
      b.addEventListener("click", function () { curBg = b.dataset.bg; doc.setAttribute("data-bg", curBg); set("sm-bg", curBg); sync(); });
    });
    btn.addEventListener("click", function (e) { e.stopPropagation(); panel.classList.toggle("open"); });
    document.addEventListener("click", function (e) { if (!panel.contains(e.target) && e.target !== btn) panel.classList.remove("open"); });
  }
})();
