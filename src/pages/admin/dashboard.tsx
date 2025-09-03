import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>控制面板 | 杨州卡恩新型建材有限公司</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">控制面板</h1>
        <p className="text-lg mb-8">欢迎回来，管理员</p>
        
        <h2 className="text-xl font-semibold mb-4">概览</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="text-3xl font-bold mb-2">24</div>
            <div className="text-gray-500 dark:text-gray-400">产品数量</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="text-3xl font-bold mb-2">12</div>
            <div className="text-gray-500 dark:text-gray-400">留言数量</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-amber-500">
            <div className="text-3xl font-bold mb-2">5</div>
            <div className="text-gray-500 dark:text-gray-400">未读留言</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">最近留言</h2>
                <Link to="/admin/contacts" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  查看全部 &rarr;
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
              <h2 className="text-xl font-semibold mb-4">快捷操作</h2>
              <div className="space-y-3">
                <Link to="/admin/products" className="block w-full">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                    添加新产品
                  </button>
                </Link>
                <Link to="/admin/products" className="block w-full">
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
                    管理产品
                  </button>
                </Link>
                <Link to="/admin/contacts" className="block w-full">
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
                    管理留言
                  </button>
                </Link>
                <Link to="/admin/content" className="block w-full">
                  <button className="w-full bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition-colors">
                    编辑网站内容
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