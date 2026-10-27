/* app39.js - BLOGS "Sahil Speaks": cards + photos + beautiful reader. After Publications + nav link. DO NOT EDIT. */
(function () {
  "use strict";
  /* GUARD: script sirf EK baar chale (loader + direct tag dono se aa sakti hai) */
  if (window.SM_BLOGS_DONE) return;
  window.SM_BLOGS_DONE = true;
  if (typeof BLOGS === "undefined") window.BLOGS = [];
  var DEFAULT_BLOGS = [{
    title: "Play with FPGA — A Love Letter to Reconfigurable Silicon ❤️",
    tag: "FPGA",
    date: "2026-10-27",
    photos: [],
    body: "People still ask me why I chose hardware. I have never managed a short answer. Maybe because the real answer is not about hardware at all.\n\n### A degree, and a decision\n\nI completed my B.Tech in Electronics and Communication Engineering knowing exactly one thing for certain — that I did not want to merely use electronics. I wanted to make them. So I decided to pursue my M.Tech in VLSI and Embedded Systems, and IIIT Guwahati said yes.\n\nI thought I was going there to study chips. The institute, as it turned out, had planned two other introductions for me — a Zybo Z7 board, and a girl who could undo my entire worldview with a single question.\n\n### First meeting: the Zybo Z7\n\nMy first board was a **Zybo Z7** — small, black, unassuming, its JTAG cable coiled like a sleeping snake. The lab was empty that evening. I plugged it in, and the power LED glowed softly. That was all it did. And still, something in my chest shifted.\n\nMy first design was everyone's first design — a blinking LED. People call it trivial. Those people were not there at 9 PM, alone, grinning at a tiny dot of light obeying code written by my own hands. A piece of silicon was doing exactly what my mind had imagined. I had fallen in love. I just didn't know it yet.\n\nThey say love looks past the surface. So does a hardware engineer. I learned both lessons the same evening, from the same board.\n\n### What an FPGA actually is\n\nFPGA stands for **Field Programmable Gate Array**. It is a chip where **you decide the circuit** — not a factory. Under the black plastic lives a canvas of small blocks: **LUTs (Look-Up Tables)** that act as tiny logic functions, **flip-flops** that remember a single bit, **DSP slices** that multiply numbers fast, and **Block RAMs** that hold your data. Individually, they are nothing. But describe your design in **Verilog**, let **Xilinx Vivado** run synthesis, implementation and bitstream generation — and the tool quietly weaves your intent into that fabric. Program the board, and your hardware breathes. No factory. No masks. No months of waiting. Just an idea and an open canvas.\n\nAlan Kay once said, **\"The best way to predict the future is to invent it.\"** An FPGA is the cheapest ticket to that future that a student can buy.\n\n### The question\n\nThere was a girl at IIIT Guwahati in those days. Sharp. Quiet. Completely unimpressed by jargon. One evening she found me three hours deep into a failing timing report — red paths everywhere, violated constraints, me muttering at a machine that refused to listen. She watched for a while. Then she leaned in and asked:\n\n**\"If a chip can become anything you program it to be... why can't a person?\"**\n\nI laughed. Said something clever, the way twenty-two-year-olds do. Then I walked back to my hostel and couldn't sleep.\n\n*She asked me why a chip can change,*\n*I asked her why a heart can't stay.*\n*We both laughed at my clumsy rhyme —*\n*Neither of us had an answer anyway.*\n\nAn **ASIC** is fabricated once and frozen forever — like a person who decides at twenty who they are and never revisits the decision. A failed tapeout is a very expensive mistake. But an FPGA forgives. Every new bitstream is a **new version of the same silicon**. Failure never ruins the device — it is simply the previous configuration, quietly replaced by a better one.\n\nThat night I wrote in my lab notebook:\n\n*An FPGA teaches you to fall, learn, and reconfigure.*\n*Life asks exactly the same of us.*\n*And love — love is not finding a finished circuit.*\n*It is two people rewriting themselves for each other,*\n*without ever losing who they fundamentally are.*\n\n### The craft, with the heart still in it\n\nThe M.Tech taught me the discipline the hard way. **Constraints are promises** — an XDC file is you telling silicon exactly what you guarantee it can achieve. **Clock-domain crossings** are border checkpoints; cross without synchronizers and your data arrives corrupted, like a message lost between two lifetimes. **Timing closure** is a quiet love story told in nanoseconds — when setup and hold checks pass on every path, the design and the clock finally agree, two hearts in sync at a hundred megahertz. When hardware misbehaved, the **ILA (Integrated Logic Analyzer)** let me watch live signals sample by sample — an ECG of a running chip. And the testbench always came first. Always. Simulation is where you are allowed to be wrong cheaply, before silicon embarrasses you in public.\n\nAntoine de Saint-Exupéry wrote, **\"Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.\"** He was writing about literature. He could have been writing about a clean timing report. The night my static timing analysis finally passed with positive slack on every path, I sat there at 2 AM feeling exactly that — nothing left to add, nothing left to take away. Some people call it engineering. I call it a completed couplet.\n\n### Where it all led\n\nThat blinking LED slowly grew into my research life. On reconfigurable silicon I built **post-quantum cryptography accelerators** — hardware for **CRYSTALS-Kyber**, the NIST-standardized algorithm built to survive quantum computers — implemented **K-RED, Plantard and Barrett-based modular multipliers**, fought **R-LWE arithmetic** cycle by cycle, and prototyped **RISC-V SoCs** of my own. I graduated from IIIT Guwahati as batch topper, carried the story to IIT Mandi, and as a research scholar here, I still design the way that first LED taught me — imagine, describe, verify, run, fail, reconfigure, repeat.\n\nThe romance never left. It only became more technical.\n\n### One last thing\n\nI never told that girl how much one question of hers reshaped my engineering soul — and honestly, a little of how I saw myself. Maybe someday, on a quiet evening, she reads this, smiles at the familiar lines, and recognises the lab, the question, and the boy who laughed too quickly.\n\n*Some questions have no final answer —*\n*they just keep compiling, deeper each run.*\n*You asked yours once. I have been debugging mine*\n*ever since — and I hope it never ends in a done.*\n\n**Every problem has a programmable answer. Sometimes the only thing that needs a new configuration is you.**\n\nLife is an FPGA. The architecture is not fixed; you write the logic. Errors will come. Synthesis will fail. And after every broken bitstream there is a newer version of you, ready to run — as long as you keep the person you love in your constraints file.\n\nSo — to silicon, to patience, and to questions asked at exactly the right moment:\n\n**Program. Play. Repeat.** ❤️\n\n— Sahil"
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
