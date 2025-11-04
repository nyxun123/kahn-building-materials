import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';

const Login = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      newErrors.email = t('login.required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('login.email_invalid');
      isValid = false;
    }

    if (!password) {
      newErrors.password = t('login.required');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // 使用 Cloudflare Workers + D1 数据库认证
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '登录请求失败');
      }

      const result = await response.json();
      console.log('📦 登录响应:', result);

      // 🔧 修复: API返回格式是 { success: true, data: { user, accessToken, refreshToken, ... } }
      // 需要从 result.data 中读取数据，而不是直接从 result 读取
      const data = result.data || result; // 兼容旧格式
      const user = data.user || result.user;
      const accessToken = data.accessToken || result.accessToken;
      const refreshToken = data.refreshToken || result.refreshToken;
      const expiresIn = data.expiresIn || result.expiresIn || 900;
      const authType = data.authType || result.authType || 'JWT';

      if (result.success && user && accessToken && refreshToken) {
        // 使用 AuthManager 保存 JWT tokens
        const { AuthManager } = await import('@/lib/auth-manager');

        // 保存 JWT tokens
        AuthManager.saveTokens(accessToken, refreshToken, expiresIn);

        // 保存用户信息
        AuthManager.saveUserInfo({
          id: user.id,
          email: user.email,
          name: user.name || '',
          role: user.role || 'admin'
        });

        // 同时保存到旧的存储位置以保持兼容性
        localStorage.setItem('admin-auth', JSON.stringify({
          user: user,
          accessToken: accessToken,
          refreshToken: refreshToken,
          expiresIn: expiresIn,
          loginTime: new Date().toISOString(),
          authType: authType
        }));

        console.log('✅ JWT Tokens 已保存');
        toast.success('登录成功！');
        
        // 🔧 修复: 确保所有同步操作完成后再跳转
        // 使用 window.location.href 而不是 navigate，避免路由冲突
        // 这样可以确保页面完全重新加载，AdminLayout 会重新检查认证信息
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 200);
      } else {
        console.error('❌ 登录响应格式错误:', {
          success: result.success,
          hasUser: !!user,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          result: result
        });
        throw new Error(result.message || '认证失败：响应格式错误');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || '登录失败，请检查用户名和密码');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('login.page_title')} | 杭州卡恩新型建材有限公司</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              管理员登录
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              请输入您的管理员账号和密码
            </p>
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
              <p className="text-sm">
                使用您的管理员账号登录系统
              </p>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  电子邮箱
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 bg-white border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "登录中..." : "登录"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;