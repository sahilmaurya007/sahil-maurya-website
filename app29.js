/* app29.js - "Merge All to Live": token verify + 1-click generate link fix ke saath. DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM || !SM.ed) return;
  var foot = SM.ed.querySelector(".ed-foot");
  if (!foot || document.getElementById("ed-merge-all")) return;
  var TOKEN_URL = "https://github.com/settings/tokens/new?scopes=repo&description=Sahil%20Website%20Editor";
  var getTok = function () { try { return localStorage.getItem("sm-token") || ""; } catch (e) { return ""; } };
  var tokenLink = function (why) {
    SM.msg("", false);
    var m = SM.ed.querySelector(".ed-msg");
    m.innerHTML = "";
    var b = document.createElement("span");
    b.style.cssText = "color:#dc2626;font-size:.8rem";
    b.textContent = why || "GitHub token chahiye";
    m.appendChild(b);
    var a = document.createElement("a");
    a.href = TOKEN_URL;
    a.target = "_blank"; a.rel = "noopener";
    a.textContent = "→ 1-click generate";
    a.style.cssText = "color:var(--accent);font-weight:700;margin-left:8px;font-size:.8rem";
    m.appendChild(a);
  };
  var btn = document.createElement("button");
  btn.type = "button";
  btn.id = "ed-merge-all";
  btn.textContent = "Merge All to Live";
  btn.title = "Draft par jitne changes hain - sab ek saath live karo";
  btn.style.cssText = "padding:9px 14px;border:none;border-radius:10px;background:linear-gradient(115deg,#16a34a,#0ea5e9);color:#fff;font-weight:700;font-size:.8rem;cursor:pointer";
  foot.appendChild(btn);
  btn.addEventListener("click", function () {
    if (!confirm("Draft ke saare changes (sab sections) ek saath main me merge ho jayenge - live website. Continue?")) return;
    var token = getTok();
    if (!token) { tokenLink("Token missing - generate karo"); return; }
    btn.disabled = true; btn.textContent = "Merging...";
    fetch("https://api.github.com/user", { headers: { "Authorization": "token " + token, "Accept": "application/vnd.github+json" } }).then(function (ru) {
      if (!ru.ok) { btn.disabled = false; btn.textContent = "Merge All to Live"; tokenLink("Token invalid/expired"); return null; }
      return fetch("https://api.github.com/repos/sahilmaurya007/sahil-maurya-website/compare/main...draft", {
        headers: { "Authorization": "token " + token, "Accept": "application/vnd.github+json" }
      }).then(function (r) { return r.json(); }).then(function (cmp) {
        if (!cmp || cmp.status !== "diverged" || !cmp.ahead_by) {
          btn.disabled = false; btn.textContent = "Merge All to Live";
          SM.msg(cmp && cmp.status === "identical" ? "Koi naya change nahi - already live." : "Draft me kuch naya change nahi mila.");
          return null;
        }
        var n = cmp.commits ? cmp.commits.length : cmp.ahead_by;
        return fetch("https://api.github.com/repos/sahilmaurya007/sahil-maurya-website/pulls", {
          method: "POST",
          headers: { "Authorization": "token " + token, "Accept": "application/vnd.github+json", "Content-Type": "application/json" },
          body: JSON.stringify({ title: "Live update: " + n + " changes", head: "draft", base: "main", body: "Editor se batch merge - saare sections ke changes ek saath (auto)." })
        }).then(function (r) { return r.json(); }).then(function (pr) {
          if (!pr.number) { btn.disabled = false; btn.textContent = "Merge All to Live"; SM.msg((pr.errors && pr.errors[0] && pr.errors[0].message) || pr.message || "PR create fail"); return null; }
          return fetch("https://api.github.com/repos/sahilmaurya007/sahil-maurya-website/pulls/" + pr.number + "/merge", {
            method: "PUT",
            headers: { "Authorization": "token " + token, "Accept": "application/vnd.github+json", "Content-Type": "application/json" },
            body: JSON.stringify({ merge_method: "merge" })
          }).then(function (r2) { return r2.json(); }).then(function (mg) {
            btn.disabled = false; btn.textContent = "Merge All to Live";
            if (mg && mg.merged) SM.msg("LIVE ho gaya! " + n + " changes merge. Ctrl+Shift+R karo.");
            else SM.msg((mg && mg.message) || "Merge pending - GitHub PR #" + pr.number + " approve karo.", true);
          });
        });
      });
    }).catch(function () {
      btn.disabled = false; btn.textContent = "Merge All to Live";
      SM.msg("Network error - dobara try karo.", true);
    });
  });
})();
