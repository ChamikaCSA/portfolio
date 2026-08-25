export type ExperienceKind = "work" | "education";

export type ExperienceEntry = {
  id: string;
  kind: ExperienceKind;
  timestamp: string;
  range: string;
  title: string;
  org: string;
  location?: string;
  kicker?: string;
  award?: string;
  bullets: string[];
  nested?: ExperienceEntry[];
  links?: { label: string; href: string }[];
};

export const experience: ExperienceEntry[] = [
  {
    id: "iit",
    kind: "education",
    timestamp: "2022.00",
    range: "2022 — 2026",
    title: "BEng (Hons) Software Engineering with Industrial Placement",
    org: "Informatics Institute of Technology / University of Westminster",
    award: "First Class",
    bullets: [
      "Modules include software development, computer systems, web design, OOP, database systems, software development group project, machine learning, algorithms, cyber security, formal methods, concurrent programming, operational research, and the final year project.",
    ],
    links: [
      {
        label: "certificate",
        href: "https://veri.westminster.ac.uk/?reference=41098745-01-SMPN",
      },
      {
        label: "transcript",
        href: "https://veri.westminster.ac.uk/?reference=39033239-01-KGYX",
      },
    ],
    nested: [
      {
        id: "liveroom",
        kind: "work",
        timestamp: "2024.08",
        range: "Aug 2024 — Aug 2025",
        title: "Trainee Software Engineer",
        org: "LiveRoom Technologies Pte. Ltd.",
        location: "Colombo, Sri Lanka",
        kicker: "Year 3 industrial placement",
        bullets: [
          "Contributed to two healthcare-domain Flutter apps: health monitoring and secure health data sharing.",
          "Improved performance, stability, and consistency while owning the mobile release path through App Store Connect and Google Play Console.",
          "Built frontend components for an AI-powered blockchain platform in Next.js.",
        ],
      },
    ],
  },
  {
    id: "stc-al",
    kind: "education",
    timestamp: "2018.00",
    range: "2018 — 2021",
    title: "GCE Advanced Level",
    org: "St. Thomas' College, Matale",
    bullets: ["Physical Science stream."],
  },
  {
    id: "stc-ol",
    kind: "education",
    timestamp: "2016.00",
    range: "2016 — 2017",
    title: "GCE Ordinary Level",
    org: "St. Thomas' College, Matale",
    bullets: ["9 A's."],
  },
];
