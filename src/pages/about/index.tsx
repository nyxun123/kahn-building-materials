import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Leaf, Microscope, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const { t } = useTranslation(['common', 'about']);

  return (
    <>
      <Helmet>
        <title>{t('title')} - {t('nav.about')}</title>
        <meta name="description" content={t('about:meta_description')} />
      </Helmet>

      {/* 页面标题区 */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-950 dark:to-blue-800 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('about:hero.title')}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            {t('about:hero.subtitle')}
          </p>
        </div>
      </section>

      {/* 公司简介 */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                {t('about:company.title')}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t('about:company.paragraph1')}</p>
                <p>{t('about:company.paragraph2')}</p>
                <p>{t('about:company.paragraph3')}</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/images/factory.jpg" 
                alt="浙江卡恩新型建材有限公司工厂" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 我们的优势 */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('about:advantages.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('about:advantages.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 优势 1 */}
            <div className="bg-background p-6 rounded-lg shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Microscope className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('about:advantages.quality.title')}</h3>
              <p className="text-muted-foreground">{t('about:advantages.quality.description')}</p>
            </div>

            {/* 优势 2 */}
            <div className="bg-background p-6 rounded-lg shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('about:advantages.experience.title')}</h3>
              <p className="text-muted-foreground">{t('about:advantages.experience.description')}</p>
            </div>

            {/* 优势 3 */}
            <div className="bg-background p-6 rounded-lg shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('about:advantages.eco.title')}</h3>
              <p className="text-muted-foreground">{t('about:advantages.eco.description')}</p>
            </div>

            {/* 优势 4 */}
            <div className="bg-background p-6 rounded-lg shadow-sm border border-border hover:border-primary/50 transition-colors">
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('about:advantages.service.title')}</h3>
              <p className="text-muted-foreground">{t('about:advantages.service.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 我们的历史 */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('about:history.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('about:history.subtitle')}
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* 时间线连接线 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>

            {/* 历史事件 1 */}
            <div className="mb-12 relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-5 h-5 rounded-full bg-primary"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:text-right pr-8">
                  <h3 className="text-lg font-semibold mb-2">2010</h3>
                  <p className="text-muted-foreground">{t('about:history.events.founding')}</p>
                </div>
                <div className="md:pl-8"></div>
              </div>
            </div>

            {/* 历史事件 2 */}
            <div className="mb-12 relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-5 h-5 rounded-full bg-primary"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:pr-8"></div>
                <div className="md:pl-8">
                  <h3 className="text-lg font-semibold mb-2">2015</h3>
                  <p className="text-muted-foreground">{t('about:history.events.expansion')}</p>
                </div>
              </div>
            </div>

            {/* 历史事件 3 */}
            <div className="mb-12 relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-5 h-5 rounded-full bg-primary"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:text-right pr-8">
                  <h3 className="text-lg font-semibold mb-2">2018</h3>
                  <p className="text-muted-foreground">{t('about:history.events.international')}</p>
                </div>
                <div className="md:pl-8"></div>
              </div>
            </div>

            {/* 历史事件 4 */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-5 h-5 rounded-full bg-primary"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:pr-8"></div>
                <div className="md:pl-8">
                  <h3 className="text-lg font-semibold mb-2">2023</h3>
                  <p className="text-muted-foreground">{t('about:history.events.present')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 认证和资质 */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('about:certifications.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('about:certifications.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* 认证 1 */}
            <div className="bg-background p-6 rounded-lg shadow-sm border border-border text-center">
              <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <img src="/images/iso9001.png" alt="ISO 9001" className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ISO 9001</h3>
              <p className="text-muted-foreground text-sm">{t('about:certifications.iso9001')}</p>
            </div>

            {/* 认证 2 */}
            <div className="bg-background p-6 rounded-lg shadow-sm border border-border text-center">
              <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <img src="/images/iso14001.png" alt="ISO 14001" className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ISO 14001</h3>
              <p className="text-muted-foreground text-sm">{t('about:certifications.iso14001')}</p>
            </div>

            {/* 认证 3 */}
            <div className="bg-background p-6 rounded-lg shadow-sm border border-border text-center">
              <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <img src="/images/ce.png" alt="CE 认证" className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold mb-2">CE</h3>
              <p className="text-muted-foreground text-sm">{t('about:certifications.ce')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-950 dark:to-blue-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t('about:cta.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-blue-100 mb-8">
            {t('about:cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
              <Link to="/products">
                {t('about:cta.products')}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/contact">
                {t('about:cta.contact')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
