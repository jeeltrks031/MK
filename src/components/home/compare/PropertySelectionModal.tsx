"use client";

import { useState, useEffect, useCallback } from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Image from "next/image";
import { homeService, type Property } from "@/lib/api/services/home.service";
import { useCompare } from "@/contexts/CompareContext";

interface PropertySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (property: Property) => void;
}

export default function PropertySelectionModal({
  isOpen,
  onClose,
  onSelect,
}: PropertySelectionModalProps) {
  const { isInCompare, compareItems } = useCompare();
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;} | null>(null);
  // Store full property objects, not just IDs, so selections persist across pages
  const [selectedProperties, setSelectedProperties] = useState<
    Map<string, Property>
  >(new Map());

  const limit = 3;

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setUserLocation(null);
        },
      );
    }
  }, []);

  // Fetch properties
  const fetchProperties = useCallback(
    async (page: number = 1, search?: string) => {
      setLoading(true);
      setError(null);

      try {
        const params: {
          latitude?: number;
          longitude?: number;
          page: number;
          limit: number;
          search?: string;
        } = {
          page,
          limit,
        };

        const baseProperty = Array.from(selectedProperties.values())[0];

        if (baseProperty?.latitude && baseProperty?.longitude) {
          params.latitude = baseProperty.latitude;
          params.longitude = baseProperty.longitude;
        }

        if (search && search.trim()) {
          params.search = search.trim();
        }

        const response: any = await homeService.getProperties(params);
        if (response.success && response.data) {
          setProperties(response.data || []);
          setTotalPages(response.pagination?.totalPages || 1);
          setCurrentPage(page);
        } else {
          setError("Failed to fetch properties");
          setProperties([]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch properties",
        );
        setProperties([]);
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  // Fetch properties when modal opens or user location is available
  useEffect(() => {
    if (isOpen && userLocation) {
      fetchProperties(1, searchQuery);
    }
  }, [isOpen, userLocation, fetchProperties]);

  // Debounced search
  useEffect(() => {
    if (!isOpen || !userLocation) return;

    const timer = setTimeout(() => {
      fetchProperties(1, searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, isOpen, userLocation, fetchProperties]);

  // Sync selected properties with already compared items when properties are loaded
  useEffect(() => {
    if (isOpen && properties.length > 0) {
      setSelectedProperties((prev) => {
        const merged = new Map(prev);
        // Add properties that are already in compare to selectedProperties
        properties.forEach((property) => {
          if (isInCompare(property.id)) {
            merged.set(String(property.id), property);
          }
        });
        return merged;
      });
    }
  }, [isOpen, properties, compareItems, isInCompare]);

  // Reset state when modal closes (but preserve selections until modal closes)
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setCurrentPage(1);
      setSelectedProperties(new Map());
      setError(null);
    }
  }, [isOpen]);

  const handlePropertyToggle = (property: Property) => {
    const alreadyInCompare = isInCompare(property.id);

    // If already in compare, don't allow toggling (it's permanently selected)
    if (alreadyInCompare) {
      return;
    }

    setSelectedProperties((prev) => {
      const newMap = new Map(prev);
      const propertyId = String(property.id);
      if (newMap.has(propertyId)) {
        newMap.delete(propertyId);
      } else {
        newMap.set(propertyId, property);
      }
      return newMap;
    });
  };

  const handleAddSelected = () => {
    let addedCount = 0;
    selectedProperties.forEach((property) => {
      if (property && !isInCompare(property.id)) {
        onSelect(property);
        addedCount++;
      }
    });
    setSelectedProperties(new Map());
    // Close modal if properties were added
    if (addedCount > 0) {
      onClose();
    }
  };

  const formatPrice = (property: Property) => {
    if (property.targetPrice && property.developerPrice) {
      const target = property.targetPrice.formatted;
      const developer = property.developerPrice.formatted;
      if (target !== developer) {
        return `${target} - ${developer}`;
      }
      return target;
    }
    return property.offerPrice?.formatted || "Price on request";
  };
  

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-[95%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-4">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
            <h2 className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">
              Select Properties to Compare
            </h2>
            {(() => {
              // Count unique selected properties (newly selected + already in compare)
              const totalSelected = new Set([
                ...compareItems.map((item) => String(item.id)),
                ...Array.from(selectedProperties.keys()),
              ]).size;
              return totalSelected > 0 ? (
               <span className="rounded-full bg-[#1C4692] px-3 py-1 text-xs font-semibold text-white self-start sm:self-auto">
                  {totalSelected} selected
                </span>
              ) : null;
            })()}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="border-b border-gray-200 p-4 sm:p-4">
          <div className="relative">
            <IoSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#1C4692] focus:outline-none focus:ring-2 focus:ring-[#1C4692]/20 sm:py-3 sm:text-base"
            />
          </div>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto p-4 sm:p-6"
          style={{ maxHeight: "calc(90vh - 200px)" }}
        >
          {loading && !properties.length ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1C4692] border-t-transparent"></div>
                <p className="text-sm text-gray-600">Loading properties...</p>
              </div>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={() => fetchProperties(currentPage, searchQuery)}
                className="mt-4 rounded-full bg-[#1C4692] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c4692e6] transition-colors"
              >
                Retry
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-600">
                {searchQuery
                  ? "No properties found matching your search"
                  : "No properties available"}
              </p>
            </div>
          ) : (
            <>
              {/* Properties Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {properties.map((property) => {
                  const alreadyInCompare = isInCompare(property.id);
                  // Property is selected if it's in selectedProperties OR already in compare
                  const isSelected =
                    selectedProperties.has(String(property.id)) ||
                    alreadyInCompare;

                  return (
                    <div
                      key={property.id}
                      className={`group relative cursor-pointer rounded-lg border-2 bg-white p-3 transition-all sm:rounded-xl sm:p-4 ${isSelected
                        ? "border-[#1C4692] bg-[#1C4692]/5 shadow-lg"
                        : "border-gray-200 hover:border-[#1C4692] hover:shadow-lg"
                        } ${alreadyInCompare ? "cursor-default" : "cursor-pointer"}`}
                      onClick={() => handlePropertyToggle(property)}
                    >
                      {/* Selection Indicator - Show for both newly selected and already in compare */}
                      <div
                        className={`absolute right-2 top-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors shadow-sm ${isSelected
                          ? "bg-[#1C4692] text-white"
                          : "border-2 border-gray-300 bg-white text-gray-600"
                          }`}
                      >
                        {isSelected && (
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        <span>
                          {alreadyInCompare
                            ? "Selected"
                            : isSelected
                              ? "Selected"
                              : "Select"}
                        </span>
                      </div>

                      {/* Property Image */}
                      {property.image && (
                        <div className="relative mb-2 mt-6 h-32 w-full overflow-hidden rounded-lg bg-gray-100 sm:mb-3 sm:h-36 md:h-40">
                          <Image
                            src={property.image}
                            alt={property.projectName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Property Details */}
                      <h4 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-800 sm:text-base">
                        {property.projectName}
                      </h4>
                      <p className="mb-1 line-clamp-1 text-xs text-gray-600 sm:text-sm">
                        {property.developer}
                      </p>
                      <p className="text-xs font-medium text-gray-900 sm:text-sm">
                        {formatPrice(property)}
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                        {property.location}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 pt-4">
                  <button
                    onClick={() =>
                      fetchProperties(currentPage - 1, searchQuery)
                    }
                    disabled={currentPage === 1 || loading}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  >
                    <IoChevronBack className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 8) {
                        pageNum = i + 1;
                      } else if (currentPage <= 4) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - (8 - 1) + i;
                      } else {
                        pageNum = currentPage - 4 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchProperties(pageNum, searchQuery)}
                          disabled={loading}
                          className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                            ? "bg-[#1C4692] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      fetchProperties(currentPage + 1, searchQuery)
                    }
                    disabled={currentPage === totalPages || loading}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  >
                    Next
                    <IoChevronForward className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with Add Button */}
        {selectedProperties.size > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-4 sm:px-6 sm:py-4">
           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                {selectedProperties.size} new properties selected
                {compareItems.length > 0 && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({compareItems.length} already in compare)
                  </span>
                )}
              </p>
              <button
                onClick={handleAddSelected}
                className="rounded-full bg-[#1C4692] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1c4692e6] transition-colors"
              >
                Add {selectedProperties.size} to Compare
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
