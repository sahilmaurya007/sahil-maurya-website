/* app16.js - GitHub API self-healing (draft branch auto-create). DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  var API = "https://api.github.com/repos/sahilmaurya007/sahil-maurya-website";
  var BR = "draft";
  function tok() { try { return localStorage.getItem("sm-token") || ""; } catch (e) { return ""; } }
  function api(p, o) {
    var t = tok();
    var h = { "Accept": "application/vnd.github+json" };
    if (t) h["Authorization"] = "token " + t;
    if (o && o.body) h["Content-Type"] = "application/json";
    return fetch(API + p, { headers: h, method: (o && o.method) || "GET", body: o && o.body ? JSON.stringify(o.body) : undefined });
  }
  SM.ensureBranch = function () {
    return api("/branches/" + BR).then(function (r) {
      if (r.ok) return true;
      return api("/git/ref/heads/main").then(function (r2) { return r2.json(); }).then(function (j) {
        if (!j.object) return false;
        return api("/git/refs", { method: "POST", body: { ref: "refs/heads/" + BR, sha: j.object.sha } }).then(function (r3) { return r3.ok; });
      });
    }).catch(function () { return false; });
  };
  SM.putFileRaw = function (path, b64, msg) {
    return SM.ensureBranch().then(function (okb) {
      if (!okb) return { ok: false, message: "GitHub tab me token save karo." };
      return api("/contents/" + path + "?ref=" + BR).then(function (r) {
        return r.json().then(function (j) { return { ok: r.ok, sha: r.ok ? j.sha : null }; });
      }).then(function (res) {
        var body = { message: msg, content: b64, branch: BR };
        if (res.ok && res.sha) body.sha = res.sha;
        return api("/contents/" + path, { method: "PUT", body: body }).then(function (r2) {
          return r2.json().then(function (j2) { return { ok: r2.ok, message: r2.ok ? "" : (j2.message || "Upload failed") }; });
        });
      });
    });
  };
  SM.putImage = function (path, b64, done, fail, msg) {
    if (!tok()) { fail("Pehle GitHub tab me token save karo."); return; }
    if (msg) SM.msg(msg);
    SM.putFileRaw(path, b64, "Editor: upload " + path).then(function (res) {
      if (res.ok) done(); else fail(res.message);
    }).catch(function () { fail("Network error"); });
  };
  SM.putData = function (content, cb) {
    var b64 = btoa(unescape(encodeURIComponent(content)));
    SM.putFileRaw("data4.js", b64, "Website editor updates").then(function (res) {
      cb(res.ok, res.ok ? "" : (res.message || "Save failed"));
    }).catch(function () { cb(false, "Network error"); });
  };
})();
