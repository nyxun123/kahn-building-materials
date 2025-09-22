#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixExtensions(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      fixExtensions(fullPath);
    } else if (file.name.endsWith('.js')) {
      // 读取文件内容
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // 修复导入语句，添加.js扩展名
      content = content.replace(
        /from\s+['"](\.\/[^'"]+)['"]/g,
        'from "$1.js"'
      );
      
      content = content.replace(
        /from\s+['"](\.\.\/[^'"]+)['"]/g,
        'from "$1.js"'
      );
      
      // 写入修复后的内容
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ 修复文件: ${fullPath}`);
    }
  }
}

// 修复dist-backend目录中的所有文件
const backendDir = path.join(__dirname, '..', 'dist-backend');
if (fs.existsSync(backendDir)) {
  console.log('🔄 开始修复后端文件导入扩展名...');
  fixExtensions(backendDir);
  console.log('🎉 后端文件导入扩展名修复完成！');
} else {
  console.error('❌ dist-backend目录不存在，请先编译后端代码');
  process.exit(1);
}