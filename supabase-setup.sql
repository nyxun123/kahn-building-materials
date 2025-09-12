-- Supabase数据库初始化脚本
-- 为杭州卡恩新型建材有限公司后台系统

-- 1. 启用Supabase Auth
-- 该功能已在Supabase控制台自动启用

-- 2. 创建管理员用户表（如果还不存在）
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建用户资料表（与Supabase Auth集成）
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user',
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 设置RLS（Row Level Security）策略

-- 管理员用户表策略
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 管理员可以查看所有管理员用户
CREATE POLICY "管理员可以查看管理员列表"
    ON admin_users FOR SELECT
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

-- 只有超级管理员可以修改管理员用户
CREATE POLICY "超级管理员可以修改管理员"
    ON admin_users FOR ALL
    USING (auth.jwt() ->> 'email' = 'niexianlei0@gmail.com');

-- 5. 产品表RLS策略
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 所有人可以查看产品
CREATE POLICY "所有人可以查看产品"
    ON products FOR SELECT
    USING (is_active = true);

-- 管理员可以管理产品
CREATE POLICY "管理员可以管理产品"
    ON products FOR ALL
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

-- 6. 联系消息表RLS策略
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 管理员可以查看所有消息
CREATE POLICY "管理员可以查看所有消息"
    ON contact_messages FOR SELECT
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

-- 管理员可以更新消息状态
CREATE POLICY "管理员可以更新消息"
    ON contact_messages FOR UPDATE
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

-- 7. 页面内容表RLS策略
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;

-- 所有人可以查看内容
CREATE POLICY "所有人可以查看内容"
    ON page_contents FOR SELECT
    USING (is_active = true);

-- 管理员可以更新内容
CREATE POLICY "管理员可以更新内容"
    ON page_contents FOR ALL
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

-- 8. 站点设置表RLS策略
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 所有人可以查看设置
CREATE POLICY "所有人可以查看设置"
    ON site_settings FOR SELECT
    USING (is_active = true);

-- 管理员可以更新设置
CREATE POLICY "管理员可以更新设置"
    ON site_settings FOR ALL
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users WHERE is_active = true));

-- 9. 创建管理员用户（通过Supabase Auth）
-- 注意：这需要通过Supabase控制台或API创建用户

-- 10. 创建触发器函数（自动更新时间戳）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间戳触发器
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. 创建用户注册触发器（自动创建用户资料）
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name, role, is_admin)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        CASE 
            WHEN NEW.email = 'niexianlei0@gmail.com' THEN 'admin'
            ELSE 'user'
        END,
        NEW.email = 'niexianlei0@gmail.com'
    );
    
    -- 如果是管理员邮箱，添加到admin_users表
    IF NEW.email = 'niexianlei0@gmail.com' THEN
        INSERT INTO admin_users (email, name, role, is_active)
        VALUES (NEW.email, '管理员', 'super_admin', true)
        ON CONFLICT (email) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 12. 创建索引优化查询
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_page_contents_active ON page_contents(is_active);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);

-- 13. 插入初始数据
-- 管理员用户将通过Supabase Auth创建
-- 基础设置数据可以后续通过后台添加

-- 14. 配置存储桶（如果还没有）
-- 这需要通过Supabase控制台配置存储权限