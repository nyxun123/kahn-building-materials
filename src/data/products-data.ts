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
  name_vi: string;
  name_th: string;
  name_id: string;
  description_zh: string;
  description_en: string;
  description_ru: string;
  description_vi: string;
  description_th: string;
  description_id: string;
  features_zh: string[];
  features_en: string[];
  features_ru: string[];
  features_vi: string[];
  features_th: string[];
  features_id: string[];
  specs_zh: ProductSpec[];
  specs_en: ProductSpec[];
  specs_ru: ProductSpec[];
  specs_vi: ProductSpec[];
  specs_th: ProductSpec[];
  specs_id: ProductSpec[];
  applications_zh: string;
  applications_en: string;
  applications_ru: string;
  applications_vi: string;
  applications_th: string;
  applications_id: string;
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
    name_vi: 'Tinh bột Carboxymethyl K6 cho In ấn & Nhuộm Dệt',
    name_th: 'แป้งคาร์บอกซีเมทิล K6 สำหรับงานพิมพ์และย้อมผ้า',
    name_id: 'Carboxymethyl Starch K6 untuk Pencetakan & Pewarnaan Tekstil',

    description_zh: '专为纺织印染行业设计的高性能羧甲基淀粉，具有优异的增稠性能和良好的渗透性，是印花糊料和染色工艺的理想选择。',
    description_en: 'High-performance carboxymethyl starch designed for textile printing and dyeing industry, featuring excellent thickening performance and good penetration, ideal for printing paste and dyeing processes.',
    description_ru: 'Высокопроизводительный карбоксиметилкрахмал, разработанный для текстильной промышленности, с отличными загущающими свойствами и хорошим проникновением, идеально подходит для печатных паст и процессов крашения.',
    description_vi: 'Tinh bột Carboxymethyl hiệu suất cao được thiết kế cho ngành in nhuộm dệt may, có khả năng làm đặc tuyệt vời và độ thẩm thấu tốt, lý tưởng cho hồ in và quy trình nhuộm.',
    description_th: 'แป้งคาร์บอกซีเมทิลประสิทธิภาพสูงที่ออกแบบมาสำหรับอุตสาหกรรมการพิมพ์และย้อมผ้า มีคุณสมบัติในการเพิ่มความข้นที่ยอดเยี่ยมและการแทรกซึมที่ดี เหมาะสำหรับแป้งพิมพ์และกระบวนการย้อมสี',
    description_id: 'Carboxymethyl starch berkinerja tinggi yang dirancang untuk industri pencetakan dan pewarnaan tekstil, menampilkan kinerja pengentalan yang sangat baik dan penetrasi yang baik, ideal untuk pasta pencetakan dan proses pewarnaan.',

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
    features_vi: [
      'Hiệu suất làm đặc tuyệt vời đảm bảo phân bố thuốc nhuộm đồng đều',
      'Độ thẩm thấu tốt cải thiện độ bền màu',
      'Họa tiết in rõ ràng và chi tiết',
      'Dễ dàng giặt sạch cặn',
      'Khả năng chống muối và kiềm tuyệt vời',
      'Chất lượng sản phẩm ổn định với sự thay đổi theo lô tối thiểu'
    ],
    features_th: [
      'ประสิทธิภาพการเพิ่มความข้นที่ยอดเยี่ยมช่วยให้การกระจายตัวของสีย้อมสม่ำเสมอ',
      'การแทรกซึมที่ดีช่วยปรับปรุงความคงทนของสี',
      'ลายพิมพ์ที่ชัดเจนและละเอียด',
      'ล้างสิ่งตกค้างออกได้ง่าย',
      'ความต้านทานต่อเกลือและด่างที่ยอดเยี่ยม',
      'คุณภาพผลิตภัณฑ์ที่เสถียรมีความแปรปรวนน้อยที่สุดในแต่ละชุด'
    ],
    features_id: [
      'Kinerja pengentalan yang sangat baik memastikan distribusi pewarna yang seragam',
      'Penetrasi yang baik meningkatkan ketahanan warna',
      'Pola pencetakan yang jelas dan detail',
      'Mudah mencuci sisa residu',
      'Ketahanan garam dan alkali yang sangat baik',
      'Kualitas produk stabil dengan variasi batch minimal'
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
    specs_vi: [
      { label: 'Mẫu', value: 'K6' },
      { label: 'Dạng', value: 'Vảy, dung dịch 5%' },
      { label: 'Độ nhớt quay', value: '30,000-38,000 mPa·s (Rotor số 4 / 6 vòng/phút)' },
      { label: 'Độ thay thế', value: '0.4' },
      { label: 'Giá trị pH', value: '8-11' },
      { label: 'Độ hòa tan', value: 'Hòa tan tức thì' },
      { label: 'Máy đo độ nhớt', value: 'NDJ-8' },
      { label: 'Ngoại quan', value: 'Vảy' }
    ],
    specs_th: [
      { label: 'รุ่น', value: 'K6' },
      { label: 'รูปแบบ', value: 'เกล็ด, สารละลาย 5%' },
      { label: 'ความหนืดแบบหมุน', value: '30,000-38,000 mPa·s (โรเตอร์เบอร์ 4 / 6 รอบต่อนาที)' },
      { label: 'ระดับการแทนที่', value: '0.4' },
      { label: 'ค่า pH', value: '8-11' },
      { label: 'การละลาย', value: 'ละลายทันที' },
      { label: 'เครื่องวัดความหนืด', value: 'NDJ-8' },
      { label: 'ลักษณะภายนอก', value: 'เกล็ด' }
    ],
    specs_id: [
      { label: 'Model', value: 'K6' },
      { label: 'Bentuk', value: 'Serpihan, larutan 5%' },
      { label: 'Viskositas rotasi', value: '30.000-38.000 mPa·s (Rotor No.4 / 6 rpm)' },
      { label: 'Derajat substitusi', value: '0,4' },
      { label: 'Nilai pH', value: '8-11' },
      { label: 'Kelarutan', value: 'Larut instan' },
      { label: 'Viskometer', value: 'NDJ-8' },
      { label: 'Penampilan', value: 'Serpihan' }
    ],

    applications_zh: '广泛应用于纺织品印花糊料、染色工艺增稠、活性染料印染、防染印花工艺等领域。适用于各种纤维材质的印花和染色，包括棉、麻、丝、化纤等。',
    applications_en: 'Widely used in textile printing paste, dyeing process thickening, reactive dye printing, resist printing processes, etc. Suitable for printing and dyeing of various fiber materials including cotton, linen, silk, chemical fibers, etc.',
    applications_ru: 'Широко используется в текстильных печатных пастах, загущении процессов крашения, печати активными красителями, резистной печати и т.д. Подходит для печати и крашения различных волокнистых материалов, включая хлопок, лен, шелк, химические волокна и т.д.',
    applications_vi: 'Được sử dụng rộng rãi trong hồ in dệt, làm đặc quy trình nhuộm, in nhuộm hoạt tính, quy trình in cản màu, v.v. Thích hợp cho in và nhuộm các vật liệu sợi khác nhau bao gồm bông, lanh, lụa, sợi hóa học, v.v.',
    applications_th: 'ใช้กันอย่างแพร่หลายในแป้งพิมพ์สิ่งทอ การเพิ่มความข้นในกระบวนการย้อมสี การพิมพ์สีรีแอคทีฟ กระบวนการพิมพ์ต้านทาน ฯลฯ เหมาะสำหรับการพิมพ์และย้อมวัสดุเส้นใยต่างๆ รวมถึงฝ้าย ลินิน ไหม เส้นใยเคมี ฯลฯ',
    applications_id: 'Digunakan secara luas dalam pasta pencetakan tekstil, pengentalan proses pewarnaan, pencetakan pewarna reaktif, proses pencetakan resist, dll. Cocok untuk pencetakan dan pewarnaan berbagai bahan serat termasuk katun, linen, sutra, serat kimia, dll.',

    image_url: '/images/应用领域/纺织印染.jpg',
    category: 'textile'
  },

  'wallpaper-adhesive': {
    product_code: '999',
    name_zh: '墙纸胶粉专用羧甲基淀粉 999',
    name_en: 'Carboxymethyl Starch 999 for Wallpaper Adhesive',
    name_ru: 'Карбоксиметилкрахмал 999 для обойного клея',
    name_vi: 'Tinh bột Carboxymethyl 999 cho Keo dán Giấy dán tường',
    name_th: 'แป้งคาร์บอกซีเมทิล 999 สำหรับกาวติดวอลเปเปอร์',
    name_id: 'Carboxymethyl Starch 999 untuk Perekat Wallpaper',

    description_zh: '专为墙纸胶粉行业设计的高粘度羧甲基淀粉，粘接强度高，施工性能优异，是专业墙纸胶粉的核心原料。环保健康，防霉抗菌，适合各类墙纸粘贴。',
    description_en: 'High-viscosity carboxymethyl starch designed for wallpaper adhesive powder industry, featuring high bonding strength and excellent workability, the core raw material for professional wallpaper adhesive powder. Eco-friendly, healthy, anti-mold and antibacterial, suitable for all types of wallpaper application.',
    description_ru: 'Высоковязкий карбоксиметилкрахмал, разработанный для производства обойного клея, с высокой прочностью сцепления и отличной удобоукладываемостью, основное сырье для профессионального обойного клея. Экологически чистый, здоровый, противоплесневый и антибактериальный, подходит для всех типов обоев.',
    description_vi: 'Tinh bột carboxymethyl độ nhớt cao được thiết kế cho ngành bột keo dán giấy dán tường, có độ kết dính cao và khả năng thi công tuyệt vời, là nguyên liệu cốt lõi cho bột keo dán giấy dán tường chuyên nghiệp. Thân thiện với môi trường, lành mạnh, chống nấm mốc và kháng khuẩn, thích hợp cho mọi loại giấy dán tường.',
    description_th: 'แป้งคาร์บอกซีเมทิลความหนืดสูงที่ออกแบบมาสำหรับอุตสาหกรรมผงกาววอลเปเปอร์ มีความแข็งแรงในการยึดติดสูงและความสามารถในการทำงานที่ยอดเยี่ยม เป็นวัตถุดิบหลักสำหรับผงกาววอลเปเปอร์มืออาชีพ เป็นมิตรกับสิ่งแวดล้อม สุขภาพดี ป้องกันเชื้อราและแบคทีเรีย เหมาะสำหรับการติดวอลเปเปอร์ทุกประเภท',
    description_id: 'Carboxymethyl starch viskositas tinggi yang dirancang untuk industri bubuk perekat wallpaper, menampilkan kekuatan ikatan tinggi dan kemampuan kerja yang sangat baik, bahan baku inti untuk bubuk perekat wallpaper profesional. Ramah lingkungan, sehat, anti-jamur dan anti-bakteri, cocok untuk semua jenis aplikasi wallpaper.',

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
    features_vi: [
      'Độ nhớt cực cao 65.000±10% mPa·s, độ kết dính tuyệt vời',
      'Tạo thành dung dịch keo đồng nhất và ổn định khi hòa tan trong nước',
      'Độ dính ban đầu tốt và độ bền kết dính cuối cùng cao',
      'Dễ dàng điều chỉnh trong quá trình thi công, kết dính chắc chắn sau khi khô',
      'Đặc tính chống nấm mốc và kháng khuẩn tuyệt vời',
      'Thân thiện với môi trường và lành mạnh, không chứa formaldehyde',
      'Dịch vụ OEM có sẵn trong các quy cách 200g, 500g, 1kg và các quy cách khác'
    ],
    features_th: [
      'ความหนืดสูงพิเศษ 65,000±10% mPa·s ความแข็งแรงในการยึดติดที่ยอดเยี่ยม',
      'สร้างสารละลายกาวที่สม่ำเสมอและเสถียรเมื่อละลายในน้ำ',
      'การยึดเกาะเริ่มต้นที่ดีและความแข็งแรงในการยึดติดขั้นสุดท้ายสูง',
      'ปรับได้ง่ายระหว่างการก่อสร้าง ยึดติดแน่นหลังจากแห้ง',
      'คุณสมบัติป้องกันเชื้อราและแบคทีเรียที่ยอดเยี่ยม',
      'เป็นมิตรกับสิ่งแวดล้อมและสุขภาพ ปราศจากฟอร์มาลดีไฮด์',
      'บริการ OEM มีให้ในขนาด 200g, 500g, 1kg และข้อกำหนดอื่นๆ'
    ],
    features_id: [
      'Viskositas ultra-tinggi 65.000±10% mPa·s, kekuatan ikatan yang sangat baik',
      'Membentuk larutan perekat yang seragam dan stabil saat dilarutkan dalam air',
      'Daya rekat awal yang baik dan kekuatan ikatan akhir yang tinggi',
      'Mudah disesuaikan selama konstruksi, terikat kuat setelah kering',
      'Sifat anti-jamur dan anti-bakteri yang sangat baik',
      'Ramah lingkungan dan sehat, bebas formaldehida',
      'Layanan OEM tersedia dalam spesifikasi 200g, 500g, 1kg dan lainnya'
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
    specs_vi: [
      { label: 'Mẫu', value: '999' },
      { label: 'Nồng độ dung dịch', value: '5%' },
      { label: 'Máy đo độ nhớt', value: 'Máy đo độ nhớt quay NDJ-8' },
      { label: 'Điều kiện thử nghiệm', value: 'Rotor số 4, 6 vòng/phút' },
      { label: 'Phạm vi độ nhớt', value: '65.000±10% mPa·s' },
      { label: 'Ngoại quan', value: 'Vảy' },
      { label: 'Độ hòa tan', value: 'Dễ dàng hòa tan trong nước' }
    ],
    specs_th: [
      { label: 'รุ่น', value: '999' },
      { label: 'ความเข้มข้นสารละลาย', value: '5%' },
      { label: 'เครื่องวัดความหนืด', value: 'เครื่องวัดความหนืดแบบหมุน NDJ-8' },
      { label: 'เงื่อนไขการทดสอบ', value: 'โรเตอร์เบอร์ 4, 6 รอบต่อนาที' },
      { label: 'ช่วงความหนืด', value: '65,000±10% mPa·s' },
      { label: 'ลักษณะภายนอก', value: 'เกล็ด' },
      { label: 'การละลาย', value: 'ละลายในน้ำได้ง่าย' }
    ],
    specs_id: [
      { label: 'Model', value: '999' },
      { label: 'Konsentrasi larutan', value: '5%' },
      { label: 'Viskometer', value: 'Viskometer Rotasi NDJ-8' },
      { label: 'Kondisi pengujian', value: 'Rotor No.4, 6 rpm' },
      { label: 'Rentang viskositas', value: '65.000±10% mPa·s' },
      { label: 'Penampilan', value: 'Serpihan' },
      { label: 'Kelarutan', value: 'Mudah larut dalam air' }
    ],

    applications_zh: '专用于墙纸胶粉生产、壁纸粘贴剂、高端壁纸专用胶、防霉墙纸胶等领域。适合各种材质墙纸的粘贴，包括纯纸、无纺布、PVC、纤维壁纸等。提供专业的OEM定制服务，可根据客户需求调整粘度、取代度等参数。',
    applications_en: 'Specially designed for wallpaper adhesive powder production, wall covering paste, premium wallpaper adhesive, anti-mold wallpaper glue, etc. Suitable for adhesion of various wallpaper materials including pure paper, non-woven fabric, PVC, fiber wallpaper, etc. Professional OEM customization services available, can adjust viscosity, degree of substitution and other parameters according to customer needs.',
    applications_ru: 'Специально разработан для производства обойного клея, клея для настенных покрытий, клея для премиальных обоев, противоплесневого обойного клея и т.д. Подходит для приклеивания различных материалов обоев, включая чистую бумагу, нетканые материалы, ПВХ, волокнистые обои и т.д. Доступны профессиональные услуги OEM-настройки, можно регулировать вязкость, степень замещения и другие параметры в соответствии с потребностями клиента.',
    applications_vi: 'Được thiết kế đặc biệt cho sản xuất bột keo dán giấy dán tường, hồ dán tường, keo dán giấy dán tường cao cấp, keo dán chống nấm mốc, v.v. Thích hợp để dán các vật liệu giấy dán tường khác nhau bao gồm giấy nguyên chất, vải không dệt, PVC, giấy dán tường sợi, v.v. Dịch vụ tùy chỉnh OEM chuyên nghiệp có sẵn, có thể điều chỉnh độ nhớt, độ thay thế và các thông số khác theo nhu cầu của khách hàng.',
    applications_th: 'ออกแบบมาเป็นพิเศษสำหรับการผลิตผงกาววอลเปเปอร์ กาวติดผนัง กาวติดวอลเปเปอร์พรีเมียม กาววอลเปเปอร์ป้องกันเชื้อรา ฯลฯ เหมาะสำหรับการติดวัสดุวอลเปเปอร์ต่างๆ รวมถึงกระดาษบริสุทธิ์ ผ้าไม่ทอ PVC วอลเปเปอร์ไฟเบอร์ ฯลฯ บริการปรับแต่ง OEM มืออาชีพ สามารถปรับความหนืด ระดับการแทนที่ และพารามิเตอร์อื่นๆ ตามความต้องการของลูกค้า',
    applications_id: 'Dirancang khusus untuk produksi bubuk perekat wallpaper, pasta penutup dinding, perekat wallpaper premium, lem wallpaper anti-jamur, dll. Cocok untuk adhesi berbagai bahan wallpaper termasuk kertas murni, kain non-woven, PVC, wallpaper serat, dll. Layanan kustomisasi OEM profesional tersedia, dapat menyesuaikan viskositas, derajat substitusi dan parameter lainnya sesuai kebutuhan pelanggan.',

    image_url: '/images/wallpaper-adhesive-final.jpg',
    category: 'wallpaper'
  },



  'construction-cms': {
    product_code: '8840',
    name_zh: '建筑材料专用羧甲基淀粉 8840',
    name_en: 'Carboxymethyl Starch 8840 for Construction Materials',
    name_ru: 'Карбоксиметилкрахмал 8840 для строительных материалов',
    name_vi: 'Tinh bột Carboxymethyl 8840 cho Vật liệu Xây dựng',
    name_th: 'แป้งคาร์บอกซีเมทิล 8840 สำหรับวัสดุก่อสร้าง',
    name_id: 'Carboxymethyl Starch 8840 untuk Bahan Bangunan',

    description_zh: '专为建筑材料行业设计的羧甲基淀粉，主要用于腻子粉、石膏基材料等产品。具有优异的保水性和粘结性能，能够显著改善建筑材料的施工性能和最终质量，防止开裂和粉化。',
    description_en: 'Carboxymethyl starch designed for construction materials industry, mainly used in putty powder, gypsum-based materials and other products. Features excellent water retention and bonding properties, significantly improving construction material workability and final quality, preventing cracking and powdering.',
    description_ru: 'Карбоксиметилкрахмал, разработанный для строительной индустрии, в основном используется в шпаклевке, гипсовых материалах и других продуктах. Обладает отличными водоудерживающими и связующими свойствами, значительно улучшая удобоукладываемость и конечное качество строительных материалов, предотвращая растрескивание и порошение.',
    description_vi: 'Tinh bột Carboxymethyl được thiết kế cho ngành vật liệu xây dựng, chủ yếu được sử dụng trong bột trét, vật liệu gốc thạch cao và các sản phẩm khác. Có tính năng giữ nước và kết dính tuyệt vời, cải thiện đáng kể khả năng thi công và chất lượng cuối cùng của vật liệu xây dựng, ngăn ngừa nứt và phấn hóa.',
    description_th: 'แป้งคาร์บอกซีเมทิลที่ออกแบบมาสำหรับอุตสาหกรรมวัสดุก่อสร้าง ส่วนใหญ่ใช้ในผงโป๊ว วัสดุฐานยิปซั่ม และผลิตภัณฑ์อื่นๆ มีคุณสมบัติในการกักเก็บน้ำและการยึดติดที่ยอดเยี่ยม ปรับปรุงความสามารถในการทำงานและคุณภาพสุดท้ายของวัสดุก่อสร้างอย่างมีนัยสำคัญ ป้องกันการแตกร้าวและการเป็นฝุ่น',
    description_id: 'Carboxymethyl starch yang dirancang untuk industri bahan bangunan, terutama digunakan dalam bubuk dempul, bahan berbasis gipsum dan produk lainnya. Menampilkan sifat retensi air dan ikatan yang sangat baik, secara signifikan meningkatkan kemampuan kerja bahan bangunan dan kualitas akhir, mencegah retak dan pengapuran.',

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
    features_vi: [
      'Khả năng giữ nước tuyệt vời, làm chậm quá trình bốc hơi nước',
      'Cải thiện độ bền kết dính giữa bột trét và bề mặt nền',
      'Ngăn ngừa nứt và phấn hóa',
      'Cải thiện độ chảy và khả năng thi công của vữa thạch cao',
      'Tăng cường khả năng chống nước và chống nứt',
      'Tương thích tốt với xi măng, thạch cao, vôi canxi và các vật liệu xây dựng khác',
      'Đáp ứng các tiêu chuẩn ngành xây dựng'
    ],
    features_th: [
      'การกักเก็บน้ำที่ยอดเยี่ยม ชะลอการระเหยของน้ำ',
      'ปรับปรุงความแข็งแรงในการยึดติดระหว่างสีโป๊วและพื้นผิว',
      'ป้องกันการแตกร้าวและการเป็นฝุ่น',
      'ปรับปรุงความลื่นไหลและความสามารถในการทำงานของสเลอรี่สยิปซั่ม',
      'เพิ่มความต้านทานน้ำและความต้านทานการแตกร้าว',
      'ความเข้ากันได้ดีกับปูนซีเมนต์ ยิปซั่ม ปูนขาวแคลเซียม และวัสดุก่อสร้างอื่นๆ',
      'ตรงตามมาตรฐานอุตสาหกรรมก่อสร้าง'
    ],
    features_id: [
      'Retensi air yang sangat baik, menunda penguapan air',
      'Meningkatkan kekuatan ikatan antara dempul dan substrat',
      'Mencegah retak dan pengapuran',
      'Meningkatkan fluiditas dan kemampuan kerja bubur gipsum',
      'Meningkatkan ketahanan air dan ketahanan retak',
      'Kompatibilitas yang baik dengan semen, gipsum, kalsium kapur dan bahan bangunan lainnya',
      'Memenuhi standar industri konstruksi'
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
    specs_vi: [
      { label: 'Mẫu', value: '8840' },
      { label: 'Nồng độ dung dịch', value: '5%' },
      { label: 'Máy đo độ nhớt', value: 'Máy đo độ nhớt quay' },
      { label: 'Điều kiện thử nghiệm', value: 'Rotor số 4, 12 vòng/phút' },
      { label: 'Phạm vi độ nhớt', value: '25.000±10% mPa·s' },
      { label: 'Giá trị pH', value: '9-11' },
      { label: 'Ngoại quan', value: 'Vảy' }
    ],
    specs_th: [
      { label: 'รุ่น', value: '8840' },
      { label: 'ความเข้มข้นสารละลาย', value: '5%' },
      { label: 'เครื่องวัดความหนืด', value: 'เครื่องวัดความหนืดแบบหมุน' },
      { label: 'เงื่อนไขการทดสอบ', value: 'โรเตอร์เบอร์ 4, 12 รอบต่อนาที' },
      { label: 'ช่วงความหนืด', value: '25,000±10% mPa·s' },
      { label: 'ค่า pH', value: '9-11' },
      { label: 'ลักษณะภายนอก', value: 'เกล็ด' }
    ],
    specs_id: [
      { label: 'Model', value: '8840' },
      { label: 'Konsentrasi larutan', value: '5%' },
      { label: 'Viskometer', value: 'Viskometer Rotasi' },
      { label: 'Kondisi pengujian', value: 'Rotor No.4, 12 rpm' },
      { label: 'Rentang viskositas', value: '25.000±10% mPa·s' },
      { label: 'Nilai pH', value: '9-11' },
      { label: 'Penampilan', value: 'Serpihan' }
    ],

    applications_zh: '广泛应用于内墙腻子粉、石膏基材料、墙面找平材料、装饰石膏制品等领域。作为保水剂和粘结剂，确保建筑材料在施工过程中保持适当湿度，防止因失水过快导致的开裂。提高建筑材料的施工性能和最终强度。',
    applications_en: 'Widely used in interior wall putty powder, gypsum-based materials, wall leveling materials, decorative gypsum products, etc. As a water retention agent and binder, ensures construction materials maintain appropriate moisture during construction, preventing cracking due to rapid water loss. Improves construction material workability and final strength.',
    applications_ru: 'Широко используется в шпаклевке для внутренних стен, гипсовых материалах, материалах для выравнивания стен, декоративных гипсовых изделиях и т.д. В качестве водоудерживающего агента и связующего обеспечивает сохранение соответствующей влажности строительных материалов во время строительства, предотвращая растрескивание из-за быстрой потери воды. Улучшает удобоукладываемость и конечную прочность строительных материалов.',
    applications_vi: 'Được sử dụng rộng rãi trong bột trét tường nội thất, vật liệu gốc thạch cao, vật liệu làm phẳng tường, sản phẩm thạch cao trang trí, v.v. Là chất giữ nước và chất kết dính, đảm bảo vật liệu xây dựng duy trì độ ẩm thích hợp trong quá trình thi công, ngăn ngừa nứt do mất nước nhanh. Cải thiện khả năng thi công và độ bền cuối cùng của vật liệu xây dựng.',
    applications_th: 'ใช้กันอย่างแพร่หลายในผงโป๊วผนังภายใน วัสดุฐานยิปซั่ม วัสดุปรับระดับผนัง ผลิตภัณฑ์ยิปซั่มตกแต่ง ฯลฯ ในฐานะสารกักเก็บน้ำและสารยึดเกาะ ช่วยให้มั่นใจว่าวัสดุก่อสร้างรักษาความชื้นที่เหมาะสมระหว่างการก่อสร้าง ป้องกันการแตกร้าวเนื่องจากการสูญเสียน้ำอย่างรวดเร็ว ปรับปรุงความสามารถในการทำงานและความแข็งแรงสุดท้ายของวัสดุก่อสร้าง',
    applications_id: 'Digunakan secara luas dalam bubuk dempul dinding interior, bahan berbasis gipsum, bahan perata dinding, produk gipsum dekoratif, dll. Sebagai agen penahan air dan pengikat, memastikan bahan bangunan menjaga kelembaban yang tepat selama konstruksi, mencegah retak akibat kehilangan air yang cepat. Meningkatkan kemampuan kerja dan kekuatan akhir bahan bangunan.',

    image_url: '/images/应用领域/腻子粉.jpg',
    category: 'construction'
  },

  'coating-cms': {
    product_code: 'K6',
    name_zh: '水性涂料专用羧甲基淀粉 K6',
    name_en: 'Carboxymethyl Starch K6 for Water-Based Coatings',
    name_ru: 'Карбоксиметилкрахмал K6 для водных красок',
    name_vi: 'Tinh bột Carboxymethyl K6 cho Sơn phủ Gốc nước',
    name_th: 'แป้งคาร์บอกซีเมทิล K6 สำหรับสีเคลือบสูตรน้ำ',
    name_id: 'Carboxymethyl Starch K6 untuk Pelapis Berbasis Air',

    description_zh: '专为水性涂料工业设计的增稠剂和流变改性剂，能够显著改善涂料的性能和施工效果。提供优异的增稠效果，改善涂料流变性能，使涂料具有良好的触变性和流平性。',
    description_en: 'Thickener and rheology modifier designed for water-based coatings industry, significantly improving coating performance and application effects. Provides excellent thickening effects, improves coating rheological properties, giving coatings good thixotropy and leveling.',
    description_ru: 'Загуститель и модификатор реологии, разработанный для индустрии водных покрытий, значительно улучшает характеристики покрытий и эффекты нанесения. Обеспечивает отличный загущающий эффект, улучшает реологические свойства покрытий, придавая покрытиям хорошую тиксотропию и растекание.',
    description_vi: 'Chất làm đặc và biến tính lưu biến được thiết kế cho ngành sơn phủ gốc nước, cải thiện đáng kể hiệu suất sơn và hiệu quả thi công. Cung cấp hiệu quả làm đặc tuyệt vời, cải thiện tính chất lưu biến của sơn, giúp sơn có tính thixotropy và độ san phẳng tốt.',
    description_th: 'สารเพิ่มความข้นและตัวปรับสภาพการไหลที่ออกแบบมาสำหรับอุตสาหกรรมสีเคลือบสูตรน้ำ ปรับปรุงประสิทธิภาพของสีและผลลัพธ์การใช้งานอย่างมีนัยสำคัญ ให้ผลลัพธ์การเพิ่มความข้นที่ยอดเยี่ยม ปรับปรุงคุณสมบัติการไหลของสี ทำให้สีมีคุณสมบัติ thixotropy และการปรับระดับที่ดี',
    description_id: 'Pengental dan pengubah reologi yang dirancang untuk industri pelapis berbasis air, secara signifikan meningkatkan kinerja pelapis dan efek aplikasi. Memberikan efek pengentalan yang sangat baik, meningkatkan sifat reologi pelapis, memberikan pelapis tiksotropi dan perataan yang baik.',

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
    features_vi: [
      'Hiệu quả làm đặc tuyệt vời, cải thiện tính chất lưu biến',
      'Tính thixotropy và độ san phẳng tốt',
      'Không bị chảy xệ khi thi công, quét mịn',
      'Tăng cường độ ổn định của lớp phủ, ngăn ngừa lắng cặn sắc tố',
      'Kéo dài thời hạn sử dụng của sơn',
      'Tương thích tốt với các loại nhựa gốc nước, sắc tố, chất độn khác nhau',
      'Tự nhiên, thân thiện với môi trường, không độc hại và vô hại'
    ],
    features_th: [
      'ผลการเพิ่มความข้นที่ยอดเยี่ยม ปรับปรุงคุณสมบัติทางรีโลยี',
      'Thixotropy และการปรับระดับที่ดี',
      'ไม่หย่อนคล้อยระหว่างการใช้งาน แปรงเรียบ',
      'เพิ่มความเสถียรของสี ป้องกันการตกตะกอนของเม็ดสี',
      'ยืดอายุการเก็บรักษาของสี',
      'ความเข้ากันได้ดีกับเรซินสูตรน้ำ เม็ดสี และสารเติมแต่งต่างๆ',
      'ธรรมชาติ เป็นมิตรกับสิ่งแวดล้อม ปราศจากสารพิษและไม่เป็นอันตราย'
    ],
    features_id: [
      'Efek pengentalan yang sangat baik, meningkatkan sifat reologi',
      'Tiksotropi dan perataan yang baik',
      'Tidak kendur selama aplikasi, penyikatan halus',
      'Meningkatkan stabilitas pelapis, mencegah sedimentasi pigmen',
      'Memperpanjang umur simpan pelapis',
      'Kompatibilitas yang baik dengan berbagai resin berbasis air, pigmen, pengisi',
      'Alami, ramah lingkungan, tidak beracun dan tidak berbahaya'
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
    specs_vi: [
      { label: 'Mẫu', value: 'K6' },
      { label: 'Dạng', value: 'Vảy, dung dịch 5%' },
      { label: 'Độ nhớt quay', value: '30,000-38,000 mPa·s (Rotor số 4 / 6 vòng/phút)' },
      { label: 'Độ thay thế', value: '0.4' },
      { label: 'Giá trị pH', value: '8-11' },
      { label: 'Độ hòa tan', value: 'Hòa tan tức thì' },
      { label: 'Máy đo độ nhớt', value: 'NDJ-8' },
      { label: 'Ngoại quan', value: 'Vảy' }
    ],
    specs_th: [
      { label: 'รุ่น', value: 'K6' },
      { label: 'รูปแบบ', value: 'เกล็ด, สารละลาย 5%' },
      { label: 'ความหนืดแบบหมุน', value: '30,000-38,000 mPa·s (โรเตอร์เบอร์ 4 / 6 รอบต่อนาที)' },
      { label: 'ระดับการแทนที่', value: '0.4' },
      { label: 'ค่า pH', value: '8-11' },
      { label: 'การละลาย', value: 'ละลายทันที' },
      { label: 'เครื่องวัดความหนืด', value: 'NDJ-8' },
      { label: 'ลักษณะภายนอก', value: 'เกล็ด' }
    ],
    specs_id: [
      { label: 'Model', value: 'K6' },
      { label: 'Bentuk', value: 'Serpihan, larutan 5%' },
      { label: 'Viskositas rotasi', value: '30.000-38.000 mPa·s (Rotor No.4 / 6 rpm)' },
      { label: 'Derajat substitusi', value: '0,4' },
      { label: 'Nilai pH', value: '8-11' },
      { label: 'Kelarutan', value: 'Larut instan' },
      { label: 'Viskometer', value: 'NDJ-8' },
      { label: 'Penampilan', value: 'Serpihan' }
    ],

    applications_zh: '广泛应用于水性乳胶漆、建筑涂料、内外墙涂料、水性木器漆等领域。适用于各种涂料体系，能够改善涂料的流变性能，使涂料具有良好的触变性和流平性。在施工时不易流挂，涂刷流畅，干燥后漆膜平整光滑。',
    applications_en: 'Widely used in water-based emulsion paints, architectural coatings, interior and exterior wall coatings, water-based wood coatings, etc. Suitable for various coating systems, improves coating rheological properties, giving coatings good thixotropy and leveling. No sagging during application, smooth brushing, flat and smooth paint film after drying.',
    applications_ru: 'Широко используется в водоэмульсионных красках, архитектурных покрытиях, красках для внутренних и наружных стен, водных красках для дерева и т.д. Подходит для различных систем покрытий, улучшает реологические свойства покрытий, придавая покрытиям хорошую тиксотропию и растекание. Не провисает при нанесении, гладкое нанесение кистью, плоская и гладкая пленка краски после высыхания.',
    applications_vi: 'Được sử dụng rộng rãi trong sơn nhũ tương gốc nước, sơn kiến trúc, sơn tường nội ngoại thất, sơn gỗ gốc nước, v.v. Thích hợp cho các hệ thống sơn khác nhau, cải thiện tính chất lưu biến của sơn, mang lại cho sơn tính thixotropy và độ san phẳng tốt. Không bị chảy xệ khi thi công, quét mịn, màng sơn phẳng và mịn sau khi khô.',
    applications_th: 'ใช้กันอย่างแพร่หลายในสีน้ำอะคริลิก สีเคลือบกสถาปัตยกรรม สีทาผนังภายในและภายนอก สีทาไม้สูตรน้ำ ฯลฯ เหมาะสำหรับระบบสีต่างๆ ปรับปรุงคุณสมบัติทางรีโลยีของสี ทำให้สีมีคุณสมบัติ thixotropy และการปรับระดับที่ดี ไม่หย่อนคล้อยระหว่างการใช้งาน แปรงเรียบ ฟิล์มสีเรียบและเนียนหลังจากแห้ง',
    applications_id: 'Digunakan secara luas dalam cat emulsi berbasis air, pelapis arsitektur, pelapis dinding interior dan eksterior, pelapis kayu berbasis air, dll. Cocok untuk berbagai sistem pelapis, meningkatkan sifat reologi pelapis, memberikan pelapis tiksotropi dan perataan yang baik. Tidak kendur selama aplikasi, penyikatan halus, film cat rata dan halus setelah kering.',

    image_url: '/images/应用领域/水性涂料.png',
    category: 'coating'
  },

  'desiccant-gel': {
    product_code: '8820-2',
    name_zh: '干燥剂凝胶锁水专用羧甲基淀粉 8820-2',
    name_en: 'Carboxymethyl Starch 8820-2 for Desiccant Gel Water-Locking',
    name_ru: 'Карбоксиметилкрахмал 8820-2 для осушающего геля',
    name_vi: 'Tinh bột Carboxymethyl 8820-2 cho Gel Khóa nước Chất hút ẩm',
    name_th: 'แป้งคาร์บอกซีเมทิล 8820-2 สำหรับเจลล็อคน้ำสารดูดความชื้น',
    name_id: 'Carboxymethyl Starch 8820-2 untuk Gel Pengunci Air Desikan',

    description_zh: '专为氯化钙干燥剂设计的凝胶锁水材料，由玉米淀粉改性而成。与氯化钙复配使用，能够将吸收的水分锁定成稳定的凝胶状态，防止液体泄漏，显著提升干燥剂的使用性能和安全性。',
    description_en: 'Gel water-locking material specially designed for calcium chloride desiccants, modified from corn starch. When combined with calcium chloride, it locks absorbed moisture into a stable gel state, preventing liquid leakage, significantly improving desiccant performance and safety.',
    description_ru: 'Гелевый водоудерживающий материал, специально разработанный для осушителей хлорида кальция, модифицированный из кукурузного крахмала. При сочетании с хлоридом кальция блокирует поглощенную влагу в стабильном гелевом состоянии, предотвращая утечку жидкости, значительно улучшая производительность и безопасность осушителя.',
    description_vi: 'Vật liệu gel khóa nước được thiết kế đặc biệt cho chất hút ẩm canxi clorua, được biến tính từ tinh bột ngô. Khi kết hợp với canxi clorua, nó khóa độ ẩm đã hấp thụ vào trạng thái gel ổn định, ngăn ngừa rò rỉ chất lỏng, cải thiện đáng kể hiệu suất và độ an toàn của chất hút ẩm.',
    description_th: 'วัสดุเจลล็อคน้ำที่ออกแบบมาเป็นพิเศษสำหรับสารดูดความชื้นแคลเซียมคลอไรด์ ดัดแปลงจากแป้งข้าวโพด เมื่อรวมกับแคลเซียมคลอไรด์ จะล็อคความชื้นที่ดูดซับไว้ในสถานะเจลที่เสถียร ป้องกันการรั่วไหลของของเหลว ปรับปรุงประสิทธิภาพและความปลอดภัยของสารดูดความชื้นอย่างมีนัยสำคัญ',
    description_id: 'Bahan pengunci air gel yang dirancang khusus untuk desikan kalsium klorida, dimodifikasi dari pati jagung. Bila dikombinasikan dengan kalsium klorida, ia mengunci kelembaban yang diserap ke dalam keadaan gel yang stabil, mencegah kebocoran cairan, secara significantly meningkatkan kinerja dan keamanan desikan.',

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
    features_vi: [
      'Hiệu suất khóa nước dạng gel tuyệt vời, ngăn ngừa rò rỉ chất lỏng',
      'Dung lượng hấp thụ bão hòa lên đến 250-300%, khả năng hút ẩm mạnh',
      'Biến tính từ tinh bột ngô chất lượng cao, tự nhiên và thân thiện với môi trường',
      'Công thức khoa học với tỷ lệ 35:65 với canxi clorua',
      'Trạng thái gel ổn định và lâu dài, không bị hóa lỏng ngay cả ở độ ẩm cao',
      'Sử dụng an toàn và đáng tin cậy, vô hại đối với con người và môi trường',
      'Được sử dụng rộng rãi trong chất hút ẩm gia dụng, công nghiệp và container'
    ],
    features_th: [
      'ประสิทธิภาพการล็อคน้ำแบบเจลที่ยอดเยี่ยม ป้องกันการรั่วไหลของของเหลว',
      'ความสามารถในการดูดซับอิ่มตัวสูงถึง 250-300% การดูดซับความชื้นที่แข็งแกร่ง',
      'ดัดแปลงจากแป้งข้าวโพดคุณภาพสูง ธรรมชาติและเป็นมิตรกับสิ่งแวดล้อม',
      'สูตรทางวิทยาศาสตร์ที่มีอัตราส่วน 35:65 กับแคลเซียมคลอไรด์',
      'สถานะเจลที่เสถียรและยาวนาน ไม่มีการเหลวตัวแม้ในความชื้นสูง',
      'การใช้งานที่ปลอดภัยและเชื่อถือได้ ไม่เป็นอันตรายต่อมนุษย์และสิ่งแวดล้อม',
      'ใช้กันอย่างแพร่หลายในสารดูดความชื้นในครัวเรือน อุตสาหกรรม และตู้คอนเทนเนอร์'
    ],
    features_id: [
      'Kinerja pengunci air gel yang sangat baik, mencegah kebocoran cairan',
      'Kapasitas penyerapan jenuh hingga 250-300%, penyerapan kelembaban yang kuat',
      'Dimodifikasi dari pati jagung berkualitas tinggi, alami dan ramah lingkungan',
      'Diformulasikan secara ilmiah dengan rasio 35:65 dengan kalsium klorida',
      'Keadaan gel yang stabil dan tahan lama, tidak ada pencairan bahkan pada kelembaban tinggi',
      'Penggunaan yang aman dan andal, tidak berbahaya bagi manusia dan lingkungan',
      'Digunakan secara luas dalam desikan rumah tangga, industri, dan kontainer'
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
    specs_vi: [
      { label: 'Mẫu', value: '8820-2' },
      { label: 'Nguyên liệu', value: 'Tinh bột ngô biến tính' },
      { label: 'Thành phần công thức', value: '35% CMS + 65% Canxi clorua' },
      { label: 'Hấp thụ bão hòa', value: '250-300%' },
      { label: 'Dạng gel', value: 'Trạng thái gel ổn định' },
      { label: 'Đặc tính sử dụng', value: 'Ngăn ngừa hóa lỏng và rò rỉ' },
      { label: 'An toàn', value: 'Không độc hại, vô hại, thân thiện với môi trường' }
    ],
    specs_th: [
      { label: 'รุ่น', value: '8820-2' },
      { label: 'วัตถุดิบ', value: 'แป้งข้าวโพดดัดแปลง' },
      { label: 'องค์ประกอบสูตร', value: '35% CMS + 65% แคลเซียมคลอไรด์' },
      { label: 'การดูดซับอิ่มตัว', value: '250-300%' },
      { label: 'รูปแบบเจล', value: 'สถานะเจลที่เสถียร' },
      { label: 'ลักษณะการใช้งาน', value: 'ป้องกันการเหลวตัวและการรั่วไหล' },
      { label: 'ความปลอดภัย', value: 'ไม่เป็นพิษ ไม่เป็นอันตราย เป็นมิตรกับสิ่งแวดล้อม' }
    ],
    specs_id: [
      { label: 'Model', value: '8820-2' },
      { label: 'Bahan baku', value: 'Pati jagung modifikasi' },
      { label: 'Komposisi formula', value: '35% CMS + 65% Kalsium klorida' },
      { label: 'Penyerapan jenuh', value: '250-300%' },
      { label: 'Bentuk gel', value: 'Keadaan gel stabil' },
      { label: 'Karakteristik penggunaan', value: 'Mencegah pencairan dan kebocoran' },
      { label: 'Keamanan', value: 'Tidak beracun, tidak berbahaya, ramah lingkungan' }
    ],

    applications_zh: '专用于氯化钙干燥剂、除湿凝胶产品、防潮干燥剂、工业除湿材料等领域。作为凝胶锁水材料，将氯化钙吸收的水分转化为稳定的凝胶，既保持优异的吸湿性能，又避免液体泄漏问题。广泛应用于家用除湿盒、衣柜干燥剂、集装箱干燥剂、电子产品防潮等场景。',
    applications_en: 'Specially designed for calcium chloride desiccants, moisture absorption gel products, moisture-proof desiccants, industrial dehumidifying materials, etc. As a gel water-locking material, it converts moisture absorbed by calcium chloride into stable gel, maintaining excellent moisture absorption while avoiding liquid leakage. Widely used in household dehumidifier boxes, wardrobe desiccants, container desiccants, electronic product moisture protection, etc.',
    applications_ru: 'Специально разработан для осушителей хлорида кальция, влагопоглощающих гелевых продуктов, влагозащитных осушителей, промышленных осушающих материалов и т.д. В качестве гелевого водоудерживающего материала преобразует влагу, поглощенную хлоридом кальция, в стабильный гель, сохраняя отличное влагопоглощение, избегая утечки жидкости. Широко используется в бытовых осушительных коробках, осушителях для шкафов, контейнерных осушителях, защите электронных изделий от влаги и т.д.',
    applications_vi: 'Được thiết kế đặc biệt cho chất hút ẩm canxi clorua, sản phẩm gel hút ẩm, chất hút ẩm chống ẩm, vật liệu hút ẩm công nghiệp, v.v. Là vật liệu gel khóa nước, nó chuyển đổi độ ẩm được canxi clorua hấp thụ thành gel ổn định, duy trì khả năng hút ẩm tuyệt vời trong khi tránh vấn đề rò rỉ chất lỏng. Được sử dụng rộng rãi trong hộp hút ẩm gia dụng, chất hút ẩm tủ quần áo, chất hút ẩm container, bảo vệ chống ẩm cho sản phẩm điện tử, v.v.',
    applications_th: 'ออกแบบมาเป็นพิเศษสำหรับสารดูดความชื้นแคลเซียมคลอไรด์ ผลิตภัณฑ์เจลดูดซับความชื้น สารดูดความชื้นป้องกันความชื้น วัสดุลดความชื้นอุตสาหกรรม ฯลฯ ในฐานะวัสดุเจลล็อคน้ำ จะเปลี่ยนความชื้นที่แคลเซียมคลอไรด์ดูดซับให้เป็นเจลที่เสถียร รักษาการดูดซับความชื้นที่ยอดเยี่ยมในขณะที่หลีกเลี่ยงการรั่วไหลของของเหลว ใช้กันอย่างแพร่หลายในกล่องดูดความชื้นในครัวเรือน สารดูดความชื้นในตู้เสื้อผ้า สารดูดความชื้นในตู้คอนเทนเนอร์ การป้องกันความชื้นของผลิตภัณฑ์อิเล็กทรอนิกส์ ฯล.',
    applications_id: 'Dirancang khusus untuk desikan kalsium klorida, produk gel penyerapan kelembaban, desikan tahan lembab, bahan dehumidifikasi industri, dll. Sebagai bahan pengunci air gel, ia mengubah kelembaban yang diserap oleh kalsium klorida menjadi gel yang stabil, mempertahankan penyerapan kelembaban yang sangat baik sambil menghindari kebocoran cairan. Digunakan secara luas dalam kotak dehumidifier rumah tangga, desikan lemari pakaian, desikan kontainer, perlindungan kelembaban produk elektronik, dll.',

    image_url: '/images/应用领域/desiccant_bag_v2.jpg',
    category: 'desiccant'
  },

  'paper-dyeing-cms': {
    product_code: '8810',
    name_zh: '造纸工业专用羧甲基淀粉 8810',
    name_en: 'Carboxymethyl Starch 8810 for Paper Industry',
    name_ru: 'Карбоксиметилкрахмал 8810 для бумажной промышленности',
    name_vi: 'Tinh bột Carboxymethyl 8810 cho Công nghiệp Giấy',
    name_th: 'แป้งคาร์บอกซีเมทิล 8810 สำหรับอุตสาหกรรมกระดาษ',
    name_id: 'Carboxymethyl Starch 8810 untuk Industri Kertas',

    description_zh: '专为造纸工业设计的羧甲基淀粉，主要用于纸品表面施胶、增强剂和染色助剂。具有优异的成膜性、粘合性和渗透性，能够显著提高纸张强度、平滑度和染色均匀性，是造纸工业的理想助剂。',
    description_en: 'Carboxymethyl starch designed for paper industry, mainly used in paper surface sizing, strengthening agent and dyeing auxiliary. Features excellent film-forming, adhesion and penetration properties, significantly improving paper strength, smoothness and dyeing uniformity, an ideal auxiliary for paper industry.',
    description_ru: 'Карбоксиметилкрахмал, разработанный для бумажной промышленности, в основном используется в поверхностной проклейке бумаги, укрепляющем агенте и вспомогательном веществе для крашения. Обладает отличными пленкообразующими, адгезионными и проникающими свойствами, значительно улучшая прочность, гладкость и равномерность окрашивания бумаги, идеальное вспомогательное вещество для бумажной промышленности.',
    description_vi: 'Tinh bột carboxymethyl được thiết kế cho ngành công nghiệp giấy, chủ yếu được sử dụng trong định hình bề mặt giấy, chất tăng cường và chất trợ nhuộm. Có tính năng tạo màng, kết dính và thẩm thấu tuyệt vời, cải thiện đáng kể độ bền, độ mịn và độ đồng đều khi nhuộm của giấy, là chất trợ lý tưởng cho ngành công nghiệp giấy.',
    description_th: 'แป้งคาร์บอกซีเมทิลที่ออกแบบมาสำหรับอุตสาหกรรมกระดาษ ส่วนใหญ่ใช้ในการปรับขนาดพื้นผิวกระดาษ สารเพิ่มความแข็งแรง และสารช่วยย้อมสี มีคุณสมบัติในการสร้างฟิล์ม การยึดเกาะ และการแทรกซึมที่ยอดเยี่ยม ปรับปรุงความแข็งแรง ความเรียบ และความสม่ำเสมอในการย้อมสีของกระดาษอย่างมีนัยสำคัญ เป็นสารช่วยในอุดมคติสำหรับอุตสาหกรรมกระดาษ',
    description_id: 'Carboxymethyl starch yang dirancang untuk industri kertas, terutama digunakan dalam ukuran permukaan kertas, agen penguat dan agen pembantu pewarnaan. Menampilkan sifat pembentukan film, adhesi dan penetrasi yang sangat baik, secara signifikan meningkatkan kekuatan kertas, kehalusan dan keseragaman pewarnaan, agen pembantu yang ideal untuk industri kertas.',

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
    features_vi: [
      'Đặc tính tạo màng tuyệt vời, cải thiện độ bền bề mặt giấy',
      'Độ kết dính tốt, tăng cường liên kết sợi',
      'Hiệu suất thẩm thấu tuyệt vời, cải thiện độ đồng đều khi nhuộm',
      'Cải thiện độ mịn và độ bóng của giấy',
      'Tăng cường độ cứng và khả năng chịu gập của giấy',
      'Cải thiện khả năng in ấn của giấy',
      'Tự nhiên và thân thiện với môi trường, đáp ứng các tiêu chuẩn giấy gói thực phẩm'
    ],
    features_th: [
      'คุณสมบัติการสร้างฟิล์มที่ยอดเยี่ยม ปรับปรุงความแข็งแรงของพื้นผิวกระดาษ',
      'การยึดเกาะที่ดี ช่วยเพิ่มการยึดเหนี่ยวของเส้นใย',
      'ประสิทธิภาพการแทรกซึมที่ยอดเยี่ยม ปรับปรุงความสม่ำเสมอในการย้อมสี',
      'ปรับปรุงความเรียบและความเงางามของกระดาษ',
      'ช่วยเพิ่มความแข็งและความต้านทานการพับของกระดาษ',
      'ปรับปรุงความสามารถในการพิมพ์ของกระดาษ',
      'ธรรมชาติและเป็นมิตรกับสิ่งแวดล้อม ตรงตามมาตรฐานกระดาษบรรจุภัณฑ์เกรดอาหาร'
    ],
    features_id: [
      'Sifat pembentukan film yang sangat baik, meningkatkan kekuatan permukaan kertas',
      'Adhesi yang baik, meningkatkan ikatan serat',
      'Kinerja penetrasi yang sangat baik, meningkatkan keseragaman pewarnaan',
      'Meningkatkan kehalusan dan kilap kertas',
      'Meningkatkan kekakuan kertas dan ketahanan lipat',
      'Meningkatkan kemampuan cetak kertas',
      'Alami dan ramah lingkungan, memenuhi standar kertas kemasan food grade'
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
    specs_vi: [
      { label: 'Mẫu', value: '8810' },
      { label: 'Nồng độ dung dịch', value: '5%' },
      { label: 'Máy đo độ nhớt', value: 'Máy đo độ nhớt quay' },
      { label: 'Điều kiện thử nghiệm', value: 'Rotor số 4, 12 vòng/phút' },
      { label: 'Phạm vi độ nhớt', value: '15.000±10% mPa·s' },
      { label: 'Giá trị pH', value: '9-11' },
      { label: 'Ngoại quan', value: 'Vảy' }
    ],
    specs_th: [
      { label: 'รุ่น', value: '8810' },
      { label: 'ความเข้มข้นสารละลาย', value: '5%' },
      { label: 'เครื่องวัดความหนืด', value: 'เครื่องวัดความหนืดแบบหมุน' },
      { label: 'เงื่อนไขการทดสอบ', value: 'โรเตอร์เบอร์ 4, 12 รอบต่อนาที' },
      { label: 'ช่วงความหนืด', value: '15,000±10% mPa·s' },
      { label: 'ค่า pH', value: '9-11' },
      { label: 'ลักษณะภายนอก', value: 'เกล็ด' }
    ],
    specs_id: [
      { label: 'Model', value: '8810' },
      { label: 'Konsentrasi larutan', value: '5%' },
      { label: 'Viskometer', value: 'Viskometer Rotasi' },
      { label: 'Kondisi pengujian', value: 'Rotor No.4, 12 rpm' },
      { label: 'Rentang viskositas', value: '15.000±10% mPa·s' },
      { label: 'Nilai pH', value: '9-11' },
      { label: 'Penampilan', value: 'Serpihan' }
    ],

    applications_zh: '广泛应用于纸品表面施胶、纸张增强剂、纸品染色助剂、纸品涂层剂等领域。作为表面施胶剂，能够显著提高纸张的表面强度和印刷适性；作为增强剂，增强纸张的挺度和耐折度；作为染色助剂，改善纸品染色的均匀性和色牢度。适用于工艺纸品、包装纸、装饰纸、特种纸等各类纸品生产。',
    applications_en: 'Widely used in paper surface sizing, paper strengthening agent, paper dyeing auxiliary, paper coating agent, etc. As a surface sizing agent, significantly improves paper surface strength and printability; as a strengthening agent, enhances paper stiffness and folding resistance; as a dyeing auxiliary, improves dyeing uniformity and color fastness of paper products. Suitable for production of various paper products including craft paper, packaging paper, decorative paper, specialty paper, etc.',
    applications_ru: 'Широко используется в поверхностной проклейке бумаги, укрепляющем агенте для бумаги, вспомогательном веществе для крашения бумаги, покрывающем агенте для бумаги и т.д. В качестве агента для поверхностной проклейки значительно улучшает прочность поверхности и печатные свойства бумаги; в качестве укрепляющего агента повышает жесткость и устойчивость к складыванию бумаги; в качестве вспомогательного вещества для крашения улучшает равномерность окрашивания и стойкость цвета бумажных изделий. Подходит для производства различных бумажных изделий, включая крафт-бумагу, упаковочную бумагу, декоративную бумагу, специальную бумагу и т.д.',
    applications_vi: 'Được sử dụng rộng rãi trong định hình bề mặt giấy, chất tăng cường giấy, chất trợ nhuộm giấy, chất tráng phủ giấy, v.v. Là chất định hình bề mặt, cải thiện đáng kể độ bền bề mặt và khả năng in ấn của giấy; là chất tăng cường, tăng cường độ cứng và khả năng chịu gập của giấy; là chất trợ nhuộm, cải thiện độ đồng đều khi nhuộm và độ bền màu của các sản phẩm giấy. Thích hợp cho sản xuất các loại giấy khác nhau bao gồm giấy thủ công, giấy gói, giấy trang trí, giấy đặc biệt, v.v.',
    applications_th: 'ใช้กันอย่างแพร่หลายในการปรับขนาดพื้นผิวกระดาษ สารเพิ่มความแข็งแรงของกระดาษ สารช่วยย้อมสีกระดาษ สารเคลือบกระดาษ ฯลฯ ในฐานะสารปรับขนาดพื้นผิว ปรับปรุงความแข็งแรงของพื้นผิวกระดาษและความสามารถในการพิมพ์อย่างมีนัยสำคัญ ในฐานะสารเพิ่มความแข็งแรง เพิ่มความแข็งและความต้านทานการพับของกระดาษ ในฐานะสารช่วยย้อมสี ปรับปรุงความสม่ำเสมอในการย้อมสีและความคงทนของสีของผลิตภัณฑ์กระดาษ เหมาะสำหรับการผลิตผลิตภัณฑ์กระดาษต่างๆ รวมถึงกระดาษคราฟท์ กระดาษบรรจุภัณฑ์ กระดาษตกแต่ง กระดาษพิเศษ ฯลฯ',
    applications_id: 'Digunakan secara luas dalam ukuran permukaan kertas, agen penguat kertas, agen pembantu pewarnaan kertas, agen pelapis kertas, dll. Sebagai agen ukuran permukaan, secara signifikan meningkatkan kekuatan permukaan kertas dan kemampuan cetak; sebagai agen penguat, meningkatkan kekakuan kertas dan ketahanan lipat; sebagai agen pembantu pewarnaan, meningkatkan keseragaman pewarnaan dan ketahanan warna produk kertas. Cocok untuk produksi berbagai produk kertas termasuk kertas kerajinan, kertas kemasan, kertas dekoratif, kertas khusus, dll.',

    image_url: '/images/应用领域/paper_roll_v2.jpg',
    category: 'paper'
  },

  'oem-service': {
    product_code: 'OEM',
    name_zh: 'OEM/ODM 定制服务',
    name_en: 'OEM/ODM Customization Service',
    name_ru: 'Услуги OEM/ODM по индивидуальному заказу',
    name_vi: 'Dịch vụ tùy chỉnh OEM/ODM',
    name_th: 'บริการปรับแต่ง OEM/ODM',
    name_id: 'Layanan Kustomisasi OEM/ODM',

    description_zh: '提供全方位的墙纸胶粉OEM/ODM定制服务。从配方研发、包装设计到成品生产，为您打造专属品牌。支持不同粘度、不同规格、不同包装形式的定制需求。源头工厂直供，质量稳定，交货期短。',
    description_en: ' comprehensive OEM/ODM customization service for wallpaper adhesive powder. From formula formulation, packaging design to finished product production, we create exclusive brands for you. Support customization needs of different viscosities, specifications, and packaging forms. Direct supply from source factory, stable quality, short delivery time.',
    description_ru: 'Комплексные услуги OEM/ODM по индивидуальному заказу для обойного клея. От разработки формулы, дизайна упаковки до производства готовой продукции, мы создаем для вас эксклюзивные бренды. Поддержка индивидуальных потребностей различной вязкости, спецификаций и форм упаковки. Прямые поставки с завода-изготовителя, стабильное качество, короткие сроки поставки.',
    description_vi: 'Dịch vụ tùy chỉnh OEM/ODM toàn diện cho bột keo dán giấy dán tường. Từ xây dựng công thức, thiết kế bao bì đến sản xuất thành phẩm, chúng tôi tạo ra các thương hiệu độc quyền cho bạn. Hỗ trợ nhu cầu tùy chỉnh về độ nhớt, quy cách và hình thức đóng gói khác nhau. Cung cấp trực tiếp từ nhà máy nguồn, chất lượng ổn định, thời gian giao hàng ngắn.',
    description_th: 'บริการปรับแต่ง OEM/ODM ครบวงจรสำหรับผงกาววอลเปเปอร์ ตั้งแต่การคิดค้นสูตร การออกแบบบรรจุภัณฑ์ จนถึงการผลิตสินค้าสำเร็จรูป เราสร้างแบรนด์พิเศษสำหรับคุณ รองรับความต้องการปรับแต่งความหนืด ข้อมูลจำเพาะ และรูปแบบบรรจุภัณฑ์ที่แตกต่างกัน จัดหาโดยตรงจากโรงงานต้นทาง คุณภาพเสถียร เวลาจัดส่งสั้น',
    description_id: 'Layanan kustomisasi OEM/ODM komprehensif untuk bubuk perekat wallpaper. Dari formulasi rumus, desain kemasan hingga produksi produk jadi, kami menciptakan merek eksklusif untuk Anda. Mendukung kebutuhan kustomisasi viskositas, spesifikasi, dan bentuk kemasan yang berbeda. Pasokan langsung dari pabrik sumber, kualitas stabil, waktu pengiriman singkat.',

    features_zh: [
      '灵活的配方定制，满足不同粘度和性能需求',
      '多样化的包装选择，支持小包装及吨袋定制',
      '全程质量控制，确保产品符合国际标准',
      '专业的包装设计团队，提升品牌形象',
      '源头工厂直供，极具竞争力的价格优势',
      '高效的生产能力，确保准时交付',
      '提供样品测试和技术支持'
    ],
    features_en: [
      'Flexible formula customization to meet different viscosity and performance needs',
      'Diverse packaging options, supporting small packages and ton bag customization',
      'Full process quality control ensures products meet international standards',
      'Professional packaging design team enhances brand image',
      'Direct supply from source factory, competitive price advantage',
      'Efficient production capacity ensures on-time delivery',
      'Sample testing and technical support provided'
    ],
    features_ru: [
      'Гибкая настройка формулы для удовлетворения различных потребностей в вязкости и производительности',
      'Разнообразные варианты упаковки, поддержка индивидуальной настройки небольших упаковок и тонных мешков',
      'Полный контроль качества процесса гарантирует соответствие продукции международным стандартам',
      'Профессиональная команда дизайнеров упаковки улучшает имидж бренда',
      'Прямые поставки с завода-изготовителя, конкурентное ценовое преимущество',
      'Эффективная производственная мощность гарантирует своевременную доставку',
      'Предоставляются тестирование образцов и техническая поддержка'
    ],
    features_vi: [
      'Tùy chỉnh công thức linh hoạt để đáp ứng nhu cầu độ nhớt và hiệu suất khác nhau',
      'Các tùy chọn đóng gói đa dạng, hỗ trợ tùy chỉnh gói nhỏ và bao tấn',
      'Kiểm soát chất lượng toàn bộ quá trình đảm bảo sản phẩm đáp ứng các tiêu chuẩn quốc tế',
      'Đội ngũ thiết kế bao bì chuyên nghiệp nâng cao hình ảnh thương hiệu',
      'Cung cấp trực tiếp từ nhà máy nguồn, lợi thế giá cả cạnh tranh',
      'Năng lực sản xuất hiệu quả đảm bảo giao hàng đúng hạn',
      'Cung cấp thử nghiệm mẫu và hỗ trợ kỹ thuật'
    ],
    features_th: [
      'การปรับแต่งสูตรที่ยืดหยุ่นเพื่อตอบสนองความต้องการความหนืดและประสิทธิภาพที่แตกต่างกัน',
      'ตัวเลือกบรรจุภัณฑ์ที่หลากหลาย รองรับการปรับแต่งบรรจุภัณฑ์ขนาดเล็กและถุงตัน',
      'การควบคุมคุณภาพกระบวนการเต็มรูปแบบรับประกันว่าผลิตภัณฑ์ตรงตามมาตรฐานสากล',
      'ทีมออกแบบบรรจุภัณฑ์มืออาชีพช่วยยกระดับภาพลักษณ์แบรนด์',
      'จัดหาโดยตรงจากโรงงานต้นทาง ข้อได้เปรียบด้านราคาที่แข่งขันได้',
      'กำลังการผลิตที่มีประสิทธิภาพรับประกันการจัดส่งตรงเวลา',
      'ให้การทดสอบตัวอย่างและการสนับสนุนทางเทคนิค'
    ],
    features_id: [
      'Kustomisasi formula fleksibel untuk memenuhi kebutuhan viskositas dan kinerja yang berbeda',
      'Pilihan kemasan yang beragam, mendukung kustomisasi paket kecil dan tas ton',
      'Kontrol kualitas proses penuh memastikan produk memenuhi standar internasional',
      'Tim desain kemasan profesional meningkatkan citra merek',
      'Pasokan langsung dari pabrik sumber, keunggulan harga yang kompetitif',
      'Kapasitas produksi yang efisien memastikan pengiriman tepat waktu',
      'Pengujian sampel dan dukungan teknis disediakan'
    ],

    specs_zh: [
      { label: '服务类型', value: 'OEM/ODM 定制' },
      { label: '起订量', value: '面议' },
      { label: '包装形式', value: '纸盒、塑料袋、吨袋等' },
      { label: '适用产品', value: '墙纸胶粉、羧甲基淀粉等' },
      { label: '交货期', value: '7-15 天' },
      { label: '产地', value: '中国杭州' }
    ],
    specs_en: [
      { label: 'Service Type', value: 'OEM/ODM Customization' },
      { label: 'MOQ', value: 'Negotiable' },
      { label: 'Packaging', value: 'Paper box, plastic bag, ton bag, etc.' },
      { label: 'Applicable Products', value: 'Wallpaper adhesive powder, CMS, etc.' },
      { label: 'Delivery Time', value: '7-15 days' },
      { label: 'Origin', value: 'Hangzhou, China' }
    ],
    specs_ru: [
      { label: 'Тип услуги', value: 'OEM/ODM по индивидуальному заказу' },
      { label: 'Минимальный заказ', value: 'По договоренности' },
      { label: 'Упаковка', value: 'Бумажная коробка, полиэтиленовый пакет, тонный мешок и т.д.' },
      { label: 'Применимые продукты', value: 'Обойный клей, CMS и т.д.' },
      { label: 'Срок поставки', value: '7-15 дней' },
      { label: 'Происхождение', value: 'Ханчжоу, Китай' }
    ],
    specs_vi: [
      { label: 'Loại dịch vụ', value: 'Tùy chỉnh OEM/ODM' },
      { label: 'MOQ', value: 'Thỏa thuận' },
      { label: 'Bao bì', value: 'Hộp giấy, túi nhựa, bao tấn, v.v.' },
      { label: 'Sản phẩm áp dụng', value: 'Bột keo dán giấy dán tường, CMS, v.v.' },
      { label: 'Thời gian giao hàng', value: '7-15 ngày' },
      { label: 'Xuất xứ', value: 'Hàng Châu, Trung Quốc' }
    ],
    specs_th: [
      { label: 'ประเภทบริการ', value: 'การปรับแต่ง OEM/ODM' },
      { label: 'MOQ', value: 'ต่อรองได้' },
      { label: 'บรรจุภัณฑ์', value: 'กล่องกระดาษ, ถุงพลาสติก, ถุงตัน ฯลฯ' },
      { label: 'ผลิตภัณฑ์ที่เกี่ยวข้อง', value: 'ผงกาววอลเปเปอร์, CMS, ฯลฯ' },
      { label: 'เวลาจัดส่ง', value: '7-15 วัน' },
      { label: 'แหล่งกำเนิด', value: 'หางโจว, จีน' }
    ],
    specs_id: [
      { label: 'Jenis Layanan', value: 'Kustomisasi OEM/ODM' },
      { label: 'MOQ', value: 'Dapat dinegosiasikan' },
      { label: 'Kemasan', value: 'Kotak kertas, kantong plastik, tas ton, dll.' },
      { label: 'Produk yang Berlaku', value: 'Bubuk perekat wallpaper, CMS, dll.' },
      { label: 'Waktu Pengiriman', value: '7-15 hari' },
      { label: 'Asal', value: 'Hangzhou, Cina' }
    ],

    applications_zh: '无论您是品牌商、分销商还是建材贸易商，我们都能为您提供专业的OEM代工服务。从产品研发到包装设计，一站式解决您的品牌定制需求。',
    applications_en: 'Whether you are a brand owner, distributor or building materials trader, we can provide you with professional OEM services. From product R&D to packaging design, one-stop solution for your brand customization needs.',
    applications_ru: 'Будь вы владельцем бренда, дистрибьютором или торговцем строительными материалами, мы можем предоставить вам профессиональные услуги OEM. От исследований и разработок продукции до дизайна упаковки - универсальное решение для ваших потребностей в настройке бренда.',
    applications_vi: 'Cho dù bạn là chủ sở hữu thương hiệu, nhà phân phối hay thương nhân vật liệu xây dựng, chúng tôi đều có thể cung cấp cho bạn các dịch vụ OEM chuyên nghiệp. Từ R&D sản phẩm đến thiết kế bao bì, giải pháp một cửa cho nhu cầu tùy chỉnh thương hiệu của bạn.',
    applications_th: 'ไม่ว่าคุณจะเป็นเจ้าของแบรนด์ ผู้จัดจำหน่าย หรือผู้ค้าวัสดุก่อสร้าง เราสามารถให้บริการ OEM มืออาชีพแก่คุณ ตั้งแต่การวิจัยและพัฒนาผลิตภัณฑ์ไปจนถึงการออกแบบบรรจุภัณฑ์ โซลูชันครบวงจรสำหรับความต้องการปรับแต่งแบรนด์ของคุณ',
    applications_id: 'Apakah Anda pemilik merek, distributor, atau pedagang bahan bangunan, kami dapat menyediakan layanan OEM profesional untuk Anda. Dari R&D produk hingga desain kemasan, solusi satu atap untuk kebutuhan kustomisasi merek Anda.',

    image_url: '/images/oem-v999.jpg',
    category: 'oem'
  }
};

// 内部标准化函数：兼容大小写与不同书写方式
const normalizeCode = (code: string) => code?.trim().toLowerCase();

// 检查是否为本地产品（兼容大小写和 product_code/slug 两种写法）
export function isLocalProduct(productCode: string): boolean {
  const normalized = normalizeCode(productCode);

  // slug 直接匹配
  const matchedSlug = Object.keys(LOCAL_PRODUCTS).some(
    key => normalizeCode(key) === normalized
  );
  if (matchedSlug) return true;

  // product_code 值匹配（如 K6、999 等）
  const matchedCode = Object.values(LOCAL_PRODUCTS).some(
    p => normalizeCode(p.product_code) === normalized
  );
  return matchedCode;
}

// 获取本地产品数据（兼容 slug 和 product_code）
export function getLocalProduct(productCode: string): LocalProduct | null {
  const normalized = normalizeCode(productCode);

  // slug 直接匹配
  const slugKey = Object.keys(LOCAL_PRODUCTS).find(
    key => normalizeCode(key) === normalized
  );
  if (slugKey) return LOCAL_PRODUCTS[slugKey];

  // product_code 值匹配
  const found = Object.values(LOCAL_PRODUCTS).find(
    p => normalizeCode(p.product_code) === normalized
  );
  return found || null;
}


