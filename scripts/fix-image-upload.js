// 修复图片上传函数的脚本
const fs = require('fs');

const fixedImageUploadFunction = `
// Handle image upload requests - 完全修复版本
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
      
      return createErrorResponse(400, \`请求解析失败: \${formError.message}\`);
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
    if (!file || !file.name || !file.size) {
      return createErrorResponse(400, '请选择有效的图片文件');
    }
    
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return createErrorResponse(400, \`不支持的文件类型: \${file.type}\`);
    }
    
    // 验证文件大小 (5MB限制)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return createErrorResponse(413, \`文件大小超过限制 (\${(file.size / 1024 / 1024).toFixed(2)}MB > 5MB)\`);
    }
    
    // 生成安全的文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeFileName = \`\${folder}/\${timestamp}_\${randomStr}.\${extension}\`;
    
    console.log('🚀 开始处理文件:', safeFileName);
    
    // 如果配置了R2存储桶，使用R2
    if (env.IMAGE_BUCKET) {
      console.log('☁️ 使用Cloudflare R2存储');
      
      try {
        // 直接上传到R2
        const putResult = await env.IMAGE_BUCKET.put(safeFileName, file.stream(), {
          httpMetadata: {
            contentType: file.type,
            cacheControl: 'public, max-age=31536000',
            contentDisposition: \`inline; filename="\${file.name}"\`,
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
        
        // 使用项目域名的子域名访问R2
        const r2Domain = env.R2_CUSTOM_DOMAIN || 'images.kn-wallpaperglue.com';
        const imageUrl = \`https://\${r2Domain}/\${safeFileName}\`;
        const elapsedTime = performance.now() - startTime;
        
        console.log('✅ R2上传成功:', { url: imageUrl, time: \`\${elapsedTime.toFixed(2)}ms\` });
        
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
        
      } catch (r2Error) {
        console.error('❌ R2上传失败:', r2Error);
        return createErrorResponse(500, \`R2存储失败: \${r2Error.message}\`);
      }
    } else {
      // 没有R2配置时直接返回错误
      return createErrorResponse(503, 'R2存储桶未配置，请联系管理员');
    }
    
  } catch (error) {
    console.error('图片上传API错误:', error);
    return createErrorResponse(500, \`图片上传失败: \${error.message}\`);
  }
}`;

console.log('图片上传函数已准备，需要手动替换到Worker文件中');
`;

console.log('修复脚本已生成');
