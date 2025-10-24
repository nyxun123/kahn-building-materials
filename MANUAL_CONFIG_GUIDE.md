# 🔧 R2自定义域名手动配置指南

## 🎯 当前状态

基于API Token验证结果：

✅ **已验证的信息：**
- API Token有效
- 账户ID: `6ae5d9a224117ca99a05304e017c43db`
- Zone ID: `74d964441adbdd8383cfb77c1a2707bc`
- R2存储桶: `kaen` ✅ 存在
- Pages项目: `kahn-building-materials` ✅ 存在

⚠️ **需要手动配置：**
- DNS CNAME记录创建
- Pages环境变量更新
- 重新部署

---

## 🚀 手动配置步骤

### 步骤1：启用R2存储桶公共访问

1. **登录Cloudflare Dashboard**: https://dash.cloudflare.com
2. **进入R2管理**：
   - 左侧菜单 → R2
   - 点击存储桶 `kaen`
3. **启用公共访问**：
   - 点击 **Settings** 标签
   - 找到 **Public access** 部分
   - 点击 **Allow Access**
4. **记录公共URL**：
   - 启用后你会看到公共URL格式：`https://kaen.6ae5d9a224117ca99a05304e017c43db.r2.cloudflarestorage.com`

### 步骤2：创建DNS CNAME记录

1. **进入DNS管理**：
   - 左侧菜单 → DNS
   - 选择域名 `kn-wallpaperglue.com`

2. **添加CNAME记录**：
   - 点击 **Add record**
   - 填写以下信息：
     ```
     Type: CNAME
     Name: assets
     Target: kaen.6ae5d9a224117ca99a05304e017c43db.r2.cloudflarestorage.com
     Proxy status: Proxied (橙色云朵) ⚠️ 必须启用
     TTL: Auto
     ```

3. **保存记录**：
   - 点击 **Save**

### 步骤3：更新Pages环境变量

1. **进入Pages项目**：
   - 左侧菜单 → Workers & Pages
   - 选择项目 `kahn-building-materials`

2. **更新环境变量**：
   - 点击 **Settings** 标签
   - 找到 **Environment variables**
   - 在 **Production** 部分：
     - 点击 **Add variable**
     - **Variable name**: `R2_PUBLIC_DOMAIN`
     - **Value**: `https://assets.kn-wallpaperglue.com`
     - 点击 **Save**

### 步骤4：触发重新部署

1. **进入部署管理**：
   - 点击 **Deployments** 标签

2. **触发新部署**：
   - 找到最新部署记录
   - 点击 **Re-deploy** 按钮
   - 等待部署完成

---

## 🔍 验证配置

### 方法1：检查DNS记录
```bash
dig +short CNAME assets.kn-wallpaperglue.com
```
**期望结果**：`kaen.6ae5d9a224117ca99a05304e017c43db.r2.cloudflarestorage.com.`

### 方法2：检查HTTP状态
```bash
curl -I https://assets.kn-wallpaperglue.com
```
**期望结果**：HTTP 200 或 404（404是正常的，表示域名连接成功但文件不存在）

### 方法3：测试文件上传
```bash
curl -s "https://kahn-building-materials.pages.dev/api/upload-file" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-token" \
  -d '{
    "fileData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
    "fileName": "test-manual.png",
    "folder": "manual-test"
  }' | jq '.data.original'
```
**期望结果**：`https://assets.kn-wallpaperglue.com/manual-test/images/xxx.png`

---

## 📋 配置前后对比

### 配置前
```
https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/home/videos/demo.mp4
```

### 配置后
```
https://assets.kn-wallpaperglue.com/home/videos/demo.mp4
```

---

## 🛠️ 故障排除

### 问题1：DNS记录不生效
**解决方案**：
- 检查CNAME记录是否正确保存
- 等待DNS传播（通常5-15分钟）
- 使用 `dig` 命令验证

### 问题2：HTTP访问失败
**解决方案**：
- 确认CNAME记录已启用代理（橙色云朵）
- 检查SSL证书状态
- 等待证书签发完成

### 问题3：文件URL仍显示旧域名
**解决方案**：
- 确认Pages环境变量已更新
- 触发重新部署
- 清除浏览器缓存

---

## 🎉 完成后效果

配置完成后，后端管理平台的文件上传将显示为您的自定义域名：

- ✅ 文件URL：`https://assets.kn-wallpaperglue.com/...`
- ✅ HTTPS自动配置
- ✅ CDN加速
- ✅ 专业的域名展示

**这将完全解决用户"真正服务器"的观感问题！** 🎯

---

## 📞 需要帮助？

如果在手动配置过程中遇到问题：
1. 仔细检查每一步的输入
2. 确认使用了正确的账户和项目
3. 联系Cloudflare支持

**配置完成后，请验证所有功能是否正常工作！**