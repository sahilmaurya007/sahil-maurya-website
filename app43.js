/* app43.js - BLOG AUDIO BAR v2: waits for TTS engine (loader-order fix), Voice 1/2/3 modes, English-only UI. DO NOT EDIT. */
(function () {
  "use strict";
  if (window.SM_AUDIO_DONE) return;
  var css = document.createElement("style");
  css.textContent = ".sm-audbar{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:0 0 14px;padding:0 0 12px;border-bottom:1px dashed var(--border)}.sm-audbar select{padding:5px 8px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.72rem;max-width:190px}.sm-audbar button{padding:5px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.72rem;font-weight:600;cursor:pointer}.sm-audbar button:hover{border-color:var(--accent);color:var(--accent)}.sm-audbar .on{background:var(--grad-btn);color:#fff;border-color:transparent}.sm-audbar button:disabled{opacity:.55;cursor:wait}.sm-audt{font-family:'JetBrains Mono',monospace;font-size:.62rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}body.sm-blog-open header,body.sm-blog-open main,body.sm-blog-open footer{-webkit-user-select:none!important;user-select:none!important}";
  document.head.appendChild(css);
  /* WAIT FOR ENGINE: loader parallel load karta hai - engine milne tak retry (asli root cause: bar dikhta hi nahi tha) */
  var init = function () {
    var TTS = window.SM_TTS;
    if (!TTS) return false;
    window.SM_AUDIO_DONE = true;
    var makeBar = function (host, getText, label) {
      var bar = document.createElement("div");
      bar.className = "sm-audbar";
      bar.innerHTML = "<span class='sm-audt'>🎙 " + label + "</span><select class='sa-lang'><option value='en'>English</option><option value='hi'>Hindi</option></select><select class='sa-voice' title='Voice mode'></select><select class='sa-rate' title='Speed'><option value='0.85'>Calm 🎧</option><option value='1' selected>Normal</option><option value='1.15'>Fast</option></select><button class='sa-play' type='button'>▶ Listen</button><button class='sa-pause' type='button'>⏸ Pause</button><button class='sa-stop' type='button'>⏹ Stop</button>";
      host.parentNode.insertBefore(bar, host.nextSibling);
      var lang = bar.querySelector(".sa-lang"), vsel = bar.querySelector(".sa-voice"), rate = bar.querySelector(".sa-rate");
      var curList = [];
      var fill = function () {
        var g = TTS.groups(lang.value === "hi" ? "hi" : "en");
        curList = g;
        if (!g.length) { vsel.innerHTML = "<option value=''>Browser voice (default)</option>"; vsel.value = ""; return; }
        vsel.innerHTML = g.map(function (x, i) { return "<option value='" + i + "'>" + x.label + "</option>"; }).join("");
        vsel.value = "0";
      };
      fill();
      lang.addEventListener("change", fill);
      setTimeout(fill, 1500);
      setTimeout(fill, 4000);
      var resetUI = function () { bar.querySelector(".sa-play").classList.remove("on"); bar.querySelector(".sa-pause").textContent = "⏸ Pause"; };
      TTS.done = resetUI;
      bar.querySelector(".sa-play").addEventListener("click", function () {
        var v = (vsel.value !== "" && curList[+vsel.value]) ? curList[+vsel.value] : null;
        TTS.play(getText(), v, +rate.value);
        this.classList.add("on");
      });
      var pauseBtn = bar.querySelector(".sa-pause");
      pauseBtn.addEventListener("click", function () {
        try {
          if (speechSynthesis.paused) { TTS.resume(); pauseBtn.textContent = "⏸ Pause"; }
          else { TTS.pause(); pauseBtn.textContent = "▶ Resume"; }
        } catch (e) {}
      });
      bar.querySelector(".sa-stop").addEventListener("click", function () { TTS.stop(); resetUI(); });
      bar._fill = fill;
    };
    var wireBlog = function () {
      var modal = document.querySelector(".blog-modal");
      var themes = modal && modal.querySelector(".blog-themes");
      if (!modal || !themes || modal.dataset.aud) return;
      modal.dataset.aud = "1";
      var bodyEl = modal.querySelector(".blog-art-body"), hold = modal.querySelector(".blog-pghold");
      makeBar(themes, function () { return ((bodyEl ? bodyEl.textContent : "") + " " + (hold ? hold.textContent : "")).replace(/\s+/g, " ").trim(); }, "Audio");
      new MutationObserver(function () {
        document.body.classList.toggle("sm-blog-open", modal.classList.contains("open"));
      }).observe(modal, { attributes: true, attributeFilter: ["class"] });
      document.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === "a" && modal.classList.contains("open")) {
          e.preventDefault();
          var art = modal.querySelector(".blog-article") || modal;
          var range = document.createRange(); range.selectNodeContents(art);
          var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        }
      });
      document.addEventListener("copy", function (e) {
        if (!modal.classList.contains("open")) return;
        var sel = window.getSelection();
        if (sel && sel.anchorNode && !modal.contains(sel.anchorNode)) e.preventDefault();
      });
    };
    var tryWire = setInterval(function () { wireBlog(); if (document.querySelector(".blog-modal[data-aud]")) clearInterval(tryWire); }, 800);
    setTimeout(function () { clearInterval(tryWire); }, 30000);
    return true;
  };
  var tryInit = setInterval(function () { if (init()) clearInterval(tryInit); }, 400);
  setTimeout(function () { clearInterval(tryInit); }, 20000);
})();
