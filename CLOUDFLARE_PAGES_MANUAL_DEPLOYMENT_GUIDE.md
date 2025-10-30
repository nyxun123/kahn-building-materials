# Cloudflare Pages 手动部署详细教程
# Cloudflare Pages Manual Deployment Tutorial

**适用人群 / Target Audience**: 初学者 / Beginners  
**预计时间 / Estimated Time**: 5-10 分钟 / 5-10 minutes  
**难度 / Difficulty**: ⭐ 简单 / Easy

---

## 📋 目录 / Table of Contents

1. [准备工作 / Prerequisites](#准备工作--prerequisites)
2. [步骤 1: 登录 Cloudflare](#步骤-1-登录-cloudflare--step-1-login-to-cloudflare)
3. [步骤 2: 进入 Pages 项目](#步骤-2-进入-pages-项目--step-2-access-pages-project)
4. [步骤 3: 查看部署列表](#步骤-3-查看部署列表--step-3-view-deployments)
5. [步骤 4: 手动触发部署](#步骤-4-手动触发部署--step-4-trigger-manual-deployment)
6. [步骤 5: 等待部署完成](#步骤-5-等待部署完成--step-5-wait-for-deployment)
7. [步骤 6: 验证部署成功](#步骤-6-验证部署成功--step-6-verify-deployment)
8. [常见问题 / FAQ](#常见问题--faq)

---

## 准备工作 / Prerequisites

### 你需要准备的信息 / Information You Need

- ✅ Cloudflare 账号邮箱 / Cloudflare account email
- ✅ Cloudflare 账号密码 / Cloudflare account password
- ✅ 项目名称 / Project name: `kahn-building-materials`
- ✅ 域名 / Domain: `kn-wallpaperglue.com`

### 可选：启用两步验证 / Optional: Two-Factor Authentication

如果你的账号启用了两步验证，需要准备：
If your account has 2FA enabled, you'll need:

- 📱 手机验证码 / Mobile verification code
- 🔑 或验证器应用（如 Google Authenticator）/ Or authenticator app (e.g., Google Authenticator)

---

## 步骤 1: 登录 Cloudflare / Step 1: Login to Cloudflare

### 1.1 打开 Cloudflare 登录页面 / Open Cloudflare Login Page

**中文说明**:
1. 打开浏览器（推荐使用 Chrome、Edge 或 Firefox）
2. 在地址栏输入: `https://dash.cloudflare.com`
3. 按回车键 (Enter)

**English Instructions**:
1. Open your browser (Chrome, Edge, or Firefox recommended)
2. Type in the address bar: `https://dash.cloudflare.com`
3. Press Enter

### 1.2 输入登录信息 / Enter Login Credentials

**中文说明**:
1. 在 "Email" 输入框中输入你的 Cloudflare 账号邮箱
2. 在 "Password" 输入框中输入你的密码
3. 点击蓝色的 "Log in" 按钮

**English Instructions**:
1. Enter your Cloudflare account email in the "Email" field
2. Enter your password in the "Password" field
3. Click the blue "Log in" button

**页面示例 / Page Example**:
```
┌─────────────────────────────────────┐
│  Cloudflare                         │
│                                     │
│  Email:    [________________]       │
│  Password: [________________]       │
│                                     │
│  [ Log in ]                         │
└─────────────────────────────────────┘
```

### 1.3 完成两步验证（如果需要）/ Complete 2FA (If Required)

**中文说明**:
- 如果启用了两步验证，输入手机收到的验证码或验证器应用中的代码
- 点击 "Verify" 或 "确认" 按钮

**English Instructions**:
- If 2FA is enabled, enter the verification code from your phone or authenticator app
- Click "Verify" or "Confirm" button

---

## 步骤 2: 进入 Pages 项目 / Step 2: Access Pages Project

### 2.1 找到左侧导航栏 / Locate Left Sidebar

**中文说明**:
登录成功后，你会看到 Cloudflare 的控制台首页。在页面左侧有一个导航栏。

**English Instructions**:
After logging in, you'll see the Cloudflare dashboard. There's a navigation bar on the left side.

### 2.2 点击 "Workers & Pages" / Click "Workers & Pages"

**中文说明**:
1. 在左侧导航栏中，找到 "Workers & Pages" 选项
2. 点击它（可能需要向下滚动才能看到）

**English Instructions**:
1. In the left sidebar, find "Workers & Pages"
2. Click on it (you may need to scroll down to see it)

**导航栏示例 / Sidebar Example**:
```
┌─────────────────────┐
│ ☰ Cloudflare        │
├─────────────────────┤
│ 🏠 Home             │
│ 🌐 Websites         │
│ 📊 Analytics        │
│ 🔒 Security         │
│ ⚡ Workers & Pages  │ ← 点击这里 / Click here
│ 📧 Email            │
│ ...                 │
└─────────────────────┘
```

### 2.3 选择 "Pages" 标签 / Select "Pages" Tab

**中文说明**:
1. 在 "Workers & Pages" 页面顶部，你会看到两个标签: "Workers" 和 "Pages"
2. 点击 "Pages" 标签

**English Instructions**:
1. At the top of the "Workers & Pages" page, you'll see two tabs: "Workers" and "Pages"
2. Click the "Pages" tab

**标签示例 / Tab Example**:
```
┌─────────────────────────────────────┐
│  Workers  |  Pages  ← 点击这里       │
└─────────────────────────────────────┘
```

### 2.4 找到你的项目 / Find Your Project

**中文说明**:
1. 在 Pages 列表中，找到项目名称: `kahn-building-materials`
2. 点击项目名称进入项目详情页

**English Instructions**:
1. In the Pages list, find the project: `kahn-building-materials`
2. Click the project name to enter the project details page

**项目列表示例 / Project List Example**:
```
┌─────────────────────────────────────────────┐
│  Your Pages Projects                        │
├─────────────────────────────────────────────┤
│  📄 kahn-building-materials  ← 点击这里      │
│     kn-wallpaperglue.com                    │
│     Production: main                        │
└─────────────────────────────────────────────┘
```

---

## 步骤 3: 查看部署列表 / Step 3: View Deployments

### 3.1 进入 Deployments 页面 / Access Deployments Page

**中文说明**:
1. 进入项目后，你会看到项目的概览页面
2. 在页面顶部，找到 "Deployments" 标签
3. 点击 "Deployments" 标签

**English Instructions**:
1. After entering the project, you'll see the project overview page
2. At the top of the page, find the "Deployments" tab
3. Click the "Deployments" tab

**标签栏示例 / Tab Bar Example**:
```
┌─────────────────────────────────────────────┐
│  Overview | Deployments | Settings | ...    │
│             ↑ 点击这里 / Click here          │
└─────────────────────────────────────────────┘
```

### 3.2 查看部署历史 / View Deployment History

**中文说明**:
在 Deployments 页面，你会看到所有的部署记录，包括：
- **Commit SHA**: Git 提交的唯一标识符（如 `27d72de`）
- **Branch**: 分支名称（如 `main`）
- **Status**: 部署状态（Success 成功 / Failed 失败 / In Progress 进行中）
- **Deployed**: 部署时间

**English Instructions**:
On the Deployments page, you'll see all deployment records, including:
- **Commit SHA**: Unique Git commit identifier (e.g., `27d72de`)
- **Branch**: Branch name (e.g., `main`)
- **Status**: Deployment status (Success / Failed / In Progress)
- **Deployed**: Deployment time

**部署列表示例 / Deployment List Example**:
```
┌──────────────────────────────────────────────────────────┐
│  Deployments                                             │
├──────────────────────────────────────────────────────────┤
│  Commit      Branch  Status    Deployed                  │
├──────────────────────────────────────────────────────────┤
│  95d07f9    main    ✅ Success  2 hours ago              │
│  3fed368    main    ✅ Success  1 day ago                │
│  06155b0    main    ✅ Success  2 days ago               │
└──────────────────────────────────────────────────────────┘
```

### 3.3 检查最新部署的 Commit / Check Latest Deployment Commit

**中文说明**:
1. 查看列表最顶部的部署记录
2. 检查 Commit SHA 是否是 `27d72de`
3. 如果不是，说明最新的代码还没有部署

**English Instructions**:
1. Look at the top deployment record in the list
2. Check if the Commit SHA is `27d72de`
3. If not, it means the latest code hasn't been deployed yet

**重要提示 / Important Note**:
- ✅ 如果 Commit 是 `27d72de`，说明已经部署了最新代码
- ❌ 如果 Commit 不是 `27d72de`，需要继续下一步手动触发部署

---

## 步骤 4: 手动触发部署 / Step 4: Trigger Manual Deployment

### 方法 1: 重新部署现有 Commit / Method 1: Retry Existing Deployment

**中文说明**:
1. 在部署列表中，找到 Commit `27d72de` 的记录（如果存在）
2. 点击该记录右侧的 "..." 三个点按钮
3. 在弹出菜单中选择 "Retry deployment" 或 "重新部署"
4. 确认操作

**English Instructions**:
1. In the deployment list, find the record with Commit `27d72de` (if it exists)
2. Click the "..." three-dot button on the right side of that record
3. In the popup menu, select "Retry deployment"
4. Confirm the action

**操作示例 / Action Example**:
```
┌──────────────────────────────────────────────┐
│  27d72de  main  ✅ Success  ...  ← 点击这里   │
│                                              │
│  弹出菜单 / Popup Menu:                       │
│  ┌────────────────────────┐                 │
│  │ View deployment        │                 │
│  │ Retry deployment  ← 选择│                 │
│  │ Delete deployment      │                 │
│  └────────────────────────┘                 │
└──────────────────────────────────────────────┘
```

### 方法 2: 创建新部署 / Method 2: Create New Deployment

**如果找不到 Commit `27d72de` 的记录，使用这个方法**  
**Use this method if you can't find the Commit `27d72de` record**

**中文说明**:
1. 在 Deployments 页面顶部，找到 "Create deployment" 按钮
2. 点击 "Create deployment" 按钮
3. 在弹出的对话框中：
   - **Branch**: 选择 `main`
   - **Commit**: 留空（会自动使用最新的 commit）
4. 点击 "Save and Deploy" 或 "保存并部署" 按钮

**English Instructions**:
1. At the top of the Deployments page, find the "Create deployment" button
2. Click the "Create deployment" button
3. In the popup dialog:
   - **Branch**: Select `main`
   - **Commit**: Leave empty (will automatically use the latest commit)
4. Click "Save and Deploy" button

**创建部署对话框示例 / Create Deployment Dialog Example**:
```
┌─────────────────────────────────────────┐
│  Create a new deployment                │
├─────────────────────────────────────────┤
│  Branch:  [main ▼]                      │
│  Commit:  [Leave empty for latest]     │
│                                         │
│  [ Cancel ]  [ Save and Deploy ]        │
└─────────────────────────────────────────┘
```

### 方法 3: 通过 Git Push 触发（推荐）/ Method 3: Trigger via Git Push (Recommended)

**这个方法不需要在 Cloudflare 控制台操作**  
**This method doesn't require Cloudflare console operations**

**中文说明**:
1. 打开终端或命令行
2. 进入项目目录
3. 执行以下命令:
   ```bash
   git commit --allow-empty -m "trigger deployment"
   git push origin main
   ```
4. Cloudflare Pages 会自动检测到新的 push 并触发部署

**English Instructions**:
1. Open terminal or command line
2. Navigate to project directory
3. Run the following commands:
   ```bash
   git commit --allow-empty -m "trigger deployment"
   git push origin main
   ```
4. Cloudflare Pages will automatically detect the new push and trigger deployment

---

## 步骤 5: 等待部署完成 / Step 5: Wait for Deployment

### 5.1 观察部署进度 / Monitor Deployment Progress

**中文说明**:
1. 触发部署后，页面会自动刷新
2. 你会看到一个新的部署记录，状态显示为 "In Progress" 或 "Building"
3. 部署过程通常需要 2-5 分钟

**English Instructions**:
1. After triggering deployment, the page will auto-refresh
2. You'll see a new deployment record with status "In Progress" or "Building"
3. Deployment usually takes 2-5 minutes

**部署进行中示例 / Deployment In Progress Example**:
```
┌──────────────────────────────────────────────────────────┐
│  Deployments                                             │
├──────────────────────────────────────────────────────────┤
│  Commit      Branch  Status           Deployed           │
├──────────────────────────────────────────────────────────┤
│  27d72de    main    🔄 In Progress   Just now            │
│  95d07f9    main    ✅ Success       2 hours ago         │
└──────────────────────────────────────────────────────────┘
```

### 5.2 查看部署日志（可选）/ View Deployment Logs (Optional)

**中文说明**:
1. 点击正在部署的记录
2. 你会看到详细的构建日志
3. 可以实时查看部署进度

**English Instructions**:
1. Click on the deploying record
2. You'll see detailed build logs
3. You can monitor deployment progress in real-time

### 5.3 等待状态变为 Success / Wait for Status to Change to Success

**中文说明**:
- ✅ 如果状态变为 "Success"（绿色勾号），说明部署成功
- ❌ 如果状态变为 "Failed"（红色叉号），说明部署失败，需要查看错误日志

**English Instructions**:
- ✅ If status changes to "Success" (green checkmark), deployment succeeded
- ❌ If status changes to "Failed" (red X), deployment failed, check error logs

**部署成功示例 / Deployment Success Example**:
```
┌──────────────────────────────────────────────────────────┐
│  Deployments                                             │
├──────────────────────────────────────────────────────────┤
│  Commit      Branch  Status           Deployed           │
├──────────────────────────────────────────────────────────┤
│  27d72de    main    ✅ Success       Just now            │
│  95d07f9    main    ✅ Success       2 hours ago         │
└──────────────────────────────────────────────────────────┘
```

---

## 步骤 6: 验证部署成功 / Step 6: Verify Deployment

### 6.1 检查 Commit SHA / Check Commit SHA

**中文说明**:
1. 确认最新部署的 Commit SHA 是 `27d72de`
2. 确认状态是 "Success"

**English Instructions**:
1. Confirm the latest deployment Commit SHA is `27d72de`
2. Confirm the status is "Success"

### 6.2 测试登录 API / Test Login API

**中文说明**:
打开终端或命令行，执行以下命令测试登录 API:

**English Instructions**:
Open terminal or command line, run the following command to test login API:

```bash
curl -X POST "https://kn-wallpaperglue.com/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kn-wallpaperglue.com","password":"admin123"}'
```

**预期响应 / Expected Response**:
```json
{
  "success": true,
  "user": { ... },
  "accessToken": "eyJ...",  ← 应该有这个字段 / Should have this field
  "refreshToken": "eyJ...", ← 应该有这个字段 / Should have this field
  "authType": "JWT",        ← 应该是 JWT 而不是 D1_DATABASE
  "expiresIn": 900
}
```

**如果没有终端，可以使用在线工具 / If you don't have terminal, use online tools**:
- 访问 / Visit: https://reqbin.com/
- 选择 POST 方法 / Select POST method
- 输入 URL 和请求体 / Enter URL and request body

### 6.3 访问网站测试 / Test Website Access

**中文说明**:
1. 打开浏览器
2. 访问: https://kn-wallpaperglue.com/admin/login
3. 使用账号密码登录
4. 检查仪表板数据是否正常显示

**English Instructions**:
1. Open browser
2. Visit: https://kn-wallpaperglue.com/admin/login
3. Login with your credentials
4. Check if dashboard data displays correctly

---

## 常见问题 / FAQ

### Q1: 找不到 "Workers & Pages" 选项 / Can't Find "Workers & Pages"

**中文答案**:
- 确保你登录的是正确的 Cloudflare 账号
- 尝试刷新页面
- 检查左侧导航栏是否折叠，点击展开按钮

**English Answer**:
- Make sure you're logged into the correct Cloudflare account
- Try refreshing the page
- Check if the left sidebar is collapsed, click the expand button

### Q2: 找不到项目 `kahn-building-materials` / Can't Find Project `kahn-building-materials`

**中文答案**:
- 确认你在 "Pages" 标签而不是 "Workers" 标签
- 检查账号权限，确保你有访问该项目的权限
- 联系项目管理员添加你的访问权限

**English Answer**:
- Confirm you're on the "Pages" tab, not "Workers" tab
- Check account permissions, ensure you have access to the project
- Contact project admin to add your access permissions

### Q3: 部署失败怎么办？/ What If Deployment Fails?

**中文答案**:
1. 点击失败的部署记录
2. 查看错误日志，找到具体的错误信息
3. 常见错误:
   - 构建命令错误: 检查 `package.json` 中的 build 脚本
   - 依赖安装失败: 检查 `package.json` 中的依赖版本
   - 环境变量缺失: 在 Settings → Environment variables 中添加

**English Answer**:
1. Click on the failed deployment record
2. View error logs to find specific error messages
3. Common errors:
   - Build command error: Check build script in `package.json`
   - Dependency installation failed: Check dependency versions in `package.json`
   - Missing environment variables: Add in Settings → Environment variables

### Q4: 部署成功但网站没有更新 / Deployment Succeeded But Website Not Updated

**中文答案**:
1. 清除浏览器缓存: Ctrl+Shift+R (Windows) 或 Cmd+Shift+R (Mac)
2. 等待 1-2 分钟让 CDN 缓存刷新
3. 尝试使用无痕模式访问网站
4. 清除 Cloudflare 缓存:
   - 进入域名设置
   - Caching → Configuration
   - 点击 "Purge Everything"

**English Answer**:
1. Clear browser cache: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Wait 1-2 minutes for CDN cache to refresh
3. Try accessing the website in incognito mode
4. Purge Cloudflare cache:
   - Go to domain settings
   - Caching → Configuration
   - Click "Purge Everything"

### Q5: 如何回滚到之前的版本？/ How to Rollback to Previous Version?

**中文答案**:
1. 在 Deployments 列表中找到之前成功的部署
2. 点击右侧的 "..." 按钮
3. 选择 "Rollback to this deployment" 或 "回滚到此部署"
4. 确认操作

**English Answer**:
1. Find a previous successful deployment in the Deployments list
2. Click the "..." button on the right
3. Select "Rollback to this deployment"
4. Confirm the action

---

## 📞 需要帮助？/ Need Help?

### 联系方式 / Contact

如果遇到问题，可以:
If you encounter issues, you can:

1. **查看 Cloudflare 文档 / Check Cloudflare Docs**:
   - https://developers.cloudflare.com/pages/

2. **Cloudflare 社区论坛 / Cloudflare Community Forum**:
   - https://community.cloudflare.com/

3. **提供以下信息以便诊断 / Provide the following info for diagnosis**:
   - 部署失败的错误日志截图 / Screenshot of deployment error logs
   - Commit SHA
   - 部署时间 / Deployment time
   - 浏览器控制台错误信息 / Browser console error messages

---

## ✅ 完成检查清单 / Completion Checklist

部署完成后，请确认以下内容:
After deployment, please confirm:

- [ ] 最新部署的 Commit SHA 是 `27d72de`
- [ ] 部署状态显示为 "Success"
- [ ] 登录 API 返回 `accessToken` 和 `refreshToken`
- [ ] 网站可以正常访问
- [ ] 仪表板数据正常显示
- [ ] 产品详情页正常显示

---

**教程版本 / Tutorial Version**: 1.0  
**最后更新 / Last Updated**: 2025-10-30  
**适用于 / Applicable to**: Cloudflare Pages (2024-2025)

