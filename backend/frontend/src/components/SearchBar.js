import React, { useState } from 'react';

const SearchBar = ({ onSearch, loading, placeholder = "Search images..." }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400 text-xl">🔍</span>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="input-field pl-12 pr-20 text-lg"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {loading ? (
            <div className="loading-spinner h-6 w-6"></div>
          ) : (
            <span className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
              Search
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

