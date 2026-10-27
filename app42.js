/* app42.js - AUDIO (Hindi+English, multiple voices, podcast) + copy fix. PART 1: TTS engine. DO NOT EDIT. */
window.SM_TTS = (function () {
  "use strict";
  var TTS = {
    chunks: [], idx: 0, voice: null, rate: 1, voices: [],
    load: function () { try { this.voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; } catch (e) { this.voices = []; } },
    byLang: function (p) { return this.voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(p) === 0; }); },
    chunk: function (t) {
      var s = String(t).replace(/\s+/g, " ").trim(), arr = [], buf = "";
      var parts = s.replace(/([।.!?"”)])(\s)/g, "$1\n").split("\n");
      parts.forEach(function (p) {
        if ((buf + " " + p).trim().length > 190) { if (buf) arr.push(buf.trim()); buf = p; } else buf += " " + p;
      });
      if (buf.trim()) arr.push(buf.trim());
      return arr.length ? arr : [s];
    },
    play: function (text, voice, rate) {
      if (!window.speechSynthesis) { alert("Audio is browser me support nahi hai."); return; }
      speechSynthesis.cancel();
      this.chunks = this.chunk(text); this.idx = 0; this.voice = voice || null; this.rate = rate || 1;
      var self = this;
      var next = function () {
        if (self.idx >= self.chunks.length) { if (self.done) self.done(); return; }
        var u = new SpeechSynthesisUtterance(self.chunks[self.idx++]);
        if (self.voice) u.voice = self.voice;
        u.lang = self.voice ? self.voice.lang : "en-IN";
        u.rate = self.rate; u.pitch = 1;
        u.onend = next;
        u.onerror = next;
        speechSynthesis.speak(u);
      };
      next();
    },
    pause: function () { try { speechSynthesis.pause(); } catch (e) {} },
    resume: function () { try { speechSynthesis.resume(); } catch (e) {} },
    stop: function () { try { speechSynthesis.cancel(); } catch (e) {} }
  };
  TTS.load();
  if (window.speechSynthesis) { try { speechSynthesis.onvoiceschanged = function () { TTS.load(); }; } catch (e) {} }
  return TTS;
})();
