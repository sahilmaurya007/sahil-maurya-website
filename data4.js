/* data4.js - editor overrides (auto-generated). DO NOT EDIT MANUALLY. */
window.EDITS = {};
window.SM_APPLY = function (e) {
  if (!e) return;
  if (e.ABOUT && window.ABOUT) { ABOUT.length = 0; e.ABOUT.forEach(function (p) { ABOUT.push(p); }); }
  if (e.intro && window.PROFILE) PROFILE.intro = e.intro;
  if (e.NEWS && window.NEWS) { NEWS.length = 0; e.NEWS.forEach(function (x) { NEWS.push(x); }); }
  if (e.PUBLICATIONS && window.PUBLICATIONS) { PUBLICATIONS.length = 0; e.PUBLICATIONS.forEach(function (x) { PUBLICATIONS.push(x); }); }
  if (e.AWARDS && window.AWARDS) { AWARDS.length = 0; e.AWARDS.forEach(function (x) { AWARDS.push(x); }); }
  if (e.SKILLS && window.SKILLS) { SKILLS.length = 0; e.SKILLS.forEach(function (x) { SKILLS.push(x); }); }
  if (e.JOURNEY && window.JOURNEY) { JOURNEY.length = 0; e.JOURNEY.forEach(function (x) { JOURNEY.push(x); }); }
};
SM_APPLY(EDITS);
