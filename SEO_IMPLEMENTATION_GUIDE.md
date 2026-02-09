# SEO Best Practices Implementation Guide

## Overview
This repository now includes comprehensive SEO best practices for improved search engine rankings and accessibility.

## Components & Utilities

### 1. **SEO Utilities** (`src/lib/seo.ts`)
- `generateMetadata()`: Creates standardized metadata for pages
- Supports Open Graph, Twitter Cards, canonical URLs, robots directives
- Consistent metadata structure across all pages

**Usage:**
```tsx
import { generateMetadata } from "@/lib/seo";

export const metadata = generateMetadata({
  title: "Page Title",
  description: "Page description (50-160 chars)",
  keywords: ["keyword1", "keyword2"],
  ogImage: "https://...",
  canonical: "https://...",
});
```

### 2. **Schema Markup** (`src/lib/schema-markup.tsx`)
- `SchemaMarkup`: Generic component for JSON-LD structured data
- Pre-built schemas: Organization, LocalBusiness, WebPage, Article, FAQ
- Improves rich snippets in Google Search results

**Usage:**
```tsx
import { SchemaMarkup, organizationSchema } from "@/lib/schema-markup";

<SchemaMarkup type="Organization" data={organizationSchema} />
```

### 3. **Semantic Components** (`src/components/seo/SemanticComponents.tsx`)
- `SemanticSection`: Wrapper for semantic HTML sections
- `SemanticHeading`: Enforces proper heading hierarchy (H1-H6)
- `Breadcrumb`: Breadcrumb navigation with structured data

**Usage:**
```tsx
import { SemanticSection, SemanticHeading, Breadcrumb } from "@/components/seo/SemanticComponents";

<SemanticSection as="section" ariaLabel="Hero Section">
  <SemanticHeading level={1}>Main Heading</SemanticHeading>
</SemanticSection>

<Breadcrumb items={[
  { name: "Home", url: "/" },
  { name: "Products", url: "/products" }
]} />
```

### 4. **SEO Optimized Components** (`src/components/seo/SEOOptimized.tsx`)
- `SEOImage`: Image component with required alt text
- `SEOLink`: Accessible link component with aria labels
- `MetaDescription`: Meta description injector
- `OpenGraphMeta`: Social sharing meta tags

## Key Implementations

### Root Layout (`src/app/layout.tsx`)
✅ Comprehensive metadata with:
- Structured data (Organization schema)
- Open Graph tags
- Twitter Card metadata
- Robots directives
- Canonical URLs
- Proper viewport settings

### Homepage (`src/app/(home)/page.tsx`)
✅ Page-specific metadata with relevant keywords
✅ Semantic structure
✅ Proper heading hierarchy

### Sitemap (`src/app/sitemap.ts`)
✅ Auto-generated sitemap with:
- All major routes
- Change frequency
- Priority levels
- Last modified dates
✅ Accessible at `/sitemap.xml`

### Robots.txt (`src/app/robots.ts`)
✅ Configured to:
- Allow search engines (except GPTBot, CCBot)
- Disallow sensitive routes (/dashboard, /admin, /api)
- Set crawl delay
- Link to sitemap

## Best Practices

### 1. Heading Hierarchy
- **ONE H1 per page** (usually the main page title)
- Use H2, H3, etc. for subsections in logical order
- Never skip heading levels (H1 → H3)

```tsx
<SemanticHeading level={1}>Main Page Title</SemanticHeading>
<SemanticHeading level={2}>Section</SemanticHeading>
<SemanticHeading level={3}>Subsection</SemanticHeading>
```

### 2. Meta Descriptions
- Length: 50-160 characters (optimal: 120-160)
- Include target keywords naturally
- Write for humans, not just search engines
- Make it compelling to encourage clicks

### 3. Image Alt Text
- Always required (enforce with `SEOImage`)
- Descriptive but concise (5-15 words)
- Include keywords when relevant
- Avoid keyword stuffing

```tsx
<SEOImage 
  src="/property.jpg" 
  alt="Modern apartment with city view in Hyderabad" 
/>
```

### 4. URL Structure
- Lowercase, hyphen-separated words
- Descriptive and concise
- Avoid special characters
- Example: `/modern-apartments-hyderabad` ✓

### 5. Internal Linking
- Link to relevant internal pages
- Use descriptive anchor text
- Maintain keyword relevance
- Help with site structure

### 6. Content Optimization
- Natural keyword placement (1-2% density)
- First 100 words should contain main keyword
- Answer user intent clearly
- Use short paragraphs (2-3 sentences)

### 7. Mobile Responsiveness
✅ Already implemented
- Responsive design
- Fast load times
- Touch-friendly elements
- Readable font sizes

## Meta Tags Reference

### Standard Meta Tags
```tsx
<title>Page Title - Brand Name</title>
<meta name="description" content="..." />
<meta name="keywords" content="..." />
<meta name="robots" content="index, follow" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### Open Graph (Social Sharing)
```tsx
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:url" content="..." />
<meta property="og:type" content="website" />
```

### Twitter Cards
```tsx
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

## Testing & Monitoring

### Tools to Use
1. **Google Search Console**: Monitor indexing, traffic, errors
2. **Google PageSpeed Insights**: Performance optimization
3. **Lighthouse**: Accessibility and performance audits
4. **Schema.org Validator**: Test structured data
5. **Meta Tags Inspector**: Preview social sharing

### Regular Tasks
- Monitor Google Search Console for errors
- Check Core Web Vitals monthly
- Audit internal links quarterly
- Update sitemap when adding new pages
- Review keyword rankings monthly

## Files Reference

| File | Purpose |
|------|---------|
| `src/lib/seo.ts` | SEO metadata utilities |
| `src/lib/schema-markup.tsx` | Structured data schemas |
| `src/components/seo/SemanticComponents.tsx` | Semantic HTML components |
| `src/components/seo/SEOOptimized.tsx` | SEO-optimized elements |
| `src/app/sitemap.ts` | XML sitemap generation |
| `src/app/robots.ts` | Robots.txt configuration |
| `src/app/layout.tsx` | Root layout with SEO meta |

## Environment Variables (Optional)

```env
NEXT_PUBLIC_SITE_URL=https://milkekhareedo.com
```

## Next Steps

1. ✅ Update all page metadata using `generateMetadata()`
2. ✅ Add breadcrumbs to multi-level pages
3. ✅ Implement semantic HTML throughout
4. ✅ Optimize images with proper alt text
5. ✅ Add FAQ schema markup for FAQ sections
6. ✅ Submit sitemap to Google Search Console
7. ✅ Monitor performance in Search Console
8. ✅ Update sitemap when adding new pages
