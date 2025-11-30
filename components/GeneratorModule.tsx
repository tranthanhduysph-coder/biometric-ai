import React, { useState, useEffect } from 'react';
import { generateQuestion, generateBatchQuestions } from '../services/geminiService';
import { exportQuestionsToPDF } from '../services/exportService';
import { QuestionData, MetricInput, BatchItem } from '../types'; // Removed COMPETENCY_MAP from here
import { LoadingSpinner } from './LoadingSpinner';
import { QuestionDisplay } from './QuestionDisplay';
// Added COMPETENCY_MAP to here
import { CURRICULUM_STRUCTURE, DIFFICULTY_MAPPING, TYPE_MAPPING, SETTING_MAPPING, COMPETENCY_MAP } from '../constants';
import { useAppContext } from '../contexts/AppContext';

export const GeneratorModule: React.FC = () => {
  const { t, language } = useAppContext();
  
  // 1. Get Chapters based on Language
  const chapters = Object.keys(CURRICULUM_STRUCTURE[language]);
  
  // 2. State with Persistence (Initialize from localStorage if available)
  const [metrics, setMetrics] = useState<MetricInput>(() => {
    const saved = localStorage.getItem('biometric_gen_metrics');
    // Ensure default difficulty matches Bloom levels
    const defaultDiff = language === 'vi' ? 'Hiểu' : 'Understand';
    
    return saved ? JSON.parse(saved) : {
      chapter: chapters[0],
      content: CURRICULUM_STRUCTURE[language][chapters[0]][0],
      difficulty: defaultDiff,
      competency: 'NT2',
      type: 'Multiple choices',
      setting: 'Lý thuyết',
      hasChart: false,
      hasImage: false,
      customPrompt: '',
      imageFile: null
    };
  });

  const [quantity, setQuantity] = useState<number>(() => {
    return parseInt(localStorage.getItem('biometric_gen_quantity') || '1');
  });

  const [queue, setQueue] = useState<BatchItem[]>(() => {
    const saved = localStorage.getItem('biometric_gen_queue');
    return saved ? JSON.parse(saved) : [];
  });

  const [results, setResults] = useState<QuestionData[]>(() => {
    const saved = localStorage.getItem('biometric_gen_results');
    return saved ? JSON.parse(saved) : [];
  });

  // 3. Effects for Persistence
  useEffect(() => {
    // Only save serializable parts of metrics (exclude file)
    const { imageFile, ...saveableMetrics } = metrics;
    localStorage.setItem('biometric_gen_metrics', JSON.stringify(saveableMetrics));
  }, [metrics]);

  useEffect(() => { localStorage.setItem('biometric_gen_quantity', quantity.toString()); }, [quantity]);
  useEffect(() => { localStorage.setItem('biometric_gen_queue', JSON.stringify(queue)); }, [queue]);
  useEffect(() => { localStorage.setItem('biometric_gen_results', JSON.stringify(results)); }, [results]);

  // 4. Effects for Localization/Logic
  const [availableContents, setAvailableContents] = useState<string[]>([]);
  const [availableDifficulties, setAvailableDifficulties] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // When Language changes, we must reset selections to avoid mismatch
  useEffect(() => {
    const newChapters = Object.keys(CURRICULUM_STRUCTURE[language]);
    const firstChapter = newChapters[0];
    const firstContent = CURRICULUM_STRUCTURE[language][firstChapter][0];
    
    // Check if current chapter exists in new language (unlikely unless exact match), so reset to safe default
    if (!CURRICULUM_STRUCTURE[language][metrics.chapter]) {
      setMetrics(prev => ({
        ...prev,
        chapter: firstChapter,
        content: firstContent
      }));
    }
  }, [language]);

  // When Chapter changes, update Content
  useEffect(() => {
    const contents = CURRICULUM_STRUCTURE[language][metrics.chapter] || [];
    setAvailableContents(contents);
    if (!contents.includes(metrics.content)) {
      setMetrics(prev => ({ ...prev, content: contents[0] || '' }));
    }
  }, [metrics.chapter, language]);

  // When Competency changes, filter Difficulty (Bloom 6 Levels)
  useEffect(() => {
    const comp = metrics.competency;
    let newDifficulties: string[] = [];
    
    // Logic mapping Bloom levels based on Competency
    // We define the localized strings
    const levelsVi = ['Ghi nhớ', 'Hiểu', 'Vận dụng', 'Phân tích', 'Đánh giá', 'Sáng tạo'];
    const levelsEn = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
    const levels = language === 'vi' ? levelsVi : levelsEn;

    if (comp === 'NT1') newDifficulties = [levels[0], levels[1]];
    else if (['NT2', 'NT3'].includes(comp)) newDifficulties = [levels[1], levels[2]];
    else if (['NT4', 'NT5', 'NT6'].includes(comp)) newDifficulties = [levels[2], levels[3]];
    else if (comp.startsWith('TH')) newDifficulties = [levels[3], levels[4]];
    else if (comp.startsWith('VD')) newDifficulties = [levels[4], levels[5]];
    else newDifficulties = levels;

    setAvailableDifficulties(newDifficulties);
    
    // Auto-select valid difficulty if current is invalid
    if (!newDifficulties.includes(metrics.difficulty)) {
       setMetrics(prev => ({ ...prev, difficulty: newDifficulties[0] }));
    }
  }, [metrics.competency, language]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMetrics(prev => ({ ...prev, imageFile: file, hasImage: true }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addToQueue = () => {
    if (queue.length + quantity > 40) {
      alert("Tối đa 40 câu hỏi trong hàng đợi.");
      return;
    }
    const newItems: BatchItem[] = Array.from({ length: quantity }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      metrics: { ...metrics }
    }));
    setQueue([...queue, ...newItems]);
  };

  const removeFromQueue = (id: string) => {
    setQueue(queue.filter(item => item.id !== id));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UNIFIED GENERATE FUNCTION
  const handleUnifiedGenerate = async () => {
    setLoading(true);
    setError(null);
    setResults([]); // Clear previous results to avoid confusion
    
    try {
      if (queue.length > 0) {
        // Mode 1: Generate entire Queue
        const data = await generateBatchQuestions(queue.map(i => i.metrics), language);
        setResults(data);
        setQueue([]); // Clear queue after success
      } else {
        // Mode 2: Generate based on current config (Quantity)
        if (quantity === 1) {
          const data = await generateQuestion(metrics, language);
          setResults([data]);
        } else {
          const batch = Array(quantity).fill(metrics);
          const data = await generateBatchQuestions(batch, language);
          setResults(data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 transition-colors duration-200";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-200">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b pb-4 border-slate-100 dark:border-slate-700">
            <span className="text-indigo-600 text-2xl">⚙️</span> {t('configTitle')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('chapter')}</label>
              <select className={inputClass} value={metrics.chapter} onChange={e => setMetrics({...metrics, chapter: e.target.value})}>
                {chapters.map(chap => <option key={chap} value={chap}>{chap}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('content')}</label>
              <select className={inputClass} value={metrics.content} onChange={e => setMetrics({...metrics, content: e.target.value})}>
                {availableContents.map(cont => <option key={cont} value={cont}>{cont}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('competency')}</label>
              <select className={inputClass} value={metrics.competency} onChange={e => setMetrics({...metrics, competency: e.target.value})}>
                {Object.keys(COMPETENCY_MAP[language]).map(code => (
                  <option key={code} value={code}>{code} - {COMPETENCY_MAP[language][code].substring(0, 30)}...</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('difficulty')}</label>
              <select className={`${inputClass} bg-slate-50 dark:bg-slate-600`} value={metrics.difficulty} onChange={e => setMetrics({...metrics, difficulty: e.target.value})}>
                {availableDifficulties.map(diff => (
                  <option key={diff} value={diff}>{t(DIFFICULTY_MAPPING[diff] || diff)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('qType')}</label>
              <select className={inputClass} value={metrics.type} onChange={e => setMetrics({...metrics, type: e.target.value})}>
                {Object.entries(TYPE_MAPPING).map(([val, key]) => (
                  <option key={val} value={val}>{t(key)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('context')}</label>
              <select className={inputClass} value={metrics.setting} onChange={e => setMetrics({...metrics, setting: e.target.value})}>
                {Object.entries(SETTING_MAPPING).map(([val, key]) => (
                  <option key={val} value={val}>{t(key)}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('quantity')}</label>
              <input 
                type="number" 
                min="1" 
                max="5" 
                value={quantity} 
                onChange={e => setQuantity(Math.min(5, Math.max(1, parseInt(e.target.value))))}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('customPrompt')}</label>
              <textarea
                className={inputClass}
                rows={2}
                value={metrics.customPrompt}
                onChange={e => setMetrics({...metrics, customPrompt: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 border-t dark:border-slate-700 pt-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">{t('imageOptions')}</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input type="file" id="imgUp" accept="image/*" className="hidden" onChange={handleImageChange} />
                  <label htmlFor="imgUp" className="block text-center p-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{imagePreview ? t('changeImg') : t('uploadImg')}</span>
                  </label>
                  {imagePreview && <img src={imagePreview} className="mt-2 h-16 object-contain mx-auto" alt="Preview" />}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={metrics.hasImage && !metrics.imageFile} onChange={e => setMetrics({...metrics, hasImage: e.target.checked})} disabled={!!metrics.imageFile} className="mr-2 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-slate-600" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{t('autoImg')}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={metrics.hasChart} onChange={e => setMetrics({...metrics, hasChart: e.target.checked})} className="mr-2 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-slate-600" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{t('mockChart')}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={addToQueue}
              disabled={loading || queue.length >= 40}
              className="w-full py-3 px-4 rounded-lg shadow-sm border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors font-semibold"
            >
              + {t('addToBank')}
            </button>
          </div>
        </div>

        {/* Right Column: Queue */}
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg shadow-inner border border-slate-200 dark:border-slate-700 flex flex-col transition-colors duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white">{t('queueTitle')} ({queue.length}/40)</h3>
            {queue.length > 0 && (
              <button onClick={() => setQueue([])} className="text-xs text-red-500 hover:text-red-700 font-medium">{t('clearQueue')}</button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1 custom-scrollbar min-h-[300px]">
            {queue.map((item, idx) => (
              <div key={item.id} className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs shadow-sm relative group transition-colors">
                <button onClick={() => removeFromQueue(item.id)} className="absolute top-1 right-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-lg font-bold">×</button>
                <div className="font-bold text-indigo-600 dark:text-indigo-400">#{idx + 1} {t(DIFFICULTY_MAPPING[item.metrics.difficulty] || item.metrics.difficulty)}</div>
                <div className="text-slate-600 dark:text-slate-400 truncate my-1" title={item.metrics.content}>{item.metrics.content}</div>
                <div className="flex justify-between text-slate-500 dark:text-slate-500">
                   <span>{t(TYPE_MAPPING[item.metrics.type] || item.metrics.type)}</span>
                   {item.metrics.hasChart && <span className="text-orange-500">📊</span>}
                   {item.metrics.hasImage && <span className="text-blue-500">🖼️</span>}
                </div>
              </div>
            ))}
            {queue.length === 0 && <div className="text-center text-slate-400 text-sm italic py-20 flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">Queue is empty</div>}
          </div>
        </div>
      </div>

      {/* Primary Action Button (Unified) */}
      <div className="sticky bottom-4 z-40">
        <button
          onClick={handleUnifiedGenerate}
          disabled={loading}
          className="w-full max-w-2xl mx-auto block py-4 px-6 rounded-2xl shadow-xl font-bold text-white text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01]"
        >
          {loading ? t('generating') : (
            queue.length > 0 
              ? `${t('generateAction')} (${queue.length} items from Queue)` 
              : `${t('generateAction')} (${quantity} items from Config)`
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-md border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {results.length > 0 && (
        <>
          <div className="flex justify-end mt-8">
            <button 
              onClick={() => exportQuestionsToPDF(results, "BioMetric_AI_Generated_Bank")}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow font-medium transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              {t('exportDocx')}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {results.map((res, i) => (
              <QuestionDisplay key={i} data={res} title={`Câu hỏi ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};