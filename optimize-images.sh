#!/bin/bash
# 图片优化脚本
# 自动生成于 2025-10-11T06:45:51.998Z

echo "🖼️ 开始图片优化..."

# 检查依赖
if ! command -v npx &> /dev/null; then
    echo "❌ npx 未找到，请安装 Node.js"
    exit 1
fi

# 安装 sharp（如果未安装）
if ! npm list sharp &> /dev/null; then
    echo "📦 安装 sharp..."
    npm install sharp
fi

# 创建优化后的目录
mkdir -p optimized-images


# 优化: .gemini-clipboard/clipboard-1760068917624.png
echo "处理: clipboard-1760068917624.png"
npx sharp -i ".gemini-clipboard/clipboard-1760068917624.png" -o "optimized-images/clipboard-1760068917624.webp" --webp --quality 85

# 优化: public/images/Plant_Starch_Manufacturing_Process_Flowchart.jpg
echo "处理: Plant_Starch_Manufacturing_Process_Flowchart.jpg"
npx sharp -i "public/images/Plant_Starch_Manufacturing_Process_Flowchart.jpg" -o "optimized-images/Plant_Starch_Manufacturing_Process_Flowchart.webp" --webp --quality 85

# 优化: public/images/bison_universal_wallpaper_paste_packaging.jpg
echo "处理: bison_universal_wallpaper_paste_packaging.jpg"
npx sharp -i "public/images/bison_universal_wallpaper_paste_packaging.jpg" -o "optimized-images/bison_universal_wallpaper_paste_packaging.webp" --webp --quality 85

# 优化: public/images/plant_based_starch_sources_applications_bioplastics.jpg
echo "处理: plant_based_starch_sources_applications_bioplastics.jpg"
npx sharp -i "public/images/plant_based_starch_sources_applications_bioplastics.jpg" -o "optimized-images/plant_based_starch_sources_applications_bioplastics.webp" --webp --quality 85

# 优化: public/images/professional_wallpaper_installation_worker.jpg
echo "处理: professional_wallpaper_installation_worker.jpg"
npx sharp -i "public/images/professional_wallpaper_installation_worker.jpg" -o "optimized-images/professional_wallpaper_installation_worker.webp" --webp --quality 85


echo "✅ 图片优化完成！"
echo "📁 优化后的图片保存在 optimized-images/ 目录"
echo "💡 请手动检查质量后替换原文件"
