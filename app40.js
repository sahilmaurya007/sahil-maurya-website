/* app40.js - Blogs editor tab: title, tag, date, full body — add/update/delete blogs. DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  var D = function (n, f) { try { var v = eval(n); return v == null ? f : v; } catch (e) { return f; } };
  SM.begin = (function (old) { return function () {
    old();
    SM.w.blogs = (D("BLOGS", []) || []).slice();
  }; })(SM.begin);
  var oldRT = SM.renderTab;
  SM.renderTab = function (cur, body) {
    if (cur !== "blogs") { if (oldRT) oldRT(cur, body); return; }
    renderBlogs(body);
  };
  function renderBlogs(body) {
    if (!SM.w.blogs.length) SM.emptyList(body, "Abhi koi blog nahi hai — + Add blog se pehla blog likho.");
    SM.w.blogs.forEach(function (b, i) {
      var c = SM.box(body, "Blog " + (i + 1));
      var tt = SM.f(c, "Title (blog ka naam)", b.title);
      tt.addEventListener("input", function () { b.title = tt.value; });
      var tg = SM.f(c, "Tag (e.g. VLSI, Research, Life)", b.tag);
      tg.addEventListener("input", function () { b.tag = tg.value; });
      var dt = SM.f(c, "Date (e.g. 2026-10-27)", b.date);
      dt.addEventListener("input", function () { b.date = dt.value; });
      var bd = SM.f(c, "Full blog text — **bold** aur ### headings use kar sakte ho", b.body, true);
      bd.style.minHeight = "180px";
      bd.addEventListener("input", function () { b.body = bd.value; });
      SM.onDel(c, SM.w.blogs, i);
    });
    var add = document.createElement("button");
    add.type = "button";
    add.className = "ed-add";
    add.textContent = "+ Add blog";
    add.addEventListener("click", function () {
      SM.w.blogs.push({ title: "", tag: "Blog", date: new Date().toISOString().slice(0, 10), body: "" });
      SM.render();
    });
    body.appendChild(add);
  }
})();
