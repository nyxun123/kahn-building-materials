import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Mail, MapPin, Phone, Clock, Award, Shield, CheckCircle, ChevronRight } from 'lucide-react';

interface FooterProps {
  forceUpdate?: number;
}

export function Footer({ forceUpdate }: FooterProps = {}) {
  const { t } = useTranslation();
  const { lang = 'en' } = useParams<{ lang: string }>();

  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
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