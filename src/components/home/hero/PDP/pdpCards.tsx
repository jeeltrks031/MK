"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useApi } from "@/lib/api/hooks/useApi";
import { homeService, type Property } from "@/lib/api/services/home.service";
import { useCompare } from "@/contexts/CompareContext";
import { useAuthContext } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { useRouter } from "next/navigation";
import PropertyCard from "@/components/cards/PropertyCard";
import getPropertyImages from "@/utils/getPropertyImages";
import Loader, { PropertyCardSkeleton } from "@/components/ui/loader";

export default function TopProperties() {
  const LIMIT = 6;
  const router = useRouter();
  const { clearAndAddToCompare } = useCompare();
  const { isAuthenticated, checkAuth } = useAuthContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "favorite" | "compare";
    propertyId: string;
  } | null>(null);
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
    {},
  );
  const [favoriteLoading, setFavoriteLoading] = useState<
    Record<string, boolean>
  >({});

  const [joinGroupStates, setJoinGroupStates] = useState<
    Record<string, boolean>
  >({});
  const [joinGroupLoading, setJoinGroupLoading] = useState<
    Record<string, boolean>
  >({});

  const [currentImageIndex, setCurrentImageIndex] = useState<
    Record<string, number>
  >({});

  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);
  const { data: locationsData } = useApi(() => homeService.getLocations());

  const tabs = useMemo(() => {
    const allTabs = ["All Properties"];
    if (locationsData?.locations) {
      allTabs.push(...locationsData.locations);
    }
    return allTabs;
  }, [locationsData]);

  const [activeTab, setActiveTab] = useState("All Properties");
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const locationFilter = useMemo(() => {
    return activeTab === "All Properties" ? undefined : activeTab;
  }, [activeTab]);

  useEffect(() => {
    const favoriteStates: Record<string, boolean> = {};
    const joinGroupStates: Record<string, boolean> = {};
    properties.forEach((prop) => {
      if (prop.isFavorite !== undefined) {
        favoriteStates[prop.id] = prop.isFavorite;
      }
      if (prop.isJoinGroup !== undefined) {
        joinGroupStates[prop.id] = prop.isJoinGroup;
      }
    });
    setFavoriteStates((prev) => ({ ...prev, ...favoriteStates }));
    setJoinGroupStates((prev) => ({ ...prev, ...joinGroupStates }));
  }, [properties]);

  const fetchInitialProperties = useCallback(async () => {
    setProperties([]);
    setCurrentPage(1);
    setHasMore(false);
    setIsLoadingMore(true);
    try {
      const response: any = await homeService.getTopProperty({
        page: 1,
        limit: LIMIT,
        location: locationFilter,
      });

      if (response.success && response.data) {
        setProperties(response.data);
        setHasMore(response.pagination.hasMore);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [locationFilter]);

  useEffect(() => {
    fetchInitialProperties();
  }, [fetchInitialProperties]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLoadMore = () => {
    router.push("/properties");
  };

  const handleFavoriteClick = async (property: Property) => {
    if (!checkAuth()) {
      setPendingAction({ type: "favorite", propertyId: property.id });
      setShowAuthModal(true);
      return;
    }

    setFavoriteStates((prev) => ({
      ...prev,
      [property.id]: !prev[property.id],
    }));

    try {
      const res = await homeService.toggleFavorite(String(property.id));
      const { success, data } = res;

      if (success && data && typeof data.isFavorite === "boolean") {
        setFavoriteStates((prev) => ({
          ...prev,
          [property.id]: data.isFavorite,
        }));
      }
    } catch (e) {
      setFavoriteStates((prev) => ({
        ...prev,
        [property.id]: !prev[property.id],
      }));
    }
  };

  const handleCompareClick = (property: Property) => {
    if (!checkAuth()) {
      setPendingAction({ type: "compare", propertyId: property.id });
      setShowAuthModal(true);
      return;
    }

    // Clear old data and add new property
    clearAndAddToCompare({
      id: property.id,
      title: property.projectName,
      price:
        property.targetPrice?.formatted ||
        property.offerPrice?.formatted ||
        "Price on request",
      location: property.location,
      developer: property.developer,
      image: property.image || property.images?.[0] || undefined,
    });

    // Navigate to compare page
    router.push("/compare");
  };

  const handleShareClick = async (property: Property) => {
    const shareUrl = `${window.location.origin}/property-details/${property.id}`;
    const shareText = `Check out ${property.projectName} at ${property.location}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: property.projectName,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Share cancelled or failed:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy link:", error);
        prompt("Copy this link:", shareUrl);
      }
    }
  };

  const handleJoinGroupClick = async (property: Property) => {
    if (!checkAuth()) {
      setPendingAction({ type: "favorite", propertyId: property.id });
      setShowAuthModal(true);
      return;
    }

    const isJoined = joinGroupStates[property.id] ?? property.isJoinGroup ?? false;
    if (isJoined) {
      return;
    }

    setJoinGroupLoading((prev) => ({ ...prev, [property.id]: true }));

    try {
      const response = await homeService.joinGroup(property.id);
      if (response.success && response.data?.isJoinGroup) {
        setJoinGroupStates((prev) => ({
          ...prev,
          [property.id]: true,
        }));

        const refreshResponse: any = await homeService.getTopProperty({
          page: currentPage,
          limit: LIMIT,
          location: locationFilter,
        });

        if (refreshResponse.success && refreshResponse.data) {
          setProperties((prev) => {
            return prev.map((p) => {
              const updated = refreshResponse.data.find(
                (refreshed: Property) => refreshed.id === p.id,
              );
              return updated || p;
            });
          });
        }
      }
    } catch (error) {
      console.error("Failed to join group:", error);
    } finally {
      setJoinGroupLoading((prev) => ({ ...prev, [property.id]: false }));
    }
  };

  const handleAuthSuccess = () => {
    if (pendingAction) {
      const property = properties.find(
        (p) => p.id === pendingAction.propertyId,
      );
      if (property) {
        if (pendingAction.type === "favorite") {
          handleJoinGroupClick(property);
        } else if (pendingAction.type === "compare") {
          handleCompareClick(property);
        }
      }
      setPendingAction(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      const suffix =
        day === 1 || day === 21 || day === 31
          ? "st"
          : day === 2 || day === 22
            ? "nd"
            : day === 3 || day === 23
              ? "rd"
              : "th";
      return `${day}${suffix} ${month}, ${year}`;
    } catch {
      return dateString;
    }
  };

  const goToImage = (
    propertyId: string,
    index: number,
    totalImages: number,
  ) => {
    if (index >= 0 && index < totalImages) {
      setCurrentImageIndex((prev) => ({ ...prev, [propertyId]: index }));
    }
  };

  const goToNextImage = (propertyId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => {
      const current = prev[propertyId] ?? 0;
      const next = (current + 1) % totalImages;
      return { ...prev, [propertyId]: next };
    });
  };

  const goToPreviousImage = (propertyId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => {
      const current = prev[propertyId] ?? 0;
      const previous = current === 0 ? totalImages - 1 : current - 1;
      return { ...prev, [propertyId]: previous };
    });
  };

  return (
    <section className="w-full py-16 px-6">
      <div className="max-w-[1320px] mx-auto sm:px-6 lg:px-5">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-black mb-6">
          Top{" "}
          <span className="relative inline-block text-[#1C4692] font-bold">
            Properties
            <svg
              className="absolute left-3/5 -translate-x-1/2 -bottom-4 w-[120%] h-3.5"
              viewBox="0 0 120 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M2 11 C 30 3, 90 3, 118 11"
                stroke="#1C4692"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>
        </h2>

        {/* Tabs */}
        <div
          className="flex gap-6 mb-6 py-2 border-b border-[#E0E0E0] overflow-x-auto whitespace-nowrap no-scrollbar"
        >
          {tabs.map((tab, idx) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={idx}
                onClick={() => handleTabChange(tab)}
                className={`relative px-1 pb-2 text-sm md:text-base font-medium whitespace-nowrap shrink-0 transition-colors
                  ${isActive ? "text-[#1C4692]" : "text-[#818181]"}`}
              >
                {tab}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-[8px] h-[2px] bg-[#1C4692] z-20" />
                )}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoadingMore && properties.length === 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Cards Grid */}
        {!isLoadingMore || properties.length > 0 ? (
          <>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 md:gap-6 md:overflow-visible lg:grid-cols-3">
              {properties.map((prop) => {
                const isFavorite = favoriteStates[prop.id] ?? prop.isFavorite ?? false;
                const isLoading = favoriteLoading[prop.id] ?? false;
                const isJoinGroup = joinGroupStates[prop.id] ?? prop.isJoinGroup ?? false;
                const isJoinGroupLoading = joinGroupLoading[prop.id] ?? false;
                const images = getPropertyImages(prop);
                const currentIndex = currentImageIndex[prop.id] ?? 0;
                const hasMultipleImages = images.length > 1;
                const currentImage = images[currentIndex] || null;

                return (
                  <div
                    key={prop.id}
                    className="min-w-[85%] sm:min-w-[70%] snap-start md:min-w-0"
                  >
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      isFavorite={isFavorite}
                      isLoading={isLoading}
                      isJoinGroup={isJoinGroup}
                      isJoinGroupLoading={isJoinGroupLoading}
                      images={images}
                      currentIndex={currentIndex}
                      hasMultipleImages={hasMultipleImages}
                      currentImage={currentImage}
                      isHovered={hoveredProperty === prop.id}
                      onMouseEnter={() => setHoveredProperty(prop.id)}
                      onMouseLeave={() => setHoveredProperty(null)}
                      onFavoriteClick={handleFavoriteClick}
                      onCompareClick={handleCompareClick}
                      onShareClick={handleShareClick}
                      onJoinGroupClick={handleJoinGroupClick}
                      onGoToImage={(index, totalImages) =>
                        goToImage(prop.id, index, totalImages)
                      }
                      onGoToNextImage={() => goToNextImage(prop.id, images.length)}
                      onGoToPreviousImage={() =>
                        goToPreviousImage(prop.id, images.length)
                      }
                      formatDate={formatDate}
                    />
                  </div>
                );
              })}


            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-8 flex justify-center px-4">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="
        w-full max-w-[220px]
        rounded-full
        border border-[#F5F5F5]
        bg-white
        py-2 text-sm font-semibold text-[#2D2D2D]
        sm:py-3 sm:text-base
        disabled:opacity-50
      "
                >
                  {isLoadingMore ? <Loader size={24} /> : "Load more"}
                </button>
              </div>
            )}



            {/* No Properties Message */}
            {!isLoadingMore && properties.length === 0 && (
              <div className="md:col-span-3 col-span-1 flex justify-center py-20">
                <div className="text-gray-500">No properties found.</div>
              </div>
            )}
          </>
        ) : null}
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
    </section>
  );
}
