import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          <div className="relative pb-[140%] bg-gray-300 dark:bg-gray-700"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
