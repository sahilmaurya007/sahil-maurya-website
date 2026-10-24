/* app7.js - pencil editor: login first, in-website editing. DO NOT EDIT. */
(function () {
  "use strict";
  var USER_ID = "sahil.maurya21@iiitg.ac.in";
  var PASS_HASH = 46190;
  var hp = function (s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };
  var REPO = "https://github.com/sahilmaurya007/sahil-maurya-website";
  var BR = "draft";
  try { sessionStorage.removeItem("sm-edit-ok"); } catch (e) {}
  var loggedIn = false;
  var SM = {};
  window.SM_EDITOR = SM;

  SM.reRender = function () {
    try {
      document.getElementById("aboutBody").innerHTML = ABOUT.map(function (p) { return "<p>" + p + "</p>"; }).join("");
      document.getElementById("heroIntro").textContent = PROFILE.intro;
    } catch (e) {}
  };

  var fab = document.createElement("button");
  fab.className = "edit-fab";
  fab.title = "Edit (login required)";
  fab.textContent = "\u270F";
  document.body.appendChild(fab);

  var mask = document.createElement("div");
  mask.className = "login-mask";
  mask.innerHTML = "<div class='login-card'><h3>Login</h3><p>Enter your credentials to continue.</p><form id='loginForm'><label for='lid'>ID</label><input id='lid' type='text' autocomplete='off' required><label for='lpass'>Password</label><input id='lpass' type='password' autocomplete='off' required><div class='login-err' id='loginErr'></div><button type='submit'>Login</button></form></div>";
  document.body.appendChild(mask);

  var ed = document.createElement("div");
  ed.className = "ed-modal";
  ed.innerHTML = "<div class='ed-card'>" +
    "<div class='ed-head'><strong>Edit website</strong><span style='display:flex;gap:8px'><button class='ed-logout' title='Logout'>Logout</button><button class='ed-close' aria-label='Close'>X</button></span></div>" +
    "<div class='ed-body'>" +
    "<div class='ed-tabs'></div>" +
    "<textarea class='ed-text' spellcheck='false'></textarea>" +
    "<div class='ed-photo-row'><button type='button' class='ed-photo-btn'>Upload profile photo</button><span class='ed-photo-hint'></span></div>" +
    "<div class='ed-note'>Values separated by <b>|</b> on each line. Preview = instant. Save = approval link.</div>" +
    "<div class='ed-actions'><button class='ed-preview'>Preview</button><button class='ed-save'>Save and Approve</button></div>" +
    "</div></div>";
  document.body.appendChild(ed);

  SM.ed = ed;
  SM.textBox = ed.querySelector(".ed-text");
  SM.tabsBox = ed.querySelector(".ed-tabs");
  SM.fab = fab;
  SM.mask = mask;
  SM.REPO = REPO;
  SM.BR = BR;
  SM.setLoggedIn = function (v) { loggedIn = v; };
  SM.isLoggedIn = function () { return loggedIn; };

  ed.querySelector(".ed-photo-btn").addEventListener("click", function () {
    window.open(REPO + "/upload/" + BR + "/image", "_blank", "noopener");
    ed.querySelector(".ed-photo-hint").textContent = "Upload as SAHIL.jpg (same name), then approve.";
  });
  ed.querySelector(".ed-close").addEventListener("click", function () { ed.classList.remove("open"); });
  ed.querySelector(".ed-logout").addEventListener("click", function () {
    loggedIn = false;
    try { sessionStorage.removeItem("sm-edit-ok"); } catch (err) {}
    ed.classList.remove("open");
  });
  ed.addEventListener("click", function (e) { if (e.target === ed) ed.classList.remove("open"); });

  fab.addEventListener("click", function () {
    if (!loggedIn) { mask.classList.add("open"); return; }
    if (SM.open) SM.open();
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
      if (SM.open) SM.open();
    } else {
      document.getElementById("loginErr").textContent = "Incorrect ID or password.";
    }
  });
})();
