#!/usr/bin/env node

/**
 * 简化的Cloudflare API配置工具
 * 适合在当前环境下使用
 */

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
  magenta: '\x1b[35m',
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

function logStep(step) {
  log(`🚀 ${step}`, colors.cyan);
}

function showSetupInstructions() {
  logHeader('🔧 Cloudflare API配置指南');

  log('\n📋 步骤1: 获取API Token', colors.cyan);
  log('1. 访问: https://dash.cloudflare.com', colors.blue);
  log('2. 右上角头像 → "My Profile"', colors.blue);
  log('3. 点击 "API Tokens" 标签页', colors.blue);
  log('4. 点击 "Create Token" → "Custom token"', colors.blue);
  log('5. 配置权限:', colors.blue);
  log('   - Token name: Auto Deploy Token', colors.yellow);
  log('   - Account permissions: Cloudflare Pages:Edit', colors.yellow);
  log('   - Account resources: Include All accounts', colors.yellow);
  log('6. 创建并复制Token', colors.blue);

  log('\n📋 步骤2: 获取Account ID', colors.cyan);
  log('1. 在Cloudflare Dashboard右侧边栏查看', colors.blue);
  log('2. 或者访问: https://dash.cloudflare.com/', colors.blue);
  log('3. Account ID会显示在右侧边栏', colors.blue);

  log('\n📋 步骤3: 配置环境变量', colors.cyan);
  log('请运行以下命令设置环境变量:', colors.blue);
  log('');
  log('export CF_API_TOKEN="your-api-token-here"', colors.yellow);
  log('export CF_ACCOUNT_ID="your-account-id-here"', colors.yellow);
  log('');
  log('然后添加到shell配置文件:', colors.blue);
  log('echo \'export CF_API_TOKEN="your-api-token-here"\' >> ~/.zshrc', colors.yellow);
  log('echo \'export CF_ACCOUNT_ID="your-account-id-here"\' >> ~/.zshrc', colors.yellow);
  log('source ~/.zshrc', colors.yellow);
  log('');
  log('或者如果你使用bash:', colors.blue);
  log('echo \'export CF_API_TOKEN="your-api-token-here"\' >> ~/.bash_profile', colors.yellow);
  log('echo \'export CF_ACCOUNT_ID="your-account-id-here"\' >> ~/.bash_profile', colors.yellow);
  log('source ~/.bash_profile', colors.yellow);

  log('\n📋 步骤4: 验证配置', colors.cyan);
  log('配置完成后运行:', colors.blue);
  log('node scripts/simple-cloudflare-setup.cjs --verify', colors.yellow);

  log('\n📋 步骤5: 测试自动部署', colors.cyan);
  log('运行智能自动部署器:', colors.blue);
  log('node scripts/smart-auto-deployer.cjs --force', colors.yellow);
}

function createConfigFiles(token, accountId) {
  logStep('创建配置文件');

  try {
    // 创建配置目录
    const configDir = path.join(process.env.HOME, '.cloudflare');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { mode: 0o700 });
      logSuccess(`创建配置目录: ${configDir}`);
    }

    // 保存Token
    const tokenFile = path.join(configDir, 'api-token');
    fs.writeFileSync(tokenFile, token, { mode: 0o600 });
    logSuccess(`API Token已保存: ${tokenFile}`);

    // 保存Account ID
    const accountIdFile = path.join(configDir, 'account-id');
    fs.writeFileSync(accountIdFile, accountId, { mode: 0o600 });
    logSuccess(`Account ID已保存: ${accountIdFile}`);

    return true;
  } catch (error) {
    logError(`创建配置文件失败: ${error.message}`);
    return false;
  }
}

function verifyConfig() {
  logStep('验证Cloudflare API配置');

  const token = process.env.CF_API_TOKEN;
  const accountId = process.env.CF_ACCOUNT_ID;

  if (!token || !accountId) {
    logError('未检测到Cloudflare API配置');
    logInfo('请先设置环境变量:');
    log('export CF_API_TOKEN="your-api-token-here"', colors.yellow);
    log('export CF_ACCOUNT_ID="your-account-id-here"', colors.yellow);
    return false;
  }

  logSuccess('✅ 检测到Cloudflare API配置');
  logInfo(`Token: ${token.substring(0, 10)}...`);
  logInfo(`Account ID: ${accountId}`);

  // 测试智能自动部署器
  try {
    const { SmartAutoDeployer } = require('./smart-auto-deployer.cjs');
    const deployer = new SmartAutoDeployer();

    if (deployer.cloudflareToken && deployer.accountId) {
      logSuccess('✅ 智能自动部署器配置正确');
      logSuccess('🎉 配置完成！现在可以运行完全自动化部署了');
      log('');
      log('测试命令:', colors.cyan);
      log('node scripts/smart-auto-deployer.cjs --force --reason="测试API配置"', colors.yellow);
      return true;
    } else {
      logWarning('智能自动部署器配置不完整');
      return false;
    }
  } catch (error) {
    logError(`验证失败: ${error.message}`);
    return false;
  }
}

// 显示标题
function logHeader(title) {
  log(`\n${'='.repeat(80)}`, colors.bright);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(80)}`, colors.bright);
}

// 主函数
function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    logHeader('🔧 简化Cloudflare API配置工具');

    log('\n📋 用法:', colors.cyan);
    log('  node scripts/simple-cloudflare-setup.cjs              - 显示配置指南', colors.blue);
    log('  node scripts/simple-cloudflare-setup.cjs --verify    - 验证配置', colors.blue);

    return;
  }

  if (args.includes('--verify')) {
    logHeader('🔍 验证Cloudflare API配置');
    verifyConfig();
    return;
  }

  showSetupInstructions();
}

if (require.main === module) {
  main();
}

module.exports = { showSetupInstructions, createConfigFiles, verifyConfig };