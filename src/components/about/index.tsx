import CompanyOverview from "./CompanyOverview";
import Founders from "./Founders";
import MissionVision from "./MissionVission";
import TopDevelopers from "./TopDevelopers";
import ValuesAchievements from "./ValuesAchievements";
import HeroSection from "@/components/sections/HeroSection";
import AboutHeroBg from "@/assets/about-us/about-hero-bg.png";
import Teams from "./Teams";

export default function About() {
  return (
    <>
      <HeroSection
        backgroundImage={AboutHeroBg}
        badgeText="About Us"
        title="We make property"
        highlightText="Buying Easier."
        description="We bring buyers together to help you save more, negotiate better, and buy with confidence."
        headingVariant="h3"
      />
      <CompanyOverview />
      <MissionVision />
      <ValuesAchievements />
      <TopDevelopers />
      <Founders />
      <Teams/>
    </>
  );
}
