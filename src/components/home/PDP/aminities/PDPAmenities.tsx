"use client";

import { useState, useMemo } from "react";

interface PDPAmenitiesProps {
  amenities: string[];
}

export default function PDPAmenities({ amenities }: PDPAmenitiesProps) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 12;

  // Split amenities into pages
  const paginatedAmenities = useMemo(() => {
    const pages: string[][] = [];
    for (let i = 0; i < amenities.length; i += itemsPerPage) {
      pages.push(amenities.slice(i, i + itemsPerPage));
    }
    return pages.length > 0 ? pages : [[]];
  }, [amenities]);

  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-4 px-6">
      <div className="max-w-6xl mx-auto container">
        <div className="rounded-2xl bg-white shadow-sm">
          <div className="rounded-t-[20px] bg-[#EEF4FF] px-6 py-4">
            <h3 className="font-semibold text-[#000000] text-[25px]">Amenities</h3>
          </div>

          <div className="px-6 py-8">
            <div className="grid md:grid-cols-3">
              <div className="flex flex-col px-0 md:px-6 border-b border-[#BEBEBE] md:border-b-0">
                {paginatedAmenities[page]
                  ?.filter((_, idx) => idx % 3 === 0)
                  .map((amenity, idx) => (
                    <p key={idx} className="text-[16px] font-medium text-[#000000] leading-relaxed">
                      {amenity}
                    </p>
                  ))}
              </div>
              <div className="flex flex-col px-0 md:px-6 mt-4 md:mt-0 border-b border-[#BEBEBE] md:border-b-0 md:border-l md:border-[#BEBEBE]">
                {paginatedAmenities[page]
                  ?.filter((_, idx) => idx % 3 === 1)
                  .map((amenity, idx) => (
                    <p key={idx} className="text-[16px] font-medium text-[#000000] leading-relaxed">
                      {amenity}
                    </p>
                  ))}
              </div>
              <div className="flex flex-col px-0 md:px-6 mt-4 md:mt-0 md:border-l md:border-[#BEBEBE]">
                {paginatedAmenities[page]
                  ?.filter((_, idx) => idx % 3 === 2)
                  .map((amenity, idx) => (
                    <p key={idx} className="text-[16px] font-medium text-[#000000] leading-relaxed">
                      {amenity}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {paginatedAmenities.length > 1 && (
            <div className="flex items-center justify-center px-6 pb-6">
              <div className="flex items-center gap-2">
                {paginatedAmenities.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to amenities page ${i + 1}`}
                    onClick={() => setPage(i)}
                    className={
                      "h-2 rounded-full transition " +
                      (i === page
                        ? "bg-[#1C4692] w-8"
                        : "bg-gray-300/60 hover:bg-gray-300 w-2")
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
