# 数据库设置指南

## 前置条件

项目需要 PostgreSQL 数据库才能运行。您有两种选择：

### 选项 1: 本地 PostgreSQL（推荐开发环境）

#### Linux/Ubuntu 安装
```bash
# 安装 PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# 启动 PostgreSQL 服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库
sudo -u postgres createdb xiuxian_db

# 设置密码（可选）
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

#### macOS 安装
```bash
# 使用 Homebrew 安装
brew install postgresql@14

# 启动服务
brew services start postgresql@14

# 创建数据库
createdb xiuxian_db
```

#### Windows 安装
1. 下载 PostgreSQL 安装程序：https://www.postgresql.org/download/windows/
2. 运行安装程序，设置密码
3. 使用 pgAdmin 或命令行创建数据库 `xiuxian_db`

### 选项 2: 使用 Docker（最简单）

```bash
# 拉取并运行 PostgreSQL 容器
docker run --name xiuxian-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=xiuxian_db \
  -p 5432:5432 \
  -d postgres:14

# 检查容器状态
docker ps
```

### 选项 3: Vercel Postgres（云端数据库）

1. 访问 https://vercel.com/dashboard
2. 创建新项目或选择现有项目
3. 进入 Storage 标签
4. 创建 Postgres 数据库
5. 复制连接字符串到 `.env` 文件

## 配置数据库连接

编辑 `.env` 文件，更新数据库连接字符串：

### 本地数据库
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/xiuxian_db"
```

### Docker 数据库
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/xiuxian_db"
```

### Vercel Postgres
```env
DATABASE_URL="your-vercel-postgres-connection-string"
```

## 初始化数据库

数据库运行后，执行以下命令：

```bash
# 1. 推送 schema 到数据库（创建表结构）
pnpm db:push

# 2. 生成 Prisma Client
pnpm db:generate

# 3. （可选）打开 Prisma Studio 查看数据
pnpm db:studio
```

## 验证数据库连接

运行以下命令测试连接：

```bash
# 检查 PostgreSQL 是否运行
# Linux/macOS
pg_isready

# 或直接连接测试
psql -h localhost -U postgres -d xiuxian_db
```

## 常见问题

### Q: "Can't reach database server" 错误
**A:** 数据库服务未启动，请检查：
- Linux: `sudo systemctl status postgresql`
- macOS: `brew services list`
- Docker: `docker ps`
- 启动命令见上方"前置条件"部分

### Q: 端口 5432 已被占用
**A:** 修改 `.env` 中的端口，或停止其他使用该端口的服务

### Q: 连接被拒绝
**A:** 检查：
1. 用户名密码是否正确
2. 数据库名称是否存在
3. PostgreSQL 是否允许本地连接（检查 `pg_hba.conf`）

### Q: 权限错误
**A:** 确保 PostgreSQL 用户有足够权限：
```sql
GRANT ALL PRIVILEGES ON DATABASE xiuxian_db TO postgres;
```

## 下一步

数据库设置完成后：
1. 运行 `pnpm db:push` 初始化表结构
2. 运行 `pnpm db:generate` 生成 Prisma Client
3. 运行 `pnpm dev` 启动开发服务器
4. 访问 http://localhost:3000

## 生产环境建议

- 使用 Vercel Postgres、Supabase、或 Railway 等云数据库服务
- 启用 SSL 连接
- 设置数据库备份策略
- 使用连接池优化性能
- 定期监控数据库性能指标