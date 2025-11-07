// 本地产品数据库 - 用于应用领域关联的产品展示

export interface ProductSpec {
  label: string;
  value: string;
}

export interface LocalProduct {
  product_code: string;
  name_zh: string;
  name_en: string;
  name_ru: string;
  description_zh: string;
  description_en: string;
  description_ru: string;
  features_zh: string[];
  features_en: string[];
  features_ru: string[];
  specs_zh: ProductSpec[];
  specs_en: ProductSpec[];
  specs_ru: ProductSpec[];
  applications_zh: string;
  applications_en: string;
  applications_ru: string;
  image_url: string;
  category: string;
}

// 产品数据
export const LOCAL_PRODUCTS: Record<string, LocalProduct> = {
  'textile-cms': {
    product_code: 'K6',
    name_zh: '纺织印染专用羧甲基淀粉 K6',
    name_en: 'Carboxymethyl Starch K6 for Textile Printing & Dyeing',
    name_ru: 'Карбоксиметилкрахмал K6 для текстильной печати и крашения',
    
    description_zh: '专为纺织印染行业设计的高性能羧甲基淀粉，具有优异的增稠性能和良好的渗透性，是印花糊料和染色工艺的理想选择。',
    description_en: 'High-performance carboxymethyl starch designed for textile printing and dyeing industry, featuring excellent thickening performance and good penetration, ideal for printing paste and dyeing processes.',
    description_ru: 'Высокопроизводительный карбоксиметилкрахмал, разработанный для текстильной промышленности, с отличными загущающими свойствами и хорошим проникновением, идеально подходит для печатных паст и процессов крашения.',
    
    features_zh: [
      '优异的增稠性能，确保染料均匀分布',
      '良好的渗透性，提高色牢度',
      '印花图案清晰细腻',
      '易于洗涤去除残留',
      '优异的耐盐性和耐碱性',
      '产品质量稳定，批次间差异小'
    ],
    features_en: [
      'Excellent thickening performance ensures uniform dye distribution',
      'Good penetration improves color fastness',
      'Clear and detailed printing patterns',
      'Easy to wash off residues',
      'Excellent salt and alkali resistance',
      'Stable product quality with minimal batch variation'
    ],
    features_ru: [
      'Отличные загущающие свойства обеспечивают равномерное распределение красителя',
      'Хорошее проникновение улучшает светостойкость',
      'Четкие и детальные печатные рисунки',
      'Легко смывается',
      'Отличная устойчивость к солям и щелочам',
      'Стабильное качество продукции с минимальными различиями между партиями'
    ],
    
    specs_zh: [
      { label: '型号', value: 'K6' },
      { label: '形态', value: '片状，5%溶液' },
      { label: '旋转粘度', value: '30,000-38,000 mPa·s（4号转子 / 6 rpm）' },
      { label: '取代度', value: '0.4' },
      { label: 'pH值', value: '8-11' },
      { label: '溶解特性', value: '速溶' },
      { label: '粘度计', value: 'NDJ-8' },
      { label: '外观', value: '片状' }
    ],
    specs_en: [
      { label: 'Model', value: 'K6' },
      { label: 'Form', value: 'Flake, 5% solution' },
      { label: 'Rotational viscosity', value: '30,000-38,000 mPa·s (No.4 rotor / 6 rpm)' },
      { label: 'Degree of substitution', value: '0.4' },
      { label: 'pH value', value: '8-11' },
      { label: 'Solubility', value: 'Instant dissolution' },
      { label: 'Viscometer', value: 'NDJ-8' },
      { label: 'Appearance', value: 'Flake' }
    ],
    specs_ru: [
      { label: 'Модель', value: 'K6' },
      { label: 'Форма', value: 'Хлопья, 5%-ный раствор' },
      { label: 'Вращательная вязкость', value: '30 000-38 000 мПа·с (ротор №4 / 6 об/мин)' },
      { label: 'Степень замещения', value: '0,4' },
      { label: 'Диапазон pH', value: '8-11' },
      { label: 'Растворимость', value: 'Быстрорастворимый' },
      { label: 'Вискозиметр', value: 'NDJ-8' },
      { label: 'Внешний вид', value: 'Хлопья' }
    ],
    
    applications_zh: '广泛应用于纺织品印花糊料、染色工艺增稠、活性染料印染、防染印花工艺等领域。适用于各种纤维材质的印花和染色，包括棉、麻、丝、化纤等。',
    applications_en: 'Widely used in textile printing paste, dyeing process thickening, reactive dye printing, resist printing processes, etc. Suitable for printing and dyeing of various fiber materials including cotton, linen, silk, chemical fibers, etc.',
    applications_ru: 'Широко используется в текстильных печатных пастах, загущении процессов крашения, печати активными красителями, резистной печати и т.д. Подходит для печати и крашения различных волокнистых материалов, включая хлопок, лен, шелк, химические волокна и т.д.',
    
    image_url: '/images/IMG_1412.JPG',
    category: 'textile'
  },
  
  'wallpaper-adhesive': {
    product_code: '999',
    name_zh: '墙纸胶粉专用羧甲基淀粉 999',
    name_en: 'Carboxymethyl Starch 999 for Wallpaper Adhesive',
    name_ru: 'Карбоксиметилкрахмал 999 для обойного клея',
    
    description_zh: '专为墙纸胶粉行业设计的高粘度羧甲基淀粉，粘接强度高，施工性能优异，是专业墙纸胶粉的核心原料。环保健康，防霉抗菌，适合各类墙纸粘贴。',
    description_en: 'High-viscosity carboxymethyl starch designed for wallpaper adhesive powder industry, featuring high bonding strength and excellent workability, the core raw material for professional wallpaper adhesive powder. Eco-friendly, healthy, anti-mold and antibacterial, suitable for all types of wallpaper application.',
    description_ru: 'Высоковязкий карбоксиметилкрахмал, разработанный для производства обойного клея, с высокой прочностью сцепления и отличной удобоукладываемостью, основное сырье для профессионального обойного клея. Экологически чистый, здоровый, противоплесневый и антибактериальный, подходит для всех типов обоев.',
    
    features_zh: [
      '超高粘度65000±10% mPa·s，粘接强度卓越',
      '溶于水后形成均匀稳定的胶液',
      '良好的初粘性和最终粘接力',
      '施工时易于调整，干燥后粘接牢固',
      '防霉抗菌性能优异',
      '环保健康，不含甲醛',
      '提供200g、500g、1kg等多种规格OEM服务'
    ],
    features_en: [
      'Ultra-high viscosity 65,000±10% mPa·s, excellent bonding strength',
      'Forms uniform and stable adhesive solution when dissolved in water',
      'Good initial tack and final bonding strength',
      'Easy to adjust during construction, firmly bonded after drying',
      'Excellent anti-mold and antibacterial properties',
      'Eco-friendly and healthy, formaldehyde-free',
      'OEM services available in 200g, 500g, 1kg and other specifications'
    ],
    features_ru: [
      'Сверхвысокая вязкость 65 000±10% мПа·с, отличная прочность сцепления',
      'Образует однородный и стабильный клеевой раствор при растворении в воде',
      'Хорошая начальная липкость и окончательная прочность сцепления',
      'Легко регулируется во время нанесения, прочно склеивается после высыхания',
      'Отличные противоплесневые и антибактериальные свойства',
      'Экологически чистый и здоровый, без формальдегида',
      'Услуги OEM доступны в упаковках 200г, 500г, 1кг и других спецификациях'
    ],
    
    specs_zh: [
      { label: '型号', value: '999' },
      { label: '溶液浓度', value: '5%' },
      { label: '粘度计', value: 'NDJ-8型旋转粘度计' },
      { label: '测试条件', value: '4号转子，6转/分' },
      { label: '粘度范围', value: '65,000±10% mPa·s' },
      { label: '外观', value: '片状' },
      { label: '溶解特性', value: '易溶于水' }
    ],
    specs_en: [
      { label: 'Model', value: '999' },
      { label: 'Solution concentration', value: '5%' },
      { label: 'Viscometer', value: 'NDJ-8 Rotational Viscometer' },
      { label: 'Test conditions', value: 'No.4 rotor, 6 rpm' },
      { label: 'Viscosity range', value: '65,000±10% mPa·s' },
      { label: 'Appearance', value: 'Flake' },
      { label: 'Solubility', value: 'Easily soluble in water' }
    ],
    specs_ru: [
      { label: 'Модель', value: '999' },
      { label: 'Концентрация раствора', value: '5%' },
      { label: 'Вискозиметр', value: 'Ротационный вискозиметр NDJ-8' },
      { label: 'Условия испытания', value: 'Ротор №4, 6 об/мин' },
      { label: 'Диапазон вязкости', value: '65 000±10% мПа·с' },
      { label: 'Внешний вид', value: 'Хлопья' },
      { label: 'Растворимость', value: 'Легко растворяется в воде' }
    ],
    
    applications_zh: '专用于墙纸胶粉生产、壁纸粘贴剂、高端壁纸专用胶、防霉墙纸胶等领域。适合各种材质墙纸的粘贴，包括纯纸、无纺布、PVC、纤维壁纸等。提供专业的OEM定制服务，可根据客户需求调整粘度、取代度等参数。',
    applications_en: 'Specially designed for wallpaper adhesive powder production, wall covering paste, premium wallpaper adhesive, anti-mold wallpaper glue, etc. Suitable for adhesion of various wallpaper materials including pure paper, non-woven fabric, PVC, fiber wallpaper, etc. Professional OEM customization services available, can adjust viscosity, degree of substitution and other parameters according to customer needs.',
    applications_ru: 'Специально разработан для производства обойного клея, клея для настенных покрытий, клея для премиальных обоев, противоплесневого обойного клея и т.д. Подходит для приклеивания различных материалов обоев, включая чистую бумагу, нетканые материалы, ПВХ, волокнистые обои и т.д. Доступны профессиональные услуги OEM-настройки, можно регулировать вязкость, степень замещения и другие параметры в соответствии с потребностями клиента.',
    
    image_url: '/images/IMG_1412.JPG',
    category: 'wallpaper'
  },
  
  'construction-cms': {
    product_code: '8840',
    name_zh: '建筑材料专用羧甲基淀粉 8840',
    name_en: 'Carboxymethyl Starch 8840 for Construction Materials',
    name_ru: 'Карбоксиметилкрахмал 8840 для строительных материалов',
    
    description_zh: '专为建筑材料行业设计的羧甲基淀粉，主要用于腻子粉、石膏基材料等产品。具有优异的保水性和粘结性能，能够显著改善建筑材料的施工性能和最终质量，防止开裂和粉化。',
    description_en: 'Carboxymethyl starch designed for construction materials industry, mainly used in putty powder, gypsum-based materials and other products. Features excellent water retention and bonding properties, significantly improving construction material workability and final quality, preventing cracking and powdering.',
    description_ru: 'Карбоксиметилкрахмал, разработанный для строительной индустрии, в основном используется в шпаклевке, гипсовых материалах и других продуктах. Обладает отличными водоудерживающими и связующими свойствами, значительно улучшая удобоукладываемость и конечное качество строительных материалов, предотвращая растрескивание и порошение.',
    
    features_zh: [
      '优异的保水性能，延缓水分蒸发',
      '提高腻子与基层的粘结强度',
      '防止开裂和粉化',
      '改善石膏浆料的流动性和施工性',
      '提升耐水性和抗裂性',
      '与水泥、石膏、灰钙等建材相容性好',
      '符合建材行业标准'
    ],
    features_en: [
      'Excellent water retention, delays water evaporation',
      'Improves bonding strength between putty and substrate',
      'Prevents cracking and powdering',
      'Improves gypsum slurry fluidity and workability',
      'Enhances water resistance and crack resistance',
      'Good compatibility with cement, gypsum, lime calcium and other building materials',
      'Meets construction industry standards'
    ],
    features_ru: [
      'Отличные водоудерживающие свойства, замедляет испарение воды',
      'Улучшает прочность сцепления между шпаклевкой и основанием',
      'Предотвращает растрескивание и порошение',
      'Улучшает текучесть и удобоукладываемость гипсовой смеси',
      'Повышает водостойкость и устойчивость к трещинам',
      'Хорошая совместимость с цементом, гипсом, известковым кальцием и другими строительными материалами',
      'Соответствует стандартам строительной индустрии'
    ],
    
    specs_zh: [
      { label: '型号', value: '8840' },
      { label: '溶液浓度', value: '5%' },
      { label: '粘度计', value: '旋转粘度计' },
      { label: '测试条件', value: '4号转子，12转/分' },
      { label: '粘度范围', value: '25,000±10% mPa·s' },
      { label: 'pH值', value: '9-11' },
      { label: '外观', value: '片状' }
    ],
    specs_en: [
      { label: 'Model', value: '8840' },
      { label: 'Solution concentration', value: '5%' },
      { label: 'Viscometer', value: 'Rotational Viscometer' },
      { label: 'Test conditions', value: 'No.4 rotor, 12 rpm' },
      { label: 'Viscosity range', value: '25,000±10% mPa·s' },
      { label: 'pH value', value: '9-11' },
      { label: 'Appearance', value: 'Flake' }
    ],
    specs_ru: [
      { label: 'Модель', value: '8840' },
      { label: 'Концентрация раствора', value: '5%' },
      { label: 'Вискозиметр', value: 'Ротационный вискозиметр' },
      { label: 'Условия испытания', value: 'Ротор №4, 12 об/мин' },
      { label: 'Диапазон вязкости', value: '25 000±10% мПа·с' },
      { label: 'Диапазон pH', value: '9-11' },
      { label: 'Внешний вид', value: 'Хлопья' }
    ],
    
    applications_zh: '广泛应用于内墙腻子粉、石膏基材料、墙面找平材料、装饰石膏制品等领域。作为保水剂和粘结剂，确保建筑材料在施工过程中保持适当湿度，防止因失水过快导致的开裂。提高建筑材料的施工性能和最终强度。',
    applications_en: 'Widely used in interior wall putty powder, gypsum-based materials, wall leveling materials, decorative gypsum products, etc. As a water retention agent and binder, ensures construction materials maintain appropriate moisture during construction, preventing cracking due to rapid water loss. Improves construction material workability and final strength.',
    applications_ru: 'Широко используется в шпаклевке для внутренних стен, гипсовых материалах, материалах для выравнивания стен, декоративных гипсовых изделиях и т.д. В качестве водоудерживающего агента и связующего обеспечивает сохранение соответствующей влажности строительных материалов во время строительства, предотвращая растрескивание из-за быстрой потери воды. Улучшает удобоукладываемость и конечную прочность строительных материалов.',
    
    image_url: '/images/IMG_1412.JPG',
    category: 'construction'
  },
  
  'coating-cms': {
    product_code: 'K6',
    name_zh: '水性涂料专用羧甲基淀粉 K6',
    name_en: 'Carboxymethyl Starch K6 for Water-Based Coatings',
    name_ru: 'Карбоксиметилкрахмал K6 для водных красок',
    
    description_zh: '专为水性涂料工业设计的增稠剂和流变改性剂，能够显著改善涂料的性能和施工效果。提供优异的增稠效果，改善涂料流变性能，使涂料具有良好的触变性和流平性。',
    description_en: 'Thickener and rheology modifier designed for water-based coatings industry, significantly improving coating performance and application effects. Provides excellent thickening effects, improves coating rheological properties, giving coatings good thixotropy and leveling.',
    description_ru: 'Загуститель и модификатор реологии, разработанный для индустрии водных покрытий, значительно улучшает характеристики покрытий и эффекты нанесения. Обеспечивает отличный загущающий эффект, улучшает реологические свойства покрытий, придавая покрытиям хорошую тиксотропию и растекание.',
    
    features_zh: [
      '优异的增稠效果，改善流变性能',
      '良好的触变性和流平性',
      '施工时不易流挂，涂刷流畅',
      '提高涂料稳定性，防止颜料沉淀',
      '延长涂料储存期',
      '与各种水性树脂、颜料、填料相容性好',
      '天然环保，无毒无害'
    ],
    features_en: [
      'Excellent thickening effect, improves rheological properties',
      'Good thixotropy and leveling',
      'No sagging during application, smooth brushing',
      'Enhances coating stability, prevents pigment sedimentation',
      'Extends coating storage life',
      'Good compatibility with various water-based resins, pigments, fillers',
      'Natural, environmentally friendly, non-toxic and harmless'
    ],
    features_ru: [
      'Отличный загущающий эффект, улучшает реологические свойства',
      'Хорошая тиксотропия и растекание',
      'Не провисает при нанесении, гладкое нанесение кистью',
      'Повышает стабильность покрытия, предотвращает осаждение пигмента',
      'Продлевает срок хранения покрытия',
      'Хорошая совместимость с различными водными смолами, пигментами, наполнителями',
      'Натуральный, экологически чистый, нетоксичный и безвредный'
    ],
    
    specs_zh: [
      { label: '型号', value: 'K6' },
      { label: '形态', value: '片状，5%溶液' },
      { label: '旋转粘度', value: '30,000-38,000 mPa·s（4号转子 / 6 rpm）' },
      { label: '取代度', value: '0.4' },
      { label: 'pH值', value: '8-11' },
      { label: '溶解特性', value: '速溶' },
      { label: '粘度计', value: 'NDJ-8' },
      { label: '外观', value: '片状' }
    ],
    specs_en: [
      { label: 'Model', value: 'K6' },
      { label: 'Form', value: 'Flake, 5% solution' },
      { label: 'Rotational viscosity', value: '30,000-38,000 mPa·s (No.4 rotor / 6 rpm)' },
      { label: 'Degree of substitution', value: '0.4' },
      { label: 'pH value', value: '8-11' },
      { label: 'Solubility', value: 'Instant dissolution' },
      { label: 'Viscometer', value: 'NDJ-8' },
      { label: 'Appearance', value: 'Flake' }
    ],
    specs_ru: [
      { label: 'Модель', value: 'K6' },
      { label: 'Форма', value: 'Хлопья, 5%-ный раствор' },
      { label: 'Вращательная вязкость', value: '30 000-38 000 мПа·с (ротор №4 / 6 об/мин)' },
      { label: 'Степень замещения', value: '0,4' },
      { label: 'Диапазон pH', value: '8-11' },
      { label: 'Растворимость', value: 'Быстрорастворимый' },
      { label: 'Вискозиметр', value: 'NDJ-8' },
      { label: 'Внешний вид', value: 'Хлопья' }
    ],
    
    applications_zh: '广泛应用于水性乳胶漆、建筑涂料、内外墙涂料、水性木器漆等领域。适用于各种涂料体系，能够改善涂料的流变性能，使涂料具有良好的触变性和流平性。在施工时不易流挂，涂刷流畅，干燥后漆膜平整光滑。',
    applications_en: 'Widely used in water-based emulsion paints, architectural coatings, interior and exterior wall coatings, water-based wood coatings, etc. Suitable for various coating systems, improves coating rheological properties, giving coatings good thixotropy and leveling. No sagging during application, smooth brushing, flat and smooth paint film after drying.',
    applications_ru: 'Широко используется в водоэмульсионных красках, архитектурных покрытиях, красках для внутренних и наружных стен, водных красках для дерева и т.д. Подходит для различных систем покрытий, улучшает реологические свойства покрытий, придавая покрытиям хорошую тиксотропию и растекание. Не провисает при нанесении, гладкое нанесение кистью, плоская и гладкая пленка краски после высыхания.',
    
    image_url: '/images/IMG_1412.JPG',
    category: 'coating'
  },
  
  'desiccant-gel': {
    product_code: '8820-2',
    name_zh: '干燥剂凝胶锁水专用羧甲基淀粉 8820-2',
    name_en: 'Carboxymethyl Starch 8820-2 for Desiccant Gel Water-Locking',
    name_ru: 'Карбоксиметилкрахмал 8820-2 для осушающего геля',
    
    description_zh: '专为氯化钙干燥剂设计的凝胶锁水材料，由玉米淀粉改性而成。与氯化钙复配使用，能够将吸收的水分锁定成稳定的凝胶状态，防止液体泄漏，显著提升干燥剂的使用性能和安全性。',
    description_en: 'Gel water-locking material specially designed for calcium chloride desiccants, modified from corn starch. When combined with calcium chloride, it locks absorbed moisture into a stable gel state, preventing liquid leakage, significantly improving desiccant performance and safety.',
    description_ru: 'Гелевый водоудерживающий материал, специально разработанный для осушителей хлорида кальция, модифицированный из кукурузного крахмала. При сочетании с хлоридом кальция блокирует поглощенную влагу в стабильном гелевом состоянии, предотвращая утечку жидкости, значительно улучшая производительность и безопасность осушителя.',
    
    features_zh: [
      '优异的凝胶锁水性能，防止液体泄漏',
      '饱和吸附量可达250-300%，吸湿能力强',
      '由优质玉米淀粉改性而成，天然环保',
      '与氯化钙复配比例35:65，配方科学',
      '凝胶状态稳定持久，即使在高湿环境下也不液化',
      '使用安全可靠，对人体和环境无害',
      '广泛应用于家用、工业和集装箱干燥剂'
    ],
    features_en: [
      'Excellent gel water-locking performance, prevents liquid leakage',
      'Saturated absorption capacity up to 250-300%, strong moisture absorption',
      'Modified from high-quality corn starch, natural and eco-friendly',
      'Scientifically formulated with 35:65 ratio with calcium chloride',
      'Stable and long-lasting gel state, no liquefaction even in high humidity',
      'Safe and reliable use, harmless to humans and environment',
      'Widely used in household, industrial and container desiccants'
    ],
    features_ru: [
      'Отличная гелевая водоудерживающая способность, предотвращает утечку жидкости',
      'Насыщенная адсорбционная способность до 250-300%, сильное влагопоглощение',
      'Модифицирован из высококачественного кукурузного крахмала, натуральный и экологически чистый',
      'Научно разработанная формула с соотношением 35:65 с хлоридом кальция',
      'Стабильное и долговечное гелевое состояние, не сжижается даже при высокой влажности',
      'Безопасное и надежное использование, безвредно для людей и окружающей среды',
      'Широко используется в бытовых, промышленных и контейнерных осушителях'
    ],
    
    specs_zh: [
      { label: '型号', value: '8820-2' },
      { label: '原料', value: '玉米淀粉改性' },
      { label: '配方组成', value: '35% 羧甲基淀粉 + 65% 氯化钙' },
      { label: '饱和吸附量', value: '250-300%' },
      { label: '凝胶形态', value: '稳定凝胶状' },
      { label: '使用特性', value: '防止液化泄漏' },
      { label: '安全性', value: '无毒无害，环保安全' }
    ],
    specs_en: [
      { label: 'Model', value: '8820-2' },
      { label: 'Raw material', value: 'Modified corn starch' },
      { label: 'Formula composition', value: '35% CMS + 65% Calcium chloride' },
      { label: 'Saturated absorption', value: '250-300%' },
      { label: 'Gel form', value: 'Stable gel state' },
      { label: 'Usage characteristics', value: 'Prevents liquefaction and leakage' },
      { label: 'Safety', value: 'Non-toxic, harmless, eco-friendly' }
    ],
    specs_ru: [
      { label: 'Модель', value: '8820-2' },
      { label: 'Сырье', value: 'Модифицированный кукурузный крахмал' },
      { label: 'Состав формулы', value: '35% CMS + 65% хлорид кальция' },
      { label: 'Насыщенная адсорбция', value: '250-300%' },
      { label: 'Форма геля', value: 'Стабильное гелевое состояние' },
      { label: 'Характеристики использования', value: 'Предотвращает сжижение и утечку' },
      { label: 'Безопасность', value: 'Нетоксичный, безвредный, экологически чистый' }
    ],
    
    applications_zh: '专用于氯化钙干燥剂、除湿凝胶产品、防潮干燥剂、工业除湿材料等领域。作为凝胶锁水材料，将氯化钙吸收的水分转化为稳定的凝胶，既保持优异的吸湿性能，又避免液体泄漏问题。广泛应用于家用除湿盒、衣柜干燥剂、集装箱干燥剂、电子产品防潮等场景。',
    applications_en: 'Specially designed for calcium chloride desiccants, moisture absorption gel products, moisture-proof desiccants, industrial dehumidifying materials, etc. As a gel water-locking material, it converts moisture absorbed by calcium chloride into stable gel, maintaining excellent moisture absorption while avoiding liquid leakage. Widely used in household dehumidifier boxes, wardrobe desiccants, container desiccants, electronic product moisture protection, etc.',
    applications_ru: 'Специально разработан для осушителей хлорида кальция, влагопоглощающих гелевых продуктов, влагозащитных осушителей, промышленных осушающих материалов и т.д. В качестве гелевого водоудерживающего материала преобразует влагу, поглощенную хлоридом кальция, в стабильный гель, сохраняя отличное влагопоглощение, избегая утечки жидкости. Широко используется в бытовых осушительных коробках, осушителях для шкафов, контейнерных осушителях, защите электронных изделий от влаги и т.д.',
    
    image_url: '/images/IMG_1412.JPG',
    category: 'desiccant'
  },
  
  'paper-dyeing-cms': {
    product_code: '8810',
    name_zh: '造纸工业专用羧甲基淀粉 8810',
    name_en: 'Carboxymethyl Starch 8810 for Paper Industry',
    name_ru: 'Карбоксиметилкрахмал 8810 для бумажной промышленности',
    
    description_zh: '专为造纸工业设计的羧甲基淀粉，主要用于纸品表面施胶、增强剂和染色助剂。具有优异的成膜性、粘合性和渗透性，能够显著提高纸张强度、平滑度和染色均匀性，是造纸工业的理想助剂。',
    description_en: 'Carboxymethyl starch designed for paper industry, mainly used in paper surface sizing, strengthening agent and dyeing auxiliary. Features excellent film-forming, adhesion and penetration properties, significantly improving paper strength, smoothness and dyeing uniformity, an ideal auxiliary for paper industry.',
    description_ru: 'Карбоксиметилкрахмал, разработанный для бумажной промышленности, в основном используется в поверхностной проклейке бумаги, укрепляющем агенте и вспомогательном веществе для крашения. Обладает отличными пленкообразующими, адгезионными и проникающими свойствами, значительно улучшая прочность, гладкость и равномерность окрашивания бумаги, идеальное вспомогательное вещество для бумажной промышленности.',
    
    features_zh: [
      '优异的成膜性能，提高纸张表面强度',
      '良好的粘合性，增强纤维间结合力',
      '优秀的渗透性能，改善染色均匀度',
      '提高纸张的平滑度和光泽度',
      '增强纸张的挺度和耐折度',
      '改善纸张的印刷适性',
      '天然环保，符合食品级包装纸标准'
    ],
    features_en: [
      'Excellent film-forming properties, improves paper surface strength',
      'Good adhesion, enhances fiber bonding',
      'Excellent penetration performance, improves dyeing uniformity',
      'Improves paper smoothness and glossiness',
      'Enhances paper stiffness and folding resistance',
      'Improves paper printability',
      'Natural and eco-friendly, meets food-grade packaging paper standards'
    ],
    features_ru: [
      'Отличные пленкообразующие свойства, улучшает прочность поверхности бумаги',
      'Хорошая адгезия, усиливает связь между волокнами',
      'Отличные проникающие свойства, улучшает равномерность окрашивания',
      'Улучшает гладкость и глянец бумаги',
      'Повышает жесткость и устойчивость к складыванию бумаги',
      'Улучшает печатные свойства бумаги',
      'Натуральный и экологически чистый, соответствует стандартам упаковочной бумаги пищевого класса'
    ],
    
    specs_zh: [
      { label: '型号', value: '8810' },
      { label: '溶液浓度', value: '5%' },
      { label: '粘度计', value: '旋转粘度计' },
      { label: '测试条件', value: '4号转子，12转/分' },
      { label: '粘度范围', value: '15,000±10% mPa·s' },
      { label: 'pH值', value: '9-11' },
      { label: '外观', value: '片状' }
    ],
    specs_en: [
      { label: 'Model', value: '8810' },
      { label: 'Solution concentration', value: '5%' },
      { label: 'Viscometer', value: 'Rotational Viscometer' },
      { label: 'Test conditions', value: 'No.4 rotor, 12 rpm' },
      { label: 'Viscosity range', value: '15,000±10% mPa·s' },
      { label: 'pH value', value: '9-11' },
      { label: 'Appearance', value: 'Flake' }
    ],
    specs_ru: [
      { label: 'Модель', value: '8810' },
      { label: 'Концентрация раствора', value: '5%' },
      { label: 'Вискозиметр', value: 'Ротационный вискозиметр' },
      { label: 'Условия испытания', value: 'Ротор №4, 12 об/мин' },
      { label: 'Диапазон вязкости', value: '15 000±10% мПа·с' },
      { label: 'Диапазон pH', value: '9-11' },
      { label: 'Внешний вид', value: 'Хлопья' }
    ],
    
    applications_zh: '广泛应用于纸品表面施胶、纸张增强剂、纸品染色助剂、纸品涂层剂等领域。作为表面施胶剂，能够显著提高纸张的表面强度和印刷适性；作为增强剂，增强纸张的挺度和耐折度；作为染色助剂，改善纸品染色的均匀性和色牢度。适用于工艺纸品、包装纸、装饰纸、特种纸等各类纸品生产。',
    applications_en: 'Widely used in paper surface sizing, paper strengthening agent, paper dyeing auxiliary, paper coating agent, etc. As a surface sizing agent, significantly improves paper surface strength and printability; as a strengthening agent, enhances paper stiffness and folding resistance; as a dyeing auxiliary, improves dyeing uniformity and color fastness of paper products. Suitable for production of various paper products including craft paper, packaging paper, decorative paper, specialty paper, etc.',
    applications_ru: 'Широко используется в поверхностной проклейке бумаги, укрепляющем агенте для бумаги, вспомогательном веществе для крашения бумаги, покрывающем агенте для бумаги и т.д. В качестве агента для поверхностной проклейки значительно улучшает прочность поверхности и печатные свойства бумаги; в качестве укрепляющего агента повышает жесткость и устойчивость к складыванию бумаги; в качестве вспомогательного вещества для крашения улучшает равномерность окрашивания и стойкость цвета бумажных изделий. Подходит для производства различных бумажных изделий, включая крафт-бумагу, упаковочную бумагу, декоративную бумагу, специальную бумагу и т.д.',
    
    image_url: '/images/IMG_1412.JPG',
    category: 'paper'
  }
};

// 检查是否为本地产品
export function isLocalProduct(productCode: string): boolean {
  return productCode in LOCAL_PRODUCTS;
}

// 获取本地产品数据
export function getLocalProduct(productCode: string): LocalProduct | null {
  return LOCAL_PRODUCTS[productCode] || null;
}



