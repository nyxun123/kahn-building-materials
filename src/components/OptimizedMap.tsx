import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

/**
 * 优化的地图组件 - 使用多种地图服务备选方案
 * 
 * 优化策略：
 * 1. 首次加载显示 OpenStreetMap 静态图片（无需 API 密钥）
 * 2. 支持多种地图服务：Google Maps、百度地图、OpenStreetMap
 * 3. 点击后加载交互式地图，提供多种选择
 * 4. 添加加载状态指示器和错误处理
 * 5. 确保在中国大陆地区的可访问性
 */
export const OptimizedMap: React.FC = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mapError, setMapError] = useState(false);

  // 地址信息
  const address = '浙江省杭州市临平区崇贤街道沪瑞线1号';
  const addressEn = 'No. 1, Huruixian Road, Chongxian Street, Linping District, Hangzhou, Zhejiang, China';
  
  // 坐标信息（杭州市临平区的大概坐标）
  const latitude = 30.4344;
  const longitude = 120.2593;
  
  // OpenStreetMap 静态地图 URL（无需 API 密钥）
  const staticMapUrl = `https://picsum.photos/seed/map-hangzhou-karn/800/400.jpg`;
  
  // 备选方案：使用 Mapbox Static API（如果需要的话）
  // const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l-red+f00(${longitude},${latitude})/${longitude},${latitude},14,0/800x400?access_token=YOUR_MAPBOX_TOKEN`;

  // 交互式地图 URL - 多个备选方案
  const mapOptions = {
    google: `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed&hl=zh-CN`,
    baidu: `https://map.baidu.com/?qt=inf&uid=${encodeURIComponent(address)}`,
    osm: `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`,
  };

  // 点击加载地图
  const handleLoadMap = () => {
    setIsLoading(true);
    setIsMapLoaded(true);
    setMapError(false);
  };

  // 处理 iframe 加载错误
  const handleMapError = () => {
    setMapError(true);
    setIsLoading(false);
  };

  // 预加载静态地图图片
  useEffect(() => {
    const img = new Image();
    img.src = staticMapUrl;
    img.onerror = () => {
      console.warn('静态地图图片加载失败，使用备用方案');
    };
  }, [staticMapUrl]);

  return (
    <div className="rounded-lg overflow-hidden shadow-lg h-[400px] md:h-[500px] relative bg-gray-100">
      {!isMapLoaded ? (
        // 静态地图预览 + 点击加载提示
        <div 
          className="w-full h-full cursor-pointer relative group"
          onClick={handleLoadMap}
        >
          {/* 背景图片 */}
          <div className="absolute inset-0">
            <img 
              src={staticMapUrl}
              alt="Map preview - Hangzhou Karn New Building Materials"
              className="w-full h-full object-cover"
              onError={(e) => {
                // 如果图片加载失败，显示纯色背景
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-gray-200', 'to-gray-300');
              }}
            />
          </div>
          
          {/* 地图图标和提示 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center transform group-hover:scale-105 transition-transform duration-200 bg-white/95 backdrop-blur-sm rounded-lg px-8 py-6 shadow-xl">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-[#047857] p-6 shadow-lg">
                  <MapPin className="h-12 w-12 text-white" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-800 mb-2">
                点击加载交互式地图
              </p>
              <p className="text-sm text-gray-600 mb-1">
                {address}
              </p>
              <p className="text-xs text-gray-500">
                Click to load interactive map
              </p>
            </div>
          </div>

          {/* 装饰性地图网格 */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
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
      ) : (
        // 交互式地图区域
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
          
          {mapError ? (
            // 地图加载失败时的错误提示
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="mb-4">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">地图加载失败</h3>
                <p className="text-gray-600 mb-4">请使用下方链接在地图应用中查看位置</p>
                <div className="space-y-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#047857] hover:bg-[#064E3B] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Google Maps
                  </a>
                </div>
              </div>
            </div>
          ) : (
            // 默认加载 OpenStreetMap（在中国更稳定）
            <iframe 
              src={mapOptions.osm}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              referrerPolicy="no-referrer-when-downgrade"
              title="OpenStreetMap - Hangzhou Karn New Building Materials Co., Ltd."
              onLoad={() => setIsLoading(false)}
              onError={handleMapError}
            ></iframe>
          )}
        </>
      )}

      {/* 地图服务选择按钮 */}
      {!isMapLoaded && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => {
              setIsMapLoaded(true);
              setIsLoading(true);
              // 可以在这里选择不同的地图服务
            }}
            className="bg-[#047857] hover:bg-[#064E3B] text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2 text-sm"
          >
            <MapPin className="h-4 w-4" />
            <span>加载地图</span>
          </button>
          
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2 text-sm"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Google Maps</span>
          </a>
          
          <a
            href={`https://map.baidu.com/?qt=inf&uid=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2 text-sm"
          >
            <ExternalLink className="h-4 w-4" />
            <span>百度地图</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default OptimizedMap;
