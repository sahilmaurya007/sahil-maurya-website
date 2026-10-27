/* app40.js - Blogs editor tab: title, tag, date, body + MULTIPLE PHOTOS + INLINE PHOTO AT CURSOR. DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  var D = function (n, f) { try { var v = eval(n); return v == null ? f : v; } catch (e) { return f; } };
  SM.begin = (function (old) { return function () {
    old();
    var bs = D("BLOGS", []);
    if (!bs.length && window.SM_DEFAULT_BLOGS) bs = window.SM_DEFAULT_BLOGS.slice();
    SM.w.blogs = bs.map(function (b) {
      return { title: b.title || "", tag: b.tag || "Blog", date: b.date || "", body: b.body || "", photos: Array.isArray(b.photos) ? b.photos.slice() : [] };
    });
  }; })(SM.begin);
  var oldRT = SM.renderTab;
  SM.renderTab = function (cur, body) {
    if (cur !== "blogs") { if (oldRT) oldRT(cur, body); return; }
    renderBlogs(body);
  };
  function uploadImage(file, cb, fail) {
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        var cv = document.createElement("canvas");
        var sc = Math.min(1, 1200 / img.width);
        cv.width = Math.round(img.width * sc); cv.height = Math.round(img.height * sc);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        var b64 = cv.toDataURL("image/jpeg", 0.8).split(",")[1];
        cb(b64);
      };
      img.onerror = function () { fail(); };
      img.src = fr.result;
    };
    fr.onerror = function () { fail(); };
    fr.readAsDataURL(file);
  }
  function renderBlogs(body) {
    if (!SM.w.blogs.length) SM.emptyList(body, "No blogs yet - click + Add blog to write your first one.");
    SM.w.blogs.forEach(function (b, i) {
      var c = SM.box(body, "Blog " + (i + 1));
      var tt = SM.f(c, "Title", b.title);
      tt.addEventListener("input", function () { b.title = tt.value; });
      var tg = SM.f(c, "Tag (e.g. FPGA, VLSI, Research, Life)", b.tag);
      tg.addEventListener("input", function () { b.tag = tg.value; });
      var dt = SM.f(c, "Date (e.g. 2026-10-27)", b.date);
      dt.addEventListener("input", function () { b.date = dt.value; });
      var bd = SM.f(c, "Full blog text - **bold**, ### headings, and photos anywhere (use 📷 Insert photo at cursor)", b.body, true);
      bd.style.minHeight = "200px";
      bd.addEventListener("input", function () { b.body = bd.value; });

      /* INLINE PHOTO: cursor position par photo insert hoti hai - start, middle ya end, jahan bhi chaaho */
      var ilw = document.createElement("div"); ilw.className = "ed-f";
      ilw.innerHTML = "<label>Inline photo - cursor ki jagah insert hoga (start / middle / end kahin bhi)</label>";
      var ilRow = document.createElement("div"); ilRow.style.cssText = "display:flex;gap:8px;flex-wrap:wrap";
      var ib = document.createElement("button"); ib.type = "button"; ib.className = "ed-add"; ib.textContent = "📷 Insert photo at cursor";
      var pf = document.createElement("input"); pf.type = "file"; pf.accept = "image/*"; pf.style.display = "none";
      var ist = document.createElement("div"); ist.style.cssText = "font-size:.72rem;color:var(--muted);margin-top:4px";
      ib.addEventListener("click", function () { pf.click(); });
      pf.addEventListener("change", function () {
        var f = (pf.files || [])[0];
        pf.value = "";
        if (!f) return;
        var pos = (bd.selectionStart != null) ? bd.selectionStart : (b.body || "").length;
        ist.textContent = "Uploading photo...";
        uploadImage(f, function (b64) {
          var name = "image/blog_inline_" + Date.now() + ".jpg";
          SM.putImage(name, b64, function () {
            var marker = "\n\n![](" + name + ")\n\n";
            b.body = (b.body || "").slice(0, pos) + marker + (b.body || "").slice(pos);
            bd.value = b.body;
            bd.focus();
            try { bd.setSelectionRange(pos + marker.length, pos + marker.length); } catch (e) {}
            ist.textContent = "Photo inserted! Ab uske aage aise hi likhna continue karo - wo ussi page par dikhega.";
          }, function () { ist.textContent = "Upload failed - try again."; });
        }, function () { ist.textContent = "Could not read photo."; });
      });
      ilRow.appendChild(ib); ilRow.appendChild(pf);
      ilw.appendChild(ilRow); ilw.appendChild(ist);
      c.appendChild(ilw);

      /* MULTIPLE PHOTOS per blog (cover/gallery photos - modal me top par dikhte hain) */
      var pw = document.createElement("div"); pw.className = "ed-f";
      pw.innerHTML = "<label>Cover photos in this blog (multiple allowed, top of article)</label>";
      var strip = document.createElement("div"); strip.style.cssText = "display:flex;flex-wrap:wrap;gap:10px;margin-bottom:6px";
      (b.photos || []).forEach(function (p, pi) {
        var th = document.createElement("div"); th.style.cssText = "position:relative";
        var im = document.createElement("img"); im.src = p;
        im.style.cssText = "width:78px;height:58px;object-fit:cover;border-radius:8px;border:1px solid var(--border);display:block";
        var del = document.createElement("button"); del.type = "button"; del.textContent = "✕";
        del.style.cssText = "position:absolute;top:-7px;right:-7px;width:19px;height:19px;border-radius:50%;background:#e5484d;color:#fff;border:none;font-size:.62rem;cursor:pointer;line-height:1";
        del.addEventListener("click", function () { b.photos.splice(pi, 1); SM.render(); });
        th.appendChild(im); th.appendChild(del); strip.appendChild(th);
      });
      pw.appendChild(strip);
      var fi = document.createElement("input"); fi.type = "file"; fi.accept = "image/*"; fi.multiple = true; fi.style.display = "none";
      var ub = document.createElement("button"); ub.type = "button"; ub.className = "ed-add"; ub.textContent = "+ Add cover photos (multi-select)";
      var st = document.createElement("div"); st.style.cssText = "font-size:.72rem;color:var(--muted);margin-top:4px";
      ub.addEventListener("click", function () { fi.click(); });
      fi.addEventListener("change", function () {
        var files = Array.from(fi.files || []);
        if (!files.length) return;
        st.textContent = "Uploading " + files.length + " photo(s)...";
        var done = 0;
        files.forEach(function (file, idx) {
          uploadImage(file, function (b64) {
            var name = "image/blog_" + Date.now() + "_" + idx + ".jpg";
            SM.putImage(name, b64, function () {
              (b.photos = b.photos || []).push(name);
              done++; check();
            }, function () { done++; check(); });
          }, function () { done++; check(); });
        });
        function check() { if (done >= files.length) { st.textContent = "Photos added! Click Save & Submit."; SM.render(); } }
      });
      pw.appendChild(ub); pw.appendChild(fi); pw.appendChild(st);
      c.appendChild(pw);
      SM.onDel(c, SM.w.blogs, i);
    });
    var add = document.createElement("button");
    add.type = "button"; add.className = "ed-add"; add.textContent = "+ Add blog";
    add.addEventListener("click", function () {
      SM.w.blogs.push({ title: "", tag: "Blog", date: new Date().toISOString().slice(0, 10), body: "", photos: [] });
      SM.render();
    });
    body.appendChild(add);
  }
})();
