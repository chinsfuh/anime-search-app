import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearSearchResults, fetchAvailableSeasons } from '../store/animeSlice';
import { SeasonType } from '../types/anime';

export const NavigationMenu: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const seasonsByType = useAppSelector((state) => state.anime.seasonsByType);
  const [openSeason, setOpenSeason] = useState<SeasonType | null>(null);

  // Fetch available seasons on mount (only if not already in Redux)
  useEffect(() => {
    // Check if seasonsByType is empty (all arrays are empty)
    const isEmpty = Object.values(seasonsByType).every((seasons) => seasons.length === 0);

    if (isEmpty) {
      // Delay the fetch to avoid rate limit conflicts with initial page load
      // SearchPage loads at 0ms, Banner at 600ms, so we wait 1200ms to be safe
      const timer = setTimeout(() => {
        dispatch(fetchAvailableSeasons());
      }, 1200);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [dispatch, seasonsByType]);

  // Handle season selection
  const handleSeasonSelect = (year: number, season: string) => {
    // Clear current results to show loading state
    dispatch(clearSearchResults());
    // Navigate to season URL - SearchPage will handle state updates and fetching
    navigate(`/?season=${year}/${season}`);
    setOpenSeason(null);
  };

  // Toggle season dropdown
  const toggleSeasonDropdown = (season: SeasonType) => {
    setOpenSeason(openSeason === season ? null : season);
  };

  // Close dropdown when clicking outside
  const handleBackdropClick = () => {
    setOpenSeason(null);
  };

  // Season configuration with colors and icons
  const seasonConfig: Record<SeasonType, { color: string; gradient: string; icon: string; hoverGradient: string }> = {
    winter: {
      color: 'text-cyan-600 dark:text-cyan-400',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-400',
      hoverGradient: 'hover:from-blue-600 hover:to-cyan-500',
      icon: '❄️',
    },
    spring: {
      color: 'text-pink-600 dark:text-pink-400',
      gradient: 'bg-gradient-to-br from-pink-500 to-green-400',
      hoverGradient: 'hover:from-pink-600 hover:to-green-500',
      icon: '🌸',
    },
    summer: {
      color: 'text-orange-600 dark:text-orange-400',
      gradient: 'bg-gradient-to-br from-yellow-500 to-orange-400',
      hoverGradient: 'hover:from-yellow-600 hover:to-orange-500',
      icon: '☀️',
    },
    fall: {
      color: 'text-amber-600 dark:text-amber-400',
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
      hoverGradient: 'hover:from-orange-600 hover:to-red-600',
      icon: '🍂',
    },
  };

  return (
    <>
      {/* Backdrop */}
      {openSeason && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleBackdropClick}
        />
      )}

      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {/* Four Seasonal Buttons */}
        {(Object.keys(seasonConfig) as SeasonType[]).map((seasonType) => {
          const config = seasonConfig[seasonType];
          const isOpen = openSeason === seasonType;
          const seasons = seasonsByType[seasonType];

          return (
            <div key={seasonType} className="relative">
              {/* Season Button */}
              <button
                onClick={() => toggleSeasonDropdown(seasonType)}
                className={`
                  flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base
                  ${config.gradient} ${config.hoverGradient}
                  text-white shadow-lg hover:shadow-xl
                  transform transition-all duration-300
                  ${isOpen ? 'scale-105 shadow-2xl' : 'hover:scale-105'}
                  animate-fade-in
                  min-w-[120px] md:min-w-[140px] justify-center
                `}
              >
                <span className="text-lg md:text-xl">{config.icon}</span>
                <span className="capitalize">{seasonType}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isOpen && seasons.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-slide-down">
                  <div className={`px-4 py-2 ${config.gradient} text-white font-semibold text-sm`}>
                    Select Year
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {seasons.map((seasonData, index) => (
                      <button
                        key={`${seasonData.year}-${index}`}
                        onClick={() => handleSeasonSelect(seasonData.year, seasonData.season)}
                        className={`
                          w-full px-4 py-3 text-left
                          hover:bg-gray-100 dark:hover:bg-gray-700
                          transition-all duration-200
                          border-b border-gray-100 dark:border-gray-700 last:border-b-0
                          group relative overflow-hidden
                        `}
                      >
                        {/* Animated hover background */}
                        <div className={`
                          absolute inset-0 ${config.gradient} opacity-0 group-hover:opacity-10
                          transition-opacity duration-300
                        `} />

                        <div className="relative flex items-center justify-between">
                          <span className={`font-medium ${config.color} group-hover:scale-105 transition-transform duration-200`}>
                            {seasonType.charAt(0).toUpperCase() + seasonType.slice(1)} {seasonData.year}
                          </span>
                          <svg
                            className={`w-4 h-4 ${config.color} opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
