/* app40.js - Blogs editor tab: title, tag, date, body + MULTIPLE PHOTOS upload per blog. DO NOT EDIT. */
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
  function renderBlogs(body) {
    if (!SM.w.blogs.length) SM.emptyList(body, "No blogs yet — click + Add blog to write your first one.");
    SM.w.blogs.forEach(function (b, i) {
      var c = SM.box(body, "Blog " + (i + 1));
      var tt = SM.f(c, "Title", b.title);
      tt.addEventListener("input", function () { b.title = tt.value; });
      var tg = SM.f(c, "Tag (e.g. FPGA, VLSI, Research, Life)", b.tag);
      tg.addEventListener("input", function () { b.tag = tg.value; });
      var dt = SM.f(c, "Date (e.g. 2026-10-27)", b.date);
      dt.addEventListener("input", function () { b.date = dt.value; });
      var bd = SM.f(c, "Full blog text — **bold** and ### headings supported", b.body, true);
      bd.style.minHeight = "180px";
      bd.addEventListener("input", function () { b.body = bd.value; });
      /* ---- MULTIPLE PHOTOS per blog (upload + delete) ---- */
      var pw = document.createElement("div"); pw.className = "ed-f";
      pw.innerHTML = "<label>Photos in this blog (multiple allowed)</label>";
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
      var ub = document.createElement("button"); ub.type = "button"; ub.className = "ed-add"; ub.textContent = "+ Add photos (multi-select)";
      var st = document.createElement("div"); st.style.cssText = "font-size:.72rem;color:var(--muted);margin-top:4px";
      ub.addEventListener("click", function () { fi.click(); });
      fi.addEventListener("change", function () {
        var files = Array.from(fi.files || []);
        if (!files.length) return;
        st.textContent = "Uploading " + files.length + " photo(s)...";
        var done = 0;
        files.forEach(function (file, idx) {
          SM.processImage(file, null, function (out) {
            if (!out) { done++; check(); return; }
            var name = "image/blog_" + Date.now() + "_" + idx + ".jpg";
            SM.putImage(name, out.b64, function () {
              (b.photos = b.photos || []).push(name);
              done++; check();
            }, function () { done++; check(); }, null);
          });
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
