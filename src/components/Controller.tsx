import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
  Loader2,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import type { SolverMode } from '../core/cube/types';

interface ControllerProps {
  isBusy: boolean;
  isPlaying: boolean;
  hasSolution: boolean;
  currentStepIndex: number;
  totalSteps: number;
  speed: number;
  solverMode: SolverMode;
  onSolve: () => void;
  onPlayPause: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onResetPlayback: () => void;
  onSpeedChange: (speed: number) => void;
  onManualMove: (move: string) => void;
}

export const Controller: React.FC<ControllerProps> = ({
  isBusy,
  isPlaying,
  hasSolution,
  currentStepIndex,
  totalSteps,
  speed,
  solverMode,
  onSolve,
  onPlayPause,
  onPrevStep,
  onNextStep,
  onResetPlayback,
  onSpeedChange,
  onManualMove,
}) => {
  const speeds = [0.5, 1.0, 1.5, 2.0];
  const manualFaces = [
    { label: 'U (顶)', face: 'U', color: 'border-slate-300 text-slate-100' },
    { label: 'D (底)', face: 'D', color: 'border-yellow-500/60 text-yellow-300' },
    { label: 'L (左)', face: 'L', color: 'border-orange-500/60 text-orange-300' },
    { label: 'R (右)', face: 'R', color: 'border-red-500/60 text-red-300' },
    { label: 'F (前)', face: 'F', color: 'border-green-500/60 text-green-300' },
    { label: 'B (后)', face: 'B', color: 'border-blue-500/60 text-blue-300' },
  ];

  return (
    <div className="flex flex-col gap-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 md:p-5 backdrop-blur-sm">
      {/* Controller Header with Speed Selector */}
      <div className="flex items-center justify-between pb-0.5">
        <span className="text-xs font-semibold text-slate-300">
          控制面板
        </span>
        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 p-0.5 rounded-lg">
          <span className="text-[11px] text-slate-400 px-1.5 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-slate-400" />
            演示速度
          </span>
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-1.5 py-0.5 text-xs font-mono font-medium rounded transition-all ${
                speed === s
                  ? solverMode === 'optimal'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Primary Solve Button (Aligned with Navbar Mode Style) */}
      <button
        onClick={() => onSolve()}
        disabled={isBusy}
        className={`w-full py-3 px-5 rounded-xl text-white font-medium text-sm md:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
          solverMode === 'optimal'
            ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-indigo-500/20'
            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/20'
        }`}
      >
        {isBusy ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>正在计算还原方案...</span>
          </>
        ) : (
          <>
            {solverMode === 'optimal' ? (
              <Sparkles className="w-4 h-4 text-white" />
            ) : (
              <GraduationCap className="w-4 h-4 text-white" />
            )}
            <span className="font-semibold tracking-wide">
              {solverMode === 'optimal'
                ? '计算最优步数还原 (Kociemba)'
                : '生成 CFOP 教学分解步骤'}
            </span>
          </>
        )}
      </button>

      {/* Step Playback Bar (When Solution Exists) */}
      {hasSolution && (
        <div className="flex flex-col gap-2 p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>还原播放进度</span>
            <span
              className={`font-mono font-semibold ${
                solverMode === 'optimal' ? 'text-indigo-400' : 'text-emerald-400'
              }`}
            >
              第 {currentStepIndex} / {totalSteps} 步
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                solverMode === 'optimal'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600'
              }`}
              style={{
                width: `${totalSteps > 0 ? (currentStepIndex / totalSteps) * 100 : 0}%`,
              }}
            />
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={onResetPlayback}
              disabled={isBusy || currentStepIndex === 0}
              title="回到第一步"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onPrevStep}
              disabled={isBusy || currentStepIndex === 0}
              title="上一步"
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 transition-all"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onPlayPause}
              disabled={isBusy || currentStepIndex >= totalSteps}
              title={isPlaying ? '暂停' : '自动播放'}
              className={`p-3 rounded-xl text-white shadow-md transition-all active:scale-95 disabled:opacity-40 ${
                solverMode === 'optimal'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-indigo-500/25'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white pl-0.5" />
              )}
            </button>

            <button
              onClick={onNextStep}
              disabled={isBusy || currentStepIndex >= totalSteps}
              title="下一步"
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 transition-all"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Manual Turn Buttons */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-slate-400">
          手动转动控制（支持键盘 U, D, L, R, F, B，按住 Shift 为逆时针）
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {manualFaces.map(({ label, face, color }) => (
            <div
              key={face}
              className="flex flex-col gap-1 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 items-center"
            >
              <span className={`text-[11px] font-semibold ${color}`}>{label}</span>
              <div className="flex items-center gap-1 w-full">
                <button
                  onClick={() => onManualMove(face)}
                  disabled={isBusy}
                  className="flex-1 py-1 rounded bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-mono font-bold transition-all disabled:opacity-40"
                  title={`${face} 顺时针`}
                >
                  {face}
                </button>
                <button
                  onClick={() => onManualMove(`${face}'`)}
                  disabled={isBusy}
                  className="flex-1 py-1 rounded bg-slate-800/90 hover:bg-slate-700 text-pink-400 text-xs font-mono font-bold transition-all disabled:opacity-40"
                  title={`${face}' 逆时针`}
                >
                  {face}'
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
