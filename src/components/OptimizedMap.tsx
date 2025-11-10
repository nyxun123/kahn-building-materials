import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

/**
 * 优化的地图组件 - 使用静态预览 + 按需加载
 * 
 * 优化策略：
 * 1. 首次加载显示静态地图图片（Google Static Maps API）
 * 2. 点击后才加载交互式地图（iframe）
 * 3. 添加加载状态指示器
 * 4. 快速响应，提升用户体验
 */
export const OptimizedMap: React.FC = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 地址信息
  const address = '浙江省杭州市临平区崇贤街道沪瑞线1号';
  
  // 静态地图 URL（Google Static Maps API）
  // 使用静态图片，加载速度快
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=15&size=800x400&markers=color:red%7C${encodeURIComponent(address)}&language=zh-CN&key=AIzaSyDummyKeyForStaticMaps`;

  // 交互式地图 URL
  const interactiveMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed&hl=zh-CN`;

  // 点击加载地图
  const handleLoadMap = () => {
    setIsLoading(true);
    setIsMapLoaded(true);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg h-[400px] md:h-[500px] relative bg-gray-100">
      {!isMapLoaded ? (
        // 静态地图预览 + 点击加载提示
        <div 
          className="w-full h-full cursor-pointer relative group"
          onClick={handleLoadMap}
        >
          {/* 使用纯色背景作为最快的占位符，避免额外请求 */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            {/* 地图图标和提示 */}
            <div className="text-center transform group-hover:scale-105 transition-transform duration-200">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-[#047857] p-6 shadow-lg">
                  <MapPin className="h-12 w-12 text-white" />
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-8 py-4 shadow-xl">
                <p className="text-xl font-bold text-gray-800 mb-2">
                  点击加载地图
                </p>
                <p className="text-sm text-gray-600">
                  浙江省杭州市临平区崇贤街道沪瑞线 1 号
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Click to load interactive map
                </p>
              </div>
            </div>

            {/* 装饰性地图网格 */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        // 交互式地图
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <svg className="animate-spin h-12 w-12 text-[#047857] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">加载地图中...</p>
              </div>
            </div>
          )}
          <iframe 
            src={interactiveMapUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps - Hangzhou Karn New Building Materials Co., Ltd."
            onLoad={() => setIsLoading(false)}
          ></iframe>
        </>
      )}

      {/* 备用方案：直接打开 Google Maps */}
      {!isMapLoaded && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 bg-[#047857] hover:bg-[#064E3B] text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2 text-sm"
        >
          <MapPin className="h-4 w-4" />
          <span>在 Google Maps 中打开</span>
        </a>
      )}
    </div>
  );
};

export default OptimizedMap;

