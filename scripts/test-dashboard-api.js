#!/usr/bin/env node

/**
 * 仪表板API测试脚本
 * 用于验证新添加的仪表板API端点是否正常工作
 */

const { getApiUrl, getAuthHeaders } = require('../dist-backend/lib/config.js');

// 测试配置
const BASE_URL = 'http://localhost:5173';
const TEST_TOKEN = 'admin-token'; // 测试用的认证令牌

async function testDashboardAPI() {
  console.log('🚀 开始测试仪表板API...\n');

  try {
    // 测试统计API
    console.log('📊 测试仪表板统计API...');
    const statsResponse = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ 统计API测试成功');
      console.log('📈 统计数据:', {
        totalProducts: statsData.data?.totalProducts || 0,
        totalContacts: statsData.data?.totalContacts || 0,
        unreadContacts: statsData.data?.unreadContacts || 0,
        activeProducts: statsData.data?.activeProducts || 0
      });
    } else {
      console.log('❌ 统计API测试失败:', statsResponse.status, statsResponse.statusText);
    }

    // 测试活动API
    console.log('\n📋 测试仪表板活动API...');
    const activitiesResponse = await fetch(`${BASE_URL}/api/admin/dashboard/activities?limit=5`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });

    if (activitiesResponse.ok) {
      const activitiesData = await activitiesResponse.json();
      console.log('✅ 活动API测试成功');
      console.log('📝 活动数量:', activitiesData.data?.length || 0);
      if (activitiesData.data && activitiesData.data.length > 0) {
        console.log('📋 最近活动示例:', activitiesData.data[0]);
      }
    } else {
      console.log('❌ 活动API测试失败:', activitiesResponse.status, activitiesResponse.statusText);
    }

    // 测试健康检查API
    console.log('\n🏥 测试系统健康API...');
    const healthResponse = await fetch(`${BASE_URL}/api/admin/dashboard/health`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ 健康检查API测试成功');
      console.log('💾 数据库状态:', healthData.data?.database?.status);
      console.log('💿 存储状态:', healthData.data?.storage?.status);
    } else {
      console.log('❌ 健康检查API测试失败:', healthResponse.status, healthResponse.statusText);
    }

    console.log('\n🎉 仪表板API测试完成！');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
    console.log('💡 提示: 请确保开发服务器正在运行 (npm run dev)');
  }
}

// 运行测试
testDashboardAPI();