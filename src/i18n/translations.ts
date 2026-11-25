import type { Language } from '../types';

export interface TranslationDictionary {
  nav: {
    home: string;
    menu: string;
    contact: string;
    languageLabel: string;
    openMenu: string;
    closeMenu: string;
    skipToContent: string;
    primaryAriaLabel: string;
    mobileAriaLabel: string;
  };
  hero: {
    kicker: string;
    menuDisplayTitle: string;
    ctaMenu: string;
    ctaCall: string;
  };
  about: {
    kicker: string;
    hoursLabel: string;
    addressLabel: string;
    phoneLabel: string;
    emailLabel: string;
    tiktokLabel: string;
    snapchatLabel: string;
    figureCaption: string;
  };
  panels: {
    kicker: string;
    title: string;
    viewFullMenu: string;
  };
  menu: {
    kicker: string;
    title: string;
    subtitle: string;
    overviewTitle: string;
    searchLabel: string;
    searchPlaceholder: string;
    clearSearch: string;
    clearFilters: string;
    searchResultsSingle: string;
    searchResultsPlural: string;
    backToTop: string;
    emptyTitle: string;
    emptyDesc: string;
    qrBadge: string;
    itemsCount: string;
    availableBadge: string;
    unavailableBadge: string;
    detailPrice: string;
    detailStatus: string;
    detailClose: string;
    dataErrorNotice: string;
  };
  footer: {
    navigationTitle: string;
    contactTitle: string;
    tagline: string;
    copyright: string;
  };
  notFound: {
    kicker: string;
    title: string;
    description: string;
    backHome: string;
    goToMenu: string;
  };
  common: {
    loading: string;
    close: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  fr: {
    nav: {
      home: 'Accueil',
      menu: 'Menu',
      contact: 'Contact',
      languageLabel: 'Langue',
      openMenu: 'Ouvrir la navigation',
      closeMenu: 'Fermer la navigation',
      skipToContent: 'Aller au contenu principal',
      primaryAriaLabel: 'Navigation principale',
      mobileAriaLabel: 'Navigation mobile',
    },
    hero: {
      kicker: 'Maraval · Oran',
      menuDisplayTitle: 'MENU',
      ctaMenu: 'Voir le menu',
      ctaCall: 'Appeler',
    },
    about: {
      kicker: 'Informations & Coordonnées',
      hoursLabel: 'Horaires',
      addressLabel: 'Adresse',
      phoneLabel: 'Téléphone',
      emailLabel: 'E-mail',
      tiktokLabel: 'TikTok',
      snapchatLabel: 'Snapchat',
      figureCaption: 'Emblème Le R · Maraval - Oran',
    },
    panels: {
      kicker: 'Tables & Spécialités',
      title: 'Les Formats Signatures',
      viewFullMenu: 'Voir le menu complet',
    },
    menu: {
      kicker: 'La Carte Le R',
      title: 'Menu Le R',
      subtitle:
        'Parcourez les rubriques de la carte officielle et touchez un plat pour ouvrir sa fiche.',
      overviewTitle: 'Sommaire de la Carte',
      searchLabel: 'Rechercher un plat',
      searchPlaceholder: 'Rechercher un plat…',
      clearSearch: 'Effacer la recherche',
      clearFilters: 'Réinitialiser',
      searchResultsSingle: 'plat trouvé',
      searchResultsPlural: 'plats trouvés',
      backToTop: 'Haut de page',
      emptyTitle: 'Aucun plat ne correspond à votre recherche',
      emptyDesc:
        'Essayez un autre nom de plat ou réinitialisez les filtres pour afficher toute la carte.',
      qrBadge: 'Carte digitale',
      itemsCount: 'plats',
      availableBadge: 'Disponible',
      unavailableBadge: 'Indisponible',
      detailPrice: 'Prix',
      detailStatus: 'Disponibilité',
      detailClose: 'Fermer',
      dataErrorNotice:
        'Certaines données du menu sont incomplètes ou invalides. Vérifiez src/data/menu.json.',
    },
    footer: {
      navigationTitle: 'Navigation',
      contactTitle: 'Contact & Réseaux',
      tagline:
        'Le R · Avenue Mekki Khlifa, Maraval - Oran · Carte digitale officielle.',
      copyright: '© 2026 Le R · Maraval - Oran',
    },
    notFound: {
      kicker: 'Page introuvable',
      title: 'Cette page n’existe pas',
      description:
        'Le lien suivi est invalide. Revenez à l’accueil ou ouvrez directement la carte Le R.',
      backHome: 'Retour à l’accueil',
      goToMenu: 'Voir le menu',
    },
    common: {
      loading: 'Chargement…',
      close: 'Fermer',
    },
  },

  en: {
    nav: {
      home: 'Home',
      menu: 'Menu',
      contact: 'Contact',
      languageLabel: 'Language',
      openMenu: 'Open navigation',
      closeMenu: 'Close navigation',
      skipToContent: 'Skip to main content',
      primaryAriaLabel: 'Primary navigation',
      mobileAriaLabel: 'Mobile navigation',
    },
    hero: {
      kicker: 'Maraval · Oran',
      menuDisplayTitle: 'MENU',
      ctaMenu: 'View the Menu',
      ctaCall: 'Call',
    },
    about: {
      kicker: 'Contact & Location',
      hoursLabel: 'Hours',
      addressLabel: 'Address',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      tiktokLabel: 'TikTok',
      snapchatLabel: 'Snapchat',
      figureCaption: 'Le R Emblem · Maraval - Oran',
    },
    panels: {
      kicker: 'Signature Formats',
      title: 'Featured House Panels',
      viewFullMenu: 'View full menu',
    },
    menu: {
      kicker: 'Le R Digital Menu',
      title: 'Menu Le R',
      subtitle:
        'Browse all official menu sections and tap any dish to inspect its details.',
      overviewTitle: 'Menu Index',
      searchLabel: 'Search a dish',
      searchPlaceholder: 'Search a dish…',
      clearSearch: 'Clear search',
      clearFilters: 'Reset filters',
      searchResultsSingle: 'dish found',
      searchResultsPlural: 'dishes found',
      backToTop: 'Back to top',
      emptyTitle: 'No dishes match your search',
      emptyDesc:
        'Try another dish name or reset your filters to view the full menu.',
      qrBadge: 'Digital Menu',
      itemsCount: 'items',
      availableBadge: 'Available',
      unavailableBadge: 'Unavailable',
      detailPrice: 'Price',
      detailStatus: 'Availability',
      detailClose: 'Close',
      dataErrorNotice:
        'Menu data could not be fully parsed. Please inspect src/data/menu.json.',
    },
    footer: {
      navigationTitle: 'Navigation',
      contactTitle: 'Contact & Social',
      tagline:
        'Le R · Avenue Mekki Khlifa, Maraval - Oran · Official Digital Menu.',
      copyright: '© 2026 Le R · Maraval - Oran',
    },
    notFound: {
      kicker: 'Page Not Found',
      title: 'This page could not be found',
      description:
        'The requested route does not exist. Return to the homepage or open the Le R menu.',
      backHome: 'Back to Home',
      goToMenu: 'View the Menu',
    },
    common: {
      loading: 'Loading…',
      close: 'Close',
    },
  },

  ar: {
    nav: {
      home: 'الرئيسية',
      menu: 'القائمة',
      contact: 'اتصل بنا',
      languageLabel: 'اللغة',
      openMenu: 'فتح القائمة',
      closeMenu: 'إغلاق القائمة',
      skipToContent: 'الانتقال إلى المحتوى الرئيسي',
      primaryAriaLabel: 'التنقل الرئيسي',
      mobileAriaLabel: 'تنقل الجوال',
    },
    hero: {
      kicker: 'مارافال · وهران',
      menuDisplayTitle: 'MENU',
      ctaMenu: 'تصفح القائمة',
      ctaCall: 'اتصل بنا',
    },
    about: {
      kicker: 'معلومات التواصل',
      hoursLabel: 'ساعات العمل',
      addressLabel: 'العنوان',
      phoneLabel: 'الهاتف',
      emailLabel: 'البريد الإلكتروني',
      tiktokLabel: 'تيك توك',
      snapchatLabel: 'سناب شات',
      figureCaption: 'شعار Le R · مارافال - وهران',
    },
    panels: {
      kicker: 'الأصناف الخاصة',
      title: 'اختيارات الدار المميزة',
      viewFullMenu: 'عرض القائمة الكاملة',
    },
    menu: {
      kicker: 'قائمة Le R',
      title: 'قائمة Le R',
      subtitle: 'تصفح أقسام القائمة الرسمية واضغط على أي طبق لعرض تفاصيله.',
      overviewTitle: 'فهرس القائمة',
      searchLabel: 'ابحث عن طبق',
      searchPlaceholder: 'ابحث عن طبق…',
      clearSearch: 'مسح البحث',
      clearFilters: 'إعادة الضبط',
      searchResultsSingle: 'صنف مطابق',
      searchResultsPlural: 'أصناف مطابقة',
      backToTop: 'العودة للأعلى',
      emptyTitle: 'لا توجد أطباق مطابقة لبحثك',
      emptyDesc: 'جرّب اسمًا آخر أو أعد ضبط الفلاتر لعرض القائمة الكاملة.',
      qrBadge: 'قائمة رقمية',
      itemsCount: 'أصناف',
      availableBadge: 'متوفر',
      unavailableBadge: 'غير متوفر',
      detailPrice: 'السعر',
      detailStatus: 'التوفر',
      detailClose: 'إغلاق',
      dataErrorNotice: 'تعذر قراءة ملف القائمة بالكامل. يرجى التحقق من src/data/menu.json.',
    },
    footer: {
      navigationTitle: 'التنقل',
      contactTitle: 'التواصل والحسابات',
      tagline:
        'Le R · شارع مكي خليفة، مارافال - وهران · القائمة الرقمية الرسمية.',
      copyright: '© 2026 Le R · مارافال - وهران',
    },
    notFound: {
      kicker: 'الصفحة غير موجودة',
      title: 'تعذر العثور على الصفحة',
      description:
        'الرابط المطلوب غير صالح. يمكنك العودة للرئيسية أو فتح قائمة Le R.',
      backHome: 'العودة للرئيسية',
      goToMenu: 'عرض القائمة',
    },
    common: {
      loading: 'جارٍ التحميل…',
      close: 'إغلاق',
    },
  },
};
