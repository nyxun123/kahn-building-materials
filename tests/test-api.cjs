const http = require('http');

// 测试API功能
function testAPI() {
  console.log('🧪 测试API功能...\n');
  
  const options = {
    hostname: 'localhost',
    port: 5175,
    path: '/api/content-local?page=home',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`状态码: ${res.statusCode}`);
      console.log('响应头:', res.headers);
      console.log('响应数据:');
      console.log(data);
      
      try {
        const jsonData = JSON.parse(data);
        console.log('\n✅ JSON解析成功');
        console.log(`📊 获取到 ${jsonData.length} 条记录`);
        
        // 显示前几条记录
        jsonData.slice(0, 5).forEach((item, index) => {
          console.log(`${index + 1}. ${item.section_key}: ${item.content_zh || item.content_en || item.content_ru}`);
        });
      } catch (e) {
        console.log('❌ JSON解析失败:', e.message);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('请求错误:', error.message);
  });
  
  req.end();
}

testAPI();