/* ============================================================
   RENDERER (app2.js) — Part 2 — EDIT MAT KARO.
   ============================================================ */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  $("pubList").innerHTML = PUBLICATIONS.map((p, i) => {
    const links = [];
    if (p.doi)  links.push(`<a class="btn-sm" href="${esc(p.doi)}" target="_blank" rel="noopener">DOI</a>`);
    if (p.link) links.push(`<a class="btn-sm" href="${esc(p.link)}" target="_blank" rel="noopener">Link</a>`);
    if (p.pdf)  links.push(`<a class="btn-sm" href="${esc(p.pdf)}" target="_blank" rel="noopener">PDF</a>`);
    const tags = (p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("");
    return `
    <article class="card">
      <span class="pub-no">[${PUBLICATIONS.length - i}] · ${esc(p.type || "")} · ${esc(p.year)}</span>
      <h3 class="pub-title">${esc(p.title)}</h3>
      <p class="pub-meta">${esc(p.authors)} · <em>${esc(p.venue)}</em>, ${esc(p.year)}</p>
      ${p.note ? `<p class="note">${esc(p.note)}</p>` : ""}
      ${links.length ? `<div class="btn-row" style="margin-top:12px">${links.join("")}</div>` : ""}
      ${tags ? `<div class="tag-row">${tags}</div>` : ""}
    </article>`;
  }).join("");

  $("projGrid").innerHTML = PROJECTS.map(p => `
    <article class="card">
      <h3>${esc(p.title)}</h3>
      <p class="muted" style="font-size:.85rem">${esc(p.area)}</p>
      <p class="note">${esc(p.note)}</p>
    </article>`).join("");

  $("skillsGrid").innerHTML = SKILLS.map(s => `
    <div class="card skill-cat">
      <h3>${s.category}</h3>
      <div class="pill-row">${s.items.map(t => `<span class="pill">${esc(t)}</span>`).join("")}</div>
    </div>`).join("");

  $("courseRow").innerHTML = COURSEWORK.map(c =>
    `<span class="pill">${esc(c)}</span>`).join("");

  $("certGrid").innerHTML = CERTIFICATIONS.map(c => `
    <article class="card">
      <h3>${esc(c.title)}</h3>
      <p class="muted">${esc(c.issuer)}</p>
      ${c.year ? `<span class="edu-score">${esc(c.year)}</span>` : ""}
    </article>`).join("");

  $("awardGrid").innerHTML = AWARDS.map(a => `
    <article class="card">
      <h3>${esc(a.title)}</h3>
      <p class="muted">${esc(a.issuer)}</p>
      ${a.date ? `<span class="edu-score">${esc(a.date)}</span>` : ""}
    </article>`).join("");

  const gal = (items) => items.map(g => {
    const cap = g.src
      ? `<figcaption class="gal-cap">${esc(g.caption)}</figcaption>`
      : `<span class="muted">${esc(g.caption)}</span>`;
    const img = g.src
      ? `<img loading="lazy" src="${esc(g.src)}" alt="${esc(g.caption)}">` : "";
    return `<figure class="gal-item${g.src ? "" : " noimg"}">${img}${cap}</figure>`;
  }).join("");
  $("chipGal").innerHTML = gal(CHIP_GALLERY);
  $("photoGal").innerHTML = gal(PHOTO_GALLERY);
  document.querySelectorAll(".gal-item img").forEach(img =>
    img.addEventListener("error", () => img.closest("figure").classList.add("noimg")));

  $("refGrid").innerHTML = REFERENCES.map(r => `
    <article class="card">
      <h3>${esc(r.name)}</h3>
      <p class="muted">${esc(r.role)}</p>
    </article>`).join("");

  $("quoteText").textContent = QUOTE.text;
  $("quoteBy").textContent = QUOTE.by;

  /* ---------- Footer: address + location link (Google Maps) ---------- */
  const mapQ = encodeURIComponent("SCEE, IIT Mandi North Campus, Kamand, Mandi, Himachal Pradesh");
  $("footAddr").innerHTML =
    `${esc(PROFILE.currentAddress)}<br>` +
    `<a class="foot-loc" href="https://www.google.com/maps?q=${mapQ}" target="_blank" rel="noopener">` +
    `📍 SCEE, IIT Mandi North Campus ↗</a>`;
  $("footLinks").innerHTML = (PROFILE.links || []).map(l =>
    `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("");
  $("footCopy").textContent = SITE.footerNote;
  $("footUpd").textContent = "Last updated: " + SITE.lastUpdated;

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("on"); io.unobserve(en.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
})();
