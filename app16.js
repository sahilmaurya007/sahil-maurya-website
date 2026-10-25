/* app16.js - GitHub API layer: FAST image upload (direct PUT) + serialized data save. DO NOT EDIT. */
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
  function errText(j, r) {
    if (j && j.message) {
      if (/Bad credentials/i.test(j.message)) return "Token galat/expired - GitHub tab me naya token save karo.";
      if (/Not Found/i.test(j.message)) return "Repo/branch token se accessible nahi - token me repo permission check karo.";
      if (/too large/i.test(j.message)) return "File 25MB se badi hai - photo chhoti karo.";
      return j.message;
    }
    return "Server error (HTTP " + r.status + ")";
  }
  SM.ensureBranch = function () {
    return api("/branches/" + BR).then(function (r) {
      if (r.ok) return true;
      return api("/git/ref/heads/main").then(function (r2) { return r2.json(); }).then(function (j) {
        if (!j.object) return false;
        return api("/git/refs", { method: "POST", body: { ref: "refs/heads/" + BR, sha: j.object.sha } }).then(function (r3) { return r3.ok; });
      });
    }).catch(function (e) { return false; });
  };
  SM.putFileRaw = function (path, b64, msg) {
    return SM.ensureBranch().then(function (okb) {
      if (!okb) return { ok: false, message: "GitHub se connect nahi ho paya - internet/token check karo." };
      return api("/contents/" + path + "?ref=" + BR).then(function (r) {
        return r.json().then(function (j) { return { ok: r.ok, sha: r.ok ? j.sha : null }; });
      }).then(function (res) {
        var body = { message: msg, content: b64, branch: BR };
        if (res.ok && res.sha) body.sha = res.sha;
        return api("/contents/" + path, { method: "PUT", body: body }).then(function (r2) {
          return r2.json().then(function (j2) { return { ok: r2.ok, message: r2.ok ? "" : errText(j2, r2) }; });
        });
      });
    }).catch(function () { return { ok: false, message: "Network error - dobara try karo." }; });
  };
  /* ---- FAST IMAGE UPLOAD: naya file = SEEDHA PUT ----
     Pehle har photo par 3 round-trips hote the (branch check -> sha GET -> PUT) - isi se 4-5 min lagte the.
     Ab: unique filename -> 1 hi API call. 10-20x faster. */
  SM.putImage = function (path, b64, done, fail, msg) {
    if (!tok()) { fail("Pehle GitHub tab me token save karo."); return; }
    if (msg) SM.msg(msg);
    if (window.__smImgUploading) {
      setTimeout(function () { SM.putImage(path, b64, done, fail, msg); }, 700);
      return;
    }
    window.__smImgUploading = true;
    api("/contents/" + path, {
      method: "PUT",
      body: { message: "Editor: upload " + path, content: b64, branch: BR }
    }).then(function (r) {
      window.__smImgUploading = false;
      return r.json().then(function (j) {
        if (r.ok) done();
        else if ((j.message && /already exists/i.test(j.message)) || r.status === 422) {
          var parts = path.split(".");
          var ext = parts.length > 1 ? "." + parts.pop() : "";
          var np = parts.join(".") + "_" + Date.now() + ext;
          SM.putImage(np, b64, function () { done(); }, fail, msg);
        } else fail(errText(j, r));
      });
    }).catch(function () { window.__smImgUploading = false; fail("Network error - dobara try karo."); });
  };
  /* auto-save serialized (race prevention) */
  var autoSaveBusy = false;
  SM.putData = function (content, cb) {
    if (autoSaveBusy) { if (cb) cb(false, "Auto-save busy - thodi der baad try karo."); return; }
    autoSaveBusy = true;
    var b64 = btoa(unescape(encodeURIComponent(content)));
    SM.putFileRaw("data4.js", b64, "Website editor updates").then(function (res) {
      autoSaveBusy = false;
      if (cb) cb(res.ok, res.ok ? "" : (res.message || "Save failed"));
    }).catch(function () { autoSaveBusy = false; if (cb) cb(false, "Network error"); });
  };
})();
