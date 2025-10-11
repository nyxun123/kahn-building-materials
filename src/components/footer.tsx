import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Mail, MapPin, Phone, Clock, Award, Shield, CheckCircle, ChevronRight } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  const { lang = 'zh' } = useParams<{ lang: string }>();

  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* 公司简介 - 白色背景风格 */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-[#064E3B] uppercase tracking-wider">
                公司简介
              </h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                杭州卡恩新型建材有限公司专业从事新型建材的研发、生产和销售，为客户提供高品质的建筑材料解决方案。
              </p>
              <div className="flex items-center text-[#047857]">
                <Award className="h-4 w-4 mr-2" />
                <span className="text-xs">ISO 9001 质量认证</span>
              </div>
            </div>

            {/* 联系方式 - 白色背景风格 */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-[#064E3B] uppercase tracking-wider">
                联系我们
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">
                    浙江省杭州市余杭区<br />
                    东湖街道星光街15号星光大厦A座
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">+86 571-8888-8888</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">info@karn-materials.com</span>
                </div>
              </div>
            </div>

            {/* 快捷导航 - 白色背景风格 */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-[#064E3B] uppercase tracking-wider">
                快速链接
              </h3>
              <div className="space-y-3">
                <Link 
                  to={`/${lang}/`} 
                  className="flex items-center text-sm text-gray-600 hover:text-[#047857] transition-colors duration-200 py-1.5 group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-[#047857] group-hover:translate-x-1 transition-transform" />
                  首页
                </Link>
                <Link 
                  to={`/${lang}/products`} 
                  className="flex items-center text-sm text-gray-600 hover:text-[#047857] transition-colors duration-200 py-1.5 group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-[#047857] group-hover:translate-x-1 transition-transform" />
                  产品中心
                </Link>
                <Link 
                  to={`/${lang}/about`} 
                  className="flex items-center text-sm text-gray-600 hover:text-[#047857] transition-colors duration-200 py-1.5 group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-[#047857] group-hover:translate-x-1 transition-transform" />
                  关于我们
                </Link>
                <Link 
                  to={`/${lang}/contact`} 
                  className="flex items-center text-sm text-gray-600 hover:text-[#047857] transition-colors duration-200 py-1.5 group"
                >
                  <ChevronRight className="h-4 w-4 mr-2 text-[#047857] group-hover:translate-x-1 transition-transform" />
                  联系我们
                </Link>
              </div>
            </div>

            {/* 质量保证 - 白色背景风格 */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-[#064E3B] uppercase tracking-wider">
                品质保证
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">质量体系认证</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">环保标准认证</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-sm bg-[#047857] flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 ml-3">行业资质认证</span>
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
              © 2024 杭州卡恩新型建材有限公司. 保留所有权利.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600 mt-3 md:mt-0">
              <a href="#" className="hover:text-[#047857] transition-colors duration-200">
                隐私政策
              </a>
              <a href="#" className="hover:text-[#047857] transition-colors duration-200">
                使用条款
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}