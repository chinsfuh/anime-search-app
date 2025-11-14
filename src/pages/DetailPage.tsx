import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAnimeDetail, clearSelectedAnime } from '../store/animeSlice';
import { ScrollToTop } from '../components/ScrollToTop';
import { ShareButtons } from '../components/ShareButtons';
import { RelatedAnimeSidebar } from '../components/RelatedAnimeSidebar';
import { Footer } from '../components/Footer';

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedAnime, loading, error } = useAppSelector((state) => state.anime);

  useEffect(() => {
    if (id) {
      const animeId = parseInt(id, 10);
      if (!isNaN(animeId)) {
        dispatch(fetchAnimeDetail(animeId));
      }
    }

    return () => {
      dispatch(clearSelectedAnime());
    };
  }, [id, dispatch]);

  const handleBackClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading anime details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="max-w-md mx-auto p-6">
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
          <button
            onClick={handleBackClick}
            className="w-full bg-primary-600 dark:bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  if (!selectedAnime) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-medium">Back to Previous Page</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Left on Desktop, Top on Mobile */}
        <aside className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
          <div className="lg:sticky lg:top-24">
            <RelatedAnimeSidebar animeId={parseInt(id!)} />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 order-1 lg:order-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-200">
            <div className="md:flex">
              <div className="md:w-1/3 lg:w-1/4">
                <img
                  src={selectedAnime.images.jpg.large_image_url}
                  alt={selectedAnime.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:w-2/3 lg:w-3/4 p-8">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                {selectedAnime.title}
              </h1>

              {selectedAnime.title_english && selectedAnime.title_english !== selectedAnime.title && (
                <h2 className="text-2xl text-gray-600 dark:text-gray-400 mb-2">
                  {selectedAnime.title_english}
                </h2>
              )}

              {selectedAnime.title_japanese && (
                <p className="text-lg text-gray-500 dark:text-gray-500 mb-4">
                  {selectedAnime.title_japanese}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mb-6">
                {selectedAnime.score && (
                  <div className="bg-primary-600 dark:bg-primary-500 text-white px-4 py-2 rounded-lg font-bold">
                    ⭐ {selectedAnime.score.toFixed(2)} / 10
                  </div>
                )}
                {selectedAnime.rank && (
                  <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-semibold">
                    Rank #{selectedAnime.rank}
                  </div>
                )}
                {selectedAnime.popularity && (
                  <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-semibold">
                    Popularity #{selectedAnime.popularity}
                  </div>
                )}
              </div>

              {/* Share Buttons */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <ShareButtons
                  title={selectedAnime.title}
                  url={window.location.href}
                  description={selectedAnime.synopsis || `Check out ${selectedAnime.title} on Anime All Day!`}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {selectedAnime.type && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Type:</span>
                    <p className="text-gray-600 dark:text-gray-400">{selectedAnime.type}</p>
                  </div>
                )}
                {selectedAnime.episodes && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Episodes:</span>
                    <p className="text-gray-600 dark:text-gray-400">{selectedAnime.episodes}</p>
                  </div>
                )}
                {selectedAnime.status && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Status:</span>
                    <p className="text-gray-600 dark:text-gray-400">{selectedAnime.status}</p>
                  </div>
                )}
                {selectedAnime.aired.string && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Aired:</span>
                    <p className="text-gray-600 dark:text-gray-400">{selectedAnime.aired.string}</p>
                  </div>
                )}
                {selectedAnime.season && selectedAnime.year && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Season:</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedAnime.season.charAt(0).toUpperCase() + selectedAnime.season.slice(1)}{' '}
                      {selectedAnime.year}
                    </p>
                  </div>
                )}
                {selectedAnime.source && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Source:</span>
                    <p className="text-gray-600 dark:text-gray-400">{selectedAnime.source}</p>
                  </div>
                )}
                {selectedAnime.duration && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Duration:</span>
                    <p className="text-gray-600 dark:text-gray-400">{selectedAnime.duration}</p>
                  </div>
                )}
                {selectedAnime.rating && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Rating:</span>
                    <p className="text-gray-600 dark:text-gray-400">{selectedAnime.rating}</p>
                  </div>
                )}
              </div>

              {selectedAnime.genres.length > 0 && (
                <div className="mb-6">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">Genres:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnime.genres.map((genre) => (
                      <span
                        key={genre.mal_id}
                        className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedAnime.synopsis && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xl mb-2">Synopsis</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{selectedAnime.synopsis}</p>
                </div>
              )}

              {selectedAnime.background && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xl mb-2">Background</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{selectedAnime.background}</p>
                </div>
              )}

              {selectedAnime.studios.length > 0 && (
                <div className="mb-6">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-2">Studios:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnime.studios.map((studio) => (
                      <span
                        key={studio.mal_id}
                        className="bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm"
                      >
                        {studio.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedAnime.trailer.youtube_id && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xl mb-2">Trailer</h3>
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${selectedAnime.trailer.youtube_id}`}
                      title="Anime Trailer"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={selectedAnime.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary-600 dark:bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                >
                  View on MyAnimeList
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <ScrollToTop />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};
