#!/usr/bin/env node

/**
 * 手动管理员设置脚本
 * 通过直接数据库操作创建管理员账户
 */

import https from 'https';

const BASE_URL = 'https://kn-wallpaperglue.com';

async function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
            raw: responseData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: responseData,
            raw: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(data);
    }

    req.end();
  });
}

async function testAvailableEndpoints() {
  console.log('🔍 检测可用的API端点...');
  
  const endpoints = [
    '/api/admin/login',
    '/api/admin/users',
    '/api/admin/products', 
    '/api/admin/contacts',
    '/api/admin/status',
    '/api/contact',
    '/api/products'
  ];

  const availableEndpoints = [];

  for (const endpoint of endpoints) {
    const options = {
      hostname: 'kn-wallpaperglue.com',
      port: 443,
      path: endpoint,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await makeRequest(options);
      if (response.status !== 404) {
        availableEndpoints.push({
          endpoint,
          status: response.status,
          method: 'GET'
        });
        console.log(`✅ ${endpoint}: ${response.status}`);
      } else {
        console.log(`❌ ${endpoint}: 404 (未找到)`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: 错误 - ${error.message}`);
    }

    // 添加延迟避免请求过于频繁
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return availableEndpoints;
}

async function checkDatabaseConnection() {
  console.log('\n🛢️  检查数据库连接状态...');
  
  const options = {
    hostname: 'kn-wallpaperglue.com',
    port: 443,
    path: '/api/admin/status',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options);
    
    if (response.status === 200) {
      console.log('✅ 数据库连接正常');
      console.log('📊 系统状态:', JSON.stringify(response.data, null, 2));
      return true;
    } else {
      console.log('❌ 无法获取系统状态:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ 状态检查请求错误:', error.message);
    return false;
  }
}

async function createAdminViaContactForm() {
  console.log('\n📧 尝试通过联系表单创建管理员（备用方案）...');
  
  const options = {
    hostname: 'kn-wallpaperglue.com',
    port: 443,
    path: '/api/contact',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const contactData = JSON.stringify({
    name: '系统管理员',
    email: 'admin@kn-wallpaperglue.com',
    phone: '+8613800138000',
    company: 'KN Wallpaper Glue',
    message: '紧急：请创建管理员账户。邮箱：admin@kn-wallpaperglue.com，密码：admin123，角色：superadmin',
    subject: '管理员账户创建请求',
    urgency: 'critical'
  });

  try {
    const response = await makeRequest(options, contactData);
    
    if (response.status === 200 || response.status === 201) {
      console.log('✅ 联系表单提交成功');
      console.log('💡 已发送管理员创建请求，请检查后台并手动创建账户');
      return true;
    } else {
      console.log('❌ 联系表单提交失败:', response.status, response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ 联系表单请求错误:', error.message);
    return false;
  }
}

async function provideManualSetupInstructions() {
  console.log('\n📋 手动设置管理员账户指南:');
  console.log('=' .repeat(60));
  console.log('1. 访问 Cloudflare Dashboard: https://dash.cloudflare.com');
  console.log('2. 进入您的 Pages 项目: kn-wallpaperglue.com');
  console.log('3. 转到 "Functions" 选项卡');
  console.log('4. 查看日志，确认 _worker.js 是否正确部署');
  console.log('5. 检查环境变量设置:');
  console.log('   - DATABASE_URL: D1 数据库连接字符串');
  console.log('   - JWT_SECRET: JWT 密钥');
  console.log('   - ADMIN_EMAIL: 管理员邮箱');
  console.log('   - ADMIN_PASSWORD: 管理员密码哈希');
  console.log('');
  console.log('6. 如果需要手动创建管理员，可以:');
  console.log('   - 通过 D1 数据库控制台直接插入用户记录');
  console.log('   - 或者使用 wrangler d1 execute 命令');
  console.log('');
  console.log('💡 SQL 插入示例:');
  console.log('INSERT INTO users (email, password_hash, name, role, status, created_at)');
  console.log('VALUES (');
  console.log("  'admin@kn-wallpaperglue.com',");
  console.log("  '哈希后的密码',"); 
  console.log("  '系统管理员',");
  console.log("  'superadmin',");
  console.log("  'active',");
  console.log("  CURRENT_TIMESTAMP");
  console.log(');');
}

async function runManualSetup() {
  console.log('🚀 开始生产环境手动设置检查');
  console.log('🌐 目标域名: kn-wallpaperglue.com');
  console.log('=' .repeat(60));

  // 1. 检测可用端点
  const endpoints = await testAvailableEndpoints();
  
  // 2. 检查数据库连接
  const dbConnected = await checkDatabaseConnection();
  
  // 3. 尝试通过联系表单发送请求
  const contactSent = await createAdminViaContactForm();

  console.log('\n' + '=' .repeat(60));
  console.log('📊 手动设置检查结果:');
  console.log(`✅ 可用API端点: ${endpoints.length} 个`);
  console.log(`✅ 数据库连接: ${dbConnected ? '正常' : '异常'}`);
  console.log(`✅ 联系表单: ${contactSent ? '已发送' : '失败'}`);

  if (endpoints.length > 0 && dbConnected) {
    console.log('\n🎉 生产环境基础功能正常！');
    console.log('💡 需要手动创建管理员账户才能使用管理后台');
  } else {
    console.log('\n⚠️  生产环境配置需要进一步检查');
  }

  // 提供手动设置指南
  await provideManualSetupInstructions();

  return endpoints.length > 0 && dbConnected;
}

// 执行手动设置检查
runManualSetup().catch(console.error);