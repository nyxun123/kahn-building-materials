# 🔑 Cloudflare API 获取详细指南

**目标**: 获取两个关键信息来实现完全自动化部署

---

## 📋 你需要获取的两个信息

### 1. Cloudflare API Token
这是访问Cloudflare API的密钥，权限是 **Cloudflare Pages:Edit**

### 2. Cloudflare Account ID
这是你的Cloudflare账户唯一标识符

---

## 🎯 详细获取步骤 (图解)

### 第一步: 获取API Token

1. **登录Cloudflare**
   - 打开: https://dash.cloudflare.com
   - 用你的账户登录

2. **进入API Token页面**
   - 点击右上角你的头像
   - 选择 "My Profile"
   - 点击 "API Tokens" 标签页

3. **创建新的Token**
   - 点击 "Create Token" 按钮
   - 点击 "Custom token" (自定义令牌)

4. **配置Token权限**
   ```
   Token name: Auto Deploy Token
   Permissions:
   Account permissions:
   ✅ Cloudflare Pages:Edit

   Account resources:
   ✅ Include All accounts
   ```

5. **创建并复制Token**
   - 点击 "Continue to summary"
   - 确认配置正确
   - 点击 "Create Token"
   - **立即复制显示的Token** (这是关键！)

### 第二步: 获取Account ID

1. **在Dashboard查看**
   - 登录后，页面右侧边栏会显示你的账户信息
   - 找到 "Account ID" 字段
   - 点击复制按钮复制Account ID

2. **Account ID格式**
   - 看起来像: `1234567890abcdef1234567890abcdef`
   - 32位字符，包含数字和字母

---

## 🔧 配置环境变量

获取到这两个信息后，在终端运行：

```bash
# 替换为你实际获取到的值
export CF_API_TOKEN="这里粘贴你的API Token"
export CF_ACCOUNT_ID="这里粘贴你的Account ID"
```

### 保存到配置文件 (永久生效)

```bash
# 检测你的shell类型
echo $SHELL

# 如果是zsh (macOS默认)
echo 'export CF_API_TOKEN="这里粘贴你的API Token"' >> ~/.zshrc
echo 'export CF_ACCOUNT_ID="这里粘贴你的Account ID"' >> ~/.zshrc
source ~/.zshrc

# 如果是bash
echo 'export CF_API_TOKEN="这里粘贴你的API Token"' >> ~/.bash_profile
echo 'export CF_ACCOUNT_ID="这里粘贴你的Account ID"' >> ~/.bash_profile
source ~/.bash_profile
```

---

## ✅ 验证配置

配置完成后，运行验证：

```bash
node scripts/simple-cloudflare-setup.cjs --verify
```

应该看到：
- ✅ 检测到Cloudflare API配置
- ✅ 智能自动部署器配置正确

---

## 🚀 测试自动化

最后测试完全自动化部署：

```bash
node scripts/smart-auto-deployer.cjs --force --reason="测试API配置"
```

---

## 🎯 关键要点

### API Token的重要性
- 这是让脚本能够自动触发Cloudflare Pages构建的密钥
- 权限必须是 **Cloudflare Pages:Edit**
- 只显示一次，要立即复制保存

### Account ID的重要性
- 这是告诉脚本要操作哪个Cloudflare账户
- 每个Cloudflare账户都有唯一的ID
- 在Dashboard右侧边栏很容易找到

### 环境变量的作用
- 让脚本知道如何连接Cloudflare API
- 不用在代码中硬编码敏感信息
- 一次配置，永久使用

---

## 📞 如果遇到问题

### 找不到Account ID
- 在Dashboard右侧边栏查找
- 或者访问 https://dash.cloudflare.com/ 查看

### Token权限问题
- 确保选择了 "Custom token"
- 确保勾选了 "Cloudflare Pages:Edit"
- 确保选择了 "Include All accounts"

### 环境变量不生效
- 重新加载shell配置文件: `source ~/.zshrc`
- 或者重启终端
- 检查是否有拼写错误

---

**🎉 获取这两个信息并配置完成后，你就能拥有真正的Cursor级别自动化部署！**

*现在去Cloudflare获取这两个信息，然后按照指南配置即可。*