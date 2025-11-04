# Token 获取流程问题分析

## 问题描述
图片上传时提示："未登录或登录已过期，请重新登录后再试"

## 代码流程分析

### 1. 上传流程
```
ImageUpload.tsx 
  -> uploadService.uploadWithRetry()
    -> uploadToCloudflare()
      -> CloudflareWorkerUpload.uploadToWorker()
        -> fetchWithAuthRetry()
          -> getAuthToken()  // ⚠️ 问题可能在这里
            -> AuthManager.getValidAccessToken()
```

### 2. getAuthToken() 逻辑分析

**当前逻辑**：
1. 调用 `AuthManager.getValidAccessToken()`
   - 如果返回 null，尝试刷新
   - 如果刷新成功，再次获取
2. 如果还是 null，回退到直接从 localStorage 读取
   - 检查 `admin_access_token`
   - 检查 `admin-auth`
   - 检查 `temp-admin-auth`
3. 如果所有方式都失败，抛出错误

**潜在问题**：
- `isTokenValid()` 只检查格式，不检查过期
- 如果直接从 localStorage 读取的 token 已过期，会被使用
- 导致后端返回 401

### 3. AuthManager.getValidAccessToken() 逻辑

**当前逻辑**：
1. 调用 `getAccessToken()`
   - 检查 token 是否存在
   - 检查 token 是否过期（`now >= expiry`）
   - 如果过期，返回 null
2. 如果返回 null，尝试刷新
3. 返回 token 或 null

**潜在问题**：
- Token 过期检查可能有问题
- 刷新逻辑可能失败

## 问题根源假设

### 假设1：Token 过期但格式有效
- `AuthManager.getAccessToken()` 返回 null（因为过期）
- `getAuthToken()` 回退到直接从 localStorage 读取
- `isTokenValid()` 返回 true（格式正确，但不检查过期）
- 使用过期的 token，后端返回 401

### 假设2：Token 刷新失败
- Token 过期
- 刷新请求失败
- 所有方式都失败
- 抛出错误

### 假设3：Token 格式问题
- Token 存在但不是 JWT 格式
- `isTokenValid()` 返回 false
- 所有方式都失败
- 抛出错误

## 修复方案

### 方案1：改进 getAuthToken() 逻辑
- 如果 AuthManager 返回 null，不要回退到过期的 token
- 应该先尝试刷新，如果刷新失败，直接抛出错误

### 方案2：改进 isTokenValid() 逻辑
- 即使从 localStorage 直接读取，也应该检查过期
- 或者不要直接从 localStorage 读取，只使用 AuthManager

### 方案3：添加更详细的错误信息
- 记录为什么 token 获取失败
- 记录 token 的状态（存在、过期、格式错误等）



