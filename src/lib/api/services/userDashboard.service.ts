import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import type { ApiResponse } from "../types";

type PaginationMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

type PaginatedData<T> = {
    data: T[];
    pagination: PaginationMeta;
};

export type PropertyApi = {
    id: string;
    projectName: string;
    location: string;
    images?: string[];
    openingLeft?: number;
    minGroupMembers?: number;
    developerPrice?: {
        formatted: string;
    };
    offerPrice?: {
        formatted: string;
    } | null;
    discount?: {
        percentageFormatted: string;
    } | null;
    lastDayToJoin?: string;
    lastViewedAt?: string;
    relationshipManagerPhone?: string;
    isFavorite?: boolean;
};

export type SearchHistoryItem = {
    _id: string;
    searchQuery: string;
    location?: string;
    createdAt: string;
};

export type SearchHistoryGroup = {
    dateLabel: string;
    searches: SearchHistoryItem[];
};

export type PreferredLocation = {
    name: string;
    latitude: number;
    longitude: number;
};

export type PreferencesApi = {
    preferredLocations: PreferredLocation[];
    budgetMin: number | null;
    budgetMax: number | null;
    floorMin: number | null;
    floorMax: number | null;
};

export type SavePreferencesPayload = PreferencesApi;

export type GetProfileResponse = {
    user: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        countryCode: string;
        address?: string | null;
        pincode?: string | null;
        country?: string | null;
        state?: string | null;
        city?: string | null;
        isPhoneVerified: boolean;
    };
};

export type UpdateProfilePayload = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
};

export type VisitActivity = {
    _id: string;
    activityType: string;
    activityDate: string;
    visitDate: string;
    visitTime: string;
    description: string;
};

export type VisitedPropertyItem = {
    property: PropertyApi;
    lastViewedAt?: string;
    visitActivity?: VisitActivity;
    lead?: {
        _id: string;
        userId: string;
        propertyId: string;
        visitStatus: string;
    };
};

export type VisitedPropertiesResponse = {
    upcoming: VisitedPropertyItem[];
    completed: VisitedPropertyItem[];
};

export const userDashboardService = {
    getVisitedProperties: (): Promise<ApiResponse<VisitedPropertiesResponse>> =>
        apiClient.get(API_ENDPOINTS.USER_DASHBOARD.VISITED_PROPERTIES),

    getViewedProperties: (): Promise<ApiResponse<PropertyApi[]>> =>
        apiClient.get<PropertyApi[]>(
            API_ENDPOINTS.USER_DASHBOARD.VIEWED_PROPERTIES
        ),

    getFavoriteProperties: (): Promise<ApiResponse<PropertyApi[]>> =>
        apiClient.get<PropertyApi[]>(
            API_ENDPOINTS.USER_DASHBOARD.FAVORITE_PROPERTIES
        ),

    getDashboard: (): Promise<ApiResponse<any>> => {
        return apiClient.get(API_ENDPOINTS.USER_DASHBOARD.DASHBOARD);
    },

    getSearchHistory: (): Promise<ApiResponse<SearchHistoryGroup[]>> =>
        apiClient.get(API_ENDPOINTS.USER_DASHBOARD.SEARCH_HISTORY),

    getPreferences: (): Promise<ApiResponse<PreferencesApi>> =>
        apiClient.get(API_ENDPOINTS.USER_DASHBOARD.GET_PREFERENCES),

    savePreferences: (data: SavePreferencesPayload) =>
        apiClient.post(API_ENDPOINTS.USER_DASHBOARD.SAVE_PREFERENCES, data),

    getUserProfile: (): Promise<ApiResponse<GetProfileResponse>> =>
        apiClient.get(API_ENDPOINTS.USER_DASHBOARD.GET_PROFILE),

    updateUserProfile: (data: UpdateProfilePayload) =>
        apiClient.put(API_ENDPOINTS.USER_DASHBOARD.UPDATE_PROFILE, data),

    rescheduleVisit: (data: {
        propertyId: string;
        visitDate: string;
        visitTime: string;
    }): Promise<ApiResponse<{ message: string; isBookVisit: boolean }>> =>
        apiClient.put(API_ENDPOINTS.USER_DASHBOARD.RESCHEDULE_VISIT, data),

};
