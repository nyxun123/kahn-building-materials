import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

/**
 * JWT令牌管理服务
 * 提供JWT令牌的生成、验证和刷新功能
 */
export class JWTService {
  private static readonly SECRET_KEY: string = process.env.JWT_SECRET || this.generateFallbackSecret();
  private static readonly REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || this.generateFallbackSecret();
  
  // Token配置
  private static readonly ACCESS_TOKEN_CONFIG = {
    expiresIn: '15m',    // 访问令牌有效期
    issuer: 'backend-management-system',
    audience: 'web-client'
  };

  private static readonly REFRESH_TOKEN_CONFIG = {
    expiresIn: '7d',     // 刷新令牌有效期
    issuer: 'backend-management-system', 
    audience: 'web-client'
  };

  /**
   * 生成访问令牌
   * @param payload 令牌负载
   * @returns JWT访问令牌
   */
  static generateAccessToken(payload: JWTPayload): string {
    // 使用类型断言绕过TypeScript检查
    return (jwt.sign as any)(
      { ...payload, type: 'access' },
      this.SECRET_KEY,
      {
        expiresIn: this.ACCESS_TOKEN_CONFIG.expiresIn,
        issuer: this.ACCESS_TOKEN_CONFIG.issuer,
        audience: this.ACCESS_TOKEN_CONFIG.audience
      }
    );
  }

  /**
   * 生成刷新令牌
   * @param payload 令牌负载
   * @returns JWT刷新令牌
   */
  static generateRefreshToken(payload: JWTPayload): string {
    // 使用类型断言绕过TypeScript检查
    return (jwt.sign as any)(
      { ...payload, type: 'refresh' },
      this.REFRESH_SECRET,
      {
        expiresIn: this.REFRESH_TOKEN_CONFIG.expiresIn,
        issuer: this.REFRESH_TOKEN_CONFIG.issuer,
        audience: this.REFRESH_TOKEN_CONFIG.audience
      }
    );
  }

  /**
   * 验证访问令牌
   * @param token JWT令牌
   * @returns 解码后的令牌数据或null
   */
  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.SECRET_KEY, {
        issuer: this.ACCESS_TOKEN_CONFIG.issuer,
        audience: this.ACCESS_TOKEN_CONFIG.audience
      }) as jwt.JwtPayload;

      if (decoded.type !== 'access') {
        return null;
      }

      return this.validatePayload(decoded);
    } catch (error) {
      return null;
    }
  }

  /**
   * 验证刷新令牌
   * @param token JWT刷新令牌
   * @returns 解码后的令牌数据或null
   */
  static verifyRefreshToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.REFRESH_SECRET, {
        issuer: this.REFRESH_TOKEN_CONFIG.issuer,
        audience: this.REFRESH_TOKEN_CONFIG.audience
      }) as jwt.JwtPayload;

      if (decoded.type !== 'refresh') {
        return null;
      }

      return this.validatePayload(decoded);
    } catch (error) {
      return null;
    }
  }

  /**
   * 刷新令牌对
   * @param refreshToken 刷新令牌
   * @returns 新的访问令牌和刷新令牌，或null
   */
  static refreshTokens(refreshToken: string): { accessToken: string; refreshToken: string } | null {
    const payload = this.verifyRefreshToken(refreshToken);
    
    if (!payload) {
      return null;
    }

    // 生成新的令牌对
    const newAccessToken = this.generateAccessToken(payload);
    const newRefreshToken = this.generateRefreshToken(payload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  /**
   * 解码令牌（不验证签名）
   * @param token JWT令牌
   * @returns 解码后的令牌数据
   */
  static decodeToken(token: string): jwt.JwtPayload | null {
    try {
      return jwt.decode(token) as jwt.JwtPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * 获取令牌过期时间
   * @param token JWT令牌
   * @returns 过期时间戳或null
   */
  static getTokenExpiration(token: string): number | null {
    const decoded = this.decodeToken(token);
    return decoded?.exp ? decoded.exp * 1000 : null;
  }

  /**
   * 检查令牌是否即将过期
   * @param token JWT令牌
   * @param thresholdMs 阈值（毫秒），默认5分钟
   * @returns 是否即将过期
   */
  static isTokenExpiringSoon(token: string, thresholdMs: number = 5 * 60 * 1000): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return false;

    return expiration - Date.now() <= thresholdMs;
  }

  /**
   * 生成令牌对（访问令牌 + 刷新令牌）
   * @param payload 令牌负载
   * @returns 令牌对
   */
  static generateTokenPair(payload: JWTPayload): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
      expiresIn: 15 * 60, // 15分钟，单位秒
      tokenType: 'Bearer'
    };
  }

  /**
   * 验证payload格式
   * @param payload JWT payload
   * @returns 验证后的payload或null
   */
  private static validatePayload(payload: any): JWTPayload | null {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const { userId, username, roles, permissions, type, ...rest } = payload;

    if (!userId || !username || !Array.isArray(roles)) {
      return null;
    }

    return {
      userId,
      username,
      roles: roles.filter((r: any) => typeof r === 'string'),
      permissions: Array.isArray(permissions) ? permissions.filter((p: any) => typeof p === 'string') : [],
      ...rest
    };
  }

  /**
   * 生成备用密钥（当环境变量未设置时使用）
   * @returns 随机生成的密钥
   */
  private static generateFallbackSecret(): string {
    return randomBytes(64).toString('hex');
  }

  /**
   * 获取密钥信息（用于调试和监控）
   * @returns 密钥相关信息
   */
  static getKeyInfo(): {
    hasCustomSecret: boolean;
    hasCustomRefreshSecret: boolean;
    secretLength: number;
    refreshSecretLength: number;
  } {
    return {
      hasCustomSecret: !!process.env.JWT_SECRET,
      hasCustomRefreshSecret: !!process.env.JWT_REFRESH_SECRET,
      secretLength: this.SECRET_KEY.length,
      refreshSecretLength: this.REFRESH_SECRET.length
    };
  }
}

/**
 * JWT令牌负载接口
 */
export interface JWTPayload {
  userId: string;
  username: string;
  roles: string[];
  permissions?: string[];
  [key: string]: any;
}

/**
 * 令牌对接口
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

/**
 * 令牌验证结果
 */
export interface TokenValidationResult {
  isValid: boolean;
  payload: JWTPayload | null;
  error?: string;
}

/**
 * 令牌配置
 */
export interface TokenConfig {
  secret: string;
  expiresIn: string;
  issuer: string;
  audience: string;
}

// 导出常用错误类型
export const JWT_ERRORS = {
  TOKEN_EXPIRED: 'TokenExpiredError',
  JSON_WEB_TOKEN_ERROR: 'JsonWebTokenError',
  NOT_BEFORE_ERROR: 'NotBeforeError'
};

/**
 * 创建自定义令牌配置
 */
export function createTokenConfig(config: Partial<TokenConfig> & { secret: string }): TokenConfig {
  return {
    secret: config.secret,
    expiresIn: config.expiresIn || '1h',
    issuer: config.issuer || 'backend-management-system',
    audience: config.audience || 'web-client'
  };
}