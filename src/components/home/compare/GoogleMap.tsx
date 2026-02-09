"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { API_CONFIG } from "@/lib/api/config";

// Default center (Mumbai, India) - fallback if geolocation is not available
const defaultCenter = {
  lat: 19.076,
  lng: 72.8777,
};

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id?: string;
    lat: number;
    lng: number;
    title?: string;
    label?: string;
  }>;
  className?: string;
}

export default function GoogleMapComponent({
  center,
  zoom = 12,
  markers = [],
  className = "",
}: GoogleMapProps) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const apiKey = API_CONFIG.GOOGLE_MAPS_API_KEY;

  // Get user's current location
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Use default center if geolocation fails
          setUserLocation(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    }
  }, []);

  // Determine the map center: use provided center, or user location, or default
  const mapCenter = useMemo(() => {
    if (center) return center;

    if (markers.length > 0) {
      return {
        lat: markers[0].lat,
        lng: markers[0].lng,
      };
    }

    return defaultCenter;
  }, [center, markers]);


  if (!apiKey) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
      >
        <div className="text-center">
          <p className="text-red-600">Google Maps API key is not configured.</p>
          <p className="mt-2 text-sm text-gray-600">
            Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file
          </p>
        </div>
      </div>
    );
  }

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    }),
    [],
  );

  // Fit bounds to show all markers - MUST be called before any conditional returns
  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  // Update map bounds when markers change
  useEffect(() => {
    if (
      map &&
      markers.length > 0 &&
      typeof window !== "undefined" &&
      (window as any).google?.maps
    ) {
      const googleMaps = (window as any).google.maps;
      const bounds = new googleMaps.LatLngBounds();
      let hasValidMarkers = false;

      markers.forEach((marker) => {
        if (
          marker.lat &&
          marker.lng &&
          !isNaN(marker.lat) &&
          !isNaN(marker.lng) &&
          marker.lat !== 0 &&
          marker.lng !== 0
        ) {
          bounds.extend(new googleMaps.LatLng(marker.lat, marker.lng));
          hasValidMarkers = true;
        } else {
          console.warn(`  ✗ Skipped invalid marker:`, marker);
        }
      });

      if (!hasValidMarkers || bounds.isEmpty()) {
        console.warn("⚠️ No valid markers to display on map");
        return;
      }

      // Use setTimeout to ensure map is fully rendered
      setTimeout(() => {
        // Fit bounds to show all markers
        if (markers.length > 1) {
          // Add padding to bounds
          map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
        } else if (markers.length === 1) {
          // Center on single marker with appropriate zoom
          map.setCenter(new googleMaps.LatLng(markers[0].lat, markers[0].lng));
          map.setZoom(14);
        }
      }, 100);
    }
  }, [map, markers]);

  // Create custom marker icon with label
  const createCustomMarkerIcon = (
    labelText: string,
  ): google.maps.Icon | undefined => {
    if (typeof window === "undefined" || !(window as any).google?.maps) {
      return undefined;
    }

    // Create SVG for custom marker pin with label - larger and more visible
    const svg = `
            <svg width="48" height="60" viewBox="0 0 48 60" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
                    </filter>
                </defs>
                <path d="M24 0C10.8 0 0 10.8 0 24c0 18 24 36 24 36s24-18 24-36C48 10.8 37.2 0 24 0z" 
                      fill="#1C4692" 
                      stroke="#ffffff" 
                      stroke-width="2.5"
                      filter="url(#shadow)"/>
                <text x="24" y="34" 
                      font-family="Arial, sans-serif" 
                      font-size="18" 
                      font-weight="bold" 
                      fill="#ffffff" 
                      text-anchor="middle" 
                      dominant-baseline="middle">${labelText}</text>
            </svg>
        `;

    try {
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new google.maps.Size(48, 60),
        anchor: new google.maps.Point(24, 60),
      };
    } catch (error) {
      console.error("Error creating custom marker icon:", error);
      return undefined;
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={mapCenter}
      zoom={zoom}
      options={mapOptions}
      onLoad={onLoad}
    >
      {markers.map((marker, index) => {
        // Use the label from marker if provided, otherwise generate from index
        const label = marker.label || String.fromCharCode(65 + index);

        // Skip invalid markers - double check coordinates
        if (
          !marker.lat ||
          !marker.lng ||
          isNaN(marker.lat) ||
          isNaN(marker.lng) ||
          marker.lat === 0 ||
          marker.lng === 0
        ) {
          console.warn(`Skipping invalid marker at index ${index}:`, marker);
          return null;
        }

        // Use a unique key - prefer ID if available, otherwise use position + label
        const markerKey = marker.id
          ? `marker-${marker.id}`
          : `marker-${marker.lat}-${marker.lng}-${label}-${index}`;

        // Create custom marker icon with label
        const markerIcon = createCustomMarkerIcon(label);

        if (!markerIcon) {
          // Fallback to default marker if icon creation fails
          console.warn(
            `Failed to create custom icon for marker ${label}, using default`,
          );
          return (
            <Marker
              key={markerKey}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.title || `Property ${label}`}
              label={{
                text: label,
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            />
          );
        }

        return (
          <Marker
            key={markerKey}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title || `Property ${label}`}
            icon={markerIcon}
          />
        );
      })}
    </GoogleMap>
  );
}
