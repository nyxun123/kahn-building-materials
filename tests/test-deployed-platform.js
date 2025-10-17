// 测试部署后的产品管理功能
async function testDeployment() {
  const DEPLOYED_URL = 'https://f27dd00a.kahn-building-materials.pages.dev';
  
  console.log('🧪 测试部署后的产品管理功能');
  console.log('═══════════════════════════════════════');
  console.log(`🌐 部署地址: ${DEPLOYED_URL}`);
  console.log('');
  
  try {
    // 1. 测试图片上传功能（JSON格式）
    console.log('1️⃣ 测试图片上传功能（JSON格式）');
    console.log('──────────────────────────');
    
    // 创建一个简单的测试图片（1x1像素红色PNG）
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const uploadResponse = await fetch(`${DEPLOYED_URL}/api/upload-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({
        imageData: testImageBase64,
        fileName: `test-upload-${Date.now()}.png`,
        folder: 'products'
      })
    });
    
    const uploadResult = await uploadResponse.json();
    
    if (uploadResponse.ok && uploadResult.code === 200) {
      console.log('✅ 图片上传功能正常');
      console.log(`   上传方式: ${uploadResult.data.uploadMethod}`);
      console.log(`   文件大小: ${uploadResult.data.fileSize} bytes`);
      console.log(`   URL: ${uploadResult.data.original.substring(0, 50)}...`);
    } else {
      console.log('❌ 图片上传失败');
      console.log(`   状态: ${uploadResponse.status}`);
      console.log(`   错误: ${uploadResult.message || 'Unknown error'}`);
    }
    
    console.log('\n✅ 部署测试完成！');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  }
}

// 运行测试
testDeployment().catch(console.error);