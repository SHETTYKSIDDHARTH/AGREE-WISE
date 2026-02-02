import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import { useUILanguage } from '../contexts/UILanguageContext';
import LanguageSelector from '../components/LanguageSelector';

export default function AnalyzePage() {
  const { t } = useUILanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Get data passed from HomePage
  const { files, totalPages, documentLanguage, extractedText, analysis } = location.state || {};

  // State for language selection and translation
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translating, setTranslating] = useState(false);
  const [translatedAnalysis, setTranslatedAnalysis] = useState(null);
  const [translationError, setTranslationError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  // Redirect if no data
  if (!extractedText) {
    navigate('/');
    return null;
  }

  // Debug: Log analysis structure
  console.log('Analysis object:', analysis);

  // Handle language change
  const handleLanguageChange = async (newLanguage) => {
    setSelectedLanguage(newLanguage);
    setTranslationError(null);

    // If English is selected, use the original English analysis
    if (newLanguage === 'en') {
      setTranslatedAnalysis(null);
      return;
    }

    // Check if analysis data exists
    if (!analysis || !analysis.english) {
      setTranslationError('No analysis data available to translate');
      return;
    }

    // Translate to the new language
    setTranslating(true);
    try {
      console.log('Translation request:', {
        content: analysis.english,
        sourceLocale: 'en',
        targetLocale: newLanguage,
      });

      const response = await fetch(`${BACKEND_URL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: analysis.english,
          sourceLocale: 'en',
          targetLocale: newLanguage,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Translation failed');
      }

      setTranslatedAnalysis(result.translated);
    } catch (err) {
      console.error('Translation error:', err);
      setTranslationError(err.message);
    } finally {
      setTranslating(false);
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

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Success Header */}
        <div className="mb-8 flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-green-400" />
          <div>
            <h2 className="text-3xl font-bold mb-1">Analysis Complete</h2>
            <p className="text-gray-400">
              {totalPages > 1
                ? `Successfully analyzed ${totalPages} pages`
                : 'Successfully analyzed your document'
              }
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mb-8 max-w-md">
          <LanguageSelector
            selected={selectedLanguage}
            onChange={handleLanguageChange}
            label="Explanation Language"
            hint="Choose the language for the analysis summary"
          />
          {translating && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Translating to {selectedLanguage}...
            </div>
          )}
          {translationError && (
            <div className="mt-2 text-sm text-red-400">
              Translation failed: {translationError}
            </div>
          )}
        </div>

        {/* SUMMARY */}
        {analysis && analysis.english && (
          <div className="mt-8">
            {(() => {
              // Get the right analysis (use translatedAnalysis if available, otherwise English)
              const currentAnalysis = translatedAnalysis || analysis.english;
              const docSummary = currentAnalysis?.document_summary;
              const obligations = currentAnalysis?.your_obligations || [];
              const rights = currentAnalysis?.your_rights || [];
              const risks = currentAnalysis?.risk_analysis || {};
              const keyClauses = currentAnalysis?.key_clauses || [];

              if (!currentAnalysis) {
                return (
                  <div className="p-8 border border-white border-opacity-20 rounded-lg bg-white bg-opacity-5">
                    <p className="text-gray-400">Analysis not available</p>
                  </div>
                );
              }

              return (
                <div className="p-8 border border-blue-500 border-opacity-30 rounded-lg bg-blue-500 bg-opacity-5">
                  {/* Title */}
                  <h2 className="text-3xl font-bold mb-2 text-center">{docSummary?.document_type || 'Agreement'}</h2>

                  {/* Summary Heading */}
                  <h3 className="text-xl font-semibold mb-6 text-center text-gray-300">Summary</h3>

                  {/* All Information */}
                  <div className="space-y-6 text-base leading-relaxed">
                    {/* Overview */}
                    {docSummary && (
                      <p className="text-gray-100">{docSummary.purpose}</p>
                    )}

                    {/* Obligations */}
                    {obligations.length > 0 && (
                      <div>
                        <p className="font-semibold text-white mb-2">What You Must Do:</p>
                        <ul className="space-y-2 ml-4">
                          {obligations.map((obligation, index) => (
                            <li key={index} className="text-gray-200">
                              • {obligation.obligation}
                              {obligation.details && ` ${obligation.details}`}
                              {obligation.deadline_or_requirement && ` (${obligation.deadline_or_requirement})`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Rights */}
                    {rights.length > 0 && (
                      <div>
                        <p className="font-semibold text-white mb-2">What You Get:</p>
                        <ul className="space-y-2 ml-4">
                          {rights.map((right, index) => (
                            <li key={index} className="text-gray-200">
                              • {right.right}
                              {right.details && ` ${right.details}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Risks */}
                    {(risks.red_flags?.length > 0 || risks.yellow_flags?.length > 0) && (
                      <div>
                        <p className="font-semibold text-white mb-2">Important Warnings:</p>
                        <ul className="space-y-2 ml-4">
                          {risks.red_flags?.map((flag, index) => (
                            <li key={index} className="text-red-300">
                              🚩 {flag.issue} - {flag.why_it_matters} {flag.potential_consequence}
                            </li>
                          ))}
                          {risks.yellow_flags?.map((flag, index) => (
                            <li key={index} className="text-yellow-300">
                              ⚠️ {flag.issue} - {flag.why_it_matters} {flag.what_to_review}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Key Terms */}
                    {keyClauses.length > 0 && (
                      <div>
                        <p className="font-semibold text-white mb-2">Important Terms:</p>
                        <ul className="space-y-2 ml-4">
                          {keyClauses.map((clause, index) => (
                            <li key={index} className="text-gray-200">
                              • <span className="font-medium">{clause.title}:</span> {clause.explanation} {clause.impact}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Language Indicator */}
                  <div className="text-center pt-6 mt-6 border-t border-white border-opacity-10">
                    <p className="text-xs text-gray-400">
                      Explained in: <span className="text-white font-medium uppercase">{selectedLanguage}</span>
                      {translatedAnalysis && ' (Translated)'}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Analyze Another Document
          </button>
        </div>
      </main>
    </div>
  );
}
