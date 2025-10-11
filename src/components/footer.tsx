import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Mail, MapPin, Phone, Clock, Award, Shield, CheckCircle } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  const { lang = 'zh' } = useParams<{ lang: string }>();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* 公司简介 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">
                公司简介
              </h3>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                杭州卡恩新型建材有限公司专业从事新型建材的研发、生产和销售，为客户提供高品质的建筑材料解决方案。
              </p>
              <div className="flex items-center text-green-400">
                <Award className="h-5 w-5 mr-2" />
                <span className="text-sm">ISO 9001 质量认证</span>
              </div>
            </div>

            {/* 联系方式 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">
                联系方式
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                  <span className="text-sm text-gray-300">
                    浙江省杭州市余杭区<br />
                    东湖街道星光街15号星光大厦A座
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-sm text-gray-300">+86 571-8888-8888</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-sm text-gray-300">info@karn-materials.com</span>
                </div>
              </div>
            </div>

            {/* 快捷导航 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">
                快捷导航
              </h3>
              <div className="space-y-2">
                <Link to={`/${lang}/`} className="block text-sm text-gray-300 hover:text-green-400 transition-colors py-1">
                  首页
                </Link>
                <Link to={`/${lang}/products`} className="block text-sm text-gray-300 hover:text-green-400 transition-colors py-1">
                  产品中心
                </Link>
                <Link to={`/${lang}/about`} className="block text-sm text-gray-300 hover:text-green-400 transition-colors py-1">
                  关于我们
                </Link>
                <Link to={`/${lang}/contact`} className="block text-sm text-gray-300 hover:text-green-400 transition-colors py-1">
                  联系我们
                </Link>
              </div>
            </div>

            {/* 质量保证 */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-400">
                质量保证
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-sm text-gray-300">质量体系认证</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-sm text-gray-300">环保标准认证</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-sm text-gray-300">行业资质认证</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 版权信息 */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 杭州卡恩新型建材有限公司. 保留所有权利.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400 mt-3 md:mt-0">
              <a href="#" className="hover:text-green-400 transition-colors">
                隐私政策
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                使用条款
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}