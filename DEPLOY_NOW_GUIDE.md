# 🚀 Cloudflare Pages 立即部署指南

## 当前部署状态

✅ **项目已准备就绪**
- 构建配置已完成 (`package.json`, `.pages.toml`)
- 部署脚本已就绪 (`deploy.sh`, `deploy-production.sh`)
- 环境变量模板已配置 (`.env.example`)
- 部署包已生成 (`deploy.zip`)

## 立即开始部署

### 方法一：使用 Wrangler CLI（推荐）

```bash
# 1. 确保已安装 Wrangler 并登录
npx wrangler login

# 2. 运行生产环境一键部署脚本
./deploy-production.sh
```

### 方法二：通过 Cloudflare 控制台

1. **访问 Cloudflare Dashboard**
   - 打开 [https://dash.cloudflare.com](https://dash.cloudflare.com)
   - 登录您的账户

2. **创建 Pages 项目**
   - 左侧菜单选择 **Pages**
   - 点击 **Create a project**
   - 选择 **Upload assets** 选项卡

3. **上传部署文件**
   - 将 `deploy.zip` 文件拖放到上传区域
   - 项目名称填写: `kahn-wallpaperglue`
   - 点击 **Begin setup**

4. **配置构建设置**
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: (留空)

5. **设置环境变量**
   点击 **Environment variables** 添加：

   | 变量名 | 值 | 说明 |
   |--------|-----|------|
   | `VITE_API_BASE_URL` | `https://kn-wallpaperglue.com` | API基础URL |
   | `VITE_SUPABASE_URL` | `https://ypjtdfsociepbzfvxzha.supabase.co` | Supabase项目URL |
   | `VITE_SUPABASE_ANON_KEY` | `您的Supabase密钥` | Supabase匿名密钥 |

6. **高级设置**
   - **Node.js version**: `18`
   - **Compatibility date**: `2024-01-01`

7. **部署项目**
   - 点击 **Save and Deploy**
   - 等待部署完成（约2-5分钟）

## 🌐 部署后的访问地址

部署成功后，您将获得：

- **临时测试地址**: `https://kahn-wallpaperglue.pages.dev`
- **正式域名**: `https://kn-wallpaperglue.com`（需配置自定义域名）

## 🔧 环境变量配置详情

### 必需的环境变量

| 变量名 | 描述 | 生产环境值 |
|--------|------|------------|
| `VITE_API_BASE_URL` | API基础URL | `https://kn-wallpaperglue.com` |
| `VITE_SUPABASE_URL` | Supabase项目URL | `https://ypjtdfsociepbzfvxzha.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase匿名密钥 | 从Supabase控制台获取 |

### 获取 Supabase 密钥

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择您的项目
3. 进入 **Settings** > **API**
4. 复制 **anon public** 密钥

## 📋 部署验证清单

部署完成后，请测试以下功能：

### 前端功能测试
- [ ] ✅ 首页加载正常 (`/`)
- [ ] ✅ 产品页面 (`/products`)
- [ ] ✅ OEM页面 (`/oem`)  
- [ ] ✅ 关于我们 (`/about`)
- [ ] ✅ 联系我们 (`/contact`)
- [ ] ✅ 多语言切换功能
- [ ] ✅ 响应式设计

### 后端API测试
- [ ] ✅ 产品API: `GET /api/products`
- [ ] ✅ 联系表单API: `POST /api/contact`
- [ ] ✅ 图片上传API: `POST /api/upload-image`
- [ ] ✅ 管理API: `GET /api/admin/*` (需要登录)

### 管理后台测试
- [ ] ✅ 管理员登录 (`/admin/login`)
- [ ] ✅ 仪表板页面 (`/admin/dashboard`)
- [ ] ✅ 内容管理 (`/admin/content`)
- [ ] ✅ 用户管理 (`/admin/users`)
- [ ] ✅ 消息管理 (`/admin/messages`)

## 🚨 故障排除

### 常见问题及解决方案

1. **构建失败**
   ```bash
   # 清除缓存重新构建
   rm -rf node_modules .wrangler dist deploy.zip
   pnpm install
   npm run build
   ```

2. **环境变量未生效**
   - 在Cloudflare Pages设置中重新保存环境变量
   - 确保变量名正确（VITE_前缀）

3. **API连接失败**
   - 检查 `VITE_API_BASE_URL` 是否正确
   - 确认后端Worker服务正常运行

4. **图片上传失败**
   - 检查Supabase配置是否正确
   - 确认存储桶权限设置

## 📞 技术支持

如果遇到部署问题：

1. **查看部署日志**
   - 在Cloudflare Pages项目页面查看构建日志
   - 检查浏览器控制台错误信息

2. **参考文档**
   - [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
   - [Supabase 文档](https://supabase.com/docs)

3. **联系支持**
   - Cloudflare 支持团队
   - Supabase 支持团队
   - 项目维护人员

## 🎉 成功部署的标志

- ✅ 网站可以正常访问
- ✅ 所有页面功能正常  
- ✅ API调用返回正确数据
- ✅ 图片上传和显示正常
- ✅ 管理后台可以正常使用
- ✅ 多语言切换工作正常

**恭喜！您的企业网站现已成功部署到Cloudflare Pages。** 🎊

---

**下一步建议**：部署完成后，您可以开始测试后端API功能。所有管理API端点都已就绪，包括实时数据分析、用户活动追踪和系统健康监控。