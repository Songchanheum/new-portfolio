import { GoogleGenAI } from '@google/genai'

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('[lib/gemini] GOOGLE_API_KEY is not set. Check .env.local')
}

export const geminiClient = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })
export const GEMINI_MODEL = 'gemini-3.1-flash-lite-preview' as const
export const EMBEDDING_MODEL = 'gemini-embedding-001' as const
