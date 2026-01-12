import React from 'react';
import { Download, Sparkles, RefreshCcw } from 'lucide-react';
import { ResultDisplayProps } from '../types';

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  generatedImage, 
  isGenerating, 
  onDownload,
  onReset
}) => {
  if (!generatedImage && !isGenerating) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center">
        <Sparkles className="w-12 h-12 text-gray-200 mb-4" />
        <p className="font-medium">Your sticker will appear here</p>
        <p className="text-sm mt-2">Upload an image and hit generate!</p>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[400px] rounded-3xl bg-white shadow-xl shadow-pink-100/50 border border-pink-100 overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-white/80 to-transparent">
        <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-bold uppercase tracking-wide">
          Preview
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        {isGenerating ? (
          <div className="relative">
             {/* Simple pulse animation for loading state */}
            <div className="w-48 h-48 rounded-full bg-pink-100 animate-ping opacity-75 absolute top-0 left-0"></div>
            <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center relative z-10 shadow-xl">
               <span className="text-4xl">✨</span>
            </div>
            <p className="absolute -bottom-12 w-full text-center text-pink-500 font-bold animate-pulse">
              Designing sticker...
            </p>
          </div>
        ) : (
          <div className="relative group">
            <img 
              src={generatedImage!} 
              alt="Generated Sticker" 
              className="max-h-[350px] w-auto drop-shadow-2xl transition-transform hover:scale-105 duration-300"
            />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {!isGenerating && generatedImage && (
        <div className="p-6 bg-white border-t border-gray-100 flex gap-3">
          <button
            onClick={onDownload}
            className="flex-1 bg-pink-500 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200"
          >
            <Download size={20} />
            Download Sticker
          </button>
          <button
             onClick={onReset}
             className="px-4 py-3 rounded-xl border-2 border-gray-100 text-gray-500 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-500 transition-all"
             title="Try another"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;