import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import { router } from './lib/router';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ServiceWorkerProvider } from './components/ServiceWorkerProvider';
import './lib/i18n';

function App() {
  // 防止移动端滑动时的滚动条问题
  useEffect(() => {
    document.body.classList.add('overflow-x-hidden');
    return () => {
      document.body.classList.remove('overflow-x-hidden');
    };
  }, []);

  return (
    <ServiceWorkerProvider>
      <ErrorBoundary>
        <HelmetProvider>
          <Toaster position="top-center" />
          <RouterProvider router={router} />
        </HelmetProvider>
      </ErrorBoundary>
    </ServiceWorkerProvider>
  );
}

export default App;
