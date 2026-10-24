/* data4.js - editor overrides (auto-generated). DO NOT EDIT MANUALLY. */
window.EDITS = {};
window.SM_APPLY = function (e) {
  if (!e) return;
  if (e.ABOUT && typeof ABOUT !== "undefined") { ABOUT.length = 0; e.ABOUT.forEach(function (p) { ABOUT.push(p); }); }
  if (e.intro && typeof PROFILE !== "undefined") PROFILE.intro = e.intro;
  if (e.NEWS && typeof NEWS !== "undefined") { NEWS.length = 0; e.NEWS.forEach(function (x) { NEWS.push(x); }); }
  if (e.PUBLICATIONS && typeof PUBLICATIONS !== "undefined") { PUBLICATIONS.length = 0; e.PUBLICATIONS.forEach(function (x) { PUBLICATIONS.push(x); }); }
  if (e.AWARDS && typeof AWARDS !== "undefined") { AWARDS.length = 0; e.AWARDS.forEach(function (x) { AWARDS.push(x); }); }
  if (e.SKILLS && typeof SKILLS !== "undefined") { SKILLS.length = 0; e.SKILLS.forEach(function (x) { SKILLS.push(x); }); }
  if (e.JOURNEY && typeof JOURNEY !== "undefined") { JOURNEY.length = 0; e.JOURNEY.forEach(function (x) { JOURNEY.push(x); }); }
};
SM_APPLY(EDITS);
