"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoChevronBack, IoChevronForward, IoHeart, IoHeartOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import type { VisitActivity } from "@/lib/api/services/userDashboard.service";

type PropertyCardProps = {
    id: string;
    images: string[];
    title: string;
    location: string;
    groupSize: number;
    openingLeft: number;
    targetPrice: string;
    developerPrice: string;
    showDiscount?: boolean;
    discountPercentage?: string;
    lastViewedAt?: string;
    lastDayToJoin?: string;
    visitActivity?: VisitActivity;
    isUpcoming?: boolean;
    relationshipManagerPhone?: string;
    onReschedule?: (propertyId: string) => void;
    onFavoriteClick?: (property: {
        id: string;
        projectName: string;
        location: string;
    }) => void;

    onCompareClick?: (property: {
        id: string;
        projectName: string;
        location: string;
        images?: string[];
    }) => void;

    onShareClick?: (property: {
        id: string;
        projectName: string;
        location: string;
    }) => void;
    isFavorite?: boolean;
    isFavoriteLoading?: boolean;
};

export default function PropertyCard({
    id,
    images,
    title,
    location,
    groupSize,
    openingLeft,
    targetPrice,
    developerPrice,
    showDiscount = false,
    discountPercentage,
    lastViewedAt,
    lastDayToJoin,
    visitActivity,
    isUpcoming = false,
    relationshipManagerPhone,
    onReschedule,
    onFavoriteClick,
    onCompareClick,
    onShareClick,
    isFavorite = false,
    isFavoriteLoading = false,
}: PropertyCardProps) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [localFavorite, setLocalFavorite] = useState(isFavorite);
    const hasMultipleImages = images.length > 1;
    const actionBtn = "flex h-9 w-9 items-center font-black justify-center rounded-full bg-white shadow-md";

    useEffect(() => {
        setLocalFavorite(isFavorite);
    }, [isFavorite])

    function formatLocationAreaCity(fullLocation?: string) {
        if (!fullLocation || typeof fullLocation !== "string") return "";
        const parts = fullLocation
            .split(",")
            .map(p => p.trim())
            .filter(Boolean);
        if (parts.length === 0) return "";
        if (parts[parts.length - 1].toLowerCase() === "india") {
            parts.pop();
        }
        let area = "";
        let city = "";
        if (parts.length >= 2) {
            city = parts[parts.length - 2];
        } else {
            city = parts[parts.length - 1];
        }
        const roadKeywords = ["road", "rd", "street", "st", "lane", "ln"];
        for (let part of parts) {
            const lower = part.toLowerCase();
            const isRoad = roadKeywords.some(k => lower.includes(k));
            const isNumber = /^\d+/.test(part);
            if (!isRoad && !isNumber) {
                area = part;
                break;
            }
        }
        if (!area) area = parts[0];
        if (area.toLowerCase() === city.toLowerCase()) {
            return area;
        }
        return `${area} | ${city}`;
    }

    const hasDiscount = showDiscount && discountPercentage && discountPercentage !== "0%" && discountPercentage !== "0.00%";

    return (
        <div onClick={() => router.push(`/property-details/${id}`)} className="group flex flex-col rounded-4xl bg-white p-4 shadow-sm cursor-pointer">
            <div className="relative aspect-[5/3.5] w-full overflow-hidden rounded-3xl">
                <Image
                    src={images[currentIndex]}
                    alt={title}
                    fill
                    className="object-cover"
                />
                {hasMultipleImages && (
                    <>
                        {/* LEFT */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
                            }}
                            className="absolute left-4 bottom-6 h-9 w-9 flex items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-lg border border-gray-200 transition-all duration-300 opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto"
                            aria-label="Previous image">
                            <IoChevronBack className="h-5 w-5" />
                        </button>

                        {/* RIGHT */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex((prev) => (prev + 1) % images.length);
                            }}
                            className="absolute right-4 bottom-6 h-9 w-9 flex items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-lg border border-gray-200 transition-all duration-300 opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto"
                            aria-label="Next image">
                            <IoChevronForward className="h-5 w-5" />
                        </button>
                    </>
                )}

                {lastDayToJoin && (
                    <span
                        className="absolute left-3 top-3 rounded-lg bg-white/70 backdrop-blur-[114px] px-3 py-1.5 text-xs font-medium text-black shadow-md">
                        {lastDayToJoin}
                    </span>
                )}

                <div className="absolute right-3 top-3 z-20 flex flex-col gap-2 opacity-0 -translate-y-1.5 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setLocalFavorite((prev) => !prev);
                            onFavoriteClick?.({ id, projectName: title, location });
                        }}
                        disabled={isFavoriteLoading}
                        className={actionBtn}>
                        {localFavorite ? (
                            <IoHeart size={18} className="text-red-500" />
                        ) : (
                            <IoHeartOutline size={18} className="text-black" />
                        )}
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCompareClick?.({
                                id,
                                projectName: title,
                                location,
                                images,
                            });
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-white/90 text-gray-700 hover:bg-white shadow-md transition-colors"
                        aria-label="Add to compare">
                        <Image
                            src="/images/convert.svg"
                            alt="Compare"
                            width={20}
                            height={20}
                            className="h-5 w-5"
                        />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onShareClick?.({ id, projectName: title, location });
                        }}
                        className={actionBtn}>
                        <Image
                            src="/images/Share.svg"
                            alt="Share"
                            width={16}
                            height={16}
                        />
                    </button>
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 group-hover:pointer-events-auto">
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={`h-1.5 w-1.5 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-semibold text-[#000000]  line-clamp-1 min-h-[30px] leading-tight">{title}</h3>
                        <p className="text-[15px] text-[#828282] truncate max-w-[220px]" title={location}>
                            {formatLocationAreaCity(location)}
                        </p>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (relationshipManagerPhone) {
                                window.location.href = `tel:${relationshipManagerPhone}`;
                            }
                        }}
                        disabled={!relationshipManagerPhone}
                        className="flex items-center gap-1 rounded-full bg-[#66AE39] px-3 py-2 text-white hover:bg-[#5a9a32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Image
                            src="/images/call.svg"
                            alt="Call"
                            width={12}
                            height={12}
                            className="h-4.5 w-5"
                        /> <span className="text-md"> Call</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <StatBox label="Group Size" value={`${groupSize} Members`} />
                    <StatBox label="Opening" value={`${openingLeft} Left`} />
                </div>

                <div className="rounded-2xl bg-[#F8FBFF] p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-[14px] text-[#000000]">Target Price</p>
                            <p className="text-[20px] font-extrabold text-[#000000]">{targetPrice}</p>
                        </div>

                        <div className="text-right">
                            <p className="text-[14px] text-[#000000]">Developer price</p>
                            <p className="text-[17px] text-[#4B4B4B] line-through">{developerPrice}</p>
                        </div>
                    </div>

                    {hasDiscount && (
                        <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white py-2 text-sm text-[#66AE39]">
                            <Image
                                src="/images/Frame.svg"
                                alt="Discount"
                                width={12}
                                height={12}
                                className="h-4.5 w-5"
                            />
                            <span>Up to {discountPercentage} off</span>
                        </div>
                    )}

                    <div className="mt-1 min-h-[20px]">
                        {hasDiscount ? (
                            <p className="text-[14px] text-[#FF3232]">
                                Get up to {discountPercentage} discount on this property
                            </p>
                        ) : lastViewedAt ? (
                            <p className="text-xs text-red-500">
                                Last viewed on {new Date(lastViewedAt).toLocaleString()}
                            </p>
                        ) : null}
                    </div>
                </div>

                {/* Visit Date/Time Display */}
                {visitActivity?.visitDate && (
                    <div className="mt-3 rounded-xl bg-[#F0F8FF] border border-[#1C4692]/20 p-3">
                        {isUpcoming ? (
                            <div>
                                <p className="text-xs text-gray-600 mb-1">Scheduled Visit</p>
                                <p className="text-sm font-semibold text-[#1C4692]">
                                    {new Date(visitActivity.visitDate).toLocaleDateString("en-IN", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                                {visitActivity.visitTime && (
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        {visitActivity.visitTime}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <p className="text-xs text-gray-600 mb-1">Visit Completed</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {new Date(visitActivity.visitDate).toLocaleDateString("en-IN", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                                {visitActivity.visitTime && (
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        {visitActivity.visitTime}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {isUpcoming && onReschedule ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onReschedule(id);
                        }}
                        className="mt-2 rounded-full bg-[#1C4692] hover:bg-[#1c4692e6] py-3 text-[16px] font-semibold text-white transition-all">
                        Reschedule
                    </button>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/property-details/${id}`);
                        }}
                        className="mt-2 rounded-full bg-[#1C4692] hover:bg-[#1c4692e6] py-3 text-[16px] font-semibold text-white">
                        View Details
                    </button>
                )}
            </div>
        </div>
    );
}

type StatBoxProps = {
    label: string;
    value: string;
    className?: string;
};

function StatBox({ label, value, className = "bg-[#F2F6FF]" }: StatBoxProps) {
    const [rawNumber, text] = value.split(" ");
    const formattedNumber = rawNumber.length === 1 ? rawNumber.padStart(2, "0") : rawNumber;

    return (
        <div className={`rounded-xl px-4 py-3 text-center ${className}`}>
            <p className="text-[18px] font-semibold text-[#000000]">{label}</p>
            <p className="mt-1 text-sm">
                <span className="font-bold text-xl text-[#1C4692]">{formattedNumber}</span>{" "}
                <span className="text-[#525252] text-[14px]">{text}</span>
            </p>
        </div>
    );
}
