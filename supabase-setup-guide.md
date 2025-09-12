# Supabase后端配置指南

## 🚀 快速设置步骤

### 1. 访问Supabase控制台
打开浏览器访问：https://app.supabase.com  
选择项目：`ypjtdfsociepbzfvxzha`

### 2. 创建管理员账号
**方法1：手动创建（推荐）**
1. 进入 **Authentication** → **Users**
2. 点击 **"Add user"**
3. 选择 **"Create new user"**
4. 填写信息：
   - 邮箱：`niexianlei0@gmail.com`
   - 密码：`XIANche041758`
   - 确认密码：`XIANche041758`
   - 勾选 **"Send email confirmation"**（可选）
   - 勾选 **"Auto confirm user"**（推荐）
5. 点击 **"Create user"**

**方法2：使用脚本创建**
```bash
# 安装依赖
npm install @supabase/supabase-js

# 运行创建脚本
node create-admin-user.js
```

### 3. 执行数据库初始化

**方法1：使用SQL控制台**
1. 进入 **SQL Editor**
2. 复制 `supabase-setup.sql` 的全部内容
3. 粘贴到SQL编辑器并运行

**方法2：逐条执行**
```sql
-- 创建管理员用户表
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户资料表
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user',
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入管理员用户
INSERT INTO admin_users (email, name, role, is_active) 
VALUES ('niexianlei0@gmail.com', '管理员', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;
```

### 4. 配置存储桶权限
1. 进入 **Storage**
2. 创建存储桶：`product-images`
3. 设置权限：
   - **Public**: 允许公开访问
   - **Policies**: 添加以下策略

```sql
-- 存储桶权限策略
CREATE POLICY "允许上传图片" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

CREATE POLICY "允许删除图片" ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

CREATE POLICY "允许读取图片" ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');
```

### 5. 启用实时功能
1. 进入 **Database** → **Replication**
2. 启用以下表的复制：
   - `products`
   - `contact_messages`
   - `page_contents`
   - `site_settings`

### 6. 验证配置

**测试管理员登录：**
1. 访问：https://kn-wallpaperglue.com/admin/login
2. 输入：
   - 邮箱：niexianlei0@gmail.com
   - 密码：XIANche041758
3. 点击登录，应该成功进入后台

**测试实时更新：**
1. 登录后台
2. 添加新产品
3. 在前台页面查看是否自动更新

## 🔧 故障排除

### 常见问题

**登录失败**
- 检查邮箱和密码是否正确
- 确认用户已通过邮箱验证
- 检查admin_users表中is_active为true

**权限错误**
- 确认RLS策略已正确设置
- 检查用户是否在admin_users表中

**实时更新不工作**
- 确认数据库复制已启用
- 检查网络连接
- 查看浏览器控制台错误

### 调试命令

```bash
# 检查Supabase连接
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ypjtdfsociepbzfvxzha.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzU3NDcsImV4cCI6MjA3MDU1MTc0N30.YphVSQeOwn2gNFisRTsg0IhN6cNxDtWTo9k-QgeVU0w');
supabase.auth.signInWithPassword({ email: 'niexianlei0@gmail.com', password: 'XIANche041758' })
  .then(console.log).catch(console.error);
"
```

## 📊 项目架构概览

- **认证**: Supabase Auth (JWT)
- **数据库**: PostgreSQL + RLS
- **实时**: Supabase Realtime
- **存储**: Supabase Storage (产品图片)
- **API**: Supabase REST API

## 📞 技术支持

配置完成后，系统具备：
- ✅ 完整的用户认证系统
- ✅ 实时数据同步
- ✅ 安全的权限控制
- ✅ 图片上传和管理
- ✅ 多语言内容管理

所有功能已准备就绪，可以立即开始使用！