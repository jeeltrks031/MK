"use client";

import Image from "next/image";
import Link from "next/link";
import type { Blog } from "@/lib/api/services/home.service";

export default function NewsCardBanner({ blog }: { blog: Blog }) {
  if (!blog) return null;

  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="block cursor-pointer"
    >
      <div className="shadow-[0_0_10px_rgba(0,0,0,0.08)] py-7 px-4 md:py-4 md:px-8 rounded-4xl hover:shadow-md transition">
        <div className="flex flex-col md:flex-row gap-5 bg-white rounded-4xl overflow-hidden">
          
          {/* Image */}
          <div className="w-full md:w-1/2 h-48 md:h-auto bg-[#F9F9FF] flex items-center justify-center rounded-4xl overflow-hidden">
            <div className="relative w-full h-full md:w-full md:h-[320px] rounded-xl">
              <Image
                src={blog.bannerImage}
                alt={blog.title}
                className="object-cover"
                fill
              />
            </div>
          </div>

          {/* Content */}
          <div className="w-full md:w-2/3 flex flex-col space-y-4 md:space-y-5 p-4 md:p-6 text-left">
            <h2 className="text-[#000000] font-bold text-[22px]">
              {blog.title}
            </h2>

            <p className="text-[#373737] text-[16px]">
              {(blog.content || blog.subtitle || "")
                .replace(/<[^>]*>/g, "")
                .slice(0, 350)}
              ...
            </p>

            <span className="inline-block rounded-full bg-[#1C4692] px-8 md:px-10 py-2 md:py-3 text-[18px] font-semibold text-white w-fit">
              Read More
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
