/* app15.js - Profile Photo + Gallery tabs (crop upload, captions). DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  var D = function (n, f) { try { var v = eval(n); return v == null ? f : v; } catch (e) { return f; } };
  SM.begin = (function (old) { return function () {
    old();
    if (!SM.w.photo) SM.w.photo = (D("PROFILE", {}) || {}).photo || "";
    if (!SM.w.gallery) SM.w.gallery = (D("GALLERY_CATEGORIES", []) || []).map(function (c) {
      return { name: c.name || "", photos: (c.photos || []).map(function (p) { return { src: p.src || "", caption: p.caption || "" }; }) };
    });
  }; })(SM.begin);
  var oldRT = SM.renderTab;
  SM.renderTab = function (cur, body) {
    if (cur === "photo") return renderPhoto(body);
    if (cur === "gallery") return renderGallery(body);
    if (oldRT) oldRT(cur, body);
  };
  function renderPhoto(body) {
    var cur = document.createElement("div"); cur.style.cssText = "font-size:.74rem;color:var(--muted);margin-bottom:8px";
    cur.textContent = "Current photo: " + (SM.w.photo || "image/SAHIL.jpg");
    body.appendChild(cur);
    body.appendChild(SM.pickCropUpload("Profile photo (crop optional)", function (path) {
      SM.w.photo = path;
      cur.textContent = "New photo: " + path;
      SM.msg("Photo uploaded! Save & Submit dabao.");
    }));
  }
  function renderGallery(body) {
    SM.w.gallery.forEach(function (cat, ci) {
      var c = SM.box(body, "Category: " + (cat.name || "Untitled"));
      var nm = SM.f(c, "Category name", cat.name);
      nm.addEventListener("input", function () { cat.name = nm.value; });
      cat.photos.forEach(function (p, pi) {
        var pc = document.createElement("div"); pc.className = "ed-cardbox"; pc.style.margin = "0 0 8px";
        pc.innerHTML = "<div class='ed-cardbox-h'><b>Photo " + (pi + 1) + "</b><button class='ed-del' type='button'>Delete</button></div>";
        if (p.src) {
          var prev = document.createElement("img");
          prev.src = p.src;
          prev.style.cssText = "width:70px;height:70px;object-fit:cover;border-radius:8px;margin-bottom:6px";
          pc.insertBefore(prev, pc.firstChild.nextSibling);
        }
        var src = SM.f(pc, "Photo path", p.src);
        src.addEventListener("input", function () { p.src = src.value; });
        var cap = SM.f(pc, "Caption / description", p.caption, true);
        cap.addEventListener("input", function () { p.caption = cap.value; });
        pc.querySelector(".ed-del").addEventListener("click", function () { cat.photos.splice(pi, 1); SM.render(); });
        c.appendChild(pc);
      });
      c.appendChild(SM.pickCropUpload("Upload new photo in this category", function (path) {
        cat.photos.push({ src: path, caption: "" });
        SM.render();
        SM.msg("Uploaded! Caption likho, phir Save & Submit.");
      }));
      var addp = document.createElement("button"); addp.type = "button"; addp.className = "ed-add"; addp.textContent = "+ Add photo by path";
      addp.addEventListener("click", function () { cat.photos.push({ src: "", caption: "" }); SM.render(); });
      c.appendChild(addp);
      SM.onDel(c, SM.w.gallery, ci);
    });
    var addc = document.createElement("button"); addc.type = "button"; addc.className = "ed-add"; addc.textContent = "+ Add category";
    addc.addEventListener("click", function () { SM.w.gallery.push({ name: "", photos: [] }); SM.render(); });
    body.appendChild(addc);
  }
})();
