# 后端安全修复部署检查清单

**项目**: kahn-building-materials (kn-wallpaperglue.com)  
**修复日期**: 2025-10-30  
**部署负责人**: _____________

---

## 📋 部署前检查

### 1. 代码审查 ✅

- [ ] 已审查所有修改的文件
- [ ] 已检查导入路径是否正确
- [ ] 已验证没有语法错误
- [ ] 已确认没有硬编码的敏感信息

**修改的文件**:
- ✅ `functions/lib/password-hash.js` (新建)
- ✅ `functions/lib/jwt-auth.js` (新建)
- ✅ `functions/api/admin/login.js` (重构)
- ✅ `functions/api/admin/create-admin.js` (重构)
- ✅ `functions/api/admin/products.js` (重构)
- ✅ `functions/api/admin/products/[id].js` (重构)
- ✅ `functions/api/admin/migrate-passwords.js` (新建)
- ✅ `functions/api/admin/refresh-token.js` (新建)

---

### 2. 环境变量配置 ⚠️

- [ ] 已在 Cloudflare Pages 设置 `JWT_SECRET`
- [ ] 已验证 `JWT_SECRET` 强度（至少 32 字符）
- [ ] 已确认 D1 数据库绑定正确
- [ ] 已确认 R2 存储绑定正确

**设置步骤**:

1. 登录 Cloudflare Dashboard
2. 进入 Pages 项目: `kahn-building-materials`
3. Settings > Environment variables
4. 添加变量:
   ```
   JWT_SECRET = [生成的强随机密钥]
   ```
5. 应用到 Production 和 Preview 环境

**生成密钥命令**:
```bash
openssl rand -base64 32
```

---

### 3. 数据库备份 ⚠️

- [ ] 已备份 D1 数据库
- [ ] 已验证备份完整性
- [ ] 已记录备份位置和时间

**备份命令**:
```bash
# 导出数据库
wrangler d1 export kaneshuju --output=backup-$(date +%Y%m%d-%H%M%S).sql

# 验证备份
ls -lh backup-*.sql
```

---

### 4. 本地测试 ⚠️

- [ ] 已在本地运行所有测试
- [ ] 已验证登录功能
- [ ] 已验证 JWT 认证
- [ ] 已验证受保护的 API 端点

**测试命令**:
```bash
# 启动本地开发服务器
pnpm run dev

# 运行测试脚本
chmod +x test-backend-security.sh
./test-backend-security.sh
```

---

### 5. 依赖检查 ✅

- [ ] 已确认没有新增外部依赖
- [ ] 已验证所有导入路径正确
- [ ] 已确认使用 Web Crypto API（无需额外依赖）

**依赖说明**:
- ✅ 使用 Web Crypto API（Cloudflare Workers 原生支持）
- ✅ 无需安装额外的 npm 包
- ✅ 所有代码使用标准 JavaScript

---

## 🚀 部署步骤

### 步骤 1: 设置环境变量

```bash
# 1. 生成 JWT 密钥
JWT_SECRET=$(openssl rand -base64 32)
echo "生成的 JWT_SECRET: $JWT_SECRET"

# 2. 在 Cloudflare Dashboard 中设置
# Settings > Environment variables > Add variable
# Name: JWT_SECRET
# Value: [粘贴上面生成的密钥]
```

- [ ] 已完成环境变量设置

---

### 步骤 2: 备份数据库

```bash
# 备份当前数据库
wrangler d1 export kaneshuju --output=backup-before-security-fix-$(date +%Y%m%d).sql
```

- [ ] 已完成数据库备份
- [ ] 备份文件路径: _____________

---

### 步骤 3: 部署代码

```bash
# 部署到 Cloudflare Pages
pnpm run deploy

# 或使用 wrangler
wrangler pages deploy dist --project-name=kahn-building-materials
```

- [ ] 已成功部署
- [ ] 部署 URL: _____________
- [ ] 部署时间: _____________

---

### 步骤 4: 初始化数据库（如果需要）

```bash
# 仅在首次部署或数据库为空时执行
curl -X POST https://kn-wallpaperglue.com/api/admin/create-admin
```

- [ ] 已执行（如果需要）
- [ ] 默认凭据已记录

**默认凭据**:
- Email: `admin@kn-wallpaperglue.com`
- Password: `Admin@123456`

---

### 步骤 5: 迁移密码

```bash
# 1. 检查迁移状态
curl https://kn-wallpaperglue.com/api/admin/migrate-passwords

# 2. 执行迁移
curl -X POST https://kn-wallpaperglue.com/api/admin/migrate-passwords \
  -H "Content-Type: application/json" \
  -d '{"confirm": true}'
```

- [ ] 已检查迁移状态
- [ ] 已执行密码迁移
- [ ] 迁移结果: 成功 ___ 个，失败 ___ 个

---

### 步骤 6: 验证部署

```bash
# 运行测试脚本
./test-backend-security.sh
```

- [ ] 所有测试通过
- [ ] 登录功能正常
- [ ] JWT 认证正常
- [ ] 受保护的 API 正常

---

### 步骤 7: 清理（可选）

```bash
# 删除迁移端点（迁移完成后）
rm functions/api/admin/migrate-passwords.js

# 重新部署
pnpm run deploy
```

- [ ] 已删除迁移端点（可选）
- [ ] 已重新部署（如果删除了迁移端点）

---

## ✅ 部署后验证

### 1. 功能验证

- [ ] 管理员可以正常登录
- [ ] 登录后返回 JWT tokens
- [ ] 可以使用 access token 访问受保护的 API
- [ ] Token 刷新功能正常
- [ ] 产品管理功能正常

### 2. 安全验证

- [ ] 无法使用旧的明文密码登录（如果已迁移）
- [ ] 无法在没有 token 的情况下访问受保护的 API
- [ ] 无效的 token 会被拒绝
- [ ] 过期的 token 会被拒绝
- [ ] Email 格式验证正常工作

### 3. 性能验证

- [ ] 登录响应时间 < 1 秒
- [ ] API 响应时间正常
- [ ] 没有明显的性能下降

### 4. 日志检查

- [ ] 检查 Cloudflare Workers 日志
- [ ] 没有错误或警告
- [ ] 日志记录正常

---

## 🔄 回滚计划

如果部署出现问题，按以下步骤回滚：

### 回滚步骤

1. **回滚代码**:
   ```bash
   # 在 Cloudflare Dashboard 中回滚到上一个部署
   # Pages > Deployments > [选择上一个部署] > Rollback
   ```

2. **恢复数据库**（如果需要）:
   ```bash
   # 从备份恢复
   wrangler d1 execute kaneshuju --file=backup-before-security-fix-YYYYMMDD.sql
   ```

3. **验证回滚**:
   ```bash
   # 测试旧版本是否正常工作
   curl -X POST https://kn-wallpaperglue.com/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"email":"niexianlei0@gmail.com","password":"XIANche041758"}'
   ```

- [ ] 已准备回滚计划
- [ ] 已测试回滚流程（可选）

---

## 📞 联系信息

**技术支持**:
- Email: niexianlei0@gmail.com
- 紧急联系: _____________

**Cloudflare 支持**:
- Dashboard: https://dash.cloudflare.com
- 文档: https://developers.cloudflare.com

---

## 📝 部署记录

**部署信息**:
- 部署日期: _____________
- 部署人员: _____________
- 部署版本: _____________
- 部署状态: [ ] 成功 [ ] 失败 [ ] 回滚

**问题记录**:
- 遇到的问题: _____________
- 解决方案: _____________
- 备注: _____________

---

## 🎯 后续任务

### 立即执行

- [ ] 通知所有管理员密码已更新（如果需要）
- [ ] 更新内部文档
- [ ] 删除迁移端点（可选）

### 本周内

- [ ] 实施 CORS 域名白名单
- [ ] 配置速率限制
- [ ] 添加监控告警

### 本月内

- [ ] 实施账户锁定机制
- [ ] 添加审计日志
- [ ] 进行安全审计

---

**检查清单完成**: [ ] 是 [ ] 否  
**签名**: _____________  
**日期**: _____________

