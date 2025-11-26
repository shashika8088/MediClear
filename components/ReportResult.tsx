import React, { useState } from 'react';
import { SimplifiedReport } from '../types';
import { ClipboardIcon, CheckIcon, DownloadIcon, SparkleIcon } from './Icons';
import { translateFullReport } from "../services/geminiService";

interface ReportResultProps {
  report: SimplifiedReport;
  onReset: () => void;
}

const ReportResult: React.FC<ReportResultProps> = ({ report, onReset }) => {
  const [copied, setCopied] = useState(false);

  // Multilingual: keep a translated version of the whole report
  const [language, setLanguage] = useState("English");
  const [translatedReport, setTranslatedReport] = useState<SimplifiedReport>(report);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);

    if (lang === "English") {
      setTranslatedReport(report);
      return;
    }

    try {
      setIsTranslating(true);
      const newReport = await translateFullReport(report, lang);
      setTranslatedReport(newReport);
    } catch (err) {
      console.error("Translation error:", err);
      // If something fails, fall back to original
      setTranslatedReport(report);
      setLanguage("English");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = `
Summary:
${translatedReport.summary}

Key Points:
${translatedReport.keyPoints.map(p => `- ${p}`).join('\n')}

Glossary:
${translatedReport.glossary.map(g => `${g.term}: ${g.definition}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in-up">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header Actions */}
        <div className="bg-medical-50 px-6 py-4 border-b border-medical-100 flex justify-between items-center no-print">
          <div className="flex items-center gap-2 text-medical-800 font-semibold">
            <SparkleIcon />
            <span>Simplified Report</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-medical-700 bg-white border border-medical-200 rounded-md hover:bg-medical-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-medical-500"
              title="Copy to clipboard"
            >
              {copied ? <CheckIcon /> : <ClipboardIcon />}
              <span className="ml-1.5">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-medical-700 bg-white border border-medical-200 rounded-md hover:bg-medical-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-medical-500"
              title="Print or Save as PDF"
            >
              <DownloadIcon />
              <span className="ml-1.5">PDF / Print</span>
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* Summary Section */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
              <span className="w-1.5 h-6 bg-medical-500 rounded-full mr-3"></span>
              Summary
            </h3>

            {/* Language Selector */}
            <div className="mb-3 flex items-center gap-2">
              <label className="text-sm font-medium text-slate-600">Language:</label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="border p-2 rounded-md text-sm"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Kannada">Kannada</option>
                <option value="Tamil">Tamil</option>
              </select>
              {isTranslating && (
                <span className="text-xs text-slate-500 italic">
                  Translating...
                </span>
              )}
            </div>

            <div className="text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-lg border border-slate-100 text-lg">
              {translatedReport.summary}
            </div>
          </section>

          {/* Key Points Section */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
              Key Takeaways
            </h3>
            <ul className="space-y-3">
              {translatedReport.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold mt-0.5 mr-3">
                    {index + 1}
                  </span>
                  <span className="text-slate-700">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Glossary Section */}
          {translatedReport.glossary.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full mr-3"></span>
                Glossary of Terms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {translatedReport.glossary.map((item, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <dt className="font-semibold text-slate-900 mb-1">{item.term}</dt>
                    <dd className="text-sm text-slate-600">{item.definition}</dd>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5">
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Disclaimer:</strong> {translatedReport.disclaimer} This tool uses AI and may make mistakes. It is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult your doctor.
            </p>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-center no-print">
          <button 
            onClick={onReset}
            className="text-sm text-slate-500 hover:text-slate-800 underline underline-offset-2 transition-colors"
          >
            Analyze Another Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportResult;
