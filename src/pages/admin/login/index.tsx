import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const { t } = useTranslation(['common', 'admin']);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // 使用Supabase标准认证
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      if (authData.user) {
        // 保存用户信息到本地存储
        localStorage.setItem('admin_user', JSON.stringify(authData.user));
        
        toast.success(t('admin:login.success'));
        navigate('/admin/dashboard');
      } else {
        throw new Error(t('admin:login.error'));
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(error instanceof Error ? error.message : t('admin:login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-950 dark:to-blue-800 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{t('admin:login.page_title')} | {t('title')}</title>
      </Helmet>

      <div className="max-w-md w-full space-y-8 bg-background p-8 rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            {t('admin:login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {t('admin:login.subtitle')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">
                {t('admin:login.email')}
              </Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                  {...register('email', { 
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
                  })}
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
              {errors.email?.type === 'required' && (
                <p className="mt-1 text-sm text-destructive">{t('admin:login.required')}</p>
              )}
              {errors.email?.type === 'pattern' && (
                <p className="mt-1 text-sm text-destructive">{t('admin:login.email_invalid')}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">
                {t('admin:login.password')}
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                  {...register('password', { required: true })}
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{t('admin:login.required')}</p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('admin:login.logging_in')}
                </>
              ) : t('admin:login.login_button')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
