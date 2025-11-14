import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTopAnimeForBanner } from '../store/animeSlice';
import { Anime } from '../types/anime';

export const TopTrendingBanner: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const topAnime = useAppSelector((state) => state.anime.topAnime);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(topAnime.length === 0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Only fetch if we don't have topAnime in Redux yet
    if (topAnime.length === 0) {
      // Delay to avoid rate limit conflicts with SearchPage initial load
      const timer = setTimeout(() => {
        dispatch(fetchTopAnimeForBanner()).finally(() => {
          setLoading(false);
        });
      }, 600);

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
      return undefined;
    }
  }, [dispatch, topAnime.length]);

  useEffect(() => {
    if (topAnime.length === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % topAnime.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [topAnime.length]);

  const handleViewDetails = useCallback((id: number) => {
    navigate(`/anime/${id}`);
  }, [navigate]);

  const handleShare = useCallback(async (anime: Anime) => {
    const shareData = {
      title: anime.title,
      text: `Check out ${anime.title} on Anime All Day!`,
      url: `${window.location.origin}/anime/${anime.mal_id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    }
  }, []);

  const goToSlide = useCallback((index: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 300);
  }, []);

  if (loading) {
    return (
      <div className="-mx-4 w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-700 dark:to-purple-700 mb-6 md:mb-8 animate-pulse" />
    );
  }

  if (topAnime.length === 0) return null;

  const currentAnime = topAnime[currentSlide];

  if (!currentAnime) return null;

  return (
    <div className="-mx-4 w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] h-[300px] md:h-[400px] lg:h-[500px] mb-6 md:mb-8 overflow-hidden shadow-2xl">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{
          backgroundImage: `url(${currentAnime.images.jpg.large_image_url})`,
          filter: 'brightness(0.4) blur(8px)',
          opacity: isAnimating ? 0.7 : 1,
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 md:px-8 flex items-center">
        <div
          className={`max-w-2xl transition-all duration-500 ${
            isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Badge */}
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
            <span className="bg-red-600 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold animate-pulse">
              🔥 HOT
            </span>
            <span className="bg-yellow-500 text-black px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold">
              ⭐ TOP {currentSlide + 1}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg line-clamp-2">
            {currentAnime.title}
          </h2>

          {/* Synopsis */}
          <p className="text-gray-200 text-sm md:text-base lg:text-lg mb-3 md:mb-6 line-clamp-2 md:line-clamp-3 drop-shadow-md">
            {currentAnime.synopsis || 'No description available.'}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6 text-white">
            {currentAnime.score && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-sm md:text-base">⭐</span>
                <span className="font-bold text-sm md:text-base">{currentAnime.score.toFixed(1)}</span>
              </div>
            )}
            {currentAnime.type && (
              <span className="px-2 py-0.5 md:px-3 md:py-1 bg-white/20 rounded-full text-xs md:text-sm">
                {currentAnime.type}
              </span>
            )}
            {currentAnime.episodes && (
              <span className="px-2 py-0.5 md:px-3 md:py-1 bg-white/20 rounded-full text-xs md:text-sm">
                {currentAnime.episodes} Episodes
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            <button
              onClick={() => handleViewDetails(currentAnime.mal_id)}
              className="px-4 py-2 md:px-6 md:py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
            >
              View Details
            </button>
            <button
              onClick={() => handleShare(currentAnime)}
              className="px-4 py-2 md:px-6 md:py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm md:text-base"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {topAnime.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + topAnime.length) % topAnime.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % topAnime.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
