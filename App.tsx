import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import StickerControls from './components/StickerControls';
import ResultDisplay from './components/ResultDisplay';
import { generateSticker } from './services/geminiService';
import { StickerState } from './types';
import { Sparkles, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<StickerState>({
    originalImage: null,
    generatedStickers: [],
    prompt: '',
    isGenerating: false,
    error: null,
  });

  const handleImageSelected = (base64: string) => {
    setState(prev => ({
      ...prev,
      originalImage: base64 || null,
      generatedStickers: [], // Reset generated result when new image uploaded
      error: null
    }));
  };

  const handlePromptChange = (prompt: string) => {
    setState(prev => ({ ...prev, prompt }));
  };

  const handleGenerate = async () => {
    if (!state.originalImage) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const stickers = await generateSticker(state.originalImage, state.prompt);
      setState(prev => ({
        ...prev,
        generatedStickers: stickers,
        isGenerating: false
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: err.message || "Something went wrong. Please try again."
      }));
    }
  };

  const handleReset = () => {
      setState(prev => ({
          ...prev,
          generatedStickers: [],
          prompt: ''
      }));
  }

  return (
    <div className="min-h-screen pb-20 bg-[#F5F5FF]">
      {/* Navigation / Header */}
      <nav className="bg-white/60 backdrop-blur-md sticky top-0 z-50 border-b border-[#E6E6FA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E6E6FA] rounded-xl flex items-center justify-center text-[#9370DB]">
              <Sparkles size={22} />
            </div>
            <span className="text-2xl font-semibold tracking-tight text-[#4A4A6A]">
              StickerGen<span className="text-[#FFDAB9]">.ai</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-sm text-[#8E8EA8] font-medium">
            <span>Made with</span>
            <Heart size={14} className="fill-[#FFDAB9] text-[#FFDAB9]" />
            <span>& Gemini 2.5</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 md:mt-12">
        
        {/* Intro */}
        <div className="text-center mb-10 md:mb-16 space-y-5">
          <h1 className="text-3xl md:text-5xl font-bold text-[#4A4A6A] tracking-tight leading-tight">
            Turn photos into <span className="relative inline-block">
              expressive
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#FFDAB9]/40 -z-10 rounded-full transform -rotate-1"></span>
            </span> stickers.
          </h1>
          <p className="text-lg text-[#8E8EA8] max-w-2xl mx-auto font-light leading-relaxed">
            Upload a photo, describe a mood, and create a custom die-cut sticker that captures the unique personality.
          </p>
        </div>

        {/* Error Banner */}
        {state.error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-400 flex items-center justify-center font-medium animate-pulse">
            {state.error}
          </div>
        )}

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-10 items-start">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <div className="bg-white p-1.5 md:p-2 rounded-[2rem] shadow-sm border border-[#E6E6FA]">
                <ImageUploader 
                    onImageSelected={handleImageSelected} 
                    selectedImage={state.originalImage} 
                />
            </div>
            
            <StickerControls 
              prompt={state.prompt} 
              setPrompt={handlePromptChange} 
              onGenerate={handleGenerate}
              isGenerating={state.isGenerating}
              disabled={!state.originalImage}
            />
          </div>

          {/* Center Column: Arrow (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-2 h-full items-center justify-center pt-24 opacity-50">
             <div className="text-[#E6E6FA]">
                <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 20H110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 8"/>
                    <path d="M95 5L110 20L95 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-5">
            <ResultDisplay 
              generatedStickers={state.generatedStickers} 
              isGenerating={state.isGenerating} 
              onReset={handleReset}
            />
          </div>

        </div>

        {/* Tips Section */}
        <div className="mt-16 md:mt-24 border-t border-[#E6E6FA] pt-12 pb-12">
            <h3 className="text-center text-[#8E8EA8] font-semibold uppercase tracking-widest text-xs mb-10">Pro Tips for Perfect Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#F0F0FF] hover:border-[#FFDAB9] transition-colors">
                    <div className="w-12 h-12 bg-[#F5F5FF] rounded-2xl flex items-center justify-center text-[#9370DB] mb-5 font-bold text-xl">1</div>
                    <h4 className="font-semibold text-[#4A4A6A] mb-3 text-lg">Clear Subjects</h4>
                    <p className="text-[#8E8EA8] text-sm leading-relaxed">Use photos where the face is clearly visible. Good lighting helps the AI capture the micro-expressions.</p>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#F0F0FF] hover:border-[#FFDAB9] transition-colors">
                    <div className="w-12 h-12 bg-[#FFF5EE] rounded-2xl flex items-center justify-center text-[#E9967A] mb-5 font-bold text-xl">2</div>
                    <h4 className="font-semibold text-[#4A4A6A] mb-3 text-lg">Describe Mood</h4>
                    <p className="text-[#8E8EA8] text-sm leading-relaxed">Try "confident smile", "laughing hysterically", or "skeptical brow raise" to guide the artistic style.</p>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#F0F0FF] hover:border-[#FFDAB9] transition-colors">
                    <div className="w-12 h-12 bg-[#F0FFF4] rounded-2xl flex items-center justify-center text-[#66CDAA] mb-5 font-bold text-xl">3</div>
                    <h4 className="font-semibold text-[#4A4A6A] mb-3 text-lg">Clean Output</h4>
                    <p className="text-[#8E8EA8] text-sm leading-relaxed">The AI generates a clean white die-cut border automatically, making it ready for instant messaging use.</p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;