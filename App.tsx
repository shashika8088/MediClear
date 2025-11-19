import React, { useState, useRef, useEffect } from 'react';
import ReportInput from './components/ReportInput';
import ReportResult from './components/ReportResult';
import { analyzeReport } from './services/geminiService';
import { AnalysisState, InputMode, SimplifiedReport } from './types';

function App() {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.TEXT);
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    loading: false,
    result: null,
    error: null
  });

  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    setAnalysis({ loading: true, result: null, error: null });
    try {
      const result = await analyzeReport(
        inputMode === InputMode.TEXT ? textInput : null,
        inputMode === InputMode.IMAGE ? selectedImage : null
      );
      setAnalysis({ loading: false, result: result, error: null });
    } catch (err: any) {
      setAnalysis({ 
        loading: false, 
        result: null, 
        error: err.message || "An unexpected error occurred." 
      });
    }
  };

  const handleReset = () => {
    setAnalysis({ loading: false, result: null, error: null });
    setTextInput('');
    setSelectedImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-scroll to result when available
  useEffect(() => {
    if (analysis.result && resultRef.current) {
        // Small delay to allow rendering
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [analysis.result]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-medical-600 p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Medi<span className="text-medical-600">Clear</span>
            </h1>
          </div>
          <nav className="hidden md:flex space-x-6">
             <a href="#" className="text-sm font-medium text-slate-500 hover:text-medical-600 transition-colors">How it works</a>
             <a href="#" className="text-sm font-medium text-slate-500 hover:text-medical-600 transition-colors">Privacy</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Hero / Intro - Hide when result is shown to save space */}
          {!analysis.result && (
             <div className="text-center py-10 sm:py-16 animate-fade-in no-print">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                  Make Sense of Your <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-600 to-teal-500">Medical Reports</span>
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                  Upload your medical document or paste the text to get a simplified summary, key takeaways, and definitions of complex terms. Private, secure, and free.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                         <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                         <span>Private & Secure</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                         <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                         <span>AI Powered</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                         <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                         <span>Simple Summary</span>
                    </div>
                </div>
             </div>
          )}

          {/* Input Section - Hide if result is present, or keep for reference? Let's replace it for cleaner flow */}
          {!analysis.result && (
            <div className="animate-slide-up">
                <ReportInput
                    inputMode={inputMode}
                    setInputMode={setInputMode}
                    textInput={textInput}
                    setTextInput={setTextInput}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    onAnalyze={handleAnalyze}
                    isLoading={analysis.loading}
                />
                {analysis.error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3 animate-shake">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                        </svg>
                        {analysis.error}
                    </div>
                )}
            </div>
          )}

          {/* Results Section */}
          {analysis.result && (
            <div ref={resultRef}>
                <ReportResult report={analysis.result} onReset={handleReset} />
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-8 no-print">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MediClear. All rights reserved.</p>
          <p className="mt-2 text-xs">Privacy: We do not store your medical data. All processing is done in real-time.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
