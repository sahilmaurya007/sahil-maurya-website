/* app16.js - GitHub API self-healing layer (hardened). DO NOT EDIT. */
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
          return r2.json().then(function (j2) {
            if (r2.ok) return { ok: true, message: "" };
            if (r2.status === 409 || (j2.message && /does not match/i.test(j2.message))) {
              /* sha mismatch - retry fresh sha ke saath */
              return api("/contents/" + path + "?ref=" + BR).then(function (r3) { return r3.json(); }).then(function (j3) {
                body.sha = j3.sha;
                return api("/contents/" + path, { method: "PUT", body: body }).then(function (r4) {
                  return r4.json().then(function (j4) { return { ok: r4.ok, message: r4.ok ? "" : errText(j4, r4) }; });
                });
              });
            }
            return { ok: false, message: errText(j2, r2) };
          });
        });
      });
    }).catch(function () { return { ok: false, message: "Network error - dobara try karo." }; });
  };
  SM.putImage = function (path, b64, done, fail, msg) {
    if (!tok()) { fail("Pehle GitHub tab me token save karo."); return; }
    if (msg) SM.msg(msg);
    SM.putFileRaw(path, b64, "Editor: upload " + path).then(function (res) {
      if (res.ok) done(); else fail(res.message);
    }).catch(function () { fail("Network error - dobara try karo."); });
  };
  /* auto-save serialized (race prevention): ek waqt me ek hi data4.js commit */
  var autoSaveBusy = false;
  SM.putData = function (content, cb) {
    if (autoSaveBusy) { if (cb) cb(false, "Auto-save busy - 2 second baad try karo."); return; }
    autoSaveBusy = true;
    var b64 = btoa(unescape(encodeURIComponent(content)));
    SM.putFileRaw("data4.js", b64, "Website editor updates").then(function (res) {
      autoSaveBusy = false;
      if (cb) cb(res.ok, res.ok ? "" : (res.message || "Save failed"));
    }).catch(function () { autoSaveBusy = false; if (cb) cb(false, "Network error"); });
  };
})();
