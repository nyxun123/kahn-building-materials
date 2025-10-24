# R2自定义域名配置完整指南

## 🎯 目标
将Cloudflare R2存储桶的自定义域名从默认的 `pub-b9f0c2c358074609bf8701513c879957.r2.dev` 更改为 `assets.kn-wallpaperglue.com`，解决用户"真正服务器"观感问题。

## 📋 当前状态确认
- ✅ 拥有域名：`kn-wallpaperglue.com`
- ✅ 域名已托管在Cloudflare
- ✅ R2存储桶：`kaen`
- ✅ Pages项目：`kahn-building-materials`
- ✅ 当前R2 URL：`https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/...`
- 🎯 目标R2 URL：`https://assets.kn-wallpaperglue.com/...`

---

## 📝 详细配置步骤

### 步骤1：在R2存储桶中连接自定义域名

1. **登录Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com
   - 使用您的Cloudflare账户登录

2. **进入R2存储桶**
   - 左侧菜单点击 **R2**
   - 点击存储桶 `kaen` 进入设置

3. **配置自定义域名**
   - 点击 **Settings** 标签
   - 找到 **Custom Domains** 卡片
   - 点击 **Connect Domain**
   - 输入：`assets.kn-wallpaperglue.com`
   - 点击 **Continue**
   - 状态将显示为 "Initializing"

### 步骤2：创建CNAME DNS记录

1. **自动跳转到DNS设置**
   - 完成步骤1后，R2界面会显示提示信息
   - 点击蓝色按钮 **Go to DNS**

2. **验证DNS记录配置**
   - **Type**: `CNAME`
   - **Name**: `assets`
   - **Target**: `pub-b9f0c2c358074609bf8701513c879957.r2.dev`
   - **Proxy status**: **Proxied (橙色云朵图标)** ⚠️ 必须启用

3. **保存记录**
   - 点击 **Save** 按钮

### 步骤3：验证域名激活

1. **返回R2存储桶设置**
   - 回到 `kaen` 存储桶的 **Settings** 标签
   - 查看 **Custom Domains** 卡片
   - 状态应从 "Initializing" 变为 **Active**
   - 这可能需要1-2分钟，请刷新页面

### 步骤4：配置Pages项目环境变量

1. **进入Pages项目设置**
   - 左侧菜单点击 **Workers & Pages**
   - 选择项目 `kahn-building-materials`
   - 点击 **Settings** 标签
   - 点击 **Environment variables**

2. **添加生产环境变量**
   - 在 "Production environment variables" 部分
   - 点击 **Add variable**
   - **Variable name**: `R2_PUBLIC_DOMAIN`
   - **Value**: `https://assets.kn-wallpaperglue.com`
   - 点击 **Save**

### 步骤5：重新部署项目（关键步骤）

⚠️ **重要**：环境变量只在构建过程中应用，必须重新部署才能生效！

1. **触发重新部署**
   - 点击 **Deployments** 标签
   - 找到最新的部署记录
   - 点击 **Re-deploy** 按钮
   - 等待部署完成

### 步骤6：验证配置效果

1. **直接访问测试**
   - 找到R2存储桶中的一个现有文件（如图片）
   - 在浏览器中访问：`https://assets.kn-wallpaperglue.com/文件名`
   - ✅ 预期结果：文件正常加载，显示HTTPS安全锁

2. **网站集成测试**
   - 打开网站：https://kn-wallpaperglue.com
   - 按F12打开开发者工具 → Network标签
   - 刷新页面
   - 检查图片和其他资源的URL
   - ✅ 预期结果：所有资源URL都显示为 `https://assets.kn-wallpaperglue.com`

---

## 🔧 故障排除

### 问题1：域名状态一直是 "Initializing"
**解决方案**：
- 检查DNS记录是否正确保存
- 确认CNAME记录的Target值正确
- 等待DNS传播（最多5分钟）
- 刷新R2存储桶设置页面

### 问题2：网站资源仍然显示旧域名
**解决方案**：
- 确认已完成步骤5（重新部署）
- 检查环境变量名称是否正确：`R2_PUBLIC_DOMAIN`
- 清除浏览器缓存并刷新页面
- 检查浏览器开发者工具中的网络请求

### 问题3：HTTPS不工作
**解决方案**：
- 确认CNAME记录的代理状态为橙色云朵（Proxied）
- 检查域名的SSL/TLS设置
- 在Cloudflare的SSL/TLS设置中确认模式为 "Full (Strict)"

---

## ✅ 配置完成后的效果

**配置前**：
```
https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/home/videos/xxx.mp4
```

**配置后**：
```
https://assets.kn-wallpaperglue.com/home/videos/xxx.mp4
```

这样用户看到的文件URL就是自己的域名，完全解决了"云端存储"的观感问题！

---

## 📞 需要帮助？

如果在配置过程中遇到任何问题，请：
1. 检查上述故障排除步骤
2. 确认每一步都准确完成
3. 提供具体的错误信息或截图

**配置完成后，后端管理平台的文件上传将显示真正的"服务器"域名！** 🎉