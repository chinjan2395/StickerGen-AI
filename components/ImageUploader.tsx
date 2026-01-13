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
    e.stopPropagation(); 
    onImageSelected('');
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
        className={`
          relative w-full min-h-[300px] rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer
          flex flex-col items-center justify-center
          ${selectedImage ? 'p-0 border-[#FFDAB9] overflow-hidden' : 'p-6'}
          ${isDragging 
            ? 'border-[#9370DB] bg-[#F5F5FF] scale-[1.01]' 
            : 'border-[#E6E6FA] bg-white hover:border-[#FFDAB9] hover:bg-[#FFFBF7]'
          }
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
          <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-[#F9F9FF]">
            <img 
              src={selectedImage} 
              alt="Original" 
              className="w-full h-full object-contain max-h-[400px]"
            />
             <button
              onClick={clearImage}
              className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-[#9370DB] rounded-full shadow-md transition-all z-10"
              title="Remove image"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className={`p-5 rounded-full bg-[#F5F5FF] text-[#9370DB] mx-auto w-20 h-20 flex items-center justify-center transition-transform duration-300 ${isDragging ? 'scale-110 bg-[#E6E6FA]' : ''}`}>
              <Upload size={32} />
            </div>
            <div>
              <p className="text-xl font-semibold text-[#4A4A6A]">Drop photo here</p>
              <p className="text-[#8E8EA8] mt-1 text-sm font-light">or click to browse</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-[#B0B0C0] mt-4 uppercase tracking-wider">
              <ImageIcon size={14} />
              <span>JPG, PNG</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;