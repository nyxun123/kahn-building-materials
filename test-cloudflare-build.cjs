#!/usr/bin/env node

/**
 * 测试 Cloudflare Pages 构建脚本
 * 这个脚本会模拟 Cloudflare Pages 的构建过程
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始测试 Cloudflare Pages 构建...');

try {
  // 1. 清理之前的构建
  console.log('📦 清理之前的构建文件...');
  if (fs.existsSync('dist')) {
    execSync('rm -rf dist', { stdio: 'inherit' });
  }

  // 2. 运行构建命令
  console.log('🔨 运行构建命令...');
  execSync('pnpm run build:cloudflare', { stdio: 'inherit' });

  // 3. 检查构建结果
  console.log('🔍 检查构建结果...');
  
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('构建失败：dist 目录不存在');
  }

  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('构建失败：index.html 不存在');
  }

  const redirectsPath = path.join(distPath, '_redirects');
  if (!fs.existsSync(redirectsPath)) {
    console.warn('⚠️  警告：_redirects 文件不存在，SPA 路由可能不工作');
  }

  // 4. 检查资源文件
  const assetsPath = path.join(distPath, 'assets');
  if (fs.existsSync(assetsPath)) {
    const assets = fs.readdirSync(assetsPath);
    console.log(`📁 找到 ${assets.length} 个资源文件`);
  }

  // 5. 检查图片文件
  const imagesPath = path.join(distPath, 'images');
  if (fs.existsSync(imagesPath)) {
    const images = fs.readdirSync(imagesPath);
    console.log(`🖼️  找到 ${images.length} 个图片文件`);
  }

  console.log('✅ 构建测试成功！');
  console.log('📋 构建结果摘要：');
  console.log(`   - 输出目录: ${distPath}`);
  console.log(`   - 主页文件: ${fs.existsSync(indexPath) ? '✅' : '❌'} index.html`);
  console.log(`   - 路由配置: ${fs.existsSync(redirectsPath) ? '✅' : '❌'} _redirects`);
  console.log('');
  console.log('🎉 您的项目已准备好部署到 Cloudflare Pages！');
  console.log('📖 请参考 CLOUDFLARE_DEPLOYMENT.md 了解部署步骤。');

} catch (error) {
  console.error('❌ 构建测试失败：', error.message);
  process.exit(1);
}