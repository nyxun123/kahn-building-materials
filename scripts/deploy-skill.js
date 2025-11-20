#!/usr/bin/env node

/**
 * 自动化部署技能
 * 每次修改后自动提交、推送并部署到生产环境，清理缓存
 * 使用方法: node scripts/deploy-skill.js [提交信息]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 部署配置
const DEPLOY_CONFIG = {
  // 项目根目录
  projectRoot: process.cwd(),

  // 分支配置
  mainBranch: 'main',

  // Cloudflare Pages 配置
  cloudflareProject: 'kn-wallpaperglue',

  // 缓存清理配置
  cacheCleanDelay: 5000, // 5秒延迟等待部署完成

  // 构建命令
  buildCommand: 'pnpm build',

  // 提交信息模板
  commitTemplate: '🚀 Auto-deploy: {message} | Time: {timestamp}',
};

// 颜色输出工具
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step) {
  log(`\n📋 步骤 ${step}`, colors.cyan);
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

// 执行命令并输出结果
function execCommand(command, description) {
  logInfo(`执行: ${description}`);
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      cwd: DEPLOY_CONFIG.projectRoot,
      stdio: 'pipe'
    });
    logSuccess(`${description} 完成`);
    return result.trim();
  } catch (error) {
    logError(`${description} 失败: ${error.message}`);
    throw error;
  }
}

// 检查Git状态
function checkGitStatus() {
  logStep(1);
  logInfo('检查Git仓库状态...');

  try {
    // 检查是否在Git仓库中
    execCommand('git rev-parse --is-inside-work-tree', '检查Git仓库');

    // 检查当前分支
    const currentBranch = execCommand('git rev-parse --abbrev-ref HEAD', '获取当前分支');

    if (currentBranch !== DEPLOY_CONFIG.mainBranch) {
      logWarning(`当前在分支 ${currentBranch}，建议切换到 ${DEPLOY_CONFIG.mainBranch} 分支`);
      const switchBranch = process.argv.includes('--force-branch');
      if (switchBranch) {
        execCommand(`git checkout ${DEPLOY_CONFIG.mainBranch}`, `切换到 ${DEPLOY_CONFIG.mainBranch} 分支`);
      }
    }

    // 检查是否有未提交的更改
    const status = execCommand('git status --porcelain', '检查文件状态');

    if (!status) {
      logInfo('没有需要提交的更改');
      return false;
    }

    const changedFiles = status.split('\n').filter(line => line.trim());
    logInfo(`发现 ${changedFiles.length} 个文件需要提交:`);

    changedFiles.forEach(file => {
      const [status, filename] = file.split(/\s+/);
      const statusIcon = status.includes('M') ? '📝' : status.includes('A') ? '➕' : status.includes('D') ? '🗑️' : '❓';
      log(`   ${statusIcon} ${filename}`, colors.yellow);
    });

    return true;
  } catch (error) {
    logError('Git状态检查失败');
    throw error;
  }
}

// 执行构建
function runBuild() {
  logStep(2);
  logInfo('开始项目构建...');

  try {
    // 检查package.json是否存在
    const packageJsonPath = path.join(DEPLOY_CONFIG.projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      logWarning('未找到package.json，跳过构建步骤');
      return;
    }

    // 检查依赖
    const nodeModulesPath = path.join(DEPLOY_CONFIG.projectRoot, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      logInfo('安装依赖...');
      execCommand('pnpm install', '安装依赖');
    }

    // 执行构建
    execCommand(DEPLOY_CONFIG.buildCommand, '项目构建');

    logSuccess('构建完成');
  } catch (error) {
    logError('构建失败');
    throw error;
  }
}

// Git提交
function gitCommit(commitMessage) {
  logStep(3);
  logInfo('提交更改到Git...');

  try {
    // 添加所有更改的文件
    execCommand('git add .', '添加文件到暂存区');

    // 检查是否真的有文件需要提交
    const stagedFiles = execCommand('git diff --cached --name-only', '检查暂存文件');
    if (!stagedFiles) {
      logWarning('没有文件需要提交');
      return false;
    }

    // 生成提交信息
    const timestamp = new Date().toLocaleString('zh-CN');
    const fullCommitMessage = DEPLOY_CONFIG.commitTemplate
      .replace('{message}', commitMessage || '自动部署更新')
      .replace('{timestamp}', timestamp);

    // 执行提交
    execCommand(`git commit -m "${fullCommitMessage}"`, '提交更改');

    logSuccess(`提交成功: ${fullCommitMessage}`);
    return true;
  } catch (error) {
    logError('Git提交失败');
    throw error;
  }
}

// 推送到远程仓库
function gitPush() {
  logStep(4);
  logInfo('推送到远程仓库...');

  try {
    // 检查是否有远程仓库
    const remotes = execCommand('git remote', '检查远程仓库');
    if (!remotes) {
      logWarning('没有配置远程仓库，跳过推送');
      return false;
    }

    // 推送到远程
    execCommand(`git push origin ${DEPLOY_CONFIG.mainBranch}`, '推送到远程仓库');

    logSuccess('推送成功');
    return true;
  } catch (error) {
    logError('推送失败');
    throw error;
  }
}

// 部署到Cloudflare Pages
function deployToCloudflare() {
  logStep(5);
  logInfo('部署到Cloudflare Pages...');

  try {
    // 检查是否安装了Wrangler CLI
    let wranglerInstalled;
    try {
      execSync('wrangler --version', { stdio: 'pipe' });
      wranglerInstalled = true;
    } catch {
      wranglerInstalled = false;
    }

    if (!wranglerInstalled) {
      logWarning('未安装Wrangler CLI，尝试安装...');
      execCommand('pnpm add -D wrangler', '安装Wrangler CLI');
    }

    // 执行部署
    logInfo('开始部署...');
    const deployResult = execCommand(
      'npx wrangler pages deploy dist --project-name kn-wallpaperglue --compatibility-date=2023-05-18',
      '部署到Cloudflare Pages'
    );

    logSuccess('部署成功');
    logInfo(`部署结果: ${deployResult}`);

    return true;
  } catch (error) {
    logError('Cloudflare部署失败');
    throw error;
  }
}

// 清理缓存
function clearCache() {
  logStep(6);
  logInfo('清理服务器缓存...');

  try {
    // 等待部署完成
    if (DEPLOY_CONFIG.cacheCleanDelay > 0) {
      logInfo(`等待 ${DEPLOY_CONFIG.cacheCleanDelay/1000} 秒让部署完成...`);
      await new Promise(resolve => setTimeout(resolve, DEPLOY_CONFIG.cacheCleanDelay));
    }

    // 清理Cloudflare缓存
    try {
      logInfo('清理Cloudflare CDN缓存...');
      execCommand(
        'npx wrangler cache purge --url="https://kn-wallpaperglue.com/*" --tag=production',
        '清理Cloudflare缓存'
      );
      logSuccess('Cloudflare缓存清理完成');
    } catch (cacheError) {
      logWarning('Cloudflare缓存清理失败，这不影响部署');
    }

    logSuccess('缓存清理完成');
  } catch (error) {
    logWarning('缓存清理过程中出现问题，但不影响主要部署');
  }
}

// 验证部署
function verifyDeployment() {
  logStep(7);
  logInfo('验证部署状态...');

  try {
    // 检查网站是否可访问
    logInfo('检查网站可访问性...');
    const https = require('https');
    const http = require('http');

    const checkWebsite = (url) => {
      return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, (res) => {
          resolve(res.statusCode === 200);
        });
        req.on('error', reject);
        req.setTimeout(10000, () => {
          req.abort();
          reject(new Error('Timeout'));
        });
      });
    };

    const urls = [
      'https://kn-wallpaperglue.com',
      'https://kn-wallpaperglue.com/faq'
    ];

    let allAccessible = true;
    for (const url of urls) {
      try {
        const accessible = await checkWebsite(url);
        if (accessible) {
          logSuccess(`${url} 可访问`);
        } else {
          logWarning(`${url} 可能无法访问`);
          allAccessible = false;
        }
      } catch (error) {
        logWarning(`${url} 检查失败: ${error.message}`);
        allAccessible = false;
      }
    }

    if (allAccessible) {
      logSuccess('所有页面验证通过！');
    } else {
      logWarning('部分页面验证失败，请检查部署状态');
    }

  } catch (error) {
    logWarning('部署验证过程中出现错误');
  }
}

// 主函数
async function main() {
  const startTime = Date.now();

  log('🚀 自动化部署技能启动', colors.bright);
  log(`📅 开始时间: ${new Date().toLocaleString('zh-CN')}`, colors.blue);
  log(`📁 项目路径: ${DEPLOY_CONFIG.projectRoot}`, colors.blue);

  try {
    // 1. 检查Git状态
    const hasChanges = checkGitStatus();
    if (!hasChanges) {
      logInfo('没有需要部署的更改，退出');
      return;
    }

    // 2. 执行构建
    runBuild();

    // 3. Git提交
    const commitMessage = process.argv[2] || '自动部署更新';
    const committed = gitCommit(commitMessage);
    if (!committed) {
      logError('提交失败，部署中断');
      return;
    }

    // 4. 推送到远程
    const pushed = gitPush();
    if (!pushed) {
      logWarning('推送失败，但继续本地部署');
    }

    // 5. 部署到Cloudflare
    const deployed = deployToCloudflare();
    if (deployed) {
      // 6. 清理缓存
      await clearCache();

      // 7. 验证部署
      verifyDeployment();
    }

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    logSuccess(`\n🎉 部署完成！总耗时: ${duration}秒`);
    log(`🌐 网站地址: https://kn-wallpaperglue.com`, colors.blue);
    log(`📋 FAQ页面: https://kn-wallpaperglue.com/faq`, colors.blue);

  } catch (error) {
    logError(`\n💥 部署失败: ${error.message}`);
    process.exit(1);
  }
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  logError(`未捕获的异常: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError(`未处理的Promise拒绝: ${reason}`);
  process.exit(1);
});

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  main,
  checkGitStatus,
  runBuild,
  gitCommit,
  gitPush,
  deployToCloudflare,
  clearCache,
  verifyDeployment
};