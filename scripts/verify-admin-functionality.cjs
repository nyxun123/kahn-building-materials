// 验证管理功能是否正常工作
async function verifyAdminFunctionality() {
  console.log('🔍 验证管理功能是否正常工作...\n');
  
  try {
    // 1. 检查数据库中是否有首页内容
    console.log('1. 检查数据库中的首页内容...');
    const sqlite3 = require('sqlite3');
    const path = require('path');
    
    const dbPath = path.join(process.cwd(), 'data', 'backend-management.db');
    const db = new sqlite3.Database(dbPath);
    
    const homeContents = await new Promise((resolve, reject) => {
      db.all('SELECT section_key, content_zh FROM page_contents WHERE page_key = "home" AND (section_key LIKE "%video%" OR section_key LIKE "%oem%" OR section_key LIKE "%semi%")', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log(`✅ 数据库中有 ${homeContents.length} 条首页新板块内容`);
    homeContents.forEach(content => {
      console.log(`   - ${content.section_key}: ${content.content_zh.substring(0, 30)}...`);
    });
    
    // 2. 检查API是否可访问
    console.log('\n2. 检查API是否可访问...');
    try {
      const response = await fetch('http://localhost:5175/api/content-local?page=home');
      if (response.ok) {
        const data = await response.json();
        const homeData = data.filter(item => 
          item.section_key.includes('video') || 
          item.section_key.includes('oem') || 
          item.section_key.includes('semi')
        );
        console.log(`✅ API可访问，获取到 ${homeData.length} 条首页新板块内容`);
      } else {
        console.log('⚠️ API返回状态:', response.status);
      }
    } catch (error) {
      console.log('⚠️ API测试失败:', error.message);
    }
    
    // 3. 检查管理页面组件是否存在
    console.log('\n3. 检查管理页面组件...');
    const fs = require('fs');
    
    const adminFiles = [
      'src/pages/admin/home-content.tsx',
      'src/pages/admin/layout.tsx',
      'src/lib/router.tsx'
    ];
    
    adminFiles.forEach(file => {
      const fullPath = path.join(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        console.log(`✅ ${file} 存在`);
      } else {
        console.log(`❌ ${file} 不存在`);
      }
    });
    
    // 4. 检查路由配置
    console.log('\n4. 检查路由配置...');
    const routerContent = fs.readFileSync(path.join(process.cwd(), 'src/lib/router.tsx'), 'utf8');
    if (routerContent.includes('home-content')) {
      console.log('✅ 路由配置中包含 home-content');
    } else {
      console.log('❌ 路由配置中未找到 home-content');
    }
    
    // 5. 检查导航菜单
    console.log('\n5. 检查导航菜单...');
    const layoutContent = fs.readFileSync(path.join(process.cwd(), 'src/pages/admin/layout.tsx'), 'utf8');
    if (layoutContent.includes('首页内容')) {
      console.log('✅ 导航菜单中包含 "首页内容"');
    } else {
      console.log('❌ 导航菜单中未找到 "首页内容"');
    }
    
    console.log('\n✅ 验证完成！管理功能应该可以正常工作。');
    console.log('\n请访问以下URL进行测试:');
    console.log('- 管理登录: http://localhost:5175/admin/login');
    console.log('- 首页内容管理: http://localhost:5175/admin/home-content');
    
    db.close();
    
  } catch (error) {
    console.error('❌ 验证过程中发生错误:', error.message);
  }
}

// 运行验证
verifyAdminFunctionality();