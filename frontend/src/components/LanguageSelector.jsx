import { useState } from 'react';
import { Globe, Search, Check } from 'lucide-react';
import { useUILanguage } from '../contexts/UILanguageContext';

// For now, we'll use a static list. We'll fetch from backend later.
const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
];

export default function LanguageSelector({ selected, onChange, label, hint }) {
  const { t } = useUILanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedLang = LANGUAGES.find(lang => lang.code === selected) || LANGUAGES[0];

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (code) => {
    onChange(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="w-full relative">
      <div className="mb-3">
        <label className="flex items-center gap-2 text-sm font-medium text-white">
          <Globe className="w-4 h-4" />
          {label}
        </label>
        {hint && (
          <p className="text-xs text-gray-400 mt-1 ml-6">{hint}</p>
        )}
      </div>

      {/* Selected Language Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-black border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all text-sm font-medium hover:border-gray-400 cursor-pointer flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">{selectedLang?.flag}</span>
          <span>{selectedLang?.native}</span>
          <span className="text-gray-400">({selectedLang?.name})</span>
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-gray-100 sticky top-0 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchLanguages')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Language List */}
            <div className="overflow-y-auto max-h-80">
              {filteredLanguages.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  {t('noLanguages')}
                </div>
              ) : (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                      selected === lang.code ? 'bg-gray-50' : ''
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{lang.flag}</span>
                      <div>
                        <div className="text-sm font-medium text-black">
                          {lang.native}
                        </div>
                        <div className="text-xs text-gray-500">
                          {lang.name}
                        </div>
                      </div>
                    </span>
                    {selected === lang.code && (
                      <Check className="w-4 h-4 text-black" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                {LANGUAGES.length} {t('languagesAvailable')}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}