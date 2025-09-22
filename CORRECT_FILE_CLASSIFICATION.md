# 正确的文件分类

## 应该保留的重要文件
这些文件对网站项目有重要作用，需要恢复：

1. **API开发和测试文件**
   - api-example.js - API使用示例，帮助理解如何使用API
   - debug-api.js - API调试工具，用于测试API端点
   - test-api-env.js - API环境测试脚本
   - test-company-info.js - 公司信息测试
   - test-company-info-fixed.js - 修复后的公司信息测试
   - test-page-content-api.js - 页面内容API测试

2. **管理员相关文件**
   - AUTO_ADMIN_CREATOR.js - 自动管理员创建脚本，用于设置管理员账户
   - IMMEDIATE_ADMIN_SETUP.md - 紧急管理员设置指南
   - CUSTOM_ADMIN_SETUP.md - 自定义管理员设置
   - ADMIN_CREDENTIALS.md - 管理员凭证文档
   - CHINESE_ADMIN_GUIDE.md - 中文管理员指南

3. **留言系统文件**
   - IMMEDIATE_FIX_MESSAGES.md - 紧急留言修复指南
   - IMMEDIATE_MESSAGES_FIX.js - 立即留言修复脚本
   - UPDATE_MESSAGES_API.js - 更新留言API
   - FIX_MESSAGES_TABLE.sql - 修复留言表SQL
   - FINAL_MESSAGES_FIX.sql - 最终留言修复SQL
   - EMERGENCY_MESSAGES_REPAIR.md - 紧急留言修复
   - FINAL_MESSAGES_REPAIR_COMPLETE.md - 最终留言修复完成

4. **部署和配置文件**
   - deploy-optimized.sh - 优化部署脚本
   - deploy-production.sh - 生产环境部署脚本
   - deploy.sh - 部署脚本
   - setup-api-env.sh - API环境设置脚本
   - CLOUDFLARE_CLEANUP_SCRIPT.md - Cloudflare清理脚本
   - CLOUDFLARE_DEPLOY_STEPS.md - Cloudflare部署步骤
   - FUNCTIONS_CONFIGURATION_CHECKLIST.md - 函数配置检查清单
   - DOMAIN_CONFIGURATION_GUIDE.md - 域名配置指南

5. **文档和指南文件**
   - API_TEST_GUIDE.md - API测试指南
   - SUB_AGENT_USAGE_GUIDE.md - 子代理使用指南
   - PERFORMANCE_OPTIMIZATION_REPORT.md - 性能优化报告
   - PROJECT_COMPLETION_REPORT.md - 项目完成报告
   - DEPLOY_NOW_GUIDE.md - 立即部署指南
   - EMERGENCY_DEPLOYMENT_GUIDE.md - 紧急部署指南
   - EMERGENCY_RECOVERY.md - 紧急恢复指南
   - PRODUCTION_DEPLOYMENT_COMPLETE.md - 生产部署完成

## 真正应该删除的文件
这些文件可能与项目无关或已经过时：

1. **重复或过时的配置文件**
   - .mcp.json
   - .opencode.json
   - components.json

2. **可能无关的目录**
   - .claude/ (如果与当前项目无关)
   - .codebuddy/ (如果与当前项目无关)
   - data/ (如果只是临时数据)
   - docs/ (如果内容与网站无关)
   - rules/ (如果与当前项目无关)
   - specs/ (如果与当前项目无关)