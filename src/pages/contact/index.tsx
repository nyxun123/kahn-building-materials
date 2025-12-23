import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Phone, Send, User, Building, Globe } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';
import { LocalBusinessSchema } from '@/components/LocalBusinessSchema';
import { GeoMetaTags } from '@/components/GeoMetaTags';
import { OpenGraphTags } from '@/components/OpenGraphTags';
import { HreflangTags } from '@/components/HreflangTags';
import { OptimizedMap } from '@/components/OptimizedMap';
import { getApiUrl, API_CONFIG } from '@/lib/config';
import { COMPANY_PROFILE } from '@/lib/company-profile';

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
        } else if (message.includes('required') || message.includes('必填')) {
          errorMessage = i18n.language === 'en' ?
            'Please fill in all required fields.' :
            i18n.language === 'ru' ?
              'Пожалуйста, заполните все обязательные поля.' :
              '请填写所有必填字段';
        } else if (message.includes('email') || message.includes('邮箱')) {
          errorMessage = i18n.language === 'en' ?
            'Invalid email format. Please check and try again.' :
            i18n.language === 'ru' ?
              'Неверный формат электронной почты. Пожалуйста, проверьте и попробуйте снова.' :
              '邮箱格式不正确，请检查后重试';
        } else {
          // If we have a specific error message from backend, show it (even if in Chinese)
          // otherwise show generic fallback
          if (error.message && error.message !== 'Error') {
            errorMessage = error.message;
          } else {
            errorMessage = i18n.language === 'en' ?
              'Submission failed. Please try again or contact us directly.' :
              i18n.language === 'ru' ?
                'Ошибка отправки. Пожалуйста, попробуйте снова или свяжитесь с нами напрямую.' :
                '提交失败，请稍后重试';
          }
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
      <SEOHelmet
        title={i18n.language === 'zh'
          ? '联系我们 - 杭州卡恩羧甲基淀粉供应商'
          : i18n.language === 'en'
            ? 'Contact Us - Hangzhou Karn CMS Supplier'
            : t('nav.contact')}
        description={t('contact:meta_description')}
        keywords={t('contact:keywords')}
        type="website"
        lang={i18n.language as 'zh' | 'en' | 'ru' | 'vi' | 'th' | 'id'}
        image="/images/IMG_1515.JPG"
      />
      <StructuredData
        schema={{
          type: 'ContactPage',
          name: t('nav.contact'),
          description: t('contact:meta_description'),
          url: `https://kn-wallpaperglue.com/${i18n.language}/contact`,
        }}
      />
      <StructuredData
        schema={{
          type: 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: t('nav.home'),
              item: `/${i18n.language}`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: t('nav.contact'),
              item: `/${i18n.language}/contact`,
            },
          ],
        }}
      />

      {/* LocalBusiness Schema */}
      <LocalBusinessSchema language={i18n.language as 'zh' | 'en' | 'ru'} />

      {/* GEO Meta Tags */}
      <GeoMetaTags
        latitude={30.39}
        longitude={120.17}
        placename={i18n.language === 'zh' ? '杭州' : 'Hangzhou'}
        region="CN-ZJ"
      />

      {/* Enhanced Open Graph Tags */}
      <OpenGraphTags
        title={i18n.language === 'zh'
          ? '联系我们 - 杭州卡恩羧甲基淀粉供应商'
          : i18n.language === 'en'
            ? 'Contact Us - Hangzhou Karn CMS Supplier'
            : t('nav.contact')}
        description={t('contact:meta_description')}
        url={`https://kn-wallpaperglue.com/${i18n.language}/contact`}
        type="website"
        locale={i18n.language === 'zh' ? 'zh_CN' : i18n.language === 'en' ? 'en_US' : 'ru_RU'}
        alternateLocales={['en_US', 'ru_RU', 'th_TH', 'vi_VN', 'id_ID']}
      />

      {/* Hreflang Tags */}
      <HreflangTags
        currentLanguage={i18n.language as 'zh' | 'en' | 'ru'}
        basePath="/contact"
      />

      {/* Mobile Action Sheet (App Style) */}
      <section className="lg:hidden bg-white pt-6 pb-2 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold text-[#064E3B] mb-2">{t('contact:hero.title')}</h1>
          <p className="text-xs text-gray-500 mb-6">Response within 24 hours</p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <a href={`tel:${COMPANY_PROFILE.phone}`} className="flex flex-col items-center justify-center bg-[#047857]/5 p-3 rounded border border-[#047857]/10 active:scale-95 transition-transform">
              <div className="w-10 h-10 rounded-full bg-[#047857] flex items-center justify-center text-white mb-2 shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-[#047857]">Call Us</span>
            </a>
            <a href="https://wa.me/8613216156841" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center bg-[#047857]/5 p-3 rounded border border-[#047857]/10 active:scale-95 transition-transform">
              <div className="w-10 h-10 rounded-full bg-[#047857] flex items-center justify-center text-white mb-2 shadow-sm">
                <div className="font-bold text-xs">WA</div>
              </div>
              <span className="text-[10px] font-medium text-[#047857]">WhatsApp</span>
            </a>
            <a href={`mailto:${COMPANY_PROFILE.email}`} className="flex flex-col items-center justify-center bg-[#047857]/5 p-3 rounded border border-[#047857]/10 active:scale-95 transition-transform">
              <div className="w-10 h-10 rounded-full bg-[#047857] flex items-center justify-center text-white mb-2 shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-[#047857]">Email</span>
            </a>
          </div>
        </div>
      </section>

      {/* 页面标题区 (Desktop Only) */}
      <section className="hidden lg:block bg-gradient-to-r from-[#064E3B] to-[#047857] py-16 md:py-24">
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
              <h2 className="text-2xl font-bold text-[#064E3B] mb-6">{t('contact:info.title')}</h2>
              <p className="text-gray-600 mb-8">{t('contact:info.description')}</p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-sm bg-[#047857]/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-[#047857]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-[#064E3B]">{t('contact:info.address.title')}</h3>
                    <p className="text-gray-600 mt-1">
                      {COMPANY_PROFILE.addressZh}
                    </p>
                    <p className="text-gray-600">
                      {COMPANY_PROFILE.addressEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-sm bg-[#047857]/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-[#047857]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-[#064E3B]">{t('contact:info.phone.title')}</h3>
                    <p className="text-gray-600 mt-1">{COMPANY_PROFILE.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-sm bg-[#047857]/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-[#047857]" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-[#064E3B]">{t('contact:info.email.title')}</h3>
                    <p className="text-gray-600 mt-1">{COMPANY_PROFILE.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-lg font-semibold text-[#064E3B] mb-4">{t('contact:info.hours.title')}</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><span className="font-medium">{t('contact:info.hours.weekdays')}:</span> 9:00 - 18:00</li>
                  <li><span className="font-medium">{t('contact:info.hours.saturday')}:</span> 9:00 - 16:00</li>
                  <li><span className="font-medium">{t('contact:info.hours.sunday')}:</span> {t('contact:info.hours.closed')}</li>
                </ul>
              </div>
            </div>

            {/* 联系表单 */}
            <div>
              <div className="bg-white p-6 rounded-sm shadow-md border-l-4 border-[#047857]">
                <h2 className="text-2xl font-bold text-[#064E3B] mb-6">{t('contact:form.title')}</h2>
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

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-[#047857] hover:bg-[#064E3B] text-white">
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

      {/* 地图区域 - 优化加载 */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('contact:map.title')}</h2>
          <OptimizedMap />
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>浙江省杭州市临平区崇贤街道沪瑞线王家门1号</p>
            <p className="mt-1">No. 1, Wangjiamen, Huruixian Road, Chongxian Street, Linping District, Hangzhou, Zhejiang, China</p>
          </div>
        </div>
      </section>
    </>
  );
}
