/* app13.js - Preview DOM refresh fallback. DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  SM.reRender = function () {
    try {
      var ab = document.getElementById("aboutBody");
      if (ab && window.ABOUT) ab.innerHTML = ABOUT.map(function (p) { return "<p>" + p + "</p>"; }).join("");
      var hi = document.getElementById("heroIntro");
      if (hi && window.PROFILE) hi.textContent = PROFILE.intro;
    } catch (e) {}
    try {
      if (window.reRenderNews) window.reRenderNews();
      else { var nl = document.querySelector(".news-list"); if (nl && window.NEWS && nl.parentElement) { nl.dispatchEvent(new Event("click")); } }
    } catch (e) {}
    location.hash = location.hash;
  };
})();
