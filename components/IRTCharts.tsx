
import React, { useMemo, useState } from 'react';
import { IRTAnalysisResult } from '../types';

interface Props {
  analysis: IRTAnalysisResult;
}

export const IRTCharts: React.FC<Props> = ({ analysis }) => {
  // Chart Configs
  const scatterConfig = { width: 600, height: 350, padding: { top: 20, right: 30, bottom: 40, left: 50 }, xMin: -4, xMax: 4, yMin: -0.2, yMax: 1.0 };
  const histConfig = { width: 600, height: 250, padding: { top: 20, right: 30, bottom: 40, left: 50 } };

  // Helpers
  const getX = (val: number) => {
    const { width, padding, xMin, xMax } = scatterConfig;
    return padding.left + ((Math.max(xMin, Math.min(xMax, val)) - xMin) / (xMax - xMin)) * (width - padding.left - padding.right);
  };
  const getY = (val: number) => {
    const { height, padding, yMin, yMax } = scatterConfig;
    return height - padding.bottom - ((Math.max(yMin, Math.min(yMax, val)) - yMin) / (yMax - yMin)) * (height - padding.top - padding.bottom);
  };

  const bins = useMemo(() => {
    const binCount = 10; const minTheta = -4; const maxTheta = 4; const step = (maxTheta - minTheta) / binCount;
    const data = new Array(binCount).fill(0);
    analysis.students.forEach(s => {
      let idx = Math.floor((s.theta - minTheta) / step);
      if (idx < 0) idx = 0; if (idx >= binCount) idx = binCount - 1;
      data[idx]++;
    });
    return { data, step, minTheta, maxVal: Math.max(...data) };
  }, [analysis.students]);

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Styles
  const gridColor = "#94a3b8"; // Slate-400
  const textColor = "#64748b"; // Slate-500

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Item Map */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">Item Map</h3>
        <div className="relative w-full aspect-[16/9]">
          <svg viewBox={`0 0 ${scatterConfig.width} ${scatterConfig.height}`} className="w-full h-full overflow-visible">
            <line x1={scatterConfig.padding.left} y1={getY(0)} x2={scatterConfig.width - scatterConfig.padding.right} y2={getY(0)} stroke={gridColor} strokeDasharray="4 4" opacity="0.3" />
            <line x1={getX(0)} y1={scatterConfig.padding.top} x2={getX(0)} y2={scatterConfig.height - scatterConfig.padding.bottom} stroke={gridColor} strokeDasharray="4 4" opacity="0.3" />
            
            <line x1={scatterConfig.padding.left} y1={scatterConfig.height - scatterConfig.padding.bottom} x2={scatterConfig.width - scatterConfig.padding.right} y2={scatterConfig.height - scatterConfig.padding.bottom} stroke={textColor} strokeWidth="1" />
            <line x1={scatterConfig.padding.left} y1={scatterConfig.padding.top} x2={scatterConfig.padding.left} y2={scatterConfig.height - scatterConfig.padding.bottom} stroke={textColor} strokeWidth="1" />

            <text x={scatterConfig.width / 2} y={scatterConfig.height - 5} textAnchor="middle" className="text-[10px] fill-slate-500 dark:fill-slate-400">Difficulty (b)</text>
            <text x={15} y={scatterConfig.height / 2} textAnchor="middle" transform={`rotate(-90 15 ${scatterConfig.height / 2})`} className="text-[10px] fill-slate-500 dark:fill-slate-400">Discrimination</text>

            {analysis.items.map((item) => (
              <g key={item.itemId} onMouseEnter={() => setHoveredItem(item.itemId)} onMouseLeave={() => setHoveredItem(null)}>
                <circle cx={getX(item.b)} cy={getY(item.pBis)} r={hoveredItem === item.itemId ? 6 : 4} fill={item.pBis < 0.2 ? '#ef4444' : '#6366f1'} stroke="white" strokeWidth="1" />
                {hoveredItem === item.itemId && (
                  <g>
                    <rect x={getX(item.b) + 10} y={getY(item.pBis) - 25} width="80" height="35" rx="4" fill="rgba(15, 23, 42, 0.9)" />
                    <text x={getX(item.b) + 15} y={getY(item.pBis) - 10} className="text-[10px] fill-white font-bold">{item.itemId}</text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Ability Distribution */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">Theta Distribution</h3>
        <div className="relative w-full aspect-[16/9]">
          <svg viewBox={`0 0 ${histConfig.width} ${histConfig.height}`} className="w-full h-full">
             <line x1={histConfig.padding.left} y1={histConfig.height - histConfig.padding.bottom} x2={histConfig.width - histConfig.padding.right} y2={histConfig.height - histConfig.padding.bottom} stroke={textColor} strokeWidth="1" />
             {bins.data.map((count, i) => {
               const barWidth = (histConfig.width - histConfig.padding.left - histConfig.padding.right) / bins.data.length;
               const barHeight = (count / bins.maxVal) * (histConfig.height - histConfig.padding.top - histConfig.padding.bottom);
               const x = histConfig.padding.left + i * barWidth;
               const y = histConfig.height - histConfig.padding.bottom - barHeight;
               return <rect key={i} x={x + 2} y={y} width={barWidth - 4} height={barHeight} fill="#10b981" rx="2" opacity="0.8" />;
             })}
          </svg>
        </div>
      </div>
    </div>
  );
};
