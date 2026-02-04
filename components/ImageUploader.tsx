import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X, Plus } from 'lucide-react';
import { ImageUploaderProps } from '../types';

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange, selectedImages }) => {
  const [isDragging, setIsDragging] = useState(false);
  const MAX_IMAGES = 3;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (selectedImages.length < MAX_IMAGES) {
      setIsDragging(true);
    }
  }, [selectedImages.length]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = (files: FileList | File[]) => {
    const remainingSlots = MAX_IMAGES - selectedImages.length;
    if (remainingSlots <= 0) return;

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    const newImages: string[] = [];
    let processedCount = 0;

    filesToProcess.forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        newImages.push(result);
        processedCount++;
        
        if (processedCount === filesToProcess.length) {
          onImagesChange([...selectedImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImages]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset input value to allow selecting same file again if needed
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = selectedImages.filter((_, index) => index !== indexToRemove);
    onImagesChange(updated);
  };

  const triggerFileInput = () => {
    document.getElementById('fileInput')?.click();
  };

  // If we have images, show the gallery view
  if (selectedImages.length > 0) {
    return (
      <div className="w-full">
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
        <div className="grid grid-cols-3 gap-3">
          {selectedImages.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-[#E6E6FA] group bg-white shadow-sm">
              <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={(e) => removeImage(idx, e)}
                className="absolute top-2 right-2 p-1.5 bg-white/90 text-[#9370DB] rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          
          {selectedImages.length < MAX_IMAGES && (
             <button
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all
                ${isDragging 
                  ? 'border-[#9370DB] bg-[#F5F5FF]' 
                  : 'border-[#E6E6FA] bg-white hover:border-[#FFDAB9] hover:bg-[#FFFBF7] text-[#8E8EA8] hover:text-[#5A4A42]'
                }
              `}
            >
              <Plus size={24} className="mb-2" />
              <span className="text-xs font-medium">Add Photo</span>
              <span className="text-[10px] opacity-60">{selectedImages.length}/{MAX_IMAGES}</span>
            </button>
          )}
        </div>
        <p className="text-center text-xs text-[#8E8EA8] mt-3">
            Add up to 3 people to combine them in the sticker pack!
        </p>
      </div>
    );
  }

  // Default Empty State
  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`
          relative w-full min-h-[300px] rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer
          flex flex-col items-center justify-center p-6
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
          multiple
          className="hidden"
          onChange={handleFileInput}
        />

        <div className="text-center space-y-4 pointer-events-none">
          <div className={`p-5 rounded-full bg-[#F5F5FF] text-[#9370DB] mx-auto w-20 h-20 flex items-center justify-center transition-transform duration-300 ${isDragging ? 'scale-110 bg-[#E6E6FA]' : ''}`}>
            <Upload size={32} />
          </div>
          <div>
            <p className="text-xl font-semibold text-[#4A4A6A]">Drop photos here</p>
            <p className="text-[#8E8EA8] mt-1 text-sm font-light">Up to 3 images supported</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-[#B0B0C0] mt-4 uppercase tracking-wider">
            <ImageIcon size={14} />
            <span>JPG, PNG</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;