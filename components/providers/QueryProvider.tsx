'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

/**
 * TanStack Query Provider配置
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5分钟内数据被认为是新鲜的
            staleTime: 1000 * 60 * 5,
            // 缓存30分钟
            gcTime: 1000 * 60 * 30,
            // 失败后重试2次
            retry: 2,
            // 重新获取焦点时不自动刷新
            refetchOnWindowFocus: false,
            // 重连时不自动刷新
            refetchOnReconnect: false,
          },
          mutations: {
            // 失败后重试1次
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}