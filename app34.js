/* app34.js - LIVE: news multi-photo carousel - MOBILE SAFE (preload-then-swap, single timer). DO NOT EDIT. */
(function () {
  "use strict";
  if (typeof NEWS === "undefined") return;
  var curKey = "";   /* kis news+photo-set ka interval chal raha hai */
  var timer = null; /* SIRF EK interval - re-render par stale interval nahi banega */
  var idx = 0;

  var getSrcs = function (img) {
    var entry = null;
    var alt = img.getAttribute("alt") || "";
    NEWS.forEach(function (n) { if (n.text && n.text === alt) entry = n; });
    var srcs = entry && entry.photos && entry.photos.length ? entry.photos : (entry && entry.photo ? [entry.photo] : []);
    return srcs.filter(Boolean);
  };

  /* photo ko PEHLE background me preload karo, LOAD hone par hi swap karo -
     mobile slow network par photo gayab nahi hogi (pehle purani dikhti rahegi) */
  var swapTo = function (img, src) {
    if (img.src === src) return;
    var pre = new Image();
    pre.onload = function () {
      img.src = src;
      img.style.opacity = "1";
    };
    pre.onerror = function () { /* nayi photo load fail - purani photo dikhti rahegi, kuch mat karo */ };
    pre.src = src;
  };

  var start = function (img, srcs) {
    if (timer) { clearInterval(timer); timer = null; }
    idx = 0;
    /* pehli photo ensure set ho */
    if (img.getAttribute("src") !== srcs[0]) swapTo(img, srcs[0]);
    if (srcs.length < 2) return;
    timer = setInterval(function () {
      var m = document.querySelector(".news-media img");
      if (!m || !document.contains(img)) { clearInterval(timer); timer = null; curKey = ""; return; }
      idx = (idx + 1) % srcs.length;
      swapTo(m, srcs[idx]);
    }, 5000);
  };

  var patch = function () {
    var img = document.querySelector(".news-media img");
    if (!img) return;
    var srcs = getSrcs(img);
    if (!srcs.length) return;
    /* key = alt + photo-set - news change hui to hi naya interval */
    var key = (img.getAttribute("alt") || "") + "|" + srcs.join(",");
    if (key === curKey) return;
    curKey = key;
    start(img, srcs);
  };
  var run = function () { setTimeout(patch, 300); };
  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
  /* page background me aane par bhi photo turant dikhe */
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      var img = document.querySelector(".news-media img");
      if (img) { img.style.opacity = "1"; }
    }
  });
})();
