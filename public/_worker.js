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
    
    // Handle other API requests
    if (url.pathname.startsWith('/api/')) {
      return handleAPIProxy(request, env);
    }
    
    // For all other requests, use Cloudflare Pages static serving
    return env.ASSETS.fetch(request);
  }
};

// Handle contact form API - 使用KV存储
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
    
    // 创建联系消息记录
    const contactData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      company: data.company?.trim() || '',
      phone: data.phone?.trim() || '',
      country: data.country?.trim() || '',
      subject: data.subject?.trim() || '网站联系咨询',
      message: data.message.trim(),
      language: data.language || 'zh',
      status: 'new',
      is_read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ip: request.headers.get('cf-connecting-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown'
    };
    
    // 存储到Cloudflare KV（如果可用）或使用内存存储
    try {
      // 发送到Webhook或邮件通知
      await sendNotification(contactData, env);
      
      // 如果配置了KV存储，存储数据
      if (env.CONTACT_KV) {
        await env.CONTACT_KV.put(
          `contact:${contactData.id}`, 
          JSON.stringify(contactData)
        );
      }
      
    } catch (storageError) {
      console.error('存储失败，但消息已记录:', storageError);
    }
    
    // 返回成功响应
    return new Response(JSON.stringify({
      code: 200,
      message: '消息提交成功，我们将尽快回复您',
      data: contactData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
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