import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnimeRecommendations, getTopAnime } from '../services/api';
import { Anime } from '../types/anime';

interface RelatedAnimeSidebarProps {
  animeId: number;
}

export const RelatedAnimeSidebar: React.FC<RelatedAnimeSidebarProps> = ({ animeId }) => {
  const navigate = useNavigate();
  const [relatedAnime, setRelatedAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const fetchRelatedAnime = async () => {
      setLoading(true);
      setIsFallback(false);
      try {
        const response = await getAnimeRecommendations(animeId);
        if (response.data.length > 0) {
          setRelatedAnime(response.data);
        } else {
          // Fallback: fetch random top anime
          const fallbackResponse = await getTopAnime(10, Math.floor(Math.random() * 10) + 1);
          setRelatedAnime(fallbackResponse.data.filter(anime => anime.mal_id !== animeId).slice(0, 10));
          setIsFallback(true);
        }
      } catch (error) {
        console.error('Failed to fetch related anime:', error);
        // Fallback: fetch top anime on error
        try {
          const fallbackResponse = await getTopAnime(10, 1);
          setRelatedAnime(fallbackResponse.data.filter(anime => anime.mal_id !== animeId).slice(0, 10));
          setIsFallback(true);
        } catch (fallbackError) {
          setRelatedAnime([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedAnime();
  }, [animeId]);

  const handleAnimeClick = (id: number) => {
    navigate(`/anime/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Related Anime
        </h3>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden animate-pulse"
          >
            <div className="flex gap-3">
              <div className="w-24 h-32 bg-gray-300 dark:bg-gray-700" />
              <div className="flex-1 py-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        {isFallback ? 'You May Also Like' : 'Related Anime'}
      </h3>

      <div className="space-y-3">
        {relatedAnime.map((anime) => (
          <div
            key={anime.mal_id}
            onClick={() => handleAnimeClick(anime.mal_id)}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex gap-3">
              <div className="w-24 h-32 flex-shrink-0 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                <img
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                {anime.score && (
                  <div className="absolute top-1 right-1 bg-primary-600 dark:bg-primary-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                    {anime.score.toFixed(1)}
                  </div>
                )}
              </div>

              <div className="flex-1 py-2 pr-3 min-w-0">
                <h4 className="font-semibold text-sm line-clamp-2 mb-1 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {anime.title}
                </h4>

                <div className="space-y-1">
                  {anime.type && (
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                      {anime.type}
                    </p>
                  )}

                  {anime.episodes && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {anime.episodes} episodes
                    </p>
                  )}

                  {anime.year && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {anime.year}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {isFallback ? 'Top rated anime suggestions' : 'Recommendations from MyAnimeList'}
        </p>
      </div>
    </div>
  );
};
