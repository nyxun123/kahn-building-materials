const cloudbase = require('@cloudbase/node-sdk');
const sharp = require('sharp');
const path = require('path');

// 初始化云开发环境
const app = cloudbase.init({
  env: cloudbase.SYMBOL_CURRENT_ENV
});

const db = app.database();
const storage = app.storage();

exports.main = async (event, context) => {
  try {
    // 支持两种输入格式：base64 和 FormData
    let fileBuffer, fileName, folder;
    
    if (event.file && event.fileName) {
      // base64 格式（原有格式）
      fileBuffer = Buffer.from(event.file, 'base64');
      fileName = event.fileName;
      folder = event.folder || 'products';
    } else if (context.headers && context.headers['content-type'] && context.headers['content-type'].includes('multipart/form-data')) {
      // FormData 格式（前端发送的格式）
      const body = JSON.parse(event.body || '{}');
      if (!body.file || !body.file.name) {
        return {
          code: 400,
          message: '缺少文件数据',
          data: null
        };
      }
      
      fileBuffer = Buffer.from(body.file.content, 'base64');
      fileName = body.file.name;
      folder = body.folder || 'products';
    } else {
      return {
        code: 400,
        message: '不支持的数据格式',
        data: null
      };
    }

    // 验证输入
    if (!fileBuffer || !fileName) {
      return {
        code: 400,
        message: '缺少必要参数',
        data: null
      };
    }
    
    // 获取文件扩展名
    const ext = path.extname(fileName).toLowerCase();
    
    // 支持的图片格式
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    if (!supportedFormats.includes(ext)) {
      return {
        code: 400,
        message: '不支持的图片格式',
        data: null
      };
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const newFileName = `${folder}/${timestamp}_${randomStr}${ext}`;

    // 压缩图片（生成多个尺寸）
    const sizes = [
      { name: 'original', width: null, height: null, quality: 85 },
      { name: 'large', width: 1200, height: 900, quality: 80 },
      { name: 'medium', width: 600, height: 450, quality: 75 },
      { name: 'small', width: 300, height: 225, quality: 70 },
      { name: 'thumbnail', width: 150, height: 112, quality: 60 }
    ];

    const uploadPromises = [];
    const urls = {};

    for (const size of sizes) {
      let processedBuffer = fileBuffer;
      let outputExt = ext;
      
      if (size.width || size.height) {
        // 根据原文件格式选择输出格式
        if (ext === '.png') {
          processedBuffer = await sharp(fileBuffer)
            .resize(size.width, size.height, { 
              fit: 'inside',
              withoutEnlargement: false
            })
            .png({ quality: size.quality, compressionLevel: 6 })
            .toBuffer();
        } else if (ext === '.webp') {
          processedBuffer = await sharp(fileBuffer)
            .resize(size.width, size.height, { 
              fit: 'inside',
              withoutEnlargement: false
            })
            .webp({ quality: size.quality })
            .toBuffer();
        } else {
          // jpg, jpeg 和其他格式转为 jpeg
          processedBuffer = await sharp(fileBuffer)
            .resize(size.width, size.height, { 
              fit: 'inside',
              withoutEnlargement: false
            })
            .jpeg({ quality: size.quality })
            .toBuffer();
          outputExt = '.jpg';
        }
      }

      const sizeFileName = newFileName.replace(ext, `_${size.name}${outputExt}`);
      
      uploadPromises.push(
        storage.uploadFile({
          cloudPath: sizeFileName,
          fileContent: processedBuffer
        }).then(result => {
          urls[size.name] = result.fileID;
          return {
            size: size.name,
            url: result.fileID,
            width: size.width || null,
            height: size.height || null
          };
        })
      );
    }

    const uploadResults = await Promise.all(uploadPromises);

    // 记录上传信息到数据库
    const imageRecord = {
      original_name: fileName,
      folder,
      urls,
      sizes: uploadResults,
      upload_time: new Date(),
      file_size: fileBuffer.length,
      mime_type: `image/${ext.slice(1)}`
    };

    await db.collection('uploaded_images').add(imageRecord);

    return {
      code: 200,
      message: '图片上传成功',
      data: {
        original: urls.original,
        large: urls.large,
        medium: urls.medium,
        small: urls.small,
        thumbnail: urls.thumbnail,
        fullUrls: urls
      }
    };

  } catch (error) {
    console.error('图片上传失败:', error);
    
    return {
      code: 500,
      message: `图片上传失败: ${error.message}`,
      data: null
    };
  }
};