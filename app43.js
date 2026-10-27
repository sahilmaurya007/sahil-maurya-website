/* app43.js - BLOG AUDIO BAR only (sirf blogs section - site FAB removed per user) + copy fix. DO NOT EDIT. */
(function () {
  "use strict";
  if (window.SM_AUDIO_DONE) return;
  window.SM_AUDIO_DONE = true;
  var TTS = window.SM_TTS;
  var css = document.createElement("style");
  css.textContent = ".sm-audbar{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:0 0 14px;padding:0 0 12px;border-bottom:1px dashed var(--border)}.sm-audbar select{padding:5px 8px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.72rem;max-width:190px}.sm-audbar button{padding:5px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.72rem;font-weight:600;cursor:pointer}.sm-audbar button:hover{border-color:var(--accent);color:var(--accent)}.sm-audbar .on{background:var(--grad-btn);color:#fff;border-color:transparent}.sm-audbar button:disabled{opacity:.55;cursor:wait}.sm-audt{font-family:'JetBrains Mono',monospace;font-size:.62rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}body.sm-blog-open header,body.sm-blog-open main,body.sm-blog-open footer{-webkit-user-select:none!important;user-select:none!important}";
  document.head.appendChild(css);
  if (!TTS) return;

  /* Voice dropdown: SAB voices male+female, ♀/♂ badge - koi auto-force nahi */
  var makeBar = function (host, getText, label) {
    var bar = document.createElement("div");
    bar.className = "sm-audbar";
    bar.innerHTML = "<span class='sm-audt'>🎙 " + label + "</span><select class='sa-lang'><option value='en'>English</option><option value='hi'>हिन्दी (Hindi)</option></select><select class='sa-voice' title='Voice (male/female sab)'></select><select class='sa-rate' title='Speed'><option value='0.85'>Madhur 🎧</option><option value='1' selected>Normal</option><option value='1.15'>Fast</option></select><button class='sa-play' type='button'>▶ Suno</button><button class='sa-pause' type='button'>⏸ Pause</button><button class='sa-stop' type='button'>⏹ Stop</button>";
    host.parentNode.insertBefore(bar, host.nextSibling);
    var lang = bar.querySelector(".sa-lang"), vsel = bar.querySelector(".sa-voice"), rate = bar.querySelector(".sa-rate");
    var fill = function () {
      var list = TTS.byLang(lang.value === "hi" ? "hi" : "en");
      vsel.innerHTML = list.length ? list.map(function (v, i) {
        var g = /female|zira|swara|kalpana|neerja|heera|leah|aria/i.test(v.name) ? " ♀" : /male|hemant|ravi|david|mark|george|prabhat|madhur/i.test(v.name) ? " ♂" : "";
        return "<option value='" + i + "'>" + v.name + g + " (" + v.lang + ")</option>";
      }).join("") : "<option value=''>Browser voice (default)</option>";
      vsel.value = "0"; /* default = PEHLI voice, koi force nahi */
    };
    fill();
    lang.addEventListener("change", fill);
    var playing = false;
    var resetUI = function () { playing = false; bar.querySelector(".sa-play").classList.remove("on"); bar.querySelector(".sa-pause").textContent = "⏸ Pause"; };
    TTS.done = resetUI;
    bar.querySelector(".sa-play").addEventListener("click", function () {
      var list = TTS.byLang(lang.value === "hi" ? "hi" : "en");
      var v = vsel.value !== "" && list[+vsel.value] ? list[+vsel.value] : (list[0] || null);
      TTS.play(getText(), v, +rate.value);
      playing = true; this.classList.add("on");
    });
    bar.querySelector(".sa-pause").addEventListener("click", function () {
      if (!playing) return;
      if (speechSynthesis.paused) { TTS.resume(); this.textContent = "⏸ Pause"; }
      else { TTS.pause(); this.textContent = "▶ Resume"; }
    });
    bar.querySelector(".sa-stop").addEventListener("click", function () {
      TTS.stop(); /* gen token engine ke andar sab dead */
      resetUI();
    });
  };

  /* SIRF BLOG READER me audio bar (site FAB hata diya) */
  var wireBlog = function () {
    var modal = document.querySelector(".blog-modal");
    var themes = modal && modal.querySelector(".blog-themes");
    if (!modal || !themes || modal.dataset.aud) return;
    modal.dataset.aud = "1";
    var bodyEl = modal.querySelector(".blog-art-body"), hold = modal.querySelector(".blog-pghold");
    makeBar(themes, function () { return ((bodyEl ? bodyEl.textContent : "") + " " + (hold ? hold.textContent : "")).replace(/\s+/g, " ").trim(); }, "Audio");
    /* COPY FIX: blog open = sirf blog select/copy */
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
})();
