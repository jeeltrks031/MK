"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import HomeIcon from "@/assets/home-2.svg";

interface PDPGalleryProps {
  images: string[];
  mainImage?: string;
  imageDetails?: {
    main: string;
    thumbnails: string[];
  };
  reraQrImage?: string;
  reraDetailsLink?: string;
}

export default function PDPGallery({
  images,
  mainImage,
  imageDetails,
}: PDPGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const allImages = images && images.length > 0 ? images : (mainImage ? [mainImage] : []);
  const thumbnails = (imageDetails?.thumbnails || allImages.slice(1)).slice(0, 4);
  const displayImages = allImages.length > 0 ? allImages : ["/placeholder-property.jpg"];

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
<section className="w-full bg-white py-6 md:py-10 px-4 md:px-10">
<div className="max-w-6xl mx-auto">
        <Breadcrumb className="mb-[30px]">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="flex items-center gap-2 text-[19px] text-[#000000]">
                <Image
                  src={HomeIcon}
                  alt="Home"
                  width={24}
                  height={24}
                />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator>
              <span className="text-[18px] text-[#000000]">|</span>
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-[18px] text-[#000000]">
                Locality
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator>
              <span className="text-[18px] text-[#000000]">|</span>
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbPage className="text-[#1C4692] font-semibold text-[18px]">
                Properties
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="relative">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 rounded-3xl">
            {/* Main Image */}
            <div className="relative bg-secondary flex items-center justify-center h-[220px] sm:h-[260px] md:h-80 rounded-[18px] p-3 md:p-6 shadow-[0_0_10px_rgba(0,0,0,0.08)] overflow-hidden">
              {displayImages[currentImageIndex] && (
                <Image
                  src={displayImages[currentImageIndex]}
                  alt="Property main image"
                  fill
                  className="object-cover rounded-[18px]"
                />
              )}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-lg transition-all z-10"
                    aria-label="Previous image"
                  >
                    <IoChevronBack className="h-5 w-5" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-lg transition-all z-10"
                    aria-label="Next image"
                  >
                    <IoChevronForward className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {displayImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`transition-all ${index === currentImageIndex
                          ? "h-1.5 w-6 rounded-full bg-white"
                          : "h-1.5 w-1.5 rounded-full bg-white/60 hover:bg-white/80"
                          }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="h-80 grid grid-cols-2 gap-4 overflow-visible relative">
              {thumbnails.map((img, index) => {
                const showViewAll =
                  index === 3 && displayImages.length > 5;

                return (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.08)] bg-secondary cursor-pointer overflow-visible"
                    onClick={() => {
                      const mainIndex = displayImages.findIndex((i) => i === img);
                      if (mainIndex !== -1) setCurrentImageIndex(mainIndex);
                    }}
                  >

                    <div className="relative w-full h-full overflow-hidden rounded-xl">
                      <Image
                        src={img}
                        alt={`Property thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {showViewAll && (
                      <>
                        <div className="absolute inset-0 flex items-end justify-center pb-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsModalOpen(true);
                            }}
                            className="rounded-full bg-white text-[#1C4692] px-8 py-2 text-[16px] font-semibold shadow-md"
                          >
                            View All
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* VIEW ALL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center">
          <div className="relative w-[90%] max-w-5xl bg-white rounded-3xl p-4 shadow-xl">

            <button onClick={() => setIsModalOpen(false)}
              className="absolute -top-4 -right-4 z-[1000] h-10 w-10 rounded-full bg-[#1C4692] text-white text-xl font-bold flex items-center justify-center shadow-lg hover:bg-[#163b7a] transition">
              ✕
            </button>

            <div className="relative h-[70vh] rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={displayImages[currentImageIndex]}
                alt="Property image"
                fill
                className="object-cover"
              />

              <button
                onClick={goToPrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow flex items-center justify-center">
                <IoChevronBack className="h-6 w-6" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow flex items-center justify-center">
                <IoChevronForward className="h-6 w-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {displayImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`transition-all ${idx === currentImageIndex
                      ? "w-6 h-2 bg-white rounded-full"
                      : "w-2 h-2 bg-white/60 rounded-full"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
