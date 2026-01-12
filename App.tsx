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
    generatedImage: null,
    prompt: '',
    isGenerating: false,
    error: null,
  });

  const handleImageSelected = (base64: string) => {
    setState(prev => ({
      ...prev,
      originalImage: base64 || null,
      generatedImage: null, // Reset generated result when new image uploaded
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
      const result = await generateSticker(state.originalImage, state.prompt);
      setState(prev => ({
        ...prev,
        generatedImage: result,
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

  const handleDownload = () => {
    if (!state.generatedImage) return;
    
    const link = document.createElement('a');
    link.href = state.generatedImage;
    link.download = `sticker-gen-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
      setState(prev => ({
          ...prev,
          generatedImage: null,
          prompt: ''
      }));
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation / Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-pink-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg text-white">
              <Sparkles size={24} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
              StickerGen
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-sm text-gray-500 font-medium">
            <span>Made with</span>
            <Heart size={14} className="fill-pink-400 text-pink-400" />
            <span>& Gemini 2.5</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Intro */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
            Turn your pics into <span className="text-pink-500 underline decoration-wavy decoration-pink-300 decoration-2">expressive</span> stickers.
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Upload a photo, describe a mood, and our AI will create a custom die-cut sticker that captures the unique personality and vibe.
          </p>
        </div>

        {/* Error Banner */}
        {state.error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 flex items-center justify-center font-medium animate-pulse">
            {state.error}
          </div>
        )}

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-pink-100/50">
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
          <div className="hidden lg:flex lg:col-span-2 h-full items-center justify-center pt-20">
             <div className="text-pink-200">
                <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20H90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 10"/>
                    <path d="M75 5L95 20L75 35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-5">
            <ResultDisplay 
              generatedImage={state.generatedImage} 
              isGenerating={state.isGenerating} 
              onDownload={handleDownload}
              onReset={handleReset}
            />
          </div>

        </div>

        {/* Tips Section */}
        <div className="mt-20 border-t border-pink-100 pt-10 pb-10">
            <h3 className="text-center text-gray-400 font-semibold uppercase tracking-widest text-sm mb-8">Pro Tips for Best Stickers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-4 font-bold">1</div>
                    <h4 className="font-bold text-gray-800 mb-2">Clear Subjects</h4>
                    <p className="text-gray-500 text-sm">Use photos where the face or character is clearly visible. Good lighting helps capture expression.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mb-4 font-bold">2</div>
                    <h4 className="font-bold text-gray-800 mb-2">Describe Personality</h4>
                    <p className="text-gray-500 text-sm">Try "confident and cool", "laughing hysterically", or "skeptical" to guide the style.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4 font-bold">3</div>
                    <h4 className="font-bold text-gray-800 mb-2">Backgrounds</h4>
                    <p className="text-gray-500 text-sm">Stickers come with a white border. The AI will remove the original background automatically.</p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;