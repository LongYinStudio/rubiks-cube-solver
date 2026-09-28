import React, { useRef, useEffect } from 'react';
import type { MoveStep, SolverMode } from '../core/cube/types';
import type { CfopStageResult } from '../core/solver/cfop';
import { Layers, ChevronRight, Check } from 'lucide-react';

interface StepViewerProps {
  steps: MoveStep[];
  currentStepIndex: number;
  mode: SolverMode;
  cfopStages?: CfopStageResult[];
  onSelectStep?: (index: number) => void;
}

export const StepViewer: React.FC<StepViewerProps> = ({
  steps,
  currentStepIndex,
  mode,
  cfopStages,
}) => {
  const activeStepRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active step into view smoothly
  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentStepIndex]);

  if (steps.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 text-center text-slate-400">
        <Layers className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-60" />
        <p className="text-sm font-medium">暂无还原步骤</p>
        <p className="text-xs text-slate-500 mt-1">
          点击上方的“计算还原步骤”或手动打乱魔方后开始求解
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 md:p-5 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm md:text-base font-semibold text-slate-200">
            {mode === 'optimal'
              ? `最优求解方案 (共 ${steps.length} 步)`
              : `CFOP 教学步骤序列 (共 ${steps.length} 步)`}
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          进度: {currentStepIndex}/{steps.length}
        </span>
      </div>

      {/* CFOP Stage Cards if in CFOP mode */}
      {mode === 'cfop' && cfopStages && cfopStages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {cfopStages.map((stage) => {
            const stageStepCount = stage.steps.length;
            return (
              <div
                key={stage.stage}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-300">
                    {stage.stageName.split('：')[0]}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {stageStepCount} 步
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {stage.stageDescription}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Horizontal Steps Scroll Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex - 1;
          const isPast = index < currentStepIndex - 1;

          return (
            <div
              key={index}
              ref={isActive ? activeStepRef : null}
              className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[68px] px-3 py-2 rounded-xl border transition-all ${
                isActive
                  ? 'bg-gradient-to-b from-indigo-600/90 to-purple-600/90 border-indigo-400 text-white shadow-lg shadow-indigo-500/25 scale-105'
                  : isPast
                  ? 'bg-slate-950/60 border-slate-800 text-slate-400 opacity-70'
                  : 'bg-slate-950/80 border-slate-800/90 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono opacity-60">#{index + 1}</span>
                {isPast && <Check className="w-3 h-3 text-emerald-400" />}
              </div>
              <span className="text-base font-bold font-mono tracking-wider mt-0.5">
                {step.notation}
              </span>
              <span className="text-[10px] truncate max-w-[60px] opacity-75 mt-0.5">
                {step.stage || 'step'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Step Detailed Tooltip / Banner */}
      {currentStepIndex > 0 && currentStepIndex <= steps.length && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-mono font-bold text-white text-base shadow-sm">
            {steps[currentStepIndex - 1].notation}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-300">
                当前步骤 #{currentStepIndex}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-300">
                {steps[currentStepIndex - 1].stage?.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {steps[currentStepIndex - 1].description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
