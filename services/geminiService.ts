import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Task } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FLASH = 'gemini-2.5-flash';

export const generateSpiritRootFeedback = async (chaosScore: number): Promise<string> => {
  try {
    const prompt = `
      User just drew a spirit root symbol. 
      Chaos Score (0-100, higher is messier): ${chaosScore}.
      
      Act as a sarcastic Xianxia elder. 
      If score < 20: Praise their discipline but call it boring.
      If score > 80: Mock their chaotic drawing as "Abstract Daoism".
      Otherwise: Give a lukewarm assessment.
      Keep it under 30 words. Language: Chinese (Simplified).
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
    });
    return response.text || "灵根晦涩难明……";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "天机不可泄露 (API Error)";
  }
};

export const generateOfflineSummary = async (hours: number, rank: string, demon: number): Promise<string> => {
  try {
    const prompt = `
      Player was offline for ${hours.toFixed(1)} hours.
      Rank: ${rank}.
      Inner Demon Level: ${demon}%.
      
      Write a short, humorous cultivation log (max 100 words).
      Include 1 random "slacking off" event (e.g., sleeping, eating hotpot, watching clouds).
      Language: Chinese (Simplified).
    `;
    
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
    });
    return response.text || "闭关期间，似乎做了一个关于咸鱼的长梦……";
  } catch (error) {
    return "闭关结束，神清气爽。";
  }
};

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export const generateTribulationQuiz = async (rank: string): Promise<QuizQuestion[]> => {
  try {
    const prompt = `
      Generate 3 multiple choice questions for a "Heavenly Tribulation" exam for a cultivator at ${rank} rank.
      The questions should be a mix of:
      1. Absurd ethical dilemmas in a cultivation world.
      2. Modern office/programmer jokes disguised as cultivation lore.
      3. Traditional Chinese mythology.
      
      Language: Chinese (Simplified). THIS IS CRITICAL. ALL OUTPUT MUST BE CHINESE.
      
      Return valid JSON only.
      Schema: Array of objects with 'question' (string), 'options' (string array size 4), 'correctIndex' (0-3).
    `;

    const responseSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIndex: { type: Type.INTEGER }
        },
        required: ["question", "options", "correctIndex"]
      }
    };

    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Quiz Generation Error", error);
    // Fallback questions
    return [
      {
        question: "遇到心魔入侵，最好的处理方式是？",
        options: ["立刻斩杀", "与之讲道理", "邀请它一起摸鱼", "重启电脑"],
        correctIndex: 2
      },
      {
        question: "‘404 Not Found’ 在修仙界对应什么境界？",
        options: ["炼虚合道", "走火入魔", "丹田破碎", "虚无之境"],
        correctIndex: 3
      },
       {
        question: "道友请留步！下一句通常是？",
        options: ["请吃饭", "送法宝", "要倒霉了", "交个朋友"],
        correctIndex: 2
      }
    ];
  }
};

export const generateDailyTasks = async (rank: string): Promise<Task[]> => {
  try {
    const prompt = `
      Generate 4 funny "slacking off" tasks for a cultivator at ${rank} rank.
      Themes: Office life mixed with cultivation, fishing (moyu), hiding from bosses/elders.
      
      Language: Chinese (Simplified).
      
      Return valid JSON only.
      Schema: Array of objects.
    `;

    const responseSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["LINK", "GAME", "BATTLE"] },
          reward: {
             type: Type.OBJECT,
             properties: {
                 qi: { type: Type.INTEGER },
                 item: { type: Type.STRING }
             }
          },
          duration: { type: Type.INTEGER, description: "Duration in seconds, between 5 and 30" },
          completed: { type: Type.BOOLEAN }
        },
        required: ["id", "title", "description", "type", "reward", "duration"]
      }
    };

    const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });

    const text = response.text;
    if (!text) throw new Error("No text generated");
    const tasks = JSON.parse(text) as any[];
    
    // Ensure IDs and default values
    return tasks.map((t, i) => ({
        ...t,
        id: `task-${Date.now()}-${i}`,
        completed: false
    }));

  } catch (error) {
      console.error("Task Gen Error", error);
      return [
          {
              id: 't1',
              title: '带薪如厕',
              description: '躲在茅房（厕所）修炼五谷轮回之术，实则刷玉简（手机）。',
              type: 'GAME',
              reward: { qi: 50, item: '劣质手纸' },
              duration: 5,
              completed: false
          },
          {
              id: 't2',
              title: '神游太虚',
              description: '在掌门（老板）眼皮底下睁眼睡觉。',
              type: 'LINK',
              reward: { qi: 100 },
              duration: 10,
              completed: false
          }
      ];
  }
};