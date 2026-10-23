/* app4.js — loader (DO NOT EDIT). Injects login/pencil/background styles + loads app5.js (modes+bg) and app6.js (editor+lightbox). */
(function () {
  "use strict";
  var css = "";
  css += ".edit-fab{position:fixed;bottom:22px;right:22px;z-index:950;width:54px;height:54px;border-radius:50%;border:none;cursor:pointer;background:var(--grad-btn,#5d60e3);color:#fff;font-size:1.35rem;display:grid;place-items:center;box-shadow:0 12px 30px rgba(0,0,0,.3);padding:0}";
  css += ".edit-fab-menu{position:fixed;bottom:88px;right:22px;z-index:949;min-width:250px;max-width:320px;background:var(--card,#fff);border:1px solid var(--border,#e6e4f3);border-radius:16px;box-shadow:0 16px 40px rgba(0,0,0,.22);padding:8px;display:none;flex-direction:column;gap:2px}";
  css += ".edit-fab-menu.open{display:flex}";
  css += ".edit-fab-menu a{display:flex;gap:10px;padding:10px 12px;border-radius:11px;color:var(--text,#1c1a2e);text-decoration:none;font-size:.88rem}";
  css += ".edit-fab-menu a:hover{background:var(--soft,#f1f0fb)}";
  css += ".edit-fab-menu .sub{font-size:.7rem;color:var(--muted,#5f5c78)}";
  css += ".edit-fab-menu .ic{width:24px;text-align:center;font-size:1.05rem}";
  css += ".login-mask{position:fixed;inset:0;z-index:1200;background:rgba(8,6,22,.55);display:none;place-items:center;padding:20px}";
  css += ".login-mask.open{display:grid}";
  css += ".login-card{width:min(380px,100%);background:var(--card,#fff);border:1px solid var(--border,#e6e4f3);border-radius:18px;padding:26px;box-shadow:0 20px 60px rgba(0,0,0,.35)}";
  css += ".login-card h3{margin:0 0 6px;font-size:1.1rem}";
  css += ".login-card p{margin:0 0 16px;font-size:.82rem;color:var(--muted,#5f5c78)}";
  css += ".login-card label{display:block;font-size:.74rem;font-weight:600;color:var(--muted,#5f5c78);margin:12px 0 5px;text-transform:uppercase;letter-spacing:.06em}";
  css += ".login-card input{width:100%;padding:11px 13px;border-radius:11px;border:1px solid var(--border,#e6e4f3);background:var(--bg,#f7f7fc);color:var(--text,#1c1a2e);font-size:.92rem;outline:none;box-sizing:border-box}";
  css += ".login-card input:focus{border-color:#6366f1}";
  css += ".login-card button{width:100%;margin-top:16px;padding:12px;border:none;border-radius:12px;background:linear-gradient(115deg,#5d60e3,#944bda 50%,#158191);color:#fff;font-weight:600;font-size:.95rem;cursor:pointer}";
  css += ".login-err{min-height:18px;margin-top:10px;font-size:.78rem;color:#e5484d}";
  css += "html[data-bg=aurora] body::before{content:'';position:fixed;inset:0;z-index:-1;background:radial-gradient(600px 400px at 15% 10%,rgba(99,102,241,.18),transparent 60%),radial-gradient(500px 380px at 85% 80%,rgba(25,155,175,.15),transparent 60%)}";
  css += "html[data-bg=grid] body::before{content:'';position:fixed;inset:0;z-index:-1;background-image:linear-gradient(rgba(99,102,241,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.08) 1px,transparent 1px);background-size:44px 44px}";
  css += "html[data-bg=mesh] body::before{content:'';position:fixed;inset:0;z-index:-1;background:radial-gradient(520px 360px at 80% 15%,rgba(168,85,247,.13),transparent 60%),radial-gradient(520px 360px at 15% 85%,rgba(244,236,216,.22),transparent 60%)}";
  css += "html[data-bg=dots] body::before{content:'';position:fixed;inset:0;z-index:-1;background-image:radial-gradient(rgba(99,102,241,.14) 1.5px,transparent 1.5px);background-size:26px 26px}";
  css += "html[data-bg=wave] body::before{content:'';position:fixed;inset:0;z-index:-1;background:radial-gradient(700px 300px at 20% 110%,rgba(23,125,160,.12),transparent 55%),radial-gradient(600px 260px at 90% -10%,rgba(34,142,131,.10),transparent 55%)}";
  css += ".bg-h{margin-top:14px}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);
  ["app5.js", "app6.js"].forEach(function (src) {
    var s = document.createElement("script");
    s.src = src;
    document.body.appendChild(s);
  });
})();
