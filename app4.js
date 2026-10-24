/* app4.js - loader (DO NOT EDIT). Injects visitor.css + loads app5/7/8/9/10. */
(function () {
  "use strict";
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "visitor.css";
  document.head.appendChild(link);
  ["app5.js", "app7.js", "app8.js", "app9.js", "app10.js"].forEach(function (src) {
    var s = document.createElement("script");
    s.src = src;
    document.body.appendChild(s);
  });
})();
