/* app34.js - LIVE: news banner me multi-photo carousel (photos array) + contain full-fit. DO NOT EDIT. */
(function () {
  "use strict";
  if (typeof NEWS === "undefined") return;
  var patch = function () {
    var media = document.querySelector(".news-media");
    if (!media || media.dataset.mph) return;
    media.dataset.mph = "1";
    var img = media.querySelector("img");
    if (!img) return;
    /* us news ke saare photos (photos array ya fallback single photo) */
    var srcs = (img.getAttribute("data-srcs") || "").split(",").filter(Boolean);
    if (srcs.length > 1) {
      var idx = 0;
      setInterval(function () {
        var m = document.querySelector(".news-media img");
        if (!m) return;
        idx = (idx + 1) % srcs.length;
        m.style.opacity = "0";
        setTimeout(function () { m.src = srcs[idx]; m.style.opacity = "1"; }, 250);
      }, 4000);
    }
  };
  /* app3 renderNews ke baad run karo */
  var run = function () { setTimeout(patch, 300); };
  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
})();
