/* app4.js - loader (DO NOT EDIT). Loads app5/7/9/10/11/12/13/15/16/17/18/19/20/21. */
(function () {
  "use strict";
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "visitor.css";
  document.head.appendChild(link);
  ["app5.js", "app7.js", "app9.js", "app10.js", "app11.js", "app12.js", "app13.js", "app16.js", "app17.js", "app15.js", "app20.js", "app21.js", "app18.js", "app19.js"].forEach(function (src) {
    var s = document.createElement("script");
    s.src = src;
    document.body.appendChild(s);
  });
})();
