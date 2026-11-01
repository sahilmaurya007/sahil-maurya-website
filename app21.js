/* app21.js - Gallery editor: photo priority reorder (↑↓) + FAST parallel multi-upload. DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  var oldRT = SM.renderTab;
  SM.renderTab = function (cur, body) {
    if (cur !== "gallery") { if (oldRT) oldRT(cur, body); return; }
    renderGallery(body);
  };

  function renderGallery(body) {
    var lay = document.createElement("div");
    lay.style.cssText = "display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start";
    var col1 = document.createElement("div");
    col1.style.cssText = "flex:1 1 220px;min-width:220px";
    var col2 = document.createElement("div");
    col2.style.cssText = "flex:2 1 380px;min-width:300px";
    lay.appendChild(col1); lay.appendChild(col2);
    body.appendChild(lay);

    var lab = document.createElement("div");
    lab.style.cssText = "font-size:.72rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px";
    lab.textContent = "Select album / category";
    col1.appendChild(lab);
    var curIdx = SM.w.gallery._sel == null ? 0 : SM.w.gallery._sel;
    var ul = document.createElement("div");
    ul.style.cssText = "display:flex;flex-direction:column;gap:6px;margin-bottom:10px";
    SM.w.gallery.forEach(function (cat, ci) {
      var row = document.createElement("button");
      row.type = "button";
      row.className = "ed-tab" + (ci === curIdx ? " active" : "");
      row.style.cssText = "justify-content:flex-start;text-align:left";
      row.textContent = (ci === curIdx ? "> " : "") + (cat.name || "Untitled");
      row.addEventListener("click", function () { SM.w.gallery._sel = ci; SM.render(); });
      ul.appendChild(row);
    });
    col1.appendChild(ul);

    var otherBox = document.createElement("div"); otherBox.className = "ed-cardbox";
    otherBox.innerHTML = "<div class='ed-cardbox-h'><b>Add new album</b></div>";
    var oname = SM.f(otherBox, "Naya album ka naam (e.g. Seminar 2027)", "");
    var obtn = document.createElement("button"); obtn.type = "button"; obtn.className = "ed-add"; obtn.textContent = "Create album";
    obtn.addEventListener("click", function () {
      var nm = oname.value.trim();
      if (!nm) { SM.msg("Album ka naam likho.", true); return; }
      SM.w.gallery.push({ name: nm, photos: [] });
      SM.w.gallery._sel = SM.w.gallery.length - 1;
      SM.render();
      SM.msg("Album '" + nm + "' created! Ab photos upload karo.");
    });
    otherBox.appendChild(obtn);
    col1.appendChild(otherBox);

    var cat = SM.w.gallery[curIdx];
    if (!cat) { col2.innerHTML = "<p style='color:var(--muted)'>Koi album select karo ya naya banao.</p>"; return; }
    var head = document.createElement("div"); head.className = "ed-cardbox";
    head.innerHTML = "<div class='ed-cardbox-h'><b>Album: " + (cat.name || "Untitled") + "</b><button class='ed-del' type='button'>Delete album</button></div>";
    head.querySelector(".ed-del").addEventListener("click", function () {
      SM.w.gallery.splice(curIdx, 1);
      SM.w.gallery._sel = 0;
      SM.render();
    });
    var rn = SM.f(head, "Album name (rename)", cat.name);
    rn.addEventListener("input", function () { cat.name = rn.value; });
    col2.appendChild(head);

    cat.photos.forEach(function (p, pi) {
      var pc = document.createElement("div"); pc.className = "ed-cardbox"; pc.style.margin = "0 0 8px";
      pc.innerHTML = "<div class='ed-cardbox-h'><b>Photo " + (pi + 1) + "</b><span style='display:flex;gap:4px;align-items:center'>" +
        "<button class='ed-mv' type='button' title='Move up — higher priority' " + (pi === 0 ? "disabled" : "") + ">&#8593; Up</button>" +
        "<button class='ed-mv dn' type='button' title='Move down — lower priority' " + (pi === cat.photos.length - 1 ? "disabled" : "") + ">&#8595; Down</button>" +
        "<button class='ed-del' type='button'>Delete</button></span></div>";
      if (p.src) {
        var prev = document.createElement("img");
        prev.src = p.src;
        prev.style.cssText = "width:100%;max-width:220px;height:auto;display:block;border-radius:8px;margin-bottom:8px;object-fit:contain;background:var(--bg)";
        pc.insertBefore(prev, pc.firstChild.nextSibling);
      }
      var ev = SM.f(pc, "Event (e.g. HiPC 2025, Convocation)", p.event || "");
      ev.addEventListener("input", function () { p.event = ev.value; });
      var dt = SM.f(pc, "Date taken", p.date || "");
      dt.addEventListener("input", function () { p.date = dt.value; });
      var cap = SM.f(pc, "Caption / description", p.caption || "", true);
      cap.addEventListener("input", function () { p.caption = cap.value; });
      var ck = SM.f(pc, "Click by (photographer)", p.clickby || "");
      ck.addEventListener("input", function () { p.clickby = ck.value; });
      var src = SM.f(pc, "Photo path", p.src || "");
      src.addEventListener("input", function () { p.src = src.value; });
      /* PRIORITY REORDER */
      var mvBtns = pc.querySelectorAll(".ed-mv");
      if (mvBtns[0]) mvBtns[0].addEventListener("click", function () {
        if (pi === 0) return;
        cat.photos.splice(pi - 1, 0, cat.photos.splice(pi, 1)[0]);
        SM.render();
        SM.msg("Photo upar move hui (priority up). Save & Submit dabao.");
      });
      if (mvBtns[1]) mvBtns[1].addEventListener("click", function () {
        if (pi === cat.photos.length - 1) return;
        cat.photos.splice(pi + 1, 0, cat.photos.splice(pi, 1)[0]);
        SM.render();
        SM.msg("Photo neeche move hui (priority down). Save & Submit dabao.");
      });
      /* RESIZE */
      if (p.src) {
        var rz = document.createElement("button"); rz.type = "button"; rz.className = "ed-add"; rz.style.margin = "0 0 8px";
        rz.textContent = "Resize this photo";
        var rzi = document.createElement("input"); rzi.type = "file"; rzi.accept = "image/*"; rzi.style.display = "none";
        var rzw = SM.f(pc, "Resize width (px, e.g. 800/1200/1600)", "1200");
        rzw.style.marginBottom = "4px";
        rz.addEventListener("click", function () { rzi.click(); });
        rzi.addEventListener("change", function () {
          if (!rzi.files || !rzi.files[0]) return;
          var maxW = parseInt(rzw.value, 10) || 1200;
          window.SM_RESIZE(rzi.files[0], maxW, function (b64, w, h) {
            var name = "image/gal_" + Date.now() + "_" + pi + ".jpg";
            SM.putImage(name, b64, function () {
              p.src = name;
              SM.render();
              SM.msg("Resized to " + w + "x" + h + " & uploaded! Save & Submit dabao.");
            }, function (er) { SM.msg("Resize upload fail: " + er, true); }, "Uploading resized...");
          });
        });
        pc.appendChild(rzi);
        pc.insertBefore(rz, rzi);
      }
      pc.querySelector(".ed-del").addEventListener("click", function () { cat.photos.splice(pi, 1); SM.render(); });
      col2.appendChild(pc);
    });

    col2.appendChild(multiUpload(cat, function () { SM.render(); SM.msg("Uploaded! Event/date/caption/click-by likho."); }));
    col2.appendChild(SM.pickCropUpload("Upload single photo (crop optional)", function (path) {
      cat.photos.push({ src: path, caption: "", date: "", event: "", clickby: "" });
      SM.render();
      SM.msg("Uploaded! Details bharo, phir Save & Submit.");
    }));
    var addp = document.createElement("button"); addp.type = "button"; addp.className = "ed-add"; addp.textContent = "+ Add photo by path";
    addp.addEventListener("click", function () { cat.photos.push({ src: "", caption: "", date: "", event: "", clickby: "" }); SM.render(); });
    col2.appendChild(addp);
  }

  /* FAST multi-upload: compression PARALLEL (ek saath sab photos compress) —
     pehle ek-ek karke hota tha jo 5-10 photos par minutes lagata tha.
     Upload GitHub API par 2-3 parallel rakhte hain (rate limit safe). */
  function multiUpload(cat, onDone) {
    var wrap = document.createElement("div"); wrap.className = "ed-f";
    wrap.innerHTML = "<label>Add multiple photos to this album</label>";
    var fi = document.createElement("input"); fi.type = "file"; fi.accept = "image/*"; fi.multiple = true; fi.style.display = "none";
    var selBtn = document.createElement("button"); selBtn.type = "button"; selBtn.className = "ed-add"; selBtn.textContent = "Choose photos (multi-select)";
    var st = document.createElement("div"); st.style.cssText = "font-size:.72rem;color:var(--muted);margin-top:4px";
    selBtn.addEventListener("click", function () { fi.click(); });
    fi.addEventListener("change", function () {
      var files = Array.from(fi.files || []);
      if (!files.length) return;
      st.textContent = "Compressing " + files.length + " photos (parallel)...";
      var t0 = Date.now();
      var done = 0, okCount = 0, failed = 0, uploads = 0, UPLOAD_BATCH = 2;
      /* step 1: sab photos parallel compress (browser me, network par load nahi) */
      var queue = [];
      files.forEach(function (file) {
        SM.processImage(file, null, function (out) {
          if (out) queue.push(out);
          done++;
          if (done === files.length) step2();
        });
      });
      /* step 2: compressed photos 2-2 karke parallel upload */
      function step2() {
        st.textContent = "Uploading " + queue.length + " photos (2 parallel)...";
        var idx = 0;
        var next = function () {
          if (idx >= queue.length) {
            st.textContent = okCount + "/" + files.length + " uploaded in " + ((Date.now() - t0) / 1000).toFixed(1) + "s!" + (failed ? " (" + failed + " failed)" : "");
            onDone();
            return;
          }
          var out = queue[idx++];
          var name = "image/" + Date.now() + "_" + idx + "_" + Math.floor(Math.random() * 1000) + ".jpg";
          SM.putImage(name, out.b64, function () {
            cat.photos.push({ src: name, caption: "", date: "", event: "", clickby: "" });
            okCount++; next();
          }, function () { failed++; next(); }, null);
        };
        next(); if (idx < queue.length) { var i2 = idx; next(); }
      }
    });
    wrap.appendChild(selBtn); wrap.appendChild(fi); wrap.appendChild(st);
    return wrap;
  }
})();
