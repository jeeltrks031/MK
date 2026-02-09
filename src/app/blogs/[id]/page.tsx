"use client";

import { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Heading from "@/components/typography/heading";
import Image from "next/image";
import RecentBlog from "@/components/sections/RecentBlog";
import React from "react";
import { homeService } from "@/lib/api/services/home.service";
import type { BlogDetail, Blog } from "@/lib/api/services/home.service";
import Loader from "@/components/ui/loader";

const getCategoryName = (category?: string | { name: string }) => {
  if (!category) return "";
  return typeof category === "string" ? category : category.name;
};


export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const res = await homeService.getBlogById(unwrappedParams.id);
        if (res.success && res.data) {
          setBlog(res.data);
        } else {
          setError("Blog not found");
        }
      } catch {
        setError("Failed to load blog");
      } finally {
        setIsLoading(false);
      }
    };

    if (unwrappedParams.id) fetchBlog();
  }, [unwrappedParams.id]);

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      setIsLoadingRecent(true);
      try {
        const res = await homeService.getBlogs({ page: 1, limit: 5 });
        if (res.success && Array.isArray(res.data)) {
          setRecentBlogs(res.data.filter((b) => b._id !== blog?._id && b.slug !== unwrappedParams.id).slice(0, 3));
        }
      } finally {
        setIsLoadingRecent(false);
      }
    };
    fetchRecentBlogs();
  }, [blog?._id, unwrappedParams.id]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader size={38} />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="py-20 text-center text-red-500">
        {error || "Blog not found"}
      </div>
    );
  }

  return (
    <section className="py-[30px]">
      <div className="max-w-6xl mx-auto container px-4 sm:px-6">
        <Breadcrumb className="mb-[25px]">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="font-normal text-[18px]">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blogs" className="font-normal text-[18px]">Blogs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[#1C4692] font-semibold text-[18px]">Blog Detail</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Heading variant={"h4"} className="font-medium text-[18px] md:text-[30px] mb-4">
          {blog.title}
        </Heading>

        <div className="grid grid-cols-1 gap-5 mt-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4 justify-between px-2">
              {getCategoryName(blog.category) && (
                <span className="px-4 py-1.5 text-[14px] font-semibold bg-[#1C4692]/10 text-[#1C4692] border border-[#1C4692]/20 rounded-full">
                  {getCategoryName(blog.category)}
                </span>
              )}

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.slice(0, 5).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-[14px] font-semibold bg-gray-100 text-gray-700 border border-gray-200 rounded-full">
                      #{tag}
                    </span>
                  ))}

                  {blog.tags.length > 5 && (
                    <span className="px-3 py-1.5 text-[14px] font-semibold text-gray-500">
                      +{blog.tags.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="w-full inline-flex flex-col justify-start items-start gap-10">
              <div className="relative w-full h-80 rounded-[30px] overflow-hidden">
                <Image
                  alt={blog.title}
                  src={blog.bannerImage}
                  fill
                  className="object-cover"
                />
              </div>

              {blog.galleryImages && blog.galleryImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 w-full">
                  {blog.galleryImages.map((image, index) => (
                    <div key={index} className="relative w-full h-48 rounded-[20px] overflow-hidden">
                      <Image
                        alt={`${blog.title} - Gallery ${index + 1}`}
                        src={image}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="self-stretch flex flex-col justify-start items-start gap-7">
                <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
                  <p className="text-[16px] text-[#6B7280]">
                    <span className="font-semibold text-[#111827]">
                      {blog.updatedAt ? "Updated on" : "Published on"}
                    </span>
                    <span className="ml-1 font-medium">
                      {blog.date}
                    </span>
                  </p>
                  <div className="self-stretch h-0 outline-1 outline-offset-[-0.50px] outline-neutral-200"></div>
                  {blog.content && (
                    <div
                      className="self-stretch justify-start text-zinc-500 text-lg font-medium leading-8 blog-content"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <RecentBlog excludeBlogId={blog._id} excludeSlug={blog.slug} />
      </div>
    </section>
  );
}