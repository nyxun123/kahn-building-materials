# Cloudflare Pages 环境变量配置指南

## 设置 R2_PUBLIC_DOMAIN 环境变量

为了让上传功能正常工作，您需要在Cloudflare Pages控制台中设置R2_PUBLIC_DOMAIN环境变量。

### 设置步骤：

1. **登录 Cloudflare Dashboard**
   - 打开浏览器，访问 https://dash.cloudflare.com
   - 使用您的Cloudflare账户凭据登录

2. **导航到 Pages 项目**
   - 在左侧导航栏中，点击 "Workers & Pages"
   - 在下拉菜单中选择 "Pages"
   - 在项目列表中找到并点击您的项目 "kahn-building-materials"

3. **访问设置页面**
   - 在项目页面的顶部，点击 "Settings" 选项卡
   - 在左侧侧边栏中，找到并点击 "Environment variables" 选项

4. **添加环境变量**
   - 点击 "Add variable" 按钮
   - 在 "Variable name" 字段中输入：`R2_PUBLIC_DOMAIN`
   - 在 "Variable value" 字段中输入：`https://pub-b9f0c2c358074609bf8701513c879957.r2.dev`
   - 点击 "Save variable" 按钮

5. **重新部署项目**
   - 回到项目的 "Deployments" 选项卡
   - 点击 "Deployments" 列表顶部的 "Retry" 或 "Deploy from GitHub" 按钮
   - 这将触发一个新的部署，使用新设置的环境变量

## ✅ 测试结果更新

**好消息！** 经过测试发现，上传功能已经正常工作：

### 测试结果
- ✅ **API连通性**: 正常 (https://2a6f67dd.kahn-building-materials.pages.dev)
- ✅ **图片上传**: 成功上传到R2存储
- ✅ **R2域名**: 已自动使用正确的R2公共域名
- ✅ **文件访问**: 上传的图片可以正常访问

### 测试详情
```json
{
  "code": 200,
  "message": "图片上传成功",
  "data": {
    "original": "https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/test/1760681365929_3qccvi.jpg",
    "uploadMethod": "cloudflare_r2",
    "fileSize": 144869,
    "fileType": "image/jpeg"
  }
}
```

### 当前状态
环境变量似乎已经正确配置或者代码使用了默认的R2域名。如果您想确保配置的一致性，仍然建议按照以下步骤设置环境变量。

### 验证设置

环境变量设置完成后，您可以：

1. **检查部署日志**：
   - 在 "Deployments" 选项卡中查看最新部署的日志
   - 确认部署成功且没有错误

2. **测试上传功能**：
   - 访问您的管理后台（例如：https://your-subdomain.kahn-building-materials.pages.dev/admin）
   - 尝试上传图片或视频文件
   - 确认文件能正确上传并访问

### 注意事项

- 确保R2存储桶配置正确，并且您的Cloudflare账户有适当的权限
- 如果您的R2存储桶使用不同的域名，请相应地调整环境变量值
- 环境变量只影响新部署的版本，不会影响现有的已部署版本

### 如果遇到问题

如果按照上述步骤操作后仍有问题：

1. 检查R2存储桶是否正确配置
2. 确认Cloudflare账户有访问R2存储桶的权限
3. 查看浏览器控制台是否有错误信息
4. 检查是否有网络限制阻止访问R2存储桶

### 联系支持

如果您在设置过程中遇到困难，可以通过以下方式获取帮助：
- Cloudflare 文档：https://developers.cloudflare.com/pages/
- Cloudflare 社区：https://community.cloudflare.com/