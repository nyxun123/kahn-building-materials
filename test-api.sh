#!/bin/bash
# API测试脚本

echo "🧪 开始测试API端点..."

# 测试公开产品API
echo -e "\n📦 测试公开产品API..."
curl -s -w "\nHTTP状态码: %{http_code}\n" http://localhost:5173/api/products

# 测试首页内容API
echo -e "\n📄 测试首页内容API..."
curl -s -w "\nHTTP状态码: %{http_code}\n" http://localhost:5173/api/content/home

# 测试联系表单API
echo -e "\n📧 测试联系表单API..."
curl -s -w "\nHTTP状态码: %{http_code}\n" -X POST http://localhost:5173/api/contact \
  -H "Content-Type: application/json" \
  -d '{"data":{"name":"测试用户","email":"test@example.com","message":"测试消息"}}'

echo -e "\n🎉 API测试完成！"