const container = document.querySelector(".smooth-scroll");

let current = 0;
let ease = 0.12;

function smooth() {
  let target = window.scrollY;        // 原生滚动值，有边界，不会无限滚动
  current += (target - current) * ease;

  container.style.transform = `translateY(${-current}px)`;

  requestAnimationFrame(smooth);
}

smooth();
