/* app15.js - Profile Photo + Gallery tabs (album style, multi-select, crop). DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  var D = function (n, f) { try { var v = eval(n); return v == null ? f : v; } catch (e) { return f; } };
  SM.begin = (function (old) { return function () {
    old();
    if (!SM.w.photo) SM.w.photo = (D("PROFILE", {}) || {}).photo || "";
    if (!SM.w.gallery) SM.w.gallery = (D("GALLERY_CATEGORIES", []) || []).map(function (c) {
      return { name: c.name || "", photos: (c.photos || []).map(function (p) { return { src: p.src || "", caption: p.caption || "", date: p.date || "" }; }) };
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

  /* ---- multi-select upload into a category ---- */
  function multiUpload(cat, onDone) {
    var wrap = document.createElement("div"); wrap.className = "ed-f";
    wrap.innerHTML = "<label>Add photos to this category (multiple select)</label>";
    var fi = document.createElement("input"); fi.type = "file"; fi.accept = "image/*"; fi.multiple = true; fi.style.display = "none";
    var selBtn = document.createElement("button"); selBtn.type = "button"; selBtn.className = "ed-add"; selBtn.textContent = "Choose photos (multi-select)";
    var st = document.createElement("div"); st.style.cssText = "font-size:.72rem;color:var(--muted);margin-top:4px";
    selBtn.addEventListener("click", function () { fi.click(); });
    fi.addEventListener("change", function () {
      var files = Array.from(fi.files || []);
      if (!files.length) return;
      st.textContent = "Uploading " + files.length + " photos...";
      var done = 0, okCount = 0;
      files.forEach(function (file, idx) {
        SM.processImage(file, null, function (out) {
          if (!out) { done++; check(); return; }
          var name = "image/" + Date.now() + "_" + idx + ".jpg";
          SM.putImage(name, out.b64, function () {
            cat.photos.push({ src: name, caption: "", date: "" });
            okCount++; done++; check();
          }, function () { done++; check(); }, null);
        });
      });
      function check() {
        if (done < files.length) return;
        st.textContent = okCount + "/" + files.length + " uploaded! Neeche captions likho.";
        onDone();
      }
    });
    wrap.appendChild(selBtn); wrap.appendChild(fi); wrap.appendChild(st);
    return wrap;
  }

  function renderGallery(body) {
    SM.w.gallery.forEach(function (cat, ci) {
      var c = SM.box(body, "Album: " + (cat.name || "Untitled"));
      var nm = SM.f(c, "Album / category name", cat.name);
      nm.addEventListener("input", function () { cat.name = nm.value; });
      /* photos grid - album style */
      cat.photos.forEach(function (p, pi) {
        var pc = document.createElement("div"); pc.className = "ed-cardbox"; pc.style.margin = "0 0 8px";
        pc.innerHTML = "<div class='ed-cardbox-h'><b>Photo " + (pi + 1) + "</b><button class='ed-del' type='button'>Delete</button></div>";
        if (p.src) {
          var prev = document.createElement("img");
          prev.src = p.src;
          prev.style.cssText = "width:100%;max-width:220px;height:auto;display:block;border-radius:8px;margin-bottom:8px;object-fit:contain;background:var(--bg)";
          pc.insertBefore(prev, pc.firstChild.nextSibling);
        }
        /* caption + date BELOW the photo */
        var cap = SM.f(pc, "Description / caption (photo ke neeche dikhega)", p.caption, true);
        cap.addEventListener("input", function () { p.caption = cap.value; });
        var dt = SM.f(pc, "Date (photo ke neeche dikhega, optional)", p.date);
        dt.addEventListener("input", function () { p.date = dt.value; });
        pc.querySelector(".ed-del").addEventListener("click", function () { cat.photos.splice(pi, 1); SM.render(); });
        c.appendChild(pc);
      });
      c.appendChild(multiUpload(cat, function () { SM.render(); SM.msg("Uploaded! Captions + dates likho, phir Save & Submit."); }));
      var addp = document.createElement("button"); addp.type = "button"; addp.className = "ed-add"; addp.textContent = "+ Add photo by path";
      addp.addEventListener("click", function () { cat.photos.push({ src: "", caption: "", date: "" }); SM.render(); });
      c.appendChild(addp);
      SM.onDel(c, SM.w.gallery, ci);
    });
    var addc = document.createElement("button"); addc.type = "button"; addc.className = "ed-add"; addc.textContent = "+ Add album / category";
    addc.addEventListener("click", function () { SM.w.gallery.push({ name: "", photos: [] }); SM.render(); });
    body.appendChild(addc);
  }
})();
