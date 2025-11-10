import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  webpSrc?: string; // WebP 格式的图片路径
  className?: string;
  placeholderSrc?: string; // 占位图（可选）
}

/**
 * 懒加载图片组件
 * 支持 WebP 格式和渐进式加载
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  webpSrc,
  alt,
  className = '',
  placeholderSrc,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 使用 Intersection Observer 检测图片是否进入视口
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
        }
        });
      },
      {
        rootMargin: '50px', // 提前50px开始加载
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // 获取WebP图片路径（自动转换）
  const getWebPSrc = () => {
    if (webpSrc) return webpSrc;
    
    // 自动将jpg/png替换为webp
    if (src.match(/\.(jpe?g|png)$/i)) {
      return src.replace(/\.(jpe?g|png)$/i, '.webp');
    }
    
    return null;
    };
    
  const webpPath = getWebPSrc();

  return (
    <picture ref={imgRef as any}>
      {/* WebP 格式（现代浏览器） */}
      {webpPath && isInView && (
        <source srcSet={webpPath} type="image/webp" />
      )}
      
      {/* 原始格式（fallback） */}
      <img
        src={isInView ? src : (placeholderSrc || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E')}
      alt={alt}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        {...props}
    />
    </picture>
  );
};

export default LazyImage;
