// 临时管理员登录系统
// 直接在浏览器控制台运行，绕过Supabase认证

// 管理员账号信息
const ADMIN_CREDENTIALS = {
  email: 'niexianlei0@gmail.com',
  password: 'XIANche041758'
};

// 检查本地存储的登录状态
const checkAdminAuth = () => {
  return localStorage.getItem('adminLoggedIn') === 'true';
};

// 设置登录状态
const setAdminAuth = (isLoggedIn) => {
  if (isLoggedIn) {
    localStorage.setItem('adminLoggedIn', 'true');
    localStorage.setItem('adminUser', ADMIN_CREDENTIALS.email);
  } else {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
  }
};

// 临时登录验证
const tempLogin = (email, password) => {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    setAdminAuth(true);
    window.location.href = '/admin/dashboard';
    return true;
  }
  return false;
};

// 自动登录检查
if (checkAdminAuth()) {
  console.log('管理员已登录');
} else {
  console.log('需要登录');
}