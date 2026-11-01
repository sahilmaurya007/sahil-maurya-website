/* ============================================================
   RENDERER (app3.js) — NEWS BANNER (full photo left + news
   box right), journey timeline + pie chart, categorized
   gallery. IS FILE KO EDIT MAT KARO. Content data3.js se aata hai.
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

  /* ================= NEWS SECTION =================
     Left: badi rotating photo (11 sec). Right: news list box —
     saare news dikhte hain, current highlighted, click karke slide badlo. */
  let newsIdx = 0;
  const news = document.createElement("section");
  news.id = "news";
  news.className = "news-sec";
  news.setAttribute("aria-label", "Latest updates");
  const hero = document.querySelector("section.hero");
  if (hero) hero.before(news);

  const renderNews = () => {
    const n = NEWS[newsIdx];
    const ph = n.photo || (Array.isArray(n.photos) && n.photos.length ? n.photos[0] : "");
    news.innerHTML = `
    <div class="wrap news-layout">
      <div class="news-media">
        ${ph
          ? `<img src="${esc(ph)}" alt="${esc(n.text)}">`
          : `<div class="news-grad"><span class="ng-txt">${esc(n.type)}</span></div>`}
        <div class="news-media-cap">
          <span class="ntype">${esc(n.type)}</span>
          <span class="ndate">${esc(n.date || "")}</span>
        </div>
      </div>
      <div class="news-box">
        <div class="news-box-head">
          <span class="nb-dot-blink"></span> Latest Updates
        </div>
        <ul class="news-list">
          ${NEWS.map((it, i) => `
            <li class="nl-item${i === newsIdx ? " active" : ""}" data-i="${i}">
              <span class="nl-type">${esc(it.type)}</span>
              <span class="nl-text">${it.link
                ? `<a href="${esc(it.link)}" target="_blank" rel="noopener">${esc(it.text)}</a>`
                : esc(it.text)}</span>
              <span class="nl-date">${esc(it.date || "")}</span>
            </li>`).join("")}
        </ul>
      </div>
    </div>`;
    document.querySelectorAll(".nl-item").forEach(li =>
      li.addEventListener("click", () => { newsIdx = +li.dataset.i; renderNews(); }));
  };
  if (NEWS.length) {
    renderNews();
    setInterval(() => { newsIdx = (newsIdx + 1) % NEWS.length; renderNews(); }, 11000);
  }

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

  /* ================= JOURNEY SECTION ================= */
  const journey = document.createElement("section");
  journey.id = "journey";
  journey.className = "alt";
  journey.innerHTML = `
  <div class="wrap">
    <div class="section-head"><p class="kicker">10 · Milestones</p><h2>My Journey — year by year</h2><div class="rule"></div>
    <p class="muted">Click a timeline card to jump to that section. Hover the legend to filter by category.</p></div>
    <div class="journey-layout">
      <div class="tl" id="tlList"></div>
      <aside class="journey-side">
        <div class="pie-card">
          <h3>Milestone analysis</h3>
          <div class="pie-wrap"><svg id="pieSvg" viewBox="0 0 200 200" width="200" height="200" aria-label="Milestone categories pie chart"></svg>
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

  /* ---------- pie chart — TRUE CIRCLE ---------- */
  const palette = ["#6366f1", "#a855f7", "#199baf", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6", "#f472b6"];
  const counts = {};
  sorted.forEach(j => { counts[j.category || "Milestone"] = (counts[j.category || "Milestone"] || 0) + 1; });
  const cats = Object.keys(counts);
  const total = sorted.length;
  const CX = 100, CY = 100, R = 92;
  const slicePath = (start, end) => {
    const x1 = CX + R * Math.cos(start), y1 = CY + R * Math.sin(start);
    const x2 = CX + R * Math.cos(end),   y2 = CY + R * Math.sin(end);
    const large = (end - start) > Math.PI ? 1 : 0;
    return `M ${CX} ${CY} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
  };
  let angle = -Math.PI / 2, slices = "";
  cats.forEach((c, i) => {
    const sweep = (counts[c] / total) * 2 * Math.PI;
    const start = angle, end = angle + sweep;
    slices += `<path class="pie-arc" d="${slicePath(start, end)}" fill="${palette[i % palette.length]}" stroke="var(--card)" stroke-width="1.5" data-cat="${esc(c)}"><title>${esc(c)}: ${counts[c]}</title></path>`;
    angle = end;
  });
  $("pieSvg").innerHTML = slices;
  $("pieTotal").textContent = total;
  $("pieLegend").innerHTML = cats.map((c, i) => `
    <div class="leg" data-cat="${esc(c)}">
      <span class="swatch" style="background:${palette[i % palette.length]}"></span>
      <span>${esc(c)}</span><span class="cnt">${counts[c]}</span>
    </div>`).join("");
  const focusCat = (cat) => {
    document.querySelectorAll("#pieSvg .pie-arc").forEach(p => { p.style.opacity = (p.dataset.cat === cat) ? "1" : ".18"; });
    document.querySelectorAll(".pie-legend .leg").forEach(l => { l.style.fontWeight = (l.dataset.cat === cat) ? "600" : "400"; });
    document.querySelectorAll(".tl-item").forEach(it => { it.style.opacity = (it.querySelector(".tl-cat").textContent === cat) ? "1" : ".25"; });
  };
  const resetCat = () => {
    document.querySelectorAll("#pieSvg .pie-arc").forEach(p => { p.style.opacity = "1"; });
    document.querySelectorAll(".pie-legend .leg").forEach(l => { l.style.fontWeight = "400"; });
    document.querySelectorAll(".tl-item").forEach(it => { it.style.opacity = "1"; });
  };
  document.querySelectorAll(".pie-legend .leg").forEach(l => {
    l.addEventListener("mouseenter", () => focusCat(l.dataset.cat));
    l.addEventListener("mouseleave", resetCat);
  });
  document.querySelectorAll("#pieSvg .pie-arc").forEach(p => {
    p.addEventListener("mouseenter", () => focusCat(p.dataset.cat));
    p.addEventListener("mouseleave", resetCat);
  });

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

  /* ================= CATEGORIZED GALLERY ================= */
  const chipSec = $("chip");
  if (chipSec) chipSec.remove();
  if (gallerySec) {
    gallerySec.innerHTML = `
    <div class="wrap">
      <div class="section-head"><p class="kicker">11 · Moments</p><h2>Gallery</h2><div class="rule"></div></div>
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
      $("catGal").innerHTML = `<p class="muted">No photos in this category yet.</p>`;
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
