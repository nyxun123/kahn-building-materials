import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  created_at: string;
  status: 'new' | 'replied' | 'archived';
  is_read: boolean;
}

const ContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      
      // 尝试从API获取
      try {
        const authData = localStorage.getItem('admin-auth');
        const auth = authData ? JSON.parse(authData) : null;
        
        const response = await fetch('/api/admin/contacts', {
          headers: {
            'Authorization': `Bearer ${auth?.token || 'fallback'}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          setContacts(result.data || []);
          console.log('✅ 从API加载联系数据');
          return;
        }
      } catch (apiError) {
        console.log('API加载失败，使用本地数据:', apiError);
      }
      
      // 降级到localStorage
      const localContacts = localStorage.getItem('temp-contact-messages');
      if (localContacts) {
        try {
          const parsed = JSON.parse(localContacts);
          setContacts(Array.isArray(parsed) ? parsed : []);
          console.log('✅ 从本地存储加载联系数据');
        } catch (parseError) {
          console.error('解析本地数据失败:', parseError);
          setContacts([]);
        }
      } else {
        // 创建示例数据供展示
        const sampleContacts: Contact[] = [
          {
            id: '1',
            name: '张先生',
            email: 'zhang@example.com',
            phone: '13800138000',
            company: '上海建材有限公司',
            message: '询问胶水产品的批发价格和最小订货量。',
            created_at: new Date().toISOString(),
            status: 'new',
            is_read: false
          },
          {
            id: '2', 
            name: 'John Smith',
            email: 'john@company.com',
            phone: '+1-555-0123',
            company: 'ABC Construction',
            message: 'Interested in bulk wallpaper glue for commercial project.',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            status: 'replied',
            is_read: true
          }
        ];
        setContacts(sampleContacts);
        localStorage.setItem('temp-contact-messages', JSON.stringify(sampleContacts));
      }
      
    } catch (error) {
      console.error('加载联系数据失败:', error);
      toast.error('加载数据失败');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = (id: string, status: Contact['status']) => {
    const updated = contacts.map(contact => 
      contact.id === id ? { ...contact, status, is_read: true } : contact
    );
    setContacts(updated);
    localStorage.setItem('temp-contact-messages', JSON.stringify(updated));
    toast.success('状态更新成功');
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('zh-CN');
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: Contact['status']) => {
    const badges = {
      new: 'bg-green-100 text-green-800',
      replied: 'bg-blue-100 text-blue-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      new: '新消息',
      replied: '已回复',
      archived: '已归档'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>联系消息管理 | 管理后台</title>
      </Helmet>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            联系消息管理
          </h1>
          <button 
            onClick={loadContacts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            刷新数据
          </button>
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无联系消息</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  contact.is_read
                    ? 'bg-white border-gray-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {contact.email} | {contact.company || '个人客户'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(contact.status)}
                    <span className="text-xs text-gray-500">
                      {formatDate(contact.created_at)}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 line-clamp-2">
                  {contact.message}
                </p>
                
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateContactStatus(contact.id, 'replied');
                    }}
                    className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    标记已回复
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateContactStatus(contact.id, 'archived');
                    }}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    归档
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 联系详情弹窗 */}
        {selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    联系详情
                  </h2>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      姓名
                    </label>
                    <p className="text-gray-900">{selectedContact.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      邮箱
                    </label>
                    <p className="text-gray-900">{selectedContact.email}</p>
                  </div>
                  
                  {selectedContact.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        电话
                      </label>
                      <p className="text-gray-900">{selectedContact.phone}</p>
                    </div>
                  )}
                  
                  {selectedContact.company && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        公司
                      </label>
                      <p className="text-gray-900">{selectedContact.company}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      消息内容
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      提交时间
                    </label>
                    <p className="text-gray-900">
                      {formatDate(selectedContact.created_at)}
                    </p>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => {
                        updateContactStatus(selectedContact.id, 'replied');
                        setSelectedContact({ ...selectedContact, status: 'replied', is_read: true });
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      标记已回复
                    </button>
                    <button
                      onClick={() => {
                        updateContactStatus(selectedContact.id, 'archived');
                        setSelectedContact(null);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      归档
                    </button>
                    <a
                      href={`mailto:${selectedContact.email}?subject=回复：联系咨询&body=您好 ${selectedContact.name}，%0A%0A感谢您的咨询...`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      回复邮件
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContactsPage;