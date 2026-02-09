import { BadgeCheck } from "lucide-react";
import type { PropertyDetailResponseType } from "@/lib/api/services/home.service";

interface PDPHighLightsProps {
  highlights: string[];
}

export default function PDPHighLights({ highlights }: PDPHighLightsProps) {
  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <section className="px-4 md:px-6 lg:px-0">
      <div className="mx-auto max-w-6xl rounded-[20px] bg-white">
        <div className="rounded-[20px] bg-white shadow-sm">
          <div className="rounded-t-2xl bg-[#EEF4FF] px-6 py-4">
            <h3 className="font-semibold text-[25px] text-[#000000]">Highlights</h3>
          </div>

          <div className="px-6 py-8">
            <div className="space-y-4">
              {highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-lg bg-[#EEF4FF] px-4 py-3"
                >
                  <BadgeCheck className="fill-[#2E6B2B] text-white size-5 shrink-0 mt-[2px]" />
                  <p className="leading-relaxed text-[#000000] text-[14px] font-medium">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
