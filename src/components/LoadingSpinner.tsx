import { memo } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner = memo(function LoadingSpinner({ 
  size = 'md', 
  className = '',
  text = '加载中...'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  const containerClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${containerClasses[size]} ${className}`}>
      <div 
        className={`animate-spin rounded-full border-t-2 border-b-2 border-[#047857] ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <span className="text-gray-600 animate-pulse">{text}</span>
      )}
    </div>
  );
});