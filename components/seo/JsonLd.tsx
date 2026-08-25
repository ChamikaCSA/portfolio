import { profile } from "@/content/profile";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: "Fullstack Developer",
    email: profile.email,
    telephone: profile.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Colombo",
      addressCountry: "LK",
    },
    url: profile.links.github,
    sameAs: [profile.links.github, profile.links.linkedin],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Informatics Institute of Technology / University of Westminster",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: "BEng (Hons) Software Engineering with Industrial Placement",
      credentialCategory: "First Class Honours",
      recognizedBy: {
        "@type": "CollegeOrUniversity",
        name: "University of Westminster",
      },
      dateCreated: "2026-08-06",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
