import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { clearSearchResults, setSearchQuery, clearAllFilters, setSelectedSeason, setCurrentPage } from '../store/animeSlice';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Clear all filters and search
    dispatch(clearSearchResults());
    dispatch(setSearchQuery(''));
    dispatch(clearAllFilters());
    // Set default season (Fall 2025)
    dispatch(setSelectedSeason({ year: 2025, season: 'fall' }));
    dispatch(setCurrentPage(1));
    // Navigate to clean home URL
    navigate('/');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-200">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 md:gap-3 group cursor-pointer">
            {/* Anime Icon Logo */}
            <div className="relative">
              <svg
                className="w-8 h-8 md:w-10 md:h-10 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-200"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {/* TV/Screen */}
                <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" />
                {/* Play button inside */}
                <path d="M10 8.5v7l6-3.5z" />
              </svg>
              {/* Decorative sparkle */}
              <svg
                className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 text-yellow-400 animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 1l2.5 6.5L19 10l-6.5 2.5L10 19l-2.5-6.5L1 10l6.5-2.5z" />
              </svg>
            </div>

            {/* Brand Text */}
            <div className="flex flex-col">
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                Anime All Day
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium tracking-wide hidden sm:block">
                Your Daily Dose of Anime
              </p>
            </div>
          </a>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
