/* app25.js - shared buildData4 (data4.js content). DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  SM.buildData4 = function () {
    var w = SM.w;
    var edits = {
      ABOUT: w.about,
      intro: w.intro,
      NEWS: w.news,
      PUBLICATIONS: (w.pubs || []).map(function (p) {
        return { title: p.title || "", authors: p.authors || "", venue: p.venue || "", year: p.year || "", note: p.note || "", link: p.link || "", doi: p.doi || "", pdf: p.pdf || "", bibtex: p.bibtex || "", type: p.cat || "", status: p.status || "Published", tags: (p.tags || "").split(",").map(function (q) { return q.trim(); }).filter(Boolean) };
      }),
      AWARDS: w.awards,
      SKILLS: w.skills.map(function (s) { return { category: s.category, items: s.items.split(",").map(function (q) { return q.trim(); }).filter(Boolean) }; }),
      JOURNEY: w.journey.map(function (j) { return { date: j.date, title: j.title, desc: j.desc, section: "education", photo: "", category: j.cat || "Milestone" }; }),
      PHOTO: w.photo || "",
      GALLERY: w.gallery || []
    };
    var applyFn = "window.SM_APPLY = function (e) {\n  if (!e) return;\n  if (e.ABOUT && typeof ABOUT !== \"undefined\") { ABOUT.length = 0; e.ABOUT.forEach(function (p) { ABOUT.push(p); }); }\n  if (e.intro && typeof PROFILE !== \"undefined\") PROFILE.intro = e.intro;\n  if (e.PHOTO && typeof PROFILE !== \"undefined\") PROFILE.photo = e.PHOTO;\n  if (e.NEWS && typeof NEWS !== \"undefined\") { NEWS.length = 0; e.NEWS.forEach(function (x) { NEWS.push(x); }); }\n  if (e.PUBLICATIONS && typeof PUBLICATIONS !== \"undefined\") { PUBLICATIONS.length = 0; e.PUBLICATIONS.forEach(function (x) { PUBLICATIONS.push(x); }); }\n  if (e.AWARDS && typeof AWARDS !== \"undefined\") { AWARDS.length = 0; e.AWARDS.forEach(function (x) { AWARDS.push(x); }); }\n  if (e.SKILLS && typeof SKILLS !== \"undefined\") { SKILLS.length = 0; e.SKILLS.forEach(function (x) { SKILLS.push(x); }); }\n  if (e.JOURNEY && typeof JOURNEY !== \"undefined\") { JOURNEY.length = 0; e.JOURNEY.forEach(function (x) { JOURNEY.push(x); }); }\n  if (e.GALLERY && e.GALLERY.length && typeof GALLERY_CATEGORIES !== \"undefined\") { GALLERY_CATEGORIES.length = 0; e.GALLERY.forEach(function (x) { GALLERY_CATEGORIES.push(x); }); }\n};\n";
    return "/* data4.js - editor overrides (auto-generated). DO NOT EDIT MANUALLY. */\nwindow.EDITS = " + JSON.stringify(edits, null, 2) + ";\n" + applyFn + "SM_APPLY(EDITS);\n";
  };
})();
