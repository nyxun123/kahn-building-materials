// 修复版本 - 移除Node.js依赖，使用fetch API
// 获取页面内容
export async function getPageContents(pageKey?: string): Promise<any[]> {
  try {
    // 构建查询URL
    let url = '/api/content';
    if (pageKey) {
      url += `?page=${encodeURIComponent(pageKey)}`;
    }
    
    const response = await fetch(url, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    // 确保返回的是数组格式
    if (Array.isArray(data)) {
    return data;
    } else if (data && Array.isArray(data.data)) {
      return data.data;
    } else if (data && data.success && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('API返回格式异常，返回空数组:', data);
      return [];
    }
  } catch (error) {
    console.error('获取页面内容失败:', error);
    throw error;
  }
}