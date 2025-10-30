# Token过期问题修复总结

## 问题描述

用户登录后立即提示"Token已过期"或"登录已过期"，无法正常使用管理后台。

## 根本原因

### 1. Token未正确保存
**问题**: `auth-provider.ts` 在登录成功后没有保存JWT Token（accessToken和refreshToken）
```typescript
// 旧代码 - 只保存了用户信息，没有保存Token
storeSession(data.user);
```

**影响**: 前端无法获取有效的JWT Token来访问后端API

### 2. 使用了错误的Token格式
**问题**: `data-provider.ts` 使用的是旧的token格式，而不是JWT Token
```typescript
// 旧代码 - 使用错误的token字段
return parsed?.token ? { Authorization: `Bearer ${parsed.token}` } : {};
```

**影响**: 即使保存了Token，也无法正确发送给后端

### 3. 没有Token刷新机制
**问题**: 前端没有使用 `AuthManager` 来自动刷新即将过期的Token

**影响**: Token过期后无法自动续期，用户需要重新登录

### 4. Dashboard页面使用旧的Token获取方式
**问题**: Dashboard页面直接从localStorage读取Token，没有使用AuthManager

**影响**: 无法获取有效的Token，导致"未登录或登录已过期"错误

## 修复方案

### 1. 修改 auth-provider.ts

#### 导入 AuthManager
```typescript
import { AuthManager } from "@/lib/auth-manager";
```

#### 修改 storeSession 函数
```typescript
const storeSession = (user, accessToken, refreshToken, expiresIn) => {
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
```

#### 修改 login 函数
```typescript
login: async ({ email, password }) => {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok && data.success && data.user && data.accessToken && data.refreshToken) {
    // 保存 JWT tokens 和用户信息
    storeSession(data.user, data.accessToken, data.refreshToken, data.expiresIn || 900);
    return {
      success: true,
      redirectTo: "/admin/dashboard",
    };
  }
  
  throw new Error(data.message || "登录失败");
}
```

#### 修改 logout 函数
```typescript
logout: async () => {
  AuthManager.clearTokens();
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem("temp-admin-auth");
  return {
    success: true,
    redirectTo: "/admin/login",
  };
}
```

### 2. 修改 data-provider.ts

#### 导入 AuthManager
```typescript
import { AuthManager } from "@/lib/auth-manager";
```

#### 修改 getAuthHeader 函数
```typescript
const getAuthHeader = async () => {
  if (typeof window === "undefined") return {};
  
  try {
    // 优先使用 AuthManager 获取有效的 JWT Token
    const token = await AuthManager.getValidAccessToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    
    // 回退到旧的认证方式
    const adminAuth = localStorage.getItem("admin-auth");
    if (adminAuth) {
      const parsed = JSON.parse(adminAuth);
      if (parsed?.accessToken) {
        return { Authorization: `Bearer ${parsed.accessToken}` };
      }
    }
  } catch (error) {
    console.warn("读取本地认证信息失败", error);
  }
  
  return {};
};
```

#### 更新所有API调用
```typescript
// 所有API调用都需要使用 await getAuthHeader()
const headers = {
  "Content-Type": "application/json",
  ...(await getAuthHeader()),
};
```

### 3. 修改 dashboard.tsx

#### 使用 AuthManager 获取Token
```typescript
const fetchDashboard = async () => {
  // 使用 AuthManager 获取有效的 JWT token
  const { AuthManager } = await import("@/lib/auth-manager");
  const token = await AuthManager.getValidAccessToken();

  if (!token) {
    throw new Error("未登录或登录已过期，请重新登录");
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  const response = await fetch("/api/admin/dashboard/stats", { headers });

  if (!response.ok) {
    if (response.status === 401) {
      AuthManager.clearTokens();
      throw new Error("登录已过期，请重新登录");
    }
    throw new Error("仪表盘数据获取失败");
  }

  const payload = await response.json();
  return payload.data;
};
```

## AuthManager 工作原理

### Token存储
```typescript
// 保存Token时计算过期时间
const expiresAt = Date.now() + (expiresIn * 1000);
localStorage.setItem('admin_access_token', accessToken);
localStorage.setItem('admin_refresh_token', refreshToken);
localStorage.setItem('admin_token_expiry', expiresAt.toString());
```

### Token验证
```typescript
// 获取Token时检查是否过期
const expiry = parseInt(expiryStr);
const now = Date.now();

// 提前1分钟刷新Token
if (now >= expiry - 60000) {
  return null; // 触发刷新
}

return token;
```

### 自动刷新
```typescript
// 获取有效Token时自动刷新
static async getValidAccessToken() {
  let token = this.getAccessToken();
  
  // 如果Token不存在或即将过期，自动刷新
  if (!token) {
    const refreshed = await this.refreshToken();
    if (refreshed) {
      token = this.getAccessToken();
    }
  }
  
  return token;
}
```

## 测试步骤

### 1. 清除旧的认证信息
打开浏览器控制台，执行：
```javascript
localStorage.clear();
```

### 2. 重新登录
访问 https://kn-wallpaperglue.com/admin/login
使用任一管理员账户登录

### 3. 检查Token存储
打开浏览器控制台，执行：
```javascript
// 检查Token是否正确保存
console.log('Access Token:', localStorage.getItem('admin_access_token'));
console.log('Refresh Token:', localStorage.getItem('admin_refresh_token'));
console.log('Token Expiry:', new Date(parseInt(localStorage.getItem('admin_token_expiry'))));
console.log('User Info:', localStorage.getItem('admin_user_info'));
```

### 4. 验证Dashboard加载
登录后应该能够正常看到Dashboard数据，不会提示"未登录或登录已过期"

### 5. 测试Token刷新
等待14分钟（Token有效期15分钟，提前1分钟刷新），然后刷新页面或访问其他页面，应该能够自动刷新Token而不需要重新登录

## 技术细节

### JWT Token配置
- **Access Token有效期**: 15分钟（900秒）
- **Refresh Token有效期**: 7天（604800秒）
- **刷新缓冲时间**: 提前1分钟刷新

### Token格式
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "1",
    "id": 1,
    "email": "niexianlei0@gmail.com",
    "name": "系统管理员",
    "role": "admin",
    "iss": "kn-wallpaperglue.com",
    "iat": 1761807618,
    "exp": 1761808518,
    "type": "access"
  }
}
```

### 存储位置
- `admin_access_token`: Access Token
- `admin_refresh_token`: Refresh Token
- `admin_token_expiry`: Token过期时间（毫秒时间戳）
- `admin_user_info`: 用户信息（JSON）
- `admin-auth`: 兼容旧版本的存储（包含所有信息）

## 部署信息

- **最新部署**: https://e4b88c08.kahn-building-materials.pages.dev
- **生产域名**: https://kn-wallpaperglue.com
- **登录接口**: POST /api/admin/login
- **刷新接口**: POST /api/admin/refresh-token

## 后续优化建议

1. **添加Token刷新失败处理**
   - 当刷新失败时，自动跳转到登录页
   - 显示友好的错误提示

2. **添加Token过期提醒**
   - 在Token即将过期时显示提示
   - 允许用户手动刷新Token

3. **优化错误处理**
   - 统一处理401错误
   - 自动清除无效Token

4. **添加安全日志**
   - 记录Token刷新事件
   - 记录登录/登出事件
   - 监控异常Token使用

## 常见问题

### Q: 为什么登录后还是提示过期？
A: 请清除浏览器缓存和localStorage，然后重新登录。

### Q: Token刷新失败怎么办？
A: 检查网络连接，确保refresh-token接口正常工作。如果持续失败，请重新登录。

### Q: 如何查看Token是否有效？
A: 打开浏览器控制台，执行：
```javascript
const expiry = parseInt(localStorage.getItem('admin_token_expiry'));
const now = Date.now();
console.log('Token有效:', now < expiry);
console.log('剩余时间（分钟）:', Math.floor((expiry - now) / 60000));
```

### Q: 为什么需要两个Token？
A: Access Token用于日常API访问，有效期短（15分钟）以提高安全性。Refresh Token用于获取新的Access Token，有效期长（7天）以提供便利性。

## 总结

通过使用 `AuthManager` 统一管理JWT Token，我们解决了以下问题：

✅ Token正确保存和读取
✅ 自动刷新即将过期的Token
✅ 统一的认证接口
✅ 更好的错误处理
✅ 支持UTF-8字符（中文用户名）

现在用户可以正常登录并使用管理后台，Token会在后台自动刷新，无需频繁重新登录。

