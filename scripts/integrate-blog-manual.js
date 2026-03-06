#!/usr/bin/env node

/**
 * 简化版博客文章集成工具
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const blogDataPath = path.join(projectRoot, 'functions/lib/blog-static-data.js');
const blogMarkdownPath = path.join(projectRoot, 'content-marketing/blogs');

console.log('🔄 博客文章集成工具\n');

// 查找所有 markdown 博客文件
const markdownFiles = fs.readdirSync(blogMarkdownPath)
  .filter(file => file.endsWith('.md'))
  .map(file => path.join(blogMarkdownPath, file));

console.log(`📝 找到 ${markdownFiles.length} 个 markdown 博客文件\n`);

if (markdownFiles.length === 0) {
  console.log('❌ 没有找到 markdown 博客文件');
  process.exit(0);
}

// 只处理第一个文件（我们创建的SEO文章）
const markdownFile = markdownFiles.find(f => f.includes('eco-friendly-wallpaper-glue-guide'));

if (!markdownFile) {
  console.log('❌ 没有找到 eco-friendly-wallpaper-glue-guide.md 文件');
  process.exit(0);
}

console.log(`处理: ${path.basename(markdownFile)}\n`);

// 读取markdown文件
const markdown = fs.readFileSync(markdownFile, 'utf8');

// 提取 frontmatter
const frontmatterRegex = /^---\n([\s\S]+?)\n---\n/;
const frontmatterMatch = markdown.match(frontmatterRegex);

if (!frontmatterMatch) {
  console.log('❌ 无法解析 frontmatter');
  process.exit(1);
}

const frontmatterText = frontmatterMatch[1];
const frontmatter = {};

// 解析 frontmatter
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

console.log('✓ Frontmatter 解析成功');
console.log(`  标题: ${frontmatter.title}`);
console.log(`  Slug: ${frontmatter.slug}`);
console.log(`  分类: ${frontmatter.category}`);

// 提取内容（移除 frontmatter）
const content = markdown.replace(frontmatterRegex, '');

// 简单的 markdown 到 HTML 转换
function markdownToHtml(md) {
  let html = md;

  // 转换标题
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 转换加粗
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 转换图片（要在链接转换之前）
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // 转换链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 转换段落
  html = html.replace(/\n\n/g, '</p><p>');
  html = `<p>${html}</p>`;

  return html;
}

const contentHtml = markdownToHtml(content);
console.log('✓ Markdown 转 HTML 完成');

// 读取现有 blog-static-data.js
const blogDataFile = fs.readFileSync(blogDataPath, 'utf8');

// 找到最大的 ID
const idMatch = blogDataFile.match(/id:\s*(\d+)/g);
const existingIds = idMatch ? idMatch.map(m => parseInt(m.split(': ')[1])) : [];
const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
const newId = maxId + 1;

console.log(`✓ 计算新文章 ID: ${newId}`);

// 生成当前时间
const now = new Date().toISOString();

// 构建文章对象
const article = {
  id: newId,
  slug: frontmatter.slug || 'eco-friendly-wallpaper-glue-guide',
  category: frontmatter.category || 'guide',
  tags: frontmatter.tags || ['环保', '墙纸胶', '选择指南'],
  author: 'Kahn Team',
  cover_image: '/images/blog/wallpaper-glue-cover.jpg',
  title_zh: frontmatter.title,
  title_en: frontmatter.title, // 简化处理
  title_ru: frontmatter.title, // 简化处理
  excerpt_zh: frontmatter.excerpt || frontmatter.title,
  excerpt_en: frontmatter.excerpt || frontmatter.title,
  excerpt_ru: frontmatter.excerpt || frontmatter.title,
  content_zh: contentHtml,
  content_en: contentHtml, // 简化处理
  content_ru: contentHtml, // 简化处理
  meta_title_zh: frontmatter.meta_title || frontmatter.title,
  meta_title_en: frontmatter.meta_title || frontmatter.title,
  meta_title_ru: frontmatter.meta_title || frontmatter.title,
  meta_description_zh: frontmatter.meta_description || frontmatter.excerpt,
  meta_description_en: frontmatter.meta_description || frontmatter.excerpt,
  meta_description_ru: frontmatter.meta_description || frontmatter.excerpt,
  view_count: 0,
  published_at: now,
  created_at: now,
  updated_at: now
};

// 生成 JavaScript 代码
const tagsJson = JSON.stringify(article.tags, null, 2);
const articleCode = `  {
    id: ${article.id},
    slug: '${article.slug}',
    category: '${article.category}',
    tags: ${tagsJson.replace(/\n/g, '\n    ')},
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

// 备份原文件
const backupPath = blogDataPath + '.backup';
fs.copyFileSync(blogDataPath, backupPath);
console.log(`✓ 已备份到: ${backupPath}`);

// 在 ]; 之前插入新文章
// 使用更简单的字符串替换
const updatedContent = blogDataFile.replace(
  /]\s*;\s*$/,
  `${articleCode}\n];`
);

// 写入更新后的文件
fs.writeFileSync(blogDataPath, updatedContent, 'utf8');

console.log(`✓ 已添加文章: "${article.title_zh}" (ID: ${article.id})`);
console.log(`✓ Slug: ${article.slug}`);
console.log('\n✅ 集成完成！');
console.log('\n下一步:');
console.log('  1. 运行 pnpm dev 预览网站');
console.log('  2. 访问 /blog 查看新文章');
console.log('  3. 访问 /blog/' + article.slug + ' 查看文章详情');
console.log('  4. 在 Google Search Console 提交 sitemap');
