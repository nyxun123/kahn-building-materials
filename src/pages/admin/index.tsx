import React, { useState } from 'react';
import { AdminHome } from './home';
import AdminProducts from './products';
import { AdminOEM } from './oem';
import { AdminAbout } from './about';
import { AdminContact } from './contact';
import AdminCompanyInfo from './company-info';

type AdminSection = 'dashboard' | 'home' | 'products' | 'oem' | 'about' | 'contact' | 'company-info';

export function AdminIndex() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  const navigation = [
    { id: 'dashboard', label: '仪表板', icon: '📊' },
    { id: 'home', label: '首页管理', icon: '🏠' },
    { id: 'products', label: '产品管理', icon: '📦' },
    { id: 'oem', label: 'OEM服务', icon: '🏭' },
    { id: 'about', label: '关于我们', icon: 'ℹ️' },
    { id: 'contact', label: '联系我们', icon: '📞' },
    { id: 'company-info', label: '公司信息', icon: '🏢' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <AdminHome />;
      case 'products':
        return <AdminProducts />;
      case 'oem':
        return <AdminOEM />;
      case 'about':
        return <AdminAbout />;
      case 'contact':
        return <AdminContact />;
      case 'company-info':
        return <AdminCompanyInfo />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">管理仪表板</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">总产品数</h3>
                <p className="text-3xl font-bold text-blue-600">12</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">总留言数</h3>
                <p className="text-3xl font-bold text-green-600">6</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">待处理留言</h3>
                <p className="text-3xl font-bold text-yellow-600">5</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">已回复留言</h3>
                <p className="text-3xl font-bold text-purple-600">1</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">快速导航</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {navigation.filter(item => item.id !== 'dashboard').map((item) => (
                  <button
                    key={item.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 text-left"
                    onClick={() => setActiveSection(item.id as AdminSection)}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-medium">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* 侧边导航 */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">管理后台</h2>
          </div>
          <nav className="mt-4">
            {navigation.map((item) => (
              <button
                key={item.id}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center space-x-3 ${
                  activeSection === item.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                }`}
                onClick={() => setActiveSection(item.id as AdminSection)}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}