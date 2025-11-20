#!/usr/bin/env node

/**
 * 技能部署主控脚本
 * 统一管理Git操作、构建、部署和缓存清理
 * 提供一键部署技能和完整的工作流程
 */

const { GitAutomation } = require('./git-automation');
const { CloudflareDeployer } = require('./cloudflare-deploy');
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

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logStep(step) {
  log(`🚀 ${step}`, colors.cyan);
}

function logHeader(title) {
  log(`\n${'='.repeat(60)}`, colors.bright);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(60)}`, colors.bright);
}

class SkillDeployer {
  constructor() {
    this.git = new GitAutomation();
    this.cloudflare = new CloudflareDeployer();
    this.projectRoot = process.cwd();
    this.startTime = Date.now();

    // 部署选项
    this.options = {
      commitMessage: null,
      skipGit: false,
      skipBuild: false,
      skipDeploy: false,
      skipCache: false,
      skipVerify: false,
      force: false,
      dryRun: false
    };
  }

  // 解析命令行参数
  parseArgs(args) {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      switch (arg) {
        case '--message':
        case '-m':
          this.options.commitMessage = args[++i];
          break;
        case '--skip-git':
          this.options.skipGit = true;
          break;
        case '--skip-build':
          this.options.skipBuild = true;
          break;
        case '--skip-deploy':
          this.options.skipDeploy = true;
          break;
        case '--skip-cache':
          this.options.skipCache = true;
          break;
        case '--skip-verify':
          this.options.skipVerify = true;
          break;
        case '--force':
        case '-f':
          this.options.force = true;
          break;
        case '--dry-run':
          this.options.dryRun = true;
          break;
        case '--help':
        case '-h':
          this.showHelp();
          process.exit(0);
          break;
        default:
          if (!arg.startsWith('--')) {
            this.options.commitMessage = arg;
          }
          break;
      }
    }
  }

  // 显示帮助信息
  showHelp() {
    logHeader('🛠️  技能部署脚本使用说明');

    log('\n📋 基本用法:', colors.cyan);
    log('  node scripts/skill-deploy.js [提交信息] [选项]', colors.blue);

    log('\n🎯 主要命令:', colors.cyan);
    log('  deploy                    - 完整部署流程（默认）', colors.blue);
    log('  quick                     - 快速部署（跳过部分检查）', colors.blue);
    log('  build                     - 仅构建项目', colors.blue);
    log('  test                      - 测试部署流程', colors.blue);

    log('\n⚙️  选项:', colors.cyan);
    log('  -m, --message <text>      - 自定义提交信息', colors.blue);
    log('  --skip-git                - 跳过Git操作', colors.blue);
    log('  --skip-build              - 跳过构建步骤', colors.blue);
    log('  --skip-deploy             - 跳过Cloudflare部署', colors.blue);
    log('  --skip-cache              - 跳过缓存清理', colors.blue);
    log('  --skip-verify             - 跳过部署验证', colors.blue);
    log('  -f, --force               - 强制部署（跳过安全检查）', colors.blue);
    log('  --dry-run                 - 模拟运行（不实际部署）', colors.blue);
    log('  -h, --help                - 显示此帮助信息', colors.blue);

    log('\n📝 示例:', colors.cyan);
    log('  node scripts/skill-deploy.js "修复SEO问题"', colors.blue);
    log('  node scripts/skill-deploy.js deploy --force', colors.blue);
    log('  node scripts/skill-deploy.js quick --skip-verify', colors.blue);
    log('  node scripts/skill-deploy.js --dry-run', colors.blue);
  }

  // 显示部署配置
  showConfig() {
    logHeader('📊 部署配置');
    log(`📁 项目路径: ${this.projectRoot}`, colors.blue);
    log(`💬 提交信息: ${this.options.commitMessage || '自动生成'}`, colors.blue);
    log(`🔄 Git操作: ${this.options.skipGit ? '跳过' : '执行'}`, colors.blue);
    log(`🔨 构建步骤: ${this.options.skipBuild ? '跳过' : '执行'}`, colors.blue);
    log(`☁️  Cloudflare部署: ${this.options.skipDeploy ? '跳过' : '执行'}`, colors.blue);
    log(`🧹 缓存清理: ${this.options.skipCache ? '跳过' : '执行'}`, colors.blue);
    log(`✅ 部署验证: ${this.options.skipVerify ? '跳过' : '执行'}`, colors.blue);
    log(`🎭 模拟运行: ${this.options.dryRun ? '是' : '否'}`, colors.blue);
  }

  // 预检查
  async preCheck() {
    logStep('预检查');

    // 检查项目根目录
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('未找到package.json，请确认在正确的项目目录中运行');
    }
    logSuccess('项目目录检查通过');

    // 检查Git状态（如果不跳过）
    if (!this.options.skipGit) {
      const gitValid = this.git.checkStatus();
      if (!gitValid) {
        throw new Error('Git状态检查失败');
      }

      // 检查是否有更改
      const changedFiles = this.git.getChangedFiles();
      if (changedFiles.length === 0 && !this.options.force) {
        logWarning('没有检测到文件更改');
        const proceed = await this.askUser('是否继续部署？', false);
        if (!proceed) {
          logInfo('用户取消部署');
          return false;
        }
      }
    }

    return true;
  }

  // 用户交互确认
  async askUser(question, defaultValue = true) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      const prompt = defaultValue ?
        `${question} (Y/n): ` :
        `${question} (y/N): `;

      rl.question(prompt, (answer) => {
        rl.close();
        const response = answer.toLowerCase().trim();
        if (response === '') {
          resolve(defaultValue);
        } else {
          resolve(response === 'y' || response === 'yes');
        }
      });
    });
  }

  // Git操作流程
  async gitFlow() {
    if (this.options.skipGit) {
      logInfo('跳过Git操作');
      return true;
    }

    logStep('Git操作流程');

    if (this.options.dryRun) {
      logInfo('[DRY RUN] 将执行Git提交操作');
      return true;
    }

    try {
      // 执行Git自动部署
      const success = await this.git.autoDeploy(this.options.commitMessage, true);
      if (success) {
        logSuccess('Git操作完成');
        return true;
      } else {
        throw new Error('Git操作失败');
      }
    } catch (error) {
      logError(`Git操作失败: ${error.message}`);
      throw error;
    }
  }

  // 构建流程
  async buildFlow() {
    if (this.options.skipBuild) {
      logInfo('跳过构建步骤');
      return true;
    }

    logStep('构建流程');

    if (this.options.dryRun) {
      logInfo('[DRY RUN] 将执行项目构建');
      return true;
    }

    try {
      const success = await this.cloudflare.buildOnly();
      if (success) {
        logSuccess('构建完成');
        return true;
      } else {
        throw new Error('构建失败');
      }
    } catch (error) {
      logError(`构建失败: ${error.message}`);
      throw error;
    }
  }

  // 部署流程
  async deployFlow() {
    if (this.options.skipDeploy) {
      logInfo('跳过Cloudflare部署');
      return true;
    }

    logStep('Cloudflare部署流程');

    if (this.options.dryRun) {
      logInfo('[DRY RUN] 将执行Cloudflare部署');
      return {
        success: true,
        previewUrl: 'https://example-dry-run.pages.dev',
        productionUrl: 'https://kn-wallpaperglue.com'
      };
    }

    try {
      const result = await this.cloudflare.deploy();
      if (result.success) {
        logSuccess('Cloudflare部署完成');
        return result.results;
      } else {
        throw new Error('Cloudflare部署失败');
      }
    } catch (error) {
      logError(`Cloudflare部署失败: ${error.message}`);
      throw error;
    }
  }

  // 缓存清理流程
  async cacheFlow() {
    if (this.options.skipCache) {
      logInfo('跳过缓存清理');
      return true;
    }

    logStep('缓存清理流程');

    if (this.options.dryRun) {
      logInfo('[DRY RUN] 将清理Cloudflare缓存');
      return true;
    }

    try {
      const success = await this.cloudflare.purgeCache();
      if (success) {
        logSuccess('缓存清理完成');
        return true;
      } else {
        logWarning('缓存清理部分失败，但不影响部署');
        return true;
      }
    } catch (error) {
      logWarning(`缓存清理失败: ${error.message}`);
      return true; // 缓存清理失败不应该影响整个部署
    }
  }

  // 验证流程
  async verifyFlow(deployResult) {
    if (this.options.skipVerify) {
      logInfo('跳过部署验证');
      return true;
    }

    logStep('部署验证流程');

    if (this.options.dryRun) {
      logInfo('[DRY RUN] 将验证部署状态');
      return true;
    }

    try {
      const results = await this.cloudflare.verifyDeployment();
      const successCount = results.filter(r => r.accessible).length;
      const totalCount = results.length;

      if (successCount === totalCount) {
        logSuccess('所有页面验证通过！');
        return true;
      } else {
        logWarning(`部分页面验证失败: ${successCount}/${totalCount}`);
        return false;
      }
    } catch (error) {
      logWarning(`验证过程出错: ${error.message}`);
      return false;
    }
  }

  // 完整部署流程
  async deploy() {
    const startTime = Date.now();

    logHeader('🚀 开始技能部署流程');
    log(`📅 开始时间: ${new Date().toLocaleString('zh-CN')}`, colors.blue);

    try {
      // 1. 显示配置
      this.showConfig();

      // 2. 预检查
      const preCheckPassed = await this.preCheck();
      if (!preCheckPassed) {
        return false;
      }

      // 3. 确认部署
      if (!this.options.force && !this.options.dryRun) {
        const proceed = await this.askUser('确认开始部署？', true);
        if (!proceed) {
          logInfo('用户取消部署');
          return false;
        }
      }

      // 4. Git操作
      await this.gitFlow();

      // 5. 构建项目
      await this.buildFlow();

      // 6. Cloudflare部署
      const deployResult = await this.deployFlow();

      // 7. 清理缓存
      await this.cacheFlow();

      // 8. 验证部署
      if (deployResult) {
        await this.verifyFlow(deployResult);
      }

      // 9. 完成总结
      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);

      if (this.options.dryRun) {
        logHeader('🎭 模拟运行完成');
        logSuccess('所有步骤将在实际运行中执行');
      } else {
        logHeader('🎉 技能部署完成！');
        logSuccess(`总耗时: ${duration}秒`);
        log(`🌐 网站地址: https://kn-wallpaperglue.com`, colors.blue);
        log(`📋 FAQ页面: https://kn-wallpaperglue.com/faq`, colors.blue);
      }

      return true;

    } catch (error) {
      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);

      logHeader('💥 部署失败！');
      logError(`失败原因: ${error.message}`);
      logError(`耗时: ${duration}秒`);

      return false;
    }
  }

  // 快速部署
  async quickDeploy() {
    logHeader('⚡ 快速部署模式');

    // 设置快速部署选项
    this.options.skipVerify = true;

    return await this.deploy();
  }

  // 测试模式
  async testDeploy() {
    logHeader('🧪 测试部署模式');

    this.options.dryRun = true;

    return await this.deploy();
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'deploy';

  const deployer = new SkillDeployer();

  try {
    // 移除命令名，保留参数
    const filteredArgs = args.slice(1);

    switch (command) {
      case 'deploy':
      case 'deploy':
        deployer.parseArgs(filteredArgs);
        await deployer.deploy();
        break;

      case 'quick':
        deployer.parseArgs(filteredArgs);
        await deployer.quickDeploy();
        break;

      case 'build':
        deployer.options.skipDeploy = true;
        deployer.options.skipCache = true;
        deployer.options.skipVerify = true;
        deployer.parseArgs(filteredArgs);
        await deployer.deploy();
        break;

      case 'test':
        deployer.parseArgs(filteredArgs);
        await deployer.testDeploy();
        break;

      default:
        // 如果第一个参数不是命令，则视为部署命令
        deployer.parseArgs(args);
        await deployer.deploy();
        break;
    }
  } catch (error) {
    logError(`执行失败: ${error.message}`);
    process.exit(1);
  }
}

// 导出类供其他模块使用
exports.SkillDeployer = SkillDeployer;

// 如果直接运行此脚本
if (typeof require !== 'undefined' && require.main === module) {
  main();
}