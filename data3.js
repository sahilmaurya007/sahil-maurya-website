/* =====================================================
   DATA (Part 3) — NEWS BANNER, JOURNEY (timeline + pie
   chart), CATEGORIZED GALLERY.
   SIRF IS FILE KO EDIT KARO. Naya news/journey photo
   daalna ho to yahi se add karo. HTML/CSS/JS mat chhedo.
   ===================================================== */

/* ---------- NEWS BANNER (A²DSL style, 10-12 sec me slide change) ----------
   Har news ek badi banner slide hai — photo + type badge + text + date.
   photo khali chhodoge to gradient background dikhega.
   Naya news upar wali line ki tarah add karo:
   { type: "Conference", text: "...", link: "", date: "...", photo: "image/xxx.jpg" } */
const NEWS = [
  { type: "Conference", text: "Paper accepted for ORAL presentation at VLSID 2027 (Tier 1 Conference) — Reproducible Co-Design of Domain-Aware Sleep Switches", link: "", date: "2026-10-12", photo: "image/sahil.jpeg" },
  { type: "Award", text: "Certificate of Recognition — IEEE ISVLSI 2026 (Tier 1 Conference)", link: "", date: "2026-07-07", photo: "" },
  { type: "Conference", text: "Presented this paper at 32nd IEEE HiPC 2025 (Tier 1 Conference), Hyderabad — Neuromorphic Adaptive Precision RISC-V Processor", link: "https://ieeexplore.ieee.org/document/11459250", date: "2025-12-17", photo: "image/Poster contact.png" },
  { type: "Fellowship", text: "VLSID Fellow (2024, 2025, 2026) — International Conference on VLSI Design (Tier 1 Conference)", link: "", date: "2025-01-01", photo: "" },
  { type: "Talk", text: "Teaching Assistant session — VL-401: RTL Design and Verification, Monsoon Sem 2025, IIT Mandi", link: "", date: "2025-11-27", photo: "" },
  { type: "Journal", text: "Paper accepted at IEEE ISVLSI 2026 (Tier 1 Conference) — Optimized K2RED, Plantard, and Approximate Modular Multipliers for PQC", link: "", date: "2026-06-01", photo: "" },
  { type: "Workshop", text: "Hands-on Workshop on IC Design Tool at IIT Mandi", link: "", date: "2026-02-26", photo: "" },
];

/* ---------- JOURNEY (Timeline + Pie Chart) ----------
   Har milestone me: date ("YYYY-MM"), title, desc, section
   (click karne par us page-section par jump karta hai:
   publications / awards / education / projects / gallery),
   aur optional photo aur category (pie chart me count hoti hai).
   Milestones date ke hisab se automatic sort ho jate hain. */
const JOURNEY = [
  { date: "2014-06", title: "UP Board — Secondary (85%)", desc: "Completed secondary education with 85%.", section: "education", photo: "", category: "Education" },
  { date: "2016-06", title: "UP Board — Higher Secondary (85%)", desc: "Completed higher secondary education with 85%.", section: "education", photo: "", category: "Education" },
  { date: "2021-06", title: "B.Tech, ECE — University of Lucknow", desc: "Bachelor of Technology in Electronics & Communication Engineering.", section: "education", photo: "", category: "Education" },
  { date: "2023-06", title: "M.Tech Batch Topper — IIIT Guwahati", desc: "M.Tech in VLSI & Embedded Systems, CGPA 9.11, 1st Rank — Batch Topper.", section: "education", photo: "image/IIITGConvocation.JPG", category: "Education" },
  { date: "2023-08", title: "SILCON 2024 Paper — Approximate Modular Multipliers for R-LWE", desc: "Published at IEEE Silchar Subsection Conference 2024 — 34% area reduction, 33% power savings.", section: "publications", photo: "", category: "Publication" },
  { date: "2024-01", title: "VLSID Fellow 2024", desc: "Selected as VLSID Fellow at the International Conference on VLSI Design (Tier 1 Conference).", section: "awards", photo: "", category: "Award" },
  { date: "2024-07", title: "Cadence RTL to GDS Flow — Certification", desc: "Completed Cadence RTL to GDSII flow certification (Entuple Technology).", section: "certifications", photo: "", category: "Certification" },
  { date: "2025-07", title: "Joined IIT Mandi — Research Scholar, A²DSL", desc: "Ph.D. Research Scholar at A²DSL, SCEE, IIT Mandi, under Dr. Bikram Paul.", section: "education", photo: "image/sahil.jpeg", category: "Education" },
  { date: "2025-12", title: "HiPC 2025 (Tier 1) — Presented Neuromorphic RISC-V Processor Paper", desc: "Presented this paper at 32nd IEEE HiPC 2025 Workshop, Hyderabad. First RISC-V processor with real-time precision scaling — 40–52% energy reduction.", section: "publications", photo: "image/Poster contact.png", category: "Publication" },
  { date: "2026-07", title: "ISVLSI 2026 (Tier 1) — Certificate of Recognition", desc: "IEEE Computer Society Annual Symposium on VLSI — Certificate of Recognition.", section: "awards", photo: "", category: "Award" },
  { date: "2026-10", title: "VLSID 2027 (Tier 1) — Paper Accepted for Oral Presentation", desc: "Reproducible Co-Design of Domain-Aware Sleep Switches and Staggered Wake-Up Schedules.", section: "publications", photo: "", category: "Publication" },
];

/* ---------- CATEGORIZED GALLERY ----------
   Category ke naam customize kar sakte ho — bas "name" badlo.
   Nayi category add karni ho to ek aur { name: "...", photos: [...] }
   block add karo. Photos image/ folder me honi chahiye.
   Har photo: { src: "image/filename.jpg", caption: "..." } */
const GALLERY_CATEGORIES = [
  { name: "Lab Moments", photos: [
    { src: "image/sahil.jpeg", caption: "At the lab" },
    { src: "image/WhatsApp Image 2026-03-05 at 2.58.51 PM.jpeg", caption: "Lab moment" },
    { src: "image/Poster Landscape.png", caption: "Research poster at A²DSL" },
    { src: "image/Poster contact.png", caption: "Conference poster" },
  ]},
  { name: "Chip Gallery", photos: [
    { src: "image/Chip2GF180nm.png", caption: "GF180nm Technology" },
    { src: "image/chip1skywater130nm.png", caption: "SkyWater 130nm" },
    { src: "image/chip3ASAPnm.png", caption: "ASAP 7nm" },
    { src: "image/chip4nangate45nm.png", caption: "Nangate 45nm" },
    { src: "image/Complete soc.jpeg", caption: "RISC-V SoC" },
    { src: "image/Full_Adder_IOPlanning.png", caption: "I/O Planning" },
    { src: "image/full_adder_floarplanning.png", caption: "Floorplan" },
  ]},
  { name: "IIT Mandi", photos: [
    { src: "image/Best Imageee.png", caption: "IIT Mandi campus" },
    { src: "image/fly.JPG", caption: "Aviation dream" },
  ]},
  { name: "IIIT Guwahati", photos: [
    { src: "image/IIITGConvocation.JPG", caption: "IIITG Convocation" },
    { src: "image/Convocation.jpg", caption: "Convocation" },
    { src: "image/iiitg.jpg", caption: "IIIT Guwahati campus" },
    { src: "image/Friends.jpg", caption: "Friends at IIITG" },
    { src: "image/arpit3.jpg", caption: "With Arpit" },
  ]},
  { name: "HiPC", photos: [
    { src: "image/Poster contact.png", caption: "Presented this paper at HiPC 2025" },
  ]},
  { name: "VLSID", photos: [
    { src: "image/sahil.jpeg", caption: "VLSID moment" },
  ]},
  { name: "ISVLSI", photos: [
    { src: "image/sahil.jpeg", caption: "ISVLSI 2026" },
  ]},
];
