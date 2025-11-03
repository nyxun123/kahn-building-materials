import { ReactNode } from 'react';
import { Card, Text } from '@tremor/react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * 表单分组组件
 * 用于将相关字段分组显示
 */
export function FormSection({
  title,
  description,
  children,
  className = '',
}: FormSectionProps) {
  return (
    <Card className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="mb-4">
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
        {description && (
          <Text className="text-sm text-gray-500 mt-1">{description}</Text>
        )}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </Card>
  );
}

