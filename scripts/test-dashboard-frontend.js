/**
 * 测试仪表盘前端数据获取
 */

async function testDashboardFrontend() {
  console.log('🧪 测试仪表盘前端数据获取...');

  try {
    // 模拟前端API调用
    const response = await fetch('https://kn-wallpaperglue.com/api/admin/dashboard/stats', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-token'
      }
    });

    console.log('响应状态:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ 前端API调用成功，数据:', data);

      // 模拟TanStack Query缓存刷新
      console.log('\n🔄 模拟清除TanStack Query缓存...');
      console.log('建议在前端清除浏览器localStorage中的tanstack-query相关缓存');

      console.log('\n📊 数据验证结果:');
      console.log('- 总产品数:', data.data?.totalProducts);
      console.log('- 活跃产品:', data.data?.activeProducts);
      console.log('- 总联系消息:', data.data?.totalContacts);
      console.log('- 未读消息:', data.data?.unreadContacts);
      console.log('- 近7天活动:', data.data?.recentActivities);

      if (data.data?.totalProducts > 0) {
        console.log('\n✅ 仪表盘数据正常，前端应该能显示正确数据');
        console.log('💡 如果前端仍显示加载中，请:');
        console.log('   1. 清除浏览器缓存');
        console.log('   2. 清除localStorage中的tanstack-query缓存');
        console.log('   3. 或者使用硬刷新 (Ctrl+F5)');
      } else {
        console.log('\n❌ 数据验证失败，API返回的数据不正确');
      }

    } else {
      console.log('❌ 前端API调用失败:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('错误详情:', errorText);
    }

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testDashboardFrontend();