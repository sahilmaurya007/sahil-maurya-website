/* app47.js - BOOK HINDI READ v2: wait for translate module, book-holder fix, English status. DO NOT EDIT. */
(function () {
  "use strict";
  if (window.SM_BOOKTR_DONE) return;
  var css = document.createElement("style");
  css.textContent = ".sm-htrbtn{padding:5px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.72rem;font-weight:600;cursor:pointer;flex:none}.sm-htrbtn:hover{border-color:var(--accent);color:var(--accent)}.sm-htrbtn.on{background:var(--grad-btn);color:#fff;border-color:transparent}.sm-htrstat{font-family:'JetBrains Mono',monospace;font-size:.62rem;color:var(--muted);margin-left:8px}";
  document.head.appendChild(css);
  var paraSplit = function (s) {
    var out = [], buf = "";
    for (var i = 0; i < s.length; i++) {
      buf += s[i];
      if (/[।.!?]/.test(s[i]) && (i === s.length - 1 || s[i + 1] === " ")) { out.push(buf.trim()); buf = ""; }
    }
    if (buf.trim()) out.push(buf.trim());
    return out.filter(Boolean);
  };
  var init = function () {
    var HTR = window.SM_HINDI_TR;
    if (!HTR) return false;
    window.SM_BOOKTR_DONE = true;
    var wire = function () {
      var modal = document.querySelector(".blog-modal");
      var themes = modal && modal.querySelector(".blog-themes");
      if (!modal || !themes || modal.dataset.htr) return;
      modal.dataset.htr = "1";
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "sm-htrbtn"; btn.textContent = "🅷 Read in Hindi";
      btn.title = "Read this blog in Hindi (translate)";
      themes.appendChild(btn);
      var stat = document.createElement("span");
      stat.className = "sm-htrstat";
      themes.appendChild(stat);
      var bodyEl = modal.querySelector(".blog-art-body"), hold = modal.querySelector(".blog-pghold");
      var origHTML = null, origHoldHTML = null;
      var busy = false;
      btn.addEventListener("click", function () {
        if (busy) return;
        if (btn.classList.contains("on")) {
          var txtEl = bodyEl.querySelector(".blog-art-txt");
          if (txtEl && origHTML !== null) txtEl.innerHTML = origHTML;
          if (hold && origHoldHTML !== null) hold.innerHTML = origHoldHTML;
          btn.classList.remove("on");
          btn.textContent = "🅷 Read in Hindi";
          stat.textContent = "English restored ✓";
          return;
        }
        /* BOOK MODE FIX: text dono se (body + page holder) */
        var txt = ((bodyEl ? bodyEl.textContent : "") + " " + (hold ? hold.textContent : "")).replace(/\s+/g, " ").trim();
        if (!txt) { stat.textContent = "No text found"; return; }
        busy = true;
        btn.textContent = "⏳ 0%";
        var sents = HTR.splitSents(txt);
        HTR.translateBatched(sents, function (p) { btn.textContent = "⏳ " + p + "%"; }).then(function (arr) {
          var hindi = arr.join(" ");
          var txtEl = bodyEl.querySelector(".blog-art-txt");
          if (!txtEl) { busy = false; btn.textContent = "🅷 Read in Hindi"; stat.textContent = "Cannot translate here"; return; }
          origHTML = txtEl.innerHTML;
          if (hold) origHoldHTML = hold.innerHTML;
          /* book mode temporarily off (translated text single flow me dikhega) */
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
          btn.textContent = "🅔 English back";
          btn.classList.add("on");
          stat.textContent = "Hindi ready ✓";
        });
      });
    };
    var tryWire = setInterval(function () { wire(); if (document.querySelector(".blog-modal[data-htr]")) clearInterval(tryWire); }, 800);
    setTimeout(function () { clearInterval(tryWire); }, 30000);
    return true;
  };
  var tryInit = setInterval(function () { if (init()) clearInterval(tryInit); }, 400);
  setTimeout(function () { clearInterval(tryInit); }, 20000);
})();
