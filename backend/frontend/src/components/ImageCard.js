import React, { useState } from 'react';
import ImageModal from './ImageModal';

const ImageCard = ({ image, API_BASE_URL }) => {
  const [showModal, setShowModal] = useState(false);
  const thumbnailUrl = `${API_BASE_URL}/uploads/thumb_${image.filename}`;
  const originalUrl = `${API_BASE_URL}/uploads/${image.filename}`;

  return (
    <>
      <div className="card group cursor-pointer relative" onClick={() => setShowModal(true)}>
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={thumbnailUrl}
          alt={image.caption || image.original_filename}
          className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
          <div className="glass rounded-full p-4 shadow-2xl">
            <span className="text-4xl">🔍</span>
          </div>
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-y-0 translate-y-4">
          <div className="glass px-3 py-1 rounded-full">
            <span className="text-white text-sm font-semibold">View</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-gray-800 mb-3 text-lg line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          {image.caption || 'Untitled'}
        </h3>
        
        {image.tags && image.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {image.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs rounded-full font-semibold hover:from-blue-200 hover:to-purple-200 transition-all duration-300 transform hover:scale-105"
              >
                #{tag}
              </span>
            ))}
            {image.tags.length > 4 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-semibold">
                +{image.tags.length - 4}
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
          <span className="truncate mr-2">{image.original_filename}</span>
          <span className="flex-shrink-0">{new Date(image.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
    
    {showModal && (
      <ImageModal
        image={image}
        onClose={() => setShowModal(false)}
        API_BASE_URL={API_BASE_URL}
      />
    )}
    </>
  );
};

export default ImageCard;
