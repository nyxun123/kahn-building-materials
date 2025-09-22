# 认证系统 API 文档

## 概述

本认证系统提供完整的用户认证和授权功能，包括用户注册、登录、令牌管理、权限验证和安全审计。

## 快速开始

### 初始化认证系统

```typescript
import { initializeAuth, AuthService } from '../lib/auth';

// 初始化认证系统（可选的配置参数）
const config = initializeAuth({
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d'
});
```

### 基本使用示例

```typescript
// 用户注册
const registerResult = await AuthService.register({
  username: 'testuser',
  email: 'test@example.com',
  password: 'Test123!',
  roles: ['user'],
  permissions: ['content:read']
});

// 用户登录
const loginResult = await AuthService.login({
  identifier: 'testuser', // 支持用户名或邮箱
  password: 'Test123!'
});

// 验证访问令牌
const payload = AuthService.verifyAccessToken(accessToken);

// 刷新令牌
const refreshResult = await AuthService.refreshToken(refreshToken);

// 修改密码
const changeResult = await AuthService.changePassword(
  userId, 
  oldPassword, 
  newPassword
);

// 用户注销
AuthService.logout(userId, refreshToken);
```

## API 参考

### AuthService 类

#### register(userData: RegisterData): Promise<RegisterResult>
用户注册接口

**参数:**
- `userData`: 用户注册数据
  - `username`: string - 用户名
  - `email`: string - 邮箱
  - `password`: string - 密码
  - `roles?`: string[] - 角色数组
  - `permissions?`: string[] - 权限数组

**返回:**
- `success`: boolean - 是否成功
- `user?`: SanitizedUser - 用户信息（成功时）
- `error?`: string - 错误信息（失败时）
- `code?`: string - 错误代码

#### login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string): Promise<LoginResult>
用户登录接口

**参数:**
- `credentials`: 登录凭据
  - `identifier`: string - 用户名或邮箱
  - `password`: string - 密码
- `ipAddress?`: string - 用户IP地址（用于审计）
- `userAgent?`: string - 用户代理（用于审计）

**返回:**
- `success`: boolean - 是否成功
- `tokens?`: TokenPair - 令牌对（成功时）
- `user?`: SanitizedUser - 用户信息（成功时）
- `error?`: string - 错误信息（失败时）
- `code?`: string - 错误代码

#### verifyAccessToken(token: string): JWTPayload | null
验证访问令牌

**参数:**
- `token`: string - JWT访问令牌

**返回:** JWTPayload 或 null（验证失败时）

#### refreshToken(refreshToken: string): Promise<RefreshTokenResult>
刷新访问令牌

**参数:**
- `refreshToken`: string - 刷新令牌

**返回:** 新的令牌对或错误信息

#### changePassword(userId: string, oldPassword: string, newPassword: string): Promise<ChangePasswordResult>
修改用户密码

**参数:**
- `userId`: string - 用户ID
- `oldPassword`: string - 旧密码
- `newPassword`: string - 新密码

#### logout(userId: string, refreshToken?: string, ipAddress?: string): void
用户注销

**参数:**
- `userId`: string - 用户ID
- `refreshToken?`: string - 特定的刷新令牌（可选）
- `ipAddress?`: string - 用户IP地址（用于审计）

#### hasPermission(userId: string, permission: string): boolean
验证用户权限

#### hasRole(userId: string, role: string): boolean
验证用户角色

#### getUserById(userId: string): SanitizedUser | null
获取用户信息

#### checkPasswordStrength(password: string): PasswordStrengthResult
检查密码强度

#### getAuditStats(): AuditLogStats
获取审计日志统计

#### queryAuditLogs(options: AuditLogQueryOptions): AuditLogEntry[]
查询审计日志

## 中间件

### 认证中间件

```typescript
import { authMiddleware } from '../lib/auth/middleware';

// 必需认证令牌
app.use('/api/protected', authMiddleware.authenticateToken);

// 可选认证（有用户信息时使用）
app.use('/api/public', authMiddleware.optionalAuth);

// 需要管理员角色
app.use('/api/admin', authMiddleware.requireAdmin);

// 需要特定权限
app.use('/api/content', 
  authMiddleware.authenticateToken,
  authMiddleware.requirePermission(['content:manage'])
);

// 速率限制（防止暴力破解）
app.use('/api/login', 
  authMiddleware.rateLimit(5, 15 * 60 * 1000) // 5次尝试/15分钟
);
```

### 可用中间件

- `authenticateToken`: 验证JWT访问令牌
- `requireRole(roles)`: 需要特定角色
- `requirePermission(permissions)`: 需要特定权限
- `optionalAuth`: 可选认证
- `requireAdmin`: 需要管理员角色
- `requireSuperAdmin`: 需要超级管理员角色
- `rateLimit(maxAttempts, windowMs)`: 速率限制
- `corsMiddleware`: CORS处理
- `requestLogger`: 请求日志
- `errorHandler`: 错误处理
- `securityHeaders`: 安全头设置

## 数据类型

### JWTPayload
```typescript
interface JWTPayload {
  userId: string;
  username: string;
  roles: string[];
  permissions: string[];
  iat?: number;
  exp?: number;
}
```

### TokenPair
```typescript
interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // 秒数
}
```

### RegisterData
```typescript
interface RegisterData {
  username: string;
  email: string;
  password: string;
  roles?: string[];
  permissions?: string[];
}
```

### LoginCredentials
```typescript
interface LoginCredentials {
  identifier: string; // 用户名或邮箱
  password: string;
}
```

## 错误代码

| 错误代码 | 描述 | HTTP状态码 |
|---------|------|-----------|
| `USERNAME_EXISTS` | 用户名已存在 | 400 |
| `EMAIL_EXISTS` | 邮箱已存在 | 400 |
| `PASSWORD_POLICY_VIOLATION` | 密码不符合策略 | 400 |
| `USER_NOT_FOUND` | 用户不存在 | 404 |
| `INVALID_PASSWORD` | 密码错误 | 401 |
| `ACCOUNT_LOCKED` | 账户被锁定 | 423 |
| `INVALID_TOKEN` | 无效令牌 | 403 |
| `INVALID_REFRESH_TOKEN` | 无效刷新令牌 | 403 |
| `INVALID_OLD_PASSWORD` | 旧密码错误 | 401 |
| `AUTH_TOKEN_REQUIRED` | 需要认证令牌 | 401 |
| `INSUFFICIENT_ROLE` | 权限不足（角色） | 403 |
| `INSUFFICIENT_PERMISSION` | 权限不足（权限） | 403 |
| `RATE_LIMIT_EXCEEDED` | 请求过于频繁 | 429 |

## 安全特性

### 密码安全
- 使用scrypt算法进行密码哈希
- 密码强度验证（长度、大小写、数字、特殊字符）
- 密码策略强制执行
- 密码历史记录防止重复使用

### 令牌安全
- JWT签名验证
- 访问令牌短期有效（15分钟）
- 刷新令牌长期有效（7天）
- 令牌刷新时旧令牌失效

### 账户保护
- 登录失败次数限制（5次）
- 账户锁定机制（15分钟）
- 会话管理（注销时令牌失效）

### 审计日志
- 所有认证事件记录
- 安全警告和错误记录
- 操作追踪和查询功能

## 环境配置

创建 `.env` 文件进行生产环境配置：

```env
# JWT配置
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# 密码策略（可选，使用默认值）
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBER=true
PASSWORD_REQUIRE_SPECIAL_CHAR=true
PASSWORD_MAX_AGE_DAYS=90
PASSWORD_HISTORY_SIZE=5
PASSWORD_MAX_ATTEMPTS=5
PASSWORD_LOCKOUT_TIME=15

# 令牌有效期（可选）
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

## 部署说明

1. **设置环境变量**: 配置生产环境的JWT密钥
2. **数据库配置**: 确保数据库连接正确配置
3. **HTTPS启用**: 生产环境必须使用HTTPS
4. **密钥轮换**: 定期更换JWT密钥
5. **监控设置**: 设置审计日志监控和告警

## 故障排除

### 常见问题

1. **令牌验证失败**: 检查JWT_SECRET环境变量
2. **密码验证失败**: 确认密码策略配置
3. **数据库连接失败**: 检查数据库配置
4. **性能问题**: 调整密码哈希的工作因子

### 调试模式

启用调试日志：
```typescript
// 设置调试模式
process.env.DEBUG_AUTH = 'true';

// 查看详细日志输出
```

## 版本历史

- v1.0.0 (2025-09-09): 初始版本发布
  - 完整的认证系统实现
  - JWT令牌管理
  - 密码哈希和安全策略
  - 审计日志系统
  - Express中间件支持