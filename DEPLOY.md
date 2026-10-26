# DJI Osmo Pocket 4 交互式3D结构拆解

## 部署指南

### 构建产物
构建完成后，所有静态文件位于 `dist/` 目录：
- `index.html` - 主页面
- `assets/` - CSS 和 JavaScript 资源

### 部署方式

#### 1. Vercel（最简单）
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

#### 2. Netlify
1. 访问 https://app.netlify.com
2. 拖拽 `dist` 文件夹到部署区域
3. 完成！

#### 3. GitHub Pages
```bash
# 安装 gh-pages
npm install -D gh-pages

# 部署
npx gh-pages -d dist
```

#### 4. 传统服务器（Nginx）
```bash
# 将 dist 目录内容上传到服务器
scp -r dist/* user@yourserver:/var/www/html/

# Nginx 配置示例
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 本地预览
```bash
# 开发模式
npm run dev

# 预览构建产物
npm run preview
```

## 技术栈
- React 18
- Three.js
- Tailwind CSS
- Vite

## 功能特性
- ✅ 9大模块程序化3D建模
- ✅ Canvas程序纹理生成
- ✅ 爆炸视图动画
- ✅ 交互式模块选择
- ✅ 自动旋转/手动控制
- ✅ 响应式设计
- ✅ 纯前端实现，无外部依赖
