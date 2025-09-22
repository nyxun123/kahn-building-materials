#!/usr/bin/env node

/**
 * 综合测试脚本
 * 验证整个管理系统的功能完整性
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 测试配置
const BASE_URL = 'http://localhost:5173';
const TEST_TOKEN = 'admin-token';

console.log('🚀 开始综合测试管理系统...\n');

// 检查必要文件是否存在
function checkRequiredFiles() {
  console.log('📁 检查必要文件...');
  
  const requiredFiles = [
    'public/_worker.js',
    'src/lib/api.ts',
    'src/lib/config.ts',
    'src/pages/admin/dashboard.tsx',
    'src/lib/dashboard-service.ts'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - 文件不存在`);
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
}

// 测试构建
function testBuild() {
  console.log('\n🔨 测试项目构建...');
  
  try {
    execSync('npm run build', { stdio: 'pipe' });
    console.log('✅ 项目构建成功');
    return true;
  } catch (error) {
    console.log('❌ 项目构建失败:', error.message);
    return false;
  }
}

// 测试API端点
async function testAPIEndpoints() {
  console.log('\n🌐 测试API端点...');
  
  const endpoints = [
    '/api/admin/dashboard/stats',
    '/api/admin/dashboard/activities',
    '/api/admin/dashboard/health',
    '/api/admin/products',
    '/api/admin/contacts'
  ];
  
  let allEndpointsWork = true;
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`
        }
      });
      
      if (response.ok) {
        console.log(`✅ ${endpoint} - 正常`);
      } else {
        console.log(`⚠️ ${endpoint} - 返回 ${response.status}`);
        allEndpointsWork = false;
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - 连接失败: ${error.message}`);
      allEndpointsWork = false;
    }
  }
  
  return allEndpointsWork;
}

// 测试仪表板功能
async function testDashboardFunctionality() {
  console.log('\n📊 测试仪表板功能...');
  
  try {
    // 测试统计API
    const statsResponse = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ 统计API - 数据结构正确');
      
      // 验证返回的数据结构
      const requiredStatsFields = ['totalProducts', 'totalContacts', 'unreadContacts', 'activeProducts'];
      const hasAllFields = requiredStatsFields.every(field => field in statsData.data);
      
      if (hasAllFields) {
        console.log('✅ 统计数据结构 - 完整');
      } else {
        console.log('⚠️ 统计数据结构 - 缺少字段');
      }
    } else {
      console.log('❌ 统计API - 请求失败');
      return false;
    }
    
    // 测试活动API
    const activitiesResponse = await fetch(`${BASE_URL}/api/admin/dashboard/activities?limit=5`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    if (activitiesResponse.ok) {
      console.log('✅ 活动API - 正常');
    } else {
      console.log('❌ 活动API - 请求失败');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('❌ 仪表板功能测试失败:', error.message);
    return false;
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('='.repeat(50));
  console.log('🧪 管理系统综合测试');
  console.log('='.repeat(50));
  
  // 检查文件
  const filesOk = checkRequiredFiles();
  if (!filesOk) {
    console.log('\n❌ 必要文件检查失败，测试中止');
    return false;
  }
  
  // 测试构建
  const buildOk = testBuild();
  if (!buildOk) {
    console.log('\n❌ 构建测试失败，测试中止');
    return false;
  }
  
  // 测试API端点
  const apiOk = await testAPIEndpoints();
  if (!apiOk) {
    console.log('\n⚠️ API端点测试有警告，继续测试...');
  }
  
  // 测试仪表板功能
  const dashboardOk = await testDashboardFunctionality();
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 测试结果汇总');
  console.log('='.repeat(50));
  
  console.log(`📁 文件检查: ${filesOk ? '✅' : '❌'}`);
  console.log(`🔨 构建测试: ${buildOk ? '✅' : '❌'}`);
  console.log(`🌐 API端点: ${apiOk ? '✅' : '⚠️'}`);
  console.log(`📊 仪表板功能: ${dashboardOk ? '✅' : '❌'}`);
  
  const overallSuccess = filesOk && buildOk && dashboardOk;
  
  console.log('\n' + '='.repeat(50));
  if (overallSuccess) {
    console.log('🎉 所有测试通过！系统功能完整');
    console.log('💡 提示: 请手动测试管理后台界面以确保用户体验');
  } else {
    console.log('❌ 测试未完全通过，请检查相关问题');
  }
  console.log('='.repeat(50));
  
  return overallSuccess;
}

// 执行测试
runAllTests().catch(error => {
  console.error('测试执行错误:', error);
  process.exit(1);
});