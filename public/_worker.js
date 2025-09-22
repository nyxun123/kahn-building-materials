// Cloudflare Pages Worker - 完全自动化数据存储
// 内置联系表单和管理系统，无需手动配置
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    console.log('API请求:', url.pathname, request.method);
    
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
      console.log('🎯 Routing to handleContactAPI');
      return handleContactAPI(request, env);
    }
    
    // Handle image upload requests
    if (url.pathname === '/api/upload-image') {
      console.log('🎯 Routing to handleImageUpload');
      if (request.method === 'POST') {
        return handleImageUpload(request, env);
      } else if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
          },
        });
      }
    }
    
    // Handle admin login
    if (url.pathname === '/api/admin/login' && request.method === 'POST') {
      console.log('🎯 Routing to handleAdminLogin');
      return handleAdminLogin(request, env);
    }
    
    // Handle public products API (no authentication required)
    if (url.pathname === '/api/products' && request.method === 'GET') {
      console.log('🎯 Routing to handlePublicProducts');
      return handlePublicProducts(request, env);
    }
    
    // Handle get single product by product code (public, no auth required)
    if (url.pathname.startsWith('/api/products/') && request.method === 'GET') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/products/') {
        console.log('🎯 Routing to handleGetSingleProductByCode');
        const productCode = url.pathname.split('/').pop();
        if (productCode) {
          return handleGetSingleProductByCode(request, env, productCode);
        }
      }
    }
    
    // Handle get products
    if (url.pathname === '/api/admin/products' && request.method === 'GET') {
      console.log('🎯 Routing to handleGetProducts');
      return handleGetProducts(request, env);
    }
    
    // Handle create product
    if (url.pathname === '/api/admin/products' && request.method === 'POST') {
      console.log('🎯 Routing to handleCreateProduct');
      return handleCreateProduct(request, env);
    }
    
    // Handle update product
    if (url.pathname.startsWith('/api/admin/products/') && request.method === 'PUT') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/products/') {
        console.log('🎯 Routing to handleUpdateProduct');
        return handleUpdateProduct(request, env);
      }
    }
    
    // Handle delete product
    if (url.pathname.startsWith('/api/admin/products/') && request.method === 'DELETE') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/products/') {
        console.log('🎯 Routing to handleDeleteProduct');
        return handleDeleteProduct(request, env);
      }
    }
    
    // Handle get single product
    if (url.pathname.startsWith('/api/admin/products/') && request.method === 'GET') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/products/') {
        console.log('🎯 Routing to handleGetSingleProduct');
        return handleGetSingleProduct(request, env);
      }
    }
    
    // Handle get contacts
    if (url.pathname === '/api/admin/contacts' && request.method === 'GET') {
      console.log('🎯 Routing to handleGetContacts');
      return handleGetContacts(request, env);
    }
    
    // Handle update contact status
    if (url.pathname.startsWith('/api/admin/contacts/') && request.method === 'PUT') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/contacts/') {
        console.log('🎯 Routing to handleUpdateContact');
        return handleUpdateContact(request, env);
      }
    }
    
    // Handle delete contact
    if (url.pathname.startsWith('/api/admin/contacts/') && request.method === 'DELETE') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/contacts/') {
        console.log('🎯 Routing to handleDeleteContact');
        return handleDeleteContact(request, env);
      }
    }
    
    // Handle get page contents
    if (url.pathname === '/api/admin/contents' && request.method === 'GET') {
      console.log('🎯 Routing to handleGetContents');
      return handleGetContents(request, env);
    }
    
    // Handle update page content
    if (url.pathname.startsWith('/api/admin/contents/') && request.method === 'PUT') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/contents/') {
        console.log('🎯 Routing to handleUpdateContent');
        return handleUpdateContent(request, env);
      }
    }
    
    // Handle page-specific content APIs - GET public content for frontend
    if (url.pathname === '/api/content/home' && request.method === 'GET') {
      console.log('🎯 Routing to handleGetPageContent for home');
      return handleGetPageContent(request, env, 'home');
    }
    if (url.pathname === '/api/content/products' && request.method === 'GET') {
      console.log('🎯 Routing to handleGetPageContent for products');
      return handleGetPageContent(request, env, 'products');
    }
    if (url.pathname === '/api/content/oem' && request.method === 'GET') {
      console.log('🎯 Routing to handleGetPageContent for oem');
      return handleGetPageContent(request, env, 'oem');
    }
    if (url.pathname === '/api/content/about' && request.method === 'GET') {
      console.log('🎯 Routing to handleGetPageContent for about');
      return handleGetPageContent(request, env, 'about');
    }
    if (url.pathname === '/api/content/contact' && request.method === 'GET') {
      console.log('🎯 Routing to handleGetPageContent for contact');
      return handleGetPageContent(request, env, 'contact');
    }
    
    // Handle page-specific admin content APIs - CRUD for admin panel
    if (url.pathname === '/api/admin/content/home' && request.method === 'GET') {
      console.log('🎯 Routing to handleGetAdminPageContent for home');
      return handleGetAdminPageContent(request, env, 'home');
    }
    if (url.pathname === '/api/admin/content/home' && request.method === 'POST') {
      console.log('🎯 Routing to handleCreatePageContent for home');
      return handleCreatePageContent(request, env, 'home');
    }
    if (url.pathname.startsWith('/api/admin/content/home/') && request.method === 'PUT') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/content/home/') {
        console.log('🎯 Routing to handleUpdatePageContent for home');
        return handleUpdatePageContent(request, env, 'home');
      }
    }
    if (url.pathname.startsWith('/api/admin/content/home/') && request.method === 'DELETE') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/content/home/') {
        console.log('🎯 Routing to handleDeletePageContent for home');
        return handleDeletePageContent(request, env, 'home');
      }
    }
    
    if (url.pathname === '/api/admin/content/products' && request.method === 'GET') {
      console.log('🎯 Routing to handleGetAdminPageContent for products');
      return handleGetAdminPageContent(request, env, 'products');
    }
    if (url.pathname === '/api/admin/content/products' && request.method === 'POST') {
      console.log('🎯 Routing to handleCreatePageContent for products');
      return handleCreatePageContent(request, env, 'products');
    }
    if (url.pathname.startsWith('/api/admin/content/products/') && request.method === 'PUT') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/content/products/') {
        console.log('🎯 Routing to handleUpdatePageContent for products');
        return handleUpdatePageContent(request, env, 'products');
      }
    }
    if (url.pathname.startsWith('/api/admin/content/products/') && request.method === 'DELETE') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/content/products/') {
        console.log('🎯 Routing to handleDeletePageContent for products');
        return handleDeletePageContent(request, env, 'products');
      }
    }
    
    if (url.pathname === '/api/admin/content/oem' && request.method === 'GET') {
      console.log('🎯 Routing to handleGetAdminPageContent for oem');
      return handleGetAdminPageContent(request, env, 'oem');
    }
    if (url.pathname === '/api/admin/content/oem' && request.method === 'POST') {
      console.log('🎯 Routing to handleCreatePageContent for oem');
      return handleCreatePageContent(request, env, 'oem');
    }
    if (url.pathname.startsWith('/api/admin/content/oem/') && request.method === 'PUT') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/content/oem/') {
        console.log('🎯 Routing to handleUpdatePageContent for oem');
        return handleUpdatePageContent(request, env, 'oem');
      }
    }
    if (url.pathname.startsWith('/api/admin/content/oem/') && request.method === 'DELETE') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/content/oem/') {
        console.log('🎯 Routing to handleDeletePageContent for oem');
        return handleDeletePageContent(request, env, 'oem');
      }
    }
    
    if (url.pathname === '/api/admin/content/about' && request.method === 'GET') {
      console.log('🎯 Routing to handleGetAdminPageContent for about');
      return handleGetAdminPageContent(request, env, 'about');
    }
    if (url.pathname === '/api/admin/content/about' && request.method === 'POST') {
      console.log('🎯 Routing to handleCreatePageContent for about');
      return handleCreatePageContent(request, env, 'about');
    }
    if (url.pathname.startsWith('/api/admin/content/about/') && request.method === 'PUT') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/content/about/') {
        console.log('🎯 Routing to handleUpdatePageContent for about');
        return handleUpdatePageContent(request, env, 'about');
      }
    }
    if (url.pathname.startsWith('/api/admin/content/about/') && request.method === 'DELETE') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/content/about/') {
        console.log('🎯 Routing to handleDeletePageContent for about');
        return handleDeletePageContent(request, env, 'about');
      }
    }
    
    if (url.pathname === '/api/admin/content/contact' && request.method === 'GET') {
      console.log('🎯 Routing to handleGetAdminPageContent for contact');
      return handleGetAdminPageContent(request, env, 'contact');
    }
    if (url.pathname === '/api/admin/content/contact' && request.method === 'POST') {
      console.log('🎯 Routing to handleCreatePageContent for contact');
      return handleCreatePageContent(request, env, 'contact');
    }
    if (url.pathname.startsWith('/api/admin/content/contact/') && request.method === 'PUT') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/content/contact/') {
        console.log('🎯 Routing to handleUpdatePageContent for contact');
        return handleUpdatePageContent(request, env, 'contact');
      }
    }
    if (url.pathname.startsWith('/api/admin/content/contact/') && request.method === 'DELETE') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/content/contact/') {
        console.log('🎯 Routing to handleDeletePageContent for contact');
        return handleDeletePageContent(request, env, 'contact');
      }
    }
    
    // Handle dashboard statistics API
    if (url.pathname === '/api/admin/dashboard/stats' && request.method === 'GET') {
      console.log('🎯 Routing to handleDashboardStats');
      return handleDashboardStats(request, env);
    }
    
    // Handle dashboard activities API
    if (url.pathname === '/api/admin/dashboard/activities' && request.method === 'GET') {
      console.log('🎯 Routing to handleDashboardActivities');
      return handleDashboardActivities(request, env);
    }
    
    // Handle dashboard system health API
    if (url.pathname === '/api/admin/dashboard/health' && request.method === 'GET') {
      console.log('🎯 Routing to handleDashboardHealth');
      return handleDashboardHealth(request, env);
    }
    
    // Handle company info API requests
    if (url.pathname.startsWith('/api/company/info/') && request.method === 'GET') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/company/info/') {
        console.log('🎯 Routing to handleCompanyInfo');
        return handleCompanyInfo(request, env);
      }
    }
    
    // Handle company content API requests
    if (url.pathname.startsWith('/api/company/content/') && request.method === 'GET') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/company/content/') {
        console.log('🎯 Routing to handleCompanyContent');
        return handleCompanyContent(request, env);
      }
    }
    
    // Handle admin company info API requests
    if (url.pathname === '/api/admin/company/info' && request.method === 'GET') {
      console.log('🎯 Routing to handleAdminCompanyInfo');
      return handleAdminCompanyInfo(request, env);
    }
    
    if (url.pathname === '/api/admin/company/info' && request.method === 'POST') {
      console.log('🎯 Routing to handleCreateCompanyInfo');
      return handleCreateCompanyInfo(request, env);
    }
    
    if (url.pathname.startsWith('/api/admin/company/info/') && request.method === 'PUT') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/company/info/') {
        console.log('🎯 Routing to handleUpdateCompanyInfo');
        return handleUpdateCompanyInfo(request, env);
      }
    }
    
    if (url.pathname.startsWith('/api/admin/company/info/') && request.method === 'DELETE') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/company/info/') {
        console.log('🎯 Routing to handleDeleteCompanyInfo');
        return handleDeleteCompanyInfo(request, env);
      }
    }
    
    // Handle admin company content API requests
    if (url.pathname === '/api/admin/company/content' && request.method === 'GET') {
      console.log('🎯 Routing to handleAdminCompanyContent');
      return handleAdminCompanyContent(request, env);
    }
    
    if (url.pathname === '/api/admin/company/content' && request.method === 'POST') {
      console.log('🎯 Routing to handleCreateCompanyContent');
      return handleCreateCompanyContent(request, env);
    }
    
    if (url.pathname.startsWith('/api/admin/company/content/') && request.method === 'PUT') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/company/content/') {
        console.log('🎯 Routing to handleUpdateCompanyContent');
        return handleUpdateCompanyContent(request, env);
      }
    }
    
    if (url.pathname.startsWith('/api/admin/company/content/') && request.method === 'DELETE') {
      // Ensure we're not matching the root path
      if (url.pathname !== '/api/admin/company/content/') {
        console.log('🎯 Routing to handleDeleteCompanyContent');
        return handleDeleteCompanyContent(request, env);
      }
    }
    
    // Handle other API requests
    if (url.pathname.startsWith('/api/')) {
      console.log('🎯 Routing to handleAPIProxy for unmatched API route:', url.pathname);
      return handleAPIProxy(request, env);
    }
    
    // Log unmatched routes
    console.log('⚠️  Unmatched route - falling back to static assets:', {
      method: request.method,
      pathname: url.pathname,
      search: url.search
    });
    
    // For all other requests, use Cloudflare Pages static serving
    return env.ASSETS.fetch(request);
  }
};

// Handle contact form API - 优化性能版本
async function handleContactAPI(request, env) {
  const startTime = performance.now();
  
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return createErrorResponse(400, '请求格式错误：无效的JSON数据');
    }
    
    // 快速验证基本结构
    if (!body?.data) {
      return createErrorResponse(400, '请求格式错误：缺少data字段');
    }
    
    const data = body.data;
    
    // 批量验证必填字段
    const required = ['name', 'email', 'message'];
    const missingFields = required.filter(field => !data[field]?.trim());
    if (missingFields.length > 0) {
      return createErrorResponse(400, `请填写必填字段: ${missingFields.join(', ')}`);
    }
    
    // 快速邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      return createErrorResponse(400, '邮箱格式不正确');
    }
    
    // 优化垃圾信息检查
    const spamKeywords = [
      'viagra', 'casino', 'lottery', 'winner', 'click here', 'free money',
      'urgent', 'congratulations', 'million dollars', 'bitcoin', 'crypto'
    ];
    
    const content = `${data.name} ${data.message}`.toLowerCase();
    const spamScore = spamKeywords.reduce((count, keyword) => {
      return count + (content.includes(keyword) ? 1 : 0);
    }, 0);
    
    if (spamScore >= 2 || content.length > 5000) {
      console.warn('🚨 疑似垃圾信息:', { 
        spamScore, 
        contentLength: content.length,
        email: data.email 
      });
      return createErrorResponse(400, '检测到可疑内容，请重新填写');
    }
    
    // 消息长度检查
    const messageLength = data.message.trim().length;
    if (messageLength < 10) {
      return createErrorResponse(400, '消息内容太短，请提供更多信息');
    }
    if (messageLength > 2000) {
      return createErrorResponse(400, '消息内容过长，请精简到2000字以内');
    }
    
    if (!env.DB) {
      return createErrorResponse(500, 'D1数据库未配置，请联系技术支持');
    }

    try {
      // 获取客户端信息
      const clientIP = request.headers.get('cf-connecting-ip') || 
                      request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
      const userAgent = request.headers.get('user-agent')?.substring(0, 500) || 'unknown';
      
      // 清理和准备数据
      const contactData = {
        name: data.name.trim().substring(0, 100),
        email: data.email.trim().toLowerCase().substring(0, 255),
        phone: data.phone?.trim().substring(0, 50) || '',
        company: data.company?.trim().substring(0, 200) || '',
        message: data.message.trim().substring(0, 2000),
        ip_address: clientIP,
        user_agent: userAgent
      };

      console.log('📝 处理联系表单:', {
        name: contactData.name,
        email: contactData.email,
        hasPhone: !!contactData.phone,
        hasCompany: !!contactData.company,
        messageLength: contactData.message.length,
        ip: clientIP
      });

      // 高效插入数据
      const result = await env.DB.prepare(`
        INSERT INTO contacts (name, email, phone, company, message, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        contactData.name,
        contactData.email,
        contactData.phone,
        contactData.company,
        contactData.message,
        contactData.ip_address,
        contactData.user_agent
      ).run();
      
      if (!result.meta?.last_row_id) {
        throw new Error('联系信息保存失败：未获得记录ID');
      }

      const elapsedTime = performance.now() - startTime;
      
      console.log('✅ 联系表单保存成功:', {
        id: result.meta.last_row_id,
        email: contactData.email,
        time: `${elapsedTime.toFixed(2)}ms`
      });
      
      // 异步发送通知（不阻塞响应）
      sendNotification(contactData, env).catch(error => {
        console.warn('通知发送失败:', error);
      });
      
      return new Response(JSON.stringify({
        code: 200,
        message: '消息提交成功，我们将尽快回复您',
        data: { 
          id: result.meta.last_row_id, 
          submitted_at: new Date().toISOString(),
          storage: 'D1_DATABASE'
        },
        meta: {
          processTime: elapsedTime.toFixed(2)
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      });

    } catch (dbError) {
      const elapsedTime = performance.now() - startTime;
      console.error('D1数据库错误:', {
        error: dbError.message,
        email: data.email,
        time: `${elapsedTime.toFixed(2)}ms`
      });
      
      return createErrorResponse(500, `数据库存储失败: ${dbError.message}`);
    }
    
  } catch (error) {
    const elapsedTime = performance.now() - startTime;
    console.error('联系API错误:', {
      error: error.message,
      time: `${elapsedTime.toFixed(2)}ms`
    });
    
    return createErrorResponse(500, `服务器错误: ${error.message}`);
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

// Handle image upload requests - 优化版本
async function handleImageUpload(request, env) {
  const startTime = performance.now();
  console.log('🚀 开始处理图片上传请求');
  
  try {
    // 检查请求方法
    if (request.method !== 'POST') {
      console.log('❌ 不支持的请求方法:', request.method);
      return createErrorResponse(405, '仅支持POST请求');
    }
    
    // 详细记录请求信息
    const requestInfo = {
      contentType: request.headers.get('content-type'),
      contentLength: request.headers.get('content-length'),
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin')
    };
    console.log('📝 请求信息:', requestInfo);
    
    // 优化FormData解析错误处理
    let formData;
    try {
      formData = await request.formData();
      console.log('✅ FormData 解析成功');
    } catch (formError) {
      console.error('❌ FormData 解析失败:', {
        error: formError.message,
        stack: formError.stack,
        contentType: requestInfo.contentType
      });
      
      // 提供更详细的错误信息
      let errorMessage = '请求格式错误';
      if (formError.message.includes('boundary')) {
        errorMessage = '文件上传格式错误，请重新选择文件';
      } else if (formError.message.includes('timeout')) {
        errorMessage = '文件上传超时，请检查网络连接';
      } else {
        errorMessage = `请求解析失败: ${formError.message}`;
      }
      
      return createErrorResponse(400, errorMessage);
    }
    
    // 获取并验证文件
    const file = formData.get('file');
    const folder = formData.get('folder') || 'products';
    
    console.log('📁 文件信息:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      folder: folder
    });
    
    // 严格验证文件存在性
    if (!file || !(file instanceof File)) {
      console.error('❌ 未找到有效文件:', typeof file);
      return createErrorResponse(400, '请选择要上传的文件');
    }
    
    // 文件大小检查（5MB = 5,242,880 bytes）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('❌ 文件过大:', { size: file.size, maxSize });
      return createErrorResponse(400, `文件大小不能超过5MB（当前: ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB）`);
    }
    
    // 更严格的文件类型检查
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!file.type || !supportedTypes.includes(file.type.toLowerCase())) {
      console.error('❌ 不支持的文件类型:', file.type);
      return createErrorResponse(400, `不支持的图片格式: ${file.type}。支持: JPEG, PNG, WebP, GIF`);
    }
    
    // 生成安全的文件名
    const timestamp = Date.now();
    const randomStr = crypto.getRandomValues(new Uint8Array(4))
      .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeFileName = `${folder}/${timestamp}_${randomStr}.${fileExt}`;
    
    console.log('🚀 开始处理文件:', safeFileName);
    
    // 优化的上传处理逻辑
    try {
      // 如果配置了R2存储桶，使用R2
      if (env.IMAGE_BUCKET) {
        console.log('☁️ 使用Cloudflare R2存储');
        
        // 直接上传到R2，减少内存使用
        const putResult = await env.IMAGE_BUCKET.put(safeFileName, file.stream(), {
          httpMetadata: {
            contentType: file.type,
            cacheControl: 'public, max-age=31536000',
            contentDisposition: `inline; filename="${file.name}"`,
          },
          customMetadata: {
            originalName: file.name,
            uploadTime: new Date().toISOString(),
            folder: folder,
            fileSize: file.size.toString(),
          },
        });
        
        if (!putResult) {
          throw new Error('R2上传失败，未返回结果');
        }
        
        const imageUrl = `https://pub-b9f0c2c358074609bf8701513c879957.r2.dev/${safeFileName}`;
        const elapsedTime = performance.now() - startTime;
        
        console.log('✅ R2上传成功:', { url: imageUrl, time: `${elapsedTime.toFixed(2)}ms` });
        
        return new Response(JSON.stringify({
          code: 200,
          message: '图片上传成功',
          data: {
            original: imageUrl,
            large: imageUrl,
            medium: imageUrl,
            small: imageUrl,
            thumbnail: imageUrl,
            fileName: safeFileName,
            fileSize: file.size,
            fileType: file.type,
            uploadMethod: 'cloudflare_r2',
            uploadTime: elapsedTime,
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
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          }
        });
        
      } else {
        // 优化的base64处理（临时方案）
        console.log('⚠️ 使用base64临时存储');
        
        // 限制base64处理的文件大小（2MB）
        if (file.size > 2 * 1024 * 1024) {
          return createErrorResponse(413, '临时存储模式下，文件大小不能超过2MB');
        }
        
        const arrayBuffer = await file.arrayBuffer();
        console.log('📦 获取ArrayBuffer:', arrayBuffer.byteLength);
        
        // 使用更高效的base64转换
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        const chunkSize = 0x8000; // 32KB chunks
        
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, i + chunkSize);
          binary += String.fromCharCode.apply(null, chunk);
        }
        
        const base64 = btoa(binary);
        const dataUrl = `data:${file.type};base64,${base64}`;
        const elapsedTime = performance.now() - startTime;
        
        console.log('✅ base64生成成功:', {
          dataUrlLength: dataUrl.length,
          time: `${elapsedTime.toFixed(2)}ms`
        });
        
        return new Response(JSON.stringify({
          code: 200,
          message: '图片上传成功（临时存储）',
          data: {
            original: dataUrl,
            large: dataUrl,
            medium: dataUrl,
            small: dataUrl,
            thumbnail: dataUrl,
            fileName: safeFileName,
            fileSize: file.size,
            fileType: file.type,
            uploadMethod: 'base64_storage',
            uploadTime: elapsedTime,
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
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          }
        });
      }
      
    } catch (uploadError) {
      const elapsedTime = performance.now() - startTime;
      console.error('🚨 图片处理错误:', {
        error: uploadError.message,
        stack: uploadError.stack,
        fileName: safeFileName,
        fileSize: file.size,
        time: `${elapsedTime.toFixed(2)}ms`
      });
      
      return createErrorResponse(500, `上传失败: ${uploadError.message}`);
    }
    
  } catch (error) {
    const elapsedTime = performance.now() - startTime;
    console.error('🚨 图片上传错误:', {
      error: error.message,
      stack: error.stack,
      time: `${elapsedTime.toFixed(2)}ms`
    });
    
    return createErrorResponse(500, `图片上传失败: ${error.message}`);
  }
}

// 创建标准化错误响应的辅助函数
function createErrorResponse(status, message) {
  return new Response(JSON.stringify({
    code: status,
    message: message,
    timestamp: new Date().toISOString()
  }), {
    status: status,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// 创建认证错误响应
function createAuthError() {
  return new Response(JSON.stringify({
    error: { message: '需要登录' },
    code: 401
  }), {
    status: 401,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// Handle admin login API
async function handleAdminLogin(request, env) {
  let body;
  try {
    body = await request.json();
  } catch (parseError) {
    return createErrorResponse(400, '请求格式错误');
  }

  const { email, password } = body || {};
  if (!email || !password) {
    return createErrorResponse(400, '请填写邮箱和密码');
  }

  if (!env.DB) {
    return createErrorResponse(500, 'D1数据库未配置，请联系技术支持');
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
    return createErrorResponse(500, `数据库认证失败: ${dbError.message}`);
  }

  return createErrorResponse(401, '邮箱或密码错误');
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
    
    // 纯D1数据库查询
    if (!env.DB) {
      return new Response(JSON.stringify({
        error: { message: 'D1数据库未配置' }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

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
      return new Response(JSON.stringify({
        error: { message: `数据库查询失败: ${dbError.message}` }
      }), {
        status: 500,
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

// Handle get products API - 优化性能版本
async function handleGetProducts(request, env) {
  const startTime = performance.now();
  
  try {
    // 快速认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createAuthError();
    }
    
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;
    
    // 快速数据库检查
    if (!env.DB) {
      return createErrorResponse(500, 'D1数据库未配置');
    }

    try {
      // 使用单一查询同时获取数据和计数，优化性能
      const [productsResult, countResult] = await Promise.all([
        env.DB.prepare(`
          SELECT id, product_code, name_zh, name_en, name_ru,
                 description_zh, description_en, description_ru,
                 price, price_range, image_url, category, 
                 is_active, sort_order, created_at, updated_at,
                 features_zh, features_en, features_ru
          FROM products 
          ORDER BY sort_order ASC, created_at DESC 
          LIMIT ? OFFSET ?
        `).bind(limit, offset).all(),
        
        env.DB.prepare(`SELECT COUNT(*) as total FROM products`).first()
      ]);
      
      const elapsedTime = performance.now() - startTime;
      
      // 添加性能监控
      if (elapsedTime > 200) {
        console.warn('🐌 产品查询较慢:', `${elapsedTime.toFixed(2)}ms`);
      }
      
      return new Response(JSON.stringify({
        data: productsResult.results || [],
        pagination: {
          page,
          limit,
          total: countResult?.total || 0,
          totalPages: Math.ceil((countResult?.total || 0) / limit)
        },
        meta: {
          queryTime: elapsedTime.toFixed(2),
          timestamp: new Date().toISOString()
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'private, max-age=60' // 1分钟缓存
        }
      });
      
    } catch (dbError) {
      const elapsedTime = performance.now() - startTime;
      console.error('D1查询失败:', {
        error: dbError.message,
        time: `${elapsedTime.toFixed(2)}ms`,
        page,
        limit
      });
      
      return createErrorResponse(500, `数据库查询失败: ${dbError.message}`);
    }
    
  } catch (error) {
    const elapsedTime = performance.now() - startTime;
    console.error('获取产品数据错误:', {
      error: error.message,
      time: `${elapsedTime.toFixed(2)}ms`
    });
    
    return createErrorResponse(500, '获取数据失败');
  }
}

// Handle other API proxy requests
async function handleAPIProxy(request, env) {
  try {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace('/api/', '');
    
    console.log('🚨 API路由未找到:', {
      pathname: url.pathname,
      apiPath: apiPath,
      method: request.method
    });
    
    return new Response(JSON.stringify({
      code: 404,
      message: 'API路由未找到',
      debug: {
        pathname: url.pathname,
        apiPath: apiPath,
        method: request.method
      }
    }), {
      status: 404,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('🚨 API代理错误:', error);
    return new Response(JSON.stringify({
      code: 500,
      message: '代理错误',
      error: error.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle create product API - 优化性能版本
async function handleCreateProduct(request, env) {
  const startTime = performance.now();
  
  try {
    // 快速认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createAuthError();
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return createErrorResponse(400, '请求数据格式错误');
    }

    const {
      product_code, name_zh, name_en, name_ru,
      description_zh, description_en, description_ru,
      specifications_zh, specifications_en, specifications_ru,
      applications_zh, applications_en, applications_ru,
      packaging_options_zh, packaging_options_en, packaging_options_ru,
      category, price, price_range,
      features_zh, features_en, features_ru,
      image_url, is_active = true, sort_order = 0
    } = body;

    console.log('📝 接收的产品数据:', {
      product_code, name_zh, name_en, name_ru, category,
      hasDescriptionZh: !!description_zh,
      hasDescriptionEn: !!description_en,
      hasFeaturesZh: !!features_zh,
      is_active, sort_order
    });

    // 快速验证必填字段
    if (!product_code?.trim() || !name_zh?.trim() || !name_en?.trim()) {
      return createErrorResponse(400, '请填写产品代码、中英文名称');
    }

    // 如果没有提供 category，使用默认值
    const finalCategory = category?.trim() || 'adhesive';

    if (!env.DB) {
      return createErrorResponse(500, 'D1数据库未配置');
    }

    try {
      // 优化的处理features函数
      const processFeatures = (features) => {
        if (!features) return '[]';
        if (typeof features === 'string') {
          try {
            // 验证是否为有效JSON
            JSON.parse(features);
            return features;
          } catch {
            return JSON.stringify([features]);
          }
        }
        if (Array.isArray(features)) return JSON.stringify(features);
        return '[]';
      };

      // 并行执行检查和数据处理
      const [existingProduct] = await Promise.all([
        env.DB.prepare(`SELECT id FROM products WHERE product_code = ?`).bind(product_code).first()
      ]);

      if (existingProduct) {
        return createErrorResponse(400, '产品代码已存在');
      }

      const productData = {
        product_code: product_code.trim(),
        name_zh: name_zh.trim(),
        name_en: name_en.trim(),
        name_ru: name_ru?.trim() || '',
        description_zh: description_zh?.trim() || '',
        description_en: description_en?.trim() || '',
        description_ru: description_ru?.trim() || '',
        specifications_zh: specifications_zh?.trim() || '',
        specifications_en: specifications_en?.trim() || '',
        specifications_ru: specifications_ru?.trim() || '',
        applications_zh: applications_zh?.trim() || '',
        applications_en: applications_en?.trim() || '',
        applications_ru: applications_ru?.trim() || '',
        packaging_options_zh: packaging_options_zh?.trim() || '',
        packaging_options_en: packaging_options_en?.trim() || '',
        packaging_options_ru: packaging_options_ru?.trim() || '',
        category: finalCategory,
        price: typeof price === 'number' ? price : 0,
        price_range: price_range?.trim() || '',
        features_zh: processFeatures(features_zh),
        features_en: processFeatures(features_en),
        features_ru: processFeatures(features_ru),
        image_url: image_url?.trim() || '',
        gallery_images: body.gallery_images?.trim() || '',
        tags: body.tags?.trim() || '',
        is_active: Boolean(is_active) ? 1 : 0,  // 确保布尔值转为整数
        is_featured: Boolean(body.is_featured) ? 1 : 0,
        sort_order: typeof sort_order === 'number' ? sort_order : 0,
        stock_quantity: typeof body.stock_quantity === 'number' ? body.stock_quantity : 0,
        min_order_quantity: typeof body.min_order_quantity === 'number' ? body.min_order_quantity : 1,
        meta_title_zh: body.meta_title_zh?.trim() || '',
        meta_title_en: body.meta_title_en?.trim() || '',
        meta_title_ru: body.meta_title_ru?.trim() || '',
        meta_description_zh: body.meta_description_zh?.trim() || '',
        meta_description_en: body.meta_description_en?.trim() || '',
        meta_description_ru: body.meta_description_ru?.trim() || ''
      };

      console.log('📝 创建产品:', {
        product_code: productData.product_code,
        name_zh: productData.name_zh,
        category: productData.category,
        hasImage: !!productData.image_url
      });

      // 单个事务中执行插入
      const result = await env.DB.prepare(`
        INSERT INTO products (
          product_code, name_zh, name_en, name_ru,
          description_zh, description_en, description_ru,
          specifications_zh, specifications_en, specifications_ru,
          applications_zh, applications_en, applications_ru,
          packaging_options_zh, packaging_options_en, packaging_options_ru,
          category, price, price_range,
          features_zh, features_en, features_ru,
          image_url, gallery_images, tags,
          is_active, is_featured, sort_order,
          stock_quantity, min_order_quantity,
          meta_title_zh, meta_title_en, meta_title_ru,
          meta_description_zh, meta_description_en, meta_description_ru
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        productData.product_code, productData.name_zh, productData.name_en, productData.name_ru,
        productData.description_zh, productData.description_en, productData.description_ru,
        productData.specifications_zh, productData.specifications_en, productData.specifications_ru,
        productData.applications_zh, productData.applications_en, productData.applications_ru,
        productData.packaging_options_zh, productData.packaging_options_en, productData.packaging_options_ru,
        productData.category, productData.price, productData.price_range,
        productData.features_zh, productData.features_en, productData.features_ru,
        productData.image_url, productData.gallery_images, productData.tags,
        productData.is_active, productData.is_featured, productData.sort_order,
        productData.stock_quantity, productData.min_order_quantity,
        productData.meta_title_zh, productData.meta_title_en, productData.meta_title_ru,
        productData.meta_description_zh, productData.meta_description_en, productData.meta_description_ru
      ).run();

      if (!result.meta?.last_row_id) {
        throw new Error('产品创建失败：未获得新产品ID');
      }

      // 立即查询创建的产品
      const newProduct = await env.DB.prepare(`
        SELECT * FROM products WHERE id = ?
      `).bind(result.meta.last_row_id).first();

      const elapsedTime = performance.now() - startTime;
      
      console.log('✅ 产品创建成功:', {
        id: result.meta.last_row_id,
        product_code: productData.product_code,
        time: `${elapsedTime.toFixed(2)}ms`
      });

      return new Response(JSON.stringify({
        data: newProduct,
        message: '产品创建成功',
        meta: {
          createTime: elapsedTime.toFixed(2),
          timestamp: new Date().toISOString()
        }
      }), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      });

    } catch (dbError) {
      const elapsedTime = performance.now() - startTime;
      console.error('创建产品失败:', {
        error: dbError.message,
        product_code,
        time: `${elapsedTime.toFixed(2)}ms`
      });
      
      return createErrorResponse(500, `数据库操作失败: ${dbError.message}`);
    }

  } catch (error) {
    const elapsedTime = performance.now() - startTime;
    console.error('创建产品API错误:', {
      error: error.message,
      time: `${elapsedTime.toFixed(2)}ms`
    });
    
    return createErrorResponse(500, '创建产品失败');
  }
}

// Handle update product API
async function handleUpdateProduct(request, env) {
  try {
    // 简单的认证检查
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
    const productId = url.pathname.split('/').pop();
    
    if (!productId || isNaN(parseInt(productId))) {
      return new Response(JSON.stringify({
        error: { message: '无效的产品ID' }
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const body = await request.json();
    const updateFields = [];
    const bindValues = [];

    // 处理features数组，确保是JSON字符串格式
    const processFeatures = (features) => {
      if (!features) return '[]';
      if (typeof features === 'string') return features;
      if (Array.isArray(features)) return JSON.stringify(features);
      return '[]';
    };

    // 动态构建更新字段
    const allowedFields = [
      'product_code', 'name_zh', 'name_en', 'name_ru',
      'description_zh', 'description_en', 'description_ru',
      'specifications_zh', 'specifications_en', 'specifications_ru',
      'applications_zh', 'applications_en', 'applications_ru',
      'packaging_options_zh', 'packaging_options_en', 'packaging_options_ru',
      'category', 'price', 'price_range',
      'features_zh', 'features_en', 'features_ru',
      'image_url', 'is_active', 'sort_order'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        // 特殊处理features字段
        if (field.startsWith('features_')) {
          bindValues.push(processFeatures(body[field]));
        } else {
          bindValues.push(body[field]);
        }
      }
    });

    if (updateFields.length === 0) {
      return new Response(JSON.stringify({
        error: { message: '没有需要更新的字段' }
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
        error: { message: 'D1数据库未配置' }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // 添加更新时间
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      bindValues.push(parseInt(productId));

      // 更新产品
      await env.DB.prepare(`
        UPDATE products SET ${updateFields.join(', ')} WHERE id = ?
      `).bind(...bindValues).run();

      // 查询更新后的产品
      const updatedProduct = await env.DB.prepare(`
        SELECT * FROM products WHERE id = ?
      `).bind(parseInt(productId)).first();

      if (!updatedProduct) {
        return new Response(JSON.stringify({
          error: { message: '产品不存在' }
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      return new Response(JSON.stringify({
        data: updatedProduct,
        message: '产品更新成功'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (dbError) {
      console.error('更新产品失败:', dbError);
      return new Response(JSON.stringify({
        error: { message: `数据库操作失败: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

  } catch (error) {
    console.error('更新产品API错误:', error);
    return new Response(JSON.stringify({
      error: { message: '更新产品失败' }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle delete product API
async function handleDeleteProduct(request, env) {
  try {
    // 简单的认证检查
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
    const productId = url.pathname.split('/').pop();
    
    if (!productId || isNaN(parseInt(productId))) {
      return new Response(JSON.stringify({
        error: { message: '无效的产品ID' }
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
        error: { message: 'D1数据库未配置' }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // 检查产品是否存在
      const product = await env.DB.prepare(`
        SELECT * FROM products WHERE id = ?
      `).bind(parseInt(productId)).first();

      if (!product) {
        return new Response(JSON.stringify({
          error: { message: '产品不存在' }
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // 删除产品
      await env.DB.prepare(`
        DELETE FROM products WHERE id = ?
      `).bind(parseInt(productId)).run();

      return new Response(JSON.stringify({
        message: '产品删除成功',
        data: { id: parseInt(productId) }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (dbError) {
      console.error('删除产品失败:', dbError);
      return new Response(JSON.stringify({
        error: { message: `数据库操作失败: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

  } catch (error) {
    console.error('删除产品API错误:', error);
    return new Response(JSON.stringify({
      error: { message: '删除产品失败' }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle get single product API
async function handleGetSingleProduct(request, env) {
  try {
    const url = new URL(request.url);
    const productId = url.pathname.split('/').pop();
    
    if (!productId || isNaN(parseInt(productId))) {
      return new Response(JSON.stringify({
        error: { message: '无效的产品ID' }
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
        error: { message: 'D1数据库未配置' }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // 查询产品
      const product = await env.DB.prepare(`
        SELECT * FROM products WHERE id = ?
      `).bind(parseInt(productId)).first();

      if (!product) {
        return new Response(JSON.stringify({
          error: { message: '产品不存在' }
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      return new Response(JSON.stringify({
        data: product
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (dbError) {
      console.error('查询产品失败:', dbError);
      return new Response(JSON.stringify({
        error: { message: `数据库查询失败: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

  } catch (error) {
    console.error('获取产品API错误:', error);
    return new Response(JSON.stringify({
      error: { message: '获取产品失败' }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle update contact API
async function handleUpdateContact(request, env) {
  try {
    // 简单的认证检查
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
    const contactId = url.pathname.split('/').pop();
    
    if (!contactId || isNaN(parseInt(contactId))) {
      return new Response(JSON.stringify({
        error: { message: '无效的联系消息ID' }
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const body = await request.json();
    const updateFields = [];
    const bindValues = [];

    // 动态构建更新字段
    const allowedFields = ['status', 'is_read'];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        bindValues.push(body[field]);
      }
    });

    if (updateFields.length === 0) {
      return new Response(JSON.stringify({
        error: { message: '没有需要更新的字段' }
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
        error: { message: 'D1数据库未配置' }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // 添加更新时间
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      bindValues.push(parseInt(contactId));

      // 更新联系消息
      await env.DB.prepare(`
        UPDATE contacts SET ${updateFields.join(', ')} WHERE id = ?
      `).bind(...bindValues).run();

      // 查询更新后的联系消息
      const updatedContact = await env.DB.prepare(`
        SELECT * FROM contacts WHERE id = ?
      `).bind(parseInt(contactId)).first();

      if (!updatedContact) {
        return new Response(JSON.stringify({
          error: { message: '联系消息不存在' }
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      return new Response(JSON.stringify({
        data: updatedContact,
        message: '联系消息更新成功'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (dbError) {
      console.error('更新联系消息失败:', dbError);
      return new Response(JSON.stringify({
        error: { message: `数据库操作失败: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

  } catch (error) {
    console.error('更新联系消息API错误:', error);
    return new Response(JSON.stringify({
      error: { message: '更新联系消息失败' }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle delete contact API
async function handleDeleteContact(request, env) {
  try {
    // 简单的认证检查
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
    const contactId = url.pathname.split('/').pop();
    
    if (!contactId || isNaN(parseInt(contactId))) {
      return new Response(JSON.stringify({
        error: { message: '无效的联系消息ID' }
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
        error: { message: 'D1数据库未配置' }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // 检查联系消息是否存在
      const contact = await env.DB.prepare(`
        SELECT * FROM contacts WHERE id = ?
      `).bind(parseInt(contactId)).first();

      if (!contact) {
        return new Response(JSON.stringify({
          error: { message: '联系消息不存在' }
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // 删除联系消息
      await env.DB.prepare(`
        DELETE FROM contacts WHERE id = ?
      `).bind(parseInt(contactId)).run();

      return new Response(JSON.stringify({
        message: '联系消息删除成功',
        data: { id: parseInt(contactId) }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (dbError) {
      console.error('删除联系消息失败:', dbError);
      return new Response(JSON.stringify({
        error: { message: `数据库操作失败: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

  } catch (error) {
    console.error('删除联系消息API错误:', error);
    return new Response(JSON.stringify({
      error: { message: '删除联系消息失败' }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle get page contents API
async function handleGetContents(request, env) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const pageKey = url.searchParams.get('page_key');
    const offset = (page - 1) * limit;

    if (!env.DB) {
      return new Response(JSON.stringify({
        error: { message: 'D1数据库未配置' }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      let whereClause = '';
      let bindParams = [limit, offset];
      
      if (pageKey) {
        whereClause = 'WHERE page_key = ?';
        bindParams = [pageKey, limit, offset];
      }
      
      // 获取内容数据
      const contents = await env.DB.prepare(`
        SELECT * FROM page_contents 
        ${whereClause}
        ORDER BY page_key ASC, sort_order ASC, created_at DESC 
        LIMIT ? OFFSET ?
      `).bind(...bindParams).all();
      
      // 获取总数
      const countQuery = pageKey 
        ? 'SELECT COUNT(*) as total FROM page_contents WHERE page_key = ?'
        : 'SELECT COUNT(*) as total FROM page_contents';
      const countParams = pageKey ? [pageKey] : [];
      
      const countResult = await env.DB.prepare(countQuery).bind(...countParams).first();
      
      return new Response(JSON.stringify({
        data: contents.results || [],
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
      return new Response(JSON.stringify({
        error: { message: `数据库查询失败: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
  } catch (error) {
    console.error('获取内容数据错误:', error);
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

// Handle update page content API
async function handleUpdateContent(request, env) {
  try {
    // 简单的认证检查
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
    const contentId = url.pathname.split('/').pop();
    
    if (!contentId || isNaN(parseInt(contentId))) {
      return new Response(JSON.stringify({
        error: { message: '无效的内容ID' }
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const body = await request.json();
    const updateFields = [];
    const bindValues = [];

    // 动态构建更新字段
    const allowedFields = [
      'content_zh', 'content_en', 'content_ru',
      'content_type', 'meta_data', 'category', 'tags',
      'is_active', 'sort_order', 
      'meta_title_zh', 'meta_title_en', 'meta_title_ru',
      'meta_description_zh', 'meta_description_en', 'meta_description_ru'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        bindValues.push(body[field]);
      }
    });

    if (updateFields.length === 0) {
      return new Response(JSON.stringify({
        error: { message: '没有需要更新的字段' }
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
        error: { message: 'D1数据库未配置' }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // 添加更新时间
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      bindValues.push(parseInt(contentId));

      // 更新内容
      await env.DB.prepare(`
        UPDATE page_contents SET ${updateFields.join(', ')} WHERE id = ?
      `).bind(...bindValues).run();

      // 查询更新后的内容
      const updatedContent = await env.DB.prepare(`
        SELECT * FROM page_contents WHERE id = ?
      `).bind(parseInt(contentId)).first();

      if (!updatedContent) {
        return new Response(JSON.stringify({
          error: { message: '内容不存在' }
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      return new Response(JSON.stringify({
        data: updatedContent,
        message: '内容更新成功'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (dbError) {
      console.error('更新内容失败:', dbError);
      return new Response(JSON.stringify({
        error: { message: `数据库操作失败: ${dbError.message}` }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

  } catch (error) {
    console.error('更新内容API错误:', error);
    return new Response(JSON.stringify({
      error: { message: '更新内容失败' }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle public products API (no authentication required)
async function handlePublicProducts(request, env) {
  try {
    // 纯D1数据库查询
    if (!env.DB) {
      return new Response(JSON.stringify({
        success: false,
        message: 'D1数据库未配置'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    try {
      // 获取激活的产品数据
      const products = await env.DB.prepare(`
        SELECT id, product_code, name_zh, name_en, name_ru,
               description_zh, description_en, description_ru,
               image_url, is_active, sort_order, created_at, updated_at,
               price_range, features_zh, features_en, features_ru,
               specifications_zh, specifications_en, specifications_ru,
               applications_zh, applications_en, applications_ru,
               packaging_options_zh, packaging_options_en, packaging_options_ru
        FROM products 
        WHERE is_active = 1
        ORDER BY sort_order ASC, created_at DESC
      `).all();
      
      return new Response(JSON.stringify({
        success: true,
        data: products.results || []
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (dbError) {
      console.error('D1查询失败:', dbError);
      return new Response(JSON.stringify({
        success: false,
        message: `数据库查询失败: ${dbError.message}`
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
  } catch (error) {
    console.error('获取公开产品数据错误:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '获取产品数据失败'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle dashboard statistics API
async function handleDashboardStats(request, env) {
  try {
    // 简单的认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createAuthError();
    }
    
    if (!env.DB) {
      return createErrorResponse(500, 'D1数据库未配置');
    }

    try {
      // 并行获取所有统计数据
      const [
        totalProducts,
        totalContacts,
        unreadContacts,
        activeProducts,
        recentActivities
      ] = await Promise.all([
        // 产品总数
        env.DB.prepare(`SELECT COUNT(*) as count FROM products`).first(),
        // 联系消息总数
        env.DB.prepare(`SELECT COUNT(*) as count FROM contacts`).first(),
        // 未读联系消息
        env.DB.prepare(`SELECT COUNT(*) as count FROM contacts WHERE is_read = 0`).first(),
        // 活跃产品数
        env.DB.prepare(`SELECT COUNT(*) as count FROM products WHERE is_active = 1`).first(),
        // 最近7天活动数
        env.DB.prepare(`
          SELECT COUNT(*) as count FROM contacts
          WHERE created_at >= datetime('now', '-7 days')
        `).first()
      ]);

      // 获取最近30天的每日联系消息统计
      const dailyContacts = await env.DB.prepare(`
        SELECT
          date(created_at) as date,
          COUNT(*) as count
        FROM contacts
        WHERE created_at >= datetime('now', '-30 days')
        GROUP BY date(created_at)
        ORDER BY date
      `).all();

      // 获取产品分类统计
      const categoryStats = await env.DB.prepare(`
        SELECT
          category,
          COUNT(*) as count
        FROM products
        WHERE is_active = 1
        GROUP BY category
        ORDER BY count DESC
      `).all();

      return new Response(JSON.stringify({
        data: {
          totalProducts: totalProducts?.count || 0,
          totalContacts: totalContacts?.count || 0,
          unreadContacts: unreadContacts?.count || 0,
          activeProducts: activeProducts?.count || 0,
          recentActivities: recentActivities?.count || 0,
          dailyContacts: dailyContacts.results || [],
          categoryStats: categoryStats.results || []
        },
        meta: {
          timestamp: new Date().toISOString()
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      });

    } catch (dbError) {
      console.error('仪表板统计查询失败:', dbError);
      return createErrorResponse(500, `数据库查询失败: ${dbError.message}`);
    }
    
  } catch (error) {
    console.error('仪表板统计API错误:', error);
    return createErrorResponse(500, '获取仪表板统计失败');
  }
}

// Handle dashboard activities API
async function handleDashboardActivities(request, env) {
  try {
    // 简单的认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createAuthError();
    }
    
    const url = new URL(request.url);
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
    
    if (!env.DB) {
      return createErrorResponse(500, 'D1数据库未配置');
    }

    try {
      // 获取最近的活动（联系消息和产品更新）
      const recentContacts = await env.DB.prepare(`
        SELECT
          id, name, email, created_at, status, is_read,
          'contact' as type
        FROM contacts
        ORDER BY created_at DESC
        LIMIT ?
      `).bind(limit).all();

      // 获取最近更新的产品
      const recentProducts = await env.DB.prepare(`
        SELECT
          id, product_code, name_zh, updated_at,
          'product' as type
        FROM products
        WHERE updated_at IS NOT NULL
        ORDER BY updated_at DESC
        LIMIT ?
      `).bind(limit).all();

      // 合并活动并按时间排序
      const allActivities = [
        ...(recentContacts.results || []).map(item => ({
          ...item,
          timestamp: item.created_at
        })),
        ...(recentProducts.results || []).map(item => ({
          ...item,
          timestamp: item.updated_at
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
       .slice(0, limit);

      return new Response(JSON.stringify({
        data: allActivities,
        pagination: {
          limit,
          total: allActivities.length
        },
        meta: {
          timestamp: new Date().toISOString()
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      });

    } catch (dbError) {
      console.error('仪表板活动查询失败:', dbError);
      return createErrorResponse(500, `数据库查询失败: ${dbError.message}`);
    }
    
  } catch (error) {
    console.error('仪表板活动API错误:', error);
    return createErrorResponse(500, '获取仪表板活动失败');
  }
}

// Handle dashboard system health API
async function handleDashboardHealth(request, env) {
  try {
    // 简单的认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createAuthError();
    }

    try {
      // 系统健康检查
      const healthData = {
        database: {
          status: env.DB ? 'connected' : 'not_configured',
          timestamp: new Date().toISOString()
        },
        storage: {
          status: env.IMAGE_BUCKET ? 'configured' : 'not_configured',
          timestamp: new Date().toISOString()
        },
        system: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          timestamp: new Date().toISOString()
        },
        environment: {
          node_env: process.env.NODE_ENV || 'production',
          timestamp: new Date().toISOString()
        }
      };

      return new Response(JSON.stringify({
        data: healthData,
        meta: {
          timestamp: new Date().toISOString()
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      });

    } catch (error) {
      console.error('系统健康检查失败:', error);
      return createErrorResponse(500, `系统健康检查失败: ${error.message}`);
    }
    
  } catch (error) {
    console.error('仪表板健康API错误:', error);
    return createErrorResponse(500, '获取系统健康信息失败');
  }
}
// Handle company info API
async function handleCompanyInfo(request, env) {
  try {
    const url = new URL(request.url);
    const section = url.pathname.split('/').pop();
    const language = url.searchParams.get('lang') || 'zh';
    
    if (!env.DB) {
      return createErrorResponse(500, 'D1数据库未配置');
    }

    try {
      let query;
      let bindParams;
      
      if (section === 'all') {
        query = 'SELECT * FROM company_info WHERE is_active = 1 AND language = ?';
        bindParams = [language];
      } else {
        query = 'SELECT * FROM company_info WHERE section_type = ? AND is_active = 1 AND language = ?';
        bindParams = [section, language];
      }
      
      const result = await env.DB.prepare(query).bind(...bindParams).all();
      
      return new Response(JSON.stringify({
        success: true,
        data: result.results || []
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300'
        }
      });
      
    } catch (dbError) {
      console.error('公司信息查询失败:', dbError);
      return createErrorResponse(500, '数据库查询失败: ' + dbError.message);
    }
    
  } catch (error) {
    console.error('公司信息API错误:', error);
    return createErrorResponse(500, '获取公司信息失败');
  }
}

// Handle company content API
async function handleCompanyContent(request, env) {
  try {
    const url = new URL(request.url);
    const type = url.pathname.split('/').pop();
    const language = url.searchParams.get('lang') || 'zh';
    
    if (!env.DB) {
      return createErrorResponse(500, 'D1数据库未配置');
    }

    try {
      let query;
      let bindParams;
      
      if (type === 'all') {
        query = 'SELECT * FROM company_content WHERE is_active = 1 AND language = ?';
        bindParams = [language];
      } else {
        query = 'SELECT * FROM company_content WHERE content_type = ? AND is_active = 1 AND language = ?';
        bindParams = [type, language];
      }
      
      const result = await env.DB.prepare(query).bind(...bindParams).all();
      
      return new Response(JSON.stringify({
        success: true,
        data: result.results || []
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300'
        }
      });
      
    } catch (dbError) {
      console.error('公司内容查询失败:', dbError);
      return createErrorResponse(500, '数据库查询失败: ' + dbError.message);
    }
    
  } catch (error) {
    console.error('公司内容API错误:', error);
    return createErrorResponse(500, '获取公司内容失败');
  }
}

// Handle get page content API (public, no auth required)
async function handleGetPageContent(request, env, pageType) {
  try {
    const url = new URL(request.url);
    const language = url.searchParams.get('lang') || 'zh';
    
    if (!env.DB) {
      return createErrorResponse(500, 'D1数据库未配置');
    }

    try {
      // 查询指定页面的内容
      const contents = await env.DB.prepare(`
        SELECT id, section_key, content_zh, content_en, content_ru,
               content_type, meta_data, sort_order, created_at, updated_at
        FROM page_contents 
        WHERE page_key = ? AND is_active = 1
        ORDER BY sort_order ASC, created_at DESC
      `).bind(pageType).all();
      
      // 根据语言过滤内容
      const filteredContents = (contents.results || []).map(content => {
        let displayContent;
        switch (language) {
          case 'en':
            displayContent = content.content_en || content.content_zh;
            break;
          case 'ru':
            displayContent = content.content_ru || content.content_zh;
            break;
          default:
            displayContent = content.content_zh;
        }
        
        return {
          id: content.id,
          section_key: content.section_key,
          content: displayContent,
          content_type: content.content_type,
          meta_data: content.meta_data ? JSON.parse(content.meta_data) : {},
          sort_order: content.sort_order,
          created_at: content.created_at,
          updated_at: content.updated_at
        };
      });
      
      return new Response(JSON.stringify({
        success: true,
        data: filteredContents,
        meta: {
          page: pageType,
          language: language,
          total: filteredContents.length
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300'
        }
      });
      
    } catch (dbError) {
      console.error(`${pageType}页面内容查询失败:`, dbError);
      return createErrorResponse(500, '数据库查询失败: ' + dbError.message);
    }
    
  } catch (error) {
    console.error(`${pageType}页面内容API错误:`, error);
    return createErrorResponse(500, `获取${pageType}页面内容失败`);
  }
}

// Handle get admin page content API (admin only)
async function handleGetAdminPageContent(request, env, pageType) {
  try {
    // 简单的认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createAuthError();
    }
    
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
    const offset = (page - 1) * limit;
    
    if (!env.DB) {
      return createErrorResponse(500, 'D1数据库未配置');
    }

    try {
      // 并行获取数据和总数
      const [contentsResult, countResult] = await Promise.all([
        env.DB.prepare(`
          SELECT id, section_key, content_zh, content_en, content_ru,
                 content_type, meta_data, category, tags,
                 is_active, sort_order, created_at, updated_at,
                 meta_title_zh, meta_title_en, meta_title_ru,
                 meta_description_zh, meta_description_en, meta_description_ru
          FROM page_contents 
          WHERE page_key = ?
          ORDER BY sort_order ASC, created_at DESC 
          LIMIT ? OFFSET ?
        `).bind(pageType, limit, offset).all(),
        
        env.DB.prepare(`SELECT COUNT(*) as total FROM page_contents WHERE page_key = ?`).bind(pageType).first()
      ]);
      
      return new Response(JSON.stringify({
        success: true,
        data: contentsResult.results || [],
        pagination: {
          page,
          limit,
          total: countResult?.total || 0,
          totalPages: Math.ceil((countResult?.total || 0) / limit)
        },
        meta: {
          page: pageType,
          timestamp: new Date().toISOString()
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'private, max-age=60'
        }
      });
      
    } catch (dbError) {
      console.error(`${pageType}页面管理内容查询失败:`, dbError);
      return createErrorResponse(500, '数据库查询失败: ' + dbError.message);
    }
    
  } catch (error) {
    console.error(`${pageType}页面管理内容API错误:`, error);
    return createErrorResponse(500, `获取${pageType}页面管理内容失败`);
  }
}

// Handle create page content API (admin only)
async function handleCreatePageContent(request, env, pageType) {
  try {
    // 简单的认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createAuthError();
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return createErrorResponse(400, '请求数据格式错误');
    }

    const {
      section_key,
      content_zh, content_en, content_ru,
      content_type = 'text',
      meta_data = {},
      category = '',
      tags = '',
      is_active = true,
      sort_order = 0,
      meta_title_zh = '', meta_title_en = '', meta_title_ru = '',
      meta_description_zh = '', meta_description_en = '', meta_description_ru = ''
    } = body;

    // 验证必填字段
    if (!section_key?.trim() || !content_zh?.trim()) {
      return createErrorResponse(400, '请填写区域键和中文内容');
    }

    if (!env.DB) {
      return createErrorResponse(500, 'D1数据库未配置');
    }

    try {
      // 检查是否存在相同的section_key
      const existing = await env.DB.prepare(`
        SELECT id FROM page_contents WHERE page_key = ? AND section_key = ?
      `).bind(pageType, section_key).first();

      if (existing) {
        return createErrorResponse(400, '相同的区域键已存在');
      }

      // 创建内容
      const result = await env.DB.prepare(`
        INSERT INTO page_contents (
          page_key, section_key,
          content_zh, content_en, content_ru,
          content_type, meta_data, category, tags,
          is_active, sort_order,
          meta_title_zh, meta_title_en, meta_title_ru,
          meta_description_zh, meta_description_en, meta_description_ru
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        pageType, section_key.trim(),
        content_zh.trim(), content_en?.trim() || '', content_ru?.trim() || '',
        content_type, JSON.stringify(meta_data), category.trim(), tags.trim(),
        is_active ? 1 : 0, sort_order,
        meta_title_zh.trim(), meta_title_en.trim(), meta_title_ru.trim(),
        meta_description_zh.trim(), meta_description_en.trim(), meta_description_ru.trim()
      ).run();

      if (!result.meta?.last_row_id) {
        throw new Error('内容创建失败：未获得新内容ID');
      }

      // 查询创建的内容
      const newContent = await env.DB.prepare(`
        SELECT * FROM page_contents WHERE id = ?
      `).bind(result.meta.last_row_id).first();

      console.log(`✅ ${pageType}页面内容创建成功:`, {
        id: result.meta.last_row_id,
        section_key: section_key
      });

      return new Response(JSON.stringify({
        success: true,
        data: newContent,
        message: `${pageType}页面内容创建成功`,
        meta: {
          page: pageType,
          timestamp: new Date().toISOString()
        }
      }), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      });

    } catch (dbError) {
      console.error(`创建${pageType}页面内容失败:`, dbError);
      return createErrorResponse(500, `数据库操作失败: ${dbError.message}`);
    }

  } catch (error) {
    console.error(`创建${pageType}页面内容API错误:`, error);
    return createErrorResponse(500, `创建${pageType}页面内容失败`);
  }
}

// Handle update page content API (admin only)
async function handleUpdatePageContent(request, env, pageType) {
  try {
    // 简单的认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createAuthError();
    }

    const url = new URL(request.url);
    const contentId = url.pathname.split('/').pop();
    
    if (!contentId || isNaN(parseInt(contentId))) {
      return createErrorResponse(400, '无效的内容ID');
    }

    const body = await request.json();
    const updateFields = [];
    const bindValues = [];

    // 动态构建更新字段
    const allowedFields = [
      'section_key', 'content_zh', 'content_en', 'content_ru',
      'content_type', 'meta_data', 'category', 'tags',
      'is_active', 'sort_order',
      'meta_title_zh', 'meta_title_en', 'meta_title_ru',
      'meta_description_zh', 'meta_description_en', 'meta_description_ru'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        // 特殊处理meta_data字段
        if (field === 'meta_data') {
          bindValues.push(JSON.stringify(body[field]));
        } else {
          bindValues.push(body[field]);
        }
      }
    });

    if (updateFields.length === 0) {
      return createErrorResponse(400, '没有需要更新的字段');
    }

    if (!env.DB) {
      return createErrorResponse(500, 'D1数据库未配置');
    }

    try {
      // 验证内容属于指定页面
      const existingContent = await env.DB.prepare(`
        SELECT * FROM page_contents WHERE id = ? AND page_key = ?
      `).bind(parseInt(contentId), pageType).first();

      if (!existingContent) {
        return createErrorResponse(404, `${pageType}页面中未找到指定内容`);
      }

      // 添加更新时间
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      bindValues.push(parseInt(contentId));

      // 更新内容
      await env.DB.prepare(`
        UPDATE page_contents SET ${updateFields.join(', ')} WHERE id = ?
      `).bind(...bindValues).run();

      // 查询更新后的内容
      const updatedContent = await env.DB.prepare(`
        SELECT * FROM page_contents WHERE id = ?
      `).bind(parseInt(contentId)).first();

      return new Response(JSON.stringify({
        success: true,
        data: updatedContent,
        message: `${pageType}页面内容更新成功`,
        meta: {
          page: pageType,
          timestamp: new Date().toISOString()
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      });

    } catch (dbError) {
      console.error(`更新${pageType}页面内容失败:`, dbError);
      return createErrorResponse(500, `数据库操作失败: ${dbError.message}`);
    }

  } catch (error) {
    console.error(`更新${pageType}页面内容API错误:`, error);
    return createErrorResponse(500, `更新${pageType}页面内容失败`);
  }
}

// Handle delete page content API (admin only)
async function handleDeletePageContent(request, env, pageType) {
  try {
    // 简单的认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return createAuthError();
    }

    const url = new URL(request.url);
    const contentId = url.pathname.split('/').pop();
    
    if (!contentId || isNaN(parseInt(contentId))) {
      return createErrorResponse(400, '无效的内容ID');
    }

    if (!env.DB) {
      return createErrorResponse(500, 'D1数据库未配置');
    }

    try {
      // 验证内容属于指定页面
      const content = await env.DB.prepare(`
        SELECT * FROM page_contents WHERE id = ? AND page_key = ?
      `).bind(parseInt(contentId), pageType).first();

      if (!content) {
        return createErrorResponse(404, `${pageType}页面中未找到指定内容`);
      }

      // 删除内容
      await env.DB.prepare(`
        DELETE FROM page_contents WHERE id = ?
      `).bind(parseInt(contentId)).run();

      return new Response(JSON.stringify({
        success: true,
        message: `${pageType}页面内容删除成功`,
        data: { id: parseInt(contentId) },
        meta: {
          page: pageType,
          timestamp: new Date().toISOString()
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      });

    } catch (dbError) {
      console.error(`删除${pageType}页面内容失败:`, dbError);
      return createErrorResponse(500, `数据库操作失败: ${dbError.message}`);
    }

  } catch (error) {
    console.error(`删除${pageType}页面内容API错误:`, error);
    return createErrorResponse(500, `删除${pageType}页面内容失败`);
  }
}

// Handle get single product by product code (public, no auth required)
async function handleGetSingleProductByCode(request, env, productCode) {
  try {
    if (!env.DB) {
      return createErrorResponse(500, 'D1数据库未配置');
    }

    try {
      // 通过产品代码查询产品
      const product = await env.DB.prepare(`
        SELECT * FROM products WHERE product_code = ? AND is_active = 1
      `).bind(productCode).first();

      if (!product) {
        return new Response(JSON.stringify({
          success: false,
          message: '产品不存在或已停用'
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      return new Response(JSON.stringify({
        success: true,
        data: product
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (dbError) {
      console.error('通过产品代码查询产品失败:', dbError);
      return createErrorResponse(500, `数据库查询失败: ${dbError.message}`);
    }
    
  } catch (error) {
    console.error('通过产品代码获取产品API错误:', error);
    return createErrorResponse(500, '获取产品失败');
  }
}
