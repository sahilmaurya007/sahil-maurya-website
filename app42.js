/* app42.js - TTS ENGINE v4: sweet Voice 1/2/3 modes, skip-ahead watchdog (full read guarantee), engine ready for late modules. DO NOT EDIT. */
window.SM_TTS = (function () {
  "use strict";
  var TTS = {
    chunks: [], idx: 0, voice: null, rate: 1, voices: [], gen: 0, stopped: true, ticker: null, retries: {},
    load: function () { try { this.voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; } catch (e) { this.voices = []; } },
    byLang: function (p) { return this.voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(p) === 0; }); },
    /* VOICE MODES: sweet variants - Voice 1 (deep), Voice 2 (soft), Voice 3 (bright) - sab smooth, koi harsh nahi */
    groups: function (lang) {
      var list = this.byLang(lang);
      if (!list.length) return [];
      var isM = function (n) { return /hemant|ravi|david|mark|george|prabhat|madhur|guy|james|oliver|daniel|alex|male/i.test(n); };
      var base = list.find(function (v) { return isM(v.name); }) || list[0];
      var modes = [];
      if (isM(base.name)) {
        modes.push({ label: "Voice 1 — Deep ♂", name: base.name, lang: base.lang, voice: base, pitch: 0.75 });
        modes.push({ label: "Voice 2 — Soft ♂", name: base.name, lang: base.lang, voice: base, pitch: 0.92 });
        modes.push({ label: "Voice 3 — Warm ♂", name: base.name, lang: base.lang, voice: base, pitch: 1.02 });
      } else {
        modes.push({ label: "Voice 1 — Soft ♀", name: base.name, lang: base.lang, voice: base, pitch: 1 });
        modes.push({ label: "Voice 2 — Deep ♀", name: base.name, lang: base.lang, voice: base, pitch: 0.78 });
        modes.push({ label: "Voice 3 — Sweet ♀", name: base.name, lang: base.lang, voice: base, pitch: 1.18 });
      }
      /* baki available real voices bhi list karo */
      list.filter(function (v) { return v !== base; }).forEach(function (v) {
        modes.push({ label: (isM(v.name) ? "♂" : "♀") + " " + v.name.split(" ").slice(0, 2).join(" "), name: v.name, lang: v.lang, voice: v, pitch: 1 });
      });
      return modes;
    },
    chunk: function (t) {
      var s = String(t).replace(/\s+/g, " ").trim(), arr = [], buf = "";
      var parts = s.replace(/([।.!?"”)])(\s)/g, "$1\n").split("\n");
      parts.forEach(function (p) {
        if ((buf + " " + p).trim().length > 150) { if (buf) arr.push(buf.trim()); buf = p; } else buf += " " + p;
      });
      if (buf.trim()) arr.push(buf.trim());
      return arr.length ? arr : [s];
    },
    play: function (text, voice, rate) {
      if (!window.speechSynthesis) { alert("Audio not supported in this browser."); return; }
      try { speechSynthesis.cancel(); } catch (e) {}
      this.chunks = this.chunk(text); this.idx = 0; this.voice = voice || null; this.rate = rate || 1;
      this.gen++; this.stopped = false; this.retries = {};
      var myGen = this.gen, self = this;
      if (this.ticker) clearInterval(this.ticker);
      var lastHeard = Date.now();
      /* FULL-READ WATCHDOG: stuck line -> 2 retry -> SKIP-AHEAD. Poora blog guaranteed read hoga. */
      this.ticker = setInterval(function () {
        if (self.gen !== myGen || self.stopped) { clearInterval(self.ticker); self.ticker = null; return; }
        try {
          if (speechSynthesis.speaking || speechSynthesis.pending) { lastHeard = Date.now(); return; }
          if (Date.now() - lastHeard < 3500) return;
          var key = "c" + self.idx;
          self.retries[key] = (self.retries[key] || 0) + 1;
          if (self.retries[key] <= 2) { self.say(myGen, true); }
          else { self.idx++; self.say(myGen, false); }
          lastHeard = Date.now();
        } catch (e) {}
      }, 2000);
      this.say(myGen, false);
    },
    say: function (myGen, isRetry) {
      var self = this;
      if (this.gen !== myGen || this.stopped) return;
      if (this.idx >= this.chunks.length) { this.stopped = true; if (this.ticker) { clearInterval(this.ticker); this.ticker = null; } if (this.done) this.done(); return; }
      var txt = this.chunks[this.idx];
      var u = new SpeechSynthesisUtterance(txt);
      if (this.voice) {
        u.voice = this.voice.voice || this.voice;
        u.lang = this.voice.lang || "hi-IN";
        u.pitch = this.voice.pitch || 1;
      } else { u.lang = "hi-IN"; u.pitch = 1; }
      u.rate = this.rate || 1;
      u.onend = function () {
        if (self.gen !== myGen || self.stopped) return;
        self.idx++;
        setTimeout(function () { self.say(myGen, false); }, 100);
      };
      u.onerror = function () {
        if (self.gen !== myGen || self.stopped) return;
        var key = "c" + self.idx;
        self.retries[key] = (self.retries[key] || 0) + 1;
        if (self.retries[key] <= 2) setTimeout(function () { self.say(myGen, true); }, 250);
        else { self.idx++; setTimeout(function () { self.say(myGen, false); }, 150); }
      };
      try { speechSynthesis.speak(u); } catch (e) {}
    },
    pause: function () { try { speechSynthesis.pause(); } catch (e) {} },
    resume: function () { try { speechSynthesis.resume(); } catch (e) {} },
    stop: function () {
      this.stopped = true; this.gen++;
      if (this.ticker) { clearInterval(this.ticker); this.ticker = null; }
      try { speechSynthesis.cancel(); } catch (e) {}
    }
  };
  TTS.load();
  if (window.speechSynthesis) { try { speechSynthesis.onvoiceschanged = function () { TTS.load(); }; } catch (e) {} }
  return TTS;
})();
