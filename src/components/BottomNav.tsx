import { Home, Package, Zap, MessageSquare, Menu, Building2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function BottomNav() {
    const { t, i18n } = useTranslation('common');
    const location = useLocation();
    const currentLang = i18n.language || 'en';

    // Define navigation items
    const navItems = [
        {
            name: t('nav.home'),
            icon: Home,
            path: `/${currentLang}`,
            isActive: (path: string) => path === `/${currentLang}` || path === `/${currentLang}/`
        },
        {
            name: t('nav.products'), // Renamed back to Products for B2B clarity, effectively Categories
            icon: Package,
            path: `/${currentLang}/products`,
            isActive: (path: string) => path.includes('/products') || (path.includes('/applications') && false)
        },
        {
            name: t('nav.factory'), // New "Factory" tab
            icon: Building2, // Need to import Building2
            path: `/${currentLang}/about`,
            isActive: (path: string) => path.includes('/about') || path.includes('/oem')
        },
        {
            name: t('nav.contact'),
            icon: MessageSquare,
            path: `/${currentLang}/contact`,
            isActive: (path: string) => path.includes('/contact')
        }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const active = item.isActive(location.pathname);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                active ? "text-[#047857]" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <item.icon className={cn("h-6 w-6", active && "fill-current/10")} strokeWidth={active ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
