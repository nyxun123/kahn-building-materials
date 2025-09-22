# Cloudflare Page Rules 配置指南

为了最大化网站性能，需要在 Cloudflare Dashboard 中配置以下规则：

## 1. 静态资源缓存规则

### 规则1：JS/CSS 长期缓存
- **URL模式**: `kn-wallpaperglue.com/js/*` 或 `kn-wallpaperglue.com/css/*`
- **设置**:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 year
  - Browser Cache TTL: 1 year
  - Always Online: On

### 规则2：图片资源缓存
- **URL模式**: `kn-wallpaperglue.com/images/*`
- **设置**:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 week
  - Browser Cache TTL: 1 day
  - Polish: Lossless
  - Mirage: On

### 规则3：字体文件缓存
- **URL模式**: `kn-wallpaperglue.com/fonts/*`
- **设置**:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 year
  - Browser Cache TTL: 1 year

## 2. 性能优化规则

### 规则4：主要HTML页面
- **URL模式**: `kn-wallpaperglue.com/*`
- **设置**:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 hour
  - Browser Cache TTL: 5 minutes
  - Minify: HTML, CSS, JS
  - Rocket Loader: On (小心使用，可能影响某些JS)
  - Auto Minify: On

### 规则5：API端点不缓存
- **URL模式**: `kn-wallpaperglue.com/api/*`
- **设置**:
  - Cache Level: Bypass

## 3. 其他建议的 Cloudflare 设置

### Speed 标签页中:
- Auto Minify: 启用 HTML, CSS, JS
- Brotli: 启用
- Rocket Loader: 谨慎启用（可能影响React应用）
- Polish: Lossless 或 Lossy（图片优化）
- Mirage: 启用（图片延迟加载）

### Caching 标签页中:
- Caching Level: Standard
- Browser Cache Expiration: 4 hours
- Always Online: On
- Development Mode: Off

### Network 标签页中:
- HTTP/2: 启用
- HTTP/3: 启用
- 0-RTT Connection Resumption: 启用
- IPv6 Compatibility: 启用
- WebSockets: 启用
- Pseudo IPv4: 启用

## 4. 实施顺序

1. 先配置静态资源缓存规则（规则1-3）
2. 然后配置HTML页面缓存（规则4）
3. 最后配置API不缓存规则（规则5）
4. 在Speed设置中启用压缩和优化选项

**注意**: Page Rules有数量限制，Pro账户有20个规则限制。根据需要调整优先级。