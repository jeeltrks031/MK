import { Property } from "@/lib/api";

// Get images array for a property (use images array if available, otherwise use single image)
const getPropertyImages = (property: Property): string[] => {
  if (property.images && property.images.length > 0) {
    return property.images;
  }
  if (property.image) {
    return [property.image];
  }
  return [];
};

export default getPropertyImages;
