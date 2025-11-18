import { generateText, generateObject } from 'ai';
import { z } from 'zod';
import type { Task } from '@/types';
import { MATERIALS } from '@/data/constants';
import { getAIModel } from './config';

const model = getAIModel();

export const generateSpiritRootFeedback = async (chaosScore: number): Promise<string> => {
  try {
    const prompt = `
      User just drew a spirit root symbol. 
      Chaos Score (0-100, higher is messier): ${chaosScore}.
      
      Act as a sarcastic HR of the "Xianyu Sect" (Salted Fish Sect). 
      If score < 20: Praise their ability to follow rules, but call them a "Corporate Slave" (社畜).
      If score > 80: Praise their chaotic energy as "Upper Management Material" (画饼大师).
      Otherwise: Call them "Mediocre Middleware" (耗材).
      Keep it under 30 words. Language: Chinese (Simplified).
    `;

    const { text } = await generateText({
      model,
      prompt,
    });
    
    return text || "资质平平，适合做个螺丝钉。";
  } catch (error) {
    console.error("AI API Error:", error);
    return "天机不可泄露 (API Error)";
  }
};

export const generateOfflineSummary = async (hours: number, rankLabel: string, demon: number): Promise<string> => {
  try {
    const prompt = `
      Player was offline for ${hours.toFixed(1)} hours.
      Rank/Realm: ${rankLabel}.
      Stress/Inner Demon Level: ${demon}%.
      
      Write a short cultivation log (max 100 words) tailored to a "Slacking Off Cultivator" in a modern company sect.
      Events should be like: "Hid in the toilet", "Attended a useless meeting via astral projection (sleeping)", "Gossip at the pantry".
      Language: Chinese (Simplified).
    `;
    
    const { text } = await generateText({
      model,
      prompt,
    });
    
    return text || "闭关期间，似乎做了一个关于带薪拉屎的长梦……";
  } catch (error) {
    return "闭关结束，神清气爽。";
  }
};

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export const generateTribulationQuiz = async (rankLabel: string): Promise<QuizQuestion[]> => {
  try {
    const prompt = `
      Generate 3 multiple choice questions for a "Performance Review" (Heavenly Tribulation) for a cultivator at ${rankLabel} rank in the "Xianyu Sect".
      
      THEME: General Workplace Survival (Sales, HR, Admin, Management). Slacking off (moyu).
      Strictly use Chinese (Simplified).
      
      Questions MUST be about:
      - Dealing with unreasonable Clients/Bosses.
      - Techniques for fake working (Excel art, Alt-Tab).
      - Office politics (Potluck, Reimbursement).
      
      Examples: 
      - "Boss asks for a 50-page PPT by tomorrow." -> "Use 'Ctrl+C Ctrl+V' Great Shift".
      - "Client says 'I want it colorful but black'." -> "Activate 'Colorful Black' Illusion".
    `;

    const { object } = await generateObject({
      model,
      schema: z.array(z.object({
        question: z.string(),
        options: z.array(z.string()),
        correctIndex: z.number(),
      })),
      prompt,
    });

    return object as QuizQuestion[];
  } catch (error) {
    console.error("Quiz Generation Error", error);
    return [
      {
        question: "当老板经过你身后时，你正在看剧，此时应施展什么神通？",
        options: ["Alt-Tab 瞬移术", "黑屏隐身决", "强行解释这是竞品分析", "邀请老板一起看"],
        correctIndex: 0
      },
      {
        question: "甲方要求'五彩斑斓的黑'，该如何应对？",
        options: ["当场辞职", "施展'糊弄学'大法", "建议他去挂眼科", "给他个黑屏说是概念艺术"],
        correctIndex: 1
      },
      {
        question: "周五下午5点的紧急会议（天劫），最佳应对策略是？",
        options: ["立刻接受挑战", "施展'肚子疼'遁术", "断网闭关", "带薪加班"],
        correctIndex: 1
      }
    ];
  }
};

export const generateDailyTasks = async (rank: string): Promise<Task[]> => {
  try {
    const matNames = MATERIALS.map(m => m.id).join(', ');

    const prompt = `
      Generate 4 daily tasks for "Xianyu Sect" (Moyu). Rank: ${rank}.
      
      Theme: General Corporate Life (Sales, HR, Design, Finance, Admin).
      
      Types:
      1. LINK: "Data Gathering" (Browsing websites for inspiration/slacking). 
      2. BATTLE: "Verbal Sparring" with "Unreasonable Client", "Micro-managing Boss", "Gossiping Colleague".
      3. GAME: "Inbox Zero" (Clearing unread emails/messages).
      
      Reward: Qi (50-200), Contribution (10-50), Stones (10-100), Material (Optional ID from: ${matNames}).
      
      Language: Chinese (Simplified).
    `;

    const { object } = await generateObject({
      model,
      schema: z.array(z.object({
        title: z.string(),
        description: z.string(),
        type: z.enum(['LINK', 'GAME', 'BATTLE']),
        reward: z.object({
          qi: z.number(),
          contribution: z.number(),
          stones: z.number(),
          materials: z.array(z.object({
            id: z.string(),
            count: z.number(),
          })).optional(),
        }),
        duration: z.number(),
        enemy: z.object({
          name: z.string(),
          title: z.string(),
          power: z.number(),
          avatar: z.string(),
        }).optional(),
      })),
      prompt,
    });

    return object.map((t, i) => ({
      ...t,
      id: `task-${Date.now()}-${i}`,
      completed: false,
      enemy: t.type === 'BATTLE' && !t.enemy ? { name: "心魔幻影", title: "Lv.1 杂鱼", power: 100, avatar: "👻" } : t.enemy
    }));

  } catch (error) {
    console.error("Task Gen Error", error);
    return [
      {
        id: 't1',
        title: '清理未读消息',
        description: '群消息99+，强迫症发作，快去点掉！',
        type: 'GAME',
        reward: { qi: 50, contribution: 10, stones: 20, materials: [{id: 'trash_paper', count: 1}] },
        duration: 5,
        completed: false
      },
      {
        id: 't2',
        title: '与甲方论道',
        description: '试图说服对方：LOGO不能同时放大又缩小。',
        type: 'BATTLE',
        reward: { qi: 100, contribution: 20, stones: 50 },
        duration: 10,
        completed: false,
        enemy: { name: "迷茫的甲方", title: "需求制造者", power: 200, avatar: "🤡" }
      },
      {
        id: 't3',
        title: '调研市场竞品',
        description: '去摸鱼网站看看大家都在聊什么（寻找灵感）。',
        type: 'LINK',
        reward: { qi: 80, contribution: 15, stones: 30 },
        duration: 5,
        completed: false
      }
    ];
  }
};