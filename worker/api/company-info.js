/**
 * 公司信息管理API
 * 提供公司信息、联系信息、关于我们等内容的CRUD操作
 */

import { getApiUrl } from '../lib/config.js';

// 获取公司信息
export async function getCompanyInfo(section, language = 'zh') {
    try {
        const response = await fetch(getApiUrl(`/api/company/info/${section}?lang=${language}`));
        if (!response.ok) throw new Error('Failed to fetch company info');
        const data = await response.json();
        return data.success ? data.data : {};
    } catch (error) {
        console.error('Error fetching company info:', error);
        return {};
    }
}

// 获取公司内容
export async function getCompanyContent(type, language = 'zh') {
    try {
        const response = await fetch(getApiUrl(`/api/company/content/${type}?lang=${language}`));
        if (!response.ok) throw new Error('Failed to fetch company content');
        const data = await response.json();
        return data.success ? data.data : {};
    } catch (error) {
        console.error('Error fetching company content:', error);
        return {};
    }
}

// 获取所有公司信息（管理员用）
export async function getAllCompanyInfo() {
    try {
        const response = await fetch(getApiUrl('/api/admin/company/info'));
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
        const response = await fetch(getApiUrl('/api/admin/company/content'));
        if (!response.ok) throw new Error('Failed to fetch all company content');
        const data = await response.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error('Error fetching all company content:', error);
        return [];
    }
}

// 创建公司信息
export async function createCompanyInfo(infoData) {
    try {
        const response = await fetch(getApiUrl('/api/admin/company/info'), {
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
        return { success: false, message: error.message };
    }
}

// 更新公司信息
export async function updateCompanyInfo(id, infoData) {
    try {
        const response = await fetch(getApiUrl(`/api/admin/company/info/${id}`), {
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
        return { success: false, message: error.message };
    }
}

// 删除公司信息
export async function deleteCompanyInfo(id) {
    try {
        const response = await fetch(getApiUrl(`/api/admin/company/info/${id}`), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting company info:', error);
        return { success: false, message: error.message };
    }
}

// 创建公司内容
export async function createCompanyContent(contentData) {
    try {
        const response = await fetch(getApiUrl('/api/admin/company/content'), {
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
        return { success: false, message: error.message };
    }
}

// 更新公司内容
export async function updateCompanyContent(id, contentData) {
    try {
        const response = await fetch(getApiUrl(`/api/admin/company/content/${id}`), {
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
        return { success: false, message: error.message };
    }
}

// 删除公司内容
export async function deleteCompanyContent(id) {
    try {
        const response = await fetch(getApiUrl(`/api/admin/company/content/${id}`), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting company content:', error);
        return { success: false, message: error.message };
    }
}

// 批量获取公司信息（按语言分组）
export async function getCompanyInfoByLanguage(language = 'zh') {
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
export function arrayToObject(array, keyField = 'field_key', valueField = 'field_value') {
    return array.reduce((obj, item) => {
        obj[item[keyField]] = item[valueField];
        return obj;
    }, {});
}

// 工具函数：格式化公司信息
export function formatCompanyInfo(data) {
    const formatted = {};
    
    // 按section_type分组
    data.forEach(item => {
        if (!formatted[item.section_type]) {
            formatted[item.section_type] = {};
        }
        formatted[item.section_type][item.field_key] = item.field_value;
    });
    
    return formatted;
}

// 工具函数：格式化公司内容
export function formatCompanyContent(data) {
    const formatted = {};
    
    // 按content_type分组
    data.forEach(item => {
        if (!formatted[item.content_type]) {
            formatted[item.content_type] = {};
        }
        formatted[item.content_type][item.content_key] = item.content_value;
    });
    
    return formatted;
}