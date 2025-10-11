// 测试R2存储桶配置
const testImageUrl = 'https://636620a5.kahn-building-materials.pages.dev/api/upload-image';

async function testImageUpload() {
  try {
    // 创建一个简单的测试图片文件
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, 100, 100);
    
    // 转换为Blob
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('file', blob, 'test-image.png');
      formData.append('folder', 'test');
      
      console.log('🚀 开始测试图片上传...');
      
      const response = await fetch(testImageUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin-token'
        },
        body: formData
      });
      
      console.log('📝 响应状态:', response.status);
      const result = await response.json();
      console.log('📄 响应结果:', result);
      
      if (result.code === 200) {
        console.log('✅ 上传成功!');
        console.log('🖼️ 图片URL:', result.data.original);
        
        // 测试图片是否能访问
        const imgTest = new Image();
        imgTest.onload = () => {
          console.log('✅ 图片可以正常加载!');
        };
        imgTest.onerror = () => {
          console.log('❌ 图片无法加载!');
        };
        imgTest.src = result.data.original;
      } else {
        console.log('❌ 上传失败:', result.message);
      }
    }, 'image/png');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 在浏览器中运行
if (typeof window !== 'undefined') {
  console.log('准备测试R2图片上传...');
  testImageUpload();
} else {
  console.log('此脚本需要在浏览器中运行');
}