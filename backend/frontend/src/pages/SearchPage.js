import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import ImageCard from '../components/ImageCard';

const SearchPage = ({ API_BASE_URL }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/search?query=${encodeURIComponent(searchQuery)}&per_page=12`
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data.images);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Search Images</h1>
        <p className="text-gray-600">Find images by caption, tags, or filename</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          loading={loading}
          placeholder="Search for images..."
        />
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Searching...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-red-600 text-6xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold text-red-800 mb-2">Search Error</h2>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={handleClearSearch}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h2>
                <p className="text-gray-600 mb-4">
                  No images found for "{query}". Try different keywords or check your spelling.
                </p>
                <button
                  onClick={handleClearSearch}
                  className="btn-secondary"
                >
                  Clear Search
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Search Info */}
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Search Results for "{query}"
                </h2>
                <p className="text-gray-600">
                  Found {searchResults.length} image{searchResults.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    API_BASE_URL={API_BASE_URL}
                  />
                ))}
              </div>

              {/* Clear Search Button */}
              <div className="text-center mt-8">
                <button
                  onClick={handleClearSearch}
                  className="btn-secondary"
                >
                  New Search
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && (
        <div className="text-center py-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-blue-600 text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Start Searching</h2>
            <p className="text-blue-600 mb-4">
              Enter keywords to search through captions, tags, and filenames
            </p>
            <div className="text-sm text-blue-500">
              <p className="mb-1">💡 Try searching for:</p>
              <p className="font-medium">"nature", "sunset", "portrait", "landscape"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

