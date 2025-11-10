import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setFilterType,
  setFilterStatus,
  setFilterRating,
  toggleFilterGenre,
  setFilterMinScore,
  clearAllFilters,
} from '../store/animeSlice';
import { AnimeType, AnimeStatus, AnimeRating } from '../types/anime';
import { GENRE_LIST, TYPE_OPTIONS, STATUS_OPTIONS, RATING_OPTIONS, SCORE_OPTIONS } from '../utils/genreList';

export const FilterPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.anime.filters);
  const searchResults = useAppSelector((state) => state.anime.searchResults);
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate counts for each filter option based on current search results
  const filterCounts = useMemo(() => {
    const counts = {
      types: {} as Record<string, number>,
      statuses: {} as Record<string, number>,
      ratings: {} as Record<string, number>,
      genres: {} as Record<number, number>,
      scores: {} as Record<number, number>,
    };

    searchResults.forEach((anime) => {
      // Count types
      if (anime.type) {
        const type = anime.type.toLowerCase();
        counts.types[type] = (counts.types[type] || 0) + 1;
      }

      // Count statuses
      if (anime.status) {
        const status = anime.status.toLowerCase();
        counts.statuses[status] = (counts.statuses[status] || 0) + 1;
      }

      // Count ratings
      if (anime.rating) {
        // Extract rating code from rating string
        const ratingMatch = anime.rating.match(/^(G|PG-13|PG|R\+|R -|Rx)/i);
        if (ratingMatch && ratingMatch[1]) {
          let rating = ratingMatch[1].toLowerCase().replace(/[\s-]/g, '');
          if (rating === 'r') rating = 'r17';
          counts.ratings[rating] = (counts.ratings[rating] || 0) + 1;
        }
      }

      // Count genres
      anime.genres.forEach((genre) => {
        counts.genres[genre.mal_id] = (counts.genres[genre.mal_id] || 0) + 1;
      });

      // Count by score ranges
      if (anime.score !== null) {
        if (anime.score >= 9) counts.scores[9] = (counts.scores[9] || 0) + 1;
        if (anime.score >= 8) counts.scores[8] = (counts.scores[8] || 0) + 1;
        if (anime.score >= 7) counts.scores[7] = (counts.scores[7] || 0) + 1;
        if (anime.score >= 6) counts.scores[6] = (counts.scores[6] || 0) + 1;
        if (anime.score >= 5) counts.scores[5] = (counts.scores[5] || 0) + 1;
      }
    });

    return counts;
  }, [searchResults]);

  const handleTypeChange = (type: AnimeType | null) => {
    dispatch(setFilterType(type));
  };

  const handleStatusChange = (status: AnimeStatus | null) => {
    dispatch(setFilterStatus(status));
  };

  const handleRatingChange = (rating: AnimeRating | null) => {
    dispatch(setFilterRating(rating));
  };

  const handleGenreToggle = (genreId: number) => {
    dispatch(toggleFilterGenre(genreId));
  };

  const handleScoreChange = (score: number | null) => {
    dispatch(setFilterMinScore(score));
  };

  const handleClearAll = () => {
    dispatch(clearAllFilters());
  };

  const hasActiveFilters =
    filters.type !== null ||
    filters.status !== null ||
    filters.rating !== null ||
    filters.genres.length > 0 ||
    filters.minScore !== null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
        </h2>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
            <div className="space-y-2">
              {TYPE_OPTIONS.map((option) => {
                const count = filterCounts.types[option.value] || 0;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleTypeChange(filters.type === option.value ? null : option.value as AnimeType)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.type === option.value
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex justify-between items-center">
                      <span>{option.label}</span>
                      {count > 0 && (
                        <span className={`text-xs font-semibold ${
                          filters.type === option.value ? 'text-white' : 'text-gray-500'
                        }`}>
                          ({count})
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((option) => {
                const count = filterCounts.statuses[option.value] || 0;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(filters.status === option.value ? null : option.value as AnimeStatus)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.status === option.value
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex justify-between items-center">
                      <span>{option.label}</span>
                      {count > 0 && (
                        <span className={`text-xs font-semibold ${
                          filters.status === option.value ? 'text-white' : 'text-gray-500'
                        }`}>
                          ({count})
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
            <div className="space-y-2">
              {RATING_OPTIONS.map((option) => {
                const count = filterCounts.ratings[option.value] || 0;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleRatingChange(filters.rating === option.value ? null : option.value as AnimeRating)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.rating === option.value
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex justify-between items-center">
                      <span>{option.label}</span>
                      {count > 0 && (
                        <span className={`text-xs font-semibold ${
                          filters.rating === option.value ? 'text-white' : 'text-gray-500'
                        }`}>
                          ({count})
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Score Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Score</label>
            <div className="space-y-2">
              {SCORE_OPTIONS.map((option) => {
                const count = option.value === 0 ? searchResults.length : (filterCounts.scores[option.value] || 0);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleScoreChange(option.value === 0 ? null : option.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      filters.minScore === option.value || (filters.minScore === null && option.value === 0)
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex justify-between items-center">
                      <span>{option.label}</span>
                      {count > 0 && (
                        <span className={`text-xs font-semibold ${
                          filters.minScore === option.value || (filters.minScore === null && option.value === 0)
                            ? 'text-white'
                            : 'text-gray-500'
                        }`}>
                          ({count})
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Genres Section - Always visible, full width */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Genres {filters.genres.length > 0 && `(${filters.genres.length} selected)`}
          </label>
          <div className="flex flex-wrap gap-2">
            {GENRE_LIST.map((genre) => {
              const count = filterCounts.genres[genre.id] || 0;
              return (
                <button
                  key={genre.id}
                  onClick={() => handleGenreToggle(genre.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.genres.includes(genre.id)
                      ? 'bg-primary-600 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                  }`}
                >
                  {genre.name}
                  {count > 0 && (
                    <span className={`ml-1.5 text-xs ${
                      filters.genres.includes(genre.id) ? 'text-white' : 'text-gray-500'
                    }`}>
                      ({count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
