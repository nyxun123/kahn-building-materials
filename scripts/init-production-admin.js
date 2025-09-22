#!/usr/bin/env node

/**
 * 生产环境管理员初始化脚本
 * 在 kn-wallpaperglue.com 创建管理员账户
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

async function createAdminUser() {
  console.log('👤 创建生产环境管理员账户...');
  
  const options = {
    hostname: 'kn-wallpaperglue.com',
    port: 443,
    path: '/api/admin/init',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const adminData = JSON.stringify({
    email: 'admin@kn-wallpaperglue.com',
    password: 'admin123',
    name: '系统管理员',
    role: 'superadmin'
  });

  try {
    const response = await makeRequest(options, adminData);
    
    if (response.status === 201) {
      console.log('✅ 管理员账户创建成功');
      console.log('📧 邮箱: admin@kn-wallpaperglue.com');
      console.log('🔑 密码: admin123');
      console.log('💡 请立即登录并更改密码！');
      return true;
    } else if (response.status === 409) {
      console.log('ℹ️  管理员账户已存在');
      return true;
    } else {
      console.log('❌ 管理员创建失败:', response.status, response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ 管理员创建请求错误:', error.message);
    return false;
  }
}

async function testAdminLogin() {
  console.log('\n🔐 测试管理员登录...');
  
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
    email: 'admin@kn-wallpaperglue.com',
    password: 'admin123'
  });

  try {
    const response = await makeRequest(options, loginData);
    
    if (response.status === 200 && response.data.token) {
      console.log('✅ 管理员登录测试成功');
      console.log('🔑 获取到认证令牌');
      return response.data.token;
    } else {
      console.log('❌ 管理员登录测试失败:', response.status, response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ 登录请求错误:', error.message);
    return null;
  }
}

async function verifyAdminAccess(token) {
  if (!token) return false;

  console.log('\n🧪 验证管理员权限...');
  
  const options = {
    hostname: 'kn-wallpaperglue.com',
    port: 443,
    path: '/api/admin/users',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options);
    
    if (response.status === 200) {
      console.log('✅ 管理员权限验证成功');
      return true;
    } else {
      console.log('❌ 管理员权限验证失败:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ 权限验证请求错误:', error.message);
    return false;
  }
}

async function runAdminInitialization() {
  console.log('🚀 开始生产环境管理员初始化');
  console.log('🌐 目标域名: kn-wallpaperglue.com');
  console.log('=' .repeat(60));

  // 1. 创建管理员账户
  const created = await createAdminUser();
  if (!created) {
    console.log('❌ 管理员初始化失败');
    return false;
  }

  // 2. 测试登录
  const token = await testAdminLogin();
  if (!token) {
    console.log('❌ 登录测试失败');
    return false;
  }

  // 3. 验证权限
  const accessVerified = await verifyAdminAccess(token);
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 管理员初始化结果:');
  console.log(`✅ 账户创建: ${created ? '成功' : '失败'}`);
  console.log(`✅ 登录测试: ${token ? '成功' : '失败'}`);
  console.log(`✅ 权限验证: ${accessVerified ? '成功' : '失败'}`);

  if (created && token && accessVerified) {
    console.log('\n🎉 生产环境管理员初始化完成！');
    console.log('\n💡 下一步操作:');
    console.log('1. 访问 https://kn-wallpaperglue.com/admin');
    console.log('2. 使用邮箱: admin@kn-wallpaperglue.com');
    console.log('3. 使用密码: admin123');
    console.log('4. 登录后立即更改密码');
    console.log('5. 开始使用管理后台功能');
    return true;
  } else {
    console.log('\n⚠️  初始化部分失败，需要手动检查:');
    console.log('1. 检查 /api/admin/init 端点是否可用');
    console.log('2. 验证数据库连接和用户表结构');
    console.log('3. 查看 Cloudflare Functions 日志');
    return false;
  }
}

// 执行管理员初始化
runAdminInitialization().catch(console.error);