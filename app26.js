/* app26.js - empty news items ko NEWS array se hatao (ticker/list me khali entry bug). Loads BEFORE app3. DO NOT EDIT. */
(function () {
  "use strict";
  if (typeof NEWS === "undefined" || !Array.isArray(NEWS)) return;
  for (var k = NEWS.length - 1; k >= 0; k--) {
    if (!NEWS[k] || !String(NEWS[k].text || "").trim()) NEWS.splice(k, 1);
  }
})();
