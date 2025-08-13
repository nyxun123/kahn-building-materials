import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { t } = useTranslation('admin');
  
  return (
    <>
      <Helmet>
        <title>{t('dashboard.title')} | 杨州卡恩新型建材有限公司</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t('dashboard.title')}</h1>
        <p className="text-lg mb-8">{t('dashboard.welcome', { name: '管理员' })}</p>
        
        <h2 className="text-xl font-semibold mb-4">{t('dashboard.overview')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="text-3xl font-bold mb-2">24</div>
            <div className="text-gray-500 dark:text-gray-400">{t('dashboard.products_count')}</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="text-3xl font-bold mb-2">12</div>
            <div className="text-gray-500 dark:text-gray-400">{t('dashboard.messages_count')}</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-amber-500">
            <div className="text-3xl font-bold mb-2">5</div>
            <div className="text-gray-500 dark:text-gray-400">{t('dashboard.unread_messages')}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('dashboard.recent_messages')}</h2>
                <Link to="/admin/messages" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  {t('dashboard.view_all')} &rarr;
                </Link>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="border-b pb-3 border-gray-200 dark:border-gray-700 last:border-0">
                    <p className="font-medium">{`张三 ${index + 1}`}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">example@email.com</p>
                    <p className="text-sm mt-1">我想了解更多关于您的产品信息...</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">{t('dashboard.quick_actions')}</h2>
              <div className="space-y-3">
                <Link to="/admin/products" className="block w-full">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                    {t('dashboard.add_product')}
                  </button>
                </Link>
                <Link to="/admin/products" className="block w-full">
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
                    {t('dashboard.manage_products')}
                  </button>
                </Link>
                <Link to="/admin/messages" className="block w-full">
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
                    {t('dashboard.manage_messages')}
                  </button>
                </Link>
                <Link to="/admin/content" className="block w-full">
                  <button className="w-full bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition-colors">
                    {t('dashboard.edit_content')}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;