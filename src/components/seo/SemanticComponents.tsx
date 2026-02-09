import type { JSX, ReactNode } from "react";

interface SemanticSectionProps {
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "aside" | "main";
  role?: string;
  ariaLabel?: string;
}

/**
 * Semantic wrapper for major page sections
 * Improves SEO and accessibility
 */
export function SemanticSection({
  children,
  className,
  as = "section",
  role,
  ariaLabel,
}: SemanticSectionProps) {
  const Component = as as any;
  return (
    <Component className={className} role={role} aria-label={ariaLabel}>
      {children}
    </Component>
  );
}

interface SemanticHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Semantic heading component that enforces proper H1-H6 hierarchy
 * Ensures only one H1 per page for SEO best practices
 */
export function SemanticHeading({
  level,
  children,
  className,
  id,
}: SemanticHeadingProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag id={id} className={className}>
      {children}
    </HeadingTag>
  );
}

interface BreadcrumbSchema {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbSchema[];
  className?: string;
}

/**
 * Breadcrumb component with structured data markup
 * Improves SEO and user navigation
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => (
            <li key={item.url}>
              <a
                href={item.url}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {item.name}
              </a>
              {index < items.length - 1 && (
                <span className="mx-2" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
