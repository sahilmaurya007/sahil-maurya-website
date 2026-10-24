/* app12.js - Papers/Awards/Skills/Journey/GitHub tabs + Preview/Save. Direct const refs. DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  var D = function (n, f) { try { var v = eval(n); return v == null ? f : v; } catch (e) { return f; } };
  SM.begin = (function (old) { return function () {
    old();
    SM.w.pubs = (D("PUBLICATIONS", []) || []).map(function (p) { return { title: p.title || "", authors: p.authors || "", venue: p.venue || "", year: p.year || "", note: p.note || "", link: p.link || "" }; });
    SM.w.awards = (D("AWARDS", []) || []).map(function (a) { return { title: a.title || "", issuer: a.issuer || "", date: a.date || "" }; });
    SM.w.skills = (D("SKILLS", []) || []).map(function (s) { return { category: (s.category || "").replace(/<[^>]+>/g, ""), items: (s.items || []).join(", ") }; });
    SM.w.journey = (D("JOURNEY", []) || []).map(function (j) { return { date: j.date || "", title: j.title || "", desc: j.desc || "", cat: j.category || "" }; });
    if (!SM.w.photo) SM.w.photo = (D("PROFILE", {}) || {}).photo || "";
    if (!SM.w.gallery) SM.w.gallery = (D("GALLERY_CATEGORIES", []) || []).map(function (c) { return { name: c.name || "", photos: (c.photos || []).map(function (p) { return { src: p.src || "", caption: p.caption || "" }; }) }; });
  }; })(SM.begin);

  function addBtn(body, txt, fn) { var b = document.createElement("button"); b.className = "ed-add"; b.type = "button"; b.textContent = txt; b.addEventListener("click", fn); body.appendChild(b); }
  function empty(body, txt) { var p = document.createElement("p"); p.style.cssText = "color:var(--muted);font-size:.78rem"; p.textContent = txt; body.appendChild(p); }

  SM.renderTab = function (cur, body) {
    if (cur === "papers") {
      if (!SM.w.pubs.length) empty(body, "Papers abhi khali hai - + Add paper se naya add karo.");
      SM.w.pubs.forEach(function (p, i) {
        var c = SM.box(body, "Paper " + (i + 1));
        var a = SM.f(c, "Title", p.title); a.addEventListener("input", function () { p.title = a.value; });
        var b = SM.f(c, "Authors", p.authors); b.addEventListener("input", function () { p.authors = b.value; });
        var v = SM.f(c, "Venue", p.venue); v.addEventListener("input", function () { p.venue = v.value; });
        var y = SM.f(c, "Year", p.year); y.addEventListener("input", function () { p.year = y.value; });
        var n = SM.f(c, "Note", p.note, true); n.addEventListener("input", function () { p.note = n.value; });
        var l = SM.f(c, "Link (optional)", p.link); l.addEventListener("input", function () { p.link = l.value; });
        SM.onDel(c, SM.w.pubs, i);
      });
      addBtn(body, "+ Add paper", function () { SM.w.pubs.push({ title: "", authors: "", venue: "", year: "", note: "", link: "" }); SM.render(); });
    } else if (cur === "awards") {
      if (!SM.w.awards.length) empty(body, "Awards abhi khali hai - + Add award se naya add karo.");
      SM.w.awards.forEach(function (a0, i) {
        var c = SM.box(body, "Award " + (i + 1));
        var a = SM.f(c, "Title", a0.title); a.addEventListener("input", function () { a0.title = a.value; });
        var b = SM.f(c, "Issuer", a0.issuer); b.addEventListener("input", function () { a0.issuer = b.value; });
        var d = SM.f(c, "Date/Year", a0.date); d.addEventListener("input", function () { a0.date = d.value; });
        SM.onDel(c, SM.w.awards, i);
      });
      addBtn(body, "+ Add award", function () { SM.w.awards.push({ title: "", issuer: "", date: "" }); SM.render(); });
    } else if (cur === "skills") {
      if (!SM.w.skills.length) empty(body, "Skills abhi khali hai - + Add category se naya add karo.");
      SM.w.skills.forEach(function (s, i) {
        var c = SM.box(body, "Category " + (i + 1));
        var a = SM.f(c, "Category name", s.category); a.addEventListener("input", function () { s.category = a.value; });
        var b = SM.f(c, "Items (comma separated)", s.items, true); b.addEventListener("input", function () { s.items = b.value; });
        SM.onDel(c, SM.w.skills, i);
      });
      addBtn(body, "+ Add category", function () { SM.w.skills.push({ category: "", items: "" }); SM.render(); });
    } else if (cur === "journey") {
      if (!SM.w.journey.length) empty(body, "Journey abhi khali hai - + Add milestone se naya add karo.");
      SM.w.journey.forEach(function (j, i) {
        var c = SM.box(body, "Milestone " + (i + 1));
        var d = SM.f(c, "Date (YYYY-MM)", j.date); d.addEventListener("input", function () { j.date = d.value; });
        var t = SM.f(c, "Title", j.title); t.addEventListener("input", function () { j.title = t.value; });
        var x = SM.f(c, "Description", j.desc, true); x.addEventListener("input", function () { j.desc = x.value; });
        var k = SM.f(c, "Category (Education/Publication/Award/Certification)", j.cat); k.addEventListener("input", function () { j.cat = k.value; });
        SM.onDel(c, SM.w.journey, i);
      });
      addBtn(body, "+ Add milestone", function () { SM.w.journey.push({ date: "", title: "", desc: "", cat: "" }); SM.render(); });
    } else if (cur === "github") {
      body.innerHTML = "<div class='ed-f'><label>One-time GitHub token (paste + save, private)</label><input id='ed-token' type='password'></div><div class='ed-f' style='color:var(--muted);font-size:.74rem'>Save hone ke baad Save &amp; Submit changes seedha draft branch par commit karega - approve page par REAL diff dikhega. Token sirf is browser me store hota hai.</div><button class='ed-add' id='ed-token-save' type='button'>Save token</button>";
      var saved = ""; try { saved = localStorage.getItem("sm-token") || ""; } catch (e) {}
      document.getElementById("ed-token").value = saved;
      document.getElementById("ed-token-save").addEventListener("click", function () {
        try { localStorage.setItem("sm-token", document.getElementById("ed-token").value.trim()); } catch (e) {}
        SM.msg("Token saved.");
      });
    }
  };

  SM.preview = function () {
    applyLocal(SM.w);
    if (SM.reRender) SM.reRender();
    SM.msg("Preview applied (this tab only). Save & Submit for permanent.");
  };
  function applyLocal(w) {
    if (typeof ABOUT !== "undefined") { ABOUT.length = 0; w.about.forEach(function (p) { ABOUT.push(p); }); }
    if (typeof PROFILE !== "undefined") PROFILE.intro = w.intro;
    if (typeof NEWS !== "undefined") { NEWS.length = 0; w.news.forEach(function (x) { NEWS.push(x); }); }
    if (typeof PUBLICATIONS !== "undefined") { PUBLICATIONS.length = 0; w.pubs.forEach(function (x) { PUBLICATIONS.push(x); }); }
    if (typeof AWARDS !== "undefined") { AWARDS.length = 0; w.awards.forEach(function (x) { AWARDS.push(x); }); }
    if (typeof SKILLS !== "undefined") { SKILLS.length = 0; w.skills.forEach(function (s) { SKILLS.push({ category: s.category, items: s.items.split(",").map(function (q) { return q.trim(); }).filter(Boolean) }); }); }
    if (typeof JOURNEY !== "undefined") { JOURNEY.length = 0; w.journey.forEach(function (j) { JOURNEY.push({ date: j.date, title: j.title, desc: j.desc, section: "education", photo: "", category: j.cat || "Milestone" }); }); }
    if (w.photo && typeof PROFILE !== "undefined") PROFILE.photo = w.photo;
    if (w.gallery && w.gallery.length && typeof GALLERY_CATEGORIES !== "undefined") { GALLERY_CATEGORIES.length = 0; w.gallery.forEach(function (x) { GALLERY_CATEGORIES.push(x); }); }
  }

  SM.save = function () {
    var token = ""; try { token = localStorage.getItem("sm-token") || ""; } catch (e) {}
    if (!token) { SM.msg("Pehle GitHub tab me token save karo.", true); return; }
    var w = SM.w;
    var edits = {
      ABOUT: w.about,
      intro: w.intro,
      NEWS: w.news,
      PUBLICATIONS: w.pubs,
      AWARDS: w.awards,
      SKILLS: w.skills.map(function (s) { return { category: s.category, items: s.items.split(",").map(function (q) { return q.trim(); }).filter(Boolean) }; }),
      JOURNEY: w.journey.map(function (j) { return { date: j.date, title: j.title, desc: j.desc, section: "education", photo: "", category: j.cat || "Milestone" }; }),
      PHOTO: w.photo || "",
      GALLERY: w.gallery || []
    };
    var applyFn = "window.SM_APPLY = function (e) {\n  if (!e) return;\n  if (e.ABOUT && typeof ABOUT !== \"undefined\") { ABOUT.length = 0; e.ABOUT.forEach(function (p) { ABOUT.push(p); }); }\n  if (e.intro && typeof PROFILE !== \"undefined\") PROFILE.intro = e.intro;\n  if (e.NEWS && typeof NEWS !== \"undefined\") { NEWS.length = 0; e.NEWS.forEach(function (x) { NEWS.push(x); }); }\n  if (e.PUBLICATIONS && typeof PUBLICATIONS !== \"undefined\") { PUBLICATIONS.length = 0; e.PUBLICATIONS.forEach(function (x) { PUBLICATIONS.push(x); }); }\n  if (e.AWARDS && typeof AWARDS !== \"undefined\") { AWARDS.length = 0; e.AWARDS.forEach(function (x) { AWARDS.push(x); }); }\n  if (e.SKILLS && typeof SKILLS !== \"undefined\") { SKILLS.length = 0; e.SKILLS.forEach(function (x) { SKILLS.push(x); }); }\n  if (e.JOURNEY && typeof JOURNEY !== \"undefined\") { JOURNEY.length = 0; e.JOURNEY.forEach(function (x) { JOURNEY.push(x); }); }\n  if (e.PHOTO && typeof PROFILE !== \"undefined\") PROFILE.photo = e.PHOTO;\n  if (e.GALLERY && e.GALLERY.length && typeof GALLERY_CATEGORIES !== \"undefined\") { GALLERY_CATEGORIES.length = 0; e.GALLERY.forEach(function (x) { GALLERY_CATEGORIES.push(x); }); }\n};\n";
    var content = "/* data4.js - editor overrides (auto-generated). DO NOT EDIT MANUALLY. */\nwindow.EDITS = " + JSON.stringify(edits, null, 2) + ";\n" + applyFn + "SM_APPLY(EDITS);\n";
    var b64 = btoa(unescape(encodeURIComponent(content)));
    SM.msg("Submitting...");
    fetch("https://api.github.com/repos/sahilmaurya007/sahil-maurya-website/contents/data4.js?ref=draft", {
      headers: { "Authorization": "token " + token, "Accept": "application/vnd.github+json" }
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, sha: j && j.sha }; }); })
      .then(function (res) {
        var body = { message: "Website editor updates", content: b64, branch: "draft" };
        if (res.ok && res.sha) body.sha = res.sha;
        return fetch("https://api.github.com/repos/sahilmaurya007/sahil-maurya-website/contents/data4.js", {
          method: "PUT",
          headers: { "Authorization": "token " + token, "Accept": "application/vnd.github+json", "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
      })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j.content) {
          SM.msg("Submitted! ", false);
          var a = document.createElement("a");
          a.href = "https://github.com/sahilmaurya007/sahil-maurya-website/compare/main...draft?expand=1";
          a.target = "_blank"; a.rel = "noopener"; a.textContent = "Review & Approve";
          a.style.cssText = "color:#16a34a;font-weight:700;margin-left:4px";
          SM.ed.querySelector(".ed-msg").appendChild(a);
        } else { SM.msg((j.message || "Submit failed"), true); }
      })
      .catch(function () { SM.msg("Network error", true); });
  };
  SM.ed.querySelector(".ed-preview").addEventListener("click", function () { SM.preview(); });
  SM.ed.querySelector(".ed-save").addEventListener("click", function () { SM.save(); });
})();
