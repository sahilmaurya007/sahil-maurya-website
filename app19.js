/* app19.js - gallery details: event, date taken, click by - live site par neeche. DO NOT EDIT. */
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
      if (p) {
        fig.dataset.dated = "1";
        var extra = [];
        if (p.event) extra.push(p.event);
        if (p.date) extra.push(p.date);
        if (p.clickby) extra.push("Click by " + p.clickby);
        if (extra.length) {
          var d = document.createElement("div");
          d.className = "gal-meta";
          d.textContent = extra.join(" · ");
          d.style.cssText = "color:var(--muted);font-size:.74em;margin-top:2px";
          cap.appendChild(d);
        }
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
