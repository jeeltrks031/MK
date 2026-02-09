"use client";

import Image from "next/image";
import Link from "next/link";

export default function Heading() {
  return (
    <div className="py-16 px-6 md:px-10">
      <div className="mx-auto max-w-[1300px]">
        <div className="relative h-[280px] md:h-[330px] overflow-hidden rounded-3xl">
          <Image
            src="/images/stayBanner.png"
            alt="CTA Background"
            fill
            priority
            className="object-cover"
          />

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 md:px-12">
            <h2 className="text-[26px] md:text-[36px] font-bold text-white">
              Stay informed. Buy{" "}
              <span className="text-[#FBAD1B]">Smarter.</span>
            </h2>

            <p className="text-white text-[15px] md:text-[17px] font-medium max-w-xl mb-6 leading-snug md:truncate">
              Get updates on group-buying deals and pricing insights that help you save more.
            </p>

            <Link href="/contact">
              <span className="inline-flex items-center justify-center rounded-full bg-white text-[#241F20] px-10 py-3 text-sm md:text-[17px] font-semibold shadow-md hover:scale-[1.02] transition cursor-pointer">
                Contact Now
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
