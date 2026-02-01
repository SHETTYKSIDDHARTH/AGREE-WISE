import { useState } from 'react';
import { Globe, Check, Loader2 } from 'lucide-react';
import { useUILanguage } from '../contexts/UILanguageContext';

export default function UILanguageSwitcher() {
  const { uiLanguage, setUILanguage, UI_LANGUAGES, t, loading, error } = useUILanguage();
  const [isOpen, setIsOpen] = useState(false);

  const selectedLang = UI_LANGUAGES.find(lang => lang.code === uiLanguage) || UI_LANGUAGES[0];

  const handleSelect = (code) => {
    setUILanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Error Display (for debugging) */}
      {error && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-red-500 bg-opacity-90 text-white text-xs p-2 rounded shadow-lg z-50">
          Translation Error: {error}
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-all text-sm font-medium border border-white border-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Globe className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">{selectedLang.flag} {selectedLang.name}</span>
        <span className="sm:hidden">{selectedLang.flag}</span>
      </button>

      {/* Dropdown */}
      {isOpen && !loading && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-black border border-white border-opacity-20 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-2 border-b border-white border-opacity-10">
              <p className="text-xs text-gray-400 px-2">{t('uiLanguage')}</p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {UI_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full px-3 py-2 text-left hover:bg-white hover:bg-opacity-10 transition-colors flex items-center justify-between ${
                    uiLanguage === lang.code ? 'bg-white bg-opacity-5' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </span>
                  {uiLanguage === lang.code && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-white border-opacity-10 bg-white bg-opacity-5">
              <p className="text-xs text-gray-400 text-center">
                Powered by Lingo.dev
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}