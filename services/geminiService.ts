import { GoogleGenAI, Type } from "@google/genai";
import { SimplifiedReport } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is missing. Please check your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeReport = async (
  textInput: string | null,
  imageBase64: string | null
): Promise<SimplifiedReport> => {
  const modelName = "gemini-2.5-flash";

  const systemInstruction = `
    You are an empathetic, professional, and highly skilled medical assistant designed to help patients understand their medical reports. 
    Your goal is to analyze medical text or images of reports and translate them into clear, simple, plain English suitable for a layperson (6th-grade reading level).
    
    Guidelines:
    1. Tone: Reassuring, calm, and objective.
    2. Clarity: Avoid jargon. If a medical term is necessary, explain it immediately in parentheses or include it in the glossary.
    3. Structure: Break down the information into a summary, key takeaways, and a glossary of terms.
    4. Privacy: Do not output any PII (Personally Identifiable Information) like names, dates of birth, or IDs found in the source.
    5. Accuracy: Do not invent information. If the text is illegible or unclear, state that.
  `;

  const prompt = `
    Please analyze the provided medical report.
    
    Output the result in the following JSON format:
    {
      "summary": "A paragraph summarizing the main findings in simple language.",
      "keyPoints": ["Bullet point 1", "Bullet point 2", ...],
      "glossary": [
        {"term": "Medical Term", "definition": "Simple explanation"}
      ],
      "disclaimer": "A standard medical disclaimer stating this is AI-generated and not a replacement for professional medical advice."
    }
  `;

  const parts: any[] = [];

  if (imageBase64) {
    const cleanBase64 = imageBase64.split(",")[1] || imageBase64;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: cleanBase64,
      },
    });
  }

  if (textInput) {
    parts.push({
      text: textInput,
    });
  }

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: parts,
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            glossary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
                required: ["term", "definition"],
              },
            },
            disclaimer: { type: Type.STRING },
          },
          required: ["summary", "keyPoints", "glossary", "disclaimer"],
        },
      },
    });

    const text = (response as any).text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }
    return JSON.parse(text) as SimplifiedReport;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze the report. Please try again or check your input.");
  }
};

/**
 * Translate a full SimplifiedReport into targetLang
 * (summary, keyPoints, glossary, disclaimer)
 */
export const translateFullReport = async (
  report: SimplifiedReport,
  targetLang: string
): Promise<SimplifiedReport> => {
  const modelName = "gemini-2.5-flash";

  const prompt = `
    You are a medical translation assistant.
    Translate the following simplified medical report into ${targetLang}.
    
    - Keep the medical meaning accurate.
    - Maintain the SAME JSON structure as the input.
    - Do not add or remove any fields.
    
    Input JSON:
    ${JSON.stringify(report, null, 2)}
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: [{ text: prompt }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          keyPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          glossary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING },
              },
              required: ["term", "definition"],
            },
          },
          disclaimer: { type: Type.STRING },
        },
        required: ["summary", "keyPoints", "glossary", "disclaimer"],
      },
    },
  });

  const text = (response as any).text;
  if (!text) {
    throw new Error("Translation failed: empty response.");
  }

  return JSON.parse(text) as SimplifiedReport;
};
