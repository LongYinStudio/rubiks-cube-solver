import React from 'react';
import { X, Keyboard, MousePointer, Palette, BookOpen } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 md:p-6 overflow-hidden flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base md:text-lg font-bold text-white">
              魔方转动记号与操作快捷键指南
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Gesture Controls */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
            <MousePointer className="w-4 h-4 text-indigo-400" /> 3D 鼠标 / 触控交互
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-semibold text-white">旋转全局视角：</span>
              <p className="text-slate-400 mt-0.5">
                鼠标左键按住空白处拖动，或者手机单指滑动屏幕。
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-semibold text-white">直接转动魔方面：</span>
              <p className="text-slate-400 mt-0.5">
                按住魔方表面某个色块沿水平或垂直方向拖动，即可旋转对应层。
              </p>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
            <Keyboard className="w-4 h-4" /> 键盘快捷键支持
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {[
              { key: 'U', desc: '顶面顺时针' },
              { key: 'Shift + U', desc: '顶面逆时针' },
              { key: 'D', desc: '底面顺时针' },
              { key: 'Shift + D', desc: '底面逆时针' },
              { key: 'F', desc: '前面顺时针' },
              { key: 'Shift + F', desc: '前面逆时针' },
              { key: 'B', desc: '后面顺时针' },
              { key: 'Shift + B', desc: '后面逆时针' },
              { key: 'L', desc: '左面顺时针' },
              { key: 'Shift + L', desc: '左面逆时针' },
              { key: 'R', desc: '右面顺时针' },
              { key: 'Shift + R', desc: '右面逆时针' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80"
              >
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[11px] font-bold border border-slate-700">
                  {item.key}
                </kbd>
                <span className="text-[11px] text-slate-400">{item.desc}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 mt-1">
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-pink-300 font-mono font-bold border border-slate-700">
              Space 空格
            </kbd>
            <span>暂停 / 继续自动播放</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono font-bold border border-slate-700 ml-auto">
              ← / →
            </kbd>
            <span>上一步 / 下一步</span>
          </div>
        </div>

        {/* Color Picker Brush Shortcuts */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-emerald-400" /> 手动录入模式画笔快捷键
          </h4>
          <p className="text-xs text-slate-400">
            在手动录入弹窗中，可直接按下以下键切换画笔颜色，无需频繁点击调色盘：
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white ring-1 ring-slate-400" />
                白色 (U)
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-mono font-bold border border-slate-700">U / W / 1</kbd>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-yellow-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                黄色 (D)
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-yellow-300 font-mono font-bold border border-slate-700">D / Y / 2</kbd>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                绿色 (F)
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono font-bold border border-slate-700">F / G / 3</kbd>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-blue-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                蓝色 (B)
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 font-mono font-bold border border-slate-700">B / 4</kbd>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-red-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                红色 (R)
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-red-300 font-mono font-bold border border-slate-700">R / 5</kbd>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-orange-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                橙色 (L)
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-orange-300 font-mono font-bold border border-slate-700">L / O / 6</kbd>
            </div>
          </div>
        </div>

        {/* International Standard Notation */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-pink-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-pink-400" /> WCA 国际魔方公式记号约定
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            • 字母 <code className="text-indigo-300">U, D, L, R, F, B</code> 分别代表 顶(Up)、底(Down)、左(Left)、右(Right)、前(Front)、后(Back) 面。<br />
            • 单独字母表示该面<strong>顺时针</strong>旋转 90°；带单引号 <code className="text-pink-300">'</code>（如 R'）表示<strong>逆时针</strong>旋转 90°；带 <code className="text-amber-300">2</code>（如 U2）表示旋转 180°。
          </p>
        </div>
      </div>
    </div>
  );
};
