#!/usr/bin/env node

/**
 * Cloudflare API快速配置脚本
 * 一键设置自动部署所需的API凭证
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

class CloudflareAPISetup {
  constructor() {
    this.configDir = path.join(process.env.HOME, '.cloudflare');
    this.projectConfig = {
      tokenFile: '.cf-token',
      accountIdFile: '.cf-account-id'
    };
  }

  // 交互式获取API Token
  async getAPIToken() {
    logStep('获取Cloudflare API Token');

    logInfo('请按以下步骤获取API Token:');
    log('1. 访问 https://dash.cloudflare.com', colors.cyan);
    log('2. 点击右上角头像 → "My Profile"', colors.cyan);
    log('3. 点击 "API Tokens" 标签页', colors.cyan);
    log('4. 点击 "Create Token" → "Custom token"', colors.cyan);
    log('5. 配置权限:', colors.cyan);
    log('   - Token name: Auto Deploy Token', colors.blue);
    log('   - Account permissions: Cloudflare Pages:Edit', colors.blue);
    log('   - Account resources: Include All accounts', colors.blue);
    log('6. 创建并复制Token', colors.cyan);

    return new Promise((resolve) => {
      process.stdout.write('\n请粘贴你的API Token: ');

      // 隐藏输入
      const stdin = process.stdin;
      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding('utf8');

      let token = '';
      stdin.on('data', function(char) {
        char = char.toString();

        switch(char) {
          case '\n':
          case '\r':
          case '\u0004': // Ctrl+D
            stdin.setRawMode(false);
            stdin.pause();
            console.log(); // 换行
            resolve(token.trim());
            break;
          case '\u0003': // Ctrl+C
            console.log('\n操作已取消');
            process.exit(0);
            break;
          case '\u007F': // Backspace
            if (token.length > 0) {
              token = token.slice(0, -1);
              process.stdout.write('\b \b');
            }
            break;
          default:
            if (char >= ' ') {
              token += char;
              process.stdout.write('*');
            }
        }
      });
    });
  }

  // 交互式获取Account ID
  async getAccountId() {
    logStep('获取Account ID');

    logInfo('你可以在以下位置找到Account ID:');
    log('1. Cloudflare Dashboard右侧边栏', colors.cyan);
    log('2. "My Profile" → "API Tokens" 页面右侧', colors.cyan);

    return new Promise((resolve) => {
      process.stdout.write('\n请输入你的Account ID: ');

      const stdin = process.stdin;
      stdin.resume();
      stdin.setEncoding('utf8');

      stdin.on('data', function(data) {
        const accountId = data.toString().trim();
        stdin.pause();
        resolve(accountId);
      });
    });
  }

  // 保存配置到用户目录
  async saveUserConfig(token, accountId) {
    logStep('保存API凭证');

    try {
      // 创建配置目录
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir, { mode: 0o700 });
        logSuccess(`创建配置目录: ${this.configDir}`);
      }

      // 保存Token
      const tokenFile = path.join(this.configDir, 'api-token');
      fs.writeFileSync(tokenFile, token, { mode: 0o600 });
      logSuccess(`API Token已保存: ${tokenFile}`);

      // 保存Account ID
      const accountIdFile = path.join(this.configDir, 'account-id');
      fs.writeFileSync(accountIdFile, accountId, { mode: 0o600 });
      logSuccess(`Account ID已保存: ${accountIdFile}`);

      return true;
    } catch (error) {
      logError(`保存配置失败: ${error.message}`);
      return false;
    }
  }

  // 保存配置到项目目录
  async saveProjectConfig(token, accountId) {
    logStep('保存项目级配置');

    try {
      const projectDir = process.cwd();

      // 保存Token
      const tokenFile = path.join(projectDir, '.cf-token');
      fs.writeFileSync(tokenFile, token, { mode: 0o600 });
      logSuccess(`项目API Token已保存: ${tokenFile}`);

      // 保存Account ID
      const accountIdFile = path.join(projectDir, '.cf-account-id');
      fs.writeFileSync(accountIdFile, accountId, { mode: 0o600 });
      logSuccess(`项目Account ID已保存: ${accountIdFile}`);

      // 检查并更新.gitignore
      const gitignoreFile = path.join(projectDir, '.gitignore');
      let gitignoreContent = '';

      if (fs.existsSync(gitignoreFile)) {
        gitignoreContent = fs.readFileSync(gitignoreFile, 'utf8');
      }

      const entriesToAdd = ['.cf-token', '.cf-account-id'];
      let updated = false;

      entriesToAdd.forEach(entry => {
        if (!gitignoreContent.includes(entry)) {
          gitignoreContent += (gitignoreContent ? '\n' : '') + entry;
          updated = true;
        }
      });

      if (updated) {
        fs.writeFileSync(gitignoreFile, gitignoreContent);
        logSuccess('.gitignore已更新');
      }

      return true;
    } catch (error) {
      logError(`保存项目配置失败: ${error.message}`);
      return false;
    }
  }

  // 测试API连接
  async testAPI(token, accountId) {
    logStep('测试API连接');

    return new Promise((resolve) => {
      const https = require('https');

      const options = {
        hostname: 'api.cloudflare.com',
        port: 443,
        path: '/client/v4/user/tokens/verify',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const result = JSON.parse(data);

            if (result.success) {
              logSuccess('API Token验证成功');
              resolve(true);
            } else {
              logError('API Token验证失败');
              if (result.errors) {
                result.errors.forEach(error => {
                  logError(`错误: ${error.message}`);
                });
              }
              resolve(false);
            }
          } catch (error) {
            logError(`API响应解析失败: ${error.message}`);
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        logError(`API请求失败: ${error.message}`);
        resolve(false);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        logError('API请求超时');
        resolve(false);
      });

      req.end();
    });
  }

  // 测试自动部署器
  async testAutoDeployer() {
    logStep('测试智能自动部署器');

    try {
      // 这里只测试配置是否正确加载，不实际部署
      const { SmartAutoDeployer } = require('./smart-auto-deployer.cjs');
      const deployer = new SmartAutoDeployer();

      if (deployer.cloudflareToken && deployer.accountId) {
        logSuccess('自动部署器配置正确');
        return true;
      } else {
        logWarning('自动部署器配置不完整');
        return false;
      }
    } catch (error) {
      logError(`测试自动部署器失败: ${error.message}`);
      return false;
    }
  }

  // 主设置流程
  async setup() {
    logStep('开始Cloudflare API配置');

    try {
      // 1. 获取API Token
      const token = await this.getAPIToken();
      if (!token) {
        logError('未提供API Token');
        return false;
      }

      // 2. 获取Account ID
      const accountId = await this.getAccountId();
      if (!accountId) {
        logError('未提供Account ID');
        return false;
      }

      // 3. 测试API连接
      logInfo('正在验证API凭证...');
      const apiValid = await this.testAPI(token, accountId);
      if (!apiValid) {
        logError('API凭证验证失败，请检查Token和Account ID是否正确');
        return false;
      }

      // 4. 保存配置
      logInfo('选择配置保存位置:');
      log('1. 用户目录 (~/.cloudflare/) - 推荐用于多个项目', colors.cyan);
      log('2. 项目目录 (当前项目) - 推荐用于单个项目', colors.cyan);
      log('3. 两者都保存', colors.cyan);

      const choice = await new Promise((resolve) => {
        process.stdout.write('\n请选择 (1/2/3): ');

        const stdin = process.stdin;
        stdin.resume();
        stdin.setEncoding('utf8');

        stdin.on('data', function(data) {
          stdin.pause();
          resolve(data.toString().trim());
        });
      });

      let userConfigSaved = false;
      let projectConfigSaved = false;

      if (choice === '1' || choice === '3') {
        userConfigSaved = await this.saveUserConfig(token, accountId);
      }

      if (choice === '2' || choice === '3') {
        projectConfigSaved = await this.saveProjectConfig(token, accountId);
      }

      if (!userConfigSaved && !projectConfigSaved) {
        logError('配置保存失败');
        return false;
      }

      // 5. 测试自动部署器
      const deployerTest = await this.testAutoDeployer();

      // 6. 设置环境变量（可选）
      if (choice === '1' || choice === '3') {
        logInfo('是否设置环境变量？(推荐)');
        log('设置后可以在任何地方使用智能自动部署器', colors.cyan);

        const setEnv = await new Promise((resolve) => {
          process.stdout.write('设置环境变量? (y/n): ');

          const stdin = process.stdin;
          stdin.resume();
          stdin.setEncoding('utf8');

          stdin.on('data', function(data) {
            stdin.pause();
            resolve(data.toString().trim().toLowerCase());
          });
        });

        if (setEnv === 'y' || setEnv === 'yes') {
          try {
            const shell = process.env.SHELL || '/bin/bash';
            const rcFile = shell.includes('zsh') ? '~/.zshrc' : '~/.bash_profile';

            logInfo(`添加环境变量到 ${rcFile}`);

            const envCommands = [
              `export CF_API_TOKEN="${token}"`,
              `export CF_ACCOUNT_ID="${accountId}"`
            ];

            execSync(`echo '${envCommands.join('\n')}' >> ${rcFile.replace('~', process.env.HOME)}`);

            logSuccess('环境变量已设置');
            logInfo('请运行以下命令使环境变量生效:');
            log(`source ${rcFile}`, colors.cyan);
          } catch (error) {
            logWarning(`设置环境变量失败: ${error.message}`);
          }
        }
      }

      // 7. 完成
      logSuccess('🎉 Cloudflare API配置完成！');

      log('\n📋 配置总结:');
      log(`✅ API Token: ${token.substring(0, 10)}...`, colors.green);
      log(`✅ Account ID: ${accountId}`, colors.green);
      if (userConfigSaved) log(`✅ 用户配置: ${this.configDir}`, colors.green);
      if (projectConfigSaved) log(`✅ 项目配置: ${process.cwd()}`, colors.green);
      if (deployerTest) log(`✅ 自动部署器: 配置正确`, colors.green);

      log('\n🚀 下一步:');
      log('1. 如果设置了环境变量，请重新加载shell', colors.cyan);
      log('2. 运行智能自动部署器测试:', colors.cyan);
      log('   node scripts/smart-auto-deployer.cjs --force', colors.cyan);
      log('3. 享受完全自动化的部署流程！', colors.cyan);

      return true;

    } catch (error) {
      logError(`配置过程中发生错误: ${error.message}`);
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
    logHeader('🔧 Cloudflare API快速配置工具');

    log('\n📋 用法:', colors.cyan);
    log('  node scripts/setup-cloudflare-api.cjs              - 交互式配置', colors.blue);

    log('\n🎯 功能:', colors.cyan);
    log('  ✅ 交互式获取API Token', colors.green);
    log('  ✅ 交互式获取Account ID', colors.green);
    log('  ✅ 自动验证API凭证', colors.green);
    log('  ✅ 智能保存配置', colors.green);
    log('  ✅ 测试自动部署器', colors.green);
    log('  ✅ 可选设置环境变量', colors.green);

    log('\n🔒 安全特性:', colors.cyan);
    log('  ✅ 安全的密码输入', colors.green);
    log('  ✅ 正确的文件权限设置', colors.green);
    log('  ✅ 自动更新.gitignore', colors.green);

    return;
  }

  logHeader('🔧 Cloudflare API快速配置工具');

  const setup = new CloudflareAPISetup();

  try {
    const success = await setup.setup();

    if (success) {
      log('\n🎉 配置成功！现在你可以使用完全自动化的部署了。');
    } else {
      log('\n❌ 配置失败，请检查错误信息并重试。');
      process.exit(1);
    }
  } catch (error) {
    logError(`配置过程中发生错误: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { CloudflareAPISetup };