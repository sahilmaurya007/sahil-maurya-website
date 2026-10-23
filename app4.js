/* ============================================================
   THEMES (app4.js) — 7 eye-friendly modes + theme chooser.
   IS FILE KO EDIT KARNE KI ZAROORAT NAHI:
   Naya color mode chahiye to theme-presets.css me ek block add
   hota hai. Ye sirf switch UI + save handle karta hai.
   ============================================================ */
(function () {
  "use strict";
  const THEMES = [
    { id: "daylight", label: "Daylight", icon: "☀", swatch: "linear-gradient(135deg,#6366f1,#a855f7 60%,#199baf)" },
    { id: "night", label: "Night", icon: "🌙", swatch: "linear-gradient(135deg,#2b2b45,#4c4c77 60%,#65d8e6)" },
    { id: "sepia", label: "Sepia", icon: "📜", swatch: "linear-gradient(135deg,#f4eddf,#9b6339 65%)" },
    { id: "sage", label: "Sage Green", icon: "🌿", swatch: "linear-gradient(135deg,#eef3ed,#397653 65%)" },
    { id: "ocean", label: "Ocean Blue", icon: "🌊", swatch: "linear-gradient(135deg,#edf5f8,#177da0 65%)" },
    { id: "lavender", label: "Lavender", swatch: "linear-gradient(135deg,#f3eff8,#8157a8 65%)" },
    { id: "contrast", label: "High Contrast", swatch: "linear-gradient(135deg,#fff,#123ec4 65%)" },
  ];
  const KEY = "sm-theme-preset";
  const doc = document.documentElement;
  const getSaved = () => {
    try { return localStorage.getItem(KEY) || "daylight"; } catch (e) { return "daylight"; }
  };
  const applyTheme = (id) => {
    doc.setAttribute("data-theme", id);
    try { localStorage.setItem(KEY, id); } catch (e) {}
  };
  const btn = document.getElementById("themeBtn");
  if (btn) {
    const oldBtn = document.getElementById("oldThemeToggle");
    if (oldBtn) oldBtn.remove();
    const picker = document.createElement("div");
    picker.className = "theme-picker";
    picker.setAttribute("role", "dialog");
    picker.setAttribute("aria-label", "Theme selection");
    picker.innerHTML = `
      <p class="theme-picker-title">Themes</p>
      <div class="theme-options"></div>
      <p class="theme-picker-hint">Choice is saved for next visits.</p>`;
    document.querySelector(".nav").appendChild(picker);
    const optionsBox = picker.querySelector(".theme-options");
    const renderOptions = () => {
      const current = doc.getAttribute("data-theme");
      optionsBox.innerHTML = THEMES.map(t => `
        <button class="theme-option" data-id="${t.id}" aria-pressed="${t.id === current}">
          <span class="theme-swatch" style="background:${t.swatch}"></span>
          ${t.icon} ${t.label}
        </button>`).join("");
      optionsBox.querySelectorAll(".theme-option").forEach(b =>
        b.addEventListener("click", () => { applyTheme(b.dataset.id); renderOptions(); }));
    };
    applyTheme(getSaved());
    renderOptions();
    const togglePicker = (show) => {
      picker.classList.toggle("open", show);
      btn.setAttribute("aria-expanded", show ? "true" : "false");
    };
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePicker(!picker.classList.contains("open"));
    });
    document.addEventListener("click", (e) => {
      if (!picker.contains(e.target) && e.target !== btn) togglePicker(false);
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") togglePicker(false); });
    btn.title = "Choose theme";
    btn.textContent = THEMES.find(t => t.id === getSaved())?.icon || "🎨";
  }
})();
