import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAnimeSearch, fetchSeasonAnime, setSearchQuery, setCurrentPage, setSelectedSeason } from '../store/animeSlice';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from '../components/SearchBar';
import { AnimeCard } from '../components/AnimeCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { FilterPanel } from '../components/FilterPanel';
import { ScrollToTop } from '../components/ScrollToTop';
import { TopTrendingBanner } from '../components/TopTrendingBanner';
import { Pagination } from '../components/Pagination';
import { Marquee } from '../components/Marquee';
import { NavigationMenu } from '../components/NavigationMenu';
import { Footer } from '../components/Footer';

export const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { searchResults, loading, error, pagination, currentPage, filters, searchQuery, selectedSeason } = useAppSelector(
    (state) => state.anime
  );

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(localSearchQuery, 250);

  // Initialize season from URL or set default (Fall 2025)
  useEffect(() => {
    const seasonParam = searchParams.get('season');

    if (seasonParam) {
      // URL has season parameter - use it
      const [year, season] = seasonParam.split('/');
      if (year && season) {
        const yearNum = parseInt(year);
        const needsUpdate = !selectedSeason ||
          selectedSeason.year !== yearNum ||
          selectedSeason.season !== season;

        if (needsUpdate) {
          dispatch(setSelectedSeason({ year: yearNum, season }));
          dispatch(setCurrentPage(1));
        }
      }
    } else if (!selectedSeason) {
      // No URL parameter and no season selected - set default
      dispatch(setSelectedSeason({ year: 2025, season: 'fall' }));
      dispatch(setCurrentPage(1));
    }
  }, [searchParams, selectedSeason, dispatch]);

  // Effect for debounced search - resets to page 1
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      dispatch(setSearchQuery(debouncedSearchQuery));
      dispatch(setCurrentPage(1));
    } else if (searchQuery) {
      dispatch(setSearchQuery(''));
      dispatch(setCurrentPage(1));
    }
  }, [debouncedSearchQuery, searchQuery, dispatch]);

  // Effect for fetching - handles search and season
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      dispatch(fetchAnimeSearch({ query: debouncedSearchQuery, page: currentPage, filters }));
    } else if (selectedSeason) {
      dispatch(fetchSeasonAnime({ year: selectedSeason.year, season: selectedSeason.season, page: currentPage }));
    }
  }, [currentPage, debouncedSearchQuery, selectedSeason, filters, dispatch]);

  // Optimized handlers with useCallback
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchQuery(value);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch]);

  // Optimized client-side filtering with useMemo
  const filteredResults = useMemo(() => {
    // Don't apply client-side filtering during search (server-side filtering)
    if (debouncedSearchQuery) {
      return searchResults;
    }

    // Apply client-side filters when browsing by season
    return searchResults.filter(anime => {
      // Filter by type
      if (filters.type && anime.type?.toLowerCase() !== filters.type.toLowerCase()) {
        return false;
      }

      // Filter by status
      if (filters.status && anime.status?.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }

      // Filter by rating
      if (filters.rating) {
        const animeRating = anime.rating?.toLowerCase().replace(/[\s-]/g, '');
        const filterRating = filters.rating.toLowerCase().replace(/[\s-]/g, '');
        if (!animeRating?.includes(filterRating)) {
          return false;
        }
      }

      // Filter by genres
      if (filters.genres.length > 0) {
        const animeGenreIds = anime.genres?.map(g => g.mal_id) || [];
        const hasAllGenres = filters.genres.every(genreId => animeGenreIds.includes(genreId));
        if (!hasAllGenres) {
          return false;
        }
      }

      // Filter by min score
      if (filters.minScore !== null && anime.score !== null) {
        if (anime.score < filters.minScore) {
          return false;
        }
      }

      return true;
    });
  }, [searchResults, debouncedSearchQuery, filters]);

  return (
    <>
      {/* Marquee - Full width above everything */}
      <Marquee />

      <div className="container mx-auto px-4 pb-8">
        {/* Top Trending Banner */}
        <TopTrendingBanner />

        <div className="mb-6">
          <SearchBar
            value={localSearchQuery}
            onChange={handleSearchChange}
            placeholder="Search for anime (e.g., Naruto, One Piece)..."
          />
        </div>

        {/* Seasonal Navigation Menu */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
              Browse by Season
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Select a season to discover anime from that time period
            </p>
          </div>
          <NavigationMenu />
        </div>

      {/* Show helpful tip when searching */}
      {!selectedSeason && debouncedSearchQuery && (
        <div className="max-w-3xl mx-auto mb-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💡 <strong>Tip:</strong> Combine search terms with filters below for more precise results!
          </p>
        </div>
      )}

      {/* Show season browsing info */}
      {selectedSeason && !debouncedSearchQuery && (
        <div className="max-w-3xl mx-auto mb-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🗓️ Browsing <strong>{selectedSeason.season.charAt(0).toUpperCase() + selectedSeason.season.slice(1)} {selectedSeason.year}</strong> anime.
            Use filters below to narrow down results further!
          </p>
        </div>
      )}

      {/* Show search info */}
      {debouncedSearchQuery && (
        <div className="max-w-3xl mx-auto mb-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🔍 Searching for <strong>"{debouncedSearchQuery}"</strong>.
            Use filters below to refine your search results!
          </p>
        </div>
      )}

      {/* Always show FilterPanel */}
      <FilterPanel />

      {error && (
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading && <LoadingSkeleton />}

      {!loading && !error && filteredResults.length > 0 && (
        <>
          {debouncedSearchQuery && (
            <div className="mb-4 text-gray-600 dark:text-gray-400 text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Search Results for "{debouncedSearchQuery}"
              </h2>
              <p>Found {pagination?.items.total ?? 0} results</p>
            </div>
          )}
          {!debouncedSearchQuery && selectedSeason && (
            <div className="mb-4 text-gray-600 dark:text-gray-400 text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {selectedSeason.season.charAt(0).toUpperCase() + selectedSeason.season.slice(1)} {selectedSeason.year} Anime
              </h2>
              <p>
                {filteredResults.length === searchResults.length
                  ? `Found ${pagination?.items.total ?? searchResults.length} anime total`
                  : `Showing ${filteredResults.length} of ${searchResults.length} anime on this page (filtered from ${pagination?.items.total ?? 0} total)`
                }
              </p>
              {pagination && pagination.items.total > searchResults.length && (
                <p className="text-xs mt-1">
                  Viewing page {currentPage} of {pagination.last_visible_page}
                  {filteredResults.length === searchResults.length && ` (${searchResults.length} per page)`}
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredResults.map((anime, index) => (
              <AnimeCard key={`${anime.mal_id}-${index}`} anime={anime} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="mt-8">
              <Pagination
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {!loading && !error && searchResults.length > 0 && filteredResults.length === 0 && (
        <EmptyState message="No anime match your filters. Try adjusting or clearing some filters." />
      )}

      {!loading && !error && debouncedSearchQuery && searchResults.length === 0 && (
        <EmptyState message="No anime found. Try a different search term or adjust your filters." />
      )}

        <ScrollToTop />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};
