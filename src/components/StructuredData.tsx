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
  sameAs?: string[];
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
}

type StructuredDataProps = 
  | { schema: OrganizationSchema }
  | { schema: ProductSchema }
  | { schema: ContactPageSchema }
  | { schema: WebPageSchema };

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
        logo: `${SITE_URL}${schema.logo}`,
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









