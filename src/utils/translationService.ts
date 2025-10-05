export type LanguageCode = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ar';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

export const LANGUAGES: Record<LanguageCode, Language> = {
  en: { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr' },
  zh: { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
};

// Common translations for UI elements
export const UI_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  'Add to Cart': {
    en: 'Add to Cart',
    hi: 'कार्ट में जोड़ें',
    es: 'Añadir al carrito',
    fr: 'Ajouter au panier',
    de: 'In den Warenkorb',
    ja: 'カートに追加',
    zh: '加入购物车',
    ar: 'أضف إلى السلة',
  },
  'Buy Now': {
    en: 'Buy Now',
    hi: 'अभी खरीदें',
    es: 'Comprar ahora',
    fr: 'Acheter maintenant',
    de: 'Jetzt kaufen',
    ja: '今すぐ購入',
    zh: '立即购买',
    ar: 'اشتري الآن',
  },
  'Handcrafted': {
    en: 'Handcrafted',
    hi: 'हस्तनिर्मित',
    es: 'Hecho a mano',
    fr: 'Fait main',
    de: 'Handgefertigt',
    ja: '手作り',
    zh: '手工制作',
    ar: 'صنع يدوي',
  },
  'Quality Verified': {
    en: 'Quality Verified',
    hi: 'गुणवत्ता सत्यापित',
    es: 'Calidad verificada',
    fr: 'Qualité vérifiée',
    de: 'Qualität geprüft',
    ja: '品質確認済み',
    zh: '质量认证',
    ar: 'الجودة المعتمدة',
  },
  'From India': {
    en: 'From India',
    hi: 'भारत से',
    es: 'Desde India',
    fr: 'De l\'Inde',
    de: 'Aus Indien',
    ja: 'インドから',
    zh: '来自印度',
    ar: 'من الهند',
  },
};

export class TranslationService {
  private cache: Map<string, Map<LanguageCode, string>> = new Map();

  async translateText(text: string, targetLang: LanguageCode): Promise<string> {
    // Check cache first
    if (this.cache.has(text)) {
      const cached = this.cache.get(text)?.get(targetLang);
      if (cached) return cached;
    }

    // For English, return as-is
    if (targetLang === 'en') {
      return text;
    }

    // Check UI translations
    const uiTranslation = UI_TRANSLATIONS[text]?.[targetLang];
    if (uiTranslation) {
      return uiTranslation;
    }

    // Simulate API call
    // In production, this would call Google Translate API or similar
    await new Promise(resolve => setTimeout(resolve, 300));

    // For demo, return with language indicator
    const translated = `[${LANGUAGES[targetLang].name}] ${text}`;
    
    // Cache the result
    if (!this.cache.has(text)) {
      this.cache.set(text, new Map());
    }
    this.cache.get(text)!.set(targetLang, translated);

    return translated;
  }

  async translateProductStory(story: string, targetLang: LanguageCode): Promise<string> {
    if (targetLang === 'en') {
      return story;
    }

    // Mock translation with cultural context
    // In production, use proper translation API with context preservation
    const translations: Record<LanguageCode, string> = {
      en: story,
      hi: story, // Already support Hindi
      es: `[Traducción automática] ${story}`,
      fr: `[Traduction automatique] ${story}`,
      de: `[Automatische Übersetzung] ${story}`,
      ja: `[自動翻訳] ${story}`,
      zh: `[自动翻译] ${story}`,
      ar: `[ترجمة تلقائية] ${story}`,
    };

    return translations[targetLang] || story;
  }

  getUITranslation(key: string, lang: LanguageCode): string {
    return UI_TRANSLATIONS[key]?.[lang] || key;
  }

  detectUserLanguage(): LanguageCode {
    // Try to detect from browser
    const browserLang = navigator.language.split('-')[0];
    
    if (Object.keys(LANGUAGES).includes(browserLang)) {
      return browserLang as LanguageCode;
    }

    // Default to English
    return 'en';
  }

  getSupportedLanguages(): Language[] {
    return Object.values(LANGUAGES);
  }
}

export const translationService = new TranslationService();
