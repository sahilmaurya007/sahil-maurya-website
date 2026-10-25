/* app34.js - LIVE: news banner multi-photo carousel (NEWS[].photos array se). DO NOT EDIT. */
(function () {
  "use strict";
  if (typeof NEWS === "undefined") return;
  var patch = function () {
    var img = document.querySelector(".news-media img");
    if (!img || img.dataset.mph) return;
    /* img.alt = news text se us NEWS entry dhundo, photos nikaalo */
    var entry = null;
    NEWS.forEach(function (n) { if (n.text && n.text === img.getAttribute("alt")) entry = n; });
    var srcs = entry && entry.photos && entry.photos.length ? entry.photos : (entry && entry.photo ? [entry.photo] : []);
    srcs = srcs.filter(Boolean);
    if (srcs.length < 2) { if (entry) img.dataset.mph = "1"; return; }
    img.dataset.mph = "1";
    img.src = srcs[0];
    var idx = 0;
    setInterval(function () {
      var m = document.querySelector(".news-media img");
      if (!m) return;
      idx = (idx + 1) % srcs.length;
      m.style.transition = "opacity .25s ease";
      m.style.opacity = "0";
      setTimeout(function () { m.src = srcs[idx]; m.style.opacity = "1"; }, 250);
    }, 4000);
  };
  var run = function () { setTimeout(patch, 300); };
  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
})();
