/* app23.js - live site par rich text: **bold** aur [text](url) ko real bold/colored link banata hai. DO NOT EDIT. */
(function () {
  "use strict";
  var rich = function (s) {
    if (s == null) return "";
    var t = String(s);
    t = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="sm-rich-link">$1</a>');
    return t;
  };
  var style = document.createElement("style");
  style.textContent = ".sm-rich-link{color:#2563eb;font-weight:600;text-decoration:underline}.sm-rich-link:hover{color:#1d4ed8}";
  document.head.appendChild(style);

  var apply = function () {
    try {
      if (typeof PUBLICATIONS !== "undefined" && document.getElementById("pubList")) {
        document.getElementById("pubList").innerHTML = PUBLICATIONS.map(function (p, i) {
          var links = [];
          if (p.doi) links.push('<a class="btn-sm" href="' + p.doi + '" target="_blank" rel="noopener">DOI</a>');
          if (p.link) links.push('<a class="btn-sm" href="' + p.link + '" target="_blank" rel="noopener">Link</a>');
          if (p.pdf) links.push('<a class="btn-sm" href="' + p.pdf + '" target="_blank" rel="noopener">PDF</a>');
          var tags = (p.tags || []).map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("");
          return '<article class="card"><span class="pub-no">[' + (PUBLICATIONS.length - i) + "] \u00b7 " + (p.type || "") + " \u00b7 " + (p.year || "") + '</span><h3 class="pub-title">' + rich(p.title) + '</h3><p class="pub-meta">' + rich(p.authors) + " \u00b7 <em>" + rich(p.venue) + "</em>, " + (p.year || "") + "</p>" + (p.note ? '<p class="note">' + rich(p.note) + "</p>" : "") + (p.status ? '<p class="note" style="color:#16a34a;font-weight:600">' + p.status + "</p>" : "") + (p.bibtex ? '<details class="sm-bib" style="margin-top:8px"><summary style="cursor:pointer;font-size:.8rem;color:var(--muted)">BibTeX</summary><pre style="background:var(--bg2);padding:10px;border-radius:8px;font-size:.72rem;overflow-x:auto;white-space:pre-wrap">' + p.bibtex.replace(/</g, "&lt;") + "</pre></details>" : "") + (links.length ? '<div class="btn-row" style="margin-top:12px">' + links.join("") + "</div>" : "") + (tags ? '<div class="tag-row">' + tags + "</div>" : "") + "</article>";
        }).join("");
      }
    } catch (e) {}
    /* gallery captions + notes me bhi rich links */
    try {
      document.querySelectorAll(".gal-cap").forEach(function (cap) {
        var txt = cap.textContent || "";
        if ((cap.dataset.rich || txt.indexOf("**") === -1 && txt.indexOf("](") === -1) && cap.dataset.rich) return;
        if (cap.dataset.rich) return;
        if (txt.indexOf("**") >= 0 || txt.indexOf("](") >= 0) {
          cap.dataset.rich = "1";
          cap.innerHTML = rich(txt);
        }
      });
      document.querySelectorAll(".note, .pub-meta").forEach(function (el) {
        var txt = el.textContent || "";
        if (el.dataset.rich) return;
        if (txt.indexOf("**") >= 0 || txt.indexOf("](") >= 0) {
          el.dataset.rich = "1";
          el.innerHTML = rich(txt);
        }
      });
    } catch (e) {}
  };
  apply();
  new MutationObserver(function () { setTimeout(apply, 100); }).observe(document.body, { childList: true, subtree: true });
})();
