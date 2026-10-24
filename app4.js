/* app4.js - loader (DO NOT EDIT). Loads app5 (modes+skins), app7 (login+editor UI), app8 (editor sections), app9 (visitor counter), app10 (lightbox etc). */
(function () {
  "use strict";
  ["app5.js", "app7.js", "app8.js", "app9.js", "app10.js"].forEach(function (src) {
    var s = document.createElement("script");
    s.src = src;
    document.body.appendChild(s);
  });
})();
