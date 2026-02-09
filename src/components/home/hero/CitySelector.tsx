"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { Country, City as CSCity } from "country-state-city";
import Loader from "@/components/ui/loader";

export interface City {
    city: string;
    country: string;
    value: string;
}

// Cache for cities data
let citiesCache: City[] | null = null;
let citiesCachePromise: Promise<City[]> | null = null;

export const fetchAllCities = async (): Promise<City[]> => {
    // Return cached data if available
    if (citiesCache) {
        return citiesCache;
    }

    // Return existing promise if fetch is in progress
    if (citiesCachePromise) {
        return citiesCachePromise;
    }

    // Fetch cities using country-state-city package - optimized with chunked processing
    citiesCachePromise = new Promise<City[]>((resolve, reject) => {
        // Use setTimeout to defer heavy computation and prevent UI blocking
        setTimeout(() => {
            try {
                const formattedCities: City[] = [];

                // Get all countries
                const countries = Country.getAllCountries();

                // Process countries in chunks to avoid blocking
                let countryIndex = 0;
                const processChunk = () => {
                    const chunkSize = 10; // Process 10 countries at a time
                    const endIndex = Math.min(countryIndex + chunkSize, countries.length);

                    for (let i = countryIndex; i < endIndex; i++) {
                        const country = countries[i];
                        const countryCode = country.isoCode;
                        const countryName = country.name;

                        // Get cities for this country
                        const cities = CSCity.getCitiesOfCountry(countryCode);

                        if (cities && Array.isArray(cities)) {
                            cities.forEach((city) => {
                                if (city.name && typeof city.name === "string") {
                                    formattedCities.push({
                                        city: city.name.trim(),
                                        country: countryName,
                                        value: `${countryName}, ${city.name.trim()}`,
                                    });
                                }
                            });
                        }
                    }

                    countryIndex = endIndex;

                    // Continue processing if there are more countries
                    if (countryIndex < countries.length) {
                        // Use requestIdleCallback or setTimeout for next chunk
                        if (
                            typeof window !== "undefined" &&
                            "requestIdleCallback" in window
                        ) {
                            requestIdleCallback(processChunk, { timeout: 50 });
                        } else {
                            setTimeout(processChunk, 0);
                        }
                    } else {
                        // All countries processed, sort and cache
                        formattedCities.sort((a, b) => {
                            const aIsIndia = a.country.toLowerCase() === "india";
                            const bIsIndia = b.country.toLowerCase() === "india";

                            // Indian cities come first
                            if (aIsIndia && !bIsIndia) return -1;
                            if (!aIsIndia && bIsIndia) return 1;

                            // If both are India or both are not India, sort by country then city
                            const countryCompare = a.country.localeCompare(b.country);
                            if (countryCompare !== 0) return countryCompare;
                            return a.city.localeCompare(b.city);
                        });

                        citiesCache = formattedCities;
                        resolve(formattedCities);
                    }
                };

                // Start processing
                processChunk();
            } catch (error) {
                console.error("Error fetching cities:", error);
                citiesCachePromise = null;
                reject(error);
            }
        }, 0);
    });

    return citiesCachePromise;
};

interface CitySelectorProps {
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    showLabel?: boolean;
}

export default function CitySelector({
    value,
    onChange,
    className = "",
    showLabel = true,
}: CitySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 5 });
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listContainerRef = useRef<HTMLDivElement>(null);
    const dropdownContainerRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch cities on component mount - use setTimeout to prevent blocking
    useEffect(() => {
        const loadCities = async () => {
            try {
                setLoading(true);
                setTimeout(async () => {
                    const fetchedCities = await fetchAllCities();
                    requestAnimationFrame(() => {
                        setCities(fetchedCities);

                        if (fetchedCities.length > 0) {
                            if (value) {
                                const found = fetchedCities.find((c) => c.value === value);
                                if (found) {
                                    setSelectedCity(found);
                                } else {
                                    const delhi = fetchedCities.find(
                                        (c) =>
                                            c.city.toLowerCase() === "delhi" &&
                                            c.country.toLowerCase() === "india",
                                    );
                                    setSelectedCity(delhi || fetchedCities[0]);
                                }
                            } else {
                                const delhi = fetchedCities.find(
                                    (c) =>
                                        c.city.toLowerCase() === "delhi" &&
                                        c.country.toLowerCase() === "india",
                                );
                                setSelectedCity(delhi || fetchedCities[0]);
                            }
                        }
                        setLoading(false);
                    });
                }, 0);
            } catch (error) {
                console.error("Error loading cities:", error);
                setLoading(false);
            }
        };

        loadCities();
    }, [value]);

    // Update selected city when value prop changes
    useEffect(() => {
        if (value && cities.length > 0) {
            const found = cities.find((c) => c.value === value);
            if (found) {
                setSelectedCity(found);
            }
        }
    }, [value, cities]);

    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 150);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const filteredCities = useMemo(() => {
        if (cities.length === 0) return [];
        if (!debouncedSearchQuery.trim()) {
            return cities;
        }
        const query = debouncedSearchQuery.toLowerCase();
        return cities.filter((city) => {
            return (
                city.city.toLowerCase().includes(query) ||
                city.country.toLowerCase().includes(query) ||
                city.value.toLowerCase().includes(query)
            );
        });
    }, [cities, debouncedSearchQuery]);

    // Reset visible range when search changes
    useEffect(() => {
        if (debouncedSearchQuery.trim()) {
            setVisibleRange({ start: 0, end: 50 });
        } else {
            setVisibleRange({ start: 0, end: 5 });
        }
    }, [debouncedSearchQuery]);

    const visibleCities = useMemo(() => {
        return filteredCities.slice(visibleRange.start, visibleRange.end);
    }, [filteredCities, visibleRange]);

    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
            if (scrollBottom < 100 && visibleRange.end < filteredCities.length) {
                const increment = debouncedSearchQuery.trim() ? 50 : 10;
                setVisibleRange((prev) => ({
                    start: prev.start,
                    end: Math.min(prev.end + increment, filteredCities.length),
                }));
            }
        },
        [filteredCities.length, visibleRange.end, debouncedSearchQuery],
    );

    // Focus search input when dropdown opens and reset visible range
    useEffect(() => {
        if (isOpen) {
            setVisibleRange({ start: 0, end: 5 });
            if (dropdownRef.current && dropdownContainerRef.current) {
                const parentWidth = dropdownRef.current.offsetWidth;
                dropdownContainerRef.current.style.width = `${parentWidth}px`;
            }
            requestAnimationFrame(() => {
                setTimeout(() => {
                    searchInputRef.current?.focus();
                }, 50);
            });
        }
    }, [isOpen]);

    const handleSelectCity = useCallback(
        (city: City) => {
            setSelectedCity(city);
            setIsOpen(false);
            setSearchQuery("");
            setDebouncedSearchQuery("");
            onChange?.(city.value);
        },
        [onChange],
    );

    const handleKeyDown = (e: React.KeyboardEvent, city?: City) => {
        if (e.key === "Enter" && city) {
            handleSelectCity(city);
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setSearchQuery("");
        }
    };

    if (!selectedCity) {
        return (
            <div className={`relative ${className}`}>
                <div className="h-5 w-28 rounded-md bg-gray-200 animate-pulse" />
            </div>
        );
    }

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    requestAnimationFrame(() => {
                        setIsOpen(!isOpen);
                    });
                }}
                className="w-full appearance-none bg-transparent text-left outline-none border-none p-0 flex items-center hover:opacity-80 transition-opacity"
            >
                <span className="text-base font-medium text-[#1C4692] truncate pr-2">
                    {selectedCity.city}
                </span>
                <FaChevronDown
                    className={`pointer-events-none text-gray-800 text-sm ml-4 transition-transform duration-200  ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-9998 bg-transparent"
                        onClick={() => {
                            setIsOpen(false);
                            setSearchQuery("");
                        }}
                    />
                    <div
                        ref={dropdownContainerRef}
                        className="absolute left-0 top-full z-9999 mt-1 rounded-xl bg-white shadow-2xl border-2 border-gray-100 max-h-[280px] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxHeight: "212px",
                            width: dropdownRef.current?.offsetWidth || "200px",
                            minWidth: "200px",
                            transform: "translateY(0)",
                            animation: "dropdownSlideDown 0.2s ease-out",
                        }}
                    >
                        {/* Search Input */}
                        <div className="sticky top-0 bg-white p-3 border-b-2 border-gray-100 z-10">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search city or country..."
                                    className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#1C4692] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C4692]/20 transition-all"
                                    onKeyDown={(e) => handleKeyDown(e)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        {/* City List */}
                        <div
                            ref={listContainerRef}
                            className="max-h-[200px] overflow-y-auto city-selector-scrollbar"
                            onScroll={handleScroll}
                            style={{ maxHeight: "200px" }}
                        >
                            {loading ? (
                                <div className="py-2">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="mx-4 my-2 h-4 rounded-md bg-gray-200 animate-pulse"
                                        />
                                    ))}
                                    <div className="px-4 py-12 text-center">
                                        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                                            <div className="h-4 w-4 border-2 border-[#1C4692] border-t-transparent rounded-full animate-spin"></div>
                                            <div><Loader size={38} /></div>
                                        </div>
                                    </div>
                                </div>
                            ) : filteredCities.length === 0 ? (

                                <div className="px-4 py-12 text-center">
                                    <p className="text-sm text-gray-500">
                                        {cities.length === 0
                                            ? "No cities available"
                                            : "No cities found"}
                                    </p>
                                </div>
                            ) : (
                                <div className="py-1">
                                    {visibleCities.map((city, index) => {
                                        const isSelected = selectedCity?.value === city.value;
                                        return (
                                            <button
                                                key={`${city.city}-${city.country}-${visibleRange.start + index}`}
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectCity(city);
                                                }}
                                                onKeyDown={(e) => handleKeyDown(e, city)}
                                                className={`w-full px-4 py-3 text-left text-sm transition-all duration-150 ${isSelected
                                                    ? "bg-[#1C4692] hover:bg-[#1c4692e6] text-white font-semibold"
                                                    : "text-gray-700 hover:bg-[#1C4692]/5 hover:text-[#1C4692]"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span
                                                        className={`font-medium ${isSelected ? "text-white" : ""}`}
                                                    >
                                                        {city.country} | {city.city}
                                                    </span>
                                                    {isSelected && (
                                                        <svg
                                                            className="w-5 h-5 text-white"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                    {visibleRange.end < filteredCities.length && (
                                        <div className="px-4 py-2 text-center text-xs text-gray-400">
                                            Scroll for more cities ({visibleRange.end} of{" "}
                                            {filteredCities.length})
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
