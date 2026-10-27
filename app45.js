/* app45.js - PODCAST MODE (2-voice: host + storyteller) + all-voices dropdown (male+female sab) + status display. DO NOT EDIT. */
(function () {
  "use strict";
  if (window.SM_PODCAST_DONE) return;
  window.SM_PODCAST_DONE = true;
  var TTS = window.SM_TTS;
  if (!TTS) return;
  var css = document.createElement("style");
  css.textContent = ".sm-podbtn{padding:5px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.72rem;font-weight:600;cursor:pointer;margin-left:auto;flex:none}.sm-podbtn:hover{border-color:var(--accent);color:var(--accent)}.sm-podbtn.on{background:var(--grad-btn);color:#fff;border-color:transparent}.sm-podstat{display:none;font-family:'JetBrains Mono',monospace;font-size:.62rem;color:var(--muted);margin:8px 0 0;padding:6px 10px;border-radius:8px;background:var(--soft);border:1px dashed var(--border)}.sm-podstat.show{display:block}";
  document.head.appendChild(css);
  var pickVoice = function (lang, wantFemale) {
    var list = TTS.byLang(lang);
    if (!list.length) return null;
    var f = list.findIndex(function (v) { return /female|zira|swara|kalpana|neerja|heera|madhur/i.test(v.name); });
    var m = list.findIndex(function (v) { return /male|hemant|ravi|david|mark|george|prabhat/i.test(v.name); });
    if (wantFemale) return list[f > -1 ? f : 0];
    return list[m > -1 ? m : (f > -1 ? f : 0)];
  };
  /* PODCAST SCRIPT: story se 2-voice podcast script banata hai */
  var makeScript = function (title, body) {
    var paras = String(body).replace(/\*\*/g, "").split(/\n\s*\n/).map(function (p) { return p.replace(/\s+/g, " ").trim(); }).filter(function (p) { return p.length > 25; });
    var lines = [];
    lines.push({ r: "host", t: "Namaste doston! Welcome to Siyahi-e-Sahil podcast. Main hoon aapka host." });
    lines.push({ r: "host", t: "Aaj ki episode me ek khoobsurat kahani hai - " + title + ". Yeh kahani hai ek engineer ki, ek chip ki, ek sawaal ki, aur zindagi ki. Chaliye shuru karte hain!" });
    var pi = 0;
    paras.forEach(function (p, i) {
      if (/[\u0900-\u097F]/.test(p)) { lines.push({ r: "story", t: p }); lines.push({ r: "host", t: "Wah! Kitni khoobsurat shayari hai." }); return; }
      lines.push({ r: "story", t: p });
      pi++;
      if (pi % 4 === 0 && i < paras.length - 1) {
        var cmts = ["Socho zara, kitni gehri baat hai yeh!", "Hmm, dil ko chhoone wali baat.", "Yeh point sochne par majboor kar deta hai.", "Interesting! Aage badhte hain.", "Sach me? Yeh to kamaal hai!", "Ab aati hai is kahani ka sabse khoobsurat hissa."];
        lines.push({ r: "host", t: cmts[(pi / 4 - 1) % cmts.length] });
      }
    });
    lines.push({ r: "host", t: "Toh doston, kaisi lagi yeh kahani? Mujhe lagta hai yeh sirf hardware ki kahani nahi thi - yeh thi zindagi ki. Milte hain agli episode me. Tab tak ke liye - happy listening! Aur yaad rakhna: Program. Play. Repeat!" });
    return lines;
  };
  /* PLAYER: 2-voice sequential */
  var Pod = {
    lines: [], i: 0, stop: false, host: null, story: null, statusEl: null, onDone: null,
    say: function () {
      var self = this;
      if (this.stop || this.i >= this.lines.length) { if (this.onDone) this.onDone(); return; }
      var L = this.lines[this.i++];
      var v = L.r === "host" ? this.host : this.story;
      var u = new SpeechSynthesisUtterance(L.t);
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = 0.95; u.pitch = L.r === "host" ? 1.15 : 1;
      if (this.statusEl) this.statusEl.textContent = "🎙 " + (L.r === "host" ? "Host" : "Storyteller") + " bol raha hai... (line " + this.i + " / " + this.lines.length + ")";
      u.onend = function () { setTimeout(function () { self.say(); }, 380); };
      u.onerror = function () { setTimeout(function () { self.say(); }, 200); };
      speechSynthesis.speak(u);
    },
    start: function (lines, host, story, statusEl, onDone) {
      if (!window.speechSynthesis) { alert("Audio is browser me support nahi hai."); return; }
      speechSynthesis.cancel();
      this.lines = lines; this.i = 0; this.stop = false; this.host = host; this.story = story; this.statusEl = statusEl; this.onDone = onDone;
      this.say();
    },
    halt: function () { this.stop = true; try { speechSynthesis.cancel(); } catch (e) {} if (this.statusEl) this.statusEl.classList.remove("show"); }
  };
  /* BLOG READER me podcast button */
  var wireBlog = function () {
    var modal = document.querySelector(".blog-modal");
    var themes = modal && modal.querySelector(".blog-themes");
    if (!modal || !themes || modal.dataset.pod) return;
    modal.dataset.pod = "1";
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "sm-podbtn"; btn.textContent = "🎙 Podcast mode";
    themes.appendChild(btn);
    var stat = document.createElement("div");
    stat.className = "sm-podstat";
    var bodyEl = modal.querySelector(".blog-art-body"), hold = modal.querySelector(".blog-pghold");
    var getTxt = function () { return ((bodyEl ? bodyEl.textContent : "") + " " + (hold ? hold.textContent : "")).replace(/\s+/g, " ").trim(); };
    var playing = false;
    btn.addEventListener("click", function () {
      if (playing) { Pod.halt(); playing = false; btn.classList.remove("on"); btn.textContent = "🎙 Podcast mode"; stat.classList.remove("show"); return; }
      var title = (modal.querySelector(".blog-art-title") || {}).textContent || "Sahil ki kahani";
      var lines = makeScript(title, getTxt());
      if (!lines.length) return;
      playing = true; btn.classList.add("on"); btn.textContent = "⏹ Stop podcast"; stat.classList.add("show");
      Pod.start(lines, pickVoice("hi", true), pickVoice("hi", false), stat, function () { playing = false; btn.classList.remove("on"); btn.textContent = "🎙 Podcast mode"; stat.textContent = "✅ Podcast khatam! Milte hais agli baar."; });
    });
    modal.querySelector(".blog-article").appendChild(stat);
  };
  var tryWire = setInterval(function () { wireBlog(); if (document.querySelector(".blog-modal[data-pod]")) clearInterval(tryWire); }, 800);
  setTimeout(function () { clearInterval(tryWire); }, 30000);
  /* FIX: app43 ke audio bar me female auto-select hata kar SAB voices + default = pehli (male bhi ho sakti hai) */
  var fixBars = function () {
    document.querySelectorAll(".sm-audbar").forEach(function (bar) {
      if (bar.dataset.vfix) return;
      bar.dataset.vfix = "1";
      var lang = bar.querySelector(".sa-lang"), vsel = bar.querySelector(".sa-voice");
      if (!lang || !vsel) return;
      var fill = function () {
        var list = TTS.byLang(lang.value === "hi" ? "hi" : "en");
        vsel.innerHTML = list.length ? list.map(function (v, i) { return "<option value='" + i + "'>" + v.name + " (" + v.lang + ")" + (/female|zira|swara|kalpana|neerja|heera/i.test(v.name) ? " ♀" : /male|hemant|ravi|david|mark|george/i.test(v.name) ? " ♂" : "") + "</option>"; }).join("") : "<option value=''>Browser voice (default)</option>";
      };
      fill();
      lang.addEventListener("change", fill);
    });
  };
  setInterval(fixBars, 2000);
})();
