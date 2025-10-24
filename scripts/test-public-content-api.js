/**
 * 测试公开内容API
 */

async function testPublicContentAPI() {
  console.log('🔍 测试公开内容API...');

  try {
    const baseUrl = 'https://kn-wallpaperglue.com';

    // 1. 测试首页内容API
    console.log('\n📡 测试首页内容API...');
    const homeResponse = await fetch(`${baseUrl}/api/content?page=home`);
    console.log('首页API状态:', homeResponse.status);

    if (homeResponse.ok) {
      const homeData = await homeResponse.json();
      console.log('首页内容数量:', homeData.length);

      if (homeData.length > 0) {
        console.log('首页内容示例:');
        homeData.slice(0, 3).forEach((item, index) => {
          console.log(`${index + 1}. ${item.section_key}: ${item.content_zh?.substring(0, 30)}...`);
        });
      }
    } else {
      console.log('首页API失败:', homeResponse.statusText);
    }

    // 2. 测试公司信息API
    console.log('\n📡 测试公司信息API...');
    const companyResponse = await fetch(`${baseUrl}/api/company/info`);
    console.log('公司API状态:', companyResponse.status);

    if (companyResponse.ok) {
      const companyData = await companyResponse.json();
      console.log('公司信息:', companyData);
    } else {
      console.log('公司API失败:', companyResponse.statusText);
    }

    console.log('\n✅ API测试完成!');

  } catch (error) {
    console.error('❌ API测试失败:', error.message);
  }
}

testPublicContentAPI();