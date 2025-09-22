import type {
  DataProvider,
  HttpError,
  BaseRecord,
  CrudFilters,
  LogicalFilter,
  CrudSorting,
} from "@refinedev/core";

const API_BASE = "/api/admin";

type ResourceMap = Record<string, string>;

const resourceMap: ResourceMap = {
  products: "products",
  messages: "contacts",
  contents: "contents",
  "company-info": "company/info",
  "company-content": "company/content",
};

const resolveEndpoint = (resource: string): string => {
  const mapped = resourceMap[resource] ?? resource;
  return `${API_BASE}/${mapped}`;
};

const getAuthHeader = () => {
  if (typeof window === "undefined") return {};
  try {
    const adminAuth = localStorage.getItem("admin-auth");
    if (adminAuth) {
      const parsed = JSON.parse(adminAuth);
      return parsed?.token
        ? { Authorization: `Bearer ${parsed.token}` }
        : { Authorization: "Bearer admin-session" };
    }
    const tempAuth = localStorage.getItem("temp-admin-auth");
    if (tempAuth) {
      return { Authorization: "Bearer temp-admin" };
    }
  } catch (error) {
    console.warn("读取本地认证信息失败", error);
  }
  return {};
};

const buildUrl = (resource: string, id?: string | number, query?: Record<string, unknown>) => {
  const endpoint = resolveEndpoint(resource);
  const url = new URL(endpoint, window.location.origin);
  if (id !== undefined) {
    url.pathname += `/${id}`;
  }
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
};

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error: HttpError = {
      message: data?.error?.message || data?.message || response.statusText,
      statusCode: response.status,
    };
    throw error;
  }

  return data as T;
}

interface APIListResponse<TData extends BaseRecord> {
  data: TData[];
  pagination?: {
    total?: number;
    totalPages?: number;
  };
}

export const adminDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const current = pagination?.current || 1;
    const pageSize = pagination?.pageSize || 20;

    const params: Record<string, unknown> = {
      page: current,
      limit: pageSize,
      ...(meta?.query ?? {}),
    };

    if (filters) {
      (filters as CrudFilters).forEach((filter) => {
        if ("field" in filter) {
          const logicalFilter = filter as LogicalFilter;
          if (Array.isArray(logicalFilter.value)) {
            params[logicalFilter.field] = logicalFilter.value.join(",");
          } else if (logicalFilter.value !== undefined) {
            params[logicalFilter.field] = logicalFilter.value;
          }
        }
      });
    }

    if (sorters && sorters.length > 0) {
      const sorter = (sorters as CrudSorting)[0];
      params.sort = sorter.field;
      params.order = sorter.order;
    }

    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const url = buildUrl(resource, undefined, params);
    const response = await fetch(url, { headers, method: "GET" });
    const payload = await parseResponse<APIListResponse<BaseRecord>>(response);

    return {
      data: (payload.data as BaseRecord[]) as BaseRecord[],
      total:
        payload.pagination?.total ??
        (payload.data ? (payload.data as BaseRecord[]).length : 0),
    } as any;
  },

  getOne: async ({ resource, id }) => {
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const url = buildUrl(resource, id);
    const response = await fetch(url, { headers, method: "GET" });
    const payload = await parseResponse<{ data: BaseRecord }>(response);

    return {
      data: (payload.data ?? (payload as unknown as BaseRecord)) as BaseRecord,
    } as any;
  },

  create: async ({ resource, variables }) => {
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const url = buildUrl(resource);
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(variables),
    });
    const payload = await parseResponse<{ data: BaseRecord }>(response);

    return {
      data: (payload.data ?? (payload as unknown as BaseRecord)) as BaseRecord,
    } as any;
  },

  update: async ({ resource, id, variables }) => {
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const url = buildUrl(resource, id);
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(variables),
    });

    const payload = await parseResponse<{ data: BaseRecord }>(response);
    return {
      data: (payload.data ?? (payload as unknown as BaseRecord)) as BaseRecord,
    } as any;
  },

  deleteOne: async ({ resource, id }) => {
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const url = buildUrl(resource, id);
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    const payload = await parseResponse<{ data: BaseRecord }>(response);
    return {
      data: (payload.data ?? (payload as unknown as BaseRecord)) as BaseRecord,
    } as any;
  },

  getApiUrl: () => API_BASE,
};
