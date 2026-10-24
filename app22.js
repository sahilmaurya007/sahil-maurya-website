/* app22.js - Papers tab PRO (DOI, BibTeX, PDF upload, category, status) + rich-text toolbar (bold/link). DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  var D = function (n, f) { try { var v = eval(n); return v == null ? f : v; } catch (e) { return f; } };

  /* rich text helper: [text](url) ko anchor banata hai, ** ** ko bold */
  SM.rich = function (s) {
    if (s == null) return "";
    var t = String(s);
    t = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="sm-rich-link">$1</a>');
    return t;
  };

  /* toolbar add karne wala field wrapper: bold + link buttons */
  var oldF = SM.f;
  SM.f = function (parent, label, val, ta) {
    var inp = oldF(parent, label, val, ta);
    if (ta) {
      var wrap = inp.parentElement;
      var bar = document.createElement("div");
      bar.style.cssText = "display:flex;gap:6px;margin-bottom:4px";
      var bb = document.createElement("button"); bb.type = "button"; bb.textContent = "B";
      bb.style.cssText = "font-weight:800;padding:2px 10px;border:1px solid var(--border);background:none;color:var(--text);border-radius:6px;cursor:pointer";
      bb.title = "Bold (selected text)";
      bb.addEventListener("click", function () { wrapSel(inp, "**", "**"); });
      var lb = document.createElement("button"); lb.type = "button"; lb.textContent = "🔗";
      lb.style.cssText = "padding:2px 8px;border:1px solid var(--border);background:none;color:var(--text);border-radius:6px;cursor:pointer";
      lb.title = "Link (selected text -> URL)";
      lb.addEventListener("click", function () {
        var s = inp.selectionStart, e = inp.selectionEnd;
        var url = prompt("Link URL (full https://...):", "https://");
        if (!url) return;
        if (s !== e) wrapSel(inp, "[", "](" + url + ")");
        else inp.value += "[" + (label || "link") + "](" + url + ")";
        inp.dispatchEvent(new Event("input"));
      });
      bar.appendChild(bb); bar.appendChild(lb);
      wrap.insertBefore(bar, inp);
    }
    return inp;
  };
  function wrapSel(inp, pre, post) {
    var s = inp.selectionStart, e = inp.selectionEnd;
    if (s === e) { inp.value = inp.value.slice(0, s) + pre + "text" + post + inp.value.slice(e); }
    else { inp.value = inp.value.slice(0, s) + pre + inp.value.slice(s, e) + post + inp.value.slice(e); }
    inp.selectionStart = s + pre.length; inp.selectionEnd = e + pre.length;
    inp.dispatchEvent(new Event("input"));
    inp.focus();
  }

  /* working model extend: papers full fields */
  SM.begin = (function (old) { return function () {
    old();
    SM.w.pubs = (D("PUBLICATIONS", []) || []).map(function (p) {
      return {
        title: p.title || "", authors: p.authors || "", venue: p.venue || "", year: p.year || "",
        note: p.note || "", link: p.link || "", doi: p.doi || "", pdf: p.pdf || "", bibtex: p.bibtex || "",
        cat: p.type || "", status: p.status || "Published", tags: (p.tags || []).join(", ")
      };
    });
  }; })(SM.begin);

  var oldRT = SM.renderTab;
  SM.renderTab = function (cur, body) {
    if (cur !== "papers") { if (oldRT) oldRT(cur, body); return; }
    if (!SM.w.pubs.length) {
      var p0 = document.createElement("p"); p0.style.cssText = "color:var(--muted);font-size:.78rem";
      p0.textContent = "Papers khali hai - + Add paper se naya add karo."; body.appendChild(p0);
    }
    SM.w.pubs.forEach(function (pp, i) {
      var c = SM.box(body, "Paper " + (i + 1) + (pp.cat ? " · " + pp.cat : ""));
      var a = SM.f(c, "Title (bold: **text** select karke B)", pp.title);
      a.addEventListener("input", function () { pp.title = a.value; });
      var b = SM.f(c, "Authors (bold: **text**, link: [text](url))", pp.authors);
      b.addEventListener("input", function () { pp.authors = b.value; });
      /* category dropdown */
      var cw = document.createElement("div"); cw.className = "ed-f";
      cw.innerHTML = "<label>Type / category</label>";
      var sel = document.createElement("select");
      sel.style.cssText = "padding:9px 11px;border-radius:9px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.84rem";
      ["Conference", "Journal", "Letter", "Workshop", "Symposium", "Poster", "Demo", "Book Chapter", "Preprint", "Talk"].forEach(function (op) {
        var o = document.createElement("option"); o.value = op; o.textContent = op; if (pp.cat === op) o.selected = true; sel.appendChild(o);
      });
      var o2 = document.createElement("option"); o2.value = "Other"; o2.textContent = "Other"; if (!["Conference", "Journal", "Letter", "Workshop", "Symposium", "Poster", "Demo", "Book Chapter", "Preprint", "Talk"].includes(pp.cat) && pp.cat) o2.selected = true; sel.appendChild(o2);
      cw.appendChild(sel); c.appendChild(cw);
      sel.addEventListener("change", function () { pp.cat = sel.value; });
      /* status */
      var sw = document.createElement("div"); sw.className = "ed-f";
      sw.innerHTML = "<label>Status</label>";
      var ssel = document.createElement("select");
      ssel.style.cssText = "padding:9px 11px;border-radius:9px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.84rem";
      ["Published", "Accepted", "In Press", "Under Review", "Submitted", "In Preparation"].forEach(function (op) {
        var o = document.createElement("option"); o.value = op; o.textContent = op; if (pp.status === op) o.selected = true; ssel.appendChild(o);
      });
      sw.appendChild(ssel); c.appendChild(sw);
      ssel.addEventListener("change", function () { pp.status = ssel.value; });
      var v = SM.f(c, "Venue (journal/conference name)", pp.venue);
      v.addEventListener("input", function () { pp.venue = v.value; });
      var y = SM.f(c, "Year", pp.year);
      y.addEventListener("input", function () { pp.year = y.value; });
      var n = SM.f(c, "Note (highlight/summary)", pp.note, true);
      n.addEventListener("input", function () { pp.note = n.value; });
      var d = SM.f(c, "DOI link (https://doi.org/...)", pp.doi);
      d.addEventListener("input", function () { pp.doi = d.value; });
      var l = SM.f(c, "Link (IEEE/Springer page, optional)", pp.link);
      l.addEventListener("input", function () { pp.link = l.value; });
      var bt = SM.f(c, "BibTeX (paste full bibtex)", pp.bibtex, true);
      bt.addEventListener("input", function () { pp.bibtex = bt.value; });
      /* PDF upload (drag-drop) */
      c.appendChild(pdfDrop(pp));
      var tg = SM.f(c, "Tags (comma separated)", pp.tags);
      tg.addEventListener("input", function () { pp.tags = tg.value; });
      SM.onDel(c, SM.w.pubs, i);
    });
    var an = document.createElement("button"); an.type = "button"; an.className = "ed-add"; an.textContent = "+ Add paper";
    an.addEventListener("click", function () { SM.w.pubs.push({ title: "", authors: "", venue: "", year: "", note: "", link: "", doi: "", pdf: "", bibtex: "", cat: "Conference", status: "Published", tags: "" }); SM.render(); });
    body.appendChild(an);
  };

  function pdfDrop(pp) {
    var w = document.createElement("div"); w.className = "ed-f";
    w.innerHTML = "<label>PDF upload (drag & drop ya click)</label>";
    var dz = document.createElement("div");
    dz.style.cssText = "border:2px dashed var(--accent);border-radius:12px;padding:12px;text-align:center;font-size:.76rem;color:var(--accent);cursor:pointer";
    dz.textContent = pp.pdf ? "PDF: " + pp.pdf + " - drop karke replace karo" : "Drag & drop PDF here (ya click)";
    var fi = document.createElement("input"); fi.type = "file"; fi.accept = "application/pdf"; fi.style.display = "none";
    dz.addEventListener("click", function () { fi.click(); });
    fi.addEventListener("change", function () { if (fi.files && fi.files[0]) up(fi.files[0]); });
    ["dragover", "dragenter"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); e.stopPropagation(); }); });
    dz.addEventListener("drop", function (e) {
      e.preventDefault(); e.stopPropagation();
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) up(e.dataTransfer.files[0]);
    });
    function up(f) {
      if (f.size > 25 * 1024 * 1024) { dz.textContent = "PDF 25MB se bada nahi chalega"; return; }
      dz.textContent = "Uploading " + f.name + "...";
      var fr = new FileReader();
      fr.onload = function () {
        var bytes = new Uint8Array(fr.result); var s = ""; var CH = 8192;
        for (var i = 0; i < bytes.length; i += CH) s += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
        var name = "docs/paper_" + Date.now() + ".pdf";
        SM.putImage(name, btoa(s), function () {
          pp.pdf = name;
          dz.textContent = "PDF uploaded: " + name;
          SM.msg("PDF uploaded! Save & Submit dabao.");
        }, function (er) { dz.textContent = er; }, "Uploading PDF...");
      };
      fr.readAsArrayBuffer(f);
    }
    w.appendChild(dz); w.appendChild(fi);
    return w;
  }
})();
