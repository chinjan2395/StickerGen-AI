import React from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { StickerControlsProps } from '../types';

const StickerControls: React.FC<StickerControlsProps> = ({ 
  prompt, 
  setPrompt, 
  onGenerate, 
  isGenerating,
  disabled 
}) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6E6FA] space-y-6">
      <div className="space-y-3">
        <label htmlFor="mood-input" className="block text-sm font-semibold text-[#4A4A6A] ml-1 tracking-wide">
          Add Personality (Optional)
        </label>
        <textarea
          id="mood-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., looking cool with sunglasses, laughing out loud..."
          className="w-full p-5 rounded-2xl bg-[#F5F5FF] border-2 border-transparent focus:border-[#E6E6FA] focus:bg-white focus:outline-none transition-all resize-none text-[#4A4A6A] placeholder-[#A0A0B0] h-32 text-base leading-relaxed"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className={`
          w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform tracking-wide
          ${disabled || isGenerating
            ? 'bg-[#F0F0F5] text-[#C0C0D0] cursor-not-allowed'
            : 'bg-[#FFDAB9] text-[#5A4A42] shadow-lg shadow-[#FFDAB9]/40 hover:bg-[#FFD1A6] hover:-translate-y-1 active:scale-[0.98]'
          }
        `}
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin text-[#5A4A42]" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Generate Sticker
          </>
        )}
      </button>
    </div>
  );
};

export default StickerControls;