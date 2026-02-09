"use client";

import {
  GoogleMap,
  OverlayView,
  MarkerClusterer,
} from "@react-google-maps/api";
import { useMemo, Fragment, useState } from "react";
import { Property } from "@/lib/api/services/home.service";
import { FaHome } from "react-icons/fa";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `₹ ${(price / 10000000).toFixed(1)} Cr`;
  }
  if (price >= 100000) {
    return `₹ ${(price / 100000).toFixed(0)} Lakh`;
  }
  return `₹ ${price}`;
};

const getMarkerColor = (price: number, active?: boolean) => {
  if (active) return "bg-[#1C4692]";

  if (price >= 100000000) return "bg-red-600";
  if (price >= 70000000) return "bg-pink-500";
  if (price >= 50000000) return "bg-orange-500";
  if (price >= 30000000) return "bg-yellow-500";
  if (price >= 15000000) return "bg-green-500";

  return "bg-teal-500";
};

export default function PropertyMap({
  properties,
  activeId,
  onMarkerClick,
}: {
  properties: Property[] | null;
  activeId?: string;
  onMarkerClick?: (id: string) => void;
}) {
  const validProperties = useMemo(() => {
    if (!properties || !Array.isArray(properties)) return [];
    return properties.filter(
      (p) => typeof p.latitude === "number" && typeof p.longitude === "number",
    );
  }, [properties]);

  const center = useMemo(
    () => ({
      lat: validProperties?.[0]?.latitude ?? 28.6139,
      lng: validProperties?.[0]?.longitude ?? 77.209,
    }),
    [validProperties],
  );

  if (validProperties.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">No properties with location data</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={11}
      center={center}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      <MarkerClusterer>
        {() => (
          <Fragment>
            {validProperties.map((p) => {
              const price = p.targetPrice?.value ?? 0;
              const isActive = activeId === p.id;

              return (
                <OverlayView
                  key={p.id}
                  position={{ lat: p.latitude!, lng: p.longitude! }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  getPixelPositionOffset={(width, height) => ({
                    x: -(width / 2),
                    y: -(height / 2),
                  })}
                >
                  <HomeMarker
                    property={p}
                    price={price}
                    active={isActive}
                    onClick={() => onMarkerClick?.(p.id)}
                  />
                </OverlayView>
              );
            })}
          </Fragment>
        )}
      </MarkerClusterer>
    </GoogleMap>
  );
}

function HomeMarker({
  property,
  price,
  active,
  onClick,
}: {
  property: Property;
  price: number;
  active?: boolean;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      style={{ zIndex: active ? 1000 : 10 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {/* Marker Icon */}
      <div
        className={`h-10 w-10 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 relative ${getMarkerColor(
          price,
          active,
        )}`}
        style={{ zIndex: hover ? 1001 : 'auto' }}
      >
        <FaHome className="text-white text-lg" />
      </div>

      {/* Tooltip - Positioned above marker with proper spacing */}
      {hover && (
        <OverlayView
          position={{ lat: property.latitude!, lng: property.longitude! }}
          mapPaneName={OverlayView.FLOAT_PANE}
          getPixelPositionOffset={() => ({
            x: -150,
            y: -260,
          })}
        >
          <div
            className="absolute w-[300px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden pointer-events-auto"
            style={{
              bottom: '100%',
              left: '50%',
              marginBottom: '60px', // Increased gap to prevent overlap with marker
              zIndex: 10000, // Very high z-index to ensure it's on top
              transform: 'translateX(-50%)'
            }}
          >
            {/* Property Image */}
            {property.image && (
              <div className="w-full h-36 overflow-hidden bg-gray-100">
                <img
                  src={property.image}
                  alt={property.projectName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Property Details */}
            <div className="p-4 space-y-3">
              {/* Project Name */}
              <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight">
                {property.projectName}
              </h3>

              {/* Location */}
              <div className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {property.location}
                </p>
              </div>

              {/* Price Section */}
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-lg font-bold text-[#1C4692]">
                  {formatPrice(price)}
                </span>
                {property.developerPrice && property.developerPrice.value > price && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(property.developerPrice.value)}
                    </span>
                    {property.discount && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        {property.discount.percentageFormatted} Off
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Configurations */}
              {property.configurations && property.configurations.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Config:</span>
                  <span className="text-sm text-gray-700 font-semibold">
                    {property.configurationsFormatted || property.configurations.join(", ")}
                  </span>
                </div>
              )}

              {/* Group Size & Opening */}
              {(property.groupSize > 0 || (property.openingLeft !== undefined && property.openingLeft > 0)) && (
                <div className="flex items-center gap-4 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  {property.groupSize > 0 && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium">Group: {property.groupSize}</span>
                    </div>
                  )}
                  {property.openingLeft !== undefined && property.openingLeft > 0 && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Opening: {property.openingLeft} Left</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Arrow pointer - positioned well below tooltip to point to marker */}
            <div
              className="absolute"
              style={{
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%) translateY(100%)',
                marginBottom: '-8px'
              }}
            >
              <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-transparent border-t-white shadow-lg"></div>
              <div
                className="absolute"
                style={{
                  top: '2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '10px solid #e5e7eb'
                }}
              ></div>
            </div>
          </div>
        </OverlayView>
      )}

    </div>
  );
}
