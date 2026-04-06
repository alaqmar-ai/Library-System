const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ─── Design System ───────────────────────────────────────────────
const DS = {
  navy:       "2B4066",
  terracotta: "C4603C",
  cream:      "FAF8F5",
  creamDark:  "F0EDE8",
  dark:       "1A1A2E",
  muted:      "6B7280",
  white:      "FFFFFF",
  lightAccent:"E8D5CC",
  headFont:   "Georgia",
  bodyFont:   "Calibri",
};

// ─── Helpers ─────────────────────────────────────────────────────

function addAccentBar(slide) {
  slide.addShape("rect", {
    x: 0, y: 0, w: 0.12, h: "100%",
    fill: { color: DS.terracotta },
  });
}

function addTopStripe(slide) {
  slide.addShape("rect", {
    x: 0, y: 0, w: "100%", h: 0.06,
    fill: { color: DS.terracotta },
  });
}

function addBottomBar(slide) {
  slide.addShape("rect", {
    x: 0, y: 7.15, w: "100%", h: 0.35,
    fill: { color: DS.navy },
  });
}

function addSlideNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 8.8, y: 7.18, w: 1.0, h: 0.28,
    fontSize: 9, fontFace: DS.bodyFont,
    color: DS.white, align: "right",
  });
}

function addFooterText(slide, text) {
  slide.addText(text, {
    x: 0.5, y: 7.18, w: 5, h: 0.28,
    fontSize: 8, fontFace: DS.bodyFont,
    color: "AABBCC", align: "left",
  });
}

function addTitleSlideDecor(slide) {
  slide.addShape("rect", {
    x: 0, y: 0, w: 4.2, h: "100%",
    fill: { color: DS.navy },
  });
  slide.addShape("rect", {
    x: 4.2, y: 0, w: 0.08, h: "100%",
    fill: { color: DS.terracotta },
  });
  slide.addShape("rect", {
    x: 4.28, y: 6.5, w: 5.72, h: 0.08,
    fill: { color: DS.terracotta },
  });
}

function contentSlide(pptx, { title, bg, num, total, footer }) {
  const bgColor = bg || DS.cream;
  const slide = pptx.addSlide();
  slide.background = { fill: bgColor };

  addAccentBar(slide);
  addTopStripe(slide);
  addBottomBar(slide);
  if (num && total) addSlideNumber(slide, num, total);
  if (footer) addFooterText(slide, footer);

  slide.addShape("rect", {
    x: 0.12, y: 0.06, w: 9.88, h: 0.95,
    fill: { color: DS.navy },
  });

  slide.addText(title, {
    x: 0.55, y: 0.15, w: 9.0, h: 0.75,
    fontSize: 24, fontFace: DS.headFont,
    color: DS.white, bold: true,
  });

  slide.addShape("rect", {
    x: 0.55, y: 1.01, w: 1.6, h: 0.05,
    fill: { color: DS.terracotta },
  });

  return slide;
}

function addBullets(slide, items, opts = {}) {
  const x = opts.x || 0.7;
  const y = opts.y || 1.35;
  const w = opts.w || 8.6;
  const h = opts.h || 5.4;
  const fontSize = opts.fontSize || 15;

  const textRows = items.map((item) => {
    if (typeof item === "string") {
      return {
        text: item,
        options: {
          bullet: { code: "2022", color: DS.terracotta },
          fontSize: fontSize,
          fontFace: DS.bodyFont,
          color: DS.dark,
          paraSpaceAfter: 8,
          indentLevel: 0,
        },
      };
    }
    return {
      text: item.text,
      options: {
        bullet: { code: "2013", color: DS.muted },
        fontSize: fontSize - 1.5,
        fontFace: DS.bodyFont,
        color: DS.muted,
        paraSpaceAfter: 5,
        indentLevel: 1,
      },
    };
  });

  slide.addText(textRows, { x, y, w, h, valign: "top" });
}

function addTwoColumns(slide, leftItems, rightItems, opts = {}) {
  const y = opts.y || 1.35;
  const h = opts.h || 5.3;

  if (opts.leftTitle) {
    slide.addShape("rect", {
      x: 0.5, y: y, w: 4.0, h: 0.42,
      fill: { color: DS.terracotta },
      rectRadius: 0.04,
    });
    slide.addText(opts.leftTitle, {
      x: 0.6, y: y + 0.02, w: 3.8, h: 0.38,
      fontSize: 13, fontFace: DS.headFont, bold: true, color: DS.white,
    });
  }

  if (opts.rightTitle) {
    slide.addShape("rect", {
      x: 5.2, y: y, w: 4.3, h: 0.42,
      fill: { color: DS.navy },
      rectRadius: 0.04,
    });
    slide.addText(opts.rightTitle, {
      x: 5.3, y: y + 0.02, w: 4.1, h: 0.38,
      fontSize: 13, fontFace: DS.headFont, bold: true, color: DS.white,
    });
  }

  const bulletY = opts.leftTitle ? y + 0.55 : y;
  const bulletH = opts.leftTitle ? h - 0.55 : h;

  addBullets(slide, leftItems, { x: 0.5, y: bulletY, w: 4.0, h: bulletH, fontSize: 13 });
  addBullets(slide, rightItems, { x: 5.2, y: bulletY, w: 4.3, h: bulletH, fontSize: 13 });
}

function addParagraph(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x || 0.7,
    y: opts.y || 1.35,
    w: opts.w || 8.6,
    h: opts.h || 1.5,
    fontSize: opts.fontSize || 15,
    fontFace: DS.bodyFont,
    color: DS.dark,
    lineSpacingMultiple: 1.35,
    valign: "top",
  });
}

// Helper: Add a quote/accent box
function addQuoteBox(slide, text, opts = {}) {
  const x = opts.x || 0.7;
  const y = opts.y || 5.8;
  const w = opts.w || 8.6;
  const h = opts.h || 0.85;

  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: DS.lightAccent },
    rectRadius: 0.05,
  });
  slide.addShape("rect", {
    x, y, w: 0.08, h,
    fill: { color: DS.terracotta },
  });
  slide.addText(text, {
    x: x + 0.3, y: y + 0.05, w: w - 0.4, h: h - 0.1,
    fontSize: opts.fontSize || 12.5,
    fontFace: DS.headFont, italic: true, color: DS.navy,
    valign: "middle",
  });
}

// Helper: Numbered item with title and description
function addNumberedItems(slide, items, opts = {}) {
  const startY = opts.startY || 1.4;
  const spacing = opts.spacing || 1.08;

  items.forEach((obj, i) => {
    const oy = startY + i * spacing;
    slide.addShape("ellipse", {
      x: 0.6, y: oy + 0.05, w: 0.45, h: 0.45,
      fill: { color: DS.terracotta },
    });
    slide.addText(`${i + 1}`, {
      x: 0.6, y: oy + 0.05, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: DS.headFont, bold: true,
      color: DS.white, align: "center", valign: "middle",
    });
    slide.addText(obj.main, {
      x: 1.25, y: oy, w: 8.0, h: 0.38,
      fontSize: 15, fontFace: DS.headFont, bold: true, color: DS.navy,
    });
    slide.addText(obj.desc, {
      x: 1.25, y: oy + 0.38, w: 8.0, h: 0.55,
      fontSize: 12, fontFace: DS.bodyFont, color: DS.muted,
      lineSpacingMultiple: 1.2,
    });
  });
}

// Helper: Golden Rule pair slide
function addGoldenRulePair(slide, rule1, rule2) {
  // Rule 1 (left)
  slide.addShape("roundRect", {
    x: 0.4, y: 1.3, w: 4.3, h: 5.55,
    fill: { color: DS.white },
    rectRadius: 0.06,
    shadow: { type: "outer", blur: 4, offset: 2, color: "CCCCCC", opacity: 0.3 },
  });
  slide.addShape("rect", {
    x: 0.4, y: 1.3, w: 4.3, h: 0.06,
    fill: { color: DS.terracotta },
    rectRadius: 0.03,
  });

  // Rule 1 number badge
  slide.addShape("roundRect", {
    x: 0.65, y: 1.55, w: 0.55, h: 0.45,
    fill: { color: DS.terracotta },
    rectRadius: 0.06,
  });
  slide.addText(`${rule1.num}`, {
    x: 0.65, y: 1.55, w: 0.55, h: 0.45,
    fontSize: 18, fontFace: DS.headFont, bold: true,
    color: DS.white, align: "center", valign: "middle",
  });
  slide.addText(rule1.title, {
    x: 1.35, y: 1.55, w: 3.1, h: 0.45,
    fontSize: 15, fontFace: DS.headFont, bold: true, color: DS.navy,
    valign: "middle",
  });

  // Rule 1 definition
  slide.addText(rule1.definition, {
    x: 0.65, y: 2.2, w: 3.8, h: 0.65,
    fontSize: 11, fontFace: DS.bodyFont, color: DS.muted,
    lineSpacingMultiple: 1.25, italic: true, valign: "top",
  });

  // Rule 1 application header
  slide.addShape("rect", {
    x: 0.65, y: 2.95, w: 3.8, h: 0.35,
    fill: { color: DS.lightAccent },
    rectRadius: 0.04,
  });
  slide.addText("SmartLib Application", {
    x: 0.75, y: 2.97, w: 3.6, h: 0.31,
    fontSize: 10.5, fontFace: DS.headFont, bold: true, color: DS.terracotta,
  });

  // Rule 1 application bullets
  addBullets(slide, rule1.applications, {
    x: 0.65, y: 3.45, w: 3.8, h: 3.2, fontSize: 11,
  });

  // Rule 2 (right)
  slide.addShape("roundRect", {
    x: 5.3, y: 1.3, w: 4.3, h: 5.55,
    fill: { color: DS.white },
    rectRadius: 0.06,
    shadow: { type: "outer", blur: 4, offset: 2, color: "CCCCCC", opacity: 0.3 },
  });
  slide.addShape("rect", {
    x: 5.3, y: 1.3, w: 4.3, h: 0.06,
    fill: { color: DS.navy },
    rectRadius: 0.03,
  });

  // Rule 2 number badge
  slide.addShape("roundRect", {
    x: 5.55, y: 1.55, w: 0.55, h: 0.45,
    fill: { color: DS.navy },
    rectRadius: 0.06,
  });
  slide.addText(`${rule2.num}`, {
    x: 5.55, y: 1.55, w: 0.55, h: 0.45,
    fontSize: 18, fontFace: DS.headFont, bold: true,
    color: DS.white, align: "center", valign: "middle",
  });
  slide.addText(rule2.title, {
    x: 6.25, y: 1.55, w: 3.1, h: 0.45,
    fontSize: 15, fontFace: DS.headFont, bold: true, color: DS.navy,
    valign: "middle",
  });

  // Rule 2 definition
  slide.addText(rule2.definition, {
    x: 5.55, y: 2.2, w: 3.8, h: 0.65,
    fontSize: 11, fontFace: DS.bodyFont, color: DS.muted,
    lineSpacingMultiple: 1.25, italic: true, valign: "top",
  });

  // Rule 2 application header
  slide.addShape("rect", {
    x: 5.55, y: 2.95, w: 3.8, h: 0.35,
    fill: { color: DS.lightAccent },
    rectRadius: 0.04,
  });
  slide.addText("SmartLib Application", {
    x: 5.65, y: 2.97, w: 3.6, h: 0.31,
    fontSize: 10.5, fontFace: DS.headFont, bold: true, color: DS.terracotta,
  });

  // Rule 2 application bullets
  addBullets(slide, rule2.applications, {
    x: 5.55, y: 3.45, w: 3.8, h: 3.2, fontSize: 11,
  });
}


// ═════════════════════════════════════════════════════════════════
//  HCI Presentation Generator
// ═════════════════════════════════════════════════════════════════

function generateHCI() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "SmartLib HCI Team";
  pptx.title = "SmartLib - Human Computer Interaction Assignment";

  const TOTAL = 19;
  const FOOTER = "SmartLib  |  Human Computer Interaction Assignment";

  // ── Slide 1: Title ─────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.background = { fill: DS.cream };
    addTitleSlideDecor(slide);

    slide.addText("SmartLib", {
      x: 0.5, y: 1.0, w: 3.5, h: 0.9,
      fontSize: 40, fontFace: DS.headFont, bold: true,
      color: DS.white,
    });

    slide.addShape("rect", {
      x: 0.5, y: 2.0, w: 1.4, h: 0.06,
      fill: { color: DS.terracotta },
    });

    slide.addText("Smart University\nLibrary Management System", {
      x: 0.5, y: 2.25, w: 3.5, h: 1.0,
      fontSize: 16, fontFace: DS.bodyFont,
      color: "AABBCC", lineSpacingMultiple: 1.3,
    });

    // Course info on navy panel
    slide.addText("Human Computer Interaction", {
      x: 0.5, y: 3.5, w: 3.5, h: 0.45,
      fontSize: 12, fontFace: DS.bodyFont,
      color: "7A8FAA",
    });
    slide.addText("Group Assignment", {
      x: 0.5, y: 3.9, w: 3.5, h: 0.45,
      fontSize: 12, fontFace: DS.bodyFont,
      color: "7A8FAA",
    });

    // Right side content
    slide.addText("Human Computer Interaction\nGroup Assignment", {
      x: 4.6, y: 1.3, w: 5.0, h: 0.9,
      fontSize: 22, fontFace: DS.headFont, bold: true,
      color: DS.navy, lineSpacingMultiple: 1.2,
    });

    slide.addShape("rect", {
      x: 4.6, y: 2.35, w: 1.0, h: 0.05,
      fill: { color: DS.terracotta },
    });

    // Lecturer
    slide.addText("Lecturer: Dr. Noraini Binti Mohd Razali", {
      x: 4.6, y: 2.6, w: 5.0, h: 0.35,
      fontSize: 12, fontFace: DS.bodyFont, color: DS.muted,
    });

    // Group members
    const members = [
      "Ahmad Bin Ibrahim (A12345)",
      "Sarah Binti Abdullah (A12346)",
      "Muhammad Hafiz Bin Razak (A12347)",
      "Nurul Aisyah Binti Hassan (A12348)",
      "David Tan Wei Ming (A12349)",
    ];

    slide.addText("Group Members", {
      x: 4.6, y: 3.2, w: 5.0, h: 0.35,
      fontSize: 13, fontFace: DS.headFont, bold: true, color: DS.navy,
    });

    members.forEach((m, i) => {
      slide.addText(`${i + 1}.  ${m}`, {
        x: 4.8, y: 3.6 + i * 0.35, w: 4.5, h: 0.32,
        fontSize: 11.5, fontFace: DS.bodyFont, color: DS.dark,
      });
    });

    slide.addText("2026", {
      x: 4.6, y: 5.6, w: 5.0, h: 0.4,
      fontSize: 14, fontFace: DS.bodyFont, color: DS.muted,
    });
  }

  // ── Slide 2: Agenda / Outline ──────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Agenda", num: 2, total: TOTAL, footer: FOOTER });

    const agendaItems = [
      { main: "Introduction & Problem Statement", desc: "Understanding the need for SmartLib" },
      { main: "Application Overview", desc: "Target users and key features" },
      { main: "Functional & Non-Functional Requirements", desc: "System capabilities and quality attributes" },
      { main: "Application Flowchart", desc: "User journey and interaction flow" },
      { main: "Shneiderman's Eight Golden Rules", desc: "HCI principles applied to SmartLib" },
      { main: "Interface Design & Mockups", desc: "Login, Dashboard, Search, and Profile screens" },
      { main: "Conclusion & References", desc: "Summary and academic sources" },
    ];

    agendaItems.forEach((item, i) => {
      const oy = 1.35 + i * 0.77;
      // Number
      slide.addShape("roundRect", {
        x: 0.6, y: oy + 0.04, w: 0.42, h: 0.42,
        fill: { color: i % 2 === 0 ? DS.terracotta : DS.navy },
        rectRadius: 0.06,
      });
      slide.addText(`${i + 1}`, {
        x: 0.6, y: oy + 0.04, w: 0.42, h: 0.42,
        fontSize: 15, fontFace: DS.headFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });
      slide.addText(item.main, {
        x: 1.2, y: oy, w: 5.0, h: 0.35,
        fontSize: 14.5, fontFace: DS.headFont, bold: true, color: DS.navy,
      });
      slide.addText(item.desc, {
        x: 1.2, y: oy + 0.33, w: 7.5, h: 0.35,
        fontSize: 11.5, fontFace: DS.bodyFont, color: DS.muted,
      });
    });
  }

  // ── Slide 3: Introduction ──────────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Introduction", bg: DS.creamDark, num: 3, total: TOTAL, footer: FOOTER });

    // What is SmartLib section
    slide.addText("What is SmartLib?", {
      x: 0.7, y: 1.35, w: 4, h: 0.4,
      fontSize: 16, fontFace: DS.headFont, bold: true, color: DS.navy,
    });
    slide.addShape("rect", { x: 0.7, y: 1.78, w: 0.8, h: 0.04, fill: { color: DS.terracotta } });

    addParagraph(slide,
      "SmartLib is a comprehensive web-based library management system designed for university environments. " +
      "It aims to replace traditional manual library processes with an intuitive, accessible digital platform that " +
      "serves students, librarians, and administrators through carefully designed human-computer interfaces.",
      { y: 1.95, h: 1.2, fontSize: 13.5 }
    );

    // Problem Statement section
    slide.addText("Problem Statement", {
      x: 0.7, y: 3.25, w: 4, h: 0.4,
      fontSize: 16, fontFace: DS.headFont, bold: true, color: DS.terracotta,
    });
    slide.addShape("rect", { x: 0.7, y: 3.68, w: 0.8, h: 0.04, fill: { color: DS.terracotta } });

    const problems = [
      "Manual, paper-based library systems are slow, error-prone, and difficult to scale",
      "Students must physically visit the library to search for or reserve books",
      "No real-time visibility into book availability causes frustration and wasted trips",
      "Fine calculation and record-keeping is inconsistent without automation",
      "Librarians spend excessive time on repetitive administrative tasks",
    ];

    addBullets(slide, problems, { y: 3.85, h: 2.8, fontSize: 12.5 });

    addQuoteBox(slide,
      "\"A well-designed HCI system reduces cognitive load and empowers users to accomplish tasks efficiently.\"",
      { y: 6.2, h: 0.7, fontSize: 11.5 }
    );
  }

  // ── Slide 4: Application Overview ──────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Application Overview", num: 4, total: TOTAL, footer: FOOTER });

    // Target Users section
    slide.addText("Target Users", {
      x: 0.7, y: 1.35, w: 4, h: 0.4,
      fontSize: 15, fontFace: DS.headFont, bold: true, color: DS.navy,
    });
    slide.addShape("rect", { x: 0.7, y: 1.78, w: 0.8, h: 0.04, fill: { color: DS.terracotta } });

    const roles = [
      { label: "Students", color: DS.terracotta, desc: "Search, borrow, reserve, and manage books" },
      { label: "Librarians", color: DS.navy, desc: "Process transactions, manage catalog" },
      { label: "Administrators", color: DS.dark, desc: "System oversight, reports, user management" },
    ];

    roles.forEach((r, i) => {
      const rx = 0.7 + i * 2.9;
      slide.addShape("roundRect", {
        x: rx, y: 2.0, w: 2.6, h: 1.0,
        fill: { color: DS.white },
        rectRadius: 0.06,
        shadow: { type: "outer", blur: 3, offset: 1, color: "CCCCCC", opacity: 0.25 },
      });
      slide.addShape("rect", {
        x: rx, y: 2.0, w: 2.6, h: 0.06,
        fill: { color: r.color },
        rectRadius: 0.03,
      });
      slide.addText(r.label, {
        x: rx + 0.15, y: 2.15, w: 2.3, h: 0.35,
        fontSize: 13, fontFace: DS.headFont, bold: true, color: r.color,
      });
      slide.addText(r.desc, {
        x: rx + 0.15, y: 2.5, w: 2.3, h: 0.4,
        fontSize: 10.5, fontFace: DS.bodyFont, color: DS.muted,
      });
    });

    // Key Features section
    slide.addText("Key Features", {
      x: 0.7, y: 3.3, w: 4, h: 0.4,
      fontSize: 15, fontFace: DS.headFont, bold: true, color: DS.navy,
    });
    slide.addShape("rect", { x: 0.7, y: 3.73, w: 0.8, h: 0.04, fill: { color: DS.terracotta } });

    const features = [
      { label: "Book Catalog\n& Search", },
      { label: "Borrow &\nReturn", },
      { label: "Reservations\n& Holds", },
      { label: "Fine\nManagement", },
      { label: "QR Code\nIntegration", },
    ];

    features.forEach((f, i) => {
      const cx = 0.5 + i * 1.9;
      slide.addShape("rect", {
        x: cx, y: 3.95, w: 1.7, h: 1.3,
        fill: { color: DS.white },
        shadow: { type: "outer", blur: 4, offset: 2, color: "CCCCCC", opacity: 0.3 },
        rectRadius: 0.06,
      });
      slide.addShape("rect", {
        x: cx, y: 3.95, w: 1.7, h: 0.06,
        fill: { color: DS.terracotta },
        rectRadius: 0.03,
      });
      slide.addText(f.label, {
        x: cx + 0.1, y: 4.1, w: 1.5, h: 1.0,
        fontSize: 12, fontFace: DS.bodyFont, color: DS.dark,
        align: "center", valign: "middle", lineSpacingMultiple: 1.2,
      });
    });

    const features2 = [
      { label: "Notifications\n& Alerts", },
      { label: "User\nDashboard", },
      { label: "Admin\nDashboard", },
      { label: "Reports &\nAnalytics", },
      { label: "User\nRegistration", },
    ];

    features2.forEach((f, i) => {
      const cx = 0.5 + i * 1.9;
      slide.addShape("rect", {
        x: cx, y: 5.45, w: 1.7, h: 1.3,
        fill: { color: DS.white },
        shadow: { type: "outer", blur: 4, offset: 2, color: "CCCCCC", opacity: 0.3 },
        rectRadius: 0.06,
      });
      slide.addShape("rect", {
        x: cx, y: 5.45, w: 1.7, h: 0.06,
        fill: { color: DS.navy },
        rectRadius: 0.03,
      });
      slide.addText(f.label, {
        x: cx + 0.1, y: 5.6, w: 1.5, h: 1.0,
        fontSize: 12, fontFace: DS.bodyFont, color: DS.dark,
        align: "center", valign: "middle", lineSpacingMultiple: 1.2,
      });
    });
  }

  // ── Slide 5: Functional Requirements (Part 1) ─────────────
  {
    const slide = contentSlide(pptx, { title: "Functional Requirements (Part 1)", bg: DS.creamDark, num: 5, total: TOTAL, footer: FOOTER });

    const reqs = [
      { id: "FR1", name: "User Registration & Authentication", desc: "Users can register with student/staff ID and login securely. Password recovery via email is supported." },
      { id: "FR2", name: "Book Search & Catalog Browsing", desc: "Advanced search by title, author, ISBN, or category. Real-time filtering and sorting of results." },
      { id: "FR3", name: "Book Borrowing", desc: "Students can borrow available books with automatic due date assignment. Borrowing limits enforced per user role." },
      { id: "FR4", name: "Book Returning", desc: "Librarians process returns with automatic overdue detection. System updates availability status instantly." },
      { id: "FR5", name: "Book Reservation", desc: "Users can reserve books currently on loan. Automatic notification when reserved book becomes available." },
    ];

    reqs.forEach((r, i) => {
      const oy = 1.3 + i * 1.12;

      // ID badge
      slide.addShape("roundRect", {
        x: 0.5, y: oy + 0.08, w: 0.65, h: 0.38,
        fill: { color: DS.terracotta },
        rectRadius: 0.05,
      });
      slide.addText(r.id, {
        x: 0.5, y: oy + 0.08, w: 0.65, h: 0.38,
        fontSize: 11, fontFace: DS.headFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });

      // Name
      slide.addText(r.name, {
        x: 1.3, y: oy, w: 8.0, h: 0.38,
        fontSize: 14, fontFace: DS.headFont, bold: true, color: DS.navy,
      });

      // Description
      slide.addText(r.desc, {
        x: 1.3, y: oy + 0.4, w: 8.0, h: 0.55,
        fontSize: 11.5, fontFace: DS.bodyFont, color: DS.muted,
        lineSpacingMultiple: 1.2,
      });

      // Separator line
      if (i < reqs.length - 1) {
        slide.addShape("rect", {
          x: 0.5, y: oy + 1.0, w: 9.0, h: 0.01,
          fill: { color: DS.lightAccent },
        });
      }
    });
  }

  // ── Slide 6: Functional Requirements (Part 2) ─────────────
  {
    const slide = contentSlide(pptx, { title: "Functional Requirements (Part 2)", num: 6, total: TOTAL, footer: FOOTER });

    const reqs = [
      { id: "FR6", name: "Fine Calculation & Payment", desc: "Automatic calculation of overdue fines based on days late. Payment tracking and receipt generation." },
      { id: "FR7", name: "Notifications & Alerts", desc: "Push and email notifications for due dates, reservations, and fine reminders. Configurable preferences." },
      { id: "FR8", name: "User Dashboard", desc: "Personalised dashboard showing current loans, pending reservations, fine status, and reading history." },
      { id: "FR9", name: "Admin Dashboard & Reports", desc: "Comprehensive analytics on circulation trends, popular books, user activity, and inventory status." },
      { id: "FR10", name: "QR Code Integration", desc: "QR code scanning for rapid book identification during borrowing, returning, and inventory checks." },
    ];

    reqs.forEach((r, i) => {
      const oy = 1.3 + i * 1.12;

      slide.addShape("roundRect", {
        x: 0.5, y: oy + 0.08, w: 0.75, h: 0.38,
        fill: { color: DS.navy },
        rectRadius: 0.05,
      });
      slide.addText(r.id, {
        x: 0.5, y: oy + 0.08, w: 0.75, h: 0.38,
        fontSize: 10.5, fontFace: DS.headFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });

      slide.addText(r.name, {
        x: 1.4, y: oy, w: 8.0, h: 0.38,
        fontSize: 14, fontFace: DS.headFont, bold: true, color: DS.navy,
      });

      slide.addText(r.desc, {
        x: 1.4, y: oy + 0.4, w: 8.0, h: 0.55,
        fontSize: 11.5, fontFace: DS.bodyFont, color: DS.muted,
        lineSpacingMultiple: 1.2,
      });

      if (i < reqs.length - 1) {
        slide.addShape("rect", {
          x: 0.5, y: oy + 1.0, w: 9.0, h: 0.01,
          fill: { color: DS.lightAccent },
        });
      }
    });
  }

  // ── Slide 7: Non-Functional Requirements ───────────────────
  {
    const slide = contentSlide(pptx, { title: "Non-Functional Requirements", bg: DS.creamDark, num: 7, total: TOTAL, footer: FOOTER });

    const nfrs = [
      { id: "NFR1", category: "Performance", requirement: "Page load time under 3 seconds; search results returned within 1 second" },
      { id: "NFR2", category: "Usability", requirement: "Interface learnable within 10 minutes for new users; WCAG 2.1 AA compliant" },
      { id: "NFR3", category: "Reliability", requirement: "System uptime of 99.5%; automatic data backup every 24 hours" },
      { id: "NFR4", category: "Security", requirement: "Encrypted password storage; role-based access control; session timeout after inactivity" },
      { id: "NFR5", category: "Scalability", requirement: "Support up to 5,000 concurrent users without performance degradation" },
      { id: "NFR6", category: "Compatibility", requirement: "Compatible with Chrome, Firefox, Safari, Edge; responsive on mobile and tablet" },
      { id: "NFR7", category: "Maintainability", requirement: "Modular codebase with documented APIs; configurable system parameters" },
    ];

    // Table header
    const headerY = 1.35;
    slide.addShape("rect", {
      x: 0.5, y: headerY, w: 1.0, h: 0.45,
      fill: { color: DS.navy },
    });
    slide.addText("ID", {
      x: 0.5, y: headerY, w: 1.0, h: 0.45,
      fontSize: 11, fontFace: DS.headFont, bold: true,
      color: DS.white, align: "center", valign: "middle",
    });
    slide.addShape("rect", {
      x: 1.5, y: headerY, w: 1.8, h: 0.45,
      fill: { color: DS.navy },
    });
    slide.addText("Category", {
      x: 1.5, y: headerY, w: 1.8, h: 0.45,
      fontSize: 11, fontFace: DS.headFont, bold: true,
      color: DS.white, align: "center", valign: "middle",
    });
    slide.addShape("rect", {
      x: 3.3, y: headerY, w: 6.2, h: 0.45,
      fill: { color: DS.navy },
    });
    slide.addText("Requirement", {
      x: 3.3, y: headerY, w: 6.2, h: 0.45,
      fontSize: 11, fontFace: DS.headFont, bold: true,
      color: DS.white, align: "center", valign: "middle",
    });

    // Table rows
    nfrs.forEach((nfr, i) => {
      const ry = headerY + 0.45 + i * 0.7;
      const bgColor = i % 2 === 0 ? DS.white : DS.lightAccent;

      slide.addShape("rect", { x: 0.5, y: ry, w: 1.0, h: 0.7, fill: { color: bgColor } });
      slide.addText(nfr.id, {
        x: 0.5, y: ry, w: 1.0, h: 0.7,
        fontSize: 10.5, fontFace: DS.headFont, bold: true,
        color: DS.terracotta, align: "center", valign: "middle",
      });

      slide.addShape("rect", { x: 1.5, y: ry, w: 1.8, h: 0.7, fill: { color: bgColor } });
      slide.addText(nfr.category, {
        x: 1.5, y: ry, w: 1.8, h: 0.7,
        fontSize: 10.5, fontFace: DS.bodyFont, bold: true,
        color: DS.navy, align: "center", valign: "middle",
      });

      slide.addShape("rect", { x: 3.3, y: ry, w: 6.2, h: 0.7, fill: { color: bgColor } });
      slide.addText(nfr.requirement, {
        x: 3.45, y: ry, w: 5.9, h: 0.7,
        fontSize: 10.5, fontFace: DS.bodyFont,
        color: DS.dark, valign: "middle",
        lineSpacingMultiple: 1.15,
      });
    });
  }

  // ── Slide 8: Application Flowchart ─────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Application Flowchart", num: 8, total: TOTAL, footer: FOOTER });

    addParagraph(slide,
      "The application flowchart illustrates the complete user journey through SmartLib, from initial access to task completion. " +
      "The flow is designed to minimise unnecessary steps and provide clear navigation paths for all user roles.",
      { y: 1.35, h: 0.9, fontSize: 13 }
    );

    // Flowchart boxes
    const flowSteps = [
      { label: "Start", color: DS.terracotta, x: 0.7, y: 2.55, w: 1.2 },
      { label: "Login /\nRegister", color: DS.navy, x: 2.3, y: 2.55, w: 1.4 },
      { label: "Role-Based\nDashboard", color: DS.navy, x: 4.1, y: 2.55, w: 1.5 },
      { label: "Select\nFeature", color: DS.navy, x: 6.0, y: 2.55, w: 1.4 },
      { label: "Perform\nAction", color: DS.navy, x: 7.8, y: 2.55, w: 1.4 },
    ];

    flowSteps.forEach((step) => {
      slide.addShape("roundRect", {
        x: step.x, y: step.y, w: step.w, h: 0.75,
        fill: { color: step.color },
        rectRadius: 0.08,
      });
      slide.addText(step.label, {
        x: step.x, y: step.y, w: step.w, h: 0.75,
        fontSize: 11, fontFace: DS.bodyFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
        lineSpacingMultiple: 1.1,
      });
    });

    // Arrows between flow steps
    const arrowPositions = [
      { x: 1.9, y: 2.82 },
      { x: 3.7, y: 2.82 },
      { x: 5.6, y: 2.82 },
      { x: 7.4, y: 2.82 },
    ];
    arrowPositions.forEach((pos) => {
      slide.addText("\u2192", {
        x: pos.x, y: pos.y, w: 0.4, h: 0.25,
        fontSize: 18, fontFace: DS.bodyFont, color: DS.terracotta,
        align: "center", valign: "middle",
      });
    });

    // Second row
    const flowSteps2 = [
      { label: "Confirmation\n/ Feedback", color: DS.navy, x: 7.8, y: 3.7, w: 1.4 },
      { label: "Return to\nDashboard", color: DS.navy, x: 5.7, y: 3.7, w: 1.5 },
      { label: "Logout", color: DS.navy, x: 3.8, y: 3.7, w: 1.3 },
      { label: "End", color: DS.terracotta, x: 2.1, y: 3.7, w: 1.2 },
    ];

    flowSteps2.forEach((step) => {
      slide.addShape("roundRect", {
        x: step.x, y: step.y, w: step.w, h: 0.75,
        fill: { color: step.color },
        rectRadius: 0.08,
      });
      slide.addText(step.label, {
        x: step.x, y: step.y, w: step.w, h: 0.75,
        fontSize: 11, fontFace: DS.bodyFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
        lineSpacingMultiple: 1.1,
      });
    });

    // Down arrow from Perform Action to Confirmation
    slide.addText("\u2193", {
      x: 8.25, y: 3.35, w: 0.4, h: 0.35,
      fontSize: 18, fontFace: DS.bodyFont, color: DS.terracotta,
      align: "center", valign: "middle",
    });

    // Left arrows on second row
    const arrowPositions2 = [
      { x: 7.2, y: 3.97 },
      { x: 5.1, y: 3.97 },
      { x: 3.3, y: 3.97 },
    ];
    arrowPositions2.forEach((pos) => {
      slide.addText("\u2190", {
        x: pos.x, y: pos.y, w: 0.4, h: 0.25,
        fontSize: 18, fontFace: DS.bodyFont, color: DS.terracotta,
        align: "center", valign: "middle",
      });
    });

    // Feature modules
    slide.addText("Available Features at Dashboard", {
      x: 0.7, y: 4.85, w: 8.5, h: 0.35,
      fontSize: 13, fontFace: DS.headFont, bold: true, color: DS.navy,
    });
    slide.addShape("rect", { x: 0.7, y: 5.22, w: 0.8, h: 0.04, fill: { color: DS.terracotta } });

    const featureModules = [
      "Search & Browse Catalog",
      "Borrow Books",
      "Return Books",
      "Reserve Books",
      "View Fines & Pay",
      "Profile Settings",
      "Admin Reports",
      "Manage Users",
    ];

    featureModules.forEach((f, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const fx = 0.7 + col * 2.3;
      const fy = 5.45 + row * 0.65;

      slide.addShape("roundRect", {
        x: fx, y: fy, w: 2.1, h: 0.5,
        fill: { color: DS.white },
        rectRadius: 0.05,
        shadow: { type: "outer", blur: 2, offset: 1, color: "CCCCCC", opacity: 0.2 },
      });
      slide.addShape("rect", {
        x: fx, y: fy, w: 0.06, h: 0.5,
        fill: { color: i < 4 ? DS.terracotta : DS.navy },
      });
      slide.addText(f, {
        x: fx + 0.15, y: fy, w: 1.85, h: 0.5,
        fontSize: 10.5, fontFace: DS.bodyFont, color: DS.dark, valign: "middle",
      });
    });
  }

  // ── Slide 9: Shneiderman's Eight Golden Rules - Overview ───
  {
    const slide = contentSlide(pptx, { title: "Shneiderman's Eight Golden Rules of Interface Design", bg: DS.creamDark, num: 9, total: TOTAL, footer: FOOTER });

    addParagraph(slide,
      "Ben Shneiderman's Eight Golden Rules provide a foundational framework for designing effective " +
      "user interfaces. SmartLib's design rigorously applies each rule to ensure usability and user satisfaction.",
      { y: 1.35, h: 0.75, fontSize: 13 }
    );

    const rules = [
      { num: "1", title: "Strive for Consistency", brief: "Uniform layouts, terminology, and interaction patterns across all screens" },
      { num: "2", title: "Cater to Universal Usability", brief: "Accessible design for diverse users including those with disabilities" },
      { num: "3", title: "Offer Informative Feedback", brief: "Clear visual and textual feedback for every user action" },
      { num: "4", title: "Design Dialogs to Yield Closure", brief: "Defined beginning, middle, and end for every task sequence" },
      { num: "5", title: "Prevent Errors", brief: "Input validation, confirmation dialogs, and constraint-based design" },
      { num: "6", title: "Permit Easy Reversal of Actions", brief: "Undo capability and edit options to reduce user anxiety" },
      { num: "7", title: "Keep Users in Control", brief: "Users initiate actions; the system responds predictably" },
      { num: "8", title: "Reduce Short-Term Memory Load", brief: "Visible options, contextual help, and progressive disclosure" },
    ];

    rules.forEach((rule, i) => {
      const col = i < 4 ? 0 : 1;
      const row = i % 4;
      const rx = col === 0 ? 0.5 : 5.1;
      const ry = 2.3 + row * 1.15;

      slide.addShape("roundRect", {
        x: rx, y: ry, w: 4.4, h: 0.95,
        fill: { color: DS.white },
        rectRadius: 0.06,
        shadow: { type: "outer", blur: 3, offset: 1, color: "CCCCCC", opacity: 0.2 },
      });
      slide.addShape("rect", {
        x: rx, y: ry, w: 0.06, h: 0.95,
        fill: { color: col === 0 ? DS.terracotta : DS.navy },
      });

      // Number circle
      slide.addShape("ellipse", {
        x: rx + 0.2, y: ry + 0.25, w: 0.45, h: 0.45,
        fill: { color: col === 0 ? DS.terracotta : DS.navy },
      });
      slide.addText(rule.num, {
        x: rx + 0.2, y: ry + 0.25, w: 0.45, h: 0.45,
        fontSize: 15, fontFace: DS.headFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });

      slide.addText(rule.title, {
        x: rx + 0.8, y: ry + 0.08, w: 3.4, h: 0.35,
        fontSize: 12.5, fontFace: DS.headFont, bold: true, color: DS.navy,
      });
      slide.addText(rule.brief, {
        x: rx + 0.8, y: ry + 0.45, w: 3.4, h: 0.42,
        fontSize: 10, fontFace: DS.bodyFont, color: DS.muted,
        lineSpacingMultiple: 1.15,
      });
    });
  }

  // ── Slide 10: Golden Rule 1 & 2 ───────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Golden Rules 1 & 2: Consistency & Universal Usability", num: 10, total: TOTAL, footer: FOOTER });

    addGoldenRulePair(slide, {
      num: 1,
      title: "Strive for Consistency",
      definition: "Consistent sequences of actions should be required in similar situations. Identical terminology, consistent colour, layout, and fonts throughout.",
      applications: [
        "Uniform navigation bar with the same menu items across all pages",
        "Consistent colour coding: navy for primary actions, terracotta for accents and alerts",
        "Standardised button styles, form fields, and card layouts throughout the system",
        "Same terminology used everywhere (e.g., \"Borrow\" not sometimes \"Check Out\")",
        "Consistent icon set and placement for actions like search, edit, and delete",
      ],
    }, {
      num: 2,
      title: "Universal Usability",
      definition: "Recognise the needs of diverse users. Design for beginners, experts, and users with disabilities to ensure broad accessibility.",
      applications: [
        "WCAG 2.1 AA compliant: sufficient colour contrast ratios (minimum 4.5:1)",
        "Keyboard navigation support for all interactive elements",
        "Responsive design adapts to mobile, tablet, and desktop screens",
        "Alt text on all images and ARIA labels on interactive components",
        "Clear, jargon-free language suitable for international students",
      ],
    });
  }

  // ── Slide 11: Golden Rule 3 & 4 ───────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Golden Rules 3 & 4: Feedback & Dialog Closure", bg: DS.creamDark, num: 11, total: TOTAL, footer: FOOTER });

    addGoldenRulePair(slide, {
      num: 3,
      title: "Informative Feedback",
      definition: "For every user action, the system should provide clear, meaningful feedback. The response should be proportional to the action's significance.",
      applications: [
        "Success toast notifications after borrowing, returning, or reserving a book",
        "Real-time form validation with inline error messages as users type",
        "Loading spinners and progress bars during search and data retrieval",
        "Colour-coded status indicators: green (available), red (overdue), amber (due soon)",
        "Confirmation messages with transaction details after completing actions",
      ],
    }, {
      num: 4,
      title: "Dialog Closure",
      definition: "Sequences of actions should be organised into groups with a clear beginning, middle, and end. Provide closure so users know the task is complete.",
      applications: [
        "Multi-step borrowing process with clear progress indicator (Select > Confirm > Receipt)",
        "Confirmation screen after book return showing updated loan status",
        "Registration wizard with step numbers and a completion summary page",
        "Fine payment flow ending with a digital receipt and updated balance",
        "Search-to-action flow: Search > View Details > Borrow/Reserve > Confirmation",
      ],
    });
  }

  // ── Slide 12: Golden Rule 5 & 6 ───────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Golden Rules 5 & 6: Error Prevention & Easy Reversal", num: 12, total: TOTAL, footer: FOOTER });

    addGoldenRulePair(slide, {
      num: 5,
      title: "Prevent Errors",
      definition: "Design the system so users cannot easily make errors. Where possible, detect and prevent errors before they occur rather than correcting them after.",
      applications: [
        "Input validation prevents submission of incomplete registration forms",
        "Greyed-out \"Borrow\" button when user has reached borrowing limit",
        "Date pickers prevent selection of invalid return dates",
        "Confirmation dialogs before irreversible actions (e.g., deleting a reservation)",
        "Auto-suggest in search prevents misspellings and guides correct input",
      ],
    }, {
      num: 6,
      title: "Easy Reversal of Actions",
      definition: "As much as possible, actions should be reversible. This feature relieves anxiety and encourages exploration of unfamiliar options.",
      applications: [
        "Cancel reservation option available up until the book is collected",
        "Edit profile information with ability to revert changes before saving",
        "Undo option in admin dashboard for recently modified records",
        "\"Back\" navigation clearly available at every step of multi-page flows",
        "Loan renewal option allows extending due dates without re-borrowing",
      ],
    });
  }

  // ── Slide 13: Golden Rule 7 & 8 ───────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Golden Rules 7 & 8: User Control & Memory Load", bg: DS.creamDark, num: 13, total: TOTAL, footer: FOOTER });

    addGoldenRulePair(slide, {
      num: 7,
      title: "Keep Users in Control",
      definition: "Experienced users want to feel that they are in charge of the interface and that it responds to their actions. The system should not surprise users.",
      applications: [
        "Users choose their own dashboard layout and notification preferences",
        "Manual override options for librarians in automated processes",
        "Sort and filter controls allow users to organise search results their way",
        "Adjustable loan periods within policy limits give users scheduling flexibility",
        "Clear exit points on every screen \u2014 no forced sequences or dead ends",
      ],
    }, {
      num: 8,
      title: "Reduce Memory Load",
      definition: "Humans have limited short-term memory. The interface should reduce the need for users to remember information across screens or sessions.",
      applications: [
        "Persistent breadcrumb navigation shows users their current location in the system",
        "Recently viewed books list on dashboard for quick re-access",
        "Auto-populated fields using stored profile data (name, ID, department)",
        "Visual book covers alongside titles to aid recognition over recall",
        "Contextual tooltips and help icons provide guidance without leaving the page",
      ],
    });
  }

  // ── Slide 14: Interface Design - Login & Dashboard ─────────
  {
    const slide = contentSlide(pptx, { title: "Interface Design: Login & Dashboard", num: 14, total: TOTAL, footer: FOOTER });

    // Login Interface (left)
    slide.addShape("roundRect", {
      x: 0.4, y: 1.3, w: 4.3, h: 5.55,
      fill: { color: DS.white },
      rectRadius: 0.06,
      shadow: { type: "outer", blur: 4, offset: 2, color: "CCCCCC", opacity: 0.3 },
    });
    slide.addShape("rect", {
      x: 0.4, y: 1.3, w: 4.3, h: 0.06,
      fill: { color: DS.terracotta },
      rectRadius: 0.03,
    });

    slide.addText("Login Page", {
      x: 0.65, y: 1.5, w: 3.8, h: 0.4,
      fontSize: 16, fontFace: DS.headFont, bold: true, color: DS.navy,
    });
    slide.addShape("rect", { x: 0.65, y: 1.92, w: 0.6, h: 0.04, fill: { color: DS.terracotta } });

    const loginFeatures = [
      "Clean, centred login form with university branding",
      "Student/Staff ID and password input fields with visible labels",
      "\"Remember Me\" checkbox for convenience",
      "\"Forgot Password\" link with email recovery flow",
      "Clear error messages for invalid credentials",
      "Responsive layout adapts to mobile screens",
      "Role selection (Student / Librarian / Admin)",
      "Secure session management with timeout warning",
    ];
    addBullets(slide, loginFeatures, {
      x: 0.6, y: 2.1, w: 3.85, h: 4.5, fontSize: 11,
    });

    // Dashboard Interface (right)
    slide.addShape("roundRect", {
      x: 5.3, y: 1.3, w: 4.3, h: 5.55,
      fill: { color: DS.white },
      rectRadius: 0.06,
      shadow: { type: "outer", blur: 4, offset: 2, color: "CCCCCC", opacity: 0.3 },
    });
    slide.addShape("rect", {
      x: 5.3, y: 1.3, w: 4.3, h: 0.06,
      fill: { color: DS.navy },
      rectRadius: 0.03,
    });

    slide.addText("User Dashboard", {
      x: 5.55, y: 1.5, w: 3.8, h: 0.4,
      fontSize: 16, fontFace: DS.headFont, bold: true, color: DS.navy,
    });
    slide.addShape("rect", { x: 5.55, y: 1.92, w: 0.6, h: 0.04, fill: { color: DS.terracotta } });

    const dashboardFeatures = [
      "Personalised greeting with user name and role indicator",
      "Summary cards: Active Loans, Pending Reservations, Fines Due",
      "Quick action buttons for frequently used features",
      "Current loans table with due dates and renewal options",
      "Notification panel showing recent alerts and reminders",
      "Recently viewed books section for quick re-access",
      "Navigation sidebar with collapsible menu categories",
      "Role-specific widgets (admin sees analytics, student sees loans)",
    ];
    addBullets(slide, dashboardFeatures, {
      x: 5.5, y: 2.1, w: 3.85, h: 4.5, fontSize: 11,
    });
  }

  // ── Slide 15: Interface Design - Search & Book Details ─────
  {
    const slide = contentSlide(pptx, { title: "Interface Design: Search & Book Details", bg: DS.creamDark, num: 15, total: TOTAL, footer: FOOTER });

    // Search Interface (left)
    slide.addShape("roundRect", {
      x: 0.4, y: 1.3, w: 4.3, h: 5.55,
      fill: { color: DS.white },
      rectRadius: 0.06,
      shadow: { type: "outer", blur: 4, offset: 2, color: "CCCCCC", opacity: 0.3 },
    });
    slide.addShape("rect", {
      x: 0.4, y: 1.3, w: 4.3, h: 0.06,
      fill: { color: DS.terracotta },
      rectRadius: 0.03,
    });

    slide.addText("Book Search", {
      x: 0.65, y: 1.5, w: 3.8, h: 0.4,
      fontSize: 16, fontFace: DS.headFont, bold: true, color: DS.navy,
    });
    slide.addShape("rect", { x: 0.65, y: 1.92, w: 0.6, h: 0.04, fill: { color: DS.terracotta } });

    const searchFeatures = [
      "Prominent search bar with auto-suggest as users type",
      "Advanced filters: category, author, year, availability status",
      "Grid and list view toggle for search results",
      "Book cards showing cover, title, author, and availability badge",
      "Sort options: relevance, title (A-Z), date added, popularity",
      "Pagination with adjustable results-per-page",
      "\"No results\" state with helpful suggestions",
      "Search history for quick re-searching",
    ];
    addBullets(slide, searchFeatures, {
      x: 0.6, y: 2.1, w: 3.85, h: 4.5, fontSize: 11,
    });

    // Book Details Interface (right)
    slide.addShape("roundRect", {
      x: 5.3, y: 1.3, w: 4.3, h: 5.55,
      fill: { color: DS.white },
      rectRadius: 0.06,
      shadow: { type: "outer", blur: 4, offset: 2, color: "CCCCCC", opacity: 0.3 },
    });
    slide.addShape("rect", {
      x: 5.3, y: 1.3, w: 4.3, h: 0.06,
      fill: { color: DS.navy },
      rectRadius: 0.03,
    });

    slide.addText("Book Details", {
      x: 5.55, y: 1.5, w: 3.8, h: 0.4,
      fontSize: 16, fontFace: DS.headFont, bold: true, color: DS.navy,
    });
    slide.addShape("rect", { x: 5.55, y: 1.92, w: 0.6, h: 0.04, fill: { color: DS.terracotta } });

    const detailFeatures = [
      "Large book cover image with metadata panel alongside",
      "Complete details: title, author, ISBN, publisher, edition, year",
      "Real-time availability status with copy count",
      "Primary action buttons: \"Borrow Now\" or \"Reserve\" based on status",
      "Book description and table of contents section",
      "Location information: shelf number, floor, section",
      "Related books recommendations based on category",
      "QR code display for quick mobile scanning",
    ];
    addBullets(slide, detailFeatures, {
      x: 5.5, y: 2.1, w: 3.85, h: 4.5, fontSize: 11,
    });
  }

  // ── Slide 16: Interface Design - User Profile ──────────────
  {
    const slide = contentSlide(pptx, { title: "Interface Design: User Profile & Settings", num: 16, total: TOTAL, footer: FOOTER });

    // Profile section description
    addParagraph(slide,
      "The User Profile interface provides a centralised location for users to manage their personal information, " +
      "view their library activity history, and configure notification preferences.",
      { y: 1.35, h: 0.75, fontSize: 13 }
    );

    // Three feature cards
    const profileSections = [
      {
        title: "Personal Information",
        color: DS.terracotta,
        items: [
          "Editable name, email, phone, and department fields",
          "Profile photo upload with preview",
          "Student/Staff ID displayed (non-editable)",
          "Password change with strength indicator",
        ],
      },
      {
        title: "Library Activity",
        color: DS.navy,
        items: [
          "Complete borrowing history with dates",
          "Current active loans and due dates",
          "Reservation status and queue position",
          "Fine payment history and receipts",
        ],
      },
      {
        title: "Preferences & Settings",
        color: DS.dark,
        items: [
          "Email notification toggle (due dates, fines, reservations)",
          "Display preferences (theme, language)",
          "Default search filters and sort order",
          "Privacy settings for activity visibility",
        ],
      },
    ];

    profileSections.forEach((section, i) => {
      const sx = 0.5 + i * 3.15;
      const sy = 2.35;

      slide.addShape("roundRect", {
        x: sx, y: sy, w: 2.9, h: 4.3,
        fill: { color: DS.white },
        rectRadius: 0.06,
        shadow: { type: "outer", blur: 4, offset: 2, color: "CCCCCC", opacity: 0.3 },
      });
      // Top color bar
      slide.addShape("rect", {
        x: sx, y: sy, w: 2.9, h: 0.06,
        fill: { color: section.color },
        rectRadius: 0.03,
      });

      // Section title
      slide.addShape("rect", {
        x: sx + 0.15, y: sy + 0.2, w: 2.6, h: 0.4,
        fill: { color: section.color },
        rectRadius: 0.04,
      });
      slide.addText(section.title, {
        x: sx + 0.15, y: sy + 0.2, w: 2.6, h: 0.4,
        fontSize: 12, fontFace: DS.headFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });

      // Items
      addBullets(slide, section.items, {
        x: sx + 0.1, y: sy + 0.8, w: 2.7, h: 3.2, fontSize: 10.5,
      });
    });
  }

  // ── Slide 17: Conclusion ───────────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Conclusion", bg: DS.creamDark, num: 17, total: TOTAL, footer: FOOTER });

    slide.addText("Key Takeaways", {
      x: 0.7, y: 1.35, w: 4, h: 0.4,
      fontSize: 16, fontFace: DS.headFont, bold: true, color: DS.navy,
    });
    slide.addShape("rect", { x: 0.7, y: 1.78, w: 0.8, h: 0.04, fill: { color: DS.terracotta } });

    const conclusions = [
      "SmartLib demonstrates a user-centred approach to library management, applying HCI principles at every design stage",
      "All eight of Shneiderman's Golden Rules have been systematically integrated into the interface design",
      "The system prioritises accessibility, ensuring usability for diverse user groups including those with disabilities",
      "Consistent visual design and predictable interaction patterns reduce cognitive load and learning time",
      "Informative feedback mechanisms keep users informed and confident throughout their interactions",
    ];

    addBullets(slide, conclusions, { y: 1.95, h: 2.5, fontSize: 13 });

    // HCI Impact section
    slide.addText("Impact of HCI-Driven Design", {
      x: 0.7, y: 4.55, w: 5, h: 0.4,
      fontSize: 16, fontFace: DS.headFont, bold: true, color: DS.terracotta,
    });
    slide.addShape("rect", { x: 0.7, y: 4.98, w: 0.8, h: 0.04, fill: { color: DS.terracotta } });

    const impacts = [
      "Reduced task completion time through intuitive navigation and minimal clicks",
      "Increased user satisfaction through responsive feedback and error prevention",
      "Lower training costs due to learnable, consistent interface patterns",
    ];

    addBullets(slide, impacts, { y: 5.15, h: 1.7, fontSize: 12.5 });
  }

  // ── Slide 18: References ───────────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "References", num: 18, total: TOTAL, footer: FOOTER });

    const references = [
      "Shneiderman, B., Plaisant, C., Cohen, M., Jacobs, S., Elmqvist, N., & Diakopoulos, N. (2016). Designing the User Interface: Strategies for Effective Human-Computer Interaction (6th ed.). Pearson.",
      "Dix, A., Finlay, J., Abowd, G. D., & Beale, R. (2004). Human-Computer Interaction (3rd ed.). Pearson Education Limited.",
      "Norman, D. A. (2013). The Design of Everyday Things: Revised and Expanded Edition. Basic Books.",
      "Nielsen, J. (1994). Usability Engineering. Morgan Kaufmann.",
      "Nielsen, J. (2000). Designing Web Usability: The Practice of Simplicity. New Riders Publishing.",
      "W3C. (2018). Web Content Accessibility Guidelines (WCAG) 2.1. World Wide Web Consortium. https://www.w3.org/TR/WCAG21/",
      "Preece, J., Rogers, Y., & Sharp, H. (2015). Interaction Design: Beyond Human-Computer Interaction (4th ed.). John Wiley & Sons.",
    ];

    references.forEach((ref, i) => {
      const ry = 1.35 + i * 0.78;
      const bgColor = i % 2 === 0 ? DS.white : DS.lightAccent;

      slide.addShape("roundRect", {
        x: 0.5, y: ry, w: 9.0, h: 0.68,
        fill: { color: bgColor },
        rectRadius: 0.04,
      });
      slide.addShape("rect", {
        x: 0.5, y: ry, w: 0.06, h: 0.68,
        fill: { color: DS.terracotta },
      });

      // Reference number
      slide.addShape("ellipse", {
        x: 0.7, y: ry + 0.14, w: 0.4, h: 0.4,
        fill: { color: DS.navy },
      });
      slide.addText(`${i + 1}`, {
        x: 0.7, y: ry + 0.14, w: 0.4, h: 0.4,
        fontSize: 11, fontFace: DS.headFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });

      slide.addText(ref, {
        x: 1.25, y: ry + 0.04, w: 8.0, h: 0.6,
        fontSize: 10, fontFace: DS.bodyFont, color: DS.dark,
        lineSpacingMultiple: 1.15, valign: "middle",
      });
    });
  }

  // ── Slide 19: Thank You / Q&A ─────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.background = { fill: DS.navy };

    slide.addShape("rect", {
      x: 0, y: 3.3, w: "100%", h: 0.08,
      fill: { color: DS.terracotta },
    });

    slide.addText("Thank You", {
      x: 0, y: 1.5, w: "100%", h: 1.0,
      fontSize: 44, fontFace: DS.headFont, bold: true,
      color: DS.white, align: "center",
    });

    slide.addText("Questions & Discussion", {
      x: 0, y: 3.8, w: "100%", h: 0.7,
      fontSize: 20, fontFace: DS.bodyFont,
      color: DS.lightAccent, align: "center",
    });

    // Group members
    slide.addText(
      "Ahmad Bin Ibrahim  |  Sarah Binti Abdullah  |  Muhammad Hafiz Bin Razak\n" +
      "Nurul Aisyah Binti Hassan  |  David Tan Wei Ming",
      {
        x: 0.5, y: 4.7, w: 9.0, h: 0.7,
        fontSize: 11.5, fontFace: DS.bodyFont,
        color: "7A8FAA", align: "center", lineSpacingMultiple: 1.4,
      }
    );

    slide.addText("SmartLib \u2014 Smart University Library Management System", {
      x: 0, y: 5.6, w: "100%", h: 0.4,
      fontSize: 12, fontFace: DS.bodyFont,
      color: "7A8FAA", align: "center",
    });

    slide.addText("Human Computer Interaction  |  Dr. Noraini Binti Mohd Razali  |  2026", {
      x: 0, y: 6.0, w: "100%", h: 0.35,
      fontSize: 10, fontFace: DS.bodyFont,
      color: "5A6B7E", align: "center",
    });

    slide.addShape("rect", {
      x: 3.5, y: 6.7, w: 3.0, h: 0.06,
      fill: { color: DS.terracotta },
    });
  }

  return pptx;
}


// ═════════════════════════════════════════════════════════════════
//  Main
// ═════════════════════════════════════════════════════════════════

async function main() {
  console.log("Generating SmartLib HCI Presentation...\n");

  const outDir = path.join(__dirname, "Human Computer Interaction Assignment");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, "HCI_Presentation.pptx");
  console.log("  Generating HCI_Presentation.pptx ...");

  const pptx = generateHCI();
  await pptx.writeFile({ fileName: outPath });

  const stats = fs.statSync(outPath);
  console.log(`  Done. Size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`  Output: ${outPath}`);
  console.log("\nHCI Presentation generated successfully.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
