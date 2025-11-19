import { useEffect, useState } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { FloatingContactButtons } from './FloatingContactButtons';

export function Layout() {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [forceUpdate, setForceUpdate] = useState(0);

  // 当URL中的语言参数变化时切换语言（URL是唯一来源）
  useEffect(() => {
    if (!lang) {
      return; // 如果没有语言参数，LanguageDetection会处理重定向
    }
    
    // 验证语言代码是否有效
    if (!['zh', 'en', 'ru', 'vi', 'th', 'id'].includes(lang)) {
      console.warn(`无效的语言代码: ${lang}，使用默认语言 en`);
      // 无效语言代码，重定向到英文
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/').filter(part => part !== '');
      pathParts[0] = 'en';
      window.location.href = '/' + pathParts.join('/');
      return;
    }
    
    // 确定目标语言（直接使用 URL 中的语言）
    const targetLang = lang;
    
    // 获取当前i18n语言（去掉可能的区域代码，如 'en-US' -> 'en'）
    const currentLang = (i18n.language || 'en').split('-')[0];
    
    // 统一更新 i18n（每次 URL 变化都强制更新，确保同步）
    console.log(`🔄 Layout处理语言: 当前=${currentLang}, 目标=${targetLang}, URL=${lang}`);
    
    // 如果语言不同，立即切换
    if (currentLang !== targetLang) {
      console.log(`🔄 语言变化，开始切换: ${currentLang} -> ${targetLang}`);
      i18n.changeLanguage(targetLang).then(() => {
        console.log(`✅ 语言切换成功: ${targetLang}`);
        try {
        localStorage.setItem('userLanguage', targetLang);
        } catch (e) {
          console.warn('无法保存语言偏好:', e);
        }
        // 强制重新渲染所有组件
        setForceUpdate(prev => prev + 1);
      }).catch((err) => {
        console.error('❌ 语言切换失败:', err);
      });
    } else {
      // 即使语言相同，也强制更新一次（确保组件使用最新语言）
      console.log(`✓ 语言已同步，强制更新组件: ${targetLang}`);
      setForceUpdate(prev => prev + 1);
    }
  }, [lang]); // 只依赖 lang，URL 变化时触发

  return (
    <div key={forceUpdate} className="flex flex-col min-h-screen">
      <Navbar forceUpdate={forceUpdate} />
      <main className="flex-1 pt-24">
        <Outlet />
      </main>
      <Footer forceUpdate={forceUpdate} />
      {/* 右侧漂浮联络按钮 - 仅在前端页面显示，不在管理后台显示 */}
      {!location.pathname.startsWith('/admin') && <FloatingContactButtons />}
    </div>
  );
}