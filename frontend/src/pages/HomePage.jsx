import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LanguageSelector from '../components/LanguageSelector';
import UILanguageSwitcher from '../components/UILanguageSwitcher';
import { useUILanguage } from '../contexts/UILanguageContext';
import { FileText, Zap, Globe, Shield, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { t } = useUILanguage();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (file) {
      navigate('/analyze', { 
        state: { file, language: selectedLanguage } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white border-opacity-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white rounded">
              <FileText className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">{t('appName')}</h1>
          </div>
          
          {/* UI Language Switcher */}
          <UILanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h2 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight leading-tight whitespace-pre-line">
            {t('heroTitle')}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 border border-white border-opacity-10 rounded-lg hover:border-opacity-30 hover:bg-white hover:bg-opacity-5 transition-all">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide">{t('feature1Title')}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('feature1Desc')}
            </p>
          </div>

          <div className="p-6 border border-white border-opacity-10 rounded-lg hover:border-opacity-30 hover:bg-white hover:bg-opacity-5 transition-all">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center mb-4">
              <Globe className="w-5 h-5 text-black" />
            </div>
            <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide">{t('feature2Title')}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('feature2Desc')}
            </p>
          </div>

          <div className="p-6 border border-white border-opacity-10 rounded-lg hover:border-opacity-30 hover:bg-white hover:bg-opacity-5 transition-all">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide">{t('feature3Title')}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('feature3Desc')}
            </p>
          </div>
        </div>

        {/* Upload Form */}
        <div className="max-w-2xl mx-auto">
          <div className="border border-white border-opacity-20 rounded-xl p-8 bg-white bg-opacity-5 backdrop-blur-sm">
            <div className="space-y-6">
              {/* Language Selector */}
              <LanguageSelector
                selected={selectedLanguage}
                onChange={setSelectedLanguage}
              />

              {/* File Upload */}
              <FileUpload
                onFileSelect={setFile}
                selectedFile={file}
              />

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!file}
                className="w-full bg-white text-black py-4 px-6 rounded-lg font-medium text-base hover:bg-gray-800 disabled:cursor-not-allowed transition-all group flex items-center justify-center gap-2"
              >
                {file ? (
                  <>
                    {t('analyzeButton')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  t('selectFileButton')
                )}
              </button>

              {/* Privacy Notice */}
              <div className="text-center pt-4 border-t border-white border-opacity-10">
                <p className="text-xs text-gray-400">
                  {t('privacyNotice')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats/Trust Bar */}
        <div className="mt-20 pt-12 border-t border-white border-opacity-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-1">{t('stat1')}</div>
              <div className="text-sm text-gray-400">{t('stat1Label')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">{t('stat2')}</div>
              <div className="text-sm text-gray-400">{t('stat2Label')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">{t('stat3')}</div>
              <div className="text-sm text-gray-400">{t('stat3Label')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">{t('stat4')}</div>
              <div className="text-sm text-gray-400">{t('stat4Label')}</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white border-opacity-10 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              {t('footerBuilt')}
            </p>
            <p className="text-xs text-gray-500">
              {t('footerDisclaimer')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}