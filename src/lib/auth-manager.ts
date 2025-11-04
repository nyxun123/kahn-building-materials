/**
 * JWT 认证管理器
 * 
 * 功能:
 * - 管理 access token 和 refresh token
 * - 自动检测 token 过期
 * - 自动刷新 token
 * - 提供统一的认证接口
 */

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number;
}

interface UserInfo {
  id: number;
  email: string;
  name: string;
  role: string;
}

export class AuthManager {
  private static ACCESS_TOKEN_KEY = 'admin_access_token';
  private static REFRESH_TOKEN_KEY = 'admin_refresh_token';
  private static TOKEN_EXPIRY_KEY = 'admin_token_expiry';
  private static USER_INFO_KEY = 'admin_user_info';
  
  // Token 刷新缓冲时间（提前 1 分钟刷新）
  private static REFRESH_BUFFER_MS = 60 * 1000;
  
  // 🔧 公开ACCESS_TOKEN_KEY用于外部检查
  static get ACCESS_TOKEN_KEY_PUBLIC() {
    return AuthManager.ACCESS_TOKEN_KEY;
  }

  /**
   * 保存登录响应的 tokens
   */
  static saveTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    const expiresAt = Date.now() + (expiresIn * 1000);
    
    // 🔧 修复: 使用同步方式保存，确保立即生效
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiresAt.toString());
      
      // 立即验证保存是否成功
      const savedToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      if (!savedToken || savedToken !== accessToken) {
        console.error('❌ Token保存失败！localStorage可能被禁用');
        throw new Error('Token保存失败，localStorage可能被禁用');
      }
      
      console.log('✅ Tokens 已保存', {
        expiresIn: `${expiresIn}秒`,
        expiresAt: new Date(expiresAt).toLocaleString(),
        tokenLength: accessToken.length
      });
    } catch (error) {
      console.error('❌ Token保存异常:', error);
      throw error;
    }
  }

  /**
   * 保存用户信息
   */
  static saveUserInfo(user: UserInfo): void {
    try {
      const userJson = JSON.stringify(user);
      localStorage.setItem(this.USER_INFO_KEY, userJson);
      
      // 立即验证保存是否成功
      const savedUser = localStorage.getItem(this.USER_INFO_KEY);
      if (!savedUser || savedUser !== userJson) {
        console.error('❌ 用户信息保存失败！');
        throw new Error('用户信息保存失败');
      }
      
      console.log('✅ 用户信息已保存', { userId: user.id, email: user.email });
    } catch (error) {
      console.error('❌ 用户信息保存异常:', error);
      throw error;
    }
  }

  /**
   * 获取用户信息
   */
  static getUserInfo(): UserInfo | null {
    const userJson = localStorage.getItem(this.USER_INFO_KEY);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('解析用户信息失败:', error);
      return null;
    }
  }

  /**
   * 获取 access token
   * 如果 token 即将过期，返回 null 触发刷新
   */
  static getAccessToken(): string | null {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    const expiryStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    
    if (!token || !expiryStr) {
      console.warn('⚠️ Access token 不存在');
      return null;
    }
    
    const expiry = parseInt(expiryStr);
    const now = Date.now();
    
    // 检查是否已过期（而不是即将过期）
    // 只有在真正过期时才返回 null，避免登录后立即失效
    if (now >= expiry) {
      console.warn('⚠️ Access token 已过期', {
        now: new Date(now).toLocaleString(),
        expiry: new Date(expiry).toLocaleString(),
        diff: Math.round((expiry - now) / 1000) + '秒'
      });
      return null;
    }
    
    // 如果即将过期（少于 2 分钟），记录警告但不阻止使用
    if (now >= expiry - (2 * 60 * 1000)) {
      console.warn('⚠️ Access token 即将过期，建议刷新', {
        remaining: Math.round((expiry - now) / 1000) + '秒'
      });
    }
    
    return token;
  }

  /**
   * 获取 refresh token
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * 检查是否已登录
   */
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token !== null;
  }

  /**
   * 刷新 access token
   * 
   * @returns 是否刷新成功
   */
  static async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      console.error('❌ Refresh token 不存在，无法刷新');
      return false;
    }

    try {
      console.log('🔄 正在刷新 access token...');
      
      const response = await fetch('/api/admin/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Token 刷新失败:', error.message);
        
        // 如果是 401 或 403，说明 refresh token 也无效了
        if (response.status === 401 || response.status === 403) {
          this.clearTokens();
        }
        
        return false;
      }

      const data = await response.json();
      
      // 保存新的 tokens
      this.saveTokens(
        data.accessToken,
        data.refreshToken,
        data.expiresIn
      );
      
      console.log('✅ Access token 刷新成功');
      return true;
      
    } catch (error) {
      console.error('❌ Token 刷新异常:', error);
      return false;
    }
  }

  /**
   * 获取有效的 access token
   * 如果 token 不存在或已过期，尝试刷新
   * 
   * @returns 有效的 access token，如果无法获取则返回 null
   */
  static async getValidAccessToken(): Promise<string | null> {
    let token = this.getAccessToken();
    
    // 如果 token 不存在或已过期，尝试刷新
    if (!token) {
      console.log('🔄 Token 不存在或已过期，尝试刷新...');
      const refreshed = await this.refreshToken();
      if (refreshed) {
        token = this.getAccessToken();
        if (token) {
          console.log('✅ Token 刷新成功');
        }
      } else {
        console.warn('⚠️ Token 刷新失败');
      }
    } else {
      console.log('✅ 使用现有的有效 Token');
    }
    
    return token;
  }

  /**
   * 清除所有认证信息
   */
  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
    
    // 兼容旧的认证方式
    localStorage.removeItem('admin-auth');
    localStorage.removeItem('temp-admin-auth');
    
    console.log('🗑️ 认证信息已清除');
  }

  /**
   * 登录
   * 
   * @param email 邮箱
   * @param password 密码
   * @returns 登录结果
   */
  static async login(email: string, password: string): Promise<{
    success: boolean;
    message?: string;
    user?: UserInfo;
  }> {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || '登录失败'
        };
      }

      // 保存 tokens 和用户信息
      this.saveTokens(
        data.accessToken,
        data.refreshToken,
        data.expiresIn
      );
      
      this.saveUserInfo(data.user);

      return {
        success: true,
        user: data.user
      };
      
    } catch (error) {
      console.error('登录异常:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '网络错误'
      };
    }
  }

  /**
   * 登出
   */
  static logout(): void {
    this.clearTokens();
    
    // 跳转到登录页
    window.location.href = '/admin/login';
  }

  /**
   * 获取认证 headers
   * 
   * @returns Authorization header 对象
   */
  static async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getValidAccessToken();
    
    if (!token) {
      return {};
    }
    
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * 兼容旧的认证方式
   * 从旧的 localStorage 迁移到新的 JWT 认证
   */
  static migrateFromLegacyAuth(): void {
    // 🔧 修复: 不应该清除token，应该迁移数据
    // 如果已经有新的JWT token，就不需要迁移
    const hasNewToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (hasNewToken) {
      // 已经有新的token，不需要迁移
      return;
    }
    
    // 只有在没有新token的情况下，才尝试从旧格式迁移
    const oldAuth = localStorage.getItem('admin-auth');
    if (oldAuth) {
      try {
        const parsed = JSON.parse(oldAuth);
        if (parsed.accessToken && parsed.refreshToken) {
          console.log('🔄 从旧格式迁移token到新格式');
          // 迁移token到新格式
          this.saveTokens(
            parsed.accessToken,
            parsed.refreshToken,
            parsed.expiresIn || 900
          );
          
          // 如果有用户信息，也迁移
          if (parsed.user) {
            this.saveUserInfo({
              id: parsed.user.id,
              email: parsed.user.email,
              name: parsed.user.name || '',
              role: parsed.user.role || 'admin'
            });
          }
          
          console.log('✅ Token迁移成功');
          return;
        }
      } catch (e) {
        console.error('解析旧格式token失败:', e);
      }
    }
    
    // 检查临时认证
    const tempAuth = localStorage.getItem('temp-admin-auth');
    if (tempAuth) {
      console.warn('⚠️ 检测到临时认证方式，建议重新登录以使用新的 JWT 认证');
      // 不清除，保留临时认证以便用户继续使用
    }
  }
}

// 🔧 修复: 页面加载时检查并迁移旧的认证方式
// 但只在确实需要时才执行，避免清除已有token
if (typeof window !== 'undefined') {
  // 🔧 重要：延迟执行，确保其他代码先运行
  // 并且只在没有新token的情况下才执行迁移
  setTimeout(() => {
    try {
      // 再次检查是否有新token，避免在页面加载时清除已有的token
      const ACCESS_TOKEN_KEY = 'admin_access_token'; // 直接使用字符串常量
      const hasNewToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (hasNewToken) {
        console.log('✅ 已有新token，跳过迁移');
        return;
      }
      
      console.log('🔄 检查是否需要迁移旧格式token...');
      AuthManager.migrateFromLegacyAuth();
    } catch (error) {
      console.error('迁移认证信息失败:', error);
    }
  }, 500); // 增加延迟到500ms，确保登录页面的token保存完成
}

