import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AnimeState, Anime, AnimeSearchResponse, AnimeFilters, AnimeType, AnimeStatus, AnimeRating, SelectedSeason, SeasonsByType, SeasonType } from '../types/anime';
import { searchAnime, getAnimeById, getSeasonAnime, getTopAnime, getAvailableSeasons, SeasonInfo } from '../services/api';

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
  selectedSeason: null,
  topAnime: [],
  seasonsByType: {
    winter: [],
    spring: [],
    summer: [],
    fall: [],
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

// Async thunk for loading more anime (infinite scroll)
export const loadMoreAnime = createAsyncThunk<
  AnimeSearchResponse,
  { query: string; page: number; filters?: AnimeFilters },
  { rejectValue: string }
>(
  'anime/loadMore',
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

// Async thunk for fetching default anime (top anime)
export const fetchDefaultAnime = createAsyncThunk<
  AnimeSearchResponse,
  { page: number },
  { rejectValue: string }
>(
  'anime/fetchDefault',
  async ({ page }, { rejectWithValue }) => {
    try {
      const response = await getTopAnime(25, page);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Async thunk for loading more default anime (pagination without search query)
export const loadMoreDefaultAnime = createAsyncThunk<
  AnimeSearchResponse,
  { page: number },
  { rejectValue: string }
>(
  'anime/loadMoreDefault',
  async ({ page }, { rejectWithValue }) => {
    try {
      const response = await getTopAnime(25, page);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Async thunk for fetching anime by specific season
export const fetchSeasonAnime = createAsyncThunk<
  AnimeSearchResponse,
  { year: number; season: string; page: number },
  { rejectValue: string }
>(
  'anime/fetchSeason',
  async ({ year, season, page }, { rejectWithValue }) => {
    try {
      const response = await getSeasonAnime(year, season, page);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Async thunk for loading more season anime (infinite scroll for seasons)
export const loadMoreSeasonAnime = createAsyncThunk<
  AnimeSearchResponse,
  { year: number; season: string; page: number },
  { rejectValue: string }
>(
  'anime/loadMoreSeason',
  async ({ year, season, page }, { rejectWithValue }) => {
    try {
      const response = await getSeasonAnime(year, season, page);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Async thunk for fetching top anime (for banner)
export const fetchTopAnimeForBanner = createAsyncThunk<
  Anime[],
  void,
  { rejectValue: string }
>(
  'anime/fetchTopAnimeForBanner',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTopAnime(3, 1);
      return response.data.slice(0, 3);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Async thunk for fetching available seasons
export const fetchAvailableSeasons = createAsyncThunk<
  SeasonsByType,
  void,
  { rejectValue: string }
>(
  'anime/fetchAvailableSeasons',
  async (_, { rejectWithValue }) => {
    try {
      const availableSeasons = await getAvailableSeasons();

      // Group seasons by type
      const grouped: SeasonsByType = {
        winter: [],
        spring: [],
        summer: [],
        fall: [],
      };

      availableSeasons.forEach((seasonInfo: SeasonInfo) => {
        seasonInfo.seasons.forEach((season: string) => {
          const seasonType = season.toLowerCase() as SeasonType;
          if (grouped[seasonType]) {
            grouped[seasonType].push({
              year: seasonInfo.year,
              season: seasonType,
            });
          }
        });
      });

      return grouped;
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
    setSelectedSeason: (state, action: PayloadAction<SelectedSeason | null>) => {
      state.selectedSeason = action.payload;
      // Clear search query when season is selected (but keep filters - they work client-side)
      if (action.payload) {
        state.searchQuery = '';
      }
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

    // Load more anime (infinite scroll)
    builder.addCase(loadMoreAnime.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loadMoreAnime.fulfilled, (state, action) => {
      state.loading = false;
      // Append new results to existing ones
      state.searchResults = [...state.searchResults, ...action.payload.data];
      state.pagination = action.payload.pagination;
    });
    builder.addCase(loadMoreAnime.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to load more anime';
    });

    // Fetch default anime (current season)
    builder.addCase(fetchDefaultAnime.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDefaultAnime.fulfilled, (state, action) => {
      state.loading = false;
      state.searchResults = action.payload.data;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchDefaultAnime.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to fetch anime';
    });

    // Load more default anime (infinite scroll without search)
    builder.addCase(loadMoreDefaultAnime.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loadMoreDefaultAnime.fulfilled, (state, action) => {
      state.loading = false;
      // Append new results to existing ones
      state.searchResults = [...state.searchResults, ...action.payload.data];
      state.pagination = action.payload.pagination;
    });
    builder.addCase(loadMoreDefaultAnime.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to load more anime';
    });

    // Fetch season anime
    builder.addCase(fetchSeasonAnime.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSeasonAnime.fulfilled, (state, action) => {
      state.loading = false;
      state.searchResults = action.payload.data;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchSeasonAnime.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to fetch season anime';
    });

    // Load more season anime (infinite scroll for seasons)
    builder.addCase(loadMoreSeasonAnime.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loadMoreSeasonAnime.fulfilled, (state, action) => {
      state.loading = false;
      // Append new results to existing ones
      state.searchResults = [...state.searchResults, ...action.payload.data];
      state.pagination = action.payload.pagination;
    });
    builder.addCase(loadMoreSeasonAnime.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to load more season anime';
    });

    // Fetch top anime for banner
    builder.addCase(fetchTopAnimeForBanner.fulfilled, (state, action) => {
      state.topAnime = action.payload;
    });
    builder.addCase(fetchTopAnimeForBanner.rejected, (_state, action) => {
      console.error('Failed to fetch top anime:', action.payload);
    });

    // Fetch available seasons
    builder.addCase(fetchAvailableSeasons.fulfilled, (state, action) => {
      state.seasonsByType = action.payload;
    });
    builder.addCase(fetchAvailableSeasons.rejected, (_state, action) => {
      console.error('Failed to fetch available seasons:', action.payload);
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
  setSelectedSeason,
} = animeSlice.actions;
export default animeSlice.reducer;
