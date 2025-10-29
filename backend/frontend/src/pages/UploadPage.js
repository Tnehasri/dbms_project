import React, { useState } from 'react';

const UploadPage = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:15000';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', caption);
      formData.append('tags', tags);

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setSuccess(true);
      
      // Reset form
      setFile(null);
      setCaption('');
      setTags('');
      setPreview(null);
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Upload Image</h1>
        <p className="text-gray-600">Share your beautiful moments</p>
      </div>

      <div className="card p-8">
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-green-600 text-2xl mr-3">✅</span>
              <div>
                <h3 className="text-green-800 font-semibold">Upload Successful!</h3>
                <p className="text-green-600">Your image has been uploaded and indexed.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-600 text-2xl mr-3">❌</span>
              <div>
                <h3 className="text-red-800 font-semibold">Upload Failed</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={loading}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-gray-600">{file?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-4xl text-gray-400">📷</div>
                    <p className="text-gray-600">Click to select an image</p>
                    <p className="text-sm text-gray-500">PNG, JPG, JPEG, GIF, WebP up to 16MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Caption */}
          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
              Caption
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe your image..."
              className="input-field resize-none h-24"
              disabled={loading}
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="nature, landscape, sunset (comma separated)"
              className="input-field"
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate tags with commas for better search results
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setCaption('');
                setTags('');
                setPreview(null);
                setError(null);
              }}
              className="btn-secondary"
              disabled={loading}
            >
              Clear
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !file}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="loading-spinner h-4 w-4 mr-2"></div>
                  Uploading...
                </div>
              ) : (
                'Upload Image'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;

