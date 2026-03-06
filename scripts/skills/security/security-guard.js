#!/usr/bin/env node

/**
 * 安全卫士技能
 * 自动扫描安全漏洞、审计依赖、检测注入攻击
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

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logStep(step) {
  log(`🔒 ${step}`, colors.cyan);
}

function logHeader(title) {
  log(`\n${'='.repeat(80)}`, colors.bright);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(80)}`, colors.bright);
}

class SecurityGuardSkill {
  constructor(options = {}) {
    this.projectRoot = process.cwd();
    this.options = {
      target: options.target || 'src/',
      severity: options.severity || 'all',
      fix: options.fix || false,
      ...options
    };
    this.results = {
      vulnerabilities: [],
      dependencies: [],
      configIssues: [],
      score: 0
    };
  }

  // 安全扫描
  async scan() {
    logHeader('🔒 开始安全扫描');

    // 1. 代码安全扫描
    await this.scanCode();

    // 2. 依赖审计
    await this.auditDependencies();

    // 3. 配置检查
    await this.checkConfig();

    // 4. 计算安全评分
    this.calculateScore();

    return this.results;
  }

  // 代码扫描
  async scanCode() {
    logStep('扫描代码安全问题');

    const issues = [];
    const targetPath = path.join(this.projectRoot, this.options.target);

    if (!fs.existsSync(targetPath)) {
      logWarning(`目标路径不存在: ${targetPath}`);
      return;
    }

    const scanFile = (filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');

      // 1. XSS 检测
      const xssPatterns = [
        /dangerouslySetInnerHTML/,
        /innerHTML\s*=/,
        /document\.write\(/,
      ];

      xssPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          issues.push({
            type: 'XSS',
            severity: 'high',
            file: filePath,
            pattern: pattern.source,
            line: this.findLineNumber(content, pattern.source)
          });
        }
      });

      // 2. SQL 注入检测
      const sqlPatterns = [
        /SELECT.*FROM.*WHERE.*\+\s*\$/,
        /exec\(|.execute\(/,
        /query\(\s*['"`].*\$\{/,
      ];

      sqlPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          issues.push({
            type: 'SQL Injection',
            severity: 'critical',
            file: filePath,
            pattern: pattern.source,
            line: this.findLineNumber(content, pattern.source)
          });
        }
      });

      // 3. 硬编码密钥检测
      const secretPatterns = [
        /password\s*=\s*['"`][^'"`]{8,}['"`]/,
        /api[_-]?key\s*=\s*['"`][^'"`]{20,}['"`]/,
        /secret\s*=\s*['"`][^'"`]{16,}['"`]/,
        /token\s*=\s*['"`][^'"`]{32,}['"`]/,
      ];

      secretPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          issues.push({
            type: 'Hardcoded Secret',
            severity: 'high',
            file: filePath,
            pattern: pattern.source,
            line: this.findLineNumber(content, pattern.source)
          });
        }
      });

      // 4. 不安全的 eval
      if (content.includes('eval(')) {
        issues.push({
          type: 'Unsafe eval',
          severity: 'medium',
          file: filePath,
          pattern: 'eval(',
          line: this.findLineNumber(content, 'eval(')
        });
      }

      // 5. 不安全的 localStorage
      if (content.includes('localStorage') && content.includes('password')) {
        issues.push({
          type: 'Insecure Storage',
          severity: 'medium',
          file: filePath,
          pattern: 'localStorage + password',
          line: this.findLineNumber(content, 'localStorage')
        });
      }
    };

    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && !filePath.includes('node_modules')) {
          walkDir(filePath);
        } else if (/\.(js|jsx|ts|tsx)$/i.test(file)) {
          scanFile(filePath);
        }
      });
    };

    walkDir(targetPath);

    this.results.vulnerabilities = issues;

    if (issues.length > 0) {
      logWarning(`发现 ${issues.length} 个安全问题`);
      issues.forEach(issue => {
        log(`  [${issue.severity.toUpperCase()}] ${issue.type}`, colors.red);
        log(`    文件: ${issue.file}`, colors.yellow);
        log(`    行号: ${issue.line}`);
        log(`    模式: ${issue.pattern}`);
      });
    } else {
      logSuccess('未发现代码安全问题');
    }
  }

  // 依赖审计
  async auditDependencies() {
    logStep('审计依赖包安全');

    const issues = [];

    try {
      // 使用 npm audit
      const auditResult = execSync('npm audit --json', {
        cwd: this.projectRoot,
        encoding: 'utf8'
      });

      const auditData = JSON.parse(auditResult);

      if (auditData.vulnerabilities) {
        Object.entries(auditData.vulnerabilities).forEach(([pkgName, vuln]) => {
          if (this.shouldIncludeSeverity(vuln.severity)) {
            issues.push({
              package: pkgName,
              severity: vuln.severity,
              title: vuln.title,
              url: vuln.url,
              patchedVersions: vuln.patchedVersions,
              recommendation: vuln.patchedVersions
                ? `更新到: ${vuln.patchedVersions.join(', ')}`
                : '等待官方修复'
            });
          }
        });
      }

      // 如果需要自动修复
      if (this.options.fix && issues.length > 0) {
        logInfo('尝试自动修复依赖问题...');
        try {
          execSync('npm audit fix', {
            cwd: this.projectRoot,
            stdio: 'inherit'
          });
          logSuccess('依赖问题已修复');
        } catch (error) {
          logWarning('部分依赖问题无法自动修复');
        }
      }

    } catch (error) {
      // npm audit 可能返回非零退出码
      if (error.stdout) {
        try {
          const auditData = JSON.parse(error.stdout);
          if (auditData.vulnerabilities) {
            Object.entries(auditData.vulnerabilities).forEach(([pkgName, vuln]) => {
              if (this.shouldIncludeSeverity(vuln.severity)) {
                issues.push({
                  package: pkgName,
                  severity: vuln.severity,
                  title: vuln.title,
                  url: vuln.url,
                  recommendation: '更新依赖包'
                });
              }
            });
          }
        } catch (parseError) {
          logWarning('无法解析 npm audit 输出');
        }
      }
    }

    this.results.dependencies = issues;

    if (issues.length > 0) {
      logWarning(`发现 ${issues.length} 个依赖安全问题`);
      issues.forEach(issue => {
        log(`  [${issue.severity.toUpperCase()}] ${issue.package}`, colors.red);
        log(`    问题: ${issue.title}`);
        log(`    建议: ${issue.recommendation}`);
        if (issue.url) {
          log(`    详情: ${issue.url}`);
        }
      });
    } else {
      logSuccess('依赖包安全');
    }
  }

  // 配置检查
  async checkConfig() {
    logStep('检查安全配置');

    const issues = [];

    // 1. 检查 _headers 文件
    const headersFile = path.join(this.projectRoot, 'public', '_headers');
    if (!fs.existsSync(headersFile)) {
      issues.push({
        type: 'Missing Headers',
        severity: 'high',
        recommendation: '创建 _headers 文件配置安全响应头'
      });
    } else {
      const content = fs.readFileSync(headersFile, 'utf8');

      // 检查必要的安全头
      const requiredHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Strict-Transport-Security',
        'Content-Security-Policy'
      ];

      requiredHeaders.forEach(header => {
        if (!content.includes(header)) {
          issues.push({
            type: 'Missing Security Header',
            severity: 'medium',
            header: header,
            recommendation: `添加 ${header} 响应头`
          });
        }
      });
    }

    // 2. 检查 CORS 配置
    const functionsDir = path.join(this.projectRoot, 'functions');
    if (fs.existsSync(functionsDir)) {
      const apiFiles = this.findFiles(functionsDir, '.js');

      apiFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');

        if (content.includes('cors') && content.includes('*')) {
          issues.push({
            type: 'Insecure CORS',
            severity: 'medium',
            file: file,
            recommendation: '避免使用 CORS 通配符 *'
          });
        }
      });
    }

    // 3. 检查环境变量
    const envFiles = ['.env', '.env.local', '.env.production'];
    envFiles.forEach(envFile => {
      const envPath = path.join(this.projectRoot, envFile);
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');

        if (content.includes('password') || content.includes('secret')) {
          issues.push({
            type: 'Sensitive Data in .env',
            severity: 'low',
            file: envFile,
            recommendation: '确保 .env 文件在 .gitignore 中'
          });
        }
      }
    });

    // 4. 检查 .gitignore
    const gitignoreFile = path.join(this.projectRoot, '.gitignore');
    if (fs.existsSync(gitignoreFile)) {
      const content = fs.readFileSync(gitignoreFile, 'utf8');

      const requiredIgnores = ['.env', 'node_modules', '.DS_Store'];
      requiredIgnores.forEach(ignore => {
        if (!content.includes(ignore)) {
          issues.push({
            type: 'Missing .gitignore Entry',
            severity: 'low',
            entry: ignore,
            recommendation: `在 .gitignore 中添加 ${ignore}`
          });
        }
      });
    }

    this.results.configIssues = issues;

    if (issues.length > 0) {
      logWarning(`发现 ${issues.length} 个配置问题`);
      issues.forEach(issue => {
        log(`  [${issue.severity.toUpperCase()}] ${issue.type}`, colors.yellow);
        if (issue.file) log(`    文件: ${issue.file}`);
        if (issue.header) log(`    头: ${issue.header}`);
        log(`    建议: ${issue.recommendation}`);
      });
    } else {
      logSuccess('安全配置正确');
    }
  }

  // 渗透测试
  async pentest(types) {
    logHeader('🎯 渗透测试');

    const testTypes = types || ['xss', 'sql', 'injection'];

    logInfo(`测试类型: ${testTypes.join(', ')}`);

    const results = {};

    if (testTypes.includes('xss')) {
      results.xss = await this.testXSS();
    }

    if (testTypes.includes('sql')) {
      results.sql = await this.testSQLInjection();
    }

    if (testTypes.includes('injection')) {
      results.injection = await this.testInjection();
    }

    return results;
  }

  // XSS 测试
  async testXSS() {
    logStep('测试 XSS 漏洞');

    // 这里应该集成实际的渗透测试工具
    logInfo('XSS 测试需要专业工具支持');
    logInfo('建议使用: OWASP ZAP, Burp Suite');

    return {
      status: 'skipped',
      recommendation: '使用专业渗透测试工具'
    };
  }

  // SQL 注入测试
  async testSQLInjection() {
    logStep('测试 SQL 注入');

    logInfo('SQL 注入测试需要专业工具支持');
    logInfo('建议使用: sqlmap');

    return {
      status: 'skipped',
      recommendation: '使用专业渗透测试工具'
    };
  }

  // 注入攻击测试
  async testInjection() {
    logStep('测试注入攻击');

    logInfo('注入攻击测试需要专业工具支持');

    return {
      status: 'skipped',
      recommendation: '使用专业渗透测试工具'
    };
  }

  // 计算安全评分
  calculateScore() {
    let score = 100;

    // 根据漏洞严重程度扣分
    this.results.vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 8;
          break;
        case 'low':
          score -= 3;
          break;
      }
    });

    // 依赖问题扣分
    this.results.dependencies.forEach(dep => {
      switch (dep.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'high':
          score -= 10;
          break;
        case 'medium':
          score -= 5;
          break;
        case 'low':
          score -= 2;
          break;
      }
    });

    // 配置问题扣分
    this.results.configIssues.forEach(issue => {
      switch (issue.severity) {
        case 'high':
          score -= 10;
          break;
        case 'medium':
          score -= 5;
          break;
        case 'low':
          score -= 2;
          break;
      }
    });

    this.results.score = Math.max(0, score);
  }

  // 辅助方法
  findLineNumber(content, pattern) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(pattern)) {
        return i + 1;
      }
    }
    return '?';
  }

  shouldIncludeSeverity(severity) {
    if (this.options.severity === 'all') return true;
    if (this.options.severity === 'high') return ['critical', 'high'].includes(severity);
    if (this.options.severity === 'critical') return severity === 'critical';
    return true;
  }

  findFiles(dir, extension) {
    const files = [];
    const walkDir = (currentDir) => {
      const entries = fs.readdirSync(currentDir);
      entries.forEach(entry => {
        const fullPath = path.join(currentDir, entry);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.endsWith(extension)) {
          files.push(fullPath);
        }
      });
    };
    walkDir(dir);
    return files;
  }

  // 生成报告
  async report(format = 'markdown') {
    logHeader('📊 安全扫描报告');

    // 评分
    const score = this.results.score;
    const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

    log('\n🎯 安全评分:', colors.cyan);
    log(`  得分: ${score}/100`, colors.bright);
    log(`  等级: ${grade}`, score >= 80 ? colors.green : score >= 60 ? colors.yellow : colors.red);

    // 统计
    const vulnCount = this.results.vulnerabilities.length;
    const depCount = this.results.dependencies.length;
    const configCount = this.results.configIssues.length;

    log('\n\n📋 问题统计:', colors.cyan);
    log(`  代码漏洞: ${vulnCount}`, vulnCount > 0 ? colors.red : colors.green);
    log(`  依赖问题: ${depCount}`, depCount > 0 ? colors.red : colors.green);
    log(`  配置问题: ${configCount}`, configCount > 0 ? colors.yellow : colors.green);

    // 详细信息
    if (format === 'json') {
      const reportPath = path.join(this.projectRoot, 'security-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
      logSuccess(`\n报告已保存: ${reportPath}`);
    }

    return this.results;
  }
}

// CLI 接口
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'scan';

  const options = {
    target: args.includes('--target') ? args[args.indexOf('--target') + 1] : 'src/',
    severity: args.includes('--severity') ? args[args.indexOf('--severity') + 1] : 'all',
    fix: args.includes('--fix'),
    types: args.includes('--type') ? args[args.indexOf('--type') + 1].split(',') : ['xss', 'sql', 'injection'],
    url: args.includes('--url') ? args[args.indexOf('--url') + 1] : 'https://kn-wallpaperglue.com',
    format: args.includes('--format') ? args[args.indexOf('--format') + 1] : 'markdown'
  };

  const skill = new SecurityGuardSkill(options);

  try {
    switch (command) {
      case 'scan':
        await skill.scan();
        break;

      case 'audit-dependencies':
        await skill.auditDependencies();
        break;

      case 'pentest':
        await skill.pentest(options.types);
        break;

      case 'config-check':
        await skill.checkConfig();
        break;

      default:
        logError(`未知命令: ${command}`);
        log('\n可用命令:');
        log('  scan [--target] [--severity] [--fix]  - 安全扫描');
        log('  audit-dependencies [--fix]           - 依赖审计');
        log('  pentest [--type]                     - 渗透测试');
        log('  config-check                          - 配置检查');
        break;
    }

    await skill.report(options.format);
  } catch (error) {
    logError(`执行失败: ${error.message}`);
    process.exit(1);
  }
}

// 导出
module.exports = { SecurityGuardSkill };

// 如果直接运行
if (require.main === module) {
  main();
}
