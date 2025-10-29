import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-gray-200 to-gray-300 h-96"></div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded-full w-2/3"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;

