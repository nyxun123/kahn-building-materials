-- 修复Supabase数据库RLS安全问题的完整脚本
-- 为杭州卡恩新型建材有限公司官网数据库设置安全策略

-- 1. 开启所有表的RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 2. 删除可能存在的旧策略
DO $$
BEGIN
    -- 删除products表相关策略
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products') THEN
        DROP POLICY IF EXISTS "Public read products" ON public.products;
        DROP POLICY IF EXISTS "Admin update products" ON public.products;
    END IF;
    
    -- 删除contact_messages表相关策略
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contact_messages') THEN
        DROP POLICY IF EXISTS "Public insert messages" ON public.contact_messages;
        DROP POLICY IF EXISTS "Admin read messages" ON public.contact_messages;
        DROP POLICY IF EXISTS "Admin update messages" ON public.contact_messages;
    END IF;
    
    -- 删除page_contents表相关策略
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'page_contents') THEN
        DROP POLICY IF EXISTS "Public read contents" ON public.page_contents;
        DROP POLICY IF EXISTS "Admin manage contents" ON public.page_contents;
    END IF;
    
    -- 删除admin_users表相关策略
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'admin_users') THEN
        DROP POLICY IF EXISTS "Admin manage users" ON public.admin_users;
    END IF;
    
    -- 删除site_settings表相关策略
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'site_settings') THEN
        DROP POLICY IF EXISTS "Public read settings" ON public.site_settings;
        DROP POLICY IF EXISTS "Admin manage settings" ON public.site_settings;
    END IF;
END $$;

-- 3. 创建用户权限验证函数
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
    -- 基于email或JWT claim验证管理员
    IF auth.jwt() IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN EXISTS (
        SELECT 1 
        FROM public.admin_users 
        WHERE email = auth.jwt()->>'email' 
        AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. products表策略 - 公开读取，管理员写入
CREATE POLICY "Public read products" ON public.products
    FOR SELECT USING (
        is_active = TRUE
    );

CREATE POLICY "Admin insert products" ON public.products
    FOR INSERT WITH CHECK (
        public.is_admin_user()
    );

CREATE POLICY "Admin update products" ON public.products
    FOR UPDATE USING (
        public.is_admin_user()
    );

CREATE POLICY "Admin delete products" ON public.products
    FOR DELETE USING (
        public.is_admin_user()
    );

-- 5. contact_messages表策略 - 公开写入，管理员读取
CREATE POLICY "Public insert messages" ON public.contact_messages
    FOR INSERT WITH CHECK (
        -- 允许匿名用户插入消息
        TRUE
    );

CREATE POLICY "Admin read messages" ON public.contact_messages
    FOR SELECT USING (
        public.is_admin_user()
    );

CREATE POLICY "Admin update messages" ON public.contact_messages
    FOR UPDATE USING (
        public.is_admin_user()
    ) WITH CHECK (
        public.is_admin_user()
    );

CREATE POLICY "Admin delete messages" ON public.contact_messages
    FOR DELETE USING (
        public.is_admin_user()
    );

-- 6. page_contents表策略 - 公开读取，管理员写入
CREATE POLICY "Public read contents" ON public.page_contents
    FOR SELECT USING (
        is_active = TRUE
    );

CREATE POLICY "Admin manage contents" ON public.page_contents
    FOR ALL USING (
        public.is_admin_user()
    );

-- 7. admin_users表策略 - 仅管理员访问（完全限制公开访问）
CREATE POLICY "Admin manage users" ON public.admin_users
    FOR ALL USING (
        public.is_admin_user()
    );

-- 8. site_settings表策略 - 公开读取，管理员写入
CREATE POLICY "Public read settings" ON public.site_settings
    FOR SELECT USING (
        is_active = TRUE
    );

CREATE POLICY "Admin manage settings" ON public.site_settings
    FOR ALL USING (
        public.is_admin_user()
    );

-- 9. 创建默认管理员用户（仅在没有用户时）
INSERT INTO public.admin_users (email, password_hash, name, role, is_active, created_at, updated_at)
SELECT 'admin@karn-materials.com', 
       '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewgN6SJNBdR6KpZK', -- 'admin123'
       '系统管理员', 
       'admin', 
       true, 
       NOW(), 
       NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.admin_users WHERE email = 'admin@karn-materials.com');

-- 10. 创建必要的索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_code ON public.products(product_code);
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.contact_messages(status, is_read);
CREATE INDEX IF NOT EXISTS idx_page_contents_active ON public.page_contents(is_active, page_key);
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.site_settings(setting_key, is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email, is_active);

-- 11. 设置适当的表权限
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- 12. 验证RLS已启用
SELECT schemaname, tablename, rowsecurity, (SELECT COUNT(*) FROM pg_policies WHERE schemaname = n.nspname AND tablename = c.relname) as policy_count
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_tables t ON t.schemaname = n.nspname AND t.tablename = c.relname
WHERE c.relkind = 'r' 
  AND n.nspname = 'public' 
  AND t.rowsecurity = true
ORDER BY tablename;