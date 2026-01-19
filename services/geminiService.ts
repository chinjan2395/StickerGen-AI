import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * Slices a 3x3 grid image into 9 individual images.
 */
const sliceImage = async (base64Image: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const pieces: string[] = [];
      const cols = 3;
      const rows = 3;
      const pieceWidth = img.width / cols;
      const pieceHeight = img.height / rows;

      const canvas = document.createElement('canvas');
      canvas.width = pieceWidth;
      canvas.height = pieceHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          ctx.clearRect(0, 0, pieceWidth, pieceHeight);
          
          // Fixed: Removed the margin/zoom logic that was causing cropping.
          // Now extracting the exact full 1/9th tile without cutting edges.
          ctx.drawImage(
            img,
            x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, // Source
            0, 0, pieceWidth, pieceHeight // Destination
          );
          pieces.push(canvas.toDataURL('image/png'));
        }
      }
      resolve(pieces);
    };
    img.onerror = (e) => reject(new Error("Failed to load image for slicing"));
    img.src = base64Image;
  });
};

/**
 * Generates a set of 9 stickers based on an input image and a mood description.
 */
export const generateSticker = async (
  imageBase64: string,
  moodDescription: string
): Promise<string[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  // Remove header if present to get raw base64 data
  const base64Data = imageBase64.split(',')[1] || imageBase64;

  const model = "gemini-2.5-flash-image";

  // Engineered prompt for sticker generation with strict grid enforcement and identity preservation
  const promptText = `
    Task: Create a "Sprite Sheet" containing EXACTLY 9 unique stickers arranged in a perfect 3x3 grid.
    Subject: The person in the uploaded photo.

    IDENTITY & STYLE INSTRUCTIONS (VERY IMPORTANT):
    1.  **Caricature Likeness**: The stickers MUST look like the specific person in the photo. Capture their unique face shape, nose, eyes, and skin tone.
    2.  **Key Features**: You MUST Preserve their exact hairstyle, hair color, glasses (if any), facial hair (if any), and clothing style. Do not turn them into a generic anime character.
    3.  **Style**: High-quality, expressive "Chibi" or "Kawaii" sticker art. Thick lines, vibrant colors.
    4.  **Format**: Add a thick white die-cut border around the character contour.

    LAYOUT INSTRUCTIONS (CRITICAL FOR CROPPING):
    1.  **Strict 3x3 Grid**: Generate a single square image divided into 3 rows and 3 columns.
    2.  **Safety Margin**: Draw the characters slightly SMALLER. They should occupy only about 65-70% of the grid cell size.
    3.  **Padding**: REQUIRED. Leave LARGE amount of whitespace buffer around every sticker to ensure no part of the sticker touches the grid edges.
    4.  **Centering**: Perfectly center each character in its 1/9th section.
    5.  **No Artifacts**: Background must be pure solid white. No grid lines, no text, no numbers, no titles.

    Expressions Grid (Left to Right, Top to Bottom):
    1. Waving / Hello
    2. Laughing Hard (ROFL)
    3. Cool / Sunglasses
    4. Heart Eyes / In Love
    5. Crying / Sad
    6. Angry / Fuming
    7. Confused / Question marks
    8. Celebrating / Party
    9. ${moodDescription ? moodDescription : 'Surprised / Shocked'}

    Return ONLY the image sprite sheet.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: promptText,
          },
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg",
            },
          },
        ],
      },
      config: {
        // Enforce square aspect ratio to encourage 3x3 symmetry
        imageConfig: {
            aspectRatio: "1:1"
        }
      }
    });

    // Parse response
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No response from Gemini.");
    }

    const parts = candidates[0].content.parts;
    let generatedImageBase64 = "";

    // Iterate to find the image part
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedImageBase64 = part.inlineData.data;
        break;
      }
    }

    if (!generatedImageBase64) {
      const textPart = parts.find(p => p.text);
      if (textPart) {
        throw new Error(`Generation failed: ${textPart.text}`);
      }
      throw new Error("No image generated.");
    }

    const fullGridImage = `data:image/png;base64,${generatedImageBase64}`;
    
    // Slice the grid into 9 stickers
    const stickers = await sliceImage(fullGridImage);
    return stickers;

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "Failed to generate stickers.");
  }
};