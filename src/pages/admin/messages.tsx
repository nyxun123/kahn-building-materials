import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { zhCN, enUS, ru } from 'date-fns/locale';
import {
  RiSearchLine,
  RiEyeLine,
  RiMailCheckLine,
  RiMailLine,
  RiDeleteBin6Line,
  RiMailCloseLine,
  RiArrowLeftSLine
} from 'react-icons/ri';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Message = Database['public']['Tables']['contact_messages']['Row'];

const getDateLocale = (language: string) => {
  switch (language) {
    case 'zh':
      return zhCN;
    case 'ru':
      return ru;
    default:
      return enUS;
  }
};

const Messages = () => {
  const { t, i18n } = useTranslation('admin');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: getDateLocale(i18n.language) });
    } catch (e) {
      return dateString;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('加载留言列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (message: Message) => {
    setMessageToDelete(message);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageToDelete.id);

      if (error) {
        throw error;
      }

      setMessages((prevMessages) => 
        prevMessages.filter((m) => m.id !== messageToDelete.id)
      );
      toast.success(t('messages.delete_success'));

      // 如果正在查看该留言，关闭详情面板
      if (selectedMessage?.id === messageToDelete.id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error(t('messages.delete_error'));
    } finally {
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setMessageToDelete(null);
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setAdminNotes(message.admin_notes || '');

    // 如果是未读留言，标记为已读
    if (!message.is_read) {
      updateMessageStatus(message.id, true, message.status);
    }
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
  };

  const updateMessageStatus = async (messageId: number, isRead: boolean, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: isRead, status: status })
        .eq('id', messageId);

      if (error) {
        throw error;
      }

      // 更新本地数据
      setMessages((prevMessages) =>
        prevMessages.map((m) =>
          m.id === messageId ? { ...m, is_read: isRead, status: status } : m
        )
      );

      if (selectedMessage?.id === messageId) {
        setSelectedMessage((prev) => prev ? { ...prev, is_read: isRead, status: status } : null);
      }

      toast.success(t('messages.update_success'));
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error(t('messages.update_error'));
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;

    try {
      setSavingNotes(true);
      const { error } = await supabase
        .from('contact_messages')
        .update({ admin_notes: adminNotes })
        .eq('id', selectedMessage.id);

      if (error) {
        throw error;
      }

      // 更新本地数据
      setMessages((prevMessages) =>
        prevMessages.map((m) =>
          m.id === selectedMessage.id ? { ...m, admin_notes: adminNotes } : m
        )
      );

      setSelectedMessage((prev) => prev ? { ...prev, admin_notes: adminNotes } : null);

      toast.success('管理员注释已保存');
    } catch (error) {
      console.error('Error saving admin notes:', error);
      toast.error('保存管理员注释失败');
    } finally {
      setSavingNotes(false);
    }
  };

  const markAsRead = (message: Message) => {
    updateMessageStatus(message.id, true, message.status);
  };

  const markAsUnread = (message: Message) => {
    updateMessageStatus(message.id, false, message.status);
  };

  const changeStatus = (message: Message, newStatus: string) => {
    updateMessageStatus(message.id, message.is_read, newStatus);
  };

  const getStatusBadge = (status: string, isRead: boolean) => {
    if (status === 'replied') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          {t('messages.replied')}
        </span>
      );
    }
    
    if (!isRead) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {t('messages.new')}
        </span>
      );
    }
    
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        {t('messages.read')}
      </span>
    );
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (message.subject && message.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedMessage) {
    return (
      <>
        <Helmet>
          <title>{t('messages.message_details')} | 杭州卡恩新型建材有限公司</title>
        </Helmet>

        <div className="container mx-auto px-4 py-8">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6"
          >
            <RiArrowLeftSLine size={20} className="mr-1" />
            {t('messages.back_to_list')}
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">{t('messages.message_details')}</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('messages.sender_info')}</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">{t('messages.name')}</span>
                      <span className="block mt-1">{selectedMessage.name}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">{t('messages.email')}</span>
                      <span className="block mt-1">{selectedMessage.email}</span>
                    </div>
                    {selectedMessage.company && (
                      <div>
                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">{t('messages.company')}</span>
                        <span className="block mt-1">{selectedMessage.company}</span>
                      </div>
                    )}
                    {selectedMessage.phone && (
                      <div>
                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">{t('messages.phone')}</span>
                        <span className="block mt-1">{selectedMessage.phone}</span>
                      </div>
                    )}
                    {selectedMessage.country && (
                      <div>
                        <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">{t('messages.country')}</span>
                        <span className="block mt-1">{selectedMessage.country}</span>
                      </div>
                    )}
                    <div>
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">{t('messages.received_on')}</span>
                      <span className="block mt-1">{formatDate(selectedMessage.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">{t('messages.message_content')}</h3>
                  {selectedMessage.subject && (
                    <div className="mb-3">
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">{t('messages.subject')}</span>
                      <span className="block mt-1 font-medium">{selectedMessage.subject}</span>
                    </div>
                  )}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">{t('messages.admin_notes')}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => changeStatus(selectedMessage, 'replied')}
                          className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-md text-sm hover:bg-green-200 dark:hover:bg-green-800"
                        >
                          标记为已回复
                        </button>
                        {selectedMessage.is_read ? (
                          <button
                            onClick={() => markAsUnread(selectedMessage)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-md text-sm hover:bg-blue-200 dark:hover:bg-blue-800"
                          >
                            {t('messages.mark_unread')}
                          </button>
                        ) : (
                          <button
                            onClick={() => markAsRead(selectedMessage)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            {t('messages.mark_read')}
                          </button>
                        )}
                      </div>
                    </div>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white mt-2"
                      placeholder="添加管理员注释，只有管理员可见..."
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleSaveNotes}
                        disabled={savingNotes}
                        className="px-4 py-2 bg-primary text-white rounded-md shadow-sm text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingNotes ? '保存中...' : t('messages.save_notes')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('messages.title')} | 杭州卡恩新型建材有限公司</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t('messages.title')}</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('messages.search')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              {searchQuery ? '没有找到匹配的留言' : t('messages.no_messages')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('messages.name')}
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('messages.email')}
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('messages.subject')}
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('messages.date')}
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('messages.status')}
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('messages.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredMessages.map((message) => (
                    <tr key={message.id} className={`hover:bg-gray-50 dark:hover:bg-gray-750 ${!message.is_read ? 'font-medium bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {message.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {message.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {message.subject || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDate(message.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getStatusBadge(message.status, message.is_read)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewMessage(message)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            title={t('messages.view')}
                          >
                            <RiEyeLine size={20} />
                          </button>
                          
                          {message.status !== 'replied' && (
                            <button
                              onClick={() => changeStatus(message, 'replied')}
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                              title="标记为已回复"
                            >
                              <RiMailCheckLine size={20} />
                            </button>
                          )}
                          
                          {message.is_read ? (
                            <button
                              onClick={() => markAsUnread(message)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title={t('messages.mark_unread')}
                            >
                              <RiMailLine size={20} />
                            </button>
                          ) : (
                            <button
                              onClick={() => markAsRead(message)}
                              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                              title={t('messages.mark_read')}
                            >
                              <RiMailCloseLine size={20} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDeleteClick(message)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title={t('messages.delete')}
                          >
                            <RiDeleteBin6Line size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && messageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-medium mb-4">{t('messages.delete_confirm')}</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {messageToDelete.name} - {messageToDelete.email}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('messages.cancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-red-700"
              >
                {t('messages.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Messages;