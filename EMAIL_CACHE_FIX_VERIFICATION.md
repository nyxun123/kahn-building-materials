# 邮箱缓存问题修复验证指南

## ✅ 当前状态

- **源代码邮箱**: ✅ 正确 (`karnstarch@gmail.com`)
- **最新部署**: ✅ 成功 (https://cef7bdf4.kn-wallpaperglue.pages.dev)
- **生产环境**: ⚠️ 需要清除缓存验证

## 🔍 问题原因

翻译文件在构建时被打包到 JavaScript 中，旧的 JavaScript 文件可能被浏览器缓存了。

## 🛠️ 解决方案

### 方案一：隐身模式验证（最快）

1. **Chrome 隐身窗口**
   - Windows/Linux: `Ctrl + Shift + N`
   - Mac: `Cmd + Shift + N`

2. **访问最新部署**
   ```
   https://cef7bdf4.kn-wallpaperglue.pages.dev/zh
   ```

3. **检查底部邮箱**
   - 应该显示：`karnstarch@gmail.com`

### 方案二：强制清除缓存（推荐）

#### Chrome 浏览器

1. **打开开发者工具**
   - Windows/Linux: `F12` 或 `Ctrl + Shift + I`
   - Mac: `Cmd + Option + I`

2. **右键刷新按钮**
   - 选择"清空缓存并硬性重新加载"
   - 或者按 `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)

3. **完全清除（如果上述方法无效）**
   ```
   1. 打开开发者工具 (F12)
   2. 切换到 "Application" (应用) 标签
   3. 展开左侧 "Storage" (存储)
   4. 点击 "Clear site data" (清除网站数据)
   5. 确认清除
   6. 关闭开发者工具
   7. 刷新页面 (F5)
   ```

#### Firefox 浏览器

1. **强制刷新**
   - Windows/Linux: `Ctrl + F5` 或 `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **完全清除**
   ```
   1. 打开开发者工具 (F12)
   2. 右键刷新按钮
   3. 选择"强制刷新"
   ```

#### Safari 浏览器

1. **清除缓存**
   ```
   1. Safari > 偏好设置 > 高级
   2. 勾选"在菜单栏中显示开发菜单"
   3. 开发 > 清空缓存
   4. 刷新页面 (Cmd + R)
   ```

### 方案三：生产环境部署

如果测试环境确认邮箱正确，将代码推送到生产环境：

```bash
git add -A
git commit -m "fix: 更新联系邮箱为 karnstarch@gmail.com"
git push origin main
```

## 📋 验证清单

- [ ] 在隐身模式下访问最新部署 URL
- [ ] 确认底部联系信息显示 `karnstarch@gmail.com`
- [ ] 清除浏览器缓存后刷新生产环境
- [ ] 确认生产环境邮箱已更新
- [ ] 在不同浏览器中验证（Chrome、Firefox、Safari）
- [ ] 在手机浏览器中验证

## 🔗 相关链接

- **最新部署**: https://cef7bdf4.kn-wallpaperglue.pages.dev/zh
- **生产环境**: https://kn-wallpaperglue.pages.dev/zh
- **Cloudflare Dashboard**: https://dash.cloudflare.com

## 🆘 如果仍然显示错误邮箱

请尝试以下步骤：

1. **完全关闭浏览器**后重新打开
2. **使用不同的浏览器**测试
3. **使用手机浏览器**测试
4. **等待 5-10 分钟**（Cloudflare CDN 缓存更新）

## 📝 技术说明

翻译文件的内容在构建时被打包到 JavaScript 文件中：
- 文件位置：`src/locales/zh/common.json`
- 构建后：打包到 `dist/js/*` 文件中
- 缓存位置：浏览器本地存储 + Service Worker + CDN

当前正确的邮箱配置：
```json
{
  "footer": {
    "contact_info": {
      "email": "karnstarch@gmail.com"
    }
  }
}
```
