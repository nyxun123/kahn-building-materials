# 环境变量配置指南

## Cloudflare Pages 环境变量设置

为了让上传功能正常工作，需要在Cloudflare Pages控制台中设置以下环境变量：

### 设置步骤：
1. 登录 Cloudflare Dashboard
2. 导航到 Pages -> 选择项目 "kahn-building-materials"
3. 点击 "Settings" -> "Environment Variables"
4. 添加以下变量：

```
R2_PUBLIC_DOMAIN=https://pub-b9f0c2c358074609bf8701513c879957.r2.dev
```

### 验证部署
部署URL: https://2a6f67dd.kahn-building-materials.pages.dev

### 管理后台访问
- 地址: https://2a6f67dd.kahn-building-materials.pages.dev/admin
- 首页内容管理: https://2a6f67dd.kahn-building-materials.pages.dev/admin/home-content

### 功能验证清单
- [ ] 图片上传功能
- [ ] 视频上传功能
- [ ] 上传文件访问（通过更新的R2 URL）
- [ ] 首页内容保存功能
- [ ] 多语言内容管理（中文、英文、俄文）
- [ ] 演示视频板块
- [ ] OEM定制板块
- [ ] 半成品小袋板块