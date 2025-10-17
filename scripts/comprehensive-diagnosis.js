// 全面诊断产品信息丢失问题 - 模拟用户完整操作流程
console.log('🔍 开始全面诊断产品信息丢失问题');
console.log('═'.repeat(60));

// 模拟用户的完整测试数据
const testProductData = {
    product_code: 'DIAGNOSIS-' + Date.now(),
    name_zh: '诊断测试产品',
    name_en: 'Diagnosis Test Product',
    name_ru: 'Диагностический тестовый продукт',
    description_zh: '这是一个用于诊断数据丢失问题的完整测试产品，包含所有字段信息',
    description_en: 'This is a complete test product for diagnosing data loss issues with all field information',
    description_ru: 'Это полный тестовый продукт для диагностики проблем потери данных со всей информацией о полях',
    specifications_zh: '规格：30kg/包，高强度粘接配方',
    specifications_en: 'Specification: 30kg/bag, high-strength adhesive formula',
    specifications_ru: 'Спецификация: 30кг/мешок, формула клея высокой прочности',
    applications_zh: '适用于各种墙面装饰材料的粘接',
    applications_en: 'Suitable for bonding various wall decoration materials',
    applications_ru: 'Подходит для склеивания различных материалов для отделки стен',
    category: 'adhesive',
    price: 88.88,
    price_range: '80-95元/包',
    features_zh: JSON.stringify(['超强粘接力', '快速固化', '环保无毒', '防水防潮']),
    features_en: JSON.stringify(['Super adhesion', 'Fast curing', 'Eco-friendly', 'Waterproof']),
    features_ru: JSON.stringify(['Супер адгезия', 'Быстрое отверждение', 'Экологически чистый', 'Водонепроницаемый']),
    image_url: 'https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/products/diagnosis-test.png',
    gallery_images: JSON.stringify(['image1.jpg', 'image2.jpg']),
    packaging_options_zh: '30kg装编织袋包装',
    packaging_options_en: '30kg woven bag packaging',
    packaging_options_ru: '30кг упаковка в тканые мешки',
    tags: 'diagnosis,test,adhesive,wallpaper',
    is_active: true,
    is_featured: true,
    sort_order: 999,
    stock_quantity: 500,
    min_order_quantity: 5,
    meta_title_zh: '诊断测试产品 - 专业壁纸胶',
    meta_title_en: 'Diagnosis Test Product - Professional Wallpaper Adhesive',
    meta_title_ru: 'Диагностический тестовый продукт - Профессиональный клей для обоев',
    meta_description_zh: '高性能壁纸胶产品，诊断测试专用',
    meta_description_en: 'High-performance wallpaper adhesive, for diagnostic testing',
    meta_description_ru: 'Высокопроизводительный клей для обоев, для диагностических испытаний'
};

const API_BASE = 'http://localhost:8788/api';

// 1. 第一步：验证产品创建API的数据保存
async function step1_VerifyProductCreation() {
    console.log('\n📝 步骤1: 验证产品创建API数据保存');
    console.log('-'.repeat(50));
    
    try {
        console.log('🚀 发送产品创建请求...');
        console.log('数据字段数量:', Object.keys(testProductData).length);
        
        const response = await fetch(`${API_BASE}/admin/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer admin-session'
            },
            body: JSON.stringify(testProductData)
        });

        console.log('📡 响应状态:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API错误: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('📦 创建响应结构:', {
            hasData: !!result.data,
            dataType: typeof result.data,
            isArray: Array.isArray(result.data)
        });

        if (result.data) {
            const createdProduct = Array.isArray(result.data) ? result.data[0] : result.data;
            console.log('✅ 产品创建成功, ID:', createdProduct.id);
            
            // 验证关键字段是否保存
            const criticalFields = [
                'product_code', 'name_zh', 'name_en', 'description_zh', 
                'price', 'image_url', 'category', 'specifications_zh'
            ];
            
            console.log('\n🔍 验证关键字段保存情况:');
            let savedFieldsCount = 0;
            
            criticalFields.forEach(field => {
                const saved = createdProduct[field];
                const original = testProductData[field];
                const isSaved = saved !== null && saved !== undefined && saved !== '';
                const isCorrect = saved == original;
                
                if (isSaved) savedFieldsCount++;
                
                const status = isSaved ? (isCorrect ? '✅' : '⚠️') : '❌';
                console.log(`  ${field}: ${status} ${isSaved ? `(${String(saved).substring(0, 30)}...)` : '(空)'}`);
            });
            
            console.log(`\n📊 字段保存统计: ${savedFieldsCount}/${criticalFields.length} 个字段成功保存`);
            
            return {
                success: true,
                productId: createdProduct.id,
                savedFields: savedFieldsCount,
                totalFields: criticalFields.length,
                data: createdProduct
            };
        } else {
            throw new Error('API返回数据为空');
        }
    } catch (error) {
        console.error('❌ 产品创建失败:', error.message);
        return { success: false, error: error.message };
    }
}

// 2. 第二步：验证产品获取API的数据读取
async function step2_VerifyProductRetrieval(productId) {
    console.log('\n📖 步骤2: 验证产品获取API数据读取');
    console.log('-'.repeat(50));
    
    try {
        console.log('🔍 请求产品详情, ID:', productId);
        
        const response = await fetch(`${API_BASE}/admin/products/${productId}`, {
            headers: {
                'Authorization': 'Bearer admin-session'
            }
        });

        console.log('📡 响应状态:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API错误: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('📦 获取响应结构:', {
            hasData: !!result.data,
            dataType: typeof result.data,
            isArray: Array.isArray(result.data),
            dataLength: Array.isArray(result.data) ? result.data.length : 'N/A'
        });

        if (result.data) {
            const retrievedProduct = Array.isArray(result.data) ? result.data[0] : result.data;
            
            if (!retrievedProduct) {
                throw new Error('数组为空或数据不存在');
            }
            
            console.log('✅ 产品数据获取成功');
            
            // 验证数据完整性
            const criticalFields = [
                'product_code', 'name_zh', 'name_en', 'description_zh', 
                'price', 'image_url', 'category', 'specifications_zh'
            ];
            
            console.log('\n🔍 验证获取数据完整性:');
            let retrievedFieldsCount = 0;
            
            criticalFields.forEach(field => {
                const retrieved = retrievedProduct[field];
                const original = testProductData[field];
                const isRetrieved = retrieved !== null && retrieved !== undefined && retrieved !== '';
                const isCorrect = retrieved == original;
                
                if (isRetrieved) retrievedFieldsCount++;
                
                const status = isRetrieved ? (isCorrect ? '✅' : '⚠️') : '❌';
                console.log(`  ${field}: ${status} ${isRetrieved ? `(${String(retrieved).substring(0, 30)}...)` : '(空)'}`);
            });
            
            console.log(`\n📊 字段获取统计: ${retrievedFieldsCount}/${criticalFields.length} 个字段成功获取`);
            
            return {
                success: true,
                retrievedFields: retrievedFieldsCount,
                totalFields: criticalFields.length,
                data: retrievedProduct
            };
        } else {
            throw new Error('API返回数据为空');
        }
    } catch (error) {
        console.error('❌ 产品获取失败:', error.message);
        return { success: false, error: error.message };
    }
}

// 3. 第三步：验证Refine数据提供者的处理逻辑
async function step3_VerifyRefineDataProvider(productId) {
    console.log('\n🔧 步骤3: 验证Refine数据提供者处理逻辑');
    console.log('-'.repeat(50));
    
    try {
        // 模拟Refine getOne方法的处理逻辑
        console.log('🔄 模拟Refine getOne方法调用...');
        
        const response = await fetch(`${API_BASE}/admin/products/${productId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer admin-session'
            }
        });

        const payload = await response.json();
        console.log('📡 原始API响应:', {
            hasData: !!payload.data,
            dataType: typeof payload.data,
            isArray: Array.isArray(payload.data)
        });

        // 模拟Refine数据提供者的处理逻辑
        let processedData;
        if (Array.isArray(payload.data)) {
            processedData = payload.data[0];
            console.log('✅ Refine处理: 检测到数组格式，提取第一个元素');
        } else if (payload.data) {
            processedData = payload.data;
            console.log('✅ Refine处理: 检测到对象格式，直接使用');
        } else {
            processedData = payload;
            console.log('✅ Refine处理: 使用整个响应作为数据');
        }

        if (!processedData || !processedData.id) {
            throw new Error('Refine数据处理后为空或无效');
        }

        console.log('📝 Refine处理后数据预览:', {
            id: processedData.id,
            product_code: processedData.product_code,
            name_zh: processedData.name_zh,
            fieldsCount: Object.keys(processedData).length
        });

        return {
            success: true,
            processedData: processedData,
            fieldsCount: Object.keys(processedData).length
        };
    } catch (error) {
        console.error('❌ Refine数据提供者处理失败:', error.message);
        return { success: false, error: error.message };
    }
}

// 4. 第四步：验证前端表单数据绑定
async function step4_VerifyFormBinding(productData) {
    console.log('\n🎨 步骤4: 验证前端表单数据绑定逻辑');
    console.log('-'.repeat(50));
    
    try {
        console.log('🔄 模拟前端ProductForm数据映射...');
        
        // 模拟product-edit.tsx的数据映射逻辑
        const formFields = {
            product_code: productData.product_code || '',
            name_zh: productData.name_zh || '',
            name_en: productData.name_en || '',
            name_ru: productData.name_ru || '',
            description_zh: productData.description_zh || '',
            description_en: productData.description_en || '',
            description_ru: productData.description_ru || '',
            category: productData.category || 'adhesive',
            price: productData.price || 0,
            price_range: productData.price_range || '',
            image_url: productData.image_url || '',
            specifications_zh: productData.specifications_zh || '',
            is_active: productData.is_active
        };

        console.log('📝 表单字段映射结果:');
        let mappedFieldsCount = 0;
        
        Object.keys(formFields).forEach(field => {
            const value = formFields[field];
            const hasValue = value !== null && value !== undefined && value !== '';
            
            if (hasValue) mappedFieldsCount++;
            
            const status = hasValue ? '✅' : '❌';
            const displayValue = typeof value === 'string' && value.length > 30 
                ? value.substring(0, 30) + '...' 
                : String(value);
            
            console.log(`  ${field}: ${status} (${displayValue})`);
        });
        
        console.log(`\n📊 表单字段映射统计: ${mappedFieldsCount}/${Object.keys(formFields).length} 个字段有值`);
        
        // 检查特殊字段处理
        console.log('\n🔍 检查特殊字段处理:');
        
        // features字段JSON处理
        if (productData.features_zh && typeof productData.features_zh === 'string') {
            try {
                const parsed = JSON.parse(productData.features_zh);
                const processed = Array.isArray(parsed) ? parsed.join('\n') : productData.features_zh;
                console.log('  features_zh JSON处理: ✅', `(${processed.substring(0, 30)}...)`);
            } catch (e) {
                console.log('  features_zh JSON处理: ❌', e.message);
            }
        }
        
        // 布尔值处理
        const booleanValue = productData.is_active;
        const booleanProcessed = Boolean(booleanValue);
        console.log(`  is_active 布尔处理: ✅ (${booleanValue} -> ${booleanProcessed})`);

        return {
            success: true,
            mappedFields: mappedFieldsCount,
            totalFields: Object.keys(formFields).length,
            formData: formFields
        };
    } catch (error) {
        console.error('❌ 表单数据绑定失败:', error.message);
        return { success: false, error: error.message };
    }
}

// 5. 主诊断流程
async function runComprehensiveDiagnosis() {
    console.log('🎯 开始执行全面诊断流程...\n');
    
    const results = {
        step1: null,
        step2: null,
        step3: null,
        step4: null
    };
    
    // 步骤1: 验证产品创建
    results.step1 = await step1_VerifyProductCreation();
    if (!results.step1.success) {
        console.log('\n🚨 诊断中止: 产品创建失败');
        return results;
    }
    
    // 步骤2: 验证产品获取
    results.step2 = await step2_VerifyProductRetrieval(results.step1.productId);
    if (!results.step2.success) {
        console.log('\n🚨 诊断警告: 产品获取失败');
    }
    
    // 步骤3: 验证Refine处理
    if (results.step2.success) {
        results.step3 = await step3_VerifyRefineDataProvider(results.step1.productId);
        if (!results.step3.success) {
            console.log('\n🚨 诊断警告: Refine数据处理失败');
        }
    }
    
    // 步骤4: 验证表单绑定
    if (results.step3.success) {
        results.step4 = await step4_VerifyFormBinding(results.step3.processedData);
        if (!results.step4.success) {
            console.log('\n🚨 诊断警告: 表单数据绑定失败');
        }
    }
    
    // 生成诊断报告
    console.log('\n📋 诊断报告');
    console.log('═'.repeat(60));
    
    console.log('\n各步骤执行结果:');
    console.log(`步骤1 (产品创建): ${results.step1.success ? '✅ 成功' : '❌ 失败'}`);
    if (results.step1.success) {
        console.log(`  - 字段保存: ${results.step1.savedFields}/${results.step1.totalFields}`);
    }
    
    console.log(`步骤2 (产品获取): ${results.step2?.success ? '✅ 成功' : '❌ 失败'}`);
    if (results.step2?.success) {
        console.log(`  - 字段获取: ${results.step2.retrievedFields}/${results.step2.totalFields}`);
    }
    
    console.log(`步骤3 (Refine处理): ${results.step3?.success ? '✅ 成功' : '❌ 失败'}`);
    if (results.step3?.success) {
        console.log(`  - 处理字段数: ${results.step3.fieldsCount}`);
    }
    
    console.log(`步骤4 (表单绑定): ${results.step4?.success ? '✅ 成功' : '❌ 失败'}`);
    if (results.step4?.success) {
        console.log(`  - 绑定字段: ${results.step4.mappedFields}/${results.step4.totalFields}`);
    }
    
    // 问题分析
    console.log('\n🔍 问题分析:');
    if (!results.step1.success) {
        console.log('❌ 根本问题: 产品创建API失败，数据无法保存到数据库');
    } else if (!results.step2?.success) {
        console.log('❌ 根本问题: 产品获取API失败，无法从数据库读取数据');
    } else if (!results.step3?.success) {
        console.log('❌ 根本问题: Refine数据提供者处理失败，数据格式不兼容');
    } else if (!results.step4?.success) {
        console.log('❌ 根本问题: 前端表单数据绑定失败，无法正确映射字段');
    } else {
        console.log('✅ 所有步骤都成功执行，可能是特定条件下的问题');
    }
    
    return results;
}

// 执行诊断
runComprehensiveDiagnosis().then(results => {
    console.log('\n🏁 诊断完成');
    if (results.step1?.productId) {
        console.log(`测试产品ID: ${results.step1.productId}`);
        console.log('您可以尝试在管理后台编辑此产品来验证修复效果');
    }
}).catch(error => {
    console.error('\n💥 诊断过程发生错误:', error);
});