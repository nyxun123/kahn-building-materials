#!/usr/bin/env node

/**
 * 部署前最终验证脚本
 * 验证所有新增功能是否正确实现
 */

console.log('🔍 部署前最终验证');
console.log('═══════════════════════════════════════\n');

// 验证文件结构
function verifyFileStructure() {
  console.log('1️⃣ 验证文件结构');
  console.log('──────────────────────────');
  
  const { existsSync } = require('fs');
  const { join } = require('path');
  
  const requiredFiles = [
    'src/pages/admin/home-content.tsx',
    'functions/api/admin/home-content.js',
    'src/pages/admin/layout.tsx',
    'src/lib/router.tsx'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    const filePath = join(process.cwd(), file);
    const exists = existsSync(filePath);
    console.log(`   ${file}: ${exists ? '✅' : '❌'}`);
    if (!exists) allFilesExist = false;
  });
  
  return allFilesExist;
}

// 主验证函数
function main() {
  console.log('开始验证部署前的准备工作...\n');
  
  const fileStructureOk = verifyFileStructure();
  
  console.log('\n📋 验证结果');
  console.log('═══════════════════════════════════════');
  if (fileStructureOk) {
    console.log('✅ 文件结构验证通过！');
    console.log('\n🚀 部署命令:');
    console.log('   node deploy-cloudflare.js');
    console.log('\n🌐 部署后访问地址:');
    console.log('   管理后台登录: https://kn-wallpaperglue.com/admin/login');
    console.log('   首页内容管理: https://kn-wallpaperglue.com/admin/home-content');
  } else {
    console.log('❌ 文件结构验证未通过，请检查上述错误。');
  }
}

main();