#!/usr/bin/env node

/**
 * 🔍 深度调试产品编辑页面数据丢失问题
 * 专门排查数据链路中的每个环节
 */

const BASE_URL = 'http://localhost:8788';

async function deepDebugDataLoss() {
    console.log('🔍 深度调试产品编辑页面数据丢失问题');
    console.log('═══════════════════════════════════════');
    console.log('');

    // 1. 获取一个现有产品进行测试
    console.log('1️⃣ 获取现有产品数据');
    console.log('──────────────────────────');
    
    let testProductId = null;
    let originalProductData = null;
    
    try {
        const listResponse = await fetch(`${BASE_URL}/api/admin/products?limit=1`, {
            headers: { 'Authorization': 'Bearer test-token' }
        });
        const listResult = await listResponse.json();
        
        if (listResult.success && listResult.data && listResult.data.length > 0) {
            testProductId = listResult.data[0].id;
            originalProductData = listResult.data[0];
            console.log(`✅ 选择测试产品: ID ${testProductId}`);
            console.log(`   产品代码: ${originalProductData.product_code}`);
            console.log(`   中文名称: ${originalProductData.name_zh}`);
            console.log(`   图片URL: ${originalProductData.image_url ? '有' : '无'}`);
        } else {
            console.log('❌ 没有可用的产品数据');
            return;
        }
    } catch (error) {
        console.log('❌ 获取产品列表失败:', error.message);
        return;
    }

    // 2. 模拟编辑页面的API调用
    console.log('');
    console.log('2️⃣ 模拟编辑页面API调用');
    console.log('──────────────────────────');
    
    try {
        console.log(`🔄 调用 /api/admin/products/${testProductId}...`);
        
        const editResponse = await fetch(`${BASE_URL}/api/admin/products/${testProductId}`, {
            headers: {
                'Authorization': 'Bearer test-token',
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`📡 响应状态: ${editResponse.status}`);
        console.log(`📋 响应头: ${editResponse.headers.get('content-type')}`);
        
        if (!editResponse.ok) {
            console.log('❌ API请求失败');
            const errorText = await editResponse.text();
            console.log(`   错误内容: ${errorText}`);
            return;
        }
        
        const editResult = await editResponse.json();
        console.log('📦 原始API响应结构:');
        console.log(`   success: ${editResult.success}`);
        console.log(`   data类型: ${Array.isArray(editResult.data) ? '数组' : '对象'}`);
        console.log(`   data长度/键数: ${Array.isArray(editResult.data) ? editResult.data.length : Object.keys(editResult.data || {}).length}`);
        
        // 3. 模拟Refine数据提供者处理
        console.log('');
        console.log('3️⃣ 模拟Refine数据提供者处理');
        console.log('──────────────────────────');
        
        // 按照data-provider.ts的逻辑处理数据
        let processedData;
        if (Array.isArray(editResult.data)) {
            processedData = editResult.data[0];
            console.log('✅ 检测到数组格式，提取第一个元素');
        } else if (editResult.data) {
            processedData = editResult.data;
            console.log('✅ 检测到对象格式，直接使用');
        } else {
            processedData = editResult;
            console.log('⚠️ 使用原始响应作为数据');
        }
        
        console.log('📝 Refine处理后的数据:');
        console.log(`   数据对象包含 ${Object.keys(processedData).length} 个字段`);
        
        // 验证关键字段
        const criticalFields = [
            'id', 'product_code', 'name_zh', 'name_en', 'description_zh',
            'image_url', 'price', 'category', 'is_active'
        ];
        
        console.log('🔍 关键字段检查:');
        criticalFields.forEach(field => {
            const value = processedData[field];
            const hasValue = value !== null && value !== undefined && value !== '';
            const displayValue = hasValue ? 
                (typeof value === 'string' && value.length > 30 ? value.substring(0, 30) + '...' : value) 
                : '(空)';
            console.log(`   ${field}: ${hasValue ? '✅' : '❌'} ${displayValue}`);
        });
        
        // 4. 模拟React组件useEffect处理
        console.log('');
        console.log('4️⃣ 模拟React组件useEffect处理');
        console.log('──────────────────────────');
        
        // 模拟组件状态
        const mockQueryResult = {
            data: { data: processedData },
            isLoading: false,
            error: null
        };
        
        console.log('🔄 模拟useEffect执行条件检查:');
        const isCreate = false; // 编辑模式
        console.log(`   isCreate: ${isCreate}`);
        console.log(`   queryResult.isLoading: ${mockQueryResult.isLoading}`);
        console.log(`   queryResult.error: ${mockQueryResult.error}`);
        console.log(`   record存在: ${!!mockQueryResult.data?.data}`);
        
        if (!isCreate && !mockQueryResult.isLoading && !mockQueryResult.error && mockQueryResult.data?.data) {
            console.log('✅ 所有条件满足，开始处理数据...');
            
            const record = mockQueryResult.data.data;
            
            // 模拟表单数据准备（按照product-edit.tsx的逻辑）
            const formData = {
                product_code: record.product_code || '',
                name_zh: record.name_zh || '',
                name_en: record.name_en || '',
                name_ru: record.name_ru || '',
                description_zh: record.description_zh || '',
                description_en: record.description_en || '',
                description_ru: record.description_ru || '',
                specifications_zh: record.specifications_zh || '',
                specifications_en: record.specifications_en || '',
                specifications_ru: record.specifications_ru || '',
                applications_zh: record.applications_zh || '',
                applications_en: record.applications_en || '',
                applications_ru: record.applications_ru || '',
                category: record.category || 'adhesive',
                price: typeof record.price === 'number' ? record.price : 0,
                price_range: record.price_range || '',
                image_url: record.image_url || '',
                gallery_images: record.gallery_images || '',
                packaging_options_zh: record.packaging_options_zh || '',
                packaging_options_en: record.packaging_options_en || '',
                packaging_options_ru: record.packaging_options_ru || '',
                tags: record.tags || '',
                is_active: record.is_active !== 0,
                is_featured: record.is_featured === 1,
                sort_order: typeof record.sort_order === 'number' ? record.sort_order : 0,
                stock_quantity: typeof record.stock_quantity === 'number' ? record.stock_quantity : 0,
                min_order_quantity: typeof record.min_order_quantity === 'number' ? record.min_order_quantity : 1,
                meta_title_zh: record.meta_title_zh || '',
                meta_title_en: record.meta_title_en || '',
                meta_title_ru: record.meta_title_ru || '',
                meta_description_zh: record.meta_description_zh || '',
                meta_description_en: record.meta_description_en || '',
                meta_description_ru: record.meta_description_ru || ''
            };
            
            // 特殊处理features字段
            ['features_zh', 'features_en', 'features_ru'].forEach(field => {
                if (record[field]) {
                    try {
                        const parsed = JSON.parse(record[field]);
                        formData[field] = Array.isArray(parsed) ? parsed.join('\n') : record[field];
                    } catch {
                        formData[field] = record[field];
                    }
                } else {
                    formData[field] = '';
                }
            });
            
            console.log('📋 准备的表单数据:');
            console.log(`   数据对象包含 ${Object.keys(formData).length} 个字段`);
            
            // 验证表单数据的关键字段
            console.log('🔍 表单数据关键字段检查:');
            criticalFields.forEach(field => {
                if (field in formData) {
                    const value = formData[field];
                    const hasValue = value !== null && value !== undefined && value !== '';
                    const displayValue = hasValue ? 
                        (typeof value === 'string' && value.length > 30 ? value.substring(0, 30) + '...' : value) 
                        : '(空)';
                    console.log(`   ${field}: ${hasValue ? '✅' : '❌'} ${displayValue}`);
                }
            });
            
            // 5. 检查可能的问题点
            console.log('');
            console.log('5️⃣ 检查可能的问题点');
            console.log('──────────────────────────');
            
            let issueCount = 0;
            
            // 检查API响应格式
            if (!editResult.success) {
                console.log('❌ 问题1: API响应缺少success字段');
                issueCount++;
            } else {
                console.log('✅ API响应格式正确');
            }
            
            // 检查数据完整性
            const missingFields = criticalFields.filter(field => {
                const value = processedData[field];
                return value === null || value === undefined || value === '';
            });
            
            if (missingFields.length > 2) { // 允许有少量空字段
                console.log(`❌ 问题2: 关键字段缺失过多 (${missingFields.length}个)`);
                console.log(`   缺失字段: ${missingFields.join(', ')}`);
                issueCount++;
            } else {
                console.log('✅ 数据完整性良好');
            }
            
            // 检查类型转换
            const typeIssues = [];
            if (typeof processedData.price !== 'number' && processedData.price !== null) {
                typeIssues.push('price类型错误');
            }
            if (typeof processedData.is_active !== 'number' && typeof processedData.is_active !== 'boolean') {
                typeIssues.push('is_active类型错误');
            }
            
            if (typeIssues.length > 0) {
                console.log(`❌ 问题3: 数据类型问题`);
                console.log(`   类型问题: ${typeIssues.join(', ')}`);
                issueCount++;
            } else {
                console.log('✅ 数据类型正确');
            }
            
            // 6. 总结和建议
            console.log('');
            console.log('📊 调试结果总结');
            console.log('──────────────────────────');
            
            if (issueCount === 0) {
                console.log('🎉 数据链路检查完全正常！');
                console.log('');
                console.log('🔍 可能的前端问题:');
                console.log('1. React组件重新渲染导致数据重置');
                console.log('2. useForm钩子的reset方法调用时机问题');
                console.log('3. 表单字段注册顺序问题');
                console.log('4. Refine框架版本兼容性问题');
                console.log('');
                console.log('💡 建议解决方案:');
                console.log('1. 添加更详细的前端调试日志');
                console.log('2. 在reset调用前后打印表单状态');
                console.log('3. 检查是否有其他useEffect在干扰');
                console.log('4. 验证register字段名是否与数据字段一致');
            } else {
                console.log(`❌ 发现 ${issueCount} 个数据问题，需要修复后端API`);
            }
            
        } else {
            console.log('❌ useEffect执行条件不满足，数据无法处理');
            if (isCreate) console.log('   - 检测为创建模式');
            if (mockQueryResult.isLoading) console.log('   - 数据仍在加载中');
            if (mockQueryResult.error) console.log('   - 数据加载出错');
            if (!mockQueryResult.data?.data) console.log('   - 数据对象为空');
        }
        
    } catch (error) {
        console.log('❌ API调用或数据处理失败:', error.message);
    }
    
    console.log('');
    console.log('🏁 深度调试完成');
}

// 运行调试
deepDebugDataLoss().catch(console.error);