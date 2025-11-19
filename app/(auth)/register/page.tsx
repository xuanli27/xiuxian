'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { IntroStory } from './_components/IntroStory'
import { MindPathQuiz } from './_components/MindPathQuiz'
import { SpiritRootCanvas } from './_components/SpiritRootCanvas'
import { SpiritRootType } from '@/types'

type OnboardingStep = 'intro' | 'quiz' | 'spirit'

export default function RegisterPage() {
  const [step, setStep] = useState<OnboardingStep>('intro')
  const [mindState, setMindState] = useState<string>('')

  const handleIntroNext = () => {
    setStep('quiz')
  }

  const handleQuizComplete = (mind: string) => {
    setMindState(mind)
    setStep('spirit')
  }

  const handleSpiritComplete = async (root: SpiritRootType, avatar: string) => {
    console.log('开始注册流程...', { root, mindState });
    
    try {
      // 生成唯一邮箱
      const email = `player_${Date.now()}@xiuxian.game`;
      console.log('生成邮箱:', email);
      
      // 先登录获取 session
      console.log('开始登录...');
      const result = await signIn('credentials', {
        email,
        redirect: false,
      });
      
      console.log('登录结果:', result);
      
      if (!result?.ok) {
        console.error('登录失败:', result?.error);
        alert('登录失败，请重试');
        return;
      }
      
      // 等待一下确保 session 已创建
      console.log('等待 session 创建...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 创建 Player
      console.log('开始创建角色...');
      const response = await fetch('/api/player/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mindState,
          spiritRoot: root,
          avatar,
        }),
      });
      
      console.log('创建角色响应状态:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('创建角色失败:', error);
        alert(error.error || '创建角色失败');
        return;
      }
      
      const data = await response.json();
      console.log('创建角色成功:', data);
      
      // 创建成功后重新登录以刷新 session（更新 hasPlayer 状态）
      console.log('重新登录以刷新 session...');
      await signIn('credentials', {
        email,
        callbackUrl: '/dashboard',
        redirect: true, // 使用 NextAuth 的重定向
      });
    } catch (error) {
      console.error('注册流程出错:', error);
      alert(`注册失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  return (
    <>
      {step === 'intro' && <IntroStory onNext={handleIntroNext} />}
      {step === 'quiz' && <MindPathQuiz onComplete={handleQuizComplete} />}
      {step === 'spirit' && <SpiritRootCanvas onNext={handleSpiritComplete} />}
    </>
  )
}