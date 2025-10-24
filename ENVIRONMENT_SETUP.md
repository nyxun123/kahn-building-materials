# 环境配置说明

## Cloudflare R2 配置

为了确保上传功能正常工作，请正确配置以下环境变量：

### 本地开发环境
在本地开发时，需要设置以下环境变量：

```bash
# .env 文件
R2_PUBLIC_DOMAIN=https://pub-b9f0c2c358074609bf8701513c879957.r2.dev
```

### Cloudflare Pages 环境变量
在 Cloudflare Pages 部署时，请设置以下环境变量：

- `R2_PUBLIC_DOMAIN`: 设置为您的 R2 存储桶的公共访问域名

## 验证步骤

1. 确保 `wrangler.toml` 中正确配置了 R2 存储桶：
```toml
[[r2_buckets]]
binding = "IMAGE_BUCKET"
bucket_name = "kaen"  # 替换为您的实际桶名称
```

2. 确保环境变量 `R2_PUBLIC_DOMAIN` 指向正确的 R2 公共域名

## 常见问题排查

1. **上传失败**: 检查 `IMAGE_BUCKET` 环境变量是否正确配置
2. **文件无法访问**: 检查 `R2_PUBLIC_DOMAIN` 是否正确设置
3. **认证失败**: 检查管理员认证信息是否正确

## 部署后验证

部署后，请测试以下功能：
- [ ] 图片上传功能
- [ ] 视频上传功能  
- [ ] 上传文件的访问链接
- [ ] 首页内容的保存功能