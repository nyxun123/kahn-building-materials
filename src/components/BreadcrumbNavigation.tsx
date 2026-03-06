import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  path?: string;
  current?: boolean;
}

interface BreadcrumbNavigationProps {
  items?: BreadcrumbItem[];
  className?: string;
  homePath?: string;
}

// 默认面包屑配置（根据当前路径自动生成）
const generateBreadcrumbs = (pathname: string, t: (key: string, defaultValue: string) => string): BreadcrumbItem[] => {
  const pathParts = pathname.split('/').filter(part => part !== '');

  // 移除语言前缀
  const langPrefixes = ['zh', 'en', 'ru', 'vi', 'th', 'id'];
  const startIndex = langPrefixes.includes(pathParts[0]) ? 1 : 0;
  const relevantParts = pathParts.slice(startIndex);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      name: t('breadcrumbs.home', '首页'),
      path: `/${pathParts[0] || ''}`,
    },
  ];

  let currentPath = `/${pathParts[0] || ''}`;

  // 页面名称映射
  const pageNameMap: Record<string, string> = {
    'products': t('breadcrumbs.products', '产品中心'),
    'product-detail': t('breadcrumbs.productDetail', '产品详情'),
    'applications': t('breadcrumbs.applications', '应用领域'),
    'about': t('breadcrumbs.about', '关于我们'),
    'contact': t('breadcrumbs.contact', '联系我们'),
    'oem': t('breadcrumbs.oem', 'OEM服务'),
    'solutions': t('breadcrumbs.solutions', '解决方案'),
    'blog': t('breadcrumbs.blog', '博客'),
  };

  // 产品名称映射
  const productNameMap: Record<string, string> = {
    'wallpaper-adhesive': t('products.wallpaperAdhesive', '墙纸胶'),
    'construction-cms': t('products.constructionCMS', '建筑用CMS'),
    'textile-cms': t('products.textileCMS', '纺织用CMS'),
    'coating-cms': t('products.coatingCMS', '涂料用CMS'),
    'paper-dyeing-cms': t('products.paperDyeingCMS', '造纸染色CMS'),
    'desiccant-gel': t('products.desiccantGel', '干燥剂凝胶'),
    'oem-service': t('products.oemService', 'OEM服务'),
  };

  // 生成面包屑
  relevantParts.forEach((part, index) => {
    const isLast = index === relevantParts.length - 1;

    if (productNameMap[part]) {
      breadcrumbs.push({
        name: productNameMap[part],
        current: isLast,
      });
    } else if (pageNameMap[part]) {
      currentPath += `/${part}`;
      breadcrumbs.push({
        name: pageNameMap[part],
        path: currentPath,
        current: isLast,
      });
    } else {
      // 动态路径（如博客slug）
      currentPath += `/${part}`;
      breadcrumbs.push({
        name: part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        current: isLast,
      });
    }
  });

  return breadcrumbs;
};

export function BreadcrumbNavigation({
  items,
  className = '',
  homePath = '/',
}: BreadcrumbNavigationProps) {
  const location = useLocation();
  const { t } = useTranslation();
  const translate = (key: string, defaultValue: string) => t(key, { defaultValue });

  // 如果没有提供items，则自动生成
  const breadcrumbs = items || generateBreadcrumbs(location.pathname, translate);

  if (breadcrumbs.length <= 1) {
    return null; // 只有首页时不显示面包屑
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`breadcrumb-navigation ${className}`}
      style={{
        padding: '1rem 0',
        marginBottom: '1rem',
      }}
    >
      <ol
        style={{
          listStyle: 'none',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          margin: 0,
          padding: 0,
          gap: '0.5rem',
        }}
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {breadcrumbs.map((item, index) => {
          const position = index + 1;
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={position.toString()} />

              {index > 0 && (
                <ChevronRight
                  size={16}
                  style={{ color: '#94a3b8', flexShrink: 0 }}
                  aria-hidden="true"
                />
              )}

              {item.path && !item.current ? (
                <Link
                  to={item.path}
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#2563eb';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#3b82f6';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                  itemProp="item"
                >
                  {index === 0 && <Home size={14} aria-hidden="true" />}
                  <span itemProp="name">{item.name}</span>
                </Link>
              ) : (
                <span
                  style={{
                    color: '#64748b',
                    fontWeight: isLast ? 600 : 400,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                  aria-current={isLast ? 'page' : undefined}
                  itemProp="item"
                >
                  {index === 0 && <Home size={14} aria-hidden="true" />}
                  <span itemProp="name">{item.name}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// 默认导出
export default BreadcrumbNavigation;
