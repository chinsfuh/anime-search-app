import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AnimeState, Anime, AnimeSearchResponse, AnimeDetailResponse, AnimeFilters, AnimeType, AnimeStatus, AnimeRating } from '../types/anime';
import { searchAnime, getAnimeById } from '../services/api';

const initialState: AnimeState = {
  searchResults: [],
  selectedAnime: null,
  loading: false,
  error: null,
  pagination: null,
  searchQuery: '',
  currentPage: 1,
  filters: {
    type: null,
    status: null,
    rating: null,
    genres: [],
    minScore: null,
    orderBy: null,
    sort: 'desc',
  },
};

// Async thunks
export const fetchAnimeSearch = createAsyncThunk<
  AnimeSearchResponse,
  { query: string; page: number; filters?: AnimeFilters },
  { rejectValue: string }
>(
  'anime/fetchSearch',
  async ({ query, page, filters }, { rejectWithValue }) => {
    try {
      const response = await searchAnime(query, page, filters);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchAnimeDetail = createAsyncThunk<
  Anime,
  number,
  { rejectValue: string }
>(
  'anime/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getAnimeById(id);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedAnime: (state) => {
      state.selectedAnime = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.pagination = null;
      state.searchQuery = '';
    },
    setFilterType: (state, action: PayloadAction<AnimeType | null>) => {
      state.filters.type = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<AnimeStatus | null>) => {
      state.filters.status = action.payload;
    },
    setFilterRating: (state, action: PayloadAction<AnimeRating | null>) => {
      state.filters.rating = action.payload;
    },
    setFilterGenres: (state, action: PayloadAction<number[]>) => {
      state.filters.genres = action.payload;
    },
    toggleFilterGenre: (state, action: PayloadAction<number>) => {
      const genreId = action.payload;
      const index = state.filters.genres.indexOf(genreId);
      if (index > -1) {
        state.filters.genres.splice(index, 1);
      } else {
        state.filters.genres.push(genreId);
      }
    },
    setFilterMinScore: (state, action: PayloadAction<number | null>) => {
      state.filters.minScore = action.payload;
    },
    clearAllFilters: (state) => {
      state.filters = {
        type: null,
        status: null,
        rating: null,
        genres: [],
        minScore: null,
        orderBy: null,
        sort: 'desc',
      };
    },
  },
  extraReducers: (builder) => {
    // Search anime
    builder.addCase(fetchAnimeSearch.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAnimeSearch.fulfilled, (state, action) => {
      state.loading = false;
      state.searchResults = action.payload.data;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchAnimeSearch.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to fetch anime';
    });

    // Fetch anime detail
    builder.addCase(fetchAnimeDetail.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAnimeDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedAnime = action.payload;
    });
    builder.addCase(fetchAnimeDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to fetch anime details';
    });
  },
});

export const {
  setSearchQuery,
  setCurrentPage,
  clearError,
  clearSelectedAnime,
  clearSearchResults,
  setFilterType,
  setFilterStatus,
  setFilterRating,
  setFilterGenres,
  toggleFilterGenre,
  setFilterMinScore,
  clearAllFilters,
} = animeSlice.actions;
export default animeSlice.reducer;
