/* app17.js - image crop + resize + upload UI (sab photo uploads me). DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  SM.processImage = function (file, cropRect, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        try {
          var sx = 0, sy = 0, sw = img.width, sh = img.height;
          if (cropRect && cropRect.w > 0 && cropRect.h > 0) { sx = cropRect.x; sy = cropRect.y; sw = cropRect.w; sh = cropRect.h; }
          var scale = Math.min(1, 900 / Math.max(sw, sh));
          var cv = document.createElement("canvas");
          cv.width = Math.round(sw * scale); cv.height = Math.round(sh * scale);
          var ctx = cv.getContext("2d");
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cv.width, cv.height);
          cv.toBlob(function (blob) {
            var fr2 = new FileReader();
            fr2.onload = function () {
              var b = new Uint8Array(fr2.result); var s = ""; var CH = 8192;
              for (var i = 0; i < b.length; i += CH) s += String.fromCharCode.apply(null, b.subarray(i, i + CH));
              cb({ b64: btoa(s), size: b.length });
            };
            fr2.readAsArrayBuffer(blob);
          }, "image/jpeg", 0.85);
        } catch (e) { cb(null); }
      };
      img.onerror = function () { cb(null); };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  };
  /* pickCropUpload(label, onUploaded(path, statusEl)) */
  SM.pickCropUpload = function (label, onUploaded) {
    var wrap = document.createElement("div"); wrap.className = "ed-f";
    wrap.innerHTML = "<label>" + label + "</label>";
    var fi = document.createElement("input"); fi.type = "file"; fi.accept = "image/*"; fi.style.display = "none";
    var cb = document.createElement("button"); cb.type = "button"; cb.className = "ed-add"; cb.textContent = "Choose photo";
    var st = document.createElement("div"); st.style.cssText = "font-size:.72rem;color:var(--muted);margin-top:4px";
    var area = document.createElement("div"); area.style.cssText = "position:relative;display:none;margin:8px 0;max-width:260px";
    var im = document.createElement("img"); im.style.cssText = "width:100%;display:block;border-radius:8px;cursor:crosshair";
    area.appendChild(im);
    var bx = document.createElement("div"); bx.style.cssText = "position:absolute;border:2px dashed #16a34a;background:rgba(22,163,74,.15);display:none;pointer-events:none";
    area.appendChild(bx);
    var hint = document.createElement("div"); hint.style.cssText = "font-size:.7rem;color:var(--muted)"; hint.textContent = "Drag karke crop select karo (optional). Bina crop ke bhi upload ho jayega.";
    var up = document.createElement("button"); up.type = "button"; up.className = "ed-add"; up.textContent = "Upload"; up.style.display = "none";
    var file = null, crop = null, drag = false, x0 = 0, y0 = 0;
    cb.addEventListener("click", function () { fi.click(); });
    fi.addEventListener("change", function () {
      if (!fi.files || !fi.files[0]) return;
      file = fi.files[0];
      st.textContent = "Selected: " + file.name;
      var fr = new FileReader();
      fr.onload = function () { im.src = fr.result; area.style.display = "block"; up.style.display = "block"; };
      fr.readAsDataURL(file);
      crop = null; bx.style.display = "none";
    });
    im.addEventListener("mousedown", function (e) { drag = true; var r = im.getBoundingClientRect(); x0 = e.clientX - r.left; y0 = e.clientY - r.top; bx.style.display = "block"; e.preventDefault(); });
    document.addEventListener("mousemove", function (e) {
      if (!drag) return;
      var r = im.getBoundingClientRect();
      var x = Math.max(0, Math.min(e.clientX - r.left, r.width));
      var y = Math.max(0, Math.min(e.clientY - r.top, r.height));
      bx.style.left = Math.min(x0, x) + "px"; bx.style.top = Math.min(y0, y) + "px";
      bx.style.width = Math.abs(x - x0) + "px"; bx.style.height = Math.abs(y - y0) + "px";
    });
    document.addEventListener("mouseup", function (e) {
      if (!drag) return; drag = false;
      var r = im.getBoundingClientRect();
      var x = Math.max(0, Math.min(e.clientX - r.left, r.width));
      var y = Math.max(0, Math.min(e.clientY - r.top, r.height));
      if (Math.abs(x - x0) > 8 && Math.abs(y - y0) > 8) {
        var rx = im.naturalWidth / r.width, ry = im.naturalHeight / r.height;
        crop = { x: Math.round(Math.min(x0, x) * rx), y: Math.round(Math.min(y0, y) * ry), w: Math.round(Math.abs(x - x0) * rx), h: Math.round(Math.abs(y - y0) * ry) };
        st.textContent = "Crop selected! Upload dabao.";
      }
    });
    up.addEventListener("click", function () {
      if (!file) return;
      st.textContent = "Processing + uploading...";
      SM.processImage(file, crop, function (out) {
        if (!out) { st.textContent = "Image process fail"; return; }
        var name = "image/" + Date.now() + ".jpg";
        SM.putImage(name, out.b64, function () { st.textContent = "Uploaded: " + name; onUploaded(name); }, function (e2) { st.textContent = e2; }, "Uploading...");
      });
    });
    wrap.appendChild(cb); wrap.appendChild(fi); wrap.appendChild(area); wrap.appendChild(hint); wrap.appendChild(up); wrap.appendChild(st);
    return wrap;
  };
})();
