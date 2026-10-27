/* app43.js - AUDIO UI (Hindi+English, multi-voice, podcast mode) + COPY FIX. PART 2 of audio feature. DO NOT EDIT. */
(function () {
  "use strict";
  if (window.SM_AUDIO_DONE) return;
  window.SM_AUDIO_DONE = true;
  var TTS = window.SM_TTS;
  var css = document.createElement("style");
  css.textContent = ".sm-audbar{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:0 0 14px;padding:0 0 12px;border-bottom:1px dashed var(--border)}.sm-audbar select{padding:5px 8px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.72rem;max-width:170px}.sm-audbar button{padding:5px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.72rem;font-weight:600;cursor:pointer}.sm-audbar button:hover{border-color:var(--accent);color:var(--accent)}.sm-audbar .on{background:var(--grad-btn);color:#fff;border-color:transparent}.sm-audt{font-family:'JetBrains Mono',monospace;font-size:.62rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}body.sm-blog-open header,body.sm-blog-open main,body.sm-blog-open footer{-webkit-user-select:none!important;user-select:none!important}#smFab{position:fixed;right:18px;bottom:18px;width:52px;height:52px;border-radius:50%;border:none;background:var(--grad-btn);color:#fff;font-size:1.3rem;cursor:pointer;box-shadow:0 10px 26px rgba(60,40,140,.4);z-index:9998;transition:transform .2s ease}#smFab:hover{transform:scale(1.08)}.sm-siteaud{position:fixed;right:18px;bottom:80px;background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px;display:none;z-index:9998;box-shadow:0 16px 40px rgba(10,8,30,.35);width:250px}.sm-siteaud.open{display:block}.sm-siteaud h4{margin:0 0 10px;font-size:.85rem;background:var(--grad-ink);-webkit-background-clip:text;background-clip:text;color:transparent}";
  document.head.appendChild(css);
  if (!TTS) return;

  var makeBar = function (host, getText, label) {
    var bar = document.createElement("div");
    bar.className = "sm-audbar";
    bar.innerHTML = "<span class='sm-audt'>🎙 " + label + "</span><select class='sa-lang'><option value='en'>English</option><option value='hi'>हिन्दी (Hindi)</option></select><select class='sa-voice' title='Voice'></select><select class='sa-rate' title='Speed'><option value='0.85'>Madhur 🎧</option><option value='1' selected>Normal</option><option value='1.15'>Fast</option></select><button class='sa-play' type='button'>▶ Suno</button><button class='sa-pause' type='button'>⏸</button><button class='sa-stop' type='button'>⏹ Stop</button>";
    host.parentNode.insertBefore(bar, host.nextSibling);
    var lang = bar.querySelector(".sa-lang"), vsel = bar.querySelector(".sa-voice"), rate = bar.querySelector(".sa-rate");
    var fill = function () {
      var list = TTS.byLang(lang.value === "hi" ? "hi" : "en");
      if (!list.length) { vsel.innerHTML = "<option value=''>Browser voice (default)</option>"; return; }
      vsel.innerHTML = list.map(function (v, i) { return "<option value='" + i + "'>" + v.name + " (" + v.lang + ")</option>"; }).join("");
      var f = list.findIndex(function (v) { return /female|zira|swara|kalpana|neerja|heera|google/i.test(v.name); });
      if (f > -1) vsel.value = f;
    };
    fill();
    lang.addEventListener("change", fill);
    bar.querySelector(".sa-play").addEventListener("click", function () {
      var list = TTS.byLang(lang.value === "hi" ? "hi" : "en");
      var v = vsel.value !== "" && list[+vsel.value] ? list[+vsel.value] : (list[0] || null);
      TTS.play(getText(), v, +rate.value);
      this.classList.add("on");
    });
    bar.querySelector(".sa-pause").addEventListener("click", function () {
      if (speechSynthesis.paused) { TTS.resume(); this.textContent = "⏸"; } else { TTS.pause(); this.textContent = "▶ Resume"; }
    });
    bar.querySelector(".sa-stop").addEventListener("click", function () {
      TTS.stop();
      bar.querySelector(".sa-play").classList.remove("on");
      bar.querySelector(".sa-pause").textContent = "⏸";
    });
  };

  /* 1) BLOG READER audio bar + copy fix */
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

  /* 2) MAIN SITE floating audio button */
  var siteText = function () {
    var t = [];
    var add = function (s) { if (s && s.textContent) { var x = s.textContent.replace(/\s+/g, " ").trim(); if (x) t.push(x); } };
    add(document.getElementById("heroName"));
    add(document.getElementById("heroIntro"));
    add(document.getElementById("aboutBody"));
    var q = document.getElementById("quoteText"); if (q) add(q);
    return "Welcome to the personal website of Sahil Maurya. " + t.join(". ");
  };
  var fab = document.createElement("button");
  fab.id = "smFab"; fab.type = "button"; fab.title = "Website ko suno (Listen to website)"; fab.textContent = "🎧";
  document.body.appendChild(fab);
  var pan = document.createElement("div");
  pan.className = "sm-siteaud";
  pan.innerHTML = "<h4>🎧 Website Audio</h4><p class='muted' style='font-size:.72rem;margin:0 0 8px'>Hindi/English me poori website suno.</p>";
  document.body.appendChild(pan);
  makeBar(pan.querySelector("p"), siteText, "Site");
  fab.addEventListener("click", function (e) { e.stopPropagation(); pan.classList.toggle("open"); });
  document.addEventListener("click", function (e) { if (!pan.contains(e.target) && e.target !== fab) pan.classList.remove("open"); });
})();
