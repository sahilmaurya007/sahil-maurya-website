/* app4.js — loader (DO NOT EDIT). Loads app5.js (modes+skins) and app6.js (editor+lightbox). */
(function () {
  "use strict";
  ["app5.js", "app6.js"].forEach(function (src) {
    var s = document.createElement("script");
    s.src = src;
    document.body.appendChild(s);
  });
})();
