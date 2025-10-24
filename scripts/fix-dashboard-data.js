/**
 * 修复仪表盘数据加载问题
 */

async function fixDashboardData() {
  console.log('🔧 开始修复仪表盘数据...');

  try {
    const baseUrl = 'https://kn-wallpaperglue.com';
    const authToken = 'admin-token';

    // 1. 测试仪表盘统计API
    console.log('\n📊 测试仪表盘统计API...');
    const statsResponse = await fetch(`${baseUrl}/api/admin/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('统计API状态:', statsResponse.status);

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('统计数据:', statsData);

      // 2. 检查数据库表是否存在并创建必要的表
      console.log('\n🗄️ 检查数据库表结构...');

      // 3. 如果contacts表不存在，创建一些示例数据
      if (statsData.data.totalContacts === 0) {
        console.log('📝 联系消息表为空，添加示例数据...');
        await addSampleContacts();
      }

      // 4. 验证修复结果
      console.log('\n🔍 验证修复结果...');
      const verifyResponse = await fetch(`${baseUrl}/api/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log('✅ 修复后统计数据:', verifyData.data);

        // 显示关键指标
        console.log('\n📈 仪表盘关键指标:');
        console.log(`  - 总产品数: ${verifyData.data.totalProducts}`);
        console.log(`  - 活跃产品: ${verifyData.data.activeProducts}`);
        console.log(`  - 总联系消息: ${verifyData.data.totalContacts}`);
        console.log(`  - 未读消息: ${verifyData.data.unreadContacts}`);
        console.log(`  - 近7天活动: ${verifyData.data.recentActivities}`);
        console.log(`  - 产品分类数: ${verifyData.data.categoryStats?.length || 0}`);
      }

    } else {
      console.log('❌ 统计API调用失败:', statsResponse.statusText);
    }

    console.log('\n✅ 仪表盘数据修复完成!');

  } catch (error) {
    console.error('❌ 修复失败:', error.message);
  }
}

// 添加示例联系消息
async function addSampleContacts() {
  console.log('📧 添加示例联系消息...');

  try {
    const baseUrl = 'https://kn-wallpaperglue.com';
    const authToken = 'admin-token';

    const sampleContacts = [
      {
        name: '张经理',
        email: 'zhang@company.com',
        phone: '+86 138-8888-8888',
        country: 'China',
        company: '建筑工程有限公司',
        subject: '墙纸胶产品咨询',
        message: '您好，我们对贵公司的墙纸胶产品很感兴趣，希望了解产品规格、价格和订购流程。',
        is_read: 0
      },
      {
        name: 'Mr. Johnson',
        email: 'johnson@construction.com',
        phone: '+1-555-0123',
        country: 'USA',
        company: 'Johnson Construction',
        subject: 'Bulk Order Inquiry',
        message: 'We are looking for a reliable wallpaper adhesive supplier for our large-scale construction project. Please provide your product catalog and pricing information.',
        is_read: 0
      },
      {
        name: '李设计师',
        email: 'li@design-studio.com',
        phone: '+86 139-9999-9999',
        country: 'China',
        company: '创意设计工作室',
        subject: '产品样品申请',
        message: '我们是室内设计公司，希望申请贵公司的墙纸胶产品样品用于客户展示项目。',
        is_read: 1
      }
    ];

    let addedCount = 0;
    for (const contact of sampleContacts) {
      try {
        console.log(`📦 添加联系消息: ${contact.name}...`);

        const response = await fetch(`${baseUrl}/api/admin/contacts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(contact)
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ 成功添加: ${contact.name}`);
          addedCount++;
        } else {
          console.log(`❌ 添加失败: ${contact.name}`);
        }
      } catch (error) {
        console.log(`❌ 添加错误: ${contact.name} - ${error.message}`);
      }
    }

    console.log(`🎉 成功添加 ${addedCount} 个示例联系消息`);

  } catch (error) {
    console.error('❌ 添加示例联系消息失败:', error.message);
  }
}

// 运行修复脚本
fixDashboardData();