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
    groups: string
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
      privacy: string
      account: string
      login: string
      notifs: string
      subs: string
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
    privacy: {
      title: string
      tag: string
      whoCanMessage: {
        title: string
        desc: string
      }
      whoCanSeePosts: {
        title: string
        desc: string
      }
      mentionTagging: {
        title: string
        desc: string
      }
      dataSharing: {
        title: string
        desc: string
      }
    }
    security: {
      title: string
      viewLog: string
      changePassword: {
        title: string
        sub: string
      }
      twoFactor: {
        title: string
        sub: string
      }
      devices: {
        title: string
        sub: string
      }
    }
    upgrade: {
      title: string
      desc: string
      button: string
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
      groups: 'Groups',
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
      title: 'Settings & Privacy',
      subtitle: 'Manage your celestial presence, secure your orbit, and curate who witnesses your journey.',
      categories: {
        appearance: 'Appearance',
        privacy: 'Privacy & Safety',
        account: 'Account Center',
        login: 'Login & Security',
        notifs: 'Notifications',
        subs: 'Subscriptions',
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
      privacy: {
        title: 'Privacy Controls',
        tag: 'Primary Settings',
        whoCanMessage: {
          title: 'Who can message me',
          desc: 'Limit direct message requests to only people you follow or verified accounts.',
        },
        whoCanSeePosts: {
          title: 'Who can see my posts',
          desc: 'Make your profile private. Only approved followers will see your celestial updates.',
        },
        mentionTagging: {
          title: 'Mention tagging',
          desc: 'Allow everyone to tag you in posts or restrict it to people you follow.',
        },
        dataSharing: {
          title: 'Data Sharing',
          desc: 'Control how Comet shares your anonymous usage data with editorial partners.',
        },
      },
      security: {
        title: 'Account & Security',
        viewLog: 'View Security Log',
        changePassword: {
          title: 'Change Password',
          sub: 'Last updated 3 months ago',
        },
        twoFactor: {
          title: 'Two-Factor Authentication',
          sub: 'Currently Enabled',
        },
        devices: {
          title: 'Recognized Devices',
          sub: '2 active sessions detected',
        },
      },
      upgrade: {
        title: 'Comet Pro',
        desc: 'Unlock advanced privacy shielding and unique profile signatures.',
        button: 'Upgrade Now',
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
      groups: 'المجموعات',
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
      title: 'الإعدادات والخصوصية',
      subtitle: 'إدارة وجودك الرقمي، تأمين مدارك، وتحديد من يشاهد رحلتك.',
      categories: {
        appearance: 'المظهر',
        privacy: 'الخصوصية والأمان',
        account: 'مركز الحساب',
        login: 'تسجيل الدخول والأمان',
        notifs: 'الإشعارات',
        subs: 'الاشتراكات',
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
      privacy: {
        title: 'ضوابط الخصوصية',
        tag: 'الإعدادات الأساسية',
        whoCanMessage: {
          title: 'من يمكنه مراسلتي',
          desc: 'قصر طلبات الرسائل المباشرة على الأشخاص الذين تتابعهم أو الحسابات الموثقة فقط.',
        },
        whoCanSeePosts: {
          title: 'من يمكنه رؤية منشوراتي',
          desc: 'اجعل ملفك الشخصي خاصًا. سيرى المتابعون المعتمدون فقط تحديثاتك الرقمية.',
        },
        mentionTagging: {
          title: 'وسم الإشارة',
          desc: 'السماح للجميع بوسمك في المنشورات أو تقييد ذلك على الأشخاص الذين تتابعهم.',
        },
        dataSharing: {
          title: 'مشاركة البيانات',
          desc: 'التحكم في كيفية مشاركة Comet لبيانات الاستخدام المجهولة مع الشركاء التحريريين.',
        },
      },
      security: {
        title: 'الحساب والأمان',
        viewLog: 'عرض سجل الأمان',
        changePassword: {
          title: 'تغيير كلمة المرور',
          sub: 'آخر تحديث قبل 3 أشهر',
        },
        twoFactor: {
          title: 'المصادقة الثنائية',
          sub: 'مفعّل حاليًا',
        },
        devices: {
          title: 'الأجهزة المعروفة',
          sub: 'تم اكتشاف جلستين نشطتين',
        },
      },
      upgrade: {
        title: 'Comet Pro',
        desc: 'فتح درع الخصوصية المتقدم والتوقيعات الفريدة للملف الشخصي.',
        button: 'الترقية الآن',
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
