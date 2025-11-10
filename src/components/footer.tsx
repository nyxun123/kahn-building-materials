import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Mail, MapPin, Phone, Clock, Award, Shield, CheckCircle, ChevronRight } from 'lucide-react';
import { SOCIAL_LINKS, WHATSAPP_LINK } from '@/lib/social-links';
import { 
  Youtube, 
  Instagram, 
  Facebook, 
  MessageCircle,
} from 'lucide-react';

interface FooterProps {
  forceUpdate?: number;
}

export function Footer({ forceUpdate }: FooterProps = {}) {
  const { t } = useTranslation("common");
  const { lang = 'en' } = useParams<{ lang: string }>();

  return (
    <footer key={`footer-${lang}-${forceUpdate}`} className="bg-white text-gray-800 border-t border-gray-200">
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* 公司简介 - 白色背景风格 */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-[#064E3B] uppercase tracking-wider">
                {t('footer.sections.about')}
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {t('footer.company_brief')}
              </p>
              <div className="flex items-center text-[#047857]">
                <Award className="h-4 w-4 mr-2" />
                <span className="text-xs">{t('footer.iso_certified')}</span>
              </div>
            </div>

            {/* 联系方式 - 白色背景风格 */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-[#064E3B] uppercase tracking-wider">
                {t('footer.sections.contact')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <span
                    className="text-sm text-gray-600 ml-3"
                    dangerouslySetInnerHTML={{ __html: t('footer.contact_info.address') }}
                  />
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">{t('footer.contact_info.phone')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">{t('footer.contact_info.email')}</span>
                </div>
              </div>
            </div>

            {/* 快捷导航 - 白色背景风格 */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-[#064E3B] uppercase tracking-wider">
                {t('footer.sections.quick_links')}
              </h3>
              <div className="space-y-3">
                <Link
                  to={`/${lang}/`}
                  className="flex items-center text-sm text-gray-600 hover:text-[#047857] transition-colors duration-200 py-1.5 group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-[#047857] group-hover:translate-x-1 transition-transform" />
                  {t('footer.quick_links.home')}
                </Link>
                <Link
                  to={`/${lang}/products`}
                  className="flex items-center text-sm text-gray-600 hover:text-[#047857] transition-colors duration-200 py-1.5 group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-[#047857] group-hover:translate-x-1 transition-transform" />
                  {t('footer.quick_links.products')}
                </Link>
                <Link
                  to={`/${lang}/about`}
                  className="flex items-center text-sm text-gray-600 hover:text-[#047857] transition-colors duration-200 py-1.5 group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-[#047857] group-hover:translate-x-1 transition-transform" />
                  {t('footer.quick_links.about')}
                </Link>
                <Link
                  to={`/${lang}/contact`}
                  className="flex items-center text-sm text-gray-600 hover:text-[#047857] transition-colors duration-200 py-1.5 group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-[#047857] group-hover:translate-x-1 transition-transform" />
                  {t('footer.quick_links.contact')}
                </Link>
              </div>
            </div>

            {/* 质量保证 - 白色背景风格 */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-[#064E3B] uppercase tracking-wider">
                {t('footer.sections.quality')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">{t('footer.quality_features.quality_system')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">{t('footer.quality_features.environmental')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">{t('footer.quality_features.industry_certification')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 社交媒体 - 在版权信息之前 */}
      <div className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-bold text-[#064E3B] uppercase tracking-wider">
              {t('social.follow_us')}
            </h3>
            <div className="flex items-center space-x-4">
              {/* TikTok */}
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform duration-300"
                title={t('social.tiktok')}
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                title={t('social.youtube')}
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>

              {/* Instagram */}
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                title={t('social.instagram')}
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>

              {/* Facebook */}
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                title={t('social.facebook')}
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                title={t('social.whatsapp')}
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>

              {/* 微信 */}
              <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-5.523 3.048-6.967 1.662-.83 3.51-1.048 5.291-.76.276-3.412-3.281-6.905-8.15-6.905z"/>
                    <path d="M5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zM11.598 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18z"/>
                    <path d="M24 14.305c0-3.27-3.281-5.93-7.304-5.93-4.023 0-7.304 2.66-7.304 5.93 0 3.272 3.281 5.933 7.304 5.933a8.653 8.653 0 002.388-.336.725.725 0 01.6.08l1.595.936c.027.019.067.031.102.031.11 0 .195-.087.195-.195 0-.057-.019-.11-.036-.16l-.328-1.245a.493.493 0 01.18-.558C22.838 17.928 24 16.253 24 14.305z"/>
                  </svg>
                </div>
                {/* WeChat Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="text-center">
                    <div>{t('social.wechat')}</div>
                    <div className="font-mono mt-1">{SOCIAL_LINKS.wechat}</div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 版权信息 - 白色背景风格 */}
      <div className="border-t border-gray-200 bg-gray-50 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600 mt-3 md:mt-0">
              <a href="#" className="hover:text-[#047857] transition-colors duration-200">
                {t('footer.bottom_links.privacy')}
              </a>
              <a href="#" className="hover:text-[#047857] transition-colors duration-200">
                {t('footer.bottom_links.terms')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}