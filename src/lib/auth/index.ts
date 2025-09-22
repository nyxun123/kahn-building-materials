// 导入所有认证相关模块
import { PasswordService, PASSWORD_POLICY, validatePasswordPolicy } from './password';
import { JWTService, type JWTPayload, type TokenPair, type TokenValidationResult, JWT_ERRORS } from './jwt';
import { UserService, type SanitizedUser, type RegisterData, type LoginCredentials } from './user-service';
import { AuditLogService, type AuditLogEntry, type AuditLogQueryOptions, AUDIT_ACTIONS } from './audit-log';

// 导出所有认证相关模块
export { PasswordService, PASSWORD_POLICY, validatePasswordPolicy };
export { JWTService, type JWTPayload, type TokenPair, type TokenValidationResult, JWT_ERRORS };
export { authMiddleware } from './middleware';
export { UserService, type SanitizedUser, type RegisterData, type LoginCredentials };
export { AuditLogService, type AuditLogEntry, type AuditLogQueryOptions, AUDIT_ACTIONS };

/**
 * 认证服务主类
 * 提供统一的认证接口
 */
export class AuthService {
  /**
   * 用户注册
   */
  static async register(userData: RegisterData) {
    const result = await UserService.register(userData);
    
    if (result.success && result.user) {
      AuditLogService.logEvent({
        action: AUDIT_ACTIONS.USER_CREATE,
        userId: result.user.id,
        username: result.user.username,
        description: `新用户注册: ${result.user.username}`,
        severity: 'INFO'
      });
    }

    return result;
  }

  /**
   * 用户登录
   */
  static async login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string) {
    const result = await UserService.login(credentials);
    
    // 记录登录事件
    AuditLogService.logLogin(
      result.user?.id || 'unknown',
      credentials.identifier,
      result.success,
      ipAddress,
      userAgent
    );

    return result;
  }

  /**
   * 用户注销
   */
  static logout(userId: string, refreshToken?: string, ipAddress?: string) {
    const user = UserService.getUserById(userId);
    if (user) {
      AuditLogService.logLogout(userId, user.username, ipAddress);
    }
    
    UserService.logout(userId, refreshToken);
  }

  /**
   * 刷新令牌
   */
  static async refreshToken(refreshToken: string) {
    const result = await UserService.refreshAccessToken(refreshToken);
    
    if (result.success) {
      AuditLogService.logEvent({
        action: AUDIT_ACTIONS.TOKEN_REFRESH,
        description: '访问令牌刷新成功',
        severity: 'INFO'
      });
    }

    return result;
  }

  /**
   * 修改密码
   */
  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const result = await UserService.changePassword(userId, oldPassword, newPassword);
    
    if (result.success) {
      AuditLogService.logPasswordChange(userId, '', true);
    } else {
      AuditLogService.logPasswordChange(userId, '', false);
    }

    return result;
  }

  /**
   * 验证访问令牌
   */
  static verifyAccessToken(token: string) {
    return JWTService.verifyAccessToken(token);
  }

  /**
   * 验证用户权限
   */
  static hasPermission(userId: string, permission: string) {
    return UserService.hasPermission(userId, permission);
  }

  /**
   * 验证用户角色
   */
  static hasRole(userId: string, role: string) {
    return UserService.hasRole(userId, role);
  }

  /**
   * 获取用户信息
   */
  static getUserById(userId: string) {
    return UserService.getUserById(userId);
  }

  /**
   * 生成随机密码
   */
  static generateRandomPassword(length: number = 16) {
    return PasswordService.generateRandomPassword(length);
  }

  /**
   * 检查密码强度
   */
  static checkPasswordStrength(password: string) {
    return PasswordService.checkPasswordStrength(password);
  }

  /**
   * 获取审计日志统计
   */
  static getAuditStats() {
    return AuditLogService.getStats();
  }

  /**
   * 查询审计日志
   */
  static queryAuditLogs(options: AuditLogQueryOptions) {
    return AuditLogService.queryLogs(options);
  }
}

/**
 * 默认导出认证服务
 */
export default AuthService;

/**
 * 认证配置接口
 */
export interface AuthConfig {
  jwtSecret: string;
  jwtRefreshSecret: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumber: boolean;
    requireSpecialChar: boolean;
    maxAgeDays: number;
    historySize: number;
    maxAttempts: number;
    lockoutTime: number;
  };
}

/**
 * 默认认证配置
 */
export const defaultAuthConfig: AuthConfig = {
  jwtSecret: process.env.JWT_SECRET || 'fallback-jwt-secret-key-change-in-production',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key-change-in-production',
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    maxAgeDays: 90,
    historySize: 5,
    maxAttempts: 5,
    lockoutTime: 15
  }
};

/**
 * 初始化认证系统
 */
export function initializeAuth(config: Partial<AuthConfig> = {}) {
  const finalConfig = { ...defaultAuthConfig, ...config };
  
  // 设置环境变量（在实际部署中应该通过环境变量设置）
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = finalConfig.jwtSecret;
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    process.env.JWT_REFRESH_SECRET = finalConfig.jwtRefreshSecret;
  }

  console.log('认证系统初始化完成');
  console.log('JWT密钥已设置:', process.env.JWT_SECRET ? '是' : '否');
  console.log('刷新令牌密钥已设置:', process.env.JWT_REFRESH_SECRET ? '是' : '否');

  return finalConfig;
}

/**
 * 健康检查
 */
export function authHealthCheck() {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    jwt: JWTService.getKeyInfo(),
    users: UserService['users'].size,
    refreshTokens: UserService['refreshTokens'].size,
    auditLogs: AuditLogService['logs'].length
  };
}