# 🔧 Cloudflare API 配置指南

**目标**: 实现像Cursor一样完全自动化的部署，无需任何手动干预

---

## 🎯 配置目标

配置完成后，你将拥有：
- ✅ **完全自动化部署**: 修改代码后自动推送到GitHub并触发Cloudflare Pages构建
- ✅ **API智能触发**: 无需手动在Dashboard触发构建
- ✅ **智能等待**: 自动等待构建完成并验证结果
- ✅ **详细报告**: 每次部署都生成完整报告

---

## 📋 获取Cloudflare API凭证

### 步骤1: 创建API Token

1. **登录Cloudflare Dashboard**
   - 访问: https://dash.cloudflare.com
   - 登录你的Cloudflare账户

2. **进入API Token管理**
   - 点击右上角用户头像
   - 选择 "My Profile"
   - 点击 "API Tokens" 标签页

3. **创建自定义Token**
   - 点击 "Create Token"
   - 选择 "Custom token" 自定义令牌

4. **配置Token权限**
   ```
   Token name: Auto Deploy Token
   Account permissions:
   ✅ Cloudflare Pages:Edit
   ✅ Account Settings:Read

   Zone permissions (可选):
   ✅ Zone:Read
   ✅ Zone Settings:Read

   Account resources:
   ✅ Include All accounts

   Zone resources (可选):
   ✅ Include All zones
   ```

5. **创建并复制Token**
   - 点击 "Continue to summary"
   - 确认配置无误
   - 点击 "Create Token"
   - **立即复制Token** (只显示一次)

### 步骤2: 获取Account ID

1. **在Cloudflare Dashboard右侧边栏查看**
   - 登录后右侧边栏显示 "Account ID"
   - 点击复制

2. **或者在API页面查看**
   - 在 "My Profile" → "API Tokens" 页面
   - 右侧会显示Account ID

---

## 🚀 配置方法

### 方法1: 环境变量 (推荐)

```bash
# 在终端中设置
export CF_API_TOKEN="your-api-token-here"
export CF_ACCOUNT_ID="your-account-id-here"

# 添加到shell配置文件 (~/.zshrc 或 ~/.bash_profile)
echo 'export CF_API_TOKEN="your-api-token-here"' >> ~/.zshrc
echo 'export CF_ACCOUNT_ID="your-account-id-here"' >> ~/.zshrc
source ~/.zshrc
```

### 方法2: 配置文件 (更安全)

1. **创建配置目录**
   ```bash
   mkdir -p ~/.cloudflare
   ```

2. **创建API Token文件**
   ```bash
   echo "your-api-token-here" > ~/.cloudflare/api-token
   chmod 600 ~/.cloudflare/api-token
   ```

3. **创建Account ID文件**
   ```bash
   echo "your-account-id-here" > ~/.cloudflare/account-id
   chmod 600 ~/.cloudflare/account-id
   ```

### 方法3: 项目级配置

```bash
# 在项目根目录创建
echo "your-api-token-here" > .cf-token
echo "your-account-id-here" > .cf-account-id

# 添加到.gitignore (重要!)
echo ".cf-token" >> .gitignore
echo ".cf-account-id" >> .gitignore
```

---

## 🔍 验证配置

### 测试API连接

```bash
# 测试API Token是否有效
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer your-api-token-here" \
  -H "Content-Type: application/json"
```

### 测试自动部署器

```bash
# 运行智能自动部署器
node scripts/smart-auto-deployer.cjs --force --reason="测试API配置"
```

如果配置成功，你应该看到：
```
✅ Cloudflare Pages构建触发成功
✅ 部署ID: xxxxxxxx
✅ 部署URL: https://xxxxxxxx.kahn-building-materials.pages.dev
```

---

## 🛡️ 安全注意事项

### Token安全

1. **不要提交到版本控制**
   - 确保API Token文件在 `.gitignore` 中
   - 不要在代码中硬编码Token

2. **定期轮换Token**
   - 建议每3-6个月更换一次API Token
   - 及时撤销不需要的Token

3. **最小权限原则**
   - 只授予必要的权限
   - 不要使用全局Token

### 文件权限

```bash
# 设置正确的文件权限
chmod 600 ~/.cloudflare/api-token
chmod 600 ~/.cloudflare/account-id
chmod 600 .cf-token
chmod 600 .cf-account-id
```

---

## 🎯 配置完成后的效果

### 完全自动化流程

配置完成后，每次运行智能部署器：

```bash
node scripts/smart-auto-deployer.cjs
```

将自动执行：

1. ✅ **智能检测变更**
2. ✅ **自动提交推送**
3. ✅ **API触发构建** ← 无需手动操作
4. ✅ **智能等待完成**
5. ✅ **自动验证结果**
6. ✅ **生成详细报告**

### 与Cursor同级别自动化

- **零手动干预**: 从代码修改到生产部署全程自动
- **智能等待**: 自动检测部署完成，无需人工检查
- **智能验证**: 自动验证SEO优化是否生效
- **详细报告**: 每次部署都有完整的执行记录

---

## 🔧 故障排除

### 常见错误

1. **Token无效**
   ```
   ❌ API请求失败: 403 Forbidden
   ```
   **解决**: 检查Token是否正确，权限是否足够

2. **Account ID错误**
   ```
   ❌ 解析响应失败: Unexpected token <
   ```
   **解决**: 检查Account ID是否正确

3. **项目名称错误**
   ```
   ❌ Cloudflare Pages构建触发失败
   ```
   **解决**: 确认项目名称是 `kahn-building-materials`

### 调试模式

启用详细日志：
```bash
DEBUG=1 node scripts/smart-auto-deployer.cjs --force
```

---

## 📚 参考资源

- [Cloudflare API文档](https://developers.cloudflare.com/api/)
- [Cloudflare Pages API](https://developers.cloudflare.com/api/operations/pages-deployment-create-deployment)
- [API Token最佳实践](https://developers.cloudflare.com/fundamentals/api/get-started/tokens/)

---

## ✅ 配置检查清单

- [ ] 获取Cloudflare API Token
- [ ] 获取Account ID
- [ ] 配置环境变量或配置文件
- [ ] 设置正确的文件权限
- [ ] 添加到.gitignore (如果使用文件方式)
- [ ] 测试API连接
- [ ] 验证自动部署器工作
- [ ] 确认SEO优化自动生效

---

**🎉 配置完成后，你将拥有与Cursor同级别的完全自动化部署系统！**

*现在开始配置，几分钟内就能实现真正的零干预自动部署。*