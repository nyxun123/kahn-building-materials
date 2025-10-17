import { getPageContents } from '../../src/lib/api/content-api';

export async function onRequestGet({ request }) {
  try {
    const url = new URL(request.url);
    const pageKey = url.searchParams.get('page');
    
    // 获取内容数据
    const contents = await getPageContents(pageKey);
    
    return new Response(JSON.stringify(contents), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('获取内容数据错误:', error);
    return new Response(JSON.stringify({
      error: { message: '获取数据失败' }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}