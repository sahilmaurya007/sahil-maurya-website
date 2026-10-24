/* app20.js - News tab: har news me photo upload (upload hote hi link ho jayegi). DO NOT EDIT. */
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
      c.appendChild(SM.pickCropUpload("News photo (upload hote hi is news se link ho jayegi)", function (path) {
        n.photo = path;
        SM.render();
        SM.msg("Photo uploaded + linked to News " + (i + 1) + "! Save & Submit dabao.");
      }));
      SM.onDel(c, w.news, i);
    });
    var an = document.createElement("button"); an.type = "button"; an.className = "ed-add"; an.textContent = "+ Add news";
    an.addEventListener("click", function () { w.news.push({ type: "Update", text: "", link: "", date: "", photo: "" }); SM.render(); });
    body.appendChild(an);
  };
})();
