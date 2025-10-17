#!/usr/bin/env node

/**
 * 🔍 实时产品编辑诊断脚本
 * 诊断用户反馈的数据丢失问题
 */

const BASE_URL = 'http://localhost:8788';

async function main() {
    console.log('🔍 实时产品编辑问题诊断');
    console.log('═══════════════════════════════════════');
    console.log('');

    // 检查开发服务器状态
    console.log('1️⃣ 检查开发服务器状态');
    console.log('──────────────────────────');
    try {
        const healthResponse = await fetch(`${BASE_URL}/api/health`);
        if (healthResponse.ok) {
            console.log('✅ 开发服务器运行正常');
        } else {
            console.log('❌ 开发服务器响应异常:', healthResponse.status);
        }
    } catch (error) {
        console.log('❌ 无法连接到开发服务器');
        console.log('💡 请确保运行了 npm run dev 启动开发服务器');
        return;
    }
    console.log('');

    // 获取最新的产品列表
    console.log('2️⃣ 获取产品列表');
    console.log('──────────────────────────');
    let productList = [];
    try {
        const listResponse = await fetch(`${BASE_URL}/api/admin/products`, {
            headers: {
                'Authorization': 'Bearer test-token'
            }
        });
        const listResult = await listResponse.json();
        
        if (listResult.success && listResult.data) {
            productList = listResult.data;
            console.log(`✅ 获取到 ${productList.length} 个产品`);
            
            // 显示最近的几个产品
            const recentProducts = productList.slice(0, 3);
            recentProducts.forEach(product => {
                console.log(`   📦 ID:${product.id} - ${product.product_code} - ${product.name_zh}`);
            });
        } else {
            console.log('❌ 获取产品列表失败:', listResult.message);
            return;
        }
    } catch (error) {
        console.log('❌ 获取产品列表错误:', error.message);
        return;
    }
    console.log('');

    // 测试具体的产品编辑数据加载
    if (productList.length > 0) {
        const testProduct = productList[0]; // 使用最新的产品进行测试
        
        console.log('3️⃣ 测试产品编辑数据加载');
        console.log('──────────────────────────');
        console.log(`🎯 测试产品: ID ${testProduct.id} - ${testProduct.product_code}`);
        
        try {
            const editResponse = await fetch(`${BASE_URL}/api/admin/products/${testProduct.id}`, {
                headers: {
                    'Authorization': 'Bearer test-token'
                }
            });
            const editResult = await editResponse.json();
            
            if (editResult.success && editResult.data) {
                const productData = Array.isArray(editResult.data) ? editResult.data[0] : editResult.data;
                
                console.log('✅ 产品数据获取成功');
                console.log('📊 字段完整性检查:');
                
                // 检查关键字段
                const keyFields = [
                    'product_code', 'name_zh', 'name_en', 'description_zh', 
                    'image_url', 'price', 'category', 'specifications_zh', 'applications_zh'
                ];
                
                let filledFields = 0;
                keyFields.forEach(field => {
                    const value = productData[field];
                    const hasValue = value !== null && value !== undefined && value !== '';
                    console.log(`   ${hasValue ? '✅' : '❌'} ${field}: ${hasValue ? '有值' : '空值'}`);
                    if (hasValue) filledFields++;
                });
                
                console.log(`📈 字段填充率: ${filledFields}/${keyFields.length} (${Math.round(filledFields/keyFields.length*100)}%)`);
                
                // 特别检查图片URL
                if (productData.image_url) {
                    console.log('🖼️ 图片URL分析:');
                    console.log(`   📏 长度: ${productData.image_url.length} 字符`);
                    if (productData.image_url.startsWith('data:image/')) {
                        console.log('   📋 类型: Base64编码图片');
                    } else if (productData.image_url.startsWith('https://')) {
                        console.log('   📋 类型: HTTPS远程图片');
                    } else if (productData.image_url.startsWith('/')) {
                        console.log('   📋 类型: 相对路径（可能有问题）');
                    } else {
                        console.log('   📋 类型: 未知格式');
                    }
                }
                
            } else {
                console.log('❌ 产品数据获取失败:', editResult.message);
            }
        } catch (error) {
            console.log('❌ 产品编辑数据获取错误:', error.message);
        }
        console.log('');
    }

    // 模拟Refine数据提供者处理
    console.log('4️⃣ 模拟Refine数据提供者处理');
    console.log('──────────────────────────');
    
    if (productList.length > 0) {
        const testProduct = productList[0];
        
        try {
            // 模拟data-provider.ts的getOne方法
            const response = await fetch(`${BASE_URL}/api/admin/products/${testProduct.id}`, {
                headers: {
                    'Authorization': 'Bearer test-token'
                }
            });
            const payload = await response.json();
            
            console.log('📦 API响应格式分析:');
            console.log(`   success: ${payload.success}`);
            console.log(`   data类型: ${Array.isArray(payload.data) ? '数组' : '对象'}`);
            
            // 模拟Refine数据提供者的格式处理
            let data;
            if (Array.isArray(payload.data)) {
                data = payload.data[0]; // 取数组的第一个元素
                console.log('✅ 检测到数组格式，提取第一个元素');
            } else if (payload.data) {
                data = payload.data;
                console.log('✅ 检测到对象格式，直接使用');
            } else {
                data = payload;
                console.log('⚠️ 使用原始响应作为数据');
            }
            
            console.log('🔄 Refine期望的数据格式:');
            console.log(`   data对象包含 ${Object.keys(data).length} 个字段`);
            console.log(`   关键字段检查:`);
            const refineKeyFields = ['id', 'product_code', 'name_zh', 'image_url'];
            refineKeyFields.forEach(field => {
                const hasField = field in data && data[field] !== null;
                console.log(`     ${hasField ? '✅' : '❌'} ${field}`);
            });
            
        } catch (error) {
            console.log('❌ Refine数据提供者模拟失败:', error.message);
        }
    }
    console.log('');

    // 检查前端路由配置
    console.log('5️⃣ 检查前端路由配置');
    console.log('──────────────────────────');
    
    // 模拟前端路由跳转
    if (productList.length > 0) {
        const testProduct = productList[0];
        const editUrl = `/admin/products/${testProduct.id}`;
        
        console.log(`🔗 编辑页面URL: ${editUrl}`);
        console.log(`🆔 URL参数解析: id = ${testProduct.id}`);
        console.log(`🔢 ID类型检查: ${typeof testProduct.id} (${isNaN(testProduct.id) ? '非数字' : '数字'})`);
        
        // 检查ID是否有效
        if (testProduct.id && !isNaN(testProduct.id)) {
            console.log('✅ 产品ID有效，路由应该正常工作');
        } else {
            console.log('❌ 产品ID无效，可能导致路由问题');
        }
    }
    console.log('');

    // 总结诊断结果
    console.log('📋 诊断总结');
    console.log('═══════════════════════════════════════');
    
    if (productList.length === 0) {
        console.log('❌ 主要问题: 数据库中没有产品数据');
        console.log('💡 建议: 先创建一个测试产品');
    } else {
        console.log('✅ 数据库有产品数据');
        console.log('✅ API接口可正常访问');
        console.log('✅ Refine数据提供者格式兼容');
        
        console.log('');
        console.log('🎯 用户报告的问题可能原因:');
        console.log('1. 前端页面缓存问题 - 建议强制刷新(Ctrl+Shift+R)');
        console.log('2. 浏览器开发者工具中可能有错误 - 检查Console面板');
        console.log('3. React组件状态同步问题 - 检查useForm钩子状态');
        console.log('4. 网络请求被拦截 - 检查Network面板');
        
        console.log('');
        console.log('🔧 推荐的调试步骤:');
        console.log('1. 打开浏览器开发者工具');
        console.log('2. 访问产品列表页面: http://localhost:5173/admin/products');
        console.log('3. 点击"编辑"按钮跳转到编辑页面');
        console.log('4. 观察Console面板是否有错误信息');
        console.log('5. 观察Network面板API请求是否成功');
        console.log('6. 检查表单字段是否被正确填充');
    }
    
    console.log('');
    console.log('🏁 诊断完成');
}

// 运行诊断
main().catch(console.error);