"use client";

import { useState, useEffect } from "react";
import BlogCard from "../cards/BlogCard";
import Heading from "../typography/heading";
import { Button } from "../ui/button";
import { homeService } from "@/lib/api/services/home.service";
import type { Blog } from "@/lib/api/services/home.service";
import Link from "next/link";
import Loader from "../ui/loader";

interface RecentBlogProps {
  excludeBlogId?: string;
  excludeSlug?: string;
}

const RecentBlog = ({ excludeBlogId, excludeSlug }: RecentBlogProps) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await homeService.getBlogs({
          page: 1,
          limit: 9,
        });
        if (response.success && response.data) {
          const blogsArray = Array.isArray(response.data) ? response.data : [];
          // Exclude current blog if provided
          const filtered = blogsArray.filter(
            (b) =>
              b._id !== excludeBlogId && b.slug !== excludeSlug,
          );
          setBlogs(filtered);
        }
      } catch (error) {
        console.error("Error fetching recent blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [excludeBlogId, excludeSlug]);

  const visibleBlogs = blogs.slice(0, visibleCount);

  if (isLoading) {
    return (
      <section className="py-[30px] md:py-[50px]">
        <div className="container mx-auto px-4 md:px-0">
          <div className="flex justify-center items-center py-10">
            <div className="text-gray-500"><Loader size={38}/></div>
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-[30px] md:py-[50px]">
        <div className="container mx-auto">
          <div className="flex justify-between items-start gap-4">
            <Heading className="text-black mb-6">Recent Blogs</Heading>
            <Link href="/blogs">
              <Button
                variant={"ghost"}
                className="rounded-[110px] mt-6 text-[16px] text-[#2D2D2D] font-semibold border border-[#F5F5F5] py-4 px-6"
              >
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 mt-4">
            {visibleBlogs.map((blog) => (
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
        </div>
      </section>
    </>
  );
};

export default RecentBlog;
