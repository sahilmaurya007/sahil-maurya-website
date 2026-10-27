/* app18.js - SM.save override: token verify + 1-click generate link. DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM || !SM.putData || !SM.buildData4) return;
  var TOKEN_URL = "https://github.com/settings/tokens/new?scopes=repo&description=Sahil%20Website%20Editor";
  var getTok = function () { try { return localStorage.getItem("sm-token") || ""; } catch (e) { return ""; } };
  var verifyTok = function (cb) {
    var t = getTok();
    if (!t) { cb(false); return; }
    fetch("https://api.github.com/user", { headers: { "Authorization": "token " + t, "Accept": "application/vnd.github+json" } })
      .then(function (r) { cb(r.ok); })
      .catch(function () { cb(false); });
  };
  SM.save = function () {
    verifyTok(function (ok) {
      var token = getTok();
      if (!ok) {
        SM.msg("", false);
        var m = SM.ed.querySelector(".ed-msg");
        m.innerHTML = "";
        var b = document.createElement("span");
        b.style.cssText = "color:#dc2626;font-size:.8rem";
        b.textContent = "GitHub token chahiye (invalid ya missing)";
        m.appendChild(b);
        var a = document.createElement("a");
        a.href = TOKEN_URL;
        a.target = "_blank"; a.rel = "noopener";
        a.textContent = "→ 1-click generate";
        a.style.cssText = "color:var(--accent);font-weight:700;margin-left:8px;font-size:.8rem";
        m.appendChild(a);
        return;
      }
      SM.msg("Submitting...");
      SM.putData(SM.buildData4(), function (ok2, err) {
        if (ok2) {
          SM.msg("Submitted! ", false);
          var a = document.createElement("a");
          a.href = "https://github.com/sahilmaurya007/sahil-maurya-website/compare/main...draft?expand=1";
          a.target = "_blank"; a.rel = "noopener"; a.textContent = "Review & Approve";
          a.style.cssText = "color:#16a34a;font-weight:700;margin-left:4px";
          SM.ed.querySelector(".ed-msg").appendChild(a);
        } else { SM.msg(err, true); }
      });
    });
  };
})();
