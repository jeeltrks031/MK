"use client";

import { useCallback, useEffect, useState } from "react";
import { homeService, type Property } from "@/lib/api/services/home.service";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCompare } from "@/contexts/CompareContext";
import { useRouter } from "next/navigation";

type PendingAction = | { type: "favorite"; propertyId: string } | { type: "compare"; propertyId: string } | null;

export function usePropertyActions() {
    const { checkAuth } = useAuthContext();
    const { clearAndAddToCompare } = useCompare();
    const router = useRouter();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);
    const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>({});
    const [favoriteLoading, setFavoriteLoading] = useState<Record<string, boolean>>({});
    

    const initFavorites = useCallback(
        (properties: { id: string; isFavorite?: boolean }[]) => {
            const map: Record<string, boolean> = {};
            properties.forEach((p) => {
                if (p.isFavorite) map[p.id] = true;
            });
            setFavoriteStates(map);
        },[]
    );

    const handleFavoriteClick = async (property: Property) => {
        if (!checkAuth()) return;
        const id = String(property.id);
        setFavoriteLoading((prev) => ({ ...prev, [id]: true }));
        try {
            const response = await homeService.toggleFavorite(property.id);
            if (response?.success && response.data) {
                const favoriteData = response.data;
                setFavoriteStates((prev) => ({
                    ...prev,
                    [id]: favoriteData.isFavorite,
                }));
            }
        } finally {
            setFavoriteLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleCompareClick = (property: Property) => {
        if (!checkAuth()) {
            setPendingAction({ type: "compare", propertyId: property.id });
            setShowAuthModal(true);
            return;
        }
        clearAndAddToCompare({
            id: property.id,
            title: property.projectName,
            price:
                property.targetPrice?.formatted ||
                property.offerPrice?.formatted ||
                "Price on request",
            location: property.location,
            developer: property.developer,
            image: property.images?.[0],
        });
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
            } catch {
                // user cancelled
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                alert("Link copied to clipboard!");
            } catch {
                prompt("Copy this link:", shareUrl);
            }
        }
    };

    const handleAuthSuccess = (property?: Property) => {
        if (!pendingAction || !property) return;
        if (pendingAction.type === "favorite") {
            handleFavoriteClick(property);
        } else if (pendingAction.type === "compare") {
            handleCompareClick(property);
        }
        setPendingAction(null);
        setShowAuthModal(false);
    };

    return {
        favoriteStates,
        favoriteLoading,
        showAuthModal,
        handleFavoriteClick,
        handleCompareClick,
        handleShareClick,
        handleAuthSuccess,
        setShowAuthModal,
        initFavorites
    };

}