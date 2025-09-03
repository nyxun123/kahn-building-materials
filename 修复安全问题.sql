-- 解决Supabase安全问题的简易版（中文注释）
-- 为杭州卡恩新型建材有限公司修复5个RLS策略

-- 激活所有表的行级安全保护
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 产品表权限：用户只能查看，管理员可以管理
CREATE POLICY "允许所有人查看产品" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "仅管理员修改产品" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt()->>'email' AND is_active = true)
);

-- 留言表权限：所有人可以留言，管理员可以查看管理
CREATE POLICY "允许留言" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "管理员查看留言" ON public.contact_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt()->>'email' AND is_active = true)
);
CREATE POLICY "管理员修改留言" ON public.contact_messages FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt()->>'email' AND is_active = true)
);

-- 页面内容权限：用户只能阅读，管理员可以编辑
CREATE POLICY "允许查看内容" ON public.page_contents FOR SELECT USING (is_active = true);
CREATE POLICY "管理员管理内容" ON public.page_contents FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt()->>'email' AND is_active = true)
);

-- 管理员账户：完全私有，只有管理员能访问
CREATE POLICY "管理员专用" ON public.admin_users FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt()->>'email' AND is_active = true)
);

-- 站点设置权限：用户只能看，管理员可以改
CREATE POLICY "允许查看设置" ON public.site_settings FOR SELECT USING (is_active = true);
CREATE POLICY "管理员修改设置" ON public.site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt()->>'email' AND is_active = true)
);

-- 创建管理员账号（如果没有的话）
INSERT INTO public.admin_users (email, password_hash, name, role, is_active, created_at, updated_at)
SELECT 'admin@karn-materials.com', 
       crypt('kahn123456', gen_salt('bf')), -- 密码：kahn123456
       '网站管理员', 
       'admin', 
       true, 
       NOW(), 
       NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.admin_users);

-- 检查结果
SELECT '安全设置已完成！所有表的RLS已启用' as 状态; 