/* app42.js - TTS ENGINE v3 (FULL READ): stuck line par aage badhta hai (kabhi adhoora nahi rukta), Deep-male pitch trick, EN+HI sab voices. DO NOT EDIT. */
window.SM_TTS = (function () {
  "use strict";
  var TTS = {
    chunks: [], idx: 0, voice: null, rate: 1, voices: [], gen: 0, stopped: true, ticker: null, retries: {}, lineStart: 0,
    load: function () { try { this.voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; } catch (e) { this.voices = []; } },
    byLang: function (p) { return this.voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(p) === 0; }); },
    /* grouped voices - Male/Female columns; EN male voices bhi (Hindi me Deep pitch se male feel) */
    groups: function (lang) {
      var self = this;
      var list = this.byLang(lang);
      var out = [], m = 0, f = 0, o = 0;
      var isF = function (n) { return /female|zira|swara|kalpana|neerja|heera|leah|aria|samantha|susan|victoria|google हिन्दी|google hindi|lekha/i.test(n); };
      var isM = function (n) { return /male|hemant|ravi|david|mark|george|prabhat|madhur|guy|james|oliver|daniel|alex/i.test(n); };
      list.forEach(function (v) {
        var label;
        if (isF(v.name)) { f++; label = "Female " + f; }
        else if (isM(v.name)) { m++; label = "Male " + m; }
        else { o++; label = "Voice " + o; }
        out.push({ label: label, name: v.name, lang: v.lang, voice: v, deep: false });
      });
      /* agar male voice NAHI mili to Female 1 ko 'Deep Male' alias bana do (pitch 0.7 se male sunai dega) */
      if (!out.some(function (x) { return /^Male /.test(x.label); }) && out.length) {
        var src = out[0];
        out.unshift({ label: "Deep Male ♂ (pitch)", name: src.name + " [deep]", lang: src.lang, voice: src.voice, deep: true });
      }
      return out;
    },
    chunk: function (t) {
      var s = String(t).replace(/\s+/g, " ").trim(), arr = [], buf = "";
      var parts = s.replace(/([।.!?"”)])(\s)/g, "$1\n").split("\n");
      parts.forEach(function (p) {
        if ((buf + " " + p).trim().length > 170) { if (buf) arr.push(buf.trim()); buf = p; } else buf += " " + p;
      });
      if (buf.trim()) arr.push(buf.trim());
      return arr.length ? arr : [s];
    },
    play: function (text, voice, rate) {
      if (!window.speechSynthesis) { alert("Audio is browser me support nahi hai."); return; }
      try { speechSynthesis.cancel(); } catch (e) {}
      this.chunks = this.chunk(text); this.idx = 0; this.voice = voice || null; this.rate = rate || 1;
      this.gen++; this.stopped = false; this.retries = {};
      var myGen = this.gen, self = this;
      /* FULL-READ WATCHDOG: line atak jaye to 2 retry, FIR AAGE BADH JAO - kabhi adhoora nahi rukega */
      if (this.ticker) clearInterval(this.ticker);
      var lastHeard = Date.now();
      this.ticker = setInterval(function () {
        if (self.gen !== myGen || self.stopped) { clearInterval(self.ticker); self.ticker = null; return; }
        try {
          if (speechSynthesis.speaking || speechSynthesis.pending) { lastHeard = Date.now(); return; }
          var idle = Date.now() - lastHeard;
          if (idle < 3500) return;
          var key = "c" + self.idx;
          self.retries[key] = (self.retries[key] || 0) + 1;
          if (self.retries[key] <= 2) { self.say(myGen, true); } /* wahi line dobara */
          else { self.idx++; self.say(myGen, false); } /* 2 retry ke baad AAGE BADH JAO */
          lastHeard = Date.now();
        } catch (e) {}
      }, 2000);
      this.say(myGen, false);
    },
    say: function (myGen, isRetry) {
      var self = this;
      if (this.gen !== myGen || this.stopped) return;
      if (!isRetry && this.idx > 0 && this.retries["c" + this.idx] === undefined) this.retries["c" + this.idx] = 0;
      if (this.idx >= this.chunks.length) { this.stopped = true; if (this.ticker) { clearInterval(this.ticker); this.ticker = null; } if (this.done) this.done(); return; }
      var txt = this.chunks[this.idx];
      var u = new SpeechSynthesisUtterance(txt);
      if (this.voice) { u.voice = this.voice.voice || this.voice; u.lang = this.voice.lang || (this.voice.voice && this.voice.voice.lang) || "hi-IN"; }
      u.rate = this.rate || 1;
      /* DEEP MALE pitch trick: pitch ~0.7 => wahi voice deep/male sunai degi */
      if (this.voice && this.voice.deep) u.pitch = 0.72;
      else u.pitch = 1;
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
