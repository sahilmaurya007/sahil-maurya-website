/* app38.js - login eye icon: SIMPLE small BLACK SVG, always right-side. DO NOT EDIT. */
(function () {
  "use strict";
  var css = document.createElement("style");
  css.textContent = ".sm-pass-wrap{position:relative;display:block;width:100%}.sm-pass-wrap input{width:100%;padding-right:38px!important;box-sizing:border-box}.sm-eye{position:absolute!important;right:8px!important;left:auto!important;top:50%!important;transform:translateY(-50%)!important;width:24px;height:24px;display:flex;align-items:center;justify-content:center;background:transparent;border:none;cursor:pointer;padding:0}.sm-eye svg{width:16px;height:16px;display:block}";
  document.head.appendChild(css);
  var SVG_EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="2.5"/></svg>';
  var SVG_EYE_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="2.5"/><line x1="3" y1="3" x2="21" y2="21"/></svg>';
  var patch = function () {
    document.querySelectorAll("#lpass").forEach(function (inp) {
      var wrap = inp.parentElement;
      if (!wrap) return;
      if (wrap.querySelector(".sm-eye")) return;
      var oldBtn = wrap.querySelector("button");
      if (oldBtn) oldBtn.remove();
      wrap.classList.add("sm-pass-wrap");
      var eye = document.createElement("button");
      eye.type = "button";
      eye.className = "sm-eye";
      eye.setAttribute("aria-label", "Show password");
      eye.innerHTML = SVG_EYE;
      eye.addEventListener("click", function () {
        var show = inp.type === "password";
        inp.type = show ? "text" : "password";
        eye.innerHTML = show ? SVG_EYE_OFF : SVG_EYE;
        eye.setAttribute("aria-label", show ? "Hide password" : "Show password");
      });
      wrap.appendChild(eye);
    });
  };
  patch();
  setInterval(function () {
    if (document.querySelector(".login-mask.open") && !document.querySelector(".sm-eye")) patch();
  }, 800);
})();
