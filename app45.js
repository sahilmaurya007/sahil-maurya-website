/* app45.js - PODCAST MODE (Hindi+English): grouped voice selects (Host/Storyteller alag-alag), watchdog stuck-line replay. DO NOT EDIT. */
(function () {
  "use strict";
  if (window.SM_PODCAST_DONE) return;
  window.SM_PODCAST_DONE = true;
  var TTS = window.SM_TTS;
  if (!TTS) return;
  var css = document.createElement("style");
  css.textContent = ".sm-podbtn{padding:5px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.72rem;font-weight:600;cursor:pointer;margin-left:auto;flex:none}.sm-podbtn:hover{border-color:var(--accent);color:var(--accent)}.sm-podbtn.on{background:var(--grad-btn);color:#fff;border-color:transparent}.sm-podlang{padding:5px 8px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.72rem;flex:none;max-width:140px}.sm-podv{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:6px 0 0;width:100%}.sm-podv select{padding:5px 8px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.72rem;max-width:190px}.sm-podv span{font-family:'JetBrains Mono',monospace;font-size:.6rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}.sm-podstat{display:none;font-family:'JetBrains Mono',monospace;font-size:.64rem;color:var(--muted);margin:8px 0 0;padding:7px 10px;border-radius:8px;background:var(--soft);border:1px dashed var(--border)}.sm-podstat.show{display:block}";
  document.head.appendChild(css);
  var makeScript = function (title, body, lang) {
    var paras = String(body).replace(/\*\*/g, "").split(/\n\s*\n/).map(function (p) { return p.replace(/\s+/g, " ").trim(); }).filter(function (p) { return p.length > 25; });
    var H = lang === "hi";
    var lines = [];
    if (H) {
      lines.push({ r: "host", t: "नमस्ते दोस्तों! Welcome to Siyahi-e-Sahil podcast. मैं हूँ आपकी host." });
      lines.push({ r: "host", t: "आज की episode में एक खूबसूरत कहानी है - " + title + "। ये कहानी है एक engineer की, एक chip की, एक सवाल की, और ज़िंदगी की। चलिए शुरू करते हैं!" });
    } else {
      lines.push({ r: "host", t: "Hello friends! Welcome to the Siyahi-e-Sahil podcast. I am your host." });
      lines.push({ r: "host", t: "Today's episode is a beautiful story - " + title + ". A story of an engineer, a chip, a question, and life itself. Let's begin!" });
    }
    var pi = 0;
    var CH = H ? ["सोचो ज़रा, कितनी गहरी बात है ये!", "हम्म, दिल को छूने वाली बात।", "ये point सोचने पर मजबूर कर देता है।", "Interesting! आगे बढ़ते हैं।", "सच में? ये तो कमाल है!", "अब आती है इस कहानी का सबसे खूबसूरत हिस्सा।"] : ["Just think about that for a moment!", "Hmm, that touches the heart.", "That point really makes you think.", "Interesting! Let's move ahead.", "Really? That's amazing!", "And now comes the most beautiful part of this story."];
    var SHW = H ? "वाह! कितनी खूबसूरत शायरी है।" : "Wow! What beautiful poetry.";
    paras.forEach(function (p, i) {
      if (/[\u0900-\u097F]/.test(p)) { lines.push({ r: "story", t: p }); lines.push({ r: "host", t: SHW }); return; }
      lines.push({ r: "story", t: p });
      pi++;
      if (pi % 4 === 0 && i < paras.length - 1) lines.push({ r: "host", t: CH[(pi / 4 - 1) % CH.length] });
    });
    lines.push(H
      ? { r: "host", t: "तो दोस्तों, कैसी लगी ये कहानी? मुझे लगता है ये सिर्फ hardware की कहानी नहीं थी - ये थी ज़िंदगी की। मिलते हैं अगली episode में। Tab tak - happy listening! Program. Play. Repeat!" }
      : { r: "host", t: "So friends, how did you find this story? I don't think it was only about hardware - it was about life. See you in the next episode. Until then - happy listening! Program. Play. Repeat!" });
    return lines;
  };
  /* Pod: 2-voice + watchdog stuck-line replay (4-line stop fix) */
  var Pod = {
    lines: [], i: 0, gen: 0, ticker: null, host: null, story: null, statusEl: null, onDone: null, retries: {},
    say: function (myGen, isRetry) {
      var self = this;
      if (this.gen !== myGen) return;
      if (this.i >= this.lines.length) { this.finish(myGen); return; }
      var L = this.lines[this.i];
      var v = L.r === "host" ? this.host : this.story;
      var u = new SpeechSynthesisUtterance(L.t);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "hi-IN";
      u.rate = 0.95; u.pitch = L.r === "host" ? 1.12 : 1;
      if (this.statusEl) this.statusEl.textContent = "🎙 " + (L.r === "host" ? "Host" : "Storyteller") + ": line " + (this.i + 1) + "/" + this.lines.length;
      u.onend = function () {
        if (self.gen !== myGen) return;
        self.i++;
        setTimeout(function () { self.say(myGen, false); }, 350);
      };
      u.onerror = function () { if (self.gen !== myGen) return; setTimeout(function () { self.say(myGen, true); }, 250); };
      speechSynthesis.speak(u);
    },
    finish: function (myGen) {
      if (this.gen !== myGen) return;
      if (this.ticker) { clearInterval(this.ticker); this.ticker = null; }
      if (this.statusEl) this.statusEl.textContent = "✅ Podcast khatam! Milte hain agli episode me. 🎧";
      if (this.onDone) this.onDone();
    },
    start: function (lines, host, story, statusEl, onDone) {
      if (!window.speechSynthesis) { alert("Audio is browser me support nahi hai."); return; }
      try { speechSynthesis.cancel(); } catch (e) {}
      this.lines = lines; this.i = 0; this.host = host; this.story = story; this.statusEl = statusEl; this.onDone = onDone; this.retries = {};
      this.gen++;
      var myGen = this.gen, self = this;
      /* WATCHDOG: line atak jaye (4-line stop bug) to wahi line dobara bolega */
      if (this.ticker) clearInterval(this.ticker);
      var lastHeard = Date.now();
      this.ticker = setInterval(function () {
        if (self.gen !== myGen) { clearInterval(self.ticker); self.ticker = null; return; }
        try {
          if (speechSynthesis.speaking || speechSynthesis.pending) { lastHeard = Date.now(); speechSynthesis.resume(); return; }
          if (Date.now() - lastHeard > 4500) {
            var key = "p" + self.i;
            self.retries[key] = (self.retries[key] || 0) + 1;
            if (self.retries[key] <= 3) { self.say(myGen, true); lastHeard = Date.now(); }
          }
        } catch (e) {}
      }, 2500);
      this.say(myGen, false);
    },
    halt: function () {
      this.gen++;
      if (this.ticker) { clearInterval(this.ticker); this.ticker = null; }
      try { speechSynthesis.cancel(); } catch (e) {}
      if (this.statusEl) this.statusEl.textContent = "⏹ Podcast stop ho gaya.";
    }
  };
  var wireBlog = function () {
    var modal = document.querySelector(".blog-modal");
    var themes = modal && modal.querySelector(".blog-themes");
    if (!modal || !themes || modal.dataset.pod) return;
    modal.dataset.pod = "1";
    var langSel = document.createElement("select");
    langSel.className = "sm-podlang";
    langSel.innerHTML = "<option value='hi'>🎙 Hindi</option><option value='en'>🎙 English</option>";
    themes.appendChild(langSel);
    var bar2 = document.createElement("div");
    bar2.className = "sm-podv";
    bar2.innerHTML = "<span>Host</span><select class='pv-host'></select><span>Storyteller</span><select class='pv-story'></select>";
    themes.appendChild(bar2);
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "sm-podbtn"; btn.textContent = "🎙 Podcast";
    themes.appendChild(btn);
    var stat = document.createElement("div");
    stat.className = "sm-podstat";
    modal.querySelector(".blog-article").appendChild(stat);
    var hSel = bar2.querySelector(".pv-host"), sSel = bar2.querySelector(".pv-story");
    var hList = [], sList = [];
    var fillV = function () {
      var lang = langSel.value;
      var g = TTS.groups(lang);
      if (!g.length) { hSel.innerHTML = "<option value=''>default</option>"; sSel.innerHTML = "<option value=''>default</option>"; return; }
      var opt = function (x, i) { return "<option value='" + i + "'>" + x.label + "</option>"; };
      hSel.innerHTML = g.map(opt).join("");
      sSel.innerHTML = g.map(opt).join("");
      /* Host = pehli FEMALE, Storyteller = pehla MALE (agar mile) */
      var mi = g.findIndex(function (x) { return /^Male /.test(x.label); });
      var fi = g.findIndex(function (x) { return /^Female /.test(x.label); });
      sSel.value = String(mi > -1 ? mi : 0);
      hSel.value = String(fi > -1 ? fi : (mi > -1 ? mi : 0));
    };
    fillV();
    langSel.addEventListener("change", fillV);
    setTimeout(fillV, 1500);
    var bodyEl = modal.querySelector(".blog-art-body"), hold = modal.querySelector(".blog-pghold");
    var getTxt = function () { return ((bodyEl ? bodyEl.textContent : "") + " " + (hold ? hold.textContent : "")).replace(/\s+/g, " ").trim(); };
    var playing = false;
    var reset = function () { playing = false; btn.classList.remove("on"); btn.textContent = "🎙 Podcast"; };
    btn.addEventListener("click", function () {
      if (playing) { Pod.halt(); reset(); stat.classList.remove("show"); return; }
      var lang = langSel.value;
      var g = TTS.groups(lang);
      var hv = (hSel.value && g[+hSel.value]) ? g[+hSel.value].voice : null;
      var sv = (sSel.value && g[+sSel.value]) ? g[+sSel.value].voice : null;
      var title = (modal.querySelector(".blog-art-title") || {}).textContent || "Sahil ki kahani";
      var lines = makeScript(title, getTxt(), lang);
      if (!lines.length) return;
      playing = true; btn.classList.add("on"); btn.textContent = "⏹ Stop podcast"; stat.classList.add("show");
      stat.textContent = "🎙 Podcast shuru...";
      Pod.start(lines, hv, sv, stat, reset);
    });
  };
  var tryWire = setInterval(function () { wireBlog(); if (document.querySelector(".blog-modal[data-pod]")) clearInterval(tryWire); }, 800);
  setTimeout(function () { clearInterval(tryWire); }, 30000);
})();
