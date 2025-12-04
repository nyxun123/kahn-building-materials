# Chrome DevTools MCP 社交媒体更新步骤

## 🎯 目标
使用 Chrome DevTools MCP 工具自动化更新社交媒体简介

## 📋 需要使用的 MCP 工具

由于 Chrome DevTools MCP 工具可能需要在 MCP 客户端中直接调用，以下是详细的操作步骤：

### 平台 1: TikTok

**步骤：**
1. `navigate_page({ url: "https://www.tiktok.com/@karn7590326808331" })`
2. `wait_for({ text: "编辑资料" })`
3. `take_snapshot()` - 获取页面结构
4. `click({ uid: "edit_button_uid" })` - 点击编辑按钮
5. `fill({ uid: "bio_textarea_uid", value: "🏭 杭州卡恩新型建材\n专业CMS和墙纸胶粉制造商\n📱 +86 13216156841\n🌐 https://kn-wallpaperglue.com" })`
6. `click({ uid: "save_button_uid" })` - 保存

### 平台 2: YouTube

**步骤：**
1. `navigate_page({ url: "https://studio.youtube.com" })`
2. `wait_for({ text: "自定义" })`
3. `click({ uid: "customize_button_uid" })`
4. `click({ uid: "basic_info_tab_uid" })`
5. `fill({ uid: "description_textarea_uid", value: "Hangzhou Karn New Building Materials Co., Ltd\nProfessional Carboxymethyl Starch (CMS) & Wallpaper Adhesive Manufacturer\n\n🏭 15 Years Professional Manufacturing Experience\n📦 Product Series: 8810/8840/K5/K6/999\n🌍 Serving Global Markets\n\n📱 Contact:\nPhone/WhatsApp/WeChat: +86 13216156841\nEmail: karnstarch@gmail.com\n\n🌐 Website: https://kn-wallpaperglue.com" })`
6. `fill({ uid: "website_input_uid", value: "https://kn-wallpaperglue.com" })`
7. `click({ uid: "publish_button_uid" })`

### 平台 3: Instagram

**步骤：**
1. `navigate_page({ url: "https://www.instagram.com/karnwallpaperglue/" })`
2. `wait_for({ text: "编辑个人资料" })`
3. `click({ uid: "edit_profile_button_uid" })`
4. `fill({ uid: "bio_textarea_uid", value: "🏭 杭州卡恩新型建材\n专业CMS和墙纸胶粉制造商\n📱 +86 13216156841\n📧 karnstarch@gmail.com\n🌐 kn-wallpaperglue.com" })`
5. `fill({ uid: "website_input_uid", value: "https://kn-wallpaperglue.com" })`
6. `click({ uid: "submit_button_uid" })`

### 平台 4: Facebook

**步骤：**
1. `navigate_page({ url: "https://www.facebook.com/profile.php?id=61565441264146" })`
2. `wait_for({ text: "编辑个人资料" })`
3. `click({ uid: "edit_profile_button_uid" })`
4. `fill({ uid: "bio_textarea_uid", value: "杭州卡恩新型建材有限公司\n专业羧甲基淀粉（CMS）和墙纸胶粉制造商\n\n🏭 15年专业生产经验\n📦 产品系列：8810/8840/K5/K6/999\n🌍 服务全球市场\n\n📱 联系方式：\n电话/WhatsApp/微信：+86 13216156841\n邮箱：karnstarch@gmail.com\n\n🌐 官网：https://kn-wallpaperglue.com" })`
5. `fill({ uid: "website_input_uid", value: "https://kn-wallpaperglue.com" })`
6. `click({ uid: "save_button_uid" })`

---

## ⚠️ 重要提示

1. **需要手动登录**：由于安全考虑，需要先手动登录各个平台
2. **元素 UID**：`uid` 参数需要从 `take_snapshot()` 的结果中获取
3. **等待加载**：使用 `wait_for()` 确保页面元素已加载
4. **验证码**：如果遇到验证码，需要手动处理

---

## 🔍 如何获取元素 UID

1. 使用 `take_snapshot()` 获取页面快照
2. 在快照中查找目标元素的 `uid` 属性
3. 使用该 `uid` 进行 `click()` 或 `fill()` 操作

---

**注意**：如果 Chrome DevTools MCP 工具不可用，请参考 `CHROME_MCP_SOCIAL_UPDATE_GUIDE.md` 获取详细的手动操作指南。
















