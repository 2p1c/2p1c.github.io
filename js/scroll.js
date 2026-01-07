/**
 * 平滑滚动控制器 v1.0
 * 
 * 功能:
 * - 提供丝滑的页面滚动效果
 * - 等待组件加载完成后初始化
 * - 自动计算滚动范围
 * - 响应窗口大小变化
 * 
 * 依赖: components-loader.js (通过 componentsLoaded 事件通信)
 * 兼容性: 现代浏览器(支持 ES6+, requestAnimationFrame)
 */

(function() {
  'use strict';

  const container = document.querySelector(".smooth-scroll");

  // 如果找不到容器,直接返回
  if (!container) {
    console.warn('⚠️ 未找到 .smooth-scroll 容器,跳过平滑滚动初始化');
    return;
  }

  // 滚动状态
  let current = 0;      // 当前滚动位置
  let target = 0;       // 目标滚动位置
  let maxScroll = 0;    // 最大可滚动距离
  let isInitialized = false;
  let animationFrameId = null;

  // 配置参数
  const CONFIG = {
    ease: 0.12,                    // 缓动系数(0-1,越小越慢)
    threshold: 0.5,                // 停止阈值(像素)
    resizeDebounceDelay: 150       // 窗口大小变化防抖延迟(ms)
  };

  /**
   * 更新最大滚动距离
   * 使用 scrollHeight 获取容器的实际内容高度
   */
  function updateMaxScroll() {
    const contentHeight = container.scrollHeight;
    const viewportHeight = window.innerHeight;
    maxScroll = Math.max(0, contentHeight - viewportHeight);
    
    console.log('📏 更新滚动范围:', { 
      contentHeight, 
      viewportHeight, 
      maxScroll 
    });
  }

  /**
   * 平滑滚动动画循环
   * 使用 requestAnimationFrame 实现流畅的60fps动画
   */
  function smooth() {
    // 插值平滑过渡
    current += (target - current) * CONFIG.ease;

    // 如果已经非常接近目标位置,直接设置为目标值(优化性能)
    if (Math.abs(target - current) < CONFIG.threshold) {
      current = target;
    }

    // 应用 3D 变换(使用 GPU 加速)
    container.style.transform = `translate3d(0, ${-current}px, 0)`;

    // 继续下一帧动画
    animationFrameId = requestAnimationFrame(smooth);
  }

  /**
   * 处理滚轮事件
   * @param {WheelEvent} e - 滚轮事件对象
   */
  function handleWheel(e) {
    e.preventDefault(); // 阻止原生滚动

    // 更新目标位置
    target += e.deltaY;

    // 限制滚动范围,防止超出内容边界
    target = Math.max(0, Math.min(target, maxScroll));
  }

  /**
   * 防抖函数
   * @param {Function} fn - 需要防抖的函数
   * @param {number} delay - 延迟时间(ms)
   * @returns {Function} 防抖后的函数
   */
  function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * 处理窗口大小变化
   */
  const handleResize = debounce(() => {
    updateMaxScroll();
    // 确保当前滚动位置在有效范围内
    target = Math.max(0, Math.min(target, maxScroll));
    current = Math.max(0, Math.min(current, maxScroll));
  }, CONFIG.resizeDebounceDelay);

  /**
   * 初始化平滑滚动
   */
  function initSmoothScroll() {
    if (isInitialized) {
      console.warn('⚠️ 平滑滚动已经初始化,跳过重复初始化');
      return;
    }

    // 计算滚动范围
    updateMaxScroll();

    // 启动动画循环
    smooth();

    // 监听滚轮事件(passive: false 允许 preventDefault)
    window.addEventListener("wheel", handleWheel, { passive: false });

    // 监听窗口大小变化
    window.addEventListener("resize", handleResize);

    isInitialized = true;
    console.log('✅ 平滑滚动已初始化');
  }

  /**
   * 清理资源
   */
  function cleanup() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("resize", handleResize);
    console.log('🧹 平滑滚动资源已清理');
  }

  /**
   * 监听组件加载完成事件
   */
  window.addEventListener('componentsLoaded', (e) => {
    console.log('📦 接收到 componentsLoaded 事件');
    if (e.detail?.loadTime) {
      console.log(`   组件加载耗时: ${e.detail.loadTime.toFixed(2)}ms`);
    }
    
    // 延迟初始化,确保 DOM 完全渲染和布局完成
    setTimeout(initSmoothScroll, 100);
  });

  // 页面卸载时清理资源
  window.addEventListener('beforeunload', cleanup);

})();
