# 应用整合计划：AGI School Plus + Real-time Fund

## 📋 当前状态

| 应用 | 技术栈 | 整合难度 |
|------|--------|----------|
| 主站 (app-universe) | Next.js 15 App Router + Tailwind CSS | - |
| DueKeep | React SPA (已集成 ✅) | 已完成 |
| AGI School Plus | TanStack Router + Vite + Tailwind v4 | 高 |
| Real-time Fund | Next.js 16 App Router + CSS | 中 |

---

## 🎯 整合方案

### 方案：直接集成 (不保留独立运行能力)

由于两个应用都使用 React 技术栈，我们将把代码直接集成到主应用中。

---

## 📝 执行计划

### 阶段 1：AGI School Plus 整合

#### 1.1 依赖安装
```bash
# 安装 TanStack 相关依赖
bun add @tanstack/react-router @tanstack/react-query @tanstack/router-plugin

# 安装其他 AGI School Plus 依赖
bun add react-hook-form @hookform/resolvers zod sonner ky framer-motion
```

#### 1.2 路由映射
将 TanStack Router 路由映射到 Next.js App Router：

| TanStack 路由 | 目标路径 |
|---------------|----------|
| `/` | `/apps/agischool/` (首页) |
| `/community` | `/apps/agischool/community` |
| `/creation` | `/apps/agischool/creation` |
| `/dashboard` | `/apps/agischool/dashboard` |
| `/learning` | `/apps/agischool/learning` |
| `/settings` | `/apps/agischool/settings` |
| `/teacher` | `/apps/agischool/teacher` |
| `/teacher/*` | `/apps/agischool/teacher/*` |
| `/lab/image-classifier` | `/apps/agischool/lab/image-classifier` |

#### 1.3 样式隔离
- 创建 `/src/app/apps/agischool/globals.css`
- 复制 AGI School Plus 的 Tailwind v4 配置
- 使用 CSS Modules 或 scoped styles 避免样式污染

#### 1.4 组件迁移
- 复制组件到 `/src/app/apps/agischool/components/`
- 复制路由文件到 `/src/app/apps/agischool/routes/`
- 修改导入路径

#### 1.5 路由配置
- 创建 TanStack Router 配置或转换为 Next.js 路由
- 处理布局 (Header/Footer 显示/隐藏)

---

### 阶段 2：Real-time Fund 整合

#### 2.1 依赖检查
```bash
# 检查是否需要额外依赖
# 预期已有: framer-motion
```

#### 2.2 代码复制
- 复制 `app/components/` → `/src/app/apps/realtime-fund/components/`
- 复制 `app/globals.css` → `/src/app/apps/realtime-fund/globals.css`

#### 2.3 页面集成
- 复制 `app/page.jsx` → `/src/app/apps/realtime-fund/page.tsx`
- 复制 `app/layout.jsx` → `/src/app/apps/realtime-fund/layout.tsx`

#### 2.4 样式处理
- 保留原有 CSS 变量
- 使用 CSS Modules 隔离样式
- 处理主站样式冲突

---

### 阶段 3：验证与测试

#### 3.1 路由验证
- [ ] 主站首页正常加载
- [ ] DueKeep 页面正常 (已验证 ✅)
- [ ] AGI School Plus 各页面正常
- [ ] Real-time Fund 页面正常

#### 3.2 功能验证
- [ ] 导航正常
- [ ] 样式显示正常
- [ ] 交互功能正常

---

## ⚠️ 潜在问题

### AGI School Plus
1. **TanStack Router 与 Next.js 路由冲突** - 需要选择其一
2. **Tailwind v4 配置冲突** - 主站使用 Tailwind v3
3. **React 19 版本兼容性** - 主站可能使用不同版本

### Real-time Fund
1. **CSS 变量冲突** - 需要隔离
2. **Next.js 版本差异** - 主站 15 vs 子应用 16

---

## 📦 产出文件结构

```
src/app/
├── apps/
│   ├── duekeep/           # ✅ 已完成
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── page.tsx
│   ├── agischool/         # 待完成
│   │   ├── components/     # 从 apps/agischool/src/components 复制
│   │   ├── routes/        # 从 apps/agischool/src/routes 复制
│   │   ├── globals.css    # Tailwind v4 配置
│   │   ├── layout.tsx     # 布局
│   │   └── page.tsx       # 首页
│   └── realtime-fund/     # 待完成
│       ├── components/    # 从 apps/realtime-fund/app/components 复制
│       ├── globals.css    # 原有样式
│       ├── layout.tsx     # 布局
│       └── page.tsx       # 首页
```

---

## ⏱️ 预计工作量

| 阶段 | 工作项 | 预估时间 |
|------|--------|----------|
| 1 | AGI School Plus 依赖安装 | 10 min |
| 1 | AGI School Plus 代码迁移 | 2-3 hours |
| 1 | AGI School Plus 样式处理 | 1 hour |
| 2 | Real-time Fund 代码迁移 | 30 min |
| 2 | Real-time Fund 样式处理 | 30 min |
| 3 | 验证与调试 | 1 hour |
| **总计** | | **5-6 hours** |

---

## 🔄 替代方案（如果整合太复杂）

### 方案 B：保留独立运行
- 使用 iframe 嵌入
- 通过环境变量控制显示入口
- 用户需要启动多个开发服务器

### 方案 C：渐进式迁移
- 先保留 iframe 方式
- 逐步将高频功能迁移到主应用
- 最终完全迁移
