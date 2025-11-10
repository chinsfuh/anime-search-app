import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAnimeSearch, setSearchQuery, setCurrentPage } from '../store/animeSlice';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from '../components/SearchBar';
import { AnimeCard } from '../components/AnimeCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../components/EmptyState';

export const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchResults, loading, error, pagination, currentPage } = useAppSelector(
    (state) => state.anime
  );

  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(localSearchQuery, 250);

  // Effect for debounced search
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      dispatch(setSearchQuery(debouncedSearchQuery));
      dispatch(setCurrentPage(1)); // Reset to page 1 on new search
      dispatch(fetchAnimeSearch({ query: debouncedSearchQuery, page: 1 }));
    }
  }, [debouncedSearchQuery, dispatch]);

  // Effect for pagination
  useEffect(() => {
    if (debouncedSearchQuery.trim() && currentPage > 1) {
      dispatch(fetchAnimeSearch({ query: debouncedSearchQuery, page: currentPage }));
    }
  }, [currentPage, debouncedSearchQuery, dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Anime Search
          </h1>
          <p className="text-gray-600">
            Discover your favorite anime powered by Jikan API
          </p>
        </header>

        <SearchBar
          value={localSearchQuery}
          onChange={handleSearchChange}
          placeholder="Search for anime (e.g., Naruto, One Piece)..."
        />

        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {loading && <LoadingSkeleton />}

        {!loading && !error && searchResults.length > 0 && (
          <>
            <div className="mb-4 text-gray-600 text-center">
              Found {pagination?.items.total ?? 0} results
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
            {pagination && (
              <Pagination
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {!loading && !error && searchResults.length === 0 && debouncedSearchQuery && (
          <EmptyState message="No anime found. Try a different search term." />
        )}

        {!loading && !error && !debouncedSearchQuery && (
          <EmptyState message="Start typing to search for anime..." />
        )}
      </div>
    </div>
  );
};
