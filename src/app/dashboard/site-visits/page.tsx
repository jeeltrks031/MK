"use client";

import { useMemo, useState } from "react";
import EmptyState from "@/components/dashboard/EmptyState";
import PropertyGrid from "@/components/dashboard/PropertyGrid";
import RescheduleModal from "@/components/dashboard/RescheduleModal";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { useApi } from "@/lib/api/hooks/useApi";
import {
  userDashboardService,
  VisitedPropertiesResponse,
} from "@/lib/api/services/userDashboard.service";
import Loader from "@/components/ui/loader";
import clsx from "clsx";

type TabType = "upcoming" | "completed";

export default function SiteVisitsPage() {
  const { data, loading, execute: refetchVisits } = useApi<VisitedPropertiesResponse>(() =>
    userDashboardService.getVisitedProperties()
  );

  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const visits = activeTab === "completed" ? data?.completed ?? [] : data?.upcoming ?? [];
  const [rescheduleModal, setRescheduleModal] = useState<{
    isOpen: boolean;
    propertyId: string;
    propertyName: string;
    currentVisitDate?: string;
  }>({
    isOpen: false,
    propertyId: "",
    propertyName: "",
  });

  const {
    handleShareClick,
    handleFavoriteClick,
    handleCompareClick,
    favoriteStates,
    favoriteLoading,
  } = usePropertyActions();

  const mappedProperties = useMemo(() => {
    return visits.map((item) => {
      const p = item.property;

      return {
        id: p.id,
        images: p.images?.length ? p.images : ["/images/empty_property.png"],
        title: p.projectName,
        location: p.location,
        openingLeft: p.openingLeft ?? 0,
        groupSize: p.minGroupMembers ?? 0,
        targetPrice: p.offerPrice?.formatted ?? "—",
        developerPrice: p.developerPrice?.formatted ?? "—",
        showDiscount: p.discount,
        discountPercentage: p.discount?.percentageFormatted,
        lastViewedAt: item.lastViewedAt,
        visitActivity: item.visitActivity,
        isUpcoming: activeTab === "upcoming",
        relationshipManagerPhone: p.relationshipManagerPhone,
      };
    });
  }, [visits, activeTab]);

  const handleReschedule = (propertyId: string) => {
    const property = mappedProperties.find((p) => p.id === propertyId);
    if (property) {
      setRescheduleModal({
        isOpen: true,
        propertyId: property.id,
        propertyName: property.title,
        currentVisitDate: property.visitActivity?.visitDate,
      });
    }
  };

  const handleRescheduleSuccess = () => {
    // Refetch data to update the UI smoothly
    refetchVisits();
  };

  if (loading) {
    return (
      <div className="rounded-[24px] bg-white px-6 py-10 shadow sm:px-10 flex justify-center">
        <Loader size={32} />
      </div>
    );
  }

  return (
    <div className="rounded-[24px] bg-white shadow">
      <div className="flex gap-2 border-b px-6 pt-6">
        {(["upcoming", "completed"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-4 py-2 text-sm font-semibold rounded-t-lg",
              activeTab === tab
                ? "bg-[#f8fbff] text-[#1C4692] border-b-2 border-[#1C4692]"
                : "text-gray-500 hover:text-[#1C4692]"
            )}
          >
            {tab === "upcoming" ? "Upcoming Visits" : "Completed Visits"}
          </button>
        ))}
      </div>

      <div className="px-6 py-10 sm:px-10 bg-[#f8fbff]">
        {mappedProperties.length === 0 ? (
          <EmptyState
            imageSrc="/images/Empty_property.png"
            title={`No ${activeTab} site visits`}
            description={
              activeTab === "upcoming"
                ? "Your scheduled site visits will appear here."
                : "Once you visit a property site, it will appear here."
            }
          />
        ) : (
          <PropertyGrid
            properties={mappedProperties}
            onFavoriteClick={handleFavoriteClick}
            onCompareClick={handleCompareClick}
            onShareClick={handleShareClick}
            onReschedule={handleReschedule}
            favoriteStates={favoriteStates}
            favoriteLoading={favoriteLoading}
          />
        )}
      </div>

      <RescheduleModal
        isOpen={rescheduleModal.isOpen}
        onClose={() => setRescheduleModal({ ...rescheduleModal, isOpen: false })}
        propertyId={rescheduleModal.propertyId}
        propertyName={rescheduleModal.propertyName}
        currentVisitDate={rescheduleModal.currentVisitDate}
        onSuccess={handleRescheduleSuccess}
      />
    </div>
  );
}
