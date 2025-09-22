# 认证系统文档

## 概述

这是一个完整的后端认证系统，提供用户认证、权限管理和审计日志功能。系统包含以下核心组件：

## 核心组件

### 1. PasswordService - 密码服务
- 密码哈希和验证
- 密码强度检查
- 随机密码生成
- 密码策略验证

### 2. JWTService - JWT令牌服务  
- 访问令牌和刷新令牌生成
- 令牌验证和刷新
- 令牌解码和过期检查

### 3. UserService - 用户服务
- 用户注册和登录
- 用户管理和权限验证
- 会话管理

### 4. AuditLogService - 审计日志服务
- 安全事件记录
- 操作审计追踪
- 日志查询和统计

### 5. AuthMiddleware - 认证中间件
- JWT令牌验证
- 角色和权限检查
- 速率限制和安全头

## 快速开始

### 安装依赖

```bash
pnpm add jsonwebtoken @types/jsonwebtoken @types/express
```

### 基本用法

```typescript
import { AuthService, initializeAuth } from './auth';

// 初始化认证系统
initializeAuth();

// 用户注册
const registerResult = await AuthService.register({
  username: 'admin',
  email: 'admin@example.com',
  password: 'Admin123!',
  roles: ['admin'],
  permissions: ['users:manage', 'content:manage']
});

// 用户登录
const loginResult = await AuthService.login({
  identifier: 'admin',
  password: 'Admin123!'
});

// 验证令牌
const payload = AuthService.verifyAccessToken(loginResult.tokens.accessToken);

// 检查权限
const hasPermission = AuthService.hasPermission(userId, 'users:manage');
```

## API 参考

### AuthService

#### register(userData: RegisterData): Promise<RegisterResult>
用户注册

#### login(credentials: LoginCredentials): Promise<LoginResult>  
用户登录

#### verifyAccessToken(token: string): JWTPayload | null
验证访问令牌

#### hasPermission(userId: string, permission: string): boolean
检查用户权限

#### hasRole(userId: string, role: string): boolean  
检查用户角色

#### refreshToken(refreshToken: string): Promise<RefreshTokenResult>
刷新访问令牌

#### logout(userId: string, refreshToken?: string): void
用户注销

### 中间件使用

```typescript
import { authMiddleware } from './auth/middleware';
import express from 'express';

const app = express();

// 全局中间件
app.use(authMiddleware.corsMiddleware);
app.use(authMiddleware.securityHeaders);
app.use(authMiddleware.requestLogger);

// 需要认证的路由
app.get('/api/protected', 
  authMiddleware.authenticateToken,
  (req, res) => {
    res.json({ user: req.user });
  }
);

// 需要管理员权限的路由
app.get('/api/admin', 
  authMiddleware.authenticateToken,
  authMiddleware.requireAdmin,
  (req, res) => {
    res.json({ message: '管理员访问' });
  }
);
```

## 配置

### 环境变量

创建 `.env` 文件：

```env
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-super-secure-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

### 密码策略配置

默认密码策略：
- 最小长度：8个字符
- 必须包含大写字母
- 必须包含小写字母  
- 必须包含数字
- 必须包含特殊字符
- 最大尝试次数：5次
- 锁定时间：15分钟

## 安全特性

### 密码安全
- 使用scrypt算法进行密码哈希
- 防止计时攻击
- 密码强度验证

### 令牌安全
- JWT签名验证
- 访问令牌短期有效
- 刷新令牌机制
- 令牌撤销支持

### 审计日志
- 所有安全事件记录
- 用户操作追踪
- 异常检测和报警

### 防护措施
- 速率限制
- CORS保护
- 安全HTTP头
- 输入验证

## 数据库集成

当前版本使用内存存储，生产环境应集成数据库：

### 用户表结构建议
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  roles JSON NOT NULL,
  permissions JSON NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  failed_login_attempts INTEGER DEFAULT 0,
  lockout_until TIMESTAMP,
  last_login_at TIMESTAMP,
  password_changed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 刷新令牌表
```sql
CREATE TABLE refresh_tokens (
  token VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 审计日志表
```sql
CREATE TABLE audit_logs (
  id VARCHAR(255) PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  action VARCHAR(255) NOT NULL,
  user_id VARCHAR(255),
  username VARCHAR(255),
  description TEXT NOT NULL,
  details JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  severity VARCHAR(20) DEFAULT 'INFO'
);
```

## 错误处理

系统提供详细的错误信息和错误码：

```typescript
{
  success: false,
  error: '详细错误信息',
  code: '错误码',
  details: ['额外信息']
}
```

### 常见错误码
- `AUTH_TOKEN_REQUIRED`: 需要认证令牌
- `INVALID_TOKEN`: 无效或过期的令牌
- `USER_NOT_FOUND`: 用户不存在
- `INVALID_PASSWORD`: 密码错误
- `ACCOUNT_LOCKED`: 账户被锁定
- `PASSWORD_POLICY_VIOLATION`: 密码不符合策略

## 最佳实践

1. **生产环境密钥管理**
   - 使用环境变量存储密钥
   - 定期轮换JWT密钥
   - 不要将密钥提交到版本控制

2. **密码策略**
   - 启用强密码策略
   - 定期要求用户更改密码
   - 记录密码历史防止重用

3. **令牌管理**
   - 使用短期访问令牌
   - 实现令牌撤销功能
   - 监控异常令牌使用

4. **审计日志**
   - 保留足够时间的日志
   - 定期审查安全事件
   - 设置异常报警

## 扩展功能

### 多因素认证 (MFA)
```typescript
// 待实现：TOTP、短信验证、邮件验证等
```

### OAuth2 集成
```typescript  
// 待实现：Google、GitHub、微信等第三方登录
```

### 单点登录 (SSO)
```typescript
// 待实现：SAML、OIDC协议支持
```

## 故障排除

### 常见问题

1. **JWT密钥错误**
   - 检查环境变量设置
   - 确认密钥格式正确

2. **密码验证失败**
   - 检查密码哈希算法
   - 验证密码策略配置

3. **性能问题**
   - 调整scrypt参数
   - 使用数据库索引

## 许可证

MIT License

## 支持

如有问题请提交Issue或联系开发团队。