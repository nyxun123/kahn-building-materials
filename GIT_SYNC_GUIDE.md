# 🔄 Git 同步指南 - 本地到 GitHub

## 📊 当前状态总结

```
本地分支:     main
远程分支:     origin/main
本地领先:     11 个提交
未推送提交:   11 个
未提交修改:   20 个文件
未追踪文件:   61 个
```

---

## 🎯 同步步骤

### 步骤 1: 查看本地修改状态

```bash
cd /Users/nll/Documents/可以用的网站
git status
```

**预期输出**:
- 20 个已修改文件
- 61 个未追踪文件

---

### 步骤 2: 选择性提交修改

#### 选项 A: 提交所有修改 (推荐)

```bash
# 查看所有修改
git status

# 添加所有修改
git add .

# 提交修改
git commit -m "feat: Complete JWT auth, media library, audit logging, and R2 upload fixes

- Add JWT authentication system with AuthManager
- Implement media library management
- Add audit logging system
- Add data validation library
- Fix R2 image upload bug in create-admin.js
- Improve error handling and CORS configuration
- Add comprehensive documentation and tests"
```

#### 选项 B: 分步提交 (更细致)

```bash
# 1. 提交核心 API 修复
git add functions/api/admin/create-admin.js
git add functions/api/admin/login.js
git add functions/api/admin/products.js
git commit -m "fix: Fix R2 upload and improve admin APIs"

# 2. 提交新增库文件
git add functions/lib/api-response.js
git add functions/lib/logger.js
git add functions/lib/validation.js
git commit -m "feat: Add core libraries (API response, logging, validation)"

# 3. 提交新增 API 端点
git add functions/api/admin/audit-logs.js
git add functions/api/admin/dashboard/
git commit -m "feat: Add audit logging and dashboard endpoints"

# 4. 提交前端修改
git add src/
git commit -m "fix: Update frontend API integration and JWT handling"

# 5. 提交测试和文档
git add public/test-data-sync.html
git add verify-r2-fix.mjs
git add openapi.yaml
git commit -m "test: Add data sync tests and API documentation"

# 6. 提交其他文件
git add .
git commit -m "docs: Add comprehensive documentation and guides"
```

---

### 步骤 3: 验证本地提交

```bash
# 查看本地未推送的提交
git log origin/main..HEAD --oneline

# 预期输出: 应该看到 11 个本地提交 + 新提交
```

---

### 步骤 4: 推送到 GitHub

```bash
# 推送到远程
git push origin main

# 验证推送成功
git log origin/main --oneline -5
```

**预期结果**:
- 本地和远程同步
- 11 个未推送提交已推送
- 新提交也已推送

---

## 📋 提交前检查清单

### 检查 1: 确认修改内容

```bash
# 查看所有修改
git diff --stat

# 查看具体修改
git diff functions/api/admin/create-admin.js
```

### 检查 2: 确认新增文件

```bash
# 查看所有未追踪文件
git status --short | grep "^??"

# 确认这些文件应该被提交
```

### 检查 3: 排除不需要的文件

```bash
# 不应该提交的文件:
# - .wrangler/state/v3/d1/...sqlite (数据库文件)
# - .gemini-clipboard/ (临时文件)

# 添加到 .gitignore
echo ".wrangler/state/" >> .gitignore
echo ".gemini-clipboard/" >> .gitignore

git add .gitignore
git commit -m "chore: Update .gitignore to exclude temporary files"
```

---

## 🚀 快速同步命令

### 一键同步 (所有修改)

```bash
cd /Users/nll/Documents/可以用的网站

# 1. 添加所有修改
git add .

# 2. 提交
git commit -m "feat: Complete JWT auth, media library, audit logging, and R2 upload fixes"

# 3. 推送
git push origin main

# 4. 验证
git log origin/main --oneline -5
```

### 验证同步成功

```bash
# 检查本地和远程是否同步
git status

# 预期输出: "Your branch is up to date with 'origin/main'."
```

---

## ⚠️ 注意事项

### 1. 数据库文件

```bash
# 不要提交本地数据库文件
git restore --staged .wrangler/state/v3/d1/

# 或添加到 .gitignore
echo ".wrangler/state/v3/d1/" >> .gitignore
```

### 2. 临时文件

```bash
# 不要提交临时文件
git restore --staged .gemini-clipboard/

# 或添加到 .gitignore
echo ".gemini-clipboard/" >> .gitignore
```

### 3. 敏感信息

```bash
# 确保没有提交敏感信息
# - API 密钥
# - 数据库密码
# - 个人信息

git diff --cached | grep -i "secret\|password\|key"
```

---

## 🔍 推送后验证

### 验证 1: 检查 GitHub

访问 GitHub 仓库:
```
https://github.com/nyxun123/kahn-building-materials
```

确认:
- ✅ 新提交已显示
- ✅ 分支已更新
- ✅ 文件已上传

### 验证 2: 本地检查

```bash
# 检查本地和远程是否同步
git status

# 预期: "Your branch is up to date with 'origin/main'."

# 检查最新提交
git log --oneline -5

# 检查远程最新提交
git log origin/main --oneline -5

# 两者应该相同
```

### 验证 3: 拉取验证

```bash
# 在另一个目录克隆仓库
cd /tmp
git clone git@github.com:nyxun123/kahn-building-materials.git test-clone

# 检查文件是否存在
ls test-clone/functions/lib/api-response.js
ls test-clone/functions/api/admin/audit-logs.js

# 应该都存在
```

---

## 📝 提交信息模板

### 好的提交信息

```
feat: Add JWT authentication and media library management

- Implement JWT token generation and verification
- Add AuthManager for token storage and refresh
- Create media library management system
- Add audit logging for admin actions
- Fix R2 image upload bug in create-admin.js
- Improve error handling and CORS configuration

Fixes: #123, #124
```

### 不好的提交信息

```
❌ "update files"
❌ "fix bug"
❌ "changes"
```

---

## 🆘 常见问题

### Q1: 推送被拒绝

**错误信息**:
```
! [rejected] main -> main (fetch first)
```

**解决方案**:
```bash
# 先拉取远程更新
git pull origin main

# 解决冲突（如果有）
# 然后重新推送
git push origin main
```

### Q2: 提交包含不想要的文件

**解决方案**:
```bash
# 撤销提交（保留修改）
git reset --soft HEAD~1

# 移除不想要的文件
git restore --staged unwanted-file.js

# 重新提交
git commit -m "new message"
```

### Q3: 推送后发现错误

**解决方案**:
```bash
# 查看最新提交
git log --oneline -1

# 修改最新提交
git add .
git commit --amend -m "corrected message"

# 强制推送（谨慎使用）
git push origin main --force-with-lease
```

---

## ✅ 同步完成检查

推送完成后，确认:

- [ ] 本地修改已提交
- [ ] 11 个未推送提交已推送
- [ ] GitHub 仓库已更新
- [ ] 新文件已上传
- [ ] 本地和远程同步

---

## 📞 需要帮助?

如果遇到问题:

1. 查看 Git 状态: `git status`
2. 查看提交历史: `git log --oneline -10`
3. 查看差异: `git diff origin/main`
4. 查看远程状态: `git remote -v`

---

**准备好同步了吗？** 🚀

执行以下命令开始同步:

```bash
cd /Users/nll/Documents/可以用的网站
git add .
git commit -m "feat: Complete JWT auth, media library, audit logging, and R2 upload fixes"
git push origin main
```

