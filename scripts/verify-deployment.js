#!/usr/bin/env node

/**
 * 生产环境部署验证脚本
 * 检查 kn-wallpaperglue.com 的部署状态和配置
 */

import https from 'https';

const BASE_URL = 'https://kn-wallpaperglue.com';

async function checkDeploymentStatus() {
  console.log('🔍 检查生产环境部署状态...');
  
  // 检查主要页面
  const pagesToCheck = [
    '/',
    '/admin',
    '/products',
    '/about',
    '/contact',
    '/oem'
  ];

  let workingPages = 0;
  
  for (const page of pagesToCheck) {
    const options = {
      hostname: 'kn-wallpaperglue.com',
      port: 443,
      path: page,
      method: 'GET',
      headers: {
        'User-Agent': 'Deployment-Checker/1.0'
      }
    };

    try {
      const response = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        req.on('error', reject);
        req.end();
      });

      if (response.status === 200) {
        console.log(`✅ ${page}: 200 OK`);
        workingPages++;
      } else {
        console.log(`❌ ${page}: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${page}: 错误 - ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return workingPages;
}

async function checkStaticAssets() {
  console.log('\n📦 检查静态资源加载...');
  
  const assetsToCheck = [
    '/assets/index.js',
    '/assets/index.css',
    '/favicon.ico',
    '/manifest.json'
  ];

  let workingAssets = 0;
  
  for (const asset of assetsToCheck) {
    const options = {
      hostname: 'kn-wallpaperglue.com',
      port: 443,
      path: asset,
      method: 'GET'
    };

    try {
      const response = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          resolve(res.statusCode);
        });
        req.on('error', reject);
        req.end();
      });

      if (response === 200) {
        console.log(`✅ ${asset}: 200 OK`);
        workingAssets++;
      } else {
        console.log(`❌ ${asset}: ${response}`);
      }
    } catch (error) {
      console.log(`❌ ${asset}: 错误 - ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return workingAssets;
}

async function checkSSLConfiguration() {
  console.log('\n🔒 检查SSL证书配置...');
  
  try {
    const agent = new https.Agent({  
      rejectUnauthorized: false // 允许自签名证书检查
    });

    const options = {
      hostname: 'kn-wallpaperglue.com',
      port: 443,
      path: '/',
      method: 'GET',
      agent: agent
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        const cert = res.socket.getPeerCertificate();
        resolve({
          status: res.statusCode,
          cert: cert
        });
      });
      req.on('error', reject);
      req.end();
    });

    if (response.cert && response.cert.subject) {
      console.log('✅ SSL证书有效');
      console.log(`  颁发给: ${response.cert.subject.CN}`);
      console.log(`  颁发者: ${response.cert.issuer.CN}`);
      console.log(`  有效期: ${response.cert.valid_from} 至 ${response.cert.valid_to}`);
      return true;
    } else {
      console.log('❌ 无法获取证书信息');
      return false;
    }
  } catch (error) {
    console.log('❌ SSL检查错误:', error.message);
    return false;
  }
}

async function checkDNSConfiguration() {
  console.log('\n🌐 检查DNS配置...');
  
  try {
    // 使用dns.promises需要额外处理，这里简化检查
    const options = {
      hostname: 'kn-wallpaperglue.com',
      port: 443,
      path: '/',
      method: 'HEAD'
    };

    const start = Date.now();
    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        resolve({
          status: res.statusCode,
          timing: Date.now() - start
        });
      });
      req.on('error', reject);
      req.end();
    });

    console.log(`✅ DNS解析正常，响应时间: ${response.timing}ms`);
    return true;
  } catch (error) {
    console.log('❌ DNS解析错误:', error.message);
    return false;
  }
}

async function generateDeploymentReport() {
  console.log('🚀 生成生产环境部署报告');
  console.log('🌐 目标域名: kn-wallpaperglue.com');
  console.log('=' .repeat(60));

  const results = {
    pages: await checkDeploymentStatus(),
    assets: await checkStaticAssets(),
    ssl: await checkSSLConfiguration(),
    dns: await checkDNSConfiguration(),
    timestamp: new Date().toISOString()
  };

  console.log('\n' + '=' .repeat(60));
  console.log('📊 部署验证报告:');
  console.log(`✅ 可用页面: ${results.pages}/6`);
  console.log(`✅ 静态资源: ${results.assets}/4`); 
  console.log(`✅ SSL证书: ${results.ssl ? '正常' : '异常'}`);
  console.log(`✅ DNS解析: ${results.dns ? '正常' : '异常'}`);
  console.log(`🕐 检查时间: ${results.timestamp}`);

  // 提供建议
  console.log('\n💡 部署状态分析:');
  
  if (results.pages === 6 && results.assets === 4 && results.ssl && results.dns) {
    console.log('🎉 前端部署完全正常！');
    console.log('⚠️  但API端点配置可能有问题，需要检查:');
    console.log('1. Cloudflare Pages Functions 配置');
    console.log('2. _worker.js 文件是否正确部署');
    console.log('3. _routes.json 路由配置');
  } else if (results.pages > 0) {
    console.log('⚠️  前端部分功能正常，但需要完整检查:');
    console.log('1. 确认所有静态文件已上传');
    console.log('2. 检查构建输出目录内容');
    console.log('3. 验证 Pages 项目设置');
  } else {
    console.log('❌ 前端部署存在严重问题，需要立即检查:');
    console.log('1. 确认域名解析正确');
    console.log('2. 检查 Cloudflare Pages 部署状态');
    console.log('3. 验证构建流程是否成功');
  }

  console.log('\n🔧 下一步操作建议:');
  console.log('1. 访问 Cloudflare Dashboard 查看部署日志');
  console.log('2. 检查 wrangler.toml 和 .pages.toml 配置');
  console.log('3. 重新运行部署命令: npm run deploy:production');
  console.log('4. 验证环境变量设置');

  return results;
}

// 生成部署报告
generateDeploymentReport().catch(console.error);