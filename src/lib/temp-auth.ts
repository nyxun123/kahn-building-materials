// 临时认证解决方案 - 直到Supabase问题解决
export class TempAuth {
  private static ADMIN_CREDENTIALS = {
    email: 'niexianlei0@gmail.com',
    password: 'XIANche041758'
  };

  private static AUTH_KEY = 'temp-admin-auth';

  static async login(email: string, password: string) {
    try {
      // 验证邮箱和密码
      if (email.toLowerCase() === this.ADMIN_CREDENTIALS.email.toLowerCase() && 
          password === this.ADMIN_CREDENTIALS.password) {
        
        // 创建临时用户会话
        const user = {
          id: 'temp-admin-user',
          email: email.toLowerCase(),
          role: 'admin',
          name: '管理员',
          login_time: new Date().toISOString()
        };

        // 保存到localStorage
        localStorage.setItem(this.AUTH_KEY, JSON.stringify(user));
        
        return {
          success: true,
          user: user
        };
      } else {
        throw new Error('邮箱或密码错误');
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '登录失败'
      };
    }
  }

  static logout() {
    localStorage.removeItem(this.AUTH_KEY);
  }

  static getCurrentUser() {
    try {
      const userData = localStorage.getItem(this.AUTH_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

// 联系表单本地存储
export class TempStorage {
  private static CONTACTS_KEY = 'temp-contact-messages';
  private static PRODUCTS_KEY = 'temp-products';

  static saveContact(contactData: any) {
    try {
      const contacts = this.getContacts();
      const newContact = {
        id: Date.now().toString(),
        ...contactData,
        created_at: new Date().toISOString(),
        status: 'new',
        is_read: false
      };
      
      contacts.unshift(newContact);
      localStorage.setItem(this.CONTACTS_KEY, JSON.stringify(contacts));
      
      return { success: true, data: newContact };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '保存失败' 
      };
    }
  }

  static getContacts() {
    try {
      const data = localStorage.getItem(this.CONTACTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveProduct(productData: any) {
    try {
      const products = this.getProducts();
      const newProduct = {
        id: Date.now().toString(),
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      products.unshift(newProduct);
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
      
      return { success: true, data: newProduct };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '保存失败' 
      };
    }
  }

  static getProducts() {
    try {
      const data = localStorage.getItem(this.PRODUCTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}