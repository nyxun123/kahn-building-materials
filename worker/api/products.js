/**
 * 产品管理API - 支持完整内容管理
 */

// 获取所有产品（公共API）
export async function getProducts(env, includeInactive = false) {
  try {
    const query = `
      SELECT 
        id, product_code, name_zh, name_en, name_ru,
        description_zh, description_en, description_ru,
        image_url, is_active, sort_order, created_at, updated_at,
        features, specifications, seo_title, seo_description, seo_keywords,
        category, price_range, status, version
      FROM products
      ${includeInactive ? '' : 'WHERE status = "published"'}
      ORDER BY sort_order ASC, created_at DESC
    `;
    
    const result = await env.DB.prepare(query).all();
    
    // 处理JSON字段
    const products = result.results.map(product => ({
      ...product,
      features: product.features ? JSON.parse(product.features) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : [],
      images: product.images ? JSON.parse(product.images) : [product.image_url]
    }));
    
    return {
      success: true,
      data: products,
      count: products.length
    };
  } catch (error) {
    console.error('获取产品失败:', error);
    return {
      success: false,
      message: '获取产品失败',
      error: error.message
    };
  }
}

// 获取单个产品
export async function getProductById(env, id) {
  try {
    const query = `
      SELECT 
        id, product_code, name_zh, name_en, name_ru,
        description_zh, description_en, description_ru,
        image_url, is_active, sort_order, created_at, updated_at,
        features, specifications, seo_title, seo_description, seo_keywords,
        category, price_range, status, version
      FROM products
      WHERE id = ?
    `;
    
    const result = await env.DB.prepare(query).bind(id).first();
    
    if (!result) {
      return {
        success: false,
        message: '产品不存在'
      };
    }
    
    const product = {
      ...result,
      features: result.features ? JSON.parse(result.features) : [],
      specifications: result.specifications ? JSON.parse(result.specifications) : [],
      images: result.images ? JSON.parse(result.images) : [result.image_url]
    };
    
    return {
      success: true,
      data: product
    };
  } catch (error) {
    console.error('获取产品详情失败:', error);
    return {
      success: false,
      message: '获取产品详情失败',
      error: error.message
    };
  }
}

// 创建新产品（管理后台）
export async function createProduct(env, productData, userId) {
  try {
    const {
      name_zh, name_en, name_ru,
      description_zh, description_en, description_ru,
      features, specifications, images,
      category, price_range,
      seo_title, seo_description, seo_keywords,
      status = 'draft'
    } = productData;
    
    // 生成产品代码
    const product_code = generateProductCode(name_zh);
    
    // 准备数据
    const featuresJson = JSON.stringify(features || []);
    const specificationsJson = JSON.stringify(specifications || []);
    const imagesJson = JSON.stringify(images || []);
    
    const insertQuery = `
      INSERT INTO products (
        product_code, name_zh, name_en, name_ru,
        description_zh, description_en, description_ru,
        features, specifications, images,
        category, price_range,
        seo_title, seo_description, seo_keywords,
        status, is_active, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const now = new Date().toISOString();
    const result = await env.DB.prepare(insertQuery)
      .bind(
        product_code, name_zh, name_en || name_zh, name_ru || name_zh,
        description_zh, description_en || description_zh, description_ru || description_zh,
        featuresJson, specificationsJson, imagesJson,
        category || '墙纸胶', price_range || '¥0-0',
        seo_title || name_zh, seo_description || description_zh?.substring(0, 150), seo_keywords || name_zh,
        status, status === 'published' ? 1 : 0, 999, now, now
      )
      .run();
    
    const productId = result.meta.last_row_id;
    
    // 创建版本历史
    await createProductVersion(env, productId, 1, {
      ...productData,
      id: productId,
      product_code,
      created_at: now,
      updated_at: now
    }, userId, 'created');
    
    return {
      success: true,
      data: { id: productId, product_code },
      message: '产品创建成功'
    };
  } catch (error) {
    console.error('创建产品失败:', error);
    return {
      success: false,
      message: '创建产品失败',
      error: error.message
    };
  }
}

// 更新产品（管理后台）
export async function updateProduct(env, id, productData, userId) {
  try {
    const existingProduct = await getProductById(env, id);
    if (!existingProduct.success) {
      return existingProduct;
    }
    
    const {
      name_zh, name_en, name_ru,
      description_zh, description_en, description_ru,
      features, specifications, images,
      category, price_range,
      seo_title, seo_description, seo_keywords,
      status
    } = productData;
    
    const featuresJson = JSON.stringify(features || []);
    const specificationsJson = JSON.stringify(specifications || []);
    const imagesJson = JSON.stringify(images || []);
    
    const updateQuery = `
      UPDATE products SET
        name_zh = ?, name_en = ?, name_ru = ?,
        description_zh = ?, description_en = ?, description_ru = ?,
        features = ?, specifications = ?, images = ?,
        category = ?, price_range = ?,
        seo_title = ?, seo_description = ?, seo_keywords = ?,
        status = ?, is_active = ?, updated_at = ?, version = version + 1
      WHERE id = ?
    `;
    
    const now = new Date().toISOString();
    await env.DB.prepare(updateQuery)
      .bind(
        name_zh, name_en || name_zh, name_ru || name_zh,
        description_zh, description_en || description_zh, description_ru || description_zh,
        featuresJson, specificationsJson, imagesJson,
        category || '墙纸胶', price_range || '¥0-0',
        seo_title || name_zh, seo_description || description_zh?.substring(0, 150), seo_keywords || name_zh,
        status, status === 'published' ? 1 : 0, now, id
      )
      .run();
    
    // 创建新版本历史
    const updatedProduct = await getProductById(env, id);
    await createProductVersion(env, id, updatedProduct.data.version, updatedProduct.data, userId, 'updated');
    
    return {
      success: true,
      message: '产品更新成功'
    };
  } catch (error) {
    console.error('更新产品失败:', error);
    return {
      success: false,
      message: '更新产品失败',
      error: error.message
    };
  }
}

// 删除产品（管理后台）
export async function deleteProduct(env, id, userId) {
  try {
    const product = await getProductById(env, id);
    if (!product.success) {
      return product;
    }
    
    // 创建删除版本历史
    await createProductVersion(env, id, product.data.version + 1, product.data, userId, 'deleted');
    
    // 删除产品
    await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    
    return {
      success: true,
      message: '产品删除成功'
    };
  } catch (error) {
    console.error('删除产品失败:', error);
    return {
      success: false,
      message: '删除产品失败',
      error: error.message
    };
  }
}

// 获取产品版本历史
export async function getProductVersions(env, productId) {
  try {
    const query = `
      SELECT id, product_id, version, content, created_at, created_by, action
      FROM product_versions
      WHERE product_id = ?
      ORDER BY version DESC
    `;
    
    const result = await env.DB.prepare(query).bind(productId).all();
    
    const versions = result.results.map(version => ({
      ...version,
      content: JSON.parse(version.content)
    }));
    
    return {
      success: true,
      data: versions
    };
  } catch (error) {
    console.error('获取版本历史失败:', error);
    return {
      success: false,
      message: '获取版本历史失败',
      error: error.message
    };
  }
}

// 恢复到指定版本
export async function restoreProductVersion(env, productId, versionId, userId) {
  try {
    const versionQuery = `
      SELECT content FROM product_versions
      WHERE id = ? AND product_id = ?
    `;
    
    const versionResult = await env.DB.prepare(versionQuery)
      .bind(versionId, productId)
      .first();
    
    if (!versionResult) {
      return {
        success: false,
        message: '版本不存在'
      };
    }
    
    const versionData = JSON.parse(versionResult.content);
    
    // 更新产品为指定版本
    const updateQuery = `
      UPDATE products SET
        product_code = ?, name_zh = ?, name_en = ?, name_ru = ?,
        description_zh = ?, description_en = ?, description_ru = ?,
        features = ?, specifications = ?, images = ?,
        category = ?, price_range = ?,
        seo_title = ?, seo_description = ?, seo_keywords = ?,
        status = ?, is_active = ?, updated_at = ?, version = version + 1
      WHERE id = ?
    `;
    
    const now = new Date().toISOString();
    await env.DB.prepare(updateQuery)
      .bind(
        versionData.product_code, versionData.name_zh, versionData.name_en, versionData.name_ru,
        versionData.description_zh, versionData.description_en, versionData.description_ru,
        JSON.stringify(versionData.features || []), JSON.stringify(versionData.specifications || []), JSON.stringify(versionData.images || []),
        versionData.category, versionData.price_range,
        versionData.seo_title, versionData.seo_description, versionData.seo_keywords,
        versionData.status, versionData.status === 'published' ? 1 : 0, now, productId
      )
      .run();
    
    // 创建恢复版本历史
    const updatedProduct = await getProductById(env, productId);
    await createProductVersion(env, productId, updatedProduct.data.version, updatedProduct.data, userId, 'restored');
    
    return {
      success: true,
      message: '版本恢复成功'
    };
  } catch (error) {
    console.error('恢复版本失败:', error);
    return {
      success: false,
      message: '恢复版本失败',
      error: error.message
    };
  }
}

// 创建产品版本历史
async function createProductVersion(env, productId, version, content, userId, action) {
  try {
    const insertQuery = `
      INSERT INTO product_versions (product_id, version, content, created_by, action)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await env.DB.prepare(insertQuery)
      .bind(productId, version, JSON.stringify(content), userId, action)
      .run();
  } catch (error) {
    console.error('创建版本历史失败:', error);
  }
}

// 生成产品代码
function generateProductCode(name) {
  const timestamp = Date.now().toString(36);
  const nameSlug = name.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 20);
  return `${nameSlug}-${timestamp}`;
}

// 处理产品API请求
export async function handleProductsRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  
  // 添加CORS头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  
  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    let response;
    
    if (path === '/api/products' && method === 'GET') {
      const includeInactive = url.searchParams.get('includeInactive') === 'true';
      response = await getProducts(env, includeInactive);
    } else if (path.match(/^\/api\/products\/\d+$/) && method === 'GET') {
      const id = parseInt(path.split('/').pop());
      response = await getProductById(env, id);
    } else if (path === '/api/admin/products' && method === 'GET') {
      response = await getProducts(env, true);
    } else if (path === '/api/admin/products' && method === 'POST') {
      const productData = await request.json();
      const userId = request.headers.get('X-User-Id') || 'anonymous';
      response = await createProduct(env, productData, userId);
    } else if (path.match(/^\/api\/admin\/products\/\d+$/) && method === 'PUT') {
      const id = parseInt(path.split('/').pop());
      const productData = await request.json();
      const userId = request.headers.get('X-User-Id') || 'anonymous';
      response = await updateProduct(env, id, productData, userId);
    } else if (path.match(/^\/api\/admin\/products\/\d+$/) && method === 'DELETE') {
      const id = parseInt(path.split('/').pop());
      const userId = request.headers.get('X-User-Id') || 'anonymous';
      response = await deleteProduct(env, id, userId);
    } else if (path.match(/^\/api\/admin\/products\/\d+\/versions$/) && method === 'GET') {
      const productId = parseInt(path.split('/')[4]);
      response = await getProductVersions(env, productId);
    } else if (path.match(/^\/api\/admin\/products\/\d+\/restore$/) && method === 'POST') {
      const productId = parseInt(path.split('/')[4]);
      const { versionId } = await request.json();
      const userId = request.headers.get('X-User-Id') || 'anonymous';
      response = await restoreProductVersion(env, productId, versionId, userId);
    } else {
      return new Response('Not Found', { 
        status: 404, 
        headers: corsHeaders 
      });
    }
    
    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('API处理错误:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '服务器错误',
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
}