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

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div className="relative pb-[140%] bg-gray-200">
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {anime.score && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
            ⭐ {anime.score.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
          {anime.title}
        </h3>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="font-medium">
            {anime.type ?? 'Unknown'}
          </span>
          {anime.episodes && (
            <span>{anime.episodes} eps</span>
          )}
        </div>
        {anime.rating && (
          <div className="mt-2 text-xs text-gray-500">
            {anime.rating}
          </div>
        )}
      </div>
    </div>
  );
};
