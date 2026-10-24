/* app27.js - cache-buster + upload watchdog: purani JS cache ki wajah se bugs fix nahi hote - ye sab scripts ko fresh force-load karta hai. DO NOT EDIT. */
(function () {
  "use strict";
  /* STEP 1: app4.js ko fresh reload karo (agar cached stale version hai) */
  var scripts = document.querySelectorAll("script[src^='app']");
  var has24 = false, has27 = false;
  scripts.forEach(function (s) { if (s.src.indexOf("app24.js") >= 0) has24 = true; if (s.src.indexOf("app27.js") >= 0) has27 = true; });
  if (!has27) return;
  /* STEP 2: agar app24 load hua, to auto-save ready hai. Nahi to app4 ke loader ko version-query ke saath re-run karo (ek hi baar, loop se bachne ke liye) */
  if (!has24 && !window.__smCacheBusted) {
    window.__smCacheBusted = true;
    ["app16.js", "app17.js", "app24.js", "app25.js"].forEach(function (src) {
      var s = document.createElement("script");
      s.src = src + "?v=" + Date.now();
      document.body.appendChild(s);
    });
  }
  /* STEP 3: watchdog - agar 'Processing + uploading...' 20 sec se zyada ruka, to user ko sahi message do */
  var lastMsg = "";
  setInterval(function () {
    var SM = window.SM_EDITOR;
    if (!SM || !SM.ed) return;
    var m = SM.ed.querySelector(".ed-msg");
    var t = m ? (m.textContent || "") : "";
    if (t === lastMsg && /Processing|Uploading|Submitting/i.test(t)) {
      if (!window.__smUploadStuckWarned) {
        window.__smUploadStuckWarned = true;
        SM.msg("Upload slow/stuck lag raha hai - ye bug fixed version me theek hai. Hard refresh (Ctrl+Shift+R) karke dobara try karo.", true);
      }
    } else if (t !== lastMsg) {
      window.__smUploadStuckWarned = false;
    }
    lastMsg = t;
  }, 20000);
})();
