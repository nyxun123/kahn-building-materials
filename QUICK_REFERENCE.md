# 快速参考卡片

## 🚨 **当前紧急任务**

**问题**: JWT 修复未部署到生产环境  
**原因**: GitHub Webhook 未触发自动部署  
**解决**: 手动触发 Cloudflare Pages 部署

---

## ⚡ **一键操作**

### 检查状态
```bash
./check-deployment-status.sh
```

### 手动部署
访问：https://dash.cloudflare.com/6ae5d9a224117ca99a05304e017c43db/pages/view/kahn-building-materials

点击 "Create deployment" → 选择 `main` 分支

### 测试 API
```bash
curl -X POST "https://kn-wallpaperglue.com/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kn-wallpaperglue.com","password":"Admin#2025"}' | jq '.data.authType'
```

**预期**: `"JWT"`  
**当前**: 500 错误

---

## 📁 **重要文件**

| 文件 | 用途 |
|------|------|
| `PROJECT_STATUS.md` | 完整状态总结 |
| `GITHUB_WEBHOOK_FIX_GUIDE.md` | 详细修复指南 |
| `check-deployment-status.sh` | 自动检查脚本 |
| `QUICK_REFERENCE.md` | 本文件（快速参考） |

---

## 🎯 **待办清单**

- [x] 代码修复（commit b99d7c9）
- [x] 推送到 GitHub
- [ ] **手动触发部署** ← 当前任务
- [ ] 验证部署成功
- [ ] 修复 GitHub Webhook
- [ ] 清理未跟踪文件

---

## 💬 **新对话开始时说**

> "请先阅读 PROJECT_STATUS.md 了解当前状态"

这样我可以快速恢复上下文，继续帮你解决问题。

---

## 📞 **关键链接**

- Cloudflare Pages: https://dash.cloudflare.com/6ae5d9a224117ca99a05304e017c43db/pages/view/kahn-building-materials
- GitHub Webhook: https://github.com/nyxun123/kahn-building-materials/settings/hooks
- 生产域名: https://kn-wallpaperglue.com

