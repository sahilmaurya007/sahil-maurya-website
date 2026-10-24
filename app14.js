/* app14.js - Profile photo + Gallery GUI editor (direct GitHub upload via user token). DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  var REPO_API = "https://api.github.com/repos/sahilmaurya007/sahil-maurya-website/contents/";
  var token = function () { try { return localStorage.getItem("sm-token") || ""; } catch (e) { return ""; } };
  var b64file = function (file, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      var bytes = new Uint8Array(fr.result);
      var s = "";
      var CH = 8192;
      for (var i = 0; i < bytes.length; i += CH) s += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
      cb(btoa(s));
    };
    fr.readAsArrayBuffer(file);
  };
  /* generic upload: putImage(path, base64, done, fail) */
  SM.putImage = function (path, b64, done, fail, msg) {
    var t = token();
    if (!t) { fail("Pehle GitHub tab me token save karo."); return; }
    if (msg) SM.msg(msg);
    fetch(REPO_API + path + "?ref=draft", {
      headers: { "Authorization": "token " + t, "Accept": "application/vnd.github+json" }
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, sha: j && j.sha }; }); })
      .then(function (res) {
        var body = { message: "Editor: upload " + path, content: b64, branch: "draft" };
        if (res.ok && res.sha) body.sha = res.sha;
        return fetch(REPO_API + path, {
          method: "PUT",
          headers: { "Authorization": "token " + t, "Accept": "application/vnd.github+json", "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
      })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (j.content) done(j.content.path); else fail(j.message || "Upload failed"); })
      .catch(function () { fail("Network error"); });
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
