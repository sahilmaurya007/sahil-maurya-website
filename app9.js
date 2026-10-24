/* app9.js - visitor counter: public count + private IP view (login ke baad hi). DO NOT EDIT. */
(function () {
  "use strict";
  /* ---- public visitor count (localStorage-based per browser + shared estimate) ---- */
  var KEY = "sm-visits";
  var myVisits = 1;
  try {
    myVisits = parseInt(localStorage.getItem(KEY) || "0", 10) + 1;
    localStorage.setItem(KEY, String(myVisits));
  } catch (e) {}
  /* total = base + mera count (base live PR merge par update hoga) */
  var BASE = 0;
  var pad = function (n) { return String(n).padStart(6, "0"); };
  var chip = document.createElement("span");
  chip.className = "visit-chip";
  chip.title = "Total visits";
  chip.innerHTML = "\uD83D\uDC41 <b id='visitNum'>" + pad(BASE + myVisits) + "</b>";
  var nav = document.querySelector(".nav");
  if (nav) nav.appendChild(chip);
  var footBox = document.createElement("div");
  footBox.className = "visit-foot";
  footBox.innerHTML = "<span class='vf-ic'>\uD83D\uDC41</span><div><b>Visitors</b><br><span id='visitNum2'>" + pad(BASE + myVisits) + "</span></div>";
  document.body.appendChild(footBox);

  /* ---- private IP log (sirf logged-in editor dekh sakta hai) ---- */
  var ipLog = [];
  try { ipLog = JSON.parse(localStorage.getItem("sm-iplist") || "[]"); } catch (e) { ipLog = []; }
  var logVisit = function (ip) {
    ipLog.push({ ip: ip, t: new Date().toISOString().slice(0, 16).replace("T", " ") });
    if (ipLog.length > 200) ipLog = ipLog.slice(-200);
    try { localStorage.setItem("sm-iplist", JSON.stringify(ipLog)); } catch (e) {}
  };
  /* fetch se public IP nikaalo (free API) */
  try {
    fetch("https://api.ipify.org?format=json").then(function (r) { return r.json(); }).then(function (d) {
      if (d && d.ip) logVisit(d.ip);
    }).catch(function () {});
  } catch (e) {}

  /* IP panel - login ke baad pencil ke paas button banega */
  var panel = document.createElement("div");
  panel.className = "ip-panel";
  panel.innerHTML = "<div class='ip-head'><b>Visitor IPs</b><span class='ip-note'>(private)</span></div><div class='ip-list'></div>";
  document.body.appendChild(panel);
  var renderIps = function () {
    var box = panel.querySelector(".ip-list");
    var html = "";
    ipLog.slice().reverse().forEach(function (v) {
      html += "<div class='ip-row'><span class='ip-addr'>" + v.ip + "</span><span class='ip-time'>" + v.t + "</span></div>";
    });
    if (!html) html = "<div class='ip-row muted'>No visits recorded yet.</div>";
    box.innerHTML = html;
  };
  var ipBtn = document.createElement("button");
  ipBtn.className = "ip-fab";
  ipBtn.title = "Visitor stats (login)";
  ipBtn.textContent = "\uD83D\uDC41";
  ipBtn.style.display = "none";
  document.body.appendChild(ipBtn);
  var SM = window.SM_EDITOR;
  var isAuthed = function () { try { return sessionStorage.getItem("sm-edit-ok") === "1"; } catch (e) { return false; } };
  var sync = function () {
    var on = isAuthed();
    ipBtn.style.display = on ? "grid" : "none";
    if (!on) panel.classList.remove("open");
  };
  setInterval(sync, 1000);
  ipBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    renderIps();
    panel.classList.toggle("open");
  });
  document.addEventListener("click", function (e) {
    if (!panel.contains(e.target) && e.target !== ipBtn) panel.classList.remove("open");
  });
})();
