import axios, { AxiosInstance, CancelTokenSource, AxiosError } from "axios";
import {
  AnimeSearchResponse,
  AnimeDetailResponse,
  AnimeFilters,
} from "../types/anime";

const BASE_URL = "https://api.jikan.moe/v4";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Store cancel token for ongoing requests
let searchCancelToken: CancelTokenSource | null = null;

// Rate limiting tracking
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 350; // ~3 requests per second

/**
 * Handle API errors with user-friendly messages
 */
const handleApiError = (error: unknown): never => {
  if (axios.isCancel(error)) {
    // Cancellation is not an error for the user
    console.log("Search request cancelled:", error.message);
    throw error; // optional: could return empty results instead
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      error?: string;
      type?: string;
    }>;
    const status = axiosError.response?.status;
    const responseData = axiosError.response?.data;

    switch (status) {
      case 400:
        throw new Error(
          responseData?.message ||
            "Your request seems invalid. Please check your search and try again."
        );

      case 404:
        throw new Error(
          "No results found for your search. Try using a different keyword."
        );

      case 429:
        throw new Error(
          "You're searching too quickly! Please wait a few seconds before trying again."
        );

      case 500:
      case 502:
      case 503:
        throw new Error(
          "The anime database is currently unavailable. Please try again in a moment."
        );

      default:
        if (!axiosError.response) {
          throw new Error(
            "Unable to connect. Please check your internet connection and try again."
          );
        }
        throw new Error(
          responseData?.message ||
            responseData?.error ||
            "Something went wrong while loading anime data. Please try again later."
        );
    }
  }

  if (error instanceof Error) throw error;

  throw new Error(
    "An unexpected error occurred. Please refresh the page or try again later."
  );
};

/**
 * Rate limiting helper - ensures minimum interval between requests
 */
const enforceRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  lastRequestTime = Date.now();
};

/**
 * Search anime with query, pagination, and filters
 * Cancels previous request if a new one is made
 * Implements rate limiting to comply with Jikan API limits (3 req/sec, 60 req/min)
 */
export const searchAnime = async (
  query: string,
  page: number = 1,
  filters?: AnimeFilters
): Promise<AnimeSearchResponse> => {
  // Cancel previous request if exists (race condition prevention)
  if (searchCancelToken) {
    searchCancelToken.cancel("New search request initiated");
    searchCancelToken = null;
  }

  const currentCancelToken = axios.CancelToken.source();
  searchCancelToken = currentCancelToken;

  await enforceRateLimit();

  // Build query parameters
  const params: Record<string, string | number> = {
    q: query,
    page: page,
    limit: 25,
  };

  if (filters) {
    if (filters.type) params["type"] = filters.type;
    if (filters.status) params["status"] = filters.status;
    if (filters.rating) params["rating"] = filters.rating;
    if (filters.genres.length > 0) params["genres"] = filters.genres.join(",");
    if (filters.minScore !== null) params["min_score"] = filters.minScore;
    if (filters.orderBy) params["order_by"] = filters.orderBy;
    params["sort"] = filters.sort;
  }

  try {
    const response = await apiClient.get<AnimeSearchResponse>("/anime", {
      params,
      cancelToken: currentCancelToken.token,
    });

    if (!response.data || !Array.isArray(response.data.data)) {
      if (searchCancelToken === currentCancelToken) searchCancelToken = null;
      throw new Error("Invalid response format from server");
    }

    if (searchCancelToken === currentCancelToken) searchCancelToken = null;
    return response.data;
  } catch (error) {
    if (searchCancelToken === currentCancelToken) searchCancelToken = null;

    // **Ignore cancelled requests for the user**
    if (axios.isCancel(error)) {
      console.log("Request cancelled:", error.message);
      return {
        data: [],
        pagination: { last_visible_page: 1, current_page: page, has_next_page: false },
      } as AnimeSearchResponse;
    }

    return handleApiError(error);
  }
};

/**
 * Get anime details by ID
 */
export const getAnimeById = async (
  id: number
): Promise<AnimeDetailResponse> => {
  await enforceRateLimit();

  try {
    const response = await apiClient.get<AnimeDetailResponse>(`/anime/${id}/full`);
    if (!response.data || !response.data.data) {
      throw new Error("Invalid response format from server");
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Cancel ongoing search request
 */
export const cancelSearch = (): void => {
  if (searchCancelToken) {
    searchCancelToken.cancel("Search cancelled by user");
    searchCancelToken = null;
  }
};