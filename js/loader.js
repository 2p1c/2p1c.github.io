/**
 * 页面加载器 - 随机图标显示
 * v1.2 修复: 解决内容无法显示的问题
 */

(function() {
  'use strict';

  // 配置项
  const CONFIG = {
    iconCount: 10,
    iconPath: 'assets/images/',
    iconPrefix: 'loader-',
    iconExtension: '.svg',
    minDisplayTime: 300,
    maxWaitTime: 3000
  };

  const startTime = Date.now();
  let isContentShown = false;

  /**
   * 生成随机整数
   */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 获取随机图标路径
   */
  function getRandomIconPath() {
    const randomNum = getRandomInt(1, CONFIG.iconCount);
    const pathname = window.location.pathname;
    const isSubPage = pathname.includes('/pages/');
    const basePath = isSubPage ? '../' : '';
    return `${basePath}${CONFIG.iconPath}${CONFIG.iconPrefix}${randomNum}${CONFIG.iconExtension}`;
  }

  /**
   * 显示页面内容(移除加载器)
   */
  function showPageContent() {
    if (isContentShown) return;
    isContentShown = true;

    const loader = document.getElementById('page-loader');
    const smoothScroll = document.querySelector('.smooth-scroll');
    const pageContent = document.querySelector('.page-content');
    const targetContent = smoothScroll || pageContent;

    console.log('📄 开始显示页面内容...');

    // 1. 显示页面内容 - 移除隐藏样式
    if (targetContent) {
      targetContent.style.visibility = 'visible';
      targetContent.style.opacity = '0';
      targetContent.style.transition = 'opacity 0.3s ease-in-out';
      
      // 触发重排后设置 opacity
      void targetContent.offsetHeight;
      
      requestAnimationFrame(() => {
        targetContent.style.opacity = '1';
      });
      
      console.log('✅ 内容容器已显示:', targetContent.className);
    }
    
    // 2. 恢复 body 滚动
    document.body.style.overflow = '';
    
    // 3. 移除加载器
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
        console.log('✅ 加载器已移除');
      }, 300);
    }
  }

  /**
   * 早期初始化 - 在DOM解析期间就可以执行
   */
  function earlyInit() {
    const loaderSpinner = document.querySelector('.loader-spinner');
    if (!loaderSpinner) return;

    const iconPath = getRandomIconPath();
    const iconImg = document.createElement('img');
    iconImg.src = iconPath;
    iconImg.alt = 'roll out the red carpet';
    
    iconImg.addEventListener('error', function() {
      loaderSpinner.innerHTML = `
        <div style="
          width: 50px; 
          height: 50px; 
          border: 4px solid rgba(255,255,255,0.3); 
          border-top-color: #fff; 
          border-radius: 50%; 
          animation: spin 1s linear infinite;
        "></div>
      `;
    });

    loaderSpinner.innerHTML = '';
    loaderSpinner.appendChild(iconImg);
  }

  /**
   * 初始化加载器图标
   */
  function initLoader() {
    // 如果已经初始化过,跳过
    const loaderSpinner = document.querySelector('.loader-spinner');
    if (!loaderSpinner || loaderSpinner.querySelector('img')) {
      return;
    }
    
    earlyInit();
  }

  /**
   * 页面加载完成处理
   */
  function onPageLoad() {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, CONFIG.minDisplayTime - elapsedTime);
    setTimeout(showPageContent, remainingTime);
  }

  /**
   * 超时保护 - 确保页面内容最终会显示
   */
  function setupTimeoutProtection() {
    setTimeout(function() {
      if (!isContentShown) {
        console.warn('⚠️ 触发超时保护,强制显示内容');
        showPageContent();
      }
    }, CONFIG.maxWaitTime);
  }

  // 添加旋转动画CSS(备用)
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // 设置超时保护
  setupTimeoutProtection();

  // 立即尝试初始化
  earlyInit();

  // DOMContentLoaded 后备
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
  } else {
    initLoader();
  }

  // 监听页面加载完成
  if (document.readyState === 'complete') {
    onPageLoad();
  } else {
    window.addEventListener('load', onPageLoad);
  }

})();
