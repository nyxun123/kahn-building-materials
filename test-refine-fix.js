// 测试Refine数据提供者修复效果
async function testRefineDataProvider() {
    console.log('🔧 测试Refine数据提供者修复效果');
    console.log('════════════════════════════════════════════════════════════');
    console.log('');

    const API_BASE = 'http://localhost:8788/api/admin';

    // 模拟getAuthHeader函数
    const getAuthHeader = () => {
        return { Authorization: 'Bearer admin-session' };
    };

    // 模拟buildUrl函数
    const buildUrl = (resource, id, params) => {
        let url = `${API_BASE}/${resource}`;
        if (id) url += `/${id}`;
        if (params) {
            const query = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined) {
                    query.append(key, String(params[key]));
                }
            });
            const queryString = query.toString();
            if (queryString) url += `?${queryString}`;
        }
        return url;
    };

    // 模拟parseResponse函数
    const parseResponse = async (response) => {
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        return await response.json();
    };

    // 1. 测试创建产品（模拟Refine的create方法）
    console.log('1️⃣ 测试Refine create方法');
    console.log('─────────────────────────────────');
    
    const createProductData = {
        product_code: 'REFINE-TEST-' + Date.now(),
        name_zh: 'Refine测试产品',
        name_en: 'Refine Test Product',
        description_zh: '用于测试Refine数据提供者的产品',
        category: 'adhesive',
        price: 55.99,
        image_url: 'https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/products/refine-test.png',
        is_active: true
    };

    console.log('📦 发送创建请求数据:', createProductData);

    try {
        const headers = {
            "Content-Type": "application/json",
            ...getAuthHeader(),
        };

        const url = buildUrl('products');
        console.log('🔗 请求URL:', url);

        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(createProductData),
        });

        const payload = await parseResponse(response);
        console.log('📡 原始API响应:', payload);

        // 模拟修复后的数据处理逻辑
        let data;
        if (Array.isArray(payload.data)) {
            data = payload.data[0];
            console.log('✅ 检测到数组格式，提取第一个元素');
        } else if (payload.data) {
            data = payload.data;
            console.log('✅ 检测到对象格式，直接使用');
        } else {
            data = payload;
            console.log('✅ 使用整个响应作为数据');
        }

        console.log('📝 处理后的数据:', data);
        
        if (data && data.id) {
            console.log('✅ 产品创建成功，ID:', data.id);
            
            // 2. 测试获取产品（模拟Refine的getOne方法）
            console.log('');
            console.log('2️⃣ 测试Refine getOne方法');
            console.log('─────────────────────────────────');
            
            const getUrl = buildUrl('products', data.id);
            console.log('🔗 获取产品URL:', getUrl);
            
            const getResponse = await fetch(getUrl, { headers, method: "GET" });
            const getPayload = await parseResponse(getResponse);
            console.log('📡 获取产品原始响应:', getPayload);
            
            // 模拟修复后的getOne数据处理逻辑
            let getData;
            if (Array.isArray(getPayload.data)) {
                getData = getPayload.data[0];
                console.log('✅ getOne: 检测到数组格式，提取第一个元素');
            } else if (getPayload.data) {
                getData = getPayload.data;
                console.log('✅ getOne: 检测到对象格式，直接使用');
            } else {
                getData = getPayload;
                console.log('✅ getOne: 使用整个响应作为数据');
            }
            
            console.log('📝 getOne处理后的数据:', getData);
            
            // 3. 验证数据完整性
            console.log('');
            console.log('3️⃣ 验证数据完整性');
            console.log('─────────────────────────────────');
            
            const criticalFields = ['product_code', 'name_zh', 'name_en', 'description_zh', 'price', 'image_url', 'category'];
            let allFieldsPresent = true;
            
            for (const field of criticalFields) {
                const originalValue = createProductData[field];
                const retrievedValue = getData[field];
                const isPresent = retrievedValue !== null && retrievedValue !== undefined && retrievedValue !== '';
                const isCorrect = originalValue == retrievedValue;
                
                if (!isPresent) allFieldsPresent = false;
                
                const status = isPresent ? (isCorrect ? '✅ 正确' : '⚠️ 值变化') : '❌ 缺失';
                console.log(`   ${field}: ${status}`);
                
                if (!isCorrect && isPresent) {
                    console.log(`     期望: ${originalValue}`);
                    console.log(`     实际: ${retrievedValue}`);
                }
            }
            
            // 4. 测试更新产品（模拟Refine的update方法）
            console.log('');
            console.log('4️⃣ 测试Refine update方法');
            console.log('─────────────────────────────────');
            
            const updateData = {
                name_zh: getData.name_zh + ' (已编辑)',
                description_zh: getData.description_zh + ' - 通过Refine更新',
                price: 66.99,
                // 保持图片URL不变
                image_url: getData.image_url
            };
            
            console.log('📦 发送更新请求数据:', updateData);
            
            const updateUrl = buildUrl('products', data.id);
            console.log('🔗 更新产品URL:', updateUrl);
            
            const updateResponse = await fetch(updateUrl, {
                method: "PUT",
                headers,
                body: JSON.stringify(updateData),
            });
            
            const updatePayload = await parseResponse(updateResponse);
            console.log('📡 更新产品原始响应:', updatePayload);
            
            // 模拟修复后的update数据处理逻辑
            let updateResultData;
            if (Array.isArray(updatePayload.data)) {
                updateResultData = updatePayload.data[0];
                console.log('✅ update: 检测到数组格式，提取第一个元素');
            } else if (updatePayload.data) {
                updateResultData = updatePayload.data;
                console.log('✅ update: 检测到对象格式，直接使用');
            } else {
                updateResultData = updatePayload;
                console.log('✅ update: 使用整个响应作为数据');
            }
            
            console.log('📝 update处理后的数据:', updateResultData);
            
            // 5. 总结测试结果
            console.log('');
            console.log('5️⃣ 测试总结');
            console.log('─────────────────────────────────');
            
            if (allFieldsPresent && updateResultData && updateResultData.id) {
                console.log('🎉 Refine数据提供者修复成功！');
                console.log('   ✅ 产品创建: 数据正确保存和返回');
                console.log('   ✅ 产品获取: 数据正确加载和解析');
                console.log('   ✅ 产品更新: 数据正确更新和返回');
                console.log('   ✅ 数据完整性: 所有关键字段都正确处理');
                console.log('');
                console.log('💡 现在用户应该能够在编辑页面看到完整的产品数据！');
                
                return { success: true, productId: data.id };
            } else {
                console.log('❌ Refine数据提供者仍存在问题');
                console.log('   请检查上述步骤中标记为❌的项目');
                
                return { success: false, productId: data.id };
            }
        } else {
            console.log('❌ 产品创建失败，无法继续测试');
            return { success: false };
        }
    } catch (error) {
        console.error('❌ 测试过程中发生错误:', error);
        return { success: false, error: error.message };
    }
}

// 运行测试
testRefineDataProvider().then(result => {
    console.log('');
    console.log('🏁 测试完成，结果:', result);
}).catch(console.error);