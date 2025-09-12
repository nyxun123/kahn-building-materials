const cloudbase = require('@cloudbase/node-sdk');

const app = cloudbase.init({
  env: cloudbase.SYMBOL_CURRENT_ENV
});

const db = app.database();

// 产品管理API
exports.main = async (event, context) => {
  const { action, data, id, filters } = event;
  
  try {
    switch (action) {
      case 'GET_PRODUCTS':
        return await getProducts(filters);
      
      case 'GET_PRODUCT':
        return await getProduct(id);
      
      case 'CREATE_PRODUCT':
        return await createProduct(data);
      
      case 'UPDATE_PRODUCT':
        return await updateProduct(id, data);
      
      case 'DELETE_PRODUCT':
        return await deleteProduct(id);
      
      case 'UPDATE_PRODUCT_IMAGE':
        return await updateProductImage(id, data.image_url);
      
      case 'TOGGLE_STATUS':
        return await toggleProductStatus(id);
      
      default:
        return {
          code: 400,
          message: '无效的操作类型',
          data: null
        };
    }
  } catch (error) {
    console.error('产品API错误:', error);
    return {
      code: 500,
      message: `服务器错误: ${error.message}`,
      data: null
    };
  }
};

// 获取产品列表
async function getProducts(filters = {}) {
  try {
    let query = db.collection('products')
      .orderBy('sort_order', 'asc')
      .orderBy('created_at', 'desc');

    // 应用过滤条件
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.where(key, '==', value);
      }
    });

    const result = await query.get();
    
    return {
      code: 200,
      message: '获取产品列表成功',
      data: result.data
    };
  } catch (error) {
    throw error;
  }
}

// 获取单个产品
async function getProduct(id) {
  try {
    const result = await db.collection('products').doc(id).get();
    
    if (!result.data) {
      return {
        code: 404,
        message: '产品不存在',
        data: null
      };
    }

    return {
      code: 200,
      message: '获取产品成功',
      data: result.data
    };
  } catch (error) {
    throw error;
  }
}

// 创建产品
async function createProduct(productData) {
  try {
    // 数据验证
    if (!productData.product_code || !productData.name_zh || !productData.name_en || !productData.name_ru) {
      return {
        code: 400,
        message: '缺少必要字段',
        data: null
      };
    }

    const newProduct = {
      ...productData,
      created_at: new Date(),
      updated_at: new Date(),
      is_active: productData.is_active !== undefined ? productData.is_active : true,
      sort_order: productData.sort_order || 999
    };

    const result = await db.collection('products').add(newProduct);

    return {
      code: 201,
      message: '产品创建成功',
      data: { id: result.id, ...newProduct }
    };
  } catch (error) {
    throw error;
  }
}

// 更新产品
async function updateProduct(id, updateData) {
  try {
    const updateDataWithTimestamp = {
      ...updateData,
      updated_at: new Date()
    };

    await db.collection('products').doc(id).update(updateDataWithTimestamp);

    return {
      code: 200,
      message: '产品更新成功',
      data: { id, ...updateDataWithTimestamp }
    };
  } catch (error) {
    throw error;
  }
}

// 删除产品
async function deleteProduct(id) {
  try {
    await db.collection('products').doc(id).remove();
    
    return {
      code: 200,
      message: '产品删除成功',
      data: { id }
    };
  } catch (error) {
    throw error;
  }
}

// 更新产品图片
async function updateProductImage(id, imageUrl) {
  try {
    await db.collection('products').doc(id).update({
      image_url: imageUrl,
      updated_at: new Date()
    });

    return {
      code: 200,
      message: '产品图片更新成功',
      data: { id, image_url: imageUrl }
    };
  } catch (error) {
    throw error;
  }
}

// 切换产品状态
async function toggleProductStatus(id) {
  try {
    const product = await db.collection('products').doc(id).get();
    
    if (!product.data) {
      return {
        code: 404,
        message: '产品不存在',
        data: null
      };
    }

    const newStatus = !product.data.is_active;
    
    await db.collection('products').doc(id).update({
      is_active: newStatus,
      updated_at: new Date()
    });

    return {
      code: 200,
      message: '产品状态更新成功',
      data: { id, is_active: newStatus }
    };
  } catch (error) {
    throw error;
  }
}