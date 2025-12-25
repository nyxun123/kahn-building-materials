import { PropsWithChildren } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { Helmet } from "react-helmet-async";
import {
  Card,
  Title,
  Text,
  Metric,
  Divider,
  Flex,
} from "@tremor/react";
import {
  LayoutDashboard,
  Package2,
  MessagesSquare,
  FileText,
  Building2,
  LogOut,
  Globe,
  Search,
  TrendingUp,
  MapPin,
  Home,
  Image,
} from "lucide-react";
import { AdminProvider } from "./refine/admin-provider";


const NAV_ITEMS = [
  {
    label: "仪表盘",
    description: "查看整体指标与实时数据",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "产品管理",
    description: "维护产品信息与上下架状态",
    path: "/admin/products",
    icon: Package2,
  },
  {
    label: "客户留言",
    description: "查看并回复联系表单",
    path: "/admin/messages",
    icon: MessagesSquare,
  },
  {
    label: "内容管理",
    description: "多语言内容与模块文案",
    path: "/admin/content",
    icon: FileText,
  },
  {
    label: "首页内容",
    description: "首页板块内容管理",
    path: "/admin/home-content",
    icon: Home,
  },
  {
    label: "媒体库",
    description: "图片和视频文件管理",
    path: "/admin/media-library",
    icon: Image,
  },
  {
    label: "公司信息",
    description: "企业介绍与资质资料",
    path: "/admin/company-info",
    icon: Building2,
  },
  {
    label: "SEO优化",
    description: "搜索引擎优化与地理位置",
    path: "/admin/seo",
    icon: Search,
  },
  {
    label: "网站分析",
    description: "流量统计与用户行为",
    path: "/admin/analytics",
    icon: TrendingUp,
  },
  {
    label: "网站地图",
    description: "多语言URL与索引管理",
    path: "/admin/sitemap",
    icon: MapPin,
  },
];

type Identity = {
  id: string;
  name?: string;
  email?: string;
};

const Shell = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: identity } = useGetIdentity<Identity>();
  const { mutate: logout } = useLogout();

  return (
    <>
      {/* 禁止搜索引擎索引管理后台页面 */}
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <div className="flex min-h-screen">
          <aside className="hidden w-80 shrink-0 border-r border-slate-200 bg-white/95 backdrop-blur lg:flex lg:flex-col">
            <div className="px-6 py-8">
              <Title className="text-2xl font-semibold text-slate-900">KARN 后台</Title>
              <Text className="mt-2 text-sm text-slate-500">
                使用 Tremor + Refine 提供的高效管理体验
              </Text>
            </div>
            <Divider className="mb-4" />
            <nav className="flex-1 space-y-3 px-4 pb-6">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Card
                    key={item.path}
                    decoration={isActive ? "top" : undefined}
                    decorationColor="indigo"
                    className={`cursor-pointer border transition hover:shadow-sm ${isActive ? "border-indigo-200 bg-indigo-50" : "border-transparent"
                      }`}
                    onClick={() => navigate(item.path)}
                  >
                    <Flex alignItems="start" justifyContent="start">
                      <div className={`rounded-md p-2 ${isActive ? "bg-indigo-500/10" : "bg-slate-100"}`}>
                        <Icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-slate-500"}`} />
                      </div>
                      <div>
                        <Text className="font-semibold text-slate-900">{item.label}</Text>
                        <Text className="text-xs text-slate-500">{item.description}</Text>
                      </div>
                    </Flex>
                  </Card>
                );
              })}
            </nav>
            <div className="border-t border-slate-200 p-6">
              <Text className="text-xs uppercase tracking-wide text-slate-400">当前用户</Text>
              <Metric className="mt-2 text-base text-slate-900">
                {identity?.name || identity?.email || "管理员"}
              </Metric>
              <Text className="text-xs text-slate-500">{identity?.email}</Text>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => window.open("/", "_blank")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
                >
                  <Globe className="h-4 w-4" />
                  前往官网
                </button>
                <button
                  type="button"
                  onClick={() => logout({})}
                  className="flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm text-white shadow-sm transition hover:bg-slate-700"
                >
                  <LogOut className="h-4 w-4" />
                  退出
                </button>
              </div>
            </div>
          </aside>

          <main className="flex flex-1 flex-col">
            <header className="border-b border-slate-200 bg-white/70 px-6 py-4 backdrop-blur">
              <Flex justifyContent="between" alignItems="center">
                <div>
                  <Title className="text-xl text-slate-900">
                    {NAV_ITEMS.find((item) => location.pathname.startsWith(item.path))?.label || "仪表盘"}
                  </Title>
                  <Text className="text-sm text-slate-500">
                    欢迎回来，{identity?.name || identity?.email || "管理员"}
                  </Text>
                </div>
                <div className="flex items-center gap-3 lg:hidden">
                  <button
                    type="button"
                    onClick={() => window.open("/", "_blank")}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600"
                  >
                    官网
                  </button>
                  <button
                    type="button"
                    onClick={() => logout({})}
                    className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
                  >
                    退出
                  </button>
                </div>
              </Flex>
            </header>

            <div className="flex-1 bg-slate-50 p-4 md:p-6">
              <div className="mx-auto w-full max-w-6xl space-y-6">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const AdminLayout = () => (
  <AdminProvider>
    <Shell>
      <Outlet />
    </Shell>
  </AdminProvider>
);

export default AdminLayout;
