# 获取生产环境部署信息操作指南

## 操作目标
获取杭州卡恩新型建材有限公司网站的生产环境前后端网址

## Agents团队分工
- **运维Agent**: 负责登录Cloudflare控制台获取部署信息
- **数据库Agent**: 验证API连接配置
- **前端Agent**: 验证前端访问地址

## 操作步骤

### 步骤1: 登录Cloudflare控制台
1. 访问 https://dash.cloudflare.com
2. 使用您的账户凭证登录

### 步骤2: 获取Pages部署信息
1. 导航到"Workers & Pages"部分
2. 找到项目名称: `kahn-building-materials`
3. 查看"Production"分支的部署信息
4. 记录生产环境URL

### 步骤3: 获取Workers API信息
1. 在"Workers"部分查找相关API服务
2. 记录API端点URL
3. 验证环境变量配置

### 步骤4: 验证访问
1. 在浏览器中访问前端URL
2. 测试API端点连通性
3. 验证数据库连接

## 预期结果
- 前端生产环境URL: https://kn-wallpaperglue.com
- 后端API生产环境URL: 需要从Cloudflare控制台获取
- 管理后台URL: https://kn-wallpaperglue.com/admin

## 验证清单
- [ ] 前端网站可正常访问
- [ ] API接口响应正常
- [ ] 管理后台可登录
- [ ] 数据库连接正常
- [ ] 自定义域名解析正确

## 故障排查
如果无法访问:
1. 检查DNS设置是否正确指向Cloudflare
2. 确认SSL证书是否有效
3. 验证Workers和Pages部署状态
4. 检查防火墙和安全设置