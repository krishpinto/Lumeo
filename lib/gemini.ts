// lib/gemini.ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-1.5-flash", // or "gemini-pro"
  temperature: 0.7,
  maxOutputTokens: 8192,
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});
