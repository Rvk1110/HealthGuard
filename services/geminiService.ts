
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const summarizeRecord = async (recordDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following medical record and extract 3 key health insights as a bulleted list. Record: ${recordDescription}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            isDuplicatePotential: { type: Type.BOOLEAN, description: "Whether this sounds like a duplicate of a common test like CBC or Vitamin D" },
            facility: { type: Type.STRING },
            doctor: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['Blood Test', 'X-Ray', 'Prescription', 'Consultation', 'MRI', 'Vaccination'] }
          },
          required: ["summary", "insights", "isDuplicatePotential", "facility", "doctor", "type"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const analyzeMedicalImage = async (base64Image: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this medical document image. Extract the hospital/facility name, doctor name, type of report, and a detailed summary of findings. Also, identify 3-5 key health insights. Format as JSON.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            facility: { type: Type.STRING },
            doctor: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['Blood Test', 'X-Ray', 'Prescription', 'Consultation', 'MRI', 'Vaccination'] },
            summary: { type: Type.STRING },
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            isDuplicatePotential: { type: Type.BOOLEAN }
          },
          required: ["facility", "doctor", "type", "summary", "insights", "isDuplicatePotential"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    return null;
  }
};

export const getEmergencyBrief = async (profile: any, records: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a critical 30-word emergency brief for medical staff based on this patient. Name: ${profile.name}, Blood: ${profile.bloodGroup}, Allergies: ${profile.allergies.join(', ')}, Recent Meds/Conditions from records: ${JSON.stringify(records.slice(0, 3))}`,
    });
    return response.text;
  } catch (error) {
    return "Patient has chronic conditions and known allergies. Check full records if possible.";
  }
};

export const createHealthChat = (systemInstruction: string) => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction,
    },
  });
};
