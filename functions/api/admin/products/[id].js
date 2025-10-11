// 单个产品的操作 - GET, PUT, DELETE
export async function onRequestGet(context) {
  const { request, env, params } = context;
  
  try {
    // 认证检查
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
    
    // 数据库检查
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

    const productId = params.id;
    if (!productId) {
      return new Response(JSON.stringify({
        error: { message: '产品ID不能为空' }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    console.log('🔍 查询产品ID:', productId);
    
    // 获取产品详情 - 包含所有字段
    const product = await env.DB.prepare(`
      SELECT id, product_code, name_zh, name_en, name_ru,
             description_zh, description_en, description_ru,
             specifications_zh, specifications_en, specifications_ru,
             applications_zh, applications_en, applications_ru,
             features_zh, features_en, features_ru,
             image_url, gallery_images, price, price_range,
             packaging_options_zh, packaging_options_en, packaging_options_ru,
             category, tags, is_active, is_featured, sort_order,
             stock_quantity, min_order_quantity,
             meta_title_zh, meta_title_en, meta_title_ru,
             meta_description_zh, meta_description_en, meta_description_ru,
             created_at, updated_at
      FROM products WHERE id = ?
    `).bind(productId).first();
    
    console.log('📦 查询到的原始产品数据:', product);
    
    if (!product) {
      console.warn('❌ 产品不存在:', productId);
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
    
    // 处理数据格式，确保与前端期望一致
    const processedProduct = {
      ...product,
      // 确保数值类型正确
      id: parseInt(product.id),
      price: product.price ? parseFloat(product.price) : 0,
      sort_order: product.sort_order ? parseInt(product.sort_order) : 0,
      stock_quantity: product.stock_quantity ? parseInt(product.stock_quantity) : 0,
      min_order_quantity: product.min_order_quantity ? parseInt(product.min_order_quantity) : 1,
      
      // 确保布尔类型正确 (D1返回0/1，需转换为boolean)
      is_active: Boolean(product.is_active && product.is_active !== 0),
      is_featured: Boolean(product.is_featured && product.is_featured !== 0),
      
      // 确保字符串字段不为null
      product_code: product.product_code || '',
      name_zh: product.name_zh || '',
      name_en: product.name_en || '',
      name_ru: product.name_ru || '',
      description_zh: product.description_zh || '',
      description_en: product.description_en || '',
      description_ru: product.description_ru || '',
      specifications_zh: product.specifications_zh || '',
      specifications_en: product.specifications_en || '',
      specifications_ru: product.specifications_ru || '',
      applications_zh: product.applications_zh || '',
      applications_en: product.applications_en || '',
      applications_ru: product.applications_ru || '',
      image_url: product.image_url || '',
      gallery_images: product.gallery_images || '',
      price_range: product.price_range || '',
      packaging_options_zh: product.packaging_options_zh || '',
      packaging_options_en: product.packaging_options_en || '',
      packaging_options_ru: product.packaging_options_ru || '',
      category: product.category || 'adhesive',
      tags: product.tags || '',
      meta_title_zh: product.meta_title_zh || '',
      meta_title_en: product.meta_title_en || '',
      meta_title_ru: product.meta_title_ru || '',
      meta_description_zh: product.meta_description_zh || '',
      meta_description_en: product.meta_description_en || '',
      meta_description_ru: product.meta_description_ru || '',
      
      // Features字段保持JSON格式，让前端处理
      features_zh: product.features_zh || '[]',
      features_en: product.features_en || '[]',
      features_ru: product.features_ru || '[]',
    };
    
    console.log('✅ 处理后的产品数据:', processedProduct);
    
    // 返回单个对象格式，不包装成数组 - 这是关键修复
    const responseData = {
      success: true,
      data: processedProduct,
      meta: {
        timestamp: new Date().toISOString(),
        productId: productId
      }
    };
    
    console.log('📤 返回的响应数据:', responseData);
    
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate', // 禁用缓存
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('获取产品详情失败:', error);
    return new Response(JSON.stringify({
      error: { message: `获取产品详情失败: ${error.message}` }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// 更新产品 - PUT请求
export async function onRequestPut(context) {
  const { request, env, params } = context;
  
  try {
    // 认证检查
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
    
    // 数据库检查
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

    const productId = params.id;
    if (!productId) {
      return new Response(JSON.stringify({
        error: { message: '产品ID不能为空' }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 解析请求数据
    const productData = await request.json();
    console.log('更新产品数据:', productData);
    
    // 检查产品是否存在
    const existingProduct = await env.DB.prepare(
      'SELECT id FROM products WHERE id = ?'
    ).bind(productId).first();
    
    if (!existingProduct) {
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
    
    // 如果修改了产品代码，检查是否重复
    if (productData.product_code) {
      const duplicateProduct = await env.DB.prepare(
        'SELECT id FROM products WHERE product_code = ? AND id != ?'
      ).bind(productData.product_code, productId).first();
      
      if (duplicateProduct) {
        return new Response(JSON.stringify({
          error: { message: '产品代码已存在' }
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }
    
    // 构建动态更新查询 - 支持所有可能的字段
    const updateFields = [];
    const updateValues = [];
    
    // 基础字段
    if (productData.product_code !== undefined) {
      updateFields.push('product_code = ?');
      updateValues.push(productData.product_code);
    }
    if (productData.name_zh !== undefined) {
      updateFields.push('name_zh = ?');
      updateValues.push(productData.name_zh);
    }
    if (productData.name_en !== undefined) {
      updateFields.push('name_en = ?');
      updateValues.push(productData.name_en);
    }
    if (productData.name_ru !== undefined) {
      updateFields.push('name_ru = ?');
      updateValues.push(productData.name_ru);
    }
    
    // 描述字段
    if (productData.description_zh !== undefined) {
      updateFields.push('description_zh = ?');
      updateValues.push(productData.description_zh);
    }
    if (productData.description_en !== undefined) {
      updateFields.push('description_en = ?');
      updateValues.push(productData.description_en);
    }
    if (productData.description_ru !== undefined) {
      updateFields.push('description_ru = ?');
      updateValues.push(productData.description_ru);
    }
    
    // 规格字段
    if (productData.specifications_zh !== undefined) {
      updateFields.push('specifications_zh = ?');
      updateValues.push(productData.specifications_zh);
    }
    if (productData.specifications_en !== undefined) {
      updateFields.push('specifications_en = ?');
      updateValues.push(productData.specifications_en);
    }
    if (productData.specifications_ru !== undefined) {
      updateFields.push('specifications_ru = ?');
      updateValues.push(productData.specifications_ru);
    }
    
    // 应用字段
    if (productData.applications_zh !== undefined) {
      updateFields.push('applications_zh = ?');
      updateValues.push(productData.applications_zh);
    }
    if (productData.applications_en !== undefined) {
      updateFields.push('applications_en = ?');
      updateValues.push(productData.applications_en);
    }
    if (productData.applications_ru !== undefined) {
      updateFields.push('applications_ru = ?');
      updateValues.push(productData.applications_ru);
    }
    
    // 特性字段
    if (productData.features_zh !== undefined) {
      updateFields.push('features_zh = ?');
      updateValues.push(typeof productData.features_zh === 'string' ? productData.features_zh : '[]');
    }
    if (productData.features_en !== undefined) {
      updateFields.push('features_en = ?');
      updateValues.push(typeof productData.features_en === 'string' ? productData.features_en : '[]');
    }
    if (productData.features_ru !== undefined) {
      updateFields.push('features_ru = ?');
      updateValues.push(typeof productData.features_ru === 'string' ? productData.features_ru : '[]');
    }
    
    // 图片和媒体字段
    if (productData.image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(productData.image_url);
    }
    if (productData.gallery_images !== undefined) {
      updateFields.push('gallery_images = ?');
      updateValues.push(productData.gallery_images);
    }
    
    // 价格字段
    if (productData.price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(typeof productData.price === 'number' ? productData.price : 0);
    }
    if (productData.price_range !== undefined) {
      updateFields.push('price_range = ?');
      updateValues.push(productData.price_range);
    }
    
    // 包装选项字段
    if (productData.packaging_options_zh !== undefined) {
      updateFields.push('packaging_options_zh = ?');
      updateValues.push(productData.packaging_options_zh);
    }
    if (productData.packaging_options_en !== undefined) {
      updateFields.push('packaging_options_en = ?');
      updateValues.push(productData.packaging_options_en);
    }
    if (productData.packaging_options_ru !== undefined) {
      updateFields.push('packaging_options_ru = ?');
      updateValues.push(productData.packaging_options_ru);
    }
    
    // 分类和标签
    if (productData.category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(productData.category);
    }
    if (productData.tags !== undefined) {
      updateFields.push('tags = ?');
      updateValues.push(productData.tags);
    }
    
    // 状态字段
    if (productData.is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(productData.is_active ? 1 : 0);
    }
    if (productData.is_featured !== undefined) {
      updateFields.push('is_featured = ?');
      updateValues.push(productData.is_featured ? 1 : 0);
    }
    if (productData.sort_order !== undefined) {
      updateFields.push('sort_order = ?');
      updateValues.push(typeof productData.sort_order === 'number' ? productData.sort_order : 0);
    }
    
    // 库存字段
    if (productData.stock_quantity !== undefined) {
      updateFields.push('stock_quantity = ?');
      updateValues.push(typeof productData.stock_quantity === 'number' ? productData.stock_quantity : 0);
    }
    if (productData.min_order_quantity !== undefined) {
      updateFields.push('min_order_quantity = ?');
      updateValues.push(typeof productData.min_order_quantity === 'number' ? productData.min_order_quantity : 1);
    }
    
    // SEO字段
    if (productData.meta_title_zh !== undefined) {
      updateFields.push('meta_title_zh = ?');
      updateValues.push(productData.meta_title_zh);
    }
    if (productData.meta_title_en !== undefined) {
      updateFields.push('meta_title_en = ?');
      updateValues.push(productData.meta_title_en);
    }
    if (productData.meta_title_ru !== undefined) {
      updateFields.push('meta_title_ru = ?');
      updateValues.push(productData.meta_title_ru);
    }
    if (productData.meta_description_zh !== undefined) {
      updateFields.push('meta_description_zh = ?');
      updateValues.push(productData.meta_description_zh);
    }
    if (productData.meta_description_en !== undefined) {
      updateFields.push('meta_description_en = ?');
      updateValues.push(productData.meta_description_en);
    }
    if (productData.meta_description_ru !== undefined) {
      updateFields.push('meta_description_ru = ?');
      updateValues.push(productData.meta_description_ru);
    }
    
    // 总是更新时间戳
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    
    if (updateFields.length === 1) { // 只有时间戳字段
      return new Response(JSON.stringify({
        error: { message: '没有要更新的字段' }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 添加WHERE条件的参数
    updateValues.push(productId);
    
    // 更新产品数据
    const updateQuery = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;
    console.log('更新查询:', updateQuery, updateValues);
    
    const result = await env.DB.prepare(updateQuery).bind(...updateValues).run();
    
    console.log('✅ 产品更新成功:', result.changes);
    
    // 返回更新后的产品
    const updatedProduct = await env.DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(productId).first();
    
    return new Response(JSON.stringify({
      success: true,
      data: updatedProduct
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('更新产品失败:', error);
    return new Response(JSON.stringify({
      error: { message: `更新产品失败: ${error.message}` }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// 删除产品 - DELETE请求
export async function onRequestDelete(context) {
  const { request, env, params } = context;
  
  try {
    // 认证检查
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
    
    // 数据库检查
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

    const productId = params.id;
    if (!productId) {
      return new Response(JSON.stringify({
        error: { message: '产品ID不能为空' }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // 检查产品是否存在
    const existingProduct = await env.DB.prepare(
      'SELECT id, product_code FROM products WHERE id = ?'
    ).bind(productId).first();
    
    if (!existingProduct) {
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
    const result = await env.DB.prepare(
      'DELETE FROM products WHERE id = ?'
    ).bind(productId).run();
    
    console.log('✅ 产品删除成功:', existingProduct.product_code);
    
    return new Response(JSON.stringify({
      success: true,
      message: '产品删除成功'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('删除产品失败:', error);
    return new Response(JSON.stringify({
      error: { message: `删除产品失败: ${error.message}` }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// 处理OPTIONS请求 (CORS预检)
export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}