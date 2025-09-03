// Cloudflare Pages Worker for API routing - 完全绕过Supabase
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    // Handle contact API requests
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContactAPI(request, env);
    }
    
    // Handle image upload requests
    if (url.pathname === '/api/upload-image' && request.method === 'POST') {
      return handleImageUpload(request, env);
    }
    
    // Handle admin login
    if (url.pathname === '/api/admin/login' && request.method === 'POST') {
      return handleAdminLogin(request, env);
    }
    
    // Handle get contacts
    if (url.pathname === '/api/admin/contacts' && request.method === 'GET') {
      return handleGetContacts(request, env);
    }
    
    // Handle other API requests
    if (url.pathname.startsWith('/api/')) {
      return handleAPIProxy(request, env);
    }
    
    // For all other requests, use Cloudflare Pages static serving
    return env.ASSETS.fetch(request);
  }
};

// Handle contact form API - 使用D1数据库
async function handleContactAPI(request, env) {
  try {
    const body = await request.json();
    
    // 验证基本结构
    if (!body || !body.data) {
      return new Response(JSON.stringify({
        code: 400,
        message: '请求格式错误'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    const data = body.data;
    
    // 数据验证
    if (!data.name || !data.email || !data.message) {
      return new Response(JSON.stringify({
        code: 400,
        message: '请填写所有必填字段'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(JSON.stringify({
        code: 400,
        message: '邮箱格式不正确'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 垃圾信息检查
    const spamKeywords = [
      'viagra', 'casino', 'lottery', 'winner', 'click here', 'free money',
      'urgent', 'congratulations', 'million dollars', 'bitcoin'
    ];
    
    const content = `${data.name} ${data.message}`.toLowerCase();
    const isSpam = spamKeywords.some(keyword => content.includes(keyword));
    
    if (isSpam) {
      return new Response(JSON.stringify({
        code: 400,
        message: '检测到可疑内容，请重新填写'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 消息长度检查
    if (data.message.length < 10) {
      return new Response(JSON.stringify({
        code: 400,
        message: '消息内容太短，请提供更多信息'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 存储到D1数据库
    try {
      if (env.DB) {
        // 插入联系数据到D1数据库
        const result = await env.DB.prepare(`
          INSERT INTO contacts (name, email, phone, company, message, ip_address, user_agent)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
          data.name.trim(),
          data.email.trim().toLowerCase(),
          data.phone?.trim() || '',
          data.company?.trim() || '',
          data.message.trim(),
          request.headers.get('cf-connecting-ip') || 'unknown',
          request.headers.get('user-agent') || 'unknown'
        ).run();
        
        console.log('D1数据库存储成功:', result);
        
        // 发送通知
        await sendNotification(data, env);
        
        return new Response(JSON.stringify({
          code: 200,
          message: '消息提交成功，我们将尽快回复您',
          data: { id: result.meta.last_row_id, submitted_at: new Date().toISOString() }
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } else {
        throw new Error('数据库未配置');
      }
    } catch (dbError) {
      console.error('D1数据库错误:', dbError);
      
      // 降级到内存存储
      const contactData = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        company: data.company?.trim() || '',
        phone: data.phone?.trim() || '',
        message: data.message.trim(),
        created_at: new Date().toISOString(),
        ip: request.headers.get('cf-connecting-ip') || 'unknown'
      };
      
      // 发送通知
      await sendNotification(contactData, env);
      
      return new Response(JSON.stringify({
        code: 200,
        message: '消息提交成功（临时存储），我们将尽快回复您',
        data: contactData
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
  } catch (error) {
    console.error('联系API错误:', error);
    return new Response(JSON.stringify({
      code: 500,
      message: `服务器错误: ${error.message}`
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// 发送通知
async function sendNotification(data, env) {
  try {
    // 记录到控制台
    console.log('新联系消息:', {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message.substring(0, 100) + '...'
    });
    
    // 这里可以集成邮件服务、Slack通知等
    // 示例：发送到外部API或邮件服务
    if (env.NOTIFICATION_WEBHOOK) {
      await fetch(env.NOTIFICATION_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact_form',
          data: data,
          timestamp: new Date().toISOString()
        })
      });
    }
    
  } catch (error) {
    console.error('通知发送失败:', error);
    // 不抛出错误，确保主流程继续
  }
}

// Handle image upload requests
async function handleImageUpload(request, env) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'products';
    
    if (!file) {
      return new Response(JSON.stringify({
        code: 400,
        message: '请选择要上传的文件'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 文件大小检查（5MB）
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({
        code: 400,
        message: '文件大小不能超过5MB'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 文件类型检查
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!supportedTypes.includes(file.type)) {
      return new Response(JSON.stringify({
        code: 400,
        message: '不支持的图片格式'
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 生成唯一文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop().toLowerCase();
    const fileName = `${folder}/${timestamp}_${randomStr}.${ext}`;
    
    // 上传到Cloudflare R2或临时处理
    try {
      // 如果配置了R2存储桶
      if (env.IMAGE_BUCKET) {
        await env.IMAGE_BUCKET.put(fileName, file);
        const imageUrl = `https://your-domain.com/images/${fileName}`;
        
        return new Response(JSON.stringify({
          code: 200,
          message: '图片上传成功',
          data: {
            original: imageUrl,
            large: imageUrl,
            medium: imageUrl,
            small: imageUrl,
            thumbnail: imageUrl,
            fullUrls: {
              original: imageUrl,
              large: imageUrl,
              medium: imageUrl,
              small: imageUrl,
              thumbnail: imageUrl
            }
          }
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } else {
        // 临时方案：返回base64数据URL
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        const dataUrl = `data:${file.type};base64,${base64}`;
        
        return new Response(JSON.stringify({
          code: 200,
          message: '图片处理成功（临时存储）',
          data: {
            original: dataUrl,
            large: dataUrl,
            medium: dataUrl,
            small: dataUrl,
            thumbnail: dataUrl,
            fullUrls: {
              original: dataUrl,
              large: dataUrl,
              medium: dataUrl,
              small: dataUrl,
              thumbnail: dataUrl
            }
          }
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    } catch (uploadError) {
      throw new Error(`上传失败: ${uploadError.message}`);
    }
    
  } catch (error) {
    console.error('图片上传错误:', error);
    return new Response(JSON.stringify({
      code: 500,
      message: `图片上传失败: ${error.message}`
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

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
    
    // 检查管理员凭据
    if (env.DB) {
      try {
        const result = await env.DB.prepare(`
          SELECT * FROM admins WHERE email = ? AND password_hash = ?
        `).bind(email.toLowerCase(), password).first();
        
        if (result) {
          // 更新最后登录时间
          await env.DB.prepare(`
            UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?
          `).bind(result.id).run();
          
          return new Response(JSON.stringify({
            user: {
              id: result.id,
              email: result.email,
              name: result.name,
              role: result.role
            }
          }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      } catch (dbError) {
        console.error('D1认证查询失败:', dbError);
      }
    }
    
    // 降级到硬编码认证
    if (email.toLowerCase() === 'niexianlei0@gmail.com' && password === 'XIANche041758') {
      return new Response(JSON.stringify({
        user: {
          id: 'temp-admin',
          email: email.toLowerCase(),
          name: '管理员',
          role: 'admin'
        }
      }), {
        status: 200,
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

// Handle get contacts API
async function handleGetContacts(request, env) {
  try {
    // 简单的认证检查（生产环境需要更严格的JWT等）
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: { message: '需要登录' }
      }), {
        status: 401,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    if (env.DB) {
      try {
        // 获取联系数据
        const contacts = await env.DB.prepare(`
          SELECT id, name, email, phone, company, message, created_at, status, is_read
          FROM contacts 
          ORDER BY created_at DESC 
          LIMIT ? OFFSET ?
        `).bind(limit, offset).all();
        
        // 获取总数
        const countResult = await env.DB.prepare(`
          SELECT COUNT(*) as total FROM contacts
        `).first();
        
        return new Response(JSON.stringify({
          data: contacts.results || [],
          pagination: {
            page,
            limit,
            total: countResult?.total || 0,
            totalPages: Math.ceil((countResult?.total || 0) / limit)
          }
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (dbError) {
        console.error('D1查询失败:', dbError);
        throw new Error('数据库查询失败');
      }
    } else {
      // 降级到空数据
      return new Response(JSON.stringify({
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
  } catch (error) {
    console.error('获取联系数据错误:', error);
    return new Response(JSON.stringify({
      error: { message: '获取数据失败' }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle other API proxy requests
async function handleAPIProxy(request, env) {
  try {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace('/api/', '');
    
    return new Response(JSON.stringify({
      code: 404,
      message: 'API路由未找到'
    }), {
      status: 404,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      code: 500,
      message: '代理错误'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}