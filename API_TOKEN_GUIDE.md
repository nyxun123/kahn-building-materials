# Cloudflare API Token 获取和配置指南

## 🔑 获取Cloudflare API Token

### 步骤1：登录Cloudflare Dashboard
1. 访问：https://dash.cloudflare.com
2. 使用您的账户登录

### 步骤2：创建API Token
1. 在右上角点击您的头像
2. 选择 **"My Profile"**
3. 点击 **"API Tokens"** 标签
4. 点击 **"Create Token"** 按钮

### 步骤3：选择Token模板
1. 向下滚动找到 **"Custom token"**
2. 点击 **"Get started"**

### 步骤4：配置Token权限

#### **Account 权限**
- **Account**: `Cloudflare R2:Edit`
- **Account**: `Cloudflare Pages:Edit`

#### **Zone 权限**（可选但推荐）
- **Zone**: `Zone:Read`
- **Zone Resources**: `Include All zones` 或 `Include Specific zone "kn-wallpaperglue.com"`

#### **Zone 权限**（DNS备用）
- **Zone**: `DNS:Edit`
- **Zone Resources**: `Include All zones` 或 `Include Specific zone "kn-wallpaperglue.com"`

### 步骤5：设置Token详情
1. **Token name**: `R2-Domain-Config-Script`
2. **TTL**: 根据需要设置（建议: Custom）
3. 点击 **"Continue to summary"**

### 步骤6：创建并复制Token
1. 检查权限配置是否正确
2. 点击 **"Create Token"**
3. **立即复制Token**（只会显示一次！）

---

## 🚀 执行配置

现在您有了API Token，执行以下命令：

```bash
# 运行信息获取脚本
./get_cloudflare_info.sh
```

脚本会：
1. 🔑 提示输入您的API Token
2. 📧 提示输入您的Cloudflare邮箱
3. 🔍 自动获取Account ID和Zone ID
4. 📦 验证R2存储桶和Pages项目
5. ✅ 生成配置好的脚本

然后执行：

```bash
# 运行生成的配置脚本
./configure_r2_domain_configured.sh
```

---

## ⚠️ 重要提示

1. **API Token安全**：
   - 不要将Token分享给他人
   - 配置完成后可以删除Token
   - 建议设置较短的过期时间

2. **权限最小化**：
   - 只授予必要的权限
   - 配置完成后可以撤销权限

3. **备份方案**：
   - 如果脚本失败，可以手动按照指南操作
   - 所有步骤都有详细的回滚方案

---

## 🔧 故障排除

### Token权限不足
如果提示权限不足，请检查：
- ✅ R2:Edit 权限
- ✅ Pages:Edit 权限
- ✅ 账户访问权限

### 找不到域名/项目
请确认：
- ✅ 域名 `kn-wallpaperglue.com` 在此账户中
- ✅ R2存储桶 `kaen` 存在
- ✅ Pages项目 `kahn-building-materials` 存在

### 网络问题
如果命令执行失败：
- ✅ 检查网络连接
- ✅ 尝试使用代理或VPN
- ✅ 确认Cloudflare服务正常

---

## 📞 需要帮助？

如果在获取Token或执行过程中遇到问题：
1. 检查上述故障排除步骤
2. 确认每一步都准确完成
3. 提供具体的错误信息

**准备好后，请运行 `./get_cloudflare_info.sh` 开始配置！** 🎉