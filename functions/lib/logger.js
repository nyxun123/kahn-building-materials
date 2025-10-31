/**
 * 统一的日志记录工具库
 * 支持多个日志级别和审计日志记录
 */

// 日志级别
export const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  AUDIT: 'AUDIT'
};

// 操作类型
export const OPERATION_TYPES = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  LOGIN: 'login',
  LOGOUT: 'logout',
  UPLOAD: 'upload',
  DOWNLOAD: 'download',
  EXPORT: 'export',
  IMPORT: 'import'
};

// 资源类型
export const RESOURCE_TYPES = {
  PRODUCT: 'product',
  CONTENT: 'content',
  ADMIN: 'admin',
  MEDIA: 'media',
  CONTACT: 'contact',
  COMPANY: 'company',
  OEM: 'oem',
  USER: 'user'
};

/**
 * 格式化日志消息
 */
function formatLogMessage(level, message, data = {}) {
  const timestamp = new Date().toISOString();
  return {
    timestamp,
    level,
    message,
    data,
    env: typeof process !== 'undefined' ? process.env.ENVIRONMENT || 'unknown' : 'worker'
  };
}

/**
 * 输出日志到控制台
 */
function outputLog(logEntry) {
  const prefix = `[${logEntry.level}] ${logEntry.timestamp}`;
  
  switch (logEntry.level) {
    case LOG_LEVELS.DEBUG:
      console.debug(prefix, logEntry.message, logEntry.data);
      break;
    case LOG_LEVELS.INFO:
      console.info(prefix, logEntry.message, logEntry.data);
      break;
    case LOG_LEVELS.WARN:
      console.warn(prefix, logEntry.message, logEntry.data);
      break;
    case LOG_LEVELS.ERROR:
      console.error(prefix, logEntry.message, logEntry.data);
      break;
    case LOG_LEVELS.AUDIT:
      console.log(prefix, logEntry.message, logEntry.data);
      break;
    default:
      console.log(prefix, logEntry.message, logEntry.data);
  }
}

/**
 * 记录调试信息
 */
export function logDebug(message, data = {}) {
  const logEntry = formatLogMessage(LOG_LEVELS.DEBUG, message, data);
  outputLog(logEntry);
  return logEntry;
}

/**
 * 记录信息
 */
export function logInfo(message, data = {}) {
  const logEntry = formatLogMessage(LOG_LEVELS.INFO, message, data);
  outputLog(logEntry);
  return logEntry;
}

/**
 * 记录警告
 */
export function logWarn(message, data = {}) {
  const logEntry = formatLogMessage(LOG_LEVELS.WARN, message, data);
  outputLog(logEntry);
  return logEntry;
}

/**
 * 记录错误
 */
export function logError(message, error = null, data = {}) {
  const errorData = {
    ...data,
    error: error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : null
  };
  
  const logEntry = formatLogMessage(LOG_LEVELS.ERROR, message, errorData);
  outputLog(logEntry);
  return logEntry;
}

/**
 * 记录审计日志
 * 用于记录所有管理操作
 */
export async function logAudit(env, {
  adminId,
  action,
  resourceType,
  resourceId,
  details = {},
  ipAddress = 'unknown',
  userAgent = 'unknown',
  status = 'success',
  result = null
}) {
  try {
    // 输出到控制台
    const logEntry = formatLogMessage(LOG_LEVELS.AUDIT, `${action} ${resourceType}`, {
      adminId,
      action,
      resourceType,
      resourceId,
      status,
      details
    });
    outputLog(logEntry);

    // 保存到数据库（如果配置了）
    if (env.DB) {
      try {
        const detailsJson = JSON.stringify(details);
        const resultJson = result ? JSON.stringify(result) : null;

        await env.DB.prepare(`
          INSERT INTO activity_logs (
            admin_id, action, resource_type, resource_id,
            details, result, ip_address, user_agent, status, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).bind(
          adminId,
          action,
          resourceType,
          resourceId,
          detailsJson,
          resultJson,
          ipAddress,
          userAgent,
          status
        ).run();

        logDebug('审计日志已保存到数据库', { adminId, action, resourceType });
      } catch (dbError) {
        logError('保存审计日志到数据库失败', dbError, {
          adminId,
          action,
          resourceType
        });
      }
    }

    return logEntry;
  } catch (error) {
    logError('记录审计日志失败', error, {
      adminId,
      action,
      resourceType
    });
    throw error;
  }
}

/**
 * 从请求中提取 IP 地址
 */
export function getClientIp(request) {
  return request.headers.get('CF-Connecting-IP') ||
         request.headers.get('X-Forwarded-For') ||
         request.headers.get('X-Real-IP') ||
         'unknown';
}

/**
 * 从请求中提取 User Agent
 */
export function getUserAgent(request) {
  return request.headers.get('User-Agent') || 'unknown';
}

/**
 * 创建审计日志上下文
 */
export function createAuditContext(request, adminId) {
  return {
    adminId,
    ipAddress: getClientIp(request),
    userAgent: getUserAgent(request)
  };
}

/**
 * 记录 API 请求
 */
export function logApiRequest(request, {
  endpoint,
  method,
  adminId = null,
  status = null,
  duration = null
}) {
  const data = {
    endpoint,
    method,
    adminId,
    status,
    duration: duration ? `${duration}ms` : null,
    ip: getClientIp(request),
    userAgent: getUserAgent(request)
  };

  if (status && status >= 400) {
    logWarn(`API 请求失败: ${method} ${endpoint}`, data);
  } else {
    logDebug(`API 请求: ${method} ${endpoint}`, data);
  }

  return data;
}

/**
 * 记录数据库操作
 */
export function logDatabaseOperation(operation, {
  table,
  action,
  recordId = null,
  duration = null,
  error = null
}) {
  const data = {
    table,
    action,
    recordId,
    duration: duration ? `${duration}ms` : null
  };

  if (error) {
    logError(`数据库操作失败: ${action} ${table}`, error, data);
  } else {
    logDebug(`数据库操作: ${action} ${table}`, data);
  }

  return data;
}

/**
 * 记录认证事件
 */
export function logAuthEvent(event, {
  email,
  adminId = null,
  success = false,
  reason = null,
  ipAddress = 'unknown'
}) {
  const data = {
    event,
    email,
    adminId,
    success,
    reason,
    ipAddress
  };

  if (success) {
    logInfo(`认证成功: ${event} - ${email}`, data);
  } else {
    logWarn(`认证失败: ${event} - ${email}`, data);
  }

  return data;
}

/**
 * 记录性能指标
 */
export function logPerformance(operation, duration) {
  const data = {
    operation,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString()
  };

  if (duration > 1000) {
    logWarn(`性能警告: ${operation} 耗时 ${duration}ms`, data);
  } else {
    logDebug(`性能指标: ${operation}`, data);
  }

  return data;
}

