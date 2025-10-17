// 创建一个简单的测试图片（1x1像素PNG）
function createTestImage() {
    // Base64编码的1x1透明PNG图片
    const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    // 将base64转换为Uint8Array
    const binaryData = atob(base64Data);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
    }
    
    // 创建File对象
    return new File([bytes], 'test-image.png', { type: 'image/png' });
}

async function testImageUploadAPI() {
    console.log('🧪 开始测试图片上传API...');
    
    try {
        const testFile = createTestImage();
        console.log('📁 创建测试图片:', {
            name: testFile.name,
            size: testFile.size,
            type: testFile.type
        });

        const formData = new FormData();
        formData.append('file', testFile);

        const response = await fetch('http://localhost:8788/api/upload-image', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log('📤 上传响应:', result);

        if (response.ok && result.code === 200) {
            console.log('✅ 图片上传成功!');
            // 使用original字段作为图片URL
            const imageUrl = result.data.original || result.data.url;
            console.log('🔗 图片URL:', imageUrl);
            console.log('📏 URL长度:', imageUrl?.length || 0);
            
            // 检查URL类型
            if (imageUrl?.startsWith('data:')) {
                console.log('📊 图片类型: Base64数据URL');
            } else if (imageUrl?.startsWith('https://')) {
                console.log('📊 图片类型: HTTPS URL (R2存储)');
            } else {
                console.log('📊 图片类型: 其他格式');
            }
            
            return imageUrl;
        } else {
            console.error('❌ 图片上传失败:', result.message);
            return null;
        }
    } catch (error) {
        console.error('❌ 图片上传错误:', error);
        return null;
    }
}

async function testProductCreation(imageUrl) {
    console.log('🧪 开始测试产品创建...');
    
    if (!imageUrl) {
        console.error('❌ 没有图片URL，跳过产品创建测试');
        return null;
    }

    try {
        const productData = {
            product_code: 'TEST-IMG-' + Date.now(),
            name_zh: '图片持久化测试产品',
            name_en: 'Image Persistence Test Product',
            description_zh: '用于验证图片URL正确保存和回显的测试产品',
            category: 'adhesive',
            price: 25.00,
            image_url: imageUrl,
            is_active: true
        };

        console.log('📦 创建产品数据:', productData);

        const response = await fetch('http://localhost:8788/api/admin/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token'
            },
            body: JSON.stringify(productData)
        });

        const result = await response.json();
        console.log('📤 创建产品响应:', result);

        if (response.ok && result.data) {
            console.log('✅ 产品创建成功!');
            console.log('🆔 产品ID:', result.data.id);
            console.log('📝 产品代码:', result.data.product_code);
            console.log('🖼️ 保存的图片URL:', result.data.image_url);
            console.log('📏 保存的URL长度:', result.data.image_url?.length || 0);
            
            return result.data.id;
        } else {
            console.error('❌ 产品创建失败:', result.error?.message || result.message);
            return null;
        }
    } catch (error) {
        console.error('❌ 产品创建错误:', error);
        return null;
    }
}

async function testProductRetrieval(productId) {
    console.log('🧪 开始测试产品获取和图片回显...');
    
    if (!productId) {
        console.error('❌ 没有产品ID，跳过产品获取测试');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8788/api/admin/products/${productId}`, {
            headers: {
                'Authorization': 'Bearer test-token'
            }
        });

        const result = await response.json();
        console.log('📤 获取产品响应:', result);

        if (response.ok && result.data && result.data.length > 0) {
            const product = result.data[0];
            console.log('✅ 产品获取成功!');
            console.log('📝 产品代码:', product.product_code);
            console.log('🏷️ 中文名称:', product.name_zh);
            console.log('🖼️ 图片URL:', product.image_url);
            console.log('📏 图片URL长度:', product.image_url?.length || 0);
            
            // 验证图片URL是否完整
            if (product.image_url) {
                if (product.image_url.startsWith('data:')) {
                    console.log('✅ 图片URL类型: Base64数据URL - 正确');
                } else if (product.image_url.startsWith('https://')) {
                    console.log('✅ 图片URL类型: HTTPS URL - 正确');
                } else {
                    console.log('⚠️ 图片URL类型: 可能不完整 -', product.image_url);
                }
            } else {
                console.log('❌ 图片URL为空或null');
            }
            
            return product;
        } else {
            console.error('❌ 产品获取失败:', result.error?.message || result.message);
            return null;
        }
    } catch (error) {
        console.error('❌ 产品获取错误:', error);
        return null;
    }
}

// 运行完整测试流程
async function runCompleteTest() {
    console.log('🚀 开始完整的图片持久化测试...');
    console.log('');
    
    // 1. 测试图片上传
    const imageUrl = await testImageUploadAPI();
    console.log('');
    
    if (!imageUrl) {
        console.log('❌ 测试失败: 图片上传失败');
        return;
    }
    
    // 2. 测试产品创建
    const productId = await testProductCreation(imageUrl);
    console.log('');
    
    if (!productId) {
        console.log('❌ 测试失败: 产品创建失败');
        return;
    }
    
    // 等待1秒确保数据库写入完成
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. 测试产品获取和图片回显
    const product = await testProductRetrieval(productId);
    console.log('');
    
    if (!product) {
        console.log('❌ 测试失败: 产品获取失败');
        return;
    }
    
    // 4. 验证图片持久化结果
    console.log('🔍 验证图片持久化结果:');
    console.log('原始图片URL:', imageUrl);
    console.log('保存后图片URL:', product.image_url);
    console.log('URL匹配:', imageUrl === product.image_url ? '✅ 完全匹配' : '❌ 不匹配');
    
    if (imageUrl === product.image_url) {
        console.log('');
        console.log('🎉 测试成功! 图片持久化功能正常工作');
    } else {
        console.log('');
        console.log('⚠️ 测试警告: 图片URL发生了变化，可能存在问题');
    }
}

// 启动测试
runCompleteTest().catch(console.error);