/* app8.js - editor sections, tabs, preview, approve link. DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  var SECTIONS = [
    { id: "profile", ic: "\uD83D\uDC64", label: "Profile / Bio", get: function () { return typeof ABOUT !== "undefined" ? ABOUT.join("\n\n") : ""; }, apply: function (t) { ABOUT.length = 0; t.split(/\n{2,}/).forEach(function (p) { if (p.trim()) ABOUT.push(p.trim()); }); } },
    { id: "intro", ic: "\u2728", label: "Hero intro", get: function () { return PROFILE.intro; }, apply: function (t) { PROFILE.intro = t; } },
    { id: "news", ic: "\uD83D\uDCF0", label: "News / Conference", get: function () { return NEWS.map(function (n) { return n.type + " | " + n.text + " | " + (n.link || "") + " | " + (n.date || "") + " | " + (n.photo || ""); }).join("\n"); }, apply: function (t) { var a = []; t.split(/\n/).forEach(function (l) { var p = l.split("|").map(function (x) { return x.trim(); }); if (p[1]) a.push({ type: p[0] || "Update", text: p[1], link: p[2] || "", date: p[3] || "", photo: p[4] || "" }); }); NEWS.length = 0; a.forEach(function (x) { NEWS.push(x); }); } },
    { id: "pubs", ic: "\uD83D\uDCC4", label: "Papers / Publications", get: function () { return PUBLICATIONS.map(function (p) { return p.title + " | " + p.authors + " | " + p.venue + " | " + p.year + " | " + (p.note || "") + " | " + (p.link || ""); }).join("\n"); }, apply: function (t) { var a = []; t.split(/\n/).forEach(function (l) { var p = l.split("|").map(function (x) { return x.trim(); }); if (p[0]) a.push({ title: p[0], authors: p[1] || "", venue: p[2] || "", year: p[3] || "", type: "Conference Paper", doi: "", link: p[5] || "", pdf: "", note: p[4] || "", tags: [] }); }); PUBLICATIONS.length = 0; a.forEach(function (x) { PUBLICATIONS.push(x); }); } },
    { id: "awards", ic: "\uD83C\uDFC6", label: "Education / Awards", get: function () { return AWARDS.map(function (x) { return x.title + " | " + x.issuer + " | " + (x.date || ""); }).join("\n"); }, apply: function (t) { var a = []; t.split(/\n/).forEach(function (l) { var p = l.split("|").map(function (x) { return x.trim(); }); if (p[0]) a.push({ title: p[0], issuer: p[1] || "", date: p[2] || "" }); }); AWARDS.length = 0; a.forEach(function (x) { AWARDS.push(x); }); } },
    { id: "skills", ic: "\uD83D\uDEE0", label: "Skills / Coursework", get: function () { return SKILLS.map(function (s) { return s.category.replace(/<[^>]+>/g, "") + ": " + s.items.join(", "); }).join("\n"); }, apply: function (t) { var a = []; t.split(/\n/).forEach(function (l) { var i = l.indexOf(":"); if (i > 0) a.push({ category: l.slice(0, i).trim(), items: l.slice(i + 1).split(",").map(function (x) { return x.trim(); }).filter(Boolean) }); }); SKILLS.length = 0; a.forEach(function (x) { SKILLS.push(x); }); } },
    { id: "journey", ic: "\uD83E\uDDED", label: "Journey / Timeline", get: function () { return JOURNEY.map(function (j) { return j.date + " | " + j.title + " | " + (j.desc || "") + " | " + (j.category || ""); }).join("\n"); }, apply: function (t) { var a = []; t.split(/\n/).forEach(function (l) { var p = l.split("|").map(function (x) { return x.trim(); }); if (p[1]) a.push({ date: p[0], title: p[1], desc: p[2] || "", section: "education", photo: "", category: p[3] || "Milestone" }); }); JOURNEY.length = 0; a.forEach(function (x) { JOURNEY.push(x); }); } }
  ];
  var cur = SECTIONS[0];
  var tabsBox = SM.tabsBox, textBox = SM.textBox, ed = SM.ed;
  tabsBox.innerHTML = SECTIONS.map(function (s) {
    return "<button class='ed-tab' data-id='" + s.id + "'><span>" + s.ic + "</span>" + s.label + "</button>";
  }).join("");
  var select = function (id) {
    cur = SECTIONS.filter(function (s) { return s.id === id; })[0] || SECTIONS[0];
    tabsBox.querySelectorAll(".ed-tab").forEach(function (b) { b.classList.toggle("active", b.dataset.id === cur.id); });
    textBox.value = cur.get();
  };
  tabsBox.querySelectorAll(".ed-tab").forEach(function (b) {
    b.addEventListener("click", function () { select(b.dataset.id); });
  });
  SM.open = function () {
    select(cur.id);
    ed.classList.add("open");
  };
  ed.querySelector(".ed-preview").addEventListener("click", function () {
    cur.apply(textBox.value);
    SM.reRender();
    ed.querySelector(".ed-note").innerHTML = "<b class='ok'>Preview applied.</b> Press Save to get the approval link.";
  });
  ed.querySelector(".ed-save").addEventListener("click", function () {
    cur.apply(textBox.value);
    SM.reRender();
    var url = SM.REPO + "/compare/main..." + SM.BR + "?expand=1";
    ed.querySelector(".ed-note").innerHTML = "<b class='ok'>Ready for approval.</b> Click below, then Create pull request and Merge to publish: " +
      "<a class='ed-approve' href='" + url + "' target='_blank' rel='noopener'>Review &amp; Approve</a>";
  });
})();
