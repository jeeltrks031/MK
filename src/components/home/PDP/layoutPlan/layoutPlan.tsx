"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { type ConfigurationDetail } from "@/lib/api/services/home.service";

interface PDPLayoutPlanProps {
  configurations: ConfigurationDetail[];
}

export default function PDPLayoutPlan({ configurations }: PDPLayoutPlanProps) {
  const [selectedBhk, setSelectedBhk] = useState("");
  const [selectedCarpet, setSelectedCarpet] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const availableBHKs = useMemo(() => {
    return configurations.map((c) => c.unitType);
  }, [configurations]);

  useEffect(() => {
    if (availableBHKs.length && !selectedBhk) {
      setSelectedBhk(availableBHKs[0]);
    }
  }, [availableBHKs, selectedBhk]);

  const selectedConfig = useMemo(() => {
    return configurations.find((c) => c.unitType === selectedBhk);
  }, [configurations, selectedBhk]);

  const carpetConfigs = useMemo(() => {
    return selectedConfig?.subConfigurations || [];
  }, [selectedConfig]);

  useEffect(() => {
    if (carpetConfigs.length) {
      setSelectedCarpet(carpetConfigs[0].carpetArea);
    }
  }, [carpetConfigs]);

  const currentPlan = useMemo(() => {
    return (
      carpetConfigs.find(
        (c) => c.carpetArea === selectedCarpet
      ) || carpetConfigs[0]
    );
  }, [carpetConfigs, selectedCarpet]);

  if (!configurations.length) return null;

  return (
    <section className="w-full px-6 py-8">
      <div className="container max-w-6xl mx-auto rounded-2xl bg-white shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-2xl bg-[#EEF4FF] px-6 py-4">
          <h3 className="text-[25px] font-semibold text-black">
            Layout Plan
          </h3>

          <div className="flex flex-wrap gap-2">
            {availableBHKs.map((bhk) => (
              <button
                key={bhk}
                onClick={() => setSelectedBhk(bhk)}
                className={`rounded-full px-4 py-1.5 text-[18px] font-medium transition
                  ${selectedBhk === bhk
                    ? "bg-[#1C4692] text-white shadow"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {bhk}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="mb-5 flex flex-wrap gap-3">
            {carpetConfigs.map((c) => (
              <button
                key={c.carpetArea}
                onClick={() => setSelectedCarpet(c.carpetArea)}
                className={`rounded-full border px-4 py-1.5 text-[16px] font-medium transition
                  ${selectedCarpet === c.carpetArea
                    ? "bg-[#1C4692] text-white border-[#1C4692]"
                    : "bg-white text-[#000000] border-[#F3F3F3]"
                  }`}
              >
                {c.carpetArea} sq.ft
              </button>
            ))}
          </div>

          <div className="relative mx-auto h-[450px] w-full max-w-[1486px] overflow-hidden rounded-[25px] border border-orange-400 bg-white shadow-lg">
            {currentPlan?.layoutPlanImages?.[0] ? (
              <Image
                src={currentPlan.layoutPlanImages[0]}
                alt="Layout Plan"
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1160px"
                quality={100}
                className="object-cover cursor-zoom-in"
                onClick={() => {
                  setCurrentImageIndex(0);
                  setIsModalOpen(true);
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-100 text-gray-500">
                No layout image
              </div>
            )}

            {/* PRICE + STATUS OVERLAY */}
            {currentPlan && (
              <div
                className="absolute left-4 bottom-4 rounded-lg px-4 py-2.5 text-white shadow-xl backdrop-blur-[24px]"
                style={{ backgroundColor: "#5959594D" }}>
                <div className="text-sm font-semibold">
                  ₹ {currentPlan.price.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && currentPlan && (
        <div className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center">
          <div className="relative w-[90%] max-w-5xl bg-white rounded-3xl p-4 shadow-xl">

            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-[#1C4692] text-white flex items-center justify-center text-xl shadow hover:bg-[#163b7a]"
            >
              ✕
            </button>

            {/* Image */}
            <div className="relative h-[70vh] rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={currentPlan.layoutPlanImages[currentImageIndex]}
                alt="Layout Plan"
                fill
                className="object-contain"
                quality={100}
              />

              {/* Left */}
              {currentPlan.layoutPlanImages.length > 1 && (
                <button
                  onClick={() =>
                    setCurrentImageIndex((p) =>
                      p === 0 ? currentPlan.layoutPlanImages.length - 1 : p - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow flex items-center justify-center"
                >
                  ‹
                </button>
              )}

              {/* Right */}
              {currentPlan.layoutPlanImages.length > 1 && (
                <button
                  onClick={() =>
                    setCurrentImageIndex((p) =>
                      (p + 1) % currentPlan.layoutPlanImages.length
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow flex items-center justify-center"
                >
                  ›
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
