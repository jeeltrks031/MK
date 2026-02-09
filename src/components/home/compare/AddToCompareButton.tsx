"use client";

import { useCompare } from "@/contexts/CompareContext";
import type { CompareProperty } from "@/contexts/CompareContext";
import { MdCompareArrows } from "react-icons/md";
import { IoCheckmark } from "react-icons/io5";

interface AddToCompareButtonProps {
  property: CompareProperty;
  variant?: "icon" | "button";
  className?: string;
  clearOldData?: boolean; // If true, clears old compare data before adding (for new page comparisons)
}

export default function AddToCompareButton({
  property,
  variant = "icon",
  className = "",
  clearOldData = false,
}: AddToCompareButtonProps) {
  const { addToCompare, clearAndAddToCompare, removeFromCompare, isInCompare } =
    useCompare();
  const inCompare = isInCompare(property.id);

  const handleClick = () => {
    if (inCompare) {
      removeFromCompare(property.id);
    } else {
      // If clearOldData is true, clear old data first (for new page comparisons)
      if (clearOldData) {
        clearAndAddToCompare(property);
      } else {
        addToCompare(property);
      }
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
          inCompare
            ? "bg-[#1C4692] text-white hover:bg-[#1c4692e6]"
            : "bg-white text-gray-700 hover:bg-gray-100"
        } ${className}`}
        aria-label={inCompare ? "Remove from compare" : "Add to compare"}
        title={inCompare ? "Remove from compare" : "Add to compare"}
      >
        {inCompare ? (
          <IoCheckmark className="h-5 w-5" />
        ) : (
          <MdCompareArrows className="h-5 w-5" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        inCompare
          ? "border-[#1C4692] bg-[#1C4692] text-white hover:bg-[#1c4692e6]"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      } ${className}`}
    >
      {inCompare ? (
        <>
          <IoCheckmark className="h-4 w-4" />
          Added to Compare
        </>
      ) : (
        <>
          <MdCompareArrows className="h-4 w-4" />
          Add to Compare
        </>
      )}
    </button>
  );
}
