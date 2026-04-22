# AGENTS.md

## 项目定位

这是一个股票行情看板项目，核心是：

- `api/`：Flask + SQLAlchemy 后端，提供 TradingView UDF 行情接口、组合树接口、证券静态信息与基本面缓存。
- `frontend/`：Vite + React 19 前端，主界面由 `TradingChart` 和 `PortfolioSidebar` 组成。
- `docs/`：接口文档、UDF 说明、自定义指标文档。

默认本地联调方式：

- 后端：`http://127.0.0.1:5200`
- 前端：`http://localhost:5173`

## 进入工作前先做的事

- 先看 `git status --short`，避免覆盖用户已有改动。
- 先阅读 `README.md`，再按需查看 `api/README.md`、`docs/api.md`。
- 任何涉及前后端联动的改动，都要同时检查调用方和接口文档。

## 目录速览

- `api/app.py`：Flask 入口与大部分路由，当前是后端核心编排文件。
- `api/models.py`：SQLAlchemy 模型，包括 watchlist / portfolio tree / symbol 相关表。
- `api/symbol_registry.py`：证券搜索、静态信息、基本面缓存、多数据源回退逻辑。
- `api/providers/`：各行情提供方的适配层。
- `api/clients/`：第三方 HTTP / SDK 客户端。
- `api/scripts/`：导入、迁移、缓存刷新脚本。
- `frontend/src/App.jsx`：页面整体布局、面板宽度、顶部信息和数据联动入口。
- `frontend/src/components/TradingChart.jsx`：TradingView Charting Library 集成与 UDF datafeed。
- `frontend/src/components/PortfolioSidebar.jsx`：组合树、选股与笔记侧边栏。
- `frontend/src/components/chart/`：自定义指标与成交量分布相关逻辑。

## 本地启动

### 后端

```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python3 app.py
```

如果虚拟环境已经存在，优先使用：

```bash
cd api
.venv/bin/python app.py
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端通过以下环境变量连接后端：

- `frontend/.env.local`
- `VITE_UDF_BASE_URL`
- `VITE_API_BASE_URL`

## 验证方式

这个仓库目前没有成体系的自动化测试；做完改动后，至少执行和变更直接相关的检查。

所有新功能在交付前都要做一轮最小自测，不能只停留在代码通过或页面看起来“应该可以”。

### 前端改动后

```bash
cd frontend
npm run lint
npm run build
```

### 后端改动后

优先做最小化语法检查：

```bash
cd api
.venv/bin/python -m py_compile app.py config.py models.py symbol_registry.py udf_history.py clients/*.py providers/*.py scripts/*.py
```

### 涉及前后端联调时

- 确认后端能正常启动。
- 确认前端页面能加载图表与组合树。
- 如果修改了接口响应字段，顺手更新 `docs/api.md`。

## 功能开发流程规则

### 新 API / 接口开发

- 先完成后端接口与接口文档，再开始对应前端开发。
- 新增、修改或废弃 API 后，必须先更新 `docs/api.md`，包括：
  - 路径
  - 请求方法
  - 必填参数 / 查询参数
  - 关键响应字段
  - 错误返回或边界说明（如果有）
- 文档没更新，不算接口开发完成。
- API 做完后，至少补一条可直接执行的 `curl` 自测命令，用来验证这个接口的基本可用性。
- 如果接口需要鉴权、JSON body 或查询参数，`curl` 示例里要体现最小可运行参数。

示例：

```bash
curl -X GET 'http://127.0.0.1:5200/api/udf/history?symbol=GOOG.US&resolution=1D&countback=10'
```

如果是 `POST` / `PUT` 类接口，至少给出类似这样的最小化测试：

```bash
curl -X POST 'http://127.0.0.1:5200/api/xxx' \
  -H 'Content-Type: application/json' \
  -d '{"key":"value"}'
```

### 前端功能开发

- 只有在接口文档已同步、API 已完成最小 `curl` 自测后，才进入前端联调。
- 前端功能完成后，必须做一次实际页面自测，不接受只靠读代码判断。
- 自测时要使用 agent browser 打开对应页面或功能入口，检查：
  - 页面是否正常加载
  - 关键交互是否可用
  - 数据展示是否符合预期
  - 控制台是否有明显报错
- 前端功能验收时，要截图确认最终效果是否正常；如果是列表、弹窗、图表、表单等明显可视功能，优先保留对应截图。

### 完成功能后的最低自测要求

- 后端功能：至少完成一次接口级自测，优先使用 `curl`。
- 前端功能：至少完成一次真实页面操作验证，并截图确认结果。
- 前后端联动功能：同时验证接口返回与页面展示，不要只测其中一侧。
- 如果本次改动影响文档、接口契约或页面交互，提交前再次检查文档是否已经同步。

## 开发约定

### Python / Flask

- 保持现有风格：4 空格缩进，尽量沿用现有模块拆分，不为了“重构而重构”。
- `api/app.py` 已经较大；新增逻辑时优先抽辅助函数，不要继续把复杂逻辑直接堆在路由里。
- 模型或数据库字段有变化时，检查：
  - `api/models.py`
  - `api/app.py`
  - 相关迁移 / 修复脚本是否需要同步
- 多数据源相关改动通常需要同时查看：
  - `api/config.py`
  - `api/providers/`
  - `api/clients/`
  - `api/symbol_registry.py`

### React / Vite

- 保持现有风格：函数组件、Hooks、单引号、默认不加分号。
- 优先在现有组件内做局部修改，避免无必要地重排整个界面结构。
- 图表相关改动优先检查：
  - `frontend/src/components/TradingChart.jsx`
  - `frontend/src/components/chart/customIndicators.js`
  - `frontend/src/components/chart/VolumeProfileOverlay.jsx`
- 组合树相关改动优先检查：
  - `frontend/src/components/PortfolioSidebar.jsx`
  - 与之对应的后端 portfolio API

## 不要随便动的内容

- 不要修改 `api/.env`、`frontend/.env.local`，除非用户明确要求。
- 不要把密钥、token、账号信息提交到仓库。
- 不要手改以下目录中的依赖或产物：
  - `frontend/node_modules/`
  - `frontend/dist/`
  - `api/.venv/`
  - `api/logs/`
- `frontend/public/charting_library/` 是外部依赖资源，除非任务明确要求升级或修复其集成方式，否则不要直接修改库文件。
- `api/instance/udf.db` 是本地数据库文件；除非任务明确涉及数据修复、迁移或演示数据更新，否则不要随意改动。

## 文档同步规则

出现以下情况时，记得同步文档：

- 改了 API 路径、参数、响应字段：更新 `docs/api.md`
- 改了 UDF 行为或图表数据契约：更新 `docs/udf.md`
- 改了自定义指标行为：更新 `docs/custom-indicators.md`
- 改了启动方式、目录结构或核心能力：更新 `README.md`

## 建议的工作方式

- 小步提交，优先做最小闭环改动。
- 如果发现工作区本来就是脏的，只在自己的变更范围内操作，不要顺手清理别人的改动。
- 如果需要改动 API 契约，先确认前端消费位置，再落代码。
- 如果要新增脚本，尽量放在 `api/scripts/`，命名保持动词开头，职责单一。
