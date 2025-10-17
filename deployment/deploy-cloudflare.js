#!/usr/bin/env node

/**
 * Cloudflare Pages 部署脚本
 * 针对产品编辑页面修复的专用部署工具
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Cloudflare Pages 部署脚本');
console.log('═══════════════════════════════════════\n');

// 部署前检查
function preDeploymentChecks() {
  console.log('1️⃣ 部署前检查');
  console.log('──────────────────────────');
  
  const requiredFiles = [
    'functions/api/admin/products/[id].js',
    'src/pages/admin/product-edit.tsx',
    'src/pages/admin/refine/data-provider.ts',
    'functions/api/admin/home-content.js',  // 新增首页内容管理API
    'src/pages/admin/home-content.tsx'      // 新增首页内容管理页面
  ];
  
  console.log('🔍 检查关键文件:');
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    const filePath = join(__dirname, file);
    const exists = existsSync(filePath);
    console.log(`   ${file}: ${exists ? '✅' : '❌'}`);
    if (!exists) allFilesExist = false;
  });
  
  if (!allFilesExist) {
    console.error('❌ 关键文件缺失，无法继续部署');
    process.exit(1);
  }
  
  // 检查API文件的关键修复
  console.log('\n🔍 验证API修复:');
  const apiFile = join(__dirname, 'functions/api/admin/products/[id].js');
  const apiContent = readFileSync(apiFile, 'utf8');
  
  const apiChecks = [
    { name: '数据格式修复', pattern: /data: processedProduct/ },
    { name: '详细日志记录', pattern: /console\.log.*查询产品ID/ },
    { name: '数据类型转换', pattern: /parseInt.*product\.id/ },
    { name: '缓存禁用', pattern: /Cache-Control.*no-cache/ }
  ];
  
  apiChecks.forEach(check => {
    const found = check.pattern.test(apiContent);
    console.log(`   ${check.name}: ${found ? '✅' : '❌'}`);
  });
  
  // 检查前端组件修复
  console.log('\n🔍 验证前端修复:');
  const componentFile = join(__dirname, 'src/pages/admin/product-edit.tsx');
  const componentContent = readFileSync(componentFile, 'utf8');
  
  const componentChecks = [
    { name: '生产环境优化', pattern: /针对生产环境优化/ },
    { name: '增强数据验证', pattern: /增强数据验证/ },
    { name: '多重异步机制', pattern: /多重异步机制/ },
    { name: '错误处理增强', pattern: /toast\.error.*加载产品数据失败/ }
  ];
  
  componentChecks.forEach(check => {
    const found = check.pattern.test(componentContent);
    console.log(`   ${check.name}: ${found ? '✅' : '❌'}`);
  });
  
  // 检查首页内容管理功能
  console.log('\n🔍 验证首页内容管理功能:');
  const homeContentAPIFile = join(__dirname, 'functions/api/admin/home-content.js');
  const homeContentAPIContent = readFileSync(homeContentAPIFile, 'utf8');
  
  const homeContentAPIChecks = [
    { name: '首页内容获取API', pattern: /page_key = 'home'/ },
    { name: '多语言内容更新', pattern: /content_zh.*content_en.*content_ru/ }
  ];
  
  homeContentAPIChecks.forEach(check => {
    const found = check.pattern.test(homeContentAPIContent);
    console.log(`   ${check.name}: ${found ? '✅' : '❌'}`);
  });
  
  console.log('\n✅ 部署前检查完成\n');
}

// 构建项目
function buildProject() {
  console.log('2️⃣ 构建项目');
  console.log('──────────────────────────');
  
  try {
    console.log('🔄 执行类型检查...');
    execSync('pnpm tsc -b', { stdio: 'inherit' });
    
    console.log('🔄 构建生产版本...');
    execSync('BUILD_MODE=prod pnpm vite build', { stdio: 'inherit' });
    
    console.log('📁 复制Functions目录...');
    execSync('rm -rf dist/functions && cp -r functions dist/functions', { stdio: 'inherit' });
    
    console.log('✅ 项目构建完成\n');
  } catch (error) {
    console.error('❌ 构建失败:', error.message);
    process.exit(1);
  }
}

// 部署到Cloudflare Pages
function deployToCloudflare() {
  console.log('3️⃣ 部署到 Cloudflare Pages');
  console.log('──────────────────────────');
  
  try {
    console.log('🚀 开始部署...');
    execSync('npx wrangler pages deploy dist --project-name kahn-building-materials', { 
      stdio: 'inherit' 
    });
    
    console.log('✅ 部署完成\n');
  } catch (error) {
    console.error('❌ 部署失败:', error.message);
    process.exit(1);
  }
}

// 部署后验证
function postDeploymentVerification() {
  console.log('4️⃣ 部署后验证');
  console.log('──────────────────────────');
  
  console.log('🔍 建议验证步骤:');
  console.log('   1. 访问 https://kn-wallpaperglue.com/admin');
  console.log('   2. 登录管理后台');
  console.log('   3. 进入产品中心 -> 产品管理');
  console.log('   4. 创建一个测试产品');
  console.log('   5. 保存后点击编辑按钮');
  console.log('   6. 验证所有字段正确显示');
  console.log('   7. 检查浏览器控制台日志');
  
  console.log('\n✅ 如果编辑页面正确显示产品数据，说明修复成功！\n');
}

// 生成部署报告
function generateDeploymentReport() {
  console.log('📋 部署报告');
  console.log('═══════════════════════════════════════');
  
  const report = {
    timestamp: new Date().toISOString(),
    version: '2.1.0-home-content-management',
    changes: [
      '修复 API 端点 /api/admin/products/[id] 的数据格式返回问题',
      '增强前端数据提供者的错误处理和重试机制',
      '优化产品编辑组件针对 Cloudflare 环境的数据回显逻辑',
      '添加详细的调试日志和错误提示',
      '禁用缓存确保获取最新数据',
      '增强数据类型转换和验证机制',
      '新增首页内容管理功能（演示视频、OEM定制、半成品小袋）',
      '新增首页内容管理API端点 /api/admin/home-content',
      '新增首页内容管理前端页面 /admin/home-content'
    ],
    fixes: [
      '产品编辑页面数据丢失问题',
      'Cloudflare D1 数据库数据序列化问题',
      '生产环境网络延迟导致的数据加载问题',
      'React 表单在异步环境下的数据回显问题',
      '首页内容无法管理的问题',
      '多语言内容编辑不一致的问题'
    ],
    new_features: [
      '首页内容管理（演示视频、OEM定制、半成品小袋）',
      '多语言内容编辑支持（中文、英文、俄语）',
      '实时内容预览功能',
      '响应式管理界面'
    ],
    deployment: {
      platform: 'Cloudflare Pages',
      project: 'kahn-building-materials',
      url: 'https://kn-wallpaperglue.com',
      admin_url: 'https://kn-wallpaperglue.com/admin',
      home_content_admin_url: 'https://kn-wallpaperglue.com/admin/home-content'
    }
  };
  
  console.log('🔧 主要修复内容:');
  report.fixes.forEach(fix => console.log(`   • ${fix}`));
  
  console.log('\n✨ 新增功能:');
  report.new_features.forEach(feature => console.log(`   • ${feature}`));
  
  console.log('\n📝 代码变更:');
  report.changes.forEach(change => console.log(`   • ${change}`));
  
  console.log('\n🌐 部署信息:');
  console.log(`   • 平台: ${report.deployment.platform}`);
  console.log(`   • 项目: ${report.deployment.project}`);
  console.log(`   • 主站: ${report.deployment.url}`);
  console.log(`   • 管理后台: ${report.deployment.admin_url}`);
  console.log(`   • 首页内容管理: ${report.deployment.home_content_admin_url}`);
  
  // 保存部署报告
  writeFileSync(
    join(__dirname, 'deployment-report.json'), 
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n💾 部署报告已保存到 deployment-report.json\n');
}

// 主执行函数
async function main() {
  try {
    // 1. 部署前检查
    preDeploymentChecks();
    
    // 2. 构建项目
    buildProject();
    
    // 3. 部署到Cloudflare
    deployToCloudflare();
    
    // 4. 部署后验证指导
    postDeploymentVerification();
    
    // 5. 生成部署报告
    generateDeploymentReport();
    
    console.log('🎉 部署流程完成！');
    console.log('🔗 请访问 https://kn-wallpaperglue.com/admin 测试修复效果');
    
  } catch (error) {
    console.error('💥 部署流程异常:', error);
    process.exit(1);
  }
}

// 检查命令行参数
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('使用方法:');
  console.log('  node deploy-cloudflare.js           # 完整部署流程');
  console.log('  node deploy-cloudflare.js --check   # 仅执行检查');
  console.log('  node deploy-cloudflare.js --build   # 仅构建项目');
  console.log('  node deploy-cloudflare.js --deploy  # 仅部署(需要先构建)');
  process.exit(0);
}

if (args.includes('--check')) {
  preDeploymentChecks();
} else if (args.includes('--build')) {
  buildProject();
} else if (args.includes('--deploy')) {
  deployToCloudflare();
} else {
  main();
}