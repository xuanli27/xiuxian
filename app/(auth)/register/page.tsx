'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IntroStory } from '@/components/onboarding/IntroStory'
import { MindPathQuiz } from '@/components/onboarding/MindPathQuiz'
import { SpiritRootCanvas } from '@/components/onboarding/SpiritRootCanvas'
import { SpiritRootType } from '@/types'

type OnboardingStep = 'intro' | 'quiz' | 'spirit'

export default function RegisterPage() {
  const router = useRouter()
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
    // TODO: 创建玩家账号
    // 这里需要调用 createPlayer action
    console.log('注册完成', { mindState, root, avatar })
    
    // 暂时直接跳转到仪表盘
    router.push('/dashboard')
  }

  return (
    <>
      {step === 'intro' && <IntroStory onNext={handleIntroNext} />}
      {step === 'quiz' && <MindPathQuiz onComplete={handleQuizComplete} />}
      {step === 'spirit' && <SpiritRootCanvas onNext={handleSpiritComplete} />}
    </>
  )
}