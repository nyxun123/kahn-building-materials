// 简单的API路由测试脚本
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 测试API路由是否正常工作
    if (url.pathname === '/api/test') {
      return new Response(JSON.stringify({
        message: 'API路由测试成功',
        timestamp: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 默认响应
    return new Response('API测试服务器运行中', {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
};