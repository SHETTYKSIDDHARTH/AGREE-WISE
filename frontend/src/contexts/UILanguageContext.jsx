import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UILanguageContext = createContext();

// Backend API URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

// UI languages (for interface translation)
const UI_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

// Base English translations (source)
const baseTranslations = {
  // Header
  appName: 'AgreeWise',
  uiLanguage: 'Language',
  
  // Hero
  heroTitle: 'Understand before\nyou agree',
  heroSubtitle: 'AI-powered contract analysis in plain language. Upload any agreement and get instant clarity in your language.',
  
  // Features
  feature1Title: 'INSTANT ANALYSIS',
  feature1Desc: 'Advanced OCR and AI extract and explain every clause in seconds',
  feature2Title: 'YOUR LANGUAGE',
  feature2Desc: 'Understand in 15+ languages with voice support',
  feature3Title: 'RISK DETECTION',
  feature3Desc: 'Automatically flag concerning clauses and understand consequences',
  
  // Form
  documentLanguageLabel: 'Document Language',
  documentLanguageHint: 'Language of your contract text',
  explanationLanguageLabel: 'Explanation Language',
  explanationLanguageHint: 'Language you want the analysis in',
  uploadPrompt: 'Drop file or click to upload',
  uploadHint: 'PDF, DOCX, JPG, PNG up to 10MB',
  dragActive: 'Drop your file here',
  analyzeButton: 'Analyze Agreement',
  selectFileButton: 'Select a file to continue',
  privacyNotice: '🔒 Secure processing • No permanent storage • 100% private',
  fileSelected: 'File selected',
  removeFile: 'Remove file',
  
  // Stats
  stat1: '< 3s',
  stat1Label: 'Average analysis time',
  stat2: '15',
  stat2Label: 'Languages supported',
  stat3: '100%',
  stat3Label: 'Free to use',
  stat4: '0',
  stat4Label: 'Data stored',
  
  // Footer
  footerBuilt: 'Built with Groq, EasyOCR, and Lingo.dev',
  footerDisclaimer: 'Not legal advice • For informational purposes only',
  
  // Language Selector
  languagesAvailable: 'languages available',
  searchLanguages: 'Search languages...',
  noLanguages: 'No languages found',
};

export function UILanguageProvider({ children }) {
  const [uiLanguage, setUILanguage] = useState('en');
  const [translations, setTranslations] = useState({ en: baseTranslations });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug: Log when language changes
  useEffect(() => {
    console.log('🌐 UI Language changed to:', uiLanguage);
    console.log('📚 Available translations:', Object.keys(translations));
  }, [uiLanguage, translations]);

  // Translate all UI strings when language changes
  useEffect(() => {
    if (uiLanguage === 'en') {
      // No translation needed for English
      return;
    }

    // Check if we already have cached translations
    if (translations[uiLanguage]) {
      return;
    }

    translateUI(uiLanguage);
  }, [uiLanguage, translations]);

  const translateUI = async (targetLanguage) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`🔄 Translating UI to ${targetLanguage} via backend...`);
      console.log('📝 Base translations to translate:', Object.keys(baseTranslations).length, 'keys');

      // Call backend API to translate
      const response = await fetch(`${BACKEND_URL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: baseTranslations,
          sourceLocale: 'en',
          targetLocale: targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Translation failed');
      }

      // Extract the translated data from the response
      const translatedObject = data.translated.data;
      console.log(`✓ Translation complete for ${targetLanguage}`, translatedObject);

      // Cache the translations
      setTranslations(prev => {
        const newTranslations = {
          ...prev,
          [targetLanguage]: translatedObject
        };
        console.log('Updated translations cache:', Object.keys(newTranslations));
        return newTranslations;
      });

    } catch (err) {
      console.error('Lingo.dev translation error:', err);
      setError(err.message);
      
      // Fallback to English on error
      setTranslations(prev => ({
        ...prev,
        [targetLanguage]: baseTranslations
      }));
    } finally {
      setLoading(false);
    }
  };

  // Translation function - memoized to trigger re-renders when translations change
  const t = useCallback((key) => {
    return translations[uiLanguage]?.[key] || baseTranslations[key] || key;
  }, [translations, uiLanguage]);

  return (
    <UILanguageContext.Provider value={{ 
      uiLanguage, 
      setUILanguage, 
      t, 
      UI_LANGUAGES,
      loading,
      error 
    }}>
      {children}
    </UILanguageContext.Provider>
  );
}

export function useUILanguage() {
  const context = useContext(UILanguageContext);
  if (!context) {
    throw new Error('useUILanguage must be used within UILanguageProvider');
  }
  return context;
}