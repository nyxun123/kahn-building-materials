#!/usr/bin/env node

/**
 * Sitemap自动生成和更新脚本
 * 为多语言网站自动生成sitemap并提交到搜索引擎
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
  log(`\n${'='.repeat(60)}`, colors.bright);
  log(`${title}`, colors.bright);
  log(`${'='.repeat(60)}`, colors.bright);
}

class SitemapGenerator {
  constructor() {
    this.domain = 'https://kn-wallpaperglue.com';
    this.projectRoot = process.cwd();
    this.publicPath = path.join(this.projectRoot, 'public');

    // 语言配置
    this.languages = {
      zh: {
        name: '中文',
        path: '',
        priority: 1.0
      },
      en: {
        name: 'English',
        path: '/en',
        priority: 0.9
      },
      ru: {
        name: 'Русский',
        path: '/ru',
        priority: 0.8
      },
      vi: {
        name: 'Tiếng Việt',
        path: '/vi',
        priority: 0.7
      },
      th: {
        name: 'ไทย',
        path: '/th',
        priority: 0.6
      },
      id: {
        name: 'Bahasa Indonesia',
        path: '/id',
        priority: 0.6
      }
    };

    // 页面配置
    this.pages = [
      {
        path: '/',
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: new Date().toISOString()
      },
      {
        path: '/products',
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString()
      },
      {
        path: '/applications',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        path: '/oem',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        path: '/about',
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString()
      },
      {
        path: '/contact',
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString()
      },
      {
        path: '/faq',
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString()
      }
    ];

    // 产品类别（从产品数据中生成）
    this.productCategories = [
      {
        path: '/products/wallpaper-adhesive',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        path: '/products/textile-auxiliary',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      },
      {
        path: '/products/coating-additive',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString()
      }
    ];
  }

  // 获取最新的修改时间
  getLastModifiedDate(filePath) {
    try {
      const fullPath = path.join(this.projectRoot, filePath);
      const stats = fs.statSync(fullPath);
      return stats.mtime.toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  }

  // 生成XML头部
  generateXmlHeader() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;
  }

  // 生成XML尾部
  generateXmlFooter() {
    return '</urlset>\n';
  }

  // 生成单个URL条目
  generateUrlEntry(url, changefreq, priority, lastmod, alternates = []) {
    let entry = `  <url>\n`;
    entry += `    <loc>${url}</loc>\n`;
    entry += `    <lastmod>${lastmod}</lastmod>\n`;
    entry += `    <changefreq>${changefreq}</changefreq>\n`;
    entry += `    <priority>${priority}</priority>\n`;

    // 添加多语言链接
    if (alternates.length > 0) {
      alternates.forEach(alt => {
        entry += `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.url}" />\n`;
      });
    }

    entry += `  </url>\n`;
    return entry;
  }

  // 生成多语言版本的URL
  generateMultilingualUrls() {
    const urls = [];

    for (const [lang, langConfig] of Object.entries(this.languages)) {
      for (const page of this.pages) {
        const fullPath = langConfig.path + page.path;
        const url = this.domain + fullPath;

        // 生成所有语言版本的链接
        const alternates = Object.entries(this.languages).map(([altLang, altConfig]) => ({
          lang: altLang,
          url: this.domain + altConfig.path + page.path
        }));

        urls.push({
          url: url,
          changefreq: page.changefreq,
          priority: page.priority * langConfig.priority,
          lastmod: page.lastmod,
          alternates: alternates
        });
      }
    }

    return urls;
  }

  // 生成主sitemap
  generateMainSitemap() {
    logStep('生成主sitemap');

    let xml = this.generateXmlHeader();

    // 添加主页面
    const urls = this.generateMultilingualUrls();
    for (const urlData of urls) {
      xml += this.generateUrlEntry(
        urlData.url,
        urlData.changefreq,
        urlData.priority,
        urlData.lastmod,
        urlData.alternates
      );
    }

    xml += this.generateXmlFooter();

    // 保存主sitemap
    const mainSitemapPath = path.join(this.publicPath, 'sitemap.xml');
    fs.writeFileSync(mainSitemapPath, xml);

    logSuccess(`主sitemap已生成: sitemap.xml (${urls.length} 个URL)`);

    return mainSitemapPath;
  }

  // 生成分语言sitemap
  generateLanguageSitemaps() {
    logStep('生成分语言sitemap');

    const sitemapFiles = [];

    for (const [lang, langConfig] of Object.entries(this.languages)) {
      let xml = this.generateXmlHeader();

      // 添加该语言的所有页面
      for (const page of this.pages) {
        const fullPath = langConfig.path + page.path;
        const url = this.domain + fullPath;

        // 只添加该语言的链接，不添加其他语言版本
        xml += this.generateUrlEntry(
          url,
          page.changefreq,
          page.priority * langConfig.priority,
          page.lastmod,
          []
        );
      }

      xml += this.generateXmlFooter();

      // 保存语言特定sitemap
      const filename = `sitemap-${lang}.xml`;
      const sitemapPath = path.join(this.publicPath, filename);
      fs.writeFileSync(sitemapPath, xml);

      logSuccess(`${langConfig.name} sitemap已生成: ${filename}`);
      sitemapFiles.push(filename);
    }

    return sitemapFiles;
  }

  // 生成产品sitemap
  generateProductSitemap() {
    logStep('生成产品sitemap');

    let xml = this.generateXmlHeader();

    // 添加产品页面
    for (const category of this.productCategories) {
      const url = this.domain + category.path;
      xml += this.generateUrlEntry(
        url,
        category.changefreq,
        category.priority,
        category.lastmod,
        []
      );
    }

    xml += this.generateXmlFooter();

    // 保存产品sitemap
    const productSitemapPath = path.join(this.publicPath, 'sitemap-products.xml');
    fs.writeFileSync(productSitemapPath, xml);

    logSuccess(`产品sitemap已生成: sitemap-products.xml`);

    return productSitemapPath;
  }

  // 生成sitemap索引文件
  generateSitemapIndex() {
    logStep('生成sitemap索引文件');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    const sitemaps = [
      'sitemap.xml',
      'sitemap-zh.xml',
      'sitemap-en.xml',
      'sitemap-ru.xml',
      'sitemap-vi.xml',
      'sitemap-th.xml',
      'sitemap-id.xml',
      'sitemap-products.xml'
    ];

    for (const sitemap of sitemaps) {
      const sitemapUrl = `${this.domain}/${sitemap}`;
      const lastmod = new Date().toISOString();

      xml += `  <sitemap>\n`;
      xml += `    <loc>${sitemapUrl}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `  </sitemap>\n`;
    }

    xml += '</sitemapindex>\n';

    // 保存索引文件
    const indexPath = path.join(this.publicPath, 'sitemap-index.xml');
    fs.writeFileSync(indexPath, xml);

    logSuccess(`Sitemap索引已生成: sitemap-index.xml`);

    return indexPath;
  }

  // 验证sitemap文件
  validateSitemaps(sitemapFiles) {
    logStep('验证sitemap文件');

    const results = [];

    for (const sitemapFile of sitemapFiles) {
      const filePath = path.join(this.publicPath, sitemapFile);

      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');

          // 简单的XML验证
          if (content.includes('<urlset') && content.includes('</urlset>')) {
            const urlCount = (content.match(/<url>/g) || []).length;
            logSuccess(`${sitemapFile}: 有效 (${urlCount} 个URL)`);
            results.push({ file: sitemapFile, valid: true, urlCount });
          } else {
            logError(`${sitemapFile}: 无效的XML格式`);
            results.push({ file: sitemapFile, valid: false });
          }
        } catch (error) {
          logError(`${sitemapFile}: 读取失败 - ${error.message}`);
          results.push({ file: sitemapFile, valid: false, error: error.message });
        }
      } else {
        logError(`${sitemapFile}: 文件不存在`);
        results.push({ file: sitemapFile, valid: false, error: 'File not found' });
      }
    }

    return results;
  }

  // 生成sitemap统计信息
  generateSitemapStats() {
    logStep('生成sitemap统计信息');

    const sitemapPath = path.join(this.publicPath, 'sitemap.xml');
    let totalUrls = 0;
    let totalPages = 0;
    let languageStats = {};

    if (fs.existsSync(sitemapPath)) {
      try {
        const content = fs.readFileSync(sitemapPath, 'utf8');
        totalUrls = (content.match(/<url>/g) || []).length;

        // 统计各语言页面数量
        for (const [lang, langConfig] of Object.entries(this.languages)) {
          languageStats[lang] = {
            name: langConfig.name,
            pages: this.pages.length,
            priority: langConfig.priority
          };
        }

        totalPages = this.pages.length;
      } catch (error) {
        logError(`统计信息生成失败: ${error.message}`);
      }
    }

    const stats = {
      totalUrls: totalUrls,
      totalPages: totalPages,
      languages: languageStats,
      generatedAt: new Date().toISOString()
    };

    // 保存统计信息
    const statsPath = path.join(this.projectRoot, 'sitemap-stats.json');
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

    logSuccess(`Sitemap统计信息已保存: ${stats.totalUrls} 个总URL`);

    return stats;
  }

  // 完整的sitemap生成流程
  async generate() {
    logHeader('🗺️  Sitemap自动生成系统');
    log(`📅 开始时间: ${new Date().toLocaleString('zh-CN')}`, colors.blue);

    const results = {};

    try {
      // 1. 确保public目录存在
      if (!fs.existsSync(this.publicPath)) {
        fs.mkdirSync(this.publicPath, { recursive: true });
        logInfo('创建public目录');
      }

      // 2. 生成主sitemap
      results.mainSitemap = this.generateMainSitemap();

      // 3. 生成分语言sitemap
      results.languageSitemaps = this.generateLanguageSitemaps();

      // 4. 生成产品sitemap
      results.productSitemap = this.generateProductSitemap();

      // 5. 生成sitemap索引
      results.sitemapIndex = this.generateSitemapIndex();

      // 6. 验证所有sitemap文件
      const allSitemaps = [
        'sitemap.xml',
        ...results.languageSitemaps,
        'sitemap-products.xml',
        'sitemap-index.xml'
      ];
      results.validation = this.validateSitemaps(allSitemaps);

      // 7. 生成统计信息
      results.stats = this.generateSitemapStats();

      // 8. 显示总结
      logHeader('📊 Sitemap生成总结');
      logSuccess(`✅ 总URL数量: ${results.stats.totalUrls}`);
      logSuccess(`✅ 支持语言: ${Object.keys(this.languages).length} 种`);
      logSuccess(`✅ Sitemap文件: ${allSitemaps.length} 个`);

      log('\n📋 生成的文件:', colors.blue);
      allSitemaps.forEach(file => {
        log(`  📄 ${file}`, colors.yellow);
      });

      log('\n🌐 访问链接:', colors.blue);
      allSitemaps.forEach(file => {
        log(`  🔗 ${this.domain}/${file}`, colors.yellow);
      });

      log('\n🎯 后续建议:', colors.blue);
      log('1. 在搜索引擎控制台提交sitemap', colors.yellow);
      log('2. 定期更新sitemap（建议每周一次）', colors.yellow);
      log('3. 监控sitemap的索引状态', colors.yellow);

      logSuccess('\n🎉 Sitemap生成完成！');

      return results;

    } catch (error) {
      logError(`Sitemap生成失败: ${error.message}`);
      throw error;
    }
  }
}

// 主函数
async function main() {
  const generator = new SitemapGenerator();
  await generator.generate().catch(error => {
    logError(`脚本执行失败: ${error.message}`);
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}

exports.SitemapGenerator = SitemapGenerator;