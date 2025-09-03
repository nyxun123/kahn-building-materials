import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { TempAuth } from '@/lib/temp-auth';

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
      // 使用 Cloudflare Workers API 认证
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok && result.user) {
        // 存储用户信息到 localStorage
        localStorage.setItem('admin-auth', JSON.stringify({
          user: result.user,
          token: `admin-${Date.now()}`,
          loginTime: new Date().toISOString()
        }));
        
        toast.success('登录成功！');
        navigate('/admin/dashboard');
      } else {
        throw new Error(result.error?.message || '登录失败');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // 降级到本地临时认证
      try {
        const tempResult = await TempAuth.login(email, password);
        if (tempResult.success) {
          toast.success('登录成功！（离线模式）');
          navigate('/admin/dashboard');
        } else {
          throw new Error(tempResult.error || '登录失败');
        }
      } catch (fallbackError: any) {
        toast.error('登录失败，请检查用户名和密码');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('login.page_title')} | 杭州卡恩新型建材有限公司</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              管理员登录
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              请输入您的管理员账号和密码
            </p>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-md">
              <p className="text-sm">
                请输入您的管理员账号和密码
              </p>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  电子邮箱
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:text-white`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:text-white`}
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