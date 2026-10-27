/* app46.js - HINDI TRANSLATE-LISTEN: English blog text ko Hindi me translate karke sunata hai. DO NOT EDIT. */
(function () {
  "use strict";
  if (window.SM_HINDITR_DONE) return;
  window.SM_HINDITR_DONE = true;
  var TTS = window.SM_TTS;
  if (!TTS) return;
  var translateChunk = function (txt) {
    var q = encodeURIComponent(txt.slice(0, 480));
    return fetch("https://api.mymemory.translated.net/get?q=" + q + "&langpair=en|hi").then(function (r) { return r.json(); }).then(function (d) {
      var t = d && d.responseData && d.responseData.translatedText;
      return (t && t !== "PLEASE SELECT TWO DISTINCT LANGUAGES") ? t : txt;
    }).catch(function () { return txt; });
  };
  var translateAll = function (txt) {
    var parts = [];
    var s = String(txt).replace(/\s+/g, " ").trim();
    while (s.length) { parts.push(s.slice(0, 460)); s = s.slice(460); }
    return Promise.all(parts.map(translateChunk)).then(function (arr) { return arr.join(" "); });
  };
  /* existing audio bars me option add karo: 'Hindi (translated)' */
  var wire = function () {
    document.querySelectorAll(".sm-audbar").forEach(function (bar) {
      if (bar.dataset.htr) return;
      bar.dataset.htr = "1";
      var lang = bar.querySelector(".sa-lang");
      if (!lang) return;
      var opt = document.createElement("option");
      opt.value = "hi-t"; opt.textContent = "हिन्दी अनुवाद (English→Hindi)";
      lang.appendChild(opt);
      var play = bar.querySelector(".sa-play");
      var vsel = bar.querySelector(".sa-voice");
      var rate = bar.querySelector(".sa-rate");
      if (!play) return;
      var origClick = play.onclick;
      play.addEventListener("click", function (e) {
        if (lang.value !== "hi-t") return;
        e.stopImmediatePropagation();
        play.disabled = true;
        var old = play.textContent;
        play.textContent = "⏳ Translate ho raha hai...";
        var host = bar.closest(".blog-modal");
        var bodyEl = host ? host.querySelector(".blog-art-body") : null;
        var txt = (bodyEl ? bodyEl.textContent : "").replace(/\s+/g, " ").trim();
        if (!txt) { play.disabled = false; play.textContent = old; return; }
        /* Devanagari text already Hindi hai - English lines translate karo */
        var lines = txt.split(/(?<=[.!?।])\s+/);
        Promise.all(lines.map(function (l) { return /[\u0900-\u097F]/.test(l) ? Promise.resolve(l) : (/[a-zA-Z]/.test(l) ? translateChunk(l) : Promise.resolve(l)); })).then(function (arr) {
          var hindi = arr.join(" ");
          var hv = TTS.byLang("hi");
          var v = (vsel && vsel.value !== "" && TTS.byLang("hi")[+vsel.value]) ? TTS.byLang("hi")[+vsel.value] : (hv[0] || null);
          TTS.play(hindi, v, +(rate && rate.value || 1));
          play.disabled = false;
          play.textContent = old;
          play.classList.add("on");
        });
      }, true);
      /* hi-t select hone par Hindi voice list dikhao */
      var fillOrig = function () {};
      lang.addEventListener("change", function () {
        if (lang.value === "hi-t") {
          var list = TTS.byLang("hi");
          vsel.innerHTML = list.length ? list.map(function (v, i) { return "<option value='" + i + "'>" + v.name + " (" + v.lang + ")</option>"; }).join("") : "<option value=''>Browser voice (default)</option>";
        }
      });
    });
  };
  setInterval(wire, 2000);
})();
