import type { ComponentType } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Boxes,
  CheckCircle2,
  Clock,
  Factory,
  Globe,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react';

import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  solutionDictionaryBySlug,
  solutionLandingPages,
  type FeatureIcon,
  type SiteLanguage,
} from '@/data/solution-pages';

const ICON_MAP: Record<FeatureIcon, ComponentType<{ className?: string }>> = {
  factory: Factory,
  shield: ShieldCheck,
  clock: Clock,
  globe: Globe,
  truck: Truck,
  boxes: Boxes,
  award: Award,
  users: Users,
};

const SUPPORTED_PAGE_LANGS: SiteLanguage[] = ['zh', 'en', 'ru', 'vi', 'th', 'id'];

const normalizeLang = (lang?: string): SiteLanguage => {
  if (!lang) return 'en';
  const base = lang.split('-')[0] as SiteLanguage;
  return SUPPORTED_PAGE_LANGS.includes(base) ? base : 'en';
};

export default function SolutionsPage() {
  const params = useParams();
  const slug = params.slug ?? '';
  const requestedLang = normalizeLang(params.lang);
  const entries = solutionDictionaryBySlug[slug];

  if (!entries) {
    return <Navigate to={`/${requestedLang}`} replace />;
  }

  const pageData = entries.find(entry => entry.lang === requestedLang) ?? entries[0];

  if (pageData.lang !== requestedLang) {
    return <Navigate to={`/${pageData.lang}/solutions/${slug}`} replace />;
  }

  const supportedLangsForSlug = entries.map(entry => entry.lang);
  const keywords = pageData.meta.keywords.join(', ');
  const FeatureIcon = ({ icon }: { icon: FeatureIcon }) => {
    const IconComponent = ICON_MAP[icon];
    return <IconComponent className="h-5 w-5 text-emerald-600" />;
  };

  return (
    <>
      <SEOHelmet
        title={pageData.meta.title}
        description={pageData.meta.description}
        keywords={keywords}
        image={pageData.meta.image}
        lang={pageData.lang}
        type="article"
        supportedLangs={supportedLangsForSlug}
      />
      <StructuredData
        schema={{
          type: 'WebPage',
          name: pageData.structuredData.name,
          description: pageData.structuredData.description,
          url: pageData.structuredData.url,
          inLanguage: pageData.lang,
          areaServed: pageData.marketLabel,
        }}
      />
      {pageData.faqs.length > 0 && (
        <StructuredData
          schema={{
            type: 'FAQPage',
            mainEntity: pageData.faqs.map(faq => ({
              question: faq.question,
              answer: faq.answer,
            })),
          }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 pt-4">
        <BreadcrumbNavigation />
      </div>

      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.3em] text-xs mb-4 text-emerald-200">
            {pageData.hero.eyebrow}
          </p>
          <div className="flex flex-wrap gap-6 items-start">
            <div className="flex-1 min-w-[280px]">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-white/10 text-sm mb-6">
                <span className="font-semibold mr-2">{pageData.marketLabel}</span>
                <span className="text-emerald-200">OEM</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-4">
                {pageData.hero.title}
              </h1>
              <p className="text-white/80 text-base md:text-lg max-w-3xl mb-6">
                {pageData.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {pageData.hero.highlights.map(highlight => (
                  <span
                    key={highlight}
                    className="inline-flex items-center text-sm bg-white/10 px-3 py-1 rounded-full"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-200" />
                    {highlight}
                  </span>
                ))}
              </div>
              <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-emerald-100">
                <Link to={pageData.hero.cta.href}>
                  {pageData.hero.cta.label}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="w-full lg:w-[320px] bg-white/10 rounded-lg p-6">
              <p className="text-sm uppercase tracking-widest text-emerald-200 mb-4">
                KPI Snapshot
              </p>
              <div className="grid grid-cols-1 gap-4">
                {pageData.hero.stats.map(stat => (
                  <div key={stat.label} className="border border-white/20 rounded-md p-4">
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-white/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                {pageData.positioning.summary}
              </h2>
              <ul className="space-y-3 text-slate-600">
                {pageData.positioning.bullets.map(bullet => (
                  <li key={bullet} className="flex">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mr-3 mt-1" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5">
              <p className="text-sm uppercase tracking-widest text-emerald-700 mb-3">联系方式</p>
              <ul className="space-y-3 text-slate-700">
                {pageData.contacts.map(contact => (
                  <li key={contact.label}>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">{contact.label}</p>
                    <p className="font-semibold">{contact.value}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-2/3">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">服务亮点</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {pageData.features.map(feature => (
                  <div key={feature.title} className="bg-white rounded-lg border border-slate-100 p-5 shadow-sm">
                    <div className="w-10 h-10 rounded-md bg-emerald-100 flex items-center justify-center mb-4">
                      <FeatureIcon icon={feature.icon} />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg border border-slate-100 p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-900 mb-3">交付物清单</h4>
                <ul className="space-y-3 text-slate-600">
                  {pageData.deliverables.map(item => (
                    <li key={item} className="flex">
                      <ArrowRight className="h-4 w-4 text-emerald-600 mr-2 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">交付时间线</h3>
              <div className="space-y-6">
                {pageData.timeline.map((step, index) => (
                  <div key={`${step.title}-${index}`} className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      {index !== pageData.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-emerald-100" />
                      )}
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex-1">
                      <p className="text-sm text-slate-500 uppercase tracking-widest mb-1">
                        {step.duration}
                      </p>
                      <h4 className="text-lg font-semibold text-slate-900">{step.title}</h4>
                      <p className="text-slate-600 text-sm mt-2">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-6 sticky top-10">
                <h4 className="text-lg font-semibold text-emerald-900 mb-3">下一步</h4>
                <p className="text-sm text-emerald-800 mb-4">
                  {pageData.hero.subtitle}
                </p>
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-500">
                  <Link to={pageData.hero.cta.href}>
                    {pageData.hero.cta.label}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">常见问题</h3>
              <div className="space-y-4">
                {pageData.faqs.map(faq => (
                  <details key={faq.question} className="group border border-slate-200 rounded-lg bg-white p-4" open>
                    <summary className="cursor-pointer flex items-center justify-between text-lg font-semibold text-slate-900">
                      {faq.question}
                      <span className="ml-2 text-emerald-600 group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="text-slate-600 mt-3 text-sm leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">更多 OEM 市场页面</h4>
              <p className="text-sm text-slate-600 mb-4">
                选择其它语种/市场了解我们在不同地区的交付做法。
              </p>
              <div className="space-y-3">
                {solutionLandingPages
                  .filter(entry => entry.category === pageData.category && entry.slug !== pageData.slug)
                  .map(entry => (
                    <Link
                      key={`${entry.lang}-${entry.slug}`}
                      to={`/${entry.lang}/solutions/${entry.slug}`}
                      className={cn(
                        'flex items-center justify-between border rounded-md px-4 py-3 text-sm font-medium transition-colors',
                        entry.lang === pageData.lang
                          ? 'border-emerald-500 text-emerald-600'
                          : 'border-slate-200 hover:border-emerald-200',
                      )}
                    >
                      <span>{entry.marketLabel}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
