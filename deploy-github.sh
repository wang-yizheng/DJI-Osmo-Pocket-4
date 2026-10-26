#!/bin/bash

# GitHub Pages 部署脚本
# 使用方法: bash deploy-github.sh <github-username> <repo-name>

USERNAME=$1
REPO=$2

if [ -z "$USERNAME" ] || [ -z "$REPO" ]; then
    echo "用法: bash deploy-github.sh <github-username> <repo-name>"
    echo "示例: bash deploy-github.sh john-doe osmo-pocket-4"
    exit 1
fi

echo "🚀 开始部署到 GitHub Pages..."
echo "📦 目标: https://$USERNAME.github.io/$REPO"

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 部署到 gh-pages 分支
echo "📤 部署到 GitHub Pages..."
npx gh-pages -d dist -r "https://github.com/$USERNAME/$REPO.git" -m "Deploy to GitHub Pages"

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo "🌐 访问地址: https://$USERNAME.github.io/$REPO"
    echo ""
    echo "⚠️  注意："
    echo "1. 确保已在 GitHub 创建仓库: https://github.com/$USERNAME/$REPO"
    echo "2. 首次部署可能需要几分钟生效"
    echo "3. 如果页面无法访问，请在仓库 Settings > Pages 中选择 gh-pages 分支"
else
    echo "❌ 部署失败"
    exit 1
fi
