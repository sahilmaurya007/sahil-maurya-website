/* app47.js - BOOK HINDI TRANSLATE: blog ko Hindi me padhne ka button. NO lookbehind (old browser safe). DO NOT EDIT. */
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
  var paraSplit = function (s) {
    var out = [], buf = "";
    for (var i = 0; i < s.length; i++) {
      buf += s[i];
      if (/[।.!?]/.test(s[i]) && (i === s.length - 1 || s[i + 1] === " ")) { out.push(buf.trim()); buf = ""; }
    }
    if (buf.trim()) out.push(buf.trim());
    return out.filter(Boolean);
  };
  var wire = function () {
    var modal = document.querySelector(".blog-modal");
    var themes = modal && modal.querySelector(".blog-themes");
    if (!modal || !themes || modal.dataset.htr) return;
    modal.dataset.htr = "1";
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "sm-htrbtn"; btn.textContent = "🅷 पढ़ें: हिन्दी";
    btn.title = "Blog ko Hindi me padho (translate)";
    themes.appendChild(btn);
    var stat = document.createElement("span");
    stat.className = "sm-htrstat";
    themes.appendChild(stat);
    var bodyEl = modal.querySelector(".blog-art-body"), hold = modal.querySelector(".blog-pghold");
    var origHTML = null;
    var busy = false;
    btn.addEventListener("click", function () {
      if (busy) return;
      if (!HTR) { stat.textContent = "Translate module load nahi hua"; return; }
      if (btn.classList.contains("on")) {
        var txtEl = bodyEl.querySelector(".blog-art-txt");
        if (txtEl && origHTML !== null) txtEl.innerHTML = origHTML;
        btn.classList.remove("on");
        btn.textContent = "🅷 पढ़ें: हिन्दी";
        stat.textContent = "English वापस ✅";
        return;
      }
      var txt = ((bodyEl ? bodyEl.textContent : "") + " " + (hold ? hold.textContent : "")).replace(/\s+/g, " ").trim();
      if (!txt) return;
      busy = true;
      btn.textContent = "⏳ 0%";
      var sents = HTR.splitSents(txt);
      HTR.translateBatched(sents, function (p) { btn.textContent = "⏳ " + p + "%"; }).then(function (arr) {
        var hindi = arr.join(" ");
        var txtEl = bodyEl.querySelector(".blog-art-txt");
        if (!txtEl) { busy = false; btn.textContent = "🅷 पढ़ें: हिन्दी"; return; }
        origHTML = txtEl.innerHTML;
        var bookBtn = modal.querySelector(".bt-book");
        if (bookBtn && bookBtn.classList.contains("on")) bookBtn.click();
        var paras = paraSplit(hindi);
        txtEl.innerHTML = "";
        for (var i = 0; i < paras.length; i++) {
          var p = document.createElement("p");
          p.style.margin = "0 0 14px";
          p.textContent = paras[i];
          txtEl.appendChild(p);
        }
        busy = false;
        btn.textContent = "🅔 English वापस";
        btn.classList.add("on");
        stat.textContent = "हिन्दी अनुवाद ✅";
      });
    });
  };
  var tryWire = setInterval(function () { wire(); if (document.querySelector(".blog-modal[data-htr]")) clearInterval(tryWire); }, 800);
  setTimeout(function () { clearInterval(tryWire); }, 30000);
})();
