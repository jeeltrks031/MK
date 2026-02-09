"use client";

import Image from "next/image";
import { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { IoHeart, IoHeartOutline, IoShareSocialOutline } from "react-icons/io5";
import { Property } from "@/lib/api/services/home.service";
import Link from "next/link";
import upPrice from "@/assets/upPrice.svg";

interface SearchPropertyCardProps {
  property: Property;
  images: string[];
  isFavorite: boolean;
  isFavoriteLoading?: boolean;
  isJoinGroup: boolean;
  isJoinGroupLoading?: boolean;
  onFavoriteClick: (property: Property) => void;
  onCompareClick: (property: Property) => void;
  onShareClick: (property: Property) => void;
  onJoinGroupClick: (property: Property) => void;
}

export default function SearchPropertyCard({
  property,
  images,
  isFavorite,
  isFavoriteLoading,
  isJoinGroup,
  isJoinGroupLoading,
  onFavoriteClick,
  onCompareClick,
  onShareClick,
  onJoinGroupClick,
}: SearchPropertyCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentImage = images[currentIndex] || null;
  const hasMultipleImages = images.length > 1;
  const [isHovered, setIsHovered] = useState(false);

  const formatTwoDigits = (value: number) => {
    return value.toString().padStart(2, "0");
  };

  const formatPercentage = (value: string) => {
    return value.replace(/\.00%$/, "%");
  };

  const hasValidDiscount = (value?: string) => {
    if (!value) return false;
    const num = Number(value.replace("%", ""));
    return num > 0;
  };

  const formatLocationForCard = (fullLocation?: string) => {
    if (!fullLocation) return "";

    const parts = fullLocation
      .split(",")
      .map(p => p.trim())
      .filter(Boolean);

    // remove country
    const filtered = parts.filter(p => p.toLowerCase() !== "india");

    if (filtered.length >= 2) {
      const city = filtered[filtered.length - 2];
      const area = filtered[filtered.length - 3] || filtered[0];

      return `${area} | ${city}`;
    }

    return filtered.join(", ");
  };

  return (
    <div
      className="relative flex flex-col rounded-3xl bg-white shadow-lg overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/property-details/${property.id}`}
        className="absolute inset-0 z-10"
      />

      {/* Image Section */}
      <div className="relative h-52 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {currentImage ? (
          <Image
            key={`${property.id}-${currentIndex}`}
            src={currentImage}
            alt={`${property.projectName} - Image ${currentIndex + 1}`}
            className="object-cover transition-opacity duration-300"
            fill
          />
        ) : (
          <div className="text-gray-400 text-sm">No Image</div>
        )}

        {/* LAST DAY TO JOIN */}
        {property.lastDayToJoin && (
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur px-3 py-1 rounded-md text-xs shadow z-20">
            {property.lastDayToJoin}
          </div>
        )}

        {/* RIGHT SIDE ICONS */}
        <div
          className={`absolute top-3 right-3 flex flex-col gap-2 z-20 transition-all duration-300 ${isHovered
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2 pointer-events-none"
            }`}
        >
          <div
            className={`absolute top-3 right-3 flex flex-col gap-2 z-20 transition-all duration-300 ${isHovered
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2 pointer-events-none"
              }`}
          >
            {/* Heart Icon (Favorite) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteClick(property);
              }}
              disabled={isFavoriteLoading}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all border-white bg-white/90`}
            >
              {isFavorite ? (
                <IoHeart className="h-5 w-5 text-red-500" />
              ) : (
                <IoHeartOutline className="h-5 w-5 text-gray-700" />
              )}
            </button>

            {/* Compare Icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompareClick(property);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-white/90"
            >
              <Image src="/images/convert.svg" alt="Compare" width={20} height={20} />
            </button>

            {/* Share Icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShareClick(property);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-white/90"
            >
              <IoShareSocialOutline className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Image Navigation Dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all ${index === currentIndex
                  ? "h-1.5 w-6 rounded-full bg-[#1C4692]"
                  : "h-1.5 w-1.5 rounded-full bg-white hover:bg-white/80"
                  }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title + Location + Call button */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-[20px] font-semibold text-black truncate">
              {property.projectName}
            </h3>
            <p className="text-[15px] text-[#828282] truncate">
              {formatLocationForCard(property.location)}
            </p>
          </div>
          <button className="relative z-20 bg-[#66AE39] text-white px-3 py-2 rounded-full flex items-center gap-1 text-xs shrink-0 ml-2 hover:bg-[#5a9a32] transition-colors">
            <FaPhoneAlt /> Call
          </button>
        </div>

        {/* Group Size + Opening */}
        <div className="flex justify-between mt-2 mb-2 gap-2">
          <div className="flex flex-col items-center bg-[#EEF4FF] px-4 py-2 rounded-lg text-center flex-1">
            <span className="text-[16px] text-[#000000] font-semibold">
              Group Size
            </span>
            <span className="text-[20px] font-bold text-[#1C4692]">
              {formatTwoDigits(property.groupSize)}{" "}
              <span className="text-[14px] text-[#525252] font-normal">
                Members
              </span>
            </span>
          </div>
          <div className="flex flex-col items-center bg-[#EEF4FF] px-4 py-2 rounded-lg text-center flex-1">
            <span className="text-[16px] text-[#000000] font-semibold">
              Opening
            </span>
            <span className="text-[20px] font-bold text-[#1C4692]">
              {formatTwoDigits(property.openingLeft)}{" "}
              <span className="text-[14px] text-[#525252] font-normal">
                Left
              </span>
            </span>
          </div>
        </div>

        {/* Target Price + Developer Price */}
        <div className="flex justify-between items-start mt-3 bg-[#EEF4FF] px-3 py-2 rounded-[15px]">
          <div>
            <span className="text-[14px] text-[#000000] font-normal">Target Price</span>
            <div className="text-[19px] font-bold text-[#000000]">
              {property.targetPrice?.formatted}
            </div>
            {property.discount && (
              <span className="mt-2 inline-flex items-center w-[252px] h-[26px] gap-1.5 bg-white border border-[#F6F6F6] rounded-xl px-2 py-0.5 text-xs font-semibold text-[#66AE39]">
                <Image
                  src={upPrice}
                  alt="Offer"
                  width={14}
                  height={14}
                  className="object-contain"
                />
                {property.discount.displayText}
              </span>
            )}
          </div>

          <div className="text-right">
            <span className="text-[14px] text-[#000000] font-normal">Developer price</span>
            <div className="text-[16px] font-semibold text-[#4B4B4B] line-through">
              {property.developerPrice.formatted}
            </div>
            <div className="mt-3 h-[26px]">
              {hasValidDiscount(property.discountPercentage) && (
                <span className="inline-block rounded-full w-[94px] h-[26px] bg-white border border-[#F6F6F6] px-2 py-1 text-xs font-semibold text-[#FF3232]">
                  {formatPercentage(property.discountPercentage)} Off*
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Join Group Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onJoinGroupClick(property);
          }}
          disabled={isJoinGroup || isJoinGroupLoading}
          className={`mt-4 w-full py-3 rounded-3xl font-semibold
          ${isJoinGroup
              ? "bg-white border-2 border-[#1C4692] text-[#1C4692]"
              : "bg-[#1C4692] text-white"}
          `}
        >
          {isJoinGroup
            ? "Joined"
            : isJoinGroupLoading
              ? "Joining..."
              : "Join Group"}
        </button>
      </div>
    </div>
  );
}
