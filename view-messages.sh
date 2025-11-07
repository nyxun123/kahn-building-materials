#!/bin/bash

# 查看客户留言的便捷脚本

echo "🔐 正在登录..."
TOKEN=$(curl -s -X POST https://kn-wallpaperglue.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"niexianlei0@gmail.com","password":"XIANche041758"}' | jq -r '.data.accessToken')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ 登录失败"
  exit 1
fi

echo "✅ 登录成功！"
echo ""
echo "📊 客户留言列表："
echo "======================================"

curl -s "https://kn-wallpaperglue.com/api/admin/contacts?page=1&limit=50" \
  -H "Authorization: Bearer $TOKEN" | jq -r '
  .data[] | 
  "
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📝 留言 #\(.id) | 时间: \(.created_at)
  👤 姓名: \(.name)
  📧 邮箱: \(.email)
  📱 电话: \(.phone // "未填写")
  🏢 公司: \(.company // "未填写")
  💬 留言: \(.message)
  📌 状态: \(.status) | 已读: \(if .is_read == 1 then "是" else "否" end)
  "'

echo ""
echo "======================================"
echo "✅ 查询完成"

