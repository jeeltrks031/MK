"use client";

import { useCompare } from "@/contexts/CompareContext";
import Link from "next/link";
import Image from "next/image";
import closeCompare from '@/assets/closeCompare.svg';

export default function CompareOverlay() {
  const { compareItems, removeFromCompare, clearCompare, compareCount } =
    useCompare();

  return (
    <div className="w-[290px] md:w-[340px] rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] md:w-[320px] md:max-w-[85vw] lg:w-[340px] lg:max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#B3B3B3] px-5 py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[18px] font-semibold text-gray-800">Compare</h3>
          <span className="flex h-5 w-7 items-center justify-center rounded-[50px] bg-[#1C4692] text-xs font-semibold text-white">
            {compareCount}
          </span>
        </div>
        <button
          onClick={clearCompare}
          className="text-[14px] font-medium text-[#2388FF]"
        >
          Clear
        </button>
      </div>

      {/* Property List */}
      <div className="max-h-[400px] overflow-y-auto px-3 py-4">
        {compareItems.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            No properties to compare
          </p>
        ) : (
          <div className="space-y-3">
            {compareItems.map((property) => (
              <div
                key={property.id}
                className="flex items-start gap-3 rounded-lg bg-[#F8FBFF] p-3">
                {/* ✅ PROPERTY IMAGE */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-200">
                  {property.image ? (
                    <Image
                      src={property.image || ""}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-300" />
                  )}
                </div>

                {/* ✅ PROPERTY INFO */}
                <div className="flex-1 min-w-0 mt-2">
                  <h4 className="text-sm font-semibold text-gray-800 truncate">
                    {property.title}
                  </h4>
                  <p className="mt-1 text-xs font-medium text-gray-600">
                    {property.price}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCompare(property.id)}
                  className="ml-1 mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FB4848] text-red-500 transition-colors"
                  aria-label="Remove from compare">
                  <Image
                      src={closeCompare}
                      alt="Remove"
                      width={14}
                      height={14}
                      className="object-cover"
                    />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compare Button */}
      {compareItems.length > 0 && (
        <div className="px-3 py-4">
          <Link
            href="/compare"
            className="block w-full rounded-full bg-[#1C4692] px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#1c4692e6] transition-colors"
          >
            Compare
          </Link>
        </div>
      )}
    </div>
  );
}
