import { DatabaseService } from '../database/db-service';
import { PasswordService, PASSWORD_POLICY, validatePasswordPolicy } from './password';
import { JWTService, JWTPayload, TokenPair } from './jwt';
import { AuditLogService, AUDIT_ACTIONS } from './audit-log';
import type {
  RegisterData,
  LoginCredentials,
  RegisterResult,
  LoginResult,
  RefreshTokenResult,
  ChangePasswordResult,
  SanitizedUser
} from './user-service';

/**
 * 基于数据库的用户服务
 * 提供用户认证和管理的持久化实现
 */
export class UserServiceDB {
  /**
   * 用户注册
   */
  static async register(userData: RegisterData): Promise<RegisterResult> {
    try {
      // 验证用户名是否已存在
      const existingUser = await DatabaseService.get(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [userData.username, userData.email]
      );

      if (existingUser) {
        return {
          success: false,
          error: '用户名或邮箱已存在',
          code: 'USERNAME_OR_EMAIL_EXISTS'
        };
      }

      // 验证密码策略
      const policyValidation = validatePasswordPolicy(userData.password);
      if (!policyValidation.isValid) {
        return {
          success: false,
          error: '密码不符合策略要求',
          code: 'PASSWORD_POLICY_VIOLATION',
          details: policyValidation.errors
        };
      }

      // 哈希密码
      const hashedPassword = await PasswordService.hashPassword(userData.password);

      // 创建用户
      const userId = this.generateUserId();
      const now = new Date().toISOString();

      await DatabaseService.run(
        `INSERT INTO users (
          id, username, email, password_hash, roles, permissions, 
          is_active, is_verified, password_changed_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          userData.username,
          userData.email,
          hashedPassword,
          JSON.stringify(userData.roles || ['user']),
          JSON.stringify(userData.permissions || []),
          1, // is_active
          0, // is_verified
          now,
          now,
          now
        ]
      );

      // 获取创建的用户
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('用户创建后查询失败');
      }

      // 记录审计日志
      AuditLogService.logEvent({
        action: AUDIT_ACTIONS.USER_CREATE,
        userId: user.id,
        username: user.username,
        description: `新用户注册: ${user.username}`,
        severity: 'INFO'
      });

      return {
        success: true,
        user: this.sanitizeUser(user),
        message: '用户注册成功'
      };
    } catch (error) {
      console.error('用户注册失败:', error);
      return {
        success: false,
        error: '注册失败，请稍后重试',
        code: 'REGISTRATION_FAILED'
      };
    }
  }

  /**
   * 用户登录
   */
  static async login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string): Promise<LoginResult> {
    try {
      // 查找用户
      const user = await DatabaseService.get<UserDB>(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [credentials.identifier, credentials.identifier]
      );

      if (!user) {
        return {
          success: false,
          error: '用户不存在',
          code: 'USER_NOT_FOUND'
        };
      }

      // 检查账户是否被锁定
      if (user.lockout_until && new Date(user.lockout_until) > new Date()) {
        return {
          success: false,
          error: '账户已被锁定，请稍后重试',
          code: 'ACCOUNT_LOCKED',
          lockoutTime: new Date(user.lockout_until).getTime() - Date.now()
        };
      }

      // 验证密码
      const passwordValid = await PasswordService.verifyPassword(
        credentials.password,
        user.password_hash
      );

      if (!passwordValid) {
        // 增加失败尝试次数
        const newAttempts = user.failed_login_attempts + 1;
        let lockoutUntil = null;

        // 检查是否应该锁定账户
        if (newAttempts >= PASSWORD_POLICY.MAX_ATTEMPTS) {
          lockoutUntil = new Date(Date.now() + PASSWORD_POLICY.LOCKOUT_TIME * 60 * 1000).toISOString();
        }

        await DatabaseService.run(
          'UPDATE users SET failed_login_attempts = ?, lockout_until = ?, updated_at = ? WHERE id = ?',
          [newAttempts, lockoutUntil, new Date().toISOString(), user.id]
        );

        return {
          success: false,
          error: '密码错误',
          code: 'INVALID_PASSWORD',
          remainingAttempts: PASSWORD_POLICY.MAX_ATTEMPTS - newAttempts
        };
      }

      // 登录成功，重置失败计数
      const now = new Date().toISOString();
      await DatabaseService.run(
        'UPDATE users SET failed_login_attempts = 0, lockout_until = NULL, last_login_at = ?, updated_at = ? WHERE id = ?',
        [now, now, user.id]
      );

      // 生成令牌对
      const tokenPayload: JWTPayload = {
        userId: user.id,
        username: user.username,
        roles: JSON.parse(user.roles),
        permissions: JSON.parse(user.permissions)
      };

      const tokens = JWTService.generateTokenPair(tokenPayload);

      // 存储刷新令牌
      await this.storeRefreshToken(user.id, tokens.refreshToken);

      // 记录登录事件
      AuditLogService.logLogin(user.id, user.username, true, ipAddress, userAgent);

      return {
        success: true,
        tokens,
        user: this.sanitizeUser(user)
      };
    } catch (error) {
      console.error('用户登录失败:', error);
      return {
        success: false,
        error: '登录失败，请稍后重试',
        code: 'LOGIN_FAILED'
      };
    }
  }

  /**
   * 刷新访问令牌
   */
  static async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResult> {
    try {
      // 验证刷新令牌
      const tokenInfo = await DatabaseService.get<RefreshTokenDB>(
        'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > ?',
        [refreshToken, new Date().toISOString()]
      );

      if (!tokenInfo) {
        return {
          success: false,
          error: '无效或过期的刷新令牌',
          code: 'INVALID_REFRESH_TOKEN'
        };
      }

      // 获取用户信息
      const user = await this.getUserById(tokenInfo.user_id);
      if (!user) {
        return {
          success: false,
          error: '用户不存在',
          code: 'USER_NOT_FOUND'
        };
      }

      // 生成新的令牌对
      const tokenPayload: JWTPayload = {
        userId: user.id,
        username: user.username,
        roles: JSON.parse(user.roles),
        permissions: JSON.parse(user.permissions)
      };

      const newTokens = JWTService.generateTokenPair(tokenPayload);

      // 移除旧的刷新令牌，存储新的
      await DatabaseService.run('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
      await this.storeRefreshToken(user.id, newTokens.refreshToken);

      // 记录审计事件
      AuditLogService.logEvent({
        action: AUDIT_ACTIONS.TOKEN_REFRESH,
        userId: user.id,
        username: user.username,
        description: '访问令牌刷新成功',
        severity: 'INFO'
      });

      return {
        success: true,
        tokens: newTokens
      };
    } catch (error) {
      console.error('令牌刷新失败:', error);
      return {
        success: false,
        error: '令牌刷新失败',
        code: 'REFRESH_FAILED'
      };
    }
  }

  /**
   * 注销用户
   */
  static async logout(userId: string, refreshToken?: string, ipAddress?: string): Promise<void> {
    try {
      if (refreshToken) {
        // 移除指定的刷新令牌
        await DatabaseService.run('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
      } else {
        // 移除该用户的所有刷新令牌
        await DatabaseService.run('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
      }

      // 记录注销事件
      const user = await this.getUserById(userId);
      if (user) {
        AuditLogService.logLogout(userId, user.username, ipAddress);
      }
    } catch (error) {
      console.error('用户注销失败:', error);
    }
  }

  /**
   * 修改密码
   */
  static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ChangePasswordResult> {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        return {
          success: false,
          error: '用户不存在',
          code: 'USER_NOT_FOUND'
        };
      }

      // 验证旧密码
      const oldPasswordValid = await PasswordService.verifyPassword(oldPassword, user.password_hash);
      if (!oldPasswordValid) {
        return {
          success: false,
          error: '旧密码错误',
          code: 'INVALID_OLD_PASSWORD'
        };
      }

      // 验证新密码策略
      const policyValidation = validatePasswordPolicy(newPassword);
      if (!policyValidation.isValid) {
        return {
          success: false,
          error: '新密码不符合策略要求',
          code: 'PASSWORD_POLICY_VIOLATION',
          details: policyValidation.errors
        };
      }

      // 更新密码
      const newHashedPassword = await PasswordService.hashPassword(newPassword);
      const now = new Date().toISOString();

      await DatabaseService.run(
        'UPDATE users SET password_hash = ?, password_changed_at = ?, updated_at = ? WHERE id = ?',
        [newHashedPassword, now, now, userId]
      );

      // 注销所有活动的会话
      await this.logout(userId);

      // 记录密码修改事件
      AuditLogService.logPasswordChange(userId, user.username, true);

      return {
        success: true,
        message: '密码修改成功'
      };
    } catch (error) {
      console.error('密码修改失败:', error);
      return {
        success: false,
        error: '密码修改失败',
        code: 'PASSWORD_CHANGE_FAILED'
      };
    }
  }

  /**
   * 根据ID获取用户信息
   */
  static async getUserById(userId: string): Promise<UserDB | null> {
    try {
      return await DatabaseService.get<UserDB>('SELECT * FROM users WHERE id = ?', [userId]);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  /**
   * 根据用户名获取用户信息
   */
  static async getUserByUsername(username: string): Promise<UserDB | null> {
    try {
      return await DatabaseService.get<UserDB>('SELECT * FROM users WHERE username = ?', [username]);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  /**
   * 获取所有用户
   */
  static async getAllUsers(): Promise<SanitizedUser[]> {
    try {
      const users = await DatabaseService.all<UserDB>('SELECT * FROM users ORDER BY created_at DESC');
      return users.map(user => this.sanitizeUser(user));
    } catch (error) {
      console.error('获取用户列表失败:', error);
      return [];
    }
  }

  /**
   * 验证用户权限
   */
  static async hasPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      if (!user) return false;

      const permissions = JSON.parse(user.permissions);
      return permissions.includes(permission);
    } catch (error) {
      console.error('权限验证失败:', error);
      return false;
    }
  }

  /**
   * 验证用户角色
   */
  static async hasRole(userId: string, role: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      if (!user) return false;

      const roles = JSON.parse(user.roles);
      return roles.includes(role);
    } catch (error) {
      console.error('角色验证失败:', error);
      return false;
    }
  }

  /**
   * 存储刷新令牌
   */
  private static async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    try {
      const decoded = JWTService.decodeToken(refreshToken);
      if (!decoded || !decoded.exp) return;

      const expiresAt = new Date(decoded.exp * 1000).toISOString();

      await DatabaseService.run(
        'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)',
        [refreshToken, userId, expiresAt]
      );
    } catch (error) {
      console.error('存储刷新令牌失败:', error);
    }
  }

  /**
   * 清理用户敏感信息
   */
  private static sanitizeUser(user: UserDB): SanitizedUser {
    const { password_hash, mfa_secret, ...rest } = user;
    
    // 转换数据库字段到内存存储字段格式
    return {
      id: rest.id,
      username: rest.username,
      email: rest.email,
      roles: JSON.parse(rest.roles),
      permissions: JSON.parse(rest.permissions),
      isActive: rest.is_active === 1,
      isVerified: rest.is_verified === 1,
      failedLoginAttempts: rest.failed_login_attempts,
      lockoutUntil: rest.lockout_until ? new Date(rest.lockout_until) : null,
      lastLoginAt: rest.last_login_at ? new Date(rest.last_login_at) : null,
      passwordChangedAt: new Date(rest.password_changed_at),
      mfaEnabled: rest.mfa_enabled === 1,
      createdAt: new Date(rest.created_at),
      updatedAt: new Date(rest.updated_at)
    };
  }

  /**
   * 生成用户ID
   */
  private static generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// 数据库类型定义
export interface UserDB {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  roles: string; // JSON字符串
  permissions: string; // JSON字符串
  is_active: number;
  is_verified: number;
  failed_login_attempts: number;
  lockout_until: string | null;
  last_login_at: string | null;
  password_changed_at: string;
  mfa_enabled: number;
  mfa_secret: string | null;
  created_at: string;
  updated_at: string;
}

export interface RefreshTokenDB {
  token: string;
  user_id: string;
  expires_at: string;
  created_at: string;
}

// 导出常用类型
export type { RegisterData, LoginCredentials, RegisterResult, LoginResult, RefreshTokenResult, ChangePasswordResult, SanitizedUser } from './user-service';

// 默认导出
export default UserServiceDB;