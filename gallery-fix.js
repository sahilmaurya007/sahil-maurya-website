/* gallery-fix.js — data4.js ke purane gallery override ko correct karta hai.
   Album names: IIT Mandi Snapshot / IIIT Guwahati Moments (profile README se match).
   Broken paths: sahil.jpeg → sahiil.jpeg (repo me asli naam).
   NOTE: data4.js me saved editor overrides hote hain; ye patch uske baad
   chalta hai aur gallery ko correct data se replace karta hai. Editor
   dwara future Save & Submit naya data4.js banayega to ye file koi nuksan
   nahi karegi (same correct data apply hogi). */
(function () {
  "use strict";
  if (typeof GALLERY_CATEGORIES === "undefined") window.GALLERY_CATEGORIES = [];
  var G = [
    { name: "Lab Moments", photos: [
      { src: "image/sahiil.jpeg", caption: "At the lab" },
      { src: "image/WhatsApp Image 2026-03-05 at 2.58.51 PM.jpeg", caption: "Lab moment" },
      { src: "image/Poster Landscape.png", caption: "Research poster at A²DSL" },
      { src: "image/7.jpeg", caption: "𝐓𝐞𝐚𝐜𝐡𝐢𝐧𝐠 𝐀𝐬𝐬𝐢𝐬𝐭𝐚𝐧𝐭 𝐬𝐞𝐬𝐬𝐢𝐨𝐧 𝐟𝐨𝐫 𝐕𝐋-𝟒𝟎𝟏: 𝐑𝐓𝐋 𝐃𝐞𝐬𝐢𝐠𝐧 𝐚𝐧𝐝 𝐕𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐭𝐢𝐨𝐧. · 𝐕𝐋-𝟒𝟎𝟏 𝐓𝐀𝐬𝐡𝐢𝐩 - 𝐌𝐨𝐧𝐬𝐨𝐨𝐧 𝐒𝐞𝐦 𝟐𝟎𝟐𝟓 · 2025-11-27 · Photo: Sahil Maurya" }
    ]},
    { name: "Chip Gallery", photos: [
      { src: "image/Chip2GF180nm.png", caption: "GF180nm Technology" },
      { src: "image/chip1skywater130nm.png", caption: "SkyWater 130nm" },
      { src: "image/chip3ASAPnm.png", caption: "ASAP 7nm" },
      { src: "image/chip4nangate45nm.png", caption: "Nangate 45nm" },
      { src: "image/Complete soc.jpeg", caption: "RISC-V SoC" },
      { src: "image/Full_Adder_IOPlanning.png", caption: "I/O Planning" },
      { src: "image/full_adder_floarplanning.png", caption: "Floorplan" }
    ]},
    { name: "IIT Mandi Snapshot", photos: [
      { src: "image/Best Imageee.png", caption: "IIT Mandi campus" },
      { src: "image/fly.JPG", caption: "Aviation dream" },
      { src: "image/1792858841671.jpg", caption: "SCEE Samarthya 2026 IIT Mandi Poster Presented " }
    ]},
    { name: "IIIT Guwahati Moments", photos: [
      { src: "image/IIITGConvocation.JPG", caption: "IIITG Convocation" },
      { src: "image/Convocation.jpg", caption: "Convocation" },
      { src: "image/iiitg.jpg", caption: "IIIT Guwahati campus" },
      { src: "image/Friends.jpg", caption: "Friends at IIITG" },
      { src: "image/arpit3.jpg", caption: "With Arpit" }
    ]},
    { name: "VLSID", photos: [
      { src: "image/sahiil.jpeg", caption: "VLSID moment" }
    ]},
    { name: "ISVLSI", photos: [
      { src: "image/sahiil.jpeg", caption: "ISVLSI 2026" }
    ]}
  ];
  /* data4.js override ke baad correct gallery apply karo */
  GALLERY_CATEGORIES.length = 0;
  G.forEach(function (c) { GALLERY_CATEGORIES.push(c); });
  /* Editor ke w.gallery ko bhi sync rakho (agar editor load hua hai) */
  try {
    var SM = window.SM_EDITOR;
    if (SM && SM.w && SM.w.gallery) {
      SM.w.gallery = G.map(function (c) { return { name: c.name, photos: c.photos.map(function (p) { return { src: p.src, caption: p.caption }; }); }; });
    }
  } catch (e) {}
})();
