# 阿里云 ECS 部署指南

使用 Docker Compose 在阿里云 ECS 上部署股票分析平台。

## 架构

```
┌─────────────────────────────────────────────────────────────┐
│                    阿里云 ECS 服务器                          │
│  ┌─────────────────┐         ┌──────────────────────────┐  │
│  │   Nginx (80)    │────────▶│   前端容器 (React SPA)    │  │
│  │   - 静态文件     │         │   - 构建后的 React 应用   │  │
│  │   - API 代理     │         │   - 托管在 Nginx        │  │
│  └─────────────────┘         └──────────────────────────┘  │
│           │                                                │
│           ▼                                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              后端容器 (Flask API)                    │  │
│  │  - UDF API 接口                                     │  │
│  │  - Portfolio API                                    │  │
│  │  - SQLite 数据库 (挂载到宿主机)                      │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 1. 购买阿里云 ECS

### 推荐配置
- **实例规格**: 2核 4GB（ecs.t6-c1m2.large 或更高）
- **操作系统**: Ubuntu 22.04 LTS 64位
- **系统盘**: 40GB SSD
- **带宽**: 3-5Mbps（按流量计费更便宜）
- **地域**: 选择离你最近的节点（如华东1杭州）

### 安全组配置
开放以下端口：
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS，可选)

## 2. 服务器初始化

### 连接服务器
```bash
ssh root@你的服务器IP
```

### 安装 Docker
```bash
# 更新系统
apt update && apt upgrade -y

# 安装 Docker
apt install -y docker.io docker-compose

# 启动 Docker
systemctl start docker
systemctl enable docker

# 验证安装
docker --version
docker-compose --version
```

### 安装 Git
```bash
apt install -y git
```

## 3. 部署应用

### 克隆代码
```bash
cd /opt
git clone https://github.com/cookabc/stock-platform.git
cd stock-platform
```

### 创建数据目录
```bash
mkdir -p data
```

### 构建并启动容器
```bash
# 构建镜像
docker-compose build

# 后台启动
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 初始化数据库
```bash
# 进入后端容器
docker exec -it stock-platform-backend bash

# 在容器内执行初始化脚本
cd /app
python scripts/import_finnhub_symbols.py
python scripts/init_portfolio_structure.py

# 退出容器
exit
```

## 4. 配置域名（可选）

### 域名解析
在阿里云域名控制台添加 A 记录：
- 主机记录: `@` 或 `stock`
- 记录值: 你的 ECS 公网 IP

### 安装 Certbot（HTTPS）
```bash
apt install -y certbot python3-certbot-nginx

# 获取证书（替换为你的域名）
certbot --nginx -d your-domain.com

# 自动续期测试
certbot renew --dry-run
```

### 修改 Nginx 配置
编辑 `frontend/nginx.conf`，添加域名：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 添加你的域名
    # ... 其他配置
}
```

然后重启容器：
```bash
docker-compose down
docker-compose up -d
```

## 5. 常用运维命令

### 查看运行状态
```bash
# 查看容器状态
docker-compose ps

# 查看资源使用
docker stats

# 查看日志
docker-compose logs -f backend   # 后端日志
docker-compose logs -f frontend  # 前端日志
```

### 重启服务
```bash
# 重启所有服务
docker-compose restart

# 重启单个服务
docker-compose restart backend
```

### 更新代码
```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose down
docker-compose up -d --build

# 重新初始化数据（如果需要）
docker exec -it stock-platform-backend python /app/scripts/init_portfolio_structure.py
```

### 备份数据
```bash
# 备份数据库
cp data/stock_platform.db data/stock_platform.db.backup.$(date +%Y%m%d)

# 或者使用脚本自动备份
cat > /opt/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
cp /opt/stock-platform/data/stock_platform.db $BACKUP_DIR/stock_platform_$DATE.db
# 保留最近 7 天的备份
find $BACKUP_DIR -name "stock_platform_*.db" -mtime +7 -delete
EOF
chmod +x /opt/backup.sh

# 添加到定时任务（每天凌晨3点备份）
echo "0 3 * * * /opt/backup.sh" | crontab -
```

### 查看资源使用
```bash
# 查看磁盘使用
df -h

# 查看内存使用
free -h

# 查看 CPU 使用
top
```

## 6. 故障排查

### 容器无法启动
```bash
# 查看详细错误
docker-compose logs backend
docker-compose logs frontend

# 检查端口占用
netstat -tlnp | grep 80
```

### 数据库权限问题
```bash
# 修复数据目录权限
chmod 777 data
```

### API 返回 502
```bash
# 检查后端是否健康
curl http://localhost:5200/api/udf/config

# 检查 Nginx 配置
docker exec stock-platform-frontend nginx -t
```

## 7. 性能优化

### 增加 SWAP（小内存服务器）
```bash
# 创建 4GB swap
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# 永久生效
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### 调整 Gunicorn 工作进程
编辑 `Dockerfile`，根据 CPU 核心数调整：
```dockerfile
# 2核服务器用 4 个 worker
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5200", "--timeout", "120", "app:app"]

# 4核服务器用 8 个 worker
CMD ["gunicorn", "-w", "8", "-b", "0.0.0.0:5200", "--timeout", "120", "app:app"]
```

## 8. 费用估算

| 配置 | 月费用（按量付费） |
|------|------------------|
| 2核4G + 40G SSD + 3Mbps | 约 150-200 元/月 |
| 2核4G + 40G SSD + 5Mbps | 约 200-250 元/月 |

**省钱技巧**:
- 使用抢占式实例（可节省 50-70%，但可能被回收）
- 选择包年包月（比按量付费便宜 30-50%）
- 使用轻量应用服务器（更便宜，适合个人使用）

## 9. 安全建议

1. **禁用 root 登录**，创建普通用户
2. **修改 SSH 端口**，避免默认 22 端口被扫描
3. **配置防火墙**，只开放必要端口
4. **定期更新系统**和 Docker 镜像
5. **启用阿里云安全中心**，监控异常行为

## 快速部署脚本

保存为 `deploy.sh`，在服务器上执行：

```bash
#!/bin/bash
set -e

echo "=== 股票平台部署脚本 ==="

# 安装依赖
echo "[1/5] 安装 Docker..."
apt update
apt install -y docker.io docker-compose git curl
systemctl start docker
systemctl enable docker

# 克隆代码
echo "[2/5] 克隆代码..."
cd /opt
if [ ! -d "stock-platform" ]; then
    git clone https://github.com/cookabc/stock-platform.git
fi
cd stock-platform

# 创建数据目录
echo "[3/5] 创建数据目录..."
mkdir -p data

# 构建镜像
echo "[4/5] 构建 Docker 镜像..."
docker-compose build

# 启动服务
echo "[5/5] 启动服务..."
docker-compose up -d

echo ""
echo "=== 部署完成 ==="
echo "等待服务启动..."
sleep 10

# 检查状态
if curl -s http://localhost/api/udf/config > /dev/null; then
    echo "✅ 服务运行正常"
    echo "访问地址: http://$(curl -s ip.sb)"
else
    echo "❌ 服务启动失败，请检查日志:"
    echo "   docker-compose logs"
fi
```

执行：
```bash
chmod +x deploy.sh
./deploy.sh
```
