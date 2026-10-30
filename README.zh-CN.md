[English](README.md) · **简体中文**

# Wayseeker

按工作流探索设计、开发与创意工具的双语（EN/中文）指南。Next.js 16 App Router + React 19 + Tailwind v4，收录事实与策展评论全部在 `src/data/tools.ts`，任务路径在 `src/data/workflow.ts`。

Wayseeker 不按热度或标签堆砌工具卡，而是沿「寻找方向 → 建立视觉语言 → 让界面动起来 → 研究真实产品 → 完成并交付」的任务路径组织工具。真实预览和「何时用、替代什么、注意什么」在同一个探索场景中更新；索引搜索、详情访问与可分享随机路径保留。

<p align="center">
  <img src="docs/images/home.png" width="880" alt="Wayseeker 工作流探索界面：任务路径、真实工具预览与策展判断">
</p>

站点默认英文，页头可切到中文，选择按访客持久化。文案在 `public/locales/{en,zh}/common.json`。

生产站为 [wayseeker.vercel.app](https://wayseeker.vercel.app)；canonical origin 在 `src/lib/site.ts` 中配置，部署前须与实际部署地址一致。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 开发服务器（端口 4000） |
| `pnpm build` | 生产构建 |
| `pnpm start` | 生产服务器（`next start`，默认 3000 端口） |
| `pnpm check` | 完整门禁：biome → tsc → build → node:test，与 CI 相同 |
| `pnpm lint:fix` | biome 自动修复 |
| `pnpm typecheck` | `tsc --noEmit` |

测试用 Node 内置 runner（`node --experimental-strip-types --test`），测试文件与被测代码同目录。工作流契约测试保证每个工具恰好属于一条任务路径。

## 样式分层

五层，按顺序在 `src/app/layout.tsx` 引入：

| 文件 | 负责 |
| --- | --- |
| `src/app/globals.css` | Tailwind 基础、颜色 token、字型、详情页档案样式 |
| `src/wayseeker.css` | 工作台布局与毛毡材质（`--way-felt-*`） |
| `src/wayseeker-themes.css` | 浅/深两套完整配色 token |
| `src/wayseeker-chrome.css` | 页头页脚的排版与线宽 |
| `src/atlas.css` | 工具场景：轨道布局、翻面、相邻缩略图 |

毛毡材质、字型体系与单一强调色以 [DESIGN.zh-CN.md](DESIGN.zh-CN.md)（英文版 [DESIGN.md](DESIGN.md)）为准，该文件是视觉体系的唯一出处。

## 文档

每份文档以英文为主，中文版并列放在旁边。

| 英文 | 中文 | 内容 |
| --- | --- | --- |
| [DESIGN.md](DESIGN.md) | [DESIGN.zh-CN.md](DESIGN.zh-CN.md) | 视觉体系：配色、字型、布局、组件 |
| [PRODUCT.md](PRODUCT.md) | [PRODUCT.zh-CN.md](PRODUCT.zh-CN.md) | 用户、定位、原则、无障碍 |

## 预览图管线

收录预览图存于 `public/previews/{id}.png`：

- `pnpm download-previews`：抓取各工具站点截图，完成后接续优化。
- `pnpm optimize-previews`：sharp 原地重编码（长边 1600px + palette PNG）。它会重编**所有**预览图，只想提交单张新图时先还原其余文件。

## 新增收录

1. 在 `src/data/tools.ts` 加一条记录（en/zh 描述有最小长度约束，测试强制）。
2. 在 `src/data/workflow.ts` 将它放入唯一一条任务路径。
3. 预览图放 `public/previews/{id}.png`。
4. `pnpm check` 全绿后提交。

## 环境版本

- Node：`.nvmrc` 固定 `24`，CI 使用同版本。
- 包管理器：版本由 `package.json` 的 `packageManager` 字段钉住。本机 pnpm 与钉版不一致时会自切换；断网或全隧道代理环境下自切换的签名校验可能失败——此时直接执行 `node_modules/.bin/` 下的 `biome` / `tsc` / `next`，测试改用 nvm 绝对路径的 node 跑。

## 许可

MIT，见 [LICENSE](LICENSE)。
