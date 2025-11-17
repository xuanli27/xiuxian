/**
 * 站点配置
 */

export const SITE_CONFIG = {
  name: '摸鱼修仙录',
  description: '在职场中修仙,用摸鱼时间突破境界',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  
  // SEO配置
  seo: {
    title: '摸鱼修仙录 - 打工人的修仙之路',
    description: '能坐着绝不站着，能躺着绝不坐着。在职场中修仙，用摸鱼时间突破境界。',
    keywords: ['修仙', '游戏', '放置', 'RPG', '职场', '摸鱼'],
    ogImage: '/images/og-image.png',
  },
  
  // 联系方式
  contact: {
    email: 'support@moyu-xiuxian.com',
    github: 'https://github.com/yourusername/moyu-xiuxian-lu',
  },
  
  // 社交媒体
  social: {
    twitter: '@moyuxiuxianlu',
    discord: 'https://discord.gg/moyuxiuxian',
  },
  
  // 法律信息
  legal: {
    termsUrl: '/terms',
    privacyUrl: '/privacy',
    disclaimerUrl: '/disclaimer',
  },
}

export default SITE_CONFIG