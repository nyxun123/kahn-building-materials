import { ReactNode } from 'react';

interface PageContentProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[1400px]',
  full: 'max-w-full',
};

/**
 * 页面内容容器组件
 * 统一的页面内容布局
 */
export function PageContent({
  children,
  maxWidth = '2xl',
  className = '',
}: PageContentProps) {
  return (
    <div className={`mx-auto w-full ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
}



