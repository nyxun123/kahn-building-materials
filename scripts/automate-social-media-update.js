#!/usr/bin/env node

/**
 * 自动化更新社交媒体简介脚本
 * 使用 Puppeteer 控制 Chrome 浏览器
 * 
 * 使用方法：
 * 1. 安装依赖: npm install puppeteer
 * 2. 运行脚本: node scripts/automate-social-media-update.js
 * 
 * 注意：需要手动登录各个平台
 */

const puppeteer = require('puppeteer');

const WEBSITE_URL = 'https://kn-wallpaperglue.com';
const PHONE = '+86 13216156841';
const EMAIL = 'karnstarch@gmail.com';

const SOCIAL_PLATFORMS = {
  tiktok: {
    url: 'https://www.tiktok.com/@karn7590326808331',
    loginUrl: 'https://www.tiktok.com/login',
    bio: `🏭 杭州卡恩新型建材\n专业CMS和墙纸胶粉制造商\n📱 ${PHONE}\n🌐 ${WEBSITE_URL}`,
    steps: [
      '1. 打开 TikTok 并登录',
      '2. 进入个人资料页面',
      '3. 点击"编辑资料"',
      '4. 更新简介（最多80字符）',
      '5. 保存更改'
    ]
  },
  youtube: {
    url: 'https://www.youtube.com/channel/UCXV9lwMgf8FaV9BLJG1CoTQ',
    loginUrl: 'https://www.youtube.com',
    bio: `Hangzhou Karn New Building Materials Co., Ltd\nProfessional Carboxymethyl Starch (CMS) & Wallpaper Adhesive Manufacturer\n\n🏭 15 Years Professional Manufacturing Experience\n📦 Product Series: 8810/8840/K5/K6/999\n🌍 Serving Global Markets\n\n📱 Contact:\nPhone/WhatsApp/WeChat: ${PHONE}\nEmail: ${EMAIL}\n\n🌐 Website: ${WEBSITE_URL}`,
    website: WEBSITE_URL,
    steps: [
      '1. 打开 YouTube Studio',
      '2. 进入"自定义" → "基本信息"',
      '3. 更新频道说明',
      '4. 添加网站链接',
      '5. 发布更改'
    ]
  },
  instagram: {
    url: 'https://www.instagram.com/karnwallpaperglue/',
    loginUrl: 'https://www.instagram.com/accounts/login/',
    bio: `🏭 杭州卡恩新型建材\n专业CMS和墙纸胶粉制造商\n📱 ${PHONE}\n📧 ${EMAIL}\n🌐 ${WEBSITE_URL}`,
    website: WEBSITE_URL,
    steps: [
      '1. 打开 Instagram 并登录',
      '2. 进入个人资料',
      '3. 点击"编辑个人资料"',
      '4. 更新简介（最多150字符）',
      '5. 在"网站"字段添加链接',
      '6. 提交更改'
    ]
  },
  facebook: {
    url: 'https://www.facebook.com/profile.php?id=61565441264146',
    loginUrl: 'https://www.facebook.com',
    bio: `杭州卡恩新型建材有限公司\n专业羧甲基淀粉（CMS）和墙纸胶粉制造商\n\n🏭 15年专业生产经验\n📦 产品系列：8810/8840/K5/K6/999\n🌍 服务全球市场\n\n📱 联系方式：\n电话/WhatsApp/微信：${PHONE}\n邮箱：${EMAIL}\n\n🌐 官网：${WEBSITE_URL}`,
    website: WEBSITE_URL,
    steps: [
      '1. 打开 Facebook 并登录',
      '2. 进入个人资料页面',
      '3. 点击"编辑个人资料"',
      '4. 更新简介',
      '5. 添加网站链接',
      '6. 保存更改'
    ]
  }
};

async function updateSocialMedia(platformName) {
  const platform = SOCIAL_PLATFORMS[platformName];
  if (!platform) {
    console.error(`❌ 未知平台: ${platformName}`);
    return;
  }

  console.log(`\n🚀 开始更新 ${platformName.toUpperCase()}`);
  console.log('═══════════════════════════════════════');
  console.log(`📋 平台URL: ${platform.url}`);
  console.log(`\n📝 简介内容:\n${platform.bio}`);
  if (platform.website) {
    console.log(`\n🌐 网站链接: ${platform.website}`);
  }
  console.log(`\n📋 操作步骤:`);
  platform.steps.forEach(step => console.log(`   ${step}`));
  
  try {
    const browser = await puppeteer.launch({
      headless: false, // 显示浏览器窗口
      defaultViewport: { width: 1280, height: 720 }
    });

    const page = await browser.newPage();
    
    console.log(`\n🌐 正在打开 ${platform.url}...`);
    await page.goto(platform.url, { waitUntil: 'networkidle2' });
    
    // 等待用户手动登录（如果需要）
    console.log('\n⏳ 请手动登录（如果需要）...');
    console.log('   登录完成后，按 Enter 继续...');
    
    // 等待用户输入（在实际使用中，可以添加自动登录逻辑）
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });

    // 尝试找到并更新简介
    console.log('\n🔍 正在查找简介编辑区域...');
    
    // 这里需要根据每个平台的实际 DOM 结构来定位元素
    // 由于每个平台的界面可能不同，建议手动操作或使用更精确的选择器
    
    console.log('\n✅ 请按照上述步骤手动更新简介');
    console.log('   脚本会保持浏览器打开，方便您操作');
    
    // 保持浏览器打开
    console.log('\n💡 提示：更新完成后，关闭浏览器窗口即可');
    
    // 等待用户完成操作
    await new Promise(() => {}); // 保持运行直到用户关闭浏览器
    
  } catch (error) {
    console.error(`❌ 更新 ${platformName} 时出错:`, error.message);
  }
}

// 主函数
async function main() {
  console.log('🎯 社交媒体简介自动更新工具');
  console.log('═══════════════════════════════════════');
  console.log('\n📱 支持的平台:');
  Object.keys(SOCIAL_PLATFORMS).forEach((platform, index) => {
    console.log(`   ${index + 1}. ${platform.toUpperCase()}`);
  });
  
  console.log('\n💡 使用说明:');
  console.log('   1. 脚本会打开浏览器');
  console.log('   2. 您需要手动登录各个平台');
  console.log('   3. 脚本会显示需要更新的内容');
  console.log('   4. 按照提示手动更新简介和网站链接');
  console.log('\n⚠️  注意：由于各平台的登录验证机制，');
  console.log('   建议手动操作以确保安全性');
  
  // 检查是否安装了 puppeteer
  try {
    require('puppeteer');
  } catch (error) {
    console.log('\n❌ 未安装 puppeteer');
    console.log('   请运行: npm install puppeteer');
    console.log('   或: pnpm add puppeteer');
    process.exit(1);
  }
  
  // 询问要更新的平台
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('\n请输入要更新的平台名称（或输入 "all" 更新所有平台）: ', async (answer) => {
    if (answer.toLowerCase() === 'all') {
      for (const platform of Object.keys(SOCIAL_PLATFORMS)) {
        await updateSocialMedia(platform);
      }
    } else if (SOCIAL_PLATFORMS[answer.toLowerCase()]) {
      await updateSocialMedia(answer.toLowerCase());
    } else {
      console.log('❌ 无效的平台名称');
      process.exit(1);
    }
    rl.close();
  });
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SOCIAL_PLATFORMS, updateSocialMedia };














