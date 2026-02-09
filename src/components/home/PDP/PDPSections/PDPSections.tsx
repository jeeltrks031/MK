"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoHeart, IoHeartOutline, IoShareSocialOutline } from "react-icons/io5";

interface PDPSectionsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onFavoriteClick?: () => void;
  onCompareClick?: () => void;
  onShareClick?: () => void;
  isFavorite?: boolean;
}

const sections = [
  { id: "property-details", title: "Property Details" },
  { id: "highlights", title: "Highlights" },
  { id: "amenities", title: "Amenities" },
  { id: "layout-plan", title: "Layout Plan" },
  { id: "connectivity", title: "Connectivity" },
  { id: "about-developer", title: "About developer" },
];

export default function PDPSections({
  activeTab,
  onTabChange,
  onFavoriteClick,
  onCompareClick,
  onShareClick,
  isFavorite,
}: PDPSectionsProps) {
  const [activeSection, setActiveSection] = useState(
    activeTab || "Property Details",
  );
  const [isScrolling, setIsScrolling] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const scrollToSection = (id: string, title: string) => {
    setIsScrolling(true);
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.pageYOffset - 160;

    setActiveSection(title);
    onTabChange?.(title);

    window.scrollTo({ top: y, behavior: "smooth" });
    setTimeout(() => setIsScrolling(false), 800);
  };

  useEffect(() => {
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isScrolling) return;

        let max = 0;
        let visible: string | null = null;

        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > max) {
            max = e.intersectionRatio;
            visible = sections.find((s) => s.id === e.target.id)?.title || null;
          }
        });

        if (visible && visible !== activeSection) {
          setActiveSection(visible);
          onTabChange?.(visible);
        }
      },
      {
        rootMargin: "-160px 0px -55% 0px",
        threshold: [0.2, 0.4],
      },
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [activeSection, isScrolling, onTabChange]);

  useEffect(() => {
    if (activeTab && activeTab !== activeSection) {
      setActiveSection(activeTab);
    }
  }, [activeTab]);

  return (
<section className="sticky top-0 z-40 bg-white px-4 md:px-10">
      <div className="container max-w-6xl mx-auto ">
        <div className="flex items-center border-b border-[#F3F3F3] h-[64px]">
          <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide flex">
            {sections.map((section) => {
              const isActive = activeSection === section.title;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id, section.title)}
                  className={`
                    px-5 md:px-4 h-full
                    text-[15px] md:text-[15px] lg:text-[18px]
                    whitespace-nowrap transition
                    ${isActive
                      ? "text-[#1C4692] border-b-2 border-[#1C4692] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF4FF80_50%,#EEF4FFCC_80%)] font-semibold"
                      : "text-[#6D6D6D] font-normal"
                    }
                  `}
                >
                  {section.title}
                </button>
              );
            })}
          </div>

          {/* ICONS – ALWAYS VISIBLE */}
          <div className="hidden md:flex items-center gap-2 pl-2 shrink-0">
            <button
              onClick={onFavoriteClick}
              className="h-[40px] w-[40px] md:h-[44px] md:w-[44px]
              flex items-center justify-center rounded-full bg-[#EEF4FF]"
            >
              {isFavorite ? (
                <IoHeart className="h-5 w-5 text-red-500" />
              ) : (
                <IoHeartOutline className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={onCompareClick}
              className="h-[40px] w-[40px] md:h-[44px] md:w-[44px]
              flex items-center justify-center rounded-full bg-[#EEF4FF]"
            >
              <Image
                src="/images/convert.svg"
                alt="Compare"
                width={18}
                height={18}
              />
            </button>

            <button
              onClick={onShareClick}
              className="h-[40px] w-[40px] md:h-[44px] md:w-[44px]
              flex items-center justify-center rounded-full bg-[#EEF4FF]"
            >
              <Image
                src="/images/Share.svg"
                alt="Compare"
                width={18}
                height={18}
              />            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
