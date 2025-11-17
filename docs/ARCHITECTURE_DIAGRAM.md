# 🏗️ 摸鱼修仙录 - 系统架构图

## 整体架构 (Mermaid)

```mermaid
graph TB
    subgraph Client["🖥️ 客户端层"]
        Browser["浏览器"]
        React["React 19 Components"]
        Zustand["Zustand Store"]
        ReactQuery["TanStack Query"]
    end

    subgraph NextJS["⚡ Next.js 15 App Router"]
        Pages["📄 Pages"]
        ServerActions["🔧 Server Actions"]
        APIRoutes["🌐 API Routes"]
        Middleware["🛡️ Middleware"]
    end

    subgraph Auth["🔐 认证层"]
        NextAuth["NextAuth.js v5"]
        OAuth["OAuth Providers"]
        Sessions["Session Management"]
    end

    subgraph Backend["💾 后端服务"]
        Database[(PostgreSQL)]
        Drizzle["Drizzle ORM"]
        Queries["Query Functions"]
    end

    subgraph AI["🤖 AI服务"]
        VercelAI["Vercel AI SDK"]
        Gemini["Google Gemini API"]
        Prompts["Prompt Templates"]
    end

    subgraph Deploy["☁️ 部署层"]
        Vercel["Vercel Platform"]
        Edge["Edge Network"]
        Analytics["Analytics"]
    end

    Browser --> React
    React --> Zustand
    React --> ReactQuery
    React --> Pages
    
    Pages --> ServerActions
    Pages --> APIRoutes
    
    ServerActions --> Auth
    APIRoutes --> Auth
    Middleware --> Auth
    
    Auth --> NextAuth
    NextAuth --> OAuth
    NextAuth --> Sessions
    
    ServerActions --> Drizzle
    APIRoutes --> Drizzle
    Drizzle --> Database
    Drizzle --> Queries
    
    ServerActions --> VercelAI
    APIRoutes --> VercelAI
    VercelAI --> Gemini
    VercelAI --> Prompts
    
    NextJS --> Vercel
    Vercel --> Edge
    Vercel --> Analytics
    Database --> Vercel
    
    style Client fill:#e1f5ff
    style NextJS fill:#fff4e6
    style Auth fill:#ffe7e7
    style Backend fill:#e8f5e9
    style AI fill:#f3e5f5
    style Deploy fill:#fff9c4
```

---

## 数据流架构

```mermaid
sequenceDiagram
    participant U as 用户
    participant B as 浏览器
    participant N as Next.js
    participant A as NextAuth
    participant SA as Server Actions
    participant DB as PostgreSQL
    participant AI as Gemini API

    U->>B: 访问游戏
    B->>N: 请求页面
    N->>A: 验证会话
    A-->>N: 返回用户信息
    N->>SA: 调用getPlayerData()
    SA->>DB: 查询玩家数据
    DB-->>SA: 返回数据
    SA-->>N: 返回玩家状态
    N-->>B: 渲染页面
    
    U->>B: 点击修炼
    B->>SA: 调用gainQi()
    SA->>DB: 更新灵气值
    DB-->>SA: 确认更新
    SA->>AI: 生成修炼反馈
    AI-->>SA: 返回文本
    SA-->>B: 返回结果
    B-->>U: 显示提示
```

---

## 数据库ER图

```mermaid
erDiagram
    users ||--o{ accounts : has
    users ||--|| players : owns
    users ||--o{ sessions : has
    
    players ||--o{ tasks : completes
    players ||--o{ leaderboard : appears_in
    
    users {
        string id PK
        string email UK
        string name
        timestamp emailVerified
        string image
        timestamp createdAt
        timestamp updatedAt
    }
    
    accounts {
        string id PK
        string userId FK
        string provider
        string providerAccountId
        string access_token
        string refresh_token
    }
    
    sessions {
        string id PK
        string sessionToken UK
        string userId FK
        timestamp expires
    }
    
    players {
        int id PK
        string userId FK
        string name
        string rank
        int level
        int qi
        int maxQi
        jsonb inventory
        jsonb equipped
        timestamp createdAt
    }
    
    tasks {
        int id PK
        int playerId FK
        string title
        string type
        jsonb reward
        boolean completed
        timestamp createdAt
    }
    
    leaderboard {
        int id PK
        int playerId FK
        string playerName
        int score
        string season
        timestamp updatedAt
    }
```

---

## 组件层级结构

```mermaid
graph TD
    Root["app/layout.tsx"]
    Root --> Providers["Providers"]
    Root --> LandingLayout["Landing Layout"]
    Root --> AuthLayout["Auth Layout"]
    Root --> GameLayout["Game Layout"]
    
    Providers --> NextAuthProvider["NextAuth Provider"]
    Providers --> QueryProvider["Query Provider"]
    
    LandingLayout --> HomePage["Home Page"]
    HomePage --> Hero
    HomePage --> Features
    HomePage --> CTA
    
    AuthLayout --> LoginPage["Login Page"]
    AuthLayout --> RegisterPage["Register Page"]
    LoginPage --> LoginForm
    RegisterPage --> RegisterForm
    
    GameLayout --> NavBar["Navigation Bar"]
    GameLayout --> Dashboard["Dashboard Page"]
    GameLayout --> Tasks["Tasks Page"]
    GameLayout --> Sect["Sect Page"]
    GameLayout --> Inventory["Inventory Page"]
    GameLayout --> Cave["Cave Page"]
    
    Dashboard --> SpiritCore["Spirit Core Visualizer"]
    Dashboard --> PlayerStats["Player Stats"]
    Dashboard --> QuickActions["Quick Actions"]
    
    Tasks --> TaskBoard["Task Board"]
    TaskBoard --> TaskCard["Task Card"]
    TaskCard --> MiniGame["Mini Game"]
    
    style Root fill:#ffebee
    style Providers fill:#e3f2fd
    style GameLayout fill:#e8f5e9
```

---

## API路由架构

```mermaid
graph LR
    subgraph Public["公开API"]
        Health["/api/health"]
    end
    
    subgraph Auth["认证API"]
        NextAuthAPI["/api/auth/[...nextauth]"]
    end
    
    subgraph Game["游戏API"]
        LeaderboardAPI["/api/leaderboard"]
        SaveAPI["/api/save"]
    end
    
    subgraph AI["AI API"]
        FeedbackAPI["/api/ai/feedback"]
        StreamAPI["/api/ai/stream"]
    end
    
    Client["客户端"] --> Public
    Client --> Auth
    Client --> Game
    Client --> AI
    
    Auth --> AuthService["NextAuth Service"]
    Game --> DBService["Database Service"]
    AI --> AIService["AI Service"]
    
    style Public fill:#fff9c4
    style Auth fill:#ffccbc
    style Game fill:#c8e6c9
    style AI fill:#e1bee7
```

---

## Server Actions工作流

```mermaid
flowchart TD
    Start([用户操作]) --> CheckAuth{验证登录?}
    CheckAuth -->|未登录| RedirectLogin[重定向到登录页]
    CheckAuth -->|已登录| GetSession[获取Session]
    
    GetSession --> ValidateInput{验证输入?}
    ValidateInput -->|无效| ReturnError[返回错误]
    ValidateInput -->|有效| ExecuteAction[执行Server Action]
    
    ExecuteAction --> DBOperation[数据库操作]
    DBOperation --> Success{操作成功?}
    
    Success -->|失败| ReturnError
    Success -->|成功| Revalidate[Revalidate Path]
    
    Revalidate --> ReturnResult[返回结果]
    ReturnResult --> End([结束])
    
    style Start fill:#e8f5e9
    style End fill:#e8f5e9
    style CheckAuth fill:#fff9c4
    style ValidateInput fill:#fff9c4
    style Success fill:#fff9c4
```

---

## AI集成流程

```mermaid
sequenceDiagram
    participant C as 客户端
    participant SA as Server Action
    participant AI as Vercel AI SDK
    participant G as Gemini API
    
    rect rgb(230, 240, 255)
    Note over C,G: 流式文本生成
    C->>SA: streamDailyTasks()
    SA->>AI: streamText()
    AI->>G: HTTP Stream Request
    loop 流式返回
        G-->>AI: Text Delta
        AI-->>SA: Stream Update
        SA-->>C: createStreamableValue
    end
    G-->>AI: Stream End
    AI-->>SA: Done
    SA-->>C: Final Result
    end
    
    rect rgb(255, 240, 230)
    Note over C,G: 结构化数据生成
    C->>SA: generateTribulationQuiz()
    SA->>AI: generateObject()
    AI->>G: API Request
    G-->>AI: JSON Response
    AI-->>SA: Validated Object
    SA-->>C: Quiz Questions
    end
```

---

## 部署架构

```mermaid
graph TB
    subgraph Internet["🌐 互联网"]
        Users["用户"]
    end
    
    subgraph Vercel["☁️ Vercel Platform"]
        Edge["Edge Network"]
        Functions["Serverless Functions"]
        Build["Build System"]
    end
    
    subgraph Database["💾 数据层"]
        PostgresDB["Vercel Postgres"]
        ConnectionPool["Connection Pool"]
    end
    
    subgraph External["🔌 外部服务"]
        GeminiAPI["Google Gemini API"]
        OAuthProviders["OAuth Providers"]
    end
    
    subgraph Monitoring["📊 监控"]
        Analytics["Vercel Analytics"]
        Logs["Vercel Logs"]
    end
    
    Users --> Edge
    Edge --> Functions
    Functions --> PostgresDB
    Functions --> ConnectionPool
    ConnectionPool --> PostgresDB
    
    Functions --> GeminiAPI
    Functions --> OAuthProviders
    
    Functions --> Analytics
    Functions --> Logs
    
    GitHub["GitHub Repo"] --> Build
    Build --> Functions
    
    style Vercel fill:#e3f2fd
    style Database fill:#e8f5e9
    style External fill:#fff9c4
    style Monitoring fill:#f3e5f5
```

---

## 安全架构

```mermaid
graph TD
    Request["用户请求"] --> HTTPS["HTTPS加密"]
    HTTPS --> Middleware["Next.js Middleware"]
    
    Middleware --> AuthCheck{认证检查}
    AuthCheck -->|未认证| Reject["拒绝访问"]
    AuthCheck -->|已认证| CSRF["CSRF保护"]
    
    CSRF --> RateLimit["速率限制"]
    RateLimit --> Validation["输入验证"]
    Validation --> Sanitize["数据清洗"]
    
    Sanitize --> Execute["执行操作"]
    Execute --> Encrypt["敏感数据加密"]
    Encrypt --> Response["返回响应"]
    
    Response --> ContentSecurity["Content Security Policy"]
    ContentSecurity --> CORS["CORS头"]
    CORS --> Client["客户端"]
    
    style Request fill:#ffebee
    style Reject fill:#ffcdd2
    style Execute fill:#c8e6c9
    style Client fill:#e8f5e9
```

---

## 性能优化架构

```mermaid
mindmap
  root((性能优化))
    前端优化
      React Server Components
      静态生成 SSG
      增量静态再生 ISR
      客户端缓存
      代码分割
    后端优化
      数据库索引
      连接池
      查询优化
      Server Actions
      API缓存
    网络优化
      Edge Network
      CDN加速
      压缩传输
      预加载
      懒加载
    AI优化
      Prompt缓存
      流式响应
      批量请求
      结果缓存
```

---

**以上架构图展示了完整的系统设计和技术栈实现方案**