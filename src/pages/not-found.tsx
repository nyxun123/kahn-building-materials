import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SEOHelmet } from '@/components/SEOHelmet';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      <SEOHelmet
        title="404 - Page Not Found"
        description="The page you are looking for does not exist or has been moved."
        noindex={true}
      />
      <div style={{ textAlign: 'center', padding: '4rem 2rem', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '6rem', margin: 0, fontWeight: 800, color: '#e5e7eb' }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', marginTop: '1rem', color: '#6b7280' }}>
          {t('error.pageNotFound', 'Page Not Found')}
        </h2>
        <p style={{ marginTop: '1rem', color: '#9ca3af', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
          {t('error.pageNotFoundDesc', 'The page you are looking for does not exist or has been moved.')}
        </p>
        <Link
          to="/en"
          style={{
            display: 'inline-block',
            marginTop: '2rem',
            padding: '0.75rem 2rem',
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          {t('error.goHome', 'Go to Homepage')}
        </Link>
      </div>
    </>
  );
}
