# Dashboard登录过期问题 - 深度排查报告

**排查时间**: 刚刚  
**问题**: 登录成功后跳转到dashboard，但立即显示"登录已过期"错误  
**状态**: 🔍 深入排查中

---

## 🔍 问题分析

### 可能的问题点

#### 问题1: migrateFromLegacyAuth() 可能清除了token ⚠️

**位置**: `src/lib/auth-manager.ts` 第306-320行

```typescript
static migrateFromLegacyAuth(): void {
  const oldAuth = localStorage.getItem('admin-auth');
  const tempAuth = localStorage.getItem('temp-admin-auth');
  
  if (oldAuth || tempAuth) {
    console.warn('⚠️ 检测到旧的认证方式，请重新登录以使用新的 JWT 认证');
    this.clearTokens(); // ⚠️ 这里会清除所有token！
  }
}

// 页面加载时检查并迁移旧的认证方式
if (typeof window !== 'undefined') {
  AuthManager.migrateFromLegacyAuth();
}
```

**问题**:
- 登录成功后，同时保存了 `admin-auth` (旧格式) 和 `admin_access_token` (新格式)
- 如果 `migrateFromLegacyAuth()` 在页面加载时执行，检测到 `admin-auth` 存在
- 会调用 `clearTokens()`，清除所有token！
- 导致dashboard无法获取token

#### 问题2: Token过期时间计算可能有问题

**检查点**:
- API返回: `expiresIn: 900` (15分钟，单位秒)
- 保存时: `expiresAt = Date.now() + (expiresIn * 1000)` = `Date.now() + 900000` = 当前时间 + 15分钟 ✅
- 读取时: `if (now >= expiry)` 检查是否过期 ✅

**可能的问题**:
- 如果浏览器时间不同步，可能导致过期时间计算错误
- 如果token保存和读取之间有延迟，可能导致问题

#### 问题3: Dashboard读取token的顺序

**当前逻辑**:
1. 先尝试 `AuthManager.getAccessToken()` (同步)
2. 如果失败，尝试 `AuthManager.getValidAccessToken()` (异步)
3. 如果都失败，直接从localStorage读取

**可能的问题**:
- 如果 `getAccessToken()` 返回null（因为过期检查），但token实际上还在localStorage中
- 应该先检查localStorage中是否有token，再进行过期检查

---

## 🔧 排查步骤

### 步骤1: 检查migrateFromLegacyAuth是否清除token

**需要验证**:
- 登录成功后，`admin-auth` 是否存在？
- 如果存在，`migrateFromLegacyAuth()` 是否会清除token？
- 清除后，dashboard是否能从localStorage读取到token？

### 步骤2: 检查token保存和读取时机

**需要验证**:
- Token保存的时机：登录成功后立即保存
- Token读取的时机：Dashboard加载时读取
- 两者之间是否有时间差？

### 步骤3: 检查过期时间计算

**需要验证**:
- `expiresIn` 的值是否正确（应该是900秒）
- `expiresAt` 的计算是否正确（`Date.now() + 900000`）
- 读取时的时间比较是否正确

---

## 🎯 修复方案

### 修复1: 修改migrateFromLegacyAuth逻辑

**问题**: 不应该在检测到旧格式时清除所有token，应该迁移数据

**修复**: 修改 `migrateFromLegacyAuth()` 方法，迁移数据而不是清除

### 修复2: 改进Dashboard token读取逻辑

**问题**: 应该先检查localStorage中是否有token，再进行过期检查

**修复**: 调整读取顺序，优先从localStorage读取，然后检查过期

### 修复3: 添加调试日志

**问题**: 缺少详细的调试信息

**修复**: 添加详细的调试日志，方便排查问题

---

## 📝 下一步

1. 检查 `migrateFromLegacyAuth()` 的逻辑
2. 修改token读取顺序
3. 添加详细的调试日志
4. 测试修复效果




































