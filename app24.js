/* app24.js - Media upload ke baad AUTO-SAVE: data4.js turant commit, links kabhi lost nahi. DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM || !SM.putData) return;
  var oldPI = SM.putImage;
  SM.putImage = function (path, b64, done, fail, msg) {
    oldPI(path, b64, function () {
      done();
      /* upload success ke baad turant data4.js commit karo taaki path save ho jaye */
      SM.autoSave("Auto-save: media upload " + path, function (ok) {
        if (ok) SM.msg("Uploaded + auto-saved to draft. Approve karke live hoga.");
      });
    }, fail, msg);
  };
  SM.autoSave = function (msgLabel, cb) {
    if (!SM.buildData4) { if (cb) cb(false); return; }
    var content = SM.buildData4();
    SM.putData(content, function (ok, err) {
      if (ok && SM.msg) SM.msg(msgLabel || "Auto-saved to draft.");
      if (!ok && SM.msg) SM.msg("Auto-save failed - Save & Submit zaroor dabao!", true);
      if (cb) cb(ok);
    });
  };
})();
