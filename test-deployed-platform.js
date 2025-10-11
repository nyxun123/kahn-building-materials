#!/usr/bin/env node

/**
 * 🔧 部署平台产品上传功能测试脚本
 * 测试部署后的管理平台产品功能
 */

const DEPLOYED_URL = 'https://kn-wallpaperglue.com';
const ADMIN_URL = `${DEPLOYED_URL}/admin`;

async function testDeployedPlatform() {
    console.log('🔧 部署平台产品上传功能测试');
    console.log('═══════════════════════════════════════');
    console.log(`🌐 部署地址: ${DEPLOYED_URL}`);
    console.log(`🔑 管理后台: ${ADMIN_URL}`);
    console.log('');

    // 1. 测试管理平台访问
    console.log('1️⃣ 测试管理平台访问');
    console.log('──────────────────────────');
    
    try {
        console.log('🌐 测试首页访问...');
        const homeResponse = await fetch(DEPLOYED_URL);
        console.log(`   首页状态: ${homeResponse.status} ${homeResponse.ok ? '✅' : '❌'}`);
        
        console.log('🔑 测试管理后台访问...');
        const adminResponse = await fetch(`${ADMIN_URL}/login`);
        console.log(`   登录页状态: ${adminResponse.status} ${adminResponse.ok ? '✅' : '❌'}`);
        
        if (!adminResponse.ok) {
            console.log('❌ 管理后台无法访问，可能的问题:');
            console.log('   1. 路由配置问题');
            console.log('   2. 部署构建问题');
            console.log('   3. Cloudflare Pages配置问题');
            return false;
        }
        
    } catch (error) {
        console.log('❌ 网络连接失败:', error.message);
        return false;
    }

    // 2. 测试API端点
    console.log('');
    console.log('2️⃣ 测试API端点可用性');
    console.log('──────────────────────────');
    
    const apiEndpoints = [
        '/api/health',
        '/api/admin/products',
        '/api/upload-image'
    ];
    
    for (const endpoint of apiEndpoints) {
        try {
            console.log(`🔍 测试 ${endpoint}...`);
            const response = await fetch(`${DEPLOYED_URL}${endpoint}`, {
                headers: {
                    'Authorization': 'Bearer test-token'
                }
            });
            
            console.log(`   状态: ${response.status} ${response.ok || response.status === 401 ? '✅' : '❌'}`);
            
            if (response.status === 401) {
                console.log('   ℹ️ 需要认证（正常）');
            } else if (!response.ok) {
                console.log(`   ❌ 响应异常: ${response.statusText}`);
            }
            
        } catch (error) {
            console.log(`   ❌ 请求失败: ${error.message}`);
        }
    }

    // 3. 检查Cloudflare Pages Functions部署状态
    console.log('');
    console.log('3️⃣ 检查Functions部署状态');
    console.log('──────────────────────────');
    
    try {
        console.log('🔍 测试产品API...');
        const productsResponse = await fetch(`${DEPLOYED_URL}/api/admin/products`, {
            headers: {
                'Authorization': 'Bearer test-token'
            }
        });
        
        if (productsResponse.ok) {
            const result = await productsResponse.json();
            console.log('✅ 产品API部署成功');
            console.log(`   响应格式: ${result.success ? '正确' : '需要修复'}`);
            console.log(`   数据条数: ${result.data ? result.data.length : 0}`);
        } else {
            console.log('❌ 产品API部署失败');
            console.log(`   状态码: ${productsResponse.status}`);
            
            if (productsResponse.status === 404) {
                console.log('   💡 可能原因: Functions目录未正确部署到dist目录');
            }
        }
        
    } catch (error) {
        console.log('❌ API测试失败:', error.message);
    }

    // 4. 图片上传测试
    console.log('');
    console.log('4️⃣ 测试图片上传功能');
    console.log('──────────────────────────');
    
    try {
        console.log('🖼️ 测试图片上传端点...');
        
        // 创建测试图片数据（小的base64图片）
        const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        
        const uploadResponse = await fetch(`${DEPLOYED_URL}/api/upload-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token'
            },
            body: JSON.stringify({
                imageData: testImageData,
                fileName: 'test-upload.png'
            })
        });
        
        if (uploadResponse.ok) {
            const result = await uploadResponse.json();
            console.log('✅ 图片上传功能正常');
            console.log(`   返回URL: ${result.url ? '有URL' : '无URL'}`);
        } else {
            console.log('❌ 图片上传功能异常');
            console.log(`   状态码: ${uploadResponse.status}`);
            console.log(`   响应: ${await uploadResponse.text()}`);
        }
        
    } catch (error) {
        console.log('❌ 图片上传测试失败:', error.message);
    }

    // 5. 产品数据持久化测试
    console.log('');
    console.log('5️⃣ 测试产品数据持久化');
    console.log('──────────────────────────');
    
    try {
        console.log('📝 创建测试产品...');
        
        const testProduct = {
            product_code: `DEPLOY-TEST-${Date.now()}`,
            name_zh: '部署测试产品',
            name_en: 'Deploy Test Product',
            description_zh: '用于测试部署后的产品功能',
            description_en: 'Test product for deployed functionality',
            category: 'adhesive',
            price: 99.99,
            image_url: 'https://example.com/test.jpg',
            is_active: true
        };
        
        const createResponse = await fetch(`${DEPLOYED_URL}/api/admin/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token'
            },
            body: JSON.stringify(testProduct)
        });
        
        if (createResponse.ok) {
            const createResult = await createResponse.json();
            console.log('✅ 产品创建成功');
            console.log(`   产品ID: ${createResult.data?.id || '未知'}`);
            
            // 测试数据回显
            if (createResult.data?.id) {
                console.log('');
                console.log('🔄 测试数据回显功能...');
                
                const getResponse = await fetch(`${DEPLOYED_URL}/api/admin/products/${createResult.data.id}`, {
                    headers: {
                        'Authorization': 'Bearer test-token'
                    }
                });
                
                if (getResponse.ok) {
                    const getResult = await getResponse.json();
                    console.log('✅ 数据回显成功');
                    console.log(`   产品代码: ${getResult.data?.[0]?.product_code || '缺失'}`);
                    console.log(`   中文名称: ${getResult.data?.[0]?.name_zh || '缺失'}`);
                    console.log(`   英文名称: ${getResult.data?.[0]?.name_en || '缺失'}`);
                } else {
                    console.log('❌ 数据回显失败');
                }
            }
            
        } else {
            console.log('❌ 产品创建失败');
            console.log(`   状态码: ${createResponse.status}`);
            const errorText = await createResponse.text();
            console.log(`   错误信息: ${errorText}`);
        }
        
    } catch (error) {
        console.log('❌ 产品持久化测试失败:', error.message);
    }

    console.log('');
    console.log('📋 测试总结');
    console.log('═══════════════════════════════════════');
    console.log('💡 如果发现问题，可能的修复方向:');
    console.log('1. 检查Cloudflare Pages部署配置');
    console.log('2. 确认Functions目录正确复制到dist');
    console.log('3. 验证环境变量设置（数据库连接、R2配置）');
    console.log('4. 检查路由配置和重写规则');
    console.log('5. 确认构建输出包含所有必要文件');
    
    console.log('');
    console.log('🏁 测试完成');
}

// 运行测试
testDeployedPlatform().catch(console.error);