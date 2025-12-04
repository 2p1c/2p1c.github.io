# 字符引用20251203
<	&lt;
>	&gt;
"	&quot;
'	&apos;
&	&amp;
# 背景颜色设置20251204
## 线性渐变（Linear Gradient）
html {
  background: linear-gradient(to bottom, 
    #FF0000 0%，
    #00FF00 100%
  );
  font-size: 20px;
  color: white;
  font-family: MesloLGS Nerd Font;
}
## 径向渐变（Radial Gradient）
html {
  background: radial-gradient(circle, green, yellow, red);
  font-size: 20px;
}
# 设置文本格式（居中，左对齐，右对齐，两侧对齐）
body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
# 灵活写CSS类
为某个容器设置类名，这个容器就能使用统一的格式，比如图片容器类名为 image-container，然后类里可以定义用于该容器的各个元素的样式。比如该容器图片的样式，该容器中文本的样式等等等等。
# 更换字体