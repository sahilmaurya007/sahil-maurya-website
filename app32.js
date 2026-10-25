/* app32.js - news photo FULL show + rich text live + footer horizontal. DO NOT EDIT. */
(function () {
  "use strict";
  var css = document.createElement("style");
  css.textContent = ".news-media{min-height:auto!important}.news-media img{object-fit:contain!important;object-position:center center!important;background:var(--soft)}.foot{gap:10px 28px!important;align-items:start}.foot h4{margin-bottom:6px}.foot ul li{font-size:.8rem;margin-bottom:3px}";
  document.head.appendChild(css);
  var rich = function (s) {
    if (s == null) return "";
    var t = String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#2563eb;font-weight:600;text-decoration:underline">$1</a>');
    return t;
  };
  var richAll = function () {
    document.querySelectorAll(".about-body p, .note, .pub-meta, .pub-title, .nl-text, .tl-card h3, .tl-card p, .gal-cap, .edu-inst, .card h3, .hero-sub, .lab-row").forEach(function (el) {
      var raw = el.dataset.smRaw;
      if (raw == null) { raw = el.innerHTML; el.dataset.smRaw = raw; }
      if (raw.indexOf("**") >= 0 || raw.indexOf("](") >= 0) el.innerHTML = rich(raw);
    });
  };
  richAll();
  new MutationObserver(function () { setTimeout(richAll, 80); }).observe(document.body, { childList: true, subtree: true });
  var hfoot = function () {
    var foot = document.querySelector(".foot");
    if (!foot || foot.dataset.hdone) return;
    var h4s = foot.querySelectorAll("h4");
    var boxes = [];
    h4s.forEach(function (h) { if (h.parentElement && h.parentElement !== foot) boxes.push(h.parentElement); });
    if (boxes.length >= 2) {
      foot.dataset.hdone = "1";
      foot.style.display = "grid";
      foot.style.gridTemplateColumns = "repeat(auto-fit,minmax(min(100%,200px),1fr))";
      foot.style.gap = "10px 24px";
    }
  };
  hfoot();
  new MutationObserver(hfoot).observe(document.body, { childList: true, subtree: true });
  if (window.SM_EDITOR) {
    var oldConfirm = window.confirm;
    window.confirm = function (msg) {
      var ok = oldConfirm.apply(window, arguments);
      if (ok && String(msg).indexOf("merge ho jayenge") >= 0) {
        setTimeout(function () { window.open("https://github.com/sahilmaurya007/sahil-maurya-website/pulls", "_blank"); }, 300);
      }
      return ok;
    };
  }
})();
