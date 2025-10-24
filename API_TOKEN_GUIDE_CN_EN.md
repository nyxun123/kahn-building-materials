# 🔑 Cloudflare API Token 获取指南 (中英文对照)
# Cloudflare API Token Acquisition Guide (Chinese-English)

## 🌐 语言切换 / Language Switch

**切换语言 / Switch Language:**
- 在右上角找到语言切换选项 / Find language switch option in top-right corner
- 点击选择 "简体中文" / Click to select "Simplified Chinese"

---

## 🚀 开始创建Token / Start Creating Token

### 步骤1：登录Cloudflare / Step 1: Login to Cloudflare

**中文 / Chinese:**
```
1. 访问: https://dash.cloudflare.com
2. 输入邮箱和密码登录
3. 如启用2FA，输入验证码
```

**English:**
```
1. Visit: https://dash.cloudflare.com
2. Enter email and password to login
3. If 2FA enabled, enter verification code
```

---

### 步骤2：进入个人资料 / Step 2: Go to Profile

**中文 / Chinese:**
```
👤 点击右上角头像 → 选择 "My Profile" / 个人资料
📑 点击 "API Tokens" 标签 / API 令牌
```

**English:**
```
👤 Click profile picture in top-right → Select "My Profile"
📑 Click "API Tokens" tab
```

---

### 步骤3：创建自定义Token / Step 3: Create Custom Token

**中文 / Chinese:**
```
🔘 点击 "Create Token" / 创建令牌
📝 选择 "Custom token" / 自定义令牌
✅ 点击 "Get started" / 开始使用
```

**English:**
```
🔘 Click "Create Token"
📝 Select "Custom token"
✅ Click "Get started"
```

---

## ⚙️ 权限配置 / Permissions Configuration

### 🔧 Account 权限 / Account Permissions

**中文 / Chinese:**
```
权限1 / Permission 1:
- 账户 / Account: Cloudflare R2:Edit / 云flare R2:编辑
- 账户资源 / Account Resources: 所有账户 / All accounts

权限2 / Permission 2:
- 账户 / Account: Cloudflare Pages:Edit / 云flare页面:编辑
- 账户资源 / Account Resources: 所有账户 / All accounts
```

**English:**
```
Permission 1:
- Account: Cloudflare R2:Edit
- Account Resources: All accounts

Permission 2:
- Account: Cloudflare Pages:Edit
- Account Resources: All accounts
```

### 🌐 Zone 权限 / Zone Permissions (推荐/Recommended)

**中文 / Chinese:**
```
权限3 / Permission 3:
- 区域 / Zone: Zone:Read / 区域:读取
- 区域资源 / Zone Resources: 包含所有区域 / Include All zones
- 或 / Or: 包含特定区域 / Include Specific zone → kn-wallpaperglue.com
```

**English:**
```
Permission 3:
- Zone: Zone:Read
- Zone Resources: Include All zones
- Or: Include Specific zone → kn-wallpaperglue.com
```

### 📝 Token 详情 / Token Details

**中文 / Chinese:**
```
- 令牌名称 / Token name: R2-Domain-Config-2025
- 生存时间 / TTL: 自定义 / Custom → 选择合适时间 / Choose appropriate time
```

**English:**
```
- Token name: R2-Domain-Config-2025
- TTL: Custom → Choose appropriate time
```

---

## ✅ 创建Token / Create Token

**中文 / Chinese:**
```
1. 点击 "Continue to summary" / 继续摘要
2. 检查权限配置 / Check permissions
3. 点击 "Create Token" / 创建令牌
⚠️ 立即复制Token！/ Copy Token immediately!
```

**English:**
```
1. Click "Continue to summary"
2. Check permission configuration
3. Click "Create Token"
⚠️ Copy Token immediately!
```

---

## 🚀 使用Token / Use Token

### 运行配置脚本 / Run Configuration Script

**中文 / Chinese:**
```bash
./setup_r2_interactive.sh
```

**English:**
```bash
./setup_r2_interactive.sh
```

### 输入信息 / Enter Information

**中文 / Chinese:**
```
🔑 请输入您的 Cloudflare API Token:
📧 请输入您的 Cloudflare 邮箱:
```

**English:**
```
🔑 Please enter your Cloudflare API Token:
📧 Please enter your Cloudflare email:
```

---

## 🔍 权限对照表 / Permission Reference Table

| 中文权限 / Chinese Permission | 英文权限 / English Permission | 必需 / Required |
|----------------------------|----------------------------|----------------|
| 云flare R2:编辑 / Cloudflare R2:Edit | Cloudflare R2:Edit | ✅ 是 / Yes |
| 云flare页面:编辑 / Cloudflare Pages:Edit | Cloudflare Pages:Edit | ✅ 是 / Yes |
| 区域:读取 / Zone:Read | Zone:Read | ⭕ 推荐 / Recommended |

---

## 🛠️ 故障排除 / Troubleshooting

### 常见错误 / Common Errors

**中文 / Chinese:**

**错误1 / Error 1: "Invalid request headers"**
- 原因 / Cause: Token格式错误或权限不足 / Token format error or insufficient permissions
- 解决 / Solution: 完整复制Token，检查权限设置 / Copy complete token, check permissions

**错误2 / Error 2: "Permission denied"**
- 原因 / Cause: Token缺少必要权限 / Token missing required permissions
- 解决 / Solution: 重新创建Token，确保包含所有权限 / Recreate token with all permissions

**English:**

**Error 1: "Invalid request headers"**
- Cause: Token format error or insufficient permissions
- Solution: Copy complete token, check permissions

**Error 2: "Permission denied"**
- Cause: Token missing required permissions
- Solution: Recreate token with all permissions

---

## 📋 操作清单 / Checklist

### Token创建前 / Before Creating Token

**中文 / Chinese:**
- [ ] 登录正确的Cloudflare账户 / Login to correct Cloudflare account
- [ ] 选择自定义令牌模板 / Select custom token template
- [ ] 添加R2编辑权限 / Add R2 edit permission
- [ ] 添加Pages编辑权限 / Add Pages edit permission
- [ ] 设置合适的令牌名称 / Set appropriate token name
- [ ] 选择合适的生存时间 / Choose appropriate TTL
- [ ] 立即复制并保存令牌 / Copy and save token immediately

**English:**
- [ ] Login to correct Cloudflare account
- [ ] Select custom token template
- [ ] Add R2 edit permission
- [ ] Add Pages edit permission
- [ ] Set appropriate token name
- [ ] Choose appropriate TTL
- [ ] Copy and save token immediately

---

## 🎯 快速操作流程 / Quick Workflow

### 中文流程 / Chinese Workflow

```
🌐 打开: https://dash.cloudflare.com
👤 点击头像 → 个人资料
📑 API令牌 → 创建令牌
📝 自定义令牌 → 开始使用
⚙️ 设置权限 (R2:Edit, Pages:Edit)
📝 输入名称: R2-Domain-Config-2025
✅ 创建令牌 → 复制Token
🚀 运行: ./setup_r2_interactive.sh
```

### English Workflow

```
🌐 Open: https://dash.cloudflare.com
👤 Click avatar → My Profile
📑 API Tokens → Create Token
📝 Custom token → Get started
⚙️ Set permissions (R2:Edit, Pages:Edit)
📝 Enter name: R2-Domain-Config-2025
✅ Create Token → Copy Token
🚀 Run: ./setup_r2_interactive.sh
```

---

## 📞 需要帮助？/ Need Help?

**中文 / Chinese:**
- 检查每个步骤是否正确 / Check each step carefully
- 确认权限设置完整 / Confirm complete permission settings
- Token只显示一次，务必及时复制 / Token shows only once, copy immediately

**English:**
- Check each step carefully
- Confirm complete permission settings
- Token shows only once, copy immediately

---

## 🎉 配置效果 / Configuration Results

**配置前 / Before Configuration:**
```
中文: https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/...
English: https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/...
```

**配置后 / After Configuration:**
```
中文: https://assets.kn-wallpaperglue.com/...
English: https://assets.kn-wallpaperglue.com/...
```

---

**立即开始获取Token！/ Start getting your Token now!** 🚀

**准备好Token后，立即运行配置脚本！/ Once you have the Token, run the configuration script immediately!**