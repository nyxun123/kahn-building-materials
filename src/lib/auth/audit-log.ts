import { Request } from 'express';

/**
 * 审计日志服务
 * 记录所有安全相关事件和用户操作
 */
export class AuditLogService {
  private static logs: AuditLogEntry[] = [];
  private static readonly MAX_LOG_ENTRIES = 10000;

  /**
   * 记录审计事件
   */
  static logEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const fullEntry: AuditLogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      ...entry
    };

    this.logs.push(fullEntry);

    // 保持日志数量在限制范围内
    if (this.logs.length > this.MAX_LOG_ENTRIES) {
      this.logs = this.logs.slice(-this.MAX_LOG_ENTRIES);
    }

    // 输出到控制台（生产环境中应该写入文件或发送到日志服务）
    console.log(`[AUDIT] ${fullEntry.timestamp.toISOString()} - ${fullEntry.action}: ${fullEntry.description}`);
  }

  /**
   * 记录用户登录事件
   */
  static logLogin(userId: string, username: string, success: boolean, ipAddress?: string, userAgent?: string): void {
    this.logEvent({
      action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
      userId,
      username,
      description: success ?
        `用户 ${username} 登录成功` :
        `用户 ${username} 登录失败`,
      ipAddress: ipAddress || '',
      userAgent: userAgent || '',
      severity: success ? 'INFO' : 'WARNING'
    });
  }

  /**
   * 记录用户注销事件
   */
  static logLogout(userId: string, username: string, ipAddress?: string): void {
    this.logEvent({
      action: 'LOGOUT',
      userId,
      username,
      description: `用户 ${username} 注销登录`,
      ipAddress: ipAddress || '',
      severity: 'INFO'
    });
  }

  /**
   * 记录密码修改事件
   */
  static logPasswordChange(userId: string, username: string, success: boolean): void {
    this.logEvent({
      action: success ? 'PASSWORD_CHANGE_SUCCESS' : 'PASSWORD_CHANGE_FAILED',
      userId,
      username,
      description: success ?
        `用户 ${username} 修改密码成功` :
        `用户 ${username} 修改密码失败`,
      severity: success ? 'INFO' : 'WARNING'
    });
  }

  /**
   * 记录权限变更事件
   */
  static logPermissionChange(
    targetUserId: string,
    targetUsername: string,
    changedByUserId: string,
    changedByUsername: string,
    changes: PermissionChange[]
  ): void {
    this.logEvent({
      action: 'PERMISSION_CHANGE',
      userId: changedByUserId,
      username: changedByUsername,
      targetUserId,
      targetUsername,
      description: `用户 ${changedByUsername} 修改了用户 ${targetUsername} 的权限`,
      details: { changes },
      severity: 'INFO'
    });
  }

  /**
   * 记录角色变更事件
   */
  static logRoleChange(
    targetUserId: string,
    targetUsername: string,
    changedByUserId: string,
    changedByUsername: string,
    oldRoles: string[],
    newRoles: string[]
  ): void {
    this.logEvent({
      action: 'ROLE_CHANGE',
      userId: changedByUserId,
      username: changedByUsername,
      targetUserId,
      targetUsername,
      description: `用户 ${changedByUsername} 修改了用户 ${targetUsername} 的角色`,
      details: { oldRoles, newRoles },
      severity: 'INFO'
    });
  }

  /**
   * 记录敏感数据访问事件
   */
  static logSensitiveAccess(
    userId: string,
    username: string,
    resourceType: string,
    resourceId: string,
    action: string
  ): void {
    this.logEvent({
      action: 'SENSITIVE_ACCESS',
      userId,
      username,
      description: `用户 ${username} 访问了敏感资源: ${resourceType}/${resourceId}`,
      details: { resourceType, resourceId, action },
      severity: 'INFO'
    });
  }

  /**
   * 记录系统配置变更事件
   */
  static logConfigChange(
    userId: string,
    username: string,
    configKey: string,
    oldValue: any,
    newValue: any
  ): void {
    this.logEvent({
      action: 'CONFIG_CHANGE',
      userId,
      username,
      description: `用户 ${username} 修改了系统配置: ${configKey}`,
      details: { configKey, oldValue, newValue },
      severity: 'INFO'
    });
  }

  /**
   * 记录安全警告事件
   */
  static logSecurityWarning(
    event: string,
    description: string,
    details?: any,
    userId?: string,
    username?: string,
    ipAddress?: string
  ): void {
    this.logEvent({
      action: 'SECURITY_WARNING',
      event,
      userId: userId || '',
      username: username || '',
      description,
      details,
      ipAddress: ipAddress || '',
      severity: 'WARNING'
    });
  }

  /**
   * 记录错误事件
   */
  static logError(
    error: Error,
    context: string,
    userId?: string,
    username?: string
  ): void {
    this.logEvent({
      action: 'ERROR',
      userId: userId || '',
      username: username || '',
      description: `在 ${context} 中发生错误: ${error.message}`,
      details: {
        error: error.message,
        stack: error.stack,
        context
      },
      severity: 'ERROR'
    });
  }

  /**
   * 从HTTP请求中提取审计信息
   */
  static extractRequestInfo(req: Request): {
    ipAddress: string;
    userAgent: string;
    method: string;
    path: string;
  } {
    const ipAddress = req.ip ||
                     req.connection.remoteAddress ||
                     req.socket.remoteAddress ||
                     (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
                     '';
    
    return {
      ipAddress: ipAddress || '',
      userAgent: req.headers['user-agent'] as string || '',
      method: req.method,
      path: req.path
    };
  }

  /**
   * 查询审计日志
   */
  static queryLogs(options: AuditLogQueryOptions): AuditLogEntry[] {
    let results = this.logs;

    // 按时间过滤
    if (options.startTime) {
      results = results.filter(log => log.timestamp >= options.startTime!);
    }
    if (options.endTime) {
      results = results.filter(log => log.timestamp <= options.endTime!);
    }

    // 按用户过滤
    if (options.userId) {
      results = results.filter(log => log.userId === options.userId);
    }
    if (options.username) {
      results = results.filter(log => log.username === options.username);
    }

    // 按操作类型过滤
    if (options.actions && options.actions.length > 0) {
      results = results.filter(log => options.actions!.includes(log.action));
    }

    // 按严重级别过滤
    if (options.severities && options.severities.length > 0) {
      results = results.filter(log => options.severities!.includes(log.severity));
    }

    // 排序
    const sortOrder = options.sortOrder || 'desc';
    results.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.timestamp.getTime() - b.timestamp.getTime();
      } else {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
    });

    // 分页
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * 获取统计信息
   */
  static getStats(): AuditLogStats {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentLogs = this.logs.filter(log => log.timestamp >= last24Hours);
    
    const stats: AuditLogStats = {
      totalEntries: this.logs.length,
      last24Hours: recentLogs.length,
      bySeverity: {
        INFO: recentLogs.filter(log => log.severity === 'INFO').length,
        WARNING: recentLogs.filter(log => log.severity === 'WARNING').length,
        ERROR: recentLogs.filter(log => log.severity === 'ERROR').length
      },
      byAction: {} as Record<string, number>
    };

    // 统计各种操作的数量
    recentLogs.forEach(log => {
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
    });

    return stats;
  }

  /**
   * 清空日志
   */
  static clearLogs(): void {
    this.logs = [];
  }

  /**
   * 导出日志
   */
  static exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      return this.exportToCSV();
    }
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * 导出为CSV格式
   */
  private static exportToCSV(): string {
    if (this.logs.length === 0) {
      return '';
    }

    const headers = ['时间戳', '操作', '用户ID', '用户名', '描述', '严重级别', 'IP地址'];
    const rows = this.logs.map(log => [
      log.timestamp.toISOString(),
      log.action,
      log.userId || '',
      log.username || '',
      log.description,
      log.severity,
      log.ipAddress || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    return csvContent;
  }

  /**
   * 生成唯一ID
   */
  private static generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 类型定义
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  userId?: string;
  username?: string;
  targetUserId?: string;
  targetUsername?: string;
  description: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
  event?: string;
}

export interface PermissionChange {
  type: 'add' | 'remove' | 'update';
  permission: string;
  oldValue?: any;
  newValue?: any;
}

export interface AuditLogQueryOptions {
  startTime?: Date;
  endTime?: Date;
  userId?: string;
  username?: string;
  actions?: string[];
  severities?: Array<'INFO' | 'WARNING' | 'ERROR'>;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export interface AuditLogStats {
  totalEntries: number;
  last24Hours: number;
  bySeverity: {
    INFO: number;
    WARNING: number;
    ERROR: number;
  };
  byAction: Record<string, number>;
}

// 预定义的审计操作类型
export const AUDIT_ACTIONS = {
  // 认证相关
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  PASSWORD_CHANGE_SUCCESS: 'PASSWORD_CHANGE_SUCCESS',
  PASSWORD_CHANGE_FAILED: 'PASSWORD_CHANGE_FAILED',
  TOKEN_REFRESH: 'TOKEN_REFRESH',

  // 权限管理
  PERMISSION_CHANGE: 'PERMISSION_CHANGE',
  ROLE_CHANGE: 'ROLE_CHANGE',
  USER_CREATE: 'USER_CREATE',
  USER_UPDATE: 'USER_UPDATE',
  USER_DELETE: 'USER_DELETE',

  // 数据访问
  SENSITIVE_ACCESS: 'SENSITIVE_ACCESS',
  DATA_EXPORT: 'DATA_EXPORT',
  DATA_IMPORT: 'DATA_IMPORT',

  // 系统配置
  CONFIG_CHANGE: 'CONFIG_CHANGE',
  SYSTEM_UPDATE: 'SYSTEM_UPDATE',

  // 安全事件
  SECURITY_WARNING: 'SECURITY_WARNING',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',

  // 错误事件
  ERROR: 'ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
};