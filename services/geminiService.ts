import { GoogleGenAI, Modality } from "@google/genai";
import { SimplificationLevel, SimplifyOptions } from "../types";
import { Attachment } from "../components/InputArea";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const simplifyText = async (
  text: string, 
  attachment: Attachment | null,
  options: SimplifyOptions
): Promise<string> => {
  if (!text.trim() && !attachment) return "";

  let systemInstruction = "You are an expert educational accessibility assistant. Your goal is to rewrite complex academic text into clear, simple English.";
  
  let instructions = `Please rewrite the input according to these rules:\n`;
  
  switch (options.level) {
    case SimplificationLevel.MiddleSchool:
      instructions += "- Use very simple vocabulary (Grade 6 level).\n- Keep sentences short and direct.\n- Avoid jargon.\n";
      break;
    case SimplificationLevel.HighSchool:
      instructions += "- Use clear, standard English (Grade 9 level).\n- Clarify complex terms.\n- Maintain a professional but accessible tone.\n";
      break;
    case SimplificationLevel.BulletPoints:
      instructions += "- Convert the text into a checklist of actions.\n- Extract key information into bullet points.\n- Be extremely concise.\n";
      break;
  }

  if (options.highlightDeadlines) {
    instructions += "- If there are any dates or deadlines, list them explicitly at the very top in bold.\n";
  }

  if (options.includeExamples) {
    instructions += `
    - CRITICAL: After the simplified instructions, generate a specific, concrete example of what the task requires.
    - If it's an essay, write a short example paragraph.
    - If it's a math problem, show a similar solved example.
    - Label this section clearly as "### Example".
    `;
  }

  // Construct the contents for the API
  // We can mix text and image/pdf data in the 'parts' array.
  const parts: any[] = [];

  // Add attachment if present
  if (attachment) {
    parts.push({
      inlineData: {
        mimeType: attachment.mimeType,
        data: attachment.data
      }
    });
  }

  // Add the text prompt (User instructions + System rules)
  let textPrompt = instructions;
  if (text.trim()) {
    textPrompt += `\n\nInput Text to Simplify:\n"${text}"`;
  } else if (attachment) {
    textPrompt += `\n\n(Simplify the text found in the attached document/image)`;
  }

  parts.push({ text: textPrompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      }
    });

    return response.text || "Could not generate a simplification. Please try again.";
  } catch (error) {
    console.error("Error simplifying text:", error);
    throw new Error("Failed to simplify. If you uploaded a large PDF, try a smaller section or an image.");
  }
};

// TTS Helper: Decode base64 audio
const decodeAudioData = async (
  base64String: string,
  audioContext: AudioContext
): Promise<AudioBuffer> => {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Re-implementing manual PCM decoding as per guideline example for best compatibility
  // Assuming 16-bit PCM, 24kHz sample rate (standard for Gemini TTS Preview)
  const dataInt16 = new Int16Array(bytes.buffer);
  const sampleRate = 24000;
  const numChannels = 1;
  
  const audioBuffer = audioContext.createBuffer(numChannels, dataInt16.length, sampleRate);
  const channelData = audioBuffer.getChannelData(0);
  
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  
  return audioBuffer;
};

export const speakText = async (text: string): Promise<void> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, // 'Puck' is often good for neutral/clear reading
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data received");
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextClass({ sampleRate: 24000 });
    
    const audioBuffer = await decodeAudioData(base64Audio, audioContext);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();

  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error("Failed to generate speech.");
  }
};