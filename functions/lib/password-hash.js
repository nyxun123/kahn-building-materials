/**
 * 密码哈希工具 - 使用 Web Crypto API
 * 
 * 为什么使用 Web Crypto API:
 * 1. Cloudflare Workers 原生支持
 * 2. 无需外部依赖
 * 3. 性能优秀
 * 4. 符合 Web 标准
 * 
 * 安全特性:
 * - 使用 PBKDF2 算法（推荐用于密码哈希）
 * - 随机 salt（每个密码唯一）
 * - 100,000 次迭代（防止暴力破解）
 * - SHA-256 哈希函数
 */

/**
 * 生成密码哈希
 * @param {string} password - 明文密码
 * @returns {Promise<string>} 哈希后的密码（格式: salt:hash）
 */
export async function hashPassword(password) {
  try {
    // 1. 生成随机 salt（16 字节）
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // 2. 将密码转换为 ArrayBuffer
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    // 3. 导入密码作为 CryptoKey
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    // 4. 使用 PBKDF2 派生密钥
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,  // 100,000 次迭代（安全性和性能的平衡）
        hash: 'SHA-256'
      },
      keyMaterial,
      256  // 256 位输出
    );
    
    // 5. 转换为十六进制字符串
    const hashArray = new Uint8Array(derivedBits);
    const hashHex = Array.from(hashArray)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const saltHex = Array.from(salt)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // 6. 返回格式: salt:hash
    return `${saltHex}:${hashHex}`;
    
  } catch (error) {
    console.error('密码哈希失败:', error);
    throw new Error('密码哈希失败');
  }
}

/**
 * 验证密码
 * @param {string} password - 用户输入的明文密码
 * @param {string} storedHash - 存储的哈希值（格式: salt:hash）
 * @returns {Promise<boolean>} 密码是否匹配
 */
export async function verifyPassword(password, storedHash) {
  try {
    // 1. 解析存储的哈希值
    const parts = storedHash.split(':');
    if (parts.length !== 2) {
      console.error('无效的哈希格式');
      return false;
    }
    
    const [saltHex, expectedHashHex] = parts;
    
    // 2. 将十六进制 salt 转换回 Uint8Array
    const salt = new Uint8Array(
      saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );
    
    // 3. 将密码转换为 ArrayBuffer
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    // 4. 导入密码作为 CryptoKey
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    // 5. 使用相同的 salt 和参数派生密钥
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,  // 必须与 hashPassword 相同
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    
    // 6. 转换为十六进制字符串
    const hashArray = new Uint8Array(derivedBits);
    const actualHashHex = Array.from(hashArray)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // 7. 使用时间安全的比较（防止时序攻击）
    return timingSafeEqual(actualHashHex, expectedHashHex);
    
  } catch (error) {
    console.error('密码验证失败:', error);
    // 防止时序攻击：无论什么错误都返回 false
    return false;
  }
}

/**
 * 时间安全的字符串比较（防止时序攻击）
 * @param {string} a - 字符串 A
 * @param {string} b - 字符串 B
 * @returns {boolean} 是否相等
 */
function timingSafeEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {Object} 验证结果
 */
export function validatePasswordStrength(password) {
  const errors = [];
  
  // 最小长度
  if (password.length < 8) {
    errors.push('密码长度至少 8 个字符');
  }
  
  // 最大长度（防止 DoS）
  if (password.length > 128) {
    errors.push('密码长度不能超过 128 个字符');
  }
  
  // 包含大写字母
  if (!/[A-Z]/.test(password)) {
    errors.push('密码必须包含至少一个大写字母');
  }
  
  // 包含小写字母
  if (!/[a-z]/.test(password)) {
    errors.push('密码必须包含至少一个小写字母');
  }
  
  // 包含数字
  if (!/[0-9]/.test(password)) {
    errors.push('密码必须包含至少一个数字');
  }
  
  // 包含特殊字符
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('密码必须包含至少一个特殊字符');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors,
    strength: calculatePasswordStrength(password)
  };
}

/**
 * 计算密码强度
 * @param {string} password - 密码
 * @returns {string} 强度等级: weak, medium, strong, very-strong
 */
function calculatePasswordStrength(password) {
  let score = 0;
  
  // 长度评分
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // 字符类型评分
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  
  // 复杂度评分
  if (/[a-z].*[A-Z]|[A-Z].*[a-z]/.test(password)) score += 1;
  if (/[a-zA-Z].*[0-9]|[0-9].*[a-zA-Z]/.test(password)) score += 1;
  
  if (score <= 3) return 'weak';
  if (score <= 5) return 'medium';
  if (score <= 7) return 'strong';
  return 'very-strong';
}

/**
 * 生成随机密码
 * @param {number} length - 密码长度（默认 16）
 * @returns {string} 随机密码
 */
export function generateRandomPassword(length = 16) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const all = uppercase + lowercase + numbers + special;
  
  let password = '';
  
  // 确保至少包含每种类型的字符
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // 填充剩余长度
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  // 打乱顺序
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

