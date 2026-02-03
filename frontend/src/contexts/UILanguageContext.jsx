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
  howToUseButton: 'How to Use',
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

  // How to Use Page
  howToUseTitle: 'How to Use AgreeWise',
  howToUseSubtitle: 'A simple guide to analyze your contracts in minutes',
  step1Title: 'Step 1: Select Document Language',
  step1Desc: 'Choose the language your contract is written in. We support 15+ languages including English, Spanish, Hindi, Chinese, and more.',
  step2Title: 'Step 2: Upload Your Document',
  step2Desc: 'Upload your contract in PDF, DOCX, JPG, or PNG format. You can upload multiple pages if needed. Maximum file size is 10MB per file.',
  step3Title: 'Step 3: Analyze',
  step3Desc: 'Click the "Analyze Agreement" button. Our AI will extract text from your document and analyze it for risks, obligations, and key terms.',
  step4Title: 'Step 4: Review Results',
  step4Desc: 'Get a detailed summary with risk flags (red for serious, yellow for moderate, green for favorable), key terms, obligations, and an overall risk assessment.',
  step5Title: 'Step 5: Listen or Translate',
  step5Desc: 'Use the audio feature to hear the summary, or translate it to your preferred language for better understanding.',
  tipsTitle: 'Tips for Best Results',
  tip1: 'Ensure document text is clear and readable',
  tip2: 'For multi-page contracts, upload all pages in order',
  tip3: 'Review both red and yellow flags carefully',
  tip4: 'Use the translation feature if needed',
  tip5: 'Listen to the audio summary for better comprehension',
  backToHome: 'Back to Home',
  importantNote: 'Important Note',
  importantNoteText: 'AgreeWise provides informational analysis only and is not a substitute for professional legal advice. Always consult with a qualified attorney for legal matters.',

  // Analysis Page
  analysisComplete: 'Analysis Complete',
  successAnalyzed: 'Successfully analyzed your document',
  successAnalyzedPages: 'Successfully analyzed {pages} pages',
  translatingTo: 'Translating to {language}...',
  translationFailed: 'Translation failed',
  stopAudio: 'Stop Audio',
  listenToSummary: 'Listen to Summary',
  generating: 'Generating...',
  colorGuide: 'Color Guide',
  redSerious: 'Red = Serious Risk',
  yellowModerate: 'Yellow = Moderate Risk',
  greenFavorable: 'Green = Favorable',
  expandSections: 'Expand sections below for detailed information',
  summary: 'Summary',
  whatYouMustDo: 'What You Must Do',
  whatYouGet: 'What You Get',
  importantWarnings: 'Important Warnings',
  importantTerms: 'Important Terms',
  questionsToAsk: 'Questions to Ask Before Signing',
  copyMessage: 'Copy Message',
  copyMessageHint: 'Click "Copy Message" to generate a professional WhatsApp/Email ready message',
  showingTopQuestions: 'Showing top 3 of {count} questions',
  explainedIn: 'Explained in',
  translated: 'Translated',
  analyzeAnother: 'Analyze Another Document',
  lowRisk: 'LOW RISK',
  mediumRisk: 'MEDIUM RISK',
  highRisk: 'HIGH RISK',
  cautionMessage: 'CAUTION: Multiple serious concerns found. Review carefully before signing.',
  someConcerns: 'Some concerns found. Read the warnings below carefully.',
  fairBalance: 'This contract looks fair and balanced.',
  redFlags: 'Red Flag',
  redFlagsPlural: 'Red Flags',
  yellowFlags: 'Yellow Flag',
  yellowFlagsPlural: 'Yellow Flags',
  positiveTerms: 'Positive Term',
  positiveTermsPlural: 'Positive Terms',
};

export function UILanguageProvider({ children }) {
  const [uiLanguage, setUILanguage] = useState('en');
  const [translations, setTranslations] = useState(() => {
    // Load cached translations from localStorage
    const cached = localStorage.getItem('agreewise_translations');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Failed to parse cached translations:', e);
      }
    }
    return { en: baseTranslations };
  });
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
  }, [uiLanguage]); // Only depend on uiLanguage to avoid infinite loop

  const translateUI = async (targetLanguage) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`🔄 Translating UI to ${targetLanguage} via backend...`);
      console.log('📝 Base translations to translate:', Object.keys(baseTranslations).length, 'keys');

      // Call backend API to translate (SDK handles timeout internally)
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

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Use backend's error message if available
        throw new Error(data.error || `Backend API error: ${response.status} ${response.statusText}`);
      }

      // Extract the translated data from the response
      const translatedObject = data.translated.data;
      console.log(`✓ Translation complete for ${targetLanguage}`, translatedObject);

      // Cache the translations in state and localStorage
      setTranslations(prev => {
        const newTranslations = {
          ...prev,
          [targetLanguage]: translatedObject
        };
        console.log('Updated translations cache:', Object.keys(newTranslations));
        // Save to localStorage
        localStorage.setItem('agreewise_translations', JSON.stringify(newTranslations));
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