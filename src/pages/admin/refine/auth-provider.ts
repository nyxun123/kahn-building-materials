import type { AuthBindings } from "@refinedev/core";
import { AuthManager } from "@/lib/auth-manager";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  success?: boolean;
  user?: {
    id: number;
    email: string;
    name?: string;
    role?: string;
  };
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  authType?: string;
  error?: { message?: string };
  message?: string;
};

const AUTH_KEY = "admin-auth";

const storeSession = (user: LoginResponse["user"], accessToken?: string, refreshToken?: string, expiresIn?: number) => {
  if (!user) return;

  // 使用 AuthManager 保存 JWT tokens
  if (accessToken && refreshToken && expiresIn) {
    AuthManager.saveTokens(accessToken, refreshToken, expiresIn);
    AuthManager.saveUserInfo({
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role || 'admin'
    });
    console.log('✅ JWT Tokens 已保存');
  }

  // 同时保存到旧的存储位置以保持兼容性
  const session = {
    user,
    accessToken,
    refreshToken,
    expiresIn,
    loginTime: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
};

const readSession = () => {
  // 优先从 AuthManager 读取用户信息
  const user = AuthManager.getUserInfo();

  // 注意：这里不检查 token 是否过期，只检查是否存在
  // Token 的有效性检查应该在实际使用时进行（API 调用时）
  const accessToken = localStorage.getItem('admin_access_token');

  if (user && accessToken) {
    console.log('✅ 从 AuthManager 读取会话信息');
    return {
      user,
      accessToken,
      loginTime: new Date().toISOString()
    };
  }

  // 回退到旧的存储方式
  const raw = localStorage.getItem(AUTH_KEY) || localStorage.getItem("temp-admin-auth");
  if (!raw) {
    console.warn('⚠️ 未找到会话信息');
    return null;
  }

  try {
    console.log('✅ 从旧存储读取会话信息');
    return JSON.parse(raw);
  } catch (error) {
    console.warn("解析管理员会话失败", error);
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
};

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    const payload: LoginPayload = {
      email: String(email ?? ""),
      password: String(password ?? ""),
    };

    try {
      console.log('🔐 开始登录...');
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: LoginResponse = await response.json();
      console.log('📦 登录响应:', data);

      if (response.ok && data.success && data.user && data.accessToken && data.refreshToken) {
        // 保存 JWT tokens 和用户信息
        storeSession(data.user, data.accessToken, data.refreshToken, data.expiresIn || 900);
        console.log('✅ 登录成功，已保存认证信息');
        return {
          success: true,
          redirectTo: "/admin/dashboard",
        };
      }

      throw new Error(data.message || data.error?.message || "登录失败");
    } catch (error) {
      console.error('❌ 登录失败:', error);

      // 回退到临时认证
      const tempAuth = window.localStorage.getItem("temp-admin-auth");
      if (tempAuth) {
        return { success: true, redirectTo: "/admin/dashboard" };
      }

      return {
        success: false,
        error: {
          name: "LoginError",
          message: error instanceof Error ? error.message : "登录失败，请稍后重试",
          statusCode: 401,
        },
      };
    }
  },

  logout: async () => {
    console.log('🚪 退出登录');
    AuthManager.clearTokens();
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem("temp-admin-auth");
    return {
      success: true,
      redirectTo: "/admin/login",
    };
  },

  check: async () => {
    const session = readSession();
    if (session?.user?.email) {
      return { authenticated: true };
    }
    return {
      authenticated: false,
      redirectTo: "/admin/login",
    };
  },

  getPermissions: async () => {
    const session = readSession();
    return session?.user?.role ? [session.user.role] : [];
  },

  getIdentity: async () => {
    const session = readSession();
    if (!session?.user) return null;
    return {
      id: session.user.id,
      name: session.user.name || session.user.email,
      email: session.user.email,
      avatar: session.user.avatar,
    };
  },

  onError: async (error) => {
    console.error("Auth provider error", error);
    return { logout: false };
  },
};
