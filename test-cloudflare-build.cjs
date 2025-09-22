// Cloudflare Pages 构建兼容性测试
const fs = require('fs');
const path = require('path');

console.log('🧪 开始 Cloudflare Pages 构建兼容性测试...');

// 检查必需的文件
const requiredFiles = [
  'dist/index.html',
  'wrangler.toml',
  'public/_worker.js'
];

let hasErrors = false;

console.log('📁 检查必需文件...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - 存在`);
  } else {
    console.log(`❌ ${file} - 缺失`);
    hasErrors = true;
  }
});

// 检查 wrangler.toml 配置
console.log('\n⚙️ 检查 wrangler.toml 配置...');
try {
  const wranglerContent = fs.readFileSync(path.join(__dirname, 'wrangler.toml'), 'utf8');
  
  if (wranglerContent.includes('pages_build_output_dir')) {
    console.log('✅ pages_build_output_dir - 已配置');
  } else {
    console.log('❌ pages_build_output_dir - 缺失');
    hasErrors = true;
  }
  
  if (wranglerContent.includes('d1_databases')) {
    console.log('✅ D1 数据库绑定 - 已配置');
  } else {
    console.log('❌ D1 数据库绑定 - 缺失');
    hasErrors = true;
  }
} catch (error) {
  console.log('❌ wrangler.toml 读取失败:', error.message);
  hasErrors = true;
}

// 检查 Worker 文件
console.log('\n🔧 检查 Worker 配置...');
try {
  const workerPath = path.join(__dirname, 'public/_worker.js');
  if (fs.existsSync(workerPath)) {
    const workerContent = fs.readFileSync(workerPath, 'utf8');
    
    if (workerContent.includes('export default')) {
      console.log('✅ Worker export - 正确');
    } else {
      console.log('❌ Worker export - 缺失或格式错误');
      hasErrors = true;
    }
    
    if (workerContent.includes('/api/contact')) {
      console.log('✅ API 路由 - 已定义');
    } else {
      console.log('❌ API 路由 - 缺失');
      hasErrors = true;
    }
  }
} catch (error) {
  console.log('❌ Worker 文件检查失败:', error.message);
  hasErrors = true;
}

// 检查构建输出
console.log('\n📦 检查构建输出...');
try {
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log(`✅ dist 目录包含 ${files.length} 个文件`);
    
    const jsFiles = files.filter(f => f.endsWith('.js'));
    const cssFiles = files.filter(f => f.endsWith('.css'));
    
    console.log(`  - JavaScript 文件: ${jsFiles.length}`);
    console.log(`  - CSS 文件: ${cssFiles.length}`);
  } else {
    console.log('❌ dist 目录不存在');
    hasErrors = true;
  }
} catch (error) {
  console.log('❌ 构建输出检查失败:', error.message);
  hasErrors = true;
}

console.log('\n🎯 测试总结:');
if (hasErrors) {
  console.log('❌ 发现问题，需要修复后再部署');
  process.exit(1);
} else {
  console.log('✅ 所有检查通过，可以部署到 Cloudflare Pages');
  process.exit(0);
}
