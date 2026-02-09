"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

/**
 * Property interface for compare feature
 */
export interface CompareProperty {
  id: string | number;
  title: string;
  price: string; // e.g., "₹4.68 Cr - 4.85 Cr" or "₹4.68 Cr"
  image?: string;
  location?: string;
  developer?: string;
  // Add more fields as needed
}

interface CompareContextType {
  compareItems: CompareProperty[];
  addToCompare: (property: CompareProperty) => void;
  clearAndAddToCompare: (property: CompareProperty) => void; // Clear old data and add new property
  removeFromCompare: (id: string | number) => void;
  clearCompare: () => void;
  isInCompare: (id: string | number) => boolean;
  compareCount: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = "compare_items";

// Load compare items from localStorage
const loadCompareItems = (): CompareProperty[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading compare items from localStorage:", error);
  }
  return [];
};

// Save compare items to localStorage
const saveCompareItems = (items: CompareProperty[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving compare items to localStorage:", error);
  }
};

export function CompareProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage
  const [compareItems, setCompareItems] = useState<CompareProperty[]>(() =>
    loadCompareItems(),
  );

  // Save to localStorage whenever compareItems changes
  useEffect(() => {
    saveCompareItems(compareItems);
  }, [compareItems]);

  const addToCompare = useCallback((property: CompareProperty) => {
    setCompareItems((prev) => {
      // Check if property already exists
      if (prev.some((item) => item.id === property.id)) {
        return prev;
      }
      // Limit to maximum items (e.g., 3 or 4)
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, property];
    });
  }, []);

  // Clear old compare data and add new property (for new page comparisons)
  const clearAndAddToCompare = useCallback((property: CompareProperty) => {
    setCompareItems([property]);
  }, []);

  const removeFromCompare = useCallback((id: string | number) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareItems([]);
  }, []);

  const isInCompare = useCallback(
    (id: string | number) => {
      return compareItems.some((item) => item.id === id);
    },
    [compareItems],
  );

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        clearAndAddToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        compareCount: compareItems.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
