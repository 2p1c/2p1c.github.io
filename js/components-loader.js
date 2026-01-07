/**
 * 组件加载器 v1.1
 * 
 * 新增功能:
 * - 页面加载状态管理
 * - 防止FOUC(无样式内容闪烁)
 * - 平滑的淡入效果
 */

(function () {
  'use strict';

  /**
   * 显示页面内容(移除加载遮罩)
   */
  function showPageContent() {
    const loader = document.getElementById('page-loader');
    
    // 尝试找到内容容器 (.smooth-scroll 或 .page-content)
    const content = document.querySelector('.smooth-scroll') || 
                   document.querySelector('.page-content') ||
                   document.body;
    
    if (loader) {
      // 淡出加载遮罩
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 300);
    }
    
    if (content && content !== document.body) {
      // 淡入页面内容
      content.style.opacity = '0';
      content.style.display = 'block';
      
      // 使用 requestAnimationFrame 确保动画流畅
      requestAnimationFrame(() => {
        content.style.transition = 'opacity 0.3s ease-in-out';
        content.style.opacity = '1';
      });
    } else {
      // 如果没有特定容器,直接移除body的隐藏
      document.body.style.opacity = '0';
      requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.3s ease-in-out';
        document.body.style.opacity = '1';
      });
    }
  }

  /**
   * 获取当前页面的根路径
   * @returns {string} 根路径前缀,主页返回空字符串,子页面返回 "../"
   */
  function getRootPath() {
    const path = window.location.pathname;
    return path.includes('/pages/') ? '../' : '';
  }

  /**
   * 插入通用的 head 内容
   * 包括: favicon图标、Google Fonts、主CSS文件、作者信息
   */
  function insertCommonHeadContent() {
    const root = getRootPath();
    const head = document.head;

    // 定义需要插入的资源
    const resources = [
      // Favicon 图标
      { tag: 'link', attrs: { rel: 'apple-touch-icon', href: `${root}assets/images/favicon1.png`, type: 'image/png' } },
      { tag: 'link', attrs: { rel: 'icon', href: `${root}assets/images/favicon1.png`, type: 'image/png' } },
      
      // Google Fonts - preconnect
      { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
      { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' } },
      
      // Google Fonts - stylesheet
      { 
        tag: 'link', 
        attrs: { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Alata&family=Anton&family=Gloock&family=Mitr:wght@200;300;400;500;600;700&family=Noto+Sans+SC:wght@100..900&family=Noto+Serif+SC:wght@200..900&family=Oswald:wght@200..700&family=Press+Start+2P&display=swap' 
        } 
      },
      
      // 作者 meta 标签
      { tag: 'meta', attrs: { name: 'author', content: '2p1c' } },
      
      // 主 CSS 文件
      { tag: 'link', attrs: { rel: 'stylesheet', href: `${root}css/main.css` } }
    ];

    // 批量创建和插入元素
    resources.forEach(({ tag, attrs }) => {
      const element = document.createElement(tag);
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'crossOrigin') {
          element.crossOrigin = value;
        } else {
          element.setAttribute(key, value);
        }
      });
      head.appendChild(element);
    });

    console.log('✅ 通用 head 内容已插入');
  }

  /**
   * 加载 HTML 组件
   * @param {string} url - 组件文件路径
   * @param {string} targetId - 目标容器的 ID
   * @returns {Promise<void>}
   */
  async function loadComponent(url, targetId) {
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) {
      console.error(`❌ 找不到目标元素: #${targetId}`);
      return;
    }

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      let html = await response.text();
      
      // 替换组件中的 {{ROOT}} 占位符为实际路径
      const root = getRootPath();
      html = html.replace(/\{\{ROOT\}\}/g, root);
      
      // 使用 innerHTML 插入内容(已经过服务器验证的HTML)
      targetElement.innerHTML = html;
      
      // 移除骨架屏样式
      targetElement.classList.remove('skeleton');
      
      console.log(`✅ 组件加载成功: ${url} -> #${targetId}`);
      
    } catch (error) {
      console.error(`❌ 组件加载失败: ${url}`, error.message);
      
      // 降级处理: 显示错误提示
      targetElement.innerHTML = `
        <div style="padding: 10px; background: #fff3cd; color: #856404; text-align: center; font-size: 12px;">
          ⚠️ 组件加载失败,请刷新页面重试
        </div>
      `;
    }
  }

  /**
   * 更新页脚年份为当前年份
   */
  function updateFooterYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  /**
   * 初始化: 加载所有组件
   */
  async function init() {
    const startTime = performance.now();
    const root = getRootPath();
    
    console.log('🚀 开始加载组件...');
    
    // 1. 插入通用 head 内容(同步)
    insertCommonHeadContent();
    
    // 2. 并行加载导航栏和页脚组件
    await Promise.all([
      loadComponent(`${root}pages/components/nav.html`, 'nav-placeholder'),
      loadComponent(`${root}pages/components/footer.html`, 'footer-placeholder')
    ]);
    
    // 3. 更新页脚年份
    updateFooterYear();

    // 4. 显示页面内容(移除加载遮罩)
    showPageContent();

    // 5. 触发自定义事件,通知其他脚本组件已加载完成
    const loadTime = performance.now() - startTime;
    window.dispatchEvent(new CustomEvent('componentsLoaded', {
      detail: { loadTime }
    }));
    
    console.log(`✅ 所有组件加载完成 (耗时: ${loadTime.toFixed(2)}ms)`);
  }

  // DOM 加载完成后执行初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // 如果 DOM 已经加载完成,立即执行
    init();
  }

})();
