const container = document.querySelector(".smooth-scroll");

let current = 0;
let target = 0;
let ease = 0.12;
let maxScroll = 0;

function updateMaxScroll() {
  const contentHeight = container.getBoundingClientRect().height;
  maxScroll = contentHeight - window.innerHeight;
}

function smooth() {
  // 插值平滑过渡
  current += (target - current) * ease;

  // 应用变换
  container.style.transform = `translateY(${-current}px)`;

  requestAnimationFrame(smooth);
}

// 监听滚轮事件，手动更新 target
function handleWheel(e) {
  e.preventDefault(); // 阻止原生滚动

  // deltaY 是滚轮滚动的距离，正值向下，负值向上
  target += e.deltaY;

  // 限制滚动范围，防止超出内容
  target = Math.max(0, Math.min(target, maxScroll));
}

// 初始化
updateMaxScroll();
smooth();

// 监听滚轮事件（使用 passive: false 以便可以 preventDefault）
window.addEventListener("wheel", handleWheel, { passive: false });

// 窗口变化时重新计算
window.addEventListener("resize", () => {
  updateMaxScroll();
  target = Math.max(0, Math.min(target, maxScroll));
});
