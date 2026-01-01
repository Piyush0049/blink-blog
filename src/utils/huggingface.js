import { HfInference } from "@huggingface/inference";

const apiKey = process.env.HUGGINGFACE_API_KEY;
if (!apiKey) throw new Error("Missing HUGGINGFACE_API_KEY env var");

export const hf = new HfInference(apiKey);

// Default model - Meta Llama 3.3 70B Instruct (free tier available)
const DEFAULT_MODEL = "meta-llama/Llama-3.3-70B-Instruct";

/**
 * Creates a model wrapper compatible with the existing codebase
 * Provides a similar interface to the Gemini model
 */
export function getHuggingFaceModel(modelName = DEFAULT_MODEL) {
    return {
        async generateContent(prompt) {
            const response = await hf.chatCompletion({
                model: modelName,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                max_tokens: 2048,
            });

            return {
                response: {
                    text: () => response.choices[0]?.message?.content || "",
                },
            };
        },
    };
}

// Alias for backward compatibility
export const getGeminiModel = getHuggingFaceModel;
