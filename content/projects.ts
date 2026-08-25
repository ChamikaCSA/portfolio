export type Project = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  period: string;
  domain: string;
  featured: boolean;
  flagship?: boolean;
  problem: string;
  outcomes: string[];
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
    featured: true,
    flagship: true,
    problem:
      "Hospitals need shared anomaly-detection models without moving patient data off-site. Heterogeneous (non-IID) records make naive federated training brittle, and leakage risk has to be treated as a first-class constraint.",
    outcomes: [
      "Built an end-to-end privacy-preserving federated learning platform for cross-hospital health anomaly detection, keeping patient data local to each institution.",
      "Designed a dual-protocol backend: FastAPI as the control plane, TLS-secured gRPC for federated round coordination, job orchestration, client registration, quorum handling, and model aggregation.",
      "Implemented LSTM time-series modeling with FedProx to improve convergence under heterogeneous client distributions.",
      "Integrated Differential Privacy and optional Homomorphic Encryption for secure aggregation and reduced inference leakage.",
      "Shipped role-based Next.js server/client dashboards and an Electron edge client for site-level participation, monitoring, audit visibility, and model release.",
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
    featured: true,
    problem:
      "CPR quality drops without a coach in the room. The system needed live compression feedback from the camera, not a checklist after the fact.",
    outcomes: [
      "Built a monorepo with an Expo app and FastAPI backend for camera-based readiness checks, live compression inference, and session scoring.",
      "Added instructor analytics and role-based audit/report APIs on a vendored ML vision stack.",
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
    featured: true,
    problem:
      "Timber-service SMEs were running the books on paper. They needed offline capture, role-based access, and a forecast that used their own history — not a generic dashboard.",
    outcomes: [
      "Built a cross-platform Flutter app on Supabase with RLS, offline transaction sync, and timber-specific income/expense categories.",
      "Shipped monthly and quarterly PDF reports plus a FastAPI forecasting service (seasonal regression, random forest, SARIMAX) that the Insights screen falls back from when the API is unreachable.",
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
    featured: true,
    problem:
      "Awareness training often stalls at slides. Teams need a safe way to rehearse phishing in the inbox, measure who falls for what, and close the loop with learning, without exposing a real organisation.",
    outcomes: [
      "Developed a full-stack training platform with interactive email simulations, quiz-based learning, and progress tracking.",
      "Implemented role-based access control and secure JWT authentication across student, instructor, and admin roles.",
      "Integrated an NLP analysis microservice and real-time analytics to evaluate and improve cybersecurity awareness.",
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
    featured: true,
    problem:
      "CRM tools collect leads and still leave support, scoring, and outreach as manual work. The product needed AI in the loop (chat, sentiment, prediction) behind proper roles and auth.",
    outcomes: [
      "Engineered a CRM with intelligent lead management and automated customer support.",
      "Built role-based dashboards with predictive analytics and sentiment analysis to drive sales automation.",
      "Implemented multi-factor authentication and custom AI chatbots to streamline marketing workflows.",
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
    featured: true,
    problem:
      "Receipt PDFs still meant typing. The product needed agents to pull transactions into a live store with auth and billing.",
    outcomes: [
      "Built a Next.js + Convex + Inngest pipeline that extracts transactions from PDFs with Claude and GPT-4.",
      "Added Clerk auth, Stripe subscriptions, and realtime expense tracking.",
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
    featured: true,
    problem:
      "Personal finance apps log transactions; they rarely coach. The gap is a native client that tracks money in real time and turns it into advice without feeling like a chatbot bolted on.",
    outcomes: [
      "Built an intelligent Android financial management app on modern architecture and Material Design 3.",
      "Integrated the Gemini API for real-time, AI-powered financial insights and personalised coaching.",
      "Used Kotlin Coroutines and Ktor for async work, with Firestore for live transaction tracking.",
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
    featured: true,
    problem:
      "Fragrance retail in Sri Lanka still treats a bottle as a single SKU. Decants need millilitre-accurate stock, sealed vs open lots, and a checkout that actually settles — not a catalogue with a mailto.",
    outcomes: [
      "Shipped a Next.js storefront with catalog, cart, wishlist, accounts, reviews, returns, and island-wide delivery, live at spritz-perfumes.vercel.app.",
      "Modelled millilitre inventory in Supabase: sealed wholesale lots versus open bottles whose remaining_ml drops on each decant sale.",
      "Integrated PayHere with server-side notify_url confirmation, then fulfilled stock through a dedicated inventory RPC instead of trusting the client callback.",
      "Built an admin surface for brands, products, orders, users, receiving stock, and opening bottles for decant.",
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
    featured: true,
    problem:
      "A service garage needed more than a brochure site: customers requesting appointments with receipts, staff reviewing and notifying, and a marketing surface that still works as a PWA.",
    outcomes: [
      "Shipped a Next.js + Supabase platform combining a marketing site with customer appointment requests, receipt uploads, and status tracking.",
      "Built an admin dashboard for review, approval, notifications, SEO, and PWA support.",
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
    domain: "ERP · MERN",
    featured: true,
    problem:
      "A cinnamon manufacturer needed inventory, payroll, and production in one system instead of spreadsheets that drifted apart.",
    outcomes: [
      "Built a MERN ERP covering inventory, payroll, manufacturing, accounting, and reporting in a single operational surface.",
      "Added user and role management so the same system could serve office staff and production without a second tool.",
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
