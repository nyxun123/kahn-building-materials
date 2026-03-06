#!/usr/bin/env node

/**
 * 将 Markdown 博客文章转换为 blog-static-data.js 格式
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = path.join(__dirname, '../..');
const blogDataPath = path.join(projectRoot, 'functions/lib/blog-static-data.js');
const blogMarkdownPath = path.join(projectRoot, 'content-marketing/blogs');

/**
 * 解析 markdown 文件的 frontmatter
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return null;
  }

  const frontmatterText = match[1];
  const frontmatter = {};

  // 解析 key: value 或 key: [value1, value2] 格式
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // 处理数组格式
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(v => v.trim());
    }

    frontmatter[key] = value;
  });

  return frontmatter;
}

/**
 * 提取纯文本内容（移除 frontmatter）
 */
function extractContent(markdown) {
  const frontmatterRegex = /^---\n[\s\S]+?\n---\n/;
  return markdown.replace(frontmatterRegex, '');
}

/**
 * 将 markdown 内容转换为 HTML（简化版）
 */
function markdownToHtml(markdown) {
  let html = markdown;

  // 转换标题
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 转换加粗
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 转换斜体（如果不在加粗中）
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

  // 转换列表
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>');

  // 转换链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 转换表格
  const lines = html.split('\n');
  let inTable = false;
  let processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        processedLines.push('<table>');
        inTable = true;
      }

      // 移除首尾的 |
      const cells = line.slice(1, -1).split('|').map(c => c.trim());

      if (cells.some(c => /^[:\-]+$/.test(c))) {
        // 这是分隔行，跳过
        continue;
      }

      const isHeader = i > 0 && lines[i-1].startsWith('|') && lines[i-1].includes('---');
      const tag = isHeader ? 'th' : 'td';

      processedLines.push('<tr>');
      cells.forEach(cell => {
        processedLines.push(`<${tag}>${cell}</${tag}>`);
      });
      processedLines.push('</tr>');
    } else {
      if (inTable) {
        processedLines.push('</table>');
        inTable = false;
      }
      processedLines.push(line);
    }
  }

  if (inTable) {
    processedLines.push('</table>');
  }

  html = processedLines.join('\n');

  // 转换段落（简单版）
  html = html.replace(/\n\n/g, '</p><p>');
  html = `<p>${html}</p>`;

  return html;
}

/**
 * 生成多语言内容
 */
function generateMultiLanguageContent(zhContent) {
  // 对于英文和俄文，这里提供简化版本
  // 实际生产中应该使用翻译 API 或人工翻译

  const enContent = zhContent
    .replace(/环保墙纸胶/g, 'Eco-Friendly Wallpaper Glue')
    .replace(/墙纸胶/g, 'wallpaper glue')
    .replace(/施工/g, 'application')
    .replace(/本文/g, 'This article')
    .replace(/我们/g, 'we');

  const ruContent = zhContent
    .replace(/环保墙纸胶/g, 'экологичный клей для обоев')
    .replace(/墙纸胶/g, 'клей для обоев')
    .replace(/施工/g, 'применение')
    .replace(/本文/g, 'Эта статья')
    .replace(/我们/g, 'мы');

  return { zh: zhContent, en: enContent, ru: ruContent };
}

/**
 * 将 markdown 博客转换为静态数据格式
 */
function convertMarkdownToStaticArticle(markdownFilePath) {
  const markdown = fs.readFileSync(markdownFilePath, 'utf8');
  const frontmatter = parseFrontmatter(markdown);
  const content = extractContent(markdown);
  const contentHtml = markdownToHtml(content);

  // 生成多语言内容
  const multiLangContent = generateMultiLanguageContent(contentHtml);

  // 计算下一个 ID
  const blogDataFile = fs.readFileSync(blogDataPath, 'utf8');
  const idMatch = blogDataFile.match(/id:\s*(\d+)/g);
  const existingIds = idMatch ? idMatch.map(m => parseInt(m[1])) : [];
  const newId = Math.max(...existingIds, 0) + 1;

  // 构建文章对象
  const article = {
    id: newId,
    slug: frontmatter.slug || 'article',
    category: frontmatter.category || 'guide',
    tags: frontmatter.tags || [],
    author: 'Kahn Team',
    cover_image: '/images/blog/wallpaper-glue-cover.jpg',
    title_zh: frontmatter.title,
    title_en: frontmatter.title, // 简化：实际应该翻译
    title_ru: frontmatter.title, // 简化：实际应该翻译
    excerpt_zh: frontmatter.excerpt,
    excerpt_en: frontmatter.excerpt, // 简化：实际应该翻译
    excerpt_ru: frontmatter.excerpt, // 简化：实际应该翻译
    content_zh: contentHtml,
    content_en: multiLangContent.en,
    content_ru: multiLangContent.ru,
    meta_title_zh: frontmatter.meta_title || frontmatter.title,
    meta_title_en: frontmatter.meta_title || frontmatter.title,
    meta_title_ru: frontmatter.meta_title || frontmatter.title,
    meta_description_zh: frontmatter.meta_description,
    meta_description_en: frontmatter.meta_description, // 简化：实际应该翻译
    meta_description_ru: frontmatter.meta_description, // 简化：实际应该翻译
    view_count: 0,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return article;
}

/**
 * 生成静态数据的 JavaScript 代码
 */
function generateStaticDataCode(article) {
  // 读取现有文件
  const existingContent = fs.readFileSync(blogDataPath, 'utf8');

  // 在数组末尾添加新文章（在 ]; 之前）
  const articleCode = `  {
    id: ${article.id},
    slug: '${article.slug}',
    category: '${article.category}',
    tags: ${JSON.stringify(article.tags, null, 6)},
    author: '${article.author}',
    cover_image: '${article.cover_image}',
    title_zh: '${article.title_zh.replace(/'/g, "\\'")}',
    title_en: '${article.title_en.replace(/'/g, "\\'")}',
    title_ru: '${article.title_ru.replace(/'/g, "\\'")}',
    excerpt_zh: '${article.excerpt_zh.replace(/'/g, "\\'")}',
    excerpt_en: '${article.excerpt_en.replace(/'/g, "\\'")}',
    excerpt_ru: '${article.excerpt_ru.replace(/'/g, "\\'")}',
    content_zh: \`${article.content_zh.replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/\\/g, '\\\\')}\`,
    content_en: \`${article.content_en.replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/\\/g, '\\\\')}\`,
    content_ru: \`${article.content_ru.replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/\\/g, '\\\\')}\`,
    meta_title_zh: '${article.meta_title_zh.replace(/'/g, "\\'")}',
    meta_title_en: '${article.meta_title_en.replace(/'/g, "\\'")}',
    meta_title_ru: '${article.meta_title_ru.replace(/'/g, "\\'")}',
    meta_description_zh: '${article.meta_description_zh.replace(/'/g, "\\'")}',
    meta_description_en: '${article.meta_description_en.replace(/'/g, "\\'")}',
    meta_description_ru: '${article.meta_description_ru.replace(/'/g, "\\'")}',
    view_count: ${article.view_count},
    published_at: '${article.published_at}',
    created_at: '${article.created_at}',
    updated_at: '${article.updated_at}'
  }`;

  // 在 ]; 之前插入
  const updatedContent = existingContent.replace(
    /];$/,
    `,${articleCode}\n];`
  );

  return updatedContent;
}

/**
 * 主函数
 */
async function main() {
  console.log('🔄 博客文章集成工具\n');
  console.log('调试：开始执行main函数');

  // 查找所有 markdown 博客文件
  const markdownFiles = fs.readdirSync(blogMarkdownPath)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(blogMarkdownPath, file));

  console.log(`📝 找到 ${markdownFiles.length} 个 markdown 博客文件\n`);

  if (markdownFiles.length === 0) {
    console.log('❌ 没有找到 markdown 博客文件');
    return;
  }

  // 处理每个文件
  for (const markdownFile of markdownFiles) {
    console.log(`处理: ${path.basename(markdownFile)}`);

    try {
      // 转换为静态数据格式
      const article = convertMarkdownToStaticArticle(markdownFile);

      // 生成更新后的代码
      const updatedCode = generateStaticDataCode(article);

      // 备份原文件
      const backupPath = blogDataPath + '.backup';
      fs.copyFileSync(blogDataPath, backupPath);
      console.log(`  ✓ 已备份到: ${backupPath}`);

      // 写入更新后的文件
      fs.writeFileSync(blogDataPath, updatedCode, 'utf8');
      console.log(`  ✓ 已添加文章: "${article.title_zh}" (ID: ${article.id})`);
      console.log(`  ✓ Slug: ${article.slug}\n`);

    } catch (error) {
      console.error(`  ✗ 处理失败: ${error.message}\n`);
    }
  }

  console.log('✅ 集成完成！');
  console.log('\n下一步:');
  console.log('  1. 部署更新的 functions/api/blog.js');
  console.log('  2. 访问 /blog 查看新文章');
  console.log('  3. 在 Google Search Console 提交 sitemap');
}

// 运行
// 检查是否是主模块运行
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`;

if (isMainModule) {
  main().catch(console.error);
}

export { convertMarkdownToStaticArticle, generateStaticDataCode };
