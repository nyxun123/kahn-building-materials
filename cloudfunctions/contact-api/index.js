const cloudbase = require('@cloudbase/node-sdk');

const app = cloudbase.init({
  env: cloudbase.SYMBOL_CURRENT_ENV
});

const db = app.database();

// 邮件发送函数（简化版本，记录到日志）
async function sendEmail(to, subject, content) {
  try {
    // 由于没有配置邮件服务，暂时记录到日志
    console.log('邮件发送请求:', {
      to: to,
      subject: subject,
      content: content,
      timestamp: new Date()
    });
    
    // TODO: 后续可配置真实邮件服务（如SendGrid、阿里云邮件服务等）
    return { success: true, message: '邮件记录成功' };
  } catch (error) {
    console.error('邮件记录失败:', error);
    return { success: false, error: error.message };
  }
}

// 验证邮箱格式
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 验证电话号码
function validatePhone(phone) {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return !phone || re.test(phone.replace(/\s/g, ''));
}

// 防垃圾信息检查
function isSpam(content) {
  const spamKeywords = [
    'viagra', 'casino', 'lottery', 'winner', 'click here', 'free money',
    'urgent', 'congratulations', 'million dollars', 'bitcoin', 'investment'
  ];
  
  const lowerContent = content.toLowerCase();
  return spamKeywords.some(keyword => lowerContent.includes(keyword));
}

// 主处理函数
exports.main = async (event, context) => {
  const { action, data } = event;
  
  try {
    switch (action) {
      case 'SUBMIT_CONTACT':
        return await submitContactMessage(data);
      
      case 'GET_MESSAGES':
        return await getContactMessages();
      
      case 'UPDATE_STATUS':
        return await updateMessageStatus(data.id, data.status);
      
      default:
        return {
          code: 400,
          message: '无效的操作类型',
          data: null
        };
    }
  } catch (error) {
    console.error('联系API错误:', error);
    return {
      code: 500,
      message: `服务器错误: ${error.message}`,
      data: null
    };
  }
};

// 提交联系消息
async function submitContactMessage(contactData) {
  try {
    // 数据验证
    const { name, email, company, phone, country, subject, message, language = 'zh' } = contactData;
    
    // 必填字段检查
    if (!name || !email || !message) {
      return {
        code: 400,
        message: '请填写所有必填字段',
        data: null
      };
    }
    
    // 邮箱格式验证
    if (!validateEmail(email)) {
      return {
        code: 400,
        message: '邮箱格式不正确',
        data: null
      };
    }
    
    // 电话号码验证
    if (phone && !validatePhone(phone)) {
      return {
        code: 400,
        message: '电话号码格式不正确',
        data: null
      };
    }
    
    // 垃圾信息检查
    if (isSpam(message) || isSpam(name) || (company && isSpam(company))) {
      return {
        code: 400,
        message: '检测到可疑内容，请重新填写',
        data: null
      };
    }
    
    // 消息长度检查
    if (message.length < 10) {
      return {
        code: 400,
        message: '消息内容太短，请提供更多信息',
        data: null
      };
    }
    
    if (message.length > 2000) {
      return {
        code: 400,
        message: '消息内容过长，请控制在2000字以内',
        data: null
      };
    }
    
    // 创建消息记录 - 使用云开发数据库
    const newMessage = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company ? company.trim() : null,
      phone: phone ? phone.trim() : null,
      country: country ? country.trim() : null,
      subject: subject ? subject.trim() : '网站联系咨询',
      message: message.trim(),
      language: language,
      status: 'new',
      is_read: false,
      admin_notes: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await db.collection('contact_messages').add(newMessage);
    
    // 发送邮件通知（记录到日志）
    await sendEmail(
      'admin@karn-materials.com', // 管理员邮箱
      `新的客户咨询 - ${subject || '网站联系咨询'}`,
      `
客户姓名: ${name}
客户邮箱: ${email}
客户公司: ${company || '未提供'}
客户电话: ${phone || '未提供'}
客户国家: ${country || '未提供'}
咨询主题: ${subject || '网站联系咨询'}
咨询内容: ${message}
提交时间: ${new Date().toLocaleString('zh-CN')}
      `
    );
    
    // 记录成功提交日志
    console.log(`联系消息提交成功: ${name} (${email}), 主题: ${subject || '网站联系咨询'}`);
    
    return {
      code: 200,
      message: '消息提交成功，我们将尽快回复您',
      data: {
        id: result.id,
        ...newMessage
      }
    };
    
  } catch (error) {
    console.error('提交联系消息错误:', error);
    throw error;
  }
}

// 获取联系消息列表（管理员使用）
async function getContactMessages() {
  try {
    const result = await db.collection('contact_messages')
      .orderBy('created_at', 'desc')
      .get();
    
    return {
      code: 200,
      message: '获取消息列表成功',
      data: result.data
    };
  } catch (error) {
    throw error;
  }
}

// 更新消息状态（管理员使用）
async function updateMessageStatus(id, status) {
  try {
    await db.collection('contact_messages').doc(id).update({
      status: status,
      updated_at: new Date()
    });
    
    return {
      code: 200,
      message: '状态更新成功',
      data: { id, status }
    };
  } catch (error) {
    throw error;
  }
}