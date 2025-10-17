// 图片上传API - Cloudflare Pages Function
export async function onRequestPost(context) {
  const { request, env } = context;
  const startTime = performance.now();
  
  console.log('🚀 开始处理图片上传请求');
  
  try {
    // 认证检查
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      console.error('❌ 图片上传失败: 缺少认证头');
      return createErrorResponse(401, '需要登录才能上传图片');
    }

    // 检查Content-Type并支持多种格式
    const contentType = request.headers.get('content-type') || '';
    
    let file, folder;
    
    if (contentType.includes('multipart/form-data')) {
      // 处理FormData格式
      console.log('📁 处理FormData格式上传');
      let formData;
      try {
        formData = await request.formData();
        console.log('✅ FormData 解析成功');
      } catch (formError) {
        console.error('❌ FormData 解析失败:', formError);
        return createErrorResponse(400, '文件解析失败，请重新选择文件');
      }
      
      file = formData.get('file');
      folder = formData.get('folder') || 'products';
      
    } else if (contentType.includes('application/json')) {
      // 处理JSON格式（base64图片数据）
      console.log('📁 处理JSON格式上传');
      const jsonData = await request.json();
      
      // 兼容不同的字段名
      const imageData = jsonData.imageData || jsonData.fileData;
      if (!imageData || !jsonData.fileName) {
        return createErrorResponse(400, 'JSON格式需要包含imageData或fileData和fileName字段');
      }

      // 解析base64数据
      const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return createErrorResponse(400, '无效的base64图片数据格式');
      }
      
      const mimeType = matches[1];
      const base64Data = matches[2];
      
      // 将base64转换为Blob以模拟File对象
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      file = {
        name: jsonData.fileName,
        type: mimeType,
        size: bytes.length,
        arrayBuffer: () => Promise.resolve(bytes.buffer)
      };
      
      folder = jsonData.folder || 'products';
      
    } else {
      return createErrorResponse(400, '请使用multipart/form-data或application/json格式上传文件');
    }
    
    console.log('📁 文件信息:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      folder: folder
    });
    
    // 验证文件存在性
    if (!file || !file.name || !file.size) {
      return createErrorResponse(400, '请选择有效的文件');
    }
    
    // 根据文件类型设置不同的限制（现在也支持视频）
    const fileType = file.type.toLowerCase();
    let allowedTypes, maxSize, fileTypeCategory;

    if (fileType.startsWith('image/')) {
      // 图片类型支持
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
      maxSize = 10 * 1024 * 1024; // 10MB for images
      fileTypeCategory = 'image';
    } else if (fileType.startsWith('video/')) {
      // 视频类型支持
      allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv'];
      maxSize = 100 * 1024 * 1024; // 100MB for videos
      fileTypeCategory = 'video';
    } else {
      return createErrorResponse(400, `不支持的文件类型: ${fileType}。只支持图片和视频文件。`);
    }

    // 验证文件类型
    if (!allowedTypes.includes(fileType)) {
      return createErrorResponse(400, `不支持的${fileTypeCategory === 'image' ? '图片' : '视频'}格式: ${fileType}`);
    }

    // 验证文件大小
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / 1024 / 1024).toFixed(0);
      return createErrorResponse(413, `${fileTypeCategory === 'image' ? '图片' : '视频'}大小超过限制 (${(file.size / 1024 / 1024).toFixed(2)}MB > ${maxSizeMB}MB)`);
    }
    
    // 生成安全的文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeFileName = `${folder}/${timestamp}_${randomStr}.${extension}`;
    
    console.log('🚀 开始处理文件:', safeFileName);
    
    // 检查是否配置了R2存储桶
    if (!env.IMAGE_BUCKET) {
      console.log('⚠️ R2存储桶未配置，使用base64回退');
      // 返回base64格式的图片数据
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      const dataUrl = `data:${file.type};base64,${base64}`;
      
      const elapsedTime = performance.now() - startTime;
      
      return new Response(JSON.stringify({
        code: 200,
        message: `${fileTypeCategory === 'image' ? '图片' : '视频'}上传成功 (Base64)`,
        data: {
          original: dataUrl,
          large: dataUrl,
          medium: dataUrl,
          small: dataUrl,
          thumbnail: dataUrl,
          fileName: safeFileName,
          fileSize: file.size,
          fileType: file.type,
          fileTypeCategory: fileTypeCategory,
          uploadMethod: 'base64',
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
    
    // 使用R2存储
    console.log('☁️ 使用Cloudflare R2存储');
    
    try {
      // 将文件转换为ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // 上传到R2
      const putResult = await env.IMAGE_BUCKET.put(safeFileName, arrayBuffer, {
        httpMetadata: {
          contentType: file.type,
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
      
      // 构建公共访问URL - 使用配置的R2桶公共域名
      // 尝试使用环境变量，回退到默认域名
      const r2Domain = env.R2_PUBLIC_DOMAIN || env.CF_R2_PUBLIC_DOMAIN || 'https://pub-b9f0c2c358074609bf8701513c879957.r2.dev';
      const imageUrl = `${r2Domain}/${safeFileName}`;
      const elapsedTime = performance.now() - startTime;
      
      console.log('✅ R2上传成功:', { url: imageUrl, time: `${elapsedTime.toFixed(2)}ms` });
      
      return new Response(JSON.stringify({
        code: 200,
        message: `${fileTypeCategory === 'image' ? '图片' : '视频'}上传成功`,
        data: {
          original: imageUrl,
          large: imageUrl,
          medium: imageUrl,
          small: imageUrl,
          thumbnail: imageUrl,
          fileName: safeFileName,
          fileSize: file.size,
          fileType: file.type,
          fileTypeCategory: fileTypeCategory,
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
      console.log('🔄 回退到base64方式');
      
      // R2失败时回退到base64方式
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      const dataUrl = `data:${file.type};base64,${base64}`;
      
      const elapsedTime = performance.now() - startTime;
      
      return new Response(JSON.stringify({
        code: 200,
        message: `${fileTypeCategory === 'image' ? '图片' : '视频'}上传成功 (Base64回退)`,
        data: {
          original: dataUrl,
          large: dataUrl,
          medium: dataUrl,
          small: dataUrl,
          thumbnail: dataUrl,
          fileName: safeFileName,
          fileSize: file.size,
          fileType: file.type,
          fileTypeCategory: fileTypeCategory,
          uploadMethod: 'base64_fallback',
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
    
  } catch (error) {
    console.error('图片上传API错误:', error);
    return createErrorResponse(500, `图片上传失败: ${error.message}`);
  }
}

// 处理OPTIONS请求 (CORS预检)
export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// 创建错误响应的辅助函数
function createErrorResponse(status, message) {
  console.error(`❌ API错误 [${status}]:`, message);
  
  return new Response(JSON.stringify({
    code: status,
    message: message,
    error: true
  }), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    }
  });
}