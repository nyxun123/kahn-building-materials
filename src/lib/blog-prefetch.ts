interface BlogArticleSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  viewCount: number;
  publishedAt: string;
  createdAt: string;
}

interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface BlogListCachePayload {
  data: BlogArticleSummary[];
  pagination: BlogPagination | null;
  cachedAt: number;
}

const BLOG_CACHE_PREFIX = 'blog_list_cache_';
const BLOG_CACHE_TTL = 30 * 60 * 1000;

const normalizeLang = (lang: string) => (lang || 'en').split('-')[0].toLowerCase();

export function getCachedBlogList(lang: string): BlogListCachePayload | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const key = `${BLOG_CACHE_PREFIX}${normalizeLang(lang)}`;
  const raw = window.sessionStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    const payload = JSON.parse(raw) as BlogListCachePayload;
    if (!payload?.cachedAt || Date.now() - payload.cachedAt > BLOG_CACHE_TTL) {
      window.sessionStorage.removeItem(key);
      return null;
    }
    return payload;
  } catch {
    window.sessionStorage.removeItem(key);
    return null;
  }
}

export function setCachedBlogList(
  lang: string,
  data: BlogArticleSummary[],
  pagination: BlogPagination | null
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const key = `${BLOG_CACHE_PREFIX}${normalizeLang(lang)}`;
  const payload: BlogListCachePayload = {
    data,
    pagination,
    cachedAt: Date.now(),
  };

  try {
    window.sessionStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Ignore storage quota/runtime errors.
  }
}

export async function prefetchBlogList(lang: string): Promise<void> {
  const normalizedLang = normalizeLang(lang);
  if (getCachedBlogList(normalizedLang)) {
    return;
  }

  try {
    const response = await fetch(`/api/blog?lang=${normalizedLang}&limit=10`);
    const payload = await response.json();
    if (payload?.success && Array.isArray(payload.data)) {
      setCachedBlogList(normalizedLang, payload.data, payload.pagination || null);
    }
  } catch {
    // Silent failure for background prefetch.
  }
}
