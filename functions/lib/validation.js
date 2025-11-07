/**
 * 数据验证工具库
 * 
 * 功能：
 * - 内容验证
 * - 产品验证
 * - 通用验证
 */

/**
 * 验证内容数据
 * @param {Object} contentData - 内容数据
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateContent(contentData) {
  if (!contentData) {
    return { valid: false, error: '内容数据不能为空' };
  }

  // 至少需要填写一种语言的内容
  if (!contentData.content_zh && !contentData.content_en && !contentData.content_ru) {
    return { valid: false, error: '至少需要填写一种语言的内容' };
  }

  // 验证内容长度
  const maxLength = 10000;
  if ((contentData.content_zh && contentData.content_zh.length > maxLength) ||
      (contentData.content_en && contentData.content_en.length > maxLength) ||
      (contentData.content_ru && contentData.content_ru.length > maxLength)) {
    return { valid: false, error: `内容长度不能超过 ${maxLength} 个字符` };
  }

  return { valid: true };
}

/**
 * 验证产品数据
 * @param {Object} productData - 产品数据
 * @param {boolean} isUpdate - 是否为更新操作
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateProduct(productData, isUpdate = false) {
  if (!productData) {
    return { valid: false, error: '产品数据不能为空' };
  }

  // 创建时检查必填字段
  if (!isUpdate) {
    if (!productData.product_code) {
      return { valid: false, error: '产品代码为必填项' };
    }
    if (!productData.name_zh) {
      return { valid: false, error: '中文名称为必填项' };
    }
  }

  // 更新时检查非空字段
  if (isUpdate) {
    if (productData.product_code !== undefined && !productData.product_code) {
      return { valid: false, error: '产品代码不能为空' };
    }
    if (productData.name_zh !== undefined && !productData.name_zh) {
      return { valid: false, error: '中文名称不能为空' };
    }
  }

  // 验证产品代码格式（只允许字母、数字、连字符）
  if (productData.product_code && !/^[A-Z0-9\-]+$/.test(productData.product_code)) {
    return { valid: false, error: '产品代码只能包含大写字母、数字和连字符' };
  }

  // 验证价格（如果提供）
  if (productData.price !== undefined && productData.price < 0) {
    return { valid: false, error: '价格不能为负数' };
  }

  // 验证库存（如果提供）
  if (productData.stock_quantity !== undefined && productData.stock_quantity < 0) {
    return { valid: false, error: '库存数量不能为负数' };
  }

  // 验证最小订购量（如果提供）
  if (productData.min_order_quantity !== undefined && productData.min_order_quantity < 1) {
    return { valid: false, error: '最小订购量必须大于 0' };
  }

  return { valid: true };
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean}
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证URL格式
 * @param {string} url - URL
 * @returns {boolean}
 */
export function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证字符串长度
 * @param {string} str - 字符串
 * @param {number} minLength - 最小长度
 * @param {number} maxLength - 最大长度
 * @returns {boolean}
 */
export function validateStringLength(str, minLength = 0, maxLength = Infinity) {
  if (!str) return minLength === 0;
  return str.length >= minLength && str.length <= maxLength;
}

/**
 * 验证数字范围
 * @param {number} num - 数字
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {boolean}
 */
export function validateNumberRange(num, min = -Infinity, max = Infinity) {
  return num >= min && num <= max;
}

/**
 * 清理字符串（移除前后空格）
 * @param {string} str - 字符串
 * @returns {string}
 */
export function sanitizeString(str) {
  if (!str) return '';
  return str.trim();
}

/**
 * 清理对象（移除所有字符串字段的前后空格）
 * @param {Object} obj - 对象
 * @returns {Object}
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * 验证联系表单数据
 * @param {Object} contactData - 联系表单数据
 * @returns {Object} { valid: boolean, error?: string, sanitizedData?: Object }
 */
export function validateContactForm(contactData) {
  if (!contactData) {
    return { valid: false, error: '表单数据不能为空' };
  }

  // 必填字段验证
  if (!contactData.name || !contactData.name.trim()) {
    return { valid: false, error: '姓名为必填项' };
  }

  if (!contactData.email || !contactData.email.trim()) {
    return { valid: false, error: '邮箱为必填项' };
  }

  if (!contactData.message || !contactData.message.trim()) {
    return { valid: false, error: '留言内容为必填项' };
  }

  // 邮箱格式验证
  if (!validateEmail(contactData.email.trim())) {
    return { valid: false, error: '邮箱格式不正确' };
  }

  // 字段长度验证
  if (!validateStringLength(contactData.name, 1, 100)) {
    return { valid: false, error: '姓名长度必须在 1-100 个字符之间' };
  }

  if (!validateStringLength(contactData.email, 5, 255)) {
    return { valid: false, error: '邮箱长度必须在 5-255 个字符之间' };
  }

  if (!validateStringLength(contactData.message, 10, 5000)) {
    return { valid: false, error: '留言内容长度必须在 10-5000 个字符之间' };
  }

  // 可选字段长度验证
  if (contactData.phone && !validateStringLength(contactData.phone, 0, 50)) {
    return { valid: false, error: '电话号码长度不能超过 50 个字符' };
  }

  if (contactData.company && !validateStringLength(contactData.company, 0, 200)) {
    return { valid: false, error: '公司名称长度不能超过 200 个字符' };
  }

  if (contactData.country && !validateStringLength(contactData.country, 0, 100)) {
    return { valid: false, error: '国家/地区长度不能超过 100 个字符' };
  }

  if (contactData.subject && !validateStringLength(contactData.subject, 0, 200)) {
    return { valid: false, error: '主题长度不能超过 200 个字符' };
  }

  // 清理数据（防止 XSS）
  const sanitizedData = {
    name: sanitizeString(contactData.name),
    email: sanitizeString(contactData.email).toLowerCase(),
    message: sanitizeString(contactData.message),
    phone: contactData.phone ? sanitizeString(contactData.phone) : null,
    company: contactData.company ? sanitizeString(contactData.company) : null,
    country: contactData.country ? sanitizeString(contactData.country) : null,
    subject: contactData.subject ? sanitizeString(contactData.subject) : null,
    language: contactData.language || 'zh'
  };

  return { valid: true, sanitizedData };
}
