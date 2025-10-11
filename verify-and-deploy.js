#!/usr/bin/env node

/**
 * 🚀 部署前的最终验证和部署指南
 * 确保所有修复都正确应用
 */

import fs from 'fs';
import path from 'path';

function verifyFixesAndDeployment() {
    console.log('🚀 部署前的最终验证和部署指南');
    console.log('═══════════════════════════════════════');
    console.log('');

    // 1. 验证本地修复文件
    console.log('1️⃣ 验证本地修复文件');
    console.log('──────────────────────────');
    
    const criticalFiles = [
        'functions/api/upload-image.js',
        'functions/api/admin/products.js',
        'functions/api/admin/products/[id].js',
        'src/pages/admin/product-edit.tsx'
    ];
    
    criticalFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            console.log(`✅ ${file} - 最后修改: ${stats.mtime.toLocaleString()}`);
        } else {
            console.log(`❌ ${file} - 文件不存在`);
        }
    });

    // 2. 检查构建配置
    console.log('');
    console.log('2️⃣ 检查构建配置');
    console.log('──────────────────────────');
    
    // 检查package.json构建脚本
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        console.log('📦 构建脚本:');
        if (packageJson.scripts.build) {
            console.log(`   build: ${packageJson.scripts.build}`);
        }
        if (packageJson.scripts['build:functions']) {
            console.log(`   build:functions: ${packageJson.scripts['build:functions']}`);
        }
    }

    // 3. 验证Functions目录结构
    console.log('');
    console.log('3️⃣ 验证Functions目录结构');
    console.log('──────────────────────────');
    
    const functionsDir = path.join(process.cwd(), 'functions');
    if (fs.existsSync(functionsDir)) {
        console.log('✅ functions目录存在');
        
        // 检查关键API文件
        const apiFiles = [
            'functions/api/upload-image.js',
            'functions/api/admin/products.js',
            'functions/api/admin/products/[id].js'
        ];
        
        apiFiles.forEach(file => {
            const fullPath = path.join(process.cwd(), file);
            if (fs.existsSync(fullPath)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                
                // 检查关键修复内容
                if (file.includes('upload-image.js')) {
                    const hasJsonSupport = content.includes('application/json');
                    console.log(`   ${file}: ${hasJsonSupport ? '✅ 支持JSON格式' : '❌ 缺少JSON支持'}`);
                } else if (file.includes('products.js')) {
                    const hasSuccessField = content.includes('success: true');
                    console.log(`   ${file}: ${hasSuccessField ? '✅ 有success字段' : '❌ 缺少success字段'}`);
                }
            } else {
                console.log(`   ${file}: ❌ 文件不存在`);
            }
        });
    } else {
        console.log('❌ functions目录不存在');
    }

    console.log('');
    console.log('🔧 部署步骤指南');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('1. 构建项目:');
    console.log('   npm run build');
    console.log('');
    console.log('2. 复制Functions到构建目录:');
    console.log('   cp -r functions dist/functions');
    console.log('');
    console.log('3. 部署到Cloudflare Pages:');
    console.log('   - 将dist目录内容上传到Cloudflare Pages');
    console.log('   - 或使用Git推送触发自动部署');
    console.log('');
    console.log('4. 验证部署:');
    console.log('   - 访问管理后台登录页面');
    console.log('   - 测试产品创建和编辑功能');
    console.log('   - 测试图片上传功能');
    console.log('');
    console.log('💡 重要提示:');
    console.log('   • 确保Functions目录在构建输出中');
    console.log('   • 检查Cloudflare Pages环境变量设置');
    console.log('   • 验证D1数据库绑定正确');
    console.log('   • 确认R2存储桶配置正确');
    
    // 4. 生成修复后的测试命令
    console.log('');
    console.log('🧪 部署后测试命令');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('部署完成后，运行以下命令验证修复效果:');
    console.log('node comprehensive-deployment-test.js');
    console.log('');
    console.log('预期结果:');
    console.log('✅ 图片上传功能：支持JSON格式');
    console.log('✅ 产品创建功能：正常');
    console.log('✅ 数据回显功能：正常');
    console.log('✅ 产品更新功能：正常');
    console.log('✅ 产品列表功能：正常');
    
    console.log('');
    console.log('🏁 验证完成');
}

// 运行验证
verifyFixesAndDeployment();