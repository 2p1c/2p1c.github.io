/**
 * 页面加载器 - 随机图标显示
 * 功能:在页面加载时随机选择并显示一个加载图标
 */

(function() {
  'use strict';

  // 配置项
  const CONFIG = {
    iconCount: 10,           // 图标总数
    iconPath: 'assets/images/',     // 图标文件夹路径
    iconPrefix: 'loader-',   // 图标文件名前缀
    iconExtension: '.svg',   // 图标文件扩展名
    minDisplayTime: 300,     // 最小显示时间(毫秒)
    maxWaitTime: 3000        // 最大等待时间(毫秒)
  };

  // 页面加载开始时间
  const startTime = Date.now();
  let isContentShown = false; // 防止重复显示

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
    // 检测是否在子目录中,调整路径
    const pathname = window.location.pathname;
    const isSubPage = pathname.includes('/pages/');
    const basePath = isSubPage ? '../' : '';
    return `${basePath}${CONFIG.iconPath}${CONFIG.iconPrefix}${randomNum}${CONFIG.iconExtension}`;
  }

  /**
   * 显示页面内容(移除加载器)
   */
  function showPageContent() {
    // 防止重复执行
    if (isContentShown) return;
    isContentShown = true;

    const loader = document.getElementById('page-loader');
    const smoothScroll = document.querySelector('.smooth-scroll');
    const pageContent = document.querySelector('.page-content');
    const targetContent = smoothScroll || pageContent;

    // 显示页面内容
    if (targetContent) {
      targetContent.style.display = 'block';
      // 强制浏览器重排
      void targetContent.offsetHeight;
      targetContent.style.opacity = '1';
    }
    
    // 恢复body滚动
    document.body.style.overflow = '';
    
    // 移除加载器
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
      }, 300);
    }
  }

  /**
   * 初始化加载器图标
   */
  function initLoader() {
    const loaderSpinner = document.querySelector('.loader-spinner');
    
    if (!loaderSpinner) {
      showPageContent();
      return;
    }

    // 获取随机图标路径
    const iconPath = getRandomIconPath();
    
    // 创建图片元素
    const iconImg = document.createElement('img');
    iconImg.src = iconPath;
    iconImg.alt = 'roll out the red carpet';
    iconImg.setAttribute('aria-label', '页面加载中');
    
    // 图标加载失败时使用备用动画
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

    // 将图标添加到容器中
    loaderSpinner.innerHTML = '';
    loaderSpinner.appendChild(iconImg);
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

  // 初始化加载器
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
