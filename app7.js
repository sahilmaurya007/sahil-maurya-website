/* app7.js - pencil + login gate: eye toggle, AES-GCM session (persistent), lockout, theme share. DO NOT EDIT. */
(function () {
  "use strict";
  var USER_ID = "sahil.maurya21@iiitg.ac.in";
  var PASS_HASH = 46190;
  var hp = function (s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };
  var hexB = function (buf) { return Array.from(new Uint8Array(buf)).map(function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); };
  var hexToBytes = function (h) { return new Uint8Array((h.match(/.{2}/g) || []).map(function (x) { return parseInt(x, 16); })); };
  var getSecret = function () {
    try {
      var s = localStorage.getItem("sm-dsec");
      if (s) return s;
      s = hexB(crypto.getRandomValues(new Uint8Array(32)));
      localStorage.setItem("sm-dsec", s);
      return s;
    } catch (e) { return null; }
  };
  var aesKey = function (secret) { return crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "AES-GCM" }, false, ["encrypt", "decrypt"]); };
  var makeToken = function (cb) {
    var secret = getSecret();
    if (!secret || !window.crypto || !crypto.subtle) { cb(null); return; }
    var iv = crypto.getRandomValues(new Uint8Array(12));
    aesKey(secret).then(function (k) { return crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, k, new TextEncoder().encode("AUTHED|" + USER_ID)); })
      .then(function (ct) { cb(hexB(iv) + ":" + hexB(ct)); })
      .catch(function () { cb(null); });
  };
  var verifyToken = function (tok, cb) {
    if (!tok || tok.indexOf(":") < 0) { cb(false); return; }
    var secret = getSecret();
    if (!secret || !window.crypto || !crypto.subtle) { cb(false); return; }
    var p = tok.split(":");
    var iv = hexToBytes(p[0]), ct = hexToBytes(p[1]);
    aesKey(secret).then(function (k) { return crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, k, ct); })
      .then(function (pt) { cb(new TextDecoder().decode(pt) === "AUTHED|" + USER_ID); })
      .catch(function () { cb(false); });
  };

  /* theme share: URL me theme/skin ho to override; fresh visitor default light */
  try {
    var th = (location.hash.match(/theme=([a-z]+)/) || [])[1];
    var sk = (location.hash.match(/skin=([a-z0-9]+)/) || [])[1];
    if (th) { localStorage.setItem("sm-theme", th); document.documentElement.setAttribute("data-theme", th); }
    if (sk) { localStorage.setItem("sm-skin", sk); document.documentElement.setAttribute("data-skin", sk); }
  } catch (e) {}

  var loggedIn = false;
  var SM = { loggedIn: false, open: null };
  window.SM_EDITOR = SM;

  /* page reload par AES token verify - login persist (tab switch bug fix) */
  try {
    var savedTok = localStorage.getItem("sm-auth-2");
    if (savedTok) verifyToken(savedTok, function (ok) { if (ok) { loggedIn = true; SM.loggedIn = true; } });
  } catch (e) {}

  var fab = document.createElement("button");
  fab.className = "edit-fab";
  fab.title = "Edit (login required)";
  fab.textContent = "\u270F";
  document.body.appendChild(fab);

  var mask = document.createElement("div");
  mask.className = "login-mask";
  mask.innerHTML = "<div class='login-card'><h3>Login</h3><p>Enter your credentials to continue.</p><form id='loginForm'><label for='lid'>ID</label><input id='lid' type='text' autocomplete='off' required><label for='lpass'>Password</label><span style='position:relative;display:block'><input id='lpass' type='password' autocomplete='off' required style='width:100%;padding-right:38px'><button type='button' id='lpassEye' aria-label='Show password' style='position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:1rem;padding:4px'>&#128065;</button></span><div class='login-err' id='loginErr'></div><button type='submit'>Login</button></form></div>";
  document.body.appendChild(mask);

  var lpass = mask.querySelector("#lpass"), eye = mask.querySelector("#lpassEye");
  eye.addEventListener("click", function () {
    var show = lpass.type === "password";
    lpass.type = show ? "text" : "password";
    eye.textContent = show ? "\uD83D\uDE48" : "\uD83D\uDC41";
  });

  var fails = 0, lockedUntil = 0;
  fab.addEventListener("click", function () {
    if (!loggedIn) { mask.classList.add("open"); return; }
    if (SM.open) SM.open();
  });
  mask.addEventListener("click", function (e) { if (e.target === mask) mask.classList.remove("open"); });
  mask.querySelector("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var err = document.getElementById("loginErr");
    if (Date.now() < lockedUntil) { err.textContent = "Bahut attempts fail - " + Math.ceil((lockedUntil - Date.now()) / 1000) + "s baad try karo."; return; }
    var id = document.getElementById("lid").value.trim().toLowerCase();
    var pw = lpass.value;
    if (id === USER_ID && hp(pw) === PASS_HASH) {
      loggedIn = true; SM.loggedIn = true;
      makeToken(function (tok) { if (tok) { try { localStorage.setItem("sm-auth-2", tok); } catch (err2) {} } });
      mask.classList.remove("open");
      document.getElementById("lid").value = "";
      lpass.value = "";
      err.textContent = "";
      fails = 0;
      if (SM.open) SM.open();
    } else {
      fails++;
      if (fails >= 5) lockedUntil = Date.now() + 30000;
      err.textContent = "Incorrect ID or password." + (fails >= 5 ? " (30s lock)" : "");
    }
  });
  SM.setLoggedOut = function () {
    loggedIn = false; SM.loggedIn = false;
    try { localStorage.removeItem("sm-auth-2"); } catch (e) {}
  };
})();
