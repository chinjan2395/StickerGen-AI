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
    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-pink-100/50 border border-pink-100 space-y-4">
      <div className="space-y-2">
        <label htmlFor="mood-input" className="block text-sm font-bold text-gray-700 ml-1">
          Add Personality (Optional)
        </label>
        <textarea
          id="mood-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., looking cool with sunglasses, laughing out loud, striking a powerful pose..."
          className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-pink-300 focus:bg-white focus:outline-none transition-all resize-none text-gray-700 placeholder-gray-400 h-24"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className={`
          w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform
          ${disabled || isGenerating
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-pink-500/30 hover:-translate-y-1 active:scale-[0.98]'
          }
        `}
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin" />
            Generating Sticker...
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