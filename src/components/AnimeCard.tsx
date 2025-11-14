import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Anime } from '../types/anime';

interface AnimeCardProps {
  anime: Anime;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/anime/${anime.mal_id}`);
  };

  // Format aired date
  const getAiredDate = () => {
    if (anime.aired?.from) {
      const date = new Date(anime.aired.from);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
    return 'N/A';
  };

  // Get duration in readable format
  const getDuration = () => {
    if (anime.duration) {
      return anime.duration.replace(' per ep', '');
    }
    return null;
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div className="relative pb-[140%] bg-gray-200 dark:bg-gray-700">
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {anime.score && (
          <div className="absolute top-2 right-2 bg-primary-600 dark:bg-primary-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
            ⭐ {anime.score.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg line-clamp-2 min-h-[3.5rem] text-gray-900 dark:text-white">
          {anime.title}
        </h3>

        {/* Type and Episodes */}
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-primary-600 dark:text-primary-400">
            {anime.type ?? 'Unknown'}
          </span>
          {anime.episodes && (
            <span className="text-gray-600 dark:text-gray-400">
              {anime.episodes} eps
            </span>
          )}
        </div>

        {/* Aired Date */}
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{getAiredDate()}</span>
        </div>

        {/* Duration */}
        {getDuration() && (
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{getDuration()}</span>
          </div>
        )}
      </div>
    </div>
  );
};
