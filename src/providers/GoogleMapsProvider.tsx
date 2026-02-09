import { useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

const GOOGLE_MAPS_LIBRARIES: (
  | "places"
  | "geometry"
  | "drawing"
  | "visualization"
)[] = ["places", "geometry"];

const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({
  children,
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const { isLoaded: apiLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  useEffect(() => {
    setIsLoaded(apiLoaded);
  }, [apiLoaded]);

  if (!isLoaded) {
    return null;
  }

  return isLoaded && <>{children}</>;
};

export default GoogleMapsProvider;
