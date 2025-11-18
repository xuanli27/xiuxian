# 开发指南

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+
- Redis 7+ (可选，用于缓存)

### 安装依赖

```bash
pnpm install
```

### 环境配置

复制 `.env.example` 到 `.env` 并配置：

```bash
cp .env.example .env
```

必需的环境变量：
```env
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/xiuxian"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"
```

可选的环境变量：
```env
# Redis 缓存（可选）
REDIS_URL="redis://localhost:6379"
```

### 数据库设置

```bash
# 运行数据库迁移
pnpm prisma migrate dev

# 生成 Prisma Client
pnpm prisma generate

# 查看数据库（可选）
pnpm prisma studio
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

---

## 项目结构

### 目录说明

```
/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 认证页面组
│   │   └── register/        
│   │       └── _components/ # 注册专用组件
│   ├── (game)/              # 游戏页面组
│   │   └── */\_components/  # 各页面专用组件
│   └── api/                 # API Routes
├── components/              # 全局组件
│   ├── ui/                  # UI 组件库
│   └── providers/           # Context Providers
├── features/                # 业务逻辑模块
│   └── [module]/
│       ├── actions.ts       # Server Actions
│       ├── queries.ts       # 数据查询
│       ├── schemas.ts       # Zod 验证
│       ├── types.ts         # TypeScript 类型
│       └── utils.ts         # 工具函数
├── lib/                     # 核心库
│   ├── ai/                  # AI 集成
│   ├── auth/                # 认证配置
│   ├── db/                  # 数据库客户端
│   └── utils/               # 通用工具
├── prisma/                  # 数据库模型
└── docs/                    # 项目文档
```

### 命名约定

- **组件**: PascalCase (如 `TaskBoard.tsx`)
- **工具函数**: camelCase (如 `formatDate.ts`)
- **类型**: PascalCase (如 `PlayerState`)
- **常量**: UPPER_SNAKE_CASE (如 `MAX_LEVEL`)

---

## 开发工作流

### 1. 创建新功能模块

```bash
# 创建模块目录
mkdir -p features/new-feature

# 创建必要文件
touch features/new-feature/{actions,queries,schemas,types,utils}.ts
```

### 2. 定义数据模型

在 `prisma/schema.prisma` 中定义模型：

```prisma
model NewFeature {
  id        Int      @id @default(autoincrement())
  playerId  Int
  player    Player   @relation(fields: [playerId], references: [id])
  createdAt DateTime @default(now())
}
```

运行迁移：
```bash
pnpm prisma migrate dev --name add_new_feature
```

### 3. 定义类型和 Schema

`features/new-feature/types.ts`:
```typescript
export interface NewFeature {
  id: number
  playerId: number
  // ...
}
```

`features/new-feature/schemas.ts`:
```typescript
import { z } from 'zod'

export const createFeatureSchema = z.object({
  playerId: z.number(),
  // ...
})
```

### 4. 实现 Server Actions

`features/new-feature/actions.ts`:
```typescript
'use server'

import { prisma } from '@/lib/db/prisma'
import { createFeatureSchema } from './schemas'

export async function createFeature(data: unknown) {
  const validated = createFeatureSchema.parse(data)
  
  return await prisma.newFeature.create({
    data: validated
  })
}
```

### 5. 实现查询函数

`features/new-feature/queries.ts`:
```typescript
import { prisma } from '@/lib/db/prisma'

export async function getFeatureById(id: number) {
  return await prisma.newFeature.findUnique({
    where: { id }
  })
}
```

### 6. 创建页面和组件

```bash
# 创建页面
mkdir -p app/\(game\)/new-feature/_components
touch app/\(game\)/new-feature/page.tsx
touch app/\(game\)/new-feature/_components/FeatureDisplay.tsx
```

---

## 最佳实践

### 组件开发

1. **页面专用组件放在 `_components/`**
   ```
   app/(game)/tasks/
   ├── page.tsx
   └── _components/
       └── TaskBoard.tsx
   ```

2. **使用绝对导入**
   ```typescript
   // ✅ 推荐
   import { Button } from '@/components/ui/Button'
   
   // ❌ 避免
   import { Button } from '../../components/ui/Button'
   ```

3. **组件类型定义**
   ```typescript
   interface Props {
     player: Player
     onUpdate: (data: UpdateData) => void
   }
   
   export function MyComponent({ player, onUpdate }: Props) {
     // ...
   }
   ```

### Server Actions

1. **始终使用 'use server' 指令**
   ```typescript
   'use server'
   
   export async function myAction() {
     // ...
   }
   ```

2. **验证输入数据**
   ```typescript
   export async function updatePlayer(data: unknown) {
     const validated = updatePlayerSchema.parse(data)
     // ...
   }
   ```

3. **错误处理**
   ```typescript
   export async function riskyAction() {
     try {
       // 操作
       return { success: true, data }
     } catch (error) {
       console.error('Action failed:', error)
       return { success: false, error: '操作失败' }
     }
   }
   ```

### 数据查询

1. **使用 React Query**
   ```typescript
   const { data, isLoading } = useQuery({
     queryKey: ['player', playerId],
     queryFn: () => getPlayerById(playerId)
   })
   ```

2. **缓存失效**
   ```typescript
   const queryClient = useQueryClient()
   
   await updatePlayer(data)
   queryClient.invalidateQueries({ queryKey: ['player'] })
   ```

### 样式

1. **使用 Tailwind CSS**
   ```tsx
   <div className="flex items-center gap-4 p-4 bg-surface-100 rounded-lg">
     <Button variant="primary">确定</Button>
   </div>
   ```

2. **响应式设计**
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {/* 内容 */}
   </div>
   ```

---

## 调试技巧

### 1. 查看数据库

```bash
pnpm prisma studio
```

### 2. 查看 Server Actions 日志

Server Actions 的 console.log 会输出到终端，而非浏览器控制台。

### 3. React Query DevTools

已在开发环境启用，按 `Ctrl+Shift+D` 打开。

### 4. TypeScript 类型检查

```bash
pnpm tsc --noEmit
```

### 5. Linting

```bash
pnpm lint
```

---

## 常见问题

### Q: 如何添加新的 AI 生成功能？

1. 在 `lib/ai/prompts.ts` 中定义 prompt
2. 在 `lib/ai/game-generators.ts` 中实现生成函数
3. 创建 API Route 或直接在 Server Action 中调用

### Q: 如何实现新的游戏系统？

1. 在 `features/` 下创建新模块
2. 定义 Prisma 模型并迁移
3. 实现 actions、queries、schemas
4. 创建页面和组件
5. 更新导航配置 `config/navigation.ts`

### Q: Redis 缓存如何使用？

参考 `features/leaderboard/queries.ts` 中的实现：
```typescript
const cached = await redis?.get(cacheKey)
if (cached) return JSON.parse(cached)

const data = await prisma.query()
await redis?.setex(cacheKey, TTL, JSON.stringify(data))
return data
```

### Q: 如何处理认证？

使用 `auth()` 函数获取会话：
```typescript
import { auth } from '@/lib/auth/auth'

const session = await auth()
if (!session?.user) {
  redirect('/login')
}
```

---

## 部署

### Vercel 部署

1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

### 环境变量检查清单

- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `GEMINI_API_KEY`
- [ ] `REDIS_URL` (可选)

---

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码审查要点

- [ ] 类型安全（无 TypeScript 错误）
- [ ] 输入验证（使用 Zod）
- [ ] 错误处理
- [ ] 性能考虑
- [ ] 代码注释（复杂逻辑）
- [ ] 遵循项目结构和命名约定

---

## 资源链接

- [Next.js 文档](https://nextjs.org/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [NextAuth.js 文档](https://next-auth.js.org/)
- [React Query 文档](https://tanstack.com/query/latest)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Zod 文档](https://zod.dev/)