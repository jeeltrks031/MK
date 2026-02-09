"use client";
import Image from "next/image";
import Link from "next/link";
import { FaPhoneAlt } from "react-icons/fa";
import { IoHeartOutline, IoHeart, IoShareSocialOutline } from "react-icons/io5";
import upPrice from "@/assets/upPrice.svg";
import { type Property } from "@/lib/api/services/home.service";
import { useState } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaLink,
} from "react-icons/fa";


interface PropertyCardProps {
  property: Property;
  images: string[];
  currentIndex: number;
  currentImage: string | null;
  hasMultipleImages: boolean;
  isHovered: boolean;
  isFavorite: boolean;
  isLoading: boolean;
  isJoinGroup: boolean;
  isJoinGroupLoading?: boolean;
  onGoToNextImage: (totalImages: number) => void;
  onGoToPreviousImage: (totalImages: number) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFavoriteClick: (property: Property) => void;
  onCompareClick: (property: Property) => void;
  onShareClick: (property: Property) => void;
  onJoinGroupClick: (property: Property) => void;
  onGoToImage: (index: number, totalImages: number) => void;
  formatDate: (dateString: string) => string;
}

export default function PropertyCard({
  property,
  images,
  currentIndex,
  currentImage,
  hasMultipleImages,
  isHovered,
  isFavorite,
  isLoading,
  isJoinGroup,
  isJoinGroupLoading = false,
  onMouseEnter,
  onMouseLeave,
  onFavoriteClick,
  onCompareClick,
  onShareClick,
  onJoinGroupClick,
  onGoToImage,
  formatDate,
}: PropertyCardProps) {
  const formatTwoDigits = (value: number) => value.toString().padStart(2, "0");
  const formatPercentage = (value: string) => value.replace(/\.00%$/, "%");

  const [hoveredAction, setHoveredAction] = useState<
    "shortlist" | "compare" | "share" | null
  >(null);
  const [shareOpen, setShareOpen] = useState(false);



  const formatLocationForUI = (fullLocation?: string) => {
    if (!fullLocation) return "";
    const parts = fullLocation.split(",").map(p => p.trim()).filter(Boolean);
    if (parts.length < 2) return parts[0] || "";
    const ignore = ["india", "telangana", "maharashtra", "gujarat", "karnataka"];
    const filtered = parts.filter(p => !ignore.includes(p.toLowerCase()));
    if (filtered.length < 2) return filtered[0];
    const city = filtered[filtered.length - 1];
    const area = filtered[filtered.length - 2];
    return `${area} | ${city}`;
  };

  return (
    <div
      className="relative flex flex-col bg-white rounded-3xl p-4 border border-[#F3F3F3] overflow-hidden group cursor-pointer shadow-[0px_0px_50px_0px_#0000000D]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Click Overlay */}
      <Link
        href={`/property-details/${property.id}`}
        className="absolute inset-0 z-10"
      />

      {/* IMAGE */}
      <div className="relative h-52 w-full rounded-3xl overflow-hidden bg-gray-100">
        {currentImage ? (
          <Image
            key={`${property.id}-${currentIndex}`}
            src={currentImage}
            alt={property.projectName}
            fill
            className="object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No Image
          </div>
        )}

        {/* Last Day Badge */}
        {property.lastDayToJoin && (
          <div className="absolute top-3 left-3 z-20 bg-white/80 backdrop-blur px-3 py-1.5 rounded-md text-xs shadow">
            Last Day to join: {formatDate(property.lastDayToJoin)}
          </div>
        )}

        {/* Hover Icons */}
        <div
          className={`absolute top-3 right-3 z-20 flex flex-col gap-2 transition-all duration-300 ${isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
        >
          {/* Shortlist */}
          <div
            className="relative flex items-center justify-end"
            onMouseEnter={() => setHoveredAction("shortlist")}
            onMouseLeave={() => setHoveredAction(null)}
          >
            {hoveredAction === "shortlist" && (
              <span className="absolute right-11 rounded-full bg-[#1C4692] px-3 py-1 text-xs font-semibold text-white whitespace-nowrap">
                {isFavorite ? "Shortlisted" : "Shortlist"}
              </span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteClick(property);
              }}
              disabled={isLoading}
              className="h-9 w-9 rounded-full bg-white border-2 border-white shadow flex items-center justify-center"
            >
              {isFavorite ? (
                <IoHeart size={18} className="text-red-500" />
              ) : (
                <IoHeartOutline size={18} className="text-gray-700" />
              )}
            </button>
          </div>

          {/* Compare */}
          <div
            className="relative flex items-center justify-end"
            onMouseEnter={() => setHoveredAction("compare")}
            onMouseLeave={() => setHoveredAction(null)}
          >
            {hoveredAction === "compare" && (
              <span className="absolute right-11 rounded-full bg-[#1C4692] px-3 py-1 text-xs font-semibold text-white whitespace-nowrap">
                Compare
              </span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompareClick(property);
              }}
              className="h-9 w-9 rounded-full bg-white border-2 border-white shadow flex items-center justify-center"
            >
              <Image src="/images/convert.svg" alt="Compare" width={18} height={18} />
            </button>
          </div>

          {/* Share */}
          <div
            className="relative flex items-center justify-end"
            onMouseEnter={() => setHoveredAction("share")}
            onMouseLeave={() => setHoveredAction(null)}
          >
            {/* Tooltip on share button hover */}
            {hoveredAction === "share" && !shareOpen && (
              <span className="absolute right-11 rounded-full bg-[#1C4692] px-3 py-1 text-xs font-semibold text-white whitespace-nowrap">
                Share
              </span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShareOpen((v) => !v);
              }}
              className="h-9 w-9 rounded-full bg-white border-2 border-white shadow flex items-center justify-center"
            >
              <IoShareSocialOutline size={18} />
            </button>

            {/* Share Menu – ICONS ONLY */}
            {shareOpen && (
              <>
                {/* click outside */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShareOpen(false)}
                />

                <div className="absolute right-11 top-1/2 -translate-y-1/2 z-40 flex gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl">
                  <button
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/property-details/${property.id}`,
                        "_blank"
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white"
                  >
                    <FaFacebookF size={14} />
                  </button>

                  <button
                    onClick={() =>
                      window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}/property-details/${property.id}`,
                        "_blank"
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A66C2] text-white"
                  >
                    <FaLinkedinIn size={14} />
                  </button>

                  <button
                    onClick={() =>
                      window.open(
                        `https://wa.me/?text=${window.location.origin}/property-details/${property.id}`,
                        "_blank"
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white"
                  >
                    <FaWhatsapp size={16} />
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/property-details/${property.id}`
                      );
                      setShareOpen(false);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6B7280] text-white"
                  >
                    <FaLink size={14} />
                  </button>
                </div>
              </>
            )}
          </div>


        </div>



        {/* Dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => onGoToImage(index, images.length)}
                className={`transition-all ${index === currentIndex
                  ? "h-1.5 w-6 bg-[#1C4692] rounded-full"
                  : "h-1.5 w-1.5 bg-white rounded-full"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="pt-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-[20px] font-semibold text-black truncate">
              {property.projectName}
            </h3>
            <p className="text-[15px] text-[#828282] truncate">
              {formatLocationForUI(property.location)}
            </p>
          </div>

          <button onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = `tel:${property.relationshipManager || "1234567890"}`;
          }}
            className="relative z-20 bg-[#66AE39] text-white px-3 py-2 rounded-full flex items-center gap-1 text-xs shrink-0 ml-2 hover:bg-[#5a9a32] transition-colors">
            <FaPhoneAlt /> <span className="hidden md:inline">Call</span>
          </button>
        </div>

        {/* Group / Opening */}
        <div className="flex gap-2 mb-2">
          <div className="flex-1 bg-[#EEF4FF] rounded-xl p-3 text-center">
            <div className="text-sm font-medium">Group Size</div>
            <div className="text-lg font-bold text-[#1C4692]">
              {formatTwoDigits(property.groupSize)}{" "}
              <span className="text-sm font-normal text-gray-600">Members</span>
            </div>
          </div>

          <div className="flex-1 bg-[#EEF4FF] rounded-xl p-3 text-center">
            <div className="text-sm font-medium">Opening</div>
            <div className="text-lg font-bold text-[#1C4692]">
              {formatTwoDigits(property.openingLeft)}{" "}
              <span className="text-sm font-normal text-gray-600">Left</span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 bg-[#EEF4FF] rounded-xl p-3 mt-3">
          <div>
            <div className="text-sm">Target Price</div>
            <div className="text-lg font-bold">
              {property.targetPrice.formatted}
            </div>

            {property.discount && (
              <span className="mt-2 inline-flex w-[200px] flex-shrink-0 gap-1 bg-white px-2 py-1 rounded-full text-xs font-semibold text-[#66AE39] border truncate">
                <Image src={upPrice} alt="Up" width={14} height={14} />
                {property.discount.displayText}
              </span>
            )}
          </div>

          {/* <div className="text-right"> */}
          <div className="text-right flex-shrink-0">
            <div className="text-sm">Developer price</div>
            <div className="text-sm line-through text-gray-500">
              {property.developerPrice.formatted}
            </div>
            <span className="inline-block mt-4 bg-white border px-2 py-1 rounded-full text-xs font-semibold text-red-500">
              {formatPercentage(property.discountPercentage)} Off*
            </span>
          </div>
        </div>

        {/* Join Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isJoinGroup) onJoinGroupClick(property);
          }}
          disabled={isJoinGroup || isJoinGroupLoading}
          className={`relative z-20 mt-4 w-full py-3 rounded-3xl font-semibold transition ${isJoinGroup
            ? "bg-white border-2 border-[#1C4692] text-[#1C4692]"
            : "bg-[#1C4692] text-white hover:bg-[#173b7a]"
            }`}
        >
          {isJoinGroupLoading ? "Joining..." : isJoinGroup ? "Joined" : "Join Group"}
        </button>
      </div>
    </div>
  );
}
