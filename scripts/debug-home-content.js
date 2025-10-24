/**
 * 调试首页内容API响应
 */

async function debugHomeContent() {
  console.log('🔍 调试首页内容API...');

  try {
    const baseUrl = 'https://kn-wallpaperglue.com';
    const authToken = 'admin-token';

    // 1. 检查管理API响应
    console.log('\n📡 检查管理API响应...');
    const adminResponse = await fetch(`${baseUrl}/api/admin/home-content`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('管理API状态:', adminResponse.status);
    const adminData = await adminResponse.json();
    console.log('管理API响应结构:', {
      success: adminData.success,
      dataType: typeof adminData.data,
      dataLength: adminData.data?.length,
      firstItem: adminData.data?.[0] ? {
        id: adminData.data[0].id,
        section_key: adminData.data[0].section_key,
        content_zh: adminData.data[0].content_zh?.substring(0, 50) + '...'
      } : null
    });

    // 2. 检查公开API响应
    console.log('\n📡 检查公开API响应...');
    const publicResponse = await fetch(`${baseUrl}/api/content/home`);
    const publicData = await publicResponse.json();
    console.log('公开API响应:', publicData);

    // 3. 测试单个内容项
    if (adminData.data && adminData.data.length > 0) {
      const firstItem = adminData.data[0];
      console.log('\n📋 测试第一个内容项详情:');
      console.log('ID:', firstItem.id);
      console.log('板块:', firstItem.section_key);
      console.log('中文内容:', firstItem.content_zh);
      console.log('英文内容:', firstItem.content_en);
      console.log('俄文内容:', firstItem.content_ru);
      console.log('内容类型:', firstItem.content_type);
    }

    // 4. 检查特定section_key的内容
    console.log('\n🔍 检查演示视频相关内容...');
    const videoContent = adminData.data?.filter(item =>
      item.section_key.includes('video')
    ) || [];

    console.log(`找到 ${videoContent.length} 个视频相关内容:`);
    videoContent.forEach((item, index) => {
      console.log(`${index + 1}. ${item.section_key}: ${item.content_zh?.substring(0, 30)}...`);
    });

    // 5. 模拟前端查询
    console.log('\n🎭 模拟前端查询...');
    const frontendQuery = adminData.data?.filter(item =>
      item.section_key.startsWith('video_')
    ) || [];

    console.log(`前端演示视频板块应显示 ${frontendQuery.length} 个内容项`);
    frontendQuery.forEach(item => {
      const fieldKey = item.section_key.replace('video_', '');
      console.log(`  - ${fieldKey}: ${item.content_zh?.substring(0, 30)}...`);
    });

    console.log('\n✅ 调试完成!');

  } catch (error) {
    console.error('❌ 调试失败:', error.message);
  }
}

debugHomeContent();