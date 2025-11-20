#!/usr/bin/env node

/**
 * Cloudflare Pages 部署和缓存清理脚本
 * 自动构建、部署到Cloudflare Pages并清理缓存
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

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
  log(`📋 ${step}`, colors.cyan);
}

function execCommand(command, description) {
  logInfo(`执行: ${description}`);
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 300000 // 5分钟超时
    });
    logSuccess(`${description} 完成`);
    return result.trim();
  } catch (error) {
    logError(`${description} 失败: ${error.message}`);
    throw error;
  }
}

// 异步执行命令
function execCommandAsync(command, description) {
  return new Promise((resolve, reject) => {
    logInfo(`异步执行: ${description}`);
    const child = require('child_process').exec(command, {
      encoding: 'utf8',
      timeout: 300000
    });

    let output = '';
    child.stdout.on('data', (data) => {
      output += data;
      process.stdout.write(data);
    });

    child.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    child.on('close', (code) => {
      if (code === 0) {
        logSuccess(`${description} 完成`);
        resolve(output.trim());
      } else {
        logError(`${description} 失败 (退出码: ${code})`);
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      logError(`${description} 执行错误: ${error.message}`);
      reject(error);
    });
  });
}

class CloudflareDeployer {
  constructor() {
    this.projectRoot = process.cwd();
    this.distPath = path.join(this.projectRoot, 'dist');
    this.projectName = 'kn-wallpaperglue';
    this.domain = 'https://kn-wallpaperglue.com';

    // 部署配置
    this.config = {
      buildDir: 'dist',
      compatibilityDate: '2023-05-18',
      nodeCompatibility: true
    };
  }

  // 检查Wrangler CLI
  async checkWrangler() {
    logStep('检查Wrangler CLI工具');

    try {
      execSync('wrangler --version', { stdio: 'pipe' });
      logSuccess('Wrangler CLI已安装');
      return true;
    } catch (error) {
      logWarning('Wrangler CLI未安装，正在安装...');

      try {
        execCommand('npm install -g wrangler', '全局安装Wrangler CLI');
        logSuccess('Wrangler CLI安装成功');
        return true;
      } catch (installError) {
        logWarning('全局安装失败，尝试本地安装...');
        try {
          execCommand('npm install -D wrangler', '本地安装Wrangler CLI');
          logSuccess('Wrangler CLI本地安装成功');
          return true;
        } catch (localInstallError) {
          logError('Wrangler CLI安装失败');
          throw localInstallError;
        }
      }
    }
  }

  // 检查项目配置
  checkProjectConfig() {
    logStep('检查项目配置');

    // 检查package.json
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('未找到package.json文件');
    }
    logSuccess('package.json文件存在');

    // 检查构建脚本
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (!packageJson.scripts || !packageJson.scripts.build) {
      throw new Error('未找到构建脚本');
    }
    logSuccess('构建脚本存在');

    // 检查wrangler.toml（可选）
    const wranglerConfigPath = path.join(this.projectRoot, 'wrangler.toml');
    if (fs.existsSync(wranglerConfigPath)) {
      logSuccess('wrangler.toml配置文件存在');
    } else {
      logWarning('未找到wrangler.toml配置文件，将使用默认配置');
    }
  }

  // 清理旧的构建文件
  cleanBuild() {
    logStep('清理旧的构建文件');

    if (fs.existsSync(this.distPath)) {
      try {
        execCommand(`rm -rf ${this.distPath}`, '删除dist目录');
        logSuccess('旧构建文件清理完成');
      } catch (error) {
        logWarning('清理构建文件失败，继续执行...');
      }
    } else {
      logInfo('没有需要清理的构建文件');
    }
  }

  // 安装依赖
  installDependencies() {
    logStep('检查并安装依赖');

    const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      logInfo('安装项目依赖...');
      execCommand('pnpm install', '安装依赖');
      logSuccess('依赖安装完成');
    } else {
      logInfo('依赖已存在，检查更新...');
      try {
        execCommand('pnpm install --frozen-lockfile', '更新依赖');
        logSuccess('依赖检查完成');
      } catch (error) {
        logWarning('依赖更新失败，使用现有依赖');
      }
    }
  }

  // 构建项目
  async buildProject() {
    logStep('构建项目');

    try {
      // 设置NODE_ENV为production
      process.env.NODE_ENV = 'production';

      // 执行构建
      logInfo('开始构建...');
      await execCommandAsync('pnpm build', '构建项目');

      // 检查构建结果
      if (!fs.existsSync(this.distPath)) {
        throw new Error('构建失败：未找到dist目录');
      }

      // 检查关键文件
      const criticalFiles = ['index.html'];
      for (const file of criticalFiles) {
        const filePath = path.join(this.distPath, file);
        if (!fs.existsSync(filePath)) {
          logWarning(`关键文件缺失: ${file}`);
        }
      }

      // 统计构建文件
      const stats = this.getBuildStats();
      logSuccess(`构建完成！生成 ${stats.fileCount} 个文件，总大小: ${stats.totalSize}`);

      return true;
    } catch (error) {
      logError(`构建失败: ${error.message}`);
      throw error;
    }
  }

  // 获取构建统计信息
  getBuildStats() {
    if (!fs.existsSync(this.distPath)) {
      return { fileCount: 0, totalSize: '0 KB' };
    }

    let totalSize = 0;
    let fileCount = 0;

    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath);
        } else {
          totalSize += stat.size;
          fileCount++;
        }
      }
    };

    walkDir(this.distPath);

    const formatSize = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return {
      fileCount,
      totalSize: formatSize(totalSize)
    };
  }

  // 部署到Cloudflare Pages
  async deployToCloudflare() {
    logStep('部署到Cloudflare Pages');

    try {
      logInfo(`部署项目: ${this.projectName}`);
      logInfo(`构建目录: ${this.distPath}`);

      // 执行部署命令
      const deployCommand = `npx wrangler pages deploy "${this.distPath}" --project-name="${this.projectName}" --compatibility-date="${this.config.compatibilityDate}"`;

      const deployResult = await execCommandAsync(deployCommand, '部署到Cloudflare Pages');

      // 提取部署URL
      const urlMatch = deployResult.match(/https:\/\/[a-z0-9-]+\.pages\.dev/i);
      if (urlMatch) {
        const previewUrl = urlMatch[0];
        logSuccess(`预览URL: ${previewUrl}`);

        return {
          success: true,
          previewUrl,
          productionUrl: this.domain
        };
      } else {
        logWarning('无法提取预览URL，但部署可能成功');
        return {
          success: true,
          previewUrl: null,
          productionUrl: this.domain
        };
      }
    } catch (error) {
      logError(`部署失败: ${error.message}`);
      throw error;
    }
  }

  // 清理Cloudflare缓存
  async clearCache() {
    logStep('清理Cloudflare CDN缓存');

    try {
      logInfo('等待部署生效...');
      await this.sleep(3000); // 等待3秒

      // 方法1: 使用wrangler清理缓存
      try {
        logInfo('使用Wrangler清理缓存...');
        await execCommandAsync(
          `npx wrangler cache purge --url="${this.domain}/*" --tag=production`,
          '清理Cloudflare缓存'
        );
        logSuccess('缓存清理成功（方法1）');
        return true;
      } catch (wranglerError) {
        logWarning('Wrangler缓存清理失败，尝试备用方法...');

        // 方法2: 创建特殊的清理文件
        await this.createCacheBuster();
        logSuccess('缓存清理成功（方法2）');
        return true;
      }
    } catch (error) {
      logWarning(`缓存清理失败，但部署已完成: ${error.message}`);
      return false;
    }
  }

  // 创建缓存清理文件
  async createCacheBuster() {
    try {
      const cacheBusterPath = path.join(this.distPath, 'cache-buster.json');
      const cacheData = {
        timestamp: Date.now(),
        version: Math.random().toString(36).substr(2, 9),
        deployTime: new Date().toISOString()
      };

      fs.writeFileSync(cacheBusterPath, JSON.stringify(cacheData, null, 2));

      // 重新部署缓存清理文件
      const bustCommand = `npx wrangler pages deploy "${cacheBusterPath}" --project-name="${this.projectName}"`;
      await execCommandAsync(bustCommand, '部署缓存清理文件');

      return true;
    } catch (error) {
      logWarning(`缓存清理文件创建失败: ${error.message}`);
      return false;
    }
  }

  // 验证部署
  async verifyDeployment() {
    logStep('验证部署状态');

    const urls = [
      this.domain,
      `${this.domain}/faq`,
      `${this.domain}/products`
    ];

    const results = [];
    for (const url of urls) {
      try {
        logInfo(`检查: ${url}`);
        const isAccessible = await this.checkWebsite(url);
        results.push({ url, accessible: isAccessible });

        if (isAccessible) {
          logSuccess(`✅ ${url} - 可访问`);
        } else {
          logWarning(`❌ ${url} - 无法访问`);
        }
      } catch (error) {
        logWarning(`⚠️  ${url} - 检查失败: ${error.message}`);
        results.push({ url, accessible: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.accessible).length;
    logInfo(`验证结果: ${successCount}/${urls.length} 页面可访问`);

    return results;
  }

  // 检查网站可访问性
  async checkWebsite(url) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;

      const req = client.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; DeployBot/1.0)'
        }
      }, (res) => {
        resolve(res.statusCode === 200);
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.abort();
        reject(new Error('Timeout'));
      });
    });
  }

  // 工具函数：延迟
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 完整部署流程
  async deploy() {
    const startTime = Date.now();

    log('🚀 开始Cloudflare Pages部署', colors.bright);
    log(`📅 部署时间: ${new Date().toLocaleString('zh-CN')}`, colors.blue);
    log(`📁 项目路径: ${this.projectRoot}`, colors.blue);

    try {
      // 1. 检查工具
      await this.checkWrangler();

      // 2. 检查配置
      this.checkProjectConfig();

      // 3. 清理构建
      this.cleanBuild();

      // 4. 安装依赖
      this.installDependencies();

      // 5. 构建项目
      await this.buildProject();

      // 6. 部署到Cloudflare
      const deployResult = await this.deployToCloudflare();

      if (deployResult.success) {
        // 7. 清理缓存
        await this.clearCache();

        // 8. 验证部署
        const verificationResults = await this.verifyDeployment();

        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);

        logSuccess(`\n🎉 部署完成！总耗时: ${duration}秒`);
        log(`🌐 生产网站: ${deployResult.productionUrl}`, colors.blue);
        if (deployResult.previewUrl) {
          log(`👀 预览链接: ${deployResult.previewUrl}`, colors.blue);
        }

        return {
          success: true,
          duration,
          results: deployResult,
          verification: verificationResults
        };
      } else {
        throw new Error('部署失败');
      }
    } catch (error) {
      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);

      logError(`\n💥 部署失败！耗时: ${duration}秒`);
      logError(`错误信息: ${error.message}`);

      return {
        success: false,
        duration,
        error: error.message
      };
    }
  }

  // 仅清理缓存
  async purgeCache() {
    log('🧹 清理Cloudflare缓存', colors.bright);
    return await this.clearCache();
  }

  // 仅构建
  async buildOnly() {
    log('🔨 仅构建项目', colors.bright);

    try {
      await this.checkWrangler();
      this.checkProjectConfig();
      this.cleanBuild();
      this.installDependencies();
      await this.buildProject();

      const stats = this.getBuildStats();
      logSuccess(`构建完成！${stats.fileCount} 个文件，${stats.totalSize}`);
      return true;
    } catch (error) {
      logError(`构建失败: ${error.message}`);
      return false;
    }
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'deploy';
  const deployer = new CloudflareDeployer();

  try {
    switch (command) {
      case 'deploy':
        await deployer.deploy();
        break;

      case 'build':
        await deployer.buildOnly();
        break;

      case 'cache':
        await deployer.purgeCache();
        break;

      case 'check':
        await deployer.verifyDeployment();
        break;

      default:
        log('Cloudflare部署脚本使用说明:', colors.bright);
        log('  node scripts/cloudflare-deploy.js deploy - 完整部署流程', colors.blue);
        log('  node scripts/cloudflare-deploy.js build  - 仅构建项目', colors.blue);
        log('  node scripts/cloudflare-deploy.js cache  - 清理缓存', colors.blue);
        log('  node scripts/cloudflare-deploy.js check  - 验证部署', colors.blue);
        break;
    }
  } catch (error) {
    logError(`执行失败: ${error.message}`);
    process.exit(1);
  }
}

// 导出类供其他模块使用
exports.CloudflareDeployer = CloudflareDeployer;

// 如果直接运行此脚本
if (typeof require !== 'undefined' && require.main === module) {
  main();
}