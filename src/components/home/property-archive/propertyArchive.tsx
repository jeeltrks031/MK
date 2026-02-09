"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useApi } from "@/lib/api/hooks/useApi";
import { homeService, type Property } from "@/lib/api/services/home.service";
import { useCompare } from "@/contexts/CompareContext";
import { useAuthContext } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { useRouter } from "next/navigation";
import PropertyCard from "@/components/cards/PropertyCard";
import getPropertyImages from "@/utils/getPropertyImages";
import Title from "@/components/typography/title";
import Loader from "@/components/ui/loader";

export default function PropertyArchive() {
  const LIMIT = 9;
  const router = useRouter();
  const { clearAndAddToCompare } = useCompare();
  const { isAuthenticated, checkAuth } = useAuthContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "favorite" | "compare";
    propertyId: string;
  } | null>(null);
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
    {}
  );
  const [favoriteLoading, setFavoriteLoading] = useState<
    Record<string, boolean>
  >({});
  // Track join group states
  const [joinGroupStates, setJoinGroupStates] = useState<
    Record<string, boolean>
  >({});
  const [joinGroupLoading, setJoinGroupLoading] = useState<
    Record<string, boolean>
  >({});
  // Track current image index for each property
  const [currentImageIndex, setCurrentImageIndex] = useState<
    Record<string, number>
  >({});
  // Track hover state for each property card
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);

  // Fetch locations from API
  const { data: locationsData } = useApi(() => homeService.getLocations());

  // Build tabs array: "All Properties" first, then locations from API
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
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Get location filter based on active tab
  const locationFilter = useMemo(() => {
    return activeTab === "All Properties" ? undefined : activeTab;
  }, [activeTab]);

  // Initialize favorite and join group states from API response
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

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Load more properties
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response: any = await homeService.getTopProperty({
        page: nextPage,
        limit: LIMIT,
        location: locationFilter,
      });

      if (response.success && response.data) {
        setProperties((prev) => [...prev, ...response.data]);
        setHasMore(response.pagination.hasMore);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more properties:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoadingMore, locationFilter]);

  // Handle favorite click
  const handleFavoriteClick = async (property: Property) => {
    if (!isAuthenticated) {
      setPendingAction({ type: "favorite", propertyId: property.id });
      setShowAuthModal(true);
      return;
    }

    const currentFavoriteState =
      favoriteStates[property.id] ?? property.isFavorite ?? false;
    const newFavoriteState = !currentFavoriteState;

    // Optimistic update
    setFavoriteStates((prev) => ({
      ...prev,
      [property.id]: newFavoriteState,
    }));
    setFavoriteLoading((prev) => ({ ...prev, [property.id]: true }));

    try {
      await homeService.toggleFavorite(property.id);
      // Update state after successful API call
      setFavoriteStates((prev) => ({
        ...prev,
        [property.id]: newFavoriteState,
      }));
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      // Revert on error
      setFavoriteStates((prev) => ({
        ...prev,
        [property.id]: currentFavoriteState,
      }));
    } finally {
      setFavoriteLoading((prev) => ({ ...prev, [property.id]: false }));
    }
  };

  // Handle compare click
  const handleCompareClick = (property: Property) => {
    if (!isAuthenticated) {
      setPendingAction({ type: "compare", propertyId: property.id });
      setShowAuthModal(true);
      return;
    }

    clearAndAddToCompare({
      id: property.id,
      title: property.projectName,
      price: property.targetPrice.formatted,
      image: property.image || property.images?.[0] || undefined,
      location: property.location,
      developer: property.developer,
    });

    router.push("/compare");
  };

  // Handle share click
  const handleShareClick = (property: Property) => {
    const shareUrl = `${window.location.origin}/property-details/${property.id}`;

    if (navigator.share) {
      navigator.share({
        title: property.projectName,
        text: `Check out this property: ${property.projectName}`,
        url: shareUrl,
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch((error) => {
          console.error("Failed to copy link:", error);
          // Fallback: Show URL in prompt
          prompt("Copy this link:", shareUrl);
        });
    }
  };

  // Handle join group click
  const handleJoinGroupClick = async (property: Property) => {
    // Check authentication first
    if (!isAuthenticated) {
      setPendingAction({ type: "favorite", propertyId: property.id }); // Reuse pending action for join group
      setShowAuthModal(true);
      return;
    }

    // Check if already joined
    const isJoined =
      joinGroupStates[property.id] ?? property.isJoinGroup ?? false;
    if (isJoined) {
      return; // Already joined, do nothing
    }

    // Set loading state
    setJoinGroupLoading((prev) => ({ ...prev, [property.id]: true }));

    try {
      const response = await homeService.joinGroup(property.id);
      if (response.success && response.data?.isJoinGroup) {
        // Update local state immediately
        setJoinGroupStates((prev) => ({
          ...prev,
          [property.id]: true,
        }));

        // Refresh property data to get updated state from API
        const refreshResponse: any = await homeService.getTopProperty({
          page: currentPage,
          limit: LIMIT,
          location: locationFilter,
        });

        if (refreshResponse.success && refreshResponse.data) {
          // Update properties with fresh data
          setProperties((prev) => {
            return prev.map((p) => {
              const updated = refreshResponse.data.find(
                (refreshed: Property) => refreshed.id === p.id
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

  // Handle auth success
  const handleAuthSuccess = () => {
    if (pendingAction) {
      const property = properties.find(
        (p) => p.id === pendingAction.propertyId
      );
      if (property) {
        if (pendingAction.type === "favorite") {
          // This could be favorite or join group, try join group first
          handleJoinGroupClick(property);
        } else if (pendingAction.type === "compare") {
          handleCompareClick(property);
        }
      }
      setPendingAction(null);
    }
  };

  // Format date for "Last Day to join"
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

  // Navigate to specific image
  const goToImage = (
    propertyId: string,
    index: number,
    totalImages: number
  ) => {
    if (index >= 0 && index < totalImages) {
      setCurrentImageIndex((prev) => ({ ...prev, [propertyId]: index }));
    }
  };

  // Navigate to next image
  const goToNextImage = (propertyId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => {
      const current = prev[propertyId] ?? 0;
      const next = (current + 1) % totalImages;
      return { ...prev, [propertyId]: next };
    });
  };

  // Navigate to previous image
  const goToPreviousImage = (propertyId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => {
      const current = prev[propertyId] ?? 0;
      const previous = current === 0 ? totalImages - 1 : current - 1;
      return { ...prev, [propertyId]: previous };
    });
  };

  return (
    <section className="w-full py-8 bg-white px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-10">
          <Title text="All" isDrawLine drawLineText="Properties" />
        </div>

        {/* Tabs - Horizontal Scrollable */}
        <div className="relative mb-8">
          <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#F0F0F0]" />
          <div
            ref={tabsContainerRef}
            className="relative flex gap-4 md:gap-6 py-2 overflow-x-auto scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
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
        </div>

        {/* Loading State */}
        {isLoadingMore && properties.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500"><Loader size={38} /></div>
          </div>
        )}

        {/* Cards Grid */}
        {!isLoadingMore || properties.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((prop) => {
              const isFavorite =
                favoriteStates[prop.id] ?? prop.isFavorite ?? false;
              const isLoading = favoriteLoading[prop.id] ?? false;
              const isJoinGroup =
                joinGroupStates[prop.id] ?? prop.isJoinGroup ?? false;
              const isJoinGroupLoading = joinGroupLoading[prop.id] ?? false;
              const images = getPropertyImages(prop);
              const currentIndex = currentImageIndex[prop.id] ?? 0;
              const hasMultipleImages = images.length > 1;
              const currentImage = images[currentIndex] || null;

              return (
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
              );
            })}

            {/* Load More Button */}
            {hasMore && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-3 rounded-full border border-[#F5F5F5] text-[#2D2D2D] bg-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  {isLoadingMore ? <Loader size={38} /> : "Load More"}
                </button>
              </div>
            )}

            {/* No Properties Message */}
            {!isLoadingMore && properties.length === 0 && (
              <div className="md:col-span-3 col-span-1 flex justify-center py-20">
                <div className="text-gray-500">No properties found.</div>
              </div>
            )}
          </div>
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
