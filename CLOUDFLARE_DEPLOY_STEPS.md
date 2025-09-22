# Cloudflare Pages 详细部署步骤

## 第一步：准备部署文件

运行部署脚本生成部署包：

```bash
./deploy.sh
```

这将生成 `deploy.zip` 文件，包含构建好的网站文件。

## 第二步：登录 Cloudflare 控制台

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 使用您的 Cloudflare 账户登录

## 第三步：创建 Pages 项目

1. 在左侧菜单选择 **Pages**
2. 点击 **Create a project**
3. 选择 **Upload assets** 选项卡

## 第四步：上传部署文件

1. 将生成的 `deploy.zip` 文件拖放到上传区域
2. 项目名称填写: `kahn-wallpaperglue`
3. 点击 **Begin setup**

## 第五步：配置构建设置

在设置页面配置以下选项：

### 构建配置
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: (留空)

### 环境变量配置
点击 **Environment variables** 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_API_BASE_URL` | `https://kn-wallpaperglue.com` | API基础URL |
| `VITE_SUPABASE_URL` | `https://ypjtdfsociepbzfvxzha.supabase.co` | Supabase项目URL |
| `VITE_SUPABASE_ANON_KEY` | `您的Supabase密钥` | Supabase匿名密钥 |

### 高级设置
- **Node.js version**: `18`
- **Compatibility date**: `2024-01-01`

## 第六步：部署项目

1. 点击 **Save and Deploy**
2. 等待部署完成（约2-5分钟）
3. 部署成功后，您将获得一个类似 `https://kahn-wallpaperglue.pages.dev` 的URL

## 第七步：自定义域名（可选）

如果需要使用自定义域名 `kn-wallpaperglue.com`：

1. 在项目设置中选择 **Custom domains**
2. 点击 **Add custom domain**
3. 输入 `kn-wallpaperglue.com`
4. 按照提示配置DNS记录

## 第八步：验证部署

访问您的网站并测试以下功能：

1. ✅ 首页加载正常
2. ✅ 产品页面显示正常
3. ✅ 多语言切换工作
4. ✅ 联系表单可以提交
5. ✅ 图片上传功能正常
6. ✅ 管理后台可以登录

## 故障排除

### 常见问题

1. **构建失败**
   - 检查Node.js版本是否为18+
   - 确认所有依赖已安装

2. **环境变量未生效**
   - 在Cloudflare Pages设置中重新保存环境变量
   - 确保变量名正确（VITE_前缀）

3. **API连接失败**
   - 检查 `VITE_API_BASE_URL` 是否正确
   - 确认后端服务正常运行

4. **图片上传失败**
   - 检查Supabase配置是否正确
   - 确认存储桶权限设置

## 后续维护

### 更新部署
当代码有更新时，只需重新运行：

```bash
./deploy.sh
```

然后重新上传新的 `deploy.zip` 文件到Cloudflare Pages。

### 环境变量管理
所有敏感配置都通过环境变量管理，无需修改代码。

## 技术支持

如果遇到问题：
1. 检查Cloudflare Pages的部署日志
2. 查看浏览器控制台错误信息
3. 参考Cloudflare官方文档
4. 联系项目维护人员

## 成功部署的标志

- ✅ 网站可以正常访问
- ✅ 所有页面功能正常
- ✅ API调用返回正确数据
- ✅ 图片上传和显示正常
- ✅ 管理后台可以正常使用
- ✅ 多语言切换工作正常

恭喜！您的企业网站现已成功部署到Cloudflare Pages。🎉