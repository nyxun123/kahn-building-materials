#!/usr/bin/env node

// 检查部署配置的脚本
import fs from 'fs';
import path from 'path';

console.log('🔍 检查 Cloudflare Pages 部署配置...\n');

// 检查 .pages.toml 文件
const pagesConfigPath = '.pages.toml';
if (fs.existsSync(pagesConfigPath)) {
  console.log('✅ .pages.toml 文件存在');
  const content = fs.readFileSync(pagesConfigPath, 'utf8');
  if (content.includes('pnpm install && pnpm run build')) {
    console.log('✅ 构建命令配置正确');
  } else {
    console.log('❌ 构建命令配置错误');
  }
  if (content.includes('publish = "dist"')) {
    console.log('✅ 输出目录配置正确');
  } else {
    console.log('❌ 输出目录配置错误');
  }
} else {
  console.log('❌ .pages.toml 文件不存在');
}

// 检查 package.json
const packageJsonPath = 'package.json';
if (fs.existsSync(packageJsonPath)) {
  console.log('✅ package.json 文件存在');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log('✅ build 脚本存在');
  } else {
    console.log('❌ build 脚本不存在');
  }
} else {
  console.log('❌ package.json 文件不存在');
}

// 检查 dist 目录
if (fs.existsSync('dist')) {
  console.log('✅ dist 目录存在（本地构建成功）');
} else {
  console.log('❌ dist 目录不存在（需要先本地构建）');
}

console.log('\n📋 下一步操作：');
console.log('1. 如果本地配置都正确，问题在 Cloudflare Pages 控制台设置');
console.log('2. 请按照 deploy-to-cloudflare.md 文件中的步骤操作');
console.log('3. 关键是要在控制台中设置正确的构建命令和环境变量');
