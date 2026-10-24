/* app7.js - pencil + login gate (ID/password). Editor GUI app11 me hai. DO NOT EDIT. */
(function () {
  "use strict";
  var USER_ID = "sahil.maurya21@iiitg.ac.in";
  var PASS_HASH = 46190;
  var hp = function (s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };
  try { sessionStorage.removeItem("sm-edit-ok"); } catch (e) {}
  var loggedIn = false;
  var SM = { loggedIn: false, open: null };
  window.SM_EDITOR = SM;

  var fab = document.createElement("button");
  fab.className = "edit-fab";
  fab.title = "Edit (login required)";
  fab.textContent = "\u270F";
  document.body.appendChild(fab);

  var mask = document.createElement("div");
  mask.className = "login-mask";
  mask.innerHTML = "<div class='login-card'><h3>Login</h3><p>Enter your credentials to continue.</p><form id='loginForm'><label for='lid'>ID</label><input id='lid' type='text' autocomplete='off' required><label for='lpass'>Password</label><input id='lpass' type='password' autocomplete='off' required><div class='login-err' id='loginErr'></div><button type='submit'>Login</button></form></div>";
  document.body.appendChild(mask);

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
      loggedIn = true; SM.loggedIn = true;
      try { sessionStorage.setItem("sm-edit-ok", "1"); } catch (err) {}
      mask.classList.remove("open");
      document.getElementById("lid").value = "";
      document.getElementById("lpass").value = "";
      if (SM.open) SM.open();
    } else {
      document.getElementById("loginErr").textContent = "Incorrect ID or password.";
    }
  });
  SM.setLoggedOut = function () { loggedIn = false; SM.loggedIn = false; try { sessionStorage.removeItem("sm-edit-ok"); } catch (e) {} };
})();
