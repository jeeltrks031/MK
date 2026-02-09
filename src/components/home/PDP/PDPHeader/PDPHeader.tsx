"use client";

import upPrice from "@/assets/upPrice.svg";
import Image from "next/image";
import { type PropertyPrice } from "@/lib/api/services/home.service";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState } from "react";
import { homeService } from "@/lib/api/services/home.service";
import AuthModal from "@/components/auth/AuthModal";

interface PDPHeaderProps {
  projectName: string;
  location: string;
  startingPrice: PropertyPrice;
  developerPrice: string;
  bookingDeadlinePrice?: {
    value: number;
    formatted: string;
    note?: string;
  };
  discountPercentage: string;
  isFavorite: boolean;
  propertyId: string;
  onFavoriteChange: (isFavorite: boolean) => void;
}

export default function PDPHeader({
  projectName,
  location,
  startingPrice,
  developerPrice,
  bookingDeadlinePrice,
  discountPercentage,
  propertyId,
  onFavoriteChange,
}: PDPHeaderProps) {
  const { isAuthenticated } = useAuthContext();
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setFavoriteLoading(true);
    try {
      const response = await homeService.toggleFavorite(propertyId);
      if (response.success && response.data) {
        onFavoriteChange(response.data.isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const discountAmount = bookingDeadlinePrice ? bookingDeadlinePrice.value - startingPrice.value : 0;

  const discountFormatted =
    discountAmount >= 10000000
      ? `₹ ${(discountAmount / 10000000).toFixed(2)} Crore`
      : discountAmount >= 100000
        ? `₹ ${(discountAmount / 100000).toFixed(2)} Lakh`
        : `₹ ${(discountAmount / 1000).toFixed(0)} K`;

  const formatPrice = (value: number) => {
    if (value >= 10000000) return `₹ ${(value / 10000000).toFixed(2)} Crore`;
    if (value >= 100000) return `₹ ${(value / 100000).toFixed(2)} Lakh`;
    return `₹ ${(value / 1000).toFixed(0)} K`;
  };

  const developerPriceNumber = typeof developerPrice === "string" ? Number(developerPrice.replace(/[₹,\sA-Za-z]/g, "")) : developerPrice;

  const formatLocationForUI = (fullLocation?: string) => {
    if (!fullLocation) return "";
    const parts = fullLocation
      .split(",")
      .map(p => p.trim())
      .filter(Boolean);

    if (parts.length === 0) return "";

    const withoutCountry = parts.filter(p => p.toLowerCase() !== "india");

    if (withoutCountry.length >= 3) {
      const state = withoutCountry[withoutCountry.length - 1];
      const city = withoutCountry[withoutCountry.length - 2];
      const area = withoutCountry[withoutCountry.length - 3];

      return `${area}, ${city}, ${state}`;
    }

    return withoutCountry.join(", ");
  };

  return (
    <>
      <section className="py-6 lg:py-8">
        <div className="container max-w-6xl mx-auto p-5 md:p-6 lg:p-7 bg-white rounded-[30px] shadow-[0_0_50px_rgba(0,0,0,0.05)] outline outline-1 outline-zinc-100 flex flex-col gap-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-4 lg:gap-6">

            <div className="w-full max-w-[600px] flex flex-col gap-1.5">
              <h1 className="text-[#1C4692] font-bold font-['Figtree'] text-[30px] md:text-[34px] lg:text-[45px] leading-tight">
                {projectName}
              </h1>
              <p className="text-[#000000] font-normal font-['Figtree'] text-[16px] md:text-[18px] lg:text-[22px]">
                {formatLocationForUI(location)}
              </p>
            </div>

            {/* RIGHT */}
            <div className="w-full md:flex-1 bg-[#EEF4FF] rounded-[20px] p-4 md:p-4 lg:p-5 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-4 items-end">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] md:text-[15px] font-medium">
                    Starting Price
                  </span>
                  <span className="text-[24px] md:text-[28px] lg:text-[30px] font-semibold leading-none whitespace-nowrap">
                    {formatPrice(startingPrice.value)}
                  </span>
                </div>
                {/* Developer Price */}
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-[14px] md:text-[15px] font-medium">
                    <span className="block md:hidden mb-1">Developer Price</span>
                    <span className="hidden md:block">Starting Developer price</span>
                  </span>

                  <span className="text-[18px] md:text-[20px] lg:text-[24px] font-semibold line-through text-[#4B4B4B] leading-none whitespace-nowrap">
                    {formatPrice(developerPriceNumber)}
                  </span>
                </div>
              </div>
              <div className="h-px bg-neutral-200" />

              {/* DISCOUNT ROW */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3">
                <div className="inline-flex items-center bg-white rounded-full px-4 h-[36px] min-w-max shadow-sm">
                  <Image src={upPrice} alt="Up Price" width={18} height={18} />
                  <span className="ml-2 text-[13px] lg:text-[14px] text-lime-600 font-medium leading-none whitespace-nowrap">
                    {bookingDeadlinePrice?.note || `Up to ${discountFormatted} off`}
                  </span>
                </div>
                <span className="text-[13px] lg:text-[14px] text-[#FF3232] md:whitespace-nowrap">
                  Get upto {discountPercentage} discount on this property
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            handleFavoriteClick();
          }}
        />
      )}
    </>
  );
}
