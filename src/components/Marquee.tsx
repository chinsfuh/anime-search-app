import React from 'react';

export const Marquee: React.FC = () => {
  const announcements = [
    "🎬 New Fall 2025 anime season now available!",
    "⭐ Browse thousands of anime across all seasons",
    "🔥 Trending: Top rated anime updated daily",
    "🎯 Use filters to find your perfect anime",
    "💡 Search by title, genre, rating, and more",
  ];

  return (
    <div className="bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-700 dark:to-purple-700 text-white py-2 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-content">
          {announcements.map((announcement, index) => (
            <span key={index} className="mx-8 text-sm md:text-base font-medium whitespace-nowrap">
              {announcement}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {announcements.map((announcement, index) => (
            <span key={`duplicate-${index}`} className="mx-8 text-sm md:text-base font-medium whitespace-nowrap">
              {announcement}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
