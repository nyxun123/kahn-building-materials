import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 中文界面组件
const AdminChineseInterface = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    todayVisits: 0,
    pendingReviews: 0
  });

  // 中文菜单配置
  const menuItems = [
    { key: 'dashboard', label: '仪表板', icon: '📊' },
    { key: 'products', label: '产品管理', icon: '📦' },
    { key: 'users', label: '用户管理', icon: '👥' },
    { key: 'content', label: '内容管理', icon: '📝' },
    { key: 'settings', label: '系统设置', icon: '⚙️' },
    { key: 'analytics', label: '数据分析', icon: '📈' },
    { key: 'logs', label: '操作日志', icon: '🔍' }
  ];

  // 中文数据
  const dashboardStats = [
    { name: '总产品数', value: stats.totalProducts, color: '#3b82f6' },
    { name: '总用户数', value: stats.totalUsers, color: '#10b981' },
    { name: '今日访问', value: stats.todayVisits, color: '#f59e0b' },
    { name: '待审核', value: stats.pendingReviews, color: '#ef4444' }
  ];

  // 中文产品表格
  const ProductTable = () => (
    <Card>
      <CardHeader>
        <CardTitle>产品列表</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>产品ID</TableHead>
              <TableHead>产品名称</TableHead>
              <TableHead>价格</TableHead>
              <TableHead>库存</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>示例产品</TableCell>
              <TableCell>¥99.99</TableCell>
              <TableCell>100</TableCell>
              <TableCell>
                <Badge variant="success">已发布</Badge>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline">编辑</Button>
                <Button size="sm" variant="destructive" className="ml-2">删除</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  // 中文用户管理
  const UserTable = () => (
    <Card>
      <CardHeader>
        <CardTitle>用户管理</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户ID</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>niexianlei0@gmail.com</TableCell>
              <TableCell>倪先生</TableCell>
              <TableCell>
                <Badge variant="default">超级管理员</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="success">激活</Badge>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline">编辑</Button>
                <Button size="sm" variant="outline" className="ml-2">重置密码</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  // 中文仪表板
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>今日数据图表</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  // 中文快捷操作按钮
  const QuickActions = () => (
    <div className="flex gap-4 mb-6">
      <Button className="bg-blue-600 hover:bg-blue-700">
        <span className="mr-2">➕</span>添加产品
      </Button>
      <Button className="bg-green-600 hover:bg-green-700">
        <span className="mr-2">👤</span>添加用户
      </Button>
      <Button className="bg-purple-600 hover:bg-purple-700">
        <span className="mr-2">📊</span>查看报表
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 中文顶部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">欢迎，倪先生</span>
            <Button variant="outline" size="sm">
              退出登录
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 中文侧边菜单 */}
        <aside className="w-64 bg-white shadow-sm">
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 ${
                    activeTab === item.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* 中文主内容区 */}
        <main className="flex-1 p-6">
          <QuickActions />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>
            
            <TabsContent value="products">
              <div>
                <h2 className="text-2xl font-bold mb-4">产品管理</h2>
                <ProductTable />
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <div>
                <h2 className="text-2xl font-bold mb-4">用户管理</h2>
                <UserTable />
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>系统设置</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">网站名称</label>
                      <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="输入网站名称" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">联系邮箱</label>
                      <input type="email" className="w-full px-3 py-2 border rounded-md" placeholder="输入联系邮箱" />
                    </div>
                    <Button>保存设置</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminChineseInterface;