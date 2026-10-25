/* app33.js - Editor: news MULTI photos + per-news Update button (Delete ke saath). DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  SM.begin = (function (old) { return function () {
    old();
    (SM.w.news || []).forEach(function (n) {
      if (!n.photos || !n.photos.length) n.photos = n.photo ? [n.photo] : [];
    });
  }; })(SM.begin);
  var oldRT = SM.renderTab;
  SM.renderTab = function (cur, body) {
    if (cur !== "news") { if (oldRT) oldRT(cur, body); return; }
    if (oldRT) oldRT(cur, body);
    var w = SM.w;
    var cards = body.querySelectorAll(".ed-cardbox");
    w.news.forEach(function (n, i) {
      var c = cards[i];
      if (!c) return;
      /* header me Delete ke saath UPDATE button */
      var head = c.querySelector(".ed-cardbox-h");
      if (head && !head.querySelector(".ed-upd")) {
        var ub = document.createElement("button");
        ub.type = "button"; ub.className = "ed-upd"; ub.textContent = "Update";
        ub.style.cssText = "background:none;border:1px solid #16a34a;color:#16a34a;border-radius:7px;padding:3px 10px;font-size:.72rem;cursor:pointer;margin-right:6px";
        ub.addEventListener("click", function () { SM.save(); });
        head.appendChild(ub);
      }
      var oldPrev = c.querySelector("img");
      if (oldPrev && oldPrev.parentElement === c && !oldPrev.dataset.keep) oldPrev.remove();
      var mgr = document.createElement("div"); mgr.className = "ed-f";
      mgr.innerHTML = "<label>Photos (" + (n.photos ? n.photos.length : 0) + ") - Replace / Delete / Add more</label>";
      var grid = document.createElement("div");
      grid.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px";
      (n.photos || []).forEach(function (p, pi) {
        var it = document.createElement("div");
        it.style.cssText = "border:1px solid var(--border);border-radius:8px;padding:6px;text-align:center;background:var(--bg)";
        var im = document.createElement("img");
        im.src = p; im.style.cssText = "width:86px;height:64px;object-fit:contain;border-radius:6px;background:var(--soft);display:block;margin-bottom:4px";
        var rb = document.createElement("button"); rb.type = "button"; rb.textContent = "Replace"; rb.className = "ed-del";
        rb.style.cssText = "margin-right:4px;padding:2px 7px;font-size:.66rem";
        var db = document.createElement("button"); db.type = "button"; db.textContent = "Del"; db.className = "ed-del";
        db.style.cssText = "padding:2px 7px;font-size:.66rem";
        var rfi = document.createElement("input"); rfi.type = "file"; rfi.accept = "image/*"; rfi.style.display = "none";
        rb.addEventListener("click", function () { rfi.click(); });
        rfi.addEventListener("change", function () {
          if (rfi.files && rfi.files[0]) {
            SM.processImage(rfi.files[0], null, function (out) {
              if (!out) return;
              var name = "image/news_" + Date.now() + "_" + pi + ".jpg";
              SM.putImage(name, out.b64, function () {
                n.photos[pi] = name; n.photo = n.photos[0];
                SM.render(); SM.msg("Photo replaced! Update/Save dabao.");
              }, function (e) { SM.msg("Replace fail: " + e, true); });
            });
          }
        });
        db.addEventListener("click", function () { n.photos.splice(pi, 1); n.photo = n.photos[0] || ""; SM.render(); });
        it.appendChild(im); it.appendChild(rb); it.appendChild(db); it.appendChild(rfi);
        grid.appendChild(it);
      });
      if (!(n.photos || []).length) grid.innerHTML = "<span style='font-size:.74rem;color:var(--muted)'>Koi photo nahi - neeche se add karo</span>";
      mgr.appendChild(grid);
      var fi = document.createElement("input"); fi.type = "file"; fi.accept = "image/*"; fi.multiple = true; fi.style.display = "none";
      var ab = document.createElement("button"); ab.type = "button"; ab.className = "ed-add"; ab.textContent = "+ Add photos (multi-select)"; ab.style.marginBottom = "0";
      ab.addEventListener("click", function () { fi.click(); });
      fi.addEventListener("change", function () {
        var files = Array.from(fi.files || []);
        if (!files.length) return;
        var done = 0;
        files.forEach(function (f, ix) {
          SM.processImage(f, null, function (out) {
            if (!out) { done++; chk(); return; }
            var name = "image/news_" + Date.now() + "_" + ix + ".jpg";
            SM.putImage(name, out.b64, function () { n.photos.push(name); done++; chk(); }, function () { done++; chk(); });
          });
        });
        function chk() {
          if (done < files.length) return;
          n.photo = n.photos[0] || "";
          SM.render(); SM.msg("Photos added! (" + n.photos.length + " total). Update/Save dabao.");
        }
      });
      mgr.appendChild(ab); mgr.appendChild(fi);
      c.appendChild(mgr);
    });
  };
})();
