export interface StickerState {
  originalImage: string | null;
  generatedStickers: string[];
  prompt: string;
  isGenerating: boolean;
  error: string | null;
}

export interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  selectedImage: string | null;
}

export interface StickerControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

export interface ResultDisplayProps {
  generatedStickers: string[];
  isGenerating: boolean;
  onReset: () => void;
}