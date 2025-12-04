/**
 * SEO 配置中心
 * 统一管理网站的 SEO 元数据、关键词、默认图片等配置
 */

export const SITE_NAME = 'Hangzhou Karn New Building Materials Co., Ltd';
export const SITE_URL = 'https://kn-wallpaperglue.com';
export const DEFAULT_IMAGE = `${SITE_URL}/images/IMG_1412.JPG`;
export const DEFAULT_LOGO = `${SITE_URL}/images/logo.png`;

// 增强的通用关键词 - 针对SEO优化
export const COMMON_KEYWORDS = {
  zh: '羧甲基淀粉,CMS,羧甲基淀粉钠,纺织印染助剂,建筑胶粉,壁纸胶粉,腻子粉添加剂,涂料增稠剂,造纸工业,环保建材,天然高分子材料,水溶性聚合物,杭州卡恩,浙江卡恩,墙纸胶,粘合剂厂家,淀粉衍生物,绿色建材',
  en: 'carboxymethyl starch,CMS,carboxymethyl sodium,textile auxiliary,building adhesive,wallpaper glue,putty additive,coating thickener,paper industry,eco-friendly building materials,natural polymers,water-soluble polymers,Hangzhou Karn,starch derivatives,green construction materials',
  ru: 'карбоксиметилкрахмал,КМС,карбоксиметилкрахмал натрия,текстильные вспомогательные вещества,строительный клей,клей для обоев,добавка для шпаклевки,загуститель для покрытий,бумажная промышленность,экологичные стройматериалы,природные полимеры,водорастворимые полимеры,производитель клея,производитель КМС',
  vi: 'tinh bột carboxymethyl,CMS,natri carboxymethyl,phụ trợ dệt may,keo xây dựng,keo dán giấy tường,bột trét phụ gia,chất làm đặc sơn,công nghiệp giấy,vật liệu xây dựng xanh,polymer tự nhiên,hòa tan trong nước,nhà sản xuất keo,tính chất sinh học',
  th: 'คาร์บอกซิเมทิลสตาร์ช,CMS,โซเดียมคาร์บอกซิเมทิล,สารช่วยในอุตสาหกรรมสิ่งทอ,กาวก่อสร้าง,กาววอลเปเปอร์,ผงทราย,สารทำทางสี,อุตสาหกรรมกระดาษ,วัสดุก่อสร้างเป็นมิตร,พอลิเมอร์ธรรมชาติ,ละลายในน้ำ,ผู้ผลิตกาว',
  id: 'pati karboksimetil,CMS,natrium karboksimetil,bahan pembantu tekstil,perekat bangunan,perekat wallpaper,bubuk dempul,pengental cat,industri kertas,bahan bangunan ramah lingkungan,polimer alami,larut dalam air,pabrik perekat,pabrik pati modifikasi'
};

// 增强的页面特定关键词配置 - SEO优化
export const PAGE_KEYWORDS: Record<string, Record<string, string>> = {
  home: {
    zh: '羧甲基淀粉,CMS,羧甲基淀粉钠,纺织印染助剂,建筑胶粉,壁纸胶粉,环保建材,天然高分子材料,杭州卡恩,浙江卡恩,墙纸胶,腻子粉,涂料增稠剂,造纸工业,淀粉衍生物,绿色建材,CMS生产厂家,carboxymethyl starch manufacturer,textile printing chemicals,wallpaper adhesive supplier,eco-friendly construction materials',
    en: 'carboxymethyl starch,CMS,carboxymethyl sodium,textile auxiliary,building adhesive,wallpaper glue,eco-friendly building materials,natural polymers,Hangzhou Karn,water-soluble polymers,starch derivatives,green construction,CMS manufacturer,textile printing chemicals,construction adhesive supplier,industrial starch products',
    ru: 'карбоксиметилкрахмал,КМС,карбоксиметилкрахмал натрия,текстильные вспомогательные вещества,строительный клей,клей для обоев,экологичные стройматериалы,природные полимеры,производитель КМС,водорастворимые полимеры,производитель клея,производитель строительных материалов',
  },
  products: {
    zh: 'CMS产品系列,羧甲基淀粉产品,建筑胶粉,壁纸胶粉,纺织助剂,涂料添加剂,造纸助剂,淀粉衍生物产品,工业级CMS,食品级CMS,医药级CMS,高粘度CMS,低粘度CMS,定制CMS,CMS价格,CMS规格,carboxymethyl starch products,industrial CMS grades,textile auxiliaries,building adhesives,paper additives',
    en: 'CMS product series,carboxymethyl starch products,building adhesive,wallpaper glue,textile auxiliaries,coating additives,paper additives,starch derivatives,industrial CMS,food grade CMS,pharmaceutical grade CMS,high viscosity CMS,low viscosity CMS,custom CMS,CMS pricing,CMS specifications,CMS manufacturer',
    ru: 'продукты КМС,карбоксиметилкрахмал,строительный клей,клей для обоев,текстильные вспомогательные вещества,добавки для покрытий,бумажные добавки,производные крахмала,промышленный КМС,пищевой КМС,фармацевтический КМС,высоковязкий КМС,низковязкий КМС,кастомизированный КМС,цены КМС,спецификации КМС',
  },
  applications: {
    zh: 'CMS应用领域,羧甲基淀粉应用,纺织印染应用,建筑行业应用,壁纸胶应用,造纸工业应用,涂料工业应用,日用化工应用,制药工业应用,纺织上浆剂,印花助剂,纸张施胶剂,腻子粉增强剂,涂料流变剂,wallpaper adhesive applications,textile printing applications,construction industry applications,paper industry applications,coating rheology modifiers',
    en: 'CMS applications,carboxymethyl starch applications,textile industry,construction industry,paper industry,coating industry,daily chemical,pharmaceutical industry,textile sizing agents,printing auxiliaries,paper sizing agents,putty powder enhancers,coating rheology modifiers,industrial starch applications',
    ru: 'применение КМС,применение карбоксиметилкрахмала,текстильная промышленность,строительная промышленность,бумажная промышленность,лакокрасочная промышленность,химическая промышленность,фармацевтическая промышленность,аппретирование основы,вспомогательные вещества для печати,поверхностная проклейка,усилители шпаклевки,реологические добавки',
  },
  oem: {
    zh: 'CMS代工生产,OEM代工,ODM服务,墙纸胶粉OEM,建筑胶粉OEM,定制生产,小包装OEM,品牌定制,技术配方定制,质量检测服务,包装设计,私人标签定制,wallpaper adhesive OEM,building adhesive OEM,private label manufacturing,custom formulation,packaging design,quality testing services',
    en: 'CMS OEM manufacturing,OEM services,ODM services,wallpaper adhesive OEM,building adhesive OEM,custom manufacturing,private label OEM,brand customization,technical formulation,quality testing,packaging design,contract manufacturing',
    ru: 'производство КМС OEM,услуги OEM,услуги ODM,клей для обоев OEM,строительный клей OEM,кастомизированное производство,частная марка,брендинг,технические формулировки,контроль качества,дизайн упаковки,контрактное производство',
  },
  about: {
    zh: '杭州卡恩新建材有限公司,浙江卡恩,CMS专家,羧甲基淀粉专家,建材专家,23年经验,ISO认证,质量控制,研发团队,生产能力,出口经验,客户服务,技术创新,环保理念,行业领先,carboxymethyl starch experts,building materials experts,ISO certified manufacturer,quality control,R&D team,export experience',
    en: 'Hangzhou Karn New Building Materials,Zhejiang Karn,CMS experts,carboxymethyl starch experts,building materials experts,23 years experience,ISO certified,quality control,R&D team,production capacity,export experience,customer service,technical innovation,environmental protection,industry leader',
    ru: 'Ханчжоу Карн Новые Строительные Материалы,Чжэцзян Карн,эксперты КМС,карбоксиметилкрахмал,эксперты по строительным материалам,23 года опыта,ISO сертификация,контроль качества,R&D команда,производственная мощность,экспортный опыт,обслуживание клиентов,технические инновации,экологическая защита,лидер отрасли',
  },
  contact: {
    zh: '联系杭州卡恩,羧甲基淀粉供应商,CMS供应商,建筑胶粉供应商,壁纸胶粉供应商,技术咨询,价格咨询,样品申请,技术支持,售后服务,外贸出口,国际业务,合作洽谈,agent inquiries,distributor opportunities,international business,technical consultation',
    en: 'Contact Hangzhou Karn,CMS supplier,carboxymethyl starch supplier,building adhesive supplier,wallpaper glue supplier,technical consultation,price inquiry,sample request,technical support,after-sales service,export business,international business,cooperation',
    ru: 'Связаться с Ханчжоу Карн,поставщик КМС,карбоксиметилкрахмал,поставщик строительного клея,поставщик клея для обоев,техническая консультация,запрос цен,запрос образцов,техническая поддержка,послепродажное обслуживание,экспортный бизнес,международный бизнес,сотрудничество',
  },
  faq: {
    zh: 'CMS常见问题,羧甲基淀粉FAQ,技术问答,产品使用说明,应用指南,故障排除,质量标准,储存方法,使用方法,安全事项,环保认证,产品证书,技术参数,product FAQs,technical questions,application guidelines,troubleshooting,quality standards',
    en: 'CMS FAQ,carboxymethyl starch FAQ,technical questions,product usage instructions,application guides,troubleshooting,quality standards,storage methods,safety precautions,environmental certification,product certificates,technical specifications',
    ru: 'FAQ по КМС,карбоксиметилкрахмал,технические вопросы,инструкции по применению,руководства по применению,устранение неполадок,стандарты качества,методы хранения,меры предосторожности,экологическая сертификация,сертификаты продукции,технические характеристики',
  }
};

// 页面默认图片配置
export const PAGE_IMAGES: Record<string, string> = {
  home: '/images/IMG_1412.JPG',
  products: '/images/IMG_1412.JPG',
  applications: '/images/应用领域/纺织印染.jpg',
  oem: '/images/oem-home.png',
  about: '/images/IMG_1515.JPG',
  contact: '/images/IMG_1515.JPG',
};

/**
 * 获取页面的 SEO 关键词
 */
export function getPageKeywords(page: string, lang: string = 'zh'): string {
  const pageKeywords = PAGE_KEYWORDS[page]?.[lang];
  if (pageKeywords) {
    return pageKeywords;
  }
  
  // 如果没有找到特定页面的关键词，返回通用关键词
  return COMMON_KEYWORDS[lang as keyof typeof COMMON_KEYWORDS] || COMMON_KEYWORDS.zh;
}

/**
 * 获取页面的默认图片
 */
export function getPageImage(page: string): string {
  return PAGE_IMAGES[page] || DEFAULT_IMAGE;
}











