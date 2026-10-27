/* app46.js - HINDI TRANSLATE-LISTEN v3: waits for engine, book-mode container fix, batched + progress. DO NOT EDIT. */
(function () {
  "use strict";
  if (window.SM_HINDITR_DONE) return;
  var trCache = {};
  var translateChunk = function (txt) {
    if (trCache[txt]) return Promise.resolve(trCache[txt]);
    var q = encodeURIComponent(String(txt).slice(0, 450));
    return fetch("https://api.mymemory.translated.net/get?q=" + q + "&langpair=en|hi").then(function (r) { return r.json(); }).then(function (d) {
      var t = d && d.responseData && d.responseData.translatedText;
      var out = (t && t !== "PLEASE SELECT TWO DISTINCT LANGUAGES" && !/MYMEMORY WARNING/i.test(t)) ? t : txt;
      trCache[txt] = out;
      return out;
    }).catch(function () { return txt; });
  };
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
  var translateBatched = function (sents, onProg) {
    var results = new Array(sents.length);
    var groups = [];
    for (var i = 0; i < sents.length; i += 3) groups.push(sents.slice(i, i + 3).map(function (_, k) { return i + k; }));
    var done = 0;
    return new Promise(function (resolve) {
      var next = function (gi) {
        if (gi >= groups.length) { resolve(results); return; }
        var idxs = groups[gi];
        Promise.all(idxs.map(function (ix) {
          var s = sents[ix];
          if (/[\u0900-\u097F]/.test(s)) return Promise.resolve(s);
          if (!/[a-zA-Z]/.test(s)) return Promise.resolve(s);
          return translateChunk(s);
        })).then(function (arr) {
          idxs.forEach(function (ix, k) { results[ix] = arr[k]; });
          done += idxs.length;
          if (onProg) onProg(Math.round(done / sents.length * 100));
          setTimeout(function () { next(gi + 1); }, 350);
        }).catch(function () {
          idxs.forEach(function (ix) { results[ix] = sents[ix]; });
          done += idxs.length;
          if (onProg) onProg(Math.round(done / sents.length * 100));
          setTimeout(function () { next(gi + 1); }, 350);
        });
      };
      next(0);
    });
  };
  window.SM_HINDI_TR = { splitSents: splitSents, translateBatched: translateBatched };
  var init = function () {
    if (!window.SM_TTS) return false;
    window.SM_HINDITR_DONE = true;
    var TTS = window.SM_TTS;
    var wire = function () {
      document.querySelectorAll(".sm-audbar").forEach(function (bar) {
        if (bar.dataset.htr) return;
        bar.dataset.htr = "1";
        var lang = bar.querySelector(".sa-lang");
        if (!lang) return;
        var opt = document.createElement("option");
        opt.value = "hi-t"; opt.textContent = "Hindi (translated)";
        lang.appendChild(opt);
        var play = bar.querySelector(".sa-play");
        var vsel = bar.querySelector(".sa-voice");
        var rate = bar.querySelector(".sa-rate");
        if (!play) return;
        play.addEventListener("click", function (e) {
          if (lang.value !== "hi-t") return;
          e.stopImmediatePropagation();
          var old = play.textContent;
          play.disabled = true;
          play.textContent = "⏳ 0%";
          var host = bar.closest(".blog-modal");
          var bodyEl = host ? host.querySelector(".blog-art-body") : null;
          var hold = host ? host.querySelector(".blog-pghold") : null;
          var txt = ((bodyEl ? bodyEl.textContent : "") + " " + (hold ? hold.textContent : "")).replace(/\s+/g, " ").trim();
          if (!txt) { play.disabled = false; play.textContent = old; return; }
          var sents = splitSents(txt);
          translateBatched(sents, function (p) { play.textContent = "⏳ " + p + "%"; }).then(function (arr) {
            var hindi = arr.join(" ");
            var g = TTS.groups("hi");
            var v = (vsel && vsel.value !== "" && g[+vsel.value]) ? g[+vsel.value] : null;
            if (!v && g.length) v = g[0];
            TTS.play(hindi, v, +(rate && rate.value || 1));
            play.disabled = false;
            play.textContent = old;
            play.classList.add("on");
          });
        }, true);
        lang.addEventListener("change", function () {
          if (lang.value === "hi-t") {
            var g = TTS.groups("hi");
            if (vsel && g.length) {
              vsel.innerHTML = g.map(function (x, i) { return "<option value='" + i + "'>" + x.label + "</option>"; }).join("");
              vsel.value = "0";
            }
          }
        });
      });
    };
    setInterval(wire, 2000);
    return true;
  };
  var tryInit = setInterval(function () { if (init()) clearInterval(tryInit); }, 400);
  setTimeout(function () { clearInterval(tryInit); }, 20000);
})();
