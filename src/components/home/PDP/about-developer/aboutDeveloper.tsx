import Image from "next/image";
import { type DeveloperInfo } from "@/lib/api/services/home.service";

interface PDPAboutDeveloperProps {
  developer: DeveloperInfo;
}

// Check if URL is a valid image URL (not a placeholder)
const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  // Check for placeholder URLs
  if (
    url.includes("your-bucket") ||
    url.includes("example.com") ||
    url.includes("placeholder") ||
    url === "https://your-bucket.s3.amazonaws.com/developers/abc.jpg"
  ) {
    return false;
  }
  // Check if it's a valid URL format
  try {
    const urlObj = new URL(url);
    return (urlObj.protocol === "https:" || urlObj.protocol === "http:") && urlObj.hostname.length > 0;
  } catch {
    return false;
  }
};

// Check if URL is from configured Next.js image domain
const isConfiguredDomain = (url: string): boolean => {
  return url.includes("milkekhareedo-storage.s3.ap-southeast-2.amazonaws.com");
};

export default function PDPAboutDeveloper({ developer }: PDPAboutDeveloperProps) {
  const hasValidLogo = developer.logo && isValidImageUrl(developer.logo);
  const isConfigured = developer.logo && isConfiguredDomain(developer.logo);

  return (
    <section className="w-full px-6 py-6">
      <div className="max-w-6xl mx-auto container rounded-2xl bg-white shadow-sm">
        <div className="rounded-t-2xl bg-[#EEF4FF] px-6 py-3">
          <h3 className="font-semibold text-[#000000] text-[25px]">About Developer</h3>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6 md:gap-8 lg:flex-row lg:items-start">
         <div className="lg:flex-1 lg:pr-6 lg:border-r lg:border-[#D9D9D9]">
            {developer.logo && hasValidLogo && (
              <div className="mb-3">
                {isConfigured ? (
                  <Image
                    src={developer.logo}
                    alt={`${developer.name} logo`}
                    width={216}
                    height={52}
                    className="h-8 w-auto sm:h-10 lg:h-[52px] object-contain"
                  />
                ) : (
                  // Use regular img tag for valid URLs not in Next.js config
                  <img
                    src={developer.logo}
                    alt={`${developer.name} logo`}
                    className="h-8 w-auto sm:h-10 lg:h-[52px] object-contain"
                  />
                )}
              </div>
            )}

            <p className="text-[20px] leading-relaxed text-[#000000] font-normal">
              {developer.description}
            </p>
          </div>

          <div className="flex w-full flex-col items-center justify-center md:justify-start gap-4 md:gap-6 lg:w-1/4">
            <div className="flex gap-12 justify-center">
              <div className="flex flex-col gap-2.5 items-center justify-center w-30">
                <div className="w-22 p-6.5 flex justify-center items-center gap-2 rounded-full bg-[#1C4692] shadow-sm">
                  <span className="text-3xl text-center font-bold text-[#FFFFFF]">
                    {developer.yearsOfExperience}+
                  </span>
                </div>
                <span className="text-lg font-semibold text-center">
                  Years of Experience
                </span>
              </div>

              <div className="flex flex-col gap-2.5 items-center justify-center w-30">
                <div className="w-22 p-6.5 flex justify-center items-center gap-2 rounded-full bg-[#1C4692] shadow-sm">
                  <span className="text-3xl text-center font-bold text-[#FFFFFF]">
                    {developer.totalProjects}+
                  </span>
                </div>
                <span className="text-xl font-semibold text-center">
                  Total projects
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
