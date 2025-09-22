// 文件上传验证器
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class StorageValidator {
  private static instance: StorageValidator;

  public static getInstance(): StorageValidator {
    if (!StorageValidator.instance) {
      StorageValidator.instance = new StorageValidator();
    }
    return StorageValidator.instance;
  }

  validateFile(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    minDimensions?: { width: number; height: number };
    maxDimensions?: { width: number; height: number };
  } = {}): ValidationResult {
    const {
      maxSize = 5,
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
      minDimensions,
      maxDimensions
    } = options;

    const errors: string[] = [];

    // 文件存在性检查
    if (!file) {
      errors.push('请选择文件');
      return { valid: false, errors };
    }

    // 文件大小检查
    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      errors.push(`文件大小不能超过 ${maxSize}MB`);
    }

    if (file.size === 0) {
      errors.push('文件内容为空');
    }

    // 文件类型检查
    if (!allowedTypes.includes(file.type)) {
      errors.push(`不支持的文件类型: ${file.type}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  async validateImageDimensions(
    file: File,
    minDimensions?: { width: number; height: number },
    maxDimensions?: { width: number; height: number }
  ): Promise<ValidationResult> {
    const errors: string[] = [];

    if (!minDimensions && !maxDimensions) {
      return { valid: true, errors };
    }

    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        if (minDimensions) {
          if (img.width < minDimensions.width) {
            errors.push(`图片宽度不能小于 ${minDimensions.width}px`);
          }
          if (img.height < minDimensions.height) {
            errors.push(`图片高度不能小于 ${minDimensions.height}px`);
          }
        }

        if (maxDimensions) {
          if (img.width > maxDimensions.width) {
            errors.push(`图片宽度不能超过 ${maxDimensions.width}px`);
          }
          if (img.height > maxDimensions.height) {
            errors.push(`图片高度不能超过 ${maxDimensions.height}px`);
          }
        }

        resolve({ valid: errors.length === 0, errors });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        errors.push('无法读取图片文件');
        resolve({ valid: false, errors });
      };

      img.src = url;
    });
  }

  sanitizeFileName(fileName: string): string {
    // 移除特殊字符
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  }

  generateUniqueFileName(originalName: string, folder: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitizedName = this.sanitizeFileName(originalName.replace(/\.[^/.]+$/, ''));
    
    return `${folder}/${timestamp}_${randomStr}.${extension}`;
  }
}

export const storageValidator = StorageValidator.getInstance();