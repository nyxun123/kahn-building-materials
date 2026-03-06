#!/bin/bash

echo "=========================================="
echo "BMAD 系统集成验证"
echo "=========================================="
echo ""

# 检查核心目录
echo "📁 检查核心目录结构..."
if [ -d "_bmad" ]; then
    echo "✅ _bmad/ 目录存在"
else
    echo "❌ _bmad/ 目录缺失"
    exit 1
fi

if [ -d "_bmad-output" ]; then
    echo "✅ _bmad-output/ 目录存在"
else
    echo "❌ _bmad-output/ 目录缺失"
    exit 1
fi

# 检查关键子目录
echo ""
echo "📂 检查子目录..."
required_dirs=(
    "_bmad/_config"
    "_bmad/core"
    "_bmad/bmm"
    "_bmad/core/agents"
    "_bmad/core/workflows"
    "_bmad/bmm/workflows"
    "_bmad/bmm/agents"
    "_bmad/bmm/testarch"
    "_bmad-output/planning-artifacts"
    "_bmad-output/implementation-artifacts"
)

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir"
    else
        echo "❌ $dir 缺失"
    fi
done

# 检查配置文件
echo ""
echo "⚙️  检查配置文件..."
if [ -f "_bmad/core/config.yaml" ]; then
    echo "✅ _bmad/core/config.yaml"
    grep "project_name" _bmad/bmm/config.yaml && echo "   项目配置已设置"
else
    echo "❌ _bmad/core/config.yaml 缺失"
fi

if [ -f "_bmad/bmm/config.yaml" ]; then
    echo "✅ _bmad/bmm/config.yaml"
else
    echo "❌ _bmad/bmm/config.yaml 缺失"
fi

# 检查清单文件
echo ""
echo "📋 检查清单文件..."
manifests=(
    "_bmad/_config/workflow-manifest.csv"
    "_bmad/_config/agent-manifest.csv"
    "_bmad/_config/task-manifest.csv"
)

for manifest in "${manifests[@]}"; do
    if [ -f "$manifest" ]; then
        count=$(wc -l < "$manifest")
        echo "✅ $manifest ($count 行)"
    else
        echo "❌ $manifest 缺失"
    fi
done

# 统计工作流数量
echo ""
echo "🔢 统计信息..."
workflow_count=$(find _bmad -name "workflow.md" -o -name "workflow.yaml" | wc -l)
echo "工作流数量: $workflow_count"

agent_count=$(find _bmad -path "*/agents/*" -name "*.yaml" | wc -l)
echo "代理配置数量: $agent_count"

step_count=$(find _bmad -name "step-*.md" | wc -l)
echo "步骤文件数量: $step_count"

# 检查文档更新
echo ""
echo "📖 检查文档更新..."
if grep -q "BMAD 多代理协作开发系统" CLAUDE.md; then
    echo "✅ CLAUDE.md 已更新 BMAD 说明"
else
    echo "⚠️  CLAUDE.md 可能未更新"
fi

if [ -f "BMAD快速入门.md" ]; then
    echo "✅ BMAD快速入门.md 已创建"
else
    echo "⚠️  BMAD快速入门.md 未找到"
fi

echo ""
echo "=========================================="
echo "✅ BMAD 系统集成验证完成！"
echo "=========================================="
echo ""
echo "📚 快速开始："
echo "   1. 阅读 BMAD快速入门.md"
echo "   2. 选择工作流开始使用"
echo "   3. 查看 _bmad/bmm/workflows/ 了解所有可用工作流"
echo ""
