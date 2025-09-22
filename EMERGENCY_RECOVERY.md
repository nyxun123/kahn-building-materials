# 紧急恢复计划 - 管理员登录问题修复

## 问题诊断结果

### 问题根源
1. **数据库密码存储不一致**: schema.sql中存储的是明文密码，但API代码可能期望哈希值
2. **邮箱验证逻辑问题**: 前端可能有过于严格的邮箱格式验证
3. **环境配置问题**: 数据库连接或绑定可能存在问题

### 修复方案

#### 方案1: 修复数据库账户 (推荐)
```sql
-- 重新插入正确的管理员账户
INSERT OR REPLACE INTO admins (email, password_hash, name, role) 
VALUES ('niexianlei0@gmail.com', 'XIANche041758', '管理员', 'super_admin');
```

#### 方案2: 修复API验证逻辑
修改`functions/api/_worker.js`中的`handleAdminLogin`函数，确保正确处理密码验证：

```javascript
// Handle admin login API
async function handleAdminLogin(request, env) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // 验证输入
    if (!email || !password) {
      return new Response(JSON.stringify({
        error: { message: '请填写邮箱和密码' }
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 纯D1数据库认证 - 专业方案
    if (!env.DB) {
      return new Response(JSON.stringify({
        error: { message: 'D1数据库未配置，请联系技术支持' }
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // 重要：这里直接比较明文密码，因为数据库中存储的是明文
      const result = await env.DB.prepare(`
        SELECT * FROM admins WHERE email = ? AND password_hash = ?
      `).bind(email.toLowerCase(), password).first();
      
      if (result) {
        // 更新最后登录时间
        await env.DB.prepare(`
          UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?
        `).bind(result.id).run();
        
        console.log('✅ D1数据库认证成功');
        
        return new Response(JSON.stringify({
          user: {
            id: result.id,
            email: result.email,
            name: result.name,
            role: result.role
          },
          authType: 'D1_DATABASE'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    } catch (dbError) {
      console.error('D1认证失败:', dbError);
      return new Response(JSON.stringify({
        error: { message: `数据库认证失败: ${dbError.message}` }
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    return new Response(JSON.stringify({
      error: { message: '邮箱或密码错误' }
    }), {
      status: 401,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('登录API错误:', error);
    return new Response(JSON.stringify({
      error: { message: '登录失败，请稍后重试' }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
```

## 紧急处理步骤

### 步骤1: 数据库修复 (database-agent)
1. 执行SQL脚本修复管理员账户
2. 验证账户数据正确性

### 步骤2: API验证 (backend-agent)
1. 检查登录API逻辑
2. 确认密码验证方式正确

### 步骤3: 环境检查 (devops-agent)
1. 验证D1数据库绑定
2. 检查Cloudflare Worker部署状态

### 步骤4: 功能测试
1. 使用默认账户登录测试
2. 验证登录成功后能访问管理后台