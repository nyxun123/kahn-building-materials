import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  priority?: boolean; // 高优先级图片，预加载
  enableWebP?: boolean; // 启用WebP格式
  enableAvif?: boolean; // 启用AVIF格式
}

const SITE_URL = 'https://kn-wallpaperglue.com';
const PLACEHOLDER_SIZE = 20;

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  enableWebP = true,
  enableAvif = true
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  // 生成本地图片的响应式srcset
  const generateLocalSrcSet = (originalSrc: string, format?: string) => {
    const baseName = originalSrc.replace(/\.[^/.]+$/, '');
    const sizes = [400, 800, 1200, 1600];

    return sizes
      .map(size => {
        const webpSrc = `/images-optimized${baseName}-${size}.webp`;
        const avifSrc = `/images-optimized${baseName}-${size}.avif`;
        const fallbackSrc = originalSrc;

        if (format === 'webp') return `${webpSrc} ${size}w`;
        if (format === 'avif') return `${avifSrc} ${size}w`;
        return `${fallbackSrc} ${size}w`;
      })
      .join(', ');
  };

  // 生成低质量占位符
  const generatePlaceholder = (originalSrc: string) => {
    return originalSrc; // 可以添加blur效果
  };

  // 生成响应式srcset
  const srcSetWebP = enableWebP ? generateLocalSrcSet(src, 'webp') : undefined;
  const srcSetAvif = enableAvif ? generateLocalSrcSet(src, 'avif') : undefined;
  const placeholder = generatePlaceholder(src);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!priority && loading === 'lazy' && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: '50px', // 提前50px开始加载
        }
      );

      observer.observe(containerRef.current);

      return () => observer.disconnect();
    } else {
      setIsIntersecting(true);
    }
  }, [priority, loading]);

  // 预加载高优先级图片
  useEffect(() => {
    if (priority && isIntersecting) {
      const preloadImages = [
        { as: 'image', href: src },
        ...(srcSetWebP ? [{ as: 'image', type: 'image/webp', href: srcSetWebP }] : []),
        ...(srcSetAvif ? [{ as: 'image', type: 'image/avif', href: srcSetAvif }] : [])
      ];

      preloadImages.forEach(({ as, href, type }) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = as;
        link.href = href;
        if (type) {
          (link as any).type = type;
        }
        if (srcSetWebP && href !== src) {
          (link as any).imageSrcset = href;
          (link as any).sizes = sizes;
        }
        document.head.appendChild(link);
      });

      return () => {
        preloadImages.forEach(({ href }) => {
          const link = document.querySelector(`link[href="${href}"]`);
          if (link) document.head.removeChild(link);
        });
      };
    }
  }, [priority, isIntersecting, src, srcSetWebP, srcSetAvif, sizes]);

  // 错误处理
  const handleError = () => {
    setError(true);
    setIsLoaded(false);
  };

  // 加载成功
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // 如果加载出错，显示默认图片
  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center text-gray-500 ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} itemScope itemType="https://schema.org/ImageObject">
      {/* 低质量占位符 */}
      <img
        src={placeholder}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
          opacity: isLoaded ? 0 : 1
        }}
        aria-hidden="true"
      />

      {/* 响应式图片 */}
      {isIntersecting && (
        <picture>
          {/* AVIF格式 - 最佳压缩比 */}
          {enableAvif && srcSetAvif && (
            <source
              type="image/avif"
              srcSet={srcSetAvif}
              sizes={sizes}
            />
          )}

          {/* WebP格式 - 广泛支持 */}
          {enableWebP && srcSetWebP && (
            <source
              type="image/webp"
              srcSet={srcSetWebP}
              sizes={sizes}
            />
          )}

          {/* 主图片 */}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : loading}
            decoding="async"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              color: 'transparent', // 防止FOUC
            }}
            itemProp="contentUrl"
          />
        </picture>
      )}

      {/* 加载状态指示器 */}
      {!isLoaded && isIntersecting && !priority && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div
            className="animate-pulse bg-gray-300 w-full h-full"
            aria-label="Loading image"
          />
        </div>
      )}

      {/* SEO结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageObject',
            contentUrl: src.startsWith('http') ? src : `${SITE_URL}${src}`,
            description: alt,
            width: width,
            height: height,
            inLanguage: i18n.language
          })
        }}
      />
    </div>
  );
}

// 简化的响应式图片组件
export function ResponsiveImage({
  src,
  alt,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <picture className={className}>
      {/* WebP格式 */}
      <source
        type="image/webp"
        srcSet={src.replace(/\.[^/.]+$/, '.webp')}
        sizes={sizes}
      />
      {/* 原始格式作为fallback */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
      />
    </picture>
  );
}

// 图片SEO优化Hook
export function useImageSEO(imageSrc: string, alt: string, width?: number, height?: number) {
  return {
    itemProp: 'image',
    alt,
    width,
    height,
    loading: 'lazy',
    decoding: 'async'
  };
}