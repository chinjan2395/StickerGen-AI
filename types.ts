export interface StickerState {
  originalImages: string[];
  generatedStickers: string[];
  prompt: string;
  isGenerating: boolean;
  error: string | null;
}

export interface ImageUploaderProps {
  onImagesChange: (images: string[]) => void;
  selectedImages: string[];
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