/* app30.js - footer icons + news photo click lock. DO NOT EDIT. */
(function () {
  "use strict";
  var css = document.createElement("style");
  css.textContent = "#footLinks li,#footLinks li a{display:flex;align-items:center;gap:8px}#footLinks .f-ico{width:17px;height:17px;flex:none}#footLinks .f-ico svg{width:100%;height:100%}.news-media img{cursor:default!important}.foot{gap:14px!important}";
  document.head.appendChild(css);
  var ICONS = {
    "YouTube": '<svg viewBox="0 0 24 24" fill="#e5484d"><path d="M23 12s0-3.8-.5-5.6c-.3-1-1-1.7-2-2C18.8 4 12 4 12 4s-6.8 0-8.5.4c-1 .3-1.7 1-2 2C1 8.2 1 12 1 12s0 3.8.5 5.6c.3 1 1 1.7 2 2 1.7.4 8.5.4 8.5.4s6.8 0 8.5-.4c1-.3 1.7-1 2-2 .5-1.8.5-5.6.5-5.6zM9.8 15.3V8.7l6 3.3-6 3.3z"/></svg>',
    "LinkedIn": '<svg viewBox="0 0 24 24" fill="#0a66c2"><path d="M20.4 20.5h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3zM5.3 7.4a2 2 0 110-4.1 2 2 0 010 4.1zM7.1 20.5H3.6V9h3.5v11.5z"/></svg>',
    "Google Scholar": '<svg viewBox="0 0 24 24" fill="#16a34a"><path d="M12 3 4 6.7c0 5.4 2.5 9.4 8 12.8 5.5-3.4 8-7.4 8-12.8L12 3z"/></svg>',
    "ResearchGate": '<svg viewBox="0 0 24 24" fill="#a855f7"><path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/></svg>'
  };
  var patchFooter = function () {
    document.querySelectorAll(".foot h4").forEach(function (h) {
      var t = h.textContent.trim();
      if (t === "Connect" || t === "Elsewhere") h.textContent = "Professional Profiles";
      if (t === "This site" || t === "This Site") h.textContent = "Quick Links";
    });
    document.querySelectorAll("#footLinks li").forEach(function (li) {
      if (li.querySelector(".f-ico")) return;
      var a = li.querySelector("a");
      if (!a) return;
      var ico = ICONS[(a.textContent || "").trim()];
      if (!ico) return;
      var span = document.createElement("span");
      span.className = "f-ico";
      span.innerHTML = ico;
      a.insertBefore(span, a.firstChild);
    });
  };
  patchFooter();
  new MutationObserver(patchFooter).observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t && t.closest && t.closest(".news-media img")) { e.stopPropagation(); e.preventDefault(); }
  }, true);
})();
