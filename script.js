// Language switching functionality
const translations = {
    zh: {
        // Navigation
        "卡恩建材": "卡恩建材",
        "首页": "首页",
        "产品": "产品",
        "关于我们": "关于我们",
        "联系我们": "联系我们",
        
        // Home page
        "专业墙纸胶粉出口供应商": "专业墙纸胶粉出口供应商",
        "专注环保墙纸胶粉生产，服务全球客户": "专注环保墙纸胶粉生产，服务全球客户",
        "立即咨询": "立即咨询",
        
        // Product advantages
        "产品优势": "产品优势",
        "环保无毒": "环保无毒",
        "采用天然植物原料，通过国际环保认证": "采用天然植物原料，通过国际环保认证",
        "超强粘性": "超强粘性",
        "专业配方，确保墙纸粘贴牢固持久": "专业配方，确保墙纸粘贴牢固持久",
        "OEM定制": "OEM定制",
        "提供小包装OEM服务，满足个性化需求": "提供小包装OEM服务，满足个性化需求",
        
        // Applications
        "适用范围": "适用范围",
        "家庭装修": "家庭装修",
        "商业工程": "商业工程",
        "酒店工程": "酒店工程",
        
        // Product page
        "我们的产品": "我们的产品",
        "高品质墙纸胶粉，满足您的各种需求": "高品质墙纸胶粉，满足您的各种需求",
        "墙纸胶粉原料": "墙纸胶粉原料",
        "100%天然植物淀粉，环保无毒": "100%天然植物淀粉，环保无毒",
        "高粘度配方，适用于各种墙纸类型": "高粘度配方，适用于各种墙纸类型",
        "易溶解，施工方便，无异味": "易溶解，施工方便，无异味",
        "通过欧盟CE认证和ISO质量体系认证": "通过欧盟CE认证和ISO质量体系认证",
        
        // OEM services
        "小包装OEM服务": "小包装OEM服务",
        "定制包装": "定制包装",
        "提供各种规格的小包装定制，从50g到1kg": "提供各种规格的小包装定制，从50g到1kg",
        "贴牌生产": "贴牌生产",
        "支持客户品牌贴牌，快速响应市场需求": "支持客户品牌贴牌，快速响应市场需求",
        "快速交货": "快速交货",
        "小批量订单7-15天交货，满足紧急需求": "小批量订单7-15天交货，满足紧急需求",
        
        // Application scenarios
        "适用场景": "适用场景",
        "家庭住宅": "家庭住宅",
        "适用于客厅、卧室、书房等各种家庭空间墙纸粘贴": "适用于客厅、卧室、书房等各种家庭空间墙纸粘贴",
        "商业办公": "商业办公",
        "适用于写字楼、办公室、会议室等商业空间装修": "适用于写字楼、办公室、会议室等商业空间装修",
        "酒店工程": "酒店工程",
        "特别适用于酒店客房、大堂、走廊等大面积墙纸工程": "特别适用于酒店客房、大堂、走廊等大面积墙纸工程",
        "零售店铺": "零售店铺",
        "适用于商场、专卖店、餐厅等零售商业空间装修": "适用于商场、专卖店、餐厅等零售商业空间装修",
        
        // About page
        "关于我们": "关于我们",
        "专业建材制造商，专注出口服务": "专业建材制造商，专注出口服务",
        "公司介绍": "公司介绍",
        "杭州卡恩新型建材有限公司成立于2010年，是一家专业从事墙纸胶粉研发、生产和销售的企业。我们位于浙江省杭州市，拥有现代化的生产基地和先进的生产设备。": "杭州卡恩新型建材有限公司成立于2010年，是一家专业从事墙纸胶粉研发、生产和销售的企业。我们位于浙江省杭州市，拥有现代化的生产基地和先进的生产设备。",
        "十多年来，我们始终坚持\"质量第一，客户至上\"的经营理念，产品远销欧洲、东南亚、中东、非洲等30多个国家和地区，赢得了国内外客户的广泛赞誉。": "十多年来，我们始终坚持\"质量第一，客户至上\"的经营理念，产品远销欧洲、东南亚、中东、非洲等30多个国家和地区，赢得了国内外客户的广泛赞誉。",
        
        // Factory
        "工厂展示": "工厂展示",
        "生产车间": "生产车间",
        "配备先进生产线，年产能达到5000吨": "配备先进生产线，年产能达到5000吨",
        "质检中心": "质检中心",
        "严格的质量控制体系，确保每批产品符合国际标准": "严格的质量控制体系，确保每批产品符合国际标准",
        "研发实验室": "研发实验室",
        "专业研发团队，持续创新产品配方和工艺": "专业研发团队，持续创新产品配方和工艺",
        
        // Brand history
        "品牌历程": "品牌历程",
        "公司成立": "公司成立",
        "杭州卡恩新型建材有限公司正式成立": "杭州卡恩新型建材有限公司正式成立",
        "首次出口": "首次出口",
        "产品首次出口到东南亚市场": "产品首次出口到东南亚市场",
        "产能扩张": "产能扩张",
        "生产规模扩大，年产能提升至3000吨": "生产规模扩大，年产能提升至3000吨",
        "全球认证": "全球认证",
        "通过欧盟CE认证、ISO9001质量管理体系认证": "通过欧盟CE认证、ISO9001质量管理体系认证",
        "市场拓展": "市场拓展",
        "产品出口至30+国家，建立全球销售网络": "产品出口至30+国家，建立全球销售网络",
        
        // Export experience
        "出口经验": "出口经验",
        "出口国家": "出口国家",
        "年出口吨数": "年出口吨数",
        "海外客户": "海外客户",
        "出口年限": "出口年限",
        "资质认证": "资质认证",
        "欧盟CE认证": "欧盟CE认证",
        "ISO9001认证": "ISO9001认证",
        "SGS认证": "SGS认证",
        
        // Contact page
        "联系我们": "联系我们",
        "随时为您提供专业的墙纸胶粉解决方案": "随时为您提供专业的墙纸胶粉解决方案",
        "WhatsApp": "WhatsApp",
        "立即联系": "立即联系",
        "邮箱": "邮箱",
        "发送邮件": "发送邮件",
        "微信": "微信",
        "扫描二维码添加": "扫描二维码添加",
        
        // Form
        "快速询盘": "快速询盘",
        "您的姓名": "您的姓名",
        "邮箱地址": "邮箱地址",
        "联系电话": "联系电话",
        "国家/地区": "国家/地区",
        "需求数量": "需求数量",
        "详细需求": "详细需求",
        "发送询盘": "发送询盘",
        
        // Location
        "公司地址": "公司地址",
        "杭州卡恩新型建材有限公司": "杭州卡恩新型建材有限公司",
        "地址：浙江省杭州市萧山区经济技术开发区": "地址：浙江省杭州市萧山区经济技术开发区",
        "邮编：311200": "邮编：311200",
        "工作时间": "工作时间",
        "周一至周五 8:30-17:30 (GMT+8)": "周一至周五 8:30-17:30 (GMT+8)",
        "地图位置（占位图）": "地图位置（占位图）",
        
        // Footer
        "地址：浙江省杭州市": "地址：浙江省杭州市",
        "© 2025 杭州卡恩新型建材有限公司. 版权所有.": "© 2025 杭州卡恩新型建材有限公司. 版权所有."
    },
    en: {
        // Navigation
        "卡恩建材": "Karn Materials",
        "首页": "Home",
        "产品": "Products",
        "关于我们": "About Us",
        "联系我们": "Contact",
        
        // Home page
        "专业墙纸胶粉出口供应商": "Professional Wallpaper Adhesive Powder Export Supplier",
        "专注环保墙纸胶粉生产，服务全球客户": "Focusing on eco-friendly wallpaper adhesive powder production, serving global customers",
        "立即咨询": "Contact Now",
        
        // Product advantages
        "产品优势": "Product Advantages",
        "环保无毒": "Eco-friendly & Non-toxic",
        "采用天然植物原料，通过国际环保认证": "Using natural plant-based raw materials, certified by international environmental standards",
        "超强粘性": "Superior Adhesion",
        "专业配方，确保墙纸粘贴牢固持久": "Professional formula ensures strong and lasting wallpaper adhesion",
        "OEM定制": "OEM Customization",
        "提供小包装OEM服务，满足个性化需求": "Providing small packaging OEM services to meet personalized needs",
        
        // Applications
        "适用范围": "Application Scope",
        "家庭装修": "Home Decoration",
        "商业工程": "Commercial Projects",
        "酒店工程": "Hotel Projects",
        
        // Product page
        "我们的产品": "Our Products",
        "高品质墙纸胶粉，满足您的各种需求": "High-quality wallpaper adhesive powder to meet your various needs",
        "墙纸胶粉原料": "Wallpaper Adhesive Powder Raw Materials",
        "100%天然植物淀粉，环保无毒": "100% natural plant starch, eco-friendly and non-toxic",
        "高粘度配方，适用于各种墙纸类型": "High viscosity formula, suitable for all types of wallpaper",
        "易溶解，施工方便，无异味": "Easy to dissolve, convenient construction, no odor",
        "通过欧盟CE认证和ISO质量体系认证": "Certified by EU CE and ISO quality system",
        
        // OEM services
        "小包装OEM服务": "Small Packaging OEM Services",
        "定制包装": "Custom Packaging",
        "提供各种规格的小包装定制，从50g到1kg": "Provide various specifications of small packaging customization, from 50g to 1kg",
        "贴牌生产": "Private Label",
        "支持客户品牌贴牌，快速响应市场需求": "Support customer brand labeling, quick response to market demand",
        "快速交货": "Fast Delivery",
        "小批量订单7-15天交货，满足紧急需求": "Small batch orders delivered in 7-15 days, meeting urgent needs",
        
        // Application scenarios
        "适用场景": "Application Scenarios",
        "家庭住宅": "Residential Use",
        "适用于客厅、卧室、书房等各种家庭空间墙纸粘贴": "Suitable for wallpaper application in living rooms, bedrooms, studies and other home spaces",
        "商业办公": "Commercial Offices",
        "适用于写字楼、办公室、会议室等商业空间装修": "Suitable for decoration of commercial spaces such as office buildings, offices, meeting rooms",
        "酒店工程": "Hotel Projects",
        "特别适用于酒店客房、大堂、走廊等大面积墙纸工程": "Especially suitable for large-area wallpaper projects in hotel rooms, lobbies, corridors",
        "零售店铺": "Retail Stores",
        "适用于商场、专卖店、餐厅等零售商业空间装修": "Suitable for decoration of retail commercial spaces such as shopping malls, specialty stores, restaurants",
        
        // About page
        "关于我们": "About Us",
        "专业建材制造商，专注出口服务": "Professional building materials manufacturer, focused on export services",
        "公司介绍": "Company Introduction",
        "杭州卡恩新型建材有限公司成立于2010年，是一家专业从事墙纸胶粉研发、生产和销售的企业。我们位于浙江省杭州市，拥有现代化的生产基地和先进的生产设备。": "Karn New Building Materials Co., Ltd. was established in 2010. We are a professional enterprise engaged in the research, development, production and sales of wallpaper adhesive powder. We are located in Hangzhou, Zhejiang Province, with modern production facilities and advanced equipment.",
        "十多年来，我们始终坚持\"质量第一，客户至上\"的经营理念，产品远销欧洲、东南亚、中东、非洲等30多个国家和地区，赢得了国内外客户的广泛赞誉。": "For more than ten years, we have always adhered to the business philosophy of 'quality first, customer first'. Our products are exported to more than 30 countries and regions including Europe, Southeast Asia, the Middle East, and Africa, winning wide acclaim from domestic and foreign customers.",
        
        // Factory
        "工厂展示": "Factory Showcase",
        "生产车间": "Production Workshop",
        "配备先进生产线，年产能达到5000吨": "Equipped with advanced production lines, annual capacity reaches 5,000 tons",
        "质检中心": "Quality Control Center",
        "严格的质量控制体系，确保每批产品符合国际标准": "Strict quality control system ensures each batch meets international standards",
        "研发实验室": "Research Laboratory",
        "专业研发团队，持续创新产品配方和工艺": "Professional R&D team, continuously innovating product formulas and processes",
        
        // Brand history
        "品牌历程": "Brand History",
        "公司成立": "Company Established",
        "杭州卡恩新型建材有限公司正式成立": "Karn New Building Materials Co., Ltd. officially established",
        "首次出口": "First Export",
        "产品首次出口到东南亚市场": "First export to Southeast Asian markets",
        "产能扩张": "Capacity Expansion",
        "生产规模扩大，年产能提升至3000吨": "Production scale expanded, annual capacity increased to 3,000 tons",
        "全球认证": "Global Certification",
        "通过欧盟CE认证、ISO9001质量管理体系认证": "Obtained EU CE certification and ISO9001 quality management system certification",
        "市场拓展": "Market Expansion",
        "产品出口至30+国家，建立全球销售网络": "Products exported to 30+ countries, established global sales network",
        
        // Export experience
        "出口经验": "Export Experience",
        "出口国家": "Export Countries",
        "年出口吨数": "Annual Export Tons",
        "海外客户": "Overseas Clients",
        "出口年限": "Export Years",
        "资质认证": "Certificates",
        "欧盟CE认证": "EU CE Certificate",
        "ISO9001认证": "ISO9001 Certificate",
        "SGS认证": "SGS Certificate",
        
        // Contact page
        "联系我们": "Contact Us",
        "随时为您提供专业的墙纸胶粉解决方案": "Always providing professional wallpaper adhesive powder solutions",
        "WhatsApp": "WhatsApp",
        "立即联系": "Contact Now",
        "邮箱": "Email",
        "发送邮件": "Send Email",
        "微信": "WeChat",
        "扫描二维码添加": "Scan QR code to add",
        
        // Form
        "快速询盘": "Quick Inquiry",
        "您的姓名": "Your Name",
        "邮箱地址": "Email Address",
        "联系电话": "Phone Number",
        "国家/地区": "Country/Region",
        "需求数量": "Required Quantity",
        "详细需求": "Detailed Requirements",
        "发送询盘": "Send Inquiry",
        
        // Location
        "公司地址": "Office Address",
        "杭州卡恩新型建材有限公司": "Karn New Building Materials Co., Ltd.",
        "地址：浙江省杭州市萧山区经济技术开发区": "Address: Xiaoshan Economic & Technological Development Zone, Hangzhou, Zhejiang, China",
        "邮编：311200": "Postal Code: 311200",
        "工作时间": "Working Hours",
        "周一至周五 8:30-17:30 (GMT+8)": "Monday-Friday 8:30-17:30 (GMT+8)",
        "地图位置（占位图）": "Location Map (Placeholder)",
        
        // Footer
        "地址：浙江省杭州市": "Address: Hangzhou, Zhejiang, China",
        "© 2025 杭州卡恩新型建材有限公司. 版权所有.": "© 2025 Karn New Building Materials Co., Ltd. All rights reserved."
    },
    ru: {
        // Navigation
        "卡恩建材": "Карн Материалы",
        "首页": "Главная",
        "产品": "Продукты",
        "关于我们": "О Нас",
        "联系我们": "Контакты",
        
        // Home page
        "专业墙纸胶粉出口供应商": "Профессиональный Поставщик Клеевого Порошка для Обоев",
        "专注环保墙纸胶粉生产，服务全球客户": "Специализируемся на производстве экологичного клеевого порошка для обоев, обслуживаем глобальных клиентов",
        "立即咨询": "Связаться Сейчас",
        
        // Product advantages
        "产品优势": "Преимущества Продукта",
        "环保无毒": "Экологичный и Нетоксичный",
        "采用天然植物原料，通过国际环保认证": "Используем натуральные растительные материалы, сертифицированы международными экологическими стандартами",
        "超强粘性": "Превосходная Склейка",
        "专业配方，确保墙纸粘贴牢固持久": "Профессиональная формула обеспечивает прочное и долговечное приклеивание обоев",
        "OEM定制": "OEM Кастомизация",
        "提供小包装OEM服务，满足个性化需求": "Предоставляем услуги OEM для малой упаковки, удовлетворяем индивидуальные потребности",
        
        // Applications
        "适用范围": "Область Применения",
        "家庭装修": "Домашний Декор",
        "商业工程": "Коммерческие Проекты",
        "酒店工程": "Отельные Проекты",
        
        // Product page
        "我们的产品": "Наши Продукты",
        "高品质墙纸胶粉，满足您的各种需求": "Качественный клеевой порошок для обоев для удовлетворения ваших различных потребностей",
        "墙纸胶粉原料": "Сырье для Клеевого Порошка Обоев",
        "100%天然植物淀粉，环保无毒": "100% натуральный растительный крахмал, экологичный и нетоксичный",
        "高粘度配方，适用于各种墙纸类型": "Формула высокой вязкости, подходит для всех типов обоев",
        "易溶解，施工方便，无异味": "Легко растворяется, удобное применение, без запаха",
        "通过欧盟CE认证和ISO质量体系认证": "Сертифицировано по стандартам ЕС CE и ISO",
        
        // OEM services
        "小包装OEM服务": "Услуги OEM для Малой Упаковки",
        "定制包装": "Индивидуальная Упаковка",
        "提供各种规格的小包装定制，从50g到1kg": "Предоставляем кастомизацию малой упаковки различных спецификаций, от 50г до 1кг",
        "贴牌生产": "Private Label",
        "支持客户品牌贴牌，快速响应市场需求": "Поддерживаем брендирование клиента, быстрая реакция на спрос рынка",
        "快速交货": "Быстрая Доставка",
        "小批量订单7-15天交货，满足紧急需求": "Малые партии поставляются за 7-15 дней, удовлетворяем срочные потребности",
        
        // Application scenarios
        "适用场景": "Сценарии Применения",
        "家庭住宅": "Домашнее Использование",
        "适用于客厅、卧室、书房等各种家庭空间墙纸粘贴": "Подходит для наклеивания обоев в гостиных, спальнях, кабинетах и других домашних помещениях",
        "商业办公": "Коммерческие Офисы",
        "适用于写字楼、办公室、会议室等商业空间装修": "Подходит для отделки коммерческих помещений, таких как офисные здания, офисы, конференц-залы",
        "酒店工程": "Отельные Проекты",
        "特别适用于酒店客房、大堂、走廊等大面积墙纸工程": "Особенно подходит для больших проектов по наклеиванию обоев в гостиничных номерах, лобби, коридорах",
        "零售店铺": "Розничные Магазины",
        "适用于商场、专卖店、餐厅等零售商业空间装修": "Подходит для отделки розничных коммерческих помещений, таких как торговые центры, специализированные магазины, рестораны",
        
        // About page
        "关于我们": "О Нас",
        "专业建材制造商，专注出口服务": "Профессиональный производитель строительных материалов, специализируемся на экспортных услугах",
        "公司介绍": "О Компании",
        "杭州卡恩新型建材有限公司成立于2010年，是一家专业从事墙纸胶粉研发、生产和销售的企业。我们位于浙江省杭州市，拥有现代化的生产基地和先进的生产设备。": "Карн Новые Строительные Материалы ООО была основана в 2010 году. Мы являемся профессиональным предприятием, занимающимся исследованием, разработкой, производством и продажей клеевого порошка для обоев. Мы находимся в Ханчжоу, провинция Чжэцзян, с современными производственными мощностями и передовым оборудованием.",
        "十多年来，我们始终坚持\"质量第一，客户至上\"的经营理念，产品远销欧洲、东南亚、中东、非洲等30多个国家和地区，赢得了国内外客户的广泛赞誉。": "Более десяти лет мы всегда придерживаемся бизнес-философии 'качество прежде всего, клиент прежде всего'. Наша продукция экспортируется более чем в 30 стран и регионов, включая Европу, Юго-Восточную Азию, Ближний Восток и Африку, завоевав широкое признание отечественных и зарубежных клиентов.",
        
        // Factory
        "工厂展示": "Демонстрация Завода",
        "生产车间": "Производственный Цех",
        "配备先进生产线，年产能达到5000吨": "Оснащены передовыми производственными линиями, годовая мощность достигает 5000 тонн",
        "质检中心": "Центр Контроля Качества",
        "严格的质量控制体系，确保每批产品符合国际标准": "Строгая система контроля качества гарантирует соответствие каждой партии международным стандартам",
        "研发实验室": "Исследовательская Лаборатория",
        "专业研发团队，持续创新产品配方和工艺": "Профессиональная исследовательская команда, постоянно инновационные формулы продуктов и процессы",
        
        // Brand history
        "品牌历程": "История Бренда",
        "公司成立": "Компания Основана",
        "杭州卡恩新型建材有限公司正式成立": "Карн Новые Строительные Материалы ООО официально основана",
        "首次出口": "Первый Экспорт",
        "产品首次出口到东南亚市场": "Первый экспорт на рынки Юго-Восточной Азии",
        "产能扩张": "Расширение Мощностей",
        "生产规模扩大，年产能提升至3000吨": "Производственный масштаб расширен, годовая мощность увеличена до 3000 тонн",
        "全球认证": "Глобальная Сертификация",
        "通过欧盟CE认证、ISO9001质量管理体系认证": "Получена сертификация ЕС CE и сертификация системы менеджмента качества ISO9001",
        "市场拓展": "Расширение Рынка",
        "产品出口至30+国家，建立全球销售网络": "Продукция экспортируется в 30+ стран, создана глобальная сеть продаж",
        
        // Export experience
        "出口经验": "Экспортный Опыт",
        "出口国家": "Страны Экспорта",
        "年出口吨数": "Годовой Экспорт Тонн",
        "海外客户": "Зарубежные Клиенты",
        "出口年限": "Лет Экспорта",
        "资质认证": "Сертификаты",
        "欧盟CE认证": "Сертификат ЕС CE",
        "ISO9001认证": "Сертификат ISO9001",
        "SGS认证": "Сертификат SGS",
        
        // Contact page
        "联系我们": "Свяжитесь С Нами",
        "随时为您提供专业的墙纸胶粉解决方案": "Всегда предоставляем профессиональные решения для клеевого порошка обоев",
        "WhatsApp": "WhatsApp",
        "立即联系": "Связаться Сейчас",
        "邮箱": "Электронная Почта",
        "发送邮件": "Отправить Email",
        "微信": "WeChat",
        "扫描二维码添加": "Отсканируйте QR-код для добавления",
        
        // Form
        "快速询盘": "Быстрый Запрос",
        "您的姓名": "Ваше Имя",
        "邮箱地址": "Адрес Электронной Почты",
        "联系电话": "Номер Телефона",
        "国家/地区": "Страна/Регион",
        "需求数量": "Требуемое Количество",
        "详细需求": "Подробные Требования",
        "发送询盘": "Отправить Запрос",
        
        // Location
        "公司地址": "Адрес Офиса",
        "杭州卡恩新型建材有限公司": "Карн Новые Строительные Материалы ООО",
        "地址：浙江省杭州市萧山区经济技术开发区": "Адрес: Сяошань Экономико-технологическая зона развития, Ханчжоу, Чжэцзян, Китай",
        "邮编：311200": "Почтовый индекс: 311200",
        "工作时间": "Рабочее Время",
        "周一至周五 8:30-17:30 (GMT+8)": "Понедельник-Пятница 8:30-17:30 (GMT+8)",
        "地图位置（占位图）": "Карта Местоположения (Заполнитель)",
        
        // Footer
        "地址：浙江省杭州市": "Адрес: Ханчжоу, Чжэцзян, Китай",
        "© 2025 杭州卡恩新型建材有限公司. 版权所有.": "© 2025 Карн Новые Строительные Материалы ООО. Все права защищены."
    }
};

function switchLanguage(lang) {
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="switchLanguage('${lang}')"]`).classList.add('active');
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update all elements with data attributes
    const elements = document.querySelectorAll('[data-zh][data-en][data-ru]');
    elements.forEach(element => {
        if (element.dataset[lang]) {
            if (element.tagName === 'TITLE') {
                element.textContent = element.dataset[lang];
            } else {
                element.textContent = element.dataset[lang];
            }
        }
    });
    
    // Update specific language data attributes
    const langElements = document.querySelectorAll(`[data-${lang}]`);
    langElements.forEach(element => {
        if (element.dataset[lang]) {
            element.textContent = element.dataset[lang];
        }
    });
    
    // Store language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'zh';
    switchLanguage(savedLang);
    
    // Handle form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Here you would normally send the data to a server
            // For demo purposes, we'll just show an alert
            const currentLang = document.documentElement.lang;
            const messages = {
                zh: '询盘已发送！我们会尽快与您联系。',
                en: 'Inquiry sent! We will contact you soon.',
                ru: 'Запрос отправлен! Мы скоро свяжемся с вами.'
            };
            
            alert(messages[currentLang]);
            
            // Reset form
            this.reset();
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});

// WhatsApp click tracking
function trackWhatsAppClick() {
    gtag('event', 'click', {
        'event_category': 'Contact',
        'event_label': 'WhatsApp',
        'value': 1
    });
}

// Email click tracking
function trackEmailClick() {
    gtag('event', 'click', {
        'event_category': 'Contact',
        'event_label': 'Email',
        'value': 1
    });
}

// Add click handlers for tracking
setTimeout(() => {
    const whatsappLink = document.querySelector('a[href*="wa.me"]');
    const emailLink = document.querySelector('a[href^="mailto:"]');
    
    if (whatsappLink) {
        whatsappLink.addEventListener('click', trackWhatsAppClick);
    }
    
    if (emailLink) {
        emailLink.addEventListener('click', trackEmailClick);
    }
}, 1000);