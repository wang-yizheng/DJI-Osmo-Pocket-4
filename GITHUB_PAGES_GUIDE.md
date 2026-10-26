# GitHub Pages 部署完整指南

## 🚀 快速部署（推荐）

### 方法一：使用 GitHub Actions（自动化部署）

1. **创建 GitHub 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 访问您的仓库页面：`https://github.com/YOUR_USERNAME/YOUR_REPO`
   - 点击 **Settings** → **Pages**
   - 在 **Source** 中选择 **GitHub Actions**
   - 保存设置

3. **自动部署**
   - 每次推送到 `main` 分支都会自动触发部署
   - 访问地址：`https://YOUR_USERNAME.github.io/YOUR_REPO/`

### 方法二：手动部署

1. **修改 vite.config.js**（重要！）
   
   在 `vite.config.js` 中添加 `base` 配置：
   ```javascript
   export default defineConfig({
     base: '/YOUR_REPO/', // 替换为您的仓库名
     plugins: [react(), tailwindcss()],
     // ... 其他配置
   });
   ```

2. **构建并部署**
   ```bash
   npm run build
   npx gh-pages -d dist
   ```

3. **配置 GitHub Pages**
   - 仓库 **Settings** → **Pages**
   - Source 选择 **Deploy from a branch**
   - Branch 选择 **gh-pages** / **root**
   - 保存

## 📝 详细步骤

### 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库名称（例如：`osmo-pocket-4`）
3. 选择 **Public**（GitHub Pages 需要公开仓库）
4. **不要**初始化 README、.gitignore 或 license
5. 点击 **Create repository**

### 步骤 2：初始化本地 Git

```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit: DJI Osmo Pocket 4 3D Teardown"

# 添加远程仓库（替换为您的用户名和仓库名）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步骤 3：配置 GitHub Pages

**方式 A：使用 GitHub Actions（推荐）**

已自动配置好 `.github/workflows/deploy.yml`，只需：
1. 进入仓库 **Settings** → **Pages**
2. **Source** 选择 **GitHub Actions**
3. 完成！每次推送代码会自动部署

**方式 B：使用 gh-pages 分支**

```bash
# 安装 gh-pages
npm install -D gh-pages

# 部署
npx gh-pages -d dist
```

然后在 GitHub：
1. **Settings** → **Pages**
2. **Source** 选择 **Deploy from a branch**
3. **Branch** 选择 `gh-pages` / `/(root)`
4. 点击 **Save**

### 步骤 4：访问您的网站

部署成功后（通常需要 1-3 分钟），访问：
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

## ⚠️ 重要配置

### Base Path 配置

如果您的仓库名不是 `YOUR_USERNAME.github.io`（即项目页面而非用户页面），**必须**配置 base path：

1. 打开 `vite.config.js`
2. 添加 `base` 字段：
   ```javascript
   export default defineConfig({
     base: '/YOUR_REPO/', // 替换为您的仓库名，前后都要有斜杠
     plugins: [react(), tailwindcss()],
     // ...
   });
   ```
3. 重新构建：`npm run build`
4. 重新部署

### 示例

- 用户名：`zhangsan`
- 仓库名：`osmo-pocket-4`
- 访问地址：`https://zhangsan.github.io/osmo-pocket-4/`
- base 配置：`base: '/osmo-pocket-4/'`

## 🔧 常见问题

### Q1: 页面显示 404
- 检查是否已启用 GitHub Pages
- 确认选择了正确的分支（gh-pages 或 main）
- 等待 1-3 分钟让部署生效

### Q2: 资源加载失败（CSS/JS 404）
- 检查 `vite.config.js` 中的 `base` 配置
- 确保 base path 与仓库名一致
- 重新构建并部署

### Q3: 部署后页面空白
- 打开浏览器开发者工具查看控制台错误
- 检查资源路径是否正确
- 确认 base path 配置正确

### Q4: 如何更新网站
```bash
# 修改代码后
git add .
git commit -m "Update features"
git push

# 如果使用 GitHub Actions，会自动部署
# 如果使用 gh-pages，需要手动运行：
npm run build
npx gh-pages -d dist
```

## 📊 部署状态检查

查看部署状态：
1. 仓库页面 → **Actions** 标签
2. 查看最新的 workflow 运行状态
3. 绿色 ✓ 表示成功，红色 ✗ 表示失败

## 🎯 自定义域名（可选）

如果想使用自定义域名：

1. 在仓库根目录创建 `CNAME` 文件：
   ```
   yourdomain.com
   ```

2. 在域名服务商处添加 DNS 记录：
   - 类型：CNAME
   - 名称：yourdomain.com
   - 值：YOUR_USERNAME.github.io

3. 在仓库 **Settings** → **Pages** → **Custom domain** 填入域名

## 📞 获取帮助

- GitHub Pages 文档：https://docs.github.com/en/pages
- Vite 部署指南：https://vitejs.dev/guide/static-deploy.html

---

**部署成功后，分享您的网站：**
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```
