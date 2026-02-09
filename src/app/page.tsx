import { Metadata } from "next";
import AboutSection from "@/components/home/hero/about/about";
import CalculateSave from "@/components/home/hero/calculateSave/calculateSave";
import FAQS from "@/components/home/hero/faqs/faqs";
import Heading from "@/components/home/hero/heading/heading";
import Hero from "@/components/home/hero/HeroSection";
import HowItWorks from "@/components/home/hero/howItsWork/howitswork";
import IntoNews from "@/components/home/hero/intoNews/intoNews";
import CardsSection from "@/components/home/hero/PDP/pdpCards";
import Testimonials from "@/components/home/hero/testimonials/whatYourCustomerSays";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title: "Milke Khareedo - Buy Smart with Collective Power",
  description:
    "Buy smarter with collective power. Group buying platform for apartments, villas, and plots in Hyderabad. Save more, negotiate better, and buy with confidence.",
  keywords: [
    "group buying",
    "collective buying",
    "real estate",
    "apartments",
    "villas",
    "plots",
    "Hyderabad",
  ],
  canonical: "https://milkekhareedo.com",
});

export default function Home() {
  return (
    <>
      <Hero />
      <CardsSection />
      <AboutSection />
      <HowItWorks />
      <CalculateSave />
      <IntoNews />
      <Testimonials />
      <FAQS />
      <Heading />
    </>
  );
}
