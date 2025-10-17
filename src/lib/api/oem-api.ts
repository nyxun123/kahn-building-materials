// OEM内容API服务
import { getApiUrl, getAuthHeaders, getJsonAuthHeaders } from '../config';

export interface OEMService {
  id: number;
  title: string;
  description: string;
  features: string[];
  process: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  capabilities: string[];
  images: string[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  created_at: string;
  updated_at: string;
}

export interface OEMVersion {
  id: number;
  version: number;
  content: OEMService;
  created_at: string;
  created_by: string;
  action: 'created' | 'updated' | 'published';
}

/**
 * 获取OEM服务数据
 */
export async function getOEMService(): Promise<OEMService> {
  try {
    const response = await fetch(getApiUrl('/api/admin/oem'), {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`获取OEM数据失败: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error?.message || '获取OEM数据失败');
    }
    
    return result.data;
  } catch (error) {
    console.error('获取OEM数据失败:', error);
    throw error;
  }
}

/**
 * 更新OEM服务数据
 */
export async function updateOEMService(oemData: Partial<OEMService>): Promise<OEMService> {
  try {
    const response = await fetch(getApiUrl('/api/admin/oem'), {
      method: 'PUT',
      headers: getJsonAuthHeaders(),
      body: JSON.stringify(oemData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `更新OEM数据失败: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error?.message || '更新OEM数据失败');
    }
    
    return result.data;
  } catch (error) {
    console.error('更新OEM数据失败:', error);
    throw error;
  }
}

/**
 * 获取OEM内容用于前端展示
 */
export async function getOEMContentForFrontend(): Promise<any> {
  try {
    // 尝试从OEM API获取内容
    try {
      const oemData = await getOEMService();
      return {
        oem_title: oemData.title || '',
        oem_description: oemData.description || '',
        oem_features: oemData.features || [],
        oem_process: oemData.process || [],
        oem_capabilities: oemData.capabilities || [],
        oem_images: oemData.images || [],
        seo_title: oemData.seo_title || '',
        seo_description: oemData.seo_description || '',
        seo_keywords: oemData.seo_keywords || ''
      };
    } catch (oemError) {
      console.log('OEM API不可用，尝试从page_contents获取');
      // 如果OEM API不可用，回退到page_contents API
      const response = await fetch(getApiUrl('/api/content?page=oem'));
      if (!response.ok) {
        throw new Error('获取OEM内容失败');
      }
      
      const contentData = await response.json();
      const contentMap: Record<string, any> = {};
      
      contentData.forEach((item: any) => {
        contentMap[item.section_key] = item.content_zh || item.content_en || item.content_ru || '';
        // 如果是数组内容，尝试解析
        if (item.section_key.includes('features') || item.section_key.includes('capabilities') || item.section_key.includes('process') || item.section_key.includes('images')) {
          try {
            contentMap[item.section_key] = JSON.parse(item.content_zh) || item.content_zh.split('\n');
          } catch {
            contentMap[item.section_key] = item.content_zh.split('\n').filter((i: string) => i.trim());
          }
        }
      });
      
      return contentMap;
    }
  } catch (error) {
    console.error('获取OEM内容失败:', error);
    // 返回默认内容
    return {
      oem_title: 'OEM/ODM 墙纸胶定制服务',
      oem_description: '为品牌商和经销商提供专业的墙纸胶OEM/ODM定制服务，从配方研发到包装设计的一站式解决方案',
      oem_features: ['专业研发团队', '先进生产设备', '严格质量控制', '个性化包装'],
      oem_process: [
        { step: 1, title: '需求沟通', description: '详细了解客户需求' },
        { step: 2, title: '配方研发', description: '根据需求进行配方设计' }
      ],
      oem_capabilities: ['年产能10000吨', '10条自动化生产线'],
      oem_images: ['/images/oem1.jpg', '/images/oem2.jpg'],
      seo_title: 'OEM/ODM墙纸胶定制服务',
      seo_description: '提供专业的墙纸胶OEM/ODM定制服务',
      seo_keywords: '墙纸胶OEM,墙纸胶ODM'
    };
  }
}