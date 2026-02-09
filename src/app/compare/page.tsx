"use client";

import { useCompare } from "@/contexts/CompareContext";
import { IoAdd } from "react-icons/io5";
import GoogleMapComponent from "@/components/home/compare/GoogleMap";
import ComparePropertyCard from "@/components/home/compare/ComparePropertyCard";
import PropertySelectionModal from "@/components/home/compare/PropertySelectionModal";
import { useState, useMemo, useEffect } from "react";
import {
  homeService,
  type Property,
  type CompareProperty,
} from "@/lib/api/services/home.service";
import Loader from "@/components/ui/loader";

export default function ComparePage() {
  const { compareItems, removeFromCompare, addToCompare, isInCompare } =
    useCompare();
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [comparisonData, setComparisonData] = useState<CompareProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparison = async () => {
      if (compareItems.length === 0) {
        setComparisonData([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const propertyIds = compareItems.map((item) => String(item.id));
        const response: any = await homeService.compareProperties({
          propertyIds,
        });

        if (response.success && response.data) {
          setComparisonData(response.data || []);
        } else {
          setError("Failed to fetch comparison data");
          setComparisonData([]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch comparison data"
        );
        setComparisonData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [compareItems]);

  // Get markers for compared properties with labels
  // Use compareItems as source of truth - create markers for ALL items in compareItems
  const mapMarkers = useMemo(() => {
    // If no items to compare, return empty array
    if (compareItems.length === 0) {
      return [];
    }

    // Create markers array ensuring proper label assignment
    // Iterate through compareItems (source of truth) and find matching data in comparisonData
    const markers = compareItems
      .map((compareItem, index) => {
        // Find the property in comparisonData that matches this compareItem
        const prop = comparisonData.find(
          (p) => String(p.id) === String(compareItem.id)
        );

        // If property not found in comparisonData yet (still loading), skip for now
        // But we'll still try to create a marker if we have coordinates from somewhere else
        if (!prop) {
          // Log for debugging - property might still be loading
          console.warn(
            `Property ${compareItem.id} not found in comparisonData yet`
          );
          return null;
        }

        // Validate coordinates - must have both lat and lng
        const hasValidCoords =
          prop.latitude !== null &&
          prop.latitude !== undefined &&
          prop.longitude !== null &&
          prop.longitude !== undefined &&
          !isNaN(Number(prop.latitude)) &&
          !isNaN(Number(prop.longitude)) &&
          Number(prop.latitude) !== 0 &&
          Number(prop.longitude) !== 0; // Exclude 0,0 coordinates (invalid)

        if (!hasValidCoords) {
          // Log for debugging - property doesn't have valid coordinates
          console.warn(
            `Property ${compareItem.id} (${prop.projectName || compareItem.title}) does not have valid coordinates`
          );
          return null;
        }

        // Use pinLabel from API response, fallback to generated label if not provided
        const label = prop.pinLabel || String.fromCharCode(65 + index);

        return {
          id: String(prop.id),
          lat: Number(prop.latitude),
          lng: Number(prop.longitude),
          title: prop.projectName || compareItem.title,
          label: label,
        };
      })
      .filter(
        (marker): marker is NonNullable<typeof marker> => marker !== null
      );

    // Debug log to verify all markers are created
    if (markers.length !== compareItems.length) {
      console.warn(
        `Expected ${compareItems.length} markers but created ${markers.length}. ` +
          `Some properties may not have valid coordinates or are still loading.`
      );
    } else {
     
    }

    return markers;
  }, [comparisonData, compareItems]);

  // Calculate map center based on actual markers being displayed
  const mapCenter = useMemo(() => {
    if (mapMarkers.length === 0) {
      // Default to Delhi if no markers
      return { lat: 28.4089, lng: 77.0418 };
    }

    if (mapMarkers.length === 1) {
      return {
        lat: mapMarkers[0].lat,
        lng: mapMarkers[0].lng,
      };
    }

    // Calculate average center for multiple markers
    const avgLat =
      mapMarkers.reduce((sum, marker) => sum + marker.lat, 0) /
      mapMarkers.length;
    const avgLng =
      mapMarkers.reduce((sum, marker) => sum + marker.lng, 0) /
      mapMarkers.length;

    return { lat: avgLat, lng: avgLng };
  }, [mapMarkers]);

  const handlePropertySelect = (property: Property) => {
    addToCompare({
      id: property.id,
      title: property.projectName,
      price:
        property.targetPrice?.formatted ||
        property.offerPrice?.formatted ||
        "Price on request",
      location: property.location,
      developer: property.developer,
      image: property.image || undefined,
    });
  };

  const formatPrice = (property: CompareProperty) => {
    if (property.budget) {
      return property.budget.formatted;
    }
    return "Price on request";
  };

  const getPropertyForCard = (compareItem: (typeof compareItems)[0]) => {
    const apiProperty = comparisonData.find(
      (p) => p.id === String(compareItem.id)
    );

    if (apiProperty) {
      return {
        id: apiProperty.id,
        title: apiProperty.projectName,
        developer: apiProperty.developer,
        price: formatPrice(apiProperty),
        location: apiProperty.location,
        image: apiProperty.mainImage || undefined,
        area: apiProperty.area?.formatted || "N/A",
        config:
          apiProperty.configurationsFormatted ||
          apiProperty.configurations?.join(", ") ||
          "N/A",
        propertyType: apiProperty.propertyType || "Residential",
        possessionDate:
          apiProperty.possessionDateFormatted || apiProperty.possessionDate,
        possessionStatus: apiProperty.possessionStatus,
        floorPlanImage: apiProperty.floorPlans?.[0]?.image || undefined,
        floorPlans: apiProperty.floorPlans || undefined,
        isFavorite: apiProperty.isFavorite ?? false, // Use isFavorite from API response
      };
    }

    // Fallback to compareItem data if API data not available
    return {
      id: String(compareItem.id),
      title: compareItem.title,
      developer: compareItem.developer || "N/A",
      price: compareItem.price,
      location: compareItem.location || "N/A",
      image: compareItem.image,
      area: "N/A",
      config: "N/A",
      propertyType: "Residential",
      possessionDate: undefined,
      possessionStatus: undefined,
      floorPlanImage: undefined,
      isFavorite: false, // Default to false if API data not available
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Map Section */}
      <div className="h-[300px] w-full sm:h-[400px] md:h-[500px]">
        <GoogleMapComponent center={mapCenter} markers={mapMarkers} />
      </div>

      {/* Properties Section */}
      <div className="bg-gray-50 py-4 md:py-6 lg:py-8">
        <div className="mx-auto container sm:px-0 px-4">
          <div className="mb-2 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:mb-6">
            <h2 className="text-base font-bold text-gray-800 sm:text-lg md:text-xl lg:text-2xl">
              Compare Properties
              {compareItems.length > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-600 sm:text-sm md:text-base lg:text-lg">
                  ({compareItems.length} selected)
                </span>
              )}
            </h2>
            {compareItems.length > 0 && (
              <button
                onClick={() => {
                  compareItems.forEach((item) => removeFromCompare(item.id));
                }}
                className="w-full rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors sm:w-auto sm:px-4 sm:py-2 md:px-6 md:text-sm"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Properties Grid */}
          {compareItems.length === 0 ? (
            // Empty State - Add Property Card
            <div className="flex justify-center">
              <div className="w-full max-w-md rounded-xl bg-white p-4 text-center shadow-sm sm:rounded-2xl sm:p-6 md:p-8 lg:p-12">
                <div className="mb-3 flex justify-center sm:mb-4 md:mb-6">
                  <button
                    onClick={() => setShowAddPropertyModal(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1C4692] text-white shadow-lg hover:bg-[#1c4692e6] transition-colors sm:h-16 sm:w-16 md:h-20 md:w-20"
                  >
                    <IoAdd className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                  </button>
                </div>
                <h3 className="mb-2 text-base font-semibold text-gray-800 sm:text-lg md:text-xl">
                  Add Properties to Compare
                </h3>
                <p className="mb-4 text-xs text-gray-600 sm:mb-5 sm:text-sm md:mb-6 md:text-base">
                  Click the + button to add properties and start comparing
                </p>
                <button
                  onClick={() => setShowAddPropertyModal(true)}
                  className="w-full rounded-full bg-[#1C4692] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1c4692e6] transition-colors sm:w-auto sm:px-6 sm:py-2.5 sm:text-sm md:px-8 md:py-3"
                >
                  Add Property
                </button>
              </div> 
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#1C4692] border-t-transparent"></div>
                <p className="text-sm text-gray-600">
                  <Loader size={38}/>
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-2 grid-cols-1 sm:gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-3 lg:gap-6">
              {/* Render compared properties */}
              {compareItems.map((item, index) => {
                // Find the property in comparisonData to get pinLabel from API
                const apiProperty = comparisonData.find(
                  (p) => String(p.id) === String(item.id)
                );
                // Use pinLabel from API response, fallback to generated label if not provided
                const label =
                  apiProperty?.pinLabel || String.fromCharCode(65 + index);
                const propertyData = getPropertyForCard(item);

                return (
                  <ComparePropertyCard
                    key={item.id}
                    property={propertyData}
                    label={label}
                    onRemove={() => removeFromCompare(item.id)}
                  />
                );
              })}

              {/* Add More Property Card */}
              {compareItems.length < 4 && (
                <div
                  onClick={() => setShowAddPropertyModal(true)}
                  className="flex min-h-[350px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-4 transition-colors hover:border-[#1C4692] hover:bg-gray-50 sm:min-h-[450px] sm:rounded-2xl sm:p-6 md:min-h-[550px] md:p-8"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 sm:mb-3 sm:h-12 sm:w-12 md:mb-4 md:h-16 md:w-16">
                    <IoAdd className="h-5 w-5 text-gray-600 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-800 sm:text-base md:text-lg">
                    Add Property
                  </h3>
                  <p className="text-center text-xs text-gray-600 sm:text-sm">
                    Click to add another property for comparison
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Property Selection Modal */}
      <PropertySelectionModal
        isOpen={showAddPropertyModal}
        onClose={() => setShowAddPropertyModal(false)}
        onSelect={handlePropertySelect}
      />
    </div>
  );
}
