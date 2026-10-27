/* app44.js - BLOG SHARE (theme/skin-aware link) + PER-BLOG READER COUNTER (countapi). DO NOT EDIT. */
(function () {
  "use strict";
  if (window.SM_SHARE_DONE) return;
  window.SM_SHARE_DONE = true;
  var css = document.createElement("style");
  css.textContent = ".sm-sharebar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:12px 0 0;padding-top:12px;border-top:1px dashed var(--border)}.sm-sharebar button{padding:5px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.72rem;font-weight:600;cursor:pointer}.sm-sharebar button:hover{border-color:var(--accent);color:var(--accent)}.sm-views{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;border:1px solid var(--border);background:var(--soft);color:var(--muted);font-size:.72rem;font-family:'JetBrains Mono',monospace}.sm-views b{color:var(--accent);font-size:.8rem}";
  document.head.appendChild(css);
  var slug = function (t) { return String(t || "blog").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "blog"; };
  var hitCount = function (key) {
    return fetch("https://countapi.mileshilliard.com/api/v1/hit/" + key).then(function (r) { return r.json(); }).then(function (d) { return (d && typeof d.value === "number") ? d.value : 0; }).catch(function () { return 0; });
  };
  var pad = function (n) { return String(n).padStart(4, "0"); };
  var wire = function () {
    var modal = document.querySelector(".blog-modal");
    var art = modal && modal.querySelector(".blog-article");
    if (!modal || !art || modal.dataset.share) return;
    modal.dataset.share = "1";
    var title = modal.querySelector(".blog-art-title"), themes = modal.querySelector(".blog-themes");
    var curTitle = function () { return (title ? title.textContent : "blog").trim(); };
    /* view chip + hit counter (blog kholne par ek baar, per session) */
    var viewChip = document.createElement("div");
    viewChip.className = "sm-views";
    viewChip.innerHTML = "👀 <b>—</b> padhe</div>";
    var ref = title || themes;
    ref.parentNode.insertBefore(viewChip, ref.nextSibling);
    var key = "sm-sahil-blog-" + slug(window.SM_CUR_BLOG_TITLE || curTitle());
    try {
      if (sessionStorage.getItem("sm-hit-" + key) !== "1") {
        sessionStorage.setItem("sm-hit-" + key, "1");
        hitCount(key).then(function (n) { viewChip.querySelector("b").textContent = pad(n); });
      } else {
        fetch("https://countapi.mileshilliard.com/api/v1/get/" + key).then(function (r) { return r.json(); }).then(function (d) { if (d && typeof d.value === "number") viewChip.querySelector("b").textContent = pad(d.value); }).catch(function () {});
      }
    } catch (e) {}
    /* share bar: current theme+skin wale link ke saath */
    var bar = document.createElement("div");
    bar.className = "sm-sharebar";
    bar.innerHTML = "<button class='ss-link' type='button'>🔗 Copy link</button><button class='ss-wa' type='button'>💬 WhatsApp</button><button class='ss-tw' type='button'>🐦 X</button><span class='muted' style='font-size:.68rem'>jis mode me share karo, wahi mode me dikhega</span>";
    viewChip.parentNode.insertBefore(bar, viewChip.nextSibling);
    var makeLink = function () {
      var th = (document.documentElement.getAttribute("data-theme") || localStorage.getItem("sm-theme") || "light");
      var sk = (document.documentElement.getAttribute("data-skin") || localStorage.getItem("sm-skin") || "classic");
      var base = location.origin + location.pathname;
      return base + "#theme=" + th + "&skin=" + sk + "&blog=" + slug(window.SM_CUR_BLOG_TITLE || curTitle());
    };
    var doCopy = function (txt, msg) {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(function () { if (msg) alert(msg); }).catch(function () { fallback(); }); }
      else fallback();
      function fallback() { var i = document.createElement("input"); i.value = txt; document.body.appendChild(i); i.select(); try { document.execCommand("copy"); } catch (e) {} i.remove(); if (msg) alert(msg); }
    };
    bar.querySelector(".ss-link").addEventListener("click", function () { doCopy(makeLink(), "Blog link copy ho gaya! Jis colour mode me aap ho, usi me dikhega. 🎨"); });
    bar.querySelector(".ss-wa").addEventListener("click", function () { window.open("https://wa.me/?text=" + encodeURIComponent("Siyahi-e-Sahil: " + curTitle() + " — " + makeLink()), "_blank"); });
    bar.querySelector(".ss-tw").addEventListener("click", function () { window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent("Siyahi-e-Sahil: " + curTitle()) + "&url=" + encodeURIComponent(makeLink()), "_blank"); });
  };
  var tryWire = setInterval(function () { wire(); if (document.querySelector(".blog-modal[data-share]")) clearInterval(tryWire); }, 800);
  setTimeout(function () { clearInterval(tryWire); }, 30000);
  /* #blog=slug hash: link khulte hi blog khol do (auto-open after app39 render) */
  var openFromHash = function () {
    var m = location.hash.match(/blog=([a-z0-9\-]+)/);
    if (!m) return;
    var slugW = m[1];
    setTimeout(function () {
      var cards = document.querySelectorAll(".blog-card");
      for (var i = 0; i < cards.length; i++) {
        var tEl = cards[i].querySelector(".blog-title");
        if (tEl && slug(tEl.textContent) === slugW) { cards[i].click(); break; }
      }
    }, 1200);
  };
  if (document.readyState === "complete") openFromHash();
  else window.addEventListener("load", openFromHash);
  /* app39 ko current blog title batana */
  document.addEventListener("click", function (e) {
    var card = e.target.closest && e.target.closest(".blog-card");
    if (card && card.querySelector(".blog-title")) window.SM_CUR_BLOG_TITLE = card.querySelector(".blog-title").textContent.trim();
  }, true);
})();
