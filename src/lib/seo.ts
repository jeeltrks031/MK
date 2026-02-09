import { Metadata } from "next";

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  canonical?: string;
  noindex?: boolean;
  author?: string;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const defaultOgImage =
    "https://milkekhareedo-storage.s3.ap-southeast-2.amazonaws.com/og-image.jpg";

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(", "),
    authors: config.author ? [{ name: config.author }] : undefined,
    robots: {
      index: !config.noindex,
      follow: true,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      type: config.ogType || "website",
      images: [
        {
          url: config.ogImage || defaultOgImage,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [config.ogImage || defaultOgImage],
    },
    alternates: config.canonical
      ? {
          canonical: config.canonical,
        }
      : undefined,
  };
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://milkekhareedo.com";

export const socialLinks = {
  facebook: "https://facebook.com/milkekhareedo",
  instagram: "https://instagram.com/milkekhareedo",
  twitter: "https://twitter.com/milkekhareedo",
  linkedin: "https://linkedin.com/company/milkekhareedo",
};
