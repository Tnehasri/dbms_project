import React from 'react';
import ImageCard from '../components/ImageCard';

const HomePage = ({ images, loading, error, onRefresh, API_BASE_URL }) => {
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Images</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-gray-600">Loading images...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-gray-400 text-6xl mb-4">📷</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Images Yet</h2>
          <p className="text-gray-600 mb-4">Upload your first image to get started!</p>
          <a
            href="/upload"
            className="btn-primary inline-block"
          >
            Upload Image
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header with Gradient */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse-slow">
          Image Gallery
        </h1>
        <p className="text-gray-600 text-lg">Discover and explore beautiful images</p>
        <div className="mt-4 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full float-animation"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full float-animation" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full float-animation" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        {images.map((image, index) => (
          <div key={image.id} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
            <ImageCard
              image={image}
              API_BASE_URL={API_BASE_URL}
            />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12">
        <button
          onClick={onRefresh}
          className="btn-primary transform hover:scale-110"
        >
          🔄 Refresh Gallery
        </button>
      </div>
    </div>
  );
};

export default HomePage;

