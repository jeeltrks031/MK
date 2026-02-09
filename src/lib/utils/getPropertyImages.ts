import { Property } from "@/lib/api/services/home.service";

/**
 * Extract images array from property object
 * Returns array of image URLs, prefers images array over single image
 */
export function getPropertyImages(property: Property): string[] {
  if (property.images && property.images.length > 0) {
    return property.images;
  }
  if (property.image) {
    return [property.image];
  }
  return [];
}

export default getPropertyImages;
