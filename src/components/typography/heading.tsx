import React from "react";
import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Defines the heading level.
   * - `h1` through `h6`.
   */
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /**
   * The content of the heading.
   */
  children: React.ReactNode;
  /**
   * Additional CSS classes for custom styling.
   */
  className?: string;
}

/**
 * A component for rendering headings (h1-h6) with a standardized
 * font size and font weight based on the variant prop.
 *
 * @param {Object} props
 * @prop {string} [variant=h1] - The heading level.
 * @prop {React.ReactNode} children - The content of the heading.
 * @prop {string} [className=""] - Additional CSS classes for custom styling.
 *
 * @example
 * <Heading variant="h2">Heading 2</Heading>
 */
const Heading = ({
  variant = "h2",
  children,
  className = "",
}: HeadingProps) => {
  const baseClasses = {
    h1: "text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] font-bold leading-tight", // 28px → 56px
    h2: "text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-semibold leading-snug", // 24px → 48px
    h3: "text-[20px] sm:text-[24px] md:text-[32px] lg:text-[36px] font-bold leading-snug", // 20px → 36px
    h4: "text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] font-bold leading-normal", // 18px → 30px
    h5: "text-[16px] sm:text-[18px] md:text-[22px] lg:text-[24px] font-bold leading-normal", // 16px → 24px
    h6: "text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-normal leading-normal", // 14px → 20px
  };

  const Tag = variant; // Dynamically determines the tag (h1-h6)

  return <Tag className={cn(baseClasses[variant], className)}>{children}</Tag>;
};

export default Heading;
