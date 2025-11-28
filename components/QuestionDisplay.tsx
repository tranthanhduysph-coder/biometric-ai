
import React from 'react';
import { QuestionData } from '../types';

interface Props {
  data: Partial<QuestionData>;
  title: string;
}

export const QuestionDisplay: React.FC<Props> = ({ data, title }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-up">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-800 dark:to-indigo-900 px-6 py-4">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          {title}
        </h3>
      </div>
      <div className="p-6 space-y-5">
        {/* Metrics Badge Row */}
        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          {data.Difficulty && (
            <span className={`px-2 py-1 rounded border ${
              data.Difficulty.includes('Nhận biết') || data.Difficulty.includes('Knowing') ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300' :
              data.Difficulty.includes('Thông hiểu') || data.Difficulty.includes('Understanding') ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' :
              'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-300'
            }`}>
              {data.Difficulty}
            </span>
          )}
          {data.Chapter && <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200 dark:bg-slate-700 dark:border-slate-600">{data.Chapter}</span>}
          {data["Type of Question"] && <span className="px-2 py-1 rounded bg-purple-50 border border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300">{data["Type of Question"]}</span>}
          {data.Setting && <span className="px-2 py-1 rounded bg-orange-50 border border-orange-200 text-orange-700 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-300">{data.Setting}</span>}
        </div>

        {/* Question Body */}
        {data.Question && (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h4 className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-2">CONTENT</h4>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium whitespace-pre-wrap leading-relaxed">
              {data.Question}
            </div>
          </div>
        )}

        {/* Render Auto-Found Image */}
        {data.imageKeywords && (
          <div className="my-4 border dark:border-slate-700 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 flex flex-col items-center">
             <img 
               src={`https://image.pollinations.ai/prompt/${encodeURIComponent(data.imageKeywords)}`} 
               alt={data.imageDescription || "Biological Illustration"}
               className="w-full max-h-96 object-contain"
               loading="lazy"
             />
             <div className="p-3 bg-white dark:bg-slate-800 w-full border-t dark:border-slate-700 text-center">
               <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-1">Generated Illustration: "{data.imageKeywords}"</p>
               {data.imageDescription && <p className="text-sm text-slate-700 dark:text-slate-300">{data.imageDescription}</p>}
             </div>
          </div>
        )}

        {/* Chart Render */}
        {data.chartConfig && (
          <div className="my-4 border dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
            <h4 className="text-center font-bold text-slate-700 dark:text-slate-200 mb-4">{data.chartConfig.title}</h4>
            <div className="flex justify-center">
              <svg width="100%" height="300" viewBox="0 0 500 300" className="overflow-visible">
                <line x1="50" y1="250" x2="480" y2="250" stroke="#64748b" strokeWidth="2" />
                <line x1="50" y1="20" x2="50" y2="250" stroke="#64748b" strokeWidth="2" />
                
                <text x="265" y="290" textAnchor="middle" className="text-xs fill-slate-500 dark:fill-slate-400">{data.chartConfig.xLabel}</text>
                <text x="20" y="150" textAnchor="middle" transform="rotate(-90, 20, 150)" className="text-xs fill-slate-500 dark:fill-slate-400">{data.chartConfig.yLabel}</text>

                {data.chartConfig.type === 'bar' ? (
                  data.chartConfig.values.map((val, idx) => {
                    const maxVal = Math.max(...(data.chartConfig?.values || [100]));
                    const barHeight = (val / maxVal) * 220;
                    const barWidth = 400 / data.chartConfig!.values.length;
                    const x = 60 + idx * barWidth;
                    const y = 250 - barHeight;
                    return (
                      <g key={idx}>
                        <rect x={x + 10} y={y} width={barWidth - 20} height={barHeight} fill="#6366f1" opacity="0.8" />
                        <text x={x + barWidth/2} y={y - 5} textAnchor="middle" className="text-xs font-bold fill-slate-700 dark:fill-slate-300">{val}</text>
                        <text x={x + barWidth/2} y={265} textAnchor="middle" className="text-xs fill-slate-600 dark:fill-slate-400">{data.chartConfig!.labels[idx]}</text>
                      </g>
                    )
                  })
                ) : (
                  // Line Chart
                  (() => {
                    const maxVal = Math.max(...(data.chartConfig?.values || [100]));
                    const stepX = 400 / (data.chartConfig!.values.length - 1 || 1);
                    const points = data.chartConfig!.values.map((val, idx) => {
                      const x = 60 + idx * stepX;
                      const y = 250 - (val / maxVal) * 220;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <g>
                        <polyline points={points} fill="none" stroke="#ef4444" strokeWidth="3" />
                        {data.chartConfig!.values.map((val, idx) => {
                          const x = 60 + idx * stepX;
                          const y = 250 - (val / maxVal) * 220;
                          return (
                            <g key={idx}>
                              <circle cx={x} cy={y} r="4" fill="white" stroke="#ef4444" strokeWidth="2" />
                              <text x={x} y={y - 10} textAnchor="middle" className="text-xs font-bold fill-slate-700 dark:fill-slate-300">{val}</text>
                              <text x={x} y={265} textAnchor="middle" className="text-xs fill-slate-600 dark:fill-slate-400">{data.chartConfig!.labels[idx]}</text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })()
                )}
              </svg>
            </div>
          </div>
        )}

        {/* Options */}
        {data.options && !data.sub_metrics && (
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-2">OPTIONS</h4>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono text-sm">
              {data.options}
            </div>
          </div>
        )}

        {/* PISA Sub-metrics */}
        {data.sub_metrics && data.sub_metrics.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">PISA Analysis</h4>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Statement</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Difficulty</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Competency</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Answer</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {data.sub_metrics.map((sub, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">{sub.id}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{sub.statement}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className="px-2 py-0.5 rounded text-xs border bg-slate-100 border-slate-200 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">{sub.difficulty}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{sub.competency}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-indigo-600 dark:text-indigo-400">{sub.answer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Explanation */}
        {(data.Answer || data.Explaination) && (
          <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              {data.Answer && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-2">KEY</h4>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-3 rounded">{data.Answer}</div>
                </div>
              )}
              {data.Explaination && (
                <div className={!data.Answer ? "md:col-span-2" : ""}>
                  <h4 className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold mb-2">EXPLANATION</h4>
                  <div className="text-slate-700 dark:text-slate-300 text-sm bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-3 rounded">{data.Explaination}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metrics Panel */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-xl border border-amber-100 dark:border-amber-800 text-sm space-y-3 mt-4 text-slate-700 dark:text-slate-300">
          <h4 className="font-bold text-amber-800 dark:text-amber-400 border-b border-amber-200 dark:border-amber-700 pb-2 mb-2 flex items-center gap-2">
            Pedagogical Metrics
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {data["Learning Objective"] && <p><span className="font-semibold w-24 inline-block">Objective:</span> {data["Learning Objective"]}</p>}
            {data.Competency && <p><span className="font-semibold w-24 inline-block">Competency:</span> {data.Competency}</p>}
            {data.Content && <p><span className="font-semibold w-24 inline-block">Content:</span> {data.Content}</p>}
            {data.Setting && <p><span className="font-semibold w-24 inline-block">Context:</span> {data.Setting}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
