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
    period: "Apr 2026",
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
    slug: "phishing-simulator",
    index: "02",
    title: "Phishing Simulator",
    subtitle: "Cybersecurity training platform",
    period: "Sep 2025",
    domain: "Security · education",
    featured: true,
    problem:
      "Awareness training often stalls at slides. Teams need a safe way to rehearse phishing in the inbox, measure who falls for what, and close the loop with learning, without exposing a real organisation.",
    outcomes: [
      "Developed a full-stack training platform with interactive email simulations, quiz-based learning, and progress tracking.",
      "Implemented role-based access control and secure JWT authentication.",
      "Integrated NLP analysis and real-time analytics to evaluate and improve cybersecurity awareness.",
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
    slug: "finflow-ai",
    index: "03",
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
    slug: "ai-crm",
    index: "04",
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
    slug: "nkr-motors",
    index: "05",
    title: "NKR Motors",
    subtitle: "EV & automotive service platform",
    period: "2025",
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
    slug: "first-aid-health-care",
    index: "06",
    title: "First Aid Health Care",
    subtitle: "Emergency-ready mobile companion",
    period: "2024",
    domain: "Mobile · health",
    featured: true,
    problem:
      "First-aid knowledge is useless if it lives behind a connection. The app had to work offline, locate care, and still feel calm under stress.",
    outcomes: [
      "Built a Flutter healthcare app covering emergency contacts, first-aid instructions, an illness database, hospital locator, training, journaling, and community support.",
      "Used Firebase for backend services with offline-capable flows.",
    ],
    stack: ["Flutter", "Dart", "Firebase"],
    href: "https://github.com/ChamikaCSA/first-aid-health-care",
  },
  {
    slug: "cinnamon-erp",
    index: "07",
    title: "Cinnamon ERP",
    subtitle: "Manufacturing operations",
    period: "2024",
    domain: "ERP · MERN",
    featured: true,
    problem:
      "A cinnamon manufacturer needed inventory, payroll, and production in one system instead of spreadsheets that drifted apart.",
    outcomes: [
      "Built a MERN ERP covering inventory, payroll, and manufacturing workflows in a single operational surface.",
    ],
    stack: ["MongoDB", "Express.js", "React", "Node.js"],
    href: "https://github.com/ChamikaCSA/cinnamon-erp",
  },
  {
    slug: "human-resource-management",
    index: "08",
    title: "Human Resource Management",
    subtitle: "Monorepo HR platform",
    period: "2024",
    domain: "HR · full-stack",
    featured: true,
    problem:
      "HR tooling split across apps. The work was a typed monorepo that could grow without the frontend and API drifting.",
    outcomes: [
      "Shipped an HR platform as a Turborepo with NestJS and Next.js, keeping API and UI on one contract.",
    ],
    stack: ["NestJS", "Next.js", "Turborepo", "TypeScript"],
    href: "https://github.com/ChamikaCSA/human-resource-management",
  },
  {
    slug: "mobile-dapp",
    index: "09",
    title: "Mobile dApp",
    subtitle: "Ethereum on device",
    period: "2024",
    domain: "Mobile · web3",
    featured: true,
    problem:
      "Wallet flows usually live in the browser. This needed a Flutter client that could talk to Ethereum without a desktop chrome.",
    outcomes: [
      "Built a Flutter dApp with web3dart for on-device Ethereum interaction.",
    ],
    stack: ["Flutter", "Dart", "Ethereum", "web3dart"],
    href: "https://github.com/ChamikaCSA/mobile-dapp",
  },
  {
    slug: "logbook",
    index: "10",
    title: "Logbook",
    subtitle: "Field logs with forecasting",
    period: "2024",
    domain: "Mobile · data",
    featured: true,
    problem:
      "Field notes were stuck in paper. The app had to capture logs, sync them, and surface a forecast from the history.",
    outcomes: [
      "Built a Flutter logbook on Supabase with forecasting over recorded entries.",
    ],
    stack: ["Flutter", "Dart", "Supabase"],
    href: "https://github.com/ChamikaCSA/logbook",
  },
  {
    slug: "biometric-voting-system",
    index: "11",
    title: "Biometric Voting System",
    subtitle: "Identity-checked ballots",
    period: "2023",
    domain: "Civic · CV",
    featured: true,
    problem:
      "A voting demo needed more than a form: facial recognition at the booth so a ballot could not be cast twice by the same face.",
    outcomes: [
      "Built a React and Node.js voting flow with facial recognition as the identity gate.",
    ],
    stack: ["React", "Node.js", "Facial recognition"],
    href: "https://github.com/ChamikaCSA/biometric-voting-system",
  },
  {
    slug: "project-management",
    index: "12",
    title: "Project Management",
    subtitle: "Tasks, teams, Prisma",
    period: "2023",
    domain: "SaaS · productivity",
    featured: true,
    problem:
      "A student team needed a single place for tasks and ownership without bolting three tools together.",
    outcomes: [
      "Built a project-management app with Next.js, Express, and Prisma for typed persistence.",
    ],
    stack: ["Next.js", "Express.js", "Prisma"],
    href: "https://github.com/ChamikaCSA/project-management",
    live: "https://main.d187wqhwihbk5e.amplifyapp.com",
  },
  {
    slug: "cpr-assist",
    index: "13",
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
    slug: "emotion-recognition",
    index: "14",
    title: "Emotion Recognition",
    subtitle: "Face and audio affect",
    period: "Apr 2025",
    domain: "ML · mobile",
    featured: true,
    problem:
      "Affect had to be read from both face and voice, in real time, behind an API a mobile client could call.",
    outcomes: [
      "Shipped TensorFlow models for facial and audio emotion detection with a Flask API and React Native client.",
      "Added video processing with temporal smoothing for stable predictions.",
    ],
    stack: ["Python", "TensorFlow", "Flask", "React Native", "OpenCV"],
    href: "https://github.com/ChamikaCSA/emotion-recognition",
  },
  {
    slug: "receipt-tracker",
    index: "15",
    title: "Receipt Tracker",
    subtitle: "AI expense extraction",
    period: "Jun 2025",
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
    slug: "weather-mcp",
    index: "16",
    title: "Weather MCP",
    subtitle: "NWS tools for agents",
    period: "Jun 2025",
    domain: "MCP · API",
    featured: true,
    problem:
      "Agents needed structured weather alerts and forecasts without scraping HTML.",
    outcomes: [
      "Implemented an MCP server with get-alerts and get-forecast tools on the National Weather Service API.",
    ],
    stack: ["TypeScript", "MCP", "Node.js"],
    href: "https://github.com/ChamikaCSA/weather-mcp",
  },
  {
    slug: "rssagg",
    index: "17",
    title: "rssagg",
    subtitle: "Concurrent RSS API",
    period: "Jun 2025",
    domain: "Go · API",
    featured: true,
    problem:
      "Feed collection needed to run on a schedule, concurrently, and behind auth. Not a single-process scrape.",
    outcomes: [
      "Built a Go RSS aggregator with Chi, SQLC, PostgreSQL, JWT, and concurrent feed scraping on a configurable interval.",
    ],
    stack: ["Go", "PostgreSQL", "SQLC", "Chi", "JWT"],
    href: "https://github.com/ChamikaCSA/rssagg",
  },
  {
    slug: "solar-life",
    index: "18",
    title: "Solar Life",
    subtitle: "Solar company site",
    period: "May 2025",
    domain: "Marketing · motion",
    featured: true,
    problem:
      "A solar brand needed a marketing surface with motion that still held up on a phone.",
    outcomes: [
      "Shipped a Next.js site with glass cards, parallax, and a custom cursor trail.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Motion"],
    href: "https://github.com/ChamikaCSA/solar-life",
  },
  {
    slug: "innova-struct",
    index: "19",
    title: "Innova Struct",
    subtitle: "Tender marketplace",
    period: "Mar 2025",
    domain: "SaaS · bidding",
    featured: true,
    problem:
      "Clients and contractors were trading tenders over email. They needed one place to post, bid, and read the numbers.",
    outcomes: [
      "Built a React + Spring Boot + MongoDB platform for tender creation, bidding, analytics, and portfolios.",
    ],
    stack: ["React", "Spring Boot", "MongoDB"],
    href: "https://github.com/ChamikaCSA/innova-struct",
  },
  {
    slug: "erc-721-app",
    index: "20",
    title: "ERC-721 App",
    subtitle: "NFT minting dApp",
    period: "Feb 2025",
    domain: "Web3",
    featured: true,
    problem:
      "Minting had to feel like a product: wallet in, metadata on IPFS, token out, without a raw contract UI.",
    outcomes: [
      "Built a React + Wagmi dApp for Ethereum NFT minting with wallet integration and IPFS storage.",
    ],
    stack: ["React", "TypeScript", "Wagmi", "IPFS", "Ethereum"],
    href: "https://github.com/ChamikaCSA/erc-721-app",
  },
  {
    slug: "3d-tesla-workshop",
    index: "21",
    title: "3D Tesla Workshop",
    subtitle: "Interactive car showcase",
    period: "Feb 2025",
    domain: "3D · WebGL",
    featured: true,
    problem:
      "A car configurator is dead if the model cannot take light, physics, and a camera the user actually drives.",
    outcomes: [
      "Built a React Three Fiber Tesla showcase with multiple models, realtime physics, and dynamic lighting.",
    ],
    stack: ["React", "Three.js", "React Three Fiber"],
    href: "https://github.com/ChamikaCSA/3d-tesla-workshop",
    live: "https://chamikacsa.github.io/3d-tesla-workshop/",
  },
  {
    slug: "product-configurator",
    index: "22",
    title: "Product Configurator",
    subtitle: "Configurable product view",
    period: "Mar 2025",
    domain: "3D · commerce",
    featured: true,
    problem:
      "A product page needed a configurator, not a static render.",
    outcomes: [
      "Shipped an interactive product configurator as a web app.",
    ],
    stack: ["JavaScript"],
    href: "https://github.com/ChamikaCSA/product-configurator",
    live: "https://product-configurator-dun.vercel.app",
  },
  {
    slug: "supabase-tutorial",
    index: "23",
    title: "Realtime Chat",
    subtitle: "Supabase messaging",
    period: "May 2025",
    domain: "Realtime · auth",
    featured: true,
    problem:
      "One-to-one chat needed presence, OAuth, and live messages without a custom socket layer.",
    outcomes: [
      "Built a Next.js 15 + Supabase chat app with profiles, presence, and realtime updates.",
    ],
    stack: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS"],
    href: "https://github.com/ChamikaCSA/supabase-tutorial",
  },
  {
    slug: "sono-smart",
    index: "24",
    title: "Sono Smart",
    subtitle: "Angular + Node prototype",
    period: "Mar 2025",
    domain: "Web · full-stack",
    featured: true,
    problem:
      "A product prototype needed a split Angular client and Node API instead of a single HTML file.",
    outcomes: [
      "Built an Angular 19 frontend with a Node.js backend for the Sono Smart prototype.",
    ],
    stack: ["Angular", "TypeScript", "Node.js"],
    href: "https://github.com/ChamikaCSA/sono-smart",
  },
  {
    slug: "business-management-system",
    index: "25",
    title: "Business Management System",
    subtitle: "Desktop operations",
    period: "Jul 2024",
    domain: "Desktop · Java",
    featured: true,
    problem:
      "Inventory, invoices, and roles were spread across spreadsheets. A desktop client had to own the loop.",
    outcomes: [
      "Built a Java Swing + FlatLaf system for inventory, suppliers, customers, invoicing, and payments on MySQL.",
      "Added stock reporting, sales forecasting, and income analysis.",
    ],
    stack: ["Java", "Swing", "MySQL"],
    href: "https://github.com/ChamikaCSA/business-management-system",
  },
  {
    slug: "bone-age-prediction",
    index: "26",
    title: "Bone Age Prediction",
    subtitle: "X-ray age estimate",
    period: "Jun 2024",
    domain: "CV · medical",
    featured: true,
    problem:
      "Bone age from an X-ray is slow when it is done by eye. The model had to preprocess, detect, and estimate.",
    outcomes: [
      "Trained a transfer-learning pipeline for bone-age prediction from medical images.",
    ],
    stack: ["Python", "TensorFlow", "Keras", "OpenCV"],
    href: "https://github.com/ChamikaCSA/bone-age-prediction",
  },
  {
    slug: "movie-app",
    index: "27",
    title: "Movie App",
    subtitle: "TMDb on Flutter",
    period: "Sep 2024",
    domain: "Mobile · media",
    featured: true,
    problem:
      "A movie client needed live TMDb data, auth, and a UI that did not fight the phone.",
    outcomes: [
      "Built a Flutter app with Firebase auth, Riverpod, and realtime TMDb listings.",
    ],
    stack: ["Flutter", "Dart", "Firebase", "Riverpod"],
    href: "https://github.com/ChamikaCSA/movie-app",
  },
  {
    slug: "online-library",
    index: "28",
    title: "Online Library",
    subtitle: "ASP.NET catalogue",
    period: "May 2024",
    domain: "Web · MVC",
    featured: true,
    problem:
      "A library needed search, reservation, and a board, not a static list of titles.",
    outcomes: [
      "Built an ASP.NET Core MVC app for book search, reservation, and a message board.",
    ],
    stack: ["ASP.NET Core", "Entity Framework", "MVC"],
    href: "https://github.com/ChamikaCSA/online-library",
  },
  {
    slug: "online-shopping-system",
    index: "29",
    title: "Online Shopping System",
    subtitle: "Java Swing store",
    period: "Mar 2024",
    domain: "Desktop · commerce",
    featured: true,
    problem:
      "A coursework store needed a GUI, not a console checkout.",
    outcomes: [
      "Built a Java Swing shopping system with product and order flows.",
    ],
    stack: ["Java", "Swing"],
    href: "https://github.com/ChamikaCSA/online-shopping-system",
  },
  {
    slug: "theatre-booking-system",
    index: "30",
    title: "Theatre Booking System",
    subtitle: "Seat maps in Java",
    period: "Mar 2024",
    domain: "Desktop · booking",
    featured: true,
    problem:
      "Theatre seats had to be picked on a map, not typed as row numbers.",
    outcomes: [
      "Built a Java theatre booking client with a seat-selection UI.",
    ],
    stack: ["Java"],
    href: "https://github.com/ChamikaCSA/theatre-booking-system",
  },
  {
    slug: "e-commerce-site",
    index: "31",
    title: "E-commerce Site",
    subtitle: "Fictional storefront",
    period: "Mar 2024",
    domain: "Web · commerce",
    featured: true,
    problem:
      "A storefront prototype needed to actually check out, not just look like a catalogue.",
    outcomes: ["Built a functional e-commerce site for a fictional store."],
    stack: ["HTML"],
    href: "https://github.com/ChamikaCSA/e-commerce-site",
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
