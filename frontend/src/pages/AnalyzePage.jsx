import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
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

  // State for audio playback
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const audioRef = useRef(null);

  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    obligations: false,
    rights: false,
    risks: true, // Expanded by default - most important
    clauses: false,
    questions: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Section heading translations
  const sectionHeadings = {
    obligations: {
      en: 'What You Must Do',
      hi: 'आपको क्या करना होगा',
      es: 'Lo que debes hacer',
      fr: 'Ce que vous devez faire',
      de: 'Was Sie tun müssen',
      pt: 'O que você deve fazer',
      zh: '您必须做什么',
      ja: 'あなたがしなければならないこと',
      ar: 'ما يجب عليك فعله',
      ru: 'Что вы должны сделать',
    },
    rights: {
      en: 'What You Get',
      hi: 'आपको क्या मिलता है',
      es: 'Lo que obtienes',
      fr: 'Ce que vous obtenez',
      de: 'Was Sie bekommen',
      pt: 'O que você recebe',
      zh: '您将获得什么',
      ja: 'あなたが得るもの',
      ar: 'ما تحصل عليه',
      ru: 'Что вы получаете',
    },
    risks: {
      en: 'Important Warnings',
      hi: 'महत्वपूर्ण चेतावनियाँ',
      es: 'Advertencias importantes',
      fr: 'Avertissements importants',
      de: 'Wichtige Warnungen',
      pt: 'Avisos importantes',
      zh: '重要警告',
      ja: '重要な警告',
      ar: 'تحذيرات هامة',
      ru: 'Важные предупреждения',
    },
    clauses: {
      en: 'Important Terms',
      hi: 'महत्वपूर्ण शर्तें',
      es: 'Términos importantes',
      fr: 'Termes importants',
      de: 'Wichtige Bedingungen',
      pt: 'Termos importantes',
      zh: '重要条款',
      ja: '重要な用語',
      ar: 'شروط مهمة',
      ru: 'Важные условия',
    },
    questions: {
      en: 'Questions to Ask Before Signing',
      hi: 'हस्ताक्षर करने से पहले पूछने के सवाल',
      es: 'Preguntas para hacer antes de firmar',
      fr: 'Questions à poser avant de signer',
      de: 'Fragen vor der Unterzeichnung',
      pt: 'Perguntas a fazer antes de assinar',
      zh: '签署前要问的问题',
      ja: '署名前に尋ねる質問',
      ar: 'أسئلة يجب طرحها قبل التوقيع',
      ru: 'Вопросы перед подписанием',
    }
  };

  const getHeading = (section) => {
    return sectionHeadings[section]?.[selectedLanguage] || sectionHeadings[section]?.en || '';
  };

  // State for copying individual questions
  const [copyingQuestion, setCopyingQuestion] = useState(null);

  // Generate and copy formal message for a single question
  const copyQuestionMessage = async (question, index) => {
    setCopyingQuestion(index);

    try {
      const currentAnalysis = translatedAnalysis || analysis.english;
      const docType = currentAnalysis?.document_summary?.document_type || 'Agreement';

      console.log('Generating formal message for question:', question);

      const response = await fetch(`${BACKEND_URL}/api/generate-question-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          document_type: docType,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate message');
      }

      const result = await response.json();

      if (!result.success || !result.message) {
        throw new Error('Invalid response from server');
      }

      // Copy to clipboard
      await navigator.clipboard.writeText(result.message);
      alert('Message copied successfully. Ready to paste in WhatsApp or Email.');
    } catch (err) {
      console.error('Error generating message:', err);
      alert('Failed to generate message. Please try again.');
    } finally {
      setCopyingQuestion(null);
    }
  };

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  // Redirect if no data
  if (!extractedText) {
    navigate('/');
    return null;
  }

  // Debug: Log analysis structure
  console.log('Analysis object:', analysis);

  // Generate simplified text for audio
  const generateAudioText = (analysisData) => {
    if (!analysisData) return '';

    const summary = analysisData.document_summary;
    const risks = analysisData.risk_analysis || {};
    const obligations = analysisData.your_obligations || [];

    let text = '';

    // Start with document type and purpose
    if (summary) {
      text += `This is a ${summary.document_type}. ${summary.purpose}\n\n`;
    }

    // Risk summary
    const redFlags = risks.red_flags?.length || 0;
    const yellowFlags = risks.yellow_flags?.length || 0;

    if (redFlags >= 3) {
      text += `CAUTION: This contract has ${redFlags} serious concerns. `;
    } else if (redFlags >= 1) {
      text += `This contract has ${redFlags} red flag${redFlags !== 1 ? 's' : ''} to be aware of. `;
    }

    if (yellowFlags > 0) {
      text += `There are also ${yellowFlags} items to review carefully. `;
    }

    if (redFlags === 0 && yellowFlags === 0) {
      text += 'This contract looks fair and balanced. ';
    }

    text += '\n\n';

    // Top 3 obligations
    if (obligations.length > 0) {
      text += 'Your main obligations are: ';
      obligations.slice(0, 3).forEach((obligation, index) => {
        text += `${index + 1}. ${obligation.obligation}. `;
      });
    }

    return text;
  };

  // Handle audio playback
  const handlePlayAudio = async () => {
    if (isPlaying && audioRef.current) {
      // Stop playing
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    setGeneratingAudio(true);
    setAudioError(null);

    // Create audio element IMMEDIATELY on user click (before async operations)
    // This maintains the user gesture chain required by browsers
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
        setAudioError('Audio playback failed. Please try again.');
      };
    }

    try {
      const currentAnalysis = translatedAnalysis || analysis.english;
      const audioText = generateAudioText(currentAnalysis);

      if (!audioText) {
        throw new Error('No analysis data available for audio');
      }

      console.log('Generating audio for text:', audioText.substring(0, 100) + '...');

      const response = await fetch(`${BACKEND_URL}/api/generate-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: audioText,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate audio');
      }

      // Get audio blob and create object URL
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Set audio source
      audioRef.current.src = audioUrl;

      // Set up cleanup on end
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      // Play the audio - wrap in try-catch for better error handling
      try {
        await audioRef.current.play();
      } catch (playError) {
        console.error('Play error:', playError);
        throw new Error('Could not play audio. Please check your browser settings and try again.');
      }
    } catch (err) {
      console.error('Audio generation error:', err);
      setAudioError(err.message || 'Failed to generate audio');
      setGeneratingAudio(false);
    } finally {
      setGeneratingAudio(false);
    }
  };

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
        <div className="mb-6">
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

        {/* Audio Button - Full Width */}
        <div className="mb-8">
          <button
            onClick={handlePlayAudio}
            disabled={generatingAudio || !analysis?.english}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingAudio ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : isPlaying ? (
              <>
                <VolumeX className="w-5 h-5" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span>Listen to Summary</span>
              </>
            )}
          </button>
          {audioError && (
            <div className="mt-2 text-sm text-red-400 text-center">
              {audioError}
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

              // Calculate overall risk level
              const redFlags = risks.red_flags?.length || 0;
              const yellowFlags = risks.yellow_flags?.length || 0;
              const positiveTerms = risks.positive_terms?.length || 0;

              let riskLevel = 'LOW';
              let riskClasses = {
                title: 'text-green-300',
                message: 'text-green-200',
                bg: 'bg-green-500',
                border: 'border-green-400'
              };
              let riskMessage = 'This contract looks fair and balanced.';

              if (redFlags >= 3) {
                riskLevel = 'HIGH';
                riskClasses = {
                  title: 'text-red-300',
                  message: 'text-red-200',
                  bg: 'bg-red-500',
                  border: 'border-red-400'
                };
                riskMessage = 'CAUTION: Multiple serious concerns found. Review carefully before signing.';
              } else if (redFlags >= 1 || yellowFlags >= 3) {
                riskLevel = 'MEDIUM';
                riskClasses = {
                  title: 'text-yellow-300',
                  message: 'text-yellow-200',
                  bg: 'bg-yellow-500',
                  border: 'border-yellow-400'
                };
                riskMessage = 'Some concerns found. Read the warnings below carefully.';
              }

              return (
                <div className="p-8 border border-blue-500 border-opacity-30 rounded-lg bg-blue-500 bg-opacity-5">
                  {/* Title */}
                  <h2 className="text-3xl font-bold mb-4 text-center">{docSummary?.document_type || 'Agreement'}</h2>

                  {/* Overall Risk Score - PROMINENT */}
                  <div className={`mb-6 p-5 border-2 ${riskClasses.border} rounded-lg ${riskClasses.bg} bg-opacity-10`}>
                    <div className="text-center">
                      <h3 className={`text-3xl font-bold mb-2 ${riskClasses.title}`}>
                        {riskLevel} RISK
                      </h3>
                      <p className={`text-sm ${riskClasses.message} mb-3`}>{riskMessage}</p>
                      <div className="flex justify-center gap-4 text-xs">
                        {redFlags > 0 && (
                          <span className="text-red-300">{redFlags} Red Flag{redFlags !== 1 ? 's' : ''}</span>
                        )}
                        {yellowFlags > 0 && (
                          <span className="text-yellow-300">{yellowFlags} Yellow Flag{yellowFlags !== 1 ? 's' : ''}</span>
                        )}
                        {positiveTerms > 0 && (
                          <span className="text-green-300">{positiveTerms} Positive Term{positiveTerms !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Color Legend */}
                  <div className="mb-6 p-4 border border-white border-opacity-10 rounded-lg bg-white bg-opacity-5">
                    <p className="text-xs text-gray-300 text-center mb-2 font-semibold">Color Guide</p>
                    <div className="flex justify-center gap-6 text-xs">
                      <span className="text-red-300">Red = Serious Risk</span>
                      <span className="text-yellow-300">Yellow = Moderate Risk</span>
                      <span className="text-green-300">Green = Favorable</span>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-2">Expand sections below for detailed information</p>
                  </div>

                  {/* Summary Heading */}
                  <h3 className="text-xl font-semibold mb-6 text-center text-gray-300">Summary</h3>

                  {/* All Information */}
                  <div className="space-y-6 text-base leading-relaxed">
                    {/* Overview */}
                    {docSummary && (
                      <p className="text-gray-100">{docSummary.purpose}</p>
                    )}

                    {/* Obligations - Collapsible */}
                    {obligations.length > 0 && (
                      <div className="border border-white border-opacity-10 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection('obligations')}
                          className="w-full p-4 flex items-center justify-between bg-white bg-opacity-5 hover:bg-opacity-10 transition-all"
                        >
                          <span className="font-semibold text-white">{getHeading('obligations')} ({obligations.length})</span>
                          {expandedSections.obligations ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        {expandedSections.obligations && (
                          <div className="p-4 bg-white bg-opacity-5">
                            <ul className="space-y-2">
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
                      </div>
                    )}

                    {/* Rights - Collapsible */}
                    {rights.length > 0 && (
                      <div className="border border-white border-opacity-10 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection('rights')}
                          className="w-full p-4 flex items-center justify-between bg-white bg-opacity-5 hover:bg-opacity-10 transition-all"
                        >
                          <span className="font-semibold text-white">{getHeading('rights')} ({rights.length})</span>
                          {expandedSections.rights ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        {expandedSections.rights && (
                          <div className="p-4 bg-white bg-opacity-5">
                            <ul className="space-y-2">
                              {rights.map((right, index) => (
                                <li key={index} className="text-gray-200">
                                  • {right.right}
                                  {right.details && ` ${right.details}`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Risks - Collapsible (Expanded by default) */}
                    {(risks.red_flags?.length > 0 || risks.yellow_flags?.length > 0) && (
                      <div className="border-2 border-yellow-500 border-opacity-30 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection('risks')}
                          className="w-full p-4 flex items-center justify-between bg-yellow-500 bg-opacity-10 hover:bg-opacity-15 transition-all"
                        >
                          <span className="font-semibold text-white">
                            {getHeading('risks')} ({(risks.red_flags?.length || 0) + (risks.yellow_flags?.length || 0)})
                          </span>
                          {expandedSections.risks ? (
                            <ChevronUp className="w-5 h-5 text-yellow-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-yellow-400" />
                          )}
                        </button>
                        {expandedSections.risks && (
                          <div className="p-4 bg-yellow-500 bg-opacity-5">
                            <ul className="space-y-3">
                              {risks.red_flags?.map((flag, index) => (
                                <li key={index} className="p-3 bg-red-500 bg-opacity-10 border border-red-400 border-opacity-30 rounded">
                                  <div className="font-semibold text-red-300 mb-1">{flag.issue}</div>
                                  <div className="text-sm text-red-200">{flag.why_it_matters}</div>
                                  <div className="text-sm text-red-200 mt-1">{flag.potential_consequence}</div>
                                </li>
                              ))}
                              {risks.yellow_flags?.map((flag, index) => (
                                <li key={index} className="p-3 bg-yellow-500 bg-opacity-10 border border-yellow-400 border-opacity-30 rounded">
                                  <div className="font-semibold text-yellow-300 mb-1">{flag.issue}</div>
                                  <div className="text-sm text-yellow-200">{flag.why_it_matters}</div>
                                  <div className="text-sm text-yellow-200 mt-1">{flag.what_to_review}</div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Key Terms - Collapsible */}
                    {keyClauses.length > 0 && (
                      <div className="border border-white border-opacity-10 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection('clauses')}
                          className="w-full p-4 flex items-center justify-between bg-white bg-opacity-5 hover:bg-opacity-10 transition-all"
                        >
                          <span className="font-semibold text-white">{getHeading('clauses')} ({keyClauses.length})</span>
                          {expandedSections.clauses ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        {expandedSections.clauses && (
                          <div className="p-4 bg-white bg-opacity-5">
                            <ul className="space-y-3">
                              {keyClauses.map((clause, index) => (
                                <li key={index} className="text-gray-200">
                                  <span className="font-medium text-white">{clause.title}:</span>
                                  <div className="mt-1 text-sm">{clause.explanation}</div>
                                  <div className="mt-1 text-sm text-blue-300">{clause.impact}</div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Questions to Ask - Collapsible (Top 3 Most Important) */}
                    {currentAnalysis?.questions_to_ask && currentAnalysis.questions_to_ask.length > 0 && (
                      <div className="border border-blue-400 border-opacity-30 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection('questions')}
                          className="w-full p-4 flex items-center justify-between bg-blue-500 bg-opacity-10 hover:bg-opacity-15 transition-all"
                        >
                          <span className="font-semibold text-blue-300">{getHeading('questions')} (Top 3)</span>
                          {expandedSections.questions ? (
                            <ChevronUp className="w-5 h-5 text-blue-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-blue-400" />
                          )}
                        </button>
                        {expandedSections.questions && (
                          <div className="p-4 bg-blue-500 bg-opacity-5">
                            <div className="text-xs text-blue-200 mb-4">
                              Click "Copy Message" to generate a professional WhatsApp/Email ready message
                            </div>
                            <div className="space-y-4">
                              {currentAnalysis.questions_to_ask.slice(0, 3).map((question, index) => (
                                <div key={index} className="p-4 bg-blue-500 bg-opacity-10 border border-blue-400 border-opacity-20 rounded-lg">
                                  <div className="flex items-start gap-3 mb-3">
                                    <span className="font-bold text-blue-300 text-lg">{index + 1}.</span>
                                    <p className="text-gray-100 flex-1">{question}</p>
                                  </div>
                                  <button
                                    onClick={() => copyQuestionMessage(question, index)}
                                    disabled={copyingQuestion === index}
                                    className="w-full px-4 py-2 bg-blue-500 bg-opacity-20 hover:bg-opacity-30 border border-blue-400 border-opacity-30 rounded-lg transition-all flex items-center justify-center gap-2 text-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {copyingQuestion === index ? (
                                      <>
                                        <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-sm">Generating...</span>
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm font-medium">Copy Message</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                            {currentAnalysis.questions_to_ask.length > 3 && (
                              <div className="mt-3 text-xs text-gray-400 text-center">
                                Showing top 3 of {currentAnalysis.questions_to_ask.length} questions
                              </div>
                            )}
                          </div>
                        )}
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
