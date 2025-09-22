# 📍 公司信息更新指南

## 🎯 快速定位文件

### 1. 联系信息更新
**文件路径**: [`src/pages/contact/index.tsx`](src/pages/contact/index.tsx)

**需要修改的行号**:
- **地址** (中文): 第168-171行
- **地址** (英文): 第171-172行  
- **电话**: 第182行
- **邮箱**: 第192行
- **地图**: 第340-347行 (Google Maps嵌入代码)

### 2. 关于我们页面内容
**文件路径**: [`src/locales/en/about.json`](src/locales/en/about.json) 和 [`src/locales/zh/about.json`](src/locales/zh/about.json)

**需要修改的字段**:
- **公司名称**: `hero.title` 和 `company` 段落
- **公司描述**: `company.paragraph1-3`
- **历史事件**: `history.events.founding/expansion/international/present`

### 3. 联系页面多语言内容
**文件路径**: [`src/locales/en/contact.json`](src/locales/en/contact.json) 和 [`src/locales/zh/contact.json`](src/locales/zh/contact.json)

## ⚡ 最小修改步骤

### 步骤1: 更新联系信息
```bash
# 编辑联系页面
vim src/pages/contact/index.tsx
```

**修改以下具体位置**:
```typescript
// 第168-172行 - 地址信息
// 原内容:
浙江省杭州市余杭区东湖街道星桥路18号星尚国际广场
Xingshang International Plaza, No.18 Xingqiao Road, Donghu Street, Yuhang District, Hangzhou, Zhejiang, China

// 修改为:
[您的公司地址]
[Your Company Address in English]

// 第182行 - 电话号码
// 原内容:
<p className="text-muted-foreground mt-1">+86 571-88888888</p>
// 修改为:
<p className="text-muted-foreground mt-1">[您的电话号码]</p>

// 第192行 - 邮箱地址
// 原内容:
<p className="text-muted-foreground mt-1">info@karn-materials.com</p>
// 修改为:
<p className="text-muted-foreground mt-1">[您的邮箱地址]</p>
```

### 步骤2: 更新多语言内容
```bash
# 编辑英文关于我们
vim src/locales/en/about.json
```

**修改关键字段**:
```json
{
  "hero": {
    "title": "About [您的公司名称]"
  },
  "company": {
    "paragraph1": "[您的公司描述]",
    "paragraph2": "[您的公司优势]",
    "paragraph3": "[您的服务承诺]"
  }
}
```

```bash
# 编辑中文关于我们
vim src/locales/zh/about.json
```

### 步骤3: 更新地图位置
```bash
# 编辑地图嵌入代码
vim src/pages/contact/index.tsx
```

**第340-347行** - 替换Google Maps嵌入代码:
```html
<iframe 
  src="[您的Google Maps嵌入URL]"
  width="100%" 
  height="100%" 
  style={{ border: 0 }} 
  allowFullScreen 
  loading="lazy"
  title="[您的公司位置描述]"
></iframe>
```

## 🔄 获取Google Maps嵌入URL

1. 访问 [Google Maps](https://maps.google.com)
2. 搜索您的公司地址
3. 点击"分享"按钮
4. 选择"嵌入地图"选项卡
5. 复制提供的iframe代码中的src URL

## ✅ 验证修改

### 本地测试
```bash
npm run dev
# 访问 http://localhost:5173/contact 和 /about 查看修改效果
```

### 生产部署
```bash
# 部署到生产环境
npm run deploy
```

## 📋 修改清单

- [ ] 联系页面地址信息已更新
- [ ] 联系页面电话号码已更新
- [ ] 联系页面邮箱地址已更新
- [ ] 联系页面地图位置已更新
- [ ] 关于页面公司名称已更新
- [ ] 关于页面公司描述已更新
- [ ] 多语言文件内容已同步更新
- [ ] 本地测试通过
- [ ] 生产环境已部署

## 🚨 注意事项

1. **多语言同步**: 确保中英文内容保持一致
2. **格式验证**: 检查电话号码和邮箱格式是否正确
3. **地图测试**: 验证Google Maps位置是否准确
4. **缓存清理**: 部署后可能需要清理CDN缓存才能看到更新

## 📞 技术支持

如需帮助，请联系技术支持或参考:
- [部署指南](DEPLOYMENT_GUIDE.md)
- [管理员指南](ADMIN_CREDENTIALS.md)