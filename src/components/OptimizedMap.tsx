import React, { useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

/**
 * Google Maps 地图组件
 * 
 * 功能：
 * 1. 直接加载并显示 Google Maps
 * 2. 提供在新窗口打开的选项
 * 3. 添加加载状态指示器
 * 4. 错误处理和备选方案
 */
export const OptimizedMap: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  // 地址信息
  const address = '浙江省杭州市临平区崇贤街道沪瑞线1号';
  const addressEn = 'No. 1, Huruixian Road, Chongxian Street, Linping District, Hangzhou, Zhejiang, China';
  
  // 坐标信息（杭州市临平区崇贤街道沪瑞线1号的精确坐标）
  const latitude = 30.4344;
  const longitude = 120.2593;
  
  // Google Maps Embed URL（直接嵌入）
  const googleMapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed&hl=zh-CN`;
  
  // Google Maps 打开链接
  const googleMapLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  // 处理 iframe 加载完成
  const handleMapLoad = () => {
    setIsLoading(false);
    setMapError(false);
  };

  // 处理 iframe 加载错误
  const handleMapError = () => {
    setMapError(true);
    setIsLoading(false);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg h-[400px] md:h-[500px] relative bg-gray-100">
      {/* 加载状态指示器 */}
      {isLoading && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-[#047857] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 font-medium">正在加载 Google Maps...</p>
            <p className="text-gray-500 text-sm mt-2">Loading Google Maps...</p>
          </div>
        </div>
      )}
      
      {mapError ? (
        // 地图加载失败时的错误提示
        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="mb-4">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">无法加载地图</h3>
            <p className="text-gray-600 mb-1 text-sm">{address}</p>
            <p className="text-gray-500 mb-6 text-sm">{addressEn}</p>
            <p className="text-gray-600 mb-4">请点击下方按钮在 Google Maps 中查看位置</p>
            <a
              href={googleMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#047857] hover:bg-[#064E3B] text-white px-6 py-3 rounded-lg transition-colors shadow-lg"
            >
              <ExternalLink className="h-5 w-5" />
              <span className="font-medium">在 Google Maps 中打开</span>
            </a>
          </div>
        </div>
      ) : (
        // Google Maps iframe
        <>
          <iframe 
            src={googleMapUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps - Hangzhou Karn New Building Materials Co., Ltd."
            onLoad={handleMapLoad}
            onError={handleMapError}
          ></iframe>
          
          {/* 在新窗口打开按钮 */}
          <div className="absolute bottom-4 right-4">
            <a
              href={googleMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl text-sm font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              <span>在 Google Maps 中打开</span>
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default OptimizedMap;
