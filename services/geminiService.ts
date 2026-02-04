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
          
          // Extract the full 1/9th tile
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
 * Generates a set of 9 stickers based on input images (up to 3) and a mood description.
 */
export const generateSticker = async (
  imageArray: string[],
  moodDescription: string
): Promise<string[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  // NOTE: 'gemini-2.5' does not exist yet. Assuming you mean 2.0-flash-exp or 1.5-pro.
  // 1.5-Pro is often better for complex multi-character instruction following.
  const model = "gemini-2.5-flash-image"; 
  const numSubjects = imageArray.length;
  const isMulti = numSubjects > 1;

  // --- STEP 1: DYNAMIC PARTS CONSTRUCTION (INTERLEAVING) ---
  const parts: any[] = [];

  // Loop through images and "bind" them to specific identities (Person A, B, C)
  imageArray.forEach((img, index) => {
      const personLabel = String.fromCharCode(65 + index); // Generates 'A', 'B', 'C'
      const base64Data = img.split(',')[1] || img;

      // 1. Strict Identity Label (Text)
      parts.push({ 
          text: `REFERENCE IMAGE ${index + 1} (This is Person ${personLabel}). \nLook at this face specifically for Character ${personLabel}.` 
      });

      // 2. The Image Data
      parts.push({
          inlineData: {
              data: base64Data,
              mimeType: "image/jpeg", // Ensure your input is actually consistent, or detect mime type
          }
      });
  });

  // --- STEP 2: MAIN INSTRUCTION PROMPT ---
  // We remove the "Inputs" section from here because we handled it above manually.
  const promptText = `
    ROLE: Expert Character Designer & Sticker Artist.

    TASK: Generate a "Sprite Sheet" image with a 3x3 grid (9 total stickers).

    CONTEXT:
    - I have provided ${numSubjects} reference images above.
    ${isMulti 
      ? `- You must treat them as ${numSubjects} DISTINCT INDIVIDUALS.` 
      : '- This is the sole character.'
    }

    STRICT IDENTITY MAPPING (CRITICAL):
    1. **Mapping**:
       - The character drawn as "Person A" MUST look like Reference Image 1 (Above).
       - The character drawn as "Person B" MUST look like Reference Image 2 (Above).
       ${numSubjects > 2 ? '- The character drawn as "Person C" MUST look like Reference Image 3 (Above).' : ''}
    2. **Differentiation**: 
       - It is a FAILURE if Person A and Person B share the same face. 
       - Draw different hairstyles, eye shapes, and accessories exactly as seen in their specific reference photos.

    COMPOSITION RULES:
    1. **3x3 Grid Layout**: Single image, 9 equal cells.
    2. **Group Interaction**: ${isMulti 
        ? `Each cell must show ALL ${numSubjects} characters interacting together.` 
        : 'Center the character in the cell.'}
    3. **Style**: Chibi/Kawaii Sticker Art. Big heads, small bodies. White die-cut border. Solid white background.

    SCENES (Generate these 9 variations):
    1. ${isMulti ? 'Group: Waving Hello' : 'Waving Hello'}
    2. ${isMulti ? 'Group: Laughing Hysterically' : 'Laughing Hysterically'}
    3. ${isMulti ? 'Group: Wearing Sunglasses' : 'Cool with Sunglasses'}
    4. ${isMulti ? 'Group: Hugging (Cheeks pressed together)' : 'Heart Eyes'}
    5. ${isMulti ? 'Group: Crying/Sad' : 'Crying'}
    6. ${isMulti ? 'Group: Angry/Fuming' : 'Angry'}
    7. ${isMulti ? 'Group: Confused (? marks)' : 'Confused'}
    8. ${isMulti ? 'Group: Partying' : 'Party'}
    9. ${moodDescription ? (isMulti ? `Group: ${moodDescription}` : moodDescription) : 'Surprised'}

    FAILURE CONDITIONS:
    - Failure if Person A and Person B look identical.
    - Failure if any sticker shows only 1 person (when multi-mode is on).
    - Failure if background is not white.

    Return ONLY the generated sprite sheet image.
  `;

  // Add the main instructions at the end of the conversation
  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts, // We pass our constructed interleaved array here
      },
      config: {
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

    const contentParts = candidates[0].content.parts;
    let generatedImageBase64 = "";

    for (const part of contentParts) {
      if (part.inlineData && part.inlineData.data) {
        generatedImageBase64 = part.inlineData.data;
        break;
      }
    }

    if (!generatedImageBase64) {
      const textPart = contentParts.find(p => p.text);
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