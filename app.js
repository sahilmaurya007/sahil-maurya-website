/* ============================================================
   RENDERER (app.js) - IS FILE KO EDIT KARNE KI ZAROORAT NAHI.
   Content data.js/data2.js se aata hai.
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

  /* profile photo: extension fallback chain (.jpg -> .jpeg -> .JPG -> .png) */
  const photo = $("heroPhoto");
  photo.alt = PROFILE.name;
  const base = PROFILE.photo.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i, "");
  const tryList = [PROFILE.photo, base + ".jpeg", base + ".JPG", base + ".png"];
  let pi = 0;
  photo.src = tryList[0];
  photo.addEventListener("error", () => {
    pi += 1;
    if (pi < tryList.length) { photo.src = tryList[pi]; return; }
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
    ${PROFILE.links && PROFILE.links.length ? `<div class="lab-row"><span class="lab-k">Connect</span><span>${PROFILE.links.map(l =>
      `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join(" · ")}</span></div>` : ""}
  `;

  /* ---------- Connect links: platform symbol ke saath pill-boxes ---------- */
  const linkIco = (label) => {
    const l = String(label || "").toLowerCase();
    if (/scholar/.test(l))  return "🎓";
    if (/linkedin/.test(l)) return "💼";
    if (/researchgate/.test(l)) return "🧪";
    if (/youtube/.test(l))  return "▶️";
    if (/github/.test(l))   return "🐙";
    if (/twitter|x\.com/.test(l)) return "🐦";
    if (/orcid/.test(l))    return "🆔";
    return "🔗";
  };
  const linkPills = (PROFILE.links || []).map(l =>
    `<a class="con-pill" href="${esc(l.url)}" target="_blank" rel="noopener">` +
    `<span class="con-pill-ico">${linkIco(l.label)}</span>${esc(l.label)}</a>`).join("");

  /* ---------- Location card: live Google Maps embed (IIT Mandi North Campus, Kamand) ---------- */
  const mapEmbed = `
    <div class="loc-map">
      <iframe class="loc-map-iframe"
        src="https://www.google.com/maps?q=IIT+Mandi+North+Campus,+Kamand,+Mandi,+Himachal+Pradesh+175005&output=embed"
        title="Map — SCEE, IIT Mandi North Campus"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen></iframe>
      <div class="loc-map-cap">
        <span class="loc-map-t">SCEE, IIT Mandi North Campus</span>
        <a class="loc-map-link" href="https://www.google.com/maps?q=IIT+Mandi+North+Campus,+Kamand,+Mandi,+Himachal+Pradesh+175005"
          target="_blank" rel="noopener">Open in Google Maps ↗</a>
      </div>
    </div>`;

  const contacts = [
    { lab: "Email (IIT Mandi)", ico: "✉️", html: `<a href="mailto:${esc(PROFILE.email)}">${esc(PROFILE.email)}</a>` },
    { lab: "Email (Previous)",  ico: "✉️", html: `<a href="mailto:${esc(PROFILE.emailAlt)}">${esc(PROFILE.emailAlt)}</a>` },
    { lab: "Current Address", ico: "🏛️", html: esc(PROFILE.currentAddress) },
    { lab: "Home Address", ico: "🏠", html: esc(PROFILE.address) },
    { lab: "Connect", ico: "🔗", html: linkPills },
    { lab: "Location", ico: "📍", html: mapEmbed },
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
