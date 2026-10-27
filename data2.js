/* =====================================================
   DATA (Part 2) — skills, coursework, certifications,
   awards, galleries, references, quote.
   ===================================================== */

const SKILLS = [
  { category: "Languages <span>· HDL & software</span>", items: ["Verilog HDL", "SystemVerilog", "VHDL", "Python", "C", "RISC-V Assembly", "TCL"] },
  { category: "EDA Tools <span>· commercial & open-source</span>", items: ["Xilinx Vivado", "Cadence Genus/Innovus", "Synopsys", "Siemens EDA (Mentor Graphics)", "OpenLane", "OpenROAD", "Yosys", "ModelSim", "Intel Quartus"] },
  { category: "Research Domains <span>· focus areas</span>", items: ["Post-Quantum Cryptography (Kyber/Dilithium)", "RISC-V SoC", "Digital VLSI", "Side-Channel Analysis", "Hardware Security"] },
];

const COURSEWORK = [
  "Post Quantum Security", "Low Power VLSI", "VLSI Circuits and System", "Architectural Design of Digital ICs",
  "Reconfigurable Computing", "System Modelling Lab", "VLSI CAD Lab", "Digital VLSI Design"
];

const CERTIFICATIONS = [
  { title: "System Design Using Verilog HDL", issuer: "Udemy", year: "2022" },
  { title: "VSD Static Timing Analysis — Parts 1 & 2", issuer: "Udemy", year: "2025" },
  { title: "Python for Data Science, AI & Development", issuer: "Coursera", year: "2023" },
  { title: "Cadence RTL to GDS Flow", issuer: "Entuple Technology", year: "2024" },
  { title: "VLSI Design Flow using Vivado", issuer: "CoreEL / Xilinx", year: "2024" },
];

const AWARDS = [
  { title: "Certificate of Recognition — ISVLSI 2026 (Tier 1 Conference)", issuer: "IEEE Computer Society Annual Symposium on VLSI (ISVLSI)", date: "2026" },
  { title: "Certificate of Participation — 32nd IEEE HiPC 2025 (Tier 1 Conference)", issuer: "IEEE International Conference on High Performance Computing, Data, and Analytics, Hyderabad", date: "2025" },
  { title: "Batch Topper — M.Tech VLSI & Embedded Systems (CGPA 9.11, 1st Rank)", issuer: "IIIT Guwahati", date: "2023" },
  { title: "VLSID Fellow (2024, 2025, 2026) — Tier 1 Conference", issuer: "International Conference on VLSI Design (VLSID)", date: "2024–2026" },
  { title: "2nd Prize — Creative Writing Competition", issuer: "EN-LIT, Lucknow University", date: "" },
];

/* CHIP GALLERY — photo ko image/ folder me daalo (repo me already hain).
   Nayi photo: image/ folder me upload karo, phir yahan line add karo. */
const CHIP_GALLERY = [
  { src: "image/Chip2GF180nm.png", caption: "GF180nm Technology" },
  { src: "image/chip1skywater130nm.png", caption: "SkyWater 130nm" },
  { src: "image/chip3ASAPnm.png", caption: "ASAP 7nm" },
  { src: "image/chip4nangate45nm.png", caption: "Nangate 45nm" },
  { src: "image/Complete soc.jpeg", caption: "RISC-V SoC" },
  { src: "image/Full_Adder_IOPlanning.png", caption: "I/O Planning" },
  { src: "image/full_adder_floarplanning.png", caption: "Floorplan" },
  { src: "", caption: "Parashar View" },
];

const PHOTO_GALLERY = [
  { src: "image/IIITGConvocation.JPG", caption: "IIITG Convocation" },
  { src: "image/Convocation.jpg", caption: "Convocation" },
  { src: "image/Best Imageee.png", caption: "Lake View" },
  { src: "image/Friends.jpg", caption: "Friends" },
  { src: "image/fly.JPG", caption: "Aviation Dream" },
  { src: "image/arpit3.jpg", caption: "With Arpit" },
  { src: "image/sahil.jpeg", caption: "Convocation Day" },
  { src: "image/iiitg.jpg", caption: "IIIT Guwahati" },
  { src: "image/Poster Landscape.png", caption: "Research Poster" },
  { src: "image/WhatsApp Image 2026-03-05 at 2.58.51 PM.jpeg", caption: "Recent Moment" },
];

const REFERENCES = [
  { name: "Dr. Bikram Paul", role: "Ph.D. Supervisor — Assistant Professor, SCEE, IIT Mandi" },
  { name: "Dr. Babita Jajodia", role: "M.Tech Supervisor — Assistant Professor, IIIT Guwahati" },
  { name: "Dr. Rakesh Biswas", role: "M.Tech Thesis Panelist, IIIT Guwahati" },
  { name: "Dr. Siddharth Singh", role: "B.Tech Supervisor — HOD, Lucknow University" },
];

const QUOTE = {
  text: "“The future belongs to those who believe in the beauty of their dreams.”",
  by: "— Eleanor Roosevelt",
};
