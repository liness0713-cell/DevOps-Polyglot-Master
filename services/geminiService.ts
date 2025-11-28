import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCourse } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema to ensure strict JSON output
const courseSchema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    overview: {
      type: Type.OBJECT,
      properties: {
        en: { type: Type.STRING },
        zh: { type: Type.STRING },
        ja: { type: Type.STRING },
      },
      required: ["en", "zh", "ja"],
    },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.OBJECT,
            properties: {
              en: { type: Type.STRING },
              zh: { type: Type.STRING },
              ja: { type: Type.STRING },
            },
            required: ["en", "zh", "ja"],
          },
          content: {
            type: Type.OBJECT,
            properties: {
              en: { type: Type.STRING, description: "Markdown supported" },
              zh: { type: Type.STRING, description: "Markdown supported" },
              ja: { type: Type.STRING, description: "HTML with <ruby> tags mandatory for Kanji" },
            },
            required: ["en", "zh", "ja"],
          },
        },
        required: ["title", "content"],
      },
    },
  },
  required: ["topic", "overview", "sections"],
};

export const generateCourseContent = async (topicName: string): Promise<GeneratedCourse> => {
  const modelId = 'gemini-2.5-flash';

  const systemInstruction = `
    You are an expert DevOps Technical Instructor.
    Your goal is to explain the technology "${topicName}" comprehensively, from basic concepts to practical application.
    
    Structure the course with these sections:
    1. What is it? (Core Concept)
    2. Architecture & Components
    3. Key Features
    4. Hands-on Practical Guide (Commands, Code Snippets, Configuration)
    5. Best Practices & Pitfalls
    
    CRITICAL LANGUAGE REQUIREMENTS:
    1. Output MUST be in strictly valid JSON format matching the schema.
    2. English (en): Professional technical English. Use Markdown for code blocks.
    3. Chinese (zh): Simplified Chinese. Professional terminology.
    4. Japanese (ja):
       - MUST use HTML <ruby> tags for EVERY Kanji character in the text.
       - Format: <ruby>漢字<rt>かんじ</rt></ruby>
       - Example: <ruby>設定<rt>せってい</rt></ruby>ファイルを<ruby>作成<rt>さくせい</rt></ruby>します。
       - Do NOT use ruby tags inside code blocks (keep code blocks as standard Markdown).
       - Ensure the Japanese is natural and professional.
  `;

  const prompt = `Create a complete guide for ${topicName}.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: courseSchema,
        temperature: 0.3, // Lower temperature for more factual/structured output
      },
    });

    if (response.text) {
        return JSON.parse(response.text) as GeneratedCourse;
    }
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
