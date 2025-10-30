#!/bin/bash

# 批量修复 API 文件中的 CORS 响应
# 将所有 Access-Control-Allow-Origin: * 替换为使用 CORS 工具函数

set -e

echo "🔧 批量修复 CORS 响应"
echo "===================="

# 定义需要修改的文件列表
FILES=(
  "functions/api/admin/home-content.js"
  "functions/api/admin/oem.js"
  "functions/api/admin/seo/[page].js"
  "functions/api/upload-image.js"
)

# 备份文件
backup_file() {
  local file=$1
  if [ -f "$file" ]; then
    cp "$file" "$file.backup"
    echo "✅ 已备份: $file"
  fi
}

# 恢复文件
restore_files() {
  echo ""
  echo "⚠️  发生错误，恢复备份文件..."
  for file in "${FILES[@]}"; do
    if [ -f "$file.backup" ]; then
      mv "$file.backup" "$file"
      echo "✅ 已恢复: $file"
    fi
  done
}

# 设置错误处理
trap restore_files ERR

# 备份所有文件
echo ""
echo "📦 备份文件..."
for file in "${FILES[@]}"; do
  backup_file "$file"
done

echo ""
echo "🔄 开始修复..."

# 修复函数
fix_cors_responses() {
  local file=$1
  echo ""
  echo "处理文件: $file"
  
  # 使用 sed 进行替换（macOS 兼容）
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' 's/Access-Control-Allow-Origin'"'"': '"'"'\*'"'"'/Access-Control-Allow-Origin: PLACEHOLDER/g' "$file"
  else
    # Linux
    sed -i 's/Access-Control-Allow-Origin'"'"': '"'"'\*'"'"'/Access-Control-Allow-Origin: PLACEHOLDER/g' "$file"
  fi
  
  echo "  ✅ 已标记 CORS headers"
}

# 处理每个文件
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    fix_cors_responses "$file"
  else
    echo "⚠️  文件不存在: $file"
  fi
done

echo ""
echo "✅ 批量修复完成！"
echo ""
echo "📝 注意事项:"
echo "  1. 备份文件已保存为 *.backup"
echo "  2. 请手动检查修改后的文件"
echo "  3. 需要手动替换响应创建逻辑"
echo "  4. 确认无误后删除备份文件"
echo ""
echo "🗑️  删除备份文件:"
echo "  find functions/api -name '*.backup' -delete"

