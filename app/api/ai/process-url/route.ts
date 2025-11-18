import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth/guards'
import { prisma } from '@/lib/db/prisma'
import { generateAIText } from '@/lib/ai/client'

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    
    const player = await prisma.player.findUnique({
      where: { userId }
    })
    
    if (!player) {
      return NextResponse.json({ error: '玩家不存在' }, { status: 404 })
    }

    const { url, action } = await request.json()
    
    if (!url || !action) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    // 检查并扣除资源
    const cost = action === 'summarize' ? 50 : 100
    if (player.qi < cost) {
      return NextResponse.json({ 
        error: '灵气不足', 
        required: cost, 
        current: player.qi 
      }, { status: 400 })
    }

    // 抓取网页内容
    let content = ''
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      const html = await response.text()
      
      // 简单提取文本内容（移除HTML标签）
      content = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 4000) // 限制长度
    } catch (error) {
      return NextResponse.json({ error: '无法访问该网址' }, { status: 400 })
    }

    if (!content) {
      return NextResponse.json({ error: '未能提取到有效内容' }, { status: 400 })
    }

    // 调用AI服务
    const prompt = action === 'summarize'
      ? `请用简洁的中文总结以下网页内容的核心要点（3-5个要点）：\n\n${content}`
      : `请将以下内容翻译成简体中文：\n\n${content}`

    const aiResult = await generateAIText(prompt)

    // 扣除灵气
    await prisma.player.update({
      where: { id: player.id },
      data: {
        qi: { decrement: cost }
      }
    })

    return NextResponse.json({
      success: true,
      result: aiResult,
      cost
    })

  } catch (error) {
    console.error('处理URL失败:', error)
    return NextResponse.json({ error: '处理失败' }, { status: 500 })
  }
}