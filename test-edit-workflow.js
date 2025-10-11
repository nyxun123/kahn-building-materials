// 测试产品编辑流程中的图片持久化问题
async function testEditWorkflow() {
    console.log('🧪 测试产品编辑流程中的图片持久化...');
    console.log('');

    // 1. 创建一个带图片的新产品
    console.log('1️⃣ 创建测试产品...');
    const createResponse = await fetch('http://localhost:8788/api/admin/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
            product_code: 'EDIT-TEST-' + Date.now(),
            name_zh: '编辑测试产品',
            name_en: 'Edit Test Product',
            description_zh: '用于测试编辑流程图片持久化的产品',
            category: 'adhesive',
            price: 25.00,
            image_url: 'https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/products/test-image.png',
            is_active: true
        })
    });

    const createResult = await createResponse.json();
    if (!createResponse.ok || !createResult.data) {
        console.error('❌ 产品创建失败:', createResult);
        return;
    }

    const productId = createResult.data.id;
    console.log('✅ 产品创建成功, ID:', productId);
    console.log('📷 初始图片URL:', createResult.data.image_url);
    console.log('');

    // 2. 获取产品（模拟编辑页面加载）
    console.log('2️⃣ 获取产品数据（模拟编辑页面加载）...');
    const getResponse = await fetch(`http://localhost:8788/api/admin/products/${productId}`, {
        headers: {
            'Authorization': 'Bearer test-token'
        }
    });

    const getResult = await getResponse.json();
    if (!getResponse.ok || !getResult.data || getResult.data.length === 0) {
        console.error('❌ 产品获取失败:', getResult);
        return;
    }

    const loadedProduct = getResult.data[0];
    console.log('✅ 产品获取成功');
    console.log('📷 加载的图片URL:', loadedProduct.image_url);
    console.log('🔍 图片URL是否保持:', loadedProduct.image_url === createResult.data.image_url ? '✅ 保持' : '❌ 改变');
    console.log('');

    // 3. 进行部分更新（模拟编辑保存）
    console.log('3️⃣ 更新产品信息（保持图片不变）...');
    const updateResponse = await fetch(`http://localhost:8788/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
            name_zh: loadedProduct.name_zh + ' (已编辑)',
            description_zh: loadedProduct.description_zh + ' - 更新了描述',
            image_url: loadedProduct.image_url, // 保持原图片URL
            price: 30.00 // 修改价格
        })
    });

    const updateResult = await updateResponse.json();
    if (!updateResponse.ok || !updateResult.data) {
        console.error('❌ 产品更新失败:', updateResult);
        return;
    }

    console.log('✅ 产品更新成功');
    console.log('📷 更新后图片URL:', updateResult.data.image_url);
    console.log('🔍 图片URL是否保持:', updateResult.data.image_url === loadedProduct.image_url ? '✅ 保持' : '❌ 改变');
    console.log('');

    // 4. 再次获取产品验证持久化
    console.log('4️⃣ 再次获取产品验证数据持久化...');
    const finalGetResponse = await fetch(`http://localhost:8788/api/admin/products/${productId}`, {
        headers: {
            'Authorization': 'Bearer test-token'
        }
    });

    const finalGetResult = await finalGetResponse.json();
    if (!finalGetResponse.ok || !finalGetResult.data || finalGetResult.data.length === 0) {
        console.error('❌ 最终产品获取失败:', finalGetResult);
        return;
    }

    const finalProduct = finalGetResult.data[0];
    console.log('✅ 最终产品获取成功');
    console.log('📷 最终图片URL:', finalProduct.image_url);
    console.log('🔍 图片URL完整性:', finalProduct.image_url === createResult.data.image_url ? '✅ 完整保持' : '❌ 发生变化');
    
    // 5. 详细对比分析
    console.log('');
    console.log('📊 详细对比分析:');
    console.log('┌────────────────┬─────────────────────────────────────────────────┐');
    console.log('│ 阶段           │ 图片URL                                         │');
    console.log('├────────────────┼─────────────────────────────────────────────────┤');
    console.log(`│ 1. 创建时      │ ${createResult.data.image_url || 'null'}`.padEnd(55) + '│');
    console.log(`│ 2. 首次加载    │ ${loadedProduct.image_url || 'null'}`.padEnd(55) + '│');
    console.log(`│ 3. 更新后      │ ${updateResult.data.image_url || 'null'}`.padEnd(55) + '│');
    console.log(`│ 4. 最终加载    │ ${finalProduct.image_url || 'null'}`.padEnd(55) + '│');
    console.log('└────────────────┴─────────────────────────────────────────────────┘');

    // 6. 测试结论
    const isConsistent = [
        createResult.data.image_url,
        loadedProduct.image_url,
        updateResult.data.image_url,
        finalProduct.image_url
    ].every(url => url === createResult.data.image_url);

    console.log('');
    if (isConsistent) {
        console.log('🎉 测试通过！图片在整个编辑流程中保持完整的持久化。');
    } else {
        console.log('⚠️ 测试发现问题！图片在编辑流程中发生了变化。');
        
        // 分析具体在哪个环节出现问题
        if (loadedProduct.image_url !== createResult.data.image_url) {
            console.log('🔍 问题出现在: 数据加载阶段');
        } else if (updateResult.data.image_url !== loadedProduct.image_url) {
            console.log('🔍 问题出现在: 数据更新阶段');
        } else if (finalProduct.image_url !== updateResult.data.image_url) {
            console.log('🔍 问题出现在: 数据库持久化阶段');
        }
    }

    return productId;
}

async function testExistingProductEdit() {
    console.log('🧪 测试现有产品的编辑功能...');
    console.log('');

    // 测试现有的产品ID 1和2（有相对路径图片URL的产品）
    const existingProductIds = [1, 2];

    for (const productId of existingProductIds) {
        console.log(`📋 测试产品 ID: ${productId}`);
        
        try {
            const response = await fetch(`http://localhost:8788/api/admin/products/${productId}`, {
                headers: {
                    'Authorization': 'Bearer test-token'
                }
            });

            const result = await response.json();
            if (response.ok && result.data && result.data.length > 0) {
                const product = result.data[0];
                console.log(`✅ 产品 ${productId} 获取成功`);
                console.log(`📝 产品代码: ${product.product_code}`);
                console.log(`🏷️ 中文名称: ${product.name_zh}`);
                console.log(`📷 图片URL: ${product.image_url}`);
                console.log(`📏 URL长度: ${product.image_url?.length || 0}`);
                
                if (product.image_url) {
                    if (product.image_url.startsWith('/images/')) {
                        console.log('⚠️ 使用相对路径，可能导致前端显示问题');
                    } else if (product.image_url.startsWith('https://')) {
                        console.log('✅ 使用完整HTTPS URL');
                    } else if (product.image_url.startsWith('data:')) {
                        console.log('✅ 使用Base64数据URL');
                    } else {
                        console.log('❓ 未知的URL格式');
                    }
                } else {
                    console.log('❌ 图片URL为空');
                }
            } else {
                console.log(`❌ 产品 ${productId} 获取失败`);
            }
        } catch (error) {
            console.error(`❌ 产品 ${productId} 获取错误:`, error);
        }
        
        console.log('');
    }
}

async function runAllTests() {
    console.log('🔬 开始完整的编辑流程测试...');
    console.log('');
    
    // 1. 测试现有产品
    await testExistingProductEdit();
    
    // 2. 测试新产品的编辑流程
    await testEditWorkflow();
}

runAllTests().catch(console.error);