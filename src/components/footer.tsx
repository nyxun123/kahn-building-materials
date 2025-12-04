import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Mail, MapPin, Phone, Clock, Award, Shield, CheckCircle, ChevronRight } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/social-links';
import {
  Youtube,
  Instagram,
  Facebook,
} from 'lucide-react';
import { SEOKeywordsCloud } from '@/components/SEOKeywordsCloud';

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

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
              {/* 合作伙伴 - 白色背景风格 */}
              <div>
                <h3 className="text-lg font-bold mb-5 text-[#064E3B] uppercase tracking-wider">
                  {t('footer.sections.partners')}
                </h3>
                <div className="space-y-3">
                  <a
                    href="https://www.tradekey.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-[#047857] transition-colors duration-200 py-1.5 group"
                  >
                    <ChevronRight className="h-4 w-4 mr-2 text-[#047857] group-hover:translate-x-1 transition-transform" />
                    TradeKey B2B
                  </a>
                  <a
                    href="https://www.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-600 hover:text-[#047857] transition-colors duration-200 py-1.5 group"
                  >
                    <ChevronRight className="h-4 w-4 mr-2 text-[#047857] group-hover:translate-x-1 transition-transform" />
                    Google Search
                  </a>
                  {/* 预留位置给未来的友链 */}
                  <span className="text-xs text-gray-400 italic mt-2 block">
                    {t('footer.partners_welcome')}
                  </span>
                </div>
              </div>

              {/* 关注我们 - 与其他栏目对齐 */}
              <div>
                <h3 className="text-lg font-bold mb-5 text-[#064E3B] uppercase tracking-wider">
                  {t('social.follow_us')}
                </h3>
                <div className="flex items-center flex-wrap gap-4">
                  {/* TikTok */}
                  <a
                    href={SOCIAL_LINKS.tiktok}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform duration-300"
                    title={t('social.tiktok')}
                    aria-label={t('social.tiktok')}
                  >
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                    </svg>
                  </a>

                  {/* YouTube */}
                  <a
                    href={SOCIAL_LINKS.youtube}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                    title={t('social.youtube')}
                    aria-label={t('social.youtube')}
                  >
                    <Youtube className="w-5 h-5 text-white" />
                  </a>

                  {/* Instagram */}
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                    title={t('social.instagram')}
                    aria-label={t('social.instagram')}
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>

                  {/* Facebook */}
                  <a
                    href={SOCIAL_LINKS.facebook}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                    title={t('social.facebook')}
                    aria-label={t('social.facebook')}
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Keywords Cloud */}
      <SEOKeywordsCloud />

      {/* 版权信息 - 页脚最底部 */}
      <div className="border-t border-gray-200 bg-gray-50 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center w-full">
              <p className="text-sm text-gray-600">
                {t('footer.copyright')}
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 mt-3">
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
      </div>
    </footer>
  );
}
