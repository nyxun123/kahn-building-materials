import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

/**
 * 密码加密服务
 * 使用scrypt算法进行密码哈希，提供安全的密码存储和验证
 */
export class PasswordService {
  private static readonly SALT_LENGTH = 16;
  private static readonly KEY_LENGTH = 64;
  private static readonly SCRYPT_PARAMS = {
    N: 16384,    // CPU/内存成本参数
    r: 8,        // 块大小参数
    p: 1         // 并行化参数
  };

  /**
   * 哈希密码
   * @param password 明文密码
   * @returns 哈希后的密码字符串
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(this.SALT_LENGTH).toString('hex');
    
    // 使用类型断言确保参数正确传递
    const derivedKey = (await (scryptAsync as any)(
      password,
      salt,
      this.KEY_LENGTH,
      this.SCRYPT_PARAMS
    )) as Buffer;

    return `${salt}:${derivedKey.toString('hex')}`;
  }

  /**
   * 验证密码
   * @param suppliedPassword 用户提供的密码
   * @param storedHash 存储的哈希值
   * @returns 密码是否匹配
   */
  static async verifyPassword(
    suppliedPassword: string,
    storedHash: string
  ): Promise<boolean> {
    try {
      const [salt, key] = storedHash.split(':');
      
      if (!salt || !key) {
        return false;
      }

      const keyBuffer = Buffer.from(key, 'hex');
      
      // 使用类型断言确保参数正确传递
      const derivedKey = (await (scryptAsync as any)(
        suppliedPassword,
        salt,
        this.KEY_LENGTH,
        this.SCRYPT_PARAMS
      )) as Buffer;

      return timingSafeEqual(keyBuffer, derivedKey);
    } catch (error) {
      // 防止计时攻击，无论什么错误都返回false
      return false;
    }
  }

  /**
   * 检查密码强度
   * @param password 密码
   * @returns 强度评分和建议
   */
  static checkPasswordStrength(password: string): {
    score: number;
    strength: 'very weak' | 'weak' | 'medium' | 'strong' | 'very strong';
    suggestions: string[];
  } {
    const suggestions: string[] = [];
    let score = 0;

    // 长度检查
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    else suggestions.push('密码至少需要8个字符');

    // 大写字母
    if (/[A-Z]/.test(password)) score += 1;
    else suggestions.push('包含大写字母');

    // 小写字母
    if (/[a-z]/.test(password)) score += 1;
    else suggestions.push('包含小写字母');

    // 数字
    if (/[0-9]/.test(password)) score += 1;
    else suggestions.push('包含数字');

    // 特殊字符
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else suggestions.push('包含特殊字符');

    // 确定强度等级
    let strength: 'very weak' | 'weak' | 'medium' | 'strong' | 'very strong';
    if (score >= 5) strength = 'very strong';
    else if (score >= 4) strength = 'strong';
    else if (score >= 3) strength = 'medium';
    else if (score >= 2) strength = 'weak';
    else strength = 'very weak';

    return { score, strength, suggestions };
  }

  /**
   * 生成随机密码
   * @param length 密码长度
   * @returns 随机密码
   */
  static generateRandomPassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    let password = '';
    
    // 确保包含每种类型的字符
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*()_+-='[Math.floor(Math.random() * 13)];

    // 填充剩余长度
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // 打乱顺序
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}

// 密码策略配置
export const PASSWORD_POLICY = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL_CHAR: true,
  MAX_AGE_DAYS: 90, // 密码最大有效期
  HISTORY_SIZE: 5,   // 记住的历史密码数量
  MAX_ATTEMPTS: 5,   // 最大尝试次数
  LOCKOUT_TIME: 15   // 锁定时间(分钟)
};

/**
 * 验证密码是否符合策略
 */
export function validatePasswordPolicy(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < PASSWORD_POLICY.MIN_LENGTH) {
    errors.push(`密码长度至少为 ${PASSWORD_POLICY.MIN_LENGTH} 个字符`);
  }

  if (PASSWORD_POLICY.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('必须包含大写字母');
  }

  if (PASSWORD_POLICY.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('必须包含小写字母');
  }

  if (PASSWORD_POLICY.REQUIRE_NUMBER && !/[0-9]/.test(password)) {
    errors.push('必须包含数字');
  }

  if (PASSWORD_POLICY.REQUIRE_SPECIAL_CHAR && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('必须包含特殊字符');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}