// Cloudflare Workers - 处理联系表单API
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 处理联系API请求
    if (url.pathname === '/api/contact-api' && request.method === 'POST') {
      return handleContactAPI(request, env);
    }
    
    // 处理其他API请求
    if (url.pathname.startsWith('/api/')) {
      return handleAPIProxy(request, env);
    }
    
    // 其他请求继续到Cloudflare Pages
    return fetch(request);
  }
};

// 处理联系表单API
async function handleContactAPI(request, env) {
  try {
    const body = await request.json();
    
    if (body.action !== 'SUBMIT_CONTACT') {
      return new Response(JSON.stringify({
        code: 400,
        message: '无效的操作类型'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
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
        headers: { 'Content-Type': 'application/json' }
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
        headers: { 'Content-Type': 'application/json' }
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
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 消息长度检查
    if (data.message.length < 10) {
      return new Response(JSON.stringify({
        code: 400,
        message: '消息内容太短，请提供更多信息'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 使用Supabase API
    const supabaseUrl = 'https://ypjtdfsociepbzfvxzha.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwanRkZnNvY2llcGJ6ZnZ4emhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzU3NDcsImV4cCI6MjA3MDU1MTc0N30.YphVSQeOwn2gNFisRTsg0IhN6cNxDtWTo9k-QgeVU0w';
    
    const insertData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      company: data.company?.trim() || null,
      phone: data.phone?.trim() || null,
      country: data.country?.trim() || null,
      subject: data.subject?.trim() || '网站联系咨询',
      message: data.message.trim(),
      language: data.language || 'zh',
      status: 'new',
      is_read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const response = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(insertData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '数据库操作失败');
    }
    
    const result = await response.json();
    
    return new Response(JSON.stringify({
      code: 200,
      message: '消息提交成功，我们将尽快回复您',
      data: result[0]
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
    
  } catch (error) {
    console.error('联系API错误:', error);
    return new Response(JSON.stringify({
      code: 500,
      message: `服务器错误: ${error.message}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 处理其他API代理（如果需要）
async function handleAPIProxy(request, env) {
  try {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace('/api/', '');
    
    // 这里可以根据需要添加其他API路由
    return new Response(JSON.stringify({
      code: 404,
      message: 'API路由未找到'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      code: 500,
      message: '代理错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}