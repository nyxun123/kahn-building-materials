#!/usr/bin/env node

/**
 * 🔧 跨浏览器数据丢失问题深度调试
 * 专门针对产品编辑页面数据回显问题
 */

const BASE_URL = 'http://localhost:8788';

async function debugDataFlow() {
    console.log('🔧 跨浏览器数据丢失问题深度调试');
    console.log('═══════════════════════════════════════');
    console.log('🎯 目标：解决产品编辑页面数据回显失败问题');
    console.log('');

    // 1. 获取一个测试产品
    console.log('1️⃣ 获取测试产品数据');
    console.log('──────────────────────────');
    
    let testProduct = null;
    try {
        const listResponse = await fetch(`${BASE_URL}/api/admin/products?limit=1`, {
            headers: { 'Authorization': 'Bearer test-token' }
        });
        const listResult = await listResponse.json();
        
        if (listResult.success && listResult.data && listResult.data.length > 0) {
            testProduct = listResult.data[0];
            console.log(`✅ 获取测试产品: ID ${testProduct.id} - ${testProduct.product_code}`);
        } else {
            console.log('❌ 没有可用的测试产品');
            return;
        }
    } catch (error) {
        console.log('❌ 获取产品列表失败:', error.message);
        return;
    }

    // 2. 模拟Refine的getOne调用
    console.log('');
    console.log('2️⃣ 模拟Refine getOne数据获取');
    console.log('──────────────────────────');
    
    try {
        const getOneResponse = await fetch(`${BASE_URL}/api/admin/products/${testProduct.id}`, {
            headers: { 
                'Authorization': 'Bearer test-token',
                'Content-Type': 'application/json'
            }
        });
        const getOneResult = await getOneResponse.json();
        
        console.log('📦 API原始响应格式:');
        console.log(`   status: ${getOneResponse.status}`);
        console.log(`   success: ${getOneResult.success}`);
        console.log(`   data类型: ${Array.isArray(getOneResult.data) ? '数组' : '对象'}`);
        
        if (Array.isArray(getOneResult.data)) {
            console.log(`   数组长度: ${getOneResult.data.length}`);
            if (getOneResult.data.length > 0) {
                const product = getOneResult.data[0];
                console.log('📝 产品数据关键字段:');
                console.log(`     ID: ${product.id}`);
                console.log(`     产品代码: ${product.product_code}`);
                console.log(`     中文名称: ${product.name_zh}`);
                console.log(`     英文名称: ${product.name_en || '(空)'}`);
                console.log(`     中文描述: ${product.description_zh ? '有内容' : '(空)'}`);
                console.log(`     图片URL: ${product.image_url ? '有图片' : '(空)'}`);
                console.log(`     价格: ${product.price}`);
                console.log(`     分类: ${product.category || '(空)'}`);
                
                // 3. 模拟Refine数据提供者处理
                console.log('');
                console.log('3️⃣ 模拟Refine数据提供者处理逻辑');
                console.log('──────────────────────────');
                
                // 这是data-provider.ts中的逻辑
                let refinedData;
                if (Array.isArray(getOneResult.data)) {
                    refinedData = getOneResult.data[0];
                    console.log('✅ 数据提供者: 检测到数组格式，提取第一个元素');
                } else if (getOneResult.data) {
                    refinedData = getOneResult.data;
                    console.log('✅ 数据提供者: 使用对象格式');
                } else {
                    refinedData = getOneResult;
                    console.log('⚠️ 数据提供者: 使用原始响应');
                }
                
                console.log('📋 Refine返回给组件的数据格式:');
                console.log('   结构: { data: product }');
                console.log(`   product字段数量: ${Object.keys(refinedData).length}`);
                
                // 4. 模拟React组件useEffect处理
                console.log('');
                console.log('4️⃣ 模拟React组件数据处理');
                console.log('──────────────────────────');
                
                // 模拟product-edit.tsx中的useEffect逻辑
                const mockQueryResult = {
                    data: { data: refinedData },
                    isLoading: false,
                    error: null
                };
                
                console.log('🔄 模拟useEffect触发:');
                console.log(`   queryResult.data存在: ${!!mockQueryResult.data}`);
                console.log(`   queryResult.data.data存在: ${!!mockQueryResult.data?.data}`);
                
                const record = mockQueryResult.data?.data;
                if (record) {
                    console.log('✅ 找到产品记录，开始字段映射...');
                    
                    // 检查关键字段映射
                    const keyFields = [
                        'product_code', 'name_zh', 'name_en', 'description_zh', 
                        'image_url', 'price', 'category'
                    ];
                    
                    let mappingIssues = [];
                    keyFields.forEach(field => {
                        const value = record[field];
                        const hasValue = value !== null && value !== undefined && value !== '';
                        console.log(`   ${field}: ${hasValue ? '✅' : '❌'} ${hasValue ? value : '(空值)'}`);
                        
                        if (!hasValue && field !== 'description_zh') { // description可以为空
                            mappingIssues.push(field);
                        }
                    });
                    
                    if (mappingIssues.length > 0) {
                        console.log('');
                        console.log('⚠️ 发现字段映射问题:');
                        mappingIssues.forEach(field => {
                            console.log(`   - ${field}: 值为空或未定义`);
                        });
                    } else {
                        console.log('');
                        console.log('✅ 所有关键字段映射正常');
                    }
                    
                    // 5. 检查setValue调用模拟
                    console.log('');
                    console.log('5️⃣ 模拟setValue函数调用');
                    console.log('──────────────────────────');
                    
                    let setValueCalls = 0;
                    Object.keys(record).forEach(key => {
                        if (record[key] !== null && record[key] !== undefined) {
                            setValueCalls++;
                        }
                    });
                    
                    console.log(`📝 应该调用setValue的次数: ${setValueCalls}`);
                    console.log('📝 setValue调用示例:');
                    Object.keys(record).slice(0, 5).forEach(key => {
                        if (record[key] !== null && record[key] !== undefined) {
                            console.log(`   setValue("${key}", ${JSON.stringify(record[key])})`);
                        }
                    });
                    
                } else {
                    console.log('❌ 没有找到产品记录 - 这是数据丢失的根本原因！');
                }
                
            } else {
                console.log('❌ 数组为空');
            }
        } else {
            console.log('❌ 响应格式不是数组');
        }
        
    } catch (error) {
        console.log('❌ getOne请求失败:', error.message);
    }
    
    console.log('');
    console.log('📋 诊断结果');
    console.log('═══════════════════════════════════════');
    console.log('基于以上调试信息，如果数据流正常但前端仍显示空白，');
    console.log('问题可能出现在以下几个方面:');
    console.log('');
    console.log('🔍 可能的问题原因:');
    console.log('1. React组件重新渲染时机问题');
    console.log('2. useForm的defaultValues覆盖了setValue');
    console.log('3. 表单字段注册时机与数据设置时机冲突');
    console.log('4. Refine的查询生命周期异常');
    console.log('5. 组件mount和数据加载的竞态条件');
    console.log('');
    console.log('🔧 下一步修复策略:');
    console.log('1. 修改useEffect依赖，确保数据加载完成后再设置');
    console.log('2. 使用reset而不是setValue批量设置表单数据');
    console.log('3. 添加数据加载状态检查');
    console.log('4. 优化Refine配置确保正确的数据获取时机');
    
    console.log('');
    console.log('🏁 调试完成');
}

// 运行调试
debugDataFlow().catch(console.error);