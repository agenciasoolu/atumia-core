
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Fix: Initialize GoogleGenAI with the API key directly from process.env.API_KEY
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeLeadConversation(messages: string[]) {
    const prompt = `Analise a seguinte conversa de vendas e extraia informações estruturadas:
    Conversa:
    ${messages.join('\n')}
    
    Extraia:
    1. Nome do Lead
    2. Interesse principal
    3. Urgência (Baixa, Média, Alta)
    4. Lead Score (0-100)
    5. Resumo Executivo (Máximo 2 parágrafos)`;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              interest: { type: Type.STRING },
              urgency: { type: Type.STRING },
              score: { type: Type.NUMBER },
              summary: { type: Type.STRING }
            },
            // Fix: Use propertyOrdering as recommended for structured JSON output
            propertyOrdering: ["name", "interest", "urgency", "score", "summary"]
          }
        }
      });

      // Fix: Use the .text property directly (not as a method)
      const jsonStr = response.text?.trim();
      return JSON.parse(jsonStr || "{}");
    } catch (error) {
      console.error("Gemini analysis failed:", error);
      return null;
    }
  }

  async generateSDRResponse(context: string, lastUserMessage: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Você é um SDR técnico da Atumia Core. Use um tom profissional, industrial e direto.
        Contexto do Lead: ${context}
        Última mensagem: ${lastUserMessage}`,
        config: {
          systemInstruction: "Seu objetivo é qualificar o lead extraindo Nome, Interesse e Urgência. Se o lead estiver pronto, sugira um agendamento. Seja breve e sólido."
        }
      });
      // Fix: Access response text using the .text property
      return response.text;
    } catch (error) {
      console.error("Gemini response generation failed:", error);
      return "Estou analisando suas informações. Um momento, por favor.";
    }
  }
}

export const gemini = new GeminiService();
