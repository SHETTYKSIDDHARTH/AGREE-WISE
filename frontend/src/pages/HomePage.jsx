import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MultiFileUpload from '../components/MultiFileUpload';
import LanguageSelector from '../components/LanguageSelector';
import UILanguageSwitcher from '../components/UILanguageSwitcher';
import { useUILanguage } from '../contexts/UILanguageContext';
import { FileText, Zap, Globe, Shield, ArrowRight, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const { t } = useUILanguage();
  const [documentLanguage, setDocumentLanguage] = useState('en'); // Language of the contract
  const [files, setFiles] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0); // 0: idle, 1: extracting, 2: analyzing
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  const handleAnalyze = async () => {
    if (!files || files.length === 0) return;

    setAnalyzing(true);
    setAnalysisStep(1); // Start with step 1
    setError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add all files
      files.forEach(file => {
        formData.append('files[]', file);
      });

      formData.append('document_language', documentLanguage);
      formData.append('explanation_language', 'en'); // Always start with English
      formData.append('extract_only', 'false'); // Enable AI analysis

      console.log(`📤 Uploading ${files.length} file(s) for analysis...`);

      // Show progress through backend processing
      // Note: We can't track exact backend progress, so we show estimated steps
      const progressTimer1 = setTimeout(() => setAnalysisStep(2), 3000);  // AI Analysis after ~3s

      // Send to backend - this will wait for EVERYTHING to complete
      const response = await fetch(`${BACKEND_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      // Clear timer once we get response
      clearTimeout(progressTimer1);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      console.log('✓ Analysis complete:', result);

      // Mark all steps as complete before navigating
      setAnalysisStep(3); // All done!

      // Small delay to show completion state
      await new Promise(resolve => setTimeout(resolve, 500));

      // Now navigate to results page with ALL the data
      navigate('/analyze', {
        state: {
          files: files.map(f => f.name),
          totalPages: result.total_pages,
          documentLanguage: documentLanguage,
          extractedText: result.extracted_text,
          pages: result.pages,
          metadata: result.metadata,
          analysis: result.analysis // AI analysis results
        }
      });

    } catch (err) {
      console.error('❌ Analysis error:', err);
      setError(err.message);
    } finally {
      setAnalyzing(false);
      setAnalysisStep(0);
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
              {/* Document Language Selector */}
              <LanguageSelector
                selected={documentLanguage}
                onChange={setDocumentLanguage}
                label={t('documentLanguageLabel')}
                hint={t('documentLanguageHint')}
              />

              {/* Multi-File Upload */}
              <MultiFileUpload
                onFilesSelect={setFiles}
                selectedFiles={files}
              />

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!files || files.length === 0 || analyzing}
                className="w-full bg-white text-black py-4 px-6 rounded-lg font-medium text-base hover:bg-gray-800 disabled:cursor-not-allowed transition-all group flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    {files && files.length > 1 ? `Processing ${files.length} pages...` : 'Processing...'}
                  </>
                ) : files && files.length > 0 ? (
                  <>
                    {files.length === 1 ? t('analyzeButton') : `Analyze ${files.length} Pages`}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  t('selectFileButton')
                )}
              </button>

              {/* Progress Steps */}
              {analyzing && (
                <div className="space-y-3 p-5 border border-white border-opacity-20 rounded-lg bg-white bg-opacity-5">
                  <p className="text-xs text-gray-400 mb-2">Processing your document, please wait...</p>

                  {/* Step 1: Extracting */}
                  <div className="flex items-center gap-3">
                    {analysisStep > 1 ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${analysisStep >= 1 ? 'text-white' : 'text-gray-400'}`}>
                        {analysisStep > 1 ? 'Text extracted successfully ✓' : `Extracting text from document${files && files.length > 1 ? 's' : ''}...`}
                      </p>
                      {analysisStep === 1 && (
                        <div className="mt-1.5 h-1 bg-white bg-opacity-10 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full animate-pulse" style={{ width: '60%' }} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 2: AI Analysis */}
                  <div className="flex items-center gap-3">
                    {analysisStep > 2 ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : analysisStep >= 2 ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-600 rounded-full flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${analysisStep >= 2 ? 'text-white' : 'text-gray-400'}`}>
                        {analysisStep > 2 ? 'AI analysis complete ✓' : analysisStep === 2 ? 'Analyzing contract with AI...' : 'Waiting for AI analysis...'}
                      </p>
                      {analysisStep === 2 && (
                        <div className="mt-1.5 h-1 bg-white bg-opacity-10 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full animate-pulse" style={{ width: '70%' }} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Completion message */}
                  {analysisStep === 3 && (
                    <div className="mt-3 pt-3 border-t border-white border-opacity-10">
                      <p className="text-sm text-green-400 text-center">
                        ✓ All processing complete! Redirecting to results...
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
                  <p className="text-sm text-red-400">
                    <span className="font-semibold">Error: </span>
                    {error}
                  </p>
                </div>
              )}

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