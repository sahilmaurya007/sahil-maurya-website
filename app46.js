/* app46.js - HINDI TRANSLATE-LISTEN (FIXED): no lookbehind regex (old browser crash fix), grouped voices, watchdog engine. DO NOT EDIT. */
(function () {
  "use strict";
  if (window.SM_HINDITR_DONE) return;
  window.SM_HINDITR_DONE = true;
  var TTS = window.SM_TTS;
  if (!TTS) return;
  var translateChunk = function (txt) {
    var q = encodeURIComponent(String(txt).slice(0, 480));
    return fetch("https://api.mymemory.translated.net/get?q=" + q + "&langpair=en|hi").then(function (r) { return r.json(); }).then(function (d) {
      var t = d && d.responseData && d.responseData.translatedText;
      return (t && t !== "PLEASE SELECT TWO DISTINCT LANGUAGES") ? t : txt;
    }).catch(function () { return txt; });
  };
  /* sentence split - NO LOOKBEHIND (pehle (?<=...) tha - purane browsers me SyntaxError = poora feature dead) */
  var splitSents = function (txt) {
    var out = [], buf = "";
    var s = String(txt).replace(/\s+/g, " ").trim();
    for (var i = 0; i < s.length; i++) {
      buf += s[i];
      if (/[.!?।]/.test(s[i]) && (i === s.length - 1 || s[i + 1] === " ")) { out.push(buf.trim()); buf = ""; }
    }
    if (buf.trim()) out.push(buf.trim());
    return out.filter(function (x) { return x.length > 1; });
  };
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
      play.addEventListener("click", function (e) {
        if (lang.value !== "hi-t") return; /* normal flow continue */
        e.stopImmediatePropagation();
        var old = play.textContent;
        play.textContent = "⏳ Translate...";
        var host = bar.closest(".blog-modal");
        var bodyEl = host ? host.querySelector(".blog-art-body") : null;
        var txt = (bodyEl ? bodyEl.textContent : "").replace(/\s+/g, " ").trim();
        if (!txt) { play.textContent = old; return; }
        var sents = splitSents(txt);
        play.disabled = true;
        Promise.all(sents.map(function (l) {
          if (/[\u0900-\u097F]/.test(l)) return Promise.resolve(l); /* shayari already Hindi */
          if (!/[a-zA-Z]/.test(l)) return Promise.resolve(l);
          return translateChunk(l);
        })).then(function (arr) {
          var hindi = arr.join(" ");
          /* Hindi voice choose: dropdown ya pehli Hindi male voice */
          var g = TTS.groups("hi");
          var v = null;
          if (vsel && vsel.value !== "" && g[+vsel.value]) v = g[+vsel.value].voice;
          else { var mi = g.findIndex(function (x) { return /^Male /.test(x.label); }); v = g.length ? g[mi > -1 ? mi : 0].voice : null; }
          TTS.play(hindi, v, +(rate && rate.value || 1));
          play.disabled = false;
          play.textContent = old;
          play.classList.add("on");
        }).catch(function () { play.disabled = false; play.textContent = old; });
      }, true);
      lang.addEventListener("change", function () {
        if (lang.value === "hi-t") {
          var g = TTS.groups("hi");
          vsel.innerHTML = g.length ? g.map(function (x, i) { return "<option value='" + i + "'>" + x.label + "</option>"; }).join("") : "<option value=''>Browser voice (default)</option>";
          var mi = g.findIndex(function (x) { return /^Male /.test(x.label); });
          vsel.value = String(mi > -1 ? mi : 0);
        }
      });
    });
  };
  setInterval(wire, 2000);
})();
