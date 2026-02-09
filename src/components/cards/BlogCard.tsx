import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
interface BlogCardProps {
  image: StaticImageData | string;
  date: string;
  title: string;
  description?: string;
  content?: string;
  category?: string | { id?: string; name: string };
  buttonText?: string;
  href: string;
  className?: string;
}

export default function BlogCard({
  image,
  date,
  title,
  description,
  content,
  category,
  buttonText = "Read More",
  href,
  className = "",
}: BlogCardProps) {

  const getPlainText = (html?: string, fallback?: string) => {
    return (html || fallback || "")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  return (
    <div
      className={`flex flex-col h-full items-stretch ${className}`}
    >
      {/* Image */}
      <div className="relative w-full h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-tl-3xl rounded-tr-3xl"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 self-stretch p-3.5 bg-white rounded-bl-3xl rounded-br-3xl shadow-[0px_4px_50px_0px_rgba(0,0,0,0.10)]">

        {/* TEXT CONTENT */}
        <div className="flex flex-col flex-1 gap-2.5">
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <span className="text-[#ACACAC] text-[14px] font-medium">
              {date}
            </span>

            {category && (
              <span className="px-3 py-1 text-[14px] font-medium bg-[#F4F8FF] text-[#000000] rounded">
                {typeof category === "string"
                  ? category
                  : category.name}
              </span>
            )}
          </div>

          <h3 className="text-[#000000] text-[24px] font-bold line-clamp-2">
            {title}
          </h3>

          <p className="text-[#373737] text-[14px] font-medium leading-6 line-clamp-2">
            {getPlainText(content, description)}
          </p>
        </div>

        <Link
          href={href}
          className="mt-2 px-7 py-2.5 bg-[#1C4692] hover:bg-[#1c4692e6]
          rounded-[110px] inline-flex justify-center items-center
          text-white text-lg font-semibold w-fit transition-colors">
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
