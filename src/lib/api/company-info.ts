/**
 * 公司信息API
 * 提供公司信息和内容的管理功能
 */

import { getApiUrl, API_CONFIG } from '@/lib/config';

// 获取公司信息
export async function getCompanyInfo(section: string, language: string = 'zh') {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.PATHS.COMPANY_INFO(section) + `?lang=${language}`));
    if (!response.ok) throw new Error('Failed to fetch company info');
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching company info:', error);
    return [];
  }
}

// 获取公司内容
export async function getCompanyContent(type: string, language: string = 'zh') {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.PATHS.COMPANY_CONTENT(type) + `?lang=${language}`));
    if (!response.ok) throw new Error('Failed to fetch company content');
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching company content:', error);
    return [];
  }
}

// 获取所有公司信息（管理员用）
export async function getAllCompanyInfo() {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.PATHS.ADMIN_COMPANY_INFO));
    if (!response.ok) throw new Error('Failed to fetch all company info');
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching all company info:', error);
    return [];
  }
}

// 获取所有公司内容（管理员用）
export async function getAllCompanyContent() {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.PATHS.ADMIN_COMPANY_CONTENT));
    if (!response.ok) throw new Error('Failed to fetch all company content');
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching all company content:', error);
    return [];
  }
}

// 创建公司信息
export async function createCompanyInfo(infoData: any) {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.PATHS.ADMIN_COMPANY_INFO), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(infoData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating company info:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to create company info' };
  }
}

// 更新公司信息
export async function updateCompanyInfo(id: number, infoData: any) {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.PATHS.ADMIN_COMPANY_INFO_ITEM(id)), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(infoData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating company info:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to update company info' };
  }
}

// 删除公司信息
export async function deleteCompanyInfo(id: number) {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.PATHS.ADMIN_COMPANY_INFO_ITEM(id)), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting company info:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to delete company info' };
  }
}

// 创建公司内容
export async function createCompanyContent(contentData: any) {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.PATHS.ADMIN_COMPANY_CONTENT), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(contentData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating company content:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to create company content' };
  }
}

// 更新公司内容
export async function updateCompanyContent(id: number, contentData: any) {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.PATHS.ADMIN_COMPANY_CONTENT_ITEM(id)), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(contentData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating company content:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to update company content' };
  }
}

// 删除公司内容
export async function deleteCompanyContent(id: number) {
  try {
    const response = await fetch(getApiUrl(API_CONFIG.PATHS.ADMIN_COMPANY_CONTENT_ITEM(id)), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting company content:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to delete company content' };
  }
}

// 批量获取公司信息（按语言分组）
export async function getCompanyInfoByLanguage(language: string = 'zh') {
  try {
    const [info, content] = await Promise.all([
      getCompanyInfo('all', language),
      getCompanyContent('all', language)
    ]);
    
    return {
      info: info || {},
      content: content || {}
    };
  } catch (error) {
    console.error('Error fetching company data by language:', error);
    return { info: {}, content: {} };
  }
}

// 工具函数：将数组转换为对象
export function arrayToObject(array: any[], keyField: string = 'field_key', valueField: string = 'field_value') {
  return array.reduce((obj: any, item: any) => {
    obj[item[keyField]] = item[valueField];
    return obj;
  }, {});
}

// 工具函数：格式化公司信息
export function formatCompanyInfo(data: any[]) {
  const formatted: any = {};
  
  // 按section_type分组
  data.forEach((item: any) => {
    if (!formatted[item.section_type]) {
      formatted[item.section_type] = {};
    }
    formatted[item.section_type][item.field_key] = item.field_value;
  });
  
  return formatted;
}

// 工具函数：格式化公司内容
export function formatCompanyContent(data: any[]) {
  const formatted: any = {};
  
  // 按content_type分组
  data.forEach((item: any) => {
    if (!formatted[item.content_type]) {
      formatted[item.content_type] = {};
    }
    formatted[item.content_type][item.content_key] = item.content_value;
  });
  
  return formatted;
}