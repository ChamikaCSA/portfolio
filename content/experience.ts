export type LogEntry = {
  id: string;
  kind: "work" | "education";
  timestamp: string;
  range: string;
  title: string;
  org: string;
  location?: string;
  bullets: string[];
};

export const log: LogEntry[] = [
  {
    id: "liveroom",
    kind: "work",
    timestamp: "2024.08",
    range: "Aug 2024 — Aug 2025",
    title: "Trainee Software Engineer",
    org: "LiveRoom Technologies Pte. Ltd.",
    location: "Colombo, Sri Lanka",
    bullets: [
      "Contributed to two healthcare-domain Flutter apps: health monitoring and secure health data sharing.",
      "Improved performance, stability, and consistency while owning the mobile release path through App Store Connect and Google Play Console.",
      "Built frontend components for an AI-powered blockchain platform in Next.js.",
    ],
  },
  {
    id: "iit",
    kind: "education",
    timestamp: "2022.00",
    range: "2022 — present",
    title: "BEng (Hons) Software Engineering",
    org: "Informatics Institute of Technology / University of Westminster",
    location: "Expected graduation September 2026",
    bullets: [
      "Relevant modules: OOP, Database Systems, Software Development Group Project, Machine Learning and Data Mining, Algorithms, Industrial Placement, Final Year Project, Cyber Security, Formal Methods, Concurrent Programming, Operational Research.",
    ],
  },
  {
    id: "stc-al",
    kind: "education",
    timestamp: "2018.00",
    range: "2018 — 2020",
    title: "GCE Advanced Level",
    org: "St. Thomas' College, Matale",
    bullets: ["Physical Science stream."],
  },
  {
    id: "stc-ol",
    kind: "education",
    timestamp: "2016.00",
    range: "2016",
    title: "GCE Ordinary Level",
    org: "St. Thomas' College, Matale",
    bullets: ["9 A's."],
  },
];
