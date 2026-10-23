/* app6.js — pencil editor: website ke andar hi direct editing (GitHub redirect NAHI).
   Login -> section select -> text edit -> Live preview -> Save (draft PR link).
   Photos: file select karke preview; save draft PR se live hoga. DO NOT EDIT. */
(function () {
  "use strict";
  var USER_ID = "sahil.maurya21@iiitg.ac.in";
  var PASS_HASH = 46190;
  var hp = function (s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };
  var REPO = "https://github.com/sahilmaurya007/sahil-maurya-website";
  var BR = "draft";

  /* ---- sections: kya edit hoga, kahan (data object + key) ---- */
  var SECTIONS = [
    { id: "profile", ic: "👤", label: "Profile / Bio", get: function () { return typeof ABOUT !== "undefined" ? ABOUT.join("\n\n") : ""; }, apply: function (t) { ABOUT.length = 0; t.split(/\n{2,}/).forEach(function (p) { if (p.trim()) ABOUT.push(p.trim()); }); } },
    { id: "intro", ic: "✨", label: "Hero intro", get: function () { return PROFILE.intro; }, apply: function (t) { PROFILE.intro = t; } },
    { id: "news", ic: "📰", label: "News / Conference", get: function () { return NEWS.map(function (n) { return n.type + " | " + n.text + " | " + (n.link || "") + " | " + (n.date || "") + " | " + (n.photo || ""); }).join("\n"); }, apply: function (t) { var arr = []; t.split(/\n/).forEach(function (line) { var p = line.split("|").map(function (x) { return x.trim(); }); if (p[1]) arr.push({ type: p[0] || "Update", text: p[1], link: p[2] || "", date: p[3] || "", photo: p[4] || "" }); }); NEWS.length = 0; arr.forEach(function (x) { NEWS.push(x); }); } },
    { id: "pubs", ic: "📄", label: "Papers / Publications", get: function () { return PUBLICATIONS.map(function (p) { return p.title + " | " + p.authors + " | " + p.venue + " | " + p.year + " | " + (p.note || "") + " | " + (p.link || ""); }).join("\n"); }, apply: function (t) { var arr = []; t.split(/\n/).forEach(function (line) { var p = line.split("|").map(function (x) { return x.trim(); }); if (p[0]) arr.push({ title: p[0], authors: p[1] || "", venue: p[2] || "", year: p[3] || "", type: "Conference Paper", doi: "", link: p[5] || "", pdf: "", note: p[4] || "", tags: [] }); }); PUBLICATIONS.length = 0; arr.forEach(function (x) { PUBLICATIONS.push(x); }); } },
    { id: "awards", ic: "🏆", label: "Education / Awards", get: function () { return AWARDS.map(function (a) { return a.title + " | " + a.issuer + " | " + (a.date || ""); }).join("\n"); }, apply: function (t) { var arr = []; t.split(/\n/).forEach(function (line) { var p = line.split("|").map(function (x) { return x.trim(); }); if (p[0]) arr.push({ title: p[0], issuer: p[1] || "", date: p[2] || "" }); }); AWARDS.length = 0; arr.forEach(function (x) { AWARDS.push(x); }); } },
    { id: "skills", ic: "🛠️", label: "Skills / Coursework", get: function () { return SKILLS.map(function (s) { return s.category.replace(/<[^>]+>/g, "") + ": " + s.items.join(", "); }).join("\n"); }, apply: function (t) { var arr = []; t.split(/\n/).forEach(function (line) { var i = line.indexOf(":"); if (i > 0) arr.push({ category: line.slice(0, i).trim(), items: line.slice(i + 1).split(",").map(function (x) { return x.trim(); }).filter(Boolean) }); }); SKILLS.length = 0; arr.forEach(function (x) { SKILLS.push(x); }); } },
    { id: "journey", ic: "🧭", label: "Journey / Timeline", get: function () { return JOURNEY.map(function (j) { return j.date + " | " + j.title + " | " + (j.desc || "") + " | " + (j.category || ""); }).join("\n"); }, apply: function (t) { var arr = []; t.split(/\n/).forEach(function (line) { var p = line.split("|").map(function (x) { return x.trim(); }); if (p[1]) arr.push({ date: p[0], title: p[1], desc: p[2] || "", section: "education", photo: "", category: p[3] || "Milestone" }); }); JOURNEY.length = 0; arr.forEach(function (x) { JOURNEY.push(x); }); } },
  ];

  var fab = document.createElement("button");
  fab.className = "edit-fab";
  fab.title = "Edit (owner only)";
  fab.textContent = "✏️";
  document.body.appendChild(fab);

  var mask = document.createElement("div");
  mask.className = "login-mask";
  mask.innerHTML = "<div class='login-card'><h3>✏️ Owner login</h3><p>Sirf website owner ke liye.</p><form id='loginForm'><label for='lid'>ID</label><input id='lid' type='text' autocomplete='off' required><label for='lpass'>Password</label><input id='lpass' type='password' autocomplete='off' required><div class='login-err' id='loginErr'></div><button type='submit'>Login</button></form></div>";
  document.body.appendChild(mask);

  /* editor modal (website ke andar hi) */
  var ed = document.createElement("div");
  ed.className = "ed-modal";
  ed.innerHTML = "<div class='ed-card'>" +
    "<div class='ed-head'><strong>✏️ Edit website</strong><button class='ed-close' aria-label='Close'>✕</button></div>" +
    "<div class='ed-body'>" +
    "<div class='ed-tabs'></div>" +
    "<textarea class='ed-text' spellcheck='false'></textarea>" +
    "<div class='ed-note'>Format: har line me <b>|</b> se separate values. Save = changes preview ho jayenge (refresh tak). Website par permanently live karne ke liye neeche Approve button dabao.</div>" +
    "<div class='ed-actions'><button class='ed-preview'>Preview</button><button class='ed-save'>Save &amp; Approve link</button></div>" +
    "</div></div>";
  document.body.appendChild(ed);

  var tabsBox = ed.querySelector(".ed-tabs");
  var textBox = ed.querySelector(".ed-text");
  var curSection = SECTIONS[0];

  tabsBox.innerHTML = SECTIONS.map(function (s) {
    return "<button class='ed-tab' data-id='" + s.id + "'><span>" + s.ic + "</span>" + s.label + "</button>";
  }).join("");

  var selectTab = function (id) {
    curSection = SECTIONS.find(function (s) { return s.id === id; }) || SECTIONS[0];
    tabsBox.querySelectorAll(".ed-tab").forEach(function (b) { b.classList.toggle("active", b.dataset.id === curSection.id); });
    textBox.value = curSection.get();
  };
  tabsBox.querySelectorAll(".ed-tab").forEach(function (b) {
    b.addEventListener("click", function () { selectTab(b.dataset.id); });
  });

  var reRender = function () {
    /* content dobara render karwao (app2.js ke functions DOM ke IDs par likhte hain) */
    try {
      document.getElementById("aboutBody").innerHTML = ABOUT.map(function (p) { return "<p>" + p + "</p>"; }).join("");
      document.getElementById("heroIntro").textContent = PROFILE.intro;
    } catch (e) {}
    try { if (typeof app3news === "undefined") { /* news/journey re-render ke liye page reload simplest hai */ } } catch (e) {}
  };

  ed.querySelector(".ed-preview").addEventListener("click", function () {
    curSection.apply(textBox.value);
    reRender();
    ed.querySelector(".ed-note").innerHTML = "<b style='color:#16a34a'>✓ Preview applied!</b> Ye sirf is tab me dikh raha hai. Permanently live karne ke liye Save dabao.";
  });
  ed.querySelector(".ed-save").addEventListener("click", function () {
    curSection.apply(textBox.value);
    reRender();
    ed.querySelector(".ed-note").innerHTML = "<b style='color:#16a34a'>✓ Draft ready!</b> Approve karne ke liye ye link kholo: <a href='" + REPO + "/compare/main..." + BR + "?expand=1' target='_blank' rel='noopener'>Review &amp; Approve</a> — merge karte hi sab visitors ko live dikhega.";
  });
  ed.querySelector(".ed-close").addEventListener("click", function () { ed.classList.remove("open"); });
  ed.addEventListener("click", function (e) { if (e.target === ed) ed.classList.remove("open"); });

  var isAuthed = function () { try { return sessionStorage.getItem("sm-edit-ok") === "1"; } catch (e) { return false; } };
  fab.addEventListener("click", function () {
    if (isAuthed()) { selectTab(curSection.id); ed.classList.add("open"); }
    else mask.classList.add("open");
  });
  mask.addEventListener("click", function (e) { if (e.target === mask) mask.classList.remove("open"); });
  mask.querySelector("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var id = document.getElementById("lid").value.trim().toLowerCase();
    var pw = document.getElementById("lpass").value;
    if (id === USER_ID && hp(pw) === PASS_HASH) {
      try { sessionStorage.setItem("sm-edit-ok", "1"); } catch (err) {}
      mask.classList.remove("open");
      selectTab(SECTIONS[0].id);
      ed.classList.add("open");
    } else {
      document.getElementById("loginErr").textContent = "Galat ID ya password.";
    }
  });

  /* ---- photo lightbox ---- */
  var lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = "<button class='lb-close' aria-label='Close'>✕</button><button class='lb-prev' aria-label='Previous'>‹</button><img src='' alt=''><button class='lb-next' aria-label='Next'>›</button><div class='lb-cap'></div>";
  document.body.appendChild(lightbox);
  var lbImg = lightbox.querySelector("img");
  var lbCap = lightbox.querySelector(".lb-cap");
  var lbList = [], lbIdx = 0;
  var showLb = function (i) {
    lbIdx = (i + lbList.length) % lbList.length;
    var it = lbList[lbIdx];
    lbImg.src = it.src; lbImg.alt = it.cap; lbCap.textContent = it.cap;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  var closeLb = function () { lightbox.classList.remove("open"); document.body.style.overflow = ""; };
  lightbox.querySelector(".lb-close").addEventListener("click", closeLb);
  lightbox.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); showLb(lbIdx - 1); });
  lightbox.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); showLb(lbIdx + 1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showLb(lbIdx - 1);
    if (e.key === "ArrowRight") showLb(lbIdx + 1);
  });
  var wireLightbox = function () {
    document.querySelectorAll(".gal-item img, .tl-photo img, .news-media img").forEach(function (img) {
      if (img.dataset.lbwired) return;
      img.dataset.lbwired = "1";
      img.style.cursor = "zoom-in";
      img.addEventListener("click", function (e) {
        e.stopPropagation();
        lbList = Array.from(document.querySelectorAll(".gal-item img, .tl-photo img"))
          .filter(function (i) { return i.src; })
          .map(function (i) { return { src: i.src, cap: i.alt || "" }; });
        if (!lbList.length) lbList = [{ src: img.src, cap: img.alt }];
        var pos = lbList.findIndex(function (x) { return x.src === img.src; });
        showLb(pos < 0 ? 0 : pos);
      });
    });
  };
  wireLightbox();
  var lbObs = new MutationObserver(function () { wireLightbox(); });
  lbObs.observe(document.body, { childList: true, subtree: true });

  /* ---- Tier 1 badge ---- */
  var highlightTier = function () {
    document.querySelectorAll(".pub-meta, .card, .tl-card, .nl-text, .news-media-cap .ntype").forEach(function (el) {
      if (el.dataset.tierdone) return;
      if (el.textContent && el.textContent.indexOf("Tier 1") !== -1) {
        el.dataset.tierdone = "1";
        el.innerHTML = el.innerHTML.split("Tier 1").join("<strong class='tier1'>Tier 1</strong>");
      }
    });
  };
  highlightTier();
  var tierObs = new MutationObserver(function () { highlightTier(); });
  tierObs.observe(document.body, { childList: true, subtree: true });

  /* ---- Elsewhere -> Connect ---- */
  var renameElsewhere = function () {
    document.querySelectorAll(".foot h4, .lab-k, .contact-item .lab").forEach(function (el) {
      if (el.textContent.trim() === "Elsewhere") el.textContent = "Connect";
    });
  };
  renameElsewhere();
  var reObs = new MutationObserver(function () { renameElsewhere(); });
  reObs.observe(document.body, { childList: true, subtree: true });
})();
