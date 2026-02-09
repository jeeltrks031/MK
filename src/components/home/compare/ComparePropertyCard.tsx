"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaPhoneAlt } from "react-icons/fa";
import {
  IoHeartOutline,
  IoHeart,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { useAuthContext } from "@/contexts/AuthContext";
import { homeService } from "@/lib/api/services/home.service";
import AuthModal from "@/components/auth/AuthModal";
import BookVisitModal from "./BookVisitModal";

interface FloorPlan {
  image: string;
  unitType?: string;
  carpetArea?: string;
  price?: number;
  availabilityStatus?: string;
}

interface Property {
  id: string | number;
  title: string;
  developer: string;
  price: string;
  location: string;
  image?: string;
  area: string;
  config: string;
  propertyType: string;
  possessionDate?: string;
  possessionStatus?: string;
  floorPlanImage?: string;
  floorPlans?: FloorPlan[];
  isFavorite?: boolean; // Favorite status from API
}

interface ComparePropertyCardProps {
  property: Property;
  label: string; // A, B, C, etc.
  onRemove: () => void;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

export default function ComparePropertyCard({
  property,
  label,
  onRemove,
  onFavoriteChange,
}: ComparePropertyCardProps) {
  const { isAuthenticated, checkAuth } = useAuthContext();
  const [currentFloorPlanIndex, setCurrentFloorPlanIndex] = useState(0);
  // Initialize isFavorite from property prop (from API), default to false if not provided
  const [isFavorite, setIsFavorite] = useState(property.isFavorite ?? false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookVisitModal, setShowBookVisitModal] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "favorite" | "visit" | null
  >(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Update isFavorite when property.isFavorite changes (e.g., when API data is loaded)
  useEffect(() => {
    if (property.isFavorite !== undefined) {
      setIsFavorite(property.isFavorite);
    }
  }, [property.isFavorite]);

  // Get floor plans array - use floorPlans if available, otherwise fallback to floorPlanImage
  const floorPlans =
    property.floorPlans && property.floorPlans.length > 0
      ? property.floorPlans
      : property.floorPlanImage
        ? [{ image: property.floorPlanImage }]
        : [];

  const hasMultiplePlans = floorPlans.length > 1;

  // Scroll to specific floor plan
  const scrollToPlan = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const planWidth = container.offsetWidth;
      container.scrollTo({
        left: planWidth * index,
        behavior: "smooth",
      });
      setCurrentFloorPlanIndex(index);
    }
  };

  // Handle scroll to update current index
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const planWidth = container.offsetWidth;
      const newIndex = Math.round(container.scrollLeft / planWidth);
      setCurrentFloorPlanIndex(newIndex);
    }
  };

  // Navigate to previous plan
  const goToPrevious = () => {
    if (currentFloorPlanIndex > 0) {
      scrollToPlan(currentFloorPlanIndex - 1);
    }
  };

  // Navigate to next plan
  const goToNext = () => {
    if (currentFloorPlanIndex < floorPlans.length - 1) {
      scrollToPlan(currentFloorPlanIndex + 1);
    }
  };

  // Handle favorite click
  const handleFavoriteClick = async () => {
    if (!checkAuth()) {
      setPendingAction("favorite");
      setShowAuthModal(true);
      return;
    }

    setFavoriteLoading(true);
    try {
      const response = await homeService.toggleFavorite(String(property.id));
      if (response.success && response.data) {
        setIsFavorite(response.data.isFavorite);
        onFavoriteChange?.(response.data.isFavorite);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Handle book visit click
  const handleBookVisitClick = () => {
    if (!checkAuth()) {
      setPendingAction("visit");
      setShowAuthModal(true);
      return;
    }
    setShowBookVisitModal(true);
  };

  // Handle auth success - continue with pending action
  const handleAuthSuccess = () => {
    if (pendingAction === "favorite") {
      handleFavoriteClick();
    } else if (pendingAction === "visit") {
      setShowBookVisitModal(true);
    }
    setPendingAction(null);
  };

  function getAreaName(fullLocation?: string) {
    if (!fullLocation || typeof fullLocation !== "string") return "";
    const parts = fullLocation
      .split(",")
      .map(p => p.trim())
      .filter(Boolean);

    if (parts.length === 0) return "";
    const roadKeywords = ["road","rd","street","st","lane","ln","highway","hwy"];
    if (parts[parts.length - 1].toLowerCase() === "india") {
      parts.pop();
    }

    for (let part of parts) {
      const lower = part.toLowerCase();
      const isRoad = roadKeywords.some(k => lower.includes(k));
      const isNumber = /^\d+/.test(part);
      if (!isRoad && !isNumber) {
        return part; 
      }
    }
    return parts[0];
  }

  return (
    <div className="relative flex flex-col rounded-lg bg-white p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:rounded-xl sm:shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:p-3 md:rounded-2xl md:shadow-[0_8px_24px_rgba(0,0,0,0.08)] md:p-4">
      {/* Remove Component Button */}
      <button
        onClick={onRemove}
        className="mb-1.5 self-start rounded-full w-full bg-[#FFF0F0] px-2.5 py-1 text-[10px] font-semibold text-[#FB4848] sm:mb-2 sm:px-3 sm:py-1 sm:text-[16px] md:mb-3 md:px-4 md:py-2"
      >
        Remove Component
      </button>

      {/* Property Image with Label */}
      <div className="relative mb-2.5 h-40 w-full overflow-hidden rounded-lg bg-gray-100 sm:mb-3 sm:h-48 md:mb-4 md:h-56 lg:h-64 sm:rounded-xl">
        {property.image ? (
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="h-24 w-24 text-gray-300"
              fill="currentColor"
            >
              <path d="M21 19l-5.5-7-3.5 4.5-2.5-3L3 19z" />
            </svg>
          </div>
        )}
        {/* Label (A, B, C) */}
        <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-[6px] bg-white/95 text-[11px] font-bold text-gray-800 shadow-md sm:left-3 sm:top-3 sm:h-7 sm:w-7 sm:text-xs md:h-8 md:w-8 md:text-sm">
          {label}
        </div>
      </div>

      {/* Property Name with Call and Heart */}
      <div className="mb-2 flex items-center justify-between gap-2 sm:mb-2.5 md:mb-3 lg:mb-4">
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 sm:text-base md:text-lg">
          {property.title}
        </h3>
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 md:gap-2">
          <button className="flex items-center gap-0.5 rounded-full bg-[#66AE39] px-2 py-0.5 text-[10px] font-medium text-white hover:bg-[#5a9a32] transition-colors sm:gap-1 sm:px-2.5 sm:py-1 sm:text-xs md:gap-1.5 md:px-3 md:py-1.5">
            <FaPhoneAlt className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3 md:w-3" />
            <span className="hidden sm:inline">Call</span>
          </button>
          <button
            onClick={handleFavoriteClick}
            disabled={favoriteLoading}
            className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors sm:h-7 sm:w-7 md:h-8 md:w-8 ${isFavorite
              ? "border-[#1C4692] bg-[#1C4692] text-white hover:bg-[#1c4692e6]"
              : "border-gray-300 bg-[#EEF4FF] text-gray-600 hover:bg-gray-50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <IoHeart className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4" />
            ) : (
              <IoHeartOutline className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Book A Visit Button */}
      <button
        onClick={handleBookVisitClick}
        className="mb-2.5 w-full rounded-full bg-[#1C4692] px-3 py-1.5 text-base font-semibold text-white  transition-colors sm:mb-3 sm:px-4 sm:py-2 md:mb-4 md:py-2.5 lg:mb-6 lg:py-3"
      >
        Book A Visit
      </button>

      {/* Property Details - Key Value Pairs */}
      <div className="mb-2.5 space-y-2 sm:mb-3 sm:space-y-2.5 md:mb-4 md:space-y-3 lg:mb-6 lg:space-y-4">
        <div className="flex flex-col gap-1 pb-2 border-b border-gray-200">
          <span className="text-xs text-gray-600 sm:text-xs md:text-sm">
            Project Name
          </span>

          <span className="text-xs font-semibold text-gray-800 break-words sm:text-xs md:text-sm">
            {property.title}
          </span>
        </div>

        <div className="flex flex-col gap-1 pb-2 border-b border-gray-200">
          <span className="text-xs text-gray-600 sm:text-xs md:text-sm">
            Developer
          </span>
          <span className="text-xs font-semibold text-gray-800 break-words sm:text-xs md:text-sm">
            {property.developer}
          </span>
        </div>
        <div className="flex flex-col gap-1 pb-2 border-b border-gray-200">
          <span className="text-xs text-gray-600 sm:text-xs md:text-sm">
            Budget
          </span>
          <span className="text-xs font-semibold text-gray-800 break-words sm:text-xs md:text-sm">
            {property.price}
          </span>
        </div>
        <div className="flex flex-col gap-1 pb-2 border-b border-gray-200">
          <span className="text-xs text-gray-600 sm:text-xs md:text-sm">
            Area/Size
          </span>
          <span className="text-xs font-semibold text-gray-800 break-words sm:text-xs md:text-sm">
            {property.area}
          </span>
        </div>
        <div className="flex flex-col gap-1 pb-2 border-b border-gray-200">
          <span className="text-xs text-gray-600 sm:text-xs md:text-sm">
            Property Config
          </span>
          <span className="text-xs font-semibold text-gray-800 break-words sm:text-xs md:text-sm">
            {property.config}
          </span>
        </div>
        <div className="flex flex-col gap-1 pb-2 border-b border-gray-200">
          <span className="text-xs text-gray-600 sm:text-xs md:text-sm">
            Location
          </span>
          <span className="text-xs font-semibold text-gray-800 break-words sm:text-xs md:text-sm">
            {getAreaName(property.location)}
          </span>
        </div>
        <div className="flex flex-col gap-1 pb-2 border-b border-gray-200">
          <span className="text-xs text-gray-600 sm:text-xs md:text-sm">
            Property Type
          </span>
          <span className="text-xs font-semibold text-gray-800 break-words sm:text-xs md:text-sm">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Floor Plan Section */}
      <div className="mb-2.5 sm:mb-3 md:mb-4 lg:mb-6">
        <h4 className="mb-1.5 text-xs font-semibold text-gray-800 sm:mb-2 sm:text-sm md:mb-3 md:text-base">
          Floor Plan
        </h4>
        <div className="relative">
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="relative h-32 w-full overflow-x-auto overflow-y-hidden rounded-lg bg-gray-100 sm:h-36 md:h-40 lg:h-44 scrollbar-hide"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div
              className="flex h-full"
              style={{ width: `${floorPlans.length * 100}%` }}
            >
              {floorPlans.length > 0 ? (
                floorPlans.map((plan, index) => (
                  <div
                    key={index}
                    className="relative h-full flex-shrink-0"
                    style={{
                      scrollSnapAlign: "start",
                      width: `${100 / floorPlans.length}%`,
                    }}
                  >
                    <Image
                      src={plan.image}
                      alt={`Floor Plan ${index + 1}${plan.unitType ? ` - ${plan.unitType}` : ""}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="flex h-full w-full items-center justify-center flex-shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-16 w-16 text-gray-300"
                    fill="currentColor"
                  >
                    <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          {/* Navigation Arrows - Only show if multiple plans */}
          {hasMultiplePlans && (
            <>
              {currentFloorPlanIndex > 0 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-1 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md hover:bg-white transition-colors z-10 sm:h-10 sm:w-10"
                  aria-label="Previous floor plan"
                >
                  <IoChevronBack className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              )}
              {currentFloorPlanIndex < floorPlans.length - 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md hover:bg-white transition-colors z-10 sm:h-10 sm:w-10"
                  aria-label="Next floor plan"
                >
                  <IoChevronForward className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              )}
            </>
          )}
          {/* Carousel Dots - Dynamic based on number of plans */}
          {floorPlans.length > 1 && (
            <div className="mt-1.5 flex items-center justify-center gap-1.5 sm:mt-2 sm:gap-2 md:mt-3">
              {floorPlans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToPlan(index)}
                  className={`transition-all ${index === currentFloorPlanIndex
                    ? "h-1.5 w-6 rounded-full bg-gray-600 sm:h-2 sm:w-8"
                    : "h-1 w-1 rounded-full bg-gray-300 hover:bg-gray-400 sm:h-1.5 sm:w-1.5"
                    }`}
                  aria-label={`Go to floor plan ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dotted Separator */}
      <div className="mb-2.5 border-b border-gray-200 sm:mb-3 md:mb-4 lg:mb-6"></div>

      {/* Possession Status */}
      <div>
        <h4 className="mb-1.5 text-xs text-[#8F8F8F] sm:mb-2 sm:text-sm md:mb-3 md:text-base">
          Possession Status
        </h4>
        <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
          <p className="text-xs font-semibold text-[#000] sm:text-[18px]">
            {property.possessionDate || "Jan 2027"}
          </p>
          <p className="text-xs font-semibold text-[#000] sm:text-[18px]">
            {property.possessionStatus || "Under Construction"}
          </p>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      {/* Book Visit Modal */}
      <BookVisitModal
        isOpen={showBookVisitModal}
        onClose={() => setShowBookVisitModal(false)}
        propertyId={String(property.id)}
        propertyName={property.title}
        propertyLocation={property.location}
        propertyDeveloper={property.developer}
      />
    </div>
  );
}
