import { StructuredData } from './StructuredData';

interface LocalBusinessProps {
    language?: 'zh' | 'en' | 'ru' | 'th' | 'vi' | 'id';
}

const companyInfo = {
    zh: {
        name: '杭州卡恩新型建材有限公司',
        description: '专业生产和销售墙纸胶、羧甲基淀粉等建筑材料的制造商',
        streetAddress: '浙江省杭州市临平区崇贤街道沪瑞线王家门1号',
        addressLocality: '杭州市',
        addressRegion: '浙江省',
    },
    en: {
        name: 'Hangzhou Kahn New Building Materials Co., Ltd.',
        description: 'Professional manufacturer and seller of wallpaper glue, carboxymethyl starch and other building materials',
        streetAddress: 'No. 1 Wangjiamen, Hurui Line, Chongxian Street, Linping District, Hangzhou, Zhejiang Province',
        addressLocality: 'Hangzhou',
        addressRegion: 'Zhejiang',
    },
    ru: {
        name: 'Hangzhou Kahn New Building Materials Co., Ltd.',
        description: 'Профессиональный производитель и продавец обойного клея, карбоксиметилкрахмала и других строительных материалов',
        streetAddress: 'No. 1 Wangjiamen, Hurui Line, Chongxian Street, Linping District, Hangzhou, Zhejiang Province',
        addressLocality: 'Hangzhou',
        addressRegion: 'Zhejiang',
    },
};

export function LocalBusinessSchema({ language = 'zh' }: LocalBusinessProps) {
    const info = companyInfo[language] || companyInfo.zh;

    return (
        <StructuredData
            schema={{
                type: 'Organization',
                name: info.name,
                alternateName: 'Kahn Building Materials',
                description: info.description,
                url: 'https://kn-wallpaperglue.com',
                logo: '/favicon-192x192-v8.png',
                telephone: '+86-13216156841',
                email: 'kahn@kn-wallpaperglue.com',
                address: {
                    streetAddress: info.streetAddress,
                    addressLocality: info.addressLocality,
                    addressRegion: info.addressRegion,
                    postalCode: '311100',
                    addressCountry: 'CN',
                },
                geo: {
                    latitude: 30.39,
                    longitude: 120.17,
                },
                sameAs: [
                    'https://www.facebook.com/kahnmaterials',
                    'https://twitter.com/kahnmaterials',
                    'https://www.linkedin.com/company/kahn-materials',
                ],
                areaServed: language === 'zh'
                    ? ['中国', '亚洲', '欧洲', '非洲', '南美洲']
                    : ['China', 'Asia', 'Europe', 'Africa', 'South America'],
                contactPoint: [
                    {
                        contactType: 'Sales',
                        telephone: '+86-13216156841',
                        email: 'kahn@kn-wallpaperglue.com',
                        areaServed: language === 'zh'
                            ? ['全球']
                            : ['Worldwide'],
                        availableLanguage: ['zh', 'en', 'ru'],
                    },
                ],
                hasMap: 'https://j.map.baidu.com/63/AGJ',
                foundingDate: '2010',
            }}
        />
    );
}
