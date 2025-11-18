import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { SEOHelmet } from '@/components/SEOHelmet';
import { StructuredData } from '@/components/StructuredData';
import { OptimizedImage } from '@/components/OptimizedImage';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const currentLang = i18n.language;

  // 多语言FAQ数据
  const faqData: Record<string, FAQItem[]> = {
    zh: [
      {
        category: 'product',
        question: '什么是羧甲基淀粉(CMS)？',
        answer: '羧甲基淀粉是一种以淀粉为原料，通过化学改性制备的天然高分子材料。它具有良好的水溶性、粘合性和成膜性，广泛应用于纺织印染、建筑涂料、造纸、壁纸胶粘剂等领域。'
      },
      {
        category: 'product',
        question: 'CMS的主要应用领域有哪些？',
        answer: 'CMS主要应用于：(1)纺织印染：作为经纱上浆、印染助剂；(2)建筑行业：作为腻子粉、涂料、瓷砖胶的添加剂；(3)造纸工业：作为表面施胶剂、增强剂；(4)壁纸胶粘剂：提供优异的粘合性能。'
      },
      {
        category: 'product',
        question: 'CMS与其他粘合剂相比有什么优势？',
        answer: 'CMS的优势包括：天然环保、可生物降解、成本效益高、粘合性能优异、储存稳定性好、使用方便。相比传统的合成粘合剂，CMS更加环保且性能稳定。'
      },
      {
        category: 'quality',
        question: '你们的产品质量控制如何？',
        answer: '我们严格执行ISO9001质量管理体系，从原料采购到成品出厂全过程质量控制。配备先进的检测设备和专业技术人员，确保每批产品都符合国家标准和客户要求。'
      },
      {
        category: 'quality',
        question: '产品的保质期是多久？',
        answer: '在正确的储存条件下（阴凉干燥处，避免阳光直射），CMS产品的保质期通常为12-18个月。开封后建议在6个月内使用完毕，以保证最佳使用效果。'
      },
      {
        category: 'order',
        question: '最小起订量是多少？',
        answer: '我们支持灵活的最小起订量政策。标准包装为25kg/袋，最小起订量通常为1吨（40袋）。对于样品测试或小批量需求，我们可以提供25kg样品包装。'
      },
      {
        category: 'order',
        question: '如何下订单？',
        answer: '您可以通过以下方式下订单：(1)在线联系表单；(2)发送邮件至我们的销售邮箱；(3)直接拨打我们的销售热线；(4)通过我们的经销商网络。我们会及时回复并提供报价。'
      },
      {
        category: 'shipping',
        question: '产品如何包装和运输？',
        answer: '我们的产品采用25kg防潮内袋加外编织袋的双层包装，确保产品在运输和储存过程中的质量。我们提供公路、铁路、海运等多种运输方式，可根据客户需求选择最优方案。'
      },
      {
        category: 'shipping',
        question: '你们的交货周期是多久？',
        answer: '标准产品的交货周期通常为7-15个工作日，具体时间根据订单数量和运输距离而定。我们拥有充足的库存，能够快速响应客户的紧急需求。'
      },
      {
        category: 'company',
        question: '杭州卡恩新建筑材料有限公司成立于哪一年？',
        answer: '杭州卡恩新建筑材料有限公司成立于2002年，专注于羧甲基淀粉等建筑材料的研发、生产和销售，已有20多年的行业经验。'
      },
      {
        category: 'company',
        question: '你们的主要市场有哪些？',
        answer: '我们的产品远销国内外市场，包括东南亚、中东、欧洲、美洲等地区。在国内，我们与众多知名建材企业和纺织企业建立了长期合作关系。'
      },
      {
        category: 'technical',
        question: '如何正确储存CMS产品？',
        answer: 'CMS产品应储存在阴凉、干燥、通风的仓库中，避免阳光直射和高温。堆码高度不宜超过8层，防止产品受压结块。储存环境温度建议在5-35℃之间，相对湿度不超过70%。'
      },
      {
        category: 'technical',
        question: '使用CMS时需要注意什么？',
        answer: '使用CMS时应注意：(1)按照推荐比例加水稀释；(2)充分搅拌直至完全溶解；(3)现配现用，避免长时间存放；(4)不同应用领域可能有不同的使用要求，建议根据具体应用调整配比。'
      }
    ],
    en: [
      {
        category: 'product',
        question: 'What is Carboxymethyl Starch (CMS)?',
        answer: 'Carboxymethyl Starch is a natural polymer material prepared by chemical modification of starch. It has excellent water solubility, binding properties, and film-forming capabilities, widely used in textile printing, construction coatings, papermaking, and wallpaper adhesives.'
      },
      {
        category: 'product',
        question: 'What are the main applications of CMS?',
        answer: 'CMS is mainly used in: (1) Textile printing: as warp sizing and dyeing auxiliaries; (2) Construction industry: as additives for putty powder, coatings, and tile adhesives; (3) Papermaking: as surface sizing agents and strengthening agents; (4) Wallpaper adhesives: providing excellent bonding performance.'
      },
      {
        category: 'product',
        question: 'What advantages does CMS have over other adhesives?',
        answer: 'CMS advantages include: natural and environmentally friendly, biodegradable, cost-effective, excellent bonding performance, good storage stability, and easy to use. Compared to traditional synthetic adhesives, CMS is more eco-friendly with stable performance.'
      },
      {
        category: 'quality',
        question: 'How do you control product quality?',
        answer: 'We strictly implement the ISO9001 quality management system, controlling quality throughout the entire process from raw material procurement to finished product delivery. We are equipped with advanced testing equipment and professional technical personnel to ensure every batch meets national standards and customer requirements.'
      },
      {
        category: 'quality',
        question: 'What is the shelf life of your products?',
        answer: 'Under proper storage conditions (cool, dry place, away from direct sunlight), CMS products typically have a shelf life of 12-18 months. After opening, it is recommended to use within 6 months to ensure optimal performance.'
      },
      {
        category: 'order',
        question: 'What is the minimum order quantity?',
        answer: 'We support flexible minimum order quantity policies. Standard packaging is 25kg/bag, with typical MOQ of 1 ton (40 bags). For sample testing or small batch requirements, we can provide 25kg sample packaging.'
      },
      {
        category: 'order',
        question: 'How can I place an order?',
        answer: 'You can place orders through: (1) Online contact form; (2) Email to our sales email; (3) Direct call to our sales hotline; (4) Through our distributor network. We will respond promptly and provide quotations.'
      },
      {
        category: 'shipping',
        question: 'How are products packaged and shipped?',
        answer: 'Our products use double-layer packaging with 25kg moisture-proof inner bags and outer woven bags to ensure quality during transportation and storage. We offer various shipping methods including road, rail, and sea transport, selecting optimal solutions based on customer needs.'
      },
      {
        category: 'shipping',
        question: 'What is your delivery cycle?',
        answer: 'Standard product delivery time is typically 7-15 working days, depending on order quantity and shipping distance. We maintain sufficient inventory to quickly respond to urgent customer needs.'
      },
      {
        category: 'company',
        question: 'When was Hangzhou Karn New Building Materials Co., Ltd. established?',
        answer: 'Hangzhou Karn New Building Materials Co., Ltd. was established in 2002, specializing in the R&D, production, and sales of carboxymethyl starch and other building materials with over 20 years of industry experience.'
      },
      {
        category: 'company',
        question: 'What are your main markets?',
        answer: 'Our products are exported to domestic and international markets, including Southeast Asia, Middle East, Europe, Americas, and other regions. Domestically, we have established long-term partnerships with many renowned building materials and textile companies.'
      },
      {
        category: 'technical',
        question: 'How should CMS products be stored correctly?',
        answer: 'CMS products should be stored in cool, dry, ventilated warehouses, away from direct sunlight and high temperatures. Stack height should not exceed 8 layers to prevent product compression and caking. Storage temperature should be 5-35°C with relative humidity not exceeding 70%.'
      },
      {
        category: 'technical',
        question: 'What should be noted when using CMS?',
        answer: 'When using CMS, note: (1) Dilute with water according to recommended ratios; (2) Stir thoroughly until completely dissolved; (3) Use immediately after preparation, avoid long-term storage; (4) Different applications may have specific requirements, adjust ratios accordingly.'
      }
    ],
    ru: [
      {
        category: 'product',
        question: 'Что такое карбоксиметилкрахмал (КМС)?',
        answer: 'Карбоксиметилкрахмал - это природный полимерный материал, получаемый путем химической модификации крахмала. Он обладает хорошей водорастворимостью, связующими свойствами и пленкообразующей способностью, широко применяется в текстильной печати, строительных покрытиях, бумагоделании и обойных клея.'
      },
      {
        category: 'product',
        question: 'Каковы основные области применения КМС?',
        answer: 'КМС в основном применяется: (1) Текстильная печать: в качестве аппретирования основы и красильных вспомогательных веществ; (2) Строительная промышленность: в качестве добавок для шпаклевочных порошков, покрытий и плиточного клея; (3) Бумагоделание: в качестве поверхностных проклеивающих агентов и укрепляющих средств; (4) Обойные клеи: обеспечение превосходных свойств склеивания.'
      },
      {
        category: 'product',
        question: 'Какие преимущества имеет КМС по сравнению с другими клеями?',
        answer: 'Преимущества КМС включают: экологичность, биоразлагаемость, экономическую эффективность, превосходные свойства склеивания, хорошую стабильность хранения, простоту использования. По сравнению с традиционными синтетическими клеями КМС более экологичен с стабильными характеристиками.'
      },
      {
        category: 'quality',
        question: 'Как вы контролируете качество продукции?',
        answer: 'Мы строго внедряем систему управления качеством ISO9001, контролируя качество на протяжении всего процесса от закупки сырья до доставки готовой продукции. Мы оснащены современным испытательным оборудованием и профессиональным техническим персоналом для обеспечения соответствия каждой партии национальным стандартам и требованиям клиентов.'
      },
      {
        category: 'quality',
        question: 'Каков срок годности вашей продукции?',
        answer: 'При правильных условиях хранения (прохладное, сухое место, вдали от прямых солнечных лучей) срок годности продукции КМС обычно составляет 12-18 месяцев. После вскрытия рекомендуется использовать в течение 6 месяцев для обеспечения оптимальных характеристик.'
      },
      {
        category: 'order',
        question: 'Каков минимальный объем заказа?',
        answer: 'Мы поддерживаем гибкую политику минимального объема заказа. Стандартная упаковка 25кг/мешок, типичный минимальный заказ 1 тонна (40 мешков). Для образцов для тестирования или небольших партий мы можем предоставить упаковку по 25кг.'
      },
      {
        category: 'order',
        question: 'Как сделать заказ?',
        answer: 'Вы можете сделать заказ через: (1) Онлайн-форму контакта; (2) Электронную почту на наш адрес продаж; (3) Прямой звонок на нашу горячую линию продаж; (4) Через нашу дистрибьюторскую сеть. Мы оперативно ответим и предоставим ценовое предложение.'
      },
      {
        category: 'shipping',
        question: 'Как упаковывается и доставляется продукция?',
        answer: 'Наша продукция использует двухслойную упаковку с влагонепроницаемыми внутренними мешками по 25кг и внешними тканевыми мешками для обеспечения качества при транспортировке и хранении. Мы предлагаем различные способы доставки, включая автомобильный, железнодорожный и морской транспорт.'
      },
      {
        category: 'shipping',
        question: 'Каков ваш цикл доставки?',
        answer: 'Время доставки стандартной продукции обычно составляет 7-15 рабочих дней в зависимости от объема заказа и расстояния доставки. Мы поддерживаем достаточные запасы для быстрого реагирования на срочные потребности клиентов.'
      },
      {
        category: 'company',
        question: 'Когда была основана компания Hangzhou Karn New Building Materials Co., Ltd.?',
        answer: 'Hangzhou Karn New Building Materials Co., Ltd. была основана в 2002 году, специализируясь на НИОКР, производстве и продаже карбоксиметилкрахмала и других строительных материалов с более чем 20-летним опытом в отрасли.'
      },
      {
        category: 'company',
        question: 'Каковы ваши основные рынки?',
        answer: 'Наша продукция экспортируется на внутренние и международные рынки, включая Юго-Восточную Азию, Ближний Восток, Европу, Америку и другие регионы. Внутри страны мы установили долгосрочные партнерские отношения со многими известными строительными и текстильными компаниями.'
      },
      {
        category: 'technical',
        question: 'Как правильно хранить продукцию КМС?',
        answer: 'Продукцию КМС следует хранить в прохладных, сухих, проветриваемых складах, вдали от прямых солнечных лучей и высоких температур. Высота штабелирования не должна превышать 8 слоев для предотвращения сжатия и комкования продукции. Температура хранения должна быть 5-35°C с относительной влажностью не более 70%.'
      },
      {
        category: 'technical',
        question: 'Что следует учитывать при использовании КМС?',
        answer: 'При использовании КМС следует учитывать: (1) Разбавлять водой в соответствии с рекомендуемыми пропорциями; (2) Тщательно перемешивать до полного растворения; (3) Использовать немедленно после приготовления, избегать длительного хранения; (4) Разные применения могут иметь специфические требования, настраивать пропорции соответствующим образом.'
      }
    ]
  };

  const faqs = faqData[currentLang] || faqData.zh;

  // 分类过滤
  const categories = [
    { id: 'all', name: t('faq.categories.all', '全部') },
    { id: 'product', name: t('faq.categories.product', '产品相关') },
    { id: 'quality', name: t('faq.categories.quality', '质量控制') },
    { id: 'order', name: t('faq.categories.order', '订购流程') },
    { id: 'shipping', name: t('faq.categories.shipping', '包装运输') },
    { id: 'company', name: t('faq.categories.company', '公司信息') },
    { id: 'technical', name: t('faq.categories.technical', '技术问题') }
  ];

  const filteredFAQs = activeCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleItem = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // 结构化数据
  const faqSchema = {
    type: 'FAQPage' as const,
    mainEntity: filteredFAQs.map(faq => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer
      }
    }))
  };

  return (
    <>
      <SEOHelmet
        title={t('faq.title', '常见问题解答')}
        description={t('faq.description', '查找关于羧甲基淀粉(CMS)产品、订购、技术等常见问题的答案')}
        keywords={t('faq.keywords', 'CMS,羧甲基淀粉,常见问题,FAQ,技术支持,产品咨询')}
        type="website"
        lang={currentLang as 'zh' | 'en' | 'ru' | 'vi' | 'th' | 'id'}
      />

      <StructuredData schema={faqSchema} />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">
              {t('faq.hero.title', '常见问题解答')}
            </h1>
            <p className="text-xl text-blue-100">
              {t('faq.hero.subtitle', '关于我们产品和服务的常见问题')}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category.name} ({category.id === 'all' ? faqs.length : faqs.filter(f => f.category === category.id).length})
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <h3 className="text-lg font-medium text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedItems.includes(index) ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`transition-all duration-200 ${
                    expandedItems.includes(index) ? 'max-h-96' : 'max-h-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className="mb-6">
                <OptimizedImage
                  src="/images/customer-service.jpg"
                  alt={t('faq.noQuestions.image', '客服支持')}
                  className="w-32 h-32 mx-auto rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('faq.noQuestions.title', '没有找到相关问题？')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('faq.noQuestions.subtitle', '我们的客服团队随时为您解答')}
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('faq.noQuestions.contact', '联系我们')}
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          )}

          {/* Additional Resources */}
          <div className="mt-16 bg-blue-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('faq.resources.title', '更多资源')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <a
                href="/products"
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('faq.resources.products', '产品目录')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('faq.resources.productsDesc', '查看完整的产品规格和应用说明')}
                </p>
              </a>

              <a
                href="/about"
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('faq.resources.about', '关于我们')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('faq.resources.aboutDesc', '了解我们的公司历史和专业优势')}
                </p>
              </a>

              <a
                href="/contact"
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('faq.resources.contact', '联系我们')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('faq.resources.contactDesc', '获取专业的技术咨询和报价')}
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}