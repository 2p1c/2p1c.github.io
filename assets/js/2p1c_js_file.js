const list = document.createElement("ul");
const info = document.createElement("p");
const html = document.querySelector("html");
const main = document.querySelector("main");

info.textContent =
  "Below is a dynamic list. Click anywhere on the page to add a new list item. Click an existing list item to change its text to something else.";

main.appendChild(info);
main.appendChild(list);

// 获取当前年份
  const year = new Date().getFullYear();
  // 找到 ID 为 "currentYear" 的 span 元素
  const yearElement = document.getElementById("currentYear");
  
  // 检查起始年份是否小于当前年份。
  // 如果起始年份是 2025，而当前年份已经是 2026 或更大，
  // 则显示年份范围，例如 "2025–2026"
  if (year > 2025) {
      yearElement.textContent = `2025–${year}`;
  } else {
      // 如果当前年份是 2025，则只显示 2025
      yearElement.textContent = year;
  }