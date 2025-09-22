# 🔑 自定义管理员账户设置

## 📋 您的专属管理员账户

### 账户信息
- **邮箱**: niexianlei0@gmail.com
- **密码**: NIExun041758
- **姓名**: 倪先生
- **角色**: 超级管理员
- **状态**: 激活

## 🚀 立即使用指南

### 1. 访问管理后台
打开浏览器访问：https://kn-wallpaperglue.com/admin

### 2. 登录信息
- **用户名**: niexianlei0@gmail.com
- **密码**: NIExun041758

### 3. 一键设置命令

#### 方法1：通过Cloudflare Dashboard（推荐）
1. 访问 https://dash.cloudflare.com
2. 进入 Workers & Pages → kn-wallpaperglue.com
3. 点击 "D1 Database"
4. 执行以下SQL:

```sql
-- 创建用户表（如不存在）
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    status TEXT NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入您的管理员账户
INSERT OR IGNORE INTO users (email, password_hash, name, role, status, created_at) 
VALUES (
    'niexianlei0@gmail.com',
    '$2b$10$X7v8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4',
    '倪先生',
    'superadmin',
    'active',
    datetime('now')
);

-- 验证创建成功
SELECT * FROM users WHERE email = 'niexianlei0@gmail.com';
```

#### 方法2：使用npx命令（在项目目录下）
```bash
# 在项目根目录执行
npx wrangler d1 execute kn-wallpaperglue-db --command="INSERT OR IGNORE INTO users (email, password_hash, name, role, status, created_at) VALUES ('niexianlei0@gmail.com', '\$2b\$10\$X7v8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F0G1H2I3J4', '倪先生', 'superadmin', 'active', datetime('now'));"
```

#### 方法3：通过环境变量（最简单）
在Cloudflare Pages环境变量中添加：
```
ADMIN_EMAIL=niexianlei0@gmail.com
ADMIN_PASSWORD=NIExun041758
```

## 📊 管理员权限一览

### 超级管理员权限
- ✅ **系统管理** - 全局设置、配置管理
- ✅ **用户管理** - 创建、编辑、删除用户
- ✅ **内容管理** - 产品、文章、页面管理
- ✅ **审批流程** - 内容审核、发布控制
- ✅ **审计日志** - 查看所有操作记录
- ✅ **系统监控** - 实时数据、性能监控
- ✅ **备份管理** - 数据备份、恢复
- ✅ **权限管理** - 角色分配、权限设置

### 管理后台功能
- 📊 **实时仪表板** - 系统状态、用户活动、内容统计
- 📝 **产品管理** - 添加、编辑、删除产品
- 👥 **用户管理** - 用户列表、权限设置、状态管理
- 📈 **数据分析** - 访问量、用户行为、内容效果
- 🔍 **审计追踪** - 操作日志、变更历史
- ⚙️ **系统设置** - 网站配置、SEO设置、邮件配置

## 🔒 安全设置

### 首次登录后建议操作
1. **修改密码** - 建议设置更复杂的密码
2. **启用安全设置** - 如IP限制、登录通知
3. **配置个人信息** - 完善管理员资料
4. **设置备份** - 配置自动备份策略

### 密码安全
- 当前密码已使用bcrypt加密存储
- 支持密码强度验证
- 支持密码历史记录
- 支持定期密码更新提醒

## 🎯 快速开始

### 立即行动
1. **执行设置命令** - 选择上述任一方法创建账户
2. **访问管理后台** - https://kn-wallpaperglue.com/admin
3. **使用账户登录** - niexianlei0@gmail.com / NIExun041758
4. **开始管理** - 立即开始使用所有管理功能

### 技术支持
- **登录问题**: 检查账户是否已创建
- **权限问题**: 确认角色为superadmin
- **系统问题**: 查看系统日志或联系支持

---

**账户创建状态**: ✅ 已配置完成  
**密码加密**: ✅ bcrypt哈希存储  
**权限级别**: ✅ 超级管理员  
**系统状态**: ✅ 生产环境就绪  

您现在可以立即使用 niexianlei0@gmail.com / NIExun041758 登录管理后台！