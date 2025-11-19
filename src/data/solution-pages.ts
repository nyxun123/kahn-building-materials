import type { LucideIcon } from 'lucide-react';

export type SiteLanguage = 'zh' | 'en' | 'ru' | 'vi' | 'th' | 'id';
export type SolutionCategory = 'oem' | 'cms' | 'privateLabel' | 'training';
export type FeatureIcon = 'factory' | 'shield' | 'clock' | 'globe' | 'truck' | 'boxes' | 'award' | 'users';

export interface SolutionTimelineStep {
  title: string;
  description: string;
  duration?: string;
}

export interface SolutionFAQItem {
  question: string;
  answer: string;
}

export interface SolutionContactCard {
  label: string;
  value: string;
}

export interface SolutionPageContent {
  slug: string;
  lang: SiteLanguage;
  category: SolutionCategory;
  marketLabel: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    highlights: string[];
    stats: Array<{ label: string; value: string }>;
    cta: { label: string; href: string };
  };
  meta: {
    title: string;
    description: string;
    keywords: string[];
    image?: string;
  };
  positioning: {
    summary: string;
    bullets: string[];
  };
  features: Array<{
    icon: FeatureIcon;
    title: string;
    description: string;
  }>;
  timeline: SolutionTimelineStep[];
  deliverables: string[];
  faqs: SolutionFAQItem[];
  contacts: SolutionContactCard[];
  structuredData: {
    url: string;
    name: string;
    description: string;
  };
}

export const solutionLandingPages: SolutionPageContent[] = [
  {
    slug: 'hangzhou-oem-wallpaper-adhesive',
    lang: 'zh',
    category: 'oem',
    marketLabel: '杭州 · 华东项目',
    hero: {
      eyebrow: '华东 OEM 快速交付',
      title: '杭州 7×24 OEM 墙纸胶定制产线',
      subtitle:
        '依托临平工厂 4 条自动包装线，OEM 墙纸胶粉 48 小时内完成配方验证、中文/英文/俄文标签与小包装发货，适配 8810/8840/K5/K6/999 系列。',
      highlights: [
        '含检测报告、COA、MSDS 套餐',
        '可对接杭州/上海港口报关',
        '支持 OEM + ODM 联合方案',
      ],
      stats: [
        { label: '日配料能力', value: '120 吨' },
        { label: '最小起订量', value: '3 吨' },
        { label: '样品交期', value: '72 小时' },
      ],
      cta: {
        label: '预约杭州 OEM 方案',
        href: '/zh/contact',
      },
    },
    meta: {
      title: '杭州 OEM 墙纸胶定制 | Hangzhou Karn',
      description:
        '杭州卡恩提供华东地区 OEM/ODM 墙纸胶粉服务，支持 8810/8840/K5/K6/999 系列，小包装、私标、海运渠道一站式交付。',
      keywords: [
        '杭州墙纸胶 OEM',
        '墙纸胶代工',
        '羧甲基淀粉杭州',
        'OEM wallpaper adhesive Hangzhou',
      ],
      image: '/images/oem-home.png',
    },
    positioning: {
      summary:
        '为华东经销商、工程渠道提供一站式 OEM 方案：从配方验证、粉体罐装、标签设计到出口包装全部由杭州工厂完成。',
      bullets: [
        '配备 ERP 可追溯批次与原料',
        '与宁波/上海港口合作，提供报关资料模板',
        'OEM、ODM、私标多种合作模式',
      ],
    },
    features: [
      {
        icon: 'factory',
        title: '双配方实验室',
        description: '8810/8840/K 系列可根据黏结强度、开放时间进行二次调整。',
      },
      {
        icon: 'shield',
        title: '多证书合规',
        description: '提供 CNAS 检测、MSDS、COA，方便政府及大型地产验收。',
      },
      {
        icon: 'truck',
        title: '华东物流联动',
        description: '支持公路+海运联合，江浙沪 24 小时内可送达仓库或港区。',
      },
      {
        icon: 'clock',
        title: '敏捷小批量',
        description: '3 吨起订即可启用独立包装线，支持双色印刷与二维码防伪。',
      },
    ],
    timeline: [
      { title: '需求梳理', description: '线上会议确认配方、包装、标签、认证等要素', duration: 'Day 0' },
      { title: '样品验证', description: '按目标黏度出 2 版配方，寄送杭州/全国客户', duration: 'Day 2-3' },
      { title: '批量生产', description: '锁定批次，启动 4 条自动线并同步质检', duration: 'Day 4-6' },
      { title: '包装出货', description: '按私标包装，附带报关资料及运输照片', duration: 'Day 7-8' },
    ],
    deliverables: [
      '配方报告 + 样品留存表',
      'COA/MSDS/检测报告 PDF',
      '中文/英文/俄文标签源文件',
      '出口包装清单（含木托/缠膜照片）',
    ],
    faqs: [
      {
        question: '最小起订量是多少？',
        answer: '杭州 OEM 线 MOQ 为 3 吨，若需多配方可拆分为 2 吨 + 1 吨并分别包装。',
      },
      {
        question: '能否加急？',
        answer: '常规交期 7-8 天，如需 5 天交付可在下单时选择“快速生产”并支付 5% 加急费。',
      },
      {
        question: '标签可以多语言吗？',
        answer: '支持中/英/俄/泰/越 5 种语言，可在下单模板内直接勾选所需版本。',
      },
    ],
    contacts: [
      { label: '商务', value: 'info@karn-materials.com' },
      { label: 'WhatsApp/微信', value: '+86 132 1615 6841' },
      { label: '总部地址', value: '浙江省杭州市余杭区东湖街道星桥路18号' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/zh/solutions/hangzhou-oem-wallpaper-adhesive',
      name: '杭州 OEM 墙纸胶定制方案',
      description: '杭州卡恩面向华东市场的 OEM 墙纸胶与羧甲基淀粉代工服务，提供检测、私标和出口报关支持。',
    },
  },
  {
    slug: 'russia-oem-wallpaper-adhesive',
    lang: 'ru',
    category: 'oem',
    marketLabel: 'Россия · Московский хаб',
    hero: {
      eyebrow: 'Экспорт в РФ без задержек',
      title: 'OEM клей для обоев с русской маркировкой',
      subtitle:
        'Линейка 8810/8840/K5/K6/999 выпускается с русскоязычными этикетками, паспортами качества и рекомендациями по хранению для северных регионов. Таможенный комплект формируется заранее.',
      highlights: [
        'REACH + EAC + MSDS в комплекте',
        'Таможенный код 3505.10 готов',
        'Доставка до Москвы/СПб за 32 дня',
      ],
      stats: [
        { label: 'Стартовая партия', value: '5 тонн' },
        { label: 'Температура хранения', value: '-35℃ испытано' },
        { label: 'Обновление формул', value: 'каждые 6 мес.' },
      ],
      cta: { label: 'Получить русское КП', href: '/ru/contact' },
    },
    meta: {
      title: 'OEM клей для обоев в Россию',
      description:
        'Hangzhou Karn поставляет OEM клей для обоев в РФ: русская маркировка, паспорта качества, поддержка Яндекс/маркетплейсов и склад в Москве.',
      keywords: [
        'клей для обоев OEM',
        'поставщик КМС Китай Россия',
        'OEM wallpaper adhesive Russia',
      ],
    },
    positioning: {
      summary:
        'Фокус на дистрибьюторах и DIY-рознице в России: от русскоязычных инструкций до консультаций по сертификации Таможенного союза.',
      bullets: [
        'Собственные шаблоны упаковки на русском',
        'Инженеры помогают пройти лабораторию Маркировка Честный ЗНАК',
        'Опция консолидации в Москве через партнёров',
      ],
    },
    features: [
      {
        icon: 'globe',
        title: 'Двойная логистика',
        description: 'Отгрузка через Нинбо — Владивосток или через Казахстан для ускоренной растаможки.',
      },
      {
        icon: 'shield',
        title: 'Полный пакет документов',
        description: 'COA, MSDS, REACH, тесты морозостойкости и рекомендации по ГОСТ.',
      },
      {
        icon: 'award',
        title: 'Холодные испытания',
        description: 'Сохраняем вязкость при -35℃, документируем результаты в паспорт качества.',
      },
      {
        icon: 'users',
        title: 'Локальная поддержка',
        description: 'Русскоговорящая команда для переговоров с сетями Леруа, Стройландия и т.д.',
      },
    ],
    timeline: [
      { title: 'ТЗ и формулы', description: 'Совместно уточняем диапазон вязкости и условия хранения', duration: 'День 0-1' },
      { title: 'Русские этикетки', description: 'Готовим макеты, проверяем на соответствие Росстандарту', duration: 'День 2-4' },
      { title: 'Производство и тесты', description: 'Серийное смешивание + испытания при минусовых температурах', duration: 'День 5-9' },
      { title: 'Доставка и консолидация', description: 'Контейнер/фура, при необходимости склад в Москве', duration: 'День 10+' },
    ],
    deliverables: [
      'Русскоязычный паспорт качества',
      'Фото/видео упаковки с маркировкой',
      'Инструкция по прохождению таможни',
      'Готовые шаблоны для маркетплейсов (Ozon/WB)',
    ],
    faqs: [
      {
        question: 'Можно ли использовать ваш бренд?',
        answer: 'Да, доступен co-branding, либо производим полностью под вашей частной маркой.',
      },
      {
        question: 'Как организована гарантия качества?',
        answer: 'Каждая партия сопровождается COA, а образцы хранятся 12 месяцев для сравнительных тестов.',
      },
      {
        question: 'Работаете ли с DDP?',
        answer: 'Есть партнёры в Москве и Санкт-Петербурге, которые берут на себя импорт и доставку до склада.',
      },
    ],
    contacts: [
      { label: 'Email', value: 'info@karn-materials.com' },
      { label: 'WhatsApp', value: '+86 132 1615 6841 (русскоговорящий менеджер)' },
      { label: 'Адрес завода', value: 'No.18 Xingqiao Rd, Hangzhou, China' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/ru/solutions/russia-oem-wallpaper-adhesive',
      name: 'OEM клей для обоев в Россию',
      description: 'Специализированная OEM-программа для российского рынка: русские этикетки, морозостойкие тесты и логистика до Москвы.',
    },
  },
  {
    slug: 'vietnam-oem-wallpaper-adhesive',
    lang: 'vi',
    category: 'oem',
    marketLabel: 'Việt Nam · OEM linh hoạt',
    hero: {
      eyebrow: 'Hỗ trợ CO, Form E',
      title: 'OEM keo dán tường cho đại lý Việt Nam',
      subtitle:
        'Tập trung vào phân phối tại Hà Nội – TP.HCM với gói OEM 5 tấn: bao bì tiếng Việt, tư vấn khai báo hóa chất và lịch giao hàng linh hoạt theo container hoặc LCL.',
      highlights: [
        'Bao bì tiếng Việt + QR truy xuất',
        'Có mẫu 1kg/5kg/20kg',
        'Thanh toán LC/TT linh hoạt',
      ],
      stats: [
        { label: 'MOQ', value: '5 tấn' },
        { label: 'Mẫu thử', value: '5 ngày' },
        { label: 'Thời gian vận chuyển', value: '18-22 ngày' },
      ],
      cta: { label: 'Nhận bảng giá OEM', href: '/vi/contact' },
    },
    meta: {
      title: 'OEM keo dán tường cho thị trường Việt Nam',
      description:
        'Hangzhou Karn cung cấp OEM keo dán tường (CMS) với nhãn tiếng Việt, hồ sơ MSDS, hỗ trợ Form E và giao hàng đến cảng Cát Lái/Hải Phòng.',
      keywords: [
        'keo dán tường OEM',
        'OEM wallpaper adhesive Vietnam',
        'tinh bột carboxymethyl OEM',
      ],
    },
    positioning: {
      summary: 'Giải pháp đáp ứng đại lý xây dựng và chuỗi siêu thị vật liệu tại Việt Nam.',
      bullets: [
        'Có form bảo hành thi công và hướng dẫn tiếng Việt',
        'Đội ngũ hỗ trợ CO, CQ, Bill of Lading',
        'Tùy chọn đóng gói nhỏ 1kg/2kg cho kênh bán lẻ',
      ],
    },
    features: [
      { icon: 'boxes', title: 'Đa dạng bao bì', description: 'Túi màng nhôm, PE hoặc xô; in offset tối đa 4 màu.' },
      { icon: 'truck', title: 'Lịch tàu cố định', description: 'Ghép container hàng tuần đi Cát Lái và Hải Phòng.' },
      { icon: 'shield', title: 'Chứng nhận đầy đủ', description: 'COA, MSDS, hướng dẫn an toàn bằng tiếng Việt.' },
      { icon: 'globe', title: 'Tư vấn thị trường', description: 'Gợi ý bộ từ khóa và hình ảnh để chạy quảng cáo địa phương.' },
    ],
    timeline: [
      { title: 'Xác nhận yêu cầu', description: 'Thống nhất độ nhớt, tỷ lệ hòa nước, màu sắc bao bì', duration: 'Ngày 0-1' },
      { title: 'Thiết kế nhãn', description: 'Dịch & dàn trang tiếng Việt, gửi file kiểm tra', duration: 'Ngày 2-3' },
      { title: 'Sản xuất và QC', description: 'Sản xuất hàng loạt + kiểm soát chất lượng theo mẫu chuẩn', duration: 'Ngày 4-7' },
      { title: 'Vận chuyển', description: 'Đóng container, phát hành chứng từ, cập nhật lịch tàu', duration: 'Ngày 8+' },
    ],
    deliverables: [
      'File thiết kế nhãn tiếng Việt (AI/PDF)',
      'Bộ tài liệu an toàn + hướng dẫn pha trộn',
      'Ảnh/video đóng gói từng lô',
      'Biên bản QC và CO/MSDS',
    ],
    faqs: [
      {
        question: 'Có hỗ trợ Form E không?',
        answer: 'Có, chúng tôi chuẩn bị Form E/CO để khách hàng giảm thuế nhập khẩu.',
      },
      {
        question: 'Có thể thanh toán bằng VND?',
        answer: 'Hiện chấp nhận USD & RMB; nếu cần VND sẽ thông qua ngân hàng đại lý tại Việt Nam.',
      },
      {
        question: 'Bao bì nhỏ nhất?',
        answer: 'Từ 500g đến 20kg; có thể đặt song song hai quy cách trong một lô.',
      },
    ],
    contacts: [
      { label: 'Hotline', value: '+86 132 1615 6841 (Zalo/WhatsApp)' },
      { label: 'Email', value: 'karnstarch@gmail.com' },
      { label: 'Cảng ưu tiên', value: 'Cát Lái · Hải Phòng · Đà Nẵng' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/vi/solutions/vietnam-oem-wallpaper-adhesive',
      name: 'OEM keo dán tường cho Việt Nam',
      description: 'Dịch vụ OEM linh hoạt với bao bì tiếng Việt, hỗ trợ chứng từ và giao hàng đến cảng Việt Nam.',
    },
  },
  {
    slug: 'thailand-oem-wallpaper-adhesive',
    lang: 'th',
    category: 'oem',
    marketLabel: 'Thailand · Gulf Service',
    hero: {
      eyebrow: 'Ready for BOQ & ASTM',
      title: 'กาววอลเปเปอร์ OEM พร้อมมาตรฐานอาคาร',
      subtitle:
        'รองรับโครงการในกรุงเทพฯ – ภูเก็ต – เชียงใหม่ ด้วยสูตร CMS ทนชื้น, มีเอกสาร ASTM/CNAS และทีมแปลภาษาไทยสำหรับงานประมูล.',
      highlights: [
        'ค่าการยึดเกาะ ≥1.2N',
        'เอกสาร ASTM / MSDS / TDS',
        'ทีมล่ามไทย-จีน',
      ],
      stats: [
        { label: 'MOQ', value: '4 ตัน' },
        { label: 'Lead time', value: '10 วันทำการ' },
        { label: 'Humidity spec', value: '95% RH test' },
      ],
      cta: { label: 'ขอใบเสนอราคา', href: '/th/contact' },
    },
    meta: {
      title: 'บริการ OEM กาววอลเปเปอร์สำหรับไทย',
      description: 'ผลิตกาววอลเปเปอร์ OEM พร้อมฉลากภาษาไทย เอกสาร ASTM และการสนับสนุน LC/TT สำหรับผู้รับเหมาไทย.',
      keywords: [
        'OEM กาววอลเปเปอร์',
        'wallpaper adhesive Thailand',
        'CMS ผง OEM',
      ],
    },
    positioning: {
      summary: 'เหมาะสำหรับผู้นำเข้าและผู้รับเหมาโครงการที่ต้องการเอกสารครบและบริการภาษาไทย.',
      bullets: [
        'ทีมสนับสนุนการยื่น BOQ/ใบเสนอราคา',
        'ช่วยเตรียมใบรับรองตามกฎหมายไทย',
        'มีคู่มือการใช้งานสำหรับทีมติดตั้งภาษาไทย',
      ],
    },
    features: [
      { icon: 'shield', title: 'Compliance Pack', description: 'ASTM C557, รายงาน VOC, MSDS แปลไทย.' },
      { icon: 'clock', title: 'Moisture Guard', description: 'ทดสอบการยึดเกาะในสภาวะ 95% RH 72 ชั่วโมง.' },
      { icon: 'factory', title: 'Custom Fill', description: 'บรรจุ 1kg/5kg/20kg พร้อมซองกันชื้น.' },
      { icon: 'users', title: 'Thai-speaking PM', description: 'PM พูดไทย อังกฤษ จีน ประสานงานเสนอราคา.' },
    ],
    timeline: [
      { title: 'Kick-off', description: 'ประชุมออนไลน์ร่วมกับทีมไทย/จีนเพื่อเก็บ requirement', duration: 'Day 0-1' },
      { title: 'Compliance Prep', description: 'จัดทำ ASTM, VOC, MSDS และฉลากภาษาไทย', duration: 'Day 2-4' },
      { title: 'Production', description: 'ผลิต + QC + บรรจุ พร้อมรายงานภาพถ่าย', duration: 'Day 5-9' },
      { title: 'Shipment', description: 'ประสานท่าเรือแหลมฉบัง/คลองเตย และอัปเดต ETD/ETA', duration: 'Day 10+' },
    ],
    deliverables: [
      'แฟ้ม ASTM/MSDS/COA ภาษาไทย-อังกฤษ',
      'Template เสนอราคาพร้อมรูปสินค้า',
      'ภาพถ่าย QC และวิดีโอโหลดตู้',
      'คู่มือการผสมและติดตั้งภาษาไทย',
    ],
    faqs: [
      {
        question: 'รับประกันคุณภาพกี่ปี?',
        answer: 'ขั้นต่ำ 12 เดือนจากวันผลิต พร้อมตัวอย่างเก็บในห้องแล็บสำหรับเทียบผล.',
      },
      {
        question: 'รองรับการชำระ LC ไหม?',
        answer: 'ได้ ทั้ง LC at sight และ T/T; เงื่อนไขระบุในสัญญา OEM ได้.',
      },
      {
        question: 'มีบริการ onsite ไหม?',
        answer: 'มีทีมเทคนิคบินไป onsite ได้เมื่อมียอดสั่ง ≥10 ตัน/ครั้ง.',
      },
    ],
    contacts: [
      { label: 'Thai Hotline', value: '+66 (0) 2024 8361 (ต่อทีมจีน)' },
      { label: 'Email', value: 'info@karn-materials.com' },
      { label: 'WeChat/Line', value: '@karn-oem' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/th/solutions/thailand-oem-wallpaper-adhesive',
      name: 'บริการ OEM กาววอลเปเปอร์ ไทย',
      description: 'โซลูชัน OEM พร้อมเอกสาร ASTM, ภาษาไทย และการสนับสนุนโครงการก่อสร้าง.',
    },
  },
  {
    slug: 'indonesia-oem-wallpaper-adhesive',
    lang: 'id',
    category: 'oem',
    marketLabel: 'Indonesia · Halal Ready',
    hero: {
      eyebrow: 'Sertifikasi & distribusi',
      title: 'OEM lem wallpaper siap BPOM/Halal',
      subtitle:
        'Formula CMS ramah tropis dengan dukungan dokumen BPOM, Halal MUI, serta opsi label Bahasa Indonesia dan konsultasi pemasaran marketplace.',
      highlights: [
        'Suhu tropis 35℃ stabil',
        'Dukungan CIF Jakarta/Surabaya',
        'Template kampanye Tokopedia',
      ],
      stats: [
        { label: 'MOQ', value: '4 ton' },
        { label: 'Sample', value: '6 hari' },
        { label: 'Lead time laut', value: '16-20 hari' },
      ],
      cta: { label: 'Hubungi tim OEM', href: '/id/contact' },
    },
    meta: {
      title: 'OEM lem wallpaper untuk pasar Indonesia',
      description:
        'Karn menyediakan OEM lem wallpaper dengan label Bahasa Indonesia, dokumen BPOM/Halal, dan dukungan distribusi ke Jakarta & Surabaya.',
      keywords: [
        'lem wallpaper OEM',
        'OEM wallpaper adhesive Indonesia',
        'pati karboksimetil OEM',
      ],
    },
    positioning: {
      summary: 'Melayani importir dan brand lokal yang menargetkan toko modern serta marketplace.',
      bullets: [
        'Label BI lengkap sesuai Permenkes',
        'Paket dokumentasi BPOM + Halal opsional',
        'Workshop daring untuk tim penjualan',
      ],
    },
    features: [
      { icon: 'shield', title: 'Compliance Suite', description: 'MSDS/BPOM draft/Halal statement siap diajukan.' },
      { icon: 'truck', title: 'Distribusi pelabuhan', description: 'CIF Jakarta & Surabaya, bisa pindah ke gudang mitra.' },
      { icon: 'boxes', title: 'Private label', description: 'Pilihan 1kg/5kg/20kg + desain label marketplace.' },
      { icon: 'globe', title: 'Kampanye digital', description: 'Toolkit konten Instagram/Tokopedia dalam Bahasa Indonesia.' },
    ],
    timeline: [
      { title: 'Kick-off & NDA', description: 'Bahas target segmen, spesifikasi teknis, dan jadwal impor', duration: 'Hari 0' },
      { title: 'Dokumen & label', description: 'Siapkan label BI + draft BPOM/Halal', duration: 'Hari 1-4' },
      { title: 'Produksi & QC', description: 'Produksi, uji stabilitas suhu 35℃, foto proof', duration: 'Hari 5-9' },
      { title: 'Pengapalan', description: 'Booking kapal, keluarkan dokumen CIF dan tracking', duration: 'Hari 10+' },
    ],
    deliverables: [
      'Label Bahasa Indonesia (AI/PDF)',
      'Draft dokumen BPOM/Halal',
      'Video QC & loading kontainer',
      'Checklist kampanye marketplace',
    ],
    faqs: [
      {
        question: 'Apakah bisa COD lokal?',
        answer: 'Kami bantu hubungkan dengan 3PL Jakarta yang bisa COD setelah barang tiba di gudang.',
      },
      {
        question: 'Bisa split shipment?',
        answer: 'Bisa, minimal 2 ton per pengiriman dengan jadwal berbeda.',
      },
      {
        question: 'Ada dukungan marketing?',
        answer: 'Disediakan kit konten digital + kalender promosi untuk marketplace besar.',
      },
    ],
    contacts: [
      { label: 'Sales Indonesia', value: '+62 819 8800 4321 (via WhatsApp)' },
      { label: 'Email', value: 'info@karn-materials.com' },
      { label: 'Jam layanan', value: '09:00-21:00 WIB (Senin-Sabtu)' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/id/solutions/indonesia-oem-wallpaper-adhesive',
      name: 'OEM lem wallpaper Indonesia',
    description: 'Program OEM dengan label BI, dukungan BPOM/Halal, serta distribusi CIF Jakarta & Surabaya.',
  },
  },
  {
    slug: 'cms-bulk-hangzhou',
    lang: 'zh',
    category: 'cms',
    marketLabel: '杭州 · 大宗供货',
    hero: {
      eyebrow: '粉体现货+定制',
      title: '8810/8840 CMS 粉体批量供应中心',
      subtitle:
        '余杭立体仓每日 80 吨自动包装，5% 水份稳定控制，附带 COA/水分/黏度三重报告，满足华东 OEM 和贸易出口。',
      highlights: ['24 小时装车', '支持 1/3/5 吨拆分', '免费提供 COA/SGS'],
      stats: [
        { label: '月度产能', value: '2,400 吨' },
        { label: '常规水份', value: '≤8%' },
        { label: 'QC 报告出具', value: '6 小时' },
      ],
      cta: { label: '预约大宗出货', href: '/zh/contact' },
    },
    meta: {
      title: '杭州 CMS 粉体批量供应 | Hangzhou Karn',
      description: '杭州卡恩面向长三角提供 CMS 粉体大宗发货，含水分/黏度检测与港口报关资料。',
      keywords: ['CMS 批量', '8810 粉体', '杭州羧甲基淀粉'],
      image: '/images/cms-bulk.png',
    },
    positioning: {
      summary: '覆盖 OEM 工厂、工程渠道和贸易商的华东大宗补货方案。',
      bullets: [
        '杭州/宁波/上海港口均可交仓',
        'ERP 可追溯批次，支持第三方抽检',
        '提供出口配套：箱单、提单模板、报关编码 3505.10',
      ],
    },
    features: [
      { icon: 'boxes', title: '多规格包装', description: '25kg 牛皮纸袋、500kg 吨袋或散装粉罐随选。' },
      { icon: 'shield', title: '三重质量报告', description: '含 COA、粒度、保湿率，自动上传客户空间。' },
      { icon: 'truck', title: '港口联动', description: '与上海/宁波堆场长期合作，提供落地监装图。' },
      { icon: 'clock', title: '快速排产', description: '急单 48 小时内完成称量、包装、贴标。' },
    ],
    timeline: [
      { title: '配方校准', description: '确认型号、粘度区间与含水率要求', duration: 'Day 0' },
      { title: 'QC 批次锁定', description: '出具水分/流动性报告，客户线上签认', duration: 'Day 1' },
      { title: '包装+监装', description: '自动包装+人工抽检，同步实时照片', duration: 'Day 2-3' },
      { title: '发运/报关', description: '安排陆运/港口，提交箱单发票及 HS 编码', duration: 'Day 4+' },
    ],
    deliverables: ['COA & MSDS 套装', '监装照片与称重记录', '出口发票/箱单模板', '港口预约号'],
    faqs: [
      {
        question: '最小出货量是多少？',
        answer: '常规 MOQ 5 吨，可拆分为 3 吨 + 2 吨分别装车，费用按实际称重结算。',
      },
      {
        question: '能否提供第三方检测？',
        answer: '可预约 SGS / Pony 到厂取样，费用可抵扣首单货款。',
      },
      {
        question: '是否支持夜间发车？',
        answer: '提供 7×24 装车窗口，需提前 12 小时确定司机车牌与到场时间。',
      },
    ],
    contacts: [
      { label: '批发热线', value: '+86 571-8888 8888' },
      { label: '物流跟单', value: '+86 132 1615 6841 (微信/WhatsApp)' },
      { label: '仓库地址', value: '杭州市余杭区星桥路18号' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/zh/solutions/cms-bulk-hangzhou',
      name: '杭州 CMS 粉体批量供应',
      description: '杭州卡恩提供 8810/8840 CMS 粉体大宗供应，含 QC 报告与港口联动服务。',
    },
  },
  {
    slug: 'cms-bulk-russia',
    lang: 'ru',
    category: 'cms',
    marketLabel: 'Россия · оптовые поставки',
    hero: {
      eyebrow: 'Ритмичные контейнеры',
      title: 'CMS порошок с REACH/COA для РФ',
      subtitle:
        'Собственные партии 8810/8840 с влажностью ≤8% и русскими паспортами качества. Подготавливаем комплект документов для кодов ТН ВЭД 3505.10 и таможни Москвы/СПб.',
      highlights: ['REACH + GOST копии', 'Температурные тесты -30℃', 'Опция складирования в Риге'],
      stats: [
        { label: 'Контейнеров/мес', value: '18' },
        { label: 'Срок поставки', value: '28-32 дня' },
        { label: 'Мин. партия', value: '10 т' },
      ],
      cta: { label: 'Запросить спецификацию', href: '/ru/contact' },
    },
    meta: {
      title: 'Оптовые поставки CMS порошка в Россию',
      description: 'Hangzhou Karn поставляет CMS порошок с русской документацией, REACH и стабильной влажностью для производителей клея.',
      keywords: ['CMS порошок оптом', '8810 поставщик Китай Россия', 'карбоксиметилкрахмал'],
    },
    positioning: {
      summary: 'Для заводов клея и дистрибьюторов, нуждающихся в стабильных партиях и полном пакете документов.',
      bullets: ['Русские COA/паспорт безопасности', 'Флекситанк/мешки на поддонах', 'Поддержка сертификации EAC/Минпромторг'],
    },
    features: [
      { icon: 'shield', title: 'Комплект документов', description: 'COA, MSDS, REACH, письмо соответствия на русском языке.' },
      { icon: 'truck', title: 'Логистика под ключ', description: 'FOB, CIF Санкт-Петербург/Находка, авто до Москвы.' },
      { icon: 'factory', title: 'Настройка вязкости', description: 'Допуски по Brookfield + хранение в холодной камере.' },
      { icon: 'award', title: 'Контроль партии', description: 'Видео загрузки + пломбировка с двойным номером.' },
    ],
    timeline: [
      { title: 'Запрос & NDA', description: 'Подтверждение ТЗ, пакета документов, условий оплаты', duration: 'День 0' },
      { title: 'Подготовка партии', description: 'Отбор образца, двойной QC, фотоотчёт', duration: 'День 1-4' },
      { title: 'Контейнеризация', description: 'Флекситанк или мешки, установка датчиков влажности', duration: 'День 5-7' },
      { title: 'Транспортировка', description: 'Экспортное оформление + трекинг до российского склада', duration: 'День 8+' },
    ],
    deliverables: ['Русский COA + паспорт безопасности', 'Фото/видео погрузки', 'Трекинг & график прибытия', 'Шаблон договора поставки'],
    faqs: [
      {
        question: 'Можно ли разделить на несколько получателей?',
        answer: 'Да, оформляем несколько инвойсов и упаковочных листов в одном контейнере.',
      },
      {
        question: 'Как подтверждается влажность?',
        answer: 'Прикладываем отчёт Brookfield + данные датчика внутри контейнера.',
      },
      {
        question: 'Есть ли склад в РФ?',
        answer: 'Работаем с партнёром в Москве (D2D), можно держать резерв 2-3 месяца.',
      },
    ],
    contacts: [
      { label: 'Русскоязычный менеджер', value: '+7 499 404-13-87' },
      { label: 'WhatsApp/WeChat', value: '+86 132 1615 6841' },
      { label: 'Email', value: 'export@karn-materials.com' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/ru/solutions/cms-bulk-russia',
      name: 'Оптовые поставки CMS порошка',
      description: 'CMS порошок 8810/8840 с русской документацией и стабильной логистикой до РФ.',
    },
  },
  {
    slug: 'cms-bulk-vietnam',
    lang: 'vi',
    category: 'cms',
    marketLabel: 'Việt Nam · nguồn hàng kho',
    hero: {
      eyebrow: 'Moisture control 8%',
      title: 'Nguồn CMS số lượng lớn cho OEM Việt Nam',
      subtitle:
        'Giao CIF Hải Phòng/TP.HCM trong 18-22 ngày, cung cấp COA tiếng Việt và bảng timeline vận chuyển để đóng gói OEM keo dán tường.',
      highlights: ['MOQ 5 tấn', 'Hỗ trợ L/C & T/T', 'Theo dõi container realtime'],
      stats: [
        { label: 'Thời gian vận chuyển', value: '18-22 ngày' },
        { label: 'Độ ẩm chuẩn', value: '≤8%' },
        { label: 'Tần suất QC', value: 'Mỗi 20 tấn' },
      ],
      cta: { label: 'Nhận báo giá CMS', href: '/vi/contact' },
    },
    meta: {
      title: 'Nguồn CMS số lượng lớn cho Việt Nam',
      description: 'Hangzhou Karn cung cấp CMS 8810/8840 số lượng lớn với COA tiếng Việt, hỗ trợ thông quan và timeline vận chuyển.',
      keywords: ['CMS số lượng lớn', 'keo bột OEM', 'carboxymethyl starch Việt Nam'],
    },
    positioning: {
      summary: 'Dành cho nhà máy OEM và nhà phân phối cần nguồn CMS ổn định, rõ ràng về lịch tàu.',
      bullets: ['CIF Hải Phòng / Cát Lái / Đà Nẵng', 'Bảng tiến độ cập nhật từng chặng', 'Tư vấn pha trộn cho OEM keo dán tường'],
    },
    features: [
      { icon: 'globe', title: 'Theo dõi nhiều cảng', description: 'Dashboard hiển thị ETD/ETA và nhiệt độ container.' },
      { icon: 'boxes', title: 'Tùy chọn đóng gói', description: 'Bao pp 25kg, jumbo 1 tấn, hoặc flexitank.' },
      { icon: 'users', title: 'Hỗ trợ công thức', description: 'Kỹ sư hỗ trợ điều chỉnh độ nhớt phù hợp khí hậu Việt Nam.' },
      { icon: 'truck', title: 'Hậu cần nội địa', description: 'Kết nối forwarder để kéo hàng về kho Bình Dương/Hải Phòng.' },
    ],
    timeline: [
      { title: 'Khảo sát nhu cầu', description: 'Chốt sản lượng, cảng đến, điều khoản thanh toán', duration: 'Ngày 0' },
      { title: 'Chuẩn bị hàng', description: 'Đóng gói + kiểm tra độ ẩm, gửi video', duration: 'Ngày 1-3' },
      { title: 'Book tàu & chứng từ', description: 'Phát hành invoice, packing list, CO và COA tiếng Việt', duration: 'Ngày 4-6' },
      { title: 'Giao hàng', description: 'Theo dõi container, hỗ trợ thông quan & kéo về kho', duration: 'Ngày 7+' },
    ],
    deliverables: ['COA song ngữ', 'Timeline vận chuyển dạng bảng', 'Ảnh/clip đóng gói', 'Checklist thông quan Việt Nam'],
    faqs: [
      {
        question: 'Có hỗ trợ L/C không?',
        answer: 'Chúng tôi nhận L/C at sight hoặc DP, vui lòng gửi ngân hàng phát hành để kiểm tra phí.',
      },
      {
        question: 'Đơn hàng nhỏ hơn 5 tấn?',
        answer: 'Có thể gom 3 tấn + phụ phí dịch vụ, giao bằng đường biển nhanh.',
      },
      {
        question: 'Hồ sơ CO có tiếng Việt?',
        answer: 'CO form E và COA đều có tiếng Việt, giúp nộp hải quan nhanh hơn.',
      },
    ],
    contacts: [
      { label: 'Hotline VN', value: '+84 28 9999 88 77' },
      { label: 'Zalo/WhatsApp', value: '+86 132 1615 6841' },
      { label: 'Email', value: 'sea@karn-materials.com' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/vi/solutions/cms-bulk-vietnam',
      name: 'Nguồn CMS số lượng lớn Việt Nam',
      description: 'Nguồn CMS 8810/8840 ổn định với COA tiếng Việt và timeline vận chuyển chi tiết.',
    },
  },
  {
    slug: 'cms-bulk-thailand',
    lang: 'th',
    category: 'cms',
    marketLabel: 'ไทย · คลังแหลมฉบัง',
    hero: {
      eyebrow: 'Industrial Supply Ready',
      title: 'CMS จำนวนมากสำหรับผู้ผลิตกาวไทย',
      subtitle:
        'รองรับการนำเข้า CIF แหลมฉบัง/คลองเตย มีเอกสารภาษาไทยและรายงาน ASTM สำหรับผู้ประกอบการ OEM กาววอลเปเปอร์.',
      highlights: ['สต็อกกันชื้น 6 เดือน', 'รองรับ LC/TT', 'ที่ปรึกษาไทยตลอดโครงการ'],
      stats: [
        { label: 'Lead time', value: '20-25 วัน' },
        { label: 'Moisture target', value: '≤8%' },
        { label: 'Batch size', value: '8-20 ตัน' },
      ],
      cta: { label: 'ขอใบเสนอราคา', href: '/th/contact' },
    },
    meta: {
      title: 'CMS จำนวนมากสำหรับตลาดไทย',
      description: 'จัดส่ง CMS 8810/8840 พร้อมรายงานภาษาไทย, ASTM และคำแนะนำการเก็บรักษาสำหรับภูมิอากาศร้อนชื้น.',
      keywords: ['CMS จำนวนมาก', 'กาววอลเปเปอร์ OEM ไทย', 'carboxymethyl starch Thailand'],
    },
    positioning: {
      summary: 'ตอบโจทย์โรงงานและผู้จัดจำหน่ายที่ต้องการวัตถุดิบต่อเนื่องและมาตรฐานเอกสารครบถ้วน.',
      bullets: ['Form E + ใบรับรอง HALAL (ถ้าต้องการ)', 'รายงาน ASTM D6847', 'บริการดึงตู้ถึงคลังลาดกระบัง'],
    },
    features: [
      { icon: 'globe', title: 'ทีมสองภาษา', description: 'ผู้ประสานงานไทย/อังกฤษ ตอบกลับภายใน 6 ชม.' },
      { icon: 'truck', title: 'ควบคุมอุณหภูมิ', description: 'บันทึก temp/humidity ในตู้และแนบไฟล์ CSV.' },
      { icon: 'boxes', title: 'Flexible packaging', description: 'Jumbo bag, 25kg bag หรือ bulk silo สำหรับ OEM.' },
      { icon: 'shield', title: 'Compliance bundle', description: 'ASTM, MSDS, ใบรับรองโรงงาน, เอกสารกรมศุลกากร.' },
    ],
    timeline: [
      { title: 'Spec alignment', description: 'สรุปความหนืด, ความชื้น, เอกสารที่ต้องใช้', duration: 'Day 0' },
      { title: 'Production & QC', description: 'สุ่มตรวจทุก 10 ตัน + ส่งตัวอย่างด่วน', duration: 'Day 1-4' },
      { title: 'Packing & booking', description: 'จองเรือ, ออก invoice/PL/COA ภาษาไทย', duration: 'Day 5-7' },
      { title: 'Arrival support', description: 'ติดตามตู้, นัดตรวจ กรมศุลฯ, บริการลากตู้', duration: 'Day 8+' },
    ],
    deliverables: ['รายงาน ASTM + COA ภาษาไทย', 'ไฟล์เซ็นเซอร์ temp/humidity', 'วีดีโอโหลดตู้', 'คู่มือเก็บรักษาในไทย'],
    faqs: [
      {
        question: 'สามารถแบ่งชำระได้หรือไม่?',
        answer: 'รองรับ TT 30/70 หรือ LC at sight ขึ้นอยู่กับประวัติการสั่งซื้อ.',
      },
      {
        question: 'มีบริการเก็บสำรองไหม?',
        answer: 'สามารถฝากสต็อกที่คลังพันธมิตรโซน EEC ได้ 45 วันฟรี.',
      },
      {
        question: 'ต้องลงทะเบียน FDA ไทยหรือไม่?',
        answer: 'วัตถุดิบ CMS ไม่ต้อง แต่เรามีเอกสาร Safety ให้แนบตามที่ตรวจต้องการ.',
      },
    ],
    contacts: [
      { label: 'Thai desk', value: '+66 2 508 5234' },
      { label: 'Line/WhatsApp', value: '+86 132 1615 6841' },
      { label: 'อีเมล', value: 'th@karn-materials.com' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/th/solutions/cms-bulk-thailand',
      name: 'CMS จำนวนมากสำหรับไทย',
      description: 'แหล่ง CMS สำหรับโรงงานไทย พร้อมรายงาน ASTM และบริการโลจิสติกส์ครบวงจร.',
    },
  },
  {
    slug: 'cms-bulk-indonesia',
    lang: 'id',
    category: 'cms',
    marketLabel: 'Indonesia · CIF Jakarta',
    hero: {
      eyebrow: 'Bulk Chemical Program',
      title: 'Suplai CMS volume besar untuk industri lem Indonesia',
      subtitle:
        'Kontainer rutin ke Tanjung Priok & Tanjung Perak dengan dokumen Bahasa Indonesia, opsi CIF/DDP, serta panduan alur CIF Jakarta untuk tim procurement.',
      highlights: ['Sertifikasi halal opsional', 'Monitor suhu kontainer', 'One-stop kepabeanan'],
      stats: [
        { label: 'Lead time', value: '19-23 hari' },
        { label: 'MOQ', value: '8 ton' },
        { label: 'Channel', value: 'CIF / DDP' },
      ],
      cta: { label: 'Minta jadwal kontainer', href: '/id/contact' },
    },
    meta: {
      title: 'Suplai CMS besar untuk pasar Indonesia',
      description: 'Pasokan CMS 8810/8840 dengan dokumen Bahasa Indonesia, dukungan CIF Jakarta & Surabaya, serta monitoring kontainer.',
      keywords: ['CMS bulk Indonesia', 'lem wallpaper OEM', 'suplai pati karboksimetil'],
    },
    positioning: {
      summary: 'Untuk importer dan brand lokal yang menargetkan modern trade dan marketplace.',
      bullets: ['Label BI lengkap + SDS', 'Opsi gudang konsinyasi Jakarta', 'Tim compliance bantu BPOM/Halal'],
    },
    features: [
      { icon: 'shield', title: 'Dokumen siap audit', description: 'MSDS, COA, surat halal, dan template registrasi BPOM.' },
      { icon: 'truck', title: 'Transit terukur', description: 'Sensor suhu/kadar air terpasang di tiap kontainer.' },
      { icon: 'boxes', title: 'Pilihan kemasan', description: 'Jumbo bag 1 ton, bag 25kg, atau isi silo di pabrik mitra.' },
      { icon: 'users', title: 'Tim lokal', description: 'Customer success Jakarta mengikuti jadwal bongkar.' },
    ],
    timeline: [
      { title: 'Penjajakan kebutuhan', description: 'Kuantitas, channel pengiriman, jadwal impor', duration: 'Hari 0' },
      { title: 'Produksi & QC', description: 'QC tiap 10 ton + kirim sampel express', duration: 'Hari 1-4' },
      { title: 'Book kapal & dokumen', description: 'Invoice, packing list, COA BI, dokumen halal', duration: 'Hari 5-7' },
      { title: 'Customs & delivery', description: 'Pantau kapal, bantu PIB dan pengantaran ke gudang', duration: 'Hari 8+' },
    ],
    deliverables: ['COA Bahasa Indonesia', 'Data logger suhu/kadar air', 'Foto stuffing kontainer', 'Checklist PIB + HS 3505.10'],
    faqs: [
      {
        question: 'Apakah bisa DDP?',
        answer: 'Bisa untuk Jakarta & Surabaya dengan mitra logistik kami, biaya dikenakan per kontainer.',
      },
      {
        question: 'Bagaimana jika butuh stok cadangan?',
        answer: 'Kami sediakan gudang konsinyasi 30 hari gratis di Bekasi untuk pelanggan kontrak.',
      },
      {
        question: 'Ada support BPOM?',
        answer: 'Kami siapkan dokumen awal dan rekomendasi konsultan BPOM rekanan.',
      },
    ],
    contacts: [
      { label: 'Sales Indonesia', value: '+62 21 5085 7788' },
      { label: 'WhatsApp', value: '+86 132 1615 6841' },
      { label: 'Email', value: 'id@karn-materials.com' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/id/solutions/cms-bulk-indonesia',
      name: 'Suplai CMS besar Indonesia',
      description: 'Suplai CMS 8810/8840 dengan dokumen Bahasa Indonesia dan dukungan CIF/DDP Jakarta & Surabaya.',
    },
  },
  {
    slug: 'private-label-hangzhou',
    lang: 'zh',
    category: 'privateLabel',
    marketLabel: '杭州 · 私标工坊',
    hero: {
      eyebrow: '多语标签+小包装',
      title: '墙纸胶私标 & 小包装一站式',
      subtitle:
        '基于杭州样板线的 0.5kg/1kg/5kg 罐装，支持中英俄泰六语排版与二维码溯源，7 天内交付样品。',
      highlights: ['双色丝印', '批次可追溯', '提供包装效果图'],
      stats: [
        { label: '小包装线', value: '4 条' },
        { label: '最小订单', value: '2,000 罐' },
        { label: '设计交期', value: '48 小时' },
      ],
      cta: { label: '预约私标打样', href: '/zh/contact' },
    },
    meta: {
      title: '墙纸胶私标包装服务 | Hangzhou Karn',
      description: '提供 0.5-5kg 小包装墙纸胶，含多语标签设计、打样与物流合规文件。',
      keywords: ['墙纸胶私标', 'OEM 小包装', '多语标签设计'],
      image: '/images/private-label.png',
    },
    positioning: {
      summary: '适用于跨境电商、建材卖场、自有品牌渠道。',
      bullets: ['支持 EAN/UPC 编码申请', '可选软管、桶装、铝箔袋', '打样含 3D 渲染'],
    },
    features: [
      { icon: 'boxes', title: '包装矩阵', description: '0.5kg 软管、1kg 罐、5kg 桶随时切换。' },
      { icon: 'award', title: '标签创意', description: '自带设计团队，输出 AI/PSD + 印前文件。' },
      { icon: 'shield', title: '法规审核', description: '根据目标国家审核成分/警示语。' },
      { icon: 'users', title: '品牌共创', description: '提供品牌故事、卖点 copywriting。' },
    ],
    timeline: [
      { title: '概念&配色', description: '收集品牌素材，确定语种与材质', duration: 'Day 0' },
      { title: '设计打样', description: '48 小时出 2 款方案 + 3D mockup', duration: 'Day 1-2' },
      { title: '试产校验', description: '灌装 100 罐并快递样品', duration: 'Day 3-4' },
      { title: '批量生产', description: '确认标签&外箱，安排量产', duration: 'Day 5+' },
    ],
    deliverables: ['AI/PSD 标签文件', '3D 渲染图', '试产检验报告', '外箱堆码图'],
    faqs: [
      {
        question: '是否可以提供中英俄三语？',
        answer: '可以，提供术语表后 24 小时内输出多语版本。',
      },
      {
        question: '小批量加急能做到吗？',
        answer: '可提供 500 罐试生产，需加收 15% 线体切换费。',
      },
      {
        question: '能否协助条码注册？',
        answer: '可代办 UPC/EAN，并生成贴标。',
      },
    ],
    contacts: [
      { label: '私标顾问', value: '+86 571-8888 2233' },
      { label: '设计邮箱', value: 'design@karn-materials.com' },
      { label: '打样工厂', value: '杭州市余杭区私标中心' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/zh/solutions/private-label-hangzhou',
      name: '墙纸胶私标服务',
      description: '多语标签+小包装灌装一站式方案，48 小时打样。',
    },
  },
  {
    slug: 'private-label-russia',
    lang: 'ru',
    category: 'privateLabel',
    marketLabel: 'Россия · кириллическая упаковка',
    hero: {
      eyebrow: 'Маркировка готова к ЕАЭС',
      title: 'Private label клей с кириллической тарой',
      subtitle:
        'Разрабатываем дизайн и печать банок/пакетов с русским текстом, предупреждениями по ТР ТС 005/2011 и QR-трекингом для маркетплейсов.',
      highlights: ['Тираж от 2 000 шт', 'Проверка орфографии носителем языка', 'Сертификат ЕАС'],
      stats: [
        { label: 'Время дизайна', value: '3 дня' },
        { label: 'Шаблонов', value: '12' },
        { label: 'Формат тары', value: '0.5–10 кг' },
      ],
      cta: { label: 'Получить макеты', href: '/ru/contact' },
    },
    meta: {
      title: 'Private label клей для рынка РФ',
      description: 'Русские этикетки, предупредительные знаки, инструкции и фото-контент для маркетплейсов.',
      keywords: ['private label клей', 'русская маркировка клей', 'OEM упаковка обойного клея'],
    },
    positioning: {
      summary: 'Создано для дистрибьюторов Ozon/Wildberries и региональных сетей DIY.',
      bullets: ['Подготовка карточек товара', 'Гарантия соответствия ТР ТС', 'Партнёрская фотостудия в Москве'],
    },
    features: [
      { icon: 'award', title: 'Дизайн + копирайт', description: 'Носитель языка редактирует copy, добавляем Piktogrammy GHS.' },
      { icon: 'boxes', title: 'Custom тара', description: 'Ведра, пакеты-дойпаки, евроблистер под PL.' },
      { icon: 'shield', title: 'EAC поддержка', description: 'Пакет документов для сертификации и серийного ввоза.' },
      { icon: 'users', title: 'Контент-пак', description: 'Фото/видео распаковки для маркетплейсов.' },
    ],
    timeline: [
      { title: 'Brief & NDA', description: 'Получаем позиционирование, SKU, каналы продаж', duration: 'День 0' },
      { title: 'Дизайн & правки', description: '3 концепта + 2 раунда правок', duration: 'День 1-3' },
      { title: 'Пробная партия', description: 'Запускаем 200-500 шт для проверки логистики', duration: 'День 4-5' },
      { title: 'Массовое производство', description: 'Полный тираж + подготовка документов', duration: 'День 6+' },
    ],
    deliverables: ['Макеты AI/PSD', 'Гайд по маркировке', 'Фото/видео контент', 'Сертификат соответствия черновик'],
    faqs: [
      {
        question: 'Можно ли печатать QR для честного знака?',
        answer: 'Да, интегрируем динамический код и выгружаем CSV для системы.',
      },
      {
        question: 'Какой контроль качества тары?',
        answer: 'Каждая партия проходит тест на герметичность и падение с 1 м.',
      },
      {
        question: 'Вы делаете инструкции?',
        answer: 'Мы готовим инструкцию по ГОСТ с иллюстрациями.',
      },
    ],
    contacts: [
      { label: 'Менеджер PL', value: '+7 812 385-44-90' },
      { label: 'Telegram', value: '@karn_russia' },
      { label: 'Email', value: 'pl@karn-materials.com' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/ru/solutions/private-label-russia',
      name: 'Private label клей Россия',
      description: 'Русские этикетки, сертификация и тиражирование банок/пакетов для OEM клея.',
    },
  },
  {
    slug: 'private-label-vietnam',
    lang: 'vi',
    category: 'privateLabel',
    marketLabel: 'Việt Nam · gói nhỏ đa cấp',
    hero: {
      eyebrow: 'Thiết kế & đóng gói 0.5-5kg',
      title: 'Private label keo dán tường cho sàn TMĐT',
      subtitle:
        'Cung cấp 3 hạng gói (Starter/Pro/Enterprise), bao gồm thiết kế tiếng Việt, hình ảnh lifestyle và chứng từ công bố chất lượng.',
      highlights: ['Mockup trong 48h', 'In offset/chuyển nhiệt', 'Kho mẫu TP.HCM'],
      stats: [
        { label: 'MOQ mỗi SKU', value: '1,500 gói' },
        { label: 'Số ngôn ngữ', value: '6' },
        { label: 'Thời gian hoàn thiện', value: '7 ngày' },
      ],
      cta: { label: 'Nhận catalogue private label', href: '/vi/contact' },
    },
    meta: {
      title: 'Private label keo dán tường Việt Nam',
      description: 'Thiết kế bao bì tiếng Việt, gói chụp ảnh, hỗ trợ niêm yết Shopee/Lazada và nhãn phụ bắt buộc.',
      keywords: ['keo dán tường private label', 'bao bì tiếng Việt', 'OEM keo bột'],
    },
    positioning: {
      summary: 'Phù hợp cho nhà bán hàng TMĐT, chuỗi showroom decor và OEM nội thất.',
      bullets: ['Bảng giá 3 cấp, rõ ràng theo dung tích', 'Có trung tâm hoàn thiện tại Bình Dương', 'Cung cấp bộ ảnh + video Tiktok'],
    },
    features: [
      { icon: 'boxes', title: 'Tùy chọn bao bì', description: 'Túi zipper, lon nhựa, combo “2 gói + bay trét”.' },
      { icon: 'award', title: 'Studio nội bộ', description: 'Chụp ảnh lifestyle, sử dụng mẫu tường thật.' },
      { icon: 'shield', title: 'Nhãn phụ hợp chuẩn', description: 'Đầy đủ cảnh báo hóa chất theo QCVN 04-2009/BCT.' },
      { icon: 'users', title: 'Onboarding TMĐT', description: 'Checklist Shopee/Lazada + mẫu content chuẩn SEO.',
      },
    ],
    timeline: [
      { title: 'Thu thập brief', description: 'Chốt tone & nội dung tiếng Việt', duration: 'Ngày 0' },
      { title: 'Thiết kế & duyệt', description: 'Gửi 2 phương án + mockup 3D', duration: 'Ngày 1-2' },
      { title: 'In & đóng gói', description: 'In tem, đóng gói thử 200 gói', duration: 'Ngày 3-4' },
      { title: 'Giao mẫu & sản xuất', description: 'Gửi mẫu TP.HCM, triển khai sản xuất lớn', duration: 'Ngày 5+' },
    ],
    deliverables: ['File thiết kế gốc', 'Ảnh lifestyle/short video', 'Báo cáo kiểm tra độ kín', 'Checklist niêm yết TMĐT'],
    faqs: [
      {
        question: 'Có hỗ trợ dán tem phụ tại Việt Nam?',
        answer: 'Có, đối tác fulfillment tại Bình Dương có thể dán tem và đóng thùng lại.',
      },
      {
        question: 'Gói starter có gì?',
        answer: 'Bao gồm thiết kế 1 ngôn ngữ, mockup và 1.500 gói đóng sẵn.',
      },
      {
        question: 'Có cung cấp ảnh RAW không?',
        answer: 'Chúng tôi bàn giao ảnh RAW + PSD để bạn chỉnh sửa tùy ý.',
      },
    ],
    contacts: [
      { label: 'Hotline PL', value: '+84 90 999 3321' },
      { label: 'Zalo', value: 'zalo.me/karnpl' },
      { label: 'Email', value: 'pl-vn@karn-materials.com' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/vi/solutions/private-label-vietnam',
      name: 'Private label keo Việt Nam',
      description: 'Gói thiết kế + đóng gói tiếng Việt, phù hợp TMĐT và chuỗi nội thất.',
    },
  },
  {
    slug: 'private-label-thailand',
    lang: 'th',
    category: 'privateLabel',
    marketLabel: 'Thailand · Retail ready',
    hero: {
      eyebrow: 'Packaging compliance',
      title: 'Private label กาววอลเปเปอร์สำหรับโมเดิร์นเทรด',
      subtitle:
        'ออกแบบฉลากภาษาไทย, ตรา อย./มอก. ที่จำเป็น และจัดทำ mockup shelf สำหรับ HomePro/DoHome/ไทวัสดุ.',
      highlights: ['รองรับ 0.5-20kg', 'ตรวจสอบคำเตือนตาม กรมโรงงาน', 'บริการ barcode GS1'],
      stats: [
        { label: 'MOQ', value: '1,200 pcs' },
        { label: 'รอบออกแบบ', value: '2 รอบ' },
        { label: 'เวลาผลิต', value: '10 วัน' },
      ],
      cta: { label: 'จองคิวปรับแบรนด์', href: '/th/contact' },
    },
    meta: {
      title: 'Private label กาววอลเปเปอร์ไทย',
      description: 'บริการออกแบบ/พิมพ์ฉลากไทย รองรับโมเดิร์นเทรด พร้อม testing report ตาม ASTM.',
      keywords: ['private label กาว', 'ฉลากภาษาไทย', 'OEM wall adhesive Thailand'],
    },
    positioning: {
      summary: 'ทำงานร่วมกับทีมจัดซื้อโมเดิร์นเทรด เพื่อให้สินค้าผ่าน onboarding ในครั้งเดียว.',
      bullets: ['GS1 barcode + ใบรับรองน้ำหนักสุทธิ', 'มี mockup shelf & planogram', 'จัดเตรียม SDS ภาษาไทย'],
    },
    features: [
      { icon: 'award', title: 'Creative kit', description: 'ทีมดีไซน์อินเฮาส์ + ที่ปรึกษาแบรนด์ไทย.' },
      { icon: 'shield', title: 'Regulatory check', description: 'ตรวจตาม พ.ร.บ.สารเคมี และข้อกำหนดห้าง.' },
      { icon: 'boxes', title: 'Retail pack set', description: 'Inner pack + master carton พร้อมสติกเกอร์ EAS.' },
      { icon: 'globe', title: 'Omni-channel assets', description: 'ไฟล์สำหรับโซเชียล/เว็บไซต์/แคตตาล็อก.' },
    ],
    timeline: [
      { title: 'Kickoff', description: 'Workshop กับทีมการตลาด/QA ลูกค้า', duration: 'Day 0' },
      { title: 'Design sprint', description: 'ออกแบบ + ตรวจคำไทยกับ native editor', duration: 'Day 1-3' },
      { title: 'Pilot run', description: 'ผลิต 300 pcs เพื่อทดสอบ shelf/ขนส่ง', duration: 'Day 4-6' },
      { title: 'Full rollout', description: 'ยืนยัน forecast + slot ส่งเข้าห้าง', duration: 'Day 7+' },
    ],
    deliverables: ['ไฟล์ Ai/PSD', 'Mockup shelf', 'รายงาน ASTM', 'ป้าย shelf talker'],
    faqs: [
      {
        question: 'ต้องมี มอก. ไหม?',
        answer: 'กาววอลเปเปอร์ไม่บังคับ มอก. แต่เราช่วยเตรียมจดแจ้ง/เอกสารความปลอดภัย.',
      },
      {
        question: 'ห้างต้องการ test อะไร?',
        answer: 'ส่วนใหญ่ขอ ASTM D905 shear test + SDS ภาษาไทย เรามีพร้อม.',
      },
      {
        question: 'สามารถส่งเข้าคลังของเราได้เลยไหม?',
        answer: 'มีบริการส่งตรง DC HomePro/ไทวัสดุ โดยจอง slot ล่วงหน้า.',
      },
    ],
    contacts: [
      { label: 'Brand success', value: '+66 92 882 4411' },
      { label: 'Line OA', value: '@karnpl' },
      { label: 'Email', value: 'pl-th@karn-materials.com' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/th/solutions/private-label-thailand',
      name: 'Private label ไทย',
      description: 'แพ็คเกจฉลากไทย + compliance สำหรับโมเดิร์นเทรดและออนไลน์.',
    },
  },
  {
    slug: 'private-label-indonesia',
    lang: 'id',
    category: 'privateLabel',
    marketLabel: 'Indonesia · marketplace focus',
    hero: {
      eyebrow: 'Label BI + halal',
      title: 'Private label lem wallpaper untuk Tokopedia/Shopee',
      subtitle:
        'Workflow terjemahan label, legal review, dan produksi pouch 1kg/5kg dengan sertifikasi halal opsional dan panduan kampanye digital.',
      highlights: ['Studio foto Jakarta', 'Toolkit copy BI/EN', 'Integrasi QR trace'],
      stats: [
        { label: 'MOQ', value: '1.800 pouch' },
        { label: 'Lead time', value: '8 hari' },
        { label: 'Bahasa', value: 'BI + EN' },
      ],
      cta: { label: 'Booking sesi brand', href: '/id/contact' },
    },
    meta: {
      title: 'Private label lem Indonesia',
      description: 'Label Bahasa Indonesia, sertifikasi halal opsional, paket foto/video marketplace.',
      keywords: ['private label lem', 'label Bahasa Indonesia', 'OEM wallpaper glue ID'],
    },
    positioning: {
      summary: 'Disusun untuk penjual marketplace & retail modern yang butuh label sesuai Permenkes.',
      bullets: ['Workflow terjemahan + proofing', 'Dokumen halal/BPOM', 'Penyimpanan stok siap kirim'],
    },
    features: [
      { icon: 'users', title: 'Brand playbook', description: 'Tone of voice + key visual untuk Shopee/Tokopedia.' },
      { icon: 'shield', title: 'Audit regulasi', description: 'Checklist Permenkes, label bahaya, info impor.' },
      { icon: 'boxes', title: 'Fulfillment ready', description: 'Kemasan aman untuk JNE/J&T, corner protector.' },
      { icon: 'globe', title: 'Kampanye digital', description: 'Template iklan + caption 3 bulan.' },
    ],
    timeline: [
      { title: 'Brand immersion', description: 'Diskusi positioning + channel', duration: 'Hari 0' },
      { title: 'Design & review', description: 'Terjemahan + desain + approval HALAL/BPOM', duration: 'Hari 1-3' },
      { title: 'Pilot production', description: 'Produksi 300 set + uji drop test', duration: 'Hari 4-5' },
      { title: 'Mass roll-out', description: 'Cetak penuh + siapkan materi kampanye', duration: 'Hari 6+' },
    ],
    deliverables: ['File desain BI/EN', 'Kit foto/video marketplace', 'Checklist regulator', 'Template iklan'],
    faqs: [
      {
        question: 'Apakah wajib halal?',
        answer: 'Tidak wajib, namun kami bisa bantu daftar jika target retail modern.',
      },
      {
        question: 'Bisa bantu gudang Jakarta?',
        answer: 'Ada gudang ready stock 1.000 pcs untuk kampanye flash sale.',
      },
      {
        question: 'Butuh copywriting?',
        answer: 'Kami sediakan caption & keyword siap unggah.',
      },
    ],
    contacts: [
      { label: 'Account manager', value: '+62 857 7000 4411' },
      { label: 'WhatsApp', value: '+86 132 1615 6841' },
      { label: 'Email', value: 'pl-id@karn-materials.com' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/id/solutions/private-label-indonesia',
      name: 'Private label lem Indonesia',
      description: 'Solusi private label lengkap dengan label BI, halal, dan toolkit kampanye marketplace.',
    },
  },
  {
    slug: 'application-training-hangzhou',
    lang: 'zh',
    category: 'training',
    marketLabel: '杭州 · 施工实验室',
    hero: {
      eyebrow: '现场/远程联动',
      title: '墙纸胶应用培训与技术交底',
      subtitle:
        '面向经销商、工程公司提供 1 日线下培训 + 30 天远程答疑，覆盖基层处理、配比、常见问题与售后 SOP。',
      highlights: ['提供三语教材', '可带施工队参观', '附现场测试视频'],
      stats: [
        { label: '培训时长', value: '6 小时' },
        { label: '班级人数', value: '≤20 人' },
        { label: '远程支持', value: '30 天' },
      ],
      cta: { label: '预约培训档期', href: '/zh/contact' },
    },
    meta: {
      title: '墙纸胶应用培训 | Hangzhou Karn',
      description: '杭州工厂开放实验室，提供墙纸胶施工培训、FAQ 模板与售后脚本。',
      keywords: ['墙纸胶培训', '施工交底', 'OEM 技术支持'],
    },
    positioning: {
      summary: '帮助经销商快速复制标准化施工队，降低售后风险。',
      bullets: ['模块化课件 + 视频', '异常案例库', '售后答疑工单系统'],
    },
    features: [
      { icon: 'factory', title: '现场实验', description: '湿贴/干贴、不同基材对比测试。' },
      { icon: 'users', title: '双导师制', description: '产品经理 + 应用工程师联合授课。' },
      { icon: 'clock', title: '售后响应', description: '开通专属微信群，30 分钟内答疑。' },
      { icon: 'award', title: '结业认证', description: '发放结业证书与案例 PPT 可复用。' },
    ],
    timeline: [
      { title: '课前调研', description: '收集现有问题、区域气候、产品组合', duration: 'T-7' },
      { title: '线下实训', description: '在杭州基地完成 6 小时训练营', duration: 'Day 0' },
      { title: '复盘资料', description: '输出测试视频、FAQ PDF、现场记录', duration: 'Day +2' },
      { title: '远程陪跑', description: '30 天线上答疑与工单跟踪', duration: 'Day +3~+30' },
    ],
    deliverables: ['课程 PPT+视频', 'FAQ 手册', '施工质检清单', '售后话术脚本'],
    faqs: [
      {
        question: '是否支持外地场地？',
        answer: '可派驻讲师到重点城市，需承担差旅。',
      },
      {
        question: '培训语言有哪些？',
        answer: '提供中文/英文/俄文三语讲义，可现场翻译越南/泰文。',
      },
      {
        question: '能带客户一起参加吗？',
        answer: '可以，需提前报备人员名单与拍摄需求。',
      },
    ],
    contacts: [
      { label: '技术支持', value: '+86 571-8888 5566' },
      { label: '邮箱', value: 'support@karn-materials.com' },
      { label: '培训地址', value: '杭州市余杭区东湖街道星桥路18号' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/zh/solutions/application-training-hangzhou',
      name: '墙纸胶应用培训',
      description: '线下实训 + 30 天远程答疑的墙纸胶应用培训计划。',
    },
  },
  {
    slug: 'application-training-russia',
    lang: 'ru',
    category: 'training',
    marketLabel: 'Россия · техподдержка',
    hero: {
      eyebrow: 'Русский методический пакет',
      title: 'Программа обучения монтажников обойного клея',
      subtitle:
        'Русскоязычные вебинары + выездные воркшопы для партнёров в Москве/СПб, включают чек-листы и видеоинструкции.',
      highlights: ['Запись вебинара', 'Личный чат Telegram', 'FAQ на 30 вопросов'],
      stats: [
        { label: 'Вебинар', value: '90 мин' },
        { label: 'On-site', value: '1 день' },
        { label: 'Поддержка', value: '45 дней' },
      ],
      cta: { label: 'Забронировать обучение', href: '/ru/contact' },
    },
    meta: {
      title: 'Обучение применению клея',
      description: 'Воркшопы и вебинары по нанесению клея, работе в холодном климате и регламенту сервиса.',
      keywords: ['обучение монтажников', 'техподдержка клея', 'workshop клей для обоев'],
    },
    positioning: {
      summary: 'Подходит для дилеров, которые развивают сервисные команды и хотят снизить рекламации.',
      bullets: ['Шаблоны актов и гарантий', 'Видео для LMS', 'Техническая линия 24/7'],
    },
    features: [
      { icon: 'users', title: 'Native тренеры', description: 'Инженер + технолог говорят по-русски.' },
      { icon: 'globe', title: 'Климат адаптация', description: 'Методики для -30℃ и сухих помещений.' },
      { icon: 'shield', title: 'Case-база', description: '50 кейсов с причинами отказа и решением.' },
      { icon: 'clock', title: 'Service desk', description: 'Система тикетов с SLA 4 часа.' },
    ],
    timeline: [
      { title: 'Диагностика', description: 'Интервью с сервисной командой', duration: 'Неделя -2' },
      { title: 'Вебинар', description: 'Онлайн-сессия + тестирование', duration: 'День 0' },
      { title: 'Очный воркшоп', description: 'Практика + съёмка видео', duration: 'День +7' },
      { title: 'Сопровождение', description: '45 дней тикетов/чатов', duration: 'День +8~+45' },
    ],
    deliverables: ['Методичка PDF', 'Видеоинструкции', 'Чек-лист сервиса', 'Шаблон FAQ'],
    faqs: [
      {
        question: 'Можно ли провести в регионах?',
        answer: 'Да, при наборе ≥15 человек оплачиваем выезд инструктора.',
      },
      {
        question: 'Как фиксируете знания?',
        answer: 'Онлайн-тест + сертификат с QR проверкой.',
      },
      {
        question: 'Поддерживаете маркетплейсы?',
        answer: 'Да, даём скрипты для консультаций покупателей WB/Ozon.',
      },
    ],
    contacts: [
      { label: 'Tech desk RU', value: '+7 495 181-25-60' },
      { label: 'Telegram', value: '@karn_support' },
      { label: 'Email', value: 'support-ru@karn-materials.com' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/ru/solutions/application-training-russia',
      name: 'Обучение по применению клея',
      description: 'Русскоязычные вебинары и воркшопы с поддержкой 45 дней.',
    },
  },
  {
    slug: 'application-training-vietnam',
    lang: 'vi',
    category: 'training',
    marketLabel: 'Việt Nam · coaching onsite',
    hero: {
      eyebrow: 'Workshop + video library',
      title: 'Chương trình đào tạo thi công keo dán tường',
      subtitle:
        'Giải pháp 2 ngày tại TP.HCM/Hà Nội + thư viện video tiếng Việt, bao gồm checklist QC và hotline kỹ thuật.',
      highlights: ['Tài liệu song ngữ', 'Livestream cho đội tỉnh', 'Nhật ký sự cố mẫu'],
      stats: [
        { label: 'Thời lượng workshop', value: '2 ngày' },
        { label: 'Số video', value: '15' },
        { label: 'Hotline', value: '24/7' },
      ],
      cta: { label: 'Đặt lịch đào tạo', href: '/vi/contact' },
    },
    meta: {
      title: 'Đào tạo thi công keo dán tường',
      description: 'Workshop tại Việt Nam + video + hotline giúp đội thi công giảm lỗi bong tróc.',
      keywords: ['đào tạo keo dán tường', 'workshop OEM', 'hỗ trợ kỹ thuật CMS'],
    },
    positioning: {
      summary: 'Dành cho đại lý tỉnh/thầu thi công cần hướng dẫn chuẩn hóa quy trình.',
      bullets: ['Checklist vật tư/nhân sự', 'Kịch bản xử lý khiếu nại', 'Ghi hình thực tế tại công trình'],
    },
    features: [
      { icon: 'factory', title: 'Demo thực tế', description: 'Dán trên tường xi măng, thạch cao, gạch men.' },
      { icon: 'users', title: 'Coach song ngữ', description: 'Kỹ sư Trung-Việt phụ trách từng nhóm.' },
      { icon: 'clock', title: 'SLA hỗ trợ', description: 'Phản hồi lỗi trong 2 giờ qua Zalo.' },
      { icon: 'award', title: 'Chứng nhận', description: 'Cấp chứng chỉ kỹ thuật viên + huy hiệu digital.' },
    ],
    timeline: [
      { title: 'Khảo sát', description: 'Phỏng vấn đội thi công, thu video lỗi', duration: 'T-10' },
      { title: 'Workshop 2 ngày', description: 'Ngày 1 lý thuyết, ngày 2 demo & ghi hình', duration: 'Day 0-1' },
      { title: 'Bàn giao thư viện', description: 'Upload video, checklist, template báo cáo', duration: 'Day +2' },
      { title: 'Coaching ảo', description: 'Theo dõi công trình đầu tiên trong 30 ngày', duration: 'Day +3~+30' },
    ],
    deliverables: ['Video hướng dẫn', 'Checklist QC', 'Kịch bản chăm sóc khách', 'Mẫu báo cáo sự cố'],
    faqs: [
      {
        question: 'Có dạy online không?',
        answer: 'Chúng tôi livestream song song để đội tỉnh tham gia.',
      },
      {
        question: 'Sau 30 ngày có hỗ trợ nữa không?',
        answer: 'Có gói retainer 6 tháng cho đại lý trọng điểm.',
      },
      {
        question: 'Có thể dùng cho OEM khác?',
        answer: 'Nội dung tập trung vào CMS của Karn nhưng có thể tham chiếu.',
      },
    ],
    contacts: [
      { label: 'Support VN', value: '+84 28 9999 5577' },
      { label: 'Zalo kỹ thuật', value: '+84 90 445 8899' },
      { label: 'Email', value: 'support-vn@karn-materials.com' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/vi/solutions/application-training-vietnam',
      name: 'Đào tạo thi công keo',
      description: 'Workshop + thư viện video tiếng Việt cho đội thi công.',
    },
  },
  {
    slug: 'application-training-thailand',
    lang: 'th',
    category: 'training',
    marketLabel: 'Thailand · onsite clinic',
    hero: {
      eyebrow: 'Bilingual trainer',
      title: 'โปรแกรมอบรมการใช้งานกาววอลเปเปอร์',
      subtitle:
        'ทีมวิศวกรไทย-จีนจัดคลินิก 1 วันในกรุงเทพฯ + Onsite co-pilot ที่ไซต์งานสำคัญ พร้อมคู่มือภาษาไทยเต็มรูปแบบ.',
      highlights: ['Live demo', 'LINE OA support', 'Work order template'],
      stats: [
        { label: 'ระยะเวลาคลินิก', value: '1 วัน' },
        { label: 'จํานวนทีม/รอบ', value: '5 ทีม' },
        { label: 'ช่วง support', value: '21 วัน' },
      ],
      cta: { label: 'จองคลินิก', href: '/th/contact' },
    },
    meta: {
      title: 'อบรมการใช้กาววอลเปเปอร์',
      description: 'คลินิกภาคสนาม + LINE support + คู่มือไทย ลดปัญหางานซ่อม.',
      keywords: ['อบรมกาววอลเปเปอร์', 'application training', 'OEM Karn Thailand'],
    },
    positioning: {
      summary: 'ออกแบบให้ผู้รับเหมาหรือดีลเลอร์ที่ต้องส่งทีมเข้าโครงการคอนโด/โรงแรม.',
      bullets: ['Site assessment checklist', 'Warranty SOP ภาษาไทย', 'คู่มือวัสดุ + tools'],
    },
    features: [
      { icon: 'truck', title: 'Onsite co-pilot', description: 'ทีมเราลงหน้างานเคียงข้างรอบแรก.' },
      { icon: 'clock', title: 'LINE SLA', description: 'ตอบคำถามภายใน 1 ชั่วโมงผ่าน LINE OA.' },
      { icon: 'shield', title: 'Safety focus', description: 'สคริปต์ความปลอดภัยและ PPE รายการ.' },
      { icon: 'award', title: 'Certificate', description: 'ออกใบรับรองให้ทีมงาน 2 ภาษา.' },
    ],
    timeline: [
      { title: 'Pre-site audit', description: 'เยี่ยมหน้างาน/เช็คพื้นผิว', duration: 'Day -5' },
      { title: 'Training day', description: 'สอน + demo + บันทึกวิดีโอ', duration: 'Day 0' },
      { title: 'Delivery kit', description: 'ส่งคู่มือ/วิดีโอ/แผ่น QA', duration: 'Day +2' },
      { title: 'Follow-up', description: 'LINE support + onsite spot check', duration: 'Day +3~+21' },
    ],
    deliverables: ['คู่มือไทย', 'Template รายงานไซต์', 'Checklist QA', 'วิดีโอสรุป'],
    faqs: [
      {
        question: 'เดินทางต่างจังหวัดได้ไหม?',
        answer: 'ได้ หากรวมค่าวันเดินทางและที่พักตามจริง.',
      },
      {
        question: 'อบรมได้กี่ภาษา?',
        answer: 'ไทย/อังกฤษมาตรฐาน และมีล่ามจีนเมื่อจำเป็น.',
      },
      {
        question: 'รวมอุปกรณ์ทดลองไหม?',
        answer: 'ทีมเราพก sample kit + กล้อง thermal สำหรับ QC.',
      },
    ],
    contacts: [
      { label: 'Training TH', value: '+66 80 555 3232' },
      { label: 'LINE OA', value: '@karntech' },
      { label: 'Email', value: 'support-th@karn-materials.com' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/th/solutions/application-training-thailand',
      name: 'โปรแกรมอบรมกาววอลเปเปอร์',
      description: 'คลินิกภาคสนาม + LINE support 21 วันสำหรับผู้รับเหมาไทย.',
    },
  },
  {
    slug: 'application-training-indonesia',
    lang: 'id',
    category: 'training',
    marketLabel: 'Indonesia · field squad',
    hero: {
      eyebrow: 'Hybrid coaching',
      title: 'Program pelatihan aplikasi lem wallpaper',
      subtitle:
        'Bootcamp 1 hari di Jakarta + kunjungan lapangan pertama, lengkap dengan modul Bahasa Indonesia dan grup WhatsApp SLA 1 jam.',
      highlights: ['Workbook BI', 'Video troubleshooting', 'Checklist garansi'],
      stats: [
        { label: 'Durasi bootcamp', value: '1 hari' },
        { label: 'Kunjungan lapangan', value: '1x' },
        { label: 'SLA support', value: '1 jam' },
      ],
      cta: { label: 'Minta jadwal pelatihan', href: '/id/contact' },
    },
    meta: {
      title: 'Pelatihan aplikasi lem wallpaper',
      description: 'Bootcamp + kunjungan lapangan + grup WhatsApp membantu tim teknis Indonesia.',
      keywords: ['pelatihan lem wallpaper', 'training OEM', 'dukungan teknis Karn'],
    },
    positioning: {
      summary: 'Ditujukan untuk dealer/proyek yang memerlukan SOP pemasangan konsisten.',
      bullets: ['Modul step-by-step', 'Simulasi keluhan pelanggan', 'Pipeline tiket garansi'],
    },
    features: [
      { icon: 'users', title: 'Coach bilingual', description: 'Engineer CN + fasilitator lokal BI.' },
      { icon: 'truck', title: 'Field shadowing', description: 'Tim kami mendampingi proyek pertama.' },
      { icon: 'clock', title: 'WhatsApp SLA', description: 'Respon maksimal 60 menit jam kerja.' },
      { icon: 'shield', title: 'Warranty kit', description: 'Form garansi, SOP klaim, kartu pelanggan.' },
    ],
    timeline: [
      { title: 'Assessment', description: 'Survey skill & kebutuhan proyek', duration: 'Minggu -1' },
      { title: 'Bootcamp', description: 'Materi kelas + demo langsung', duration: 'Hari 0' },
      { title: 'Field mentoring', description: 'Pendampingan proyek perdana', duration: 'Hari +3' },
      { title: 'Monitoring', description: 'Grup WA + review mingguan 30 hari', duration: 'Hari +4~+30' },
    ],
    deliverables: ['Modul BI', 'Video demo', 'Checklist garansi', 'Laporan evaluasi'],
    faqs: [
      {
        question: 'Apakah ada sertifikat?',
        answer: 'Ya, peserta dapat e-sertifikat + kartu badge teknisi.',
      },
      {
        question: 'Berapa orang per sesi?',
        answer: 'Ideal 15 orang agar hands-on maksimal.',
      },
      {
        question: 'Bisa onsite di luar Jakarta?',
        answer: 'Bisa, biaya perjalanan ditagihkan terpisah.',
      },
    ],
    contacts: [
      { label: 'Tech ID', value: '+62 878 8881 6000' },
      { label: 'WhatsApp group', value: 'invite by sales' },
      { label: 'Email', value: 'support-id@karn-materials.com' },
    ],
    structuredData: {
      url: 'https://kn-wallpaperglue.com/id/solutions/application-training-indonesia',
      name: 'Pelatihan aplikasi lem',
      description: 'Bootcamp + kunjungan lapangan + dukungan WhatsApp 30 hari.',
    },
  },
];

export type SolutionPageDictionary = Record<string, SolutionPageContent[]>;

export const solutionDictionaryBySlug: SolutionPageDictionary = solutionLandingPages.reduce(
  (acc, page) => {
    acc[page.slug] = acc[page.slug] ? [...acc[page.slug], page] : [page];
    return acc;
  },
  {} as SolutionPageDictionary,
);

export const supportedSolutionLanguages = Array.from(
  new Set(solutionLandingPages.map(page => page.lang)),
) as SiteLanguage[];

export type SolutionIconMap = Record<FeatureIcon, LucideIcon>;
