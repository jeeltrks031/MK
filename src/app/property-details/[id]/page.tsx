"use client";

import PDPAboutDeveloper from "@/components/home/PDP/about-developer/aboutDeveloper";
import PDPAmenities from "@/components/home/PDP/aminities/PDPAmenities";
import PDPGallery from "@/components/home/PDP/gallery/PDPGallery";
import PDPGroupProgressStatus from "@/components/home/PDP/group-progress/groupProgressStatus";
import PDPHighLights from "@/components/home/PDP/highlights/PDPhighlights";
import PDPLayoutPlan from "@/components/home/PDP/layoutPlan/layoutPlan";
import PDPNeighborhood from "@/components/home/PDP/neighborhood/PDPNeighborhood";
import PDPHeader from "@/components/home/PDP/PDPHeader/PDPHeader";
import PDPSections from "@/components/home/PDP/PDPSections/PDPSections";
import PDPSupport from "@/components/home/PDP/PDPSupport/PDPSupport";
import PDPPropertyDetails from "@/components/home/PDP/property-details/property-details";
import PDPSimilarProjects from "@/components/home/PDP/similar-projects/similarProjects";
import RERAStickyWidget from "@/components/home/PDP/rera-widget/RERAStickyWidget";
import {
  homeService,
  type PropertyDetail,
  type SimilarProject,
} from "@/lib/api/services/home.service";
import { useCompare } from "@/contexts/CompareContext";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { PDPDetailSkeleton } from "@/components/ui/loader";

export default function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { clearAndAddToCompare } = useCompare();
  const router = useRouter();
  const { checkAuth } = useAuthContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"favorite" | null>(null);


  const unwrappedParams = React.use(params);
  const propertyId = unwrappedParams.id;

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [similarProjects, setSimilarProjects] = useState<SimilarProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Property Details");

  const fetchPropertyDetails = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await homeService.getPropertyById(id);
      if (response.success && response.data) {
        setProperty(response.data.property);
        setSimilarProjects(response.data.similarProjects || []);
      } else {
        console.error("Failed to fetch property details");
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchPropertyDetails(propertyId);
    }
  }, [propertyId]);

  if (isLoading) {
    return <PDPDetailSkeleton />;
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Property not found</div>
      </div>
    );
  }

  const handleFavoriteClick = async () => {
    if (!checkAuth()) {
      setPendingAction("favorite");
      setShowAuthModal(true);
      return;
    }

    setProperty((prev) => {
      if (!prev) return prev;
      return { ...prev, isFavorite: !prev.isFavorite };
    });

    try {
      const { success, data } = await homeService.toggleFavorite(propertyId);
      if (success && data) {
        setProperty((prev) => {
          if (!prev) return prev;
          return { ...prev, isFavorite: data.isFavorite };
        });
      }
    } catch (error) {
      setProperty((prev) => {
        if (!prev) return prev;
        return { ...prev, isFavorite: !prev.isFavorite };
      });
    }
  };

  const handleCompareClick = () => {
    if (!property) return;
    clearAndAddToCompare({
      id: property.id,
      title: property.projectName,
      price: property.startingPrice.formatted,
      location: property.location,
      image: property.image,
      developer: property.developer?.name || "",
    });
    router.push("/compare");
  };

  const handleShareClick = () => {
    if (!property) return;

    if (navigator.share) {
      navigator
        .share({
          title: property.projectName,
          text: `Check out ${property.projectName}`,
          url: window.location.href,
        })
        .catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <PDPGallery
        images={property.images || []}
        mainImage={property.image}
        imageDetails={property.imageDetails}
        reraQrImage={property.reraQrImage}
        reraDetailsLink={property.reraDetailsLink}
      />
      <PDPHeader
        projectName={property.projectName}
        location={property.location}
        startingPrice={property.startingPrice}
        developerPrice={property.developerPrice}
        bookingDeadlinePrice={property.bookingDeadlinePrice}
        discountPercentage={property.discountPercentage}
        isFavorite={property.isFavorite}
        propertyId={property.id}
        onFavoriteChange={(isFavorite) => {
          setProperty((prev) => {
            if (!prev) return prev;
            return { ...prev, isFavorite };
          });
        }}
      />

      <div className="hidden lg:block">
        <PDPSections
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onFavoriteClick={handleFavoriteClick}
          onCompareClick={handleCompareClick}
          onShareClick={handleShareClick}
          isFavorite={property.isFavorite}
        />
      </div>

      <div className="hidden lg:flex container max-w-6xl mx-auto py-6 gap-6 lg:flex-row lg:gap-5">
        {/* LEFT CONTENT */}
        <div className="flex flex-col gap-4 flex-1">
          <div id="property-details">
            <PDPPropertyDetails property={property} />
          </div>

          <div id="highlights">
            <PDPHighLights highlights={property.highlights} />
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-4 w-full lg:w-80 shrink-0">
          <PDPGroupProgressStatus
            groupBuy={property.groupBuy}
            propertyId={property.id}
            isJoinGroup={property.isJoinGroup}
            isAuthenticated={property.isAuthenticated}
            onJoinGroupChange={(isJoinGroup) => {
              setProperty({ ...property, isJoinGroup });
            }}
            onRefresh={() => fetchPropertyDetails(propertyId)}
          />
          <PDPSupport
            relationshipManager={property.relationshipManager}
            propertyId={property.id}
            isBookVisit={property.isBookVisit}
            onBookVisitChange={(isBookVisit) => {
              setProperty({ ...property, isBookVisit });
            }}
          />
        </div>
      </div>

      {/* MOBILE + TABLET ONLY */}
      <div className="lg:hidden container max-w-6xl mx-auto px-4 flex flex-col gap-6">

        <PDPGroupProgressStatus
          groupBuy={property.groupBuy}
          propertyId={property.id}
          isJoinGroup={property.isJoinGroup}
          isAuthenticated={property.isAuthenticated}
          onJoinGroupChange={(isJoinGroup) => {
            setProperty({ ...property, isJoinGroup });
          }}
          onRefresh={() => fetchPropertyDetails(propertyId)}
        />

        <PDPSupport
          relationshipManager={property.relationshipManager}
          propertyId={property.id}
          isBookVisit={property.isBookVisit}
          onBookVisitChange={(isBookVisit) => {
            setProperty({ ...property, isBookVisit });
          }}
        />

        <PDPSections
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onFavoriteClick={handleFavoriteClick}
          onCompareClick={handleCompareClick}
          onShareClick={handleShareClick}
          isFavorite={property.isFavorite}
        />

        <PDPPropertyDetails property={property} />

        <PDPHighLights highlights={property.highlights} />

      </div>

      <div id="amenities">
        <PDPAmenities amenities={property.amenities} />
      </div>
      <div id="layout-plan">
        <PDPLayoutPlan configurations={property.configurations} />
      </div>
      <div id="connectivity">
        <PDPNeighborhood
          neighborhood={property.neighborhood}
          propertyLocation={{ lat: property.latitude, lng: property.longitude }}
        />
      </div>
      <div id="about-developer">
        <PDPAboutDeveloper developer={property.developer} />
      </div>

      <PDPSimilarProjects similarProjects={similarProjects} />

      {/* RERA Sticky Widget */}
      <RERAStickyWidget
        reraId={property.reraId}
        reraQrImage={property.reraQrImage}
        reraDetailsLink={property.reraDetailsLink}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingAction(null);
        }}
        onSuccess={() => {
          setShowAuthModal(false);
          if (pendingAction === "favorite") {
            handleFavoriteClick();
          }
          setPendingAction(null);
        }}
      />

    </>
  );
}
