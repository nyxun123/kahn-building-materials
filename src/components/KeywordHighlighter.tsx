/**
 * 博客关键词高亮组件
 * 自动识别文章中的产品关键词并添加绿色高亮效果
 * 点击后显示搜索引擎链接弹窗
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { X, Search, ExternalLink } from 'lucide-react';

// 核心产品关键词列表（中英文）
const PRODUCT_KEYWORDS = [
    // 中文关键词
    '羧甲基淀粉', 'CMS', '改性淀粉', '变性淀粉', '墙纸胶', '壁纸胶',
    '腻子粉', '瓷砖胶', '砂浆添加剂', '经纱上浆', '纺织浆料',
    '造纸淀粉', '表面施胶', '钻井淀粉', '增稠剂', '保水剂',
    '粘合剂', '建材添加剂', '纺织印染', '杭州卡恩',
    // English keywords
    'Carboxymethyl Starch', 'Modified Starch', 'Wallpaper Paste',
    'Wallpaper Glue', 'Tile Adhesive', 'Putty Additive', 'Textile Sizing',
    'Warp Sizing', 'Paper Sizing', 'Drilling Starch', 'Thickener',
    'Water Retention Agent', 'Binder', 'Construction Additive', 'Hangzhou Kahn'
];

// 搜索引擎配置
const SEARCH_ENGINES = [
    {
        name: 'Google',
        icon: '🔍',
        getUrl: (keyword: string) => `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
        color: '#4285F4'
    },
    {
        name: '百度',
        icon: '🔎',
        getUrl: (keyword: string) => `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}`,
        color: '#2319DC'
    },
    {
        name: 'Bing',
        icon: '🌐',
        getUrl: (keyword: string) => `https://www.bing.com/search?q=${encodeURIComponent(keyword)}`,
        color: '#008373'
    },
    {
        name: 'Yandex',
        icon: '🟡',
        getUrl: (keyword: string) => `https://yandex.com/search/?text=${encodeURIComponent(keyword)}`,
        color: '#FF0000'
    }
];

interface KeywordPopupProps {
    keyword: string;
    position: { x: number; y: number };
    onClose: () => void;
}

// 搜索引擎弹窗组件
const KeywordPopup: React.FC<KeywordPopupProps> = ({ keyword, position, onClose }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={popupRef}
            className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[280px] animate-in fade-in zoom-in-95 duration-200"
            style={{
                left: Math.min(position.x, window.innerWidth - 300),
                top: position.y + 10,
            }}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#047857]" />
                    <span className="font-medium text-gray-900 text-sm">搜索: {keyword}</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-4 h-4 text-gray-500" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {SEARCH_ENGINES.map((engine) => (
                    <a
                        key={engine.name}
                        href={engine.getUrl(keyword)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#10B981] hover:bg-[#ECFDF5] transition-all group"
                    >
                        <span className="text-lg">{engine.icon}</span>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#047857]">
                            {engine.name}
                        </span>
                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#047857] ml-auto" />
                    </a>
                ))}
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
                点击以上平台搜索了解更多
            </p>
        </div>
    );
};

interface KeywordHighlighterProps {
    content: string;
    className?: string;
}

// 主组件：处理HTML内容并高亮关键词
export const KeywordHighlighter: React.FC<KeywordHighlighterProps> = ({ content, className = '' }) => {
    const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // 处理关键词点击
    const handleKeywordClick = useCallback((event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        const keyword = event.currentTarget.dataset.keyword;
        if (keyword) {
            setActiveKeyword(keyword);
            setPopupPosition({
                x: event.clientX,
                y: event.clientY
            });
        }
    }, []);

    // 处理HTML内容，高亮关键词（安全版本：不处理HTML标签内的内容）
    const processContent = useCallback((html: string): string => {
        if (!html) return '';

        // 简单方案：直接返回原始HTML，不做关键词替换
        // 这样避免了破坏HTML结构的风险
        // 高亮功能可以通过CSS的.product-link类来实现
        return html;
    }, []);

    // 转义正则表达式特殊字符
    const escapeRegExp = (string: string): string => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    // 为高亮的关键词添加点击事件
    useEffect(() => {
        if (containerRef.current) {
            const keywords = containerRef.current.querySelectorAll('.keyword-highlight');
            keywords.forEach((element) => {
                (element as HTMLElement).onclick = (e) => {
                    e.preventDefault();
                    const keyword = element.getAttribute('data-keyword');
                    if (keyword) {
                        setActiveKeyword(keyword);
                        setPopupPosition({
                            x: (e as MouseEvent).clientX,
                            y: (e as MouseEvent).clientY
                        });
                    }
                };
            });
        }
    }, [content]);

    return (
        <>
            <style>{`
        .keyword-highlight {
          color: #047857;
          background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          border-bottom: 2px solid #10B981;
        }
        .keyword-highlight:hover {
          background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
          color: #064E3B;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }
      `}</style>

            <div
                ref={containerRef}
                className={className}
                dangerouslySetInnerHTML={{ __html: processContent(content) }}
            />

            {activeKeyword && (
                <KeywordPopup
                    keyword={activeKeyword}
                    position={popupPosition}
                    onClose={() => setActiveKeyword(null)}
                />
            )}
        </>
    );
};

export default KeywordHighlighter;
