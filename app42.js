/* app42.js - TTS ENGINE (FIXED): stop reliably kaam kare, Chrome 15s cut fix, sab voices. DO NOT EDIT. */
window.SM_TTS = (function () {
  "use strict";
  var TTS = {
    chunks: [], idx: 0, voice: null, rate: 1, voices: [], gen: 0, stopped: true,
    load: function () { try { this.voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; } catch (e) { this.voices = []; } },
    byLang: function (p) { return this.voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(p) === 0; }); },
    chunk: function (t) {
      var s = String(t).replace(/\s+/g, " ").trim(), arr = [], buf = "";
      var parts = s.replace(/([।.!?"”)])(\s)/g, "$1\n").split("\n");
      parts.forEach(function (p) {
        if ((buf + " " + p).trim().length > 170) { if (buf) arr.push(buf.trim()); buf = p; } else buf += " " + p;
      });
      if (buf.trim()) arr.push(buf.trim());
      return arr.length ? arr : [s];
    },
    /* STOP FIX: gen token - purane sequence ki onend/onerror callbacks agla chunk nahi bole sakte */
    play: function (text, voice, rate) {
      if (!window.speechSynthesis) { alert("Audio is browser me support nahi hai."); return; }
      try { speechSynthesis.cancel(); } catch (e) {}
      this.chunks = this.chunk(text); this.idx = 0; this.voice = voice || null; this.rate = rate || 1;
      this.gen++; this.stopped = false;
      var myGen = this.gen;
      var self = this;
      var next = function () {
        if (self.gen !== myGen || self.stopped) return; /* purana ya stopped - kuch mat bolo */
        if (self.idx >= self.chunks.length) { self.stopped = true; if (self.done) self.done(); return; }
        var u = new SpeechSynthesisUtterance(self.chunks[self.idx++]);
        if (self.voice) { u.voice = self.voice; u.lang = self.voice.lang; }
        u.rate = self.rate; u.pitch = 1;
        /* Chrome bug: ~15 sec par utterance cut + silent onend - resume() se stream wapas */
        u.onend = function () {
          if (self.gen !== myGen || self.stopped) return;
          setTimeout(function () {
            if (self.gen !== myGen || self.stopped) return;
            try { if (speechSynthesis.speaking) { speechSynthesis.resume(); return; } } catch (e) {}
            next();
          }, 120);
        };
        u.onerror = function () {
          if (self.gen !== myGen || self.stopped) return;
          setTimeout(next, 150);
        };
        /* keep-alive: bade text par Chrome ko pause/resume jhatka do */
        var ka = setInterval(function () {
          if (self.gen !== myGen || self.stopped) { clearInterval(ka); return; }
          try { if (!speechSynthesis.paused && !speechSynthesis.speaking) { speechSynthesis.resume(); } } catch (e) {}
        }, 10000);
        u._ka = ka;
        speechSynthesis.speak(u);
        clearInterval(ka); /* per-utterance fresh */
      };
      next();
    },
    pause: function () { try { speechSynthesis.pause(); } catch (e) {} },
    resume: function () { try { speechSynthesis.resume(); } catch (e) {} },
    stop: function () {
      this.stopped = true;
      this.gen++; /* purane callbacks dead */
      try { speechSynthesis.cancel(); } catch (e) {}
    }
  };
  TTS.load();
  if (window.speechSynthesis) { try { speechSynthesis.onvoiceschanged = function () { TTS.load(); }; } catch (e) {} }
  return TTS;
})();
