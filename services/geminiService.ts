import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * Generates a sticker based on an input image and a mood description.
 */
export const generateSticker = async (
  imageBase64: string,
  moodDescription: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  // Remove header if present to get raw base64 data
  const base64Data = imageBase64.split(',')[1] || imageBase64;

  const model = "gemini-2.5-flash-image";

  // Engineered prompt for sticker generation
  // Transform this image into a high-quality, stylized die-cut chibi sticker character which can be used as Whatsapp sticker.
  // - Vector illustration cute chibi sticker art.
  const promptText = `
    Automatically generate a 3x3 grid of stickers, each depicting a different mood (e.g., angry, happy, sad, crying, laughing, kissing with heart emoji, proud with black sunglasses, annoyed etc.) from the uploaded photo.
    
    Style requirements:
    - Vector illustration cute chibi sticker art.
    - ACCURATELY CAPTURE the subject's body type and proportions.
    - Focus heavily on capturing the unique PERSONALITY, attitude, and facial expression of the subject.
    - Add a semi-thick white die-cut border around the character.
    - The background MUST be a solid white color (effectively transparent for stickers).
    
    Specific details:
    ${moodDescription ? `The character should express this mood/pose: ${moodDescription}` : 'Enhance the personality and expression found in the original photo.'}
    
    Output ONLY the image.
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
              mimeType: "image/jpeg", // Assuming JPEG for simplicity, works with PNG data too usually
            },
          },
        ],
      },
      config: {
        // We do not use responseMimeType: 'image/jpeg' here as it's not always supported for image generation responses in this specific way via generateContent on all models,
        // but 2.5 flash image returns an image part.
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
      // Sometimes it might return text if it refuses
      const textPart = parts.find(p => p.text);
      if (textPart) {
        throw new Error(`Generation failed: ${textPart.text}`);
      }
      throw new Error("No image generated.");
    }

    return `data:image/png;base64,${generatedImageBase64}`;

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "Failed to generate sticker.");
  }
};