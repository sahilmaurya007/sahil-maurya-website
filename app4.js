/* app4.js - loader (DO NOT EDIT). Injects visitor.css + loads app5/7/9/10/11/12. */
(function () {
  "use strict";
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "visitor.css";
  document.head.appendChild(link);
  ["app5.js", "app7.js", "app9.js", "app10.js", "app11.js", "app12.js"].forEach(function (src) {
    var s = document.createElement("script");
    s.src = src;
    document.body.appendChild(s);
  });
})();
