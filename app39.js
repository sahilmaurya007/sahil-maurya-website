/* app39.js - BLOGS "Siyahi-e-Sahil": interactive reader + BOOK MODE (fixed). Full story (blogbody1-3.js). DO NOT EDIT. */
(function () {
  "use strict";
  if (window.SM_BLOGS_DONE) return;
  window.SM_BLOGS_DONE = true;
  if (typeof BLOGS === "undefined") window.BLOGS = [];
  var FULL = (window.SM_BLOG_BODY_1 || "") + (window.SM_BLOG_BODY_2 || "") + (window.SM_BLOG_BODY_3 || "");
  var FALLBACK = "People still ask me why I chose hardware. I have never managed a short answer.\n\n### The question\n\nThere was a girl at IIIT Guwahati in those days. Sharp. Quiet. Completely unimpressed by jargon.\n\n**\"If a chip can become anything you program it to be, why can't a person?\"**\n\nThat question changed how I see everything.\n\n**Program. Play. Repeat.** ❤️";
  var DEFAULT_BLOGS = [{
    title: "Play with FPGA: A Love Letter to Reconfigurable Silicon ❤️",
    tag: "FPGA",
    date: "2026-10-27",
    photos: [],
    body: FULL || FALLBACK
  }];
  window.SM_DEFAULT_BLOGS = DEFAULT_BLOGS;

  var css = document.createElement("style");
  css.textContent = ".blog-sec{padding:clamp(44px,6vw,64px) 0;border-bottom:1px solid var(--border)}.blog-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr));gap:18px;margin-top:24px}.blog-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px 22px;cursor:pointer;transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;position:relative;overflow:hidden;display:flex;flex-direction:column;gap:10px}.blog-card::before{content:\"\";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--grad-btn);border-radius:4px 0 0 4px;z-index:1}.blog-card:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(60,40,140,.18);border-color:var(--accent)}.blog-thumb{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;display:block}.blog-tag{font-family:'JetBrains Mono',monospace;font-size:.64rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;padding:3px 10px;border-radius:999px;background:var(--soft);border:1px solid var(--border);color:var(--accent);align-self:flex-start}.blog-title{font-size:1.02rem;font-weight:700;line-height:1.35;margin:0;color:var(--text)}.blog-excerpt{font-size:.82rem;color:var(--muted);line-height:1.5;margin:0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.blog-meta{display:flex;align-items:center;gap:8px;margin-top:auto;padding-top:8px;border-top:1px dashed var(--border);font-family:'JetBrains Mono',monospace;font-size:.66rem;color:var(--muted)}.blog-ico{font-size:1.05rem;line-height:1}.blog-readmore{color:var(--accent);font-weight:600}.blog-empty{color:var(--muted);font-size:.86rem;text-align:center;padding:26px;background:var(--soft);border:1px dashed var(--border);border-radius:14px}.blog-modal{position:fixed;inset:0;background:rgba(10,8,30,.62);backdrop-filter:blur(6px);display:none;align-items:flex-start;justify-content:center;z-index:9999;padding:24px 14px;overflow-y:auto}.blog-modal.open{display:flex}.blog-article{background:var(--card);border:1px solid var(--border);border-radius:20px;max-width:720px;width:100%;padding:34px 34px 30px;position:relative;box-shadow:0 24px 60px rgba(10,8,30,.35);margin:auto;animation:blogIn .3s ease}@keyframes blogIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}.blog-close{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2}.blog-close:hover{background:var(--soft)}.blog-art-tag{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:.66rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;padding:4px 12px;border-radius:999px;background:var(--grad-btn);color:#fff;margin-bottom:12px}.blog-art-title{font-size:clamp(1.3rem,3vw,1.7rem);font-weight:800;line-height:1.3;margin:0 0 6px;background:var(--grad-ink);-webkit-background-clip:text;background-clip:text;color:transparent}.blog-art-date{font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--muted);margin-bottom:14px}.blog-art-body{font-size:.95rem;line-height:1.85;white-space:pre-wrap;word-wrap:break-word}.blog-art-txt{white-space:normal}.blog-art-photo{width:100%;border-radius:12px;margin:4px 0 14px;display:block;border:1px solid var(--border)}.blog-sig{font-weight:700;color:var(--text)}.blog-sig strong{color:var(--accent)}@media(max-width:600px){.blog-article{padding:24px 18px 22px;border-radius:16px}}";
  document.head.appendChild(css);

  var inl = function (t) {
    t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img class="blog-art-photo" src="$2" alt="$1" loading="lazy">');
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="font-weight:600">$1</a>');
    t = t.replace(/\*\*/g, "");
    return t;
  };
  /* KEY lines: ye story me bold dikhengi */
  var KEYS = [
    "By Sahil Maurya | Research Scholar, SCEE, IIT Mandi",
    "27 October 2026",
    "An idea becomes powerful when you learn how to implement it.",
    "The best way to predict the future is to invent it.",
    "I have not forgotten that question.",
    "Change alone is not progress. Change guided by understanding can become progress.",
    "Observe before you conclude. Ask before you assume. Understand before you judge.",
    "Your current configuration does not have to be your final configuration.",
    "Program. Play. Repeat. ❤️",
    "Because sometimes, the most important thing you will ever design is not a circuit. It is the person you are still becoming.",
    "- Sahil Maurya"
  ];
  var isKey = function (l) { return KEYS.indexOf(l) !== -1 || l.indexOf("Research Scholar | School of Computing") === 0; };
  var md = function (s) {
    if (s == null) return "";
    var lines = String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").split("\n");
    var out = [], para = [], shay = [];
    var fp = function () { if (para.length) { out.push("<p>" + para.join(" ") + "</p>"); para = []; } };
    var fs = function () { if (shay.length) { out.push("<div class='blog-shayari'><span class='bs-q'>❝</span>" + shay.map(function (l) { return inl(l); }).join("<br>") + "</div>"); shay = []; } };
    lines.forEach(function (raw) {
      var line = raw.replace(/^\s+|\s+$/g, "");
      if (/[\u0900-\u097F]/.test(line)) { fp(); shay.push(line); return; }
      fs();
      if (!line) { fp(); return; }
      if (/^###\s+/.test(line)) { fp(); out.push("<h3>" + inl(line.replace(/^###\s+/, "")) + "</h3>"); return; }
      if (/^---$/.test(line)) { fp(); out.push("<hr style='border:none;border-top:1px solid var(--border);margin:18px 0'>"); return; }
      fp();
      if (isKey(line)) { out.push("<p class='blog-sig'><strong>" + inl(line) + "</strong></p>"); return; }
      para.push(inl(line));
    });
    fp(); fs();
    return out.join("\n");
  };
  var esc = function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };

  var sec = document.createElement("section");
  sec.id = "blogs";
  sec.className = "blog-sec alt";
  sec.setAttribute("aria-label", "Siyahi-e-Sahil - Blogs");
  var pubSec = document.getElementById("publications");
  var galSec = document.getElementById("gallery");
  if (pubSec) pubSec.after(sec);
  else if (galSec) galSec.before(sec);
  else document.getElementById("main").appendChild(sec);

  var nav = document.getElementById("navLinks");
  if (nav && !nav.querySelector('a[href="#blogs"]')) {
    var bl = document.createElement("a");
    bl.href = "#blogs"; bl.textContent = "Blogs";
    var pubLink = nav.querySelector('a[href="#publications"]');
    if (pubLink) pubLink.after(bl); else nav.appendChild(bl);
  }

  /* modal: pghold bodyEl ke BAHAR (fix - pehle andar tha, blog kholne par mit jaata tha) */
  var modal = document.createElement("div");
  modal.className = "blog-modal";
  modal.innerHTML = "<div class='blog-article'><button class='blog-close' aria-label='Close'>✕</button><div class='blog-themes'><span>Reader:</span><div class='bt-dot' data-t='' title='Default' style='background:var(--card)'></div><div class='bt-dot' data-t='btheme-sep' title='Sepia' style='background:#f8f1e3'></div><div class='bt-dot' data-t='btheme-night' title='Night' style='background:#12141c'></div><div class='bt-dot' data-t='btheme-forest' title='Forest' style='background:#eaf3ea'></div><div class='bt-dot' data-t='btheme-ocean' title='Ocean' style='background:#e7f1f8'></div><div class='bt-dot' data-t='btheme-rose' title='Rose' style='background:#fdeef2'></div><button class='bt-book' type='button' title='Book mode: page palat kar padho'>📖 Book mode</button></div><div class='blog-art-body'></div><div class='blog-pghold'></div></div>";
  document.body.appendChild(modal);
  var art = modal.querySelector(".blog-article");
  var hold = modal.querySelector(".blog-pghold");
  var bodyEl = modal.querySelector(".blog-art-body");
  var curTheme = "";

  /* BOOK MODE (fixed): story paragraphs -> pages, Previous/Next se palto */
  function applyView() {
    var book = modal.querySelector(".bt-book").classList.contains("on");
    art.className = "blog-article" + (curTheme ? " " + curTheme : "");
    var txt = bodyEl.querySelector(".blog-art-txt");
    if (!txt) return;
    if (book) {
      var els = Array.prototype.slice.call(txt.children);
      var per = 6, pages = [];
      for (var i = 0; i < els.length; i += per) pages.push(els.slice(i, i + per));
      if (!pages.length) pages = [[]];
      hold.innerHTML = "";
      pages.forEach(function (pg) {
        var d = document.createElement("div");
        d.className = "blog-page";
        pg.forEach(function (el) { d.appendChild(el); });
        hold.appendChild(d);
      });
      var bar = document.createElement("div");
      bar.className = "blog-bookbar";
      hold.appendChild(bar);
      var pd = Array.prototype.slice.call(hold.querySelectorAll(".blog-page"));
      var show = function (n) {
        pd.forEach(function (p, pi) { p.classList.toggle("on", pi === n); });
        bar.innerHTML = "<button class='bb-prev bb-btn' type='button'" + (n === 0 ? " disabled" : "") + ">← Previous</button><span class='bb-count'>Page " + (n + 1) + " / " + pd.length + "</span><button class='bb-next bb-btn' type='button'" + (n === pd.length - 1 ? " disabled" : "") + ">Next →</button>";
        bar.querySelector(".bb-prev").onclick = function () { if (n > 0) { show(n - 1); modal.scrollTop = 0; } };
        bar.querySelector(".bb-next").onclick = function () { if (n < pd.length - 1) { show(n + 1); modal.scrollTop = 0; } };
      };
      show(0);
      txt.style.display = "none";
      hold.style.display = "block";
    } else {
      hold.style.display = "none";
      Array.prototype.slice.call(hold.querySelectorAll(".blog-page")).forEach(function (p) {
        Array.prototype.slice.call(p.children).forEach(function (el) { txt.appendChild(el); });
      });
      hold.innerHTML = "";
      txt.style.display = "block";
    }
  }
  modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.classList.contains("blog-close")) { modal.classList.remove("open"); return; }
    if (e.target.classList.contains("bt-dot")) { curTheme = e.target.dataset.t || ""; applyView(); return; }
    if (e.target.classList.contains("bt-book")) { e.target.classList.toggle("on"); applyView(); return; }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") modal.classList.remove("open"); });

  var render = function () {
    var src = (window.BLOGS && window.BLOGS.length) ? window.BLOGS : DEFAULT_BLOGS;
    var list = src.slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
    if (!list.length) {
      sec.innerHTML = "<div class='wrap'><div class='section-head'><p class='kicker'>༺ 🪶 ✒️ ༻</p><h2>Siyahi-e-Sahil</h2><div class='rule'></div><p class='muted'>Kuch logic se, kuch lafzon se, kuch dil se. Technology · Shayari · Ishq · Zindagi.</p></div><p class='blog-empty'>No blogs published yet. Coming soon! ✍️</p></div>";
      return;
    }
    sec.innerHTML = "<div class='wrap'><div class='section-head'><p class='kicker'>༺ 🪶 ✒️ ༻</p><h2>Siyahi-e-Sahil</h2><div class='rule'></div><p class='muted'>Kuch logic se, kuch lafzon se, kuch dil se. Technology · Shayari · Ishq · Zindagi.</p></div><div class='blog-grid'>" + list.map(function (b, i) {
      var txt = (b.body || "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/[#*\-]{2,}/g, "").replace(/\s+/g, " ").trim();
      var ex = txt.length > 180 ? txt.slice(0, 180) + "…" : txt;
      var th = (Array.isArray(b.photos) && b.photos.length) ? "<img class='blog-thumb' src='" + esc(b.photos[0]) + "' alt='' loading='lazy'>" : "";
      return "<article class='blog-card' data-i='" + i + "'>" + th + "<span class='blog-tag'>" + esc(b.tag || "Blog") + "</span><h3 class='blog-title'>" + esc(b.title || "Untitled") + "</h3><p class='blog-excerpt'>" + esc(ex) + "</p><div class='blog-meta'><span class='blog-ico'>🪶</span><span>" + esc(b.date || "") + "</span><span style='margin-left:auto' class='blog-readmore'>Read →</span></div></article>";
    }).join("") + "</div></div>";
    sec.querySelectorAll(".blog-card").forEach(function (c) {
      c.addEventListener("click", function () {
        var b = list[+c.dataset.i];
        var ph = (Array.isArray(b.photos) && b.photos.length) ? b.photos.map(function (p) { return "<img class='blog-art-photo' src='" + esc(p) + "' alt='' loading='lazy'>"; }).join("") : "";
        bodyEl.innerHTML = "<span class='blog-art-tag'>" + esc(b.tag || "Blog") + "</span><h2 class='blog-art-title'>" + esc(b.title || "") + "</h2><div class='blog-art-date'>" + esc(b.date || "") + "</div>" + ph + "<div class='blog-art-txt'>" + md(b.body || "") + "</div>";
        hold.innerHTML = "";
        hold.style.display = "none";
        modal.querySelector(".bt-book").classList.remove("on");
        curTheme = "";
        art.className = "blog-article";
        modal.classList.add("open");
        modal.scrollTop = 0;
      });
    });
  };
  render();
  setInterval(render, 3000);
})();
