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
  lightAccent:"E8D5CC", // soft terracotta tint
  headFont:   "Georgia",
  bodyFont:   "Calibri",
};

// ─── Helpers ─────────────────────────────────────────────────────

function addAccentBar(slide, opts = {}) {
  // Left-side vertical terracotta bar
  slide.addShape("rect", {
    x: 0, y: 0, w: 0.12, h: "100%",
    fill: { color: DS.terracotta },
  });
}

function addTopStripe(slide) {
  // Thin terracotta line at top
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
  // Large navy rectangle on left half
  slide.addShape("rect", {
    x: 0, y: 0, w: 4.2, h: "100%",
    fill: { color: DS.navy },
  });
  // Terracotta accent stripe
  slide.addShape("rect", {
    x: 4.2, y: 0, w: 0.08, h: "100%",
    fill: { color: DS.terracotta },
  });
  // Bottom corner terracotta block
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

  // Title area with navy background strip
  slide.addShape("rect", {
    x: 0.12, y: 0.06, w: 9.88, h: 0.95,
    fill: { color: DS.navy },
  });

  slide.addText(title, {
    x: 0.55, y: 0.15, w: 9.0, h: 0.75,
    fontSize: 24, fontFace: DS.headFont,
    color: DS.white, bold: true,
  });

  // Terracotta underline for title
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
    // Sub-bullet
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

  slide.addText(textRows, {
    x, y, w, h,
    valign: "top",
  });
}

function addTwoColumns(slide, leftItems, rightItems, opts = {}) {
  const y = opts.y || 1.35;
  const h = opts.h || 5.3;

  // Left column header bar
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

  // Right column header bar
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

// ═════════════════════════════════════════════════════════════════
//  PRESENTATION 1 — Software Engineering
// ═════════════════════════════════════════════════════════════════

function generateSE() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "SmartLib Team";
  pptx.title = "SmartLib - Software Engineering Assignment";

  const TOTAL = 15;
  const FOOTER = "SmartLib  |  Software Engineering Assignment";

  // ── Slide 1: Title ─────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.background = { fill: DS.cream };
    addTitleSlideDecor(slide);

    slide.addText("SmartLib", {
      x: 0.5, y: 1.5, w: 3.5, h: 0.9,
      fontSize: 40, fontFace: DS.headFont, bold: true,
      color: DS.white,
    });

    // Terracotta divider inside navy panel
    slide.addShape("rect", {
      x: 0.5, y: 2.5, w: 1.4, h: 0.06,
      fill: { color: DS.terracotta },
    });

    slide.addText("Smart University\nLibrary Management System", {
      x: 0.5, y: 2.75, w: 3.5, h: 1.0,
      fontSize: 16, fontFace: DS.bodyFont,
      color: "AABBCC", lineSpacingMultiple: 1.3,
    });

    slide.addText("Software Engineering Assignment", {
      x: 4.6, y: 2.0, w: 5.0, h: 0.6,
      fontSize: 22, fontFace: DS.headFont, bold: true,
      color: DS.navy,
    });

    slide.addShape("rect", {
      x: 4.6, y: 2.7, w: 1.0, h: 0.05,
      fill: { color: DS.terracotta },
    });

    slide.addText("Student Name", {
      x: 4.6, y: 3.1, w: 5.0, h: 0.4,
      fontSize: 15, fontFace: DS.bodyFont, color: DS.muted,
    });
    slide.addText("2026", {
      x: 4.6, y: 3.55, w: 5.0, h: 0.4,
      fontSize: 14, fontFace: DS.bodyFont, color: DS.muted,
    });
  }

  // ── Slide 2: Project Overview ──────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Project Overview", num: 2, total: TOTAL, footer: FOOTER });

    addParagraph(slide,
      "SmartLib is a comprehensive web-based library management system designed for university environments. " +
      "It supports three distinct user roles \u2014 Student, Librarian, and Administrator \u2014 each with tailored " +
      "interfaces and capabilities.",
      { y: 1.4, h: 1.1, fontSize: 14 }
    );

    // Feature cards row
    const cards = [
      { label: "Book Catalog\nManagement", icon: "\uD83D\uDCDA" },
      { label: "Borrowing &\nReturning", icon: "\uD83D\uDD04" },
      { label: "Reservations", icon: "\uD83D\uDCCB" },
      { label: "Fine\nManagement", icon: "\uD83D\uDCB0" },
      { label: "Reporting &\nAnalytics", icon: "\uD83D\uDCC8" },
    ];
    cards.forEach((c, i) => {
      const cx = 0.5 + i * 1.9;
      slide.addShape("rect", {
        x: cx, y: 2.85, w: 1.7, h: 1.7,
        fill: { color: DS.white },
        shadow: { type: "outer", blur: 4, offset: 2, color: "CCCCCC", opacity: 0.3 },
        rectRadius: 0.06,
      });
      // Terracotta top edge on card
      slide.addShape("rect", {
        x: cx, y: 2.85, w: 1.7, h: 0.06,
        fill: { color: DS.terracotta },
        rectRadius: 0.03,
      });
      slide.addText(c.label, {
        x: cx + 0.1, y: 3.2, w: 1.5, h: 1.0,
        fontSize: 12, fontFace: DS.bodyFont, color: DS.dark,
        align: "center", valign: "middle",
        lineSpacingMultiple: 1.2,
      });
    });

    // Roles row
    slide.addText("Three User Roles", {
      x: 0.7, y: 4.9, w: 4, h: 0.4,
      fontSize: 14, fontFace: DS.headFont, bold: true, color: DS.navy,
    });

    const roles = ["Student", "Librarian", "Administrator"];
    roles.forEach((r, i) => {
      const rx = 0.7 + i * 2.8;
      slide.addShape("roundRect", {
        x: rx, y: 5.4, w: 2.4, h: 0.55,
        fill: { color: i === 0 ? DS.terracotta : (i === 1 ? DS.navy : DS.dark) },
        rectRadius: 0.06,
      });
      slide.addText(r, {
        x: rx, y: 5.4, w: 2.4, h: 0.55,
        fontSize: 13, fontFace: DS.bodyFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });
    });
  }

  // ── Slide 3: Problem Statement ─────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Problem Statement", bg: DS.creamDark, num: 3, total: TOTAL, footer: FOOTER });

    const problems = [
      "Traditional library systems rely heavily on manual, paper-based processes that are slow and error-prone",
      "Students cannot easily search the catalog or reserve books remotely \u2014 they must visit the library in person",
      "Librarians spend disproportionate time on repetitive paperwork instead of assisting patrons",
      "No real-time tracking of book availability leads to wasted trips and frustrated users",
      "Fine calculation and collection is inconsistent, with no automated record-keeping",
      "Management lacks consolidated reporting to make informed decisions about library resources",
    ];

    addBullets(slide, problems, { fontSize: 14.5, y: 1.4 });

    // Accent quote box at bottom
    slide.addShape("rect", {
      x: 0.7, y: 5.8, w: 8.6, h: 0.85,
      fill: { color: DS.lightAccent },
      rectRadius: 0.05,
    });
    slide.addShape("rect", {
      x: 0.7, y: 5.8, w: 0.08, h: 0.85,
      fill: { color: DS.terracotta },
    });
    slide.addText("\"Universities need a modern, integrated solution that brings their library services into the digital age.\"", {
      x: 1.0, y: 5.85, w: 8.1, h: 0.75,
      fontSize: 12.5, fontFace: DS.headFont, italic: true, color: DS.navy,
      valign: "middle",
    });
  }

  // ── Slide 4: Objectives ────────────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Objectives", num: 4, total: TOTAL, footer: FOOTER });

    const objectives = [
      { main: "Automate Library Operations", desc: "Replace manual workflows with streamlined digital processes for issuing, returning, and managing books" },
      { main: "Enable Student Self-Service", desc: "Allow students to search, reserve, and manage their borrowings independently from any device" },
      { main: "Real-Time Availability Tracking", desc: "Provide instant, accurate information about book availability and location" },
      { main: "Automate Fine Management", desc: "Calculate overdue fines automatically and maintain transparent payment records" },
      { main: "Comprehensive Reporting", desc: "Generate actionable reports on circulation, inventory, and user activity for informed decision-making" },
    ];

    objectives.forEach((obj, i) => {
      const oy = 1.4 + i * 1.08;
      // Number circle
      slide.addShape("ellipse", {
        x: 0.6, y: oy + 0.05, w: 0.45, h: 0.45,
        fill: { color: DS.terracotta },
      });
      slide.addText(`${i + 1}`, {
        x: 0.6, y: oy + 0.05, w: 0.45, h: 0.45,
        fontSize: 16, fontFace: DS.headFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });
      // Title
      slide.addText(obj.main, {
        x: 1.25, y: oy, w: 8.0, h: 0.38,
        fontSize: 15, fontFace: DS.headFont, bold: true, color: DS.navy,
      });
      // Description
      slide.addText(obj.desc, {
        x: 1.25, y: oy + 0.38, w: 8.0, h: 0.55,
        fontSize: 12, fontFace: DS.bodyFont, color: DS.muted,
        lineSpacingMultiple: 1.2,
      });
    });
  }

  // ── Slide 5: System Architecture ───────────────────────────
  {
    const slide = contentSlide(pptx, { title: "System Architecture", bg: DS.creamDark, num: 5, total: TOTAL, footer: FOOTER });

    // Architecture diagram using boxes
    const layers = [
      { label: "Presentation Layer", sub: "HTML5 / CSS3 / Responsive UI", color: DS.terracotta, y: 1.55 },
      { label: "Application Layer", sub: "Vanilla JavaScript / SPA Logic", color: DS.navy, y: 2.75 },
      { label: "Data Access Layer", sub: "JSON Serialization / CRUD Operations", color: "4A6A8A", y: 3.95 },
      { label: "Persistence Layer", sub: "localStorage / Browser Storage", color: DS.dark, y: 5.15 },
    ];

    layers.forEach((l) => {
      slide.addShape("roundRect", {
        x: 1.5, y: l.y, w: 7.0, h: 0.95,
        fill: { color: l.color },
        rectRadius: 0.06,
        shadow: { type: "outer", blur: 3, offset: 2, color: "999999", opacity: 0.2 },
      });
      slide.addText(l.label, {
        x: 1.7, y: l.y + 0.08, w: 6.6, h: 0.45,
        fontSize: 16, fontFace: DS.headFont, bold: true, color: DS.white,
        align: "center",
      });
      slide.addText(l.sub, {
        x: 1.7, y: l.y + 0.48, w: 6.6, h: 0.35,
        fontSize: 11, fontFace: DS.bodyFont, color: "DDDDDD",
        align: "center",
      });
    });

    // Arrows between layers
    for (let i = 0; i < 3; i++) {
      const ay = layers[i].y + 0.95;
      slide.addShape("rect", {
        x: 4.85, y: ay, w: 0.3, h: layers[i + 1].y - ay,
        fill: { color: DS.terracotta },
      });
    }

    // Side label
    slide.addText("Client-Side\nSPA", {
      x: 8.7, y: 2.2, w: 1.1, h: 1.0,
      fontSize: 11, fontFace: DS.bodyFont, bold: true,
      color: DS.terracotta, align: "center", rotate: 0,
    });

    slide.addText("Role-Based\nAccess Control", {
      x: 8.7, y: 3.8, w: 1.1, h: 1.0,
      fontSize: 11, fontFace: DS.bodyFont, bold: true,
      color: DS.navy, align: "center",
    });
  }

  // ── Slide 6: Key Features - Student ────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Key Features \u2014 Student Portal", num: 6, total: TOTAL, footer: FOOTER });

    const features = [
      "Personal dashboard displaying active borrowings, pending reservations, and due-date reminders",
      "Full book catalog with search by title, author, ISBN, and category filters",
      "One-click book reservation with automatic expiry management",
      "Borrowing history with status tracking (active, returned, overdue)",
      "Fine tracking with detailed breakdown and simulated payment processing",
      "Profile management with editable personal information",
    ];

    addBullets(slide, features, { fontSize: 14.5 });

    // Small accent card
    slide.addShape("rect", {
      x: 0.7, y: 6.1, w: 8.6, h: 0.6,
      fill: { color: DS.navy },
      rectRadius: 0.05,
    });
    slide.addText("Designed for simplicity \u2014 students can manage their entire library experience from one interface.", {
      x: 1.0, y: 6.1, w: 8.0, h: 0.6,
      fontSize: 11.5, fontFace: DS.bodyFont, italic: true, color: "CCDDEE",
      valign: "middle",
    });
  }

  // ── Slide 7: Key Features - Librarian ──────────────────────
  {
    const slide = contentSlide(pptx, { title: "Key Features \u2014 Librarian Portal", bg: DS.creamDark, num: 7, total: TOTAL, footer: FOOTER });

    const features = [
      "Complete book catalog management \u2014 add, edit, update, and remove books (CRUD)",
      "Issue books to students with automatic due-date assignment based on system settings",
      "Process book returns with automatic overdue detection and fine calculation",
      "View and manage all active borrowings, reservations, and pending returns",
      "Generate operational reports: most borrowed books, overdue items, daily transactions",
      "Quick-search students by name or ID to view their borrowing history",
    ];

    addBullets(slide, features, { fontSize: 14.5 });
  }

  // ── Slide 8: Key Features - Admin ──────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Key Features \u2014 Admin Portal", num: 8, total: TOTAL, footer: FOOTER });

    const features = [
      "User management \u2014 create, update, and deactivate student and librarian accounts",
      "System configuration \u2014 set borrowing limits, loan durations, and fine rates",
      "Comprehensive system reports covering all users, books, and transactions",
      "Data management utilities including system reset and data export capabilities",
      "Activity monitoring across all user roles for oversight and auditing",
    ];

    addBullets(slide, features, { fontSize: 14.5 });

    // Visual: three role boxes
    slide.addText("Role Hierarchy", {
      x: 0.7, y: 5.3, w: 3, h: 0.35,
      fontSize: 13, fontFace: DS.headFont, bold: true, color: DS.navy,
    });

    const rboxes = [
      { label: "Admin", color: DS.dark, x: 0.7 },
      { label: "Librarian", color: DS.navy, x: 3.2 },
      { label: "Student", color: DS.terracotta, x: 5.7 },
    ];
    rboxes.forEach((rb) => {
      slide.addShape("roundRect", {
        x: rb.x, y: 5.75, w: 2.2, h: 0.5,
        fill: { color: rb.color },
        rectRadius: 0.05,
      });
      slide.addText(rb.label, {
        x: rb.x, y: 5.75, w: 2.2, h: 0.5,
        fontSize: 13, fontFace: DS.bodyFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });
    });

    // Arrows
    slide.addShape("rect", { x: 2.9, y: 5.92, w: 0.3, h: 0.06, fill: { color: DS.muted } });
    slide.addShape("rect", { x: 5.4, y: 5.92, w: 0.3, h: 0.06, fill: { color: DS.muted } });
  }

  // ── Slide 9: Data Model ────────────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Data Model", bg: DS.creamDark, num: 9, total: TOTAL, footer: FOOTER });

    const entities = [
      { name: "Users", fields: "id, name, email, role,\npassword, status", x: 0.5, y: 1.55, color: DS.navy },
      { name: "Books", fields: "id, title, author, ISBN,\ncategory, copies, available", x: 3.5, y: 1.55, color: DS.navy },
      { name: "Borrowings", fields: "id, userId, bookId,\nissueDate, dueDate, status", x: 6.5, y: 1.55, color: DS.navy },
      { name: "Reservations", fields: "id, userId, bookId,\nreserveDate, expiryDate", x: 0.5, y: 3.85, color: DS.terracotta },
      { name: "Fines", fields: "id, userId, borrowingId,\namount, status, paidDate", x: 3.5, y: 3.85, color: DS.terracotta },
      { name: "Settings", fields: "loanDuration, fineRate,\nmaxBooks, maxReservations", x: 6.5, y: 3.85, color: DS.terracotta },
    ];

    entities.forEach((e) => {
      // Card background
      slide.addShape("roundRect", {
        x: e.x, y: e.y, w: 2.7, h: 1.9,
        fill: { color: DS.white },
        shadow: { type: "outer", blur: 3, offset: 2, color: "BBBBBB", opacity: 0.25 },
        rectRadius: 0.06,
      });
      // Header
      slide.addShape("rect", {
        x: e.x, y: e.y, w: 2.7, h: 0.5,
        fill: { color: e.color },
        rectRadius: 0.06,
      });
      // Fix bottom corners of header (overlay rectangle)
      slide.addShape("rect", {
        x: e.x, y: e.y + 0.35, w: 2.7, h: 0.15,
        fill: { color: e.color },
      });
      slide.addText(e.name, {
        x: e.x, y: e.y, w: 2.7, h: 0.5,
        fontSize: 14, fontFace: DS.headFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });
      // Fields
      slide.addText(e.fields, {
        x: e.x + 0.15, y: e.y + 0.6, w: 2.4, h: 1.2,
        fontSize: 10.5, fontFace: DS.bodyFont, color: DS.muted,
        lineSpacingMultiple: 1.4, valign: "top",
      });
    });

    // Relationship lines (horizontal)
    slide.addShape("rect", { x: 3.2, y: 2.45, w: 0.3, h: 0.04, fill: { color: DS.muted } });
    slide.addShape("rect", { x: 6.2, y: 2.45, w: 0.3, h: 0.04, fill: { color: DS.muted } });
    // Vertical connections
    slide.addShape("rect", { x: 1.8, y: 3.45, w: 0.04, h: 0.4, fill: { color: DS.muted } });
    slide.addShape("rect", { x: 4.8, y: 3.45, w: 0.04, h: 0.4, fill: { color: DS.muted } });
  }

  // ── Slide 10: User Interface Design ────────────────────────
  {
    const slide = contentSlide(pptx, { title: "User Interface Design", num: 10, total: TOTAL, footer: FOOTER });

    const principles = [
      "Responsive layout built with CSS Grid and Flexbox \u2014 adapts to desktop, tablet, and mobile",
      "Card-based design language for consistent visual hierarchy across all modules",
      "Role-specific dashboards with relevant statistics and quick-action shortcuts",
      "Clean sidebar navigation with clear iconography and active-state indicators",
      "Advanced search with real-time filtering, sorting, and grid/list view toggle",
      "Consistent color coding: status badges, alerts, and action buttons follow a unified palette",
    ];

    addBullets(slide, principles, { fontSize: 14 });

    // UI approach boxes at bottom
    const approaches = ["Responsive", "Card-Based", "Role-Specific", "Accessible"];
    approaches.forEach((a, i) => {
      const ax = 0.7 + i * 2.2;
      slide.addShape("roundRect", {
        x: ax, y: 6.0, w: 1.95, h: 0.55,
        fill: { color: i % 2 === 0 ? DS.terracotta : DS.navy },
        rectRadius: 0.05,
      });
      slide.addText(a, {
        x: ax, y: 6.0, w: 1.95, h: 0.55,
        fontSize: 12, fontFace: DS.bodyFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });
    });
  }

  // ── Slide 11: Testing & Validation ─────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Testing & Validation", bg: DS.creamDark, num: 11, total: TOTAL, footer: FOOTER });

    addTwoColumns(slide,
      [
        "Unit testing of core modules (authentication, data access, fine calculation)",
        "Integration testing of cross-module workflows (borrow-return-fine pipeline)",
        "Boundary testing for edge cases (max books, expired reservations)",
      ],
      [
        "User acceptance testing with sample university scenarios",
        "Cross-browser compatibility (Chrome, Firefox, Edge, Safari)",
        "Responsive design testing across screen sizes and devices",
      ],
      { leftTitle: "Functional Testing", rightTitle: "Quality Assurance", y: 1.5 }
    );
  }

  // ── Slide 12: Project Timeline ─────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Project Timeline", num: 12, total: TOTAL, footer: FOOTER });

    const phases = [
      { name: "Requirements Gathering", weeks: "Weeks 1\u20132", w: 1.2, color: DS.terracotta },
      { name: "System Design", weeks: "Weeks 2\u20134", w: 1.5, color: DS.navy },
      { name: "Implementation", weeks: "Weeks 4\u20138", w: 3.0, color: DS.terracotta },
      { name: "Testing", weeks: "Weeks 7\u20139", w: 1.8, color: "4A6A8A" },
      { name: "Documentation", weeks: "Weeks 8\u201310", w: 1.8, color: DS.dark },
      { name: "Deployment", weeks: "Weeks 10\u201311", w: 1.0, color: DS.navy },
    ];

    // Gantt-like bars
    const barStartX = 3.2;
    const barMaxW = 5.8;
    const weekTotal = 11;

    const phasePositions = [
      { start: 0, end: 2 },
      { start: 1, end: 4 },
      { start: 3, end: 8 },
      { start: 6, end: 9 },
      { start: 7, end: 10 },
      { start: 9, end: 11 },
    ];

    phases.forEach((p, i) => {
      const py = 1.6 + i * 0.88;
      // Phase label
      slide.addText(p.name, {
        x: 0.5, y: py + 0.05, w: 2.5, h: 0.4,
        fontSize: 12.5, fontFace: DS.bodyFont, bold: true, color: DS.dark,
        align: "right",
      });
      slide.addText(p.weeks, {
        x: 0.5, y: py + 0.4, w: 2.5, h: 0.3,
        fontSize: 10, fontFace: DS.bodyFont, color: DS.muted,
        align: "right",
      });
      // Bar
      const bx = barStartX + (phasePositions[i].start / weekTotal) * barMaxW;
      const bw = ((phasePositions[i].end - phasePositions[i].start) / weekTotal) * barMaxW;
      slide.addShape("roundRect", {
        x: bx, y: py + 0.1, w: bw, h: 0.45,
        fill: { color: p.color },
        rectRadius: 0.06,
      });
    });

    // Week scale at bottom
    slide.addShape("rect", {
      x: barStartX, y: 7.0, w: barMaxW, h: 0.02,
      fill: { color: DS.muted },
    });
    for (let w = 0; w <= weekTotal; w++) {
      const wx = barStartX + (w / weekTotal) * barMaxW;
      slide.addText(`${w + 1}`, {
        x: wx - 0.15, y: 6.75, w: 0.3, h: 0.25,
        fontSize: 8, fontFace: DS.bodyFont, color: DS.muted, align: "center",
      });
    }
  }

  // ── Slide 13: Challenges & Solutions ───────────────────────
  {
    const slide = contentSlide(pptx, { title: "Challenges & Solutions", bg: DS.creamDark, num: 13, total: TOTAL, footer: FOOTER });

    const items = [
      { challenge: "localStorage size and query limitations", solution: "Implemented a structured data access layer with indexed lookups and JSON serialization" },
      { challenge: "Role-based access control without a backend", solution: "Page-level separation with client-side route guards and session validation" },
      { challenge: "Responsive design across many modules", solution: "CSS media queries with mobile-first approach and consistent component library" },
      { challenge: "Data persistence and integrity", solution: "Atomic JSON read/write operations with validation checks on every data mutation" },
    ];

    items.forEach((item, i) => {
      const iy = 1.5 + i * 1.35;

      // Challenge box
      slide.addShape("roundRect", {
        x: 0.5, y: iy, w: 4.2, h: 0.95,
        fill: { color: DS.white },
        rectRadius: 0.05,
        shadow: { type: "outer", blur: 2, offset: 1, color: "CCCCCC", opacity: 0.2 },
      });
      slide.addShape("rect", {
        x: 0.5, y: iy, w: 0.07, h: 0.95,
        fill: { color: DS.terracotta },
      });
      slide.addText("Challenge", {
        x: 0.75, y: iy + 0.02, w: 3.8, h: 0.28,
        fontSize: 9, fontFace: DS.bodyFont, bold: true, color: DS.terracotta,
      });
      slide.addText(item.challenge, {
        x: 0.75, y: iy + 0.3, w: 3.8, h: 0.55,
        fontSize: 12, fontFace: DS.bodyFont, color: DS.dark, valign: "top",
      });

      // Arrow
      slide.addText("\u2192", {
        x: 4.7, y: iy + 0.15, w: 0.5, h: 0.6,
        fontSize: 20, fontFace: DS.bodyFont, color: DS.terracotta,
        align: "center", valign: "middle",
      });

      // Solution box
      slide.addShape("roundRect", {
        x: 5.2, y: iy, w: 4.3, h: 0.95,
        fill: { color: DS.white },
        rectRadius: 0.05,
        shadow: { type: "outer", blur: 2, offset: 1, color: "CCCCCC", opacity: 0.2 },
      });
      slide.addShape("rect", {
        x: 5.2, y: iy, w: 0.07, h: 0.95,
        fill: { color: DS.navy },
      });
      slide.addText("Solution", {
        x: 5.45, y: iy + 0.02, w: 3.9, h: 0.28,
        fontSize: 9, fontFace: DS.bodyFont, bold: true, color: DS.navy,
      });
      slide.addText(item.solution, {
        x: 5.45, y: iy + 0.3, w: 3.9, h: 0.55,
        fontSize: 11.5, fontFace: DS.bodyFont, color: DS.dark, valign: "top",
        lineSpacingMultiple: 1.15,
      });
    });
  }

  // ── Slide 14: Conclusion & Future Work ─────────────────────
  {
    const slide = contentSlide(pptx, { title: "Conclusion & Future Work", num: 14, total: TOTAL, footer: FOOTER });

    // Conclusion section
    slide.addText("Summary", {
      x: 0.7, y: 1.4, w: 3, h: 0.35,
      fontSize: 15, fontFace: DS.headFont, bold: true, color: DS.navy,
    });
    slide.addShape("rect", { x: 0.7, y: 1.78, w: 0.8, h: 0.04, fill: { color: DS.terracotta } });

    addBullets(slide, [
      "Successfully developed a fully functional library management system",
      "Implemented all three user roles with comprehensive feature sets",
      "Achieved responsive, intuitive UI with consistent design language",
    ], { y: 1.95, h: 1.8, fontSize: 13 });

    // Future work section
    slide.addText("Future Enhancements", {
      x: 0.7, y: 3.9, w: 4, h: 0.35,
      fontSize: 15, fontFace: DS.headFont, bold: true, color: DS.terracotta,
    });
    slide.addShape("rect", { x: 0.7, y: 4.28, w: 0.8, h: 0.04, fill: { color: DS.terracotta } });

    const futureItems = [
      "Backend migration with Node.js/Express and proper database (PostgreSQL or MongoDB)",
      "Barcode/QR code scanning for streamlined book issuing and returns",
      "Email notification system for due-date reminders and reservation alerts",
      "Native mobile application for on-the-go library access",
      "Advanced analytics dashboard with trend analysis and predictive insights",
    ];

    addBullets(slide, futureItems, { y: 4.45, h: 2.4, fontSize: 12.5 });
  }

  // ── Slide 15: Thank You / Q&A ──────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.background = { fill: DS.navy };

    // Large decorative terracotta shape
    slide.addShape("rect", {
      x: 0, y: 3.3, w: "100%", h: 0.08,
      fill: { color: DS.terracotta },
    });

    slide.addText("Thank You", {
      x: 0, y: 1.8, w: "100%", h: 1.0,
      fontSize: 44, fontFace: DS.headFont, bold: true,
      color: DS.white, align: "center",
    });

    slide.addText("Questions & Discussion", {
      x: 0, y: 3.8, w: "100%", h: 0.7,
      fontSize: 20, fontFace: DS.bodyFont,
      color: DS.lightAccent, align: "center",
    });

    slide.addText("SmartLib \u2014 Smart University Library Management System", {
      x: 0, y: 5.2, w: "100%", h: 0.4,
      fontSize: 12, fontFace: DS.bodyFont,
      color: "7A8FAA", align: "center",
    });

    // Bottom terracotta accent
    slide.addShape("rect", {
      x: 3.5, y: 6.5, w: 3.0, h: 0.06,
      fill: { color: DS.terracotta },
    });
  }

  return pptx;
}


// ═════════════════════════════════════════════════════════════════
//  PRESENTATION 2 — Software Architecture Design
// ═════════════════════════════════════════════════════════════════

function generateSAD() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "SmartLib Team";
  pptx.title = "SmartLib - Software Architecture Design";

  const TOTAL = 16;
  const FOOTER = "SmartLib  |  Software Architecture Design";

  // ── Slide 1: Title ─────────────────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.background = { fill: DS.cream };
    addTitleSlideDecor(slide);

    slide.addText("SmartLib", {
      x: 0.5, y: 1.5, w: 3.5, h: 0.9,
      fontSize: 40, fontFace: DS.headFont, bold: true,
      color: DS.white,
    });

    slide.addShape("rect", {
      x: 0.5, y: 2.5, w: 1.4, h: 0.06,
      fill: { color: DS.terracotta },
    });

    slide.addText("Smart University\nLibrary Management System", {
      x: 0.5, y: 2.75, w: 3.5, h: 1.0,
      fontSize: 16, fontFace: DS.bodyFont,
      color: "AABBCC", lineSpacingMultiple: 1.3,
    });

    slide.addText("Software Architecture Design", {
      x: 4.6, y: 2.0, w: 5.0, h: 0.6,
      fontSize: 22, fontFace: DS.headFont, bold: true,
      color: DS.navy,
    });

    slide.addShape("rect", {
      x: 4.6, y: 2.7, w: 1.0, h: 0.05,
      fill: { color: DS.terracotta },
    });

    slide.addText("2026", {
      x: 4.6, y: 3.1, w: 5.0, h: 0.4,
      fontSize: 14, fontFace: DS.bodyFont, color: DS.muted,
    });
  }

  // ── Slide 2: Introduction ──────────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Introduction", num: 2, total: TOTAL, footer: FOOTER });

    addParagraph(slide,
      "This presentation documents the architectural design of SmartLib, a web-based university library management system. " +
      "It covers the key architectural decisions, component structure, data flows, and quality attributes that guide the system's design.",
      { y: 1.45, h: 1.2, fontSize: 14.5 }
    );

    slide.addShape("rect", { x: 0.7, y: 2.85, w: 8.6, h: 0.04, fill: { color: DS.lightAccent } });

    addBullets(slide, [
      "Defines the structural organization of the system and its subsystems",
      "Documents data flow, persistence strategy, and security mechanisms",
      "Identifies design patterns and architectural styles employed",
      "Evaluates trade-offs and rationale behind key design decisions",
      "Serves as a reference for future maintenance, extension, and migration",
    ], { y: 3.1, h: 3.5, fontSize: 13.5 });
  }

  // ── Slide 3: Architectural Goals ───────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Architectural Goals", bg: DS.creamDark, num: 3, total: TOTAL, footer: FOOTER });

    const goals = [
      { name: "Modularity", desc: "Independent, self-contained modules that can be developed and tested in isolation" },
      { name: "Scalability", desc: "Architecture that can accommodate growth in data volume and feature scope" },
      { name: "Maintainability", desc: "Clean separation of concerns enabling efficient bug fixes and enhancements" },
      { name: "Security", desc: "Role-based access control with proper session management and data isolation" },
      { name: "Performance", desc: "Client-side rendering and local data access for fast, responsive interactions" },
      { name: "Usability", desc: "Intuitive interfaces tailored to each user role's specific workflows" },
    ];

    goals.forEach((g, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const gx = col === 0 ? 0.5 : 5.1;
      const gy = 1.5 + row * 1.65;

      slide.addShape("roundRect", {
        x: gx, y: gy, w: 4.4, h: 1.35,
        fill: { color: DS.white },
        rectRadius: 0.06,
        shadow: { type: "outer", blur: 3, offset: 2, color: "BBBBBB", opacity: 0.2 },
      });
      // Color accent left edge
      slide.addShape("rect", {
        x: gx, y: gy, w: 0.07, h: 1.35,
        fill: { color: i % 2 === 0 ? DS.terracotta : DS.navy },
      });
      slide.addText(g.name, {
        x: gx + 0.25, y: gy + 0.1, w: 4.0, h: 0.35,
        fontSize: 14, fontFace: DS.headFont, bold: true,
        color: i % 2 === 0 ? DS.terracotta : DS.navy,
      });
      slide.addText(g.desc, {
        x: gx + 0.25, y: gy + 0.5, w: 4.0, h: 0.75,
        fontSize: 11.5, fontFace: DS.bodyFont, color: DS.muted,
        lineSpacingMultiple: 1.25, valign: "top",
      });
    });
  }

  // ── Slide 4: System Context ────────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "System Context", num: 4, total: TOTAL, footer: FOOTER });

    // Central SmartLib box
    slide.addShape("roundRect", {
      x: 3.2, y: 2.8, w: 3.6, h: 1.6,
      fill: { color: DS.navy },
      rectRadius: 0.08,
      shadow: { type: "outer", blur: 5, offset: 3, color: "999999", opacity: 0.3 },
    });
    slide.addText("SmartLib\nLibrary Management\nSystem", {
      x: 3.2, y: 2.9, w: 3.6, h: 1.4,
      fontSize: 15, fontFace: DS.headFont, bold: true,
      color: DS.white, align: "center", valign: "middle",
      lineSpacingMultiple: 1.3,
    });

    // External entities
    const entities = [
      { label: "Students", x: 0.3, y: 1.5, color: DS.terracotta },
      { label: "Librarians", x: 7.2, y: 1.5, color: DS.terracotta },
      { label: "Administrators", x: 0.3, y: 5.2, color: DS.terracotta },
      { label: "Student\nDatabase", x: 7.2, y: 5.2, color: "4A6A8A" },
    ];

    entities.forEach((e) => {
      slide.addShape("roundRect", {
        x: e.x, y: e.y, w: 2.4, h: 0.9,
        fill: { color: e.color },
        rectRadius: 0.06,
      });
      slide.addText(e.label, {
        x: e.x, y: e.y, w: 2.4, h: 0.9,
        fontSize: 12, fontFace: DS.bodyFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
        lineSpacingMultiple: 1.15,
      });
    });

    // Connection lines (simple rectangles as lines)
    // Students -> SmartLib
    slide.addShape("rect", { x: 2.7, y: 1.9, w: 0.5, h: 0.04, fill: { color: DS.muted } });
    slide.addShape("rect", { x: 3.15, y: 1.94, w: 0.04, h: 0.86, fill: { color: DS.muted } });
    // Librarians -> SmartLib
    slide.addShape("rect", { x: 6.8, y: 1.9, w: 0.4, h: 0.04, fill: { color: DS.muted } });
    slide.addShape("rect", { x: 6.8, y: 1.94, w: 0.04, h: 0.86, fill: { color: DS.muted } });
    // Admin -> SmartLib
    slide.addShape("rect", { x: 2.7, y: 5.6, w: 0.5, h: 0.04, fill: { color: DS.muted } });
    slide.addShape("rect", { x: 3.15, y: 4.4, w: 0.04, h: 1.2, fill: { color: DS.muted } });
    // Student DB -> SmartLib
    slide.addShape("rect", { x: 6.8, y: 5.6, w: 0.4, h: 0.04, fill: { color: DS.muted } });
    slide.addShape("rect", { x: 6.8, y: 4.4, w: 0.04, h: 1.2, fill: { color: DS.muted } });
  }

  // ── Slide 5: Architectural Style ───────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Architectural Style", bg: DS.creamDark, num: 5, total: TOTAL, footer: FOOTER });

    const styles = [
      "Client-side Single Page Application (SPA) with modular JavaScript architecture",
      "Event-driven communication between loosely coupled modules using custom events",
      "Local data persistence layer abstracting storage operations behind a clean API",
      "MVC-inspired separation of concerns \u2014 views (HTML/CSS), controllers (JS modules), models (data layer)",
      "Convention-based routing with role-specific page loading and access validation",
    ];

    addBullets(slide, styles, { fontSize: 14.5 });

    // Visual label boxes
    const labels = [
      { text: "SPA", color: DS.terracotta },
      { text: "Event-Driven", color: DS.navy },
      { text: "MVC-Inspired", color: "4A6A8A" },
      { text: "Modular JS", color: DS.dark },
    ];
    labels.forEach((l, i) => {
      slide.addShape("roundRect", {
        x: 0.7 + i * 2.25, y: 5.85, w: 2.0, h: 0.5,
        fill: { color: l.color },
        rectRadius: 0.05,
      });
      slide.addText(l.text, {
        x: 0.7 + i * 2.25, y: 5.85, w: 2.0, h: 0.5,
        fontSize: 12, fontFace: DS.bodyFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });
    });
  }

  // ── Slide 6: Component Architecture ────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Component Architecture", num: 6, total: TOTAL, footer: FOOTER });

    const components = [
      { name: "Authentication\nModule", color: DS.navy },
      { name: "Book Catalog\nModule", color: DS.terracotta },
      { name: "Borrowing\nManagement", color: DS.navy },
      { name: "Reservation\nModule", color: DS.terracotta },
      { name: "Fine\nManagement", color: DS.navy },
      { name: "Reporting\nModule", color: DS.terracotta },
      { name: "User\nManagement", color: DS.navy },
      { name: "Settings\nModule", color: DS.terracotta },
    ];

    // 2 rows of 4
    components.forEach((c, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const cx = 0.5 + col * 2.4;
      const cy = 1.6 + row * 2.2;

      slide.addShape("roundRect", {
        x: cx, y: cy, w: 2.1, h: 1.5,
        fill: { color: DS.white },
        shadow: { type: "outer", blur: 3, offset: 2, color: "BBBBBB", opacity: 0.2 },
        rectRadius: 0.06,
      });
      // Top accent
      slide.addShape("rect", {
        x: cx, y: cy, w: 2.1, h: 0.07,
        fill: { color: c.color },
        rectRadius: 0.03,
      });
      slide.addText(c.name, {
        x: cx, y: cy + 0.2, w: 2.1, h: 1.1,
        fontSize: 13, fontFace: DS.headFont, bold: true,
        color: DS.dark, align: "center", valign: "middle",
        lineSpacingMultiple: 1.3,
      });
    });

    // Shared services bar at bottom
    slide.addShape("roundRect", {
      x: 0.5, y: 6.1, w: 9.0, h: 0.55,
      fill: { color: DS.navy },
      rectRadius: 0.06,
    });
    slide.addText("Shared Services:   Data Access Layer   |   Event Bus   |   Validation   |   Session Management", {
      x: 0.5, y: 6.1, w: 9.0, h: 0.55,
      fontSize: 11.5, fontFace: DS.bodyFont, bold: true,
      color: DS.white, align: "center", valign: "middle",
    });
  }

  // ── Slide 7: Data Architecture ─────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Data Architecture", bg: DS.creamDark, num: 7, total: TOTAL, footer: FOOTER });

    addBullets(slide, [
      "Entity-relationship model with six core entities: Users, Books, Borrowings, Reservations, Fines, Settings",
      "All data stored as JSON objects in the browser's localStorage API",
      "Data access layer provides CRUD operations with built-in validation and error handling",
      "Referential integrity enforced at the application level through ID-based relationships",
      "Atomic read-write operations prevent partial updates and data corruption",
      "Structured key naming convention for organized storage: smartlib_users, smartlib_books, etc.",
    ], { fontSize: 14 });

    // Data flow visualization
    slide.addShape("rect", { x: 0.7, y: 5.75, w: 8.6, h: 0.04, fill: { color: DS.lightAccent } });

    const flowSteps = ["UI Layer", "Controller", "Data Access", "localStorage"];
    flowSteps.forEach((s, i) => {
      const fx = 1.0 + i * 2.3;
      slide.addShape("roundRect", {
        x: fx, y: 6.05, w: 1.8, h: 0.5,
        fill: { color: i % 2 === 0 ? DS.terracotta : DS.navy },
        rectRadius: 0.05,
      });
      slide.addText(s, {
        x: fx, y: 6.05, w: 1.8, h: 0.5,
        fontSize: 11, fontFace: DS.bodyFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });
      // Arrow between steps
      if (i < 3) {
        slide.addText("\u2192", {
          x: fx + 1.8, y: 6.0, w: 0.5, h: 0.55,
          fontSize: 18, color: DS.muted, align: "center", valign: "middle",
        });
      }
    });
  }

  // ── Slide 8: DFD Level 0 ──────────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Data Flow Diagram \u2014 Level 0 (Context)", num: 8, total: TOTAL, footer: FOOTER });

    // Central process
    slide.addShape("ellipse", {
      x: 3.3, y: 2.8, w: 3.4, h: 2.0,
      fill: { color: DS.navy },
      shadow: { type: "outer", blur: 4, offset: 2, color: "999999", opacity: 0.25 },
    });
    slide.addText("SmartLib\nSystem", {
      x: 3.3, y: 3.1, w: 3.4, h: 1.4,
      fontSize: 18, fontFace: DS.headFont, bold: true,
      color: DS.white, align: "center", valign: "middle",
    });

    // External entities
    const ext = [
      { label: "Student", x: 0.3, y: 1.5, flow: "Search, Borrow,\nReserve, Pay Fines" },
      { label: "Librarian", x: 7.3, y: 1.5, flow: "Manage Books,\nIssue/Return" },
      { label: "Admin", x: 0.3, y: 5.5, flow: "Manage Users,\nConfigure System" },
      { label: "Data Store", x: 7.3, y: 5.5, flow: "Read/Write\nPersisted Data" },
    ];

    ext.forEach((e) => {
      slide.addShape("rect", {
        x: e.x, y: e.y, w: 2.0, h: 0.65,
        fill: { color: DS.terracotta },
        rectRadius: 0.05,
      });
      slide.addText(e.label, {
        x: e.x, y: e.y, w: 2.0, h: 0.65,
        fontSize: 12, fontFace: DS.bodyFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });
      // Flow label
      const labelX = e.x < 4 ? e.x + 2.1 : e.x - 2.2;
      const labelY = e.y < 4 ? e.y + 0.7 : e.y - 0.6;
      slide.addText(e.flow, {
        x: labelX, y: labelY, w: 2.0, h: 0.6,
        fontSize: 9, fontFace: DS.bodyFont, italic: true, color: DS.muted,
        align: "center", lineSpacingMultiple: 1.15,
      });
    });
  }

  // ── Slide 9: DFD Level 1 ──────────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Data Flow Diagram \u2014 Level 1", bg: DS.creamDark, num: 9, total: TOTAL, footer: FOOTER });

    const processes = [
      { id: "1.0", name: "Authenticate\nUser", x: 0.4, y: 1.5, color: DS.navy },
      { id: "2.0", name: "Manage\nCatalog", x: 3.3, y: 1.5, color: DS.terracotta },
      { id: "3.0", name: "Process\nBorrowings", x: 6.3, y: 1.5, color: DS.navy },
      { id: "4.0", name: "Handle\nReservations", x: 0.4, y: 4.0, color: DS.terracotta },
      { id: "5.0", name: "Calculate\nFines", x: 3.3, y: 4.0, color: DS.navy },
      { id: "6.0", name: "Generate\nReports", x: 6.3, y: 4.0, color: DS.terracotta },
    ];

    processes.forEach((p) => {
      slide.addShape("ellipse", {
        x: p.x, y: p.y, w: 2.6, h: 1.5,
        fill: { color: p.color },
        shadow: { type: "outer", blur: 3, offset: 2, color: "AAAAAA", opacity: 0.2 },
      });
      slide.addText(p.id, {
        x: p.x + 0.8, y: p.y + 0.1, w: 1.0, h: 0.35,
        fontSize: 9, fontFace: DS.bodyFont, bold: true, color: "DDDDDD",
        align: "center",
      });
      slide.addText(p.name, {
        x: p.x + 0.2, y: p.y + 0.35, w: 2.2, h: 1.0,
        fontSize: 12, fontFace: DS.bodyFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
        lineSpacingMultiple: 1.2,
      });
    });

    // Data stores at bottom
    slide.addShape("rect", {
      x: 0.5, y: 6.05, w: 8.5, h: 0.55,
      fill: { color: DS.white },
      line: { color: DS.navy, width: 1.5 },
    });
    slide.addText("D1: Users    |    D2: Books    |    D3: Borrowings    |    D4: Reservations    |    D5: Fines    |    D6: Settings", {
      x: 0.5, y: 6.05, w: 8.5, h: 0.55,
      fontSize: 10.5, fontFace: DS.bodyFont, color: DS.navy,
      align: "center", valign: "middle",
    });
  }

  // ── Slide 10: Security Architecture ────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Security Architecture", num: 10, total: TOTAL, footer: FOOTER });

    const items = [
      "Role-based access control (RBAC) \u2014 three distinct permission levels enforced at the page and function level",
      "Session management using sessionStorage \u2014 user credentials validated on each page load",
      "Input validation and sanitization on all user-facing forms to prevent injection and data corruption",
      "Data isolation \u2014 students can only access their own borrowing records, fines, and profile data",
      "Secure password handling with client-side hashing for demonstration purposes",
      "Automatic session timeout and forced re-authentication after periods of inactivity",
    ];

    addBullets(slide, items, { fontSize: 14 });

    // RBAC visualization
    slide.addShape("rect", { x: 0.7, y: 5.9, w: 8.6, h: 0.04, fill: { color: DS.lightAccent } });

    const rbacLevels = [
      { role: "Admin", perms: "Full Access", color: DS.dark },
      { role: "Librarian", perms: "Books + Transactions", color: DS.navy },
      { role: "Student", perms: "Read + Self-Service", color: DS.terracotta },
    ];
    rbacLevels.forEach((r, i) => {
      const rx = 0.7 + i * 3.1;
      slide.addShape("roundRect", {
        x: rx, y: 6.15, w: 2.8, h: 0.5,
        fill: { color: r.color },
        rectRadius: 0.05,
      });
      slide.addText(`${r.role}: ${r.perms}`, {
        x: rx, y: 6.15, w: 2.8, h: 0.5,
        fontSize: 11, fontFace: DS.bodyFont, bold: true,
        color: DS.white, align: "center", valign: "middle",
      });
    });
  }

  // ── Slide 11: Deployment Architecture ──────────────────────
  {
    const slide = contentSlide(pptx, { title: "Deployment Architecture", bg: DS.creamDark, num: 11, total: TOTAL, footer: FOOTER });

    addBullets(slide, [
      "Static web application \u2014 requires only a standard web server or can run from the file system",
      "Pure client-side execution \u2014 no server-side runtime, database server, or API dependencies",
      "All application logic runs in the user's browser using standard Web APIs",
      "Data persisted locally in the browser's localStorage \u2014 no network calls for data operations",
      "Cross-browser compatible \u2014 tested on Chrome, Firefox, Edge, and Safari",
      "Zero-configuration deployment \u2014 copy files to any static hosting provider and serve",
    ], { fontSize: 14 });

    // Deployment diagram
    slide.addShape("roundRect", {
      x: 1.5, y: 5.5, w: 2.5, h: 0.7,
      fill: { color: DS.navy }, rectRadius: 0.06,
    });
    slide.addText("Web Server / CDN", {
      x: 1.5, y: 5.5, w: 2.5, h: 0.7,
      fontSize: 11, fontFace: DS.bodyFont, bold: true,
      color: DS.white, align: "center", valign: "middle",
    });

    slide.addText("\u2192", {
      x: 4.0, y: 5.5, w: 0.6, h: 0.7,
      fontSize: 22, color: DS.terracotta, align: "center", valign: "middle",
    });

    slide.addShape("roundRect", {
      x: 4.6, y: 5.5, w: 2.5, h: 0.7,
      fill: { color: DS.terracotta }, rectRadius: 0.06,
    });
    slide.addText("User's Browser", {
      x: 4.6, y: 5.5, w: 2.5, h: 0.7,
      fontSize: 11, fontFace: DS.bodyFont, bold: true,
      color: DS.white, align: "center", valign: "middle",
    });

    slide.addText("\u2192", {
      x: 7.1, y: 5.5, w: 0.6, h: 0.7,
      fontSize: 22, color: DS.terracotta, align: "center", valign: "middle",
    });

    slide.addShape("roundRect", {
      x: 7.7, y: 5.5, w: 2.0, h: 0.7,
      fill: { color: DS.dark }, rectRadius: 0.06,
    });
    slide.addText("localStorage", {
      x: 7.7, y: 5.5, w: 2.0, h: 0.7,
      fontSize: 11, fontFace: DS.bodyFont, bold: true,
      color: DS.white, align: "center", valign: "middle",
    });
  }

  // ── Slide 12: Design Patterns Used ─────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Design Patterns Used", num: 12, total: TOTAL, footer: FOOTER });

    const patterns = [
      { name: "Module Pattern", desc: "Each functional area is encapsulated in its own module with a clear public interface, hiding internal implementation details", color: DS.navy },
      { name: "Observer Pattern", desc: "Custom event system enables loose coupling between modules \u2014 components subscribe to and emit events without direct dependencies", color: DS.terracotta },
      { name: "Repository Pattern", desc: "Data access layer provides a collection-like interface for data operations, abstracting the underlying localStorage mechanism", color: DS.navy },
      { name: "Strategy Pattern", desc: "Role-based rendering uses interchangeable strategies to display different UI components and navigation based on the authenticated user's role", color: DS.terracotta },
    ];

    patterns.forEach((p, i) => {
      const py = 1.5 + i * 1.35;

      slide.addShape("roundRect", {
        x: 0.5, y: py, w: 9.0, h: 1.1,
        fill: { color: DS.white },
        rectRadius: 0.06,
        shadow: { type: "outer", blur: 3, offset: 2, color: "BBBBBB", opacity: 0.2 },
      });
      // Accent left edge
      slide.addShape("rect", {
        x: 0.5, y: py, w: 0.07, h: 1.1,
        fill: { color: p.color },
      });
      slide.addText(p.name, {
        x: 0.8, y: py + 0.08, w: 8.5, h: 0.32,
        fontSize: 14, fontFace: DS.headFont, bold: true, color: p.color,
      });
      slide.addText(p.desc, {
        x: 0.8, y: py + 0.42, w: 8.5, h: 0.6,
        fontSize: 11.5, fontFace: DS.bodyFont, color: DS.muted,
        lineSpacingMultiple: 1.2, valign: "top",
      });
    });
  }

  // ── Slide 13: Quality Attributes ───────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Quality Attributes", bg: DS.creamDark, num: 13, total: TOTAL, footer: FOOTER });

    const attrs = [
      { name: "Performance", desc: "Client-side rendering eliminates server round-trips. Data retrieved from localStorage in microseconds. DOM manipulation optimized for minimal reflows.", color: DS.terracotta },
      { name: "Reliability", desc: "Persistent local storage survives page refreshes and browser restarts. Validation prevents data corruption. Graceful error handling across all modules.", color: DS.navy },
      { name: "Usability", desc: "Responsive design adapts to all screen sizes. Role-tailored interfaces reduce cognitive load. Consistent visual language and interaction patterns.", color: DS.terracotta },
      { name: "Maintainability", desc: "Modular architecture enables independent updates. Consistent coding conventions. Separation of structure (HTML), presentation (CSS), and behavior (JS).", color: DS.navy },
    ];

    attrs.forEach((a, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const ax = col === 0 ? 0.5 : 5.1;
      const ay = 1.5 + row * 2.55;

      slide.addShape("roundRect", {
        x: ax, y: ay, w: 4.4, h: 2.2,
        fill: { color: DS.white },
        rectRadius: 0.06,
        shadow: { type: "outer", blur: 3, offset: 2, color: "BBBBBB", opacity: 0.2 },
      });
      // Top accent bar
      slide.addShape("rect", {
        x: ax, y: ay, w: 4.4, h: 0.07,
        fill: { color: a.color },
        rectRadius: 0.03,
      });
      slide.addText(a.name, {
        x: ax + 0.2, y: ay + 0.2, w: 4.0, h: 0.35,
        fontSize: 16, fontFace: DS.headFont, bold: true, color: a.color,
      });
      slide.addText(a.desc, {
        x: ax + 0.2, y: ay + 0.65, w: 4.0, h: 1.4,
        fontSize: 11.5, fontFace: DS.bodyFont, color: DS.muted,
        lineSpacingMultiple: 1.3, valign: "top",
      });
    });
  }

  // ── Slide 14: Trade-offs & Decisions ───────────────────────
  {
    const slide = contentSlide(pptx, { title: "Trade-offs & Decisions", num: 14, total: TOTAL, footer: FOOTER });

    const decisions = [
      {
        decision: "localStorage vs. Backend Database",
        rationale: "Eliminates server infrastructure complexity. Enables offline capability and instant data access. Trade-off: limited storage (~5MB) and no multi-device sync."
      },
      {
        decision: "Vanilla JavaScript vs. Framework (React/Vue)",
        rationale: "Reduces build complexity and dependencies. Demonstrates core programming skills. Trade-off: more manual DOM management and state handling."
      },
      {
        decision: "Single Page Application vs. Multi-Page",
        rationale: "Provides seamless navigation without full page reloads. Simpler routing with role-based page separation. Trade-off: initial load includes all code."
      },
    ];

    decisions.forEach((d, i) => {
      const dy = 1.5 + i * 1.75;

      // Decision header
      slide.addShape("roundRect", {
        x: 0.5, y: dy, w: 9.0, h: 0.5,
        fill: { color: i % 2 === 0 ? DS.navy : DS.terracotta },
        rectRadius: 0.05,
      });
      slide.addText(d.decision, {
        x: 0.7, y: dy, w: 8.6, h: 0.5,
        fontSize: 14, fontFace: DS.headFont, bold: true,
        color: DS.white, valign: "middle",
      });

      // Rationale
      slide.addShape("roundRect", {
        x: 0.5, y: dy + 0.5, w: 9.0, h: 1.0,
        fill: { color: DS.white },
        rectRadius: 0.05,
        shadow: { type: "outer", blur: 2, offset: 1, color: "CCCCCC", opacity: 0.15 },
      });
      slide.addText(d.rationale, {
        x: 0.7, y: dy + 0.55, w: 8.6, h: 0.9,
        fontSize: 12, fontFace: DS.bodyFont, color: DS.dark,
        lineSpacingMultiple: 1.25, valign: "top",
      });
    });
  }

  // ── Slide 15: Conclusion ───────────────────────────────────
  {
    const slide = contentSlide(pptx, { title: "Conclusion", bg: DS.creamDark, num: 15, total: TOTAL, footer: FOOTER });

    addParagraph(slide,
      "The SmartLib architecture was designed with careful attention to modularity, maintainability, and user experience. " +
      "Each architectural decision \u2014 from the choice of a client-side SPA to the use of localStorage for persistence \u2014 " +
      "was made with a clear understanding of the trade-offs involved.",
      { y: 1.45, h: 1.3, fontSize: 14 }
    );

    slide.addShape("rect", { x: 0.7, y: 2.95, w: 8.6, h: 0.04, fill: { color: DS.lightAccent } });

    addBullets(slide, [
      "Modular component architecture enables independent development and testing of each subsystem",
      "Structured data access layer provides a clean abstraction over browser storage mechanisms",
      "Role-based security model ensures appropriate access control across all system functions",
      "Design patterns (Module, Observer, Repository, Strategy) promote clean, maintainable code",
      "The architecture is designed to facilitate future migration to a server-based solution",
    ], { y: 3.2, h: 3.3, fontSize: 13.5 });
  }

  // ── Slide 16: Thank You / Q&A ─────────────────────────────
  {
    const slide = pptx.addSlide();
    slide.background = { fill: DS.navy };

    slide.addShape("rect", {
      x: 0, y: 3.3, w: "100%", h: 0.08,
      fill: { color: DS.terracotta },
    });

    slide.addText("Thank You", {
      x: 0, y: 1.8, w: "100%", h: 1.0,
      fontSize: 44, fontFace: DS.headFont, bold: true,
      color: DS.white, align: "center",
    });

    slide.addText("Questions & Discussion", {
      x: 0, y: 3.8, w: "100%", h: 0.7,
      fontSize: 20, fontFace: DS.bodyFont,
      color: DS.lightAccent, align: "center",
    });

    slide.addText("SmartLib \u2014 Software Architecture Design", {
      x: 0, y: 5.2, w: "100%", h: 0.4,
      fontSize: 12, fontFace: DS.bodyFont,
      color: "7A8FAA", align: "center",
    });

    slide.addShape("rect", {
      x: 3.5, y: 6.5, w: 3.0, h: 0.06,
      fill: { color: DS.terracotta },
    });
  }

  return pptx;
}


// ═════════════════════════════════════════════════════════════════
//  MAIN — Generate both presentations
// ═════════════════════════════════════════════════════════════════

async function main() {
  console.log("Generating SmartLib presentations...\n");

  // Ensure output directories exist
  const seDir = path.join(__dirname, "Software Engineering Assignment");
  const sadDir = path.join(__dirname, "SAD Assignment");

  if (!fs.existsSync(seDir)) fs.mkdirSync(seDir, { recursive: true });
  if (!fs.existsSync(sadDir)) fs.mkdirSync(sadDir, { recursive: true });

  // Generate SE Presentation
  const sePath = path.join(seDir, "SE_Presentation.pptx");
  console.log("  [1/2] Generating SE_Presentation.pptx ...");
  const sePptx = generateSE();
  await sePptx.writeFile({ fileName: sePath });
  const seStats = fs.statSync(sePath);
  console.log(`         Done. Size: ${(seStats.size / 1024).toFixed(1)} KB`);

  // Generate SAD Presentation
  const sadPath = path.join(sadDir, "SAD_Presentation.pptx");
  console.log("  [2/2] Generating SAD_Presentation.pptx ...");
  const sadPptx = generateSAD();
  await sadPptx.writeFile({ fileName: sadPath });
  const sadStats = fs.statSync(sadPath);
  console.log(`         Done. Size: ${(sadStats.size / 1024).toFixed(1)} KB`);

  console.log("\nBoth presentations generated successfully.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
