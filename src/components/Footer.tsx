import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="w-full py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <svg
                className="w-6 h-6 text-primary-600 dark:text-primary-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" />
                <path d="M10 8.5v7l6-3.5z" />
              </svg>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Anime All Day
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your go-to destination for discovering anime across all seasons and genres.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Home
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="text-center md:text-right">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
              About
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Powered by Jikan API & MyAnimeList data
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto mt-6 md:mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Anime All Day. All rights reserved. Data provided by{' '}
            <a
              href="https://myanimelist.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              MyAnimeList
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};
