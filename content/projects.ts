export type ProjectShot = {
  id: string;
  caption: string;
  frame?: "desktop" | "mobile";
  /** Drop a file at this path to replace the placeholder. */
  src?: string;
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  period: string;
  domain: string;
  role: string;
  featured: boolean;
  flagship?: boolean;
  problem: string;
  highlight: string;
  outcomes: string[];
  architecture: string[];
  shots: ProjectShot[];
  stack: string[];
  href?: string;
  live?: string;
};

export const projects: Project[] = [
  {
    slug: "aegishealth",
    index: "01",
    title: "AegisHealth",
    subtitle: "Final year project",
    period: "Jul 2026",
    domain: "Federated learning · health",
    role: "Sole engineer · final year project",
    featured: true,
    flagship: true,
    problem:
      "Hospitals need shared anomaly-detection models without moving patient data off-site. Heterogeneous (non-IID) records make naive federated training brittle, and leakage risk has to be treated as a first-class constraint.",
    highlight:
      "Federated LSTM training with FedProx, differential privacy, and an Electron edge that never ships patient data.",
    outcomes: [
      "Built an end-to-end privacy-preserving federated learning platform for cross-hospital health anomaly detection, keeping patient data local to each institution.",
      "Designed a dual-protocol backend: FastAPI as the control plane, TLS-secured gRPC for federated round coordination, job orchestration, client registration, quorum handling, and model aggregation.",
      "Implemented LSTM time-series modeling with FedProx to improve convergence under heterogeneous client distributions.",
      "Integrated Differential Privacy and optional Homomorphic Encryption for secure aggregation and reduced inference leakage.",
      "Shipped role-based Next.js server/client dashboards and an Electron edge client for site-level participation, monitoring, audit visibility, and model release.",
    ],
    architecture: [
      "Next.js dashboards",
      "FastAPI control plane",
      "gRPC orchestrator",
      "Electron edge",
      "Supabase RLS",
    ],
    shots: [
      { id: "dashboard", caption: "Server dashboard", frame: "desktop" },
      { id: "edge", caption: "Electron edge client", frame: "desktop" },
    ],
    stack: [
      "Python",
      "PyTorch",
      "FastAPI",
      "gRPC",
      "Next.js",
      "Electron",
      "Supabase",
    ],
    href: "https://github.com/ChamikaCSA/aegishealth",
    live: "https://aegishealth-ochre.vercel.app",
  },
  {
    slug: "cpr-assist",
    index: "02",
    title: "CPR Assist",
    subtitle: "Real-time CPR coaching",
    period: "Apr 2026",
    domain: "Mobile · CV",
    role: "Co-author · mobile client and API",
    featured: true,
    problem:
      "CPR quality drops without a coach in the room. The system needed live compression feedback from the camera, not a checklist after the fact.",
    highlight:
      "Live compression inference from the camera, scored in session — not a checklist after the fact.",
    outcomes: [
      "Built a monorepo with an Expo app and FastAPI backend for camera-based readiness checks, live compression inference, and session scoring.",
      "Added instructor analytics and role-based audit/report APIs on a vendored ML vision stack.",
    ],
    architecture: [
      "Expo camera client",
      "FastAPI + MongoDB",
      "Vendored CV stack",
    ],
    shots: [
      { id: "session", caption: "Live coaching session", frame: "mobile" },
      { id: "instructor", caption: "Instructor analytics", frame: "desktop" },
    ],
    stack: ["React Native", "Expo", "FastAPI", "MongoDB", "OpenCV"],
    href: "https://github.com/ChamikaCSA/cpr-assist",
  },
  {
    slug: "logbook",
    index: "03",
    title: "Logbook",
    subtitle: "Field logs with forecasting",
    period: "Mar 2026",
    domain: "Mobile · data",
    role: "Sole engineer",
    featured: true,
    problem:
      "Timber-service SMEs were running the books on paper. They needed offline capture, role-based access, and a forecast that used their own history — not a generic dashboard.",
    highlight:
      "Offline Flutter ledger with RLS, PDF reports, and a FastAPI forecast that falls back when the API is dark.",
    outcomes: [
      "Built a cross-platform Flutter app on Supabase with RLS, offline transaction sync, and timber-specific income/expense categories.",
      "Shipped monthly and quarterly PDF reports plus a FastAPI forecasting service (seasonal regression, random forest, SARIMAX) that the Insights screen falls back from when the API is unreachable.",
    ],
    architecture: [
      "Flutter (offline)",
      "Supabase + RLS",
      "FastAPI forecasting",
    ],
    shots: [
      { id: "ledger", caption: "Ledger and dashboard", frame: "mobile" },
      { id: "insights", caption: "Revenue insights", frame: "mobile" },
    ],
    stack: ["Flutter", "Dart", "Supabase", "FastAPI", "PostgreSQL"],
    href: "https://github.com/ChamikaCSA/logbook",
  },
  {
    slug: "phishing-simulator",
    index: "04",
    title: "Phishing Simulator",
    subtitle: "Cybersecurity training platform",
    period: "Sep 2025",
    domain: "Security · education",
    role: "Sole engineer",
    featured: true,
    problem:
      "Awareness training often stalls at slides. Teams need a safe way to rehearse phishing in the inbox, measure who falls for what, and close the loop with learning, without exposing a real organisation.",
    highlight:
      "Inbox simulations with student, instructor, and admin roles, closed by an NLP analysis service.",
    outcomes: [
      "Developed a full-stack training platform with interactive email simulations, quiz-based learning, and progress tracking.",
      "Implemented role-based access control and secure JWT authentication across student, instructor, and admin roles.",
      "Integrated an NLP analysis microservice and real-time analytics to evaluate and improve cybersecurity awareness.",
    ],
    architecture: [
      "Next.js training UI",
      "NestJS + JWT",
      "NLP microservice",
      "SQLite",
    ],
    shots: [
      { id: "inbox", caption: "Simulated inbox", frame: "desktop" },
      { id: "analytics", caption: "Instructor analytics", frame: "desktop" },
    ],
    stack: [
      "Next.js",
      "React",
      "NestJS",
      "TypeScript",
      "SQLite",
      "Tailwind CSS",
    ],
    href: "https://github.com/ChamikaCSA/phishing-simulator",
  },
  {
    slug: "ai-crm",
    index: "05",
    title: "AI-Powered CRM",
    subtitle: "Intelligent lead operations",
    period: "May 2025",
    domain: "SaaS · AI",
    role: "Sole engineer",
    featured: true,
    problem:
      "CRM tools collect leads and still leave support, scoring, and outreach as manual work. The product needed AI in the loop (chat, sentiment, prediction) behind proper roles and auth.",
    highlight:
      "Lead scoring, sentiment, and support chat behind MFA and role-based dashboards.",
    outcomes: [
      "Engineered a CRM with intelligent lead management and automated customer support.",
      "Built role-based dashboards with predictive analytics and sentiment analysis to drive sales automation.",
      "Implemented multi-factor authentication and custom AI chatbots to streamline marketing workflows.",
    ],
    architecture: ["Next.js", "NestJS", "MongoDB", "OpenAI"],
    shots: [
      { id: "pipeline", caption: "Lead pipeline", frame: "desktop" },
      { id: "chat", caption: "Support chatbot", frame: "desktop" },
    ],
    stack: ["Next.js", "NestJS", "TypeScript", "MongoDB", "OpenAI"],
    href: "https://github.com/ChamikaCSA/ai-crm",
  },
  {
    slug: "receipt-tracker",
    index: "06",
    title: "Receipt Tracker",
    subtitle: "AI expense extraction",
    period: "Jul 2025",
    domain: "SaaS · agents",
    role: "Sole engineer",
    featured: true,
    problem:
      "Receipt PDFs still meant typing. The product needed agents to pull transactions into a live store with auth and billing.",
    highlight:
      "Inngest agents extract transactions from PDFs into Convex, with Clerk auth and Stripe billing.",
    outcomes: [
      "Built a Next.js + Convex + Inngest pipeline that extracts transactions from PDFs with Claude and GPT-4.",
      "Added Clerk auth, Stripe subscriptions, and realtime expense tracking.",
    ],
    architecture: ["Next.js", "Inngest agents", "Convex", "Clerk · Stripe"],
    shots: [
      { id: "upload", caption: "Receipt upload", frame: "desktop" },
      { id: "ledger", caption: "Extracted ledger", frame: "desktop" },
    ],
    stack: ["Next.js", "Convex", "Inngest", "Clerk", "Stripe"],
    href: "https://github.com/ChamikaCSA/receipt-tracker",
    live: "https://receipt-tracker-umber.vercel.app",
  },
  {
    slug: "finflow-ai",
    index: "07",
    title: "FinFlow-AI",
    subtitle: "Android financial coaching",
    period: "Aug 2025",
    domain: "Mobile · AI",
    role: "Sole engineer",
    featured: true,
    problem:
      "Personal finance apps log transactions; they rarely coach. The gap is a native client that tracks money in real time and turns it into advice without feeling like a chatbot bolted on.",
    highlight:
      "Native Compose client with Firestore transactions and Gemini coaching in the same loop.",
    outcomes: [
      "Built an intelligent Android financial management app on modern architecture and Material Design 3.",
      "Integrated the Gemini API for real-time, AI-powered financial insights and personalised coaching.",
      "Used Kotlin Coroutines and Ktor for async work, with Firestore for live transaction tracking.",
    ],
    architecture: ["Jetpack Compose", "Ktor", "Firestore", "Gemini"],
    shots: [
      { id: "home", caption: "Home and coaching", frame: "mobile" },
      { id: "ledger", caption: "Transaction ledger", frame: "mobile" },
    ],
    stack: [
      "Android",
      "Kotlin",
      "Jetpack Compose",
      "Firebase",
      "Ktor",
      "Gemini API",
    ],
    href: "https://github.com/ChamikaCSA/finflow-ai",
  },
  {
    slug: "spritz-perfumes",
    index: "08",
    title: "Spritz Perfumes",
    subtitle: "Decant commerce, live inventory",
    period: "Aug 2026",
    domain: "E-commerce · payments",
    role: "Sole engineer",
    featured: true,
    problem:
      "Fragrance retail in Sri Lanka still treats a bottle as a single SKU. Decants need millilitre-accurate stock, sealed vs open lots, and a checkout that actually settles — not a catalogue with a mailto.",
    highlight:
      "Millilitre inventory and PayHere settlement via notify_url, not a client callback.",
    outcomes: [
      "Shipped a Next.js storefront with catalog, cart, wishlist, accounts, reviews, returns, and island-wide delivery.",
      "Modelled millilitre inventory in Supabase: sealed wholesale lots versus open bottles whose remaining_ml drops on each decant sale.",
      "Integrated PayHere with server-side notify_url confirmation, then fulfilled stock through a dedicated inventory RPC instead of trusting the client callback.",
      "Built an admin surface for brands, products, orders, users, receiving stock, and opening bottles for decant.",
    ],
    architecture: [
      "Next.js storefront",
      "Supabase inventory",
      "PayHere notify",
    ],
    shots: [
      { id: "storefront", caption: "Storefront", frame: "desktop" },
      { id: "admin", caption: "Inventory admin", frame: "desktop" },
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "PayHere",
      "Zustand",
      "Tailwind CSS",
    ],
    href: "https://github.com/ChamikaCSA/spritz-perfumes",
    live: "https://spritz-perfumes.vercel.app",
  },
  {
    slug: "nkr-motors",
    index: "09",
    title: "NKR Motors",
    subtitle: "EV & automotive service platform",
    period: "Dec 2025",
    domain: "Bookings · PWA",
    role: "Sole engineer",
    featured: true,
    problem:
      "A service garage needed more than a brochure site: customers requesting appointments with receipts, staff reviewing and notifying, and a marketing surface that still works as a PWA.",
    highlight:
      "Appointment requests with receipt uploads, staff review, and a PWA marketing surface.",
    outcomes: [
      "Shipped a Next.js + Supabase platform combining a marketing site with customer appointment requests, receipt uploads, and status tracking.",
      "Built an admin dashboard for review, approval, and notifications so staff could close the loop without a second tool.",
      "Packaged the marketing surface as a PWA with SEO so the garage still ranked and installed on a phone.",
    ],
    architecture: ["Next.js PWA", "Supabase", "Admin review"],
    shots: [
      { id: "marketing", caption: "Marketing site", frame: "desktop" },
      { id: "admin", caption: "Booking admin", frame: "desktop" },
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "PWA"],
    href: "https://github.com/ChamikaCSA/nkr-motors",
  },
  {
    slug: "cinnamon-erp",
    index: "10",
    title: "Cinnamon ERP",
    subtitle: "Manufacturing operations",
    period: "Jan 2025",
    domain: "ERP · operations",
    role: "Sole engineer",
    featured: true,
    problem:
      "A cinnamon manufacturer needed inventory, payroll, and production in one system instead of spreadsheets that drifted apart.",
    highlight:
      "Inventory, payroll, manufacturing, and roles on one MySQL + Express surface.",
    outcomes: [
      "Built a MySQL + Express + React operations system covering inventory, payroll, manufacturing, accounting, and reporting in one surface.",
      "Added user and role management so office staff and production could share the same system without a second login stack.",
      "Replaced drifting spreadsheets with stock reporting and income analysis against a single source of truth.",
    ],
    architecture: ["React", "Express", "MySQL"],
    shots: [
      { id: "inventory", caption: "Inventory", frame: "desktop" },
      { id: "payroll", caption: "Payroll and roles", frame: "desktop" },
    ],
    stack: ["MySQL", "Express.js", "React", "Node.js"],
    href: "https://github.com/ChamikaCSA/cinnamon-erp",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectNeighbors(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) return null;
  return {
    prev: projects[index - 1] ?? null,
    next: projects[index + 1] ?? null,
    position: index + 1,
    total: projects.length,
  };
}

export const featuredProjects = projects;
