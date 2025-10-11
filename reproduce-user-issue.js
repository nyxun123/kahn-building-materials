// 专门复现用户问题的测试脚本
// 模拟用户的操作流程：上传图片 → 保存产品 → 编辑时数据丢失

async function reproduceUserIssue() {
    console.log('🚨 复现用户报告的数据持久化问题');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');

    // 1. 首先检查当前数据库状态
    console.log('1️⃣ 检查当前数据库状态');
    console.log('─────────────────────────────────');
    
    try {
        const dbResponse = await fetch('http://localhost:8788/api/admin/products', {
            headers: {
                'Authorization': 'Bearer test-token'
            }
        });
        
        const dbResult = await dbResponse.json();
        
        if (dbResponse.ok) {
            console.log(`✅ 数据库连接正常，当前有 ${dbResult.data?.length || 0} 个产品`);
            if (dbResult.data && dbResult.data.length > 0) {
                console.log('现有产品列表:');
                dbResult.data.forEach(product => {
                    console.log(`   - ID: ${product.id}, 代码: ${product.product_code}, 名称: ${product.name_zh}`);
                });
            }
        } else {
            console.log('❌ 数据库连接异常:', dbResult);
            return;
        }
    } catch (error) {
        console.log('❌ 数据库连接错误:', error);
        return;
    }
    console.log('');

    // 2. 模拟用户操作：创建一个完整的产品
    console.log('2️⃣ 模拟用户创建产品（包含完整信息）');
    console.log('─────────────────────────────────');
    
    const timestamp = Date.now();
    const fullProductData = {
        product_code: `USER-TEST-${timestamp}`,
        name_zh: '用户测试产品',
        name_en: 'User Test Product',
        name_ru: 'Пользователь тестовый продукт',
        description_zh: '这是用户创建的测试产品，包含完整的产品信息',
        description_en: 'This is a test product created by user with complete information',
        description_ru: 'Это тестовый продукт, созданный пользователем с полной информацией',
        specifications_zh: '规格：25kg/包',
        specifications_en: 'Specification: 25kg/bag',
        specifications_ru: 'Спецификация: 25кг/мешок',
        applications_zh: '适用于壁纸粘贴',
        applications_en: 'Suitable for wallpaper installation',
        applications_ru: 'Подходит для поклейки обоев',
        category: 'adhesive',
        price: 45.99,
        price_range: '40-50元/包',
        features_zh: JSON.stringify(['强力粘接', '环保无毒', '快速干燥']),
        features_en: JSON.stringify(['Strong adhesion', 'Eco-friendly', 'Quick drying']),
        features_ru: JSON.stringify(['Сильная адгезия', 'Экологически чистый', 'Быстрое высыхание']),
        image_url: 'https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/products/test-image.png',
        gallery_images: '',
        packaging_options_zh: '25kg装袋装',
        packaging_options_en: '25kg bag packaging',
        packaging_options_ru: '25кг мешковая упаковка',
        tags: 'wallpaper,adhesive,eco-friendly',
        is_active: true,
        is_featured: false,
        sort_order: 100,
        stock_quantity: 50,
        min_order_quantity: 1,
        meta_title_zh: '用户测试产品 - 壁纸胶',
        meta_title_en: 'User Test Product - Wallpaper Adhesive',
        meta_title_ru: 'Пользователь тестовый продукт - Клей для обоев',
        meta_description_zh: '高质量的壁纸胶产品',
        meta_description_en: 'High quality wallpaper adhesive product',
        meta_description_ru: 'Высококачественный клей для обоев'
    };

    console.log('📦 发送产品数据:');
    console.log(`   产品代码: ${fullProductData.product_code}`);
    console.log(`   中文名称: ${fullProductData.name_zh}`);
    console.log(`   英文名称: ${fullProductData.name_en}`);
    console.log(`   价格: ${fullProductData.price}`);
    console.log(`   图片URL: ${fullProductData.image_url}`);
    console.log(`   规格: ${fullProductData.specifications_zh}`);
    console.log('');

    // 发送创建请求
    const createResponse = await fetch('http://localhost:8788/api/admin/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify(fullProductData)
    });

    const createResult = await createResponse.json();
    
    if (!createResponse.ok || !createResult.data) {
        console.log('❌ 产品创建失败:', createResult);
        console.log('响应状态:', createResponse.status);
        console.log('响应头:', Object.fromEntries(createResponse.headers.entries()));
        return;
    }

    const productId = createResult.data.id;
    console.log('✅ 产品创建成功!');
    console.log(`🆔 产品ID: ${productId}`);
    console.log('');

    // 3. 立即检查数据库中的实际保存情况
    console.log('3️⃣ 检查数据库中的实际保存情况');
    console.log('─────────────────────────────────');
    
    // 等待一点时间确保数据库写入完成
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 直接查询数据库验证数据是否正确保存
    const dbCheckResponse = await fetch(`http://localhost:8788/api/admin/products/${productId}`, {
        headers: {
            'Authorization': 'Bearer test-token'
        }
    });

    const dbCheckResult = await dbCheckResponse.json();
    
    if (!dbCheckResponse.ok || !dbCheckResult.data || dbCheckResult.data.length === 0) {
        console.log('❌ 数据库查询失败:', dbCheckResult);
        return;
    }

    const savedProduct = dbCheckResult.data[0];
    console.log('✅ 数据库查询成功');
    console.log('');
    console.log('📊 数据保存验证:');
    console.log('┌──────────────────┬─────────────────────────────────────────────────┬──────────┐');
    console.log('│ 字段             │ 原始值                                          │ 保存状态 │');
    console.log('├──────────────────┼─────────────────────────────────────────────────┼──────────┤');
    
    const fields = [
        ['product_code', '产品代码'],
        ['name_zh', '中文名称'],
        ['name_en', '英文名称'],
        ['description_zh', '中文描述'],
        ['price', '价格'],
        ['image_url', '图片URL'],
        ['specifications_zh', '规格'],
        ['applications_zh', '应用'],
        ['features_zh', '特性'],
        ['category', '分类'],
        ['is_active', '状态']
    ];

    let allFieldsCorrect = true;
    for (const [field, label] of fields) {
        const original = fullProductData[field];
        const saved = savedProduct[field];
        const isCorrect = original === saved || 
                         (typeof original === 'boolean' && saved === (original ? 1 : 0));
        
        if (!isCorrect) allFieldsCorrect = false;
        
        const status = isCorrect ? '✅ 正确' : '❌ 错误';
        const originalStr = String(original).substring(0, 45) + (String(original).length > 45 ? '...' : '');
        console.log(`│ ${label.padEnd(14)} │ ${originalStr.padEnd(45)} │ ${status.padEnd(8)} │`);
    }
    console.log('└──────────────────┴─────────────────────────────────────────────────┴──────────┘');
    console.log('');

    if (!allFieldsCorrect) {
        console.log('⚠️ 发现数据保存问题！某些字段未正确保存到数据库。');
        console.log('');
    }

    // 4. 模拟用户点击"编辑"按钮 - 测试编辑页面数据加载
    console.log('4️⃣ 模拟用户点击"编辑"按钮（测试编辑页面数据加载）');
    console.log('─────────────────────────────────');
    
    // 再次获取产品数据（模拟编辑页面加载）
    const editLoadResponse = await fetch(`http://localhost:8788/api/admin/products/${productId}`, {
        headers: {
            'Authorization': 'Bearer test-token'
        }
    });

    const editLoadResult = await editLoadResponse.json();
    
    if (!editLoadResponse.ok || !editLoadResult.data || editLoadResult.data.length === 0) {
        console.log('❌ 编辑页面数据加载失败:', editLoadResult);
        return;
    }

    const loadedProduct = editLoadResult.data[0];
    console.log('✅ 编辑页面数据加载成功');
    console.log('');

    // 5. 详细对比加载的数据与原始数据
    console.log('5️⃣ 详细对比编辑页面加载的数据');
    console.log('─────────────────────────────────');
    
    console.log('📊 编辑页面数据对比:');
    console.log('┌──────────────────┬─────────────────────────────────────────────────┬──────────┐');
    console.log('│ 字段             │ 加载值                                          │ 对比状态 │');
    console.log('├──────────────────┼─────────────────────────────────────────────────┼──────────┤');
    
    let editDataCorrect = true;
    for (const [field, label] of fields) {
        const original = fullProductData[field];
        const loaded = loadedProduct[field];
        const isCorrect = original === loaded || 
                         (typeof original === 'boolean' && loaded === (original ? 1 : 0));
        
        if (!isCorrect) editDataCorrect = false;
        
        const status = isCorrect ? '✅ 正确' : '❌ 丢失';
        const loadedStr = String(loaded || 'null').substring(0, 45) + (String(loaded || 'null').length > 45 ? '...' : '');
        console.log(`│ ${label.padEnd(14)} │ ${loadedStr.padEnd(45)} │ ${status.padEnd(8)} │`);
    }
    console.log('└──────────────────┴─────────────────────────────────────────────────┴──────────┘');
    console.log('');

    // 6. 总结问题
    console.log('6️⃣ 问题诊断总结');
    console.log('─────────────────────────────────');
    
    if (allFieldsCorrect && editDataCorrect) {
        console.log('🎉 测试通过！数据持久化和加载功能正常');
        console.log('   - 产品数据正确保存到数据库');
        console.log('   - 编辑页面正确加载所有数据');
    } else {
        console.log('🚨 发现问题！数据持久化或加载存在问题');
        
        if (!allFieldsCorrect) {
            console.log('   ❌ 数据保存阶段：某些字段未正确写入数据库');
        }
        
        if (!editDataCorrect) {
            console.log('   ❌ 数据加载阶段：编辑页面未正确加载某些字段');
        }
        
        console.log('');
        console.log('📋 需要检查的环节:');
        console.log('   1. 产品创建API的字段映射和数据库写入逻辑');
        console.log('   2. 产品获取API的数据库查询和字段返回逻辑');
        console.log('   3. 前端ProductForm组件的数据绑定和显示逻辑');
        console.log('   4. 数据库表结构是否支持所有字段');
    }

    return {
        productId,
        allFieldsCorrect,
        editDataCorrect,
        originalData: fullProductData,
        savedData: savedProduct,
        loadedData: loadedProduct
    };
}

// 运行问题复现测试
reproduceUserIssue().catch(console.error);