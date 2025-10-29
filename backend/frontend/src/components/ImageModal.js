import React, { useEffect } from 'react';

const ImageModal = ({ image, onClose, API_BASE_URL }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const imageUrl = `${API_BASE_URL}/uploads/${image.filename}`;
  const thumbnailUrl = `${API_BASE_URL}/uploads/thumb_${image.filename}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative glass max-w-6xl w-full max-h-[90vh] overflow-auto rounded-3xl shadow-2xl transform scale-100 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
        >
          <span className="text-2xl">✕</span>
        </button>

        {/* Image */}
        <img
          src={imageUrl}
          alt={image.caption || image.original_filename}
          className="w-full h-auto"
          loading="lazy"
        />

        {/* Info Section */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {image.caption || 'Untitled'}
          </h2>
          
          {image.tags && image.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {image.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full font-semibold hover:from-blue-200 hover:to-purple-200 transition-all duration-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Filename</p>
              <p className="font-semibold text-gray-800">{image.original_filename}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Uploaded</p>
              <p className="font-semibold text-gray-800">
                {new Date(image.created_at).toLocaleString()}
              </p>
            </div>
            {image.file_size && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Size</p>
                <p className="font-semibold text-gray-800">
                  {(image.file_size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;

