import React from 'react';
import type { SolverMode } from '../core/cube/types';
import {
  Sparkles,
  GraduationCap,
  Shuffle,
  RotateCcw,
  Palette,
  HelpCircle,
} from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  mode: SolverMode;
  onModeChange: (mode: SolverMode) => void;
  onScramble: () => void;
  onReset: () => void;
  onOpenColorPicker: () => void;
  onOpenHelp: () => void;
  isBusy: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onModeChange,
  onScramble,
  onReset,
  onOpenColorPicker,
  onOpenHelp,
  isBusy,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Logo size={42} className="hover:scale-105 transition-transform" />
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Rubik's Cube Solver
            </h1>
            <p className="text-xs text-slate-400">三阶魔方 3D 智能还原与教学系统</p>
          </div>
        </div>

        {/* Solver Mode Segment */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onModeChange('optimal')}
            disabled={isBusy}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
              mode === 'optimal'
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>最优步数解法 (Kociemba)</span>
          </button>
          <button
            onClick={() => onModeChange('cfop')}
            disabled={isBusy}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all ${
              mode === 'cfop'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>CFOP 人类教学法</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenColorPicker}
            disabled={isBusy}
            title="手动涂色录入魔方状态"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs md:text-sm font-medium transition-all disabled:opacity-50"
          >
            <Palette className="w-4 h-4 text-pink-400" />
            <span>手动录入</span>
          </button>

          <button
            onClick={onScramble}
            disabled={isBusy}
            title="随机打乱魔方"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs md:text-sm font-medium transition-all disabled:opacity-50"
          >
            <Shuffle className="w-4 h-4 text-amber-400" />
            <span>随机打乱</span>
          </button>

          <button
            onClick={onReset}
            disabled={isBusy}
            title="复原到已解决状态"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs md:text-sm font-medium transition-all disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>复原</span>
          </button>

          <button
            onClick={onOpenHelp}
            title="查看操作帮助与转动记号"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <a
            href="https://github.com/LongYinStudio/rubiks-cube-solver"
            target="_blank"
            rel="noreferrer"
            title="GitHub 仓库"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
