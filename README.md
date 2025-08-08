## App Universe

构建你的数字宇宙，一次一个小应用。该仓库是一个使用 Next.js 15（App Router）与 React 19 搭建的多功能应用集合，集成 Tailwind CSS v4、Radix UI/shadcn 风格组件以及 AI 能力（OpenAI via AI SDK）。

### 功能特性
- **Next.js 15 App Router**: `src/app` 结构、`metadata`/`viewport`、RSC/Server Actions 支持
- **React 19**: 并发特性、`Suspense` 流式渲染、错误边界与渐进加载
- **样式系统**: Tailwind v4（原子化、`@tailwindcss/postcss`）、CSS 变量主题、`clsx` + `tailwind-merge`
- **UI 组件**: Radix UI + shadcn 风格的 `src/components/ui/*` 组件（Button/Dialog/Toast/…）
- **AI 能力**: `src/app/actions.ts` 提供 OpenAI 文本生成、流式对话、缓存与再验证
- **示例应用**: Typing Practice、Prompt Engineering（含 dnd/game/challenges/summary/blog）、AGI School、Bento、Social Media、Word Search、Salary Calculator 等
- **开发体验**: Biome 格式化与简单规则、模块别名 `@/*`

### 技术栈
- **框架**: Next.js 15、React 19、TypeScript
- **样式**: Tailwind CSS v4、`tailwind-merge`、`clsx`
- **UI**: Radix UI、shadcn 风格组件
- **AI**: `ai`、`@ai-sdk/openai`
- **工具**: PostCSS（`@tailwindcss/postcss`）、Biome

### 快速开始
```bash
# 安装依赖（任选其一）
npm install
# 或
yarn
# 或
pnpm install
# 或
bun install

# 开发启动
npm run dev

# 构建与启动
npm run build
npm run start

# 格式与检查（Biome 主要做格式化）
npm run lint
```

### 环境变量
- 复制 `.env.example` 为 `.env.local`（如不存在可直接创建 `.env.local`）
- 至少配置以下变量以启用 AI 功能：

```bash
# OpenAI（用于 AI SDK）
OPENAI_API_KEY=your_openai_api_key
```

说明：仓库中翻译功能默认调用 `mymemory.translated.net` 的公开接口，无需密钥；若要切换其他服务可自行扩展。

### 目录结构（节选）
- `src/app`
  - `layout.tsx`: 全局布局、`metadata`/`viewport`、`<Toaster/>`、`<PerformanceMonitor/>`
  - `globals.css`: Tailwind v4 入口、主题 CSS 变量、通用组件样式
  - `page.tsx`: 首页（`Header`/`HeroSection`/`AppGrid`/`Footer`）
  - 各功能页：`/typing-practice`、`/prompt-eng/*`、`/agi-school/*`、`/bento/*`、`/social-media`、`/word-search`、`/salary-calculator` 等
  - `actions.ts`: Server Actions（OpenAI 调用、流式对话、翻译缓存、Kuroshiro 日文转换）
- `src/components`
  - `ui/*`: shadcn 风格基础组件（`button.tsx` 等），基于 `class-variance-authority`
  - 页面区块：`Header`、`Footer`、`HeroSection`、`AppGrid` 等
  - 优化组件：`optimized/*`（错误边界、性能监测、流式加载）
- `src/lib`
  - `utils.ts`: `cn()`（`clsx` + `tailwind-merge`）

### 路由与页面
- 新增页面：在 `src/app/<route>/page.tsx` 中导出 React 组件即可
- 可按需添加 `layout.tsx`/`loading.tsx`/`error.tsx` 实现区域布局与渐进加载

### 样式与 UI 约定
- Tailwind v4 通过 PostCSS 插件启用；样式集中在 `src/app/globals.css`
- 主题由 CSS 变量驱动，支持 `:root` 与 `.dark`
- UI 组件使用 `cva` 管理变体，统一通过 `cn()` 组合类名

### 模块别名
- `tsconfig.json` 中配置：
  - `@/*` → `src/*`
- `components.json`（shadcn 工具配置）中也约定：
  - `components` → `@/components`
  - `ui` → `@/components/ui`
  - `lib` → `@/lib`，`utils` → `@/lib/utils`
  - `hooks` → `@/hooks`

### 常用脚本
- **dev**: 开发服务器（Next.js）
- **build**: 生产构建
- **start**: 启动生产服务器
- **lint**: Biome 驱动的格式与简单检查

### 贡献与代码风格
- 变量与函数命名清晰可读，避免缩写
- 组件/函数尽量小而明确，优先早返回，处理边界
- 使用 Biome 的格式化约定（见 `biome.json`）

### 许可
- 本项目采用 `LICENSE` 文件中的许可协议

---
如需我为某个子应用/页面做深入说明，或新增 README 的演示截图、架构图、部署指引，请告诉我。