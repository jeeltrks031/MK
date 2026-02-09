import React from "react";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { SchemaMarkup, organizationSchema } from "@/lib/schema-markup";
import { Providers } from "@/providers/providers";
import StickyVideo from "@/components/ui/stickyVideo";

const figtreeSans = Figtree({
  variable: "--font-figtree-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Milke Khareedo - Buy Smart with Collective Power",
    template: "%s | Milke Khareedo",
  },
  description:
    "Buy smarter with collective power. Group buying platform for apartments, villas, and plots. Save more, negotiate better, buy with confidence.",
  keywords: [
    "group buying",
    "collective buying",
    "real estate",
    "apartments",
    "villas",
    "plots",
    "property",
    "Hyderabad",
  ],
  authors: [{ name: "Milke Khareedo" }],
  creator: "Milke Khareedo",
  publisher: "Milke Khareedo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://milkekhareedo.com",
    siteName: "Milke Khareedo",
    title: "Milke Khareedo - Buy Smart with Collective Power",
    description:
      "Buy smarter with collective power. Group buying platform for real estate.",
    images: [
      {
        url: "https://milkekhareedo-storage.s3.ap-southeast-2.amazonaws.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Milke Khareedo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@milkekhareedo",
    creator: "@milkekhareedo",
  },
  alternates: {
    canonical: "https://milkekhareedo.com",
  },
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <SchemaMarkup type="Organization" data={organizationSchema} />
        <link rel="canonical" href="https://milkekhareedo.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1C4692" />
      </head>
      <body className={`${figtreeSans.variable} antialiased`}>
        <Providers>
          <Header />
          <main>{children}</main>
          <StickyVideo/>
          <FooterWrapper />
        </Providers>
      </body>
    </html>
  );
}
