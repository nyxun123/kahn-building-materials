#!/usr/bin/env node

/**
 * 管理后台集成测试脚本
 * 测试 kn-wallpaperglue.com 的管理功能集成
 */

import https from 'https';

const BASE_URL = 'https://kn-wallpaperglue.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// 存储认证令牌
let authToken = null;

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

async function adminLogin() {
  console.log('🔐 测试管理员登录...');
  
  const options = {
    hostname: 'kn-wallpaperglue.com',
    port: 443,
    path: '/api/admin/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const loginData = JSON.stringify({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  });

  try {
    const response = await makeRequest(options, loginData);
    
    if (response.status === 200 && response.data.token) {
      authToken = response.data.token;
      console.log('✅ 管理员登录成功');
      return true;
    } else {
      console.log('❌ 管理员登录失败:', response.status, response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ 登录请求错误:', error.message);
    return false;
  }
}

async function testAdminEndpoints() {
  if (!authToken) {
    console.log('⚠️  需要先登录才能测试管理端点');
    return false;
  }

  const endpoints = [
    {
      name: '获取用户列表',
      path: '/api/admin/users',
      method: 'GET'
    },
    {
      name: '获取产品列表',
      path: '/api/admin/products',
      method: 'GET'
    },
    {
      name: '获取联系表单',
      path: '/api/admin/contacts',
      method: 'GET'
    },
    {
      name: '系统状态',
      path: '/api/admin/status',
      method: 'GET'
    }
  ];

  console.log('\n🧪 测试管理端点...');

  let allPassed = true;

  for (const endpoint of endpoints) {
    const options = {
      hostname: 'kn-wallpaperglue.com',
      port: 443,
      path: endpoint.path,
      method: endpoint.method,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await makeRequest(options);
      
      if (response.status === 200) {
        console.log(`✅ ${endpoint.name}: 成功 (${response.status})`);
      } else if (response.status === 401) {
        console.log(`⚠️  ${endpoint.name}: 未授权 (${response.status}) - 可能需要重新登录`);
        allPassed = false;
      } else {
        console.log(`❌ ${endpoint.name}: 失败 (${response.status}) - ${JSON.stringify(response.data)}`);
        allPassed = false;
      }

      // 添加延迟避免请求过于频繁
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(`❌ ${endpoint.name}: 请求错误 - ${error.message}`);
      allPassed = false;
    }
  }

  return allPassed;
}

async function testContentManagement() {
  console.log('\n📝 测试内容管理功能...');

  // 测试创建产品
  const createProductOptions = {
    hostname: 'kn-wallpaperglue.com',
    port: 443,
    path: '/api/admin/products',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  };

  const productData = JSON.stringify({
    name: '测试产品',
    description: '这是一个测试产品',
    category: 'test',
    price: 99.99,
    stock: 10,
    status: 'draft'
  });

  try {
    const response = await makeRequest(createProductOptions, productData);
    
    if (response.status === 201) {
      console.log('✅ 产品创建成功');
      return response.data.id; // 返回创建的产品ID用于后续测试
    } else {
      console.log('❌ 产品创建失败:', response.status, response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ 产品创建请求错误:', error.message);
    return null;
  }
}

async function runIntegrationTest() {
  console.log('🚀 开始管理后台集成测试');
  console.log('🌐 测试域名: kn-wallpaperglue.com');
  console.log('=' .repeat(60));

  // 1. 测试登录
  const loginSuccess = await adminLogin();
  if (!loginSuccess) {
    console.log('❌ 登录测试失败，无法继续集成测试');
    return false;
  }

  // 2. 测试管理端点
  const endpointsSuccess = await testAdminEndpoints();
  
  // 3. 测试内容管理
  const productId = await testContentManagement();

  console.log('\n' + '=' .repeat(60));
  console.log('📊 集成测试结果汇总:');
  console.log(`✅ 登录测试: ${loginSuccess ? '通过' : '失败'}`);
  console.log(`✅ 管理端点测试: ${endpointsSuccess ? '通过' : '部分失败'}`);
  console.log(`✅ 内容管理测试: ${productId ? '通过' : '失败'}`);

  if (loginSuccess && endpointsSuccess && productId) {
    console.log('\n🎉 所有集成测试通过！管理后台功能正常。');
    console.log('\n💡 下一步建议:');
    console.log('1. 通过浏览器访问 https://kn-wallpaperglue.com/admin');
    console.log('2. 使用管理员凭据登录');
    console.log('3. 验证所有管理功能正常工作');
    return true;
  } else {
    console.log('\n⚠️  部分测试失败，需要进一步检查:');
    console.log('1. 检查环境变量 ADMIN_EMAIL 和 ADMIN_PASSWORD 设置');
    console.log('2. 验证数据库连接和权限配置');
    console.log('3. 查看 Cloudflare Functions 日志');
    return false;
  }
}

// 执行集成测试
runIntegrationTest().catch(console.error);