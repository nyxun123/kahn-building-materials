export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
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

    const { email, password } = body || {};
    if (!email || !password) {
      return new Response(JSON.stringify({
        code: 400,
        message: '请填写邮箱和密码'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (!env.DB) {
      return new Response(JSON.stringify({
        code: 500,
        message: 'D1数据库未配置，请联系技术支持'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      const result = await env.DB.prepare(`
        SELECT * FROM admins WHERE email = ?
      `).bind(email.toLowerCase()).first();

      if (result && result.password_hash === password) {
        await env.DB.prepare(`
          UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?
        `).bind(result.id).run();

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
        code: 500,
        message: `数据库认证失败: ${dbError.message}`
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(JSON.stringify({
      code: 401,
      message: '邮箱或密码错误'
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

export async function onRequestOptions(context) {
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