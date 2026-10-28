/* app48.js - VISITOR DISPLAY FIX: khud visitNum elements create karta hai (nav chip + bottom-left box) - global count 677+ continue. DO NOT EDIT. */
(function () {
  "use strict";
  if (window.SM_VISITFIX_DONE) return;
  window.SM_VISITFIX_DONE = true;
  var pad = function (n) { return String(Math.max(1, parseInt(n, 10) || 1)).padStart(6, "0"); };
  var setNum = function (n) {
    var a = document.getElementById("visitNum"); if (a) a.textContent = pad(n);
    var b = document.getElementById("visitNum2"); if (b) b.textContent = pad(n);
  };
  /* chip + box create (agar HTML me nahi hain - root cause: koi script banati hi nahi thi) */
  var build = function () {
    if (document.getElementById("visitNum") && document.getElementById("visitNum2")) return true;
    var nav = document.querySelector("nav.nav, .nav") || document.querySelector("header");
    if (nav && !document.getElementById("visitNum")) {
      var chip = document.createElement("span");
      chip.className = "visit-chip";
      chip.title = "Total visits (global)";
      chip.innerHTML = "👀 <b id='visitNum'>000000</b>";
      var themeBtn = nav.querySelector("#themeBtn");
      if (themeBtn) themeBtn.parentNode.insertBefore(chip, themeBtn);
      else nav.appendChild(chip);
    }
    if (!document.getElementById("visitNum2")) {
      var foot = document.createElement("div");
      foot.className = "visit-foot";
      foot.innerHTML = "<span class='vf-ic'>👁️</span><span>Visitors:</span><b id='visitNum2'>000000</b>";
      document.body.appendChild(foot);
    }
    return true;
  };
  var start = function () {
    build();
    /* global count - jitne log ab tak aaye sab add (677+), naya browser bhi yahi dikhata hai */
    fetch("https://countapi.mileshilliard.com/api/v1/hit/sm-sahil-global-visits").then(function (r) { return r.json(); }).then(function (d) {
      if (d && typeof d.value === "number") setNum(d.value);
    }).catch(function () {
      fetch("https://countapi.mileshilliard.com/api/v1/get/sm-sahil-global-visits").then(function (r) { return r.json(); }).then(function (d) {
        if (d && typeof d.value === "number") setNum(d.value);
      }).catch(function () {});
    });
  };
  /* nav late render ho sakta hai - wait karo */
  var tries = 0;
  var iv = setInterval(function () {
    tries++;
    if (document.querySelector("nav.nav, .nav") || tries > 25) {
      clearInterval(iv);
      start();
    }
  }, 400);
  setTimeout(start, 3000);
  /* app9/app31 ke setNum bhi same elements par kaam karenge */
})();
