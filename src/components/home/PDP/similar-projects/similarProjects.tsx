"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { type SimilarProject } from "@/lib/api/services/home.service";
import PropertyCard from "@/components/cards/PropertyCard";
import { type Property } from "@/lib/api/services/home.service";
import { useCompare } from "@/contexts/CompareContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { homeService } from "@/lib/api/services/home.service";
import AuthModal from "@/components/auth/AuthModal";
import getPropertyImages from "@/utils/getPropertyImages";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PDPSimilarProjectsProps {
  similarProjects: SimilarProject[];
}

export default function PDPSimilarProjects({ similarProjects }: PDPSimilarProjectsProps) {
  const { clearAndAddToCompare } = useCompare();
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuthContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>({});
  const [favoriteLoading, setFavoriteLoading] = useState<Record<string, boolean>>({});
  const [joinGroupStates, setJoinGroupStates] = useState<Record<string, boolean>>({});
  const [joinGroupLoading, setJoinGroupLoading] = useState<Record<string, boolean>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);

  // Convert SimilarProject to Property format
  const convertedProperties = useMemo(() => {
    return similarProjects.map((sp): Property => ({
      id: sp.id,
      projectId: sp.projectId,
      projectName: sp.projectName,
      location: sp.location,
      latitude: sp.latitude,
      longitude: sp.longitude,
      image: sp.imageUrl || (sp.images && sp.images.length > 0 ? sp.images[0] : null),
      images: sp.images || [],
      lastDayToJoin: sp.lastDayToJoin ?? "",
      groupSize: sp.groupSize,
      groupSizeFormatted: `${sp.groupSize} Members`,
      openingLeft: 0,
      openingFormatted: sp.status,
      targetPrice: sp.targetPrice,
      developerPrice: sp.disclaimerPrice,
      discount: sp.discount ?? null,
      offerPrice: null,
      discountPercentage: sp.discountPercentage,
      configurations: [sp.configuration],
      configurationsFormatted: sp.configuration,
      possessionStatus: "",
      developer: "",
      leadCount: 0,
      reraId: "",
      description: "",
      relationshipManager: "",
      isFavorite: favoriteStates[sp.id] || false,
      isJoinGroup: joinGroupStates[sp.id] || false,
    }));
  }, [similarProjects, favoriteStates, joinGroupStates]);

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateString;
    }
  }, []);

  const handleFavoriteClick = useCallback(
    async (property: Property) => {
      if (!checkAuth()) {
        setShowAuthModal(true);
        return;
      }

      const currentFav = favoriteStates[property.id] ?? false;

      // optimistic UI
      setFavoriteStates((prev) => ({
        ...prev,
        [property.id]: !currentFav,
      }));

      setFavoriteLoading((prev) => ({
        ...prev,
        [property.id]: true,
      }));

      try {
        const { success, data } = await homeService.toggleFavorite(property.id);

        if (success && data && typeof data.isFavorite === "boolean") {
          setFavoriteStates((prev) => ({
            ...prev,
            [property.id]: data.isFavorite,
          }));
        }
      } catch {
        // revert on error
        setFavoriteStates((prev) => ({
          ...prev,
          [property.id]: currentFav,
        }));
      } finally {
        setFavoriteLoading((prev) => ({
          ...prev,
          [property.id]: false,
        }));
      }
    },
    [checkAuth, favoriteStates]
  );

  const handleCompareClick = useCallback((property: Property) => {
    if (!property) return;
    clearAndAddToCompare({
      id: property.id,
      title: property.projectName,
      price: property.targetPrice?.formatted || "",
      location: property.location,
      image: property.image || property.images?.[0],
      developer: property.developer || "",
    });
    router.push("/compare");
  }, [clearAndAddToCompare]);

  const handleShareClick = useCallback((property: Property) => {
    if (navigator.share) {
      navigator.share({
        title: property.projectName,
        text: `Check out ${property.projectName} at ${property.location}`,
        url: `${window.location.origin}/property-details/${property.id}`,
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/property-details/${property.id}`);
    }
  }, []);

  const handleJoinGroupClick = useCallback(async (property: Property) => {
    if (!checkAuth()) {
      setShowAuthModal(true);
      return;
    }

    setJoinGroupLoading((prev) => ({ ...prev, [property.id]: true }));
    try {
      const response = await homeService.joinGroup(property.id);
      if (response.success && response.data) {
        const joinGroupData = response.data;
        setJoinGroupStates((prev) => ({ ...prev, [property.id]: joinGroupData.isJoinGroup }));
      }
    } catch (error) {
      console.error("Error joining group:", error);
    } finally {
      setJoinGroupLoading((prev) => ({ ...prev, [property.id]: false }));
    }
  }, [checkAuth]);

  if (!similarProjects || similarProjects.length === 0) {
    return null;
  }

  return (
    <>
      <section className="w-full bg-white py-8 md:py-10">
        <div className="max-w-6xl mx-auto container">
          <div className="flex items-center justify-between px-4 md:px-0 mb-5 md:mb-8">
            <h3 className="font-semibold text-[22px] md:text-[35px] text-black">
              Similar Projects
            </h3>

            <Link href="/properties">
              <button
                className="px-4 md:px-10 h-[36px] md:h-[44px] border border-[#F5F5F5] rounded-full text-[#2D2D2D] font-semibold text-[14px] md:text-[16px] bg-white hover:bg-[#F5F7FA] transition whitespace-nowrap"
              >
                View All
              </button>
            </Link>
          </div>

<div className="overflow-x-auto md:overflow-visible">
            <div className="flex gap-4 px-4 md:px-0 snap-x snap-mandatory pb-2 lg:grid lg:grid-cols-3 lg:gap-6 lg:px-0 lg:overflow-visible">
              {convertedProperties.map((property) => {
                const images = getPropertyImages(property);
                const isJoinGroup = joinGroupStates[property.id] ?? property.isJoinGroup ?? false;
                const isJoinGroupLoading = joinGroupLoading[property.id] ?? false;
                const currentIdx = currentImageIndex[property.id] || 0;
                const currentImg = images[currentIdx] || property.image || null;

                return (
                  <div key={property.id} className="min-w-[100%] sm:min-w-[70%] md:min-w-[60%] lg:min-w-0 snap-start">
                    <PropertyCard
                      key={property.id}
                      property={property}
                      isFavorite={favoriteStates[property.id] || false}
                      isLoading={favoriteLoading[property.id] || false}
                      isJoinGroup={isJoinGroup}
                      isJoinGroupLoading={isJoinGroupLoading}
                      images={images}
                      currentIndex={currentIdx}
                      hasMultipleImages={images.length > 1}
                      currentImage={currentImg}
                      isHovered={hoveredProperty === property.id}
                      onMouseEnter={() => setHoveredProperty(property.id)}
                      onMouseLeave={() => setHoveredProperty(null)}
                      onFavoriteClick={handleFavoriteClick}
                      onCompareClick={handleCompareClick}
                      onShareClick={handleShareClick}
                      onJoinGroupClick={handleJoinGroupClick}
                      onGoToImage={(index) => {
                        setCurrentImageIndex((prev) => ({ ...prev, [property.id]: index }));
                      }}
                      onGoToNextImage={(total) => {
                        setCurrentImageIndex((prev) => ({
                          ...prev,
                          [property.id]: ((prev[property.id] || 0) + 1) % total,
                        }));
                      }}
                      onGoToPreviousImage={(total) => {
                        setCurrentImageIndex((prev) => ({
                          ...prev,
                          [property.id]: ((prev[property.id] || 0) - 1 + total) % total,
                        }));
                      }}
                      formatDate={formatDate}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
