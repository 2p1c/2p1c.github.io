# 组件系统使用文档

## 📚 概述

本项目使用动态组件加载系统,实现导航栏和页脚的统一管理,减少代码重复,便于维护。

## 🗂️ 文件结构

```
2p1c.github.io/
├── pages/
│   ├── components/
│   │   ├── nav.html           # 导航栏组件
│   │   └── footer.html        # 页脚组件
│   └── *.html                 # 各子页面
├── js/
│   ├── components-loader.js   # 组件加载器
│   └── scroll.js              # 平滑滚动控制器
├── css/
│   └── layout/
│       ├── header.css         # 导航栏样式
│       └── footer.css         # 页脚样式
└── index.html                 # 主页
```

## 🚀 快速开始

### 创建新页面

1. 复制 `pages/template.html` 作为新页面模板
2. 修改 `<title>` 和 `<meta description>`
3. 在 `<main>` 中添加页面内容
4. 保存文件

**就这么简单!** 导航栏、页脚、样式、图标等都会自动加载。

### 示例代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>我的新页面 - 2p1c</title>
    <meta name="description" content="这是一个新页面" />
    
    <!-- 组件加载器 - 必需 -->
    <script src="../js/components-loader.js"></script>
    <!-- 平滑滚动 - 可选 -->
    <script src="../js/scroll.js" defer></script>
  </head>

  <body>
    <div class="smooth-scroll">
      <!-- 导航栏占位符 -->
      <div id="nav-placeholder"></div>

      <main>
        <h1>欢迎来到我的新页面</h1>
        <p>在这里添加你的内容...</p>
      </main>

      <!-- 页脚占位符 -->
      <div id="footer-placeholder"></div>
    </div>
  </body>
</html>
```

## ⚙️ 工作原理

### 1. 组件加载流程

```
页面加载
  ↓
components-loader.js 执行
  ↓
插入通用 head 内容 (图标、字体、CSS)
  ↓
并行加载 nav.html 和 footer.html
  ↓
替换占位符内容
  ↓
触发 componentsLoaded 事件
  ↓
scroll.js 初始化平滑滚动
```

### 2. 路径自动处理

组件加载器会自动检测当前页面位置:
- **主页** (`index.html`): 路径前缀为空 `""`
- **子页面** (`pages/*.html`): 路径前缀为 `"../"`

所有链接和资源路径会自动调整,无需手动修改。

### 3. 平滑滚动

如果页面包含 `.smooth-scroll` 容器,scroll.js 会:
1. 等待组件加载完成
2. 计算内容高度
3. 启用平滑滚动效果

## 🔧 自定义配置

### 修改导航栏

编辑 `pages/components/nav.html`:

```html
<nav class="main-nav">
  <ul>
    <li><a href="{{ROOT}}pages/new-page.html">新页面</a></li>
    <!-- 添加更多链接 -->
  </ul>
</nav>
```

**注意**: 使用 `{{ROOT}}` 占位符,系统会自动替换为正确的路径。

### 修改页脚

编辑 `pages/components/footer.html`:

```html
<footer class="google-footer">
  <p class="copyright-text">
    © <span id="currentYear">2025</span> 你的名字
  </p>
</footer>
```

### 调整滚动速度

编辑 `js/scroll.js` 中的配置:

```javascript
const CONFIG = {
  ease: 0.12,  // 缓动系数(0-1),越小越慢
  // ...
};
```

## 📝 注意事项

### 必需元素

每个页面必须包含:
```html
<!-- 1. 组件加载器脚本 -->
<script src="[路径]/js/components-loader.js"></script>

<!-- 2. 导航栏占位符 -->
<div id="nav-placeholder"></div>

<!-- 3. 页脚占位符 -->
<div id="footer-placeholder"></div>
```

### 路径规则

- 主页使用相对路径: `js/`, `css/`, `assets/`
- 子页面使用相对路径: `../js/`, `../css/`, `../assets/`
- 组件中使用占位符: `{{ROOT}}js/`, `{{ROOT}}assets/`

### 浏览器要求

- 支持 ES6+ 语法
- 支持 Fetch API
- 支持 Custom Events
- 推荐使用现代浏览器(Chrome, Firefox, Safari, Edge)

### 本地开发

由于使用了 `fetch()` API,需要通过 HTTP 服务器访问:

```bash
# 使用 VS Code Live Server 插件
# 或使用 Python 简易服务器
python -m http.server 8000
```

直接打开 HTML 文件会因 CORS 限制导致组件加载失败。

## 🐛 故障排除

### 组件未加载

1. 检查浏览器控制台是否有错误
2. 确认占位符 ID 正确: `nav-placeholder`, `footer-placeholder`
3. 确认通过 HTTP 服务器访问,而非直接打开文件

### 样式错乱

1. 清除浏览器缓存 (Ctrl+Shift+Delete)
2. 检查 `css/main.css` 是否正确加载
3. 查看控制台是否有 CSS 加载错误

### 滚动不流畅

1. 确认页面有 `.smooth-scroll` 容器
2. 检查控制台是否有 "平滑滚动已初始化" 日志
3. 尝试调整 `CONFIG.ease` 参数

## 📞 技术支持

如有问题,请查看:
- 浏览器开发者工具控制台
- Network 面板检查资源加载
- 本文档的故障排除部分

---

**版本**: 1.0  
**最后更新**: 2026-01-07
