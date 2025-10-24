// 修复版本 - 移除Node.js依赖，使用fetch API
// 获取页面内容
export async function getPageContents(pageKey?: string): Promise<any[]> {
  try {
    // 构建查询URL
    let url = '/api/content';
    if (pageKey) {
      url += `?page=${encodeURIComponent(pageKey)}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取页面内容失败:', error);
    throw error;
  }
}