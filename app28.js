/* app28.js - gal-cap photo ke NEECHE (overlay hata). DO NOT EDIT. */
(function () {
  "use strict";
  var css = document.createElement("style");
  css.textContent = ".gal-item{display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--border);border-radius:14px;background:var(--card);box-shadow:var(--shadow)}.gal-item .gal-media{width:100%;aspect-ratio:4/3;overflow:hidden;background:var(--soft)}.gal-item .gal-media img{width:100%;height:100%;object-fit:contain;transition:transform .35s ease;display:block}.gal-item:hover .gal-media img{transform:scale(1.04)}.gal-item .gal-cap{position:static;background:none;color:var(--text);padding:10px 12px 12px;font-size:.8rem;line-height:1.4;order:2}.gal-item .gal-cap .gal-meta{color:var(--muted);font-size:.72rem;margin-top:2px}.gal-item.noimg{display:grid;place-items:center;color:var(--muted);font-size:.85rem;text-align:center;padding:10px}.gal-item.noimg .gal-cap{position:static;background:none;color:var(--muted);padding:0;font-size:.85rem}";
  document.head.appendChild(css);
  var patch = function () {
    document.querySelectorAll(".gal-item").forEach(function (fig) {
      if (fig.querySelector(".gal-media")) return;
      var img = fig.querySelector("img");
      if (!img) return;
      var media = document.createElement("div");
      media.className = "gal-media";
      fig.insertBefore(media, fig.firstChild);
      media.appendChild(img);
    });
  };
  patch();
  new MutationObserver(function () { setTimeout(patch, 60); }).observe(document.body, { childList: true, subtree: true });
})();
