import { Helmet } from 'react-helmet-async';

interface OrganizationSchema {
  type: 'Organization';
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  logo: string;
  image?: string;
  telephone?: string;
  email?: string;
  sameAs?: string[];
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  areaServed?: string | string[];
  hasMap?: string;
  contactPoint?: Array<{
    contactType: string;
    telephone?: string;
    email?: string;
    areaServed?: string | string[];
    availableLanguage?: string | string[];
  }>;
  foundingDate?: string;
}

interface ProductSchema {
  type: 'Product';
  name: string;
  description: string;
  image: string;
  sku?: string;
  brand: {
    name: string;
  };
  manufacturer?: {
    name: string;
  };
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
    url?: string;
  };
}

interface ContactPageSchema {
  type: 'ContactPage';
  name: string;
  description: string;
  url: string;
}

interface WebPageSchema {
  type: 'WebPage';
  name: string;
  description: string;
  url: string;
  inLanguage?: string;
  areaServed?: string | string[];
}

interface FAQPageSchema {
  type: 'FAQPage';
  mainEntity: Array<{
    question: string;
    answer: string;
  }>;
}

interface VideoObjectSchema {
  type: 'VideoObject';
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string;
}

interface AggregateRatingSchema {
  type: 'AggregateRating';
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

interface ItemListSchema {
  type: 'ItemList';
  name: string;
  description: string;
  numberOfItems: number;
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    item: {
      '@type': 'Product' | 'WebPage';
      name: string;
      description: string;
      image?: string;
      sku?: string;
      url: string;
      brand?: {
        '@type': 'Brand';
        name: string;
      };
    };
  }>;
}

interface BreadcrumbListSchema {
  type: 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string; // URL
  }>;
}

interface WebSiteSchema {
  type: 'WebSite';
  name: string;
  url: string;
  logo: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

type StructuredDataProps = 
  | { schema: OrganizationSchema }
  | { schema: ProductSchema }
  | { schema: ContactPageSchema }
  | { schema: WebPageSchema }
  | { schema: FAQPageSchema }
  | { schema: VideoObjectSchema }
  | { schema: AggregateRatingSchema }
  | { schema: ItemListSchema }
  | { schema: BreadcrumbListSchema }
  | { schema: WebSiteSchema };

const SITE_URL = 'https://kn-wallpaperglue.com';

export function StructuredData({ schema }: StructuredDataProps) {
  const generateSchema = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
    };

    if (schema.type === 'Organization') {
      return {
        ...baseSchema,
        '@type': 'Organization',
        name: schema.name,
        alternateName: schema.alternateName,
        description: schema.description,
        url: schema.url,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}${schema.logo}`,
          width: 512,
          height: 512,
        },
        image: schema.image ? `${SITE_URL}${schema.image}` : undefined,
        telephone: schema.telephone,
        email: schema.email,
        address: schema.address ? {
          '@type': 'PostalAddress',
          streetAddress: schema.address.streetAddress,
          addressLocality: schema.address.addressLocality,
          addressRegion: schema.address.addressRegion,
          postalCode: schema.address.postalCode,
          addressCountry: schema.address.addressCountry,
        } : undefined,
        geo: schema.geo ? {
          '@type': 'GeoCoordinates',
          latitude: schema.geo.latitude,
          longitude: schema.geo.longitude,
        } : undefined,
        sameAs: schema.sameAs,
        areaServed: schema.areaServed,
        contactPoint: schema.contactPoint?.map(point => ({
          '@type': 'ContactPoint',
          contactType: point.contactType,
          telephone: point.telephone,
          email: point.email,
          areaServed: point.areaServed,
          availableLanguage: point.availableLanguage,
        })),
        hasMap: schema.hasMap,
        foundingDate: schema.foundingDate,
      };
    }

    if (schema.type === 'Product') {
      return {
        ...baseSchema,
        '@type': 'Product',
        name: schema.name,
        description: schema.description,
        image: schema.image.startsWith('http') ? schema.image : `${SITE_URL}${schema.image}`,
        sku: schema.sku,
        brand: {
          '@type': 'Brand',
          name: schema.brand.name,
        },
        manufacturer: schema.manufacturer ? {
          '@type': 'Organization',
          name: schema.manufacturer.name,
        } : undefined,
        offers: schema.offers ? {
          '@type': 'Offer',
          price: schema.offers.price,
          priceCurrency: schema.offers.priceCurrency,
          availability: schema.offers.availability || 'https://schema.org/InStock',
          url: schema.offers.url,
        } : undefined,
      };
    }

    if (schema.type === 'ContactPage') {
      return {
        ...baseSchema,
        '@type': 'ContactPage',
        name: schema.name,
        description: schema.description,
        url: schema.url,
      };
    }

    if (schema.type === 'WebPage') {
      return {
        ...baseSchema,
        '@type': 'WebPage',
        name: schema.name,
        description: schema.description,
        url: schema.url,
        inLanguage: schema.inLanguage,
        areaServed: schema.areaServed,
      };
    }

    if (schema.type === 'FAQPage') {
      return {
        ...baseSchema,
        '@type': 'FAQPage',
        mainEntity: schema.mainEntity.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };
    }

    if (schema.type === 'ItemList') {
      return {
        ...baseSchema,
        '@type': 'ItemList',
        name: schema.name,
        description: schema.description,
        numberOfItems: schema.numberOfItems,
        itemListElement: schema.itemListElement.map(item => {
          const baseItem: any = {
            '@type': item.item['@type'],
            name: item.item.name,
            description: item.item.description,
            url: item.item.url.startsWith('http') ? item.item.url : `${SITE_URL}${item.item.url}`,
          };
          
          // 如果是 Product 类型，添加额外的字段
          if (item.item['@type'] === 'Product') {
            if (item.item.image) {
              baseItem.image = item.item.image.startsWith('http') ? item.item.image : `${SITE_URL}${item.item.image}`;
            }
            if (item.item.sku) {
              baseItem.sku = item.item.sku;
            }
            if (item.item.brand) {
              baseItem.brand = {
                '@type': 'Brand',
                name: item.item.brand.name,
              };
            }
          }
          
          return {
            '@type': 'ListItem',
            position: item.position,
            item: baseItem,
          };
        }),
      };
    }

    if (schema.type === 'BreadcrumbList') {
      return {
        ...baseSchema,
        '@type': 'BreadcrumbList',
        itemListElement: schema.itemListElement.map(item => ({
          '@type': 'ListItem',
          position: item.position,
          name: item.name,
          item: item.item.startsWith('http') ? item.item : `${SITE_URL}${item.item}`,
        })),
      };
    }

    if (schema.type === 'WebSite') {
      return {
        ...baseSchema,
        '@type': 'WebSite',
        name: schema.name,
        url: schema.url,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}${schema.logo}`,
          width: 512,
          height: 512,
        },
        potentialAction: schema.potentialAction,
      };
    }

    if (schema.type === 'VideoObject') {
      return {
        ...baseSchema,
        '@type': 'VideoObject',
        name: schema.name,
        description: schema.description,
        thumbnailUrl: schema.thumbnailUrl.startsWith('http') ? schema.thumbnailUrl : `${SITE_URL}${schema.thumbnailUrl}`,
        uploadDate: schema.uploadDate,
        contentUrl: schema.contentUrl,
        embedUrl: schema.embedUrl,
        duration: schema.duration,
      };
    }

    if (schema.type === 'AggregateRating') {
      return {
        ...baseSchema,
        '@type': 'AggregateRating',
        ratingValue: schema.ratingValue,
        reviewCount: schema.reviewCount,
        bestRating: schema.bestRating || 5,
        worstRating: schema.worstRating || 1,
      };
    }

    return baseSchema;
  };

  const schemaData = generateSchema();

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}










