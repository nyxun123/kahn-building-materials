import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Mail, MapPin, Phone, Send, User, Building, Globe } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getApiUrl, API_CONFIG } from '@/lib/config';

interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const { t, i18n } = useTranslation(['common', 'contact']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // 显示提交进度
    toast.loading('正在提交您的信息...');
    
    try {
      // 使用Cloudflare Worker API提交联系信息（完全绕过Supabase）
      const response = await fetch(getApiUrl(API_CONFIG.PATHS.CONTACT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name: data.name.trim(),
            company: data.company?.trim(),
            email: data.email.trim().toLowerCase(),
            phone: data.phone?.trim(),
            country: data.country?.trim(),
            subject: data.subject?.trim(),
            message: data.message.trim(),
            language: i18n.language || 'zh'
          }
        })
      });

      const result = await response.json();

      if (result.code !== 200) {
        throw new Error(result.message || '提交失败');
      }

      toast.dismiss();
      toast.success(
        i18n.language === 'en' ? 'Message submitted successfully! We will reply within 24 hours.' :
        i18n.language === 'ru' ? 'Сообщение успешно отправлено! Мы ответим в течение 24 часов.' :
        '留言已成功提交！我们会在24小时内回复您。'
      );
      reset();
      
    } catch (error) {
      toast.dismiss();
      
      // 更详细的错误处理和用户友好的提示
      let errorMessage = '提交失败，请稍后重试';
      
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('network') || message.includes('fetch')) {
          errorMessage = i18n.language === 'en' ? 
            'Network connection failed. Please check your internet connection and try again.' :
            i18n.language === 'ru' ?
            'Ошибка сети. Пожалуйста, проверьте подключение к интернету и попробуйте снова.' :
            '网络连接失败，请检查您的网络连接后重试';
        } else if (message.includes('spam') || message.includes('suspicious')) {
          errorMessage = i18n.language === 'en' ? 
            'Content detected as suspicious. Please revise your message.' :
            i18n.language === 'ru' ?
            'Обнаружено подозрительное содержание. Пожалуйста, измените сообщение.' :
            '检测到可疑内容，请修改您的消息';
        } else if (message.includes('required')) {
          errorMessage = i18n.language === 'en' ? 
            'Please fill in all required fields.' :
            i18n.language === 'ru' ?
            'Пожалуйста, заполните все обязательные поля.' :
            '请填写所有必填字段';
        } else if (message.includes('email')) {
          errorMessage = i18n.language === 'en' ? 
            'Invalid email format. Please check and try again.' :
            i18n.language === 'ru' ?
            'Неверный формат электронной почты. Пожалуйста, проверьте и попробуйте снова.' :
            '邮箱格式不正确，请检查后重试';
        } else {
          errorMessage = i18n.language === 'en' ? 
            'Submission failed. Please try again or contact us directly.' :
            i18n.language === 'ru' ?
            'Ошибка отправки. Пожалуйста, попробуйте снова или свяжитесь с нами напрямую.' :
            error.message;
        }
      }
      
      toast.error(errorMessage);
      
      // 记录错误到控制台便于调试
      console.error('联系表单提交错误:', {
        error: error,
        formData: data,
        timestamp: new Date().toISOString()
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('title')} - {t('nav.contact')}</title>
        <meta name="description" content={t('contact:meta_description')} />
      </Helmet>

      {/* 页面标题区 */}
      <section className="bg-gradient-to-r from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('contact:hero.title')}
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            {t('contact:hero.subtitle')}
          </p>
        </div>
      </section>

      {/* 联系信息和表单区 */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 联系信息 */}
            <div>
              <h2 className="text-2xl font-bold mb-6">{t('contact:info.title')}</h2>
              <p className="text-muted-foreground mb-8">{t('contact:info.description')}</p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{t('contact:info.address.title')}</h3>
                    <p className="text-muted-foreground mt-1">
                      浙江省杭州市余杭区东湖街道星桥路18号星尚国际广场
                    </p>
                    <p className="text-muted-foreground">
                      Xingshang International Plaza, No.18 Xingqiao Road, Donghu Street, Yuhang District, Hangzhou, Zhejiang, China
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{t('contact:info.phone.title')}</h3>
                    <p className="text-muted-foreground mt-1">+86 571-88888888</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{t('contact:info.email.title')}</h3>
                    <p className="text-muted-foreground mt-1">info@karn-materials.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-lg font-semibold mb-4">{t('contact:info.hours.title')}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><span className="font-medium">{t('contact:info.hours.weekdays')}:</span> 9:00 - 18:00</li>
                  <li><span className="font-medium">{t('contact:info.hours.saturday')}:</span> 9:00 - 16:00</li>
                  <li><span className="font-medium">{t('contact:info.hours.sunday')}:</span> {t('contact:info.hours.closed')}</li>
                </ul>
              </div>
            </div>

            {/* 联系表单 */}
            <div>
              <div className="bg-background p-6 rounded-lg shadow-md border border-border">
                <h2 className="text-2xl font-bold mb-6">{t('contact:form.title')}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contact:form.name')} <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <Input
                          id="name"
                          type="text"
                          className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                          {...register('name', { required: true })}
                        />
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                      {errors.name && <p className="text-sm text-destructive">{t('contact:form.required')}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">{t('contact:form.company')}</Label>
                      <div className="relative">
                        <Input
                          id="company"
                          type="text"
                          className="pl-10"
                          {...register('company')}
                        />
                        <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact:form.email')} <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                        {...register('email', { 
                          required: true,
                          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
                        })}
                      />
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                    {errors.email?.type === 'required' && (
                      <p className="text-sm text-destructive">{t('contact:form.required')}</p>
                    )}
                    {errors.email?.type === 'pattern' && (
                      <p className="text-sm text-destructive">{t('contact:form.email_invalid')}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('contact:form.phone')}</Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          type="tel"
                          className="pl-10"
                          {...register('phone')}
                        />
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">{t('contact:form.country')}</Label>
                      <div className="relative">
                        <Input
                          id="country"
                          type="text"
                          className="pl-10"
                          {...register('country')}
                        />
                        <Globe className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{t('contact:form.subject')}</Label>
                    <Input
                      id="subject"
                      type="text"
                      {...register('subject')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('contact:form.message')} <span className="text-destructive">*</span></Label>
                    <Textarea
                      id="message"
                      rows={5}
                      className={errors.message ? 'border-destructive' : ''}
                      {...register('message', { required: true })}
                    />
                    {errors.message && <p className="text-sm text-destructive">{t('contact:form.required')}</p>}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('contact:form.submitting')}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t('cta.send_message')}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 地图区域 */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('contact:map.title')}</h2>
          <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3308.1517753806896!2d120.09012961521504!3d30.292169881797836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x344b61d2e5e4da99%3A0xb0211f7fd6f5a33b!2s18%20Xingqiao%20Rd%2C%20Jianggan%20District%2C%20Hangzhou%2C%20Zhejiang%20Province%2C%20China%2C%20310000!5e0!3m2!1sen!2sus!4v1659449892461!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              title="Google Maps - Hangzhou Karn New Building Materials Co., Ltd. Location"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
