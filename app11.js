/* app11.js - GUI editor shell. Direct const refs + SM.render exposure. News/Gallery tabs app20/app21 me. DO NOT EDIT. */
(function () {
  "use strict";
  var SM = window.SM_EDITOR;
  if (!SM) return;
  var css = document.createElement("style");
  css.textContent = ".ed-f{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}.ed-f label{font-size:.72rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}.ed-f textarea,.ed-f input{padding:9px 11px;border-radius:9px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:.84rem;font-family:inherit;outline:none;box-sizing:border-box;width:100%}.ed-f textarea{min-height:70px;resize:vertical}.ed-cardbox{border:1px solid var(--border);border-radius:12px;padding:12px;margin-bottom:10px;background:var(--bg2)}.ed-cardbox-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.ed-cardbox-h b{font-size:.82rem}.ed-del{background:none;border:1px solid #e5484d;color:#e5484d;border-radius:7px;padding:3px 10px;font-size:.72rem;cursor:pointer}.ed-add{width:100%;padding:9px;border:1px dashed var(--accent);background:none;color:var(--accent);border-radius:10px;font-size:.8rem;cursor:pointer;margin-bottom:10px}.ed-body-box{padding:14px 16px;overflow-y:auto;flex:1}.ed-tabs{display:flex;flex-wrap:wrap;gap:6px;padding:10px 16px 0}.ed-foot{display:flex;gap:10px;align-items:center;padding:12px 16px;border-top:1px solid var(--border);flex-wrap:wrap}.ed-msg{font-size:.76rem;color:#16a34a}.ed-err{color:#e5484d}.ed-card{display:flex;flex-direction:column;max-height:88vh}";
  document.head.appendChild(css);

  var ed = document.createElement("div");
  ed.className = "ed-modal";
  ed.innerHTML = "<div class='ed-card'><div class='ed-head'><strong>Edit website</strong><span style='display:flex;gap:8px'><button class='ed-logout' type='button'>Logout</button><button class='ed-close' type='button'>X</button></span></div><div class='ed-tabs'></div><div class='ed-body-box'></div><div class='ed-foot'><button class='ed-preview' type='button'>Preview</button><button class='ed-save' type='button'>Save &amp; Submit</button><span class='ed-msg'></span></div></div>";
  document.body.appendChild(ed);
  SM.ed = ed;
  SM.msg = function (t, err) { var m = ed.querySelector(".ed-msg"); m.textContent = t || ""; m.className = "ed-msg" + (err ? " ed-err" : ""); };

  var TABS = [["about", "About"], ["hero", "Hero"], ["news", "News"], ["papers", "Papers"], ["awards", "Awards"], ["skills", "Skills"], ["journey", "Journey"], ["photo", "Photo"], ["gallery", "Gallery"], ["visitors", "Visitors"], ["github", "GitHub"]];
  var cur = "about";
  ed.querySelector(".ed-tabs").innerHTML = TABS.map(function (t) { return "<button class='ed-tab' data-t='" + t[0] + "'>" + t[1] + "</button>"; }).join("");
  ed.querySelectorAll(".ed-tab").forEach(function (b) { b.addEventListener("click", function () { cur = b.dataset.t; render(); }); });
  ed.querySelector(".ed-close").addEventListener("click", function () { ed.classList.remove("open"); });
  ed.querySelector(".ed-logout").addEventListener("click", function () { if (SM.setLoggedOut) SM.setLoggedOut(); ed.classList.remove("open"); });

  SM.f = function (parent, label, val, ta) {
    var w = document.createElement("div"); w.className = "ed-f";
    w.innerHTML = "<label>" + label + "</label>";
    var inp = document.createElement(ta ? "textarea" : "input");
    inp.value = val == null ? "" : val;
    w.appendChild(inp); parent.appendChild(w); return inp;
  };
  SM.box = function (parent, title) {
    var c = document.createElement("div"); c.className = "ed-cardbox";
    c.innerHTML = "<div class='ed-cardbox-h'><b>" + title + "</b><button class='ed-del' type='button'>Delete</button></div>";
    parent.appendChild(c); return c;
  };
  SM.onDel = function (card, arr, i) { card.querySelector(".ed-del").addEventListener("click", function () { arr.splice(i, 1); SM.render(); }); };
  SM.emptyList = function (body, txt) { var p = document.createElement("p"); p.style.cssText = "color:var(--muted);font-size:.78rem"; p.textContent = txt || "No items yet."; body.appendChild(p); };

  var D = function (name, fallback) { try { var v = eval(name); return v == null ? fallback : v; } catch (e) { return fallback; } };

  SM.begin = function () {
    SM.w = {
      about: (D("ABOUT", []) || []).slice(),
      intro: (D("PROFILE", {}) || {}).intro || "",
      news: (D("NEWS", []) || []).map(function (x) { return { type: x.type || "Update", text: x.text || "", link: x.link || "", date: x.date || "", photo: x.photo || "" }; })
    };
  };
  SM.open = function () { SM.begin(); render(); ed.classList.add("open"); SM.msg(""); };

  function render() {
    ed.querySelectorAll(".ed-tab").forEach(function (b) { b.classList.toggle("active", b.dataset.t === cur); });
    var body = ed.querySelector(".ed-body-box"); body.innerHTML = "";
    if (cur === "about") {
      if (!SM.w.about.length) SM.emptyList(body, "Bio abhi khali hai - + Add paragraph se likhna shuru karo.");
      SM.w.about.forEach(function (p, i) {
        var c = SM.box(body, "Paragraph " + (i + 1));
        var t = SM.f(c, "Bio paragraph", p, true);
        t.addEventListener("input", function () { SM.w.about[i] = t.value; });
        SM.onDel(c, SM.w.about, i);
      });
      var add = document.createElement("button"); add.className = "ed-add"; add.textContent = "+ Add paragraph"; add.type = "button";
      add.addEventListener("click", function () { SM.w.about.push(""); render(); });
      body.appendChild(add);
    } else if (cur === "hero") {
      var t2 = SM.f(body, "Hero intro (tagline under your name)", SM.w.intro, true);
      t2.addEventListener("input", function () { SM.w.intro = t2.value; });
    } else if (cur === "visitors") {
      var list = [];
      try { list = JSON.parse(localStorage.getItem("sm-iplist") || "[]"); } catch (e) {}
      body.innerHTML = "<div class='ed-f' style='color:var(--muted);font-size:.78rem'>Private - sirf aapko dikhta hai. Har visit ka IP + time (is browser me recorded).</div>";
      list.slice().reverse().forEach(function (v) {
        var c = SM.box(body, v.t || "");
        c.querySelector(".ed-cardbox-h").innerHTML = "<b>" + (v.ip || "-") + "</b>";
        c.innerHTML += "<div style='font-size:.74rem;color:var(--muted)'>Time: " + (v.t || "") + "</div>";
      });
      if (!list.length) body.innerHTML += "<p style='color:var(--muted);font-size:.8rem'>Abhi koi visit record nahi hui.</p>";
    } else if (SM.renderTab) { SM.renderTab(cur, body); }
    else { body.innerHTML = "<p style='color:var(--muted)'>Loading...</p>"; }
  }
  SM.render = render;
})();
