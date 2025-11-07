import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEOHelmet } from '@/components/SEOHelmet';
import { useState } from 'react';

export default function ApplicationsPage() {
  const { t, i18n } = useTranslation(['common', 'applications']);
  const { lang = 'en' } = useParams<{ lang: string }>();
  const currentLang = lang || i18n.language || 'en';
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // 应用领域数据，包含对应的产品代码
  const applications = [
    {
      id: 'textile',
      nameKey: 'applications:textile.title',
      descKey: 'applications:textile.description',
      scenariosKey: 'applications:textile.applications',
      benefitsKey: 'applications:textile.features',
      productCode: 'textile-cms',
      image: '/images/应用领域/纺织印染.jpg',
    },
    {
      id: 'construction',
      nameKey: 'applications:construction.title',
      descKey: 'applications:construction.description',
      scenariosKey: 'applications:construction.applications',
      benefitsKey: 'applications:construction.features',
      productCode: 'construction-cms',
      image: '/images/应用领域/腻子粉.jpg',
    },
    {
      id: 'coating',
      nameKey: 'applications:coating.title',
      descKey: 'applications:coating.description',
      scenariosKey: 'applications:coating.applications',
      benefitsKey: 'applications:coating.features',
      productCode: 'coating-cms',
      image: '/images/应用领域/水性涂料.png',
    },
    {
      id: 'paper',
      nameKey: 'applications:paper.title',
      descKey: 'applications:paper.description',
      scenariosKey: 'applications:paper.applications',
      benefitsKey: 'applications:paper.features',
      productCode: 'paper-dyeing-cms',
      image: '/images/应用领域/造纸.JPG',
    },
    {
      id: 'wallpaper',
      nameKey: 'applications:wallpaper.title',
      descKey: 'applications:wallpaper.description',
      scenariosKey: 'applications:wallpaper.applications',
      benefitsKey: 'applications:wallpaper.features',
      productCode: 'wallpaper-adhesive',
      image: '/images/应用领域/墙纸胶.jpeg',
    },
    {
      id: 'desiccant',
      nameKey: 'applications:desiccant.title',
      descKey: 'applications:desiccant.description',
      scenariosKey: 'applications:desiccant.applications',
      benefitsKey: 'applications:desiccant.features',
      productCode: 'desiccant-gel',
      image: '/images/应用领域/2ffad18a87f3f3af2a1773cf9ebc892b.JPG',
    },
  ];

  return (
    <>
      <SEOHelmet
        title={t('nav.applications')}
        description={t('applications:meta_description')}
        keywords="纺织印染,墙纸胶粉,建筑材料,水性涂料,干燥剂,造纸,羧甲基淀粉应用,textile printing,wallpaper adhesive,construction,coating,desiccant,paper industry"
        type="website"
        lang={i18n.language as 'zh' | 'en' | 'ru'}
        image="/images/应用领域/纺织印染.jpg"
      />

      {/* 英雄区 - 工业风格 */}
      <section className="relative py-0 h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/5fbd3f1a-5077-4ecb-8f50-008dab912740.png" 
            alt={t('applications:hero.alt')} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-[#064E3B]/90 via-[#047857]/85 to-[#064E3B]/80 z-10"></div>

        <div className="absolute left-0 top-1/4 w-full h-px bg-[#10B981]/20 z-20"></div>
        <div className="absolute left-0 bottom-1/4 w-full h-px bg-[#10B981]/20 z-20"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-[#064E3B] px-4 py-1.5 rounded-sm mb-6">
              <div className="w-2 h-2 bg-[#10B981] rotate-45"></div>
              <span className="text-white text-sm font-medium tracking-wider uppercase">应用领域</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
              {t('applications:hero.title')}
            </h1>

            <p className="text-green-100 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
              {t('applications:hero.subtitle')}
            </p>

            <div className="w-24 h-1 bg-[#10B981]"></div>
          </div>
        </div>
      </section>

      {/* 应用领域列表 - 工业风格卡片 */}
      <section className="py-20 md:py-28 bg-white industrial-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {applications.map((app) => (
              <div
                key={app.id}
                id={app.id}
                className="group bg-white rounded-sm border-l-4 border-[#047857] shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* 图片区域 */}
                <div className="relative overflow-hidden aspect-[16/9] bg-gray-100">
                  <img 
                    src={app.image} 
                    alt={t(app.nameKey)} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* 内容区域 */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#064E3B] mb-3 group-hover:text-[#047857] transition-colors">
                    {t(app.nameKey)}
                  </h2>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {t(app.descKey)}
                  </p>

                  {/* 应用场景和产品特点并排 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* 应用场景 */}
                    <div>
                      <h3 className="text-sm font-bold text-[#047857] uppercase tracking-wider mb-3 flex items-center">
                        <div className="w-1 h-4 bg-[#047857] mr-2"></div>
                        {t('applications:applications_title')}
                      </h3>
                      <ul className="space-y-2">
                        {(t(app.scenariosKey, { returnObjects: true }) as string[]).map((scenario, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-700">
                            <CheckCircle2 className="h-4 w-4 text-[#10B981] mr-2 mt-0.5 flex-shrink-0" />
                            <span>{scenario}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 产品特点 */}
                    <div>
                      <h3 className="text-sm font-bold text-[#047857] uppercase tracking-wider mb-3 flex items-center">
                        <div className="w-1 h-4 bg-[#047857] mr-2"></div>
                        {t('applications:features_title')}
                      </h3>
                      <ul className="space-y-2">
                        {(t(app.benefitsKey, { returnObjects: true }) as string[]).map((benefit, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-700">
                            <CheckCircle2 className="h-4 w-4 text-[#10B981] mr-2 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 展开详细介绍 */}
                  {expandedCard === app.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 animate-in slide-in-from-top">
                      <div className="prose prose-sm max-w-none">
                        <h4 className="text-lg font-bold text-[#064E3B] mb-3">
                          {t(`applications:${app.id}.detail_title`)}
                        </h4>
                        <div className="text-gray-700 leading-relaxed space-y-3">
                          {(t(`applications:${app.id}.detail_content`, { returnObjects: true }) as string[]).map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                      
                      {/* 推荐产品链接 */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <Link to={`/${currentLang}/products/${app.productCode}`}>
                          <Button variant="outline" className="border-[#047857] text-[#047857] hover:bg-[#047857] hover:text-white rounded-sm px-6 py-2 text-sm transition-colors w-full md:w-auto">
                            {t('applications:view_product')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* 了解更多/收起按钮 */}
                  <div className="mt-auto pt-4">
                    <Button 
                      onClick={() => setExpandedCard(expandedCard === app.id ? null : app.id)}
                      className="bg-[#047857] hover:bg-[#064E3B] text-white rounded-sm px-6 py-2.5 text-sm transition-colors w-full md:w-auto"
                    >
                      {expandedCard === app.id ? t('applications:collapse') : t('applications:learn_more')}
                      {expandedCard === app.id ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA区 - 行动召唤 */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-[#064E3B] to-[#047857]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('applications:cta.title')}
          </h2>
          <p className="text-green-100 text-lg max-w-2xl mx-auto mb-8">
            {t('applications:cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to={`/${currentLang}/contact`}>
              <Button size="lg" className="bg-white text-[#047857] hover:bg-green-50 px-8 py-6 text-lg rounded-sm">
                {t('cta.contact')}
              </Button>
            </Link>
            <Link to={`/${currentLang}/oem`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-sm">
                OEM定制服务
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}







