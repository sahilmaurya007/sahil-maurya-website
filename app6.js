/* app6.js - pencil editor with MANDATORY login every time, in-website editing, lightbox. DO NOT EDIT. */
(function () {
  "use strict";
  var USER_ID = "sahil.maurya21@iiitg.ac.in";
  var PASS_HASH = 46190;
  var hp = function (s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };
  var REPO = "https://github.com/sahilmaurya007/sahil-maurya-website";
  var BR = "draft";

  /* har page-load par login session reset — hamesha pehle ID/password aayega */
  try { sessionStorage.removeItem("sm-edit-ok"); } catch (e) {}
  var loggedIn = false;

  var SECTIONS = [
    { id: "profile", ic: "\uD83D\uDC64", label: "Profile / Bio", get: function () { return typeof ABOUT !== "undefined" ? ABOUT.join("\n\n") : ""; }, apply: function (t) { ABOUT.length = 0; t.split(/\n{2,}/).forEach(function (p) { if (p.trim()) ABOUT.push(p.trim()); }); } },
    { id: "intro", ic: "\u2728", label: "Hero intro", get: function () { return PROFILE.intro; }, apply: function (t) { PROFILE.intro = t; } },
    { id: "news", ic: "\uD83D\uDCF0", label: "News / Conference", get: function () { return NEWS.map(function (n) { return n.type + " | " + n.text + " | " + (n.link || "") + " | " + (n.date || "") + " | " + (n.photo || ""); }).join("\n"); }, apply: function (t) { var arr = []; t.split(/\n/).forEach(function (line) { var p = line.split("|").map(function (x) { return x.trim(); }); if (p[1]) arr.push({ type: p[0] || "Update", text: p[1], link: p[2] || "", date: p[3] || "", photo: p[4] || "" }); }); NEWS.length = 0; arr.forEach(function (x) { NEWS.push(x); }); } },
    { id: "pubs", ic: "\uD83D\uDCC4", label: "Papers / Publications", get: function () { return PUBLICATIONS.map(function (p) { return p.title + " | " + p.authors + " | " + p.venue + " | " + p.year + " | " + (p.note || "") + " | " + (p.link || ""); }).join("\n"); }, apply: function (t) { var arr = []; t.split(/\n/).forEach(function (line) { var p = line.split("|").map(function (x) { return x.trim(); }); if (p[0]) arr.push({ title: p[0], authors: p[1] || "", venue: p[2] || "", year: p[3] || "", type: "Conference Paper", doi: "", link: p[5] || "", pdf: "", note: p[4] || "", tags: [] }); }); PUBLICATIONS.length = 0; arr.forEach(function (x) { PUBLICATIONS.push(x); }); } },
    { id: "awards", ic: "\uD83C\uDFC6", label: "Education / Awards", get: function () { return AWARDS.map(function (a) { return a.title + " | " + a.issuer + " | " + (a.date || ""); }).join("\n"); }, apply: function (t) { var arr = []; t.split(/\n/).forEach(function (line) { var p = line.split("|").map(function (x) { return x.trim(); }); if (p[0]) arr.push({ title: p[0], issuer: p[1] || "", date: p[2] || "" }); }); AWARDS.length = 0; arr.forEach(function (x) { AWARDS.push(x); }); } },
    { id: "skills", ic: "\uD83D\uDEE0\uFE0F", label: "Skills / Coursework", get: function () { return SKILLS.map(function (s) { return s.category.replace(/<[^>]+>/g, "") + ": " + s.items.join(", "); }).join("\n"); }, apply: function (t) { var arr = []; t.split(/\n/).forEach(function (line) { var i = line.indexOf(":"); if (i > 0) arr.push({ category: line.slice(0, i).trim(), items: line.slice(i + 1).split(",").map(function (x) { return x.trim(); }).filter(Boolean) }); }); SKILLS.length = 0; arr.forEach(function (x) { SKILLS.push(x); }); } },
    { id: "journey", ic: "\uD83E\uDDED", label: "Journey / Timeline", get: function () { return JOURNEY.map(function (j) { return j.date + " | " + j.title + " | " + (j.desc || "") + " | " + (j.category || ""); }).join("\n"); }, apply: function (t) { var arr = []; t.split(/\n/).forEach(function (line) { var p = line.split("|").map(function (x) { return x.trim(); }); if (p[1]) arr.push({ date: p[0], title: p[1], desc: p[2] || "", section: "education", photo: "", category: p[3] || "Milestone" }); }); JOURNEY.length = 0; arr.forEach(function (x) { JOURNEY.push(x); }); } },
  ];

  var fab = document.createElement("button");
  fab.className = "edit-fab";
  fab.title = "Edit (owner only - login required)";
  fab.textContent = "\u270F\uFE0F";
  document.body.appendChild(fab);

  var mask = document.createElement("div");
  mask.className = "login-mask";
  mask.innerHTML = "<div class='login-card'><h3>\u270F\uFE0F Owner login</h3><p>Sirf website owner ke liye. ID aur password daalo.</p><form id='loginForm'><label for='lid'>ID</label><input id='lid' type='text' autocomplete='off' required><label for='lpass'>Password</label><input id='lpass' type='password' autocomplete='off' required><div class='login-err' id='loginErr'></div><button type='submit'>Login</button></form></div>";
  document.body.appendChild(mask);

  var ed = document.createElement("div");
  ed.className = "ed-modal";
  ed.innerHTML = "<div class='ed-card'>" +
    "<div class='ed-head'><strong>\u270F\uFE0F Edit website</strong><span style='display:flex;gap:8px'><button class='ed-logout' title='Logout'>\uD83D\uDD13 Logout</button><button class='ed-close' aria-label='Close'>\u2715</button></span></div>" +
    "<div class='ed-body'>" +
    "<div class='ed-tabs'></div>" +
    "<textarea class='ed-text' spellcheck='false'></textarea>" +
    "<div class='ed-note'>Format: har line me <b>|</b> se separate values. Preview = turant dekho. Save = approve link.</div>" +
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
    try {
      document.getElementById("aboutBody").innerHTML = ABOUT.map(function (p) { return "<p>" + p + "</p>"; }).join("");
      document.getElementById("heroIntro").textContent = PROFILE.intro;
    } catch (e) {}
  };

  ed.querySelector(".ed-preview").addEventListener("click", function () {
    curSection.apply(textBox.value);
    reRender();
    ed.querySelector(".ed-note").innerHTML = "<b style='color:#16a34a'>Preview applied!</b> Permanently live karne ke liye Save dabao.";
  });
  ed.querySelector(".ed-save").addEventListener("click", function () {
    curSection.apply(textBox.value);
    reRender();
    ed.querySelector(".ed-note").innerHTML = "<b style='color:#16a34a'>Draft ready!</b> Approve link: <a href='" + REPO + "/compare/main..." + BR + "?expand=1' target='_blank' rel='noopener'>Review &amp; Approve</a> - merge karte hi sab ko live dikhega.";
  });
  ed.querySelector(".ed-close").addEventListener("click", function () { ed.classList.remove("open"); });
  ed.querySelector(".ed-logout").addEventListener("click", function () {
    loggedIn = false;
    try { sessionStorage.removeItem("sm-edit-ok"); } catch (err) {}
    ed.classList.remove("open");
  });
  ed.addEventListener("click", function (e) { if (e.target === ed) ed.classList.remove("open"); });

  /* MAIN FIX: pencil click par HAMESHA pehle login aayega, phir editor */
  fab.addEventListener("click", function () {
    if (!loggedIn) { mask.classList.add("open"); return; }
    selectTab(curSection.id);
    ed.classList.add("open");
  });
  mask.addEventListener("click", function (e) { if (e.target === mask) mask.classList.remove("open"); });
  mask.querySelector("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var id = document.getElementById("lid").value.trim().toLowerCase();
    var pw = document.getElementById("lpass").value;
    if (id === USER_ID && hp(pw) === PASS_HASH) {
      loggedIn = true;
      try { sessionStorage.setItem("sm-edit-ok", "1"); } catch (err) {}
      mask.classList.remove("open");
      document.getElementById("lid").value = "";
      document.getElementById("lpass").value = "";
      selectTab(SECTIONS[0].id);
      ed.classList.add("open");
    } else {
      document.getElementById("loginErr").textContent = "Galat ID ya password.";
    }
  });

  var lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = "<button class='lb-close' aria-label='Close'>\u2715</button><button class='lb-prev' aria-label='Previous'>\u2039</button><img src='' alt=''><button class='lb-next' aria-label='Next'>\u203A</button><div class='lb-cap'></div>";
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

  var renameElsewhere = function () {
    document.querySelectorAll(".foot h4, .lab-k, .contact-item .lab").forEach(function (el) {
      if (el.textContent.trim() === "Elsewhere") el.textContent = "Connect";
    });
  };
  renameElsewhere();
  var reObs = new MutationObserver(function () { renameElsewhere(); });
  reObs.observe(document.body, { childList: true, subtree: true });
})();
