# Skill Showcase · Kami 设计系统集成计划

## 目标

将 kami 设计系统的风格应用到 Skill Showcase 的 React 应用中，使每个页面都拥有专业的排版和视觉美感。

## 设计分析

### kami 设计特点

- **温暖羊皮纸画布**: #f5f4ed (parchment), #faf9f5 (ivory)
- **墨水蓝强调色**: #1B365D
- **陶土色辅助色**: #a64f33, #b8563e
- **衬线字体**: TsangerJinKai02, Source Han Serif SC
- **无衬线字体**: Inter (UI 元素)
- **紧凑的编辑间距**: 1.45 line-height
- **A4 打印优化**

### 当前项目设计特点

- **紫色主题**: #aa3bff
- **现代无衬线字体**: system-ui, Segoe UI
- **卡片式布局**: borderRadius, border, shadow
- **响应式网格**: Tailwind CSS

## 实施步骤

### 阶段 1: 更新全局设计令牌（Design Tokens）

**文件**: `src/styles/global.css`

1. 更新 CSS 变量，将 kami 的颜色系统融入现有变量
2. 保留现有的紫色主题作为可选切换
3. 添加衬线字体支持
4. 调整排版变量（line-height, letter-spacing）

**颜色映射**:

```css
--bg-primary: #faf9f5 (ivory) -> 替代 #ffffff --bg-card: #f5f4ed (parchment) -> 替代当前卡片背景
  --accent: #1b365d (brand) 或保留 #aa3bff --terracotta: #a64f33 (brand-deep) --border: #e8e6dc
  (border) --text-primary: #141413 (near-black) --text-secondary: #4d4c48 (charcoal);
```

### 阶段 2: 优化首页（Portfolio 风格）

**文件**: `src/pages/HomePage.tsx`, `src/components/Home/HeroSection.tsx`, `src/components/Home/SkillGrid.tsx`, `src/components/Home/SkillCard.tsx`

1. **HeroSection**:
   - 使用衬线字体（serif）作为标题
   - 添加左侧边框装饰（border-left: 2.5pt solid var(--accent)）
   - 调整间距和行高

2. **SkillGrid**:
   - 使用更紧凑的网格间距
   - 卡片背景使用 parchment 色调
   - 优化卡片悬停效果

3. **SkillCard**:
   - 使用 shadcn/ui Card 组件
   - 应用 concentric border radius（外层 = 内层 + padding）
   - 添加按下时的缩放效果（scale(0.96)）
   - 优化文字排版（text-wrap: balance）

4. **CategoryFilter**:
   - 使用更精致的标签样式
   - 优化按钮的交互反馈

### 阶段 3: 技能详情页 - 简单技能（One-Pager 风格）

**适用条件**: 复杂度 "Simple" 或代码行数 < 150

**文件**: `src/pages/SkillDetailPage.tsx`, `src/components/SkillDetail/SkillHeroBanner.tsx`

1. **SkillHeroBanner**:
   - 使用三段式布局：Context / Approach / Outcome
   - 左侧边框装饰
   - 使用衬线字体
   - 添加关键数据指标展示

2. **内容区域**:
   - 优化 MarkdownRenderer 的排版
   - 使用 tabular-nums 用于数字
   - 优化代码块的样式

### 阶段 4: 技能详情页 - 复杂技能（Long Doc 风格）

**适用条件**: 复杂度 "Medium", "Complex" 或代码行数 >= 150

**文件**: `src/pages/SkillDetailPage.tsx`, `src/components/SkillDetail/ContentTabs.tsx`

1. **ContentTabs**:
   - 使用标签页组织内容
   - 每个标签页使用 Long Doc 的排版风格
   - 添加目录导航

2. **LiveDemoSection**:
   - 优化代码演示区域的样式
   - 使用 TerminalWindow 的优化样式
   - 添加交互反馈

### 阶段 5: 组件级优化

**文件**: 各组件

1. **Typography**:
   - 标题使用 `text-wrap: balance`
   - 正文使用 `text-wrap: pretty`
   - 动态数字使用 `tabular-nums`

2. **Animations**:
   - 添加 split and stagger enter animations
   - 优化 hover 状态的过渡效果
   - 确保所有动画可中断

3. **Accessibility**:
   - 确保对比度符合 WCAG AA 标准
   - 优化键盘导航
   - 添加适当的 ARIA 属性

### 阶段 6: 验证和测试

1. 运行 `npx impeccable detect http://localhost:5173/` 检查设计反模式
2. 检查响应式布局在不同屏幕尺寸上的表现
3. 验证字体加载和回退链
4. 测试交互反馈的流畅性

## 文件修改清单

| 文件                                             | 修改类型 | 说明               |
| ------------------------------------------------ | -------- | ------------------ |
| `src/styles/global.css`                          | 修改     | 更新设计令牌       |
| `src/pages/HomePage.tsx`                         | 修改     | Portfolio 风格首页 |
| `src/components/Home/HeroSection.tsx`            | 修改     | 优化 Hero 区域     |
| `src/components/Home/SkillGrid.tsx`              | 修改     | 优化网格布局       |
| `src/components/Home/SkillCard.tsx`              | 修改     | 优化卡片组件       |
| `src/components/Home/CategoryFilter.tsx`         | 修改     | 优化分类过滤器     |
| `src/pages/SkillDetailPage.tsx`                  | 修改     | 技能详情页面       |
| `src/components/SkillDetail/SkillHeroBanner.tsx` | 修改     | 优化技能头部       |
| `src/components/SkillDetail/ContentTabs.tsx`     | 修改     | 优化内容标签       |
| `src/components/SkillDetail/AISummaryCard.tsx`   | 修改     | 优化 AI 摘要卡片   |
| `src/components/common/MarkdownRenderer.tsx`     | 修改     | 优化 Markdown 排版 |
| `src/components/Demos/TerminalWindow.tsx`        | 修改     | 优化终端样式       |
| `src/components/Demos/LiveDemoSection.tsx`       | 修改     | 优化实时演示       |
| `src/components/Demos/CodePlayground.tsx`        | 修改     | 优化代码演示       |

## 风险评估

1. **字体加载**: TsangerJinKai02 字体文件较大，可能需要优化加载策略
2. **颜色对比度**: 需要确保所有文本都符合 WCAG AA 对比度要求
3. **响应式适配**: 需要确保在小屏幕上的表现
4. **性能影响**: 添加动画和过渡效果可能影响性能

## 时间估计

- 阶段 1-2: 更新设计令牌和首页
- 阶段 3-4: 优化技能详情页
- 阶段 5: 组件级优化
- 阶段 6: 验证和测试

总计：约 6 个阶段
