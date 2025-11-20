#!/usr/bin/env node

/**
 * 强制触发部署技能
 * 当Cloudflare Pages需要手动触发构建时使用
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

class ForceDeploymentTrigger {
  constructor() {
    this.deployReason = 'Force trigger Cloudflare Pages build for SEO deployment';
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  }

  // 创建临时文件来触发变更
  async createTriggerFile() {
    logStep('创建部署触发文件');

    const triggerFile = path.join(process.cwd(), 'public', '.deployment-trigger');
    const content = `# Deployment Trigger
# Generated: ${new Date().toISOString()}
# Reason: ${this.deployReason}
# This file will trigger Cloudflare Pages build
`;

    try {
      fs.writeFileSync(triggerFile, content);
      logSuccess(`触发文件已创建: ${triggerFile}`);
      return true;
    } catch (error) {
      logError(`创建触发文件失败: ${error.message}`);
      return false;
    }
  }

  // 执行完整的自动部署流程
  async forceDeploy() {
    logStep('强制触发Cloudflare Pages构建');

    logInfo('部署原因:', this.deployReason);
    logInfo('时间戳:', this.timestamp);

    // 1. 创建触发文件
    const triggerCreated = await this.createTriggerFile();
    if (!triggerCreated) {
      return false;
    }

    // 2. 运行自动部署技能
    logStep('运行自动部署技能');
    try {
      const autoDeployScript = path.join(process.cwd(), 'scripts', 'auto-deploy-skill.cjs');

      // 设置环境变量强制部署
      process.env.FORCE_DEPLOY = 'true';
      process.env.DEPLOY_REASON = this.deployReason;

      const result = execSync(`node "${autoDeployScript}" --force --reason="${this.deployReason}"`, {
        encoding: 'utf8',
        stdio: 'inherit',
        timeout: 300000 // 5分钟超时
      });

      logSuccess('自动部署执行完成');
      return true;

    } catch (error) {
      logError(`自动部署执行失败: ${error.message}`);

      // 提供手动操作指导
      logInfo('\n手动操作指导:');
      log('1. 创建触发文件已生成，请提交:', colors.yellow);
      log('   git add public/.deployment-trigger', colors.cyan);
      log('   git commit -m "force: trigger Cloudflare Pages build"', colors.cyan);
      log('   git push origin main', colors.cyan);
      log('2. 在Cloudflare Dashboard手动触发构建', colors.yellow);
      log('3. 构建完成后运行验证:', colors.yellow);
      log('   node scripts/quick-verify-deployment.cjs', colors.cyan);

      return false;
    }
  }

  // 清理触发文件
  async cleanup() {
    const triggerFile = path.join(process.cwd(), 'public', '.deployment-trigger');
    try {
      if (fs.existsSync(triggerFile)) {
        fs.unlinkSync(triggerFile);
        logSuccess('触发文件已清理');
      }
    } catch (error) {
      logWarning(`清理触发文件失败: ${error.message}`);
    }
  }

  // 验证部署结果
  async verifyDeployment() {
    logStep('验证部署结果');

    // 等待部署开始
    await new Promise(resolve => setTimeout(resolve, 5000));

    try {
      const verifyScript = path.join(process.cwd(), 'scripts', 'quick-verify-deployment.cjs');
      execSync(`node "${verifyScript}"`, { encoding: 'utf8', stdio: 'inherit' });
      return true;
    } catch (error) {
      logError(`验证部署失败: ${error.message}`);
      return false;
    }
  }
}

// 显示标题
function logHeader(title) {
  log(`\n${'='.repeat(80)}`, colors.bright);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(80)}`, colors.bright);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    logHeader('🚀 强制部署触发器使用说明');

    log('\n📋 用法:', colors.cyan);
    log('  node scripts/force-trigger-deployment.cjs              - 强制触发部署', colors.blue);
    log('  node scripts/force-trigger-deployment.cjs --verify    - 触发部署并验证', colors.blue);

    log('\n🎯 功能:', colors.cyan);
    log('  ✅ 创建触发文件强制Cloudflare Pages构建', colors.green);
    log('  ✅ 自动提交并推送变更', colors.green);
    log('  ✅ 验证部署结果', colors.green);
    log('  ✅ 详细的执行报告', colors.green);

    return;
  }

  logHeader('🚀 强制触发Cloudflare Pages构建');

  const trigger = new ForceDeploymentTrigger();

  try {
    // 执行强制部署
    const deploySuccess = await trigger.forceDeploy();

    if (deploySuccess) {
      logSuccess('强制部署触发成功！');

      if (args.includes('--verify')) {
        // 等待构建开始
        logInfo('等待Cloudflare Pages开始构建...');
        await new Promise(resolve => setTimeout(resolve, 30000)); // 30秒

        // 验证部署结果
        await trigger.verifyDeployment();
      } else {
        logInfo('部署已触发，请等待Cloudflare Pages构建完成');
        logInfo('构建完成后运行以下命令验证:');
        log('  node scripts/quick-verify-deployment.cjs', colors.cyan);
      }
    } else {
      logError('强制部署触发失败');
      process.exit(1);
    }

  } catch (error) {
    logError(`执行过程中发生错误: ${error.message}`);
    process.exit(1);
  } finally {
    // 清理临时文件
    await trigger.cleanup();
  }
}

if (require.main === module) {
  main();
}

module.exports = { ForceDeploymentTrigger };