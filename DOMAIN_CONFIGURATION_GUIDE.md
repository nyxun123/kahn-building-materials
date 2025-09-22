# 🌐 生产域名配置指南

## 当前部署状态

✅ **应用已成功部署到 Cloudflare Pages**
- **临时测试地址**: `https://6574181f.kahn-building-materials.pages.dev`
- **正式域名**: `kn-wallpaperglue.com` (已配置但需要DNS设置)

## 🔧 DNS 配置步骤

### 1. 登录 Cloudflare 控制台
访问 [Cloudflare Dashboard](https://dash.cloudflare.com) 并登录您的账户。

### 2. 选择您的域名
在控制台中选择 `kn-wallpaperglue.com` 域名。

### 3. 配置 DNS 记录

#### 必需的主记录 (A 记录)
| 类型 | 名称 | IPv4 地址 | TTL | 代理状态 |
|------|------|-----------|-----|----------|
| A | @ | (自动) | 自动 | 已代理 |

#### 可选的子域名记录
| 类型 | 名称 | 目标 | TTL | 代理状态 |
|------|------|-----------|-----|----------|
| CNAME | www | `kn-wallpaperglue.com` | 自动 | 已代理 |
| CNAME | api | `kn-wallpaperglue.com` | 自动 | 已代理 |

### 4. SSL/TLS 配置
1. 进入 **SSL/TLS** > **概述**
2. 确保设置为 **完全** 或 **完全（严格）**
3. 证书将自动颁发和更新

### 5. 页面规则配置 (可选)
创建页面规则以确保正确重定向：
- `https://www.kn-wallpaperglue.com/*` → `https://kn-wallpaperglue.com/$1` (301重定向)
- `http://kn-wallpaperglue.com/*` → `https://kn-wallpaperglue.com/$1` (HTTPS强制)

## 🌐 域名验证

部署完成后，验证以下配置：

### DNS 验证
```bash
# 检查A记录
dig A kn-wallpaperglue.com

# 检查CNAME记录  
dig CNAME www.kn-wallpaperglue.com

# 检查MX记录（如果有邮箱）
dig MX kn-wallpaperglue.com
```

### SSL 证书验证
```bash
# 检查SSL证书
openssl s_client -connect kn-wallpaperglue.com:443 -servername kn-wallpaperglue.com

# 检查证书链
curl -v https://kn-wallpaperglue.com 2>&1 | grep -i "SSL certificate"
```

### 网站功能验证
1. **首页访问**: `https://kn-wallpaperglue.com`
2. **API端点测试**: `https://kn-wallpaperglue.com/api/products`
3. **管理后台**: `https://kn-wallpaperglue.com/admin`
4. **联系表单**: `https://kn-wallpaperglue.com/contact`

## 🚀 生产环境功能

### 已部署的后端API
- `GET /api/products` - 获取产品列表
- `POST /api/contact` - 提交联系表单  
- `POST /api/upload-image` - 图片上传
- `GET /api/admin/dashboard/stats` - 管理统计数据
- `GET /api/admin/dashboard/activities` - 活动记录
- `GET /api/admin/dashboard/health` - 系统健康检查

### 环境变量配置
确保以下环境变量已在 Cloudflare Pages 中设置：
- `VITE_API_BASE_URL=https://kn-wallpaperglue.com`
- `VITE_SUPABASE_URL=https://ypjtdfsociepbzfvxzha.supabase.co`
- `VITE_SUPABASE_ANON_KEY` (您的Supabase密钥)

## 📊 监控和维护

### 性能监控
1. **Cloudflare Analytics**: 查看流量和分析
2. **Page Speed Insights**: 测试网站性能
3. **GTmetrix**: 综合性能分析

### 安全配置
1. **WAF规则**: 配置Web应用防火墙
2. **速率限制**: 防止DDoS攻击
3. **Bot管理**: 识别和阻止恶意机器人

### 备份策略
1. **数据库备份**: 定期备份D1数据库
2. **代码备份**: GitHub仓库备份
3. **环境备份**: 导出环境变量配置

## 🆘 故障排除

### 常见问题

1. **DNS 传播延迟**
   - 等待24-48小时完全传播
   - 使用 `dig` 命令检查不同地区的DNS解析

2. **SSL 证书问题**
   - 检查证书颁发状态
   - 验证域名所有权

3. **API 404 错误**
   - 检查 Functions 配置
   - 验证环境变量

4. **性能问题**
   - 启用 Cloudflare Cache
   - 优化图片和静态资源

### 技术支持
- **Cloudflare 支持**: https://support.cloudflare.com
- **Supabase 支持**: https://supabase.com/docs
- **项目文档**: 查看项目 README.md

## 🎉 上线确认清单

- [ ] DNS 记录正确配置
- [ ] SSL 证书有效
- [ ] 所有页面可访问
- [ ] API 端点正常工作
- [ ] 管理后台可登录
- [ ] 联系表单可提交
- [ ] 图片上传功能正常
- [ ] 多语言切换正常
- [ ] 移动端响应式正常
- [ ] 性能测试通过

**恭喜！您的生产环境现已完全配置完成。** 🚀