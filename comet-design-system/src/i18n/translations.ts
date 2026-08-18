/**
 * translations.ts — Internationalization (i18n) translations
 * 
 * Supports English (en) and Arabic (ar) languages
 * Used by the Settings screen and throughout the app
 */

export type Language = 'en' | 'ar'

export interface Translations {
  sidebar: {
    home: string
    explore: string
    messages: string
    friendRequests: string
    notifications: string
    settings: string
    logo: string
    create: string
    createPost: string
  }
  header: {
    searchPlaceholder: string
    notifications: string
  }
  settings: {
    title: string
    subtitle: string
    categories: {
      appearance: string
      account: string
    }
    appearance: {
      title: string
      subtitle: string
      theme: {
        label: string
        light: string
        dark: string
        system: string
      }
      language: {
        label: string
        english: string
        arabic: string
      }
    }
    account: {
      title: string
      changePassword: {
        title: string
        sub: string
      }
    }
    footer: {
      version: string
      terms: string
      privacy: string
      cookies: string
    }
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    sidebar: {
      home: 'Home',
      explore: 'Explore',
      messages: 'Messages',
      friendRequests: 'Friend Requests',
      notifications: 'Notifications',
      settings: 'Settings',
      logo: 'Comet',
      create: 'Create',
      createPost: 'Create Post',
    },
    header: {
      searchPlaceholder: 'Search Comet...',
      notifications: 'Notifications',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your celestial presence and customize your experience.',
      categories: {
        appearance: 'Appearance',
        account: 'Account Center',
      },
      appearance: {
        title: 'Appearance & Language',
        subtitle: 'Customize your visual experience and language preferences',
        theme: {
          label: 'Theme',
          light: 'Light Mode',
          dark: 'Dark Mode',
          system: 'System Default',
        },
        language: {
          label: 'Language',
          english: 'English',
          arabic: 'العربية',
        },
      },
      account: {
        title: 'Account Center',
        changePassword: {
          title: 'Change Password',
          sub: 'Last updated 3 months ago',
        },
      },
      footer: {
        version: 'Version 4.2.0-Alpha • Made with stardust in the Digital Ether',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        cookies: 'Cookie Policy',
      },
    },
  },
  ar: {
    sidebar: {
      home: 'الرئيسية',
      explore: 'استكشف',
      messages: 'الرسائل',
      friendRequests: 'طلبات الصداقة',
      notifications: 'الإشعارات',
      settings: 'الإعدادات',
      logo: 'كوميت',
      create: 'إنشاء',
      createPost: 'إنشاء منشور',
    },
    header: {
      searchPlaceholder: 'البحث في كوميت...',
      notifications: 'الإشعارات',
    },
    settings: {
      title: 'الإعدادات',
      subtitle: 'إدارة وجودك الرقمي وتخصيص تجربتك.',
      categories: {
        appearance: 'المظهر',
        account: 'مركز الحساب',
      },
      appearance: {
        title: 'المظهر واللغة',
        subtitle: 'تخصيص تجربتك البصرية وتفضيلات اللغة',
        theme: {
          label: 'المظهر',
          light: 'الوضع الفاتح',
          dark: 'الوضع الداكن',
          system: 'افتراضي النظام',
        },
        language: {
          label: 'اللغة',
          english: 'English',
          arabic: 'العربية',
        },
      },
      account: {
        title: 'مركز الحساب',
        changePassword: {
          title: 'تغيير كلمة المرور',
          sub: 'آخر تحديث قبل 3 أشهر',
        },
      },
      footer: {
        version: 'الإصدار 4.2.0-ألفا • صُنع بغبار النجوم في الأثير الرقمي',
        terms: 'شروط الخدمة',
        privacy: 'سياسة الخصوصية',
        cookies: 'سياسة ملفات تعريف الارتباط',
      },
    },
  },
}

/**
 * Get translations for a specific language
 */
export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en
}
