import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/LazyImage';

interface HeroSectionProps {
  pageContent: Record<string, string>;
  lang: string;
}

export const HeroSection = memo(function HeroSection({ pageContent, lang }: HeroSectionProps) {
  const { t } = useTranslation(['common', 'home']);

  return (
    <section className="relative py-0 h-[90vh] flex items-center overflow-hidden">
      {/* 背景图片 - 更大更清晰的工厂或生产线图片 */}
      <div className="absolute inset-0 z-0">
        <LazyImage 
          src="/images/modern_powder_production_line_factory.jpg" 
          alt={t('home:hero.company_alt')}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      
      {/* 渐变覆盖层 - 使用深绿色调 */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#064E3B]/90 via-[#047857]/85 to-[#064E3B]/80 z-10"></div>

      {/* 装饰性工业线条元素 */}
      <div className="absolute left-0 top-1/4 w-full h-px bg-[#10B981]/20 z-20"></div>
      <div className="absolute left-0 bottom-1/4 w-full h-px bg-[#10B981]/20 z-20"></div>
      <div className="absolute top-0 left-1/3 w-px h-full bg-[#10B981]/20 z-20"></div>
      <div className="absolute top-0 right-1/3 w-px h-full bg-[#10B981]/20 z-20"></div>

      {/* 装饰性几何元素 */}
      <div className="absolute top-20 left-20 w-24 h-24 border-l-2 border-t-2 border-[#10B981]/30 z-20"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 border-r-2 border-b-2 border-[#10B981]/30 z-20"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-start space-y-8">
            {/* 工业风格小标题 */}
            <div className="inline-flex items-center space-x-2 bg-[#064E3B] px-4 py-1.5 rounded-sm">
              <div className="w-2 h-2 bg-[#10B981] rotate-45"></div>
              <span className="text-white text-sm font-medium tracking-wider uppercase">{t('home:hero.badge')}</span>
            </div>

            {/* 大标题 - 使用更大更精细的字体 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              <span className="block">{pageContent.hero_title || t('home:hero.title')}</span>
              <span className="block mt-2 text-[#10B981]">{t('home:hero.subtitle_highlight')}</span>
            </h1>

            {/* 副标题 - 清晰简洁 */}
            <p className="text-green-100 text-lg md:text-xl leading-relaxed max-w-xl">
              {pageContent.hero_subtitle || t('home:hero.subtitle')}
            </p>

            {/* 工业风格分隔线 */}
            <div className="w-24 h-1 bg-[#10B981]"></div>

            {/* 按钮区 - 更大更突出 */}
            <div className="flex flex-col sm:flex-row gap-5 mt-4">
              <Button asChild size="lg" className="bg-[#10B981] text-white hover:bg-[#059669] px-8 py-6 text-lg rounded-sm">
                <Link to={`/${lang}/products`}>
                  {t('cta.view_products')}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-sm">
                <Link to={`/${lang}/contact`}>
                  {t('cta.contact')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});