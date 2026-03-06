/**
 * 面包屑导航集成示例
 *
 * 本文件展示如何在各种页面中集成面包屑导航组件
 */

import BreadcrumbNavigation from './BreadcrumbNavigation';

// ============================================
// 示例 1: 产品列表页 - 使用自动生成
// ============================================
export function ProductListPageExample() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 自动生成面包屑 - 会显示: 首页 > 产品中心 */}
      <BreadcrumbNavigation />

      <h1 className="text-3xl font-bold mb-6">产品中心</h1>
      {/* 产品列表内容 */}
    </div>
  );
}

// ============================================
// 示例 2: 产品详情页 - 自动生成
// ============================================
export function ProductDetailPageExample() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 自动生成面包屑 - 会显示: 首页 > 产品中心 > 墙纸胶 */}
      <BreadcrumbNavigation />

      <h1 className="text-3xl font-bold mb-6">墙纸胶</h1>
      {/* 产品详情内容 */}
    </div>
  );
}

// ============================================
// 示例 3: 关于我们 - 自动生成
// ============================================
export function AboutPageExample() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 自动生成面包屑 - 会显示: 首页 > 关于我们 */}
      <BreadcrumbNavigation />

      <h1 className="text-3xl font-bold mb-6">关于我们</h1>
      {/* 关于我们内容 */}
    </div>
  );
}

// ============================================
// 示例 4: 联系我们 - 自动生成
// ============================================
export function ContactPageExample() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 自动生成面包屑 - 会显示: 首页 > 联系我们 */}
      <BreadcrumbNavigation />

      <h1 className="text-3xl font-bold mb-6">联系我们</h1>
      {/* 联系我们内容 */}
    </div>
  );
}

// ============================================
// 示例 5: 自定义面包屑
// ============================================
export function CustomBreadcrumbExample() {
  const customItems = [
    { name: '首页', path: '/zh' },
    { name: '解决方案', path: '/zh/solutions' },
    { name: '工业应用', path: '/zh/solutions/industrial' },
    { name: '墙纸制造工艺', current: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 自定义面包屑 */}
      <BreadcrumbNavigation items={customItems} />

      <h1 className="text-3xl font-bold mb-6">墙纸制造工艺</h1>
      {/* 页面内容 */}
    </div>
  );
}

// ============================================
// 示例 6: 带样式的面包屑
// ============================================
export function StyledBreadcrumbExample() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 带自定义样式的面包屑 */}
      <BreadcrumbNavigation className="bg-gray-50 px-4 py-3 rounded-lg" />

      <h1 className="text-3xl font-bold mb-6 mt-6">页面标题</h1>
      {/* 页面内容 */}
    </div>
  );
}

// ============================================
// 示例 7: 博客文章页 - 自动生成
// ============================================
export function BlogPostExample() {
  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 自动生成面包屑 - 会显示: 首页 > 博客 > 文章标题 */}
      <BreadcrumbNavigation />

      <h1 className="text-4xl font-bold mb-4">如何选择合适的墙纸胶</h1>
      <p className="text-gray-600 mb-6">发布日期: 2025-01-23</p>
      {/* 博客文章内容 */}
    </article>
  );
}

// ============================================
// 示例 8: 在 Layout 中使用
// ============================================
export function LayoutWithBreadcrumbExample({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        {/* 导航栏 */}
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 所有子页面都会显示面包屑 */}
        <BreadcrumbNavigation />
        {children}
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        {/* 页脚 */}
      </footer>
    </div>
  );
}

// ============================================
// 使用建议
// ============================================

/**
 * 1. 自动模式（推荐用于大多数页面）
 *    - 直接使用 <BreadcrumbNavigation />
 *    - 组件会根据当前路径自动生成面包屑
 *    - 适用于：产品页、关于我们、联系我们等标准页面
 *
 * 2. 自定义模式（适用于特殊页面）
 *    - 提供 items 数组: <BreadcrumbNavigation items={items} />
 *    - 适用于：博客文章、自定义路径、特殊层级结构
 *
 * 3. 样式定制
 *    - 使用 className 属性添加自定义样式
 *    - 默认样式已经优化，通常不需要额外样式
 *
 * 4. 多语言支持
 *    - 确保在 locales 文件中添加了所有必要的翻译
 *    - 面包屑会自动根据当前语言显示
 *
 * 5. SEO 优化
 *    - 面包屑包含完整的 Schema.org BreadcrumbList 标记
 *    - 有助于 Google Rich Snippets 展示
 *    - 改善网站导航结构
 */
