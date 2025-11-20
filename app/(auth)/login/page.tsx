'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Github, Chrome, Sparkles } from 'lucide-react'
import { emailPasswordLogin, signInWithOAuth } from '../actions'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await emailPasswordLogin(formData)
      if (result?.error) {
        setError(result.error)
      }
    } catch {
      setError('登录失败,请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    try {
      await signInWithOAuth(provider)
    } catch {
      setError(`${provider} 登录失败`)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-950 p-6 text-content-100 relative overflow-hidden">
      {/* 仙气背景 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-surface-950 to-surface-950" />
      
      {/* 灵气粒子 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full z-10 space-y-8">
        {/* 标题 */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="inline-block p-3 bg-surface-900 rounded-full border border-primary-500/30 mb-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Sparkles size={32} className="text-primary-400 animate-pulse" />
          </div>
          <h1 className="font-xianxia text-5xl text-transparent bg-clip-text bg-gradient-to-b from-primary-300 to-primary-600 leading-relaxed drop-shadow-lg">
            神魂归位
          </h1>
          <p className="text-content-300 font-serif text-lg">唤醒沉睡的神魂,重返修仙之路</p>
        </div>

        {/* 登录表单 */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="bg-surface-900/80 backdrop-blur-md p-8 rounded-2xl border border-primary-500/20 shadow-2xl space-y-6">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {/* 邮箱 */}
              <div className="space-y-2">
                <label className="text-sm font-serif text-content-300 flex items-center gap-2">
                  <Mail size={16} className="text-primary-400" />
                  宗门令牌
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="输入你的宗门令牌标识"
                  required
                  className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-xl text-content-100 placeholder-content-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>

              {/* 密码 */}
              <div className="space-y-2">
                <label className="text-sm font-serif text-content-300 flex items-center gap-2">
                  <Lock size={16} className="text-primary-400" />
                  神魂印记
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="唤醒你的神魂气息"
                    required
                    className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-xl text-content-100 placeholder-content-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-content-400 hover:text-content-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  {error}
                </div>
              )}

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full group relative px-6 py-4 bg-transparent overflow-hidden rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-600 to-primary-600 transition-all group-hover:brightness-110" />
                <span className="relative flex items-center justify-center gap-2 font-xianxia text-xl font-bold text-white tracking-widest">
                  {isLoading ? '神魂归位中...' : '唤醒神魂'}
                </span>
              </button>
            </form>

            {/* 分隔线 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-surface-900 text-content-400 font-serif">或借助外力唤醒</span>
              </div>
            </div>

            {/* 社交登录 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleOAuthLogin('google')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-800 hover:bg-surface-700 border border-surface-700 hover:border-primary-500/50 rounded-xl transition-all disabled:opacity-50"
              >
                <Chrome size={20} className="text-content-300" />
                <span className="text-sm font-serif">Google</span>
              </button>
              <button
                onClick={() => handleOAuthLogin('github')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-800 hover:bg-surface-700 border border-surface-700 hover:border-primary-500/50 rounded-xl transition-all disabled:opacity-50"
              >
                <Github size={20} className="text-content-300" />
                <span className="text-sm font-serif">GitHub</span>
              </button>
            </div>
          </div>

          {/* 注册链接 */}
          <div className="text-center">
            <button
              onClick={() => router.push('/register')}
              className="text-primary-400 hover:text-primary-300 font-serif text-sm transition-colors hover:underline"
            >
              初入仙途?立即凝聚神魂 →
            </button>
          </div>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-xs text-content-400 opacity-50 tracking-widest">
          即使是咸鱼 · 也要做最咸的那一条
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  )
}