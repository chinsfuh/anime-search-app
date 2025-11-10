import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AnimeState, Anime, AnimeSearchResponse, AnimeDetailResponse } from '../types/anime';
import { searchAnime, getAnimeById } from '../services/api';

const initialState: AnimeState = {
  searchResults: [],
  selectedAnime: null,
  loading: false,
  error: null,
  pagination: null,
  searchQuery: '',
  currentPage: 1,
};

// Async thunks
export const fetchAnimeSearch = createAsyncThunk<
  AnimeSearchResponse,
  { query: string; page: number },
  { rejectValue: string }
>(
  'anime/fetchSearch',
  async ({ query, page }, { rejectWithValue }) => {
    try {
      const response = await searchAnime(query, page);
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

export const { setSearchQuery, setCurrentPage, clearError, clearSelectedAnime } = animeSlice.actions;
export default animeSlice.reducer;
