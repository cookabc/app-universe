# playground_fe - AI 全栈学习平台实战项目
Vite + React + TypeScript + TailwindCSS v4 + shadcn/ui + TanStack Router + Framer Motion

<directory>
src/
├── components/       (11子模块: ui/ auth/ common/ creation/ dashboard/ lab/ landing/ layout/ learning/ teacher/)
├── lib/              (1子模块: utils.ts)
├── hooks/            (自定义 React Hooks)
├── routes/           (页面路由: 10+ 页面，含 image-classifier 子路由)
└── assets/           (静态资源)
</directory>

<config>
vite.config.ts       - Vite 构建配置 + React 插件 + Tailwind v4 插件 + TanStack Router 插件
src/index.css        - TailwindCSS v4 原生配置 (@import + @theme)
tsconfig.json         - TypeScript 编译配置
jsconfig.json         - JS 路径别名 (@/*) + shadcn 识别
components.json       - shadcn/ui 设计系统配置
package.json          - 依赖管理脚本
</config>

<技术栈>
• 构建: Vite 7.2
• 框架: React 19.2
• 语言: TypeScript 5.9
• 路由: TanStack Router 1.142
• 样式: TailwindCSS v4 (原生 CSS)
• 设计系统: shadcn/ui (30+ 组件)
• 动效: Framer Motion 12.23
• 表单: React Hook Form 7.69 + Zod 4.2
• 数据: TanStack React Query 5.90 + Ky 1.14
• 图标: Lucide React 0.562
</技术栈>

<模块说明>
components/ui/            - shadcn/ui 设计系统 (button, card, dialog, form, select, table, tooltip 等)
components/auth/         - 认证弹窗组件
components/common/      - 通用组件 (ComingSoon, Modal)
components/creation/    - 创作模块组件
components/dashboard/   - 学员仪表板组件
components/lab/         - AI 实验室 (图像分类器训练)
components/landing/     - 落地页营销组件
components/layout/      - 全局布局组件 (Header, Footer)
components/learning/    - 学习路径组件
components/teacher/     - 教师后台组件

routes/                 - 文件路由系统，TanStack Router 自动生成
</模块说明>

法则: 极简·稳定·导航·版本精确
