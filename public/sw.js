/**
 * Service Worker for Progressive Web App
 * 实现资源缓存和离线支持
 */

const CACHE_NAME = 'wallpaper-glue-v1.0.1';
const STATIC_CACHE = 'static-resources-v1';
const DYNAMIC_CACHE = 'dynamic-resources-v1';
const API_CACHE = 'api-responses-v1';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // CSS和JS文件将在构建时动态添加
];

// 需要缓存的API路径模式
const API_PATTERNS = [
  /^\/api\/products/,
  /^\/api\/content/,
  /^\/api\/company/
];

// 图片资源模式
const IMAGE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
  /\/images\//,
  /\/uploads\//
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker 安装中...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📋 缓存静态资源...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker 安装完成');
        // 强制激活新的 Service Worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker 安装失败:', error);
      })
  );
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker 激活中...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // 删除旧版本的缓存
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('🗑️ 删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker 激活完成');
        // 立即控制所有页面
        return self.clients.claim();
      })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }
  
  // API 请求策略
  if (isApiRequest(request)) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // 图片资源策略
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
    return;
  }
  
  // 静态资源策略
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }
  
  // 导航请求策略（HTML页面）
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // 默认策略：网络优先
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// 判断是否为 API 请求
function isApiRequest(request) {
  const url = new URL(request.url);
  return API_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// 判断是否为图片请求
function isImageRequest(request) {
  const url = new URL(request.url);
  return IMAGE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// 判断是否为静态资源
function isStaticAsset(request) {
  const url = new URL(request.url);
  return /\.(js|css|woff2?|ttf|eot)$/.test(url.pathname) ||
         url.pathname.startsWith('/assets/') ||
         url.pathname.startsWith('/js/') ||
         url.pathname.startsWith('/css/');
}

// 处理 API 请求 - 网络优先，缓存备用
async function handleApiRequest(request) {
  const cacheName = API_CACHE;
  
  // 检查是否是带时间戳的请求（用于绕过缓存）
  const url = new URL(request.url);
  if (url.searchParams.has('_t')) {
    console.log('🔄 检测到时间戳参数，直接发起网络请求:', request.url);
    try {
      const networkResponse = await fetch(request);
      return networkResponse;
    } catch (error) {
      console.error('❌ 网络请求失败:', error);
      throw error;
    }
  }
  
  try {
    // 尝试网络请求
    const networkResponse = await fetch(request);
    
    // 只缓存成功的GET请求
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(cacheName);
      // 克隆响应用于缓存
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // 网络失败时，尝试从缓存获取
    console.log('🌐 API网络请求失败，尝试从缓存获取:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 如果是产品列表API，返回离线数据
    if (request.url.includes('/api/products')) {
      return new Response(JSON.stringify({
        success: true,
        data: [],
        message: '离线模式 - 数据不可用'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

// 处理图片请求 - 缓存优先
async function handleImageRequest(request) {
  const cacheName = DYNAMIC_CACHE;
  
  // 先检查缓存
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // 从网络获取
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // 缓存图片
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // 返回占位图片
    return new Response(
      createPlaceholderSVG(),
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// 处理静态资源 - 缓存优先
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// 处理导航请求 - 网络优先，离线时返回缓存的 index.html
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // 离线时返回缓存的首页
    const cachedResponse = await caches.match('/index.html');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 如果没有缓存，返回离线页面
    return new Response(createOfflinePage(), {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// 创建占位 SVG
function createPlaceholderSVG() {
  return `
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" 
            fill="#9ca3af" text-anchor="middle" dy=".3em">图片加载中...</text>
    </svg>
  `;
}

// 创建离线页面
function createOfflinePage() {
  return `
    <!DOCTYPE html>
    <html lang="zh">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>离线模式 - 胶粉产品</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
        }
        .container {
          max-width: 500px;
          padding: 2rem;
        }
        .icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        p {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 2rem;
        }
        .retry-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 2rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .retry-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📱</div>
        <h1>当前处于离线模式</h1>
        <p>
          网络连接不可用，但您仍可以浏览已缓存的内容。
          <br>
          请检查网络连接后重试。
        </p>
        <button class="retry-btn" onclick="window.location.reload()">
          重新连接
        </button>
      </div>
    </body>
    </html>
  `;
}

// 监听消息事件（用于与主线程通信）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    // 缓存指定的 URLs
    const urls = event.data.urls;
    caches.open(DYNAMIC_CACHE)
      .then((cache) => cache.addAll(urls))
      .then(() => {
        self.postMessage({ type: 'CACHE_COMPLETE' });
      });
  }
});

// 定期清理缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    cleanupOldCaches()
  );
});

async function cleanupOldCaches() {
  const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];
  const cacheNames = await caches.keys();
  
  return Promise.all(
    cacheNames.map((cacheName) => {
      if (!cacheWhitelist.includes(cacheName)) {
        console.log('🗑️ 清理旧缓存:', cacheName);
        return caches.delete(cacheName);
      }
    })
  );
}

console.log('🔧 Service Worker 脚本加载完成');