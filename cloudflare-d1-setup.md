# Cloudflare D1 数据库设置指南

## 📋 外贸获客网站 - 完整 Cloudflare 方案

您的网站现在使用 **Cloudflare 全栈解决方案**：
- ✅ **Cloudflare Pages**: 网站托管
- ✅ **Cloudflare Workers**: API 处理 
- ✅ **Cloudflare D1**: 联系表单数据存储
- ✅ **Cloudflare R2**: 图片文件存储（可选）

## 🚀 设置步骤

### 1. 创建 D1 数据库

前往 [Cloudflare Dashboard](https://dash.cloudflare.com) → D1 → Create database：

```bash
# 数据库名称
kahn-contact-db
```

### 2. 获取数据库 ID

创建后复制数据库 ID，更新 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "kahn-contact-db"
database_id = "你的数据库ID"  # 替换这里
```

### 3. 初始化数据库结构

在 D1 控制台或使用 wrangler 执行 `schema.sql`：

```bash
npx wrangler d1 execute kahn-contact-db --file=./schema.sql
```

### 4. 配置 R2 存储（可选）

如需图片上传，创建 R2 存储桶：

```bash
# 存储桶名称
kahn-images
```

更新 `wrangler.toml`：
```toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "kahn-images"
```

## 📊 功能特性

### ✅ 联系表单
- **存储**: D1 数据库表 `contacts`
- **API**: `POST /api/contact`
- **验证**: 邮箱格式、垃圾信息过滤
- **管理**: 状态管理（new/replied/archived）

### ✅ 管理员系统
- **登录**: `POST /api/admin/login`
- **查看**: `GET /api/admin/contacts`
- **账户**: niexianlei0@gmail.com / XIANche041758

### ✅ 图片上传
- **存储**: R2 存储桶（可选）
- **API**: `POST /api/upload-image`
- **格式**: JPG, PNG, WebP, GIF
- **限制**: 最大 5MB

## 🔗 访问地址

- **网站**: https://kn-wallpaperglue.com
- **管理后台**: https://kn-wallpaperglue.com/admin/login
- **API 基础地址**: https://kn-wallpaperglue.com/api

## 📈 优势

1. **高性能**: Cloudflare 全球 CDN
2. **低成本**: D1 免费额度足够中小型网站
3. **高可用**: 99.99% 正常运行时间
4. **简单**: 无需维护服务器
5. **安全**: 内置 DDoS 防护和安全功能

## 📞 联系表单字段

```json
{
  "name": "客户姓名",
  "email": "邮箱地址", 
  "phone": "电话号码",
  "company": "公司名称",
  "message": "询盘内容"
}
```

## 🛠️ 下一步

1. 在 Cloudflare Dashboard 创建 D1 数据库
2. 复制数据库 ID 到 `wrangler.toml`
3. 执行数据库初始化脚本
4. 推送代码触发自动部署
5. 测试联系表单和管理后台

**完全抛弃 Supabase，使用 Cloudflare 全栈！** 🎉