"use client";

import { useEffect, useState } from "react";
import NewsCard from "./newsCard";
import NewsCardBanner from "./newsCardBanner";
import { homeService } from "@/lib/api/services/home.service";
import type { Blog } from "@/lib/api/services/home.service";
import Loader from "@/components/ui/loader";

export default function IntoNews() {
  const [featuredBlog, setFeaturedBlog] = useState<Blog | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await homeService.getBlogs({
        page: 1,
        limit: 10,
      });

      if (res.success && Array.isArray(res.data)) {
        setFeaturedBlog(res.data[0] || null);
        setBlogs(res.data.slice(1)); 
      }
    } catch (err) {
      console.error("Blogs fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 text-center text-gray-500">
        <Loader size={38} />
      </section>
    );
  }

  const desktopBlogs = blogs; 
  const mobileBlogs = featuredBlog ? [featuredBlog, ...blogs] : blogs;

  return (
    <section className="py-16 px-4 md:px-16">
      <div className="max-w-[1300px] mx-auto text-center">
        {/* Heading */}
        <h2 className="text-[24px] md:text-[30px] font-semibold text-[#000000] mb-2">
          Understand Before You{" "}
          <span className="relative inline-block text-[#1C4692] ps-2">
            Buy
            <svg
              className="absolute left-0 -bottom-2"
              width="74"
              height="11"
              viewBox="0 0 228 11">
              <path
                d="M2 8.5C60 1.5 170 5.5 226 8.5"
                stroke="#1C4692"
                strokeWidth="9"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h2>

        <p className="text-[#110229] text-[14px] md:text-[16px] font-medium mb-10">
          Simple reads to help you make smarter property{" "}
          <span className="text-[#1C4692]">decisions.</span>
        </p>

        {/* ===== DESKTOP ===== */}
        {featuredBlog && (
          <div className="hidden lg:block mb-6">
            <NewsCardBanner blog={featuredBlog} />
          </div>
        )}

        <div className="hidden lg:block">
          <NewsCard blogs={desktopBlogs} />
        </div>

        <div className="lg:hidden">
          <NewsCard blogs={mobileBlogs} />
        </div>
      </div>
    </section>
  );
}
