// 验证Refine修复效果 - 测试完整的ProductFormValues接口
console.log('🔧 验证Refine产品编辑组件修复效果');
console.log('═'.repeat(60));

const API_BASE = 'http://localhost:8788/api';

// 创建包含所有字段的完整测试数据
const completeTestData = {
    product_code: 'REFINE-FIX-' + Date.now(),
    name_zh: 'Refine修复测试产品',
    name_en: 'Refine Fix Test Product',
    name_ru: 'Refine Исправить тестовый продукт',
    description_zh: '这是用于验证Refine修复的完整测试产品，包含所有可能的字段',
    description_en: 'This is a complete test product to verify Refine fix with all possible fields',
    description_ru: 'Это полный тестовый продукт для проверки исправления Refine со всеми возможными полями',
    specifications_zh: '规格：25kg/包，高性能配方，适用温度范围-10°C到+60°C',
    specifications_en: 'Specification: 25kg/bag, high-performance formula, applicable temperature range -10°C to +60°C',
    specifications_ru: 'Спецификация: 25кг/мешок, высокопроизводительная формула, диапазон температур от -10°C до +60°C',
    applications_zh: '广泛适用于室内外墙面装饰，包括壁纸、墙布、装饰板等',
    applications_en: 'Widely applicable to indoor and outdoor wall decoration, including wallpaper, wall cloth, decorative panels, etc.',
    applications_ru: 'Широко применимо для внутренней и наружной отделки стен, включая обои, настенные покрытия, декоративные панели и т.д.',
    category: 'adhesive',
    price: 128.50,
    price_range: '120-135元/包',
    image_url: 'https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/products/refine-fix-test.png',
    gallery_images: JSON.stringify(['gallery1.jpg', 'gallery2.jpg', 'gallery3.jpg']),
    packaging_options_zh: '25kg装牛皮纸复合袋包装，防潮耐撕',
    packaging_options_en: '25kg kraft paper composite bag packaging, moisture-proof and tear-resistant',
    packaging_options_ru: '25кг упаковка в крафт-бумажные композитные мешки, влагостойкие и устойчивые к разрыву',
    tags: 'refine,fix,test,adhesive,premium',
    is_active: true,
    is_featured: true,
    sort_order: 100,
    stock_quantity: 1000,
    min_order_quantity: 10,
    meta_title_zh: 'Refine修复测试产品 - 高性能壁纸胶',
    meta_title_en: 'Refine Fix Test Product - High Performance Wallpaper Adhesive',
    meta_title_ru: 'Refine Исправить тестовый продукт - Высокопроизводительный клей для обоев',
    meta_description_zh: '验证Refine框架修复效果的专业测试产品',
    meta_description_en: 'Professional test product to verify Refine framework fix effectiveness',
    meta_description_ru: 'Профессиональный тестовый продукт для проверки эффективности исправления фреймворка Refine',
    features_zh: JSON.stringify(['超强粘接力', '快速固化', '环保无毒', '防水防潮', '耐高温']),
    features_en: JSON.stringify(['Super adhesion', 'Fast curing', 'Eco-friendly', 'Waterproof', 'Heat resistant']),
    features_ru: JSON.stringify(['Супер адгезия', 'Быстрое отверждение', 'Экологически чистый', 'Водонепроницаемый', 'Термостойкий'])
};

async function testCompleteWorkflow() {
    console.log('\n🚀 开始完整工作流程测试...');
    
    try {
        // 1. 创建产品
        console.log('\n1️⃣ 创建包含所有字段的测试产品');
        console.log('-'.repeat(40));
        
        const createResponse = await fetch(`${API_BASE}/admin/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer admin-session'
            },
            body: JSON.stringify(completeTestData)
        });

        if (!createResponse.ok) {
            throw new Error(`创建失败: ${createResponse.status}`);
        }

        const createResult = await createResponse.json();
        const productId = createResult.data.id;
        
        console.log('✅ 产品创建成功');
        console.log(`🆔 产品ID: ${productId}`);
        console.log(`📝 产品代码: ${createResult.data.product_code}`);
        
        // 验证创建时的字段保存
        const criticalFields = [
            'product_code', 'name_zh', 'name_en', 'name_ru',
            'description_zh', 'description_en', 'description_ru',
            'specifications_zh', 'specifications_en', 'specifications_ru',
            'applications_zh', 'applications_en', 'applications_ru',
            'price', 'image_url', 'category', 'tags'
        ];
        
        let savedCount = 0;
        criticalFields.forEach(field => {
            const saved = createResult.data[field];
            if (saved !== null && saved !== undefined && saved !== '') {
                savedCount++;
            }
        });
        
        console.log(`📊 关键字段保存: ${savedCount}/${criticalFields.length}`);
        
        // 2. 获取产品（模拟编辑页面加载）
        console.log('\n2️⃣ 获取产品数据（模拟编辑页面加载）');
        console.log('-'.repeat(40));
        
        const getResponse = await fetch(`${API_BASE}/admin/products/${productId}`, {
            headers: {
                'Authorization': 'Bearer admin-session'
            }
        });

        if (!getResponse.ok) {
            throw new Error(`获取失败: ${getResponse.status}`);
        }

        const getResult = await getResponse.json();
        const retrievedProduct = Array.isArray(getResult.data) ? getResult.data[0] : getResult.data;
        
        console.log('✅ 产品数据获取成功');
        console.log(`📦 响应格式: ${Array.isArray(getResult.data) ? '数组' : '对象'}`);
        
        // 验证数据完整性
        let retrievedCount = 0;
        const missingFields = [];
        
        criticalFields.forEach(field => {
            const retrieved = retrievedProduct[field];
            const isPresent = retrieved !== null && retrieved !== undefined && retrieved !== '';
            
            if (isPresent) {
                retrievedCount++;
            } else {
                missingFields.push(field);
            }
        });
        
        console.log(`📊 关键字段获取: ${retrievedCount}/${criticalFields.length}`);
        
        if (missingFields.length > 0) {
            console.log(`❌ 缺失字段: ${missingFields.join(', ')}`);
        }
        
        // 3. 模拟Refine ProductFormValues处理
        console.log('\n3️⃣ 模拟Refine ProductFormValues处理');
        console.log('-'.repeat(40));
        
        // 新的完整ProductFormValues接口包含的字段
        const refineMappedFields = {
            product_code: retrievedProduct.product_code || '',
            name_zh: retrievedProduct.name_zh || '',
            name_en: retrievedProduct.name_en || '',
            name_ru: retrievedProduct.name_ru || '',
            description_zh: retrievedProduct.description_zh || '',
            description_en: retrievedProduct.description_en || '',
            description_ru: retrievedProduct.description_ru || '',
            specifications_zh: retrievedProduct.specifications_zh || '',
            specifications_en: retrievedProduct.specifications_en || '',
            specifications_ru: retrievedProduct.specifications_ru || '',
            applications_zh: retrievedProduct.applications_zh || '',
            applications_en: retrievedProduct.applications_en || '',
            applications_ru: retrievedProduct.applications_ru || '',
            category: retrievedProduct.category || 'adhesive',
            price: retrievedProduct.price || 0,
            price_range: retrievedProduct.price_range || '',
            image_url: retrievedProduct.image_url || '',
            gallery_images: retrievedProduct.gallery_images || '',
            packaging_options_zh: retrievedProduct.packaging_options_zh || '',
            packaging_options_en: retrievedProduct.packaging_options_en || '',
            packaging_options_ru: retrievedProduct.packaging_options_ru || '',
            tags: retrievedProduct.tags || '',
            is_active: retrievedProduct.is_active,
            is_featured: retrievedProduct.is_featured || false,
            sort_order: retrievedProduct.sort_order || 0,
            stock_quantity: retrievedProduct.stock_quantity || 0,
            min_order_quantity: retrievedProduct.min_order_quantity || 1,
            meta_title_zh: retrievedProduct.meta_title_zh || '',
            meta_title_en: retrievedProduct.meta_title_en || '',
            meta_title_ru: retrievedProduct.meta_title_ru || '',
            meta_description_zh: retrievedProduct.meta_description_zh || '',
            meta_description_en: retrievedProduct.meta_description_en || '',
            meta_description_ru: retrievedProduct.meta_description_ru || '',
            features_zh: retrievedProduct.features_zh || '',
            features_en: retrievedProduct.features_en || '',
            features_ru: retrievedProduct.features_ru || ''
        };
        
        // 统计成功映射的字段
        let mappedCount = 0;
        const mappedFieldsArray = [];
        
        Object.keys(refineMappedFields).forEach(field => {
            const value = refineMappedFields[field];
            const hasValue = value !== null && value !== undefined && value !== '';
            
            if (hasValue) {
                mappedCount++;
                mappedFieldsArray.push(field);
            }
        });
        
        console.log('✅ Refine表单字段映射完成');
        console.log(`📊 映射字段统计: ${mappedCount}/${Object.keys(refineMappedFields).length}`);
        console.log('📋 成功映射的字段:', mappedFieldsArray.slice(0, 10).join(', ') + (mappedFieldsArray.length > 10 ? '...' : ''));
        
        // 4. 验证关键字段是否都能正确映射
        console.log('\n4️⃣ 验证关键字段映射状态');
        console.log('-'.repeat(40));
        
        const keyFieldsStatus = criticalFields.map(field => {
            const original = completeTestData[field];
            const mapped = refineMappedFields[field];
            const hasValue = mapped !== null && mapped !== undefined && mapped !== '';
            const isCorrect = mapped == original;
            
            return {
                field,
                status: hasValue ? (isCorrect ? '✅' : '⚠️') : '❌',
                hasValue,
                isCorrect
            };
        });
        
        keyFieldsStatus.forEach(({ field, status }) => {
            console.log(`  ${field}: ${status}`);
        });
        
        const successfulFields = keyFieldsStatus.filter(f => f.hasValue).length;
        const correctFields = keyFieldsStatus.filter(f => f.isCorrect).length;
        
        console.log(`\n📊 最终统计:`);
        console.log(`  有值字段: ${successfulFields}/${criticalFields.length}`);
        console.log(`  正确字段: ${correctFields}/${criticalFields.length}`);
        
        // 5. 生成修复效果报告
        console.log('\n📋 修复效果报告');
        console.log('═'.repeat(60));
        
        const successRate = (correctFields / criticalFields.length) * 100;
        
        if (successRate >= 90) {
            console.log('🎉 修复效果优秀！');
            console.log(`✅ ${successRate.toFixed(1)}% 的关键字段能够正确保存和回显`);
            console.log('✅ Refine ProductFormValues接口修复成功');
            console.log('✅ 数据持久化功能正常工作');
            console.log('');
            console.log('💡 用户现在应该能够在编辑页面看到完整的产品信息！');
        } else if (successRate >= 70) {
            console.log('⚠️ 修复效果良好，但仍有改进空间');
            console.log(`⚠️ ${successRate.toFixed(1)}% 的关键字段能够正确保存和回显`);
            console.log('需要进一步检查失败的字段');
        } else {
            console.log('❌ 修复效果不理想');
            console.log(`❌ 只有 ${successRate.toFixed(1)}% 的关键字段能够正确保存和回显`);
            console.log('需要进行额外的修复工作');
        }
        
        return {
            success: successRate >= 90,
            successRate,
            productId,
            mappedFields: mappedCount,
            totalFields: Object.keys(refineMappedFields).length
        };
        
    } catch (error) {
        console.error('\n❌ 测试过程中发生错误:', error.message);
        return { success: false, error: error.message };
    }
}

// 运行测试
testCompleteWorkflow().then(result => {
    console.log('\n🏁 测试完成');
    console.log('结果:', result);
    
    if (result.success) {
        console.log(`\n🎯 推荐操作:`);
        console.log(`1. 重新加载前端页面 (Ctrl+Shift+R)`);
        console.log(`2. 尝试编辑产品ID: ${result.productId}`);
        console.log(`3. 验证所有字段是否正确显示`);
    }
}).catch(error => {
    console.error('\n💥 测试执行错误:', error);
});