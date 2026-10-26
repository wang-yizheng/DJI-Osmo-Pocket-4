#!/bin/bash

# DJI Osmo Pocket 4 - GitHub Pages 一键部署脚本
# 使用方法: bash deploy.sh

echo "🎬 DJI Osmo Pocket 4 3D Teardown - GitHub Pages 部署"
echo "======================================================"
echo ""

# 检查是否已配置 git
if ! git config user.name > /dev/null 2>&1; then
    echo "⚠️  请先配置 Git 用户信息："
    echo "   git config --global user.name \"Your Name\""
    echo "   git config --global user.email \"your.email@example.com\""
    exit 1
fi

# 获取 GitHub 用户名
read -p "📝 请输入您的 GitHub 用户名: " GITHUB_USERNAME
read -p "📦 请输入仓库名称 (例如: osmo-pocket-4): " REPO_NAME

if [ -z "$GITHUB_USERNAME" ] || [ -z "$REPO_NAME" ]; then
    echo "❌ 用户名和仓库名不能为空"
    exit 1
fi

echo ""
echo "📋 部署信息："
echo "   GitHub 用户: $GITHUB_USERNAME"
echo "   仓库名称: $REPO_NAME"
echo "   访问地址: https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""

# 检查是否已初始化 git
if [ ! -d .git ]; then
    echo "🔧 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit: DJI Osmo Pocket 4 3D Teardown"
fi

# 检查远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 添加远程仓库..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
else
    CURRENT_REMOTE=$(git remote get-url origin)
    echo "✓ 远程仓库已配置: $CURRENT_REMOTE"
fi

# 提示用户修改 vite.config.js
echo ""
echo "⚠️  重要提示："
echo "   请在 vite.config.js 中添加以下配置："
echo ""
echo "   export default defineConfig({"
echo "     base: '/$REPO_NAME/',  // ← 添加这一行"
echo "     plugins: [react(), tailwindcss()],"
echo "     // ..."
echo "   });"
echo ""
read -p "是否已修改 vite.config.js? (y/n): " CONFIRMED

if [ "$CONFIRMED" != "y" ]; then
    echo ""
    echo "请先修改 vite.config.js，然后重新运行此脚本"
    exit 0
fi

# 构建项目
echo ""
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功"

# 推送到 GitHub
echo ""
echo "📤 推送到 GitHub..."
git add .
git commit -m "Deploy to GitHub Pages" || echo "没有新的更改需要提交"
git branch -M main
git push -u origin main

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  推送失败，请确保："
    echo "   1. 已在 GitHub 创建仓库: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    echo "   2. 仓库为 Public（公开）"
    echo "   3. 已配置 GitHub 访问权限"
    exit 1
fi

echo "✅ 代码已推送到 GitHub"

# 部署说明
echo ""
echo "======================================================"
echo "🎉 部署准备完成！"
echo "======================================================"
echo ""
echo "📌 下一步操作："
echo ""
echo "1️⃣  启用 GitHub Pages："
echo "   访问: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "   - Source 选择: GitHub Actions"
echo "   - 保存设置"
echo ""
echo "2️⃣  查看部署状态："
echo "   访问: https://github.com/$GITHUB_USERNAME/$REPO_NAME/actions"
echo ""
echo "3️⃣  等待 1-3 分钟后访问您的网站："
echo "   🌐 https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
echo "💡 提示："
echo "   - 每次推送代码到 main 分支会自动重新部署"
echo "   - 如需手动部署，运行: npx gh-pages -d dist"
echo ""
echo "📖 详细指南请查看: GITHUB_PAGES_GUIDE.md"
echo ""
