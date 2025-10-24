# 🚀 立即获取Cloudflare API Token - 在当前页面操作

## 📋 步骤概览
1. 登录Cloudflare Dashboard
2. 进入API Token管理
3. 创建自定义Token
4. 设置正确权限
5. 复制并使用Token

---

## 🔑 详细操作步骤

### 步骤1：登录Cloudflare Dashboard

🌐 **打开这个链接**：
```
https://dash.cloudflare.com
```

1. 使用您的邮箱和密码登录
2. 如果启用了2FA，输入验证码

---

### 步骤2：进入API Token管理

1. **点击右上角头像** 👤
2. **选择 "My Profile"**

```
[您的头像] 👉 My Profile
```

3. **点击 "API Tokens" 标签**

```
Profile 👉 API Tokens
```

---

### 步骤3：创建自定义Token

1. **点击 "Create Token" 按钮**

```
[Create Token] ➡️
```

2. **选择 "Custom token"**

```
[Custom token] [Get started] ➡️
```

---

### 步骤4：配置Token权限

#### 🔧 **Account 权限设置**

**权限1：R2编辑权限**
- **Account**: `Cloudflare R2:Edit`
- **Account Resources**: `All accounts` (或选择包含 `kaen` 存储桶的账户)

**权限2：Pages编辑权限**
- **Account**: `Cloudflare Pages:Edit`
- **Account Resources**: `All accounts`

#### 🌐 **Zone 权限设置（可选但推荐）**

**权限3：域名读取权限**
- **Zone**: `Zone:Read`
- **Zone Resources**: `Include All zones`
- 或者：`Include Specific zone` → `kn-wallpaperglue.com`

#### 📝 **Token详情设置**

- **Token name**: `R2-Domain-Config-2025`
- **TTL**: `Custom` → 选择合适的时间（如1年）

---

### 步骤5：创建并复制Token

1. **点击 "Continue to summary"** ✅
2. **检查权限配置**确认无误
3. **点击 "Create Token"** 🎉

**⚠️ 重要：立即复制Token！**
```
📋 Token格式示例：
xYz123ABCdef456GHI789jkl012mno345pqr678stu901vwx234yzA
```

Token只会显示一次！请立即复制保存。

---

## 🚀 立即使用Token

### 运行配置脚本

复制Token后，立即回到终端运行：

```bash
./setup_r2_interactive.sh
```

当脚本提示时：
```
🔑 请输入您的 Cloudflare API Token:
```

**粘贴您刚刚复制的Token**

```
📧 请输入您的 Cloudflare 邮箱:
```

**输入您的Cloudflare登录邮箱**

---

## ✅ 验证Token权限

正确的Token应该有以下权限：

| 权限类型 | 具体权限 | 状态 |
|---------|---------|------|
| Account | Cloudflare R2:Edit | ✅ 必需 |
| Account | Cloudflare Pages:Edit | ✅ 必需 |
| Zone | Zone:Read | ✅ 推荐 |

---

## 🛠️ 故障排除

### ❌ "Invalid request headers" 错误

**原因**：Token格式错误或权限不足

**解决方法**：
1. 确保完整复制Token（不要有多余空格）
2. 检查Token是否包含必要权限
3. 确认Token未过期

### ❌ "Permission denied" 错误

**原因**：Token缺少必要权限

**解决方法**：
1. 重新创建Token，确保包含所有必需权限
2. 检查账户和资源范围设置

### ❌ "Token not found" 错误

**原因**：Token已失效或删除

**解决方法**：
1. 创建新的Token
2. 使用新Token重新运行脚本

---

## 🎯 Token创建清单

在创建Token前，确认以下项目：

- [ ] 已登录正确的Cloudflare账户
- [ ] 选择 "Custom token" 模板
- [ ] 添加 `Cloudflare R2:Edit` 权限
- [ ] 添加 `Cloudflare Pages:Edit` 权限
- [ ] 设置合适的Token名称
- [ ] 选择合适的TTL（有效期）
- [ ] 立即复制并保存Token

---

## 🚀 现在就开始！

1. **点击这里打开Cloudflare Dashboard**：
   👉 https://dash.cloudflare.com

2. **按照上述步骤操作**

3. **获取Token后立即运行**：
   ```bash
   ./setup_r2_interactive.sh
   ```

**完成配置后，您的文件URL将从：**
```
https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/...
```

**变为：**
```
https://assets.kn-wallpaperglue.com/...
```

---

## 📞 需要帮助？

如果在获取Token过程中遇到问题：
1. 仔细检查每个步骤
2. 确认权限设置正确
3. Token只显示一次，务必及时复制

**准备好Token后，立即运行配置脚本！** 🎉