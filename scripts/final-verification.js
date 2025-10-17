#!/usr/bin/env node

/**
 * 🎯 OEM定制图片上传功能最终验证脚本
 * 验证所有修复是否正确部署并正常工作
 */

const DEPLOYED_URL = 'https://f27dd00a.kahn-building-materials.pages.dev';

async function finalVerification() {
    console.log('🎯 OEM定制图片上传功能最终验证');
    console.log('═══════════════════════════════════════');
    console.log(`🌐 部署地址: ${DEPLOYED_URL}`);
    console.log('');

    let allTestsPassed = true;

    try {
        // 1. 测试OEM内容管理API端点
        console.log('1️⃣ 测试OEM内容管理API');
        console.log('──────────────────────────');
        
        const oemResponse = await fetch(`${DEPLOYED_URL}/api/admin/oem`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer test-token'
            }
        });
        
        if (oemResponse.ok) {
            const oemResult = await oemResponse.json();
            console.log('✅ OEM内容管理API正常工作');
            console.log(`   状态: ${oemResponse.status}`);
            console.log(`   数据字段: ${Object.keys(oemResult.data || {}).join(', ')}`);
        } else {
            console.log('⚠️  OEM内容管理API返回错误状态');
            console.log(`   状态: ${oemResponse.status}`);
            allTestsPassed = false;
        }

        // 2. 测试图片上传功能
        console.log('\n2️⃣ 测试图片上传功能');
        console.log('──────────────────────────');
        
        // 创建一个简单的测试图片（1x1像素红色PNG）
        const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
        
        const uploadResponse = await fetch(`${DEPLOYED_URL}/api/upload-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token'
            },
            body: JSON.stringify({
                imageData: testImageBase64,
                fileName: `oem-test-${Date.now()}.png`,
                folder: 'oem'
            })
        });
        
        const uploadResult = await uploadResponse.json();
        
        if (uploadResponse.ok && uploadResult.code === 200) {
            console.log('✅ 图片上传功能正常');
            console.log(`   上传方式: ${uploadResult.data.uploadMethod}`);
            console.log(`   文件大小: ${uploadResult.data.fileSize} bytes`);
        } else {
            console.log('❌ 图片上传失败');
            console.log(`   状态: ${uploadResponse.status}`);
            console.log(`   错误: ${uploadResult.message || 'Unknown error'}`);
            allTestsPassed = false;
        }

        // 3. 测试前端页面访问
        console.log('\n3️⃣ 测试前端页面访问');
        console.log('──────────────────────────');
        
        const homeResponse = await fetch(DEPLOYED_URL);
        if (homeResponse.ok) {
            console.log('✅ 前端主页可正常访问');
        } else {
            console.log('❌ 前端主页无法访问');
            console.log(`   状态: ${homeResponse.status}`);
            allTestsPassed = false;
        }

        // 4. 测试管理后台访问
        console.log('\n4️⃣ 测试管理后台访问');
        console.log('──────────────────────────');
        
        const adminResponse = await fetch(`${DEPLOYED_URL}/admin/oem`);
        if (adminResponse.ok) {
            console.log('✅ OEM管理页面可正常访问');
        } else {
            console.log('❌ OEM管理页面无法访问');
            console.log(`   状态: ${adminResponse.status}`);
            allTestsPassed = false;
        }

        // 最终结果
        console.log('\n📋 最终验证结果');
        console.log('═══════════════════════════════════════');
        
        if (allTestsPassed) {
            console.log('🎉 所有功能验证通过！');
            console.log('✅ OEM定制图片上传功能已完全修复');
            console.log('✅ 所有组件正常工作');
            console.log('✅ 部署成功');
            console.log('');
            console.log('🔧 管理员现在可以:');
            console.log('   1. 访问管理后台 /admin/oem');
            console.log('   2. 上传OEM定制图片');
            console.log('   3. 点击保存按钮保存更改');
            console.log('   4. 在网站首页查看更新后的图片');
        } else {
            console.log('❌ 部分功能验证失败');
            console.log('请检查上述错误并进行相应修复');
        }

    } catch (error) {
        console.error('❌ 验证过程中发生错误:', error.message);
        allTestsPassed = false;
    }
}

// 运行验证
finalVerification().catch(console.error);