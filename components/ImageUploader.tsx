import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { ImageUploaderProps } from '../types';

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the click to upload
    onImageSelected(''); // Sending empty string to clear
  };

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
        className={`
          relative flex-1 rounded-3xl border-4 border-dashed transition-all duration-300 cursor-pointer
          flex flex-col items-center justify-center p-6
          ${isDragging 
            ? 'border-pink-500 bg-pink-50 scale-[1.02]' 
            : 'border-pink-200 bg-white hover:border-pink-300 hover:bg-pink-50/50'
          }
          ${selectedImage ? 'border-solid border-pink-400' : ''}
        `}
      >
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />

        {selectedImage ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
            <img 
              src={selectedImage} 
              alt="Original" 
              className="max-h-[300px] w-auto object-contain shadow-lg rounded-xl"
            />
             <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white text-pink-500 rounded-full shadow-md transition-all z-10"
              title="Remove image"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className={`p-4 rounded-full bg-pink-100 text-pink-500 mx-auto w-20 h-20 flex items-center justify-center transition-transform ${isDragging ? 'scale-110' : ''}`}>
              <Upload size={32} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-700">Drop your photo here</p>
              <p className="text-gray-400 mt-2 text-sm">or click to browse</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-300 mt-4">
              <ImageIcon size={14} />
              <span>Supports JPG, PNG</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;