# Token验证问题排查脚本

```javascript
// 在浏览器控制台运行此脚本来排查问题

// 1. 检查localStorage中的token
console.log('=== 检查localStorage中的token ===');
console.log('admin_access_token:', localStorage.getItem('admin_access_token')?.substring(0, 50) + '...');
console.log('admin_token_expiry:', localStorage.getItem('admin_token_expiry'));
console.log('admin-auth:', localStorage.getItem('admin-auth'));

// 2. 检查token是否过期
const expiry = parseInt(localStorage.getItem('admin_token_expiry') || '0');
const now = Date.now();
console.log('Token过期时间:', new Date(expiry).toLocaleString());
console.log('当前时间:', new Date(now).toLocaleString());
console.log('是否过期:', now >= expiry ? '是' : '否');
console.log('剩余时间:', Math.round((expiry - now) / 1000) + '秒');

// 3. 测试API调用
const token = localStorage.getItem('admin_access_token');
if (token) {
  fetch('/api/admin/dashboard/stats', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('API响应状态:', response.status);
    console.log('API响应头:', Object.fromEntries(response.headers.entries()));
    return response.text();
  })
  .then(text => {
    console.log('API响应内容:', text);
    try {
      const json = JSON.parse(text);
      console.log('API响应JSON:', json);
    } catch (e) {
      console.log('响应不是JSON格式');
    }
  })
  .catch(error => {
    console.error('API调用失败:', error);
  });
} else {
  console.error('未找到token');
}
```


































