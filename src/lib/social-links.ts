/**
 * 社交媒体链接配置
 */

export const SOCIAL_LINKS = {
  tiktok: 'https://www.tiktok.com/@karn7590326808331',
  youtube: 'https://www.youtube.com/channel/UCXV9lwMgf8FaV9BLJG1CoTQ',
  instagram: 'https://www.instagram.com/karnwallpaperglue/',
  facebook: 'https://www.facebook.com/profile.php?id=61565441264146',
  whatsapp: 'https://wa.me/8613216156841', // WhatsApp 国际格式
  wechat: '13216156841', // 微信号（与手机号同号）
  skype: 'live:13216156841', // Skype ID
};

// WhatsApp 消息模板（可选）
export const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hello! I am interested in your wallpaper glue products. Can you provide more information?'
);

export const WHATSAPP_LINK = `${SOCIAL_LINKS.whatsapp}?text=${WHATSAPP_MESSAGE}`;

