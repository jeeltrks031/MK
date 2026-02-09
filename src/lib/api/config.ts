/**
 * API Configuration
 * Configure base URL and default settings for API calls
 */

export const API_CONFIG = {
  // Base URL for API - change this to your backend URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,

  // Default timeout for requests (in milliseconds)
  TIMEOUT: 30000,

  // Default headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // Google Maps API Key
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
} as const;

/**
 * API Endpoints
 * Centralized endpoint definitions
 */
export const API_ENDPOINTS = {
  // Home endpoints
  HOME: {
    GET_TOP_PROPERTY: "/home/getTopProperty",
    GET_PROPERTY_BY_ID: "/home/getPropertyById",
    GET_LOCATIONS: "/home/locations",
    POST_EMI_CALCULATOR: "/home/emi-calculator",
    GET_PROPERTIES: "/home/properties",
    SEARCH_PROPERTIES: "/home/search-properties",
    POST_COMPARE: "/home/compare",
    POST_FAVORITE: "/home/property/favorite",
    POST_VISIT: "/home/property/visit",
    POST_JOIN_GROUP: "/home/join-group",
    POST_CONTACT_US: "/home/contact-us",
    GET_BLOGS: "/home/blogs",
    GET_BLOG_BY_ID: "/home/blog",
    BLOG_COMMENTS: (blogId: string) => `/home/blog/${blogId}/comments`,
    BLOG_COMMENT_LIKE: (commentId: string) => `/home/blog/comments/${commentId}/like`,
  },
  // Auth endpoints
  AUTH: {
    LOGIN_OR_REGISTER: "/users/login-or-register",
    VERIFY_OTP: "/users/verify-otp",
    RESEND_OTP: "/users/resend-otp",
  },

  // User Dashboard endpoints
  USER_DASHBOARD: {
    DASHBOARD: "/user_dashboard/dashboard",
    VIEWED_PROPERTIES: "/user_dashboard/my-properties/viewed",
    FAVORITE_PROPERTIES: "/user_dashboard/my-properties/favorited",
    VISITED_PROPERTIES: "/user_dashboard/my-properties/visited",
    SEARCH_HISTORY: "/user_dashboard/get_search",
    GET_PREFERENCES: "/user_dashboard/get_contact_preferences",
    SAVE_PREFERENCES: "/user_dashboard/contact_preferences",
    UPDATE_PROFILE: "/user_dashboard/update_profile",
    GET_PROFILE: "/user_dashboard/get_profile",
    RESCHEDULE_VISIT: "/user_dashboard/property/reschedule-visit"
  },

  // Add more endpoint groups as needed
  // PROPERTY: {
  //   GET_ALL: "/property/getAll",
  //   GET_BY_ID: "/property/getById",
  // },

  // USER: {
  //   GET_PROFILE: "/user/profile",
  //   UPDATE_PROFILE: "/user/profile",
  // },
} as const;
