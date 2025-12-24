
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTIONS } from "../constants";
import { SmartTaskAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeTask = async (title: string, description: string): Promise<SmartTaskAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Task Title: ${title}\nDescription: ${description}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
            subtasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedMinutes: { type: Type.NUMBER }
          },
          required: ["category", "priority", "subtasks", "estimatedMinutes"]
        }
      }
    });

    return JSON.parse(response.text.trim()) as SmartTaskAnalysis;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback values
    return {
      category: "Uncategorized",
      priority: "medium",
      subtasks: ["Review task details"],
      estimatedMinutes: 30
    };
  }
};
