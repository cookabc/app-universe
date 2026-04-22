# 部署指南（Vercel + Render）

本项目采用前后端分离部署方案，完全使用免费云服务。

> **注意**: 此方案适合快速上线和测试使用。Render 免费版有休眠限制（15分钟无访问后休眠）。
> 
> **如需稳定生产环境，推荐使用 [阿里云 ECS 部署方案](DEPLOY_ALIYUN.md)**。

## 架构

```
┌─────────────────┐      ┌─────────────────┐
│   Vercel        │──────▶│   Render        │
│   (前端免费托管)  │      │   (后端免费托管)  │
│   stock-platform│      │   stock-platform│
│   -frontend     │      │   -api          │
└─────────────────┘      └────────┬────────┘
                                  │
                                  ▼
                           ┌─────────────┐
                           │   SQLite    │
                           │   (磁盘存储) │
                           └─────────────┘
```

## 1. 部署后端 (Render - 免费)

### 步骤:

1. **访问 Render**: https://render.com
2. **注册/登录**（可用 GitHub 账号直接登录）
3. **创建 New Web Service**
4. **连接 GitHub 仓库**: `stock-platform`
5. **配置**:
   - **Name**: `stock-platform-api`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r api/requirements.txt`
   - **Start Command**: `cd api && gunicorn -w 2 -b 0.0.0.0:$PORT app:app`
   - **Plan**: Free

6. **添加环境变量**:
   ```
   FLASK_ENV=production
   DATABASE_URL=sqlite:///data/stock_platform.db
   ```

7. **添加磁盘** (免费 1GB):
   - **Name**: `data`
   - **Mount Path**: `/opt/render/project/src/api/data`
   - **Size**: 1 GB

8. **点击 Create Web Service**

9. **等待部署完成**，记录分配的域名，如：
   `https://stock-platform-api.onrender.com`

## 2. 部署前端 (Vercel - 免费)

### 步骤:

1. **访问 Vercel**: https://vercel.com
2. **注册/登录**（可用 GitHub 账号直接登录）
3. **Add New Project**
4. **导入 GitHub 仓库**: `stock-platform`
5. **配置**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. **添加环境变量**:
   ```
   VITE_API_BASE_URL=https://stock-platform-api.onrender.com
   ```
   (将 URL 替换为你的 Render 后端地址)

7. **点击 Deploy**

8. **等待部署完成**，Vercel 会分配一个域名，如：
   `https://stock-platform-frontend.vercel.app`

## 3. 配置 CORS

后端需要允许前端域名访问，修改 `api/app.py`:

```python
# 替换现有的 CORS(app) 为：
CORS(app, origins=[
    "http://localhost:5174",
    "http://localhost:5175",
    "https://stock-platform-frontend.vercel.app",  # 你的 Vercel 域名
    "https://stock-platform-frontend-xxx.vercel.app"  # 如果有预览域名
])
```

然后提交并推送到 GitHub，Render 会自动重新部署。

## 4. 初始化数据

后端部署完成后，需要初始化数据库和股票数据：

### 方法 A: 通过 Render Shell

1. 在 Render Dashboard 中找到你的服务
2. 点击 **Shell** 标签
3. 执行：
   ```bash
   cd api
   python scripts/import_finnhub_symbols.py
   python scripts/init_portfolio_structure.py
   ```

### 方法 B: 本地执行后上传

1. 本地初始化数据库：
   ```bash
   cd api
   python scripts/import_finnhub_symbols.py
   python scripts/init_portfolio_structure.py
   ```

2. 将生成的 `api/stock_platform.db` 上传到 Render 的磁盘目录

## 5. 验证部署

1. 访问 Vercel 前端地址
2. 打开浏览器开发者工具 (F12)
3. 检查 Network 标签，确认 API 请求正常
4. 测试股票搜索和图表显示

## 免费额度说明

| 服务 | 免费额度 | 限制 |
|------|---------|------|
| **Vercel** | 无限流量 | 构建时间 6000 分钟/月 |
| **Render** | 750 小时/月 | 15 分钟无活动后休眠 |

**注意**: Render 免费版会在 15 分钟无访问后休眠，首次访问需要等待 30 秒左右唤醒。

## 自定义域名（可选）

### Vercel 自定义域名:
1. 在 Vercel Project Settings → Domains 中添加域名
2. 按提示配置 DNS

### Render 自定义域名:
1. 在 Render Dashboard → Settings → Custom Domains 中添加
2. 更新前端环境变量 `VITE_API_BASE_URL`

## 故障排查

### 后端无法启动
- 检查 Render Logs 查看错误信息
- 确认 `requirements.txt` 包含所有依赖
- 确认 `app:app` 是正确的主应用对象

### 前端无法连接后端
- 检查浏览器 Console 的 CORS 错误
- 确认 `VITE_API_BASE_URL` 环境变量正确
- 确认后端 CORS 配置包含前端域名

### 数据库丢失
- 确认 Render Disk 正确挂载
- 确认 `DATABASE_URL` 路径指向挂载目录

## 与其他部署方案对比

| 特性 | Vercel + Render | 阿里云 ECS |
|------|----------------|-----------|
| **费用** | 免费（有限制） | ~150-250元/月 |
| **稳定性** | 有休眠限制 | 24/7 稳定运行 |
| **数据持久化** | 磁盘可能重置 | 数据持久保存 |
| **访问速度** | 海外 CDN | 国内快速访问 |
| **适用场景** | 测试、演示 | 生产环境、长期使用 |

## 切换到其他方案

如需迁移到阿里云 ECS：
1. 按照 [DEPLOY_ALIYUN.md](DEPLOY_ALIYUN.md) 购买并配置 ECS
2. 导出 Render 上的数据库：`docker exec stock-platform-backend cat /app/data/stock_platform.db > stock_platform.db`
3. 上传到阿里云 ECS 的 `data/` 目录
4. 重新部署并启动

## 更新部署

代码推送到 GitHub 后，Vercel 和 Render 都会自动重新部署。

```bash
git add .
git commit -m "update: xxx"
git push origin main
```
