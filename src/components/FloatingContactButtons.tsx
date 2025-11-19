import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import { WHATSAPP_LINK, SOCIAL_LINKS } from '@/lib/social-links';
import { COMPANY_PROFILE } from '@/lib/company-profile';

export function FloatingContactButtons() {
  const { t, i18n } = useTranslation('common');

  const handleWhatsApp = () => {
    window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${COMPANY_PROFILE.email}?subject=${encodeURIComponent('Inquiry about Wallpaper Glue Products')}`;
  };

  const handleWeChat = () => {
    alert(`${t('social.wechat')}: ${SOCIAL_LINKS.wechat}`);
  };

  const handleSkype = () => {
    window.location.href = `skype:${SOCIAL_LINKS.skype}?chat`;
  };

  const currentLang = i18n.language || 'zh';

  return (
    <div className="fixed right-4 md:right-6 bottom-4 md:bottom-6 z-50 flex flex-col gap-3">
      {/* Email */}
      <button
        onClick={handleEmail}
        className="w-12 h-12 rounded-full bg-orange-500 text-white shadow-lg flex items-center justify-center hover:bg-orange-600 hover:shadow-xl transition-all hover:scale-110 active:scale-95"
        title={currentLang === 'zh' ? '电子邮箱' : 'Email'}
        aria-label={currentLang === 'zh' ? '电子邮箱' : 'Email'}
      >
        <Mail className="w-6 h-6" />
      </button>

      {/* WhatsApp */}
      <button
        onClick={handleWhatsApp}
        className="w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:bg-[#20BA5A] hover:shadow-xl transition-all hover:scale-110 active:scale-95"
        title="WhatsApp"
        aria-label="WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.372a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </button>

      {/* Skype */}
      <button
        onClick={handleSkype}
        className="w-12 h-12 rounded-full bg-[#00AFF0] text-white shadow-lg flex items-center justify-center hover:bg-[#0099D6] hover:shadow-xl transition-all hover:scale-110 active:scale-95"
        title="Skype"
        aria-label="Skype"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.015 2.016c-2.484 0-4.5 2.016-4.5 4.5s2.016 4.5 4.5 4.5 4.5-2.016 4.5-4.5-2.016-4.5-4.5-4.5zm.75 7.5c-.75 0-1.5-.75-1.5-1.5v-1.5c0-.75.75-1.5 1.5-1.5s1.5.75 1.5 1.5v1.5c0 .75-.75 1.5-1.5 1.5zm-1.5 3h3v1.5h-3v-1.5zm8.25-3c0 2.906-2.344 5.25-5.25 5.25-.656 0-1.266-.094-1.875-.281l-1.969 1.969-1.969-1.969c-.609.187-1.219.281-1.875.281-2.906 0-5.25-2.344-5.25-5.25s2.344-5.25 5.25-5.25c.656 0 1.266.094 1.875.281l1.969-1.969 1.969 1.969c.609-.187 1.219-.281 1.875-.281 2.906 0 5.25 2.344 5.25 5.25z"/>
        </svg>
      </button>

      {/* WeChat */}
      <button
        onClick={handleWeChat}
        className="w-12 h-12 rounded-full bg-[#07C160] text-white shadow-lg flex items-center justify-center hover:bg-[#06AD56] hover:shadow-xl transition-all hover:scale-110 active:scale-95"
        title={currentLang === 'zh' ? '微信' : 'WeChat'}
        aria-label={currentLang === 'zh' ? '微信' : 'WeChat'}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-5.523 3.048-6.967 1.662-.83 3.51-1.048 5.291-.76.276-3.412-3.281-6.905-8.15-6.905z"/>
          <path d="M5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zM11.598 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18z"/>
          <path d="M24 14.305c0-3.27-3.281-5.93-7.304-5.93-4.023 0-7.304 2.66-7.304 5.93 0 3.272 3.281 5.933 7.304 5.933a8.653 8.653 0 002.388-.336.725.725 0 01.6.08l1.595.936c.027.019.067.031.102.031.11 0 .195-.087.195-.195 0-.057-.019-.11-.036-.16l-.328-1.245a.493.493 0 01.18-.558C22.838 17.928 24 16.253 24 14.305z"/>
        </svg>
      </button>
    </div>
  );
}
