"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IoCloseCircleOutline } from "react-icons/io5";

interface RERAStickyWidgetProps {
  reraId?: string;
  reraQrImage?: string;
  reraDetailsLink?: string;
}

export default function RERAStickyWidget({
  reraId,
  reraQrImage,
  reraDetailsLink,
}: RERAStickyWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (isExpanded) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.rera-widget-container')) {
          setIsExpanded(false);
        }
      };

      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isExpanded]);

  const defaultReraUrl = "https://maharera.maharashtra.gov.in/";

  const getReraLink = () => {
    if (!reraDetailsLink) {
      return defaultReraUrl;
    }
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const isImageLink = imageExtensions.some(ext =>
      reraDetailsLink.toLowerCase().includes(ext)
    );
    return isImageLink ? defaultReraUrl : reraDetailsLink;
  };

  const reraLink = getReraLink();

  if (!reraQrImage && !reraId) {
    return null;
  }

  return (
    <div className="rera-widget-container fixed top-90 -right-2 z-50 overflow-visible">

      <div
        className={`transition-all duration-300 ease-in-out ${isExpanded
          ? "opacity-0 scale-0 pointer-events-none absolute"
          : "opacity-100 scale-100 pointer-events-auto relative"
          }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom right"
        }}
      >
        <button
          onClick={handleToggle}
          className="hidden md:flex bg-white text-black rounded-l-2xl px-4 py-4 shadow-2xl transition-all duration-200 flex flex-col items-center justify-center gap-0.5 min-w-[140px]"
          aria-label="View RERA Details">
          <span className="text-[18px] leading-tight text-center font-semibold">
            Click here For
          </span>
          <span className="text-[18px] font-semibold text-center mt-0.5">
            RERA Details
          </span>
        </button>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${isExpanded
          ? "opacity-100 scale-100 pointer-events-auto relative"
          : "opacity-0 scale-95 pointer-events-none absolute"
          }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom right"
        }}
      >
        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 min-w-[360px] max-w-[420px] overflow-visible">

          <button
            onClick={handleToggle}
            className="absolute -left-6 top-10 z-[9999] w-10 h-10 rounded-full bg-[#FB4848] text-white flex items-center justify-center shadow-xl transition">
            <IoCloseCircleOutline className="w-5 h-5" />
          </button>

          {/* CONTENT */}
          {/* <div className="px-5 py-3 flex gap-4 items-center"> */}
          <div className="px-5 py-3 flex flex-col-reverse sm:flex-row gap-4 items-center sm:items-start">
            <div className="flex-1 min-w-0 mt-2 max-h-[140px] overflow-y-auto pr-2">

              <h3 className="text-[16px] font-bold text-[#000000] mb-1 leading-snug">
                MehaRERA Registration numbers
              </h3>

              {reraId && (
                <p className="text-[#000000] text-[14px] font-normal break-all leading-snug mb-1">

                  {reraId}
                </p>
              )}

              <a
                href={reraLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[16px] text-[#2659FF] font-normal block whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                title={reraLink}
              >
                {reraLink}
              </a>
            </div>

            {reraQrImage && (
              <div className="flex-shrink-0">
                <div className="relative w-22 h-22 bg-[#F5F5F5] rounded-lg p-2">
                  <Image
                    src={reraQrImage}
                    alt="RERA QR Code"
                    fill
                    className="object-contain"
                    sizes="112px"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

