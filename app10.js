/* app10.js - lightbox, Tier 1 badge, Connect rename. DO NOT EDIT. */
(function () {
  "use strict";
  var lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = "<button class='lb-close' aria-label='Close'>X</button><button class='lb-prev' aria-label='Prev'>&#8249;</button><img src='' alt=''><button class='lb-next' aria-label='Next'>&#8250;</button><div class='lb-cap'></div>";
  document.body.appendChild(lightbox);
  var lbImg = lightbox.querySelector("img");
  var lbCap = lightbox.querySelector(".lb-cap");
  var lbList = [], lbIdx = 0;
  var show = function (i) {
    lbIdx = (i + lbList.length) % lbList.length;
    var it = lbList[lbIdx];
    lbImg.src = it.src; lbImg.alt = it.cap; lbCap.textContent = it.cap;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  var close = function () { lightbox.classList.remove("open"); document.body.style.overflow = ""; };
  lightbox.querySelector(".lb-close").addEventListener("click", close);
  lightbox.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); show(lbIdx - 1); });
  lightbox.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); show(lbIdx + 1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(lbIdx - 1);
    if (e.key === "ArrowRight") show(lbIdx + 1);
  });
  var wire = function () {
    document.querySelectorAll(".gal-item img, .tl-photo img, .news-media img").forEach(function (img) {
      if (img.dataset.lbwired) return;
      img.dataset.lbwired = "1";
      img.style.cursor = "zoom-in";
      img.addEventListener("click", function (e) {
        e.stopPropagation();
        lbList = Array.from(document.querySelectorAll(".gal-item img, .tl-photo img"))
          .filter(function (i) { return i.src; })
          .map(function (i) { return { src: i.src, cap: i.alt || "" }; });
        if (!lbList.length) lbList = [{ src: img.src, cap: img.alt }];
        var pos = lbList.findIndex(function (x) { return x.src === img.src; });
        show(pos < 0 ? 0 : pos);
      });
    });
  };
  wire();
  new MutationObserver(function () { wire(); }).observe(document.body, { childList: true, subtree: true });

  var tier = function () {
    document.querySelectorAll(".pub-meta, .card, .tl-card, .nl-text").forEach(function (el) {
      if (el.dataset.tierdone) return;
      if (el.textContent && el.textContent.indexOf("Tier 1") !== -1) {
        el.dataset.tierdone = "1";
        el.innerHTML = el.innerHTML.split("Tier 1").join("<strong class='tier1'>Tier 1</strong>");
      }
    });
  };
  tier();
  new MutationObserver(function () { tier(); }).observe(document.body, { childList: true, subtree: true });

  var rename = function () {
    document.querySelectorAll(".foot h4, .lab-k, .contact-item .lab").forEach(function (el) {
      if (el.textContent.trim() === "Elsewhere") el.textContent = "Connect";
    });
  };
  rename();
  new MutationObserver(function () { rename(); }).observe(document.body, { childList: true, subtree: true });
})();
