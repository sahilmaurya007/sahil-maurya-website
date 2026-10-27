/* app39.js - BLOGS "Sahil Speaks": cards + photos + beautiful reader. After Publications + nav link. DO NOT EDIT. */
(function () {
  "use strict";
  if (typeof BLOGS === "undefined") window.BLOGS = [];
  /* DEFAULT BLOG — detailed, technical + romantic. Editable via GUI. */
  var DEFAULT_BLOGS = [{
    title: "Play with FPGA — A Love Letter to Reconfigurable Silicon ❤️",
    tag: "FPGA",
    date: "2026-10-27",
    photos: [],
    body: "They say you never forget your first board. Mine arrived in a dull grey box at IIIT Guwahati — a humble Artix-7 with its JTAG cable coiled like a sleeping snake. The lab was empty that evening. I remember plugging it in, seeing the power LED glow, and feeling something strange in my chest. **I did not know it yet, but I had just fallen in love.**\n\n### What is an FPGA, really? — The simplest possible answer\nFPGA stands for **Field Programmable Gate Array**. Think of it as a chip where **you decide the circuit** — not the factory. Imagine a silicon canvas holding thousands of tiny blocks: **LUTs (Look-Up Tables)** that act as small logic functions, **flip-flops** that remember one bit each, **DSP slices** that multiply numbers fast, and **Block RAMs** that store what your design needs. By themselves, these blocks mean nothing. But describe your design in **Verilog** or **VHDL**, run synthesis → implementation → bitstream generation in **Xilinx Vivado**, and the tool weaves your intent into that fabric. Program the board — and **your hardware is alive.** No factory. No masks. No waiting. Just an idea and an open canvas.\n\n### First date: blink the LED\nEvery hardware engineer's first program is the same — make an LED blink. It sounds trivial. It is not. The moment that LED pulsed to my code for the first time, I sat there grinning like a fool at a tiny blinking red dot, alone in a lab at 9 PM. That dot was not just a light. **It was a piece of silicon doing exactly what my mind had imagined.** If that is not magic disguised as engineering, I do not know what is.\n\n### The girl who asked the right question\nNow, to the honest part of this story — because no love letter is complete without one.\n\nIn my M.Tech days, there was a girl in my batch. Sharp, kind, and completely unimpressed by jargon — she could smell a bluff from a kilometre away. One evening at the lab, she watched me fight my FPGA for the third hour straight. Timing report red, paths failing, me muttering about constraints. She leaned over and asked the question that changed how I see everything:\n\n**\"If the chip can become anything you program it to be... why can't people?\"**\n\nI laughed it off that night. But driving back to my room, the question refused to leave. An **ASIC** is fabricated once and frozen forever — like a person who decides at twenty-two who they are and never revisits it. An **FPGA** is reprogrammable — every new bitstream is a **new version of the same silicon**. Same substrate. New logic. Failure does not ruin the device; it is simply **the previous bitstream**, replaced by a better one.\n\nThat is when it clicked, and I have never unlearned it since:\n\n**An FPGA teaches you to fall, learn, and reconfigure yourself. Life asks exactly the same of us. And love — real love — is not finding a perfect fixed circuit. It is finding someone you keep reprogramming yourself for, and who reprograms themselves for you, without ever losing who they fundamentally are.**\n\n### Getting technical — with the heart still in it\nLet me walk you through the real craft, because romance without depth is just decoration.\n\n**1. Constraints are promises.** When you write an XDC file, you are not nagging the tool — you are telling silicon what you promise it can achieve. Respect **clock domains**, and treat every crossing like a border checkpoint: **CDC synchronizers** or your data arrives corrupted, like a message sent across two different lifetimes.\n\n**2. Timing closure is a love story in nanoseconds.** Setup and hold checks, slack on every path — when **static timing analysis passes with positive slack**, the design and the clock are finally in agreement. It is two hearts beating in sync at 100 MHz. I have closed timing at 2 AM and felt the same warmth that a completed couplet gives a poet.\n\n**3. ILA is the heartbeat monitor.** When hardware misbehaves, the **Integrated Logic Analyzer** lets you look inside a running design — live signals, sample by sample, like an ECG of your chip. Debugging is not a chore; it is a doctor listening to a patient talk.\n\n**4. Simulation first, always.** A **testbench** is where you get to be wrong cheaply. Skip it and hardware will humiliate you in public. Every design I have shipped to silicon was first broken, fixed, and re-loved inside simulation.\n\n### The deep end: where FPGAs took me\nWhat began as a blinking LED quietly became my research life. On the same philosophy of reconfigurable silicon, I now build **post-quantum cryptography accelerators** — hardware implementations of **CRYSTALS-Kyber**, NIST's standardized algorithm meant to survive quantum computers. I have implemented **K-RED, Plantard, and Barrett-based modular multipliers**, fought **R-LWE arithmetic** cycle by cycle, and prototyped **RISC-V SoCs** — my own processors, my own instruction flows, on boards that cost less than a dinner date.\n\nThe romance is still there. It only got more technical.\n\n### One last thing, from the heart\nI never told that girl how much one question of hers reshaped my engineering soul. Maybe some day she reads this on a quiet evening, smiles, and recognizes herself between the lines. FPGA taught me its biggest lesson quietly, through her:\n\n**Every problem has a programmable answer. Sometimes the only thing that needs a new configuration is you.**\n\nLife is an FPGA. The architecture is not fixed; **you write the logic.** Errors will come. Synthesis will fail. And after every failed bitstream, there is a newer version of you, ready to run — **as long as you keep the person you love in your constraints file.**\n\nSo — to silicon, to patience, and to questions asked at exactly the right moment:\n\n**Program. Play. Repeat.** ❤️\n\n— Sahil, who quietly fell in love with silicon"
  }];
  window.SM_DEFAULT_BLOGS = DEFAULT_BLOGS;

  var css = document.createElement("style");
  css.textContent = ".blog-sec{padding:clamp(44px,6vw,64px) 0;border-bottom:1px solid var(--border)}.blog-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr));gap:18px;margin-top:24px}.blog-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px 22px;cursor:pointer;transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;position:relative;overflow:hidden;display:flex;flex-direction:column;gap:10px}.blog-card::before{content:\"\";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--grad-btn);border-radius:4px 0 0 4px;z-index:1}.blog-card:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(60,40,140,.18);border-color:var(--accent)}.blog-thumb{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;display:block}.blog-tag{font-family:'JetBrains Mono',monospace;font-size:.64rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;padding:3px 10px;border-radius:999px;background:var(--soft);border:1px solid var(--border);color:var(--accent);align-self:flex-start}.blog-title{font-size:1.02rem;font-weight:700;line-height:1.35;margin:0;color:var(--text)}.blog-excerpt{font-size:.82rem;color:color-mix(in srgb,var(--muted) 75%,transparent);line-height:1.5;margin:0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.blog-meta{display:flex;align-items:center;gag:8px;margin-top:auto;padding-top:8px;border-top:1px dashed var(--border);font-family:'JetBrains Mono',monospace;font-size:.66rem;color:var(--muted)}.blog-ico{font-size:1.05rem;line-height:1}.blog-readmore{color:var(--accent);font-weight:600}.blog-empty{color:var(--muted);font-size:.86rem;text-align:center;padding:26px;background:var(--soft);border-meta:1px dashed var(--border);border-radius:14px}.blog-modal{position:fixed;inset:0;background:rgba(10,8,30,.62);backdrop-filter:blur(6px);display:none;align-items:flex-start;justify-content:center;z-index:9999;padding:24px 14px;overflow-y:auto}.blog-modal.open{display:flex}.blog-article{background:var(--card);border:1px solid var(--border);border-radius:20px;max-width:720px;width:100%;padding:34px 34px 30px;position:relative;box-shadow:0 24px 60px rgba(10,8,30,.35);margin:auto;animation:blogIn .3s ease}@keyframes blogIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}.blog-close{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2}.blog-close:hover{background:var(--soft)}.blog-art-tag{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:.66rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;padding:4px 12px;border-radius:999px;background:var(--grad-btn);color:#fff;margin-bottom:12px}.blog-art-title{font-size:clamp(1.3rem,3vw,1.7rem);font-weight:800;line-height:1.3;margin:0 0 6px;background:var(--grad-ink);-webkit-background-clip:text;background-clip:text;color:transparent}.blog-art-date{font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--muted);margin-bottom:18px}.blog-art-body{font-size:.95rem;line-height:1.85;color:var(--text);white-space:pre-wrap;word-wrap:break-word}.blog-art-body strong{color:var(--accent)}.blog-art-txt{white-space:normal}.blog-art-txt h3{font-size:1.08rem;margin:20px 0 8px;color:var(--text)}.blog-art-photo{width:100%;border-radius:12px;margin:4px 0 14px;display:block;border:1px solid var(--border)}@media(max-width:600px){.blog-article{padding:24px 18px 22px;border-radius:16px}}";
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
  /* PROFESSIONAL POSITION: right after Publications (research → writing flow) */
  var pubSec = document.getElementById("publications");
  var galSec = document.getElementById("gallery");
  if (pubSec) pubSec.after(sec);
  else if (galSec) galSec.before(sec);
  else document.getElementById("main").appendChild(sec);

  /* NAV MENU: Blogs link after Publications */
  var nav = document.getElementById("navLinks");
  if (nav) {
    var bl = document.createElement("a");
    bl.href = "#blogs"; bl.textContent = "Blogs";
    var pubLink = nav.querySelector('a[href="#publications"]');
    if (pubLink) pubLink.after(bl); else nav.appendChild(bl);
  }

  var modal = document.createElement("div");\  modal.className = "blog-modal";
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
        var b = list[+c.dataset;
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
