interface BlogImageMeta {
  small: string;
  medium: string;
  width: number;
  height: number;
}

const BLOG_COVER_IMAGE_META: Record<string, BlogImageMeta> = {
  '/images/blog/cms-textile-cover.jpg': {
    small: '/images/blog/cms-textile-cover-480.jpg',
    medium: '/images/blog/cms-textile-cover-800.jpg',
    width: 1600,
    height: 1061,
  },
  '/images/blog/cms-construction-cover.jpg': {
    small: '/images/blog/cms-construction-cover-480.jpg',
    medium: '/images/blog/cms-construction-cover-800.jpg',
    width: 1600,
    height: 1067,
  },
  '/images/blog/cms-desiccant-cover.jpg': {
    small: '/images/blog/cms-desiccant-cover-480.jpg',
    medium: '/images/blog/cms-desiccant-cover-800.jpg',
    width: 1600,
    height: 1067,
  },
  '/images/blog/cms-ink-paper-cover.jpg': {
    small: '/images/blog/cms-ink-paper-cover-480.jpg',
    medium: '/images/blog/cms-ink-paper-cover-800.jpg',
    width: 1024,
    height: 1024,
  },
  '/images/blog/professional_wallpaper_glue_powder_packaging.jpg': {
    small: '/images/blog/professional_wallpaper_glue_powder_packaging-480.jpg',
    medium: '/images/blog/professional_wallpaper_glue_powder_packaging-800.jpg',
    width: 1169,
    height: 1280,
  },
};

interface BlogCoverImageSource {
  src: string;
  srcSet?: string;
  webpSrcSet?: string;
  width: number;
  height: number;
}

const DEFAULT_COVER_SIZE = {
  width: 1600,
  height: 900,
};

export function getBlogCoverImageSource(imageUrl: string): BlogCoverImageSource {
  const [path, search = ''] = imageUrl.split('?');
  const query = search ? `?${search}` : '';
  const coverMeta = BLOG_COVER_IMAGE_META[path];

  if (!coverMeta) {
    return {
      src: imageUrl,
      width: DEFAULT_COVER_SIZE.width,
      height: DEFAULT_COVER_SIZE.height,
    };
  }

  const toWebp = (input: string): string => input.replace(/\.(jpe?g|png)$/i, '.webp');

  return {
    src: `${path}${query}`,
    srcSet: `${coverMeta.small}${query} 480w, ${coverMeta.medium}${query} 800w, ${path}${query} ${coverMeta.width}w`,
    webpSrcSet: `${toWebp(coverMeta.small)}${query} 480w, ${toWebp(coverMeta.medium)}${query} 800w, ${toWebp(path)}${query} ${coverMeta.width}w`,
    width: coverMeta.width,
    height: coverMeta.height,
  };
}
