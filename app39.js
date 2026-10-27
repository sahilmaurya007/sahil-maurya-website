/* app39.js - BLOGS "Sahil Speaks": cards + photos + beautiful reader. After Publications + nav link. DO NOT EDIT. */
(function () {
  "use strict";
  /* GUARD: ye script index + loader dono jagah se aa sakti hai - sirf EK baar chale */
  if (window.SM_BLOGS_DONE) return;
  window.SM_BLOGS_DONE = true;
  if (typeof BLOGS === "undefined") window.BLOGS = [];
  var DEFAULT_BLOGS = [{
    title: "Play with FPGA — A Love Letter to Reconfigurable Silicon ❤️",
    tag: "FPGA",
    date: "2026-10-27",
    photos: [],
    body: "People sometimes ask me why I chose hardware. I never had a short answer. The honest one is long, and it begins in a college corridor in Lucknow.\n\n### The question that started everything\n\nBack in my B.Tech days at the University of Lucknow, I was the kind of student who opened up calculators just to see what lived inside. There was a girl in my batch — sharp, quiet, and completely immune to jargon. One afternoon she found me in the lab, hunched over a tiny development board, trying to explain programmable logic to a friend. She listened for a while, tilted her head, and asked:\n\n**\"If a chip can become anything you program it to be... why can't a person?\"**\n\nI laughed, said something clever the way nineteen-year-olds do, and forgot the moment. The question, however, did not forget me.\n\n### The evening I actually fell in love\n\nMy first FPGA arrived years later, during my M.Tech at IIIT Guwahati — an Artix-7 in a dull grey box, its JTAG cable coiled like a sleeping snake. The lab was empty that evening. I plugged it in, watched the power LED glow, and felt something shift quietly in my chest. My first design was the same as everyone's — a blinking LED. Trivial, they say. But when that tiny red dot obeyed code I had written, alone at 9 PM, I sat there grinning like a fool. **A piece of silicon was doing exactly what my mind had imagined.** I did not know it then, but I had fallen in love.\n\n### What an FPGA really is\n\nFPGA stands for **Field Programmable Gate Array**. It is a chip where **you decide the circuit** — not a factory. Picture a canvas of silicon carrying thousands of small blocks: **LUTs (Look-Up Tables)** that behave like tiny logic functions, **flip-flops** that remember a single bit, **DSP slices** that multiply numbers fast, and **Block RAMs** that hold your data. Alone, they mean nothing. But describe your design in **Verilog**, let **Xilinx Vivado** run synthesis, implementation and bitstream generation — and the tool quietly weaves your intent into that fabric. Program the board, and your hardware breathes. No factory, no masks, no waiting for months. Just an idea, and an open canvas.\n\n### The question comes back\n\nMonths into my M.Tech, I spent one long night fighting a timing report — red paths, failed constraints, the whole familiar war. Somewhere past midnight, as static timing analysis finally passed with positive slack on every path, her old question walked back into the room.\n\nAn **ASIC** is fabricated once and frozen forever — like a person who decides at twenty who they are and never revisits the decision. An **FPGA** is reprogrammable. Every new bitstream is a **new version of the same silicon**. Failure does not ruin the device; it is simply the previous bitstream, replaced by a better one.\n\nThat night, the answer finally wrote itself:\n\n**An FPGA teaches you to fall, learn, and reconfigure yourself. Life asks exactly the same of us. And love — real love — is not finding a finished circuit. It is two people reprogramming themselves for each other, without ever losing who they fundamentally are.**\n\n### The craft, honestly told\n\nI learned the discipline the hard way, and I would not trade it. **Constraints are promises** — an XDC file is you telling silicon what you guarantee it can achieve. **Clock-domain crossings** are border checkpoints; cross without synchronizers and your data arrives corrupted, like a message lost between two lifetimes. **Timing closure** is a love story told in nanoseconds — when setup and hold checks pass on every path, the design and the clock finally agree, two hearts in sync at a hundred megahertz. When hardware misbehaved, the **ILA (Integrated Logic Analyzer)** let me watch live signals sample by sample — an ECG of a running chip. And the testbench always came first: simulation is where you are allowed to be wrong cheaply, before silicon humiliates you in public.\n\n### Where it all led\n\nThat blinking LED slowly grew into my research life. On reconfigurable silicon I built **post-quantum cryptography accelerators** — hardware for **CRYSTALS-Kyber**, the NIST-standardized algorithm meant to survive quantum computers — implemented **K-RED, Plantard and Barrett-based modular multipliers**, fought **R-LWE arithmetic** cycle by cycle, and prototyped **RISC-V SoCs** of my own. Today, at IIT Mandi, I still design the way that first LED taught me: imagine, describe, verify, run, fail, reconfigure, repeat. The romance never left. It only became more technical.\n\n### One last thing, from the heart\n\nI never told that college girl how one question of hers quietly rebuilt the way I see engineering — and myself. Maybe someday, on a quiet evening, she reads this, smiles at the familiar lines, and recognises the lab, the question, and the boy who laughed too quickly.\n\n**Every problem has a programmable answer. Sometimes the only thing that needs a new configuration is you.**\n\nLife is an FPGA. The architecture is not fixed; **you write the logic.** Errors will come. Synthesis will fail. And after every broken bitstream there is a newer version of you, ready to run — as long as you keep the person you love in your constraints file.\n\nSo — to silicon, to patience, and to questions asked at exactly the right moment:\n\n**Program. Play. Repeat.** ❤️\n\n— Sahil"
  }];
  window.SM_DEFAULT_BLOGS = DEFAULT_BLOGS;

  var css = document.createElement("style");
  css.textContent = ".blog-sec{padding:clamp(44px,6vw,64px) 0;border-bottom:1px solid var(--border)}.blog-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr));gap:18px;margin-top:24px}.blog-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px 22px;cursor:pointer;transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;position:relative;overflow:hidden;display:flex;flex-direction:column;gap:10px}.blog-card::before{content:\"\";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--grad-btn);border-radius:4px 0 0 4px;z-index:1}.blog-card:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(60,40,140,.18);border-color:var(--accent)}.blog-thumb{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;display:block}.blog-tag{font-family:'JetBrains Mono',monospace;font-size:.64rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;padding:3px 10px;border-radius:999px;background:var(--soft);border:1px solid var(--border);color:var(--accent);align-self:flex-start}.blog-title{font-size:1.02rem;font-weight:700;line-height:1.35;margin:0;color:var(--text)}.blog-excerpt{font-size:.82rem;color:var(--muted);line-height:1.5;margin:0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.blog-meta{display:flex;align-items:center;gap:8px;margin-top:auto;padding-top:8px;border-top:1px dashed var(--border);font-family:'JetBrains Mono',monospace;font-size:.66rem;color:var(--muted)}.blog-ico{font-size:1.05rem;line-height:1}.blog-readmore{color:var(--accent);font-weight:600}.blog-empty{color:var(--muted);font-size:.86rem;text-align:center;padding:26px;background:var(--soft);border:1px dashed var(--border);border-radius:14px}.blog-modal{position:fixed;inset:0;background:rgba(10,8,30,.62);backdrop-filter:blur(6px);display:none;align-items:flex-start;justify-content:center;z-index:9999;padding:24px 14px;overflow-y:auto}.blog-modal.open{display:flex}.blog-article{background:var(--card);border:1px solid var(--border);border-radius:20px;max-width:720px;width:100%;padding:34px 34px 30px;position:relative;box-shadow:0 24px 60px rgba(10,8,30,.35);margin:auto;animation:blogIn .3s ease}@keyframes blogIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}.blog-close{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2}.blog-close:hover{background:var(--soft)}.blog-art-tag{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:.66rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;padding:4px 12px;border-radius:999px;background:var(--grad-btn);color:#fff;margin-bottom:12px}.blog-art-title{font-size:clamp(1.3rem,3vw,1.7rem);font-weight:800;line-height:1.3;margin:0 0 6px;background:var(--grad-ink);-webkit-background-clip:text;background-clip:text;color:transparent}.blog-art-date{font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--muted);margin-bottom:18px}.blog-art-body{font-size:.95rem;line-height:1.85;color:var(--text);white-space:pre-wrap;word-wrap:break-word}.blog-art-body strong{color:var(--accent)}.blog-art-txt{white-space:normal}.blog-art-txt h3{font-size:1.08rem;margin:20px 0 8px;color:var(--text)}.blog-art-photo{width:100%;border-radius:12px;margin:4px 0 14px;display:block;border:1px solid var(--border)}@media(max-width:600px){.blog-article{padding:24px 18px 22px;border-radius:16px}}";
  document.head.appendChild(css);

  var md = function (s) {
    if (s == null) return "";
    var t = String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--accent);font-weight:600">$1</a>');
    return t;
  };
  var esc = function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };

  var sec = document.createElement("section");
  sec.id = "blogs";
  sec.className = "blog-sec alt";
  sec.setAttribute("aria-label", "Blogs - Sahil Speaks");
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

  var modal = document.createElement("div");
  modal.className = "blog-modal";
  modal.innerHTML = "<div class='blog-article'><button class='blog-close' aria-label='Close'>✕</button><div class='blog-art-body'></div></div>";
  document.body.appendChild(modal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.classList.contains("blog-close")) modal.classList.remove("open");
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") modal.classList.remove("open"); });

  var render = function () {
    var src = (window.BLOGS && window.BLOGS.length) ? window.BLOGS : DEFAULT_BLOGS;
    var list = src.slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });
    if (!list.length) {
      sec.innerHTML = "<div class='wrap'><div class='section-head'><p class='kicker'>✒ · Blog</p><h2>Blogs — Sahil Speaks</h2><div class='rule'></div></div><p class='blog-empty'>No blogs published yet. Coming soon! ✍️</p></div>";
      return;
    }
    sec.innerHTML = "<div class='wrap'><div class='section-head'><p class='kicker'>✒ · Blog</p><h2>Blogs — Sahil Speaks</h2><div class='rule'></div><p class='muted'>Click a title to read the full blog.</p></div><div class='blog-grid'>" + list.map(function (b, i) {
      var txt = (b.body || "").replace(/\*\*/g, "");
      var ex = txt.length > 180 ? txt.slice(0, 180) + "…" : txt;
      var th = (Array.isArray(b.photos) && b.photos.length) ? "<img class='blog-thumb' src='" + esc(b.photos[0]) + "' alt='' loading='lazy'>" : "";
      return "<article class='blog-card' data-i='" + i + "'>" + th + "<span class='blog-tag'>" + esc(b.tag || "Blog") + "</span><h3 class='blog-title'>" + esc(b.title || "Untitled") + "</h3><p class='blog-excerpt'>" + esc(ex) + "</p><div class='blog-meta'><span class='blog-ico'>🖋️</span><span>" + esc(b.date || "") + "</span><span style='margin-left:auto' class='blog-readmore'>Read →</span></div></article>";
    }).join("") + "</div></div>";
    sec.querySelectorAll(".blog-card").forEach(function (c) {
      c.addEventListener("click", function () {
        var b = list[+c.dataset.i];
        var ph = (Array.isArray(b.photos) && b.photos.length) ? b.photos.map(function (p) { return "<img class='blog-art-photo' src='" + esc(p) + "' alt='' loading='lazy'>"; }).join("") : "";
        modal.querySelector(".blog-art-body").innerHTML = "<span class='blog-art-tag'>" + esc(b.tag || "Blog") + "</span><h2 class='blog-art-title'>" + esc(b.title || "") + "</h2><div class='blog-art-date'>" + esc(b.date || "") + "</div>" + ph + "<div class='blog-art-txt'>" + md(b.body || "") + "</div>";
        modal.classList.add("open");
        modal.scrollTop = 0;
      });
    });
  };
  render();
  setInterval(render, 3000);
})();
