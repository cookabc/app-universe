#!/bin/bash
set -e

echo "=== 股票平台部署脚本 ==="

# 检查是否以 root 运行
if [ "$EUID" -ne 0 ]; then 
    echo "请使用 root 权限运行: sudo ./deploy.sh"
    exit 1
fi

# 安装依赖
echo "[1/5] 安装 Docker..."
apt-get update > /dev/null 2>&1
apt-get install -y docker.io docker-compose git curl > /dev/null 2>&1
systemctl start docker
systemctl enable docker > /dev/null 2>&1

# 验证 Docker 安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 安装失败"
    exit 1
fi

# 克隆代码
echo "[2/5] 克隆代码..."
cd /opt
if [ ! -d "stock-platform" ]; then
    git clone https://github.com/cookabc/stock-platform.git
fi
cd stock-platform

# 拉取最新代码
git pull origin main

# 创建数据目录
echo "[3/5] 创建数据目录..."
mkdir -p data
chmod 777 data

# 构建镜像
echo "[4/5] 构建 Docker 镜像..."
docker-compose down 2>/dev/null || true
docker-compose build --no-cache

# 启动服务
echo "[5/5] 启动服务..."
docker-compose up -d

echo ""
echo "=== 部署完成 ==="
echo "等待服务启动..."
sleep 15

# 检查状态
echo ""
echo "检查服务状态..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ 容器运行正常"
else
    echo "❌ 容器启动失败"
    docker-compose logs
    exit 1
fi

# 获取公网 IP
PUBLIC_IP=$(curl -s ip.sb 2>/dev/null || echo "未知")
echo ""
echo "=========================================="
echo "🎉 部署成功！"
echo "=========================================="
echo ""
echo "访问地址: http://$PUBLIC_IP"
echo ""
echo "后续步骤:"
echo "1. 初始化数据库:"
echo "   docker exec -it stock-platform-backend bash"
echo "   python scripts/import_finnhub_symbols.py"
echo "   python scripts/init_portfolio_structure.py"
echo ""
echo "2. 查看日志:"
echo "   docker-compose logs -f"
echo ""
echo "3. 常用命令:"
echo "   重启: docker-compose restart"
echo "   停止: docker-compose down"
echo "   更新: git pull && docker-compose up -d --build"
echo "=========================================="
