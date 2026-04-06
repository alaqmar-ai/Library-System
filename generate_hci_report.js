const fs = require("fs");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  Tab,
  TabStopType,
  TabStopPosition,
  LevelFormat,
  TableOfContents,
  ExternalHyperlink,
  convertInchesToTwip,
  LineRuleType,
  VerticalAlign,
} = require("docx");

// ─── Color constants ───
const NAVY = "2B4066";
const TERRACOTTA = "C0644B";
const WHITE = "FFFFFF";
const LIGHT_GRAY = "F2F2F2";
const MID_GRAY = "D9D9D9";

// ─── Helpers ───

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 40,
        font: "Georgia",
        color: NAVY,
      }),
    ],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 160 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 32,
        font: "Georgia",
        color: NAVY,
      }),
    ],
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26,
        font: "Calibri",
        color: "333333",
      }),
    ],
  });
}

function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    indent: opts.indent ? { firstLine: 720 } : undefined,
    children: [
      new TextRun({
        text,
        size: 24,
        font: "Calibri",
        bold: opts.bold || false,
        italics: opts.italics || false,
        color: opts.color || "333333",
      }),
    ],
  });
}

function bodyRuns(runs, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    indent: opts.indent ? { firstLine: 720 } : undefined,
    children: runs.map(
      (r) =>
        new TextRun({
          text: r.text,
          size: r.size || 24,
          font: r.font || "Calibri",
          bold: r.bold || false,
          italics: r.italics || false,
          color: r.color || "333333",
        })
    ),
  });
}

function bulletPoint(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullet-list", level },
    spacing: { after: 80, line: 360 },
    children: [
      new TextRun({
        text,
        size: 24,
        font: "Calibri",
        color: "333333",
      }),
    ],
  });
}

function bulletRuns(runs, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullet-list", level },
    spacing: { after: 80, line: 360 },
    children: runs.map(
      (r) =>
        new TextRun({
          text: r.text,
          size: r.size || 24,
          font: r.font || "Calibri",
          bold: r.bold || false,
          italics: r.italics || false,
          color: r.color || "333333",
        })
    ),
  });
}

function numberedItem(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "numbered-list", level },
    spacing: { after: 80, line: 360 },
    children: [
      new TextRun({
        text,
        size: 24,
        font: "Calibri",
        color: "333333",
      }),
    ],
  });
}

function numberedRuns(runs, level = 0) {
  return new Paragraph({
    numbering: { reference: "numbered-list", level },
    spacing: { after: 80, line: 360 },
    children: runs.map(
      (r) =>
        new TextRun({
          text: r.text,
          size: r.size || 24,
          font: r.font || "Calibri",
          bold: r.bold || false,
          italics: r.italics || false,
          color: r.color || "333333",
        })
    ),
  });
}

function emptyLine() {
  return new Paragraph({ spacing: { after: 120 }, children: [] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function tableCell(text, opts = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    shading: opts.shading
      ? { type: ShadingType.SOLID, color: opts.shading }
      : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: {
      top: 40,
      bottom: 40,
      left: 80,
      right: 80,
    },
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            size: opts.size || 22,
            font: opts.font || "Calibri",
            bold: opts.bold || false,
            color: opts.color || "333333",
          }),
        ],
      }),
    ],
  });
}

// ─── Title page ───
function createTitlePage() {
  return [
    emptyLine(),
    emptyLine(),
    emptyLine(),
    emptyLine(),
    emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "HUMAN COMPUTER INTERACTION",
          bold: true,
          size: 36,
          font: "Georgia",
          color: NAVY,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: "CSC [Course Code]",
          size: 28,
          font: "Georgia",
          color: NAVY,
        }),
      ],
    }),
    emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "______________________________________________________",
          size: 24,
          font: "Calibri",
          color: MID_GRAY,
        }),
      ],
    }),
    emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "GROUP ASSIGNMENT REPORT",
          bold: true,
          size: 44,
          font: "Georgia",
          color: TERRACOTTA,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "SmartLib \u2013 Smart University Library Management System",
          bold: true,
          size: 32,
          font: "Georgia",
          color: NAVY,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "______________________________________________________",
          size: 24,
          font: "Calibri",
          color: MID_GRAY,
        }),
      ],
    }),
    emptyLine(),
    emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: "Prepared by:",
          bold: true,
          size: 24,
          font: "Calibri",
          color: NAVY,
        }),
      ],
    }),
    ...[
      "Ahmad Bin Ibrahim (A12345)",
      "Sarah Binti Abdullah (A12346)",
      "Muhammad Hafiz Bin Razak (A12347)",
      "Nurul Aisyah Binti Hassan (A12348)",
      "David Tan Wei Ming (A12349)",
    ].map(
      (name) =>
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: name,
              size: 24,
              font: "Calibri",
              color: "444444",
            }),
          ],
        })
    ),
    emptyLine(),
    emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: "Lecturer:",
          bold: true,
          size: 24,
          font: "Calibri",
          color: NAVY,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "Dr. Noraini Binti Mohd Razali",
          size: 24,
          font: "Calibri",
          color: "444444",
        }),
      ],
    }),
    emptyLine(),
    emptyLine(),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "Date of Submission: 6 April 2026",
          size: 24,
          font: "Calibri",
          color: "444444",
        }),
      ],
    }),
    pageBreak(),
  ];
}

// ─── Table of Contents ───
function createTableOfContents() {
  return [
    heading1("Table of Contents"),
    emptyLine(),
    new TableOfContents("Table of Contents", {
      hyperlink: true,
      headingStyleRange: "1-3",
    }),
    emptyLine(),
    bodyText(
      "(Note: Please right-click the Table of Contents above and select \u201CUpdate Field\u201D to refresh page numbers after opening in Microsoft Word.)",
      { italics: true, color: "888888" }
    ),
    pageBreak(),
  ];
}

// ─── Section 1: Introduction ───
function createIntroduction() {
  return [
    heading1("1. Introduction"),
    emptyLine(),
    bodyText(
      "In the contemporary academic landscape, university libraries serve as critical intellectual hubs that support teaching, learning, and research activities. However, traditional library management systems often present significant usability challenges that hinder the efficient utilisation of library resources. Long queues at checkout counters, difficulty locating specific titles, unclear borrowing policies, and insufficient notification mechanisms collectively contribute to a suboptimal user experience. These challenges are particularly pronounced in large university settings where thousands of students and faculty members rely on library services daily.",
      { indent: true }
    ),
    bodyText(
      "SmartLib \u2013 Smart University Library Management System is an innovative web and mobile application conceptualised to address these persistent challenges through the application of sound Human-Computer Interaction (HCI) principles. The system is designed to modernise and streamline the entire library experience, from book discovery and borrowing to returning and reservation management. By integrating intuitive digital interfaces with robust backend functionality, SmartLib aims to transform how university communities interact with library services.",
      { indent: true }
    ),
    bodyText(
      "The core objective of SmartLib is to provide a seamless, user-centred library management experience that reduces friction, improves accessibility, and enhances overall satisfaction for all user groups. The application enables students and faculty members to search for books using multiple criteria, borrow and return materials digitally, reserve titles in advance, manage fines, and receive timely notifications about due dates and book availability. For library administrators, SmartLib provides a comprehensive dashboard for managing inventory, monitoring user activities, and generating analytical reports.",
      { indent: true }
    ),
    bodyText(
      "This report presents a comprehensive analysis of the SmartLib system from an HCI perspective. It begins with an overview of the application and its intended users, followed by a detailed specification of functional and non-functional requirements. The report then examines the application\u2019s workflow through a flowchart description, evaluates the interface design against Shneiderman\u2019s Eight Golden Rules of Interface Design, and presents the key interface designs developed for the system. Through this analysis, the report demonstrates how the application of established HCI principles can lead to the creation of more effective, efficient, and satisfying interactive systems.",
      { indent: true }
    ),
    pageBreak(),
  ];
}

// ─── Section 2: Application Overview ───
function createApplicationOverview() {
  return [
    heading1("2. Application Overview"),
    emptyLine(),
    heading2("2.1 System Description"),
    bodyText(
      "SmartLib is an imaginary web and mobile application designed to serve as a comprehensive digital solution for university library management. The system replaces traditional manual processes with an integrated digital platform that facilitates all aspects of library operations, from cataloguing and inventory management to user-facing services such as book discovery, borrowing, and returning. The application is built upon modern web technologies and follows a responsive design philosophy, ensuring optimal functionality across desktop computers, tablets, and mobile devices.",
      { indent: true }
    ),
    bodyText(
      "The system architecture follows a client-server model with a RESTful API backend, a relational database for persistent storage, and a modern frontend framework for delivering rich, interactive user interfaces. SmartLib employs role-based access control (RBAC) to differentiate between user types and provide appropriate functionality and permissions to each group. The application integrates with the university\u2019s existing student information system for authentication and user verification, ensuring a seamless onboarding experience.",
      { indent: true }
    ),
    emptyLine(),
    heading2("2.2 Purpose and Objectives"),
    bodyText(
      "The primary purpose of SmartLib is to enhance the library experience for all stakeholders within the university community. The system is designed to achieve the following objectives:",
      { indent: true }
    ),
    bulletRuns([
      { text: "Efficiency: ", bold: true },
      {
        text: "Reduce the time required for common library operations such as searching, borrowing, and returning books through streamlined digital workflows.",
      },
    ]),
    bulletRuns([
      { text: "Accessibility: ", bold: true },
      {
        text: "Provide 24/7 access to library services through the web and mobile platforms, enabling users to manage their library activities from anywhere at any time.",
      },
    ]),
    bulletRuns([
      { text: "User Satisfaction: ", bold: true },
      {
        text: "Deliver an intuitive, aesthetically pleasing, and error-tolerant interface that minimises user frustration and maximises engagement.",
      },
    ]),
    bulletRuns([
      { text: "Administrative Effectiveness: ", bold: true },
      {
        text: "Empower library staff with powerful tools for managing collections, tracking usage patterns, and generating data-driven reports to inform decision-making.",
      },
    ]),
    bulletRuns([
      { text: "Inclusivity: ", bold: true },
      {
        text: "Ensure the system is usable by individuals with diverse abilities, language preferences, and technological proficiency levels, in compliance with WCAG 2.1 AA accessibility standards.",
      },
    ]),
    emptyLine(),
    heading2("2.3 Target Users"),
    bodyText(
      "SmartLib is designed to serve three primary user groups within the university ecosystem, each with distinct needs, technical proficiency levels, and usage patterns:",
      { indent: true }
    ),
    emptyLine(),

    // Target users table
    new Table({
      width: { size: 9000, type: WidthType.DXA },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            tableCell("User Group", {
              bold: true,
              shading: NAVY,
              color: WHITE,
              width: 2000,
            }),
            tableCell("Description", {
              bold: true,
              shading: NAVY,
              color: WHITE,
              width: 3500,
            }),
            tableCell("Key Needs", {
              bold: true,
              shading: NAVY,
              color: WHITE,
              width: 3500,
            }),
          ],
        }),
        new TableRow({
          children: [
            tableCell("Students", { bold: true, shading: LIGHT_GRAY }),
            tableCell(
              "Undergraduate and postgraduate students who frequently use library resources for coursework, assignments, and research projects.",
              { shading: LIGHT_GRAY }
            ),
            tableCell(
              "Quick book search, easy borrowing/returning, reservation of popular titles, due date reminders, fine management.",
              { shading: LIGHT_GRAY }
            ),
          ],
        }),
        new TableRow({
          children: [
            tableCell("Faculty Members", { bold: true }),
            tableCell(
              "Lecturers, professors, and researchers who utilise library materials for teaching preparation, academic research, and scholarly activities.",
              {}
            ),
            tableCell(
              "Extended borrowing periods, research material access, course reserve management, bulk borrowing capabilities.",
              {}
            ),
          ],
        }),
        new TableRow({
          children: [
            tableCell("Library Admin Staff", {
              bold: true,
              shading: LIGHT_GRAY,
            }),
            tableCell(
              "Librarians and administrative personnel responsible for managing the library\u2019s collections, users, and daily operations.",
              { shading: LIGHT_GRAY }
            ),
            tableCell(
              "Inventory management, user account administration, report generation, system configuration, fine management.",
              { shading: LIGHT_GRAY }
            ),
          ],
        }),
      ],
    }),
    emptyLine(),
    bodyText(
      "Each user group interacts with SmartLib through a tailored interface that prioritises their specific needs and workflows while maintaining a consistent visual identity and interaction paradigm across the application. This approach ensures that users can accomplish their goals efficiently without being overwhelmed by features that are irrelevant to their role.",
      { indent: true }
    ),
    pageBreak(),
  ];
}

// ─── Section 3: Functional Requirements ───
function createFunctionalRequirements() {
  const frs = [
    {
      id: "FR1",
      title: "User Registration and Login",
      desc: "The system shall provide a secure authentication mechanism that integrates with the university\u2019s existing student and staff identification system. New users shall be able to register using their university-issued student ID or staff number, which will be verified against the university\u2019s central database. The registration process shall collect essential information including full name, email address, faculty, and programme of study. Returning users shall be able to log in using their credentials, with support for social login options (Google, Microsoft) linked to university accounts. The system shall implement multi-factor authentication for administrative accounts to ensure enhanced security. Session management shall include automatic timeout after 30 minutes of inactivity, with the option to remain logged in on trusted devices.",
    },
    {
      id: "FR2",
      title: "Book Search and Discovery",
      desc: "The system shall provide a comprehensive search functionality that enables users to locate books and other library materials using multiple criteria, including title, author name, ISBN, subject category, publication year, and keywords. The search engine shall support partial matching, auto-complete suggestions, and spelling correction to improve discoverability. Search results shall be displayed in a visually organised manner with relevant information such as book cover thumbnails, availability status, location within the library, and average user ratings. Users shall be able to apply filters to narrow results by category, availability, format (physical or digital), language, and publication date. The system shall also provide an advanced search mode for complex queries combining multiple criteria using Boolean operators.",
    },
    {
      id: "FR3",
      title: "Book Borrowing (Digital Checkout)",
      desc: "The system shall enable authenticated users to borrow available books through a streamlined digital checkout process. Upon selecting a book, users shall be presented with borrowing details including the due date (calculated based on user type: 14 days for students, 30 days for faculty), maximum renewal options, and any applicable borrowing limits. The checkout process shall follow a clear three-step workflow: Select Book \u2192 Confirm Details \u2192 Checkout Complete. Users shall receive a digital receipt upon successful checkout, and the book\u2019s availability status shall be updated in real-time across all user interfaces. The system shall enforce borrowing limits (maximum 5 books for students, 10 for faculty) and prevent checkout of unavailable items.",
    },
    {
      id: "FR4",
      title: "Book Returning",
      desc: "The system shall provide multiple methods for returning borrowed books. Users may return books physically at the library counter, where staff shall scan the book\u2019s barcode or QR code to process the return digitally. Alternatively, users may initiate a return through the application by scanning the book\u2019s QR code using their device\u2019s camera, which generates a digital return confirmation. The system shall calculate any applicable late fees at the time of return and update the user\u2019s account accordingly. A confirmation screen shall display the return details, including the book title, return date, and any fees incurred. The returned book\u2019s availability status shall be updated immediately to allow other users to borrow it.",
    },
    {
      id: "FR5",
      title: "Book Reservation (Hold System)",
      desc: "The system shall allow users to place reservations on books that are currently borrowed by other users. When a reserved book becomes available, the system shall notify the reserving user and hold the book for a configurable period (default: 48 hours). Users shall be able to view their active reservations, cancel reservations at any time, and see their position in the reservation queue for popular titles. The system shall support a maximum of 3 concurrent reservations per user and shall automatically release holds that are not collected within the designated holding period. Priority in the reservation queue shall be determined on a first-come, first-served basis.",
    },
    {
      id: "FR6",
      title: "Fine Management",
      desc: "The system shall automatically calculate overdue fines based on a configurable rate schedule (default: RM 0.50 per day per book). Users shall be able to view their current outstanding fines, fine history, and payment status through their dashboard. The system shall support multiple payment methods, including online payment gateways, credit/debit cards, and payment at the library counter. Automated email and in-app reminders shall be sent to users with outstanding fines. The system shall prevent users with fines exceeding RM 50.00 from borrowing additional books until the balance is reduced. Administrative staff shall have the ability to waive or adjust fines under special circumstances, with all adjustments logged for audit purposes.",
    },
    {
      id: "FR7",
      title: "Notification System",
      desc: "The system shall provide a multi-channel notification system to keep users informed about relevant library activities. Notifications shall be delivered through in-app alerts, push notifications (mobile), and email. Key notification types include due date reminders (sent 3 days and 1 day before the due date), overdue alerts, reservation availability notifications, fine payment confirmations, and system announcements. Users shall be able to customise their notification preferences, selecting which types of notifications they wish to receive and through which channels. The system shall also support batch notifications for administrative announcements and library event promotions.",
    },
    {
      id: "FR8",
      title: "User Dashboard",
      desc: "The system shall provide each user with a personalised dashboard that serves as the primary hub for managing their library activities. The dashboard shall display current borrowings with due dates and status indicators, borrowing history with sorting and filtering options, active reservations and their queue positions, outstanding fines and payment history, and reading statistics (books read per month, favourite categories). The dashboard shall feature visual elements such as progress bars for borrowing limits, colour-coded due date indicators (green for upcoming, amber for soon, red for overdue), and quick-action buttons for common operations. Users shall be able to customise the layout by rearranging dashboard widgets according to their preferences.",
    },
    {
      id: "FR9",
      title: "Administrative Dashboard",
      desc: "The system shall provide library administrators with a comprehensive management dashboard. Key features shall include book inventory management (add, edit, delete, and categorise books), user account management (view user details, manage roles, reset passwords), transaction monitoring (real-time view of borrowing and returning activities), and report generation (circulation statistics, popular books, user activity, overdue reports, and fine collection summaries). The admin dashboard shall support data export in multiple formats (PDF, CSV, Excel) and provide visual analytics through charts and graphs. Administrators shall also have the ability to configure system settings, including borrowing limits, fine rates, reservation policies, and notification templates.",
    },
    {
      id: "FR10",
      title: "QR Code Scanning",
      desc: "The system shall integrate QR code technology to facilitate quick and efficient book checkout and return operations. Each physical book in the library shall be assigned a unique QR code that links to its digital record in the system. Users shall be able to scan QR codes using their smartphone camera through the SmartLib mobile application, enabling self-service checkout at designated kiosks within the library. Library staff shall also use QR code scanning for rapid processing of returns and inventory checks. The system shall support the generation and printing of QR code labels for new books added to the collection, ensuring all physical items are linked to the digital catalogue.",
    },
  ];

  const rows = [
    new TableRow({
      tableHeader: true,
      children: [
        tableCell("ID", {
          bold: true,
          shading: NAVY,
          color: WHITE,
          width: 900,
        }),
        tableCell("Requirement", {
          bold: true,
          shading: NAVY,
          color: WHITE,
          width: 2600,
        }),
        tableCell("Description", {
          bold: true,
          shading: NAVY,
          color: WHITE,
          width: 5500,
        }),
      ],
    }),
    ...frs.map(
      (fr, i) =>
        new TableRow({
          children: [
            tableCell(fr.id, {
              bold: true,
              shading: i % 2 === 0 ? LIGHT_GRAY : undefined,
            }),
            tableCell(fr.title, {
              bold: true,
              shading: i % 2 === 0 ? LIGHT_GRAY : undefined,
            }),
            tableCell(fr.desc, {
              shading: i % 2 === 0 ? LIGHT_GRAY : undefined,
              size: 20,
            }),
          ],
        })
    ),
  ];

  return [
    heading1("3. Functional Requirements"),
    emptyLine(),
    bodyText(
      "Functional requirements define the specific behaviours, capabilities, and functions that the SmartLib system must provide to its users. These requirements have been derived from an analysis of user needs across the three target user groups \u2013 students, faculty members, and library administrative staff. Each requirement has been specified with sufficient detail to guide the design and development of the system while ensuring that the resulting application meets the expectations of all stakeholders. The following table presents the ten core functional requirements identified for the SmartLib system.",
      { indent: true }
    ),
    emptyLine(),
    new Table({
      width: { size: 9000, type: WidthType.DXA },
      rows,
    }),
    pageBreak(),
  ];
}

// ─── Section 4: Non-Functional Requirements ───
function createNonFunctionalRequirements() {
  const nfrs = [
    {
      id: "NFR1",
      title: "Performance",
      desc: "The system shall deliver responsive performance across all operations, with page load times not exceeding 3 seconds under normal network conditions. Search queries shall return results within 2 seconds for catalogues containing up to 500,000 items. API response times shall remain below 500 milliseconds for standard operations. The application shall maintain these performance benchmarks even during peak usage periods, such as the beginning of academic semesters when library activity is highest.",
    },
    {
      id: "NFR2",
      title: "Usability",
      desc: "The system shall provide an intuitive and accessible user interface that adheres to WCAG 2.1 Level AA compliance standards. All interactive elements shall be navigable using keyboard controls, and the interface shall be compatible with popular screen readers (JAWS, NVDA, VoiceOver). The system shall support adjustable font sizes, high contrast modes, and alternative text for all images. New users shall be able to complete basic tasks (search, borrow, return) without formal training, with a target learnability time of under 10 minutes.",
    },
    {
      id: "NFR3",
      title: "Security",
      desc: "The system shall implement robust security measures to protect user data and system integrity. All passwords shall be encrypted using bcrypt hashing with a minimum cost factor of 12. Data transmission shall be secured using TLS 1.3 encryption. The system shall enforce role-based access control (RBAC) with the principle of least privilege, ensuring users can only access features and data appropriate to their role. Regular security audits and penetration testing shall be conducted to identify and address vulnerabilities.",
    },
    {
      id: "NFR4",
      title: "Availability",
      desc: "The system shall maintain a minimum uptime of 99.5%, equating to a maximum of approximately 44 hours of unplanned downtime per year. Scheduled maintenance shall be performed during low-usage periods (between 2:00 AM and 6:00 AM) with advance notice provided to users. The system shall implement redundancy and failover mechanisms to minimise the impact of hardware or software failures on service availability.",
    },
    {
      id: "NFR5",
      title: "Scalability",
      desc: "The system architecture shall support horizontal and vertical scaling to accommodate growth in user base and data volume. The system shall be capable of handling a minimum of 10,000 concurrent users without performance degradation. The database design shall efficiently manage catalogues of up to 1 million items. The system shall utilise load balancing and caching strategies to distribute traffic effectively and reduce server load.",
    },
    {
      id: "NFR6",
      title: "Compatibility",
      desc: "The system shall function correctly across all major web browsers, including Google Chrome, Mozilla Firefox, Safari, and Microsoft Edge (latest two versions). The responsive design shall ensure optimal display and functionality on devices with screen sizes ranging from 320px (mobile) to 2560px (large desktop monitors). The mobile application shall be compatible with iOS 14+ and Android 10+ operating systems. All features shall degrade gracefully on older browsers, maintaining core functionality even when advanced features are unsupported.",
    },
    {
      id: "NFR7",
      title: "Reliability",
      desc: "The system shall implement automated database backups every 24 hours, with backup files stored securely in geographically separate locations. The system shall support point-in-time recovery with a maximum Recovery Point Objective (RPO) of 24 hours and a Recovery Time Objective (RTO) of 4 hours. Transaction logging shall be implemented for all critical operations (borrowing, returning, payments) to ensure data consistency and provide an audit trail. The system shall include automated health monitoring with alerting mechanisms to notify administrators of potential issues before they impact users.",
    },
  ];

  const rows = [
    new TableRow({
      tableHeader: true,
      children: [
        tableCell("ID", {
          bold: true,
          shading: NAVY,
          color: WHITE,
          width: 900,
        }),
        tableCell("Category", {
          bold: true,
          shading: NAVY,
          color: WHITE,
          width: 1800,
        }),
        tableCell("Description", {
          bold: true,
          shading: NAVY,
          color: WHITE,
          width: 6300,
        }),
      ],
    }),
    ...nfrs.map(
      (nfr, i) =>
        new TableRow({
          children: [
            tableCell(nfr.id, {
              bold: true,
              shading: i % 2 === 0 ? LIGHT_GRAY : undefined,
            }),
            tableCell(nfr.title, {
              bold: true,
              shading: i % 2 === 0 ? LIGHT_GRAY : undefined,
            }),
            tableCell(nfr.desc, {
              shading: i % 2 === 0 ? LIGHT_GRAY : undefined,
              size: 20,
            }),
          ],
        })
    ),
  ];

  return [
    heading1("4. Non-Functional Requirements"),
    emptyLine(),
    bodyText(
      "Non-functional requirements specify the quality attributes, constraints, and operational characteristics that the SmartLib system must exhibit. While functional requirements define what the system should do, non-functional requirements define how well the system should perform those functions. These requirements are critical for ensuring that SmartLib delivers a satisfactory user experience and meets the operational standards expected of a university-grade information system. The following table details the seven key non-functional requirements identified for SmartLib.",
      { indent: true }
    ),
    emptyLine(),
    new Table({
      width: { size: 9000, type: WidthType.DXA },
      rows,
    }),
    pageBreak(),
  ];
}

// ─── Section 5: Application Flowchart ───
function createFlowchart() {
  return [
    heading1("5. Application Flowchart"),
    emptyLine(),
    bodyText(
      "The application flowchart provides a visual representation of the primary user workflow within the SmartLib system. This flowchart, created using draw.io (SmartLib_Flowchart.drawio), illustrates the sequence of steps a user follows from initial access to the system through to the completion of their desired tasks. The flowchart serves as a high-level blueprint for the application\u2019s navigation structure and helps ensure that all user pathways are logically structured and intuitively accessible.",
      { indent: true }
    ),
    emptyLine(),
    heading2("5.1 Main Application Flow"),
    bodyText(
      "The SmartLib application follows a structured workflow that guides users through the system in a logical and efficient manner. The main flow comprises the following stages:",
      { indent: true }
    ),
    emptyLine(),
    numberedRuns([
      { text: "Start: ", bold: true },
      {
        text: "The user launches the SmartLib application through a web browser or mobile app. The system displays the landing page with an overview of library services, featured books, and prominent login/register options.",
      },
    ]),
    numberedRuns([
      { text: "Login / Register: ", bold: true },
      {
        text: "New users proceed to the registration form where they enter their university credentials for verification. Existing users enter their login credentials. The system supports social login through university-linked Google and Microsoft accounts for convenience.",
      },
    ]),
    numberedRuns([
      { text: "Authentication: ", bold: true },
      {
        text: "The system validates the user\u2019s credentials against the university database. If authentication fails, the user receives a clear error message with guidance on resolving the issue (e.g., password reset link). Successful authentication proceeds to the next step.",
      },
    ]),
    numberedRuns([
      { text: "Role-Based Dashboard: ", bold: true },
      {
        text: "Based on the authenticated user\u2019s role (Student, Faculty, or Admin), the system directs them to the appropriate dashboard. Each dashboard is tailored to display relevant information, quick actions, and navigation options specific to the user\u2019s role and responsibilities.",
      },
    ]),
    numberedRuns([
      { text: "Feature Selection: ", bold: true },
      {
        text: "From their dashboard, the user selects the desired feature or action. Options include Book Search, My Borrowings, Reservations, Fines, Profile Settings, and (for admins) Inventory Management, User Management, and Reports.",
      },
    ]),
    numberedRuns([
      { text: "Process Actions: ", bold: true },
      {
        text: "The system processes the user\u2019s selected action, guiding them through any required steps with clear instructions, progress indicators, and informative feedback. For multi-step processes (such as borrowing), the system displays a progress bar showing the current step and remaining steps.",
      },
    ]),
    numberedRuns([
      { text: "Confirmation: ", bold: true },
      {
        text: "Upon completing an action, the system displays a confirmation screen summarising the results. For transactional operations (borrowing, returning, payment), a digital receipt is generated and optionally emailed to the user.",
      },
    ]),
    numberedRuns([
      { text: "Continue / Logout: ", bold: true },
      {
        text: "The user may choose to perform additional actions by navigating back to their dashboard or directly accessing other features. When finished, the user logs out, which terminates the session and returns the system to the landing page.",
      },
    ]),
    numberedRuns([
      { text: "End: ", bold: true },
      {
        text: "The session concludes. The system ensures all data changes have been saved and the user\u2019s session has been securely terminated.",
      },
    ]),
    emptyLine(),
    heading2("5.2 Decision Points and Alternative Paths"),
    bodyText(
      "The flowchart incorporates several key decision points that determine the user\u2019s path through the system:",
      { indent: true }
    ),
    bulletRuns([
      { text: "Authentication Decision: ", bold: true },
      {
        text: 'After credential verification, the flow branches based on whether authentication succeeds ("Yes" path to dashboard) or fails ("No" path back to login with error feedback).',
      },
    ]),
    bulletRuns([
      { text: "Role-Based Routing: ", bold: true },
      {
        text: "Following successful authentication, the system evaluates the user\u2019s assigned role and routes them to the corresponding dashboard interface (Student Dashboard, Faculty Dashboard, or Admin Dashboard).",
      },
    ]),
    bulletRuns([
      { text: "Action Continuation Decision: ", bold: true },
      {
        text: 'After completing an action, the user decides whether to continue using the system ("Yes" loops back to the dashboard) or end their session ("No" proceeds to logout).',
      },
    ]),
    bulletRuns([
      { text: "Error Handling Paths: ", bold: true },
      {
        text: "At each processing stage, error conditions (e.g., book unavailable, borrowing limit reached, payment failure) are handled with informative messages and appropriate recovery options, ensuring users are never left in a dead-end state.",
      },
    ]),
    emptyLine(),
    bodyText(
      "The flowchart design emphasises simplicity and clarity, ensuring that users can accomplish their goals with a minimum number of steps while maintaining adequate safeguards against errors. The detailed flowchart diagram is available in the accompanying draw.io file (SmartLib_Flowchart.drawio).",
      { indent: true }
    ),
    pageBreak(),
  ];
}

// ─── Section 6: Shneiderman\u2019s Eight Golden Rules ───
function createGoldenRules() {
  const rules = [
    {
      num: "1",
      title: "Strive for Consistency",
      definition:
        "The first golden rule emphasises that consistent sequences of actions should be required in similar situations. Consistent terminology should be used in prompts, menus, and help screens, and consistent colour, layout, capitalisation, fonts, and other visual elements should be employed throughout the interface. Consistency reduces the cognitive load on users by allowing them to transfer their knowledge from one part of the system to another, creating a sense of familiarity and predictability that enhances usability.",
      application:
        "SmartLib implements visual and interaction consistency as a foundational design principle that permeates every aspect of the user interface. The application employs a carefully selected colour scheme centred on navy (#2B4066) as the primary colour and terracotta as the accent colour, applied uniformly across all screens and components. This colour palette was chosen not only for its aesthetic appeal but also for its strong contrast ratios that support readability and accessibility.",
      example:
        "Specifically, SmartLib maintains consistency through the use of Georgia typeface for all headings and Calibri for body text throughout the application. The navigation bar remains fixed at the top of every screen, featuring the same structure, iconography, and behaviour regardless of the current page. Button styles follow a strict hierarchy: primary actions use solid navy backgrounds with white text, secondary actions use outlined navy borders, and destructive actions use red. Card layouts for displaying book information maintain identical dimensions, spacing, and information architecture across the search results page, dashboard, and recommendation sections. This visual consistency ensures that users develop a reliable mental model of the interface, reducing confusion and enabling efficient navigation.",
    },
    {
      num: "2",
      title: "Seek Universal Usability",
      definition:
        "This rule advocates for designing interfaces that accommodate a diverse range of users, including those with varying levels of experience, different physical abilities, and diverse cultural backgrounds. The interface should recognise the needs of this diversity and provide features that support beginners (such as explanations and guidance) as well as experts (such as shortcuts and advanced features). Universal usability ensures that no user group is excluded from accessing the system\u2019s functionality.",
      application:
        "SmartLib is designed with universal usability as a core principle, ensuring that the system is accessible and effective for all members of the university community, regardless of their abilities, technological proficiency, or language preferences. The application addresses multiple dimensions of diversity through a comprehensive set of inclusive design features.",
      example:
        "The application implements a fully responsive design using CSS Grid and Flexbox, ensuring that the interface adapts seamlessly to screen sizes ranging from 320px mobile phones to 2560px desktop monitors. For accessibility, SmartLib adheres to WCAG 2.1 Level AA standards, providing keyboard navigation for all interactive elements, ARIA labels for screen reader compatibility, and a high-contrast mode that increases the contrast ratios beyond the standard AA requirements. Users can adjust font sizes through an accessibility menu without breaking the layout. Multilingual support offers the interface in both English and Bahasa Melayu, with language selection persisting across sessions. For novice users, the system provides contextual tooltips, an interactive onboarding tutorial on first login, and a comprehensive help section. Advanced users benefit from keyboard shortcuts (e.g., Ctrl+K for quick search, Ctrl+B for borrowing list) and the ability to bookmark frequently accessed features.",
    },
    {
      num: "3",
      title: "Offer Informative Feedback",
      definition:
        "For every user action, the interface should provide appropriate and meaningful feedback. Minor actions may warrant modest feedback, while infrequent or major actions should produce more substantial feedback. This feedback helps users understand the results of their actions, confirms that the system has received their input, and provides guidance when errors occur. Effective feedback reduces uncertainty and builds user confidence in the system.",
      application:
        "SmartLib incorporates a comprehensive feedback system that ensures users are always informed about the outcomes of their actions, the current state of the system, and any relevant changes to their library activities. The feedback mechanisms range from subtle visual cues for routine interactions to prominent alerts for critical notifications.",
      example:
        "The book search feature provides real-time feedback through dynamic search suggestions that appear as the user types, updating with each keystroke to show matching titles, authors, and categories. Book availability is communicated through an intuitive colour-coding system: green badges indicate available copies with the exact count, amber badges show limited availability, and red badges indicate that all copies are currently borrowed. When a user initiates a borrowing transaction, a progress indicator displays each stage of the process. Upon completion, a success confirmation dialog appears with a green checkmark animation, the book title, due date, and options for next actions. Toast notifications appear in the bottom-right corner for non-critical updates (e.g., \u201CReservation confirmed\u201D), auto-dismissing after 5 seconds while remaining accessible in the notification centre. Error feedback is equally informative, providing specific messages about what went wrong and actionable suggestions for resolution.",
    },
    {
      num: "4",
      title: "Design Dialogs to Yield Closure",
      definition:
        "Sequences of actions should be organised into groups with a clear beginning, middle, and end. This structure provides users with a sense of accomplishment upon completing a task, reduces anxiety about whether an action was completed successfully, and helps users mentally transition from one task to the next. Informative feedback at the completion of a group of actions gives users the satisfaction of accomplishment, a sense of relief, and an indication that they can prepare for the next group of actions.",
      application:
        "SmartLib carefully structures all multi-step interactions to provide users with a clear sense of progression and completion. Every transactional process in the system follows a defined beginning-middle-end structure that guides users through the workflow and provides unambiguous closure upon completion.",
      example:
        "The book borrowing process exemplifies this principle through a clearly defined three-step workflow. Step 1 (Select) presents the book details and borrowing terms, with a prominent \u201CBorrow This Book\u201D button. Step 2 (Confirm) displays a summary of the borrowing details including the book title, due date, and any applicable conditions, with \u201CConfirm Checkout\u201D and \u201CCancel\u201D buttons. Step 3 (Complete) shows a success screen with a checkmark animation, a digital receipt summary, and suggested next actions (\u201CView My Borrowings,\u201D \u201CContinue Browsing,\u201D or \u201CReturn to Dashboard\u201D). A step indicator at the top of the process shows the user\u2019s current position (e.g., Step 2 of 3). Additionally, email confirmations are automatically sent for all transactions, providing an external record of closure. The return process follows a similar structured approach, ending with a clear confirmation that the book has been successfully returned and any applicable fees have been calculated.",
    },
    {
      num: "5",
      title: "Prevent Errors",
      definition:
        "As much as possible, the system should be designed so that users cannot make serious errors. Where errors are possible, the system should detect and handle them gracefully, providing simple, constructive, and specific instructions for recovery. Error prevention is always preferable to error correction, as it reduces user frustration and enhances the overall efficiency of the interaction.",
      application:
        "SmartLib employs a multi-layered error prevention strategy that combines input validation, constraint-based design, and confirmation mechanisms to minimise the occurrence of user errors. The system design follows the principle that preventing errors is fundamentally superior to requiring users to recover from them.",
      example:
        "Input validation is implemented on all forms throughout the application. The registration form validates email format, password strength (minimum 8 characters with at least one uppercase letter, one number, and one special character), and student ID format in real-time, displaying inline error messages as users type. The borrowing process prevents errors through constraint-based design: the \u201CBorrow\u201D button is automatically disabled and greyed out when no copies are available, with a tooltip explaining \u201CNo copies currently available \u2013 Place a reservation instead.\u201D Before confirming any checkout, a confirmation dialog asks, \u201CAre you sure you want to borrow [Book Title]? Due date: [Date]\u201D with both \u201CConfirm\u201D and \u201CCancel\u201D options. Date pickers for reservation scheduling prevent selection of past dates or dates beyond the maximum reservation period. Search inputs sanitise special characters to prevent injection attacks while preserving legitimate search terms. The system also prevents duplicate borrowing by checking whether the user already has an active loan for the selected title.",
    },
    {
      num: "6",
      title: "Permit Easy Reversal of Actions",
      definition:
        "As much as possible, actions should be reversible. This principle relieves anxiety and encourages exploration, since users know that errors can be undone. The reversibility of actions allows users to feel more confident in trying new features and making decisions, knowing that they can return to a previous state if the outcome is not as expected.",
      application:
        "SmartLib provides multiple mechanisms for users to reverse or modify their actions, creating a forgiving environment that encourages confident interaction with the system. The design philosophy recognises that users should feel safe to explore the system\u2019s features without fear of irreversible consequences.",
      example:
        "Reservation management exemplifies this principle: users can cancel any active reservation at any time through a single click on the \u201CCancel Reservation\u201D button, with immediate confirmation and no penalties. For loan management, users can extend their loan period directly from the dashboard by clicking \u201CExtend\u201D on any active borrowing, subject to availability. The system provides an \u201Cundo\u201D function for accidental returns, allowing users to reverse a return action within a 5-minute grace period if a book was returned by mistake. Navigation throughout the application supports the browser\u2019s back button and includes a persistent breadcrumb trail, enabling users to retrace their steps easily. Search and filter states are preserved in the URL, so users can return to a previous search by using browser navigation. A \u201CClear All Filters\u201D button on the search page allows users to instantly reset all applied filters and return to the default search view. Shopping-cart-style behaviour for borrowing allows users to remove items before final checkout.",
    },
    {
      num: "7",
      title: "Keep Users in Control",
      definition:
        "Experienced users want to feel that they are in charge of the interface and that the interface responds to their actions. The system should make users the initiators of actions rather than the responders. Users should be able to customise the interface, choose their preferred workflows, and have the final say in all system actions. Surprising interface actions, tedious data entry sequences, and inability to obtain necessary information all reduce user satisfaction.",
      application:
        "SmartLib empowers users with extensive control over their library experience, ensuring that the system serves as a tool that responds to user intentions rather than imposing rigid workflows. The application provides multiple pathways to accomplish tasks and allows users to personalise their experience.",
      example:
        "Notification preferences provide granular control, allowing users to select which notification categories they wish to receive (due date reminders, availability alerts, system announcements, promotional messages) and through which channels (in-app, email, push notification). The book search and results interface offers comprehensive sorting options (by relevance, title, author, publication date, availability, and user rating) and extensive filtering capabilities. Users can perform bulk actions, such as returning multiple books simultaneously or extending multiple loan periods in a single operation. The dashboard interface supports widget customisation, enabling users to rearrange, show, or hide dashboard modules (Current Loans, Reservations, Reading Statistics, Recommendations, Recent Activity) to create a personalised layout that prioritises the information most relevant to them. A manual refresh button is provided alongside automatic updates, giving users control over when data is refreshed. The system never auto-redirects or auto-submits without explicit user initiation.",
    },
    {
      num: "8",
      title: "Reduce Short-Term Memory Load",
      definition:
        "The limitation of human information processing in short-term memory requires that displays be kept simple, multiple page displays be consolidated, window-motion frequency be reduced, and sufficient training time be allotted for complex procedures. The interface should minimise the amount of information users need to remember from one screen to another, providing visual cues, reminders, and contextual information that support recognition over recall.",
      application:
        "SmartLib is designed to minimise the cognitive burden on users by presenting information in a clear, organised manner and providing persistent visual cues that reduce the need to recall information from memory. The interface leverages the psychological principle of recognition over recall throughout its design.",
      example:
        "The persistent search bar at the top of every screen allows users to initiate a search from any location without needing to navigate to a dedicated search page. A \u201CRecently Viewed\u201D section on the dashboard displays the last 10 books the user has viewed, enabling quick re-access without remembering titles or navigating through search results again. Visual icons accompany all navigation labels (a magnifying glass for Search, a book for My Borrowings, a bell for Notifications, a user silhouette for Profile), leveraging visual recognition rather than text-based recall. Colour coding is used systematically: green consistently represents available or positive states, amber indicates warnings or pending states, and red signals overdue, unavailable, or error states. Tooltips appear on hover for all icons and abbreviated labels, providing additional context without cluttering the interface. Breadcrumb navigation at the top of each page shows the user\u2019s current location within the site hierarchy (e.g., Home > Search > Book Details > Borrow), eliminating the need to remember how they arrived at the current page. The search bar retains and auto-fills previous search terms, reducing the need to re-type frequently used queries.",
    },
  ];

  const sections = [];
  sections.push(heading1("6. Shneiderman\u2019s Eight Golden Rules of Interface Design"));
  sections.push(emptyLine());
  sections.push(
    bodyText(
      "Ben Shneiderman\u2019s Eight Golden Rules of Interface Design provide a foundational framework for creating effective, efficient, and user-friendly interactive systems (Shneiderman et al., 2018). These principles, widely regarded as essential guidelines in the field of Human-Computer Interaction, address fundamental aspects of interface design that contribute to user satisfaction and system usability. This section examines each of the eight rules and demonstrates how SmartLib applies these principles in its interface design to deliver a superior library management experience.",
      { indent: true }
    )
  );
  sections.push(emptyLine());

  for (const rule of rules) {
    sections.push(heading2(`6.${rule.num} Rule ${rule.num}: ${rule.title}`));
    sections.push(emptyLine());
    sections.push(heading3("Definition"));
    sections.push(bodyText(rule.definition, { indent: true }));
    sections.push(emptyLine());
    sections.push(heading3("Application in SmartLib"));
    sections.push(bodyText(rule.application, { indent: true }));
    sections.push(emptyLine());
    sections.push(heading3("Specific Example"));
    sections.push(bodyText(rule.example, { indent: true }));
    sections.push(emptyLine());
  }

  sections.push(pageBreak());
  return sections;
}

// ─── Section 7: Interface Design ───
function createInterfaceDesign() {
  const interfaces = [
    {
      num: "1",
      title: "Login Page",
      description:
        "The SmartLib Login Page serves as the gateway to the application and establishes the first impression of the system\u2019s visual identity and usability. The interface employs a clean, uncluttered layout that directs the user\u2019s attention to the primary action: logging in. The page features a centred login card against a subtle gradient background in the application\u2019s navy colour scheme, creating a professional and inviting atmosphere.",
      details: [
        "The login form prominently displays the SmartLib logo and tagline at the top, reinforcing brand identity and assuring users they are on the correct page. Two input fields for University ID and Password are presented with clear labels, placeholder text, and input icons (a person silhouette for ID and a lock for password). The password field includes a toggle visibility button, allowing users to verify their input before submission.",
        "Social login options are provided below the traditional login form, offering one-click authentication through Google and Microsoft accounts linked to university email addresses. These options are presented as clearly labelled buttons with recognisable brand icons, reducing registration friction for new users.",
        "Error prevention is implemented through real-time input validation that checks for empty fields and valid ID format before enabling the login button. When authentication fails, the system displays a specific, non-threatening error message (e.g., \u201CThe password you entered is incorrect. Please try again or reset your password.\u201D) with a direct link to password recovery. A \u201CRemember Me\u201D checkbox and \u201CForgot Password?\u201D link are positioned below the form fields for easy access.",
      ],
    },
    {
      num: "2",
      title: "Student Dashboard",
      description:
        "The Student Dashboard serves as the central hub for student interaction with SmartLib, providing an at-a-glance overview of all relevant library activities and quick access to frequently used features. The interface adopts a card-based modular layout that organises information into discrete, visually distinct sections, making it easy for students to scan and locate the information they need.",
      details: [
        "The top section of the dashboard features a personalised welcome message with the student\u2019s name and a summary statistics bar showing key metrics: total books currently borrowed, books due soon (within 3 days), active reservations, and outstanding fine balance. Each metric is displayed in a compact card with an icon, the numerical value, and a descriptive label, using colour coding to convey urgency (green for normal, amber for attention needed, red for overdue or high fines).",
        "The main content area is divided into functional modules presented as cards: \u201CCurrent Borrowings\u201D displays a list of currently borrowed books with titles, due dates, and quick-action buttons (Extend, Return); \u201CDue Soon\u201D highlights books approaching their return date with countdown indicators; \u201CReservations\u201D shows active holds with queue position and estimated availability; \u201CRecommended for You\u201D presents personalised book suggestions based on borrowing history. Each card features a consistent header with an icon, title, and \u201CView All\u201D link.",
        "Quick-action buttons are prominently placed at the top of the dashboard, providing one-click access to the most common operations: \u201CSearch Books,\u201D \u201CScan QR Code,\u201D and \u201CView Fines.\u201D The sidebar navigation provides access to all system features, with the current page highlighted and notification badges indicating items requiring attention.",
      ],
    },
    {
      num: "3",
      title: "Book Search and Results Page",
      description:
        "The Book Search and Results page is designed to facilitate efficient discovery of library materials through an intuitive search interface with powerful filtering and sorting capabilities. The interface balances simplicity for basic searches with advanced options for users who need more precise control over their search queries.",
      details: [
        "The search interface features a large, prominent search bar at the top of the page with auto-complete functionality that suggests matching titles, authors, and categories as the user types. A category selector adjacent to the search bar allows users to scope their search to specific categories (All, Books, Journals, Thesis, Multimedia) before executing the query. An \u201CAdvanced Search\u201D toggle expands additional fields for searching by author, ISBN, publication year range, and language.",
        "Search results are displayed in a grid/list toggle layout, with grid view showing book cover thumbnails and essential information (title, author, availability) in card format, and list view providing more detailed information per item. Each result card features a colour-coded availability badge (green: Available, amber: Limited, red: Unavailable), the book\u2019s category tag, a star rating based on user reviews, and quick-action buttons for borrowing or reserving. The number of available copies is displayed alongside the availability badge.",
        "The left sidebar houses a comprehensive filter panel with options for filtering by category, availability status, publication year, language, format, and location within the library. Active filters are displayed as removable chips above the results, with a \u201CClear All\u201D button. Sorting options (Relevance, Title A-Z, Title Z-A, Newest First, Most Popular, Highest Rated) are accessible through a dropdown menu. Pagination at the bottom of the results allows users to navigate through large result sets, with the option to adjust the number of results per page.",
      ],
    },
    {
      num: "4",
      title: "Book Details and Borrow Page",
      description:
        "The Book Details and Borrow page provides comprehensive information about a selected book and facilitates the borrowing process through a clear, step-by-step interface. This page is designed to give users all the information they need to make an informed decision about borrowing while making the checkout process as frictionless as possible.",
      details: [
        "The page layout features a two-column design on desktop (single column on mobile). The left column displays a large book cover image with the option to zoom, while the right column presents detailed metadata: title, author(s), publisher, publication year, ISBN, edition, language, page count, category, and physical location in the library (floor, shelf, section). A star rating with review count is displayed prominently, along with a brief synopsis or abstract.",
        "The availability section is prominently positioned below the metadata, showing the current availability status with the colour-coded badge, the number of copies available out of total copies, and the expected return date for the next copy if all are currently borrowed. The primary call-to-action button (\u201CBorrow This Book\u201D) is large, visually prominent, and uses the navy background colour to stand out. When all copies are unavailable, this button changes to \u201CPlace Reservation\u201D with an amber colour scheme. The button is disabled with a tooltip when the user has reached their borrowing limit.",
        "Upon clicking the borrow button, the confirmation dialog presents a summary of the borrowing details: book title, due date, borrowing period, current borrowing count relative to the limit (e.g., \u201C3 of 5 books\u201D), and any applicable notes. Two clear options are provided: \u201CConfirm Checkout\u201D (primary action) and \u201CCancel\u201D (secondary action). The success screen follows with a checkmark animation, digital receipt details, and navigation options. Below the main content, related books and \u201CUsers Also Borrowed\u201D sections provide discovery opportunities.",
      ],
    },
    {
      num: "5",
      title: "User Profile and Settings Page",
      description:
        "The User Profile and Settings page provides users with a centralised location to manage their personal information, account preferences, accessibility settings, and notification configurations. The interface is designed to be comprehensive yet organised, ensuring users can quickly locate and modify their desired settings without being overwhelmed by options.",
      details: [
        "The profile header displays the user\u2019s name, profile picture (with the option to upload or change), student/staff ID, faculty, and programme of study. A summary statistics section shows the user\u2019s library activity: total books borrowed (all time), books currently borrowed, total fines paid, and member since date. These statistics are presented in a visually appealing horizontal card layout with icons and colour accents.",
        "The settings section is organised into clearly labelled tabs or accordion sections: \u201CPersonal Information\u201D (name, email, phone, faculty \u2013 with edit capability), \u201CNotification Preferences\u201D (granular toggles for each notification type and delivery channel), \u201CAccessibility Settings\u201D (font size adjustment slider, high contrast mode toggle, screen reader optimisation toggle, language selection), and \u201CAccount Security\u201D (password change, two-factor authentication setup, login activity log).",
        "The accessibility settings section is particularly detailed, reflecting SmartLib\u2019s commitment to universal usability. Users can adjust the base font size using a slider with live preview, toggle high contrast mode, select their preferred language (English or Bahasa Melayu), and enable screen reader optimisation that adjusts the interface\u2019s semantic structure. All changes are previewed in real-time before the user commits by clicking \u201CSave Changes.\u201D A \u201CReset to Defaults\u201D option provides easy reversal. The page footer includes links to the Help Centre, Privacy Policy, Terms of Service, and a \u201CLog Out\u201D button.",
      ],
    },
  ];

  const sections = [];
  sections.push(heading1("7. Interface Design"));
  sections.push(emptyLine());
  sections.push(
    bodyText(
      "The interface design of SmartLib has been carefully crafted to embody the HCI principles discussed in the previous sections, with particular attention to Shneiderman\u2019s Eight Golden Rules. A total of five key interfaces have been designed to represent the primary user touchpoints within the application. Each interface has been developed with a focus on usability, accessibility, visual consistency, and error prevention. The designs utilise the SmartLib visual identity system, featuring the navy (#2B4066) and terracotta colour palette, Georgia headings, and Calibri body text. The following subsections describe each interface in detail.",
      { indent: true }
    )
  );
  sections.push(emptyLine());

  for (const iface of interfaces) {
    sections.push(
      heading2(`7.${iface.num} Interface ${iface.num}: ${iface.title}`)
    );
    sections.push(emptyLine());
    sections.push(bodyText(iface.description, { indent: true }));
    sections.push(emptyLine());
    for (const detail of iface.details) {
      sections.push(bodyText(detail, { indent: true }));
    }
    sections.push(emptyLine());
  }

  sections.push(pageBreak());
  return sections;
}

// ─── Section 8: Conclusion ───
function createConclusion() {
  return [
    heading1("8. Conclusion"),
    emptyLine(),
    bodyText(
      "The development of SmartLib \u2013 Smart University Library Management System demonstrates how the systematic application of Human-Computer Interaction principles can transform a traditional service into a modern, user-centred digital experience. Throughout the design process, the team has consistently prioritised usability, accessibility, and user satisfaction, guided by established theoretical frameworks and industry best practices.",
      { indent: true }
    ),
    bodyText(
      "The application\u2019s design addresses the diverse needs of three primary user groups \u2013 students, faculty members, and library administrative staff \u2013 through role-based interfaces that are tailored to each group\u2019s specific requirements and workflows. The ten functional requirements and seven non-functional requirements outlined in this report provide a comprehensive specification that ensures SmartLib delivers a complete, performant, and reliable library management solution.",
      { indent: true }
    ),
    bodyText(
      "The evaluation of SmartLib against Shneiderman\u2019s Eight Golden Rules of Interface Design reveals that the application successfully incorporates all eight principles into its interface design. Visual and interaction consistency is maintained through a unified design system featuring the navy and terracotta colour palette, consistent typography, and standardised component styles. Universal usability is addressed through responsive design, WCAG 2.1 AA compliance, multilingual support, and adjustable accessibility settings. Informative feedback is provided at every stage of user interaction through colour-coded indicators, real-time validation, progress indicators, and contextual notifications.",
      { indent: true }
    ),
    bodyText(
      "The structured workflow design ensures that all multi-step processes yield clear closure, with defined beginning, middle, and end stages accompanied by confirmation screens and digital receipts. Error prevention is implemented through comprehensive input validation, constraint-based design, and confirmation dialogs that protect users from unintended actions. Easy reversal of actions is supported through cancellation options, undo functions, and preserved navigation states that allow users to retrace their steps confidently.",
      { indent: true }
    ),
    bodyText(
      "User control is maintained through customisable preferences, flexible sorting and filtering options, bulk actions, and widget-based dashboard layouts. Finally, the interface minimises short-term memory load through persistent visual cues, consistent colour coding, breadcrumb navigation, tooltips, and recently viewed sections that support recognition over recall.",
      { indent: true }
    ),
    bodyText(
      "The five interface designs presented in this report \u2013 the Login Page, Student Dashboard, Book Search and Results, Book Details and Borrow, and User Profile and Settings \u2013 collectively demonstrate how these HCI principles translate into practical, usable interface elements. Each interface has been designed with careful attention to layout, typography, colour usage, interaction patterns, and error handling, resulting in a cohesive application that is both visually appealing and functionally effective.",
      { indent: true }
    ),
    bodyText(
      "In conclusion, SmartLib exemplifies how the thoughtful application of HCI principles can lead to the creation of digital systems that are not merely functional but genuinely enjoyable and empowering to use. By placing users at the centre of the design process and leveraging established frameworks such as Shneiderman\u2019s Golden Rules, the SmartLib team has designed a library management system that has the potential to significantly enhance the academic library experience for the entire university community.",
      { indent: true }
    ),
    pageBreak(),
  ];
}

// ─── References ───
function createReferences() {
  const refs = [
    "Dix, A., Finlay, J., Abowd, G. D., & Beale, R. (2004). Human-computer interaction (3rd ed.). Pearson Education.",
    "Nielsen, J. (1994). Usability engineering. Morgan Kaufmann.",
    "Norman, D. A. (2013). The design of everyday things: Revised and expanded edition. Basic Books.",
    "Preece, J., Rogers, Y., & Sharp, H. (2015). Interaction design: Beyond human-computer interaction (4th ed.). John Wiley & Sons.",
    "Shneiderman, B., Plaisant, C., Cohen, M., Jacobs, S., Elmqvist, N., & Diakopoulos, N. (2018). Designing the user interface: Strategies for effective human-computer interaction (6th ed.). Pearson.",
    "W3C. (2018). Web Content Accessibility Guidelines (WCAG) 2.1. World Wide Web Consortium. https://www.w3.org/TR/WCAG21/",
  ];

  return [
    heading1("References"),
    emptyLine(),
    ...refs.map(
      (ref) =>
        new Paragraph({
          spacing: { after: 160, line: 360 },
          indent: { left: 720, hanging: 720 },
          children: [
            new TextRun({
              text: ref,
              size: 24,
              font: "Calibri",
              color: "333333",
            }),
          ],
        })
    ),
  ];
}

// ─── Main: Assemble Document ───
async function main() {
  const doc = new Document({
    creator: "SmartLib HCI Group",
    title: "SmartLib - HCI Group Assignment Report",
    description:
      "Human Computer Interaction Group Assignment Report for SmartLib - Smart University Library Management System",
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 24,
            color: "333333",
          },
          paragraph: {
            spacing: { line: 360 },
          },
        },
        heading1: {
          run: {
            font: "Georgia",
            size: 40,
            bold: true,
            color: NAVY,
          },
          paragraph: {
            spacing: { before: 360, after: 200 },
          },
        },
        heading2: {
          run: {
            font: "Georgia",
            size: 32,
            bold: true,
            color: NAVY,
          },
          paragraph: {
            spacing: { before: 300, after: 160 },
          },
        },
        heading3: {
          run: {
            font: "Calibri",
            size: 26,
            bold: true,
            color: "333333",
          },
          paragraph: {
            spacing: { before: 240, after: 120 },
          },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: "bullet-list",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "\u2022",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 720, hanging: 360 },
                },
              },
            },
            {
              level: 1,
              format: LevelFormat.BULLET,
              text: "\u25E6",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 1440, hanging: 360 },
                },
              },
            },
          ],
        },
        {
          reference: "numbered-list",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 720, hanging: 360 },
                },
              },
            },
            {
              level: 1,
              format: LevelFormat.LOWER_LETTER,
              text: "%2.",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 1440, hanging: 360 },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,
              height: 16838,
              orientation: 0,
            },
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "SmartLib \u2013 HCI Group Assignment",
                    italics: true,
                    size: 18,
                    font: "Calibri",
                    color: "888888",
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    font: "Calibri",
                    color: "888888",
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          ...createTitlePage(),
          ...createTableOfContents(),
          ...createIntroduction(),
          ...createApplicationOverview(),
          ...createFunctionalRequirements(),
          ...createNonFunctionalRequirements(),
          ...createFlowchart(),
          ...createGoldenRules(),
          ...createInterfaceDesign(),
          ...createConclusion(),
          ...createReferences(),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath =
    "C:/Users/USER/Desktop/assignment/Human Computer Interaction Assignment/HCI_Report.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log(`Report generated successfully: ${outputPath}`);
  console.log(`File size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error("Error generating report:", err);
  process.exit(1);
});
