import type { ReactNode } from "react";

interface SEOImageProps extends React.ComponentProps<"img"> {
  alt: string; // Required for SEO
  title?: string;
  loading?: "lazy" | "eager";
}

/**
 * SEO-optimized image component
 * - Enforces alt text (required)
 * - Supports lazy loading by default
 * - Accessible with proper attributes
 */
export function SEOImage({
  alt,
  title,
  loading = "lazy",
  ...props
}: SEOImageProps) {
  return (
    <img
      {...props}
      alt={alt}
      title={title || alt}
      loading={loading}
      decoding="async"
    />
  );
}

interface SEOLinkProps extends React.ComponentProps<"a"> {
  children: ReactNode;
  ariaLabel?: string;
}

/**
 * SEO-optimized link component
 * - Accessible with proper aria labels
 * - Semantic HTML
 */
export function SEOLink({ children, ariaLabel, ...props }: SEOLinkProps) {
  return (
    <a {...props} aria-label={ariaLabel}>
      {children}
    </a>
  );
}

interface MetaDescriptionProps {
  content: string;
}

/**
 * Component to inject meta description
 * Recommended length: 50-160 characters
 */
export function MetaDescription({ content }: MetaDescriptionProps) {
  return <meta name="description" content={content} />;
}

interface OpenGraphProps {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: string;
}

/**
 * Component to inject Open Graph meta tags
 * Improves social media sharing preview
 */
export function OpenGraphMeta({
  title,
  description,
  image,
  url,
  type = "website",
}: OpenGraphProps) {
  return (
    <>
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
    </>
  );
}
