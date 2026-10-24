/* app20.js - News tab: drag-drop photo upload + crop per news. DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  var oldRT = SM.renderTab;
  SM.renderTab = function (cur, body) {
    if (cur !== "news") { if (oldRT) oldRT(cur, body); return; }
    var w = SM.w;
    if (!w.news.length) {
      var p = document.createElement("p"); p.style.cssText = "color:var(--muted);font-size:.78rem";
      p.textContent = "News khali hai - + Add news se naya add karo."; body.appendChild(p);
    }
    w.news.forEach(function (n, i) {
      var c = SM.box(body, "News " + (i + 1));
      if (n.photo) {
        var prev = document.createElement("img");
        prev.src = n.photo;
        prev.style.cssText = "width:100%;max-width:200px;height:auto;display:block;border-radius:8px;margin-bottom:8px;object-fit:contain;background:var(--bg)";
        c.insertBefore(prev, c.firstChild.nextSibling);
      }
      var a = SM.f(c, "Type (Conference/Award/Journal/Talk/Fellowship/Workshop)", n.type);
      a.addEventListener("input", function () { n.type = a.value; });
      var b = SM.f(c, "News text", n.text, true);
      b.addEventListener("input", function () { n.text = b.value; });
      var l = SM.f(c, "Link (optional)", n.link);
      l.addEventListener("input", function () { n.link = l.value; });
      var d = SM.f(c, "Date (YYYY-MM-DD)", n.date);
      d.addEventListener("input", function () { n.date = d.value; });

      /* ---- DRAG-DROP + crop zone ---- */
      var dz = document.createElement("div");
      dz.style.cssText = "border:2px dashed var(--accent);border-radius:12px;padding:14px 10px;text-align:center;font-size:.78rem;color:var(--accent);cursor:pointer;margin-bottom:8px";
      dz.textContent = "Drag & drop photo here (ya click karke choose karo)";
      var fi = document.createElement("input"); fi.type = "file"; fi.accept = "image/*"; fi.style.display = "none";
      var imgEl = document.createElement("img");
      imgEl.style.cssText = "width:100%;max-width:200px;display:none;border-radius:8px;cursor:crosshair;margin-top:8px";
      var bx = document.createElement("div");
      bx.style.cssText = "position:relative;display:none;max-width:200px;margin:8px auto 0";
      var boxEl = document.createElement("div");
      boxEl.style.cssText = "position:absolute;border:2px dashed #16a34a;background:rgba(22,163,74,.15);display:none;pointer-events:none";
      bx.appendChild(imgEl); bx.appendChild(boxEl);
      var upBtn = document.createElement("button"); upBtn.type = "button"; upBtn.className = "ed-add"; upBtn.textContent = "Upload (crop optional)"; upBtn.style.display = "none";
      var st = document.createElement("div"); st.style.cssText = "font-size:.72rem;color:var(--muted);margin-top:4px";
      var file = null, crop = null, drag = false, x0 = 0, y0 = 0;

      function pick(f) {
        file = f;
        st.textContent = "Selected: " + f.name + " - drag karke crop select karo (optional)";
        var fr = new FileReader();
        fr.onload = function () { imgEl.src = fr.result; imgEl.style.display = "block"; bx.style.display = "block"; upBtn.style.display = "block"; };
        fr.readAsDataURL(f);
        crop = null; boxEl.style.display = "none";
      }
      dz.addEventListener("click", function () { fi.click(); });
      fi.addEventListener("change", function () { if (fi.files && fi.files[0]) pick(fi.files[0]); });
      ["dragover", "dragenter"].forEach(function (ev) {
        dz.addEventListener(ev, function (e) { e.preventDefault(); e.stopPropagation(); dz.style.background = "rgba(99,102,241,.12)"; });
      });
      dz.addEventListener("dragleave", function () { dz.style.background = "transparent"; });
      dz.addEventListener("drop", function (e) {
        e.preventDefault(); e.stopPropagation(); dz.style.background = "transparent";
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) pick(e.dataTransfer.files[0]);
      });
      imgEl.addEventListener("mousedown", function (e) { drag = true; var r = imgEl.getBoundingClientRect(); x0 = e.clientX - r.left; y0 = e.clientY - r.top; boxEl.style.display = "block"; e.preventDefault(); });
      document.addEventListener("mousemove", function (e) {
        if (!drag) return;
        var r = imgEl.getBoundingClientRect();
        var x = Math.max(0, Math.min(e.clientX - r.left, r.width));
        var y = Math.max(0, Math.min(e.clientY - r.top, r.height));
        boxEl.style.left = Math.min(x0, x) + "px"; boxEl.style.top = Math.min(y0, y) + "px";
        boxEl.style.width = Math.abs(x - x0) + "px"; boxEl.style.height = Math.abs(y - y0) + "px";
      });
      document.addEventListener("mouseup", function (e) {
        if (!drag) return; drag = false;
        var r = imgEl.getBoundingClientRect();
        var x = Math.max(0, Math.min(e.clientX - r.left, r.width));
        var y = Math.max(0, Math.min(e.clientY - r.top, r.height));
        if (Math.abs(x - x0) > 8 && Math.abs(y - y0) > 8) {
          var rx = imgEl.naturalWidth / r.width, ry = imgEl.naturalHeight / r.height;
          crop = { x: Math.round(Math.min(x0, x) * rx), y: Math.round(Math.min(y0, y) * ry), w: Math.round(Math.abs(x - x0) * rx), h: Math.round(Math.abs(y - y0) * ry) };
          st.textContent = "Crop selected! Upload dabao.";
        }
      });
      upBtn.addEventListener("click", function () {
        if (!file) { st.textContent = "Pehle photo choose/drop karo."; return; }
        st.textContent = "Processing + uploading...";
        SM.processImage(file, crop, function (out) {
          if (!out) { st.textContent = "Image process fail"; return; }
          var name = "image/news_" + Date.now() + ".jpg";
          SM.putImage(name, out.b64, function () {
            n.photo = name;
            SM.render();
            SM.msg("Photo uploaded + linked to News " + (i + 1) + "! Save & Submit dabao.");
          }, function (er) { st.textContent = er; }, "Uploading...");
        });
      });
      c.appendChild(dz); c.appendChild(fi); c.appendChild(bx); c.appendChild(upBtn); c.appendChild(st);
      SM.onDel(c, w.news, i);
    });
    var an = document.createElement("button"); an.type = "button"; an.className = "ed-add"; an.textContent = "+ Add news";
    an.addEventListener("click", function () { w.news.push({ type: "Update", text: "", link: "", date: "", photo: "" }); SM.render(); });
    body.appendChild(an);
  };
})();
