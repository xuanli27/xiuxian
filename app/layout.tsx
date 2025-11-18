import type { Metadata } from 'next';
import { Ma_Shan_Zheng, Noto_Serif_SC, ZCOOL_KuaiLe } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';

const maShanZheng = Ma_Shan_Zheng({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-xianxia',
});

const notoSerifSc = Noto_Serif_SC({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
});

const zcoolKuaiLe = ZCOOL_KuaiLe({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-cute',
});

export const metadata: Metadata = {
  title: '摸鱼修仙录 - 打工人的修仙之路',
  description: '在职场中修仙,用摸鱼时间突破境界',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${maShanZheng.variable} ${notoSerifSc.variable} ${zcoolKuaiLe.variable} font-serif antialiased`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
