# DJI Osmo Pocket 4 - 交互式3D结构拆解

🎬 **DJI Osmo Pocket 4 的交互式3D结构拆解可视化页面**

整机9大模块全部由代码程序化建模（Three.js 几何体 + Canvas 程序纹理），不依赖任何外部3D模型文件/图片/字体/CDN。

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ 功能特性

- 🎯 **9大模块程序化3D建模**
  - 云台相机模块
  - 主机身外壳
  - LCD触摸屏
  - 电池模块
  - 主控电路板
  - 步进电机组
  - USB-C接口
  - 扬声器/麦克风
  - 散热模块

- 🎮 **丰富的交互功能**
  - 爆炸视图动画（0-100% 可调）
  - 模块点击高亮选择
  - 悬停预览效果
  - 自动旋转/手动控制切换
  - 3D轨道旋转和缩放

- 🎨 **纯前端实现**
  - Three.js 几何体建模
  - Canvas 程序纹理生成
  - 无任何外部资源依赖
  - 白色主题 UI 设计

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建产物
npm run preview
```

### 部署到 GitHub Pages

#### 方式一：一键部署（推荐）

```bash
bash deploy.sh
```

按照提示输入 GitHub 用户名和仓库名，脚本会自动完成所有配置。

#### 方式二：手动部署

1. **创建 GitHub 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **修改 vite.config.js**
   ```javascript
   export default defineConfig({
     base: '/YOUR_REPO/', // 添加这一行
     plugins: [react(), tailwindcss()],
     // ...
   });
   ```

3. **启用 GitHub Pages**
   - 仓库 Settings → Pages
   - Source 选择 GitHub Actions
   - 保存

4. **访问网站**
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO/
   ```

详细部署指南请查看：[GITHUB_PAGES_GUIDE.md](./GITHUB_PAGES_GUIDE.md)

## 🛠️ 技术栈

- **React 18** - UI 框架
- **Three.js** - 3D 渲染引擎
- **Tailwind CSS** - 样式框架
- **Vite** - 构建工具
- **TypeScript** - 类型安全

## 📁 项目结构

```
├── src/
│   ├── components/
│   │   └── Scene3D.tsx          # 3D场景组件
│   ├── utils/
│   │   ├── textures.ts          # Canvas程序纹理
│   │   └── moduleBuilder.ts     # 9大模块建模
│   ├── App.tsx                  # 主应用组件
│   ├── index.css                # 全局样式
│   └── main.tsx                 # 入口文件
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions 自动部署
├── deploy.sh                    # 一键部署脚本
├── GITHUB_PAGES_GUIDE.md        # 部署指南
└── README.md                    # 项目说明
```

## 🎮 使用说明

1. **旋转视角**：拖拽鼠标左键
2. **缩放视图**：鼠标滚轮
3. **选择模块**：点击3D模型或左侧列表
4. **爆炸视图**：拖动底部滑块
5. **自动旋转**：点击右上角按钮切换

## 📱 浏览器支持

- ✅ Chrome (推荐)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

需要支持 WebGL 的现代浏览器。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Three.js](https://threejs.org/) - 强大的3D库
- [DJI](https://www.dji.com/) - 优秀的产品灵感

---

**🌐 在线演示**: [https://YOUR_USERNAME.github.io/YOUR_REPO/](#)

**Made with ❤️ by [Your Name]**
