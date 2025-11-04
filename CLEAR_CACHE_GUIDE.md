# Cloudflare 缓存清理指南

**目标**: 清理 `kn-wallpaperglue.com` 的 CDN 缓存，使新设计的后端管理平台生效

---

## 🚀 快速操作（推荐）

### 方法1: 直接访问缓存清理页面

**一键直达链接**（如果您已登录 Cloudflare）:
```
https://dash.cloudflare.com/6ae5d9a224117ca99a05304e017c43db/cache/purge
```

然后：
1. 点击 **"Purge Everything"** 按钮
2. 在确认对话框中点击 **"Purge Everything"** 确认

---

### 方法2: 手动步骤

1. **访问 Cloudflare Dashboard**
   ```
   https://dash.cloudflare.com
   ```

2. **选择域名**
   - 在域名列表中找到并点击 `kn-wallpaperglue.com`

3. **进入缓存设置**
   - 点击左侧菜单 **"Caching"**（缓存）
   - 点击 **"Configuration"**（配置）标签

4. **清理缓存**
   - 找到 **"Purge Cache"**（清理缓存）部分
   - 点击 **"Purge Everything"**（清理所有内容）按钮
   - 在确认对话框中点击 **"Purge Everything"** 确认

5. **等待生效**
   - 等待 30-60 秒让缓存清理生效

6. **验证**
   - 访问: https://kn-wallpaperglue.com/admin/login
   - 按 `Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac) 强制刷新

---

## 🔧 使用 API 自动清理（需要 API Token）

如果您想使用 API 自动清理，需要：

1. **创建 API Token**
   - 访问: https://dash.cloudflare.com/profile/api-tokens
   - 点击 **"Create Token"**
   - 选择 **"Custom token"**
   - 权限设置：
     - Zone → Cache Purge → Purge
     - Zone → Zone Settings → Read
   - 区域资源：选择 `kn-wallpaperglue.com`
   - 点击 **"Continue to summary"** → **"Create Token"**
   - 复制生成的 API Token

2. **获取 Zone ID**
   - 访问: https://dash.cloudflare.com
   - 选择域名 `kn-wallpaperglue.com`
   - 在右侧边栏的 **"API"** 部分找到 **"Zone ID"**

3. **执行清理命令**
   ```bash
   # 替换 {ZONE_ID} 和 {API_TOKEN}
   curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache" \
     -H "Authorization: Bearer {API_TOKEN}" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
   ```

---

## ✅ 验证清理成功

清理完成后，验证新版本是否生效：

1. **访问管理后台**
   ```
   https://kn-wallpaperglue.com/admin/login
   ```

2. **检查新设计特征**
   - 应该有 Indigo + Purple 渐变色
   - 圆角卡片设计
   - 现代化的UI样式

3. **浏览器控制台验证** (F12)
   ```javascript
   // 检查新组件
   document.body.innerHTML.includes('PageHeader')  // 应该为 true
   
   // 检查新样式
   document.querySelector('.bg-gradient-to-r.from-indigo') !== null  // 应该为 true
   ```

---

## ⚠️ 注意事项

1. **清理后影响**: 网站可能会短暂变慢（1-2分钟），因为 CDN 需要重新缓存内容
2. **浏览器缓存**: 清理 CDN 缓存后，还需要清除浏览器缓存（强制刷新）
3. **多浏览器测试**: 建议在多个浏览器中测试，或使用无痕模式

---

## 📝 当前状态

- ✅ 代码已推送到 GitHub
- ✅ 已创建触发部署提交
- ⏳ 等待 Cloudflare Pages 部署
- ⏳ 等待 CDN 缓存清理

**下一步**: 按照上述步骤清理缓存，然后验证新版本是否生效。



