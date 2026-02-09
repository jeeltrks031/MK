"use client";

import { useState, useEffect, useCallback } from "react";
import HeroSection from "@/components/sections/HeroSection";
import AboutHeroBg from "@/assets/about-us/about-hero-bg.png";
import BlogCard from "@/components/cards/BlogCard";
import { homeService } from "@/lib/api/services/home.service";
import type { Blog } from "@/lib/api/services/home.service";
import Link from "next/link";
import Loader from "@/components/ui/loader";

export default function Page() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const LIMIT = 20;

  // Fetch initial blogs
  const fetchBlogs = useCallback(async (page: number, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await homeService.getBlogs({
        page,
        limit: LIMIT,
      });
      if (response.success) {
        // The API returns data as an array directly, and pagination at the root level
        const blogsArray = Array.isArray(response.data) ? response.data : [];
        if (append) {
          setBlogs((prev) => [...(prev || []), ...blogsArray]);
        } else {
          setBlogs(blogsArray);
        }
        // Pagination is at response.pagination, not response.data.pagination
        setHasMore(response.pagination?.hasMore || false);
        setCurrentPage(page);
      } else {
        // If no data, set empty array
        if (!append) {
          setBlogs([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs(1, false);
  }, [fetchBlogs]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchBlogs(currentPage + 1, true);
    }
  };

  return (
    <>
      <HeroSection
        backgroundImage={AboutHeroBg}
        badgeText="Blog"
        title="Property buying,"
        highlightText="Explained clearly."
        description="Simple guides, real insights, and honest explanations to help you save more and buy smarter."
        headingVariant="h3"
      />

      {/* Blogs */}
      <section className="py-[50px] md:py-[100px]">
<div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          {isLoading && (!blogs || blogs.length === 0) ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-gray-500"><Loader size={38}/></div>
            </div>
          ) : (
            <>
              {blogs && blogs.length > 0 && (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {blogs.map((blog) => (
                    <Link
                      key={blog._id}
                      href={`/blogs/${blog.slug}`}
                      className="block"
                    >
                      <BlogCard
                        key={blog._id}
                        image={blog.bannerImage}
                        date={blog.date}
                        title={blog.title}
                        description={blog.subtitle}
                        content={blog.content}
                        category={blog.category}
                        buttonText="Read More"
                        href={`/blogs/${blog.slug}`}
                      />
                    </Link>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="px-8 py-3 rounded-full border border-[#F5F5F5] text-[#2D2D2D] bg-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    {isLoadingMore ? <Loader size={38}/> : "Load More"}
                  </button>
                </div>
              )}

              {/* No Blogs Message */}
              {!isLoading && (!blogs || blogs.length === 0) && (
                <div className="flex justify-center items-center py-20">
                  <div className="text-gray-500">No blogs found.</div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
