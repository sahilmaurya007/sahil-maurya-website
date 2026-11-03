/* app14.js - Profile photo + Gallery GUI editor (direct GitHub upload via user token). FAST upload: direct PUT, GET sha only when needed. DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  var REPO_API = "https://api.github.com/repos/sahilmaurya007/sahil-maurya-website/contents/";
  var token = function () { try { return localStorage.getItem("sm-token") || ""; } catch (e) { return ""; } };
  var HDRS = function () { return { "Authorization": "token " + token(), "Accept": "application/vnd.github+json" }; };
  var b64file = function (file, cb) {
    /* FAST: readAsDataURL direct base64 deta hai — manual byte-loop ki zarurat nahi */
    var fr = new FileReader();
    fr.onload = function () { cb(String(fr.result).split(",")[1] || ""); };
    fr.readAsDataURL(file);
  };
  /* generic upload: putImage(path, base64, done, fail)
     FAST: pehle seedha PUT (timestamped naye names me ye turant kaam karta hai —
     ek round trip bachta hai). Agar file pehle se exist karti hai (422/409)
     tab hi GET sha karke retry — purane double-round-trip se ~2x faster. */
  SM.putImage = function (path, b64, done, fail, msg) {
    var t = token();
    if (!t) { fail("Pehle GitHub tab me token save karo."); return; }
    if (msg) SM.msg(msg);
    var put = function (sha) {
      var body = { message: "Editor: upload " + path, content: b64, branch: "draft" };
      if (sha) body.sha = sha;
      return fetch(REPO_API + path, {
        method: "PUT",
        headers: { "Authorization": "token " + t, "Accept": "application/vnd.github+json", "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, j: j }; }); });
    };
    put(null).then(function (res) {
      if (res.ok && res.j && res.j.content) { done(res.j.content.path); return; }
      var m = (res.j && res.j.message) || "";
      if (res.status === 422 || res.status === 409 || /sha/i.test(m)) {
        return fetch(REPO_API + path + "?ref=draft", { headers: HDRS() })
          .then(function (r) { return r.json(); })
          .then(function (j) { return put(j && j.sha); })
          .then(function (res2) {
            if (res2.ok && res2.j && res2.j.content) done(res2.j.content.path);
            else fail((res2.j && res2.j.message) || "Upload failed");
          });
      }
      fail(m || "Upload failed");
    }).catch(function () { fail("Network error"); });
  };
  SM.filePick = function (label, cb) {
    var inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*";
    var w = document.createElement("div"); w.className = "ed-f";
    w.innerHTML = "<label>" + label + "</label>";
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "ed-add"; btn.textContent = "Choose photo";
    btn.addEventListener("click", function () { inp.click(); });
    var hint = document.createElement("div"); hint.style.cssText = "font-size:.72rem;color:var(--muted)";
    inp.addEventListener("change", function () {
      if (!inp.files || !inp.files[0]) return;
      hint.textContent = "Selected: " + inp.files[0].name + " (" + Math.round(inp.files[0].size / 1024) + " KB)";
      cb(inp.files[0]);
    });
    w.appendChild(btn); w.appendChild(inp); w.appendChild(hint);
    inp.style.display = "none";
    return w;
  };
})();
