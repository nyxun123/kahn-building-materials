import { PropsWithChildren, useMemo } from "react";
import { Refine } from "@refinedev/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { adminDataProvider } from "./data-provider";
import { authProvider } from "./auth-provider";

const resources = [
  {
    name: "dashboard",
    meta: {
      label: "仪表盘",
    },
  },
  {
    name: "products",
    list: "/admin/products",
    create: "/admin/products/new",
    edit: "/admin/products/:id",
    meta: {
      label: "产品管理",
    },
  },
  {
    name: "messages",
    list: "/admin/messages",
    meta: {
      label: "客户留言",
    },
  },
  {
    name: "contents",
    list: "/admin/content",
    meta: {
      label: "内容管理",
    },
  },
  {
    name: "company-info",
    list: "/admin/company-info",
    meta: {
      label: "公司信息",
    },
  },
];

export const AdminProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            cacheTime: 5 * 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
            keepPreviousData: true,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Refine
        dataProvider={adminDataProvider}
        authProvider={authProvider}
        resources={resources}
        options={{
          syncWithLocation: false,
          warnWhenUnsavedChanges: true,
        }}
      >
        {children}
      </Refine>
    </QueryClientProvider>
  );
};
