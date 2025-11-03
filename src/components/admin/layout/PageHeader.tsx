import { ReactNode } from 'react';
import { Title, Text, Flex, Button } from '@tremor/react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * 页面头部组件
 * 统一的页面标题和操作按钮布局
 */
export function PageHeader({
  title,
  description,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <Flex justifyContent="between" alignItems="start">
        <div>
          <Title className="text-2xl font-bold text-gray-900 mb-1">
            {title}
          </Title>
          {description && (
            <Text className="text-sm text-gray-500">
              {description}
            </Text>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </Flex>
    </div>
  );
}

