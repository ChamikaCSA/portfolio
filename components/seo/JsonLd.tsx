import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${profile.name} · Fullstack Developer`,
        description: profile.summary,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: profile.name,
        givenName: profile.firstName,
        familyName: profile.lastName,
        jobTitle: "Fullstack Developer",
        email: profile.email,
        telephone: profile.phone,
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Colombo",
          addressCountry: "LK",
        },
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
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
