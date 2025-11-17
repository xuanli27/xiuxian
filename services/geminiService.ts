import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Task } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FLASH = 'gemini-2.5-flash';

export const generateSpiritRootFeedback = async (chaosScore: number): Promise<string> => {
  try {
    const prompt = `
      User just drew a spirit root symbol. 
      Chaos Score (0-100, higher is messier): ${chaosScore}.
      
      Act as a sarcastic HR of the "Xianyu Sect" (Salted Fish Sect). 
      If score < 20: Praise their ability to follow rules, but call them a "Corporate Slave".
      If score > 80: Praise their chaotic energy as "Upper Management Material".
      Otherwise: Call them "Mediocre Middleware".
      Keep it under 30 words. Language: Chinese (Simplified).
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
    });
    return response.text || "资质平平，适合做个螺丝钉。";
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
      Stress/Inner Demon Level: ${demon}%.
      
      Write a short cultivation log (max 100 words) tailored to a "Slacking Off Cultivator" in a corporate sect.
      Events should be like: "Spent 3 hours in the toilet pretending to meditate", "Drank 5 cups of bubble tea elixir".
      Language: Chinese (Simplified).
    `;
    
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
    });
    return response.text || "闭关期间，似乎做了一个关于带薪拉屎的长梦……";
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
      Generate 3 multiple choice questions for a "Performance Review" (Heavenly Tribulation) for a cultivator at ${rank} rank in the "Xianyu Sect".
      
      THEME: Workplace survival, slacking off (moyu), dealing with bosses/clients, but wrapped in Xianxia terms.
      Strictly use Chinese (Simplified).
      
      Questions MUST be about:
      - Hiding windows when boss comes.
      - Excuses for being late/missing deadlines.
      - Dealing with unreasonable demands.
      - Office snack distribution.
      
      Examples: 
      - "The Sect Master (Boss) walks by. You are watching videos. What do you do?" -> "Cast 'Alt-Tab' Instant Shift Technique".
      - "Client wants to change requirements for the 10th time." -> "Activate 'Passive Aggressive' shield".
      
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
    return [
      {
        question: "当宗主（老板）经过你身后时，你正在看小说，此时应施展什么神通？",
        options: ["Alt-Tab 瞬移术", "黑屏隐身决", "强行解释大道", "邀请宗主一起看"],
        correctIndex: 0
      },
      {
        question: "‘这个需求很简单，怎么实现我不管’ 是哪种心魔？",
        options: ["产品经理之怒", "甲方噬魂咒", "技术债", "无论如何都得加钱"],
        correctIndex: 1
      },
       {
        question: "面对周五下午5点的紧急会议（天劫），最佳应对策略是？",
        options: ["立刻接受挑战", "施展‘肚子疼’遁术", "断网闭关", "带薪加班"],
        correctIndex: 1
      }
    ];
  }
};

export const generateDailyTasks = async (rank: string): Promise<Task[]> => {
  try {
    const prompt = `
      Generate 4 daily tasks for the "Xianyu Sect" (Salted Fish Sect).
      Rank: ${rank}.
      
      Task types must be strictly about:
      1. Wasting time at work.
      2. Getting free food/drinks.
      3. Avoiding responsibilities.
      4. Office politics (funny side).
      
      Language: Chinese (Simplified).
      Return valid JSON only.
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
                 contribution: { type: Type.INTEGER },
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
      return [
          {
              id: 't1',
              title: '带薪如厕',
              description: '在五谷轮回之所刷手机，腿不麻不出来。',
              type: 'GAME',
              reward: { qi: 50, contribution: 10, item: '劣质手纸' },
              duration: 5,
              completed: false
          },
          {
              id: 't2',
              title: '茶水间论道',
              description: '聚集在茶水间八卦，消耗公司咖啡豆。',
              type: 'LINK',
              reward: { qi: 100, contribution: 20 },
              duration: 10,
              completed: false
          }
      ];
  }
};