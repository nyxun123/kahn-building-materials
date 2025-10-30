#!/usr/bin/env node

/**
 * 测试 Cloudflare Pages 部署状态
 * 验证登录 API 是否返回 JWT tokens
 */

const https = require('https');

function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: body
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

async function testLoginAPI() {
  console.log('🔍 测试登录 API...');
  console.log('📍 URL: https://kn-wallpaperglue.com/api/admin/login');
  console.log('');
  
  const postData = JSON.stringify({
    email: 'admin@kn-wallpaperglue.com',
    password: 'admin123'
  });
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Cache-Control': 'no-cache'
    }
  };
  
  try {
    const response = await makeRequest(
      'https://kn-wallpaperglue.com/api/admin/login',
      options,
      postData
    );
    
    console.log('📊 响应状态码:', response.statusCode);
    console.log('');
    console.log('📦 响应数据:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('');
    
    // 验证响应
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ 登录成功！');
      
      // 检查关键字段
      const checks = {
        'accessToken': response.data.accessToken ? '✅' : '❌',
        'refreshToken': response.data.refreshToken ? '✅' : '❌',
        'authType': response.data.authType === 'JWT' ? '✅' : '❌',
        'user': response.data.user ? '✅' : '❌',
        'expiresIn': response.data.expiresIn ? '✅' : '❌'
      };
      
      console.log('');
      console.log('🔍 字段检查:');
      Object.entries(checks).forEach(([field, status]) => {
        const value = response.data[field];
        console.log(`  ${status} ${field}: ${
          field === 'accessToken' || field === 'refreshToken' 
            ? (value ? value.substring(0, 20) + '...' : 'null')
            : value
        }`);
      });
      
      console.log('');
      
      // 判断部署是否成功
      const allChecksPass = Object.values(checks).every(v => v === '✅');
      
      if (allChecksPass) {
        console.log('🎉 部署成功！所有字段都正确返回！');
        console.log('');
        console.log('✅ JWT 认证已启用');
        console.log('✅ Access Token 已返回');
        console.log('✅ Refresh Token 已返回');
        return true;
      } else {
        console.log('⚠️  部署可能未完成或配置有误');
        console.log('');
        console.log('缺失的字段:');
        Object.entries(checks).forEach(([field, status]) => {
          if (status === '❌') {
            console.log(`  ❌ ${field}`);
          }
        });
        return false;
      }
    } else {
      console.log('❌ 登录失败！');
      console.log('状态码:', response.statusCode);
      console.log('响应:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
    return false;
  }
}

async function testProductsAPI() {
  console.log('');
  console.log('─'.repeat(60));
  console.log('🔍 测试产品列表 API...');
  console.log('📍 URL: https://kn-wallpaperglue.com/api/products');
  console.log('');
  
  const options = {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache'
    }
  };
  
  try {
    const response = await makeRequest(
      'https://kn-wallpaperglue.com/api/products',
      options
    );
    
    console.log('📊 响应状态码:', response.statusCode);
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ 产品列表 API 正常');
      console.log('📦 产品数量:', response.data.data?.length || 0);
      return true;
    } else {
      console.log('❌ 产品列表 API 异常');
      return false;
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
    return false;
  }
}

async function main() {
  console.log('');
  console.log('═'.repeat(60));
  console.log('  Cloudflare Pages 部署测试');
  console.log('═'.repeat(60));
  console.log('');
  console.log('🕐 测试时间:', new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
  console.log('');
  console.log('─'.repeat(60));
  
  const loginSuccess = await testLoginAPI();
  const productsSuccess = await testProductsAPI();
  
  console.log('');
  console.log('─'.repeat(60));
  console.log('');
  console.log('📋 测试总结:');
  console.log('  登录 API:', loginSuccess ? '✅ 通过' : '❌ 失败');
  console.log('  产品 API:', productsSuccess ? '✅ 通过' : '❌ 失败');
  console.log('');
  
  if (loginSuccess && productsSuccess) {
    console.log('🎉 所有测试通过！部署成功！');
    console.log('');
    console.log('✅ 你现在可以访问网站并登录了');
    console.log('🌐 网站地址: https://kn-wallpaperglue.com');
    console.log('');
    process.exit(0);
  } else {
    console.log('⚠️  部分测试失败，可能需要等待更长时间或检查配置');
    console.log('');
    console.log('💡 建议:');
    console.log('  1. 等待 2-3 分钟后重新运行测试');
    console.log('  2. 检查 Cloudflare Pages 部署状态');
    console.log('  3. 清除浏览器缓存后访问网站');
    console.log('');
    process.exit(1);
  }
}

main();

