/* app6.js — pencil editor (owner only, login gate, draft-approval). DO NOT EDIT. */
(function () {
  "use strict";
  var USER_ID = "sahil.maurya21@iiitg.ac.in";
  var PASS_HASH = 46190;
  var hp = function (s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };
  var REPO = "https://github.com/sahilmaurya007/sahil-maurya-website";
  var BR = "draft";
  var LINKS = [
    ["📰", "News / Conference", "data3.js", REPO + "/edit/" + BR + "/data3.js"],
    ["🖼️", "Photos / Gallery", "data3.js", REPO + "/edit/" + BR + "/data3.js"],
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
  mask.innerHTML = "<div class='login-card'><h3>✏️ Owner login</h3><p>Sirf website owner ke liye.</p><form id='loginForm'><label for='lid'>ID (email)</label><input id='lid' type='text' autocomplete='off' required><label for='lpass'>Password</label><input id='lpass' type='password' autocomplete='off' required><div class='login-err' id='loginErr'></div><button type='submit'>Login</button></form></div>";
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
})();
