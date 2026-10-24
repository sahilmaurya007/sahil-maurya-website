/* app19.js - gallery photos ke neeche date dikhana (caption ke saath). DO NOT EDIT. */
(function () {
  "use strict";
  var findPhoto = function (src) {
    var res = null;
    try {
      (typeof GALLERY_CATEGORIES !== "undefined" ? GALLERY_CATEGORIES : []).forEach(function (c) {
        (c.photos || []).forEach(function (p) { if (p.src === src) res = p; });
      });
    } catch (e) {}
    return res;
  };
  var addDates = function () {
    document.querySelectorAll("#catGal figure.gal-item img").forEach(function (img) {
      var fig = img.closest("figure");
      var cap = fig ? fig.querySelector(".gal-cap") : null;
      if (!cap || fig.dataset.dated) return;
      var p = findPhoto(img.getAttribute("src"));
      if (p && p.date) {
        fig.dataset.dated = "1";
        var d = document.createElement("span");
        d.className = "gal-date";
        d.textContent = " · " + p.date;
        d.style.cssText = "color:var(--muted);font-size:.78em";
        cap.appendChild(d);
      }
    });
  };
  var run = function () { setTimeout(addDates, 200); };
  run();
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList && e.target.classList.contains("cat-tab")) run();
  });
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
})();
