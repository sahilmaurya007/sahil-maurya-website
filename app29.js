/* app29.js - "Merge All to Live": draft ke SAB changes ek hi baar me main me merge. DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM || !SM.ed) return;
  var foot = SM.ed.querySelector(".ed-foot");
  if (!foot || document.getElementById("ed-merge-all")) return;
  var btn = document.createElement("button");
  btn.type = "button";
  btn.id = "ed-merge-all";
  btn.textContent = "Merge All to Live";
  btn.title = "Draft par jitne changes hain - sab ek saath live karo";
  btn.style.cssText = "padding:9px 14px;border:none;border-radius:10px;background:linear-gradient(115deg,#16a34a,#0ea5e9);color:#fff;font-weight:700;font-size:.8rem;cursor:pointer";
  foot.appendChild(btn);
  btn.addEventListener("click", function () {
    if (!confirm("Draft ke saare changes (sab sections) ek saath main me merge ho jayenge - live website. Continue?")) return;
    var token = ""; try { token = localStorage.getItem("sm-token") || ""; } catch (e) {}
    if (!token) { SM.msg("Pehle GitHub tab me token save karo.", true); return; }
    btn.disabled = true; btn.textContent = "Merging...";
    fetch("https://api.github.com/repos/sahilmaurya007/sahil-maurya-website/compare/main...draft", {
      headers: { "Authorization": "token " + token, "Accept": "application/vnd.github+json" }
    }).then(function (r) { return r.json(); }).then(function (cmp) {
      if (!cmp || cmp.status !== "diverged" || !cmp.ahead_by) {
        btn.disabled = false; btn.textContent = "Merge All to Live";
        SM.msg(cmp && cmp.status === "identical" ? "Koi naya change nahi - already live." : "Draft me kuch naya change nahi mila.");
        return;
      }
      var n = cmp.commits ? cmp.commits.length : cmp.ahead_by;
      fetch("https://api.github.com/repos/sahilmaurya007/sahil-maurya-website/pulls", {
        method: "POST",
        headers: { "Authorization": "token " + token, "Accept": "application/vnd.github+json", "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Live update: " + n + " changes", head: "draft", base: "main", body: "Editor se batch merge - saare sections ke changes ek saath (auto)." })
      }).then(function (r) { return r.json(); }).then(function (pr) {
        if (!pr.number) { btn.disabled = false; btn.textContent = "Merge All to Live"; SM.msg((pr.errors && pr.errors[0] && pr.errors[0].message) || pr.message || "PR create fail"); return; }
        fetch("https://api.github.com/repos/sahilmaurya007/sahil-maurya-website/pulls/" + pr.number + "/merge", {
          method: "PUT",
          headers: { "Authorization": "token " + token, "Accept": "application/vnd.github+json", "Content-Type": "application/json" },
          body: JSON.stringify({ merge_method: "merge" })
        }).then(function (r2) { return r2.json(); }).then(function (mg) {
          btn.disabled = false; btn.textContent = "Merge All to Live";
          if (mg && mg.merged) SM.msg("LIVE ho gaya! " + n + " changes merge. Ctrl+Shift+R karo.");
          else SM.msg((mg && mg.message) || "Merge pending - GitHub PR #" + pr.number + " approve karo.", true);
        });
      });
    }).catch(function () {
      btn.disabled = false; btn.textContent = "Merge All to Live";
      SM.msg("Network error - dobara try karo.", true);
    });
  });
})();
