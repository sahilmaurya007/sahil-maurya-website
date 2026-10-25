/* app38.js - login eye icon: proper SVG + solid right-side position. DO NOT EDIT. */
(function () {
  "use strict";
  var css = document.createElement("style");
  css.textContent = ".sm-pass-wrap{position:relative;display:block;width:100%}.sm-pass-wrap input{width:100%;padding-right:42px!important;box-sizing:border-box}.sm-eye{position:absolute!important;right:10px!important;left:auto!important;top:50%!important;transform:translateY(-50%)!important;width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:transparent;border:none;cursor:pointer;padding:0;border-radius:6px}.sm-eye:hover{background:var(--soft)}.sm-eye svg{width:20px;height:20px;display:block}";
  document.head.appendChild(css);
  var SVG_EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  var SVG_EYE_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><path d="M14.12 14.12a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
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
