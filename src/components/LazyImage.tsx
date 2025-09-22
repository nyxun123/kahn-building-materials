import { useState, useRef, useEffect, memo } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  errorFallback?: string;
  loading?: 'eager' | 'lazy';
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage = memo(function LazyImage({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  errorFallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=',
  loading = 'lazy',
  onLoad,
  onError
}: LazyImageProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement) return;

    // If loading is eager, load immediately
    if (loading === 'eager') {
      loadImage();
      return;
    }

    // Create intersection observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadImage();
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observerRef.current.observe(imgElement);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, loading]);

  const loadImage = () => {
    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(src);
      setImageState('loaded');
      onLoad?.();
    };
    
    img.onerror = () => {
      setCurrentSrc(errorFallback);
      setImageState('error');
      onError?.();
    };
    
    img.src = src;
  };

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${
        imageState === 'loading' ? 'opacity-70' : 'opacity-100'
      } ${className}`}
      loading={loading}
    />
  );
});