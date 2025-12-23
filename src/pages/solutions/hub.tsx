import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';

import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import {
  solutionLandingPages,
  type SiteLanguage,
  type SolutionCategory,
} from '@/data/solution-pages';

const SUPPORTED_PAGE_LANGS: SiteLanguage[] = ['zh', 'en', 'ru', 'vi', 'th', 'id'];
const FALLBACK_LANG: SiteLanguage = 'zh';

const HERO_COPY: Record<SiteLanguage, {
  title: string;
  subtitle: string;
  description: string;
  contactCta: string;
  viewCta: string;
}> = {
  zh: {
    title: '市场落地页中心',
    subtitle: '根据目标市场选择 OEM / CMS / 私标 / 培训页面',
    description: '我们按国家与服务类型拆分了物流、证书、FAQ 与结构化数据，方便搜索引擎与客户快速了解方案。',
    contactCta: '预约顾问',
    viewCta: '查看全部落地页',
  },
  en: {
    title: 'Market Landing Hub',
    subtitle: 'Pick OEM, CMS bulk, private label, or training content tailored for each region',
    description: 'Every landing page contains localized logistics steps, compliance packs, FAQs, and structured data so search engines and buyers can trust the offer.',
    contactCta: 'Talk to an expert',
    viewCta: 'Browse landing pages',
  },
  ru: {
    title: 'Центр локальных страниц',
    subtitle: 'Выберите OEM, оптовый CMS, private label или обучение для нужного региона',
    description: 'Каждая страница включает русские документы, FAQ и пошаговую логистику — удобно для покупателей и поисковых систем.',
    contactCta: 'Связаться с экспертом',
    viewCta: 'Смотреть страницы',
  },
  vi: {
    title: 'Trung tâm trang thị trường',
    subtitle: 'Chọn gói OEM, CMS số lượng lớn, private label hoặc đào tạo theo quốc gia',
    description: 'Mỗi trang có lịch logistic, bộ chứng từ, FAQ và structured data bản địa hoá giúp khách và công cụ tìm kiếm tin tưởng.',
    contactCta: 'Trao đổi với chuyên gia',
    viewCta: 'Xem các trang',
  },
  th: {
    title: 'ฮับหน้าตลาดเฉพาะ',
    subtitle: 'เลือกหน้า OEM, CMS จำนวนมาก, private label หรือโปรแกรมอบรมตามประเทศ',
    description: 'แต่ละหน้าใส่ขั้นตอนโลจิสติกส์ เอกสาร และ FAQ เป็นภาษาในพื้นที่ เพื่อให้ลูกค้าและเสิร์ชเอ็นจินมั่นใจ.',
    contactCta: 'คุยกับผู้เชี่ยวชาญ',
    viewCta: 'ดูหน้าตลาด',
  },
  id: {
    title: 'Pusat halaman solusi pasar',
    subtitle: 'Pilih konten OEM, CMS bulk, private label, atau training untuk tiap negara',
    description: 'Setiap halaman memuat alur logistik, dokumen, FAQ, dan structured data lokal agar mudah dipercaya pembeli serta mesin pencari.',
    contactCta: 'Hubungi konsultan',
    viewCta: 'Lihat semua halaman',
  },
};

const CATEGORY_COPY: Record<SolutionCategory, Record<SiteLanguage, { title: string; description: string }>> = {
  oem: {
    zh: { title: 'OEM 解决方案', description: '按国家输出 OEM 产线、报关资料与 FAQ。' },
    en: { title: 'OEM Solutions', description: 'Localized OEM production timelines, port options, and compliance packs.' },
    ru: { title: 'OEM предложения', description: 'Расписанные сроки производства, таможенные документы и FAQ для региона.' },
    vi: { title: 'Giải pháp OEM', description: 'Lịch kiểm mẫu, chứng từ và logistics riêng từng quốc gia.' },
    th: { title: 'โซลูชัน OEM', description: 'รายละเอียดไลน์ผลิต เอกสารศุลกากร และ FAQ รายประเทศ.' },
    id: { title: 'Solusi OEM', description: 'Jadwal produksi, dokumen ekspor, serta FAQ untuk tiap pasar.' },
  },
  cms: {
    zh: { title: 'CMS 大宗供应', description: '展示华东、俄罗斯、越南、泰国、印尼的补货计划。' },
    en: { title: 'CMS Bulk Supply', description: 'Bulk CMS powder programs with moisture specs and shipping playbooks.' },
    ru: { title: 'Оптовые поставки CMS', description: 'Контейнерные графики, влажность и набор документов для импорта.' },
    vi: { title: 'Nguồn CMS số lượng lớn', description: 'Timeline vận chuyển, COA song ngữ và hỗ trợ thông quan.' },
    th: { title: 'CMS จำนวนมาก', description: 'แพ็กเกจการจัดส่ง, รายงาน ASTM และบริการลากตู้.' },
    id: { title: 'Suplai CMS besar', description: 'Monitor kontainer, dokumen BI dan dukungan CIF/DDP.' },
  },
  privateLabel: {
    zh: { title: '私标包装', description: '小包装、条码、拍摄素材一次交付。' },
    en: { title: 'Private Label', description: 'Small-pack formats, artwork workflow, and marketplace-ready assets.' },
    ru: { title: 'Private label', description: 'Кириллические этикетки, фото-контент и сертификация ЕАЭС.' },
    vi: { title: 'Private label', description: 'Thiết kế tiếng Việt, ảnh lifestyle và checklist TMĐT.' },
    th: { title: 'Private label', description: 'ฉลากภาษาไทย, mockup shelf และแพ็กพร้อมเข้าห้าง.' },
    id: { title: 'Private label', description: 'Label Bahasa Indonesia, sertifikasi halal dan toolkit kampanye.' },
  },
  training: {
    zh: { title: '应用培训', description: '线下实验室 + 远程陪跑，降低售后风险。' },
    en: { title: 'Application Training', description: 'Workshops, video libraries, and SLA-based remote coaching.' },
    ru: { title: 'Обучение применению', description: 'Вебинары, выездные воркшопы и техподдержка 24/7.' },
    vi: { title: 'Đào tạo thi công', description: 'Workshop 2 ngày + hotline kỹ thuật 24/7.' },
    th: { title: 'โปรแกรมอบรม', description: 'คลินิกหน้างาน + LINE support + คู่มือไทยครบชุด.' },
    id: { title: 'Pelatihan aplikasi', description: 'Bootcamp + kunjungan lapangan dan grup WhatsApp SLA 1 jam.' },
  },
};

const CARD_CTA: Record<SiteLanguage, string> = {
  zh: '查看详情',
  en: 'View detail',
  ru: 'Подробнее',
  vi: 'Xem chi tiết',
  th: 'ดูรายละเอียด',
  id: 'Lihat detail',
};

const FALLBACK_NOTICE: Record<SiteLanguage, string> = {
  zh: '',
  en: 'Localized landing pages are still being translated. Showing the Chinese version for now.',
  ru: '',
  vi: '',
  th: '',
  id: '',
};

const normalizeLang = (lang?: string): SiteLanguage => {
  if (!lang) return FALLBACK_LANG;
  const base = lang.split('-')[0] as SiteLanguage;
  return SUPPORTED_PAGE_LANGS.includes(base) ? base : FALLBACK_LANG;
};

const categoryOrder: SolutionCategory[] = ['oem', 'cms', 'privateLabel', 'training'];

export default function SolutionsHubPage() {
  const params = useParams();
  const requestedLang = normalizeLang(params.lang);

  const localizedPages = useMemo(
    () => solutionLandingPages.filter(page => page.lang === requestedLang),
    [requestedLang],
  );

  const effectiveLang: SiteLanguage = localizedPages.length ? requestedLang : FALLBACK_LANG;
  const pagesToRender = localizedPages.length
    ? localizedPages
    : solutionLandingPages.filter(page => page.lang === FALLBACK_LANG);

  const heroCopy = HERO_COPY[requestedLang] ?? HERO_COPY.en;
  const cardCta = CARD_CTA[requestedLang] ?? CARD_CTA.en;
  const fallbackMessage = !localizedPages.length ? FALLBACK_NOTICE[requestedLang] : '';

  const groupedSections = categoryOrder
    .map(category => ({
      category,
      copy: CATEGORY_COPY[category][requestedLang] ?? CATEGORY_COPY[category].en,
      pages: pagesToRender.filter(page => page.category === category),
    }))
    .filter(section => section.pages.length > 0);

  const canonicalUrl = `https://kn-wallpaperglue.com/${requestedLang}/solutions`;

  return (
    <>
      <SEOHelmet
        title={heroCopy.title}
        description={heroCopy.subtitle}
        keywords="OEM, CMS bulk, private label, training, wallpaper adhesive"
        lang={requestedLang}
        type="website"
        supportedLangs={SUPPORTED_PAGE_LANGS}
      />
      <StructuredData
        schema={{
          type: 'WebPage',
          name: heroCopy.title,
          description: heroCopy.description,
          url: canonicalUrl,
          inLanguage: requestedLang,
          areaServed: groupedSections.map(section => section.copy.title),
        }}
      />

      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-600 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
          <p className="uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 md:mb-4 text-emerald-200">
            Go-to-Market
          </p>
          <h1 className="text-2xl md:text-4xl font-bold leading-snug mb-3 md:mb-4">{heroCopy.title}</h1>
          <p className="text-white/90 text-sm md:text-lg mb-3 md:mb-4">{heroCopy.subtitle}</p>
          <p className="text-white/70 text-xs md:text-base hidden sm:block">{heroCopy.description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8">
            <Button asChild size="lg" className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-emerald-100">
              <Link to={`/${requestedLang}/contact`}>
                {heroCopy.contactCta}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10"
            >
              <a href="#solutions-grid">{heroCopy.viewCta}</a>
            </Button>
          </div>
        </div>
      </section>

      {fallbackMessage && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm py-3 px-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {fallbackMessage}
          </div>
        </div>
      )}

      <section id="solutions-grid" className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {groupedSections.map(section => (
            <div key={section.category} className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="uppercase tracking-[0.2em] text-xs text-emerald-600">
                    {section.category.toUpperCase()}
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-900">{section.copy.title}</h2>
                  <p className="text-slate-600 mt-2 max-w-2xl">{section.copy.description}</p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {section.pages.map(page => (
                  <div
                    key={`${page.lang}-${page.slug}`}
                    className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center text-sm text-emerald-700 font-semibold gap-2">
                      <MapPin className="h-4 w-4" />
                      {page.marketLabel}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mt-3">
                      {page.hero.title}
                    </h3>
                    <p className="text-slate-600 mt-3 text-sm leading-relaxed">
                      {page.hero.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {page.hero.highlights.slice(0, 3).map(highlight => (
                        <span
                          key={highlight}
                          className="inline-flex items-center text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                      {page.hero.stats.slice(0, 2).map(stat => (
                        <div key={stat.label} className="border border-slate-100 rounded-lg p-3">
                          <p className="text-emerald-700 text-lg font-semibold">{stat.value}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <Button asChild className="bg-emerald-600 hover:bg-emerald-500">
                        <Link to={`/${page.lang}/solutions/${page.slug}`}>
                          {cardCta}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                      <span className="text-xs text-slate-400">
                        {page.lang.toUpperCase()} · {page.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
