# Cloudflare 缓存清理指南

## 🚨 紧急问题

**当前状态**：
- ✅ 新代码已部署到Cloudflare Pages
- ✅ Pages预览域名正常：https://6622cb5c.kn-wallpaperglue.pages.dev/en/products
- ❌ 主域名仍显示旧版本：https://kn-wallpaperglue.com/en/products

**原因**：主域名的CDN缓存未清理，仍在提供旧版本的静态文件。

---

## 📋 清理步骤

### 方法1：通过Cloudflare Dashboard（推荐）

#### 步骤1：登录Cloudflare
1. 访问 https://dash.cloudflare.com
2. 使用您的Cloudflare账号登录

#### 步骤2：选择域名
1. 在域名列表中找到并点击 `kn-wallpaperglue.com`

#### 步骤3：清理缓存
1. 在左侧菜单中点击 **"Caching"**（缓存）
2. 点击 **"Configuration"**（配置）标签
3. 找到 **"Purge Cache"**（清理缓存）部分
4. 点击 **"Purge Everything"**（清理所有内容）按钮
5. 在确认对话框中点击 **"Purge Everything"** 确认

⚠️ **重要**：清理缓存后，网站可能会短暂变慢（1-2分钟），因为CDN需要重新缓存内容。

---

### 方法2：使用Cloudflare API

如果您有API Token，可以使用以下命令：

```bash
# 需要替换以下变量：
# - ZONE_ID: 您的域名Zone ID
# - API_TOKEN: 您的Cloudflare API Token

curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer {API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

#### 获取Zone ID
1. 登录Cloudflare Dashboard
2. 选择域名 `kn-wallpaperglue.com`
3. 在右侧边栏的 **"API"** 部分找到 **"Zone ID"**

#### 创建API Token
1. 点击右上角的用户图标
2. 选择 **"My Profile"**
3. 点击 **"API Tokens"**
4. 点击 **"Create Token"**
5. 选择 **"Edit zone DNS"** 模板或自定义权限
6. 确保包含 **"Cache Purge"** 权限

---

### 方法3：清理特定文件（精确控制）

如果只想清理特定文件而不是全部缓存：

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer {API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
    "files": [
      "https://kn-wallpaperglue.com/en/products",
      "https://kn-wallpaperglue.com/zh/products",
      "https://kn-wallpaperglue.com/ru/products",
      "https://kn-wallpaperglue.com/js/index-DM5o1RP3.js",
      "https://kn-wallpaperglue.com/js/products-Cq_RMe4Z.js"
    ]
  }'
```

---

## ✅ 验证缓存已清理

### 1. 检查HTTP响应头

```bash
curl -I https://kn-wallpaperglue.com/en/products
```

查找以下响应头：
- `CF-Cache-Status: MISS` 或 `DYNAMIC` - 表示未命中缓存（好）
- `CF-Cache-Status: HIT` - 表示命中缓存（如果刚清理完，这是旧缓存）

### 2. 检查加载的JavaScript文件

```bash
curl -s https://kn-wallpaperglue.com/en/products | grep -o 'index-[^"]*\.js' | head -1
```

**期望输出**：`index-B5a4vY9y.js`（新版本）
**错误输出**：`index-DM5o1RP3.js`（旧版本）

### 3. 浏览器验证

1. 打开隐身/无痕模式
2. 访问 https://kn-wallpaperglue.com/en/products
3. 打开开发者工具（F12）
4. 查看Console控制台，应该看到：
   ```
   🔍 正在获取产品数据...
   📡 API响应状态: 200
   📦 API返回数据: {success: true, data: Array(6), ...}
   ✅ 成功获取 6 个产品
   ```
5. 查看Network面板，确认加载的是 `index-B5a4vY9y.js`
6. 页面应该显示6个产品卡片

---

## 🔧 如果清理后仍有问题

### 问题1：浏览器仍显示旧版本

**解决方案**：
1. 清理浏览器缓存：
   - Chrome/Edge: `Ctrl + Shift + Delete`
   - Firefox: `Ctrl + Shift + Delete`
   - Safari: `Cmd + Option + E`
2. 或使用隐身/无痕模式
3. 或强制刷新：`Ctrl + Shift + R`（Mac: `Cmd + Shift + R`）

### 问题2：Cloudflare Pages和主域名不同步

**可能原因**：
- Pages部署和自定义域名使用不同的缓存策略
- 自定义域名可能有额外的缓存规则

**解决方案**：
1. 检查Cloudflare Pages设置中的自定义域名配置
2. 确认DNS记录正确指向Pages项目
3. 检查是否有Page Rules影响缓存

### 问题3：部分文件更新，部分未更新

**解决方案**：
1. 使用 "Purge Everything" 而不是选择性清理
2. 等待2-3分钟让清理操作完全生效
3. 检查是否有Service Worker缓存（在浏览器开发者工具中）

---

## 📊 当前部署状态

| 环境 | URL | 状态 | 加载的JS文件 |
|------|-----|------|-------------|
| Pages预览 | https://6622cb5c.kn-wallpaperglue.pages.dev | ✅ 正常 | index-B5a4vY9y.js |
| 主域名 | https://kn-wallpaperglue.com | ❌ 旧版本 | index-DM5o1RP3.js |

**目标**：主域名也加载 `index-B5a4vY9y.js`

---

## 🎯 完整验证清单

清理缓存后，请逐项检查：

- [ ] 执行了 "Purge Everything"
- [ ] 等待2-3分钟
- [ ] 使用隐身模式访问主域名
- [ ] 控制台显示调试日志（🔍 📡 📦 ✅）
- [ ] Network面板显示 `index-B5a4vY9y.js`
- [ ] 页面显示6个产品（不是loading状态）
- [ ] 没有无限循环的API请求
- [ ] 搜索功能正常
- [ ] 刷新按钮正常
- [ ] 三种语言（中文/英文/俄文）都正常

---

## 📞 需要帮助？

如果按照以上步骤仍无法解决，请提供：

1. **Cloudflare缓存清理截图**：显示"Purge Everything"操作成功
2. **浏览器控制台截图**：显示Console和Network面板
3. **curl命令输出**：
   ```bash
   curl -I https://kn-wallpaperglue.com/en/products
   curl -s https://kn-wallpaperglue.com/en/products | grep -o 'index-[^"]*\.js'
   ```
4. **访问时间**：清理缓存后多久访问的

---

**最后更新**：2025-10-29 16:45
**部署ID**：6622cb5c
**新版本文件**：index-B5a4vY9y.js

