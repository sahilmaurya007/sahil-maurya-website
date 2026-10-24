/* app18.js - SM.save override (uses shared buildData4 from app25). DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM || !SM.putData || !SM.buildData4) return;
  SM.save = function () {
    var token = ""; try { token = localStorage.getItem("sm-token") || ""; } catch (e) {}
    if (!token) { SM.msg("Pehle GitHub tab me token save karo.", true); return; }
    SM.msg("Submitting...");
    SM.putData(SM.buildData4(), function (ok, err) {
      if (ok) {
        SM.msg("Submitted! ", false);
        var a = document.createElement("a");
        a.href = "https://github.com/sahilmaurya007/sahil-maurya-website/compare/main...draft?expand=1";
        a.target = "_blank"; a.rel = "noopener"; a.textContent = "Review & Approve";
        a.style.cssText = "color:#16a34a;font-weight:700;margin-left:4px";
        SM.ed.querySelector(".ed-msg").appendChild(a);
      } else { SM.msg(err, true); }
    });
  };
})();
