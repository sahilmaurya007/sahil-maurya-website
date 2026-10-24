/* app24.js - auto-save (hardened): media upload ke baad data4.js commit; queued. DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM || !SM.putData || !SM.buildData4) return;
  var pending = 0, timer = null;
  var queueAutoSave = function () {
    pending++;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      timer = null;
      var n = pending; pending = 0;
      SM.putData(SM.buildData4(), function (ok, err) {
        if (ok) SM.msg("Auto-saved to draft (" + n + " upload) - approve karke live karo.");
        else SM.msg("Auto-save failed - Save & Submit zaroor dabao!", true);
      });
    }, 1200);
  };
  var oldPI = SM.putImage;
  SM.putImage = function (path, b64, done, fail, msg) {
    oldPI(path, b64, function () {
      done();
      queueAutoSave();
    }, function (e) {
      if (fail) fail(e);
      SM.msg("Upload failed: " + e, true);
    }, msg);
  };
})();
