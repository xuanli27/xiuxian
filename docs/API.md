# API 文档

## 概述

本文档描述了"摸鱼修仙录"项目的所有 API 端点。所有 API 都位于 `/api` 路径下。

## 认证

### NextAuth.js 端点

**路径**: `/api/auth/[...nextauth]`

NextAuth.js 自动处理的认证端点，包括：
- `/api/auth/signin` - 登录
- `/api/auth/signout` - 登出
- `/api/auth/session` - 获取会话信息
- `/api/auth/callback/*` - OAuth 回调

详见 [NextAuth.js 文档](https://next-auth.js.org/)

---

## 玩家管理

### 创建玩家角色

**端点**: `POST /api/player/create`

**描述**: 为已登录用户创建游戏角色

**认证**: 需要登录（Session）

**请求体**:
```json
{
  "mindState": "string",      // 心性状态，如"初入仙途"
  "spiritRoot": "string",     // 灵根类型：HEAVEN | EARTH | HUMAN | WASTE
  "avatar": "string"          // 头像 URL（可选）
}
```

**响应**:
```json
{
  "success": true,
  "player": {
    "id": 1,
    "userId": "user_id",
    "name": "玩家名称",
    "avatar": "avatar_url",
    "spiritRoot": "HEAVEN",
    "mindState": "初入仙途",
    "rank": "QI_REFINING",
    "level": 1,
    "qi": 0,
    "maxQi": 100,
    "spiritStones": 100,
    // ... 其他字段
  }
}
```

**错误响应**:
- `401 Unauthorized` - 未登录
- `400 Bad Request` - 已创建角色
- `500 Internal Server Error` - 服务器错误

---

## AI 服务

### 生成随机事件

**端点**: `POST /api/ai/generate-event`

**描述**: 根据玩家当前状态生成动态随机事件

**请求体**:
```json
{
  "playerId": 1,
  "playerState": {
    "rank": "QI_REFINING",
    "level": 5,
    "qi": 150,
    "spiritStones": 100,
    "mindState": "刚入职"
  },
  "recentEvents": []  // 最近触发的事件列表
}
```

**响应**:
```json
{
  "id": "event_unique_id",
  "title": "事件标题",
  "description": "事件描述",
  "choices": [
    {
      "id": "choice_1",
      "text": "选项文本",
      "consequences": {
        "qi": 10,
        "spiritStones": -5
      }
    }
  ],
  "rarity": "COMMON"  // COMMON | RARE | EPIC | LEGENDARY
}
```

**错误响应**:
- `400 Bad Request` - 缺少玩家状态参数
- `500 Internal Server Error` - AI 生成失败

---

### 生成灵根评价

**端点**: `POST /api/ai/spirit-feedback`

**描述**: 根据玩家绘制的灵根图案生成 AI 评价

**请求体**:
```json
{
  "chaosScore": 0.75  // 混沌度分数 (0-1)
}
```

**响应**:
```json
{
  "feedback": "你这灵根...啧啧，像是被雷劈过的枯树，不过也算有点灵气。"
}
```

**错误响应**:
- `400 Bad Request` - 无效的混沌度分数
- `500 Internal Server Error` - AI 生成失败

---

### 生成天劫问答

**端点**: `POST /api/ai/tribulation-quiz`

**描述**: 根据玩家当前境界生成渡劫问答题

**请求体**:
```json
{
  "rank": "QI_REFINING"  // 当前境界
}
```

**响应**:
```json
{
  "question": "老板突然向你走来，而你正在浏览与工作无关的网页，此时应施展何种神通？",
  "options": [
    {
      "id": "A",
      "text": "Alt-Tab 瞬移术",
      "isCorrect": true
    },
    {
      "id": "B",
      "text": "尿遁",
      "isCorrect": false
    },
    {
      "id": "C",
      "text": "装死术",
      "isCorrect": false
    }
  ],
  "explanation": "Alt-Tab 瞬移术是职场修士的必备技能..."
}
```

**错误响应**:
- `400 Bad Request` - 缺少境界参数
- `500 Internal Server Error` - AI 生成失败

---

## Server Actions

除了 API Routes，项目还大量使用了 Next.js Server Actions 来处理数据操作。这些 Server Actions 定义在 `features/*/actions.ts` 文件中，可以直接在客户端组件中调用。

### 主要 Server Actions 模块

- **`features/player/actions.ts`** - 玩家数据操作
- **`features/cultivation/actions.ts`** - 修炼相关操作
- **`features/tasks/actions.ts`** - 任务管理
- **`features/events/actions.ts`** - 事件处理
- **`features/inventory/actions.ts`** - 背包管理
- **`features/cave/actions.ts`** - 洞府管理
- **`features/tribulation/actions.ts`** - 渡劫操作
- **`features/leaderboard/actions.ts`** - 排行榜操作

Server Actions 的优势：
- 自动处理序列化
- 类型安全
- 无需手动创建 API 端点
- 自动 CSRF 保护

---

## 数据查询

项目使用 React Query 进行服务端数据缓存和同步。查询函数定义在 `features/*/queries.ts` 文件中。

### 主要查询模块

- **`features/player/queries.ts`** - 玩家数据查询
- **`features/cultivation/queries.ts`** - 修炼数据查询
- **`features/tasks/queries.ts`** - 任务数据查询
- **`features/inventory/queries.ts`** - 背包数据查询
- **`features/leaderboard/queries.ts`** - 排行榜查询（支持 Redis 缓存）

---

## 错误处理

所有 API 端点遵循统一的错误响应格式：

```json
{
  "error": "错误描述信息"
}
```

常见 HTTP 状态码：
- `200 OK` - 请求成功
- `400 Bad Request` - 请求参数错误
- `401 Unauthorized` - 未认证
- `403 Forbidden` - 无权限
- `404 Not Found` - 资源不存在
- `500 Internal Server Error` - 服务器内部错误

---

## 速率限制

目前项目未实现速率限制。在生产环境中建议：
- 对 AI 端点实施速率限制（如每分钟 10 次请求）
- 对玩家创建端点实施严格限制（每用户仅允许一次）
- 使用 Redis 或中间件实现速率限制

---

## 安全性

### 认证保护
- 所有需要用户身份的端点都通过 `auth()` 函数验证 Session
- 中间件 (`middleware.ts`) 保护游戏页面路由

### 数据验证
- 使用 Zod schemas 验证所有输入数据
- Server Actions 自动进行类型检查

### CSRF 保护
- NextAuth.js 自动提供 CSRF 保护
- Server Actions 内置 CSRF 保护

---

## 开发建议

1. **使用 Server Actions 优先**: 对于简单的 CRUD 操作，优先使用 Server Actions 而非 API Routes
2. **API Routes 用于外部集成**: 仅在需要 webhook、第三方集成或流式响应时使用 API Routes
3. **类型安全**: 始终使用 TypeScript 类型和 Zod schemas
4. **错误处理**: 使用 try-catch 包裹所有异步操作，返回友好的错误信息