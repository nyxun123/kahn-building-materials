import { ReactNode } from 'react';
import { Button } from '@tremor/react';
import { Flex } from '@tremor/react';

interface FormActionsProps {
  onCancel?: () => void;
  onSave: () => void;
  onReset?: () => void;
  saving?: boolean;
  cancelLabel?: string;
  saveLabel?: string;
  resetLabel?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * 表单操作按钮组件
 * 统一的表单底部操作按钮布局
 */
export function FormActions({
  onCancel,
  onSave,
  onReset,
  saving = false,
  cancelLabel = '取消',
  saveLabel = '保存',
  resetLabel = '重置',
  className = '',
  children,
}: FormActionsProps) {
  return (
    <div className={`sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 -mx-6 -mb-6 mt-8 ${className}`}>
      <Flex justifyContent="end" alignItems="center" className="gap-3">
        {children}
        
        {onReset && (
          <Button
            variant="light"
            onClick={onReset}
            disabled={saving}
            className="text-gray-600 hover:text-gray-900"
          >
            {resetLabel}
          </Button>
        )}
        
        {onCancel && (
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={saving}
            className="bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          >
            {cancelLabel}
          </Button>
        )}
        
        <Button
          onClick={onSave}
          loading={saving}
          disabled={saving}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-50"
        >
          {saveLabel}
        </Button>
      </Flex>
    </div>
  );
}

