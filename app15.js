/* app15.js - Profile Photo + Gallery tabs (GUI upload, tags + captions). DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM || !SM.putImage) return;
  var D = function (n, f) { try { var v = eval(n); return v == null ? f : v; } catch (e) { return f; } };
  var EXT = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" };

  /* extend working model */
  SM.begin = (function (old) { return function () {
    old();
    SM.w.photo = (D("PROFILE", {}) || {}).photo || "";
    SM.w.gallery = (D("GALLERY_CATEGORIES", []) || []).map(function (c) {
      return { name: c.name || "", photos: (c.photos || []).map(function (p) { return { src: p.src || "", caption: p.caption || "" }; }) };
    });
  }; })(SM.begin);

  var oldRT = SM.renderTab;
  SM.renderTab = function (cur, body) {
    if (cur === "photo") return renderPhoto(body);
    if (cur === "gallery") return renderGallery(body);
    if (oldRT) oldRT(cur, body);
  };
  function empty(body, txt) { var p = document.createElement("p"); p.style.cssText = "color:var(--muted);font-size:.78rem"; p.textContent = txt; body.appendChild(p); }
  function galleryListNames() { var arr = SM.w.gallery, out = []; arr.forEach(function (c) { if (c.name) out.push(c.name); }); return out; }

  function renderPhoto(body) {
    var wrap = SM.filePick("Profile photo (SAHIL.jpg)", function (file) { SM.photoFile = file; });
    body.appendChild(wrap);
    var cur = document.createElement("div"); cur.style.cssText = "font-size:.74rem;color:var(--muted);margin-bottom:10px";
    cur.textContent = "Current: " + (SM.w.photo || "image/SAHIL.jpg");
    body.insertBefore(cur, body.firstChild);
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "ed-add"; btn.textContent = "Upload photo to website";
    btn.addEventListener("click", function () {
      if (!SM.photoFile) { SM.msg("Pehle photo choose karo.", true); return; }
      var f = SM.photoFile;
      var ext = EXT[f.type] || ".jpg";
      b64f(f, function (b64) {
        SM.putImage("image/SAHIL" + ext, b64, function () {
          SM.w.photo = "image/SAHIL" + ext;
          SM.msg("Photo uploaded! Save & Submit dabao taaki website par approve ho.");
        }, function (e) { SM.msg(e, true); }, "Uploading photo...");
      });
    });
    body.appendChild(btn);
  }
  function b64f(file, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      var bytes = new Uint8Array(fr.result); var s = ""; var CH = 8192;
      for (var i = 0; i < bytes.length; i += CH) s += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
      cb(btoa(s));
    };
    fr.readAsArrayBuffer(file);
  }

  function renderGallery(body) {
    if (!SM.w.gallery.length) empty(body, "Gallery abhi khali hai - + Add category se shuru karo.");
    SM.w.gallery.forEach(function (cat, ci) {
      var c = SM.box(body, "Category: " + cat.name);
      var name = SM.f(c, "Category name", cat.name);
      name.addEventListener("input", function () { cat.name = name.value; });
      /* photos in this category */
      cat.photos.forEach(function (p, pi) {
        var pc = document.createElement("div"); pc.className = "ed-cardbox"; pc.style.margin = "0 0 8px";
        pc.innerHTML = "<div class='ed-cardbox-h'><b>Photo " + (pi + 1) + "</b><button class='ed-del' type='button'>Delete</button></div>";
        var src = SM.f(pc, "Photo path (image/xyz.jpg)", p.src);
        src.addEventListener("input", function () { p.src = src.value; });
        var cap = SM.f(pc, "Caption / description", p.caption, true);
        cap.addEventListener("input", function () { p.caption = cap.value; });
        pc.querySelector(".ed-del").addEventListener("click", function () { cat.photos.splice(pi, 1); SM.render(); });
        c.appendChild(pc);
      });
      /* upload new photo into this category */
      var up = SM.filePick("Upload new photo to this category", function (file) {
        var ext = EXT[file.type] || ".jpg";
        var safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        b64f(file, function (b64) {
          SM.putImage("image/" + safe, b64, function () {
            cat.photos.push({ src: "image/" + safe, caption: "" });
            SM.render();
            SM.msg("Photo uploaded! Caption likho, phir Save & Submit.");
          }, function (e) { SM.msg(e, true); }, "Uploading " + safe + "...");
        });
      });
      c.appendChild(up);
      var addp = document.createElement("button"); addp.type = "button"; addp.className = "ed-add"; addp.textContent = "+ Add photo path";
      addp.addEventListener("click", function () { cat.photos.push({ src: "", caption: "" }); SM.render(); });
      c.appendChild(addp);
      SM.onDel(c, SM.w.gallery, ci);
    });
    var addc = document.createElement("button"); addc.type = "button"; addc.className = "ed-add"; addc.textContent = "+ Add category";
    addc.addEventListener("click", function () { SM.w.gallery.push({ name: "", photos: [] }); SM.render(); });
    body.appendChild(addc);
  }
})();
