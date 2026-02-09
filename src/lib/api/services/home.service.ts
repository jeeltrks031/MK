import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import type { ApiResponse } from "../types";

/**
 * Property type definition
 * Based on actual API response
 */
export interface PropertyPrice {
  value: number;
  formatted: string;
}

export interface PropertyDiscount {
  amount: number;
  amountFormatted: string;
  percentage: number;
  percentageFormatted: string;
  message: string;
  displayText: string;
}

export interface Property {
  id: string;
  projectId: string;
  projectName: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  images?: string[]; // Array of images for slider
  lastDayToJoin: string;
  groupSize: number;
  groupSizeFormatted: string;
  openingLeft: number;
  openingFormatted: string;
  targetPrice: PropertyPrice;
  developerPrice: PropertyPrice;
  discount: PropertyDiscount | null;
  offerPrice: PropertyPrice | null;
  discountPercentage: string;
  configurations: string[];
  configurationsFormatted: string;
  possessionStatus: string;
  developer: string;
  leadCount: number;
  reraId: string;
  description: string;
  relationshipManager: string;
  isFavorite?: boolean; // Favorite status from API
  isJoinGroup?: boolean; // Join group status from API
}

// Extended fields used by PDP mock response (merged with main PropertyOverview below)

export interface GroupBuyInfo {
  minGroupMembers?: number;
  currentGroupMembersCount?: number;
  progressPercentage?: number;
  isMinimumMet?: boolean;
  progressText?: string;
  message?: string;
  members?: Array<{
    userId?: string;
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
    email?: string;
    propertyTypeInterest?: string;
    joinedAt?: string;
  }>;
}

// augment Property to include PDP fields (optional)
export interface PropertyDetailResponseType {
  id: string;
  projectId: string;
  projectName: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  images?: string[]; // Array of images for slider
  lastDayToJoin: string;
  groupSize: number;
  groupSizeFormatted: string;
  openingLeft: number;
  openingFormatted: string;
  targetPrice: PropertyPrice;
  discount: PropertyDiscount | null;
  discountPercentage: string;
  configurations: string[];
  configurationsFormatted: string;
  possessionStatus: string;
  leadCount: number;
  reraId: string;
  description: string;
  // relationshipManager: string;
  isFavorite?: boolean; // Favorite status from API
  overview?: PropertyOverview;
  highlights?: string[];
  amenities?: string[];
  imageDetails?: { main?: string; thumbnails?: string[] };
  layoutPlans?: LayoutPlan[];
  neighborhood?: any;
  developer?: DeveloperInfo | string;
  relationshipManager?: { id?: string; name?: string; email?: string; phone?: string };
  // configurations?: Array<any>;
  projectSize?: string;
  landParcel?: string;
  minGroupMembers?: number;
  createdAt?: string;
  updatedAt?: string;
  groupBuy?: GroupBuyInfo;
  isAuthenticated?: boolean;
  startingPrice?: PropertyPrice;
  bookingDeadlinePrice?: PropertyPrice & { note?: string };
  developerPrice?: string;
  offerPrice?: string | PropertyPrice;
  similarProjects?: any[];
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface FiltersInfo {
  location: string | null;
  developer: string | null;
  projectName: string | null;
  possessionStatus: string | null;
  unitType: string | null;
}

export interface TopPropertiesResponse {
  results: Property[];
  data: Property[];
  pagination: PaginationInfo;
  filters: FiltersInfo;
}

// Property Detail API Response Types
export interface LocationDetails {
  full: string;
  area: string;
  city: string;
  state: string;
}

export interface PropertyOverview {
  units?: number;
  configurations?: string[];
  configurationsFormatted?: string;
  possessionStatus?: string;
  areaRange?: {
    min?: number;
    max?: number;
    formatted?: string;
  };
  reraNumber?: string;
  possessionDate?: string;
  possessionDateFormatted?: string;
  plotSize?: string;
  propertyType?: string;
}

export interface ConnectivityPoint {
  name: string;
  latitude: number;
  longitude: number;
  _id: string;
}

export interface NeighborhoodData {
  connectivity: {
    schools?: ConnectivityPoint[];
    hospitals?: ConnectivityPoint[];
    transportation?: ConnectivityPoint[];
    restaurants?: ConnectivityPoint[];
    malls?: ConnectivityPoint[];
    cafes?: ConnectivityPoint[];
  };
  mapCoordinates: ConnectivityPoint;
}

export interface LayoutPlan {
  image?: string;
  unitType?: string;
  area?: string;
  price?: string;
}

export interface DeveloperInfo {
  id?: string;
  name?: string;
  description?: string;
  logo?: string;
  city?: string;
  establishedYear?: number;
  yearsOfExperience?: number;
  totalProjects?: number;
  website?: string;
  sourcingManager?: {
    name?: string;
    mobile?: string;
    email?: string;
  };
}

export interface RelationshipManager {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ConfigurationDetail {
  unitType: string;
  subConfigurations: Array<{
    carpetArea: string;
    price: number;
    availabilityStatus: string;
    layoutPlanImages: string[];
  }>;
}

export interface GroupBuyMember {
  userId: string;
  name: string;
  profilePhoto: string | null;
  contactNumber: string;
  email: string;
  propertyTypeInterest: string;
  joinedAt: string;
}

export interface GroupBuy {
  minGroupMembers: number;
  currentGroupMembersCount: number;
  progressPercentage: number;
  isMinimumMet: boolean;
  progressText: string;
  message: string;
  members: GroupBuyMember[];
}

export interface PropertyDetail {
  id: string;
  projectId: string;
  projectName: string;
  location: string;
  latitude: number;
  longitude: number;
  isFavorite: boolean;
  isJoinGroup: boolean;
  isBookVisit?: boolean;
  isAuthenticated: boolean;
  locationDetails: LocationDetails;
  startingPrice: PropertyPrice;
  bookingDeadlinePrice?: {
    value: number;
    formatted: string;
    note?: string;
  };
  developerPrice: string;
  offerPrice: string;
  discountPercentage: string;
  reraId: string;
  reraQrImage?: string;
  reraDetailsLink?: string;
  overview: PropertyOverview;
  description: string;
  rating: number;
  highlights: string[];
  amenities: string[];
  images: string[];
  image: string;
  imageDetails: {
    main: string;
    thumbnails: string[];
  };
  layoutPlans: LayoutPlan[];
  neighborhood: NeighborhoodData;
  developer: DeveloperInfo;
  relationshipManager: RelationshipManager;
  configurations: ConfigurationDetail[];
  projectSize: string;
  landParcel: string;
  minGroupMembers: number;
  createdAt: string;
  updatedAt: string;
  groupBuy: GroupBuy;
}

export interface SimilarProject {
  id: string;
  projectId: string;
  projectName: string;
  images: string[];
  imageUrl: string | null;
  lastDayToJoin?: string | null;
  status: string;
  groupSize: number;
  configuration: string;
  targetPrice: PropertyPrice;
  disclaimerPrice: PropertyPrice;
  discount: PropertyDiscount | null;
  location: string;
  latitude: number;
  longitude: number;
  offerPrice: number;
  discountPercentage: string;
  similarityScore: number;
}

export interface PropertyDetailsResponse {
  property: PropertyDetail;
  similarProjects: SimilarProject[];
}

/**
 * Locations API Response types
 */
export interface LocationWithCount {
  propertyCount: number;
  location: string;
}

export interface LocationsResponse {
  locations: string[];
  locationsWithCount: LocationWithCount[];
  total: number;
}

/**
 * Blog API Response types
 */
export interface Blog {
  _id: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  authorImage: string;
  tags: string[];
  bannerImage: string;
  slug: string;
  date: string;
  views: number;
  createdAt: string;
  content?: string; // HTML content for blog listing
}

export interface BlogDetail extends Omit<Blog, "author" | "authorImage"> {
  author: {
    id: string;
    name: string;
    email: string;
    profileImage: string;
  };
  galleryImages?: string[];
  content: string;
  updatedAt?: string;
}

export interface BlogsResponse {
  data: Blog[];
  pagination?: PaginationInfo;
}

export interface BlogDetailResponse {
  data: BlogDetail;
}

export interface BlogComment {
  _id: string;
  content: string;
  createdAt: string;
  parentComment?: string | null;
  author: {
    id: string;
    name: string;
    profileImage?: string;
  };
  likedBy: string[];
  replies?: BlogComment[];
}


/**
 * EMI Calculator API types
 */
export interface EMIAmount {
  value: number;
  formatted: string;
  display?: string;
}

export interface EMIBreakdown {
  principal: number;
  interest: number;
  principalPercentage: number;
  interestPercentage: number;
}

export interface EMIInput {
  loanAmount: number;
  rateOfInterest: number;
  loanTenure: number;
  currency: string;
}

export interface EMICalculatorResponse {
  monthlyEMI: EMIAmount;
  principalAmount: EMIAmount;
  totalInterest: EMIAmount;
  totalAmountPayable: EMIAmount;
  emiBreakdown: EMIBreakdown;
  input: EMIInput;
  totalPrincipalPaid: EMIAmount;
  disclaimer: string;
}

export interface EMICalculatorRequest {
  loanAmount: string;
  rateOfInterest: number;
  loanTenure: number;
}

/**
 * Compare API types
 */
export interface CompareRequest {
  propertyIds: string[];
}

export interface BudgetRange {
  min: number;
  max: number;
  formatted: string;
}

export interface AreaRange {
  min: number;
  max: number;
  formatted: string;
}

export interface CompareProperty {
  id: string;
  projectId: string;
  projectName: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  pinLabel?: string; // Label for map pin (A, B, C, D, etc.)
  mainImage: string | null;
  developer: string;
  developerId?: string;
  developerPrice: string | number;
  offerPrice: number | null;
  discountPercentage: string;
  budget: BudgetRange;
  area: AreaRange;
  configurations: string[];
  configurationsFormatted: string;
  propertyType: string;
  possessionStatus: string;
  possessionDate?: string;
  possessionDateFormatted?: string;
  isFavorite?: boolean; // Favorite status from API
  floorPlans?: Array<{
    image: string;
    unitType: string;
    carpetArea: string;
    price: number;
    availabilityStatus: string;
  }>;
  relationshipManager?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  } | null;
  [key: string]: unknown; // For additional comparison fields
}

export interface CompareResponse {
  properties: CompareProperty[];
  comparison: Record<string, unknown>; // Comparison data structure
}

export interface SearchPropertiesResponse {
  data: Property[];
  pagination: PaginationInfo;
}

/**
 * Home API Service
 * All home-related API calls
 */
export const homeService = {
  /**
   * Get top properties
   * Example: GET /api/home/getTopProperty?limit=6&page=1&location=Surat
   */
  getTopProperty: async (params?: {
    page?: number;
    limit?: number;
    location?: string;
  }): Promise<ApiResponse<TopPropertiesResponse>> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params?.location) {
      queryParams.append("location", params.location);
    }

    const endpoint = queryParams.toString()
      ? `${API_ENDPOINTS.HOME.GET_TOP_PROPERTY}?${queryParams.toString()}`
      : API_ENDPOINTS.HOME.GET_TOP_PROPERTY;

    return apiClient.get<TopPropertiesResponse>(endpoint);
  },

  /**
   * Get property by ID
   * Example: GET /api/home/getPropertyById/{propertyId}
   */
  getPropertyById: async (
    id: string,
  ): Promise<ApiResponse<PropertyDetailsResponse>> => {
    return apiClient.get<PropertyDetailsResponse>(
      `${API_ENDPOINTS.HOME.GET_PROPERTY_BY_ID}/${id}`,
    );
  },

  /**
   * Get locations
   * Example: GET /api/home/locations
   */
  getLocations: async (): Promise<ApiResponse<LocationsResponse>> => {
    return apiClient.get<LocationsResponse>(API_ENDPOINTS.HOME.GET_LOCATIONS);
  },

  /**
   * Calculate EMI
   * Example: POST /api/home/emi-calculator
   */
  calculateEMI: async (
    data: EMICalculatorRequest,
  ): Promise<ApiResponse<EMICalculatorResponse>> => {
    return apiClient.post<EMICalculatorResponse>(
      API_ENDPOINTS.HOME.POST_EMI_CALCULATOR,
      data,
    );
  },

  /**
   * Get properties for comparison
   * Example: GET /api/home/properties?latitude=28.4089&longitude=77.0418&page=1&limit=3&search=property_name
   */
  getProperties: async (params?: {
    latitude?: number;
    longitude?: number;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<TopPropertiesResponse>> => {
    const queryParams = new URLSearchParams();

    if (params?.latitude !== undefined) {
      queryParams.append("latitude", params.latitude.toString());
    }
    if (params?.longitude !== undefined) {
      queryParams.append("longitude", params.longitude.toString());
    }
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }

    const endpoint = queryParams.toString()
      ? `${API_ENDPOINTS.HOME.GET_PROPERTIES}?${queryParams.toString()}`
      : API_ENDPOINTS.HOME.GET_PROPERTIES;

    return apiClient.get<TopPropertiesResponse>(endpoint);
  },

  /**
   * Compare properties
   * Example: POST /api/home/compare
   */
  compareProperties: async (
    data: CompareRequest,
  ): Promise<ApiResponse<CompareResponse>> => {
    return apiClient.post<CompareResponse>(
      API_ENDPOINTS.HOME.POST_COMPARE,
      data,
    );
  },

  /**
   * Add/Remove property from favorites
   * POST /api/home/property/favorite
   */
  toggleFavorite: async (
    propertyId: string,
  ): Promise<ApiResponse<{ message: string; isFavorite: boolean }>> => {
    return apiClient.post<{ message: string; isFavorite: boolean }>(
      API_ENDPOINTS.HOME.POST_FAVORITE,
      { propertyId },
    );
  },

  /**
   * Book a visit
   * POST /api/home/property/visit
   */
  bookVisit: async (data: {
    propertyId: string;
    visitDate: string;
    visitTime: string;
  }): Promise<ApiResponse<{ message: string; isBookVisit: boolean }>> => {
    return apiClient.post<{ message: string; isBookVisit: boolean }>(
      API_ENDPOINTS.HOME.POST_VISIT,
      data,
    );
  },

  searchProperties: async (params: {
    city?: string;
    searchText?: string;
    priceMin?: string;
    priceMax?: string;
    bhk?: string;
    projectStatus?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<SearchPropertiesResponse>> => {
    const queryParams = new URLSearchParams();

    if (params.city) queryParams.append("city", params.city);
    if (params.searchText) queryParams.append("searchText", params.searchText);
    if (params.priceMin) queryParams.append("priceMin", params.priceMin);
    if (params.priceMax) queryParams.append("priceMax", params.priceMax);
    if (params.bhk) queryParams.append("bhk", params.bhk);
    if (params.projectStatus)
      queryParams.append("projectStatus", params.projectStatus);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const endpoint = queryParams.toString()
      ? `${API_ENDPOINTS.HOME.SEARCH_PROPERTIES}?${queryParams.toString()}`
      : API_ENDPOINTS.HOME.SEARCH_PROPERTIES;

    return apiClient.get<SearchPropertiesResponse>(endpoint);
  },

  /**
   * Join group for a property
   * POST /api/home/join-group
   */
  joinGroup: async (
    propertyId: string,
  ): Promise<ApiResponse<{ message: string; isJoinGroup: boolean }>> => {
    return apiClient.post<{ message: string; isJoinGroup: boolean }>(
      API_ENDPOINTS.HOME.POST_JOIN_GROUP,
      { propertyId },
    );
  },

  /**
   * Get all blogs
   * GET /api/home/blogs?page=1&limit=20
   * Response structure: { success: true, data: Blog[], pagination: PaginationInfo }
   */
  getBlogs: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Blog[]>> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const endpoint = queryParams.toString()
      ? `${API_ENDPOINTS.HOME.GET_BLOGS}?${queryParams.toString()}`
      : API_ENDPOINTS.HOME.GET_BLOGS;

    return apiClient.get<Blog[]>(endpoint);
  },

  /**
   * Get blog by ID
   * GET /api/home/blog/:blogId
   * Response structure: { success: true, data: BlogDetail }
   */
  getBlogById: async (
    blogId: string,
  ): Promise<ApiResponse<BlogDetail>> => {
    return apiClient.get<BlogDetail>(
      `${API_ENDPOINTS.HOME.GET_BLOG_BY_ID}/${blogId}`,
    );
  },

  /**
   * Contact Us form submission
   * POST /api/home/contact-us
   * Example: POST /api/home/contact-us
   */
  contactUs: async (data: {
    firstName: string;
    phoneNumber: string;
    email: string;
    notes: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.post<{ message: string }>(
      API_ENDPOINTS.HOME.POST_CONTACT_US,
      data,
    );
  },

};
