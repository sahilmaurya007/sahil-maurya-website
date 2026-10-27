/* app39.js - BLOGS "Sahil Speaks" section: title cards + beautiful full-blog reader modal. DO NOT EDIT. */
(function () {
  "use strict";
  if (typeof BLOGS === "undefined") window.BLOGS = [];
  /* DEFAULT BLOGS — jab tak editor se naya blog save nahi hota, yahi dikhega (FPGA se shuruaat ❤️) */
  var DEFAULT_BLOGS = [{
    title: "Play with FPGA — Meri Kahaani Silicon ke Saath ❤️",
    tag: "FPGA",
    date: "2026-10-27",
    body: "Life me kuch cheezein hain jo padhne me simple lagti hain, par sath jeene par bahut kuch sikha jati hain. FPGA meri zindagi ki aisi hi cheez hai — ek reconfigurable silicon jisne mujhe sikhaya ki **insaan bhi FPGA ki tarah hai: architecture fixed nahi hota, logic badla ja sakta hai.**\n\n### FPGA kya hai? — Sabse simple bhasha me\nFPGA ka full form hai **Field Programmable Gate Array**. Simple lafzon me — ye ek aisa chip hai jisme **aap apne hisaab se circuits bana sakte ho**, bilkul LEGO blocks ki tarah. Kabhi socha hai — agar aapke mobile ka processor aap khud design kar paate? FPGA me yahi possible hai. Aap Verilog me code likho, Xilinx Vivado me synthesis → implementation → bitstream generate karo, board par program karo — aur **aapka apna hardware taiyaar!** Koi factory nahi, koi mask-set nahi — sirf aapka idea, aur ek khula silicon.\n\n### FPGA aur zindagi — asli connection\nSocho: ASIC ek baar ban jaye to wahi rehta hai — jaise life ke kuch decisions, jo aage badhne ke baad badle nahi sakte. Par FPGA **reprogrammable** hai — har naya bitstream ek naya avatar. Nafrat-fail nahi, clean slate. Isi liye main kehta hoon:\n\n**FPGA sikhata hai — giro, seekho, aur dobara configure ho jao. Zindagi me bhi wahi.**\n\n### Thoda technical — romance thoda kam par dil se\nFPGA ke andar **LUTs (Look-Up Tables)**, flip-flops, DSP slices aur Block RAM ka ek poora **fabric** hota hai. Aap HDL me sirf apna intent likhte ho — LUT map karna, placement, routing, timing closure — ye sab tool aapke liye karta hai. Constraints sahi lagao, clock domains ka dhyan rakho, critical paths samjho — aur jab **timing analysis har path par slack ke saath PASS deta hai**, wo feeling... kisi shayari ke tasleem-e-sher se kam nahi. Debug me **ILA (Integrated Logic Analyzer)** kaam aata hai — jaise dil ki dhadkan ka live ECG. Simulation pehle (testbench likhna kabhi mat chhodo!), hardware baad me — **research ka romance yahi hai.**\n\n### Meri FPGA journey — chhoti si\nIIIT Guwahati ke dinon me pehla FPGA board haath me aaya — tab laga tha ki bas ek assignment hai. Aaj usi silicon pe maine **Post-Quantum Cryptography accelerators** banaye — Kyber ke modular multipliers, R-LWE designs, aur RISC-V SoC prototyping. Har naya design pehle simulation me fail hota tha, phir sudharta tha, phir ek din hardware par chal jata tha — **har timing closure ek mini-victory thi.**\n\n### Ik baat dil se\nFPGA ne mujhe sabse badi baat sikhayi:\n\n**Har problem ka ek programmable jawab hota hai — bas apni configuration badalni padti hai.**\n\nLife bhi ek FPGA hai — architecture fix nahi hai, logic **tum khud likhte ho**. Error aaega, synthesis fail hogi, par har bitstream ke baad ek naya version taiyaar hai. To aage kya?\n\n**Program. Play. Repeat.** ❤️\n\n— Sahil, jo silicon se dosti kar chuka hai"
  }];
  var css = document.createElement("style");
  css.textContent = ".blog-sec{padding:clamp(44px,6vw,64px) 0;border-bottom:1px solid var(--border)}.blog-head{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}.blog-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr));gap:18px;margin-top:24px}.blog-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px 22px;cursor:pointer;transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;position:relative;overflow:hidden;display:flex;flex-direction:column;gap:10px}.blog-card::before{content:\"\";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--grad-btn);border-radius:4px 0 0 4px}.blog-card:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(60,40,140,.18);border-color:var(--accent)}.blog-tag{font-family:'JetBrains Mono',monospace;font-size:.64rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;padding:3px 10px;border-radius:999px;background:var(--soft);border:1px solid var(--border);color:var(--accent);align-self:flex-start}.blog-title{font-size:1.02rem;font-weight:700;line-height:1.35;margin:0;color:var(--text)}.blog-excerpt{font-size:.82rem;color:var(--muted);line-height:1.5;margin:0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.blog-meta{display:flex;align-items:center;gap:8px;margin-top:auto;padding-top:8px;border-top:1px dashed var(--border);font-family:'JetBrains Mono',monospace;font-size:.66rem;color:var(--muted)}.blog-ico{font-size:1.05rem;line-height:1}.blog-readmore{color:var(--accent);font-weight:600}.blog-empty{color:var(--muted);font-size:.86rem;text-align:center;padding:26px;background:var(--soft);border:1px dashed var(--border);border-radius:14px}.blog-modal{position:fixed;inset:0;background:rgba(10,8,30,.62);backdrop-filter:blur(6px);display:none;align-items:flex-start;justify-content:center;z-index:9999;padding:24px 14px;overflow-y:auto}.blog-modal.open{display:flex}.blog-article{background:var(--card);border:1px solid var(--border);border-radius:20px;max-width:720px;width:100%;padding:34px 34px 30px;position:relative;box-shadow:0 24px 60px rgba(10,8,30,.35);margin:auto;animation:blogIn .3s ease}@keyframes blogIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}.blog-close{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center}.blog-close:hover{background:var(--soft)}.blog-art-tag{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:.66rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;padding:4px 12px;border-radius:999px;background:var(--grad-btn);color:#fff;margin-bottom:12px}.blog-art-title{font-size:clamp(1.3rem,3vw,1.7rem);font-weight:800;line-height:1.3;margin:0 0 6px;background:var(--grad-ink);-webkit-background-clip:text;background-clip:text;color:transparent}.blog-art-date{font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--muted);margin-bottom:18px}.blog-art-body{font-size:.95rem;line-height:1.85;color:var(--text);white-space:pre-wrap;word-wrap:break-word}.blog-art-body strong{color:var(--accent)}.blog-art-txt{white-space:normal}.blog-art-txt h3{font-size:1.08rem;margin:20px 0 8px;color:var(--text)}@media(max-width:600px){.blog-article{padding:24px 18px 22px;border-radius:16px}}";
  document.head.appendChild(css);
  var md = function (s) {
    if (s == null) return "";
    var t = String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--accent);font-weight:600">$1</a>');
    return t;
  };
  var sec = document.createElement("section");
  sec.id = "blogs";
  sec.className = "blog-sec";
  sec.setAttribute("aria-label", "Blogs - Sahil Speaks");
  var galSec = document.getElementById("gallery");
  if (galSec) galSec.before(sec); else document.getElementById("main").appendChild(sec);
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
      sec.innerHTML = "<div class='wrap'><div class='section-head'><p class='kicker'>✒ · Blog</p><h2>Blogs — Sahil Speaks</h2><div class='rule'></div></div><p class='blog-empty'>Abhi koi blog published nahi hai. Jaldi aa raha hai! ✍️</p></div>";
      return;
    }
    sec.innerHTML = "<div class='wrap'><div class='section-head'><p class='kicker'>✒ · Blog</p><h2>Blogs — Sahil Speaks</h2><div class='rule'></div><p class='muted'>Title par click karo — poora blog khul jayega.</p></div><div class='blog-grid'>" + list.map(function (b, i) {
      var txt = (b.body || "").replace(/\*\*/g, "");
      var ex = txt.length > 180 ? txt.slice(0, 180) + "…" : txt;
      return "<article class='blog-card' data-i='" + i + "'><span class='blog-tag'>" + (b.tag || "Blog") + "</span><h3 class='blog-title'>" + (b.title || "Untitled") + "</h3><p class='blog-excerpt'>" + ex + "</p><div class='blog-meta'><span class='blog-ico'>🖋️</span><span>" + (b.date || "") + "</span><span style='margin-left:auto' class='blog-readmore'>Read →</span></div></article>";
    }).join("") + "</div></div>";
    sec.querySelectorAll(".blog-card").forEach(function (c) {
      c.addEventListener("click", function () {
        var b = list[+c.dataset.i];
        modal.querySelector(".blog-art-body").innerHTML = "<span class='blog-art-tag'>" + (b.tag || "Blog") + "</span><h2 class='blog-art-title'>" + (b.title || "") + "</h2><div class='blog-art-date'>" + (b.date || "") + "</div><div class='blog-art-txt'>" + md(b.body || "") + "</div>";
        modal.classList.add("open");
        modal.scrollTop = 0;
      });
    });
  };
  render();
  setInterval(render, 3000);
})();
