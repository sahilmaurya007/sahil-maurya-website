/* app6.js — pencil editor (owner login), lightbox, Tier 1 badge, Connect rename. DO NOT EDIT. */
(function () {
  "use strict";
  var USER_ID = "sahil.maurya21@iiitg.ac.in";
  var PASS_HASH = 46190;
  var hp = function (s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };
  var REPO = "https://github.com/sahilmaurya007/sahil-maurya-website";
  var BR = "draft";
  var LINKS = [
    ["🖼️", "Profile photo update", "image folder — SAHIL.jpg", REPO + "/upload/" + BR + "/image"],
    ["📰", "News / Conference", "data3.js", REPO + "/edit/" + BR + "/data3.js"],
    ["🖼", "Gallery photo + description", "data3.js", REPO + "/edit/" + BR + "/data3.js"],
    ["🧭", "Journey / Timeline", "data3.js", REPO + "/edit/" + BR + "/data3.js"],
    ["📝", "Biography / About", "data.js", REPO + "/edit/" + BR + "/data.js"],
    ["📄", "Papers / Publications", "data.js", REPO + "/edit/" + BR + "/data.js"],
    ["🎓", "Education / Awards", "data.js", REPO + "/edit/" + BR + "/data.js"],
    ["🛠️", "Skills / Coursework", "data2.js", REPO + "/edit/" + BR + "/data2.js"],
    ["⬆️", "Photo upload", "image folder", REPO + "/upload/" + BR + "/image"],
    ["🔔", "Review and approve", "merge PR = live", REPO + "/compare/main..." + BR + "?expand=1"]
  ];
  var fab = document.createElement("button");
  fab.className = "edit-fab";
  fab.title = "Edit (owner only)";
  fab.textContent = "✏️";
  document.body.appendChild(fab);
  var menu = document.createElement("div");
  menu.className = "edit-fab-menu";
  var mh = "";
  LINKS.forEach(function (m) {
    mh += "<a href='" + m[3] + "' target='_blank' rel='noopener'><span class='ic'>" + m[0] + "</span><span><strong>" + m[1] + "</strong><br><span class='sub'>" + m[2] + "</span></span></a>";
  });
  menu.innerHTML = mh;
  document.body.appendChild(menu);
  var mask = document.createElement("div");
  mask.className = "login-mask";
  mask.innerHTML = "<div class='login-card'><h3>✏️ Owner login</h3><p>Sirf website owner ke liye.</p><form id='loginForm'><label for='lid'>ID</label><input id='lid' type='text' autocomplete='off' required><label for='lpass'>Password</label><input id='lpass' type='password' autocomplete='off' required><div class='login-err' id='loginErr'></div><button type='submit'>Login</button></form></div>";
  document.body.appendChild(mask);
  var isAuthed = function () { try { return sessionStorage.getItem("sm-edit-ok") === "1"; } catch (e) { return false; } };
  fab.addEventListener("click", function () {
    if (isAuthed()) menu.classList.toggle("open");
    else mask.classList.add("open");
  });
  document.addEventListener("click", function (e) { if (!menu.contains(e.target) && e.target !== fab) menu.classList.remove("open"); });
  mask.addEventListener("click", function (e) { if (e.target === mask) mask.classList.remove("open"); });
  mask.querySelector("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var id = document.getElementById("lid").value.trim().toLowerCase();
    var pw = document.getElementById("lpass").value;
    if (id === USER_ID && hp(pw) === PASS_HASH) {
      try { sessionStorage.setItem("sm-edit-ok", "1"); } catch (err) {}
      mask.classList.remove("open");
      menu.classList.add("open");
    } else {
      document.getElementById("loginErr").textContent = "Galat ID ya password.";
    }
  });

  /* ---- photo lightbox: kisi bhi photo par click = full screen ---- */
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

  /* ---- Tier 1 bold badge ---- */
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
