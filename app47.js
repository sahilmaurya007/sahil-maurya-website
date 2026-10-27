/* app47.js - BOOK MODE HINDI TRANSLATE: blog ko Hindi me PADHNE ka option (text translate, book pages me). DO NOT EDIT. */
(function () {
  "use strict";
  if (window.SM_BOOKTR_DONE) return;
  window.SM_BOOKTR_DONE = true;
  var HTR = null;
  var css = document.createElement("style");
  css.textContent = ".sm-htrbtn{padding:5px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.72rem;font-weight:600;cursor:pointer;flex:none}.sm-htrbtn:hover{border-color:var(--accent);color:var(--accent)}.sm-htrbtn.on{background:var(--grad-btn);color:#fff;border-color:transparent}.sm-htrstat{font-family:'JetBrains Mono',monospace;font-size:.62rem;color:var(--muted);margin-left:8px}";
  document.head.appendChild(css);
  var waitHTR = setInterval(function () {
    if (window.SM_HINDI_TR) { HTR = window.SM_HINDI_TR; clearInterval(waitHTR); }
  }, 500);
  setTimeout(function () { clearInterval(waitHTR); }, 15000);
  var wire = function () {
    var modal = document.querySelector(".blog-modal");
    var themes = modal && modal.querySelector(".blog-themes");
    if (!modal || !themes || modal.dataset.htr) return;
    modal.dataset.htr = "1";
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "sm-htrbtn"; btn.textContent = "🅷 पढ़ें: हिन्दी में";
    btn.title = "Blog ko Hindi me padho (translate)";
    themes.appendChild(btn);
    var stat = document.createElement("span");
    stat.className = "sm-htrstat";
    themes.appendChild(stat);
    var bodyEl = modal.querySelector(".blog-art-body"), hold = modal.querySelector(".blog-pghold");
    var bookBtn = null;
    var busy = false;
    btn.addEventListener("click", function () {
      if (busy) return;
      if (!HTR) { stat.textContent = "Translate module load nahi hua"; return; }
      /* toggle back to English (restore) */
      if (btn.classList.contains("on")) {
        var restore = modal.querySelector(".blog-close");
        if (restore) restore.click();
        setTimeout(function () {
          var cards = document.querySelectorAll(".blog-card");
          var t = window.SM_CUR_BLOG_TITLE || "";
          for (var i = 0; i < cards.length; i++) {
            var te = cards[i].querySelector(".blog-title");
            if (te && te.textContent.trim() === t) { cards[i].click(); break; }
          }
        }, 300);
        stat.textContent = "";
        return;
      }
      /* text nikal lo (visible mode me se) */
      var txt = ((bodyEl ? bodyEl.textContent : "") + " " + (hold ? hold.textContent : "")).replace(/\s+/g, " ").trim();
      if (!txt) return;
      busy = true;
      btn.textContent = "⏳ 0%";
      var sents = HTR.splitSents(txt);
      HTR.translateBatched(sents, function (p) { btn.textContent = "⏳ " + p + "%"; }).then(function (arr) {
        var hindi = arr.join(" ");
        var title = (modal.querySelector(".blog-art-title") || {}).textContent || "Sahil ki kahani";
        /* render Hindi text in reader (original me revert ke liye restore flow) */
        var txtEl = bodyEl.querySelector(".blog-art-txt") || bodyEl;
        txtEl.innerHTML = "";
        var paras = hindi.split(/(?<=[।.!?])\s+/);
        for (var i = 0; i < paras.length; i++) {
          if (!paras[i].trim()) continue;
          var p = document.createElement("p");
          p.textContent = paras[i].trim();
          txtEl.appendChild(p);
        }
        busy = false;
        btn.textContent = "🅔 English (वापस)";
        btn.classList.add("on");
        stat.textContent = "हिन्दी अनुवाद ✅";
      });
    });
  };
  var tryWire = setInterval(function () { wire(); if (document.querySelector(".blog-modal[data-htr]")) clearInterval(tryWire); }, 800);
  setTimeout(function () { clearInterval(tryWire); }, 30000);
})();
