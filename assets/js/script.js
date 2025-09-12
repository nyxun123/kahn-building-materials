// Language switching functionality
const translations = {
    zh: {
        // Navigation
        "Karn Materials": "卡恩建材",
        "Home": "首页",
        "Products": "产品",
        "About Us": "关于我们",
        "Contact": "联系我们",
        
        // Hero Section
        "Professional Wallpaper Adhesive Powder Export Supplier": "专业墙纸胶粉出口供应商",
        "Focusing on eco-friendly wallpaper adhesive powder production, serving global customers": "专注环保墙纸胶粉生产，服务全球客户",
        "Contact Now": "立即咨询",
        
        // Features
        "Our Features": "产品特色",
        "Eco-Friendly": "环保无毒",
        "100% natural plant starch, certified by international standards": "100%天然植物淀粉，通过国际标准认证",
        "Superior Adhesion": "超强粘性",
        "Professional formula ensures strong and lasting wallpaper adhesion": "专业配方确保墙纸粘贴牢固持久",
        "OEM Service": "OEM服务",
        "Small packaging customization with fast delivery": "小包装定制，快速交货",
        
        // Factory
        "Modern Factory": "现代化工厂",
        "Equipped with advanced production lines, annual capacity reaches 5,000 tons": "配备先进生产线，年产能5000吨",
        
        // Footer
        "Contact Info": "联系信息",
        "Hangzhou Karn New Building Materials Co., Ltd.": "杭州卡恩新型建材有限公司",
        "Address: Hangzhou, Zhejiang, China": "地址：中国浙江杭州",
        "© 2024 All Rights Reserved.": "© 2024 版权所有",
        
        // Product Page
        "Our Products": "我们的产品",
        "High-quality wallpaper adhesive powder for global markets": "高品质墙纸胶粉，服务全球市场",
        "Raw Materials": "原料介绍",
        "100% natural plant starch, eco-friendly and non-toxic": "100%天然植物淀粉，环保无毒",
        "High viscosity formula suitable for all wallpaper types": "高粘度配方，适用各种墙纸",
        "Easy to dissolve, convenient construction": "易溶解，施工方便",
        "Certified by EU CE and ISO standards": "通过欧盟CE和ISO认证",
        
        // OEM Services
        "OEM Services": "OEM服务",
        "Custom Packaging": "定制包装",
        "Various specifications from 50g to 1kg": "多种规格，从50g到1kg",
        "Private Label": "贴牌生产",
        "Support customer branding and fast response": "支持客户品牌，快速响应",
        "Fast Delivery": "快速交货",
        "Small orders delivered in 7-15 days": "小批量订单7-15天交货",
        
        // Application Scenarios
        "Application Scenarios": "适用场景",
        "Residential Use": "家庭住宅",
        "Commercial Offices": "商业办公",
        "Hotel Projects": "酒店工程",
        "Retail Stores": "零售店铺",
        
        // About Page
        "About Our Company": "关于我们公司",
        "Professional manufacturer with 13+ years export experience": "专业制造商，13年出口经验",
        "Company Introduction": "公司介绍",
        "Established in 2010, specialized in wallpaper adhesive powder": "成立于2010年，专注墙纸胶粉",
        "Factory Showcase": "工厂展示",
        "Production Workshop": "生产车间",
        "Quality Control": "质检中心",
        "R&D Laboratory": "研发实验室",
        
        // Contact Page
        "Get In Touch": "联系我们",
        "Ready to provide professional wallpaper adhesive solutions": "随时提供专业的墙纸胶粉解决方案",
        "Quick Inquiry": "快速询盘",
        "Your Name": "您的姓名",
        "Email Address": "邮箱地址",
        "Phone Number": "联系电话",
        "Country/Region": "国家/地区",
        "Required Quantity": "需求数量",
        "Detailed Requirements": "详细需求",
        "Send Inquiry": "发送询盘",
        "Working Hours: Mon-Fri 8:30-17:30 (GMT+8)": "工作时间：周一至周五 8:30-17:30 (GMT+8)"
    },
    en: {
        // Navigation
        "Karn Materials": "Karn Materials",
        "Home": "Home",
        "Products": "Products",
        "About Us": "About Us",
        "Contact": "Contact",
        
        // Hero Section
        "Professional Wallpaper Adhesive Powder Export Supplier": "Professional Wallpaper Adhesive Powder Export Supplier",
        "Focusing on eco-friendly wallpaper adhesive powder production, serving global customers": "Focusing on eco-friendly wallpaper adhesive powder production, serving global customers",
        "Contact Now": "Contact Now",
        
        // Features
        "Our Features": "Our Features",
        "Eco-Friendly": "Eco-Friendly",
        "100% natural plant starch, certified by international standards": "100% natural plant starch, certified by international standards",
        "Superior Adhesion": "Superior Adhesion",
        "Professional formula ensures strong and lasting wallpaper adhesion": "Professional formula ensures strong and lasting wallpaper adhesion",
        "OEM Service": "OEM Service",
        "Small packaging customization with fast delivery": "Small packaging customization with fast delivery",
        
        // Factory
        "Modern Factory": "Modern Factory",
        "Equipped with advanced production lines, annual capacity reaches 5,000 tons": "Equipped with advanced production lines, annual capacity reaches 5,000 tons",
        
        // Footer
        "Contact Info": "Contact Info",
        "Hangzhou Karn New Building Materials Co., Ltd.": "Hangzhou Karn New Building Materials Co., Ltd.",
        "Address: Hangzhou, Zhejiang, China": "Address: Hangzhou, Zhejiang, China",
        "© 2024 All Rights Reserved.": "© 2024 All Rights Reserved.",
        
        // Product Page
        "Our Products": "Our Products",
        "High-quality wallpaper adhesive powder for global markets": "High-quality wallpaper adhesive powder for global markets",
        "Raw Materials": "Raw Materials",
        "100% natural plant starch, eco-friendly and non-toxic": "100% natural plant starch, eco-friendly and non-toxic",
        "High viscosity formula suitable for all wallpaper types": "High viscosity formula suitable for all wallpaper types",
        "Easy to dissolve, convenient construction": "Easy to dissolve, convenient construction",
        "Certified by EU CE and ISO standards": "Certified by EU CE and ISO standards",
        
        // OEM Services
        "OEM Services": "OEM Services",
        "Custom Packaging": "Custom Packaging",
        "Various specifications from 50g to 1kg": "Various specifications from 50g to 1kg",
        "Private Label": "Private Label",
        "Support customer branding and fast response": "Support customer branding and fast response",
        "Fast Delivery": "Fast Delivery",
        "Small orders delivered in 7-15 days": "Small orders delivered in 7-15 days",
        
        // Application Scenarios
        "Application Scenarios": "Application Scenarios",
        "Residential Use": "Residential Use",
        "Commercial Offices": "Commercial Offices",
        "Hotel Projects": "Hotel Projects",
        "Retail Stores": "Retail Stores",
        
        // About Page
        "About Our Company": "About Our Company",
        "Professional manufacturer with 13+ years export experience": "Professional manufacturer with 13+ years export experience",
        "Company Introduction": "Company Introduction",
        "Established in 2010, specialized in wallpaper adhesive powder": "Established in 2010, specialized in wallpaper adhesive powder",
        "Factory Showcase": "Factory Showcase",
        "Production Workshop": "Production Workshop",
        "Quality Control": "Quality Control",
        "R&D Laboratory": "R&D Laboratory",
        
        // Contact Page
        "Get In Touch": "Get In Touch",
        "Ready to provide professional wallpaper adhesive solutions": "Ready to provide professional wallpaper adhesive solutions",
        "Quick Inquiry": "Quick Inquiry",
        "Your Name": "Your Name",
        "Email Address": "Email Address",
        "Phone Number": "Phone Number",
        "Country/Region": "Country/Region",
        "Required Quantity": "Required Quantity",
        "Detailed Requirements": "Detailed Requirements",
        "Send Inquiry": "Send Inquiry",
        "Working Hours: Mon-Fri 8:30-17:30 (GMT+8)": "Working Hours: Mon-Fri 8:30-17:30 (GMT+8)"
    },
    ru: {
        // Navigation
        "Karn Materials": "Карн Материалы",
        "Home": "Главная",
        "Products": "Продукты",
        "About Us": "О Нас",
        "Contact": "Контакты",
        
        // Hero Section
        "Professional Wallpaper Adhesive Powder Export Supplier": "Профессиональный Поставщик Клеевого Порошка для Обоев",
        "Focusing on eco-friendly wallpaper adhesive powder production, serving global customers": "Специализируемся на производстве экологичного клеевого порошка для обоев, обслуживаем глобальных клиентов",
        "Contact Now": "Связаться Сейчас",
        
        // Features
        "Our Features": "Наши Особенности",
        "Eco-Friendly": "Экологичный",
        "100% natural plant starch, certified by international standards": "100% натуральный растительный крахмал, сертифицирован по международным стандартам",
        "Superior Adhesion": "Превосходная Склейка",
        "Professional formula ensures strong and lasting wallpaper adhesion": "Профессиональная формула обеспечивает прочное и долговечное приклеивание обоев",
        "OEM Service": "OEM Услуги",
        "Small packaging customization with fast delivery": "Кастомизация малой упаковки с быстрой доставкой",
        
        // Factory
        "Modern Factory": "Современный Завод",
        "Equipped with advanced production lines, annual capacity reaches 5,000 tons": "Оснащен передовыми производственными линиями, годовая мощность 5000 тонн",
        
        // Footer
        "Contact Info": "Контактная Информация",
        "Hangzhou Karn New Building Materials Co., Ltd.": "Карн Новые Строительные Материалы ООО",
        "Address: Hangzhou, Zhejiang, China": "Адрес: Ханчжоу, Чжэцзян, Китай",
        "© 2024 All Rights Reserved.": "© 2024 Все права защищены.",
        
        // Product Page
        "Our Products": "Наши Продукты",
        "High-quality wallpaper adhesive powder for global markets": "Качественный клеевой порошок для обоев для глобальных рынков",
        "Raw Materials": "Сырье",
        "100% natural plant starch, eco-friendly and non-toxic": "100% натуральный растительный крахмал, экологичный и нетоксичный",
        "High viscosity formula suitable for all wallpaper types": "Формула высокой вязкости, подходит для всех типов обоев",
        "Easy to dissolve, convenient construction": "Легко растворяется, удобное применение",
        "Certified by EU CE and ISO standards": "Сертифицирован по стандартам ЕС CE и ISO",
        
        // OEM Services
        "OEM Services": "OEM Услуги",
        "Custom Packaging": "Индивидуальная Упаковка",
        "Various specifications from 50g to 1kg": "Различные спецификации от 50г до 1кг",
        "Private Label": "Private Label",
        "Support customer branding and fast response": "Поддержка брендирования клиента и быстрая реакция",
        "Fast Delivery": "Быстрая Доставка",
        "Small orders delivered in 7-15 days": "Малые заказы поставляются за 7-15 дней",
        
        // Application Scenarios
        "Application Scenarios": "Сценарии Применения",
        "Residential Use": "Домашнее Использование",
        "Commercial Offices": "Коммерческие Офисы",
        "Hotel Projects": "Отельные Проекты",
        "Retail Stores": "Розничные Магазины",
        
        // About Page
        "About Our Company": "О Нашей Компании",
        "Professional manufacturer with 13+ years export experience": "Профессиональный производитель с 13-летним экспортным опытом",
        "Company Introduction": "О Компании",
        "Established in 2010, specialized in wallpaper adhesive powder": "Основана в 2010 году, специализируется на клеевом порошке для обоев",
        "Factory Showcase": "Демонстрация Завода",
        "Production Workshop": "Производственный Цех",
        "Quality Control": "Контроль Качества",
        "R&D Laboratory": "Исследовательская Лаборатория",
        
        // Contact Page
        "Get In Touch": "Свяжитесь С Нами",
        "Ready to provide professional wallpaper adhesive solutions": "Готовы предоставить профессиональные решения для клеевого порошка обоев",
        "Quick Inquiry": "Быстрый Запрос",
        "Your Name": "Ваше Имя",
        "Email Address": "Адрес Электронной Почты",
        "Phone Number": "Номер Телефона",
        "Country/Region": "Страна/Регион",
        "Required Quantity": "Требуемое Количество",
        "Detailed Requirements": "Подробные Требования",
        "Send Inquiry": "Отправить Запрос",
        "Working Hours: Mon-Fri 8:30-17:30 (GMT+8)": "Рабочее время: Пн-Пт 8:30-17:30 (GMT+8)"
    }
};

// Language switching functionality
function switchLanguage(lang) {
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="switchLanguage('${lang}')"]`).classList.add('active');
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update all elements with data attributes
    const elements = document.querySelectorAll('[data-zh][data-en][data-ru]');
    elements.forEach(element => {
        if (element.dataset[lang]) {
            if (element.tagName === 'TITLE') {
                element.textContent = element.dataset[lang];
            } else {
                element.textContent = element.dataset[lang];
            }
        }
    });
    
    // Update specific language data attributes
    const langElements = document.querySelectorAll(`[data-${lang}]`);
    langElements.forEach(element => {
        if (element.dataset[lang]) {
            element.textContent = element.dataset[lang];
        }
    });
    
    // Store language preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Update placeholder texts
    updatePlaceholders(lang);
}

function updatePlaceholders(lang) {
    const placeholders = {
        zh: {
            name: "请输入您的姓名",
            email: "请输入您的邮箱地址",
            phone: "请输入您的联系电话",
            country: "请输入国家或地区",
            quantity: "如: 1吨, 500kg",
            message: "请描述您的具体需求，包括规格、包装要求、交货时间等"
        },
        en: {
            name: "Enter your full name",
            email: "Enter your email address",
            phone: "Enter your phone number",
            country: "Enter your country or region",
            quantity: "e.g., 1 ton, 500kg",
            message: "Please describe your specific requirements including specifications, packaging, delivery time, etc."
        },
        ru: {
            name: "Введите ваше полное имя",
            email: "Введите адрес электронной почты",
            phone: "Введите номер телефона",
            country: "Введите страну или регион",
            quantity: "например, 1 тонна, 500кг",
            message: "Пожалуйста, опишите ваши конкретные требования, включая спецификации, упаковку, сроки поставки и т.д."
        }
    };

    // Update form placeholders
    Object.keys(placeholders[lang]).forEach(key => {
        const input = document.querySelector(`[name="${key}"]`);
        if (input) {
            input.placeholder = placeholders[lang][key];
        }
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // In a real application, you would send this to a server
            const currentLang = document.documentElement.lang;
            const messages = {
                zh: '询盘已发送！我们会尽快与您联系。',
                en: 'Inquiry sent successfully! We will contact you soon.',
                ru: 'Запрос успешно отправлен! Мы скоро свяжемся с вами.'
            };
            
            // Show success message
            showNotification(messages[currentLang], 'success');
            
            // Reset form
            this.reset();
        });
    }
    
    // Initialize language
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    switchLanguage(savedLang);
    
    // Add intersection observer for animations
    setupAnimations();
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        background: type === 'success' ? '#3AA655' : '#007bff',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Intersection Observer for animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.card, .feature-card, .timeline-item, .stat-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// WhatsApp and Email tracking
function trackContactClick(type) {
    // Track contact method clicks
    gtag('event', 'click', {
        event_category: 'Contact',
        event_label: type,
        value: 1
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize on load
window.addEventListener('load', () => {
    setupLazyLoading();
    
    // Add loading states
    document.body.classList.add('loaded');
    
    // Smooth reveal animations
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => {
        el.classList.add('revealed');
    });
});

// Export for global access
window.LanguageManager = {
    switchLanguage,
    getCurrentLanguage: () => document.documentElement.lang
};