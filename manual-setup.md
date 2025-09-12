# 立即解决"Invalid login credentials"问题

## 🔴 问题原因
错误"Invalid login credentials"表示管理员账号 `niexianlei0@gmail.com` 还未在Supabase中创建。

## 🚀 2分钟解决方案

### 步骤1：创建管理员账号（30秒）
1. 打开浏览器访问：https://app.supabase.com
2. 登录您的Supabase账户
3. 找到并点击项目：`ypjtdfsociepbzfvxzha`
4. 在左侧菜单点击 **Authentication**
5. 点击 **Users** 标签
6. 点击右上角的 **"Add user"** 按钮
7. 选择 **"Create new user"**
8. 填写信息：
   - **Email**: `niexianlei0@gmail.com`
   - **Password**: `XIANche041758`
   - **Confirm Password**: `XIANche041758`
   - ✅ 勾选 **"Auto confirm user"**
   - ✅ 勾选 **"Send email confirmation"**（可选）
9. 点击 **"Create user"**

### 步骤2：验证账号创建（10秒）
创建成功后，你应该在Users列表中看到：
- 邮箱：`niexianlei0@gmail.com`
- 状态：已确认（confirmed）

### 步骤3：立即测试登录（30秒）
1. 打开新标签页访问：https://kn-wallpaperglue.com/admin/login
2. 输入：
   - 邮箱：`niexianlei0@gmail.com`
   - 密码：`XIANche041758`
3. 点击 **"登录"**
4. 应该成功进入管理后台

## 📋 预期结果
创建成功后：
- ✅ 不再显示"Invalid login credentials"
- ✅ 成功登录管理后台
- ✅ 可以管理产品、消息和内容

## 🎯 快速访问
- **后台登录**: https://kn-wallpaperglue.com/admin/login
- **产品管理**: https://kn-wallpaperglue.com/admin/products
- **消息管理**: https://kn-wallpaperglue.com/admin/messages

## ⚠️ 注意事项
- 确保在Supabase项目中创建用户，而不是其他项目
- 密码区分大小写：`XIANche041758`（X大写，其余小写）
- 如果已存在同名用户，可以删除后重新创建

## 🔧 备用方案
如果手动创建遇到问题，可以使用Supabase控制台SQL：
1. 进入 **SQL Editor**
2. 运行：
```sql
-- 创建管理员用户
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
  created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'niexianlei0@gmail.com',
  crypt('XIANche041758', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"管理员","role":"admin"}',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;
```

完成以上步骤后，您可以立即使用管理员账号登录后台！