import type { AuthBindings } from "@refinedev/core";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
  authType?: string;
  error?: { message?: string };
};

const AUTH_KEY = "admin-auth";

const storeSession = (user: LoginResponse["user"], token?: string) => {
  if (!user) return;
  const session = {
    user,
    token: token || `admin-${Date.now()}`,
    loginTime: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
};

const readSession = () => {
  const raw = localStorage.getItem(AUTH_KEY) || localStorage.getItem("temp-admin-auth");
  if (!raw) return null;
  try {
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
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: LoginResponse = await response.json();

      if (response.ok && data.user) {
        storeSession(data.user);
        return {
          success: true,
          redirectTo: "/admin/dashboard",
        };
      }

      throw new Error(data.error?.message || "登录失败");
    } catch (error) {
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
