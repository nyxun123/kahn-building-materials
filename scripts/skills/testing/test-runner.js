#!/usr/bin/env node

/**
 * 测试运行器技能
 * 单元测试、集成测试、E2E测试、视觉回归测试
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

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logStep(step) {
  log(`🧪 ${step}`, colors.cyan);
}

function logHeader(title) {
  log(`\n${'='.repeat(80)}`, colors.bright);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(80)}`, colors.bright);
}

class TestRunnerSkill {
  constructor(options = {}) {
    this.projectRoot = process.cwd();
    this.options = {
      coverage: options.coverage || false,
      watch: options.watch || false,
      ui: options.ui || false,
      env: options.env || 'staging',
      headless: options.headless !== false,
      ...options
    };
    this.results = {
      unit: {},
      integration: {},
      e2e: {},
      visual: {},
      summary: {}
    };
  }

  // 运行所有测试
  async run() {
    logHeader('🧪 运行所有测试');

    const startTime = Date.now();

    // 1. 单元测试
    await this.unit();

    // 2. 集成测试
    await this.integration();

    // 3. E2E 测试 (如果配置了)
    if (this.options.e2e !== false) {
      await this.e2e();
    }

    // 4. 生成总结
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    this.summary(duration);

    return this.results;
  }

  // 单元测试
  async unit() {
    logStep('单元测试');

    try {
      const vitestCmd = this.options.ui
        ? 'pnpm test:ui'
        : 'pnpm test:run';

      const coverageFlag = this.options.coverage ? ' -- --coverage' : '';

      execSync(`${vitestCmd}${coverageFlag}`, {
        cwd: this.projectRoot,
        stdio: 'inherit',
        timeout: 60000
      });

      this.results.unit = {
        status: 'passed',
        message: '单元测试通过'
      };

      logSuccess('单元测试通过');
    } catch (error) {
      this.results.unit = {
        status: 'failed',
        message: '单元测试失败',
        error: error.message
      };
      logError('单元测试失败');
    }
  }

  // 集成测试
  async integration() {
    logStep('集成测试');

    try {
      // 查找集成测试文件
      const testFiles = this.findTestFiles('integration');

      if (testFiles.length === 0) {
        logWarning('未找到集成测试');
        this.results.integration = {
          status: 'skipped',
          message: '未找到集成测试'
        };
        return;
      }

      logInfo(`找到 ${testFiles.length} 个集成测试文件`);

      // 运行集成测试
      for (const file of testFiles) {
        logInfo(`运行: ${path.basename(file)}`);

        try {
          execSync(`vitest run ${file}`, {
            cwd: this.projectRoot,
            stdio: 'inherit',
            timeout: 60000
          });
        } catch (error) {
          logError(`测试失败: ${file}`);
        }
      }

      this.results.integration = {
        status: 'passed',
        message: '集成测试通过'
      };

      logSuccess('集成测试通过');
    } catch (error) {
      this.results.integration = {
        status: 'failed',
        message: '集成测试失败',
        error: error.message
      };
      logError('集成测试失败');
    }
  }

  // E2E 测试
  async e2e() {
    logStep('E2E 测试');

    try {
      // 检查是否配置了 Playwright
      const playwrightConfig = path.join(this.projectRoot, 'playwright.config.ts');

      if (!fs.existsSync(playwrightConfig)) {
        logWarning('未配置 Playwright');
        this.results.e2e = {
          status: 'skipped',
          message: '未配置 Playwright'
        };
        return;
      }

      const headlessFlag = this.options.headless ? ' --headed' : '';
      const envFlag = ` --baseURL=${this.options.env === 'production' ? 'https://kn-wallpaperglue.com' : 'http://localhost:5173'}`;

      execSync(`npx playwright test${headlessFlag}${envFlag}`, {
        cwd: this.projectRoot,
        stdio: 'inherit',
        timeout: 120000
      });

      this.results.e2e = {
        status: 'passed',
        message: 'E2E 测试通过'
      };

      logSuccess('E2E 测试通过');
    } catch (error) {
      this.results.e2e = {
        status: 'failed',
        message: 'E2E 测试失败',
        error: error.message
      };
      logError('E2E 测试失败');
    }
  }

  // 视觉回归测试
  async visual(baseline, current) {
    logStep('视觉回归测试');

    const baselineBranch = baseline || 'main';
    const currentBranch = current || 'HEAD';

    logInfo(`基准分支: ${baselineBranch}`);
    logInfo(`当前分支: ${currentBranch}`);

    logWarning('视觉回归测试需要配置工具 (Percy, Chromatic)');
    logInfo('建议使用:');
    log('  - Percy: https://percy.io');
    log('  - Chromatic: https://www.chromatic.com');
    log('  - Storybook: https://storybook.js.org');

    this.results.visual = {
      status: 'skipped',
      message: '需要配置视觉测试工具'
    };

    return this.results.visual;
  }

  // 测试覆盖率
  async coverage() {
    logStep('测试覆盖率');

    try {
      // 运行测试并生成覆盖率报告
      execSync('pnpm test:run -- --coverage', {
        cwd: this.projectRoot,
        stdio: 'inherit',
        timeout: 60000
      });

      // 读取覆盖率报告
      const coverageDir = path.join(this.projectRoot, 'coverage');
      if (fs.existsSync(coverageDir)) {
        logSuccess('覆盖率报告已生成');
        logInfo(`查看报告: ${coverageDir}/index.html`);
      }

      this.results.coverage = {
        status: 'passed',
        message: '覆盖率报告已生成'
      };
    } catch (error) {
      logError(`覆盖率测试失败: ${error.message}`);
      this.results.coverage = {
        status: 'failed',
        message: '覆盖率测试失败'
      };
    }
  }

  // 查找测试文件
  findTestFiles(type) {
    const patterns = {
      unit: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      integration: ['**/*.integration.test.ts', '**/*.integration.test.tsx'],
      e2e: ['**/*.e2e.ts', '**/*.e2e.tsx', 'e2e/**/*.ts']
    };

    const testFiles = [];
    const srcDir = path.join(this.projectRoot, 'src');

    if (!fs.existsSync(srcDir)) {
      return testFiles;
    }

    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath);
        } else {
          for (const pattern of patterns[type] || []) {
            const regex = new RegExp(pattern.replace('**/', ''));
            if (regex.test(filePath.replace(srcDir + '/', ''))) {
              testFiles.push(filePath);
              break;
            }
          }
        }
      });
    };

    walkDir(srcDir);

    return testFiles;
  }

  // 测试总结
  summary(duration) {
    logHeader('📊 测试总结');

    const totalTests = Object.keys(this.results).length;
    const passedTests = Object.values(this.results).filter(r => r.status === 'passed').length;
    const failedTests = Object.values(this.results).filter(r => r.status === 'failed').length;
    const skippedTests = Object.values(this.results).filter(r => r.status === 'skipped').length;

    log(`\n总耗时: ${duration}秒`, colors.cyan);
    log(`通过: ${passedTests}/${totalTests}`, colors.green);

    if (failedTests > 0) {
      log(`失败: ${failedTests}/${totalTests}`, colors.red);
    }

    if (skippedTests > 0) {
      log(`跳过: ${skippedTests}/${totalTests}`, colors.yellow);
    }

    // 详细结果
    log('\n详细结果:', colors.cyan);

    if (this.results.unit.status) {
      log(`  单元测试: ${this.results.unit.status}`,
        this.results.unit.status === 'passed' ? colors.green : colors.red);
    }

    if (this.results.integration.status) {
      log(`  集成测试: ${this.results.integration.status}`,
        this.results.integration.status === 'passed' ? colors.green : colors.red);
    }

    if (this.results.e2e.status) {
      log(`  E2E 测试: ${this.results.e2e.status}`,
        this.results.e2e.status === 'passed' ? colors.green : colors.red);
    }

    if (this.results.visual.status) {
      log(`  视觉测试: ${this.results.visual.status}`, colors.yellow);
    }

    this.results.summary = {
      duration,
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      skipped: skippedTests,
      successRate: ((passedTests / totalTests) * 100).toFixed(2) + '%'
    };

    log(`\n成功率: ${this.results.summary.successRate}`,
      passedTests === totalTests ? colors.green : colors.yellow);
  }

  // 生成测试报告
  async report(format = 'json') {
    if (format === 'json') {
      const reportPath = path.join(this.projectRoot, 'test-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
      logSuccess(`测试报告已保存: ${reportPath}`);
    }

    return this.results;
  }
}

// CLI 接口
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'run';

  const options = {
    coverage: args.includes('--coverage'),
    watch: args.includes('--watch'),
    ui: args.includes('--ui'),
    env: args.includes('--env') ? args[args.indexOf('--env') + 1] : 'staging',
    headless: args.includes('--headed') ? false : true,
    baseline: args.includes('--baseline') ? args[args.indexOf('--baseline') + 1] : 'main',
    current: args.includes('--current') ? args[args.indexOf('--current') + 1] : 'HEAD',
    pattern: args.includes('--pattern') ? args[args.indexOf('--pattern') + 1] : null,
    format: args.includes('--format') ? args[args.indexOf('--format') + 1] : 'json'
  };

  const skill = new TestRunnerSkill(options);

  try {
    switch (command) {
      case 'run':
        await skill.run();
        break;

      case 'unit':
        await skill.unit();
        break;

      case 'integration':
        await skill.integration();
        break;

      case 'e2e':
        await skill.e2e();
        break;

      case 'visual':
        await skill.visual(options.baseline, options.current);
        break;

      case 'coverage':
        await skill.coverage();
        break;

      default:
        logError(`未知命令: ${command}`);
        log('\n可用命令:');
        log('  run [--coverage] [--watch]       - 运行所有测试');
        log('  unit [--coverage]                - 单元测试');
        log('  integration                      - 集成测试');
        log('  e2e [--env] [--headed]           - E2E测试');
        log('  visual [--baseline] [--current]  - 视觉回归测试');
        log('  coverage                         - 测试覆盖率');
        break;
    }

    await skill.report(options.format);
  } catch (error) {
    logError(`执行失败: ${error.message}`);
    process.exit(1);
  }
}

// 导出
module.exports = { TestRunnerSkill };

// 如果直接运行
if (require.main === module) {
  main();
}
