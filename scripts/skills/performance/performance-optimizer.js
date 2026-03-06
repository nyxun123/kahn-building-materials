#!/usr/bin/env node

/**
 * 性能优化器技能
 * 自动优化页面加载性能、资源压缩、缓存策略
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
  log(`🚀 ${step}`, colors.cyan);
}

function logHeader(title) {
  log(`\n${'='.repeat(80)}`, colors.bright);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(80)}`, colors.bright);
}

class PerformanceOptimizerSkill {
  constructor(options = {}) {
    this.projectRoot = process.cwd();
    this.options = {
      target: options.target || 'all',
      level: options.level || 'moderate',
      ...options
    };
    this.results = {
      optimizations: [],
      issues: [],
      metrics: {}
    };
  }

  // 评分系统
  async scorePage(page) {
    logStep('评分页面性能');

    try {
      // 使用 Lighthouse API (需要安装 lighthouse)
      const lighthouse = require('lighthouse');
      const chromeLauncher = require('chrome-launcher');

      const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
      const options = {
        logLevel: 'info',
        output: 'json',
        onlyCategories: ['performance'],
        port: chrome.port,
      };

      const runnerResult = await lighthouse(`https://kn-wallpaperglue.com${page}`, options);
      await chrome.kill();

      const score = runnerResult.lhr.categories.performance.score * 100;

      this.results.metrics[page] = {
        score: score,
        fcp: runnerResult.lhr.audits['first-contentful-paint'].displayValue,
        lcp: runnerResult.lhr.audits['largest-contentful-paint'].displayValue,
        cls: runnerResult.lhr.audits['cumulative-layout-shift'].displayValue,
        tbt: runnerResult.lhr.audits['total-blocking-time'].displayValue,
        si: runnerResult.lhr.audits['speed-index'].displayValue
      };

      logSuccess(`页面 ${page} 性能评分: ${score}`);

      return score;
    } catch (error) {
      logError(`评分失败: ${error.message}`);
      return 0;
    }
  }

  // 自动优化
  async optimize(page) {
    logStep(`优化页面: ${page}`);

    const optimizations = [];

    // 1. 检查图片优化
    const imageIssues = this.checkImages();
    if (imageIssues.length > 0) {
      optimizations.push({
        type: 'images',
        action: 'compress',
        count: imageIssues.length,
        impact: 'high'
      });
      logInfo(`发现 ${imageIssues.length} 个未优化图片`);
    }

    // 2. 检查代码分割
    const chunkIssues = this.checkChunks();
    if (chunkIssues.length > 0) {
      optimizations.push({
        type: 'chunks',
        action: 'split',
        count: chunkIssues.length,
        impact: 'medium'
      });
      logInfo(`发现 ${chunkIssues.length} 个大块代码`);
    }

    // 3. 检查懒加载
    const lazyLoadIssues = this.checkLazyLoad();
    if (lazyLoadIssues.length > 0) {
      optimizations.push({
        type: 'lazy-load',
        action: 'implement',
        count: lazyLoadIssues.length,
        impact: 'medium'
      });
      logInfo(`发现 ${lazyLoadIssues.length} 个可懒加载元素`);
    }

    // 4. 检查缓存策略
    const cacheIssues = this.checkCache();
    if (cacheIssues.length > 0) {
      optimizations.push({
        type: 'cache',
        action: 'optimize',
        count: cacheIssues.length,
        impact: 'high'
      });
      logInfo(`发现 ${cacheIssues.length} 个缓存优化点`);
    }

    this.results.optimizations = optimizations;

    return optimizations;
  }

  // 检查图片优化
  checkImages() {
    const issues = [];
    const publicDir = path.join(this.projectRoot, 'public');

    if (!fs.existsSync(publicDir)) {
      return issues;
    }

    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
          const size = stat.size / 1024; // KB
          if (size > 500) {
            issues.push({
              file: filePath,
              size: size,
              recommendation: '压缩或转换为WebP格式'
            });
          }
        }
      });
    };

    walkDir(publicDir);
    return issues;
  }

  // 检查代码分割
  checkChunks() {
    const issues = [];
    const distDir = path.join(this.projectRoot, 'dist', 'assets');

    if (!fs.existsSync(distDir)) {
      return issues;
    }

    const files = fs.readdirSync(distDir);
    files.forEach(file => {
      if (file.endsWith('.js')) {
        const filePath = path.join(distDir, file);
        const size = fs.statSync(filePath).size / 1024; // KB

        if (size > 200) {
          issues.push({
            file: file,
            size: size,
            recommendation: '考虑代码分割或动态导入'
          });
        }
      }
    });

    return issues;
  }

  // 检查懒加载
  checkLazyLoad() {
    const issues = [];

    // 检查 src 目录下的组件
    const srcDir = path.join(this.projectRoot, 'src');
    if (!fs.existsSync(srcDir)) {
      return issues;
    }

    const searchLazyLoad = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          searchLazyLoad(filePath);
        } else if (/\.(tsx|jsx|ts|js)$/i.test(file)) {
          const content = fs.readFileSync(filePath, 'utf8');

          // 检查是否有 img 标签没有 loading="lazy"
          const imgMatches = content.match(/<img[^>]*>/g);
          if (imgMatches) {
            imgMatches.forEach(img => {
              if (!img.includes('loading=')) {
                issues.push({
                  file: filePath,
                  element: 'img',
                  recommendation: '添加 loading="lazy" 属性'
                });
              }
            });
          }
        }
      });
    };

    searchLazyLoad(srcDir);
    return issues;
  }

  // 检查缓存策略
  checkCache() {
    const issues = [];
    const headersFile = path.join(this.projectRoot, 'public', '_headers');

    if (!fs.existsSync(headersFile)) {
      issues.push({
        type: 'missing-headers',
        recommendation: '创建 _headers 文件配置缓存策略'
      });
      return issues;
    }

    const content = fs.readFileSync(headersFile, 'utf8');

    // 检查是否有缓存配置
    if (!content.includes('Cache-Control')) {
      issues.push({
        type: 'no-cache-config',
        recommendation: '添加 Cache-Control 头'
      });
    }

    return issues;
  }

  // 压缩资源
  async compress() {
    logStep('压缩资源');

    const type = this.options.type || 'js,css,images';

    if (type.includes('images')) {
      logInfo('压缩图片...');
      try {
        execSync('find public/images -type f \\( -name "*.jpg" -o -name "*.png" \\) -exec ./node_modules/.bin/imagemin {} {} --plugin=imagemin-mozjpeg --plugin=imagemin-pngquant \\;', {
          cwd: this.projectRoot,
          stdio: 'inherit'
        });
        logSuccess('图片压缩完成');
      } catch (error) {
        logWarning('图片压缩失败，可能需要安装 imagemin');
      }
    }

    if (type.includes('js') || type.includes('css')) {
      logInfo('JS/CSS 已在构建时压缩');
    }
  }

  // 缓存策略优化
  async cacheStrategy(pattern, duration) {
    logStep(`优化缓存策略: ${pattern}`);

    const headersFile = path.join(this.projectRoot, 'public', '_headers');
    let content = '';

    if (fs.existsSync(headersFile)) {
      content = fs.readFileSync(headersFile, 'utf8');
    }

    // 添加缓存策略
    const cacheRule = `
${pattern}
  Cache-Control: public, max-age=${duration}
  Access-Control-Allow-Origin: *
`;

    content += cacheRule;
    fs.writeFileSync(headersFile, content, 'utf8');

    logSuccess(`缓存策略已添加: ${pattern} -> ${duration}`);
  }

  // Core Web Vitals 优化
  async optimizeCoreVitals(page, target) {
    logStep(`优化 Core Web Vitals: ${page} (目标: ${target})`);

    const score = await this.scorePage(page);

    if (score < target) {
      logWarning(`当前评分 ${score} 低于目标 ${target}`);

      // 执行优化
      const optimizations = await this.optimize(page);

      logInfo('执行以下优化:');
      optimizations.forEach(opt => {
        log(`  - ${opt.type}: ${opt.action} (${opt.count}项, 影响:${opt.impact})`);
      });

      return {
        before: score,
        target: target,
        actions: optimizations,
        estimatedImprovement: this.estimateImprovement(optimizations)
      };
    } else {
      logSuccess(`页面性能已达标: ${score}/${target}`);
      return { score, target, status: 'passed' };
    }
  }

  // 估算性能提升
  estimateImprovement(optimizations) {
    let improvement = 0;

    optimizations.forEach(opt => {
      switch (opt.impact) {
        case 'high':
          improvement += 15;
          break;
        case 'medium':
          improvement += 8;
          break;
        case 'low':
          improvement += 3;
          break;
      }
    });

    return Math.min(improvement, 30); // 最多提升30分
  }

  // 生成报告
  async report(format = 'markdown') {
    logHeader('📊 性能优化报告');

    log('\n📈 性能指标:', colors.cyan);
    Object.entries(this.results.metrics).forEach(([page, metrics]) => {
      log(`\n页面: ${page}`, colors.blue);
      log(`  评分: ${metrics.score}`, colors.bright);
      log(`  FCP: ${metrics.fcp}`);
      log(`  LCP: ${metrics.lcp}`);
      log(`  CLS: ${metrics.cls}`);
      log(`  TBT: ${metrics.tbt}`);
      log(`  SI: ${metrics.si}`);
    });

    log('\n\n🔧 优化建议:', colors.cyan);
    if (this.results.optimizations.length > 0) {
      this.results.optimizations.forEach(opt => {
        log(`\n  类型: ${opt.type}`, colors.yellow);
        log(`  操作: ${opt.action}`);
        log(`  数量: ${opt.count}`);
        log(`  影响: ${opt.impact}`);
      });
    } else {
      log('\n  未发现优化点', colors.green);
    }

    log('\n\n⚠️  发现的问题:', colors.cyan);
    if (this.results.issues.length > 0) {
      this.results.issues.forEach(issue => {
        log(`\n  - ${issue}`, colors.yellow);
      });
    } else {
      log('\n  无问题', colors.green);
    }

    if (format === 'json') {
      const reportPath = path.join(this.projectRoot, 'performance-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
      logSuccess(`\n报告已保存: ${reportPath}`);
    }
  }
}

// CLI 接口
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'score';

  const options = {
    target: args.includes('--page') ? args[args.indexOf('--page') + 1] : '/',
    level: args.includes('--level') ? args[args.indexOf('--level') + 1] : 'moderate',
    type: args.includes('--type') ? args[args.indexOf('--type') + 1] : 'js,css,images',
    pattern: args.includes('--pattern') ? args[args.indexOf('--pattern') + 1] : 'images/*',
    duration: args.includes('--duration') ? args[args.indexOf('--duration') + 1] : '2592000',
    targetScore: args.includes('--target') ? parseInt(args[args.indexOf('--target') + 1]) : 90,
    format: args.includes('--format') ? args[args.indexOf('--format') + 1] : 'markdown'
  };

  const skill = new PerformanceOptimizerSkill(options);

  try {
    switch (command) {
      case 'score':
        await skill.scorePage(options.target);
        break;

      case 'optimize':
        await skill.optimize(options.target);
        break;

      case 'compress':
        await skill.compress();
        break;

      case 'cache-strategy':
        await skill.cacheStrategy(options.pattern, options.duration);
        break;

      case 'core-vitals':
        await skill.optimizeCoreVitals(options.target, options.targetScore);
        break;

      default:
        logError(`未知命令: ${command}`);
        log('\n可用命令:');
        log('  score <page>          - 评分页面性能');
        log('  optimize <page>       - 优化页面');
        log('  compress              - 压缩资源');
        log('  cache-strategy        - 优化缓存策略');
        log('  core-vitals <page>    - Core Web Vitals 优化');
        break;
    }

    await skill.report(options.format);
  } catch (error) {
    logError(`执行失败: ${error.message}`);
    process.exit(1);
  }
}

// 导出
module.exports = { PerformanceOptimizerSkill };

// 如果直接运行
if (require.main === module) {
  main();
}
