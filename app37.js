/* app37.js - top-right LOGO (full, contain) + quotes colorful + Quick Links icons + resize helper (SM.resizeImage). DO NOT EDIT. */
(function () {
  "use strict";
  /* ---------- 1. TOP-RIGHT LOGO (header me, full size) ---------- */
  var css = document.createElement("style");
  css.textContent = ".sm-top-logo{max-height:52px;max-width:150px;height:auto;width:auto;object-fit:contain!important;object-position:center;margin-left:auto;flex:none}";
  document.head.appendChild(css);
  var logo = document.createElement("img");
  logo.id = "smTopLogo";
  logo.className = "sm-top-logo";
  logo.alt = "Institute logo";
  logo.style.display = "none";
  var path = "";
  try { path = localStorage.getItem("sm-logo") || ""; } catch (e) {}
  var mountLogo = function () {
    var nav = document.querySelector(".nav");
    if (!nav || document.getElementById("smTopLogo")) return;
    nav.appendChild(logo);
    if (path) { logo.src = path; logo.style.display = "block"; }
  };
  var tryLogo = function () {
    try { path = localStorage.getItem("sm-logo") || ""; } catch (e) {}
    mountLogo();
    if (path && logo.src !== path && logo.getAttribute("src") !== path) { logo.src = path; logo.style.display = "block"; }
  };
  setTimeout(tryLogo, 300);
  setInterval(tryLogo, 2500);

  /* ---------- 2. QUOTES colorful + bold ---------- */
  var quoteCss = document.createElement("style");
  quoteCss.textContent = "#quoteText{background:linear-gradient(115deg,#6366f1,#a855f7 40%,#199baf 75%,#f59e0b);-webkit-background-clip:text;background-clip:text;color:transparent;font-weight:700;font-size:1.15rem!important}#quoteBy{color:#a855f7;font-weight:600;font-size:.9rem}";
  document.head.appendChild(quoteCss);

  /* ---------- 3. QUICK LINKS icons (Publications, Gallery, Contact) ---------- */
  var QICONS = {
    "Publications": '<svg viewBox="0 0 24 24" fill="#6366f1" width="15" height="15"><path d="M5 3h11a2 2 0 012 2v14a2 2 0 01-2 2H5V3zm2 2v2h9V5H7zm0 4v2h9V9H7zm0 4v2h6v-2H7z"/></svg>',
    "Gallery": '<svg viewBox="0 0 24 24" fill="#a855f7" width="15" height="15"><path d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm2 10l3.5-4.5L12 14l2.5-3L20 17H6l-2-2z"/></svg>',
    "Contact": '<svg viewBox="0 0 24 24" fill="#199baf" width="15" height="15"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>'
  };
  var patchQuick = function () {
    document.querySelectorAll(".foot h4").forEach(function (h) {
      if (h.textContent.trim() !== "Quick Links") return;
      var ul = h.parentElement.querySelector("ul");
      if (!ul) return;
      ul.querySelectorAll("li").forEach(function (li) {
        if (li.querySelector(".f-ico")) return;
        var a = li.querySelector("a");
        if (!a) return;
        var ic = QICONS[(a.textContent || "").trim()];
        if (!ic) return;
        var s = document.createElement("span");
        s.className = "f-ico";
        s.innerHTML = ic;
        a.insertBefore(s, a.firstChild);
      });
    });
  };
  patchQuick();
  new MutationObserver(patchQuick).observe(document.body, { childList: true, subtree: true });

  /* ---------- 4. SM.resizeImage: koi bhi photo resize karke upload (editor me use hota hai) ---------- */
  window.SM_RESIZE = function (file, maxW, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        var sc = Math.min(1, maxW / img.width);
        var cv = document.createElement("canvas");
        cv.width = Math.round(img.width * sc);
        cv.height = Math.round(img.height * sc);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        cb(cv.toDataURL("image/jpeg", 0.92).split(",")[1], cv.width, cv.height);
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  };

  /* ---------- 5. LOGIN EYE icon right-side me (CSS position fix) ---------- */
  var eyeCss = document.createElement("style");
  eyeCss.textContent = "#loginForm span[style*='position:relative']{position:relative!important;display:block!important}#lpassEye{right:8px!important;left:auto!important;top:50%!important;transform:translateY(-50%)!important;position:absolute!important}";
  document.head.appendChild(eyeCss);
})();
