import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

interface WhyUsSectionProps {
  pageContent: Record<string, string>;
}

export const WhyUsSection = memo(function WhyUsSection({ pageContent }: WhyUsSectionProps) {
  const { t } = useTranslation(['common', 'home']);

  const advantages = [
    {
      titleKey: 'home:why_us.quality.title',
      descriptionKey: 'home:why_us.quality.description'
    },
    {
      titleKey: 'home:why_us.experience.title',
      descriptionKey: 'home:why_us.experience.description'
    },
    {
      titleKey: 'home:why_us.service.title',
      descriptionKey: 'home:why_us.service.description'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-white industrial-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 工业风格标题区 */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-[#047857] rotate-45"></div>
            <span className="text-[#047857] font-medium uppercase tracking-wider text-sm">企业优势</span>
            <div className="w-3 h-3 bg-[#047857] rotate-45"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[#064E3B] mb-6">
            {pageContent.why_us_title || t('home:why_us.title')}
          </h2>
          
          <div className="mx-auto max-w-2xl relative">
            <p className="text-black leading-relaxed text-lg">
              {pageContent.why_us_subtitle || t('home:why_us.subtitle')}
            </p>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#10B981]"></div>
          </div>
        </div>

        {/* 工业风格优势卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {advantages.map((advantage, index) => (
            <div key={index} className="bg-white p-8 rounded-sm shadow-md relative group hover:shadow-lg transition-all border-t border-l border-gray-100 overflow-hidden">
              {/* 侧边装饰条 */}
              <div className="absolute top-0 left-0 w-1 h-full bg-[#047857] group-hover:w-2 transition-all"></div>
              
              {/* 装饰性底部线条 */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#10B981] group-hover:w-full transition-all duration-300"></div>
              
              {/* 图标区 */}
              <div className="w-16 h-16 rounded-sm bg-[#047857]/10 flex items-center justify-center mb-6 group-hover:bg-[#047857]/20 transition-colors">
                <div className="w-10 h-10 rounded-sm bg-[#047857] flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-[#064E3B] mb-4 group-hover:text-[#047857] transition-colors">
                {t(advantage.titleKey)}
              </h3>
              <p className="text-black">{t(advantage.descriptionKey)}</p>
            </div>
          ))}
        </div>
        
        {/* 工业风格装饰性分隔线 */}
        <div className="industrial-divider mx-auto w-1/2 mt-16"></div>
      </div>
    </section>
  );
});