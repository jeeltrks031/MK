import { type PropertyDetail } from "@/lib/api/services/home.service";

interface PDPPropertyDetailsProps {
  property: PropertyDetail;
}

export default function PDPPropertyDetails({ property }: PDPPropertyDetailsProps) {
  return (
    <section className="px-4 md:px-6 lg:px-0">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white shadow-sm">
        <div className="rounded-t-[20px] bg-[#EEF4FF] px-6 py-4">
          <h3 className="text-[25px] font-semibold text-[#000000]">
            Property Details
          </h3>
        </div>

        <div className="px-4 md:px-6 py-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div>
                <p className="text-[14px] text-[#7B7B7B] font-normal">Units</p>
                <p className="mt-1 text-[16px] font-medium text-[#000000]">
                  {property.overview.units} Units
                </p>
              </div>

              <div>
                <p className="text-[14px] text-[#7B7B7B] font-normal">Carpet Area</p>
                <p className="mt-1 text-[16px] font-medium text-[#000000]">
                  {property.overview.areaRange?.formatted || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-[14px] text-[#7B7B7B] font-normal">Possession Date</p>
                <p className="mt-1 text-[16px] font-medium text-[#000000]">
                  {property.overview.possessionDateFormatted}
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t md:border-t-0 md:border-l md:border-r md:border-gray-100 md:px-6">
              <div>
                <p className="text-[14px] text-[#7B7B7B] font-normal mt-6 md:mt-0">Configuration</p>
                <p className="mt-1 text-[16px] font-medium text-[#000000]">
                  {property.overview.configurationsFormatted}
                </p>
              </div>

              <div>
                <p className="text-[14px] text-[#7B7B7B] font-normal">RERA ID</p>
                <p className="mt-1 text-[16px] font-medium text-[#000000]">
                  {property.reraId || property.overview.reraNumber}
                </p>
              </div>

              <div>
                <p className="text-[14px] text-[#7B7B7B] font-normal">Developer</p>
                <p className="mt-1 text-[16px] font-medium text-[#000000]">
                  {property.developer.name}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-[14px] text-[#7B7B7B] font-normal">Possession Status</p>
                <p className="mt-1 text-[16px] font-medium text-[#000000]">
                  {property.overview.possessionStatus}
                </p>
              </div>

              <div>
                <p className="text-[14px] text-[#7B7B7B] font-normal">Project Area (in acre)</p>
                <p className="mt-1 text-[16px] font-medium text-[#000000]">
                  {property.projectSize}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2">
            <p className="text-[14px] text-[#7B7B7B] font-normal">Description</p>
            <p className="leading-relaxed mt-1 text-[16px] font-medium text-[#000000] line-clamp-2">
              {property.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
