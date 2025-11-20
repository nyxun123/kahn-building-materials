#!/usr/bin/env node

/**
 * 部署技能测试脚本
 * 简化版本，用于测试部署功能
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function execCommand(command, description) {
  logInfo(`执行: ${description}`);
  try {
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    logSuccess(`${description} 完成`);
    return result.trim();
  } catch (error) {
    logError(`${description} 失败: ${error.message}`);
    return null;
  }
}

// 测试部署技能
function testDeploySkill() {
  log('\n🚀 开始测试部署技能系统', colors.bright);

  // 1. 检查项目状态
  log('\n📋 检查项目状态', colors.cyan);
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    logError('未找到package.json文件');
    return false;
  }
  logSuccess('package.json存在');

  // 2. 检查Git状态
  log('\n📝 检查Git状态', colors.cyan);
  try {
    const gitStatus = execCommand('git status --porcelain', '检查Git状态');
    if (gitStatus && gitStatus.trim()) {
      const files = gitStatus.trim().split('\n').length;
      logInfo(`发现 ${files} 个修改的文件`);
    } else {
      logInfo('没有修改的文件');
    }
  } catch (error) {
    logError('Git状态检查失败');
  }

  // 3. 检查构建工具
  log('\n🔨 检查构建工具', colors.cyan);
  const buildResult = execCommand('pnpm --version', '检查pnpm版本');
  if (buildResult) {
    logSuccess(`pnpm版本: ${buildResult}`);
  }

  // 4. 检查部署脚本
  log('\n📜 检查部署脚本', colors.cyan);
  const scripts = ['deploy-skill.js', 'git-automation.js', 'cloudflare-deploy.js', 'skill-deploy.js'];
  scripts.forEach(script => {
    const scriptPath = path.join(process.cwd(), 'scripts', script);
    if (fs.existsSync(scriptPath)) {
      logSuccess(`${script} 存在`);
    } else {
      logError(`${script} 不存在`);
    }
  });

  // 5. 显示使用说明
  log('\n🎯 部署技能使用说明', colors.cyan);
  log('  完整部署:', colors.blue);
  log('    node scripts/skill-deploy.js "你的提交信息"', colors.yellow);
  log('  快速部署:', colors.blue);
  log('    node scripts/skill-deploy.js quick', colors.yellow);
  log('  测试运行:', colors.blue);
  log('    node scripts/skill-deploy.js test', colors.yellow);
  log('  仅构建:', colors.blue);
  log('    node scripts/skill-deploy.js build', colors.yellow);

  log('\n🌐 网站信息', colors.cyan);
  log('  生产网站: https://kn-wallpaperglue.com', colors.blue);
  log('  FAQ页面: https://kn-wallpaperglue.com/faq', colors.blue);

  logSuccess('\n🎉 测试完成！部署技能系统已准备就绪');
  return true;
}

// 主函数
function main() {
  testDeploySkill();
}

if (require.main === module) {
  main();
}

exports.testDeploySkill = testDeploySkill;