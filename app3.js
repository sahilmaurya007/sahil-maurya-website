/* ============================================================
   RENDERER (app3.js) — news ticker, journey timeline + pie
   chart, categorized gallery. IS FILE KO EDIT MAT KARO.
   Ye sections khud page me inject karta hai — index.html me
   sirf ye script load hoti hai. Content data3.js se aata hai.
   ============================================================ */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ================= NEWS TICKER (header ke turant neeche) ================= */
  const ticker = document.createElement("div");
  ticker.className = "ticker";
  ticker.id = "news";
  ticker.setAttribute("aria-label", "Latest updates");
  const newsItem = (n) => {
    const label = n.link
      ? `<a href="${esc(n.link)}" target="_blank" rel="noopener">${esc(n.text)}</a>`
      : esc(n.text);
    return `<span class="ticker-item"><span class="ntype">${esc(n.type)}</span>${label}` +
      (n.date ? ` <span class="ndate">· ${esc(n.date)}</span>` : "") + `</span>`;
  };
  const track = NEWS.map(newsItem).join(`<span class="ndate">✦</span>`);
  ticker.innerHTML =
    `<div class="ticker-label"><span class="dot"></span><span class="txt">Latest</span></div>` +
    `<div class="ticker-viewport"><div class="ticker-track">${track}<span class="ndate">✦</span>${track}</div></div>`;
  const header = document.querySelector("header");
  if (header) header.after(ticker);

  /* ================= NAV LINKS UPDATE ================= */
  document.querySelectorAll("#navLinks a").forEach(a => { if (a.getAttribute("href") === "#chip") a.remove(); });
  const navLinks = $("navLinks");
  if (navLinks) {
    const newsLink = document.createElement("a");
    newsLink.href = "#news"; newsLink.textContent = "News";
    navLinks.prepend(newsLink);
    const jLink = document.createElement("a");
    jLink.href = "#journey"; jLink.textContent = "Journey";
    const galLink = Array.from(navLinks.querySelectorAll("a")).find(a => a.getAttribute("href") === "#gallery");
    if (galLink) galLink.before(jLink); else navLinks.appendChild(jLink);
  }

  /* ================= JOURNEY SECTION (timeline + pie chart) ================= */
  const journey = document.createElement("section");
  journey.id = "journey";
  journey.className = "reveal";
  journey.innerHTML = `
  <div class="wrap">
    <div class="section-head"><p class="kicker">10 · Milestones</p><h2>My Journey — year by year</h2><div class="rule"></div>
    <p class="muted">Timeline card par click karo — seedha us section par pahunch jaoge. Legend par hover karke category filter dekho.</p></div>
    <div class="journey-layout">
      <div class="tl" id="tlList"></div>
      <aside class="journey-side">
        <div class="pie-card">
          <h3>Milestone analysis</h3>
          <div class="pie-wrap"><svg id="pieSvg" viewBox="0 0 200 200"></svg>
            <div class="pie-center"><div><div class="big" id="pieTotal"></div><div class="small">milestones</div></div></div>
          </div>
          <div class="pie-legend" id="pieLegend"></div>
        </div>
        <div class="yearly-card">
          <h3 style="font-size:.95rem;margin-bottom:10px">Year-wise activity</h3>
          <div id="yearlyBars"></div>
        </div>
      </aside>
    </div>
  </div>`;
  const gallerySec = $("gallery");
  if (gallerySec) gallerySec.before(journey);

  /* ---------- timeline render ---------- */
  const byDate = (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
  const sorted = JOURNEY.slice().sort(byDate);
  $("tlList").innerHTML = sorted.map(j => `
    <div class="tl-item">
      <span class="tl-dot"></span>
      <div class="tl-card" data-section="${esc(j.section || "")}">
        <span class="tl-cat">${esc(j.category || "Milestone")}</span>
        <div class="tl-date">${esc(j.date)}</div>
        <h3>${esc(j.title)}</h3>
        ${j.desc ? `<p>${esc(j.desc)}</p>` : ""}
        ${j.photo ? `<div class="tl-photo"><img loading="lazy" src="${esc(j.photo)}" alt="${esc(j.title)}" onerror="this.parentElement.style.display='none'"></div>` : ""}
        <p class="note" style="margin-top:8px">↳ Click to view</p>
      </div>
    </div>`).join("");
  document.querySelectorAll(".tl-card").forEach(card =>
    card.addEventListener("click", () => scrollTo(card.dataset.section)));

  /* ---------- pie chart (SVG donut, no library) ---------- */
  const palette = ["#6366f1", "#a855f7", "#199baf", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6", "#f472b6"];
  const counts = {};
  sorted.forEach(j => { counts[j.category || "Milestone"] = (counts[j.category || "Milestone"] || 0) + 1; });
  const cats = Object.keys(counts);
  const total = sorted.length;
  const R = 80, C = 2 * Math.PI * R;
  let offset = 0, arcs = "";
  cats.forEach((c, i) => {
    const frac = counts[c] / total;
    const dash = `${(frac * C).toFixed(2)} ${(C - frac * C).toFixed(2)}`;
    arcs += `<circle r="${R}" cx="100" cy="100" fill="none" stroke="${palette[i % palette.length]}" stroke-width="26" stroke-dasharray="${dash}" stroke-dashoffset="${(-offset).toFixed(2)}" data-cat="${esc(c)}" style="cursor:pointer"></circle>`;
    offset += frac * C;
  });
  $("pieSvg").innerHTML = arcs;
  $("pieTotal").textContent = total;
  $("pieLegend").innerHTML = cats.map((c, i) => `
    <div class="leg" data-cat="${esc(c)}">
      <span class="swatch" style="background:${palette[i % palette.length]}"></span>
      <span>${esc(c)}</span><span class="cnt">${counts[c]}</span>
    </div>`).join("");
  const focusCat = (cat) => {
    document.querySelectorAll("#pieSvg circle").forEach(c => { c.style.opacity = (c.dataset.cat === cat) ? "1" : ".18"; });
    document.querySelectorAll(".pie-legend .leg").forEach(l => { l.style.fontWeight = (l.dataset.cat === cat) ? "600" : "400"; });
    document.querySelectorAll(".tl-item").forEach(it => { it.style.opacity = (it.querySelector(".tl-cat").textContent === cat) ? "1" : ".25"; });
  };
  const resetCat = () => {
    document.querySelectorAll("#pieSvg circle").forEach(c => c.style.opacity = "1");
    document.querySelectorAll(".pie-legend .leg").forEach(l => l.style.fontWeight = "400");
    document.querySelectorAll(".tl-item").forEach(it => it.style.opacity = "1");
  };
  document.querySelectorAll(".pie-legend .leg").forEach(l => l.addEventListener("mouseenter", () => focusCat(l.dataset.cat)));
  const pieWrap = document.querySelector(".pie-wrap");
  if (pieWrap) pieWrap.addEventListener("mouseleave", resetCat);

  /* ---------- year-wise bars ---------- */
  const byYear = {};
  sorted.forEach(j => { const y = j.date.slice(0, 4); byYear[y] = (byYear[y] || 0) + 1; });
  const years = Object.keys(byYear).sort();
  const max = Math.max(...Object.values(byYear));
  $("yearlyBars").innerHTML = years.map(y => `
    <div class="yearly-row" data-year="${y}">
      <span class="yyear">${y}</span>
      <span class="ybar-wrap"><span class="ybar" style="width:${(byYear[y] / max) * 100}%"></span></span>
      <span class="ycount">${byYear[y]}</span>
    </div>`).join("");
  document.querySelectorAll(".yearly-row").forEach(r =>
    r.addEventListener("click", () => {
      resetCat();
      document.querySelectorAll(".tl-item").forEach(it => {
        it.style.opacity = it.querySelector(".tl-date").textContent.startsWith(r.dataset.year) ? "1" : ".25";
      });
    }));

  /* ================= CATEGORIZED GALLERY (replace old) ================= */
  const chipSec = $("chip");
  if (chipSec) chipSec.remove();
  if (gallerySec) {
    gallerySec.innerHTML = `
    <div class="wrap">
      <div class="section-head"><p class="kicker">11 · Moments</p><h2>Gallery</h2><div class="rule"></div>
      <p class="muted">Category tabs se choose karo — photos image/ folder me daalo aur data3.js me line add karo.</p></div>
      <div class="cat-tabs" id="catTabs"></div>
      <div class="gal g4" id="catGal"></div>
    </div>`;
  }
  let activeCat = GALLERY_CATEGORIES.length ? GALLERY_CATEGORIES[0].name : "";
  const renderCatTabs = () => {
    $("catTabs").innerHTML = GALLERY_CATEGORIES.map(c =>
      `<button class="cat-tab${c.name === activeCat ? " active" : ""}" data-name="${esc(c.name)}">${esc(c.name)}</button>`).join("");
    document.querySelectorAll(".cat-tab").forEach(t =>
      t.addEventListener("click", () => { activeCat = t.dataset.name; renderCatTabs(); renderCatGal(); }));
  };
  const renderCatGal = () => {
    const cat = GALLERY_CATEGORIES.find(c => c.name === activeCat);
    if (!cat || !cat.photos.length) {
      $("catGal").innerHTML = `<p class="muted">Is category me abhi koi photo nahi hai.</p>`;
      return;
    }
    $("catGal").innerHTML = cat.photos.map(g => {
      const cap = g.src
        ? `<figcaption class="gal-cap">${esc(g.caption)}</figcaption>`
        : `<span class="muted">${esc(g.caption)}</span>`;
      const img = g.src ? `<img loading="lazy" src="${esc(g.src)}" alt="${esc(g.caption)}">` : "";
      return `<figure class="gal-item${g.src ? "" : " noimg"}">${img}${cap}</figure>`;
    }).join("");
    document.querySelectorAll("#catGal img").forEach(img =>
      img.addEventListener("error", () => img.closest("figure").classList.add("noimg")));
  };
  renderCatTabs();
  renderCatGal();
})();
