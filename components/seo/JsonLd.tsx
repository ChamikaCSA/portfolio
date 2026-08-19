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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
