import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { RiSearchLine, RiEdit2Line, RiCodeSSlashLine, RiHtml5Line, RiFileTextLine } from 'react-icons/ri';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type PageContent = Database['public']['Tables']['page_contents']['Row'];

const Content = () => {
  const { t } = useTranslation('admin');
  const [contents, setContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<PageContent | null>(null);
  const [editedContent, setEditedContent] = useState<{
    content_zh: string;
    content_en: string;
    content_ru: string;
  }>({ content_zh: '', content_en: '', content_ru: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContents();
  }, [selectedPage]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('page_contents')
        .select('*')
        .order('page_key')
        .order('section_key');

      if (selectedPage !== 'all') {
        query = query.eq('page_key', selectedPage);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setContents(data || []);
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error('加载内容列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (content: PageContent) => {
    setSelectedContent(content);
    setEditedContent({
      content_zh: content.content_zh || '',
      content_en: content.content_en || '',
      content_ru: content.content_ru || '',
    });
  };

  const handleContentChange = (language: 'content_zh' | 'content_en' | 'content_ru', value: string) => {
    setEditedContent((prev) => ({
      ...prev,
      [language]: value,
    }));
  };

  const handleCancel = () => {
    setSelectedContent(null);
  };

  const handleSave = async () => {
    if (!selectedContent) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('page_contents')
        .update({
          content_zh: editedContent.content_zh,
          content_en: editedContent.content_en,
          content_ru: editedContent.content_ru,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedContent.id);

      if (error) {
        throw error;
      }

      // 更新本地数据
      setContents((prevContents) =>
        prevContents.map((c) =>
          c.id === selectedContent.id
            ? {
                ...c,
                content_zh: editedContent.content_zh,
                content_en: editedContent.content_en,
                content_ru: editedContent.content_ru,
                updated_at: new Date().toISOString(),
              }
            : c
        )
      );

      toast.success(t('content.update_success'));
      setSelectedContent(null);
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error(t('content.update_error'));
    } finally {
      setIsSaving(false);
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'html':
        return <RiHtml5Line size={20} className="text-orange-500" />;
      case 'json':
        return <RiCodeSSlashLine size={20} className="text-blue-500" />;
      default: // text
        return <RiFileTextLine size={20} className="text-gray-500" />;
    }
  };

  const getPageName = (pageKey: string) => {
    switch (pageKey) {
      case 'home':
        return t('content.home');
      case 'about':
        return t('content.about');
      case 'products':
        return '产品页面';
      case 'oem':
        return 'OEM服务';
      case 'contact':
        return '联系我们';
      default:
        return pageKey;
    }
  };

  const filteredContents = contents.filter(
    (content) =>
      content.page_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.section_key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>{t('content.title')} | 杭州卡恩新型建材有限公司</title>
      </Helmet>

      {selectedContent ? (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">{t('content.content_editor')}</h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                {getPageName(selectedContent.page_key)} - {selectedContent.section_key}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedContent.content_type.toUpperCase()}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">{t('content.chinese')}</h3>
                <textarea
                  value={editedContent.content_zh}
                  onChange={(e) => handleContentChange('content_zh', e.target.value)}
                  className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white font-mono"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">{t('content.english')}</h3>
                <textarea
                  value={editedContent.content_en}
                  onChange={(e) => handleContentChange('content_en', e.target.value)}
                  className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white font-mono"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">{t('content.russian')}</h3>
                <textarea
                  value={editedContent.content_ru}
                  onChange={(e) => handleContentChange('content_ru', e.target.value)}
                  className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('content.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-primary text-white rounded-md shadow-sm text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? t('content.saving') : t('content.save')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">{t('content.title')}</h1>

          <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-64">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('content.select_page')}
              </label>
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              >
                <option value="all">所有页面</option>
                <option value="home">{t('content.home')}</option>
                <option value="about">{t('content.about')}</option>
                <option value="products">产品页面</option>
                <option value="oem">OEM服务</option>
                <option value="contact">联系我们</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                搜索
              </label>
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('content.search')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredContents.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                {searchQuery || selectedPage !== 'all' ? '没有找到匹配的内容' : t('content.no_content')}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        页面
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('content.section')}
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('content.content_type')}
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('content.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredContents.map((content) => (
                      <tr key={content.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getPageName(content.page_key)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {content.section_key}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            {getContentTypeIcon(content.content_type)}
                            <span className="ml-2">
                              {content.content_type === 'text'
                                ? t('content.text')
                                : content.content_type === 'html'
                                ? t('content.html')
                                : t('content.json')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEditClick(content)}
                            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <RiEdit2Line size={18} className="mr-1" />
                            {t('content.edit')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Content;