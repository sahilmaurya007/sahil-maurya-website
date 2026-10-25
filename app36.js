/* app36.js - Share Theme: current colour mode + skin ke saath link copy. DO NOT EDIT. */
(function () {
  "use strict";
  var doc = document.documentElement;
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "icon-btn";
  btn.title = "Share this look";
  btn.setAttribute("aria-label", "Share theme link");
  btn.textContent = "\uD83D\uDD17";
  var tryMount = function () {
    var nav = document.querySelector(".nav");
    var themeBtn = document.getElementById("themeBtn");
    if (!nav || !themeBtn || document.getElementById("shareThemeBtn")) return;
    btn.id = "shareThemeBtn";
    themeBtn.after(btn);
  };
  setTimeout(tryMount, 400);
  setInterval(tryMount, 3000);
  btn.addEventListener("click", function () {
    var theme = doc.getAttribute("data-theme") || "light";
    var skin = doc.getAttribute("data-skin") || "classic";
    var url = location.origin + location.pathname + "#theme=" + theme + "&skin=" + skin;
    var done = function () {
      btn.textContent = "\u2713";
      setTimeout(function () { btn.textContent = "\uD83D\uDD17"; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(function () { prompt("Copy karo:", url); done(); });
    } else { prompt("Copy karo:", url); done(); }
  });
})();
