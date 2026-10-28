/* app9.js - visitor counter + IP panel (AES session aware). DO NOT EDIT. */
(function () {
  "use strict";
  var pad = function (n) { return String(Math.max(1, parseInt(n, 10) || 1)).padStart(6, "0"); };
  var setNum = function (n) {
    var a = document.getElementById("visitNum"); if (a) a.textContent = pad(n);
    var b = document.getElementById("visitNum2"); if (b) b.textContent = pad(n);
  };
  /* sirf GLOBAL count - local 'sm-visits' (001 reset bug) hata diya */
  fetch("https://countapi.mileshilliard.com/api/v1/hit/sm-sahil-global-visits").then(function (r) { return r.json(); }).then(function (d) {
    if (d && typeof d.value === "number") setNum(d.value);
  }).catch(function () {
    fetch("https://countapi.mileshilliard.com/api/v1/get/sm-sahil-global-visits").then(function (r) { return r.json(); }).then(function (d) {
      if (d && typeof d.value === "number") setNum(d.value);
    }).catch(function () {});
  });
  var chip = document.querySelector(".visit-chip");
  if (chip) chip.title = "Total visits (global)";
})();
