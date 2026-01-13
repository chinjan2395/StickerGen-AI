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
      <div className="h-full min-h-[420px] flex flex-col items-center justify-center text-[#B0B0C0] bg-white border-2 border-dashed border-[#E6E6FA] rounded-3xl p-6 text-center">
        <Sparkles className="w-12 h-12 text-[#E6E6FA] mb-6" />
        <p className="font-medium text-lg text-[#8E8EA8]">Your sticker will appear here</p>
        <p className="text-sm mt-2 font-light">Upload an image and hit generate!</p>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[420px] rounded-3xl bg-white shadow-lg shadow-[#E6E6FA]/50 border border-[#E6E6FA] overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 pointer-events-none">
        <span className="px-4 py-1.5 bg-[#F5F5FF]/90 backdrop-blur-sm text-[#9370DB] rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
          Preview
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center bg-[radial-gradient(#E6E6FA_1px,transparent_1px)] [background-size:20px_20px] p-0 overflow-hidden">
        {isGenerating ? (
          <div className="relative flex flex-col items-center justify-center p-10">
             {/* Simple pulse animation for loading state */}
            <div className="w-56 h-56 rounded-full bg-[#F5F5FF] animate-ping opacity-60 absolute"></div>
            <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center relative z-10 shadow-lg border border-[#E6E6FA]">
               <span className="text-5xl animate-bounce">✨</span>
            </div>
            <p className="mt-8 text-[#9370DB] font-semibold animate-pulse tracking-wide">
              Designing sticker...
            </p>
          </div>
        ) : (
          <div className="relative group w-full h-full flex items-center justify-center bg-[#F9F9FF]">
            <img 
              src={generatedImage!} 
              alt="Generated Sticker" 
              className="max-h-[500px] w-full h-full object-contain p-4 drop-shadow-2xl transition-transform hover:scale-105 duration-500 ease-out"
            />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {!isGenerating && generatedImage && (
        <div className="p-4 md:p-6 bg-white border-t border-[#F5F5FF] flex gap-4 z-20">
          <button
            onClick={onDownload}
            className="flex-1 bg-[#FFDAB9] text-[#5A4A42] py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#FFD1A6] transition-all shadow-md shadow-[#FFDAB9]/30 hover:-translate-y-0.5"
          >
            <Download size={20} />
            Download
          </button>
          <button
             onClick={onReset}
             className="px-6 py-4 rounded-2xl border-2 border-[#F0F0F5] text-[#8E8EA8] hover:border-[#FFDAB9] hover:bg-[#FFFBF7] hover:text-[#5A4A42] transition-all"
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