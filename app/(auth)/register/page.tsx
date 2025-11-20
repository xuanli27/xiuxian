'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IntroStory } from './_components/IntroStory'
import { MindPathQuiz } from './_components/MindPathQuiz'
import { SpiritRootCanvas } from './_components/SpiritRootCanvas'
import { SpiritRootType } from '@/types'
import { signupWithCredentials, createPlayerAccount } from '../actions'

type OnboardingStep = 'intro' | 'quiz' | 'spirit'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>('intro')
  const [email, setEmail] = useState('')
  const [mindState, setMindState] = useState<string>('')

  const handleIntroNext = () => {
    setStep('quiz')
  }

  const handleQuizComplete = (mind: string, userEmail: string) => {
    setMindState(mind)
    setEmail(userEmail)
    setStep('spirit')
  }

  const handleSpiritComplete = async (root: SpiritRootType, avatar: string, password: string) => {
    try {
      // 先注册账号
      const signupResult = await signupWithCredentials(email, password)
      if (signupResult.error) {
        alert(signupResult.error)
        return
      }

      // 再创建角色
      const result = await createPlayerAccount({
        mindState,
        spiritRoot: root,
        avatar,
      })
      
      if (result.error) {
        alert(result.error)
        return
      }
      
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      alert(`注册失败: ${error instanceof Error ? error.message : '未知错误'}`)
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