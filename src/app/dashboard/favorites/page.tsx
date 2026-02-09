"use client";

import EmptyState from "@/components/dashboard/EmptyState";
import PropertyGrid from "@/components/dashboard/PropertyGrid";
import Loader from "@/components/ui/loader";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import { useApi } from "@/lib/api/hooks/useApi";
import {
    PropertyApi,
    userDashboardService,
} from "@/lib/api/services/userDashboard.service";
import { useEffect, useMemo } from "react";

type FavoritePropertyApi = PropertyApi;

export default function MyFavoritePage() {
    const { data, loading } = useApi<FavoritePropertyApi[]>(() =>
        userDashboardService.getFavoriteProperties()
    );


    const {
        handleFavoriteClick,
        handleCompareClick,
        handleShareClick,
        favoriteStates,
        favoriteLoading,
    } = usePropertyActions();

    const favorites = data ?? [];
    useEffect(() => {
        if (data && data.length) {
            data.forEach((p) => {
                favoriteStates[p.id] = true;
            });
        }
    }, [data]);



    const mappedProperties = useMemo(() => {
        return favorites.map((p) => {

            return {
                id: p.id,
                images: p.images?.length ? p.images : ["/images/empty_property.png"],
                title: p.projectName,
                location: p.location,
                groupSize: p.minGroupMembers ?? 0,
                openingLeft: p.openingLeft ?? 0,
                targetPrice: p.offerPrice?.formatted ?? "—",
                developerPrice: p.developerPrice?.formatted ?? "—",
                discountPercentage: p.discount?.percentageFormatted,
                showDiscount: !!p.discount,
                lastDayToJoin: p.lastDayToJoin,
                lastViewedAt: undefined,
                relationshipManagerPhone: p.relationshipManagerPhone,
            };
        });
    }, [favorites]);

    if (loading) {
        return (
            <div className="rounded-[24px] bg-white px-6 py-10 shadow sm:px-10">
                <Loader size={38} />
            </div>
        );
    }

    if (!mappedProperties.length) {
        return (
            <div className="rounded-[24px] bg-white px-6 py-10 shadow sm:px-10">
                <EmptyState
                    imageSrc="/images/Empty_property.png"
                    title="No favorites yet"
                    description="Save properties you like and they’ll appear here for quick access."
                />
            </div>
        );
    }

    return (
        <>
            <div className="block sm:hidden">
                <PropertyGrid
                    properties={mappedProperties}
                    onFavoriteClick={handleFavoriteClick}
                    onCompareClick={handleCompareClick}
                    onShareClick={handleShareClick}
                    favoriteStates={favoriteStates}
                    favoriteLoading={favoriteLoading}
                />
            </div>

            <div className="hidden sm:block rounded-[24px] bg-[#f8fbff] px-10 py-10 shadow">
                <PropertyGrid
                    properties={mappedProperties}
                    onFavoriteClick={handleFavoriteClick}
                    onCompareClick={handleCompareClick}
                    onShareClick={handleShareClick}
                    favoriteStates={favoriteStates}
                    favoriteLoading={favoriteLoading}
                />
            </div>
        </>
    );
}
