# 彻底清除浏览器缓存指南

**问题**: 生产域名显示旧邮箱 (2026233975@qq.com)
**原因**: 浏览器 Service Worker 或持久化缓存
**目标**: 清除所有缓存，显示新邮箱 (karnstarch@gmail.com)

---

## 方案 1: Chrome/Edge 彻底清除缓存（推荐）

### 步骤：

1. **打开开发者工具**
   - Windows/Linux: `F12` 或 `Ctrl+Shift+I`
   - Mac: `Cmd+Option+I`

2. **进入 Application 标签**
   - 点击顶部的 "Application" 标签页

3. **清除 Storage**
   - 在左侧找到 "Storage"
   - 点击 "Clear site data"
   - 确保勾选所有选项：
     - ✅ Application cache
     - ✅ Cache storage
     - ✅ Service workers
     - ✅ Local storage
     - ✅ Session storage
     - ✅ IndexedDB
   - 点击 "Clear site data" 按钮

4. **取消注册 Service Worker**
   - 在左侧找到 "Service Workers"
   - 点击每个 Service Worker 旁边的 "Unregister"

5. **强制刷新**
   - Windows/Linux: `Ctrl+Shift+R`
   - Mac: `Cmd+Shift+R`

---

## 方案 2: 使用浏览器设置清除

### Chrome/Edge:

1. 打开设置：`chrome://settings/clearBrowserData`
2. 选择"高级"标签
3. 时间范围：**过去 1 小时**
4. 勾选：
   - ✅ 浏览历史记录
   - ✅ Cookie 和其他网站数据
   - ✅ 缓存的图片和文件
5. 点击"清除数据"
6. 刷新页面

### Firefox:

1. 打开设置：`about:preferences#privacy`
2. 找到"Cookie 和网站数据"
3. 点击"清除数据"
4. 勾选所有选项
5. 点击"清除"

### Safari:

1. 打开偏好设置
2. 选择"隐私"标签
3. 点击"管理网站数据"
4. 搜索 "kn-wallpaperglue.com"
5. 点击"移除"
6. 刷新页面

---

## 方案 3: 无痕模式验证（最快）

1. **打开无痕/隐私窗口**
   - Chrome/Edge: `Ctrl+Shift+N` (Win) 或 `Cmd+Shift+N` (Mac)
   - Firefox: `Ctrl+Shift+P` (Win) 或 `Cmd+Shift+P` (Mac)
   - Safari: `Cmd+Shift+N`

2. **访问网站**
   ```
   https://kn-wallpaperglue.com/zh
   ```

3. **检查 Footer 邮箱**
   - 滚动到页面底部
   - 查看"联系我们"部分
   - 应该显示：**karnstarch@gmail.com** ✅

---

## 方案 4: 访问最新部署 URL（100% 最新版本）

直接访问最新部署（绕过所有缓存）：

```
https://ad8a058f.kn-wallpaperglue.pages.dev/zh
```

这个 URL 是刚才部署的最新版本，**保证**显示正确的邮箱。

---

## 验证成功标准

访问 https://kn-wallpaperglue.com 后，在 Footer 的"联系信息"部分应该看到：

```
📧 karnstarch@gmail.com  ✅
```

如果看到的是：
```
📧 2026233975@qq.com  ❌
```

说明缓存还没清除，请尝试上述其他方案。

---

## 技术说明

### 为什么会有这个问题？

1. **Service Worker 缓存**
   - 网站使用了 PWA 功能
   - Service Worker 缓存了旧的 JavaScript bundle
   - 翻译文件被打包在 JS 中

2. **浏览器持久化缓存**
   - 浏览器的 HTTP 缓存
   - Local Storage 缓存
   - IndexedDB 缓存

3. **解决方案**
   - 清除所有缓存类型
   - 取消注册 Service Worker
   - 强制重新下载所有资源

---

## 快速检查命令（开发者使用）

在浏览器控制台运行：

```javascript
// 检查当前 Service Worker
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations.length);
});

// 清除 Local Storage
localStorage.clear();

// 清除 Session Storage
sessionStorage.clear();
```

---

## 联系支持

如果尝试所有方案后仍然看到旧邮箱，请：

1. 截图当前显示的内容
2. 告诉我您使用的浏览器和版本
3. 告诉我您尝试了哪些方案

我会进一步协助解决。

