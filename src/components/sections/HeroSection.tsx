import Heading from "@/components/typography/heading";
import type { StaticImageData } from "next/image";

interface HeroSectionProps {
  backgroundImage: StaticImageData;
  badgeText?: string;
  title: string;
  highlightText?: string;
  description?: string;
  headingVariant?: "h1" | "h2" | "h3" | "h4";
  className?: string;
}

export default function HeroSection({
  backgroundImage,
  badgeText,
  title,
  highlightText,
  description,
  headingVariant = "h3",
  className = "",
}: HeroSectionProps) {
  return (
    <section
      style={{
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className={`w-full py-32 ${className}`}
    >
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {badgeText && (
            <div className="px-5 py-2.5 rounded-[70px] outline outline-1 outline-[#EA6C35]">
              <span className="text-white text-base font-medium">
                {badgeText}
              </span>
            </div>
          )}

          <Heading variant={headingVariant} className="text-white font-bold">
            {highlightText ? (
              <>
                <span className="text-white">{title} </span>
                <span className="text-[#EA6C35]">{highlightText}</span>
              </>
            ) : (
              title
            )}
          </Heading>

          {description && (
            <p className="text-white text-xl font-medium leading-9">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
