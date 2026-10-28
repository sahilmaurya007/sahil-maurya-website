/* app31.js - IP/device log (private) + display sync. Hit ab app9 karta hai (duplicate count fix). DO NOT EDIT. */
(function () {
  "use strict";
  var setNum = function (n) {
    var a = document.getElementById("visitNum"), b = document.getElementById("visitNum2");
    if (a) a.textContent = String(n).padStart(6, "0");
    if (b) b.textContent = String(n).padStart(6, "0");
  };
  /* device + browser + country + city log (private, sirf owner ko) */
  var dev = function () {
    var ua = navigator.userAgent || "";
    var os = /Windows/i.test(ua) ? "Windows" : /Android/i.test(ua) ? "Android" : /iPhone|iPad/i.test(ua) ? "iOS" : /Mac/i.test(ua) ? "Mac" : /Linux/i.test(ua) ? "Linux" : "Unknown OS";
    var br = /Edg\//i.test(ua) ? "Edge" : /OPR|Opera/i.test(ua) ? "Opera" : /Chrome/i.test(ua) ? "Chrome" : /Firefox/i.test(ua) ? "Firefox" : /Safari/i.test(ua) ? "Safari" : "Unknown";
    var type = /Mobi|Android|iPhone/i.test(ua) ? "Mobile" : "Desktop";
    return type + " - " + br + " - " + os;
  };
  var push = function (entry) {
    var log = []; try { log = JSON.parse(localStorage.getItem("sm-iplist") || "[]"); } catch (e) {}
    log.push(entry);
    if (log.length > 300) log = log.slice(-300);
    try { localStorage.setItem("sm-iplist", JSON.stringify(log)); } catch (e) {}
  };
  var logged = false;
  try { logged = sessionStorage.getItem("sm-logged-visit") === "1"; } catch (e) {}
  if (!logged) {
    try { sessionStorage.setItem("sm-logged-visit", "1"); } catch (e) {}
    fetch("https://ipapi.co/json/").then(function (r) { return r.json(); }).then(function (d) {
      push({ ip: d.ip || "-", t: new Date().toISOString().slice(0, 16).replace("T", " "), dev: dev(), city: d.city || d.region || "", country: d.country_name || d.country || "" });
    }).catch(function () {
      fetch("https://api.ipify.org?format=json").then(function (r) { return r.json(); }).then(function (d) {
        push({ ip: d.ip || "-", t: new Date().toISOString().slice(0, 16).replace("T", " "), dev: dev(), city: "", country: "" });
      }).catch(function () {});
    });
  }
  /* IP panel me full detail rows */
  var richPanel = function () {
    var box = document.querySelector(".ip-panel .ip-list");
    if (!box) return;
    var log = []; try { log = JSON.parse(localStorage.getItem("sm-iplist") || "[]"); } catch (e) {}
    var html = "";
    log.slice().reverse().forEach(function (v) {
      html += "<div class='ip-row' style='display:flex;flex-direction:column;gap:1px'><span><b>" + (v.ip || "-") + "</b> - " + (v.dev || "") + "</span><span class='ip-time'>" + (v.city ? v.city + ", " : "") + (v.country || "") + " - " + (v.t || "") + "</span></div>";
    });
    if (html) box.innerHTML = html;
  };
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList && e.target.classList.contains("ip-fab")) setTimeout(richPanel, 150);
  });
})();
