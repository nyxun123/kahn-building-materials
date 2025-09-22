import { PasswordService, PASSWORD_POLICY, validatePasswordPolicy } from './password';
import { JWTService, JWTPayload, TokenPair } from './jwt';

/**
 * 用户服务
 * 处理用户认证、注册、密码管理等核心功能
 */
export class UserService {
  // 模拟用户存储（实际项目中应该使用数据库）
  private static users = new Map<string, User>();
  private static refreshTokens = new Map<string, RefreshTokenInfo>();

  /**
   * 用户注册
   * @param userData 用户注册数据
   * @returns 注册结果
   */
  static async register(userData: RegisterData): Promise<RegisterResult> {
    // 验证用户名是否已存在
    if (this.users.has(userData.username)) {
      return {
        success: false,
        error: '用户名已存在',
        code: 'USERNAME_EXISTS'
      };
    }

    // 验证邮箱是否已存在
    const emailExists = Array.from(this.users.values()).some(
      user => user.email === userData.email
    );
    
    if (emailExists) {
      return {
        success: false,
        error: '邮箱已存在',
        code: 'EMAIL_EXISTS'
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

    try {
      // 哈希密码
      const hashedPassword = await PasswordService.hashPassword(userData.password);

      // 创建用户
      const user: User = {
        id: this.generateUserId(),
        username: userData.username,
        email: userData.email,
        passwordHash: hashedPassword,
        roles: userData.roles || ['user'],
        permissions: userData.permissions || [],
        isActive: true,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null,
        failedLoginAttempts: 0,
        lockoutUntil: null,
        passwordChangedAt: new Date(),
        mfaEnabled: false
      };

      // 保存用户
      this.users.set(user.id, user);
      this.users.set(user.username, user); // 也通过用户名索引

      return {
        success: true,
        user: this.sanitizeUser(user),
        message: '用户注册成功'
      };
    } catch (error) {
      return {
        success: false,
        error: '注册失败，请稍后重试',
        code: 'REGISTRATION_FAILED'
      };
    }
  }

  /**
   * 用户登录
   * @param credentials 登录凭据
   * @returns 登录结果
   */
  static async login(credentials: LoginCredentials): Promise<LoginResult> {
    // 查找用户（支持用户名或邮箱登录）
    const user = this.findUserByIdentifier(credentials.identifier);
    
    if (!user) {
      return {
        success: false,
        error: '用户不存在',
        code: 'USER_NOT_FOUND'
      };
    }

    // 检查账户是否被锁定
    if (this.isAccountLocked(user)) {
      return {
        success: false,
        error: '账户已被锁定，请稍后重试',
        code: 'ACCOUNT_LOCKED',
        lockoutTime: user.lockoutUntil ? user.lockoutUntil.getTime() - Date.now() : null
      };
    }

    // 验证密码
    const passwordValid = await PasswordService.verifyPassword(
      credentials.password,
      user.passwordHash
    );

    if (!passwordValid) {
      // 增加失败尝试次数
      user.failedLoginAttempts++;
      
      // 检查是否应该锁定账户
      if (user.failedLoginAttempts >= PASSWORD_POLICY.MAX_ATTEMPTS) {
        user.lockoutUntil = new Date(Date.now() + PASSWORD_POLICY.LOCKOUT_TIME * 60 * 1000);
      }

      return {
        success: false,
        error: '密码错误',
        code: 'INVALID_PASSWORD',
        remainingAttempts: PASSWORD_POLICY.MAX_ATTEMPTS - user.failedLoginAttempts
      };
    }

    // 登录成功，重置失败计数
    user.failedLoginAttempts = 0;
    user.lockoutUntil = null;
    user.lastLoginAt = new Date();
    user.updatedAt = new Date();

    // 生成令牌对
    const tokenPayload: JWTPayload = {
      userId: user.id,
      username: user.username,
      roles: user.roles,
      permissions: user.permissions
    };

    const tokens = JWTService.generateTokenPair(tokenPayload);

    // 存储刷新令牌
    this.storeRefreshToken(user.id, tokens.refreshToken);

    return {
      success: true,
      tokens,
      user: this.sanitizeUser(user)
    };
  }

  /**
   * 刷新访问令牌
   * @param refreshToken 刷新令牌
   * @returns 新的令牌对或错误
   */
  static async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResult> {
    const tokenInfo = this.refreshTokens.get(refreshToken);
    
    if (!tokenInfo || tokenInfo.expiresAt < new Date()) {
      return {
        success: false,
        error: '无效或过期的刷新令牌',
        code: 'INVALID_REFRESH_TOKEN'
      };
    }

    const user = this.users.get(tokenInfo.userId);
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
      roles: user.roles,
      permissions: user.permissions
    };

    const newTokens = JWTService.generateTokenPair(tokenPayload);

    // 移除旧的刷新令牌，存储新的
    this.refreshTokens.delete(refreshToken);
    this.storeRefreshToken(user.id, newTokens.refreshToken);

    return {
      success: true,
      tokens: newTokens
    };
  }

  /**
   * 注销用户
   * @param userId 用户ID
   * @param refreshToken 刷新令牌（可选）
   */
  static logout(userId: string, refreshToken?: string): void {
    if (refreshToken) {
      this.refreshTokens.delete(refreshToken);
    } else {
      // 移除该用户的所有刷新令牌
      for (const [token, info] of this.refreshTokens.entries()) {
        if (info.userId === userId) {
          this.refreshTokens.delete(token);
        }
      }
    }
  }

  /**
   * 修改密码
   * @param userId 用户ID
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   */
  static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ChangePasswordResult> {
    const user = this.users.get(userId);
    if (!user) {
      return {
        success: false,
        error: '用户不存在',
        code: 'USER_NOT_FOUND'
      };
    }

    // 验证旧密码
    const oldPasswordValid = await PasswordService.verifyPassword(
      oldPassword,
      user.passwordHash
    );

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
    user.passwordHash = await PasswordService.hashPassword(newPassword);
    user.passwordChangedAt = new Date();
    user.updatedAt = new Date();

    // 注销所有活动的会话
    this.logout(userId);

    return {
      success: true,
      message: '密码修改成功'
    };
  }

  /**
   * 根据标识符查找用户（用户名或邮箱）
   */
  private static findUserByIdentifier(identifier: string): User | undefined {
    // 先尝试按用户名查找
    let user = this.users.get(identifier);
    
    if (!user) {
      // 再尝试按邮箱查找
      user = Array.from(this.users.values()).find(
        u => u.email === identifier
      );
    }

    return user;
  }

  /**
   * 检查账户是否被锁定
   */
  private static isAccountLocked(user: User): boolean {
    return user.lockoutUntil !== null && user.lockoutUntil > new Date();
  }

  /**
   * 存储刷新令牌
   */
  private static storeRefreshToken(userId: string, refreshToken: string): void {
    const decoded = JWTService.decodeToken(refreshToken);
    if (!decoded || !decoded.exp) return;

    this.refreshTokens.set(refreshToken, {
      userId,
      expiresAt: new Date(decoded.exp * 1000),
      createdAt: new Date()
    });
  }

  /**
   * 生成用户ID
   */
  private static generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 清理用户敏感信息
   */
  private static sanitizeUser(user: User): SanitizedUser {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  /**
   * 获取用户信息
   */
  static getUserById(userId: string): SanitizedUser | null {
    const user = this.users.get(userId);
    return user ? this.sanitizeUser(user) : null;
  }

  /**
   * 验证用户权限
   */
  static hasPermission(userId: string, permission: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    return user.permissions.includes(permission);
  }

  /**
   * 验证用户角色
   */
  static hasRole(userId: string, role: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    return user.roles.includes(role);
  }
}

// 类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  failedLoginAttempts: number;
  lockoutUntil: Date | null;
  passwordChangedAt: Date;
  mfaEnabled: boolean;
}

export interface SanitizedUser extends Omit<User, 'passwordHash'> {}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  roles?: string[];
  permissions?: string[];
}

export interface LoginCredentials {
  identifier: string; // 用户名或邮箱
  password: string;
}

export interface RefreshTokenInfo {
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface RegisterResult {
  success: boolean;
  user?: SanitizedUser;
  error?: string;
  code?: string;
  details?: string[];
  message?: string;
}

export interface LoginResult {
  success: boolean;
  tokens?: TokenPair;
  user?: SanitizedUser;
  error?: string;
  code?: string;
  remainingAttempts?: number;
  lockoutTime?: number | null;
}

export interface RefreshTokenResult {
  success: boolean;
  tokens?: TokenPair;
  error?: string;
  code?: string;
}

export interface ChangePasswordResult {
  success: boolean;
  message?: string;
  error?: string;
  code?: string;
  details?: string[];
}

// 默认用户（用于测试）
UserService.register({
  username: 'admin',
  email: 'admin@example.com',
  password: 'Admin123!',
  roles: ['admin', 'user'],
  permissions: ['users:read', 'users:write', 'content:manage']
});

UserService.register({
  username: 'user',
  email: 'user@example.com',
  password: 'User123!',
  roles: ['user'],
  permissions: ['content:read']
});