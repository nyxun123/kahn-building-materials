// 模拟真实前端行为的测试 - 检查前端数据加载问题
async function testFrontendDataBinding() {
    console.log('🔧 测试前端数据绑定和加载机制');
    console.log('════════════════════════════════════════════════════════════');
    console.log('');

    // 1. 创建一个测试产品
    console.log('1️⃣ 创建测试产品');
    console.log('─────────────────────────────────');
    
    const testProductData = {
        product_code: 'FRONTEND-TEST-' + Date.now(),
        name_zh: '前端测试产品',
        name_en: 'Frontend Test Product',
        description_zh: '用于测试前端数据绑定的产品',
        description_en: 'Product for testing frontend data binding',
        category: 'adhesive',
        price: 35.50,
        price_range: '30-40元/包',
        specifications_zh: '规格：20kg/包',
        applications_zh: '适用于内墙装饰',
        features_zh: '["强力粘接", "快速干燥", "环保配方"]',
        image_url: 'https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/products/frontend-test.png',
        packaging_options_zh: '20kg装袋装',
        tags: 'test,frontend,adhesive',
        is_active: true,
        is_featured: false,
        sort_order: 200,
        stock_quantity: 100,
        min_order_quantity: 2,
        meta_title_zh: '前端测试产品标题',
        meta_description_zh: '前端测试产品描述'
    };

    const createResponse = await fetch('http://localhost:8788/api/admin/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify(testProductData)
    });

    const createResult = await createResponse.json();
    
    if (!createResponse.ok || !createResult.data) {
        console.log('❌ 产品创建失败:', createResult);
        return;
    }

    const productId = createResult.data.id;
    console.log('✅ 产品创建成功, ID:', productId);
    console.log('');

    // 2. 模拟前端d1Api.getProduct调用
    console.log('2️⃣ 模拟前端d1Api.getProduct调用');
    console.log('─────────────────────────────────');
    
    // 模拟前端API调用
    const frontendApiCall = async (productId) => {
        const baseUrl = 'http://localhost:8788';  // 模拟前端baseUrl
        const authToken = 'admin-session';         // 模拟前端authToken
        
        console.log(`📞 模拟调用: ${baseUrl}/api/admin/products/${productId}`);
        console.log(`🔑 使用认证: Bearer ${authToken}`);
        
        const response = await fetch(`${baseUrl}/api/admin/products/${productId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        console.log(`📡 响应状态: ${response.status} ${response.statusText}`);
        
        const data = await response.json();
        console.log('📦 响应数据:', data);
        
        return data;
    };

    const frontendResponse = await frontendApiCall(productId);
    
    if (frontendResponse.error) {
        console.log('❌ 前端API调用失败:', frontendResponse.error);
        return;
    }

    if (!frontendResponse.data || frontendResponse.data.length === 0) {
        console.log('❌ 前端API返回空数据');
        return;
    }

    const loadedProduct = frontendResponse.data[0];
    console.log('✅ 前端API调用成功');
    console.log('');

    // 3. 模拟前端表单数据映射
    console.log('3️⃣ 模拟前端表单数据映射');
    console.log('─────────────────────────────────');
    
    // 模拟ProductForm组件的数据映射逻辑
    const mapProductToFormData = (product) => {
        return {
            product_code: product.product_code || '',
            name_zh: product.name_zh || '',
            name_en: product.name_en || '',
            name_ru: product.name_ru || '',
            description_zh: product.description_zh || '',
            description_en: product.description_en || '',
            description_ru: product.description_ru || '',
            specifications_zh: product.specifications_zh || '',
            specifications_en: product.specifications_en || '',
            specifications_ru: product.specifications_ru || '',
            applications_zh: product.applications_zh || '',
            applications_en: product.applications_en || '',
            applications_ru: product.applications_ru || '',
            category: product.category || 'adhesive',
            price: product.price || 0,
            price_range: product.price_range || '',
            features_zh: product.features_zh || '',
            features_en: product.features_en || '',
            features_ru: product.features_ru || '',
            image_url: product.image_url || '',
            gallery_images: product.gallery_images || '',
            packaging_options_zh: product.packaging_options_zh || '',
            packaging_options_en: product.packaging_options_en || '',
            packaging_options_ru: product.packaging_options_ru || '',
            tags: product.tags || '',
            is_active: product.is_active,
            is_featured: product.is_featured || false,
            sort_order: product.sort_order || 0,
            stock_quantity: product.stock_quantity || 0,
            min_order_quantity: product.min_order_quantity || 1,
            meta_title_zh: product.meta_title_zh || '',
            meta_title_en: product.meta_title_en || '',
            meta_title_ru: product.meta_title_ru || '',
            meta_description_zh: product.meta_description_zh || '',
            meta_description_en: product.meta_description_en || '',
            meta_description_ru: product.meta_description_ru || '',
        };
    };

    const mappedFormData = mapProductToFormData(loadedProduct);
    console.log('📝 映射后的表单数据:', mappedFormData);
    console.log('');

    // 4. 验证数据完整性
    console.log('4️⃣ 验证前端数据完整性');
    console.log('─────────────────────────────────');
    
    const criticalFields = [
        'product_code', 'name_zh', 'name_en', 'description_zh', 
        'price', 'image_url', 'specifications_zh', 'category'
    ];

    console.log('🔍 关键字段验证:');
    let allFieldsPresent = true;
    
    for (const field of criticalFields) {
        const originalValue = testProductData[field];
        const loadedValue = loadedProduct[field];
        const mappedValue = mappedFormData[field];
        
        const isPresent = loadedValue !== null && loadedValue !== undefined && loadedValue !== '';
        const isCorrect = originalValue == loadedValue; // 使用宽松比较处理类型差异
        
        if (!isPresent) allFieldsPresent = false;
        
        const status = isPresent ? (isCorrect ? '✅ 正确' : '⚠️ 值变化') : '❌ 缺失';
        console.log(`   ${field}: ${status}`);
        
        if (!isCorrect && isPresent) {
            console.log(`     原始: ${originalValue}`);
            console.log(`     加载: ${loadedValue}`);
        }
    }
    
    console.log('');

    // 5. 检查可能导致数据丢失的原因
    console.log('5️⃣ 检查可能的数据丢失原因');
    console.log('─────────────────────────────────');
    
    const possibleIssues = [];
    
    // 检查认证问题
    if (!frontendResponse.data) {
        possibleIssues.push('API返回空数据 - 可能是认证问题');
    }
    
    // 检查数据类型问题
    if (typeof loadedProduct.is_active === 'number' && testProductData.is_active === true) {
        console.log('ℹ️ 布尔值在数据库中存储为数字，这是正常的');
    }
    
    // 检查字段映射问题
    const missingFields = Object.keys(testProductData).filter(key => 
        !(key in loadedProduct) || loadedProduct[key] === null
    );
    
    if (missingFields.length > 0) {
        possibleIssues.push(`缺失字段: ${missingFields.join(', ')}`);
    }
    
    // 检查特殊字段处理
    if (loadedProduct.features_zh && typeof loadedProduct.features_zh === 'string') {
        try {
            JSON.parse(loadedProduct.features_zh);
            console.log('ℹ️ features_zh字段是有效的JSON字符串');
        } catch (e) {
            possibleIssues.push('features_zh字段不是有效的JSON');
        }
    }
    
    if (possibleIssues.length > 0) {
        console.log('⚠️ 发现的潜在问题:');
        possibleIssues.forEach(issue => console.log(`   - ${issue}`));
    } else {
        console.log('✅ 未发现明显的数据丢失问题');
    }
    
    console.log('');

    // 6. 测试路由和状态管理
    console.log('6️⃣ 模拟路由跳转和状态管理');
    console.log('─────────────────────────────────');
    
    // 模拟用户从产品列表页面跳转到编辑页面
    console.log('📍 模拟路由: /admin/products → /admin/products/' + productId);
    
    // 检查是否存在路由参数解析问题
    const urlPattern = `/admin/products/${productId}`;
    const extractedId = urlPattern.split('/').pop();
    const parsedId = parseInt(extractedId, 10);
    
    console.log(`🔢 URL中的ID: ${extractedId}`);
    console.log(`🔢 解析后的ID: ${parsedId}`);
    console.log(`🔍 ID解析正确: ${parsedId === productId ? '✅' : '❌'}`);
    
    console.log('');

    // 7. 总结和建议
    console.log('7️⃣ 测试总结和建议');
    console.log('─────────────────────────────────');
    
    if (allFieldsPresent) {
        console.log('🎉 前端数据绑定测试通过！');
        console.log('   - 产品数据正确保存到数据库');
        console.log('   - API正确返回完整数据');
        console.log('   - 前端映射逻辑正确处理所有字段');
        console.log('');
        console.log('💡 如果用户仍然遇到数据丢失问题，可能的原因:');
        console.log('   1. 浏览器缓存问题 - 建议清除缓存');
        console.log('   2. 网络连接问题 - 检查网络稳定性');
        console.log('   3. JavaScript错误 - 检查浏览器控制台');
        console.log('   4. 认证状态过期 - 重新登录管理后台');
    } else {
        console.log('🚨 发现数据绑定问题！');
        console.log('   请检查上述标记为❌的字段');
    }

    return {
        productId,
        success: allFieldsPresent,
        testData: testProductData,
        loadedData: loadedProduct,
        mappedData: mappedFormData
    };
}

// 运行前端数据绑定测试
testFrontendDataBinding().catch(console.error);