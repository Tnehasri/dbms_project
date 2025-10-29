import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import SearchPage from './pages/SearchPage';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:15000';

  const fetchImages = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/images?page=${page}&per_page=12`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await response.json();
      setImages(data.images);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <Router>
      <div className="min-h-screen gradient-bg">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  images={images} 
                  loading={loading} 
                  error={error}
                  onRefresh={fetchImages}
                  API_BASE_URL={API_BASE_URL}
                />
              } 
            />
            <Route 
              path="/upload" 
              element={
                <UploadPage 
                  onUploadSuccess={() => fetchImages()}
                />
              } 
            />
            <Route 
              path="/search" 
              element={
                <SearchPage 
                  API_BASE_URL={API_BASE_URL}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

