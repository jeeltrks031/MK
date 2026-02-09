"use client";

import Image from "next/image";

type EmptyStateProps = {
  imageSrc: string;
  title: string;
  description: string;
};

export default function EmptyState({
  imageSrc,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="rounded-[24px] bg-white px-6 py-14 sm:px-10 sm:py-20 ">
      <div className="mx-auto flex max-w-[420px] flex-col items-center text-center">
        <Image
          src={imageSrc}
          alt={title}
          width={260}
          height={260}
          className="mb-6 h-auto w-[200px] sm:w-[260px]"
          priority
        />

        <h3 className="text-[18px] font-semibold text-[#2b2b2b]">{title}</h3>

        <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
          {description}
        </p>
      </div>
    </div>
  );
}
