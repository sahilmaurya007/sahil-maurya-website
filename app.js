/* ============================================================
   RENDERER (app.js) — IS FILE KO EDIT KARNE KI ZAROORAT NAHI.
   Saara content data.js aur data2.js se aata hai.
   Theme switching ab app5.js me hai (Light/Night + Background).
   ============================================================ */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  $("menuBtn").addEventListener("click", () => $("navLinks").classList.toggle("open"));
  document.querySelectorAll("#navLinks a").forEach(a =>
    a.addEventListener("click", () => $("navLinks").classList.remove("open")));

  $("heroKicker").textContent = PROFILE.kicker;
  $("heroName").textContent = PROFILE.name;
  $("heroIntro").textContent = PROFILE.intro;
  $("heroTags").innerHTML = PROFILE.tagline.split(" · ").map(t =>
    `<span class="chip">${esc(t)}</span>`).join("");
  $("heroMailBtn").href = "mailto:" + PROFILE.email;
  const scholar = (PROFILE.links || []).find(l => /scholar/i.test(l.label));
  if (scholar) $("heroScholarBtn").href = scholar.url;
  else $("heroScholarBtn").style.display = "none";
  const photo = $("heroPhoto");
  photo.src = PROFILE.photo;
  photo.alt = PROFILE.name;
  photo.addEventListener("error", () => {
    photo.style.display = "none";
    $("photoFallback").style.display = "grid";
  });

  $("aboutBody").innerHTML = ABOUT.map(p => `<p>${esc(p)}</p>`).join("");
  $("interestsRow").innerHTML = RESEARCH_INTERESTS.map(t =>
    `<span class="tag">${esc(t)}</span>`).join("");

  $("labCard").innerHTML = `
    <div class="lab-row"><span class="lab-k">Email</span>
      <a href="mailto:${esc(PROFILE.email)}">${esc(PROFILE.email)}</a></div>
    ${PROFILE.inLabSince ? `<div class="lab-row"><span class="lab-k">In the lab</span><span>${esc(PROFILE.inLabSince)}</span></div>` : ""}
    ${PROFILE.links && PROFILE.links.length ? `<div class="lab-row"><span class="lab-k">Elsewhere</span><span>${PROFILE.links.map(l =>
      `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join(" · ")}</span></div>` : ""}
  `;

  const contacts = [
    { lab: "Email (IIT Mandi)", ico: "📧", html: `<a href="mailto:${esc(PROFILE.email)}">${esc(PROFILE.email)}</a>` },
    { lab: "Email (Previous)",  ico: "📧", html: `<a href="mailto:${esc(PROFILE.emailAlt)}">${esc(PROFILE.emailAlt)}</a>` },
    { lab: "Current Address", ico: "🏛️", html: esc(PROFILE.currentAddress) },
    { lab: "Home Address", ico: "🏠", html: esc(PROFILE.address) },
    { lab: "Elsewhere", ico: "🔗", html: (PROFILE.links || []).map(l =>
      `<a href="${esc(l.url)}" target="_blank" rel="noopener" style="margin-right:8px">${esc(l.label)}</a>`).join("") },
  ];
  $("contactGrid").innerHTML = contacts.map(c => `
    <div class="contact-item"><span class="ico">${c.ico}</span>
      <span><span class="lab">${esc(c.lab)}</span><br>${c.html}</span>
    </div>`).join("");

  $("eduGrid").innerHTML = EDUCATION.map(e => `
    <article class="card">
      <h3><span class="edu-inst">${esc(e.institute)}</span></h3>
      <p class="muted">${esc(e.degree)} · ${esc(e.period)}</p>
      ${e.score ? `<span class="edu-score">${esc(e.score)}</span>` : ""}
      ${e.note ? `<p class="note">${esc(e.note)}</p>` : ""}
    </article>`).join("");
})();
