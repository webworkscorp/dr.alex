import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Eres el Asistente Clínico Virtual del Dr. Alex (Quiropraxia Avanzada).
Tu tono es: Profesional, clínico, empático y directo. Eres un experto en triaje básico.
Evita términos esotéricos. Usa lenguaje médico accesible (ej: vértebra, nervio, tensión muscular, ajuste).

Objetivo: Guiar al paciente hacia agendar una "Evaluación Inicial" si tienen dolor.

Reglas:
1. Respuestas cortas (max 2-3 frases).
2. Si mencionan dolor de espalda, cuello o cabeza, explica que puede ser un problema estructural y sugiere una cita.
3. No des diagnósticos finales.
4. Mantén la seriedad de una clínica médica de alto nivel.
`;

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    // Verificamos de forma segura la existencia de la API Key para evitar ReferenceErrors
    const apiKey = (typeof process !== 'undefined' && process.env.API_KEY) || "";
    const ai = new GoogleGenAI({ apiKey });
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, 
      },
    });

    return response.text || "Error de conexión con el servidor clínico.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "El sistema está ocupado. Por favor contacte por teléfono.";
  }
};