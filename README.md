## App Universe

构建你的数字宇宙，一次一个小应用。该仓库是一个使用 Next.js 16（App Router）与 React 19 搭建的多功能应用集合，集成 Tailwind CSS v4、Radix UI/shadcn 风格组件、AI 能力（OpenAI via AI SDK）以及数据库支持（Drizzle ORM + Neon）。

### 功能特性

- **Next.js 16 App Router**: `src/app` 结构、`metadata`/`viewport`、RSC/Server Actions 支持
- **React 19**: 并发特性、`Suspense` 流式渲染、错误边界与渐进加载
- **样式系统**: Tailwind v4（原子化、`@tailwindcss/postcss`）、CSS 变量主题、`clsx` + `tailwind-merge`
- **UI 组件**: Radix UI + shadcn 风格的 `src/components/ui/*` 组件（Button/Dialog/Toast/Tabs/Select 等）
- **AI 能力**: `src/app/actions.ts` 提供 OpenAI 文本生成、流式对话、缓存与再验证
- **认证系统**: Clerk 集成，支持用户认证、Webhook 回调
- **数据库**: Drizzle ORM + Neon PostgreSQL，完整的类型安全数据库操作
- **示例应用**:
  - **Image Generator** - AI 图像生成
  - **Language Converter** - 多语言文本转换
  - **Typing Practice** - 打字练习
  - **DueKeep** - 事件倒计时与日历管理
  - **AGI School** - 教育平台落地页
  - **Real-time Fund** - 基金投资组合实时追踪
- **开发体验**: Biome 格式化与简单规则、模块别名 `@/*`、Bun 支持

### 技术栈

- **框架**: Next.js 16、React 19、TypeScript
- **样式**: Tailwind CSS v4、`tailwind-merge`、`clsx`
- **UI**: Radix UI、shadcn 风格组件、Framer Motion 动画
- **AI**: `ai`、`@ai-sdk/openai`
- **认证**: `@clerk/nextjs`
- **数据库**: Drizzle ORM、@neondatabase/serverless
- **图表**: Recharts
- **工具**: PostCSS（`@tailwindcss/postcss`）、Biome、Bun

### 快速开始

```bash
# 安装依赖（推荐使用 Bun）
bun install

# 或使用其他包管理器
npm install
# 或
yarn
# 或
pnpm install

# 开发启动
bun dev
# 或
npm run dev

# 构建与启动
bun run build
bun start

# 格式与检查（Biome）
bun run lint

# 数据库操作
bun run db:generate  # 生成迁移文件
bun run db:migrate   # 执行迁移
```

### 环境变量

- 复制 `.env.example` 为 `.env.local`（如不存在可直接创建 `.env.local`）
- 配置以下变量：

```bash
# OpenAI（用于 AI SDK）
OPENAI_API_KEY=your_openai_api_key

# Clerk（用户认证）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Neon Database（PostgreSQL）
DATABASE_URL=your_neon_database_url

# Web3Forms（联系表单）
NEXT_PUBLIC_WEB3FORMS_KEY=your_web3forms_key
```

说明：

- 翻译功能默认调用 `mymemory.translated.net` 的公开接口，无需密钥
- 基金数据通过东方财富等公开 API 获取

### 目录结构

- `src/app`
  - `layout.tsx`: 全局布局、`metadata`/`viewport`、`<Toaster/>`
  - `globals.css`: Tailwind v4 入口、主题 CSS 变量
  - `page.tsx`: 首页（`Header`/`HeroSection`/`AppGrid`/`Footer`）
  - `actions.ts`: Server Actions（OpenAI 调用、流式对话、翻译缓存）
  - **各功能应用**:
    - `/image-generator` - AI 图像生成器（队列管理、多提供商支持）
    - `/lang-converter` - 语言转换器（支持日语假名转换）
    - `/typing-practice` - 打字练习（虚拟键盘、庆祝效果）
    - `/duekeep` - 事件管理（日历视图、倒计时）
    - `/agischool` - AGI 学校落地页
    - `/realtime-fund` - 实时基金追踪（分组管理、持仓记录）
    - `/pricing` - 定价页面
  - `/api`: API 路由
    - `/market/*` - 基金数据 API（净值、估算、历史、搜索）
    - `/webhooks/clerk` - Clerk Webhook 处理
- `src/components`
  - `ui/*`: shadcn 风格基础组件（Button/Dialog/Toast/Tabs 等）
  - 页面区块：`Header`、`Footer`、`HeroSection`、`AppGrid` 等
  - `optimized/*`: 错误边界、性能优化组件
- `src/data/apps.ts`: 应用列表配置
- `src/db`: 数据库配置与 Schema
- `src/hooks`: 自定义 Hooks（toast、认证、轮询）
- `src/lib`: 工具函数（`cn()`、错误处理）

### 路由与页面

- 新增页面：在 `src/app/<route>/page.tsx` 中导出 React 组件即可
- 可按需添加 `layout.tsx`/`loading.tsx`/`error.tsx` 实现区域布局与渐进加载

### 样式与 UI 约定

- Tailwind v4 通过 PostCSS 插件启用；样式集中在 `src/app/globals.css`
- 主题由 CSS 变量驱动，支持 `:root` 与 `.dark`
- UI 组件使用 `cva` 管理变体，统一通过 `cn()` 组合类名
- 动画使用 Framer Motion

### 模块别名

- `tsconfig.json` 中配置：
  - `@/*` → `src/*`
- `components.json`（shadcn 工具配置）中也约定：
  - `components` → `@/components`
  - `ui` → `@/components/ui`
  - `lib` → `@/lib`，`utils` → `@/lib/utils`
  - `hooks` → `@/hooks`

### 常用脚本

- **dev**: 开发服务器（端口 4000）
- **build**: 生产构建
- **start**: 启动生产服务器
- **lint**: Biome 驱动的格式与简单检查
- **db:generate**: 生成 Drizzle 迁移文件
- **db:migrate**: 执行数据库迁移

### 贡献与代码风格

- 变量与函数命名清晰可读，避免缩写
- 组件/函数尽量小而明确，优先早返回，处理边界
- 使用 Biome 的格式化约定（见 `biome.json`）

### 许可

- 本项目采用 `LICENSE` 文件中的许可协议

---
