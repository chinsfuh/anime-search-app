import axios, { AxiosInstance, CancelTokenSource } from 'axios';
import { AnimeSearchResponse, AnimeDetailResponse } from '../types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store cancel token for ongoing requests
let searchCancelToken: CancelTokenSource | null = null;

/**
 * Search anime with query and pagination
 * Cancels previous request if a new one is made
 */
export const searchAnime = async (
  query: string,
  page: number = 1
): Promise<AnimeSearchResponse> => {
  // Cancel previous request if exists
  if (searchCancelToken) {
    searchCancelToken.cancel('New search request initiated');
  }

  // Create new cancel token
  searchCancelToken = axios.CancelToken.source();

  try {
    const response = await apiClient.get<AnimeSearchResponse>('/anime', {
      params: {
        q: query,
        page: page,
        limit: 25,
      },
      cancelToken: searchCancelToken.token,
    });

    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw new Error('Request cancelled');
    }
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message ?? 'Failed to search anime');
    }
    throw new Error('An unexpected error occurred');
  } finally {
    searchCancelToken = null;
  }
};

/**
 * Get anime details by ID
 */
export const getAnimeById = async (id: number): Promise<AnimeDetailResponse> => {
  try {
    const response = await apiClient.get<AnimeDetailResponse>(`/anime/${id}/full`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message ?? 'Failed to fetch anime details');
    }
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Cancel ongoing search request
 */
export const cancelSearch = (): void => {
  if (searchCancelToken) {
    searchCancelToken.cancel('Search cancelled by user');
    searchCancelToken = null;
  }
};
