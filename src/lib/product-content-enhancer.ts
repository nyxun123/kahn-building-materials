/**
 * 产品内容增强工具
 * 用于SEO优化和内容扩展
 */

interface ProductContent {
  name: string;
  description: string;
  category: string;
  applications: string[];
  features: string[];
  specifications: Record<string, string>;
  benefits: string[];
  technicalData: {
    appearance: string;
    viscosity: string;
    ph: string;
    solidContent: string;
    solubility: string;
    storage: string;
    shelfLife: string;
  };
}

export class ProductContentEnhancer {
  private static instance: ProductContentEnhancer;
  private contentCache: Map<string, ProductContent> = new Map();

  static getInstance(): ProductContentEnhancer {
    if (!ProductContentEnhancer.instance) {
      ProductContentEnhancer.instance = new ProductContentEnhancer();
    }
    return ProductContentEnhancer.instance;
  }

  // 增强产品内容
  enhanceContent(product: any, lang: string = 'zh'): ProductContent {
    const cacheKey = `${product.id}-${lang}`;

    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey)!;
    }

    const enhanced = this.generateEnhancedContent(product, lang);
    this.contentCache.set(cacheKey, enhanced);

    return enhanced;
  }

  private generateEnhancedContent(product: any, lang: string): ProductContent {
    const baseContent = {
      name: this.getName(product, lang),
      description: this.getEnhancedDescription(product, lang),
      category: this.getCategory(product),
      applications: this.getApplications(product, lang),
      features: this.getFeatures(product, lang),
      specifications: this.getSpecifications(product, lang),
      benefits: this.getBenefits(product, lang),
      technicalData: this.getTechnicalData(product, lang)
    };

    return baseContent;
  }

  private getName(product: any, lang: string): string {
    const names = {
      zh: product.name_zh || product.product_code,
      en: product.name_en || product.product_code,
      ru: product.name_ru || product.product_code
    };
    return names[lang as keyof typeof names] || product.product_code;
  }

  private getEnhancedDescription(product: any, lang: string): string {
    const baseDesc = this.getDescription(product, lang);
    const enhancements = this.getDescriptionEnhancements(product, lang);

    return `${baseDesc} ${enhancements.join(' ')}`;
  }

  private getDescription(product: any, lang: string): string {
    const descriptions = {
      zh: product.description_zh || '',
      en: product.description_en || '',
      ru: product.description_ru || ''
    };
    return descriptions[lang as keyof typeof descriptions] || '';
  }

  private getDescriptionEnhancements(product: any, lang: string): string[] {
    const enhancements = {
      zh: [
        '羧甲基淀粉(CMS)是一种以天然淀粉为原料，通过化学改性制备的高分子材料。',
        '具有优异的水溶性、粘合性、成膜性和稳定性。',
        '环保可降解，符合现代绿色建材要求。',
        '广泛应用于纺织印染、建筑涂料、壁纸胶粘剂等领域。'
      ],
      en: [
        'Carboxymethyl Starch (CMS) is a polymer material made from natural starch through chemical modification.',
        'Excellent water solubility, bonding properties, film-forming ability, and stability.',
        'Environmentally friendly and biodegradable, meeting modern green building requirements.',
        'Widely used in textile printing, construction coatings, wallpaper adhesives, and other fields.'
      ],
      ru: [
        'Карбоксиметилкрахмал (КМС) - полимерный материал, полученный из натурального крахмала путем химической модификации.',
        'Отличная водорастворимость, связующие свойства, пленкообразующая способность и стабильность.',
        'Экологически чистый и биоразлагаемый, соответствующий современным требованиям к зеленым строительным материалам.',
        'Широко применяется в текстильной печати, строительных покрытиях, обойных клеях и других областях.'
      ]
    };

    return enhancements[lang as keyof typeof enhancements] || enhancements.en;
  }

  private getCategory(product: any): string {
    // 根据产品代码分类
    const code = product.product_code?.toLowerCase() || '';

    if (code.includes('wallpaper') || code.includes('glue')) {
      return 'wallpaper-adhesive';
    } else if (code.includes('textile') || code.includes('printing')) {
      return 'textile-auxiliary';
    } else if (code.includes('coating') || code.includes('paint')) {
      return 'coating-additive';
    } else if (code.includes('putty') || code.includes('filler')) {
      return 'wall-filler';
    } else {
      return 'general-purpose';
    }
  }

  private getApplications(product: any, lang: string): string[] {
    const applications = {
      zh: [
        '纺织印染行业 - 经纱上浆、印花粘合剂',
        '建筑行业 - 腻子粉、内墙涂料添加剂',
        '壁纸行业 - 壁纸胶粘剂、墙纸施工',
        '造纸行业 - 表面施胶剂、纸张增强剂',
        '日化行业 - 洗涤剂、化妆品增稠剂'
      ],
      en: [
        'Textile Industry - Warp sizing, printing adhesive',
        'Construction Industry - Putty powder, interior wall coating additive',
        'Wallpaper Industry - Wallpaper adhesive, wallpaper installation',
        'Paper Industry - Surface sizing agent, paper strengthening agent',
        'Daily Chemical Industry - Detergent, cosmetic thickener'
      ],
      ru: [
        'Текстильная промышленность - аппретирование основы, клей для печати',
        'Строительная промышленность - шпаклевочный порошок, добавка для внутренних покрытий',
        'Обойная промышленность - клей для обоев, монтаж обоев',
        'Бумажная промышленность - поверхностный проклеивающий агент, укрепляющее средство',
        'Химическая промышленность - моющие средства, загуститель косметики'
      ]
    };

    return applications[lang as keyof typeof applications] || applications.en;
  }

  private getFeatures(product: any, lang: string): string[] {
    const features = {
      zh: [
        '天然环保，可生物降解',
        '优异的水溶性和分散性',
        '良好的粘合性和成膜性',
        '储存稳定性好，不易结块',
        '使用方便，易于调配',
        '成本效益高',
        '适用范围广',
        '符合环保标准'
      ],
      en: [
        'Natural and environmentally friendly, biodegradable',
        'Excellent water solubility and dispersibility',
        'Good bonding and film-forming properties',
        'Good storage stability, resistant to caking',
        'Easy to use, convenient to mix',
        'Cost-effective',
        'Wide application range',
        'Meets environmental standards'
      ],
      ru: [
        'Экологически чистый, биоразлагаемый',
        'Отличная водорастворимость и диспергируемость',
        'Хорошие связующие и пленкообразующие свойства',
        'Хорошая стабильность хранения, устойчивость к комкованию',
        'Прост в использовании, удобен в смешивании',
        'Экономически эффективный',
        'Широкий спектр применения',
        'Соответствует экологическим стандартам'
      ]
    };

    return features[lang as keyof typeof features] || features.en;
  }

  private getSpecifications(product: any, lang: string): Record<string, string> {
    const specs = {
      zh: {
        '外观': '白色或淡黄色粉末',
        '粘度': '500-1500 mPa·s',
        'pH值': '6.0-8.0',
        '固含量': '≥85%',
        '溶解性': '易溶于冷水',
        '细度': '≥99%通过100目筛',
        '水分': '≤12%'
      },
      en: {
        'Appearance': 'White or light yellow powder',
        'Viscosity': '500-1500 mPa·s',
        'pH Value': '6.0-8.0',
        'Solid Content': '≥85%',
        'Solubility': 'Easily soluble in cold water',
        'Fineness': '≥99% through 100 mesh sieve',
        'Moisture': '≤12%'
      },
      ru: {
        'Внешний вид': 'Белый или светло-желтый порошок',
        'Вязкость': '500-1500 мПа·с',
        'Значение pH': '6.0-8.0',
        'Содержание твердых веществ': '≥85%',
        'Растворимость': 'Легко растворим в холодной воде',
        'Мелкость': '≥99% через сито 100 меш',
        'Влажность': '≤12%'
      }
    };

    return specs[lang as keyof typeof specs] || specs.en;
  }

  private getBenefits(product: any, lang: string): string[] {
    const benefits = {
      zh: [
        '提高产品质量和性能',
        '降低生产成本',
        '改善施工性能',
        '增强产品稳定性',
        '简化生产工艺',
        '减少环境污染',
        '提升用户体验',
        '延长产品保质期'
      ],
      en: [
        'Improve product quality and performance',
        'Reduce production costs',
        'Enhance application performance',
        'Increase product stability',
        'Simplify production processes',
        'Reduce environmental pollution',
        'Enhance user experience',
        'Extend product shelf life'
      ],
      ru: [
        'Повышение качества и производительности продукта',
        'Снижение производственных затрат',
        'Улучшение эксплуатационных характеристик',
        'Повышение стабильности продукта',
        'Упрощение производственных процессов',
        'Снижение загрязнения окружающей среды',
        'Улучшение пользовательского опыта',
        'Увеличение срока хранения продукта'
      ]
    };

    return benefits[lang as keyof typeof benefits] || benefits.en;
  }

  private getTechnicalData(product: any, lang: string): ProductContent['technicalData'] {
    const technicalData = {
      zh: {
        appearance: '白色或淡黄色粉末，无异味',
        viscosity: '500-1500 mPa·s（2%水溶液，25℃）',
        ph: '6.0-8.0（2%水溶液）',
        solidContent: '≥85%',
        solubility: '易溶于冷水，形成透明粘稠溶液',
        storage: '阴凉干燥处储存，避免阳光直射',
        shelfLife: '12-18个月（未开封）'
      },
      en: {
        appearance: 'White or light yellow powder, odorless',
        viscosity: '500-1500 mPa·s (2% aqueous solution, 25℃)',
        ph: '6.0-8.0 (2% aqueous solution)',
        solidContent: '≥85%',
        solubility: 'Easily soluble in cold water, forming transparent viscous solution',
        storage: 'Store in cool, dry place, away from direct sunlight',
        shelfLife: '12-18 months (unopened)'
      },
      ru: {
        appearance: 'Белый или светло-желтый порошок, без запаха',
        viscosity: '500-1500 мПа·с (2% водный раствор, 25℃)',
        ph: '6.0-8.0 (2% водный раствор)',
        solidContent: '≥85%',
        solubility: 'Легко растворим в холодной воде, образуя прозрачный вязкий раствор',
        storage: 'Хранить в прохладном, сухом месте, вдали от прямых солнечных лучей',
        shelfLife: '12-18 месяцев (неоткрытая упаковка)'
      }
    };

    return technicalData[lang as keyof typeof technicalData] || technicalData.en;
  }

  // 生成SEO关键词
  generateSEOKeywords(product: ProductContent, lang: string): string {
    const baseKeywords = {
      zh: '羧甲基淀粉,CMS,建筑胶粉,壁纸胶,纺织助剂,涂料添加剂,环保材料',
      en: 'carboxymethyl starch,CMS,building adhesive,wallpaper glue,textile auxiliaries,coating additives,eco-friendly materials',
      ru: 'карбоксиметилкрахмал,КМС,строительный клей,клей для обоев,текстильные вспомогательные вещества,добавки для покрытий,экологичные материалы'
    };

    const categoryKeywords = {
      'wallpaper-adhesive': {
        zh: '壁纸胶粉,墙纸胶,粘贴材料,施工工具',
        en: 'wallpaper adhesive powder,wallpaper glue,bonding materials,construction tools',
        ru: 'порошок клея для обоев,клей для обоев,связующие материалы,строительные инструменты'
      },
      'textile-auxiliary': {
        zh: '纺织印染,经纱上浆,印花助剂,染料固定剂',
        en: 'textile printing,warp sizing,printing auxiliaries,dye fixing agents',
        ru: 'текстильная печать,аппретирование основы,вспомогательные вещества для печати,закрепители красителей'
      },
      'coating-additive': {
        zh: '建筑涂料,腻子粉,增稠剂,流变剂',
        en: 'building coatings,putty powder,thickener,rheology modifier',
        ru: 'строительные покрытия,шпаклевочный порошок,загуститель,реологическая добавка'
      }
    };

    const base = baseKeywords[lang as keyof typeof baseKeywords] || baseKeywords.en;
    const category = categoryKeywords[product.category as keyof typeof categoryKeywords]?.[lang as keyof typeof categoryKeywords['wallpaper-adhesive']] || '';

    return `${base} ${category} ${product.name}`;
  }

  // 生成结构化数据
  generateStructuredData(product: ProductContent, lang: string) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      category: product.category,
      brand: {
        '@type': 'Brand',
        name: 'Hangzhou Karn New Building Materials Co., Ltd'
      },
      manufacturer: {
        '@type': 'Organization',
        name: 'Hangzhou Karn New Building Materials Co., Ltd',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'CN',
          addressRegion: 'Zhejiang',
          addressLocality: 'Hangzhou'
        }
      },
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Hangzhou Karn New Building Materials Co., Ltd'
        }
      },
      additionalProperty: product.specifications,
      keywords: this.generateSEOKeywords(product, lang),
      inLanguage: lang
    };
  }

  // 清除缓存
  clearCache(): void {
    this.contentCache.clear();
  }

  // 获取缓存统计
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.contentCache.size,
      keys: Array.from(this.contentCache.keys())
    };
  }
}

// 导出单例
export const productContentEnhancer = ProductContentEnhancer.getInstance();