import type { Metadata } from 'next';
import './globals.css';

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
