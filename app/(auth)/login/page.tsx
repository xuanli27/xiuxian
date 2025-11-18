'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const handleSignIn = async () => {
    const result = await signIn('credentials', {
      redirect: false,
      callbackUrl: '/dashboard'
    })
    
    if (result?.ok) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 text-content-100 p-4">
      <div className="w-full max-w-md mx-auto bg-surface-900 rounded-2xl shadow-lg border border-border-base overflow-hidden">
        <div className="p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-xianxia text-primary-500 mb-4">
            重返仙途
          </h1>
          <p className="text-content-200 text-lg mb-8">
            道友，你的神识已归位，仙途待续。
          </p>
          
          <button
            onClick={handleSignIn}
            className="w-full py-3 px-6 bg-primary-500 text-white font-bold rounded-lg shadow-md hover:bg-primary-600 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <span className="font-cute text-xl">再入仙境</span>
          </button>
        </div>
        
        <div className="px-8 py-4 bg-surface-800 border-t border-border-base text-center">
          <p className="text-xs text-content-400">
            若道心不稳，可<a href="/register" className="text-primary-400 hover:underline">重塑道体</a>。
          </p>
        </div>
      </div>
    </div>
  );
}