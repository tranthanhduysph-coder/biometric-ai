import React, { useState, useEffect } from 'react';
import { extractMetrics } from '../services/geminiService';
import { exportQuestionsToPDF } from '../services/exportService';
import { QuestionData } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { QuestionDisplay } from './QuestionDisplay';
import { useAppContext } from '../contexts/AppContext';

export const ExtractorModule: React.FC = () => {
  const { t, language } = useAppContext();
  
  // State Initialization with Persistence
  const [questionText, setQuestionText] = useState(() => localStorage.getItem('biometric_ext_question') || '');
  const [optionsText, setOptionsText] = useState(() => localStorage.getItem('biometric_ext_options') || '');
  const [answerKey, setAnswerKey] = useState(() => localStorage.getItem('biometric_ext_answer') || '');
  const [customPrompt, setCustomPrompt] = useState(() => localStorage.getItem('biometric_ext_prompt') || '');
  const [results, setResults] = useState<Partial<QuestionData>[]>(() => {
    const saved = localStorage.getItem('biometric_ext_results');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist State
  useEffect(() => { localStorage.setItem('biometric_ext_question', questionText); }, [questionText]);
  useEffect(() => { localStorage.setItem('biometric_ext_options', optionsText); }, [optionsText]);
  useEffect(() => { localStorage.setItem('biometric_ext_answer', answerKey); }, [answerKey]);
  useEffect(() => { localStorage.setItem('biometric_ext_prompt', customPrompt); }, [customPrompt]);
  useEffect(() => { localStorage.setItem('biometric_ext_results', JSON.stringify(results)); }, [results]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);
    
    try {
      const data = await extractMetrics(questionText, optionsText, answerKey, customPrompt, language);
      
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([{ ...data, Question: questionText, options: optionsText, Answer: answerKey || data.Answer }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const textareaClass = "w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-200";

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-200">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b pb-4 border-slate-100 dark:border-slate-700">
          <span className="text-emerald-600 text-2xl">🔍</span> {t('extractorTitle')}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('inputQuestion')}</label>
            <textarea
              required
              rows={6}
              className={textareaClass}
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              placeholder={t('extractorPlaceholder')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('inputOptions')}</label>
              <textarea
                rows={4}
                className={textareaClass}
                value={optionsText}
                onChange={e => setOptionsText(e.target.value)}
                placeholder={t('optionsPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('inputKey')}
              </label>
              <textarea
                rows={4}
                className={`${textareaClass} border-emerald-200 bg-emerald-50/30 dark:bg-emerald-900/20`}
                value={answerKey}
                onChange={e => setAnswerKey(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('customPrompt')}
            </label>
            <textarea
              rows={2}
              className={textareaClass}
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
            >
              {loading ? t('analyzing') : t('analyze')}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-md border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {results.length > 0 && (
        <>
          <div className="flex justify-end">
            <button 
              onClick={() => exportQuestionsToPDF(results, "BioMetric_Reverse_Analysis")}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow font-medium transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              {t('exportDocx')}
            </button>
          </div>
          <div className="space-y-6">
            {results.map((res, i) => (
              <QuestionDisplay key={i} data={res} title={`Metrics Analysis #${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};