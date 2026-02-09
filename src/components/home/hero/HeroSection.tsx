"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CitySelector from "./CitySelector";
import { homeService } from "@/lib/api/services/home.service";
import { MapPin, Search } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("India, Hyderabad");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const normalizeSearch = (q: string) => {
    return q
      .replace(/in\s+\w+/gi, "")
      .replace(/\d+(\.\d+)?\s*bhk/gi, "")
      .trim();
  };

  const detectBhk = (q: string) => {
    const match = q.match(/(\d+(\.\d+)?)\s*bhk/i);
    return match ? `${match[1]} BHK` : null;
  };

  const handleCityChange = (cityValue: string) => {
    setSelectedCity(cityValue);
  };

  const handleSearch = async () => {
    const query = searchQuery.trim();
    const cityName = selectedCity.split(",").pop()?.trim() || selectedCity;
    const detectedBhk = detectBhk(query);
    const rawSearch = query.trim();
    const cleanedSearch = normalizeSearch(rawSearch);

    setIsSearching(true);
    try {
      await homeService.searchProperties({
        city: cityName,
        searchText: cleanedSearch || undefined,
        bhk: detectedBhk || undefined,
        sortBy: "newAdded",
        page: 1,
        limit: 10,
      });
      router.push(
        `/search-results?city=${encodeURIComponent(cityName)}&search=${encodeURIComponent(rawSearch)}&bhk=${encodeURIComponent(detectedBhk || "")}`
      );

    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const group_deals = [
    "/images/gd.jpg",
    "/images/gd1.jpg",
    "/images/gd2.jpg",
    "/images/gd3.jpg",
  ];

  return (
    <section className="relative w-full py-0 md:py-10 lg:py-10">
      <div className="mx-auto relative overflow-visible md:rounded-3xl bg-gradient-to-br from-[#C1DDEB] to-[#E3F2F5] p-4 md:p-6 shadow-md h-auto md:h-[420px] xl:h-[450px] w-full md:w-[96%] xl:w-[1150px]">
        <div className="relative z-10 w-full md:w-[55%] lg:w-[60%] xl:w-[60%] pt-10 md:pt-6 lg:pt-10 ps-4 md:ps-4 lg:ps-6">
          <p className="font-medium text-[#585981] mb-2">
            Buying a home is a big decision.
          </p>

          <div className="md:max-w-[330px] lg:max-w-none">
            <h1 className="text-3xl md:text-[32px] lg:text-4xl font-bold text-[#151516] leading-tight md:leading-[1.15] lg:leading-tight">
              <span className="text-[#1C4692] block lg:block md:inline md:pe-2">
                Milke Khereedo
              </span>
              <span className="block lg:block md:inline">
                Makes it easier.
              </span>
            </h1>

            <p className="mt-3 text-[#585981] font-medium">
              Buy together. Save more than buying alone.
            </p>
          </div>

          <div className="mt-6">
            <a href="#about">
              <button className="rounded-full bg-[#1C4692] hover:bg-[#1c4692e6] px-8 py-3 text-sm font-medium text-white shadow">
                Want to see how it works?
              </button>
            </a>
          </div>

          <div className="my-6 lg:my-4 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3">
            <div className="flex -space-x-2">
              {group_deals.map((img, index) => (
                <div key={index} className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white">
                  <Image src={img} alt="User" fill className="object-cover" />
                </div>
              ))}
            </div>

            <span className="text-sm font-medium text-gray-700">
              Explore 100+ Group Deals
            </span>
          </div>
        </div>

        <div className="hidden md:block absolute md:top-[-90px] lg:top-[-60px] xl:top-[-112px] md:right-[-20px] lg:right-[20px] xl:right-[36px]">
          <div className="relative overflow-hidden md:w-[430px] md:h-[460px] lg:w-[500px] lg:h-[440px] xl:w-[580px] xl:h-[520px]">

            <Image
              src="/images/banner1.png"
              alt="Hero Image"
              fill
              priority
              className="object-cover object-[50%_80%]"
              style={{ transform: "scale(1.2)" }}
            />
          </div>
        </div>

        <div className="block md:hidden mt-10 relative w-[400px] top-[-100px] -left-10 h-[260px]">
          <Image
            src="/images/banner1.png"
            alt="Hero Image"
            fill
            priority
            className="object-cover object-[50%_80%]"
          />
        </div>
      </div>

      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20 w-[90%] md:w-[94%] lg:w-[94%] xl:w-[1050px] xl:w-[1050px]">
        <div className="flex flex-col md:flex-row items-stretch py-2 md:py-3 rounded-2xl bg-white/50 backdrop-blur-[20px] p-0 overflow-visible shadow-[0px_30px_60px_-15px_#8F90BC26]">

          {/* CITY SELECT SECTION */}
          <div className="relative flex flex-col justify-center ps-6 pe-4 py-4 min-w-[130px] border-b border-[#DCDCEB] md:border-b-0">
            <label className="text-[18px] font-semibold text-[#110229] mb-1">
              City
            </label>
            <div className="relative" style={{ zIndex: 1000 }}>
              <CitySelector
                value={selectedCity}
                onChange={handleCityChange}
                className="h-auto "
                showLabel={false}
              />
            </div>
            <span className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-10 w-0.5 bg-[#DCDCEB]" />
          </div>

          {/* SEARCH INPUT SECTION */}
          <div className="relative flex-1 flex flex-col justify-start ps-4 pe-6 py-4" onClick={() => searchInputRef.current?.focus()}>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Find your Dream Home"
                className={`w-full bg-transparent outline-none border-none focus:ring-0 transition-all duration-300
                  ${searchQuery || isSearchFocused
                    ? "text-[26px] font-semibold text-gray-900 text-left mt-1"
                    : "text-base font-bold text-gray-800"
                  }
                  placeholder:text-[18px] placeholder:font-semibold placeholder:text-[#110229] min-h-7
                `}
              />
              <div
                className={`absolute left-0 top-full mt-1.5 flex items-center gap-1.5 text-xs text-gray-500 pointer-events-none transition-opacity duration-300 ${searchQuery || isSearchFocused ? "opacity-0" : "opacity-100"}`}>
                <MapPin className="text-gray-500 text-xs w-4 h-[14px] shrink-0" />
                <span>Search for Developers, Location, Projects</span>
              </div>
            </div>
          </div>

          {/* SEARCH BUTTON SECTION */}
          <div className="flex items-center px-6 py-4">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="h-12 w-full md:w-auto mt-4 md:mt-0 md:min-w-[140px] rounded-full bg-[#1C4692] text-white flex items-center justify-center gap-2 font-medium shadow-md hover:bg-[#1C4692] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="text-white text-sm h-5 w-5" />
              <span className="text-lg">
                {isSearching ? "Searching..." : "Search"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
