/* app42.js - TTS ENGINE v2: reliable stop (gen-token), watchdog stuck-line replay, grouped voices. DO NOT EDIT. */
window.SM_TTS = (function () {
  "use strict";
  var TTS = {
    chunks: [], idx: 0, voice: null, rate: 1, voices: [], gen: 0, stopped: true, ticker: null, retries: {},
    load: function () { try { this.voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; } catch (e) { this.voices = []; } },
    byLang: function (p) { return this.voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(p) === 0; }); },
    /* grouped voices: [{label:'Male 1', voice:V}, {label:'Female 1', voice:V}...] */
    groups: function (lang) {
      var list = this.byLang(lang);
      var m = 0, f = 0;
      return list.map(function (v) {
        var isF = /female|zira|swara|kalpana|neerja|heera|leah|aria|samantha|susan|victoria/i.test(v.name);
        var isM = /male|hemant|ravi|david|mark|george|prabhat|madhur|guy|james|oliver/i.test(v.name);
        var label;
        if (isF) { f++; label = "Female " + f; }
        else if (isM) { m++; label = "Male " + m; }
        else label = (m + f + 1) + ". " + v.name.split(" ")[0];
        return { label: label, name: v.name, lang: v.lang, voice: v };
      });
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
      /* WATCHDOG: agar line 6s se zyada bol rahi hai aur speaking nahi + pending nahi = atak gayi -> wahi line dobara */
      if (this.ticker) clearInterval(this.ticker);
      var lastHeard = 0;
      this.ticker = setInterval(function () {
        if (self.gen !== myGen || self.stopped) { clearInterval(self.ticker); self.ticker = null; return; }
        try {
          if (speechSynthesis.speaking || speechSynthesis.pending) {
            lastHeard = Date.now();
            speechSynthesis.resume(); /* Android pause-atak fix */
            return;
          }
          /* speaking nahi = line atak gayi */
          if (Date.now() - lastHeard > 4500) {
            var key = "c" + self.idx;
            self.retries[key] = (self.retries[key] || 0) + 1;
            if (self.retries[key] <= 3) self.say(myGen, true); /* wahi line dobara */
          }
        } catch (e) {}
      }, 2500);
      this.say(myGen, false);
    },
    say: function (myGen, isRetry) {
      var self = this;
      if (this.gen !== myGen || this.stopped) return;
      if (!isRetry) { /* normal flow: next chunk */ }
      if (this.idx >= this.chunks.length) { this.done && this.done(); this.stopAll(myGen); return; }
      var txt = this.chunks[this.idx];
      var u = new SpeechSynthesisUtterance(txt);
      if (this.voice) { u.voice = this.voice; u.lang = this.voice.lang; }
      u.rate = this.rate; u.pitch = 1;
      u.onend = function () {
        if (self.gen !== myGen || self.stopped) return;
        self.idx++;
        setTimeout(function () { self.say(myGen, false); }, 120);
      };
      u.onerror = function () {
        if (self.gen !== myGen || self.stopped) return;
        setTimeout(function () { self.say(myGen, true); }, 250);
      };
      speechSynthesis.speak(u);
    },
    stopAll: function (myGen) { this.stopped = true; if (this.ticker) { clearInterval(this.ticker); this.ticker = null; } },
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
