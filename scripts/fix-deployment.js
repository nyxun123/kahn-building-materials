#!/usr/bin/env node

/**
 * 修复版Cloudflare Pages部署脚本
 * 解决Node.js兼容性问题
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔧 修复版Cloudflare Pages部署脚本');
console.log('═══════════════════════════════════════\n');

// 部署前检查
function preDeploymentChecks() {
  console.log('1️⃣ 部署前检查');
  console.log('──────────────────────────');
  
  const requiredFiles = [
    'functions/api/admin/products/[id].js',
    'src/pages/admin/product-edit.tsx',
    'src/pages/admin/refine/data-provider.ts',
    'functions/api/admin/home-content.js',
    'src/pages/admin/home-content.tsx'
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
  
  console.log('\n✅ 部署前检查完成\n');
}

// 修复wrangler配置
function fixWranglerConfig() {
  console.log('2️⃣ 修复wrangler配置');
  console.log('──────────────────────────');
  
  try {
    const wranglerPath = join(__dirname, 'wrangler.toml');
    let wranglerContent = readFileSync(wranglerPath, 'utf8');
    
    // 检查是否已包含compatibility_flags
    if (!wranglerContent.includes('compatibility_flags')) {
      // 在compatibility_date后添加compatibility_flags
      wranglerContent = wranglerContent.replace(
        'compatibility_date = "2024-01-01"',
        'compatibility_date = "2024-01-01"\ncompatibility_flags = ["nodejs_compat"]'
      );
      
      // 在生产环境部分也添加
      wranglerContent = wranglerContent.replace(
        '[env.production]',
        'compatibility_flags = ["nodejs_compat"]\n\n[env.production]'
      );
      
      writeFileSync(wranglerPath, wranglerContent);
      console.log('✅ wrangler.toml配置已更新，添加了nodejs_compat兼容性标志');
    } else {
      console.log('✅ wrangler.toml配置已包含nodejs_compat兼容性标志');
    }
    
  } catch (error) {
    console.error('❌ 修复wrangler配置失败:', error.message);
    process.exit(1);
  }
}

// 构建项目
function buildProject() {
  console.log('3️⃣ 构建项目');
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
  console.log('4️⃣ 部署到 Cloudflare Pages');
  console.log('──────────────────────────');
  
  try {
    console.log('🚀 开始部署...');
    execSync('npx wrangler pages deploy dist --project-name kahn-building-materials', { 
      stdio: 'inherit' 
    });
    
    console.log('✅ 部署完成\n');
  } catch (error) {
    console.error('❌ 部署失败:', error.message);
    console.log('\n💡 部署故障排除建议:');
    console.log('   1. 确保已设置CF_API_TOKEN环境变量');
    console.log('   2. 检查网络连接是否正常');
    console.log('   3. 确认Cloudflare账户权限');
    console.log('   4. 尝试手动运行: npx wrangler pages deploy dist --project-name kahn-building-materials');
    process.exit(1);
  }
}

// 生成部署报告
function generateDeploymentReport() {
  console.log('📋 部署报告');
  console.log('═══════════════════════════════════════');
  
  const report = {
    timestamp: new Date().toISOString(),
    version: '2.1.1-home-content-management-fix',
    changes: [
      '修复Node.js兼容性问题',
      '添加nodejs_compat兼容性标志',
      '保持原有功能完整性'
    ],
    deployment: {
      platform: 'Cloudflare Pages',
      project: 'kahn-building-materials',
      url: 'https://kn-wallpaperglue.com',
      admin_url: 'https://kn-wallpaperglue.com/admin',
      home_content_admin_url: 'https://kn-wallpaperglue.com/admin/home-content'
    }
  };
  
  console.log('🔧 修复内容:');
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
    
    // 2. 修复wrangler配置
    fixWranglerConfig();
    
    // 3. 构建项目
    buildProject();
    
    // 4. 部署到Cloudflare
    deployToCloudflare();
    
    // 5. 生成部署报告
    generateDeploymentReport();
    
    console.log('🎉 部署流程完成！');
    console.log('🔗 请访问 https://kn-wallpaperglue.com/admin 测试修复效果');
    
  } catch (error) {
    console.error('💥 部署流程异常:', error);
    process.exit(1);
  }
}

main();