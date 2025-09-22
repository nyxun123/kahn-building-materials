-- 修复管理员登录问题的数据库更新脚本

-- 1. 首先检查当前管理员账户状态
SELECT id, email, password_hash, name, role FROM admins WHERE email = 'niexianlei0@gmail.com';

-- 2. 如果账户不存在或密码不正确，重新插入正确的账户信息
INSERT OR REPLACE INTO admins (email, password_hash, name, role) 
VALUES ('niexianlei0@gmail.com', 'XIANche041758', '管理员', 'super_admin');

-- 3. 验证更新结果
SELECT id, email, password_hash, name, role FROM admins WHERE email = 'niexianlei0@gmail.com';

-- 4. 检查表结构确保正确
PRAGMA table_info(admins);