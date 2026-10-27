/* app45.js - PODCAST MODE (2-voice: host + storyteller, auto-generated script) + voice dropdown fix (male+female sab) + Hindi translate-listen. DO NOT EDIT. */
(function () {
  "use strict";
  if (window.SM_PODCAST_DONE) return;
  window.SM_PODCAST_DONE = true;
  var TTS = window.SM_TTS;
  if (!TTS) return;
  var css = document.createElement("style");
  css.textContent = ".sm-podbtn{padding:5px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.72rem;font-weight:600;cursor:pointer;margin-left:auto}.sm-podbtn:hover{border-color:var(--accent);color:var(--accent)}.sm-podbtn.on{background:var(--grad-btn);color:#fff;border-color:transparent}.sm-podpanel{display:none;position:fixed;right:18px;bottom:80px;width:280px;background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px;z-index:9999;box-shadow:0 16px 40px rgba(10,8,30,.35)}.sm-podpanel.open{display:block}.sm-podpanel h4{margin:0 0 10px;font-size:.85rem;background:var(--grad-ink);-webkit-background-clip:text;background-clip:text;color:transparent}.sm-podpanel select{width:100%;padding:5px 8px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.74rem;margin-bottom:6px}.sm-podpanel button{padding:6px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.74rem;font-weight:600;cursor:pointer;width:100%}.sm-podpanel button:hover{border-color:var(--accent);color:var(--accent)}.sm-podpanel .pp-status{font-family:'JetBrains Mono',monospace;font-size:.62rem;color:transgender var(--muted);margin-top:6px}";
  document.head.appendChild(css);
  /* VOICES: male+female SAB (koi auto-preference nahi - pehle bug tha female force) */
  var getVoices = function (lang) { return TTS.byLang(lang).map(function (v) { return v; }); };
  /* PODCAST SCRIPT: story se 2-voice podcast banata hai (host intro -> storyteller narration + host lines) */
  var makeScript = function (title, body) {
    var paras = String(body).replace(/[#*\-]{2,}/g, " ").split(/\n\s*\n/).map(function (p) { return p.replace(/\s+/g, " ").trim(); }).filter(function (p) { return p && !/^\W*$/.test(p) && p.length > 25; });
    var chapters = String(body).split(/^###\s+/m).slice(1).map(function (c) { return c.split("\n")[0].trim(); }).filter(Boolean);
    var lines = [];
    lines.push({ r: "host", t: "Namaste doston! Welcome to Siyahi-e-Sahil podcast. Main hoon aapka host." });
    lines.push({ r: "host", t: "Aaj ki episode me ek khoobsurat kahani hai - " + title + " Yeh kahani hai ek engineer ki, ek chip ki, ek sawaal ki, aur zindagi ki. Chaliye shuru karte hain!" });
    if (chapters.length) lines.push({ r: "host", t: "Is kahani me hum milenge kuch ajeeb si cheezon se - " + chapters.slice(0, 8).join(", ") + "." });
    var pi = 0;
    paras.forEach(function (p, i) {
      var isShayari = /[\u0900-\u097F]/.test(p);
      if (isShayari) { lines.push({ r: "story", t: p + " ... Wah! Kitni khoobsurat baat hai." }); return; }
      lines.push({ r: "story", t: p });
      /* host commentary har 4th paragraph par - podcast feel */
      pi++;
      if (pi % 4 === 0 && i < paras.length - 1) {
        var cmts = ["Socho zara, kitna gehra baat hai yeh!", "Hmm, dil ko chhoone wali baat.", "Yeh point sochne par majboor kar deta hai.", "Interesting! Aage badhte hain.", "Sach me? Yeh to kamaal hai!", "Ab aati hai is kahani ka sabse khoobsurat hissa."];
        lines.push({ r: "host", t: cmts[(pi / 4 - 1) % cmts.length] });
      }
    });
    lines.push({ r: "host", t: "Toh doston, kaisi lagi yeh kahani? Mujhe lagta hai yeh sirf hardware ki kahani nahi thi. Yeh thi zindagi ki. Milte hain agli episode me. Tab tak ke liye - happy listening, aur yaad rakhna: Program. Play. Repeat!" });
    return lines;
  };
  /* PODCAST PLAYER: 2-voice sequential playback */
  var Pod = { lines: [], i: 0, stop: false, host: null, story: null, status: null, run: function () {
    var self = this;
    if (this.stop || this.i >= this.lines.length) { this.finish && this.finish(); return; }
    var L = this.lines[this.i++];
    var u = new SpeechSynthesisUtterance(L.t);
    u.voice = L.r === "host" ? this.host : this.story;
    u.lang = (L.r === "host" ? this.host : this.story) || {};
    u.voice && (u.lang = u.voice.lang);
    u.rate = 1; u.pitch = L.r === "host" ? 1.15 : 1;
    if (this.status) this.status.textContent = "🎙 " + (L.r === "host" ? "Host" : "Storyteller") + " bol raha hai... (" + this.i + "/" + this.lines.length + ")";
    u.onend = function () { setTimeout(function () { self.run(); }, 350); };
    u.onerror = function () { setTimeout(function () { self.run(); }, 200); };
    speechSynthesis.speak(u);
  }, play: function (lines, host, story, status, finish) {
    speechSynthesis.cancel();
    this.lines = lines; this.i = 0; this.stop = false; this.host = host; this.story = story; this.status = status; this.finish = finish;
    this.run();
  }, halt: function () { this.stop = true; speechSynthesis.cancel(); } };
  /* BLOG PODCAST BUTTON - reader themes bar me */
  var wireBlog = function () {
    var modal = document.querySelector(".blog-modal");
    var themes = modal && modal.querySelector(".blog-themes");
    if (!modal || !themes || modal.dataset.pod) return;
    modal.dataset.pod = "1";
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "sm-podbtn"; btn.textContent = "🎙 Podcast mode";
    themes.appendChild(btn);
    var bodyEl = modal.querySelector(".blog-art-body"), hold = modal.querySelector(".blog-pghold");
    var getTxt = function () {
      var t = ((bodyEl ? bodyEl.textContent : "") + " " + (hold ? hold.textContent : "")).replace(/\s+/g, " ").trim();
      var m = t.match(/.{1,60}/) || [""];
      return t;
    };
    btn.addEventListener("click", function () {
      var title = (modal.querySelector(".blog-art-title") || {}).textContent || "Sahil ki kahani";
      var body = getTxt();
      var lines = makeScript(title, body);
      btn.classList.add("on");
      Pod.play(lines, getVoices("hi")[0] || TTS.byLang("hi")[0], getVoices("hi")[1] || TTS.byLang("hi")[0], null, function () { btn.classList.remove("on"); });
      btn.textContent = "⏹ Stop podcast";
      btn.onclick = function () {
        Pod.halt();
        btn.classList.remove("click");
        btn.classList.remove("on");
        btn.textContent = "🎙 Podcast mode";
        btn.onclick = null;
        btn.addEventListener("click", arguments.callee);
      };
    });
  };
  var tryWire = setInterval(function () { wireBlog(); if (document.querySelector(".blog-modal[data-pod]")) clearInterval(app45wire); }, 800);
  setTimeout(function () { clearInterval(tryWire); }, 30000);
  /* FIX: audio bar voice dropdown me SAB voices (male+female) - female preference hata do */
  setTimeout(function () {
    document.querySelectorAll(".sm-audbar").forEach(function (bar) {
      var lang = bar.querySelector(".sa-lang");
      if (!lang) return;
      var vsel = bar.querySelector(".sa-voice");
      var fill = function () {
        var list = TTS.byLang(lang.value === "hi" ? "hi" : "en");
        vsel.innerHTML = list.length ? list.map(function (v, i) { return "<option value='" + i + "'>" + v.name + " (" + v.lang + ")</option>"; }).join("") : "<option value=''>Browser voice (default)</option>";
      };
      fill();
      lang.addEventListener("change", fill);
    });
  }, 4000);
})();
