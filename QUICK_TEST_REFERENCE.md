# 🚀 前后端数据同步测试 - 快速参考

## 📍 服务地址

| 服务 | 地址 | 用途 |
|------|------|------|
| 前端用户页面 | http://localhost:5173 | 查看用户看到的内容 |
| 后端管理平台 | http://localhost:5173/admin | 修改数据 |
| 后端 API | http://localhost:8788/api/* | 直接调用 API |
| 测试页面 | http://localhost:5173/test-data-sync.html | 图形化测试 |

---

## ⚡ 快速启动

### 终端 1: 启动前端
```bash
cd /Users/nll/Documents/可以用的网站
npm run dev
```

### 终端 2: 启动后端
```bash
cd /Users/nll/Documents/可以用的网站
wrangler pages dev dist --local
```

---

## 🧪 三种测试方式

### 方式 1️⃣: 自动化脚本（最快）
```bash
node test-data-sync.js
```
**耗时**: 30 秒  
**输出**: 8 个测试结果 + 通过率

### 方式 2️⃣: 交互式页面（最直观）
```
访问: http://localhost:5173/test-data-sync.html
点击: "运行所有测试"
```
**耗时**: 1 分钟  
**输出**: 图形化界面 + 实时日志

### 方式 3️⃣: 手动测试（最完整）
```
参考: DATA_SYNC_TESTING_PLAN.md
按步骤: 登录 → 修改 → 验证
```
**耗时**: 10-15 分钟  
**输出**: 详细的测试报告

---

## 🎯 核心测试场景

### 场景 1: 产品图片上传
```
1. 后端: 产品管理 → 编辑 → 上传图片
2. 前端: 产品页面 → 刷新 → 查看新图片
3. 验证: 图片 URL 包含 r2.dev
```

### 场景 2: 产品文字修改
```
1. 后端: 产品管理 → 编辑 → 修改描述
2. 前端: 产品页面 → 刷新 → 查看新文字
3. 验证: 文字已更新
```

### 场景 3: 首页内容修改
```
1. 后端: 首页管理 → 修改内容
2. 前端: 首页 → 刷新 → 查看新内容
3. 验证: 内容已更新
```

### 场景 4: OEM 图片上传
```
1. 后端: OEM 管理 → 上传图片
2. 前端: 首页 → 向下滚动 → 查看 OEM 图片
3. 验证: 图片已显示
```

---

## 🔍 数据验证命令

### 在浏览器 Console 中运行

**查看产品数据**:
```javascript
fetch('/api/products?_t=' + Date.now())
  .then(r => r.json())
  .then(d => console.log(d))
```

**查看所有图片 URL**:
```javascript
document.querySelectorAll('img').forEach(img => {
  console.log(img.src);
});
```

**清理缓存**:
```javascript
localStorage.clear();
location.reload();
```

**查看缓存数据**:
```javascript
console.log(JSON.parse(localStorage.getItem('products-cache')));
```

---

## ✅ 测试检查清单

- [ ] 前端服务已启动
- [ ] 后端服务已启动
- [ ] 能成功登录后端管理平台
- [ ] 能上传图片
- [ ] 能修改文字
- [ ] 前端能显示修改后的数据
- [ ] 图片 URL 正确（R2 URL）
- [ ] 缓存能正确清理

---

## 🐛 快速排查

| 问题 | 解决方案 |
|------|---------|
| 前端显示旧数据 | `localStorage.clear(); location.reload();` |
| 图片显示 404 | 检查 R2 配置，重新上传 |
| API 返回 401 | 重新登录 |
| 后端无法连接 | 运行 `wrangler pages dev dist --local` |
| 缓存不更新 | 添加时间戳: `?_t=${Date.now()}` |

---

## 📊 预期结果

### 自动化脚本输出示例
```
✅ 通过: 8
❌ 失败: 0
✅ 所有测试通过！(100%)
```

### 交互式页面显示
```
通过: 8
失败: 0
总计: 8
通过率: 100%
```

### 手动测试完成
```
✅ 产品图片上传 - 成功
✅ 产品文字修改 - 成功
✅ 首页内容修改 - 成功
✅ OEM 图片上传 - 成功
```

---

## 📚 详细文档

| 文档 | 用途 |
|------|------|
| `DATA_SYNC_TESTING_PLAN.md` | 详细的测试步骤和场景 |
| `DATA_SYNC_TESTING_SUMMARY.md` | 完整的测试指南和资源 |
| `test-data-sync.js` | 自动化测试脚本 |
| `public/test-data-sync.html` | 交互式测试页面 |

---

## 🎓 学习资源

### 数据流
```
后端修改 → 保存到数据库/R2 → 前端获取 → 显示给用户
```

### 缓存策略
```
localStorage (永久) → 内存缓存 (5分钟) → HTTP 缓存 (10分钟)
```

### API 端点
```
/api/products          - 获取产品列表
/api/content           - 获取首页内容
/api/oem               - 获取 OEM 数据
/api/admin/products    - 管理产品
/api/admin/home-content - 管理首页
/api/admin/oem         - 管理 OEM
/api/upload-image      - 上传图片
```

---

## 💡 提示

1. **使用 F12 打开开发者工具** - 查看 Network 标签中的 API 请求
2. **查看 Console 标签** - 查看 JavaScript 错误和日志
3. **使用时间戳绕过缓存** - `?_t=${Date.now()}`
4. **检查 localStorage** - 查看缓存的数据
5. **查看 R2 URL** - 确保图片 URL 包含 `r2.dev`

---

## 🚀 开始测试

### 推荐流程

1. **快速验证** (5 分钟)
   ```bash
   node test-data-sync.js
   ```

2. **详细验证** (10 分钟)
   ```
   访问: http://localhost:5173/test-data-sync.html
   点击: "运行所有测试"
   ```

3. **完整验证** (15 分钟)
   ```
   参考: DATA_SYNC_TESTING_PLAN.md
   手动执行所有测试场景
   ```

---

**最后更新**: 2025-10-31  
**版本**: 1.0

