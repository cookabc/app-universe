# App Universe

人工精选的双语（EN/中文）工具目录站，线上在 [app-universe.vercel.app](https://app-universe.vercel.app)。Next.js 16 App Router + React 19 + Tailwind v4，部署在 Vercel；收录数据全部在 `src/data/tools.ts`。`/puzzles` 是不上架的静态彩蛋页（noindex）。

<p align="center">
  <img src="docs/images/home.png" width="880" alt="App Universe 首页：左侧中文导语与探索按钮，右侧本期精选 Open Design 卡片与两张次选预览">
</p>

首页左栏是当期导语与筛选入口，右栏把本期精选放大成一张可点卡片，下排露出两张次选；右下角 `01 / 31` 与底部 `31 个工具 · 5 个标签 · 中英双语` 都是从收录数据实时算出的计数。右上角可在中英文之间切换，两种语言各有独立 URL。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 开发服务器（端口 4000） |
| `pnpm build` | 生产构建 |
| `pnpm start` | 生产服务器（固定 3000 端口，不继承 dev 的 `-p 4000`） |
| `pnpm check` | 完整门禁：biome → tsc → build → node:test，与 CI 相同 |
| `pnpm lint:fix` | biome 自动修复（import 排序等格式问题） |
| `pnpm typecheck` | `tsc --noEmit` |

测试用 Node 内置 runner（`node --experimental-strip-types --test`），测试文件与被测代码同目录。

## 预览图管线

收录预览图存于 `public/previews/{id}.png`：

- `pnpm download-previews`：抓取各工具站点截图，完成后接续优化。
- `pnpm optimize-previews`：sharp 原地重编码（长边 1600px + palette PNG）。它会重编**所有**预览图——只想提交单张新图时，先 `git checkout -- public/previews/` 还原其余文件，再单独提交新图。
- JS 渲染的站点抓取服务拿不到有效内容，需要手动截图（1600×1000）放入 `public/previews/`。

## 新增收录

1. 在 `src/data/tools.ts` 加一条记录（en/zh 描述有最小长度约束，测试强制）。
2. 预览图放 `public/previews/{id}.png`。
3. `pnpm check` 全绿后提交。

## 环境版本

- Node：`.nvmrc` 固定 `24`，CI 使用同版本。
- 包管理器：版本由 `package.json` 的 `packageManager` 字段钉住。本机 pnpm 与钉版不一致时会自切换；断网或全隧道代理环境下自切换的签名校验可能失败——此时直接执行 `node_modules/.bin/` 下的 `biome` / `tsc` / `next`，测试改用 nvm 绝对路径的 node 跑。

## 许可

MIT，见 [LICENSE](LICENSE)。
