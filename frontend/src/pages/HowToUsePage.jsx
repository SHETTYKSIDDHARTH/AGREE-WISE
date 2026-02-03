import { Link } from 'react-router-dom';
import { useUILanguage } from '../contexts/UILanguageContext';
import UILanguageSwitcher from '../components/UILanguageSwitcher';
import { FileText, Upload, Search, CheckCircle, Volume2, ArrowLeft, AlertCircle } from 'lucide-react';

export default function HowToUsePage() {
  const { t } = useUILanguage();

  const steps = [
    {
      number: 1,
      icon: FileText,
      title: t('step1Title'),
      description: t('step1Desc'),
    },
    {
      number: 2,
      icon: Upload,
      title: t('step2Title'),
      description: t('step2Desc'),
    },
    {
      number: 3,
      icon: Search,
      title: t('step3Title'),
      description: t('step3Desc'),
    },
    {
      number: 4,
      icon: CheckCircle,
      title: t('step4Title'),
      description: t('step4Desc'),
    },
    {
      number: 5,
      icon: Volume2,
      title: t('step5Title'),
      description: t('step5Desc'),
    },
  ];

  const tips = [
    t('tip1'),
    t('tip2'),
    t('tip3'),
    t('tip4'),
    t('tip5'),
  ];

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage: `
          linear-gradient(
            -90deg,
            transparent calc(5em - 1px),
            rgba(255, 255, 255, 0.2) calc(5em - 1px + 1px),
            rgba(255, 255, 255, 0.2) 5em
          ),
          linear-gradient(
            0deg,
            transparent calc(5em - 1px),
            rgba(255, 255, 255, 0.2) calc(5em - 1px + 1px),
            rgba(255, 255, 255, 0.2) 5em
          )
        `,
        backgroundSize: '5em 5em'
      }}
    >
      {/* Header */}
      <header className="border-b border-white border-opacity-10 bg-white bg-opacity-5 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="p-1.5 bg-white rounded">
              <FileText className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">{t('appName')}</h1>
          </Link>

          <UILanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backToHome')}
        </Link>

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            {t('howToUseTitle')}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('howToUseSubtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="p-6 border border-white border-opacity-10 rounded-lg bg-white bg-opacity-5 backdrop-blur-md hover:border-opacity-30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-black" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{step.number}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="p-8 border border-white border-opacity-10 rounded-lg bg-white bg-opacity-5 backdrop-blur-md mb-16">
          <h2 className="text-2xl font-bold mb-6">{t('tipsTitle')}</h2>
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

       

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-black py-4 px-8 rounded-lg font-medium text-base hover:bg-gray-200 transition-all"
          >
            {t('backToHome')}
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </Link>
        </div>
      </main>
    </div>
  );
}