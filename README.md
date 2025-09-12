# 杭州卡恩新型建材有限公司外贸网站

响应式外贸获客静态网站，专为墙纸胶粉出口业务设计。

## 项目结构

```
karn-website/
├── index.html          # 首页
├── product.html        # 产品页
├── about.html          # 关于我们
├── contact.html        # 联系我们
├── style.css          # 全局样式
├── script.js          # JavaScript功能
└── assets/
    └── img/           # 图片资源
        └── README.md  # 图片使用说明
```

## 功能特点

### 🎨 设计特色
- **绿色主色调**：环保、清新、现代的设计风格
- **响应式布局**：完美适配手机、平板、桌面设备
- **三语切换**：中文、英文、俄文一键切换

### 🌍 多语言支持
- 右上角语言切换按钮
- 自动保存用户语言偏好
- 完整的三语翻译内容

### 📱 响应式设计
- 移动优先设计
- 流畅的动画过渡效果
- 触控友好的交互元素

### 🏢 业务展示
- 产品优势突出展示
- OEM服务能力介绍
- 工厂实力展示
- 出口经验数据化呈现

## 快速开始

### 本地运行

1. 克隆或下载项目文件
2. 直接在浏览器中打开 `index.html`
3. 或使用本地服务器：
   ```bash
   # 使用Python
   python -m http.server 8000
   
   # 使用Node.js
   npx serve .
   ```

### 部署到GitHub Pages

1. 创建GitHub仓库
2. 上传所有文件到仓库
3. 启用GitHub Pages（Settings > Pages > Source: Deploy from a branch > main branch > /root folder）
4. 访问 `https://yourusername.github.io/karn-website`

### 部署到Vercel

1. 将项目推送到GitHub
2. 登录 [Vercel](https://vercel.com)
3. 导入GitHub仓库
4. 一键部署，自动获得HTTPS域名

## 图片替换

按照 `assets/img/README.md` 中的说明，将所有占位图替换为实际图片。

## 联系方式更新

在以下文件中更新实际联系信息：
- `contact.html`：WhatsApp、邮箱、微信二维码
- 所有页面的页脚联系信息

## 自定义修改

### 颜色调整
修改 `style.css` 中的CSS变量：
```css
:root {
    --primary-color: #2d7a2d;    /* 主色调 */
    --secondary-color: #4a9d4a;  /* 次要色调 */
    --text-color: #333;          /* 文字颜色 */
    --bg-color: #fff;            /* 背景颜色 */
}
```

### 内容更新
- 直接在HTML文件中修改文字内容
- 保持 `data-zh`, `data-en`, `data-ru` 属性一致
- 更新图片文件名和路径

### 添加新页面
1. 复制现有HTML文件作为模板
2. 更新页面标题和内容
3. 在导航菜单中添加新链接
4. 确保语言切换脚本支持新内容

## 技术栈

- **HTML5**：语义化标签，SEO友好
- **CSS3**：Flexbox/Grid布局，动画效果
- **JavaScript**：语言切换，表单处理，交互效果
- **响应式设计**：移动优先，媒体查询

## 浏览器兼容

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- 移动端浏览器全支持

## 性能优化

- 图片懒加载
- CSS文件压缩
- 字体优化
- 缓存策略

## 许可证

MIT License - 可自由使用、修改和分发