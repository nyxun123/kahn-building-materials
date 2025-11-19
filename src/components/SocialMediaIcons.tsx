import React from 'react';
import { useTranslation } from 'react-i18next';
import { Youtube, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { SOCIAL_LINKS, WHATSAPP_LINK } from '@/lib/social-links';
import { cn } from '@/lib/utils';

interface SocialMediaIconsProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'navbar' | 'footer' | 'floating';
  className?: string;
}

export function SocialMediaIcons({ 
  size = 'md', 
  variant = 'navbar',
  className 
}: SocialMediaIconsProps) {
  const { t } = useTranslation('common');

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconSizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const baseClasses = cn(
    'flex items-center justify-center rounded-full transition-all duration-300',
    sizeClasses[size],
    variant === 'navbar' && 'hover:scale-110',
    variant === 'footer' && 'hover:scale-110',
    variant === 'floating' && 'hover:scale-125 shadow-lg'
  );

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* YouTube */}
      <a
        href={SOCIAL_LINKS.youtube}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseClasses, 'bg-red-600 hover:bg-red-700')}
        title={t('social.youtube')}
        aria-label={t('social.youtube')}
      >
        <Youtube className={cn(iconSizeClasses[size], 'text-white')} />
      </a>

      {/* Instagram */}
      <a
        href={SOCIAL_LINKS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseClasses, 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600')}
        title={t('social.instagram')}
        aria-label={t('social.instagram')}
      >
        <Instagram className={cn(iconSizeClasses[size], 'text-white')} />
      </a>

      {/* Facebook */}
      <a
        href={SOCIAL_LINKS.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseClasses, 'bg-blue-600 hover:bg-blue-700')}
        title={t('social.facebook')}
        aria-label={t('social.facebook')}
      >
        <Facebook className={cn(iconSizeClasses[size], 'text-white')} />
      </a>

      {/* WhatsApp */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseClasses, 'bg-green-500 hover:bg-green-600')}
        title={t('social.whatsapp')}
        aria-label={t('social.whatsapp')}
      >
        <MessageCircle className={cn(iconSizeClasses[size], 'text-white')} />
      </a>
    </div>
  );
}










