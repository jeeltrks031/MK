import { ReactNode } from "react";

interface SchemaMarkupProps {
  type:
    | "Organization"
    | "WebPage"
    | "Article"
    | "Product"
    | "LocalBusiness"
    | "FAQPage";
  data: Record<string, any>;
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Pre-built schemas
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Milke Khareedo",
  description:
    "Buy smarter with collective power. Group buying platform for real estate.",
  url: "https://milkekhareedo.com",
  logo: "https://milkekhareedo-storage.s3.ap-southeast-2.amazonaws.com/logo.png",
  sameAs: [
    "https://facebook.com/milkekhareedo",
    "https://instagram.com/milkekhareedo",
    "https://twitter.com/milkekhareedo",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: "support@milkekhareedo.com",
  },
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Milke Khareedo",
  image:
    "https://milkekhareedo-storage.s3.ap-southeast-2.amazonaws.com/logo.png",
  description:
    "Buy smarter with collective power. Group buying platform for real estate.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tk Residency , Friends Colony Rd",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500049",
    addressCountry: "IN",
  },
  telephone: "+91-XXXXXXXXXX",
  email: "support@milkekhareedo.com",
};

export function WebPageSchema({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    publisher: {
      "@type": "Organization",
      name: "Milke Khareedo",
      logo: {
        "@type": "ImageObject",
        url: "https://milkekhareedo-storage.s3.ap-southeast-2.amazonaws.com/logo.png",
      },
    },
  };
}

export function ArticleSchema({
  title,
  description,
  image,
  author,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  image: string;
  author: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: description,
    image: [image],
    author: {
      "@type": "Person",
      name: author,
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    publisher: {
      "@type": "Organization",
      name: "Milke Khareedo",
    },
  };
}
