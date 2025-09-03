# 域名清理和重新绑定指南

## 🔧 清理现有域名绑定

您的域名 `kn-wallpaperglue.com` 目前绑定在 `karn-website` 项目上，需要手动清理。

### 步骤1: 清理域名绑定（手动操作）

1. **登录Cloudflare控制台**:
   ```bash
   open https://dash.cloudflare.com
   ```

2. **找到旧项目**:
   - 进入 Pages → karn-website
   - 点击 "Custom domains"
   - 删除绑定的域名: kn-wallpaperglue.com
   - 删除: www.kn-wallpaperglue.com

3. **删除项目**:
   - 返回 Pages 项目列表
   - 找到 karn-website 项目
   - 点击 "删除" → 确认删除

### 步骤2: 重新绑定到新项目

清理完成后，运行以下命令绑定域名：

```bash
# 绑定主域名
npx wrangler pages domain add kn-wallpaperglue.com --project-name=kahn-building-materials

# 绑定www域名
npx wrangler pages domain add www.kn-wallpaperglue.com --project-name=kahn-building-materials
```

### 步骤3: 验证绑定

```bash
# 检查域名状态
npx wrangler pages domain list
```

### 步骤4: 火山引擎DNS最终配置

登录火山引擎控制台，配置DNS：

**CNAME记录配置:**
```
类型: CNAME
主机记录: @
记录值: 14b85b5e.kahn-building-materials.pages.dev
TTL: 300

类型: CNAME
主机记录: www
记录值: 14b85b5e.kahn-building-materials.pages.dev
TTL: 300
```

## 🎯 预期结果

完成以上步骤后：
- https://kn-wallpaperglue.com → 您的网站
- https://www.kn-wallpaperglue.com → 您的网站
- SSL证书自动配置
- 所有功能正常工作

## 🚨 重要提醒

**现在需要您手动完成以下操作：**
1. 登录 https://dash.cloudflare.com
2. 找到 karn-website 项目
3. 删除域名绑定
4. 删除项目
5. 然后运行域名绑定命令

完成后，您的网站将完全迁移到Cloudflare Pages并使用您的自定义域名！