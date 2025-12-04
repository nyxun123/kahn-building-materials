# 🤖 使用 Chrome DevTools MCP 更新社交媒体简介

## 🎯 目标
使用 Chrome DevTools MCP 自动化工具更新所有社交媒体平台的简介，添加网站链接。

---

## 📋 Chrome DevTools MCP 工具说明

Chrome DevTools MCP 提供了以下工具来控制浏览器：

### 导航工具
- `list_pages` - 列出打开的页面
- `navigate_page` - 导航到指定 URL
- `new_page` - 创建新页面
- `select_page` - 选择页面
- `wait_for` - 等待页面元素出现

### 交互工具
- `click` - 点击元素
- `fill` - 填写表单字段
- `fill_form` - 批量填写表单
- `press_key` - 按键操作
- `hover` - 悬停元素

### 调试工具
- `take_snapshot` - 获取页面快照（用于查找元素）
- `take_screenshot` - 截图
- `evaluate_script` - 执行 JavaScript

---

## 🚀 自动化更新流程

### 步骤 1：启动浏览器并导航

```javascript
// 1. 列出当前页面
list_pages()

// 2. 导航到 TikTok
navigate_page({
  url: "https://www.tiktok.com/@karn7590326808331",
  timeout: 30000
})

// 3. 等待页面加载
wait_for({
  text: "编辑资料",
  timeout: 10000
})
```

### 步骤 2：获取页面快照并找到编辑按钮

```javascript
// 获取页面快照以查找元素
take_snapshot()

// 从快照中找到"编辑资料"按钮的 uid
// 然后点击它
click({
  uid: "element_uid_from_snapshot"
})
```

### 步骤 3：填写简介内容

```javascript
// 找到简介输入框的 uid（从快照中获取）
fill({
  uid: "bio_textarea_uid",
  value: "🏭 杭州卡恩新型建材\n专业CMS和墙纸胶粉制造商\n📱 +86 13216156841\n🌐 https://kn-wallpaperglue.com"
})

// 如果有网站字段，也填写
fill({
  uid: "website_input_uid",
  value: "https://kn-wallpaperglue.com"
})
```

### 步骤 4：保存更改

```javascript
// 找到保存按钮并点击
click({
  uid: "save_button_uid"
})
```

---

## 📝 各平台更新内容

### 🎵 TikTok

**URL**: https://www.tiktok.com/@karn7590326808331

**简介内容**（80字符限制）：
```
🏭 杭州卡恩新型建材
专业CMS和墙纸胶粉制造商
📱 +86 13216156841
🌐 https://kn-wallpaperglue.com
```

**操作步骤**：
1. 导航到 TikTok 个人资料页面
2. 点击"编辑资料"按钮
3. 找到简介输入框（textarea）
4. 填写简介内容
5. 点击"保存"

---

### 📺 YouTube

**URL**: https://www.youtube.com/channel/UCXV9lwMgf8FaV9BLJG1CoTQ

**简介内容**：
```
Hangzhou Karn New Building Materials Co., Ltd
Professional Carboxymethyl Starch (CMS) & Wallpaper Adhesive Manufacturer

🏭 15 Years Professional Manufacturing Experience
📦 Product Series: 8810/8840/K5/K6/999
🌍 Serving Global Markets: China, Russia, Vietnam, Thailand, Indonesia

📱 Contact:
Phone/WhatsApp/WeChat: +86 13216156841
Email: karnstarch@gmail.com

🌐 Website: https://kn-wallpaperglue.com
```

**网站链接**: https://kn-wallpaperglue.com

**操作步骤**：
1. 导航到 YouTube Studio: https://studio.youtube.com
2. 点击"自定义" → "基本信息"
3. 找到"频道说明"文本区域
4. 填写简介内容
5. 在"链接"部分添加网站链接
6. 点击"发布"

---

### 📸 Instagram

**URL**: https://www.instagram.com/karnwallpaperglue/

**简介内容**（150字符限制）：
```
🏭 杭州卡恩新型建材
专业CMS和墙纸胶粉制造商
📱 +86 13216156841
📧 karnstarch@gmail.com
🌐 kn-wallpaperglue.com
```

**网站链接**: https://kn-wallpaperglue.com

**操作步骤**：
1. 导航到 Instagram 个人资料页面
2. 点击"编辑个人资料"按钮
3. 找到简介输入框（textarea）
4. 填写简介内容
5. 在"网站"字段填写网站链接
6. 点击"提交"

---

### 📘 Facebook

**URL**: https://www.facebook.com/profile.php?id=61565441264146

**简介内容**：
```
杭州卡恩新型建材有限公司
专业羧甲基淀粉（CMS）和墙纸胶粉制造商

🏭 15年专业生产经验
📦 产品系列：8810/8840/K5/K6/999
🌍 服务全球市场

📱 联系方式：
电话/WhatsApp/微信：+86 13216156841
邮箱：karnstarch@gmail.com

🌐 官网：https://kn-wallpaperglue.com
```

**网站链接**: https://kn-wallpaperglue.com

**操作步骤**：
1. 导航到 Facebook 个人资料页面
2. 点击"编辑个人资料"按钮
3. 找到简介输入框
4. 填写简介内容
5. 在"网站"字段添加网站链接
6. 点击"保存"

---

## ⚠️ 重要注意事项

1. **登录验证**：需要手动登录各个平台（安全考虑）
2. **验证码**：如果遇到验证码，需要手动处理
3. **元素定位**：每个平台的界面可能不同，需要根据实际页面调整
4. **字符限制**：注意各平台的字符限制（TikTok: 80, Instagram: 150）
5. **网络延迟**：使用 `wait_for` 等待页面加载完成

---

## 🔧 故障排除

### 如果找不到元素
1. 使用 `take_snapshot` 获取最新页面结构
2. 检查元素的选择器是否正确
3. 使用 `wait_for` 等待元素出现

### 如果页面加载慢
1. 增加 `timeout` 参数
2. 使用 `wait_for` 等待特定文本出现

### 如果登录失败
1. 手动登录后再继续
2. 保存登录状态（浏览器 cookies）

---

## 📞 需要帮助？

如果您在使用 Chrome DevTools MCP 时遇到问题，请告诉我：
1. 哪个平台遇到了问题
2. 具体的错误信息
3. 页面截图（如果有）

---

**最后更新：** 2025-01-13
**网站网址：** https://kn-wallpaperglue.com
















